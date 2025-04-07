import { Metadata } from "next";
import { Suspense, lazy } from 'react';
import BlogList from "@/components/BlogList";
import VideoConsultForm from "@/components/VideoConsultForm";
import { headers } from 'next/headers';
import BlogHead from "./head";
import BlogSearch from "@/components/blogSearch";
import Breadcrumb from "@/components/Breadcrumb";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Our Blogs and Articles',
  description: 'Stay updated on Education news with our blog!'
};

async function BlogsPage({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = Number(searchParams.page) || 1;
  const headersList = headers();
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const host = headersList.get('host') || 'localhost:3000';

  try {
    // Use caching headers if possible
    const response = await fetch(
      `${protocol}://${host}/api/seo/content?page=${currentPage}&limit=6&status=published&sortField=updatedAt&sortOrder=desc`,
      {
        next: { 
          revalidate: 3600,
          tags: ['blog-posts']
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();

    return (
      <>
        {/* Preconnect to fonts and API */}
        <BlogHead />
        <div className="bg-gray-50 pb-16">
          <div className="text-center mb-12 bg-[#111827] p-20">
            <h1 className="text-4xl font-bold text-yellow-300">After-12th Courses</h1>
            <h1 className="text-4xl font-bold mb-4 text-white">Blogs and Articles</h1>
            <p className="text-gray-100 max-w-2xl mx-auto">
              Stay updated on After-12th with our blog! Get the latest information on admissions, exams, online courses, eligibility, and more.
            </p>
          </div>
          <BlogSearch/>
           <div className="container mx-auto px-4 max-w-7xl">
            <Breadcrumb 
              items={[
                { label: 'Home', href: '/' },
                { label: 'Blog' }
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
    console.error('Error fetching blog posts:', error);
    return <div>Error loading blog posts</div>;
  }
}

// Lazy load TrendingBlogs with an uppercase component name
const LazyTrendingBlogs = lazy(() => import("@/components/TrendingBlogs"));

export default BlogsPage;