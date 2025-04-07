import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Content } from '@/models/Content';
import { connectDB } from '@/lib/db';

async function generateHash(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const content = await Content.findById(params.id).select('versions currentVersion');
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json(content);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content: newContent, seo, changelog } = await req.json();
    const existingContent = await Content.findById(params.id);

    if (!existingContent) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    const hash = await generateHash(JSON.stringify(newContent));
    interface Version {
      version: number;
      hash: string;
    }

    const currentVersion = existingContent.versions.find(
      (v: Version) => v.version === existingContent.currentVersion
    );

    if (currentVersion?.hash === hash) {
      return NextResponse.json({ error: 'No changes detected' }, { status: 400 });
    }

    const newVersion = {
      version: existingContent.currentVersion + 1,
      content: newContent,
      seo,
      author: {
        email: session.user.email,
        firstName: session.user.name?.split(' ')[0] || '',
        lastName: session.user.name?.split(' ')[1] || ''
      },
      timestamp: new Date(),
      changelog,
      hash,
      diffs: []
    };

    await Content.findByIdAndUpdate(params.id, {
      $push: { versions: newVersion },
      $set: {
        currentVersion: newVersion.version,
        content: newContent,
        seo
      }
    });

    return NextResponse.json(newVersion, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}