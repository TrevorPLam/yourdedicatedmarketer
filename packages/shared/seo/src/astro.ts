/**
 * SEO Package Astro Integration
 * Provides Astro components and utilities for SEO optimization
 */

import type { AstroConfig } from 'astro';
import type { SEOConfig, SiteConfig, MetaTag } from './types/seo.types';
import { SEOManager } from './metadata/seo-manager';
import {
  OpenGraphGenerator,
  type OpenGraphConfig,
  type TwitterCardConfig,
} from './social/open-graph';

export interface SEOHeadProps {
  seo: SEOConfig;
  site?: SiteConfig;
  customMetaTags?: Array<{
    name?: string;
    property?: string;
    content: string;
    httpEquiv?: string;
  }>;
  structuredData?: Array<{
    type: string;
    properties: Record<string, any>;
  }>;
  features?: {
    openGraph?: boolean;
    twitterCard?: boolean;
    jsonLd?: boolean;
    canonical?: boolean;
    robots?: boolean;
  };
}

/**
 * Generate SEO meta tags for Astro
 */
export function generateSEOMetaTags(props: SEOHeadProps): string {
  const {
    seo,
    site,
    customMetaTags = [],
    structuredData = [],
    features = {
      openGraph: true,
      twitterCard: true,
      jsonLd: true,
      canonical: true,
      robots: true,
    },
  } = props;

  // Initialize SEO manager
  const seoManager = new SEOManager(
    seo,
    site || {
      siteName: '',
      baseUrl: '',
    }
  );

  // Generate meta tags
  const metaTags = seoManager.generateMetaTags();

  // Generate structured data
  const jsonLd = features.jsonLd ? seoManager.generateStructuredData() : '';

  // Generate Open Graph and Twitter Card tags
  const openGraphGenerator = new OpenGraphGenerator(
    site || {
      siteName: '',
      baseUrl: '',
    }
  );

  const ogConfig: OpenGraphConfig = {
    type: seo.ogType || 'website',
    title: seo.title,
    description: seo.description,
    url: seo.canonical || site?.baseUrl || '',
    image: seo.ogImage,
    siteName: site?.siteName,
    locale: site?.locale,
  };

  const twitterConfig: TwitterCardConfig = {
    card: seo.twitterCard || 'summary_large_image',
    title: seo.title,
    description: seo.description,
    image: seo.ogImage,
    site: site?.twitterHandle,
  };

  const socialTags =
    features.openGraph || features.twitterCard
      ? openGraphGenerator.generateSocialTags(ogConfig, twitterConfig)
      : [];

  // Combine all meta tags
  const allMetaTags = [
    ...metaTags.filter(
      (tag) =>
        (features.openGraph || !tag.property?.startsWith('og:')) &&
        (features.twitterCard || !tag.name?.startsWith('twitter:')) &&
        (features.canonical || tag.name !== 'canonical') &&
        (features.robots || tag.name !== 'robots')
    ),
    ...socialTags,
    ...customMetaTags,
  ];

  // Generate meta tag HTML
  const metaTagHTML = allMetaTags
    .map((tag) => {
      if (tag.name) {
        return `<meta name="${tag.name}" content="${escapeHTML(tag.content)}"${tag.httpEquiv ? ` http-equiv="${tag.httpEquiv}"` : ''}${tag.charset ? ` charset="${tag.charset}"` : ''}>`;
      }
      if (tag.property) {
        return `<meta property="${tag.property}" content="${escapeHTML(tag.content)}">`;
      }
      return '';
    })
    .join('\n    ');

  // Generate structured data HTML
  let structuredDataHTML = '';
  if (jsonLd) {
    structuredDataHTML += `<script type="application/ld+json">${jsonLd}</script>`;
  }

  // Add additional structured data
  structuredData.forEach((schema, index) => {
    const schemaJSON = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': schema.type,
      ...schema.properties,
    });
    structuredDataHTML += `<script type="application/ld+json">${schemaJSON}</script>`;
  });

  return `
<!-- SEO Meta Tags -->
<title>${escapeHTML(seoManager.generateTitle())}</title>
<meta name="description" content="${escapeHTML(seo.description)}">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta charset="utf-8">
${metaTagHTML}
${structuredDataHTML}`;
}

/**
 * Astro SEO component
 */
export function SEOHead(props: SEOHeadProps) {
  const seoHTML = generateSEOMetaTags(props);

  return {
    __html: seoHTML,
  };
}

/**
 * Astro SEO integration
 */
export default function astroSEOIntegration(): AstroIntegration {
  return {
    name: 'astro-seo',
    hooks: {
      'astro:config:done': ({ config }) => {
        // Add SEO validation if needed
        console.log('🔍 Astro SEO integration loaded');
      },
    },
  };
}

/**
 * Escape HTML special characters
 */
function escapeHTML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * SEO utilities for Astro
 */
export class AstroSEOUtils {
  private siteConfig: SiteConfig;

  constructor(siteConfig: SiteConfig) {
    this.siteConfig = siteConfig;
  }

  /**
   * Generate breadcrumbs structured data
   */
  generateBreadcrumbs(breadcrumbs: { name: string; url: string }[]): string {
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

    return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
  }

  /**
   * Generate local business structured data
   */
  generateLocalBusiness(data: {
    name: string;
    description: string;
    url: string;
    telephone: string;
    address: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
    geo?: {
      latitude: number;
      longitude: number;
    };
    openingHours?: Array<{
      dayOfWeek: string;
      opens: string;
      closes: string;
    }>;
  }): string {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: data.name,
      description: data.description,
      url: data.url,
      telephone: data.telephone,
      address: data.address,
      geo: data.geo,
      openingHoursSpecification: data.openingHours,
    };

    return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
  }

  /**
   * Generate article structured data
   */
  generateArticle(data: {
    headline: string;
    description: string;
    image?: string;
    author: string;
    datePublished: string;
    dateModified?: string;
  }): string {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.headline,
      description: data.description,
      image: data.image,
      author: {
        '@type': 'Person',
        name: data.author,
      },
      datePublished: data.datePublished,
      dateModified: data.dateModified,
      publisher: {
        '@type': 'Organization',
        name: this.siteConfig.siteName,
        url: this.siteConfig.baseUrl,
      },
    };

    return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
  }

  /**
   * Generate product structured data
   */
  generateProduct(data: {
    name: string;
    description: string;
    image?: string[];
    brand?: string;
    sku?: string;
    offers?: Array<{
      price: number;
      currency: string;
      availability: string;
    }>;
  }): string {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.name,
      description: data.description,
      image: data.image,
      brand: data.brand
        ? {
            '@type': 'Brand',
            name: data.brand,
          }
        : undefined,
      sku: data.sku,
      offers: data.offers?.map((offer) => ({
        '@type': 'Offer',
        price: offer.price,
        priceCurrency: offer.currency,
        availability: `https://schema.org/${offer.availability}`,
      })),
    };

    return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
  }
}

// Type definitions for Astro
interface AstroIntegration {
  name: string;
  hooks: {
    'astro:config:done'?: (params: { config: AstroConfig }) => void | Promise<void>;
  };
}
