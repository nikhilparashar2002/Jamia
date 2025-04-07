import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Content } from '@/models/Content';

export async function GET() {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Get total content count
    const totalContent = await Content.countDocuments({ isDeleted: { $ne: true } });

    return NextResponse.json({
      total: totalContent
    });
  } catch (error) {
    console.error('Error fetching content stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}