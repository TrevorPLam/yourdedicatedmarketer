# @agency/seo

Comprehensive SEO package for marketing agency applications, implementing 2026
SEO best practices with TypeScript support.

## Features

- 🚀 **2026 SEO Best Practices**: Latest SEO standards and Core Web Vitals
  optimization
- 📱 **Multi-Framework Support**: React, Next.js, and Astro integrations
- 🎯 **Type-Safe**: Full TypeScript support with comprehensive type definitions
- 📊 **Structured Data**: JSON-LD schema generation for enhanced search results
- 🗺️ **Sitemap Generation**: Automated sitemap and robots.txt creation
- 📱 **Social Media**: Open Graph and Twitter Card optimization
- 🔍 **SEO Analytics**: SEO scoring and optimization suggestions
- 🌐 **Multi-Language**: hreflang and international SEO support

## Installation

```bash
pnpm add @agency/seo
```

## Quick Start

### React/Next.js

```tsx
import { SEOHead } from '@agency/seo/react';

function MyPage() {
  const seoConfig = {
    title: 'Digital Marketing Services',
    description:
      'Professional digital marketing solutions for growing businesses',
    keywords: ['digital marketing', 'SEO', 'PPC'],
    ogImage: '/images/marketing-services.jpg',
  };

  const siteConfig = {
    siteName: 'Marketing Agency',
    baseUrl: 'https://agency.com',
    twitterHandle: '@agency',
  };

  return (
    <>
      <SEOHead seo={seoConfig} site={siteConfig} />
      <main>
        <h1>Digital Marketing Services</h1>
        {/* Your content */}
      </main>
    </>
  );
}
```

### Astro

```astro
---
import { generateSEOMetaTags } from '@agency/seo/astro';

const seoConfig = {
  title: 'Digital Marketing Services',
  description: 'Professional digital marketing solutions for growing businesses',
  keywords: ['digital marketing', 'SEO', 'PPC'],
  ogImage: '/images/marketing-services.jpg',
};

const siteConfig = {
  siteName: 'Marketing Agency',
  baseUrl: 'https://agency.com',
  twitterHandle: '@agency',
};

const metaTags = generateSEOMetaTags({ seo: seoConfig, site: siteConfig });
---

<head>
  <Fragment set:html={metaTags} />
</head>

<body>
  <h1>Digital Marketing Services</h1>
  <!-- Your content -->
</body>
```

## Core Concepts

### SEO Manager

The `SEOManager` class handles meta tag generation and validation:

```typescript
import { SEOManager } from '@agency/seo';

const seoManager = new SEOManager(seoConfig, siteConfig);
const metaTags = seoManager.generateMetaTags();
const validation = seoManager.validate();
const score = seoManager.getSEOScore();
```

### Structured Data

Generate JSON-LD structured data for enhanced search results:

```typescript
import { SchemaGenerator } from '@agency/seo';

const schemaGenerator = new SchemaGenerator();

// Organization schema
const orgSchema = schemaGenerator.organization({
  name: 'Marketing Agency',
  url: 'https://agency.com',
  description: 'Full-service digital marketing agency',
});

// Article schema
const articleSchema = schemaGenerator.article({
  headline: '10 SEO Tips for 2026',
  description: 'Latest SEO strategies for better rankings',
  author: { name: 'John Doe', jobTitle: 'SEO Expert' },
  datePublished: '2026-01-15',
});
```

### Sitemap Generation

Automated sitemap and robots.txt generation:

```typescript
import { SitemapGenerator } from '@agency/seo';

const sitemapGenerator = new SitemapGenerator(baseUrl, siteConfig);

// Generate sitemap
const sitemap = await sitemapGenerator.generateSitemap();

// Generate robots.txt
const robotsTxt = sitemapGenerator.generateRobotsTxt();

// Generate image sitemap
const imageSitemap = await sitemapGenerator.generateImageSitemap();
```

### Social Media Optimization

Open Graph and Twitter Card optimization:

