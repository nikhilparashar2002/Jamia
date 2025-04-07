import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { User } from '@/models/User';

export async function GET() {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Get total writers count
    const totalWriters = await User.countDocuments({ role: 'writer' });

    // Get active writers count (logged in today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeWriters = await User.countDocuments({
      role: 'writer',
      lastLogin: { $gte: today }
    });

    // Get never logged in count
    const neverLoggedIn = await User.countDocuments({
      role: 'writer',
      lastLogin: null
    });

    // Get inactive writers (logged in before but not today)
    const inactiveWriters = await User.countDocuments({
      role: 'writer',
      lastLogin: { $lt: today, $ne: null }
    });

    return NextResponse.json({
      total: totalWriters,
      active: activeWriters,
      inactive: inactiveWriters,
      never: neverLoggedIn
    });
  } catch (error) {
    console.error('Error fetching writer stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}