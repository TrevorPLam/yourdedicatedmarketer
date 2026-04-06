/**
 * SEO Package Types Export
 * Re-export all types for easy importing
 */

export type {
  SEOConfig,
  SiteConfig,
  MetaTag,
  StructuredData,
  AlternateLanguage,
  OrganizationData,
  LocalBusinessData,
  ArticleData,
  ProductData,
  FAQData,
  HowToData,
  SitemapPage,
  SitemapImage,
  NewsArticle,
  MetricValue,
  WebVitalsConfig,
  SEOManager as ISEOManager,
  SchemaGenerator as ISchemaGenerator,
  SitemapGenerator as ISitemapGenerator,
  CoreWebVitalsMonitor as ICoreWebVitalsMonitor,
  SEOHeadProps,
  SEOHeadReactProps,
  ChangeFrequency,
  TwitterCardType,
  OGType,
  Availability,
  Rating,
} from './types/seo.types';

export type { OpenGraphConfig, TwitterCardConfig } from './social/open-graph';
