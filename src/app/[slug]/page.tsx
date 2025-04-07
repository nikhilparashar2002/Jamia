import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardBody } from "@nextui-org/react";
import mongoose from "mongoose";
import { Content } from "@/models/Content";
import TableOfContents from "@/components/TableOfContents";
import VideoConsultForm from "@/components/VideoConsultForm";
import AuthorBox from '@/components/AuthorBox';
import "@/styles/blog.css";
import ArticleMeta from '@/components/ArticleMeta';
import BlogBreadcrumbs from '@/components/BlogBreadcrumbs';
import FaqAccordion from '@/components/FaqAccordion';
import BlogSearch from "@/components/blogSearch";

// Shared site URL
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jamia-chi.vercel.app/";

// Revalidate every hour
export const revalidate = 3600;

// Define the Post interface
interface Post {
  title: string;
  description: string;
  slug: string;
  content: string;
  headerImage?: {
    url: string;
    alt: string;
  };
  createdAt: Date;
  updatedAt: Date;
  author: {
    firstName: string;
    lastName: string;
    email: string;
  };
  seo: {
    title: string;
    description: string;
    metaRobots: string;
    focusKeywords: string[];
    readability: number;
  };
  wordCount: number;
  readingTime: number;
  tableOfContents: Array<{
    id: string;
    level: number;
    text: string;
  }>;
  keywords: string[];
  faq?: Array<{
    question: string;
    answer: string;
  }>;
}

