/**
 * SEO package types for marketing agency applications
 * Implements 2026 SEO best practices and standards
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product' | 'video.other';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  noindex?: boolean;
  nofollow?: boolean;
  structuredData?: StructuredData[];
  alternateLanguages?: AlternateLanguage[];
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export interface SiteConfig {
  siteName: string;
  baseUrl: string;
  defaultOGImage?: string;
  twitterHandle?: string;
  author?: string;
  themeColor?: string;
  language?: string;
  locale?: string;
}

export interface StructuredData {
  type: string;
  properties: Record<string, any>;
}

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
  httpEquiv?: string;
  charset?: string;
}

export interface AlternateLanguage {
  language: string;
  url: string;
}

// Structured Data Types
export interface OrganizationData {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  address?: AddressData;
  contactPoint?: ContactPointData;
  socialLinks?: string[];
  foundingDate?: string;
  numberOfEmployees?: string;
}

export interface LocalBusinessData extends OrganizationData {
  telephone: string;
  geo?: GeoData;
  openingHours?: OpeningHoursData[];
  priceRange?: string;
  paymentAccepted?: string[];
  currenciesAccepted?: string[];
  servesCuisine?: string;
  rating?: RatingData;
}

export interface ArticleData {
  headline: string;
  description: string;
  image?: string;
  author?: PersonData;
  publisher?: OrganizationData;
  datePublished: string;
  dateModified?: string;
  mainEntityOfPage?: string;
  wordCount?: number;
  articleSection?: string;
  keywords?: string[];
}

export interface ProductData {
  name: string;
  description: string;
  images?: string[];
  brand?: BrandData;
  sku?: string;
  gtin?: string;
  offers?: OfferData[];
  rating?: RatingData;
  reviews?: ReviewData[];
}

export interface FAQData {
  questions: {
    question: string;
    answer: string;
  }[];
}

export interface HowToData {
  name: string;
  description: string;
  image?: string;
  totalTime?: string;
  supplies?: string[];
  tools?: string[];
  steps: {
    name: string;
    text: string;
    image?: string;
    url?: string;
  }[];
}

// Supporting Data Types
export interface AddressData {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

export interface ContactPointData {
  telephone: string;
  contactType: string;
  availableLanguage?: string[];
}

export interface OpeningHoursData {
  dayOfWeek: string;
  opens: string;
  closes: string;
}

export interface GeoData {
  latitude: number;
  longitude: number;
}

export interface PersonData {
  name: string;
  url?: string;
  jobTitle?: string;
}

export interface BrandData {
  name: string;
  logo?: string;
}

export interface OfferData {
  price: number;
  currency: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder' | 'Discontinued';
  validFrom?: string;
  validThrough?: string;
  seller?: OrganizationData;
}

export interface RatingData {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

export interface ReviewData {
  author: PersonData;
  rating: RatingValueData;
  reviewBody: string;
  datePublished?: string;
}

export interface RatingValueData {
  ratingValue: number;
  bestRating?: number;
  worstRating?: number;
}

// Sitemap Types
export interface SitemapPage {
  url: string;
  lastmod: Date;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  alternateLanguages?: AlternateLanguage[];
}

export interface SitemapImage {
  pageUrl: string;
  url: string;
  title: string;
  caption: string;
  license?: string;
  geoLocation?: string;
}

export interface NewsArticle {
  url: string;
  title: string;
  language: string;
  publicationDate: Date;
  keywords?: string[];
  stockTickers?: string[];
}

// Core Web Vitals Types
export interface MetricValue {
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

export interface WebVitalsConfig {
  sendToAnalytics?: boolean;
  sendToGoogleAnalytics?: boolean;
  sendToCustomEndpoint?: boolean;
  customEndpoint?: string;
  sampleRate?: number;
  debugMode?: boolean;
}

// SEO Manager Interface
export interface SEOManager {
  generateMetaTags(): MetaTag[];
  generateStructuredData(): string;
  generateTitle(): string;
  generateCanonicalURL(): string;
  generateRobotsTag(): string;
}

// Schema Generator Interface
export interface SchemaGenerator {
  organization(data: OrganizationData): StructuredData;
  localBusiness(data: LocalBusinessData): StructuredData;
  article(data: ArticleData): StructuredData;
  product(data: ProductData): StructuredData;
  faq(data: FAQData): StructuredData;
  howTo(data: HowToData): StructuredData;
}

// Sitemap Generator Interface
export interface SitemapGenerator {
  generateSitemap(): Promise<string>;
  generateImageSitemap(): Promise<string>;
  generateNewsSitemap(): Promise<string>;
}

// Core Web Vitals Monitor Interface
export interface CoreWebVitalsMonitor {
  getMetrics(): Map<string, MetricValue>;
  getRating(metricName: string): 'good' | 'needs-improvement' | 'poor' | undefined;
  isPerformant(): boolean;
}

// SEO Component Props
export interface SEOHeadProps {
  seo: SEOConfig;
  site?: SiteConfig;
}

export interface SEOHeadReactProps extends SEOHeadProps {
  children?: React.ReactNode;
}

// Utility Types
export type ChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';
export type TwitterCardType = 'summary' | 'summary_large_image' | 'app' | 'player';
export type OGType = 'website' | 'article' | 'product' | 'video.other';
export type Availability = 'InStock' | 'OutOfStock' | 'PreOrder' | 'Discontinued';
export type Rating = 'good' | 'needs-improvement' | 'poor';
