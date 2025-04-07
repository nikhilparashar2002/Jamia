import { NextResponse } from 'next/server';
import { Content } from '@/models/Content';
import connectDB from '@/lib/db';

// Set dynamic options
export const dynamic = 'force-dynamic';
export const revalidate = 0; 

export async function GET() {
  try {
    await connectDB();
    
    // Fetch all published posts with fresh query
    const posts = await Content.find({ 
      status: 'published',
      isDeleted: { $ne: true },
      updatedAt: { $exists: true }
    })
    .select('slug updatedAt')
    .sort({ updatedAt: -1 })
    .lean();

    const baseUrl = process.env.SITE_URL || 'https://after12th.icnn.in';
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated at: ${new Date().toISOString()} -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    
    ${posts.map(post => `
    <url>
        <loc>${baseUrl}/${post.slug}</loc>
        <lastmod>${new Date(post.updatedAt).toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>`).join('')}
</urlset>`;

    // Return with no-cache headers
    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'text/xml',
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'x-generated-at': new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }
}