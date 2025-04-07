import { NextRequest, NextResponse } from "next/server";
import { withDbConnection } from "@/lib/db";
import { Form } from "@/models/Form";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

interface FormData {
  name: string;
  email: string;
  phone: string;
  course: string;
  educationMode?: string;
}


export async function POST(request: NextRequest) {
  try {
    const data: FormData = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.course) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    return await withDbConnection(async () => {
      // Save form submission
      const formSubmission = await Form.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        course: data.course,
        educationMode: data.educationMode || 'N/A',
        status: 'pending',
      });



      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully',
        id: formSubmission._id
      }, { status: 201 });
    });

  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins can create writer accounts.' },
        { status: 403 }
      );
    }

    return await withDbConnection(async () => {
      // Get query parameters
      const url = new URL(request.url);
      const status = url.searchParams.get('status');
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '10');

      // Build query
      const query: any = {};
      if (status) {
        query.status = status;
      }

      // Get total count and forms in parallel for better performance
      const [total, forms] = await Promise.all([
        Form.countDocuments(query),
        Form.find(query)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean()
      ]);

      return NextResponse.json({
        leads: forms,
        pagination: {
          total,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    });

  } catch (error: any) {
    console.error('Error fetching forms:', error);
    return NextResponse.json(
      { message: 'Error fetching forms', error: error.message },
      { status: 500 }
    );
  }
}
