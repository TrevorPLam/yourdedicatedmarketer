/**
 * SEO utilities for the firm website.
 * Provides metadata generation, Open Graph tags, and SEO best practices.
 */

import type { Metadata } from 'next';

const SITE_URL = 'https://yourdedicatedmarketer.com';

/**
 * Options for generating metadata.
 */
export interface MetadataOptions {
  /** Page title (50-60 characters recommended) */
  title: string;
  /** Page description (150-160 characters recommended) */
  description: string;
  /** Relative path for the page (e.g., '/services/website-design') */
  path: string;
  /** Optional Open Graph image URL */
  image?: string;
  /** Optional published time for articles */
  publishedTime?: string;
  /** Optional modified time for articles */
  modifiedTime?: string;
  /** Optional authors for articles */
  authors?: string[];
  /** Optional section for articles */
  section?: string;
  /** Optional tags for articles */
  tags?: string[];
}

/**
 * Generates a complete Metadata object for Next.js pages.
 * Follows Google SEO best practices with title, description, Open Graph, Twitter cards, and canonical URL.
 *
 * @param options - Metadata options including title, description, and path
 * @returns Next.js Metadata object
 */
export function generateMetadata(options: MetadataOptions): Metadata {
  const { title, description, path, image, publishedTime, modifiedTime, authors, section, tags } = options;
  const canonicalUrl = `${SITE_URL}${path}`;
  const ogImage = image || `${SITE_URL}/og-image.png`;

  const openGraph: Record<string, unknown> = {
    type: 'website',
    locale: 'en_US',
    url: canonicalUrl,
    title,
    description,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    siteName: 'Your Dedicated Marketer',
  };

  // Only include article-specific properties if they are provided
  if (publishedTime || modifiedTime || authors || section || tags) {
    openGraph.type = 'article';
    if (publishedTime) openGraph.publishedTime = publishedTime;
    if (modifiedTime) openGraph.modifiedTime = modifiedTime;
    if (authors) openGraph.authors = authors;
    if (section) openGraph.section = section;
    if (tags) openGraph.tags = tags;
  }

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

/**
 * Generates Open Graph tags for social media sharing.
 * Helper function for custom Open Graph implementations.
 *
 * @param options - Open Graph options
 * @returns Object with Open Graph properties
 */
export function getOpenGraphTags(options: {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
}) {
  const { title, description, url, image, type = 'website', publishedTime, modifiedTime, authors, section, tags } = options;
  const ogImage = image || `${SITE_URL}/og-image.png`;

  return {
    type,
    url,
    title,
    description,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    siteName: 'Your Dedicated Marketer',
    publishedTime,
    modifiedTime,
    authors,
    section,
    tags,
  };
}
