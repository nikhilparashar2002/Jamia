import { Content } from "@/models/Content";
import { User } from "@/models/User";
import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import mongoose from "mongoose";
import { RiTwitterXLine, RiFacebookFill, RiLinkedinFill, RiInstagramLine } from '@/components/icons';

export const revalidate = 60

export const dynamic = 'auto'
export const fetchCache = 'force-no-store'

// Define author interface
interface Author {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  designation?: string;
  description?: string;
  profileImage?: string;
  contentCount: number;
  socials?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
  };
  nameSlug: string;
}

export const metadata = {
  title: 'Our Authors | Education iConnect',
  description: 'Meet our expert authors and content creators'
};

async function getAuthors() {
  await mongoose.connect(process.env.MONGODB_URI!);
  
  // First get all writers/authors
  const authors = await User.find({ 
    role: "writer",
    permit: "Allowed"
  }).select("_id firstName lastName email designation description profileImage socials").lean();
  
  // Get content counts
  const contentCounts = await Content.aggregate([
    { $match: { status: "published", isDeleted: false } },
    { $group: {
      _id: "$author",
      contentCount: { $sum: 1 }
    }}
  ]);
  
  
  
  // Create a map of email to content count
  const countMap = new Map();
  contentCounts.forEach(item => {
    if (item._id && typeof item._id === 'object' && item._id.email) {
      countMap.set(item._id.email, item.contentCount);
    }
  });
  
  // Map authors with their content counts using the map
  return authors.map(author => {
    // Create name slug properly
    const nameSlug = `${author.firstName}-${author.lastName}`.toLowerCase().replace(/\s+/g, '-');
    
    return {
      _id: author._id.toString(),
      firstName: author.firstName,
      lastName: author.lastName,
      email: author.email,
      designation: author.designation || 'Content Writer',
      description: author.description || 'Contributing author at EducationiConnect.',
      profileImage: author.profileImage,
      socials: author.socials || {}, // Include socials in returned data
      contentCount: countMap.get(author.email) || 0,
      nameSlug: nameSlug // Use properly formatted slug
    };
  });
}

export default async function AuthorsPage() {
  const authors = await getAuthors();
  

  // Helper function to check if a URL is valid and has content
  const isValidUrl = (url?: string) => url && url.trim() !== '';

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#a2781d] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-yellow-300">
            Our Expert Authors
          </h1>
          <p className="text-gray-100 text-center mb-6 max-w-2xl mx-auto text-lg">
            Meet the talented writers and subject matter experts who create our educational content
          </p>
          <div className="w-20 h-1 bg-yellow-400 mx-auto rounded-full"></div>
        </div>
      </div>
      
      {/* Authors Grid */}
      <div className="container mx-auto px-4 py-12 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {authors.length === 0 ? (
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-500 text-xl">No authors found</p>
            </div>
          ) : (
            authors.map((author: Author) => (
              <Card 
                key={author._id} 
                className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm"
              >
                <CardHeader className="flex gap-4 items-center p-6 border-b">
                  <div className="relative w-16 h-16">
                    <Image
                      src={author.profileImage || "/default-avatar.png"}
                      alt={`${author.firstName} ${author.lastName}`}
                      fill
                      className="rounded-full object-cover border-2 border-yellow-400"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {author.firstName} {author.lastName}
                    </h2>
                    <p className="text-[#a2781d] font-medium">{author.designation}</p>
                  </div>
                </CardHeader>
                
                <CardBody className="p-6">
                  <p className="text-gray-600 mb-6 line-clamp-3 min-h-[4.5rem]">
                    {author.description}
                  </p>
                  
                  <div className="flex flex-col gap-4">
                    {/* Social Media Icons */}
                    <div className="flex gap-3 justify-center">
                      {isValidUrl(author.socials?.twitter) && (
                        <a 
                          href={author.socials?.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label={`${author.firstName}'s Twitter`}
                          className="p-2 bg-gray-100 rounded-full hover:bg-blue-50 transition-colors text-[#1DA1F2] hover:text-blue-600"
                        >
                          <RiTwitterXLine size={18} />
                        </a>
                      )}
                      {isValidUrl(author.socials?.linkedin) && (
                        <a 
                          href={author.socials?.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label={`${author.firstName}'s LinkedIn`}
                          className="p-2 bg-gray-100 rounded-full hover:bg-blue-50 transition-colors text-[#0A66C2] hover:text-blue-700"
                        >
                          <RiLinkedinFill size={18} />
                        </a>
                      )}
                      {isValidUrl(author.socials?.facebook) && (
                        <a 
                          href={author.socials?.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label={`${author.firstName}'s Facebook`}
                          className="p-2 bg-gray-100 rounded-full hover:bg-blue-50 transition-colors text-[#1877F2] hover:text-blue-700"
                        >
                          <RiFacebookFill size={18} />
                        </a>
                      )}
                      {isValidUrl(author.socials?.instagram) && (
                        <a 
                          href={author.socials?.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label={`${author.firstName}'s Instagram`}
                          className="p-2 bg-gray-100 rounded-full hover:bg-pink-50 transition-colors text-[#E4405F] hover:text-pink-600"
                        >
                          <RiInstagramLine size={18} />
                        </a>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-sm bg-yellow-100 text-[#a2781d] px-3 py-1 rounded-full font-medium">
                        {author.contentCount} article{author.contentCount !== 1 ? 's' : ''}
                      </span>
                      <Link 
                        href={`/authors/${author.nameSlug}`}
                        className="inline-flex items-center gap-2 text-[#a2781d] hover:text-yellow-600 font-medium transition-colors"
                      >
                        View Profile
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 5l7 7-7 7" 
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
