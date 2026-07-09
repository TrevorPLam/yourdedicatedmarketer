/**
 * Sitemap generation for the firm website.
 * Dynamically generates sitemap.xml covering all pages.
 */

import type { MetadataRoute } from 'next';
import { getAllServices, getAllIndustries, getAllDemos, getAllFAQs, getAllPages } from '@/lib/content';
import type { Service, Industry, Demo, FAQ, Page } from '@repo/lib';
import { env } from '@/lib/env';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    {
      url: env.NEXT_PUBLIC_SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${env.NEXT_PUBLIC_SITE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${env.NEXT_PUBLIC_SITE_URL}/industries`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${env.NEXT_PUBLIC_SITE_URL}/demos`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${env.NEXT_PUBLIC_SITE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${env.NEXT_PUBLIC_SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${env.NEXT_PUBLIC_SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  // Get all content slugs
  const services = await getAllServices();
  const industries = await getAllIndustries();
  const demos = await getAllDemos();
  const faqs = await getAllFAQs();
  const pages = await getAllPages();

  // Generate service URLs
  const serviceUrls = services.map((service) => ({
    url: `${env.NEXT_PUBLIC_SITE_URL}/services/${(service.data as Service).slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Generate industry URLs
  const industryUrls = industries.map((industry) => ({
    url: `${env.NEXT_PUBLIC_SITE_URL}/industries/${(industry.data as Industry).slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Generate demo URLs
  const demoUrls = demos.map((demo) => ({
    url: `${env.NEXT_PUBLIC_SITE_URL}/demos/${(demo.data as Demo).slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Generate FAQ URLs
  const faqUrls = faqs.map((faq) => ({
    url: `${env.NEXT_PUBLIC_SITE_URL}/faq/${(faq.data as FAQ).slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Generate static page URLs (about, pricing, etc.)
  const pageUrls = pages.map((page) => ({
    url: `${env.NEXT_PUBLIC_SITE_URL}/${(page.data as Page).slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...serviceUrls,
    ...industryUrls,
    ...demoUrls,
    ...faqUrls,
    ...pageUrls,
  ];
}
