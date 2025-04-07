import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Content } from "@/models/Content";
import { revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");
    const category = searchParams.get("category") || "";
    const sortField = searchParams.get("sortField") || "updatedAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    if (!category) {
      return NextResponse.json({ error: "Category parameter is required" }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Normalize category name for comparison
    const normalizedCategory = category.toLowerCase().replace(/-/g, ' ');

    // Build query with additional status check
    const query = {
      isDeleted: { $ne: true },
      status: "published",
      categories: {
        $elemMatch: {
          $regex: new RegExp(`^${normalizedCategory}$`, 'i')
        }
      }
    };

    // Get paginated results with optimized sorting
    const skip = (page - 1) * limit;
    const [contents, total] = await Promise.all([
      Content.find(query)
        .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .select('title description slug headerImage updatedAt readingTime author categories')
        .lean(),
      Content.countDocuments(query)
    ]);

    const pages = Math.ceil(total / limit);

    // Trigger revalidation
    await revalidateTag(`category-${category}`);

    return NextResponse.json({
      contents,
      pagination: {
        total,
        pages,
        current: page,
        limit,
        hasNextPage: page < pages,
        hasPrevPage: page > 1
      }
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error("Error fetching category contents:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
