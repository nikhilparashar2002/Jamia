import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { User } from '@/models/User';
import { Content } from '@/models/Content';
import { withDbConnection } from '@/lib/db';  // Add this import

interface ContentDocument {
  _id: any;
  title?: string;
  description?: string;
  slug?: string;
  headerImage?: {
    url: string;
    alt: string;
  };
  createdAt?: Date;
  readingTime?: number;
  __v?: number;
}

interface AuthorData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  description?: string;
  designation?: string;
  profileImage?: string;
  socials?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
  };
  articles: Array<{
    _id: string;
    title: string;
    description: string;
    slug: string;
    headerImage?: {
      url: string;
      alt: string;
    };
    createdAt: string;
    readingTime: number;
  }>;
  articlesCount: number;
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Add route segment config for caching
    const response = await withDbConnection(async () => {
      const nameSlug = params.slug;
      
      if (!nameSlug) {
        return NextResponse.json({ error: 'No slug provided' }, { status: 400 });
      }
  
      const nameParts = decodeURIComponent(nameSlug).split('-');
  
      if (nameParts.length < 2) {
        return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 });
      }
  
      const author = await User.findOne({
        role: "writer",
        permit: "Allowed",
        firstName: new RegExp(nameParts[0], 'i'),
        lastName: new RegExp(nameParts[1], 'i')
      }).lean();
  
      if (!author) {
        return NextResponse.json({ error: 'Author not found' }, { status: 404 });
      }
  
      const articles = await Content.find({
        'author.email': author.email,
        status: "published",
        isDeleted: false
      })
      .select('title description slug headerImage createdAt readingTime')
      .sort({ createdAt: -1 })
      .lean<ContentDocument[]>();
  
      const typedAuthor: AuthorData = {
        _id: author._id.toString(),
        firstName: author.firstName,
        lastName: author.lastName,
        email: author.email,
        description: author.description || '',
        designation: author.designation || '',
        profileImage: author.profileImage,
        socials: author.socials || {},
        articles: articles.map(article => ({
          _id: article._id?.toString() || '',
          title: article.title || '',
          description: article.description || '',
          slug: article.slug || '',
          headerImage: article.headerImage,
          createdAt: article.createdAt ? article.createdAt.toISOString() : new Date().toISOString(),
          readingTime: article.readingTime || 0
        })),
        articlesCount: articles.length
      };
  
      return NextResponse.json({
        author: typedAuthor,
        articles: typedAuthor.articles
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
        }
      });
    });
    
    return response;
  } catch (error) {
    console.error('Error fetching author:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  } finally {
    // Remove the connection.close() call entirely
  }
}
