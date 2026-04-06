/**
 * Sitemap Generator
 * Implements 2026 sitemap standards for SEO optimization
 */

import type {
  SitemapPage,
  SitemapImage,
  NewsArticle,
  SitemapGenerator as ISitemapGenerator,
  SiteConfig,
} from '../types/seo.types';

/**
 * Optional data-fetcher callbacks that power dynamic sitemap sections.
 * Pass these when constructing SitemapGenerator to enable CMS-backed pages,
 * blog posts, images, and news articles.  If a fetcher is omitted that
 * section will be empty in the generated sitemap.
 */
export interface SitemapDataFetchers {
  /** Returns additional pages from a CMS or other external source. */
  fetchCMSPages?: () => Promise<SitemapPage[]>;
  /** Returns blog post pages to include in the sitemap. */
  fetchBlogPosts?: () => Promise<SitemapPage[]>;
  /** Returns images for the image sitemap. */
  fetchImages?: () => Promise<SitemapImage[]>;
  /** Returns recent news articles for the Google News sitemap. */
  fetchNewsArticles?: () => Promise<NewsArticle[]>;
}

export class SitemapGenerator implements ISitemapGenerator {
  private baseUrl: string;
  private siteConfig: SiteConfig;
  private fetchers: SitemapDataFetchers;

  constructor(baseUrl: string, siteConfig: SiteConfig, fetchers: SitemapDataFetchers = {}) {
    this.baseUrl = baseUrl;
    this.siteConfig = siteConfig;
    this.fetchers = fetchers;
  }

  /**
   * Generate main sitemap.xml
   */
  async generateSitemap(): Promise<string> {
    const pages = await this.getAllPages();
    const sitemap = this.createXMLSitemap(pages);
    return sitemap;
  }

  /**
   * Generate image sitemap for enhanced image search
   */
  async generateImageSitemap(): Promise<string> {
    const images = await this.getAllImages();
    const sitemap = this.createImageSitemap(images);
    return sitemap;
  }

  /**
   * Generate news sitemap for Google News
   */
  async generateNewsSitemap(): Promise<string> {
    const newsArticles = await this.getNewsArticles();
    const sitemap = this.createNewsSitemap(newsArticles);
    return sitemap;
  }

  /**
   * Generate sitemap index for multiple sitemaps
   */
  async generateSitemapIndex(): Promise<string> {
    const sitemaps = [
      { url: `${this.baseUrl}/sitemap.xml`, lastModified: new Date() },
      { url: `${this.baseUrl}/sitemap-images.xml`, lastModified: new Date() },
      { url: `${this.baseUrl}/sitemap-news.xml`, lastModified: new Date() },
    ];

    return this.createSitemapIndex(sitemaps);
  }

  /**
   * Generate robots.txt content
   */
  generateRobotsTxt(): string {
    const robots = [
      `User-agent: *`,
      `Allow: /`,
      `Disallow: /admin/`,
      `Disallow: /api/`,
      `Disallow: /private/`,
      `Disallow: /*.json$`,
      `Disallow: /*.xml$`,
      '',
      `Sitemap: ${this.baseUrl}/sitemap.xml`,
      `Sitemap: ${this.baseUrl}/sitemap-images.xml`,
      `Sitemap: ${this.baseUrl}/sitemap-news.xml`,
      '',
      `# Crawl-delay for better server performance`,
      `Crawl-delay: 1`,
      '',
      `# Allow specific search engines`,
      `User-agent: Googlebot`,
      `Allow: /`,
      '',
      `User-agent: Bingbot`,
      `Allow: /`,
      '',
      `# Block aggressive crawlers`,
      `User-agent: AhrefsBot`,
      `Disallow: /`,
      '',
      `User-agent: MJ12bot`,
      `Disallow: /`,
    ];

    return robots.join('\n');
  }

