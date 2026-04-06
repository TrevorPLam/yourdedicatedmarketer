/**
 * SEO Metadata Manager
 * Implements 2026 SEO best practices for meta tag generation and management
 */

import type {
  SEOConfig,
  SiteConfig,
  MetaTag,
  StructuredData,
  AlternateLanguage,
  SEOManager as ISEOManager,
} from '../types/seo.types';

export class SEOManager implements ISEOManager {
  private config: SEOConfig;
  private siteConfig: SiteConfig;

  constructor(config: SEOConfig, siteConfig: SiteConfig) {
    this.config = config;
    this.siteConfig = siteConfig;
  }

  /**
   * Generate comprehensive meta tags for the page
   */
  generateMetaTags(): MetaTag[] {
    const tags: MetaTag[] = [];

    // Basic meta tags
    tags.push(
      { name: 'description', content: this.config.description },
      { name: 'robots', content: this.generateRobotsTag() }
    );

    // Keywords meta tag (still relevant in 2026 for some search engines)
    if (this.config.keywords && this.config.keywords.length > 0) {
      tags.push({
        name: 'keywords',
        content: this.config.keywords.join(', '),
      });
    }

    // Author and publisher
    if (this.config.author) {
      tags.push({ name: 'author', content: this.config.author });
    }

    if (this.siteConfig.author) {
      tags.push({ name: 'publisher', content: this.siteConfig.author });
    }

    // Theme color for mobile browsers
    if (this.siteConfig.themeColor) {
      tags.push({ name: 'theme-color', content: this.siteConfig.themeColor });
    }

    // Canonical URL
    if (this.config.canonical) {
      tags.push({ name: 'canonical', content: this.config.canonical });
    }

    // Article specific meta tags
    if (this.config.ogType === 'article') {
      if (this.config.publishedTime) {
        tags.push({ property: 'article:published_time', content: this.config.publishedTime });
      }
      if (this.config.modifiedTime) {
        tags.push({ property: 'article:modified_time', content: this.config.modifiedTime });
      }
      if (this.config.author) {
        tags.push({ property: 'article:author', content: this.config.author });
      }
      if (this.config.section) {
        tags.push({ property: 'article:section', content: this.config.section });
      }
      if (this.config.tags && this.config.tags.length > 0) {
        tags.push({ property: 'article:tag', content: this.config.tags.join(', ') });
      }
    }

    // Open Graph tags
    tags.push(
      { property: 'og:title', content: this.generateTitle() },
      { property: 'og:description', content: this.config.description },
      { property: 'og:type', content: this.config.ogType || 'website' },
      { property: 'og:url', content: this.generateCanonicalURL() },
      { property: 'og:site_name', content: this.siteConfig.siteName }
    );

    // Open Graph image
    const ogImage = this.config.ogImage || this.siteConfig.defaultOGImage;
    if (ogImage) {
      tags.push(
        { property: 'og:image', content: ogImage },
        { property: 'og:image:alt', content: this.generateTitle() },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:type', content: 'image/jpeg' }
      );
    }

    // Open Graph locale
    if (this.siteConfig.locale) {
      tags.push({ property: 'og:locale', content: this.siteConfig.locale });
    }

    // Twitter Card tags
    tags.push(
      { name: 'twitter:card', content: this.config.twitterCard || 'summary_large_image' },
      { name: 'twitter:title', content: this.generateTitle() },
      { name: 'twitter:description', content: this.config.description }
    );

    if (ogImage) {
      tags.push({ name: 'twitter:image', content: ogImage });
    }

    if (this.siteConfig.twitterHandle) {
      tags.push(
        { name: 'twitter:site', content: this.siteConfig.twitterHandle },
        { name: 'twitter:creator', content: this.siteConfig.twitterHandle }
      );
    }

    // hreflang tags for multilingual SEO
    if (this.config.alternateLanguages && this.config.alternateLanguages.length > 0) {
      this.config.alternateLanguages.forEach((altLang) => {
        tags.push({
          name: 'alternate',
          content: altLang.url,
          hrefLang: altLang.language,
        });
      });
    }

    return tags;
  }

