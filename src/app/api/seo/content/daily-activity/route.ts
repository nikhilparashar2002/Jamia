import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import {Content} from '@/models/Content';

export async function GET() {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Get today's start date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Count content items created or updated today
    const count = await Content.countDocuments({
      $or: [
        { createdAt: { $gte: today } },
        { updatedAt: { $gte: today } }
      ],
      isDeleted: { $ne: true }
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching daily activity:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}