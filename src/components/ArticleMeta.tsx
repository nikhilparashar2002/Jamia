'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

interface ArticleMetaProps {
  author: {
    firstName: string;
    lastName: string;
  };
  readingTime: number;
  datePublished: string;
}

export default function ArticleMeta({ author, readingTime, datePublished }: ArticleMetaProps) {
  const [authorImage, setAuthorImage] = useState<string | null>(null);
  
  // Fetch author image from API
  useEffect(() => {
    const fetchAuthorImage = async () => {
      try {
        const nameSlug = `${author.firstName}-${author.lastName}`.toLowerCase().replace(/\s+/g, '-');
        const response = await fetch(`/api/authors/${nameSlug}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.author && data.author.profileImage) {
            setAuthorImage(data.author.profileImage);
          }
        }
      } catch (error) {
        console.error("Error fetching author image:", error);
      }
    };
    
    fetchAuthorImage();
  }, [author.firstName, author.lastName]);

  const nameSlug = `${author.firstName}-${author.lastName}`.toLowerCase().replace(/\s+/g, '-');
  const formattedDate = new Date(datePublished).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center text-gray-600 text-sm mb-2">
      <Link 
        href={`/authors/${nameSlug}`}
        className="flex items-center gap-2 hover:text-[#a2781d] transition-colors mb-2 sm:mb-0"
      >
        <div className="relative w-6 h-6 rounded-full overflow-hidden">
          <Image
            src={authorImage || "/default-avatar.png"}
            alt={`${author.firstName} ${author.lastName}`}
            fill
            className="object-cover"
          />
        </div>
        <span>By {author.firstName} {author.lastName}</span>
      </Link>
      
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{readingTime} min read</span>
        </div>
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
