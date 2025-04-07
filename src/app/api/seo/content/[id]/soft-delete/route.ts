import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import {Content} from '@/models/Content';

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Connect to database
    await connectDB();

    // Get the request body and params
    const { isDeleted } = await request.json();
    const { id } = params;

    if (typeof isDeleted !== 'boolean') {
      return NextResponse.json({ message: 'Invalid request: isDeleted must be a boolean' }, { status: 400 });
    }

    // Find and update the content
    const content = await Content.findByIdAndUpdate(
      id,
      { $set: { isDeleted } },
      { new: true, runValidators: true }
    );

    if (!content) {
      return NextResponse.json({ message: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: `Content ${isDeleted ? 'deleted' : 'restored'} successfully`,
      content
    }, { status: 200 });
  } catch (error) {
    console.error('Error in soft-delete route:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}