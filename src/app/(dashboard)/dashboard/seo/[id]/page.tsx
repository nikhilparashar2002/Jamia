'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input, Divider } from '@nextui-org/react';
import StepWizard from '@/components/seo/StepWizard';
import BasicInfoStep from '@/components/seo/steps/BasicInfoStep';
import SEOStep from '@/components/seo/steps/SEOStep';
import MediaStep from '@/components/seo/steps/MediaStep';
import RichTextEditor from '@/components/RichTextEditor';
import PreviewDialog from '@/components/seo/PreviewDialog';
import VersionHistoryDialog from '@/components/seo/VersionHistoryDialog';
import { log } from 'console';

interface FormData {
  title: string;
  description: string;
  categories: string[];
  tableOfContents:Array<{
    level: number;
      text: string;
      id: string;
      children: [];
  }>;
  keywords: string[];
  slug: string;
  content: string;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  status: 'draft' | 'published' | 'review';
  headerImage: {
    url?: string;
    alt: string;
    caption?: string;
    data?: string;
    resourceType?: string;
    format?: string;      // Add this
    publicId?: string;    // Add this
  } | null;
  media: Array<{
    data: string;
    resourceType: string;
    alt: string;
    caption?: string;
  }>;
  seo: {
    title: string;
    description: string;
    focusKeywords: string[];
    metaRobots: string;
  };
}

interface PageProps {
  params: { id: string };
}

export default function EditContent({ params }: PageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const contentId = params.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    categories: [],
    keywords: [],
    slug: '',
    tableOfContents:[],
    content: '',
    faq: [], // Initialize FAQ as empty array
    status: 'draft',
    headerImage: null,
    media: [],
    seo: {
      title: '',
      description: '',
      focusKeywords: [],
      metaRobots: 'index,follow'
    }
  });
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/seo/content/${contentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }

        const data = await response.json();
        setFormData({
          title: data.title || '',
          description: data.description || '',
          categories: data.categories || [],
          keywords: data.keywords || [],
          slug: data.slug || '',
          tableOfContents: data.tableOfContents || [],
          content: data.content || '',
          faq: data.faq || [], // Load FAQ data or default to empty array
          status: data.status || 'draft',
          headerImage: data.headerImage || null,
          media: data.media || [],
          seo: {
            title: data.seo?.title || '',
            description: data.seo?.description || '',
            focusKeywords: data.seo?.focusKeywords || [],
            metaRobots: data.seo?.metaRobots || 'index,follow'
          }
        });
      } catch (error) {
        console.error('Error fetching content:', error);
        router.push('/dashboard/seo');
      } finally {
        setLoading(false);
      }
    };

    if (contentId) {
      fetchContent();
    }
  }, [contentId, router]);

  const handleSubmit = async () => {
    if (!session) {
      alert('You must be logged in to edit content');
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload header image to Cloudinary if exists
      let headerImageData = formData.headerImage;
      if (formData.headerImage?.data) {
        const uploadResponse = await fetch('/api/upload/cloudinary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: formData.headerImage.data,
            options: {
              folder: 'seo-content/headers'
            }
          })
        });
        if (!uploadResponse.ok) throw new Error('Failed to upload header image');
        const uploadedImage = await uploadResponse.json();
        console.log(uploadedImage);
        
        headerImageData = {
          url: uploadedImage.secure_url,
          format: uploadedImage.format,        // Add format
          publicId: uploadedImage.public_id,   // Add publicId
          resourceType: formData.headerImage.resourceType,
          alt: formData.headerImage.alt || '',
          caption: formData.headerImage.caption
        };
      }
