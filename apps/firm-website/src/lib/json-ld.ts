/**
 * JSON-LD structured data utilities for the firm website.
 * Provides schema.org markup for Google AEO (Answer Engine Optimization).
 */

import { env } from './env';

/**
 * FAQ item interface for JSON-LD generation.
 * Matches the new FAQ shape with title/description/content.
 */
export interface FAQItem {
  /** The question text (title field) */
  title: string;
  /** The answer text (content field) */
  content: string;
}

/**
 * Breadcrumb item interface for JSON-LD generation.
 */
export interface BreadcrumbItem {
  /** The name of the breadcrumb */
  name: string;
  /** The URL of the breadcrumb */
  url: string;
}

/**
 * Generates JSON-LD structured data for FAQPage schema.
 * This helps search engines understand Q&A content for featured snippets.
 *
 * @param faqs - Array of FAQ items with question and answer
 * @returns JSON-LD string for FAQPage schema
 */
export function generateFAQSchema(faqs: FAQItem[]): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.title,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.content,
      },
    })),
  };

  return JSON.stringify(schema);
}

/**
 * Generates JSON-LD structured data for Organization schema.
 * This establishes entity identity for search engines and AI systems.
 *
 * @param options - Organization details
 * @returns JSON-LD string for Organization schema
 */
export function generateOrganizationSchema(options: {
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  contactPoint?: {
    telephone?: string;
    contactType?: string;
    email?: string;
  };
}): string {
  const {
    name = 'Your Dedicated Marketer',
    description = 'Professional digital marketing services for local businesses',
    url = env.NEXT_PUBLIC_SITE_URL,
    logo = `${env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    sameAs = [],
    address,
    contactPoint,
  } = options;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    description,
    url,
    logo,
  };

  if (sameAs.length > 0) {
    schema.sameAs = sameAs;
  }

  if (address) {
    schema.address = {
      '@type': 'PostalAddress',
      ...address,
    };
  }

  if (contactPoint) {
    schema.contactPoint = {
      '@type': 'ContactPoint',
      ...contactPoint,
    };
  }

  return JSON.stringify(schema);
}

/**
 * Generates JSON-LD structured data for BreadcrumbList schema.
 * This helps search engines understand site navigation structure.
 *
 * @param breadcrumbs - Array of breadcrumb items with name and URL
 * @returns JSON-LD string for BreadcrumbList schema
 */
export function generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url,
    })),
  };

  return JSON.stringify(schema);
}
