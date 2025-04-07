'use client';

import { useState, useEffect, useRef } from 'react';
import { Input, Button, Spinner } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface SearchResult {
  _id: string;
  title: string;
  description: string;
  slug: string;
  updatedAt: string;
  author: {
    firstName: string;
    lastName: string;
  };
  headerImage?: {
    url: string;
    alt: string;
  };
}

interface BlogSearchProps {
  onSearchResults?: (results: any) => void;
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Add author name formatter helper
const getAuthorName = (author: SearchResult['author'] | undefined) => {
  if (!author) return 'Anonymous';
  return `${author.firstName} ${author.lastName}`;
};

const BlogSearch = ({ onSearchResults }: BlogSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>();
  const searchRef = useRef<HTMLDivElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleClose = () => {
    setIsFullScreen(false);
    setShowResults(false);
    setQuery('');
  };

  // Handle search query changes with debouncing
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (query.trim().length > 2) {
      setIsLoading(true);
      searchTimeout.current = setTimeout(() => {
        performSearch();
      }, 300);
    } else {
      setResults([]);
      setIsLoading(false);
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [query]);

  // Close search results on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Prevent parent scroll when search is open
  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullScreen]);

  const performSearch = async () => {
    if (query.trim().length < 3) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/seo/search?q=${encodeURIComponent(query)}&limit=7`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data.results || []);
      setShowResults(true);
      
      // Send results to parent component if callback exists
      if (onSearchResults) {
        onSearchResults(data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length > 2) {
      router.push(`/blog/search?q=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  const handleResultClick = () => {
    setShowResults(false);
    setQuery('');
  };

  // Format description for display in search results
  const formatDescription = (desc: string, maxLength = 120) => {
    if (desc.length <= maxLength) return desc;
    return `${desc.substring(0, maxLength)}...`;
  };

  return (
    <div className="w-full" ref={searchRef}>
      <div className={`${isFullScreen ? 'fixed inset-0 bg-white z-50' : 'relative'} transition-all duration-300`}>
        {/* Close button for full screen */}
        {isFullScreen && (
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Updated container with increased max-width */}
        <div className={`${isFullScreen ? 'h-full flex flex-col pt-20' : 'py-4'} container mx-auto px-4 max-w-6xl`}>
          {/* Search Input Form with improved spacing */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="relative flex items-center gap-2"
          >
            <div className="flex-1">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search blog posts..."
                className="w-full"
                classNames={{
                  base: "h-12",
                  inputWrapper: "h-12 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-gray-100 hover:border-blue-200/50",
                  input: "text-base placeholder:text-gray-400 font-medium",
                  innerWrapper: "pr-2",
                  mainWrapper: "h-full relative"
                }}
                radius="lg"
                size="lg"
                onFocus={() => setIsFullScreen(true)}
                startContent={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
                endContent={
                  isLoading ? (
                    <Spinner size="sm" color="primary" className="mr-2" />
                  ) : query.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('');
                        setIsFullScreen(false);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  ) : null
                }
              />
            </div>

            {/* Close button for full screen mode */}
            {isFullScreen && (
              <button
                type="button"
                onClick={() => {
                  setIsFullScreen(false);
                  setShowResults(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </form>

          {/* Updated Results Container */}
          {showResults && isFullScreen && (
            <div className="mt-6 px-2">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <div className="w-16 h-16 relative">
                    {/* Add your loading spinner here */}
                  </div>
                  <p className="mt-4 text-gray-600">Searching...</p>
                </div>
              ) : results.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8">
                  {query.trim().length > 2 ? (
                    <>
                      <div className="w-24 h-24 mb-4 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 text-lg font-medium mb-2">No matching articles found</p>
                      <p className="text-gray-500 text-center max-w-sm">
                        Try adjusting your search terms or browsing our categories instead
                      </p>
                      <button 
                        onClick={() => {
                          setQuery('');
                          setShowResults(false);
                        }}
                        className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Clear search
                      </button>
                    </>
                  ) : (
                    <p className="text-gray-500 font-medium">
                      Type at least 3 characters to search
                    </p>
                  )}
                </div>
              ) : (
                // Existing results list with added aria-label for accessibility
                <div className="divide-y divide-gray-100" role="list" aria-label="Search results">
                  {results.slice(0, 6).map((result) => (
                    <Link
                      href={`/${result.slug}`}
                      key={result._id}
                      className="py-4 flex justify-between hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        handleResultClick();
                        setIsFullScreen(false);
                      }}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {result.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {getAuthorName(result.author)}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(result.updatedAt)}
                        </span>
                      </div>
                    </Link>
                  ))}
                  
                  {results.length > 6 && (
                    <div className="py-4 text-center">
                      <Link
                        href={`/blog/search?q=${encodeURIComponent(query)}`}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 font-medium rounded-full transition-colors"
                        onClick={() => {
                          setShowResults(false);
                          setIsFullScreen(false);
                        }}
                      >
                        View all Results
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Backdrop for non-fullscreen results */}
      {showResults && !isFullScreen && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowResults(false)} />
      )}
    </div>
  );
};

export default BlogSearch;

// Add this to your global CSS file or within a style tag
const styles = `
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideDown {
  animation: slideDown 0.2s ease-out;
}
`;
