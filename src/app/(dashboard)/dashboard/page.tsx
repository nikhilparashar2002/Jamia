'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Divider, Chip } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { 
  DocumentTextIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  ClockIcon 
} from "@heroicons/react/24/outline";

interface WriterStats {
  total: number;
  active: number;
  inactive: number;
  never: number;
}

interface Content {
  _id: string;
  title: string;
  description: string;
  slug: string;
  content: any;
  plainText: string;
  wordCount?: number;
  readingTime?: number;
  seo: {
    title: string;
    description: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    focusKeywords: string[];
    readabilityScore?: number;
    metaRobots: string;
  };
  media: Array<{
    url: string;
    publicId: string;
    format: string;
    resourceType: 'image' | 'video' | 'raw';
    alt: string;
    caption?: string;
    width?: number;
    height?: number;
    size?: number;
    createdAt: Date;
  }>;
  status: 'draft' | 'review' | 'published' | 'scheduled' | 'archived';
  scheduledPublish?: Date;
  author: {
    email: string;
    firstName: string;
    lastName: string;
  };
  categories: string[];
  score: number;
  isDeleted: boolean;
  seoAnalysis?: {
    keywordDensity?: number;
    titleLength?: number;
    descriptionLength?: number;
    contentLength?: number;
    readability?: number;
    hasImages?: boolean;
    hasLinks?: boolean;
    keywordInTitle?: boolean;
    keywordInDescription?: boolean;
    keywordInFirstParagraph?: boolean;
    keywordInHeadings?: boolean;
    hasMetaDescription?: boolean;
    hasFocusKeyword?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const isAdmin = session?.user?.role === 'admin';
  const [writerStats, setWriterStats] = useState<WriterStats>({
    total: 0,
    active: 0,
    inactive: 0,
    never: 0
  });
  const [contentStats, setContentStats] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [dailyActivity, setDailyActivity] = useState(0);
  const [recentContent, setRecentContent] = useState<Content[]>([]);

  useEffect(() => {
    const fetchRecentContent = async () => {
      try {
        const response = await fetch('/api/seo/content?page=1&limit=5&sortField=updatedAt&sortOrder=desc');
        if (response.ok) {
          const data = await response.json();
          setRecentContent(data.contents);
        }
      } catch (error) {
        console.error('Error fetching recent content:', error);
      }
    };

    fetchRecentContent();
    // Refresh recent content every minute
    const interval = setInterval(fetchRecentContent, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isAdmin) return;
      
      try {
        const response = await fetch('/api/writers/stats');
        if (response.ok) {
          const data = await response.json();
          setWriterStats(data);
        }
      } catch (error) {
        console.error('Error fetching writer stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh stats every minute
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  useEffect(() => {
    const fetchDailyActivity = async () => {
      try {
        const response = await fetch('/api/seo/content/daily-activity');
        if (response.ok) {
          const data = await response.json();
          setDailyActivity(data.count);
        }
      } catch (error) {
        console.error('Error fetching daily activity:', error);
      }
    };

    fetchDailyActivity();
    // Refresh daily activity every minute
    const interval = setInterval(fetchDailyActivity, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchContentStats = async () => {
      try {
        const response = await fetch('/api/seo/content/stats');
        if (response.ok) {
          const data = await response.json();
          setContentStats(data);
        }
      } catch (error) {
        console.error('Error fetching content stats:', error);
      }
    };

    fetchContentStats();
    // Refresh content stats every minute
    const interval = setInterval(fetchContentStats, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Welcome back, {session?.user?.name || session?.user?.email}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Content Stats Card */}
        <Card
         isPressable
         isHoverable
         onPress={() => router.push('/dashboard/seo')}
         className="cursor-pointer transition-transform hover:scale-105"
        >
          <CardBody className="flex flex-row items-center gap-4">
            <DocumentTextIcon className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-default-500">Total Content</p>
              <p className="text-xl font-semibold">{contentStats.total}</p>
            </div>
          </CardBody>
        </Card>

        {isAdmin && (
          <>
            {/* Writers Stats Card */}
            <Card 
              isPressable
              isHoverable
              onPress={() => router.push('/dashboard/writers')}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <CardBody className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <UserGroupIcon className="w-8 h-8 text-success" />
                  <div>
                    <p className="text-sm text-default-500">Total Writers</p>
                    <p className="text-xl font-semibold">{writerStats.total}</p>
                  </div>
                </div>
                <Divider className="my-2" />
                <div className="flex flex-wrap gap-2">
                  <Chip size="sm" color="success" variant="flat">
                    {writerStats.active} Active Today
                  </Chip>
                  <Chip size="sm" color="warning" variant="flat">
                    {writerStats.inactive} Inactive
                  </Chip>
                  <Chip size="sm" color="danger" variant="flat">
                    {writerStats.never} Never Logged In
                  </Chip>
                </div>
              </CardBody>
            </Card>

            {/* Analytics Card */}
            <Card>
              <CardBody className="flex flex-row items-center gap-4">
                <ChartBarIcon className="w-8 h-8 text-warning" />
                <div>
                  <p className="text-sm text-default-500">Monthly Views</p>
                  <p className="text-xl font-semibold">0</p>
                </div>
              </CardBody>
            </Card>
          </>
        )}

        {/* Recent Activity Card */}
        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <ClockIcon className="w-8 h-8 text-secondary" />
            <div>
              <p className="text-sm text-default-500">Daily Activity</p>
              <p className="text-xl font-semibold">{dailyActivity}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Content Section */}
      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-lg font-semibold">Recent Content</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          {recentContent.length > 0 ? (
            <div className="space-y-4">
              {recentContent.map((content) => (
                <div key={content._id} className="grid grid-cols-4 gap-4 items-center p-2 hover:bg-default-100 rounded-lg">
                  <div className="col-span-1">
                    <h3 className="font-medium text-default-900 truncate">{content.title}</h3>
                  </div>
                  <div className="col-span-1">
                    <p className="text-small text-default-500 truncate">{content.slug}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="text-small text-default-500">
                      {content.author.firstName} {content.author.lastName}
                    </p>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Chip
                      size="sm"
                      color={content.status === 'published' ? 'success' : content.status === 'draft' ? 'warning' : 'default'}
                      variant="flat"
                    >
                      {content.status}
                    </Chip>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-default-500 py-4">
              No content available yet
            </p>
          )}
        </CardBody>
      </Card>

     
    </div>
  );
}