// Generate static paths at build time
export async function generateStaticParams() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const posts = await Content.find({
    status: "published",
    isDeleted: { $ne: true },
  }).select("slug");

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  console.log(`Fetching metadata for slug: ${params.slug}`);

  try {
    const res = await fetch(`${siteUrl}/api/seo/content/slug/${params.slug}`, {
      next: { tags: [`blog-${params.slug}`], revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`Failed to fetch metadata: ${res.status}`);
      return {};
    }

    const post = await res.json();

    if (!post || post.error) {
      return {};
    }

    return {
      metadataBase: new URL(siteUrl), // Fix for metadata warning
      title: post.seo.title,
      description: post.seo.description,
      robots: post.seo.metaRobots,
      keywords: post.seo.focusKeywords.join(", "),
      alternates: {
        canonical: `${siteUrl}/${post.slug}`,
      },
      openGraph: {
        title: post.seo.title,
        description: post.seo.description,
        url: `${siteUrl}/${post.slug}`,
        siteName: "after12th.icnn.in",
        images: [
          {
            url: post.headerImage?.url || `${siteUrl}/default-og-image.png`,
            width: 1200,
            height: 630,
            alt: post.headerImage?.alt || post.seo.title,
          },
        ],
        locale: "en_US",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: post.seo.title,
        description: post.seo.description,
        images: [post.headerImage?.url || `${siteUrl}/default-og-image.png`],
      },
      other: {
        "content-score": (post.seo.readability ?? 0).toString(),
        "word-count": (post.wordCount ?? 0).toString(),
      },
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {};
  }
}

// Add a Node.js compatible HTML stripper function
function stripHtml(html: string): string {
  if (!html) return '';
  
  // Simple regex-based HTML tag stripper
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')  // Replace non-breaking spaces
    .replace(/\s+/g, ' ')     // Normalize whitespace
    .trim();
}

// Blog page component
export default async function BlogPage({ params }: { params: { slug: string } }) {
  try {
    const res = await fetch(`${siteUrl}/api/seo/content/slug/${params.slug}`, {
      next: { tags: [`blog-${params.slug}`], revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`Failed to fetch post: ${res.status}`);
      return notFound();
    }

    const post = await res.json();

    if (!post || post.error) {
      return notFound();
    }

    const plainTOC = post.tableOfContents.map((item: { id: string; level: number; text: string }) => ({
      id: item.id.toString(),
      level: item.level,
      text: item.text,
    }));

    // Preformat the date to ensure consistent output
    const createdAt = new Date(post.createdAt);
    const formattedDate = createdAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC", // Ensure consistency between server and client
    });

        // Check if FAQ array exists and has valid content
        const hasFaq = post.faq && Array.isArray(post.faq) && post.faq.length > 0;

            // Enhanced structured data with @graph for multiple schema entities
      const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BlogPosting",
            "@id": `${siteUrl}${post.slug}#article`,
            headline: post.title,
            description: post.description,
            image: post.headerImage?.url,
            datePublished: post.createdAt,
            dateModified: post.updatedAt,
            author: {
              "@type": "Person",
              name: `${post.author.firstName} ${post.author.lastName}`,
              email: post.author.email,
              url: `${siteUrl}authors/${post.author.firstName.toLowerCase()}-${post.author.lastName.toLowerCase()}`
            },
            publisher: {
              "@type": "Organization",
              name: "top.educationiconnect",
              logo: {
                "@type": "ImageObject",
                url: `${siteUrl}/logo.png`,
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${siteUrl}${post.slug}`,
            },
            wordCount: post.wordCount,
            keywords: post.keywords.join(", ")
          },
          {
            "@type": "BreadcrumbList",
            "@id": `${siteUrl}/${post.slug}#breadcrumb`,
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                item: {
                  "@id": siteUrl,
                  name: "Home"
                }
              },
              {
                "@type": "ListItem",
                position: 2,
                item: {
                  "@id": `${siteUrl}/${post.slug}`,
                  name: post.title
                }
              }
            ]
          }
        ]
      };
  
    
        // Only add FAQPage schema if there are FAQs available
        if (hasFaq) {
          // Use type assertion to avoid TypeScript errors
          jsonLd["@graph"].push({
            "@type": "FAQPage",
            "@id": `${siteUrl}/${post.slug}#faq`,
            mainEntity: post.faq.map((item: { question: string; answer: string }) => ({
              "@type": "Question",
              name: stripHtml(item.question),
              acceptedAnswer: {
                "@type": "Answer",
                text: stripHtml(item.answer)
              }
            }))
          } as any); // Add type assertion here
        }
    

    return (
      <div className="pb-16 bg-gray-50">
        {/* Inject structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Adjusted Header Implementation */}
        <div className="relative w-full overflow-hidden pt-12">
          {/* Circle background with adjusted position */}
          <div
            className="absolute w-[2000px] h-[2000px] bg-[#FFAB5B] rounded-full left-1/2"
            style={{
              transform: "translate(-50%, -50%)",
              opacity: "0.9",
            }}
          />

          {/* Adjusted Image Container */}
          <div className="relative z-10 w-full px-4 max-w-[800px] mx-auto">
            {post.headerImage && (
              <div className="relative aspect-[16/9] w-full overflow-hidden shadow-xl rounded-lg">
                <Image
                  src={post.headerImage.url}
                  alt={post.headerImage.alt}
                  fill
                  className="object-cover"
                  priority
                  itemProp="image"
                  sizes="(max-width: 800px) 100vw, 800px"
                  quality={90}
                  blurDataURL={post.headerImage.url}
                  placeholder="blur"
                />
              </div>
            )}
          </div>
        </div>
 {/* Add BlogBreadcrumbs before the header */}
 <BlogBreadcrumbs title={post.title} />
 <div className="mt-5">
 <BlogSearch />
 </div>
          

        {/* Main content container with max-width */}
        <div className="max-w-[1200px] mx-auto pl-0 my-8 sm:pl-4">
          <article className="flex flex-col lg:flex-row gap-4">
            <main className="w-full md:w-[66.666%] lg:w-[66.666%]">
              <Card>
                <CardBody className="space-y-6">
                  {/* Use ArticleMeta component instead of inline JSX */}
                  <ArticleMeta 
                    author={{
                      firstName: post.author.firstName,
                      lastName: post.author.lastName
                    }}
                    readingTime={post.readingTime}
                    datePublished={post.updatedAt}
                  />
                  <h1
                    className="text-3xl font-semibold text-center font-poppins text-[rgb(0,48,87)]"
                    itemProp="headline"
                  >
                    {post.title}
                  </h1>
                  <div className="text-justify">{post.description}</div>
                  <div className="lg:w-[30%] ">
                    {plainTOC.length > 0 && <TableOfContents items={plainTOC} />}
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
${post.content}
`,
                    }}
                    itemProp="articleBody"
                  />

                                    {/* FAQ Section with Collapsible Functionality */}
                                    {post.faq && post.faq.length > 0 && (
                    <div className="mt-10 pt-6 border-t border-gray-200">
                      <h3 className="text-2xl font-bold text-[rgb(0,48,87)] mb-6">
                        Frequently Asked Questions
                      </h3>
                      {/* Use the client component for interactive accordion */}
                      <FaqAccordion faqs={post.faq} />
                    </div>
                  )}
                   {/* Pass only basic author info to AuthorBox */}
                   {post.author && (
                    <AuthorBox 
                      author={{
                        firstName: post.author.firstName,
                        lastName: post.author.lastName,
                        email: post.author.email
                      }} 
                    />
                  )}
                </CardBody>
              </Card>
            </main>
            <aside className="w-full md:w-[33.334%] lg:w-[33.334%]">
              {/* Add a sidebar here */}
              <div className="sticky top-4 ">
                <VideoConsultForm />
              </div>
            </aside>
          </article>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return notFound();
  }
}