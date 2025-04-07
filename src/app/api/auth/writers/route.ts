import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/models/User";
import { connectDB } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins can view writer list.' },
        { status: 403 }
      );
    }

    await connectDB();

    // Get all writers, excluding password field
    const writers = await User.find(
      { role: 'writer' },
      { password: 0 }
    ).sort({ createdAt: -1 });

    return NextResponse.json(writers);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}