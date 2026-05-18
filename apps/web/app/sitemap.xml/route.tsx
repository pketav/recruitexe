import { NextResponse } from 'next/server';
import { getSiteOrigin } from '@/lib/routes';

export async function GET() {
  const baseUrl = getSiteOrigin();
  const currentDate = new Date().toISOString().split('T')[0]; // e.g., 2025-07-16

  const pages = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/interview', changefreq: 'weekly', priority: 0.8 },
    { url: '/contact', changefreq: 'monthly', priority: 0.7 },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
