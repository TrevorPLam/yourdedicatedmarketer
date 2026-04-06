/**
 * SEO Head Component for React Applications
 * Implements comprehensive SEO meta tag management for React/Next.js apps
 */

import React, { useMemo } from 'react';
import Head from 'next/head';
import type { SEOConfig, SiteConfig, SEOHeadReactProps } from '../types/seo.types';
import { SEOManager } from '../metadata/seo-manager';
import {
  OpenGraphGenerator,
  type OpenGraphConfig,
  type TwitterCardConfig,
} from '../social/open-graph';

export interface SEOHeadProps extends SEOHeadReactProps {
  /**
   * Additional custom meta tags
   */
  customMetaTags?: Array<{
    name?: string;
    property?: string;
    content: string;
    httpEquiv?: string;
  }>;

  /**
   * Structured data configurations
   */
  structuredData?: Array<{
    type: string;
    properties: Record<string, any>;
  }>;

  /**
   * Enable/disable specific features
   */
  features?: {
    openGraph?: boolean;
    twitterCard?: boolean;
    jsonLd?: boolean;
    canonical?: boolean;
    robots?: boolean;
  };
}

export const SEOHead: React.FC<SEOHeadProps> = ({
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
  children,
}) => {
  const siteConfig = useMemo(
    () =>
      site || {
        siteName: '',
        baseUrl: '',
      },
    [site]
  );

  const seoManager = useMemo(() => new SEOManager(seo, siteConfig), [seo, siteConfig]);

  const metaTags = useMemo(() => seoManager.generateMetaTags(), [seoManager]);

  const pageTitle = useMemo(() => seoManager.generateTitle(), [seoManager]);

  const jsonLd = useMemo(
    () => (features.jsonLd ? seoManager.generateStructuredData() : ''),
    [features.jsonLd, seoManager]
  );

  const openGraphGenerator = useMemo(() => new OpenGraphGenerator(siteConfig), [siteConfig]);

  const ogConfig = useMemo<OpenGraphConfig>(
    () => ({
      type: seo.ogType || 'website',
      title: seo.title,
      description: seo.description,
      url: seo.canonical || siteConfig.baseUrl || '',
      image: seo.ogImage,
      siteName: siteConfig.siteName,
      locale: siteConfig.locale,
    }),
    [seo, siteConfig]
  );

  const twitterConfig = useMemo<TwitterCardConfig>(
    () => ({
      card: seo.twitterCard || 'summary_large_image',
      title: seo.title,
      description: seo.description,
      image: seo.ogImage,
      site: siteConfig.twitterHandle,
    }),
    [seo, siteConfig]
  );

  const socialTags = useMemo(
    () =>
      features.openGraph || features.twitterCard
        ? openGraphGenerator.generateSocialTags(ogConfig, twitterConfig)
        : [],
    [features.openGraph, features.twitterCard, openGraphGenerator, ogConfig, twitterConfig]
  );

  const allMetaTags = useMemo(
    () => [
      ...metaTags.filter(
        (tag) =>
          (features.openGraph || !tag.property?.startsWith('og:')) &&
          (features.twitterCard || !tag.name?.startsWith('twitter:')) &&
          (features.canonical || tag.name !== 'canonical') &&
          (features.robots || tag.name !== 'robots')
      ),
      ...socialTags,
      ...customMetaTags,
    ],
    [customMetaTags, features.canonical, features.openGraph, features.robots, features.twitterCard, metaTags, socialTags]
  );

  const structuredDataScripts = useMemo(() => structuredData.map((schema, index) => (
    <script
      key={`structured-data-${index}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': schema.type,
          ...schema.properties,
        }),
      }}
    />
  )), [structuredData]);

  return (
    <Head>
      {/* Title */}
      <title>{pageTitle}</title>

      {/* Meta Description */}
      <meta name="description" content={seo.description} />

      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Charset */}
      <meta charSet="utf-8" />

      {/* Generated Meta Tags */}
      {allMetaTags.map((tag, index) => {
        if (tag.name) {
          return (
            <meta
              key={`meta-${index}`}
              name={tag.name}
              content={tag.content}
              httpEquiv={tag.httpEquiv}
              charset={tag.charset}
            />
          );
        }
        if (tag.property) {
          return <meta key={`meta-${index}`} property={tag.property} content={tag.content} />;
        }
        return null;
      })}

      {/* JSON-LD Structured Data */}
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}

      {/* Additional Structured Data */}
      {structuredDataScripts}

      {/* Additional children */}
      {children}
    </Head>
  );
};

export default SEOHead;
