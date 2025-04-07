import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Content } from '@/models/Content';
import { Types } from 'mongoose';
import { revalidateTag } from 'next/cache';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const { id } = params;

  // Validate if id is a valid MongoDB ObjectId
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid content ID format' }, { status: 400 });
  }

  const content = await Content.findById(id);

  if (!content) {
    return NextResponse.json({ message: 'Content not found' }, { status: 404 });
  }

  // Ensure faq field exists even if it's not in the document
  if (!content.faq) {
    content.faq = [];
  }
  
  // Log the faq field for debugging
  console.log('Content GET - faq field:', content.faq);

  return NextResponse.json(content);
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
 
  
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();
    const contentId = params.id;

    // Validate if contentId is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(contentId)) {
      return new NextResponse('Invalid content ID format', { status: 400 });
    }

    const { data } = await request.json();
    
    // Clean up headerImage data if it exists
    if (data.headerImage) {
      // Remove undefined or null properties
      Object.keys(data.headerImage).forEach(key => {
        if (data.headerImage[key] === undefined || data.headerImage[key] === null) {
          delete data.headerImage[key];
        }
      });
    }

    // Log the incoming data for debugging
    console.log('Content update - faq data received:', data.faq);

    // Make sure faq is initialized as an empty array if it's not provided
    if (!data.faq) {
      data.faq = [];
    }

    const updatedContent = await Content.findByIdAndUpdate(
      contentId,
      { $set: data },
      { 
        new: true, 
        runValidators: true,
        // Add this option to prevent validation of undefined fields
        omitUndefined: true 
      }
    );

    if (!updatedContent) {
      return new NextResponse('Content not found', { status: 404 });
    }

    // After content is updated:
    await revalidateTag('blog-posts');
    await revalidateTag(`blog-${data.slug}`);
    
        // Revalidate each category tag
        if (data.categories && Array.isArray(data.categories)) {
          for (const category of data.categories) {
            // Normalize category name to match URL format
            const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
            await revalidateTag(`category-${normalizedCategory}`);
          }
        }
    return NextResponse.json(updatedContent);
  } catch (error: any) {
    console.error('Error updating content:', error);
    // Return more detailed error message
    return NextResponse.json({ 
      message: 'Error updating content', 
      error: error.message || 'Internal Server Error',
      details: error.errors || {} 
    }, { status: 500 });
  }
}