  /**
   * Get all pages for sitemap
   */
  private async getAllPages(): Promise<SitemapPage[]> {
    const pages: SitemapPage[] = [];

    // Add static pages with typical priority and frequency
    pages.push(
      {
        url: '',
        lastmod: new Date(),
        changefreq: 'daily',
        priority: 1.0,
        alternateLanguages: this.getAlternateLanguages(''),
      },
      {
        url: '/about',
        lastmod: new Date(),
        changefreq: 'monthly',
        priority: 0.8,
        alternateLanguages: this.getAlternateLanguages('/about'),
      },
      {
        url: '/services',
        lastmod: new Date(),
        changefreq: 'weekly',
        priority: 0.9,
        alternateLanguages: this.getAlternateLanguages('/services'),
      },
      {
        url: '/contact',
        lastmod: new Date(),
        changefreq: 'monthly',
        priority: 0.7,
        alternateLanguages: this.getAlternateLanguages('/contact'),
      },
      {
        url: '/blog',
        lastmod: new Date(),
        changefreq: 'daily',
        priority: 0.8,
        alternateLanguages: this.getAlternateLanguages('/blog'),
      },
      {
        url: '/portfolio',
        lastmod: new Date(),
        changefreq: 'weekly',
        priority: 0.8,
        alternateLanguages: this.getAlternateLanguages('/portfolio'),
      }
    );

    // Add dynamic pages from CMS (placeholder implementation)
    const cmsPages = await this.getCMSPages();
    pages.push(...cmsPages);

    // Add blog posts
    const blogPosts = await this.getBlogPosts();
    pages.push(...blogPosts);

    // Filter out duplicate URLs
    const uniquePages = pages.filter(
      (page, index, self) => index === self.findIndex((p) => p.url === page.url)
    );

    return uniquePages;
  }

