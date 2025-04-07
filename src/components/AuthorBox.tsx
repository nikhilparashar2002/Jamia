'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { RiTwitterXLine, RiFacebookFill, RiLinkedinFill, RiInstagramLine } from '@/components/icons';

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
  articlesCount: number;
}

interface AuthorBoxProps {
  author: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function AuthorBox({ author }: AuthorBoxProps) {
  const [authorData, setAuthorData] = useState<AuthorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        // Generate the name slug from first and last name
        const nameSlug = `${author.firstName}-${author.lastName}`.toLowerCase().replace(/\s+/g, '-');
        
        // Fetch author data from API
        const response = await fetch(`/api/authors/${nameSlug}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch author data: ${response.status}`);
        }
        
        const data = await response.json();
        setAuthorData(data.author);
      } catch (err: any) {
        console.error('Error fetching author data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (author.firstName && author.lastName) {
      fetchAuthorData();
    }
  }, [author.firstName, author.lastName, author.email]);

  // Loading state
  if (loading) {
    return (
      <div className="mt-12 border-t pt-8 animate-pulse">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !authorData) {
    return (
      <div className="mt-12 border-t pt-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image 
                  src="/default-avatar.png" 
                  alt={`${author.firstName} ${author.lastName}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex-grow text-center sm:text-left">
              <h3 className="text-xl font-semibold text-gray-900">
                {author.firstName} {author.lastName}
              </h3>
              <p className="mt-4">
                <Link 
                  href={`/authors/${author.firstName.toLowerCase()}-${author.lastName.toLowerCase()}`}
                  className="text-sm bg-[#a2781d] text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition-colors"
                >
                  View Profile
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state with full author data
  const isValidUrl = (url?: string) => url && url.trim() !== '';
  const nameSlug = `${authorData.firstName}-${authorData.lastName}`.toLowerCase().replace(/\s+/g, '-');
  const authorProfileLink = `/authors/${nameSlug}`;

  return (
    <div className="mt-12 border-t pt-8">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Author Image */}
          <Link href={authorProfileLink} className="flex-shrink-0">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg hover:scale-105 transition-transform">
              <Image
                src={authorData.profileImage || "/default-avatar.png"}
                alt={`${authorData.firstName} ${authorData.lastName}`}
                fill
                className="object-cover"
              />
            </div>
          </Link>

          {/* Author Info */}
          <div className="flex-grow text-center sm:text-left">
            <Link href={authorProfileLink} className="inline-block">
              <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                {authorData.firstName} {authorData.lastName}
              </h3>
            </Link>
            
            {authorData.designation && (
              <p className="text-[#a2781d] font-medium mt-1">
                {authorData.designation}
              </p>
            )}
            
            {authorData.description && (
              <p className="text-gray-600 mt-2 line-clamp-2">
                {authorData.description}
              </p>
            )}
            
            {/* Social Links */}
            <div className="flex gap-3 mt-4 justify-center sm:justify-start mb-4">
              {isValidUrl(authorData.socials?.twitter) && (
                <a href={authorData.socials?.twitter} target="_blank" rel="noopener noreferrer"
                   className="p-2 bg-gray-100 rounded-full text-[#1DA1F2] hover:bg-blue-50 hover:text-blue-600">
                  <RiTwitterXLine size={18} />
                </a>
              )}
              {isValidUrl(authorData.socials?.linkedin) && (
                <a href={authorData.socials?.linkedin} target="_blank" rel="noopener noreferrer"
                   className="p-2 bg-gray-100 rounded-full text-[#0A66C2] hover:bg-blue-50 hover:text-blue-700">
                  <RiLinkedinFill size={18} />
                </a>
              )}
              {isValidUrl(authorData.socials?.facebook) && (
                <a href={authorData.socials?.facebook} target="_blank" rel="noopener noreferrer"
                   className="p-2 bg-gray-100 rounded-full text-[#1877F2] hover:bg-blue-50 hover:text-blue-600">
                  <RiFacebookFill size={18} />
                </a>
              )}
              {isValidUrl(authorData.socials?.instagram) && (
                <a href={authorData.socials?.instagram} target="_blank" rel="noopener noreferrer"
                   className="p-2 bg-gray-100 rounded-full text-[#E4405F] hover:bg-pink-50 hover:text-pink-600">
                  <RiInstagramLine size={18} />
                </a>
              )}
            </div>
            
            <div className="flex gap-3 justify-center sm:justify-start">
              <Link 
                href={authorProfileLink}
                className="text-sm bg-[#a2781d] text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition-colors"
              >
                View Profile
              </Link>
              <span className="text-sm bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                {authorData.articlesCount || 0} Articles
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
