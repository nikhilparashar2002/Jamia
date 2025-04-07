import { NextRequest, NextResponse } from "next/server";
import { Content } from "@/models/Content";
import { withDbConnection } from "@/lib/db";

interface SearchResult {
  _id: string;
  title: string;
  description: string;
  slug: string;
  headerImage?: {
    url: string;
    alt: string;
  };
  updatedAt: Date;
  author: {
    firstName: string;
    lastName: string;
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    return await withDbConnection(async () => {
      // Search published content by title
      const results = await Content.find({
        status: "published",
        isDeleted: false,
        title: { $regex: query, $options: 'i' }
      })
      .select({
        title: 1,
        description: 1,
        slug: 1,
        headerImage: 1,
        updatedAt: 1,
        'author.firstName': 1,
        'author.lastName': 1
      })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean<SearchResult[]>();

      return NextResponse.json({ results });
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
