import { Metadata } from "next";
import { Suspense, lazy } from 'react';
import BlogList from "@/components/BlogList";
import VideoConsultForm from "@/components/VideoConsultForm";
import { headers } from 'next/headers';
import BlogHead from "../../blog/head";
import BlogSearch from "@/components/blogSearch";
import Breadcrumb from "@/components/Breadcrumb";
import { notFound } from "next/navigation";
import { capitalizeWords } from "@/lib/utils";
import Link from "next/link";
import EmptyStateCategory from '@/components/EmptyStateCategory';
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 hour
export const fetchCache = 'force-no-store';

export async function generateMetadata({ params }: { params: { category: string }}): Promise<Metadata> {
  const categoryName = params.category.replace(/-/g, ' ');
  const categoryTitle = capitalizeWords(categoryName);
  
  return {
    title: `${categoryTitle} - Blog Articles | Track Admission`,
    description: `Find the latest blogs and articles in the ${categoryTitle} category. Get the information you need about ${categoryTitle} at TrackAdmission.`,
    openGraph: {
      title: `${categoryTitle} - Blog Articles | Track Admission`,
      description: `Browse our collection of articles about ${categoryTitle}. Learn more about ${categoryTitle} at TrackAdmission.`,
    }
  };
}

export default async function CategoryPage({ 
  params, 
  searchParams 
}: { 
  params: { category: string }, 
  searchParams: { page?: string } 
}) {
  const { category } = params;
  const currentPage = Number(searchParams.page) || 1;
  const headersList = headers();
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const host = headersList.get('host') || 'localhost:3000';

  // Format category for display (replace dashes with spaces and capitalize)
  const categoryName = category.replace(/-/g, ' ');
  const displayCategory = capitalizeWords(categoryName);

  try {
    const response = await fetch(
      `${protocol}://${host}/api/seo/content/category?page=${currentPage}&limit=6&category=${encodeURIComponent(category)}`,
      {
        cache: 'no-store', // Disable caching to ensure fresh data
        next: {
          tags: [`category-${category}`], // Add tag for revalidation
          revalidate: 0 // Disable caching
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();

    // If no content found for this category, show custom empty state instead of notFound()
    const isEmpty = !data.contents || data.contents.length === 0;

    return (
      <>
        <BlogHead />
        <div className="min-h-screen overflow-x-hidden bg-gray-50 pb-16">
          {/* Hero Section with Category Title */}
          <section className="relative w-full min-h-[300px] md:h-[400px] overflow-hidden mb-24"> {/* Increased bottom margin */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-purple-800 to-blue-900">
              <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 40%)'}}></div>
              <div className="absolute inset-0 opacity-20">
                <div className="absolute transform rotate-45 -left-1/4 -top-1/4 w-1/2 h-1/2 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 blur-3xl"></div>
                <div className="absolute transform -rotate-45 -right-1/4 -bottom-1/4 w-1/2 h-1/2 bg-gradient-to-l from-blue-400/30 to-purple-500/30 blur-3xl"></div>
              </div>
              <div className="absolute inset-0">
                <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
            </div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 md:p-8 z-[5]"> {/* Lower z-index */}
              <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-center">
                  {displayCategory}
                  <span className="block mt-2 text-yellow-400">Articles</span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl mt-4 text-center mx-auto max-w-2xl">
                  {isEmpty 
                    ? `Currently no articles available in ${displayCategory.toLowerCase()}`
                    : `Browse our latest articles about ${displayCategory.toLowerCase()}`
                  }
                </p>
              </div>
            </div>
          </section>

          {/* Search Section - Updated positioning */}
          <div className="relative -mt-40 z-[15]"> {/* Higher z-index and adjusted margin */}
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <BlogSearch />
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 max-w-7xl mt-12"> {/* Added top margin */}
            {/* Breadcrumbs with category */}
            <Breadcrumb 
              items={[
                { label: 'Home', href: '/' },
                { label: 'Blog', href: '/blog' },
                { label: displayCategory }
              ]} 
            />
            
            {/* Main content with BlogList */}
            <div className="flex flex-col lg:flex-row gap-8 justify-center">
              {isEmpty ? (
                <EmptyStateCategory displayCategory={displayCategory} />
              ) : (
                <BlogList 
                  posts={data.contents} 
                  currentPage={currentPage}
                  totalPages={data.pagination.pages}
                />
              )}
              
              {/* Sidebar */}
              <div className="lg:w-[30%]">
                <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-lg"></div>}>
                  <LazyTrendingBlogs />
                </Suspense>
                <div className="sticky top-4 mt-4 mx-auto" style={{ maxWidth: "330px" }}>
                  <VideoConsultForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error fetching category posts:', error);
    return notFound();
  }
}

const LazyTrendingBlogs = lazy(() => import("@/components/TrendingBlogs"));