import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import connectDB from "@/lib/db";
import { Trending } from "@/models/Trending";

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Await the params
    const params = await Promise.resolve(context.params);
    const { id } = params;

    if (!id) {
      return new NextResponse("ID is required", { status: 400 });
    }

    await connectDB();
    const deletedTrending = await Trending.findByIdAndDelete(id);

    if (!deletedTrending) {
      return new NextResponse("Trending content not found", { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting trending content:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
