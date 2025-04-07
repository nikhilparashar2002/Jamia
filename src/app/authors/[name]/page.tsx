import { Content } from "@/models/Content";
import { User } from "@/models/User";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from 'next/navigation';
import mongoose from "mongoose";
import { Card, CardBody, Divider, Chip } from "@nextui-org/react";
import { RiTwitterXLine, RiFacebookFill, RiLinkedinFill, RiInstagramLine } from '@/components/icons';
import BlogList from '@/components/BlogList';
import VideoConsultForm from "@/components/VideoConsultForm";
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import BackToAuthorsButton from '@/components/BackToAuthorsButton';

interface ArticlePreview {
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
  articles: ArticlePreview[];
  articlesCount: number;
}

// Update ContentDocument interface to match Mongoose document structure
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

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
  const { author } = await getAuthorByNameSlug(params.name);
  
  if (!author) {
    return {
      title: 'Author Not Found',
      description: 'The requested author profile could not be found.'
    };
  }
  
  return {
    title: `${author.firstName} ${author.lastName} - Author Profile | Education iConnect`,
    description: author.description || `Articles and profile of ${author.firstName} ${author.lastName}, ${author.designation || 'Content Writer'} at Education iConnect.`,
    openGraph: {
      title: `${author.firstName} ${author.lastName} - Author Profile`,
      description: author.description || `Read articles by ${author.firstName} ${author.lastName}`,
      images: author.profileImage ? [{ url: author.profileImage, width: 600, height: 600, alt: `${author.firstName} ${author.lastName}` }] : [],
    }
  };
}

// Helper function to get author by name slug
async function getAuthorByNameSlug(nameSlug: string) {
  await mongoose.connect(process.env.MONGODB_URI!);
  
  if (!nameSlug) {
    console.error("No nameSlug provided");
    return { author: null, articles: [] };
  }

  // Split the name slug and decode URI components
  const nameParts = decodeURIComponent(nameSlug).split('-');
  
  if (nameParts.length < 2) {
    console.error("Invalid nameSlug format");
    return { author: null, articles: [] };
  }

  // Find the author
  const author = await User.findOne({
    role: "writer",
    permit: "Allowed",
    firstName: new RegExp(nameParts[0], 'i'),
    lastName: new RegExp(nameParts[1], 'i')
  }).lean();

  if (!author) {
    console.error("Author not found");
    return { author: null, articles: [] };
  }


  // Get author's articles with proper typing - Updated query
  const articles = await Content.find({
    'author.email': author.email, // Match by author's email
    status: "published",
    isDeleted: false
  })
  .select('title description slug headerImage createdAt readingTime')
  .sort({ createdAt: -1 })
  .lean<ContentDocument[]>();

 

  // Transform the data with proper typing
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

  return { 
    author: typedAuthor,
    articles: typedAuthor.articles 
  };
}

export default async function AuthorPage({ params }: { params: { name: string } }) {
  const { author } = await getAuthorByNameSlug(params.name);
  
  if (!author) {
    return notFound();
  }

  const blogPosts = author.articles.map(article => ({
    _id: article._id,
    title: article.title,
    description: article.description,
    headerImage: article.headerImage,
    updatedAt: article.createdAt,
    readingTime: article.readingTime,
    slug: article.slug,
    author: {
      firstName: author.firstName,
      lastName: author.lastName
    }
  }));
  
  const isValidUrl = (url?: string) => url && url.trim() !== '';
  
  return (
    <div className="bg-gray-50 pb-16">
      {/* Hero Section */}
      <div className="text-center mb-12 bg-[#a2781d] p-20">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-6xl mx-auto">
          <Image
            src={author.profileImage || "/default-avatar.png"}
            alt={`${author.firstName} ${author.lastName}`}
            width={180}
            height={180}
            className="rounded-full object-cover shadow-lg border-4 border-white"
            priority
          />
          <div className="text-left">
            <h1 className="text-4xl font-bold text-white mb-2">
              {author.firstName} {author.lastName}
            </h1>
            <p className="text-yellow-300 text-xl mb-4">{author.designation}</p>
            <p className="text-gray-100 max-w-2xl">{author.description}</p>
            
            {/* Updated Social Media Links */}
            <div className="flex gap-3 mt-6">
              {isValidUrl(author.socials?.twitter) && (
                <a 
                  href={author.socials?.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 rounded-full hover:bg-blue-50 transition-colors text-[#1DA1F2] hover:text-blue-600"
                >
                  <RiTwitterXLine size={20} />
                </a>
              )}
              
              {isValidUrl(author.socials?.linkedin) && (
                <a 
                  href={author.socials?.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 rounded-full hover:bg-blue-50 transition-colors text-[#0A66C2] hover:text-blue-700"
                >
                  <RiLinkedinFill size={20} />
                </a>
              )}
              
              {isValidUrl(author.socials?.facebook) && (
                <a 
                  href={author.socials?.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 rounded-full hover:bg-blue-50 transition-colors text-[#1877F2] hover:text-blue-700"
                >
                  <RiFacebookFill size={20} />
                </a>
              )}
              
              {isValidUrl(author.socials?.instagram) && (
                <a 
                  href={author.socials?.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 rounded-full hover:bg-pink-50 transition-colors text-[#E4405F] hover:text-pink-600"
                >
                  <RiInstagramLine size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section - Added Suspense boundary */}
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 justify-center">
          <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-lg"></div>}>
            <BlogList 
              posts={blogPosts}
              currentPage={1}
              totalPages={1}
            />
          </Suspense>
          
          <div className="lg:w-[30%]">
            <div className="sticky top-4 mt-4 mx-auto" style={{ maxWidth: "330px" }}>
              <Card className="mb-4 p-4">
                <div className="text-center">
                  <Chip color="primary" variant="flat" size="lg" className="mb-2">
                    {author.articlesCount} Articles Published
                  </Chip>
                  <BackToAuthorsButton />
                </div>
              </Card>
              <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-lg"></div>}>
                <VideoConsultForm />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