  /**
   * Generate structured data JSON-LD
   */
  generateStructuredData(): string {
    if (!this.config.structuredData || this.config.structuredData.length === 0) {
      return '';
    }

    const schemas = this.config.structuredData.map((schema) => {
      return this.generateSchema(schema.type, schema.properties);
    });

    return schemas.join('\n');
  }

  /**
   * Generate page title with site name
   */
  generateTitle(): string {
    const baseTitle = this.config.title;
    const siteName = this.siteConfig.siteName;

    // Avoid duplicate site name in title
    if (baseTitle.toLowerCase().includes(siteName.toLowerCase())) {
      return baseTitle;
    }

    return `${baseTitle} | ${siteName}`;
  }

  /**
   * Generate canonical URL
   */
  generateCanonicalURL(): string {
    if (this.config.canonical) {
      return this.config.canonical;
    }

    const baseUrl = this.siteConfig.baseUrl;
    const currentPath = this.getCurrentPath();

    return `${baseUrl}${currentPath}`;
  }

  /**
   * Generate robots meta tag content
   */
  generateRobotsTag(): string {
    const directives: string[] = [];

    if (this.config.noindex) directives.push('noindex');
    if (this.config.nofollow) directives.push('nofollow');

    if (directives.length === 0) {
      directives.push('index', 'follow');
    }

    return directives.join(', ');
  }

  /**
   * Generate JSON-LD schema markup
   */
  private generateSchema(type: string, properties: Record<string, any>): string {
    const schema = {
      '@context': 'https://schema.org',
      '@type': type,
      ...properties,
    };

    return `<script type="application/ld+json">${JSON.stringify(schema, null, 0)}</script>`;
  }

  /**
   * Get current path for canonical URL generation
   */
  private getCurrentPath(): string {
    // Handle different environments
    if (typeof window !== 'undefined') {
      return window.location.pathname + window.location.search;
    }

    // For SSR/SSG contexts, this should be provided by the framework
    return '/';
  }

  /**
   * Validate SEO configuration
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields
    if (!this.config.title || this.config.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (!this.config.description || this.config.description.trim().length === 0) {
      errors.push('Description is required');
    }

    // Title length validation (2026 best practices)
    if (this.config.title.length > 60) {
      errors.push('Title should be 60 characters or less for optimal display');
    }

    // Description length validation
    if (this.config.description.length > 160) {
      errors.push('Description should be 160 characters or less for optimal display');
    }

    // URL validation
    if (this.config.canonical && !this.isValidURL(this.config.canonical)) {
      errors.push('Canonical URL must be a valid URL');
    }

    // Image validation
    if (this.config.ogImage && !this.isValidURL(this.config.ogImage)) {
      errors.push('OG image must be a valid URL');
    }

    // Structured data validation
    if (this.config.structuredData) {
      this.config.structuredData.forEach((schema, index) => {
        if (!schema.type) {
          errors.push(`Structured data item ${index + 1} must have a type`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Basic URL validation
   */
  private isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get SEO score for the current configuration
   */
  getSEOScore(): { score: number; suggestions: string[] } {
    let score = 0;
    const suggestions: string[] = [];

    // Title optimization (30 points)
    if (this.config.title && this.config.title.length <= 60) {
      score += 30;
    } else {
      suggestions.push('Optimize title length to 60 characters or less');
    }

    // Description optimization (25 points)
    if (this.config.description && this.config.description.length <= 160) {
      score += 25;
    } else {
      suggestions.push('Optimize description length to 160 characters or less');
    }

    // Open Graph optimization (20 points)
    if (this.config.ogImage) {
      score += 20;
    } else {
      suggestions.push('Add Open Graph image for better social sharing');
    }

    // Structured data (15 points)
    if (this.config.structuredData && this.config.structuredData.length > 0) {
      score += 15;
    } else {
      suggestions.push('Add structured data for enhanced search results');
    }

    // Keywords (10 points)
    if (this.config.keywords && this.config.keywords.length > 0) {
      score += 10;
    } else {
      suggestions.push('Add relevant keywords for better targeting');
    }

    return { score, suggestions };
  }
}
