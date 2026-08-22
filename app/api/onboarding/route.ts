import { z } from "zod";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { User } from "@/lib/db/models/user";
import { connectMongoose } from "@/lib/db/mongoose";
import { rateLimit, getClientIp } from "@/lib/auth/rate-limit";

const CURRENT_YEAR = new Date().getFullYear();

const onboardingSchema = z.object({
  academicLevel: z.enum(["undergraduate", "graduate"]),
  university: z
    .string()
    .trim()
    .min(2, "University name is required")
    .max(120, "University name must be at most 120 characters"),
  program: z
    .string()
    .trim()
    .min(2, "Program/field of study is required")
    .max(120, "Program name must be at most 120 characters"),
  graduationYear: z
    .number()
    .int()
    .min(CURRENT_YEAR - 40, "Graduation year looks too far in the past")
    .max(CURRENT_YEAR + 10, "Graduation year looks too far in the future"),
  secondaryStream: z.enum(["matriculation", "o-level"], {
    message: "Select your secondary school qualification",
  }),
  secondaryGrade: z.string().trim().max(20).optional(),
  higherStream: z.enum(
    [
      "fsc-pre-medical",
      "fsc-pre-engineering",
      "ics",
      "fa",
      "a-level",
      "other",
    ],
    { message: "Select your higher secondary / intermediate stream" }
  ),
  higherGrade: z.string().trim().max(20).optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`onboarding:${getClientIp(request)}`, 10, 60 * 1000);
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

  const parsed = onboardingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Validation failed" },
      { status: 400 }
    );
  }

  await connectMongoose();

  const user = await User.findByIdAndUpdate(
    session.user.id,
    {
      $set: {
        ...parsed.data,
        onboardingCompleted: true,
      },
    },
    { new: true }
  );

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: "Onboarding complete.",
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      isStudent: user.isStudent,
      academicLevel: user.academicLevel,
      university: user.university,
      program: user.program,
      graduationYear: user.graduationYear,
      onboardingCompleted: user.onboardingCompleted,
    },
  });
}
