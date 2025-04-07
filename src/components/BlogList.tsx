"use client";

import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import ReadMoreButton from "@/components/ReadMoreButton"; // Import the client component
import { useRouter } from 'next/navigation';
import { useState } from "react";
import ConsultForm from "@/components/ConsultForm";

interface BlogPost {
  _id: string;
  title: string;
  description: string;
  headerImage?: {
    url: string;
    alt: string;
  };
  updatedAt: string;
  readingTime: number;
  slug: string;
  author?: {
    firstName: string;
    lastName: string;
  };
}

interface BlogListProps {
  posts: BlogPost[];
  currentPage: number;
  totalPages: number;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogList({ posts, currentPage, totalPages }: BlogListProps) {
  const router = useRouter();
  const [isConsultFormOpen, setIsConsultFormOpen] = useState(false);
  
  // Add scroll restoration
  const handlePageClick = (pageNumber: number) => {
    // Save scroll position before navigation
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    }
  };

  // Restore scroll position after navigation
  useEffect(() => {
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition));
      sessionStorage.removeItem('scrollPosition');
    }
  }, []);

  return (
    <div className="lg:w-[70%]">
      <div className="grid gap-8 md:grid-cols-2">
        {posts.map((post) => {
          // Generate author name slug
          const nameSlug = post.author 
            ? `${post.author.firstName}-${post.author.lastName}`.toLowerCase().replace(/\s+/g, '-')
            : '';

          return (
            <Card key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <CardHeader className="p-0">
                {post.headerImage && (
                  <div className="relative w-full h-48">
                    <Image
                      src={post.headerImage.url}
                      alt={post.headerImage.alt || post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </CardHeader>
              <CardBody className="p-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>{formatDate(post.updatedAt)}</span>
                  <span>{post.readingTime} min read</span>
                </div>
                <h2 
                className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2 cursor-pointer hover:text-blue-600"
                onClick={() => router.push(`/${post.slug}`)}
              >
                {post.title}
              </h2>
                {post.author && (
                  <Link 
                    href={`/authors/${nameSlug}`}
                    className="text-sm text-[#c5d659] mb-2 inline-block"
                  >
                    By {post.author.firstName} {post.author.lastName}
                  </Link>
                )}
                <div className="text-gray-600 mb-4 max-h-20 overflow-hidden">
                  <p className="line-clamp-3">{post.description}</p>
                </div>
                {/* Improved button layout */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <ReadMoreButton slug={post.slug} />
                  
                  <button
                    onClick={() => setIsConsultFormOpen(true)}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2.5 px-4 rounded-md font-medium transition-all duration-200 text-center flex items-center justify-center gap-2"
                  >
                    <span>Apply Now</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <Link
                key={pageNumber}
                href={`/blog?page=${pageNumber}`}
                onClick={() => handlePageClick(pageNumber)}
                className={`px-4 py-2 rounded ${
                  currentPage === pageNumber
                    ? 'bg-[#a2781d] text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {pageNumber}
              </Link>
            );
          })}
        </div>
      )}
      <ConsultForm isOpen={isConsultFormOpen} onClose={() => setIsConsultFormOpen(false)} />
    </div>
  );
}