  /**
   * Create XML sitemap content
   */
  private createXMLSitemap(pages: SitemapPage[]): string {
    const xmlPages = pages.map((page) => this.createSitemapEntry(page));

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${xmlPages.join('\n')}
</urlset>`;
  }

  /**
   * Create individual sitemap entry
   */
  private createSitemapEntry(page: SitemapPage): string {
    const url = `${this.baseUrl}${page.url}`;
    const lastmod = page.lastmod.toISOString().split('T')[0];

    let entry = `  <url>
    <loc>${this.escapeXML(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`;

    // Add alternate language links if available
    if (page.alternateLanguages && page.alternateLanguages.length > 0) {
      page.alternateLanguages.forEach((altLang) => {
        entry += `
    <xhtml:link rel="alternate" hreflang="${altLang.language}" href="${this.escapeXML(altLang.url)}" />`;
      });
    }

    entry += `
  </url>`;

    return entry;
  }

  /**
   * Create image sitemap
   */
  private createImageSitemap(images: SitemapImage[]): string {
    const xmlImages = images.map((image) => this.createImageEntry(image));

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${xmlImages.join('\n')}
</urlset>`;
  }

  /**
   * Create image sitemap entry
   */
  private createImageEntry(image: SitemapImage): string {
    return `  <url>
    <loc>${this.escapeXML(image.pageUrl)}</loc>
    <image:image>
      <image:loc>${this.escapeXML(image.url)}</image:loc>
      <image:title>${this.escapeXML(image.title)}</image:title>
      <image:caption>${this.escapeXML(image.caption)}</image:caption>${
        image.license
          ? `
      <image:license>${this.escapeXML(image.license)}</image:license>`
          : ''
      }${
        image.geoLocation
          ? `
      <image:geo_location>${this.escapeXML(image.geoLocation)}</image:geo_location>`
          : ''
      }
    </image:image>
  </url>`;
  }

  /**
   * Create news sitemap
   */
  private createNewsSitemap(newsArticles: NewsArticle[]): string {
    const xmlArticles = newsArticles.map((article) => this.createNewsEntry(article));

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${xmlArticles.join('\n')}
</urlset>`;
  }

  /**
   * Create news sitemap entry
   */
  private createNewsEntry(article: NewsArticle): string {
    return `  <url>
    <loc>${this.escapeXML(article.url)}</loc>
    <news:news>
      <news:publication>
        <news:name>${this.escapeXML(this.siteConfig.siteName)}</news:name>
        <news:language>${article.language}</news:language>
      </news:publication>
      <news:publication_date>${article.publicationDate.toISOString()}</news:publication_date>
      <news:title>${this.escapeXML(article.title)}</news:title>${
        article.keywords
          ? `
      <news:keywords>${this.escapeXML(article.keywords.join(', '))}</news:keywords>`
          : ''
      }${
        article.stockTickers
          ? `
      <news:stock_tickers>${this.escapeXML(article.stockTickers.join(', '))}</news:stock_tickers>`
          : ''
      }
    </news:news>
  </url>`;
  }

  /**
   * Create sitemap index
   */
  private createSitemapIndex(sitemaps: { url: string; lastModified: Date }[]): string {
    const xmlSitemaps = sitemaps.map((sitemap) => {
      const lastmod = sitemap.lastModified.toISOString().split('T')[0];
      return `  <sitemap>
    <loc>${this.escapeXML(sitemap.url)}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`;
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlSitemaps.join('\n')}
</sitemapindex>`;
  }

  /**
   * Escape XML special characters
   */
  private escapeXML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Get alternate languages for a page
   */
  private getAlternateLanguages(pageUrl: string): any[] {
    // This would be implemented based on your multilingual setup
    // For now, return empty array
    return [];
  }

  /**
   * Get CMS pages.
   * Delegates to the fetchCMSPages fetcher if provided; returns [] otherwise.
   */
  private async getCMSPages(): Promise<SitemapPage[]> {
    if (this.fetchers.fetchCMSPages) {
      return this.fetchers.fetchCMSPages();
    }
    return [];
  }

  /**
   * Get blog posts.
   * Delegates to the fetchBlogPosts fetcher if provided; returns [] otherwise.
   */
  private async getBlogPosts(): Promise<SitemapPage[]> {
    if (this.fetchers.fetchBlogPosts) {
      return this.fetchers.fetchBlogPosts();
    }
    return [];
  }

  /**
   * Get all images for image sitemap.
   * Delegates to the fetchImages fetcher if provided; returns [] otherwise.
   */
  private async getAllImages(): Promise<SitemapImage[]> {
    if (this.fetchers.fetchImages) {
      return this.fetchers.fetchImages();
    }
    return [];
  }

  /**
   * Get news articles for news sitemap.
   * Delegates to the fetchNewsArticles fetcher if provided; returns [] otherwise.
   */
  private async getNewsArticles(): Promise<NewsArticle[]> {
    if (this.fetchers.fetchNewsArticles) {
      return this.fetchers.fetchNewsArticles();
    }
    return [];
  }

  /**
   * Validate sitemap content
   */
  validateSitemap(sitemapContent: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic XML validation
    if (!sitemapContent.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
      errors.push('Missing XML declaration');
    }

    if (!sitemapContent.includes('<urlset')) {
      errors.push('Missing urlset element');
    }

    if (!sitemapContent.includes('</urlset>')) {
      errors.push('Missing closing urlset element');
    }

    // URL validation
    const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
    if (urlMatches) {
      urlMatches.forEach((match) => {
        const url = match.replace(/<\/?loc>/g, '');
        try {
          new URL(url);
        } catch {
          errors.push(`Invalid URL: ${url}`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get sitemap statistics
   */
  async getSitemapStats(): Promise<{
    totalUrls: number;
    totalImages: number;
    totalNewsArticles: number;
    lastModified: Date;
  }> {
    const pages = await this.getAllPages();
    const images = await this.getAllImages();
    const newsArticles = await this.getNewsArticles();

    return {
      totalUrls: pages.length,
      totalImages: images.length,
      totalNewsArticles: newsArticles.length,
      lastModified: new Date(),
    };
  }
}
