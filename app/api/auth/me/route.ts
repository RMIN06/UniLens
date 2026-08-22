import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { User } from "@/lib/db/models/user";
import { connectMongoose } from "@/lib/db/mongoose";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  await connectMongoose();
  const user = await User.findById(session.user.id).lean();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
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
      onboardingCompleted: user.onboardingCompleted,
      providers: user.providers ?? [],
      createdAt: user.createdAt,
    },
  });
}
