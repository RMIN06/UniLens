import { z } from "zod";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { User } from "@/lib/db/models/user";
import { connectMongoose } from "@/lib/db/mongoose";
import { rateLimit, getClientIp } from "@/lib/auth/rate-limit";

const CURRENT_YEAR = new Date().getFullYear();

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be at most 80 characters")
    .regex(/^[\p{L}\p{M}\s'.-]+$/u, "Name contains invalid characters"),
  university: z
    .string()
    .trim()
    .min(2, "University name is required")
    .max(120)
    .optional(),
  program: z
    .string()
    .trim()
    .min(2, "Program name is required")
    .max(120)
    .optional(),
  graduationYear: z
    .number()
    .int()
    .min(CURRENT_YEAR - 40)
    .max(CURRENT_YEAR + 10)
    .optional(),
  secondaryStream: z.enum(["matriculation", "o-level"]).optional(),
  secondaryGrade: z.string().trim().max(20).nullable().optional(),
  higherStream: z
    .enum([
      "fsc-pre-medical",
      "fsc-pre-engineering",
      "ics",
      "fa",
      "a-level",
      "other",
    ])
    .optional(),
  higherGrade: z.string().trim().max(20).nullable().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongoose();
  const user = await User.findById(session.user.id).lean();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { hashedPassword, failedLoginAttempts, lockUntil, ...safe } = user;
  return NextResponse.json({ user: safe });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`profile:${getClientIp(request)}`, 20, 60 * 1000);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many attempts. Please slow down." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Validation failed" },
      { status: 400 }
    );
  }

  await connectMongoose();

  const updates: Record<string, unknown> = { name: parsed.data.name };
  for (const key of [
    "university",
    "program",
    "graduationYear",
    "secondaryStream",
    "secondaryGrade",
    "higherStream",
    "higherGrade",
  ] as const) {
    if (parsed.data[key] !== undefined) updates[key] = parsed.data[key];
  }

  const user = await User.findByIdAndUpdate(
    session.user.id,
    { $set: updates },
    { new: true }
  );

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: "Profile updated successfully.",
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      image: user.image ?? null,
      role: user.role,
      isStudent: user.isStudent,
      universityDomain: user.universityDomain,
      academicLevel: user.academicLevel,
      university: user.university,
      program: user.program,
      graduationYear: user.graduationYear,
      providers: user.providers,
      createdAt: user.createdAt,
    },
  });
}
