import { z } from "zod";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { User } from "@/lib/db/models/user";
import { connectMongoose } from "@/lib/db/mongoose";
import { getStudentRole, extractDomain } from "@/lib/auth/academic-email";
import { rateLimit, getClientIp } from "@/lib/auth/rate-limit";

const BCRYPT_ROUNDS = 12;

const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be at most 80 characters")
    .regex(/^[\p{L}\p{M}\s'.-]+$/u, "Name contains invalid characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .max(254)
    .refine((e) => !/\+.*@/.test(e), "Subaddressed emails are not allowed"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a digit"),
});

// Weak-password denylist (top common passwords / trivial patterns)
const COMMON_PASSWORDS = new Set([
  "password", "password1", "password123", "12345678", "123456789",
  "qwerty123", "iloveyou1", "admin1234", "welcome12", "letmein12",
]);

export async function POST(request: Request) {
  const ip = getClientIp(request);

  // 5 signup attempts per IP per 15 minutes
  const rl = rateLimit(`signup:${ip}`, 5, 15 * 60 * 1000);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Validation failed" },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;

  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    return NextResponse.json(
      { error: "This password is too common. Please choose a stronger one." },
      { status: 400 }
    );
  }

  try {
    await connectMongoose();
    const existing = await User.findOne({ email }).lean();
    if (existing) {
      // Do not reveal whether the email is registered (enumeration defense)
      return NextResponse.json(
        {
          message:
            "If this email is not already in use, the account has been created.",
        },
        { status: 202 }
      );
    }

    const student = getStudentRole(email);
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    await User.create({
      name,
      email,
      hashedPassword,
      providers: ["credentials"],
      role: student.role,
      isStudent: student.isStudent,
      universityDomain: student.universityDomain,
    });

    return NextResponse.json(
      {
        message: "Account created successfully.",
        isStudent: student.isStudent,
        universityDomain: extractDomain(email),
      },
      { status: 201 }
    );
  } catch (err) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: number }).code === 11000
    ) {
      return NextResponse.json(
        {
          message:
            "If this email is not already in use, the account has been created.",
        },
        { status: 202 }
      );
    }
    console.error("[signup]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
