'use client';

import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
} from '@nextui-org/react';
import Image from 'next/image';
import ArticleMeta from '@/components/ArticleMeta';
import TableOfContents from "@/components/TableOfContents";

interface PreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  metaDescription?: string;
  keywords?: string;
  category: string[];
  content: string;
  description?: string;
  headerImage?: {
    url?: string;
    alt: string;
    caption?: string;
    data?: string;
    resourceType?: string;
  } | null;
}

const PreviewDialog: React.FC<PreviewDialogProps> = ({
  isOpen,
  onClose,
  title,
  metaDescription,
  keywords,
  category,
  content,
  description,
  headerImage,
}) => {
  // Replicate structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    image: headerImage?.url,
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    author: {
      "@type": "Person",
      name: "Preview Author",
    },
    publisher: {
      "@type": "Organization",
      name: "Preview Org",
      logo: {
        "@type": "ImageObject",
        url: "/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "/preview",
    },
    keywords,
  };

  // Mock data for preview
  const mockAuthor = {
    firstName: "Preview",
    lastName: "Author",
  };

  const mockTOC = [
    { id: "preview-1", level: 1, text: "Sample Heading 1" },
    { id: "preview-2", level: 2, text: "Sample Heading 2" },
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="5xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Content Preview
        </ModalHeader>
        <ModalBody>
          {/* Structured data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {/* Circle background & header image */}
          <div className="pb-16 bg-gray-50">
            <div className="relative w-full overflow-hidden pt-12">
              <div
                className="absolute w-[2000px] h-[2000px] bg-[#FFAB5B] rounded-full left-1/2"
                style={{
                  transform: "translate(-50%, -50%)",
                  opacity: "0.9",
                }}
              />
              {headerImage?.url && (
                <div className="relative z-10 w-full px-4 max-w-[800px] mx-auto aspect-[16/9] overflow-hidden shadow-xl rounded-lg">
                  <Image
                    src={headerImage.url}
                    alt={headerImage.alt}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 800px) 100vw, 800px"
                    quality={90}
                    blurDataURL={headerImage.url}
                    placeholder="blur"
                  />
                </div>
              )}
            </div>

            {/* Updated Main content container with max-width */}
            <div className="max-w-[1200px] mx-auto pl-0 my-12 sm:pl-4">
              <article className="flex flex-col lg:flex-row gap-4">
                <main className="w-full md:w-[66.666%] lg:w-[66.666%]">
                  <Card>
                    <CardBody className="space-y-6">
                      <ArticleMeta 
                        author={mockAuthor}
                        readingTime={5} // Mock reading time
                        datePublished={new Date().toISOString()}
                      />
                      
                      <h2
                        className="text-3xl font-semibold text-center font-poppins text-[rgb(0,48,87)]"
                        itemProp="headline"
                      >
                        {title}
                      </h2>

                      <div className="text-justify">{description}</div>

                      <div className="lg:w-[30%]">
                        <TableOfContents items={mockTOC} />
                      </div>

                      <div
                        className="prose text-justify max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: `
<style>
ul {
  list-style: disc outside none;
  margin-left: 1.5em;
  padding-left: 0;
}
ol {
  list-style: decimal outside none;
  margin-left: 1.5em;
  padding-left: 0;
}
li {
  margin: 0.5em 0;
}
</style>
${content}
`,
                        }}
                        itemProp="articleBody"
                      />
                    </CardBody>
                  </Card>
                </main>
                <aside className="w-full md:w-[33.334%] lg:w-[33.334%]">
                  <div className="sticky top-4">
                    {/* Placeholder for sidebar content */}
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <p className="text-gray-500">Preview Mode - Sidebar Area</p>
                    </div>
                  </div>
                </aside>
              </article>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PreviewDialog;