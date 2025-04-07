import { redirect } from 'next/navigation';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import connectDB from "@/lib/db";
import { Content } from "@/models/Content";
import { v2 as cloudinary } from "cloudinary";
import { table } from "console";
import { revalidateTag } from 'next/cache';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: Request) {
  try {
    // // Check if user is authenticated
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const sortField = searchParams.get("sortField") || "updatedAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Connect to database
    await connectDB();

    // Build query with only isDeleted filter initially
    const query: any = {
      isDeleted: { $ne: true },
    };

    // Only add status filter if a specific status is requested
    if (status && status !== "all") {
      query.status = status;
    }

    // Add search filter if search query exists
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { "seo.focusKeywords": { $regex: search, $options: "i" } },
      ];
    }

    // Get paginated results with compound sorting
    const skip = (page - 1) * limit;
    const contents = await Content.find(query)
      .sort({
        [sortField]: sortOrder === "asc" ? 1 : -1,
        createdAt: -1, // Always sort by creation date as secondary criteria
      })
      .skip(skip)
      .limit(limit)
      .lean();
    

    // Get total count for pagination
    const total = await Content.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      contents,
      pagination: {
        total,
        pages,
        current: page,
        limit,
        hasNextPage: page < pages,
        hasPrevPage: page > 1
      },
    });
  } catch (error) {
    console.error("Error fetching contents:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Helper function to extract text content for analysis while preserving HTML
const extractTextContent = (content: string): string => {
  return content.replace(/<[^>]*>/g, " ").trim();
};

export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      console.error("Authentication failed");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Parse and validate request body
    const { data } = await request.json();
    console.log("keywordslllll = ", data);

    console.log("Received data:", JSON.stringify(data, null, 2));

    if (!data) {
      console.error("Invalid request: No data provided");
      return new NextResponse("Invalid request data", { status: 400 });
    }

    // Validate required fields
    if (!data.slug) {
      console.error("Invalid slug: Slug is undefined");
      return new NextResponse("Slug is required", { status: 400 });
    }

    if (!/^[a-z0-9-]+$/.test(data.slug)) {
      console.error("Invalid slug format:", data.slug);
      return new NextResponse(
        "Invalid slug format (must contain only lowercase letters, numbers, and hyphens)",
        { status: 400 }
      );
    }

    // Validate content
    if (
      !data.content ||
      typeof data.content !== "string" ||
      data.content.trim().length === 0
    ) {
      console.error("Invalid content:", typeof data.content);
      return new NextResponse("Content is required", { status: 400 });
    }

    // Validate SEO fields
    if (!data.seo || typeof data.seo !== "object") {
      console.error("Invalid SEO data:", data.seo);
      return new NextResponse("SEO data is required", { status: 400 });
    }

    const { seo } = data;
    if (seo.title.length > 60) {
      console.error("Invalid SEO title:", seo.title);
      return new NextResponse(
        "SEO title is required and must not exceed 60 characters",
        { status: 400 }
      );
    }

    if (!seo.description || seo.description.length > 160) {
      console.error("Invalid SEO description:", seo.description);
      return new NextResponse(
        "SEO description is required and must not exceed 160 characters",
        { status: 400 }
      );
    }

    // Validate and sanitize focus keywords
    if (!Array.isArray(seo.focusKeywords)) {
      seo.focusKeywords = [];
    } else {
      seo.focusKeywords = seo.focusKeywords
        .filter(
          (keyword: string) =>
            typeof keyword === "string" && keyword.trim().length > 0
        )
        .map((keyword: string) => keyword.trim());
    }

    // Validate author information
    if (
      !data.author ||
      !data.author.email ||
      !data.author.firstName ||
      !data.author.lastName
    ) {
      console.error("Invalid author data:", data.author);
      return new NextResponse(
        "Complete author information (email, firstName, lastName) is required",
        { status: 400 }
      );
    }

    // Validate categories
    if (
      !data.categories ||
      !Array.isArray(data.categories) ||
      data.categories.length === 0
    ) {
      console.error("Invalid categories:", data.categories);
      return new NextResponse("At least one category is required", {
        status: 400,
      });
    }

    // Check for duplicate slug
    const existingContent = await Content.findOne({ slug: data.slug });
    if (existingContent) {
      console.error("Duplicate slug found:", data.slug);
      return new NextResponse("Content with this slug already exists", {
        status: 400,
      });
    }

    // Process media files if any
    const processedMedia = [];
    if (data.media && Array.isArray(data.media)) {
      for (const file of data.media) {
        if (!file.data) continue;

        try {
          const result = await cloudinary.uploader.upload(file.data, {
            resource_type: file.resourceType || "image",
            folder: "trackAdmission",
            quality: "auto",
            fetch_format: "auto",
            secure: true,
          });

          processedMedia.push({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            resourceType: file.resourceType || "image",
            alt: file.alt || "",
            caption: file.caption || "",
            width: result.width,
            height: result.height,
            size: result.bytes,
            createdAt: new Date(),
          });
        } catch (error) {
          console.error("Error uploading to Cloudinary:", error);
          throw new Error("Failed to upload media");
        }
      }
    }

    // Process content and calculate metrics
    const plainText = extractTextContent(data.content);
    const wordCount = plainText
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Structure headerImage data properly
    const headerImageData = data.headerImage
      ? {
          publicId: data.headerImage.public_id,
          url: data.headerImage.secure_url,
          format: data.headerImage.format,
          resourceType: data.headerImage.resource_type || "image",
          width: data.headerImage.width,
          height: data.headerImage.height,
          size: data.headerImage.bytes,
          alt: data.headerImage.alt || "", // Ensure alt is always present
          caption: data.headerImage.caption || "",
        }
      : null;

    // Create new content with properly structured headerImage
    const newContent = await Content.create({
      title: data.title,
      keywords: data.keywords,
      description: data.description,
      slug: data.slug,
      content: data.content,
      plainText,
      wordCount,
      readingTime,
      headerImage: headerImageData,
      seo: {
        title: data.seo.title.trim(),
        description: data.seo.description.trim(),
        focusKeywords: data.seo.focusKeywords || [],
        metaRobots: data.seo.metaRobots || "index,follow",
        canonicalUrl: data.seo.canonicalUrl?.trim() || null,
        ogTitle: data.seo.ogTitle?.trim() || null,
        ogDescription: data.seo.ogDescription?.trim() || null,
        ogImage: data.seo.ogImage || null,
        readabilityScore: data.seo.readabilityScore || 0,
      },
      media: processedMedia,
      status: data.status || "draft",
      author: data.author,
      categories: data.categories,
      tableOfContents: data.tableOfContents || [],
      score: 0,
      seoAnalysis: {
        keywordDensity: 0,
        titleLength: data.seo.title.length,
        descriptionLength: data.seo.description.length,
        contentLength: plainText.length,
        readability: 0,
        hasImages: processedMedia.some((m) => m.resourceType === "image"),
        hasLinks: data.content.includes("href="),
        keywordInTitle:
          data.seo.focusKeywords?.some((k: string) =>
            data.seo.title.toLowerCase().includes(k.toLowerCase())
          ) || false,
        keywordInDescription:
          data.seo.focusKeywords?.some((k: string) =>
            data.seo.description.toLowerCase().includes(k.toLowerCase())
          ) || false,
        keywordInFirstParagraph: false,
        keywordInHeadings: false,
        hasMetaDescription: true,
        hasFocusKeyword: data.seo.focusKeywords?.length > 0 || false,
      },
    });

    // Revalidate blog posts tag
    await revalidateTag('blog-posts');

    // Revalidate each category tag
    if (data.categories && Array.isArray(data.categories)) {
      for (const category of data.categories) {
        // Normalize category name to match URL format
        const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
        await revalidateTag(`category-${normalizedCategory}`);
      }
    }

    return NextResponse.json(newContent);
  } catch (error) {
    console.error("Error creating content:", error);
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}