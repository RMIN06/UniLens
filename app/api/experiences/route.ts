import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { User } from "@/lib/db/models/user";
import { Experience } from "@/lib/db/models/experience";
import { connectMongoose } from "@/lib/db/mongoose";
import { rateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { experienceSchema } from "@/lib/experience-schema";

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
  const authorParam = url.searchParams.get("author");
  const page = Math.max(1, Math.min(50, Number(url.searchParams.get("page")) || 1));
  const limit = mine ? 50 : 12;

  const query: Record<string, unknown> = {};
  if (mine) {
    query.author = session.user.id;
  } else if (authorParam && /^[a-f\d]{24}$/i.test(authorParam)) {
    // Experiences of a specific (anonymous) profile
    query.author = authorParam;
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

  // Fully anonymous — never expose the author's identity, even to themselves in browse view
  const experiences = docs.map((d) => ({
    id: String(d._id),
    displayName: `Anonymous ${d.academicLevel === "graduate" ? "Graduate" : "Undergraduate"}`,
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
    // All experiences are anonymous — always
    anonymous: true,
  });

  return NextResponse.json(
    { message: "Experience published.", id: String(doc._id) },
    { status: 201 }
  );
}
