import { NextResponse } from "next/server";
import { connectDB } from '@/lib/db';
import { Content } from "@/models/Content";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
   // Connect to database
   await connectDB();
  
   const post = await Content.findOne({
    slug: params.slug,
    status: "published",
    isDeleted: false
  }).lean();

  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}
