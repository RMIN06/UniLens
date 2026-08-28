import { NextResponse } from "next/server";
import { Experience } from "@/lib/db/models/experience";
import { connectMongoose } from "@/lib/db/mongoose";

export async function GET() {
  try {
    await connectMongoose();
    const count = await Experience.countDocuments({});
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: "Failed to fetch count" }, { status: 500 });
  }
}