import { Metadata } from "next";
import { Suspense, lazy } from 'react';
import BlogList from "@/components/BlogList";
import VideoConsultForm from "@/components/VideoConsultForm";
import { headers } from 'next/headers';
import BlogHead from "../head";
import BlogSearch from "@/components/blogSearch";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: 'Search Results - Education iConnect',
  description: 'Find the latest blogs and articles based on your search query.'
};

async function SearchPage({ searchParams }: { searchParams: { q?: string, page?: string } }) {
  const currentPage = Number(searchParams.page) || 1;
  const query = searchParams.q || '';
  const headersList = headers();
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const host = headersList.get('host') || 'localhost:3000';

  try {
    const response = await fetch(
      `${protocol}://${host}/api/seo/content?page=${currentPage}&limit=6&status=published&sortField=updatedAt&sortOrder=desc&search=${encodeURIComponent(query)}`,
      {
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();

    return (
      <>
        <BlogHead />
        <div className="bg-gray-50 pb-16">
          <div className="text-center mb-12 bg-[#a2781d] p-20">
            <h1 className="text-4xl font-bold text-yellow-300">Education iConnect</h1>
            <h1 className="text-4xl font-bold mb-4 text-white">Search Results</h1>
            <p className="text-gray-100 max-w-2xl mx-auto mb-8">
              Showing results for "{query}"
            </p>
            <div className="max-w-2xl mx-auto">
              <BlogSearch />
            </div>
          </div>

          <div className="container mx-auto px-4 max-w-7xl">
            <Breadcrumb 
              items={[
                { label: 'Home', href: '/' },
                { label: 'Blog', href: '/blog' },
                { label: 'Search Results' }
              ]} 
            />
            <div className="flex flex-col lg:flex-row gap-8 justify-center">
              <BlogList 
                posts={data.contents} 
                currentPage={currentPage}
                totalPages={data.pagination.pages}
              />
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
    console.error('Error fetching search results:', error);
    return <div>Error loading search results</div>;
  }
}

const LazyTrendingBlogs = lazy(() => import("@/components/TrendingBlogs"));

export default SearchPage;