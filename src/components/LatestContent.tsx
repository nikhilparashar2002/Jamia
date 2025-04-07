import Image from "next/image";
import { useState, useEffect } from "react";
import ReadMoreButton from "@/components/ReadMoreButton"; // Import the client component
import ConsultForm from "@/components/ConsultForm";
import { useRouter } from "next/navigation";

interface Content {
  title: string;
  description: string;
  headerImage?: {
    url: string;
    alt: string;
  };
  slug: string;
}

export default function LatestContent() {
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({});
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isConsultFormOpen, setIsConsultFormOpen] = useState(false);

  useEffect(() => {
    const fetchLatestContent = async () => {
      try {
        const response = await fetch('/api/seo/content?status=published&page=1&limit=3&sortField=updatedAt&sortOrder=desc');
        if (!response.ok) throw new Error('Failed to fetch content');
        const data = await response.json();
        setContents(data.contents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestContent();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Latest Updates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 text-center text-red-600">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Latest Updates</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Stay informed with our latest news and updates about college admissions and education.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {contents.map((content, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 sm:duration-300 overflow-hidden transform hover:-translate-y-1"
            >
              <div className="relative h-48 sm:h-56 w-full bg-gray-100">
                {content.headerImage && !imageError[content.headerImage.url] ? (
                  <Image
                    src={content.headerImage.url}
                    alt={content.headerImage.alt || content.title}
                    fill
                    loading="lazy"
                    className="object-cover"
                    onError={() => setImageError(prev => ({ ...prev, [content.headerImage!.url]: true }))}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJyEkMj4xLy4wLi8vMzU6PDI0Ni85OS9KTldQUVlbWVFeY2NhXmdpWVf/2wBDARUXFx4aHR4eHVdONk5XV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1f/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400 text-sm">Image not available</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600" onClick={() => router.push(`/${content.slug}`)}>
                  {content.title}
                </h3>
                <p className="text-gray-600 line-clamp-3">{content.description}</p>
                {/* Improved button layout */}
                                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                  <ReadMoreButton slug={content.slug} />
                                  
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
              </div>
            </div>
          ))}
        </div>
      </div>
            <ConsultForm isOpen={isConsultFormOpen} onClose={() => setIsConsultFormOpen(false)} />
      
    </section>
  );
}