```typescript
import { OpenGraphGenerator } from '@agency/seo';

const ogGenerator = new OpenGraphGenerator(siteConfig);

// Generate social tags
const socialTags = ogGenerator.generateSocialTags(ogConfig, twitterConfig);

// Generate sharing URLs
const sharingUrls = ogGenerator.generateSharingUrls(url, title, description);

// Validate configurations
const ogValidation = ogGenerator.validateOpenGraphConfig(ogConfig);
const twitterValidation = ogGenerator.validateTwitterCardConfig(twitterConfig);
```

## API Reference

### SEOConfig

```typescript
interface SEOConfig {
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
```

### SiteConfig

```typescript
interface SiteConfig {
  siteName: string;
  baseUrl: string;
  defaultOGImage?: string;
  twitterHandle?: string;
  author?: string;
  themeColor?: string;
  language?: string;
  locale?: string;
}
```

### SEOHead Props (React)

```typescript
interface SEOHeadProps {
  seo: SEOConfig;
  site?: SiteConfig;
  customMetaTags?: MetaTag[];
  structuredData?: StructuredData[];
  features?: {
    openGraph?: boolean;
    twitterCard?: boolean;
    jsonLd?: boolean;
    canonical?: boolean;
    robots?: boolean;
  };
}
```

## Examples

### Blog Post SEO

```tsx
import { SEOHead } from '@agency/seo/react';
import { SchemaGenerator } from '@agency/seo';

function BlogPost({ post }) {
  const schemaGenerator = new SchemaGenerator();

  const seoConfig = {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    ogType: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    author: post.author.name,
    section: 'Blog',
    tags: post.tags,
    structuredData: [
      schemaGenerator.article({
        headline: post.title,
        description: post.excerpt,
        author: post.author.name,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        image: post.featuredImage,
      }),
    ],
  };

  return (
    <>
      <SEOHead seo={seoConfig} site={siteConfig} />
      <article>{/* Blog post content */}</article>
    </>
  );
}
```

### Product Page SEO

```tsx
import { SEOHead } from '@agency/seo/react';
import { SchemaGenerator } from '@agency/seo';

function ProductPage({ product }) {
  const schemaGenerator = new SchemaGenerator();

  const seoConfig = {
    title: `${product.name} - ${product.category}`,
    description: product.description,
    keywords: [product.name, product.category, ...product.features],
    ogType: 'product',
    ogImage: product.images[0],
    structuredData: [
      schemaGenerator.product({
        name: product.name,
        description: product.description,
        images: product.images,
        brand: { name: 'Our Brand' },
        sku: product.sku,
        offers: product.variants.map((variant) => ({
          price: variant.price,
          currency: 'USD',
          availability: variant.inStock ? 'InStock' : 'OutOfStock',
        })),
      }),
    ],
  };

  return (
    <>
      <SEOHead seo={seoConfig} site={siteConfig} />
      <div>{/* Product content */}</div>
    </>
  );
}
```

### Local Business SEO

```tsx
import { SEOHead } from '@agency/seo/react';
import { SchemaGenerator } from '@agency/seo';

function LocalBusiness({ business }) {
  const schemaGenerator = new SchemaGenerator();

  const seoConfig = {
    title: `${business.name} - ${business.city}, ${business.state}`,
    description: business.description,
    keywords: [business.name, business.category, business.city, business.state],
    structuredData: [
      schemaGenerator.localBusiness({
        name: business.name,
        description: business.description,
        url: business.website,
        telephone: business.phone,
        address: business.address,
        geo: business.coordinates,
        openingHours: business.hours,
        rating: business.rating,
      }),
    ],
  };

  return (
    <>
      <SEOHead seo={seoConfig} site={siteConfig} />
      <div>{/* Business content */}</div>
    </>
  );
}
```

## Utilities

### SEO Validation

```typescript
import { validateSEOConfig, calculateSEOScore } from '@agency/seo';

// Validate configuration
const validation = validateSEOConfig(seoConfig);
if (!validation.isValid) {
  console.error('SEO errors:', validation.errors);
}

// Calculate SEO score
const { score, suggestions } = calculateSEOScore(seoConfig);
console.log(`SEO Score: ${score}/100`);
console.log('Suggestions:', suggestions);
```

### Content Analysis

