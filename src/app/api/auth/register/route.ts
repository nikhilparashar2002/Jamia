import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins can create writer accounts.' },
        { status: 403 }
      );
    }

    const { email, password, firstName, lastName } = await req.json();

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
    // Use saltRounds during password hashing or remove if you don’t need hashing:
    // const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new writer
    const newUser = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: 'writer' // Force role to be writer
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return NextResponse.json(
      { message: 'Writer account created successfully', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}