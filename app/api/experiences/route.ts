import { z } from "zod";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { User } from "@/lib/db/models/user";
import { Experience } from "@/lib/db/models/experience";
import { connectMongoose } from "@/lib/db/mongoose";
import { rateLimit, getClientIp } from "@/lib/auth/rate-limit";

const rating = z.number().int().min(1).max(10);

export const experienceSchema = z.object({
  title: z.string().trim().min(10, "Give your experience a short title (10+ characters)").max(120),
  overallRating: rating,
  recommendation: z.enum([
    "highly-recommend",
    "recommend",
    "neutral",
    "not-recommended",
  ]),
  wouldChooseAgain: z.enum(["yes", "maybe", "no"]).nullable().optional(),
  categoryRatings: z
    .object({
      academics: rating.optional(),
      campusLife: rating.optional(),
      facilities: rating.optional(),
      societies: rating.optional(),
    })
    .optional(),
  story: z
    .string()
    .trim()
    .min(150, "Tell us more — at least 150 characters. Detailed reviews help juniors the most.")
    .max(5000),
  pros: z.array(z.string().trim().min(2).max(150)).max(5).optional(),
  cons: z.array(z.string().trim().min(2).max(150)).max(5).optional(),
  advice: z.string().trim().max(1500).optional(),
  outcome: z
    .object({
      status: z.enum([
        "employed",
        "higher-study",
        "entrepreneurship",
        "still-searching",
        "other",
      ]),
      details: z.string().trim().max(800).optional(),
      fieldRelevance: z.enum(["directly", "partially", "not"]),
    })
    .nullable()
    .optional(),
  anonymous: z.boolean().optional(),
});

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`exp-list:${getClientIp(request)}`, 60, 60 * 1000);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  await connectMongoose();

  const url = new URL(request.url);
  const level = url.searchParams.get("level");
  const university = url.searchParams.get("university")?.trim().slice(0, 120);
  const program = url.searchParams.get("program")?.trim().slice(0, 120);
  const sort = url.searchParams.get("sort") ?? "recent";
  const mine = url.searchParams.get("mine") === "true";
  const page = Math.max(1, Math.min(50, Number(url.searchParams.get("page")) || 1));
  const limit = mine ? 50 : 12;

  const query: Record<string, unknown> = {};
  if (mine) {
    query.author = session.user.id;
  } else {
    if (level === "undergraduate" || level === "graduate") query.academicLevel = level;
    if (university) query.university = new RegExp(escapeRegex(university), "i");
    if (program) query.program = new RegExp(escapeRegex(program), "i");
  }

  const sortSpec: Record<string, 1 | -1> =
    sort === "helpful"
      ? { helpfulCount: -1, createdAt: -1 }
      : sort === "rating"
        ? { overallRating: -1, createdAt: -1 }
        : { createdAt: -1 };

  const [docs, total] = await Promise.all([
    Experience.find(query)
      .select("-helpfulVotedBy")
      .sort(sortSpec)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Experience.countDocuments(query),
  ]);

  // Resolve display names while respecting anonymity + privacy (no emails)
  const authorIds = docs.map((d) => d.author);
  const authors = await User.find({ _id: { $in: authorIds } })
    .select("name academicLevel")
    .lean();
  const authorMap = new Map(
    authors.map((a) => [String(a._id), a.name as string])
  );

  const experiences = docs.map((d) => ({
    id: String(d._id),
    displayName: d.anonymous
      ? `Anonymous ${d.academicLevel === "graduate" ? "Graduate" : "Undergraduate"}`
      : maskName(authorMap.get(String(d.author)) ?? "Student"),
    isOwn: String(d.author) === session.user.id,
    academicLevel: d.academicLevel,
    university: d.university,
    program: d.program,
    graduationYear: d.graduationYear,
    title: d.title,
    overallRating: d.overallRating,
    recommendation: d.recommendation,
    wouldChooseAgain: d.wouldChooseAgain,
    categoryRatings: d.categoryRatings ?? null,
    story: d.story,
    pros: d.pros,
    cons: d.cons,
    advice: d.advice,
    outcome: d.outcome ?? null,
    helpfulCount: d.helpfulCount,
    editedAt: d.editedAt,
    createdAt: d.createdAt,
  }));

  return NextResponse.json({
    experiences,
    total,
    page,
    hasMore: page * limit < total,
  });
}

function maskName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1].charAt(0).toUpperCase()}.`;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 5 experiences per hour per user
  const rl = rateLimit(`exp-create:${session.user.id}`, 5, 60 * 60 * 1000);
  if (!rl.success) {
    return NextResponse.json(
      { error: "You are posting too often. Please take a short break." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = experienceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Validation failed" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Graduates only can attach an outcome block; strip it otherwise
  await connectMongoose();
  const user = await User.findById(session.user.id)
    .select("academicLevel university program graduationYear onboardingCompleted")
    .lean();

  if (!user || !user.onboardingCompleted || !user.university || !user.program) {
    return NextResponse.json(
      { error: "Complete your profile before sharing an experience." },
      { status: 400 }
    );
  }

  const doc = await Experience.create({
    ...data,
    outcome:
      user.academicLevel === "graduate" && data.outcome ? data.outcome : null,
    author: session.user.id,
    academicLevel: (user.academicLevel ?? "undergraduate") as
      | "undergraduate"
      | "graduate",
    university: user.university,
    program: user.program,
    graduationYear: user.graduationYear ?? null,
    anonymous: data.anonymous ?? false,
  });

  return NextResponse.json(
    { message: "Experience published.", id: String(doc._id) },
    { status: 201 }
  );
}
