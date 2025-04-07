"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface TrendingBlog {
  _id: string;
  blogId: {
    title: string;
    slug: string;
    headerImage: {
      url: string;
      alt: string;
    };
  };
  position: number;
}

const DEFAULT_IMAGE = "/default-blog-image.jpg"; // Add a default image to your public folder

export default function TrendingBlogs() {
  const [trendingBlogs, setTrendingBlogs] = useState<TrendingBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingBlogs = async () => {
      try {
        const response = await fetch("/api/seo/content/trending");
        if (response.ok) {
          const data = await response.json();
          // Sort by position
          const sortedBlogs = data.sort(
            (a: TrendingBlog, b: TrendingBlog) => a.position - b.position
          );
          setTrendingBlogs(sortedBlogs);
        }
      } catch (error) {
        console.error("Error fetching trending blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingBlogs();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50">
        <div className="mx-auto px-4" style={{ maxWidth: "359.99px" }}>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold font-sans text-[#003366] mb-6">
              Trending Blogs of After 12th
            </h2>
            <div className="space-y-4 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-[110px] h-[75px] bg-gray-200 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="mx-auto px-4" style={{ maxWidth: "359.99px" }}>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold font-sans text-[#003366] mb-6">
            Trending Blogs
          </h2>

          <div className="space-y-0">
            {trendingBlogs.map((post, index) => (
              <div key={post._id}>
                <div className="flex gap-4 items-start py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0">
                    <Image
                      src={post.blogId.headerImage?.url || DEFAULT_IMAGE}
                      alt={post.blogId.headerImage?.alt || post.blogId.title}
                      width={110}
                      height={75}
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-700 font-medium mb-2 line-clamp-2">
                      {post.blogId.title}
                    </h3>
                    <Link
                      href={`/${post.blogId.slug}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Read More »
                    </Link>
                  </div>
                </div>
                {index < trendingBlogs.length - 1 && (
                  <div className="border-b border-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
