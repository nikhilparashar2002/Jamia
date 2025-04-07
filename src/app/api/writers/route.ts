import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { User } from '@/models/User';

export async function GET(request: Request) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Get sort parameters from URL
    const url = new URL(request.url);
    const sortField = url.searchParams.get('sortField') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';

    // Build sort object
    let sortObj: any = {};
    if (sortField === 'name') {
      sortObj.firstName = sortOrder === 'asc' ? 1 : -1;
      sortObj.lastName = sortOrder === 'asc' ? 1 : -1;
    } else if (sortField === 'permit') {
      sortObj.permit = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortObj[sortField] = sortOrder === 'asc' ? 1 : -1;
    }

    // Fetch all writers with sorting
    const writers = await User.find(
      { role: 'writer' },
      'email firstName lastName role lastLogin permit'
    ).sort(sortObj);

    return NextResponse.json(writers);
  } catch (error) {
    console.error('Error fetching writers:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}