import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { User } from '@/models/User';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Get permit status from request body
    const { permit } = await req.json();

    // Validate permit status
    if (!permit || !['Allowed', 'Restricted'].includes(permit)) {
      return new NextResponse('Invalid permit status', { status: 400 });
    }

    // Update writer's permit status
    const writer = await User.findByIdAndUpdate(
      params.id,
      { permit },
      { new: true }
    );

    if (!writer) {
      return new NextResponse('Writer not found', { status: 404 });
    }

    return NextResponse.json(writer);
  } catch (error) {
    console.error('Error updating writer permit:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}