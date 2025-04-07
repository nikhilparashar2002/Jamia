'use client';

import Link from 'next/link';
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

interface BlogBreadcrumbsProps {
  title: string;
}

export default function BlogBreadcrumbs({ title }: BlogBreadcrumbsProps) {
  // Truncate long titles for mobile display
  const truncatedTitle = title.length > 25 ? `${title.substring(0, 25)}...` : title;

  return (
    <div className="py-2 px-3 md:py-3 md:px-4 bg-white shadow-sm border-b">
      <div className="max-w-[1200px] mx-auto overflow-x-auto">
        <Breadcrumbs
          classNames={{
            base: "text-xs md:text-sm lg:text-base min-w-0",
            list: "flex flex-nowrap items-center",
            separator: "mx-1 md:mx-2 text-gray-400 flex-shrink-0" 
          }}
          separator={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          }
          itemClasses={{
            item: "text-gray-600 hover:text-[#a2781d] transition-colors duration-200 whitespace-nowrap flex-shrink-0",
            separator: "mx-1 md:mx-2 text-gray-400"
          }}
        >
          <BreadcrumbItem>
            <Link href="/" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="sr-only md:not-sr-only md:ml-1">Home</span>
            </Link>
          </BreadcrumbItem>
          
          <BreadcrumbItem >
            <Link href="/blog">Blog</Link>
          </BreadcrumbItem>
          
          <BreadcrumbItem>
            <span 
              className="text-[#a2781d] font-medium truncate inline-block max-w-[150px] sm:max-w-[200px] md:max-w-[300px]" 
              title={title}
            >
              <span className="hidden xs:inline">{title}</span>
              <span className="xs:hidden">{truncatedTitle}</span>
            </span>
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
    </div>
  );
}
