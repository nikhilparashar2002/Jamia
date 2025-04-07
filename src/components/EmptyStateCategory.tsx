'use client';

import Link from 'next/link';

interface EmptyStateCategoryProps {
  displayCategory: string;
}

const EmptyStateCategory = ({ displayCategory }: EmptyStateCategoryProps) => {
  return (
    <div className="w-full lg:w-[70%] bg-white rounded-xl shadow-md p-8 text-center">
      <div className="max-w-md mx-auto">
        <svg 
          className="w-24 h-24 mx-auto text-gray-400 mb-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          No Articles Found
        </h2>
        <p className="text-gray-600 mb-8">
          We haven't published any articles in this category yet. 
          Please check back later or explore other categories.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/blog" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse All Articles
          </Link>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Try Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyStateCategory;
