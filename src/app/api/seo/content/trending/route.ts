import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import connectDB from "@/lib/db";
import { Trending } from "@/models/Trending";
import "@/models/Content"; 

export async function GET() {
  try {
    // Check if user is authenticated
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    // Connect to database
    await connectDB();

    // Get trending blogs with populated content
    const trendingBlogs = await Trending.find()
      .populate("blogId", "title slug headerImage")
      .sort({ position: -1 });

    return NextResponse.json(trendingBlogs);
  } catch (error) {
    console.error("Error fetching trending blogs:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Get blogId and position from request body
    const { blogId, position } = await request.json();

    if (!blogId || position === undefined) {
      return new NextResponse("Blog ID and position are required", {
        status: 400,
      });
    }

    // Validate position is a number between 0 and 3
    if (typeof position !== "number" || position < 0 || position > 3) {
      return new NextResponse("Position must be a number between 0 and 3", {
        status: 400,
      });
    }

    // Connect to database
    await connectDB();

    // Create new trending entry
    const trending = new Trending({ blogId, position });
    await trending.save();

    return NextResponse.json(trending, { status: 201 });
  } catch (error) {
    console.error("Error adding trending blog:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get blogId and trendingId from request body
    const { blogId, trendingId, position } = await request.json();
    if (
      !blogId ||
      !trendingId ||
      position === undefined ||
      position < 0 ||
      position > 3
    ) {
      return new NextResponse(
        "Invalid parameters. Position must be between 0 and 3",
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Update or create the trending entry
    const updatedTrending = await Trending.findByIdAndUpdate(
      trendingId,
      { blogId, position },
      { new: true, runValidators: true, upsert: true }
    ).populate("blogId", "title slug excerpt featuredImage");

    if (!updatedTrending) {
      return new NextResponse("Failed to update trending entry", {
        status: 500,
      });
    }

    return NextResponse.json(updatedTrending);
  } catch (error) {
    console.error("Error updating trending blog:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Check if user is authenticated
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get trendingId from request body
    const { trendingId } = await request.json();
    console.log("trending id is here",trendingId);
    
    if (!trendingId) {
      return new NextResponse("Trending ID is required", { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Delete the trending entry
    const deletedTrending = await Trending.findByIdAndDelete(trendingId);

    if (!deletedTrending) {
      return new NextResponse("Failed to delete trending entry", {
        status: 500,
      });
    }

    return new NextResponse("Trending entry deleted", { status: 200 });
  } catch (error) {
    console.error("Error deleting trending blog:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}