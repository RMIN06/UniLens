import { z } from "zod";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Experience } from "@/lib/db/models/experience";
import { connectMongoose } from "@/lib/db/mongoose";
import { experienceSchema } from "@/lib/experience-schema";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  await connectMongoose();

  const existing = await Experience.findOne({
    _id: params.id,
    author: session.user.id,
  });
  if (!existing) {
    return NextResponse.json({ error: "Experience not found" }, { status: 404 });
  }

  const data = parsed.data;
  existing.title = data.title;
  existing.overallRating = data.overallRating;
  existing.recommendation = data.recommendation;
  existing.wouldChooseAgain = data.wouldChooseAgain ?? null;
  existing.categoryRatings = data.categoryRatings ?? undefined;
  existing.story = data.story;
  existing.pros = data.pros ?? [];
  existing.cons = data.cons ?? [];
  existing.advice = data.advice ?? "";
  // Outcome stays graduate-only
  if (existing.academicLevel === "graduate" && data.outcome) {
    existing.outcome = data.outcome;
  } else if (existing.academicLevel !== "graduate") {
    existing.outcome = null;
  }
  existing.anonymous = data.anonymous ?? true;
  existing.editedAt = new Date();

  await existing.save();

  return NextResponse.json({ message: "Experience updated." });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongoose();
  const result = await Experience.deleteOne({
    _id: params.id,
    author: session.user.id,
  });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Experience not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Experience deleted." });
}
