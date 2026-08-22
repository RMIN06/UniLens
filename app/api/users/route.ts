import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { User } from "@/lib/db/models/user";
import { connectMongoose } from "@/lib/db/mongoose";
import { rateLimit, getClientIp } from "@/lib/auth/rate-limit";

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Public profile fields only — never expose email, grades, or contact info
const PUBLIC_FIELDS =
  "name image academicLevel university program graduationYear higherStream createdAt" as const;

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`explore:${getClientIp(request)}`, 60, 60 * 1000);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  await connectMongoose();

  const url = new URL(request.url);
  const level = url.searchParams.get("level");
  const q = (url.searchParams.get("q") ?? "").trim().slice(0, 100);
  const university = (url.searchParams.get("university") ?? "").trim().slice(0, 120);
  const program = (url.searchParams.get("program") ?? "").trim().slice(0, 120);
  const page = Math.max(1, Math.min(10, Number(url.searchParams.get("page")) || 1));
  const limit = 24;

  const query: Record<string, unknown> = { onboardingCompleted: true };

  if (level === "undergraduate" || level === "graduate") {
    query.academicLevel = level;
  }
  if (university) query.university = new RegExp(escapeRegex(university), "i");
  if (program) query.program = new RegExp(escapeRegex(program), "i");
  if (q) {
    const rx = new RegExp(escapeRegex(q), "i");
    query.$or = [{ name: rx }, { university: rx }, { program: rx }];
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .select(PUBLIC_FIELDS)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ]);

  return NextResponse.json({
    users: users.map((u) => ({
      id: String(u._id),
      name: u.name,
      image: u.image ?? null,
      academicLevel: u.academicLevel,
      university: u.university,
      program: u.program,
      graduationYear: u.graduationYear,
      higherStream: u.higherStream,
    })),
    total,
    page,
    hasMore: page * limit < total,
  });
}
