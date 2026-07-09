/**
 * Sitemap generation for the firm website.
 * Dynamically generates sitemap.xml covering all pages.
 */

import type { MetadataRoute } from 'next';
import { getAllServices, getAllIndustries, getAllDemos, getAllPages } from '@/lib/content';

const SITE_URL = 'https://yourdedicatedmarketer.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/industries`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/demos`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  // Get all content slugs
  const services = await getAllServices();
  const industries = await getAllIndustries();
  const demos = await getAllDemos();
  const pages = await getAllPages();

  // Generate service URLs
  const serviceUrls = services.map((service) => ({
    url: `${SITE_URL}/services/${(service.data as { slug: string }).slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Generate industry URLs
  const industryUrls = industries.map((industry) => ({
    url: `${SITE_URL}/industries/${(industry.data as { slug: string }).slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Generate demo URLs
  const demoUrls = demos.map((demo) => ({
    url: `${SITE_URL}/demos/${(demo.data as { slug: string }).slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Generate static page URLs (about, pricing, etc.)
  const pageUrls = pages.map((page) => ({
    url: `${SITE_URL}/${(page.data as { slug: string }).slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...serviceUrls,
    ...industryUrls,
    ...demoUrls,
    ...pageUrls,
  ];
}
