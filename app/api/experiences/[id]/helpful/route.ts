import { NextResponse } from "next/server";
import type { Types } from "mongoose";
import { auth } from "@/auth";
import { Experience } from "@/lib/db/models/experience";
import { connectMongoose } from "@/lib/db/mongoose";
import { rateLimit } from "@/lib/auth/rate-limit";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`helpful:${session.user.id}`, 60, 60 * 1000);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429 }
    );
  }

  await connectMongoose();

  const doc = await Experience.findById(params.id).select(
    "author +helpfulVotedBy helpfulCount"
  );
  if (!doc) {
    return NextResponse.json({ error: "Experience not found" }, { status: 404 });
  }
  if (String(doc.author) === session.user.id) {
    return NextResponse.json(
      { error: "You cannot mark your own experience as helpful." },
      { status: 400 }
    );
  }

  const uid = doc.helpfulVotedBy.findIndex(
    (v) => String(v) === session.user!.id
  );

  let voted: boolean;
  if (uid >= 0) {
    doc.helpfulVotedBy.splice(uid, 1);
    doc.helpfulCount = Math.max(0, doc.helpfulCount - 1);
    voted = false;
  } else {
    doc.helpfulVotedBy.push(session.user.id as unknown as Types.ObjectId);
    doc.helpfulCount += 1;
    voted = true;
  }

  await doc.save();

  return NextResponse.json({ voted, helpfulCount: doc.helpfulCount });
}