```typescript
import {
  extractKeywords,
  generateMetaDescription,
  estimateReadingTime,
  analyzeContentSEO,
} from '@agency/seo';

// Extract keywords from content
const keywords = extractKeywords(content, 8);

// Generate meta description
const description = generateMetaDescription(content, 160);

// Estimate reading time
const readingTime = estimateReadingTime(content);

// Analyze content SEO
const analysis = analyzeContentSEO(content);
console.log('Word count:', analysis.wordCount);
console.log('Reading time:', analysis.readingTime);
console.log('Suggestions:', analysis.suggestions);
```

### URL and Slug Generation

```typescript
import {
  generateSlug,
  formatPhoneNumber,
  generateBreadcrumbs,
} from '@agency/seo';

// Generate SEO-friendly slug
const slug = generateSlug('Digital Marketing Services for 2026');
// Result: 'digital-marketing-services-for-2026'

// Format phone number
const formattedPhone = formatPhoneNumber('1234567890');
// Result: '(123) 456-7890'

// Generate breadcrumbs
const breadcrumbs = generateBreadcrumbs(
  '/services/digital-marketing',
  siteConfig
);
```

## Configuration

### Default Presets

```typescript
import { getSEOPreset, mergeSEOConfig } from '@agency/seo';

// Use built-in presets
const articleConfig = getSEOPreset('article');
const productConfig = getSEOPreset('product');

// Merge with custom configuration
const customSEO = mergeSEOConfig(
  {
    title: 'Custom Title',
    description: 'Custom description',
  },
  'article'
);
```

### Environment Variables

```bash
# Site configuration
NEXT_PUBLIC_SITE_URL=https://your-site.com
NEXT_PUBLIC_SITE_NAME=Your Site Name
NEXT_PUBLIC_TWITTER_HANDLE=@yourhandle

# SEO features
ENABLE_SEO_ANALYTICS=true
ENABLE_STRUCTURED_DATA=true
ENABLE_SITEMAP_GENERATION=true
```

## Best Practices

### 2026 SEO Guidelines

1. **Title Tags**: Keep under 60 characters for optimal display
2. **Meta Descriptions**: Aim for 120-160 characters
3. **Structured Data**: Use JSON-LD format with schema.org
4. **Core Web Vitals**: Optimize LCP, FID, and CLS metrics
5. **Mobile-First**: Ensure mobile optimization
6. **Page Speed**: Target under 2 seconds load time
7. **HTTPS**: Use secure connections
8. **Content Quality**: Minimum 300 words for blog posts

### Implementation Tips

- Use semantic HTML5 elements
- Implement proper heading hierarchy (h1 → h2 → h3)
- Add alt text to all images
- Use descriptive anchor text
- Implement internal linking strategy
- Optimize images for web (WebP format, proper sizing)
- Use lazy loading for images
- Implement caching strategies
- Monitor Core Web Vitals regularly

## Integration Examples

### Next.js App Router

```tsx
// app/layout.tsx
import { SEOHead } from '@agency/seo/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SEOHead seo={globalSEOConfig} site={siteConfig} />
        {children}
      </body>
    </html>
  );
}

// app/[slug]/page.tsx
import { SEOHead } from '@agency/seo/react';

export default function Page({ params }) {
  const pageData = getPageData(params.slug);

  return (
    <>
      <SEOHead seo={pageData.seo} site={siteConfig} />
      <main>{pageData.content}</main>
    </>
  );
}
```

### Astro Pages

```astro
---
import { generateSEOMetaTags } from '@agency/seo/astro';
import Layout from '../layouts/Layout.astro';

const { content } = Astro.props;
const metaTags = generateSEOMetaTags({
  seo: content.seo,
  site: siteConfig
});
---

<Layout>
  <head>
    <Fragment set:html={metaTags} />
  </head>
  <body>
    <article>
      <h1>{content.title}</h1>
      <div set:html={content.content} />
    </article>
  </body>
</Layout>
```

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Include tests for new functionality
4. Update documentation for API changes
5. Consider backwards compatibility

## License

MIT © Marketing Agency

## Support

For questions and support, please open an issue on GitHub.
