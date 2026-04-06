/**
 * Default SEO Configurations
 * sensible defaults for marketing agency applications
 */

import type { SEOConfig, SiteConfig } from '../types/seo.types';

/**
 * Default site configuration
 */
export const defaultSiteConfig: SiteConfig = {
  siteName: 'Marketing Agency',
  baseUrl: 'https://example.com',
  defaultOGImage: '/images/og-default.jpg',
  twitterHandle: '@agency',
  author: 'Marketing Agency Team',
  themeColor: '#000000',
  language: 'en',
  locale: 'en_US',
};

/**
 * Default SEO configuration
 */
export const defaultSEOConfig: SEOConfig = {
  title: 'Marketing Agency - Digital Marketing Solutions',
  description:
    'We help businesses grow with comprehensive digital marketing solutions including SEO, PPC, social media, and content marketing.',
  keywords: ['digital marketing', 'SEO', 'PPC', 'social media', 'content marketing'],
  ogType: 'website',
  twitterCard: 'summary_large_image',
  noindex: false,
  nofollow: false,
  structuredData: [],
};

/**
 * Default article SEO configuration
 */
export const defaultArticleSEOConfig: SEOConfig = {
  title: 'Article Title',
  description: 'Article description for search engines and social sharing.',
  keywords: [],
  ogType: 'article',
  twitterCard: 'summary_large_image',
  noindex: false,
  nofollow: false,
  structuredData: [],
  publishedTime: '',
  modifiedTime: '',
  author: '',
  section: 'Blog',
  tags: [],
};

/**
 * Default product SEO configuration
 */
export const defaultProductSEOConfig: SEOConfig = {
  title: 'Product Name',
  description: 'Product description for search engines and social sharing.',
  keywords: [],
  ogType: 'product',
  twitterCard: 'summary_large_image',
  noindex: false,
  nofollow: false,
  structuredData: [],
};

/**
 * Default local business SEO configuration
 */
export const defaultLocalBusinessSEOConfig: SEOConfig = {
  title: 'Local Business Name',
  description: 'Local business description for search engines and directories.',
  keywords: ['local business', 'service area'],
  ogType: 'website',
  twitterCard: 'summary_large_image',
  noindex: false,
  nofollow: false,
  structuredData: [],
};

/**
 * SEO configuration presets
 */
export const seoPresets = {
  homepage: defaultSEOConfig,
  article: defaultArticleSEOConfig,
  product: defaultProductSEOConfig,
  localBusiness: defaultLocalBusinessSEOConfig,
};

/**
 * Get SEO configuration by preset
 */
export function getSEOPreset(preset: keyof typeof seoPresets): SEOConfig {
  return seoPresets[preset];
}

/**
 * Merge SEO configuration with defaults
 */
export function mergeSEOConfig(
  config: Partial<SEOConfig>,
  preset: keyof typeof seoPresets = 'homepage'
): SEOConfig {
  const baseConfig = getSEOPreset(preset);
  return { ...baseConfig, ...config };
}

/**
 * Merge site configuration with defaults
 */
export function mergeSiteConfig(config: Partial<SiteConfig>): SiteConfig {
  return { ...defaultSiteConfig, ...config };
}