console.log(headerImageData);

      // Upload media files to Cloudinary
      const mediaUploads = await Promise.all(
        formData.media.map(async (media) => {
          if (!media.data) return media;
          
          const uploadResponse = await fetch('/api/upload/cloudinary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              file: media.data,
              options: {
                folder: 'seo-content/media',
                resource_type: media.resourceType
              }
            })
          });
          if (!uploadResponse.ok) throw new Error('Failed to upload media');
          const mediaData = await uploadResponse.json();
          console.log(mediaData);
          
          return {
            ...mediaData,
            alt: media.alt,
            caption: media.caption
          };
        })
      );

      const response = await fetch(`/api/seo/content/${contentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            title: formData.title,
            description: formData.description,
            tableOfContents: formData.tableOfContents,
            slug: formData.slug,
            categories: formData.categories,
            keywords: formData.keywords,
            content: formData.content,
            faq: formData.faq, // Include FAQ data in request
            status: formData.status,
            headerImage: headerImageData,
            media: mediaUploads,
            seo: formData.seo
          }
        }),
      });

      // Log the request payload
      console.log('API Request Payload:', {
        title: formData.title,
        description: formData.description,
        tableOfContents: formData.tableOfContents,
        slug: formData.slug,
        categories: formData.categories,
        keywords: formData.keywords,
        content: formData.content.substring(0, 100) + '...', // Log first 100 chars of content
        faq: formData.faq, // Log FAQs
        status: formData.status,
        headerImage: headerImageData,
        mediaCount: mediaUploads.length,
        seo: formData.seo
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update content');
      }

      router.push('/dashboard/seo');
    } catch (error) {
      console.error('Error updating content:', error);
      alert(error instanceof Error ? error.message : 'Failed to update content. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const steps = [
    {
      title: 'Basic Info',
      component: (
        <BasicInfoStep
          title={formData.title}
          description={formData.description}
          categories={formData.categories}
          keywords={formData.keywords || []}
          slug={formData.slug}
          onUpdate={handleUpdateField}
        />
      )
    },
    {
      title: 'SEO Settings',
      component: (
        <SEOStep
          seoTitle={formData.seo.title}
          seoDescription={formData.seo.description}
          focusKeywords={formData.seo.focusKeywords}
          metaRobots={formData.seo.metaRobots}
          onUpdate={(field, value) => {
            setFormData(prev => ({
              ...prev,
              seo: {
                ...prev.seo,
                [field]: value
              }
            }));
          }}
        />
      )
    },
    {
      title: 'Media',
      component: (
        <MediaStep
          headerImage={formData.headerImage}
          media={formData.media}
          onUpdate={handleUpdateField}
        />
      )
    },
    {
      title: 'Content',
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4">
              <RichTextEditor
                content={formData.content}
                onChange={(html: string) => {
                  // Extract headings and create table of contents
                  const parser = new DOMParser();
                  const doc = parser.parseFromString(html, 'text/html');
                  const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
                  
                  const toc = headings.map(heading => ({
                    level: parseInt(heading.tagName[1]),
                    text: heading.textContent || '',
                    id: heading.id || Math.random().toString(36).substr(2, 9),
                    children: []
                  }));

                  handleUpdateField('content', html);
                  handleUpdateField('tableOfContents', toc);
                }}
              />
            </div>
            {/* <div className="col-span-1">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Table of Contents</h3>
                {formData.tableOfContents.length > 0 ? (
                  <ul className="space-y-2">
                    {formData.tableOfContents.map((item, index) => (
                      <li
                        key={item.id}
                        style={{ marginLeft: `${(item.level - 1) * 16}px` }}
                        className="text-sm text-gray-700 hover:text-primary cursor-pointer"
                      >
                        {item.text}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No headings found in the content</p>
                )}
              </div>
            </div> */}
          </div>
        </div>
      )
    },
    {
      title: 'FAQs',
      component: (
        <div className="space-y-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
            <p className="text-sm text-gray-600 mt-1">
              Add questions and answers related to this content. These will be used for the FAQ Schema.
            </p>
          </div>

          {formData.faq.map((item, index) => (
            <div key={index} className="border p-4 rounded-lg mb-6 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-lg">FAQ Item #{index + 1}</h4>
                <Button 
                  color="danger" 
                  variant="light" 
                  size="sm" 
                  onPress={() => {
                    const newFaq = [...formData.faq];
                    newFaq.splice(index, 1);
                    handleUpdateField('faq', newFaq);
                  }}
                >
                  Remove
                </Button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Question</label>
                <Input
                  value={item.question}
                  onChange={(e) => {
                    const newFaq = [...formData.faq];
                    newFaq[index].question = e.target.value;
                    handleUpdateField('faq', newFaq);
                  }}
                  placeholder="Enter a question"
                  variant="bordered"
                  fullWidth
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Answer</label>
                <RichTextEditor
                  content={item.answer}
                  onChange={(html) => {
                    const newFaq = [...formData.faq];
                    newFaq[index].answer = html;
                    handleUpdateField('faq', newFaq);
                  }}
                />
              </div>
            </div>
          ))}

          <Button
            color="primary"
            variant="flat"
            onPress={() => {
              const newFaq = [...formData.faq, { question: '', answer: '' }];
              handleUpdateField('faq', newFaq);
            }}
          >
            Add FAQ Question
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="flex space-x-2">
            <div className="w-4 h-4 bg-primary rounded-full animate-bounce" />
            <div className="w-4 h-4 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-4 h-4 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
          <p className="text-xl font-medium text-gray-600 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Content</h1>
        <div className="flex gap-2">
          <Button
            color="secondary"
            variant="flat"
            onPress={() => setIsPreviewOpen(true)}
          >
            Preview
          </Button>
          <Button
            color="primary"
            variant="flat"
            onPress={() => setIsVersionHistoryOpen(true)}
          >
            Version History
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isSubmitting}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <StepWizard
          steps={steps}
          onComplete={handleSubmit}
          onCancel={() => router.push('/dashboard/seo')}
          showNavigation={true}
          isSubmitting={isSubmitting}
          status={formData.status}
          onStatusChange={(newStatus) => handleUpdateField('status', newStatus)}
        />
      </Card>

      <PreviewDialog
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={formData.title}
        metaDescription={formData.seo.description}
        keywords={formData.seo.focusKeywords.join(', ')}
        category={formData.categories}
        content={formData.content}
        description={formData.description}
        headerImage={formData.headerImage}
      />

      <VersionHistoryDialog
        isOpen={isVersionHistoryOpen}
        onClose={() => setIsVersionHistoryOpen(false)}
        contentId={contentId}
      />
    </div>
  );
}
