import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { User } from "@/models/User";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

/**
 * Get writer profile data by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Check if valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid writer ID" }, { status: 400 });
    }

    // Find the writer by ID
    const writer = await User.findById(params.id)
      .select('firstName lastName profileImage description designation socials createdAt updatedAt role')
      .lean();
    
    if (!writer) {
      return NextResponse.json({ error: "Writer not found" }, { status: 404 });
    }
    
    // Add fullName
    const writerWithFullName = {
      ...writer,
      fullName: `${writer.firstName} ${writer.lastName}`,
    };

    return NextResponse.json({ 
      success: true, 
      writer: writerWithFullName 
    });
    
  } catch (error) {
    console.error("Error fetching writer data:", error);
    return NextResponse.json(
      { error: "Failed to fetch writer data" },
      { status: 500 }
    );
  }
}

/**
 * Update writer profile data
 */


export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid writer ID" }, { status: 400 });
    }

    // Connect to the database
    await dbConnect();
    
    // Find the writer
    const writer = await User.findById(params.id);
    if (!writer) {
      return NextResponse.json({ error: "Writer not found" }, { status: 404 });
    }
    
    // Check if the user is updating their own profile or is an admin
    if (session.user.id !== params.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized to update this writer" }, { status: 403 });
    }

    const requestData = await request.json();
    console.log("Received update data:", requestData);
    
    // Update the document directly with findOneAndUpdate
    const updatedWriter = await User.findOneAndUpdate(
      { _id: params.id },
      {
        firstName: requestData.firstName,
        lastName: requestData.lastName,
        email: requestData.email,
        // Set description and designation even if empty
        description: requestData.description === '' ? '' : requestData.description,
        designation: requestData.designation === '' ? '' : requestData.designation,
        profileImage: requestData.profileImage === '' ? '' : requestData.profileImage,
        // Always set socials object
        socials: {
          twitter: requestData.socials?.twitter || '',
          linkedin: requestData.socials?.linkedin || '',
          facebook: requestData.socials?.facebook || '',
          instagram: requestData.socials?.instagram || ''
        }
      },
      {
        new: true,
        runValidators: true,
        upsert: false
      }
    );

    if (!updatedWriter) {
      return NextResponse.json({ error: "Writer not found" }, { status: 404 });
    }

    console.log("Writer updated successfully:", updatedWriter);
    
    return NextResponse.json({ 
      success: true, 
      message: "Writer profile updated successfully",
      writer: {
        id: updatedWriter._id,
        firstName: updatedWriter.firstName,
        lastName: updatedWriter.lastName,
        fullName: `${updatedWriter.firstName} ${updatedWriter.lastName}`,
        email: updatedWriter.email,
        description: updatedWriter.description || '',
        designation: updatedWriter.designation || '',
        socials: updatedWriter.socials || {
          twitter: '',
          linkedin: '',
          facebook: '',
          instagram: ''
        },
        profileImage: updatedWriter.profileImage || ''
      }
    });
    
  } catch (error) {
    console.error("Error updating writer data:", error);
    return NextResponse.json(
      { error: "Failed to update writer data" },
      { status: 500 }
    );
  }
}
