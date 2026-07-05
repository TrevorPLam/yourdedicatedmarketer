# SEO Infrastructure

This document describes the SEO infrastructure for the firm website, including metadata generation, sitemaps, robots.txt, and JSON-LD structured data.

## Overview

The SEO infrastructure follows Google's best practices for search engine optimization and Answer Engine Optimization (AEO). All SEO utilities are centralized in a deep module pattern, providing a single source of truth for SEO logic.

## Architecture

### File Structure

```
apps/firm-website/src/
├── lib/
│   ├── seo.ts           # Metadata and Open Graph utilities
│   ├── json-ld.ts       # JSON-LD structured data generators
│   └── seo.test.ts      # Unit tests for SEO utilities
└── app/
    ├── sitemap.ts       # Dynamic sitemap.xml generation
    └── robots.ts        # Dynamic robots.txt generation
```

### Key Components

1. **Metadata Generation** (`lib/seo.ts`)
   - `generateMetadata()` - Creates Next.js Metadata objects
   - `getOpenGraphTags()` - Helper for Open Graph tags

2. **Structured Data** (`lib/json-ld.ts`)
   - `generateFAQSchema()` - FAQPage schema for Q&A content
   - `generateOrganizationSchema()` - Organization schema for entity identity
   - `generateBreadcrumbSchema()` - BreadcrumbList schema for navigation

3. **Crawler Directives** (`app/`)
   - `sitemap.ts` - Dynamic sitemap.xml covering all pages
   - `robots.ts` - Dynamic robots.txt with crawler rules

## Usage

### Metadata Generation

Use `generateMetadata()` in your page components to create SEO-optimized metadata:

```typescript
import { generateMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = await getService(params.slug);

  return generateMetadata({
    title: service.data.title,
    description: service.data.description,
    path: `/services/${params.slug}`,
  });
}
```

#### Options

```typescript
interface MetadataOptions {
  title: string;           // Page title (50-60 chars recommended)
  description: string;     // Page description (150-160 chars recommended)
  path: string;            // Relative path (e.g., '/services/website-design')
  image?: string;         // Custom Open Graph image URL
  publishedTime?: string;  // ISO datetime for articles
  modifiedTime?: string;   // ISO datetime for articles
  authors?: string[];     // Article authors
  section?: string;       // Article section
  tags?: string[];         // Article tags
}
```

### Open Graph Tags

For custom Open Graph implementations, use `getOpenGraphTags()`:

```typescript
import { getOpenGraphTags } from '@/lib/seo';

const ogTags = getOpenGraphTags({
  title: 'Page Title',
  description: 'Page description',
  url: 'https://yourdedicatedmarketer.com/page',
  type: 'article',
  publishedTime: '2024-01-01T00:00:00Z',
});
```

### JSON-LD Structured Data

#### FAQPage Schema

Use on FAQ pages to help search engines understand Q&A content:

```typescript
import { generateFAQSchema } from '@/lib/json-ld';

const faqs = [
  { question: 'How much does it cost?', answer: 'Pricing varies...' },
  { question: 'How long does it take?', answer: 'Timeline depends...' },
];

const schema = generateFAQSchema(faqs);

// In your page component:
export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schema }}
      />
      {/* FAQ content */}
    </>
  );
}
```

#### Organization Schema

Use on homepage and About page to establish entity identity:

```typescript
import { generateOrganizationSchema } from '@/lib/json-ld';

const schema = generateOrganizationSchema({
  name: 'Your Dedicated Marketer',
  description: 'Professional digital marketing services',
  url: 'https://yourdedicatedmarketer.com',
  logo: 'https://yourdedicatedmarketer.com/logo.png',
  sameAs: [
    'https://twitter.com/yourdedicatedmarketer',
    'https://linkedin.com/company/yourdedicatedmarketer',
  ],
  address: {
    streetAddress: '123 Main St',
    addressLocality: 'City',
    addressRegion: 'ST',
    postalCode: '12345',
    addressCountry: 'US',
  },
  contactPoint: {
    telephone: '+1-555-555-5555',
    contactType: 'customer service',
    email: 'contact@yourdedicatedmarketer.com',
  },
});
```

#### BreadcrumbList Schema

Use on pages with breadcrumb navigation:

```typescript
import { generateBreadcrumbSchema } from '@/lib/json-ld';
import { getBreadcrumbs } from '@/lib/navigation';

const breadcrumbs = await getBreadcrumbs('website-design');
const schema = generateBreadcrumbSchema(
  breadcrumbs.map((b) => ({
    name: b.label,
    url: b.href ? `https://yourdedicatedmarketer.com${b.href}` : '',
  }))
);
```

### Sitemap

The sitemap is automatically generated at `/sitemap.xml` and includes:

- Static pages (Home, Services, Industries, Demos, Pricing, About, Contact)
- All service pages
- All industry pages
- All demo pages
- All FAQ pages
- All static content pages

The sitemap uses appropriate priorities and change frequencies:
- Homepage: priority 1.0, daily
- Hub pages (Services, Industries, Demos): priority 0.9, weekly
- Service/Industry pages: priority 0.8, weekly
- Demo pages: priority 0.7, monthly
- FAQ pages: priority 0.6, monthly

### Robots.txt

The robots.txt is automatically generated at `/robots.txt` and includes:

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/

Sitemap: https://yourdedicatedmarketer.com/sitemap.xml
```

## Best Practices

### Metadata

- **Title length**: Keep between 50-60 characters for optimal display
- **Description length**: Keep between 150-160 characters for optimal display
- **Canonical URLs**: Always set canonical URLs to prevent duplicate content issues
- **Open Graph images**: Use 1200x630px for optimal social media display
- **Twitter cards**: Use `summary_large_image` for better engagement

### Sitemap

- **URL limit**: Single sitemap max 50,000 URLs or 50MB (current site is well under)
- **Last modified**: Update `lastModified` when content changes
- **Change frequency**: Set appropriately based on how often content updates
- **Priority**: Use to indicate relative importance (0.0-1.0)

### Robots.txt

- **Allow public pages**: Ensure important pages are not blocked
- **Block private areas**: Block API routes, admin dashboards, authenticated areas
- **Sitemap reference**: Always include sitemap URL
- **Environment-specific**: Consider blocking all crawlers in non-production environments

### JSON-LD

- **Validate schemas**: Use Google's Structured Data Testing Tool
- **FAQPage**: Use for Q&A content to target featured snippets
- **Organization**: Establish entity identity for AI search systems
- **BreadcrumbList**: Help search engines understand site structure
- **Absolute URLs**: Always use absolute URLs in structured data

## AEO (Answer Engine Optimization)

AEO optimizes content for AI-powered search engines and voice assistants. Key strategies:

1. **FAQPage Schema**: Helps AI systems extract direct answers
2. **Organization Schema**: Establishes entity identity for knowledge graphs
3. **Clear Q&A Format**: Use question-answer pairs in content
4. **Direct Answers**: Provide concise 40-60 word answers first, then expand

## Testing

Run SEO utility tests:

```bash
pnpm --filter @repo/firm-website test
```

Tests cover:
- Metadata generation with various options
- Open Graph tag generation
- JSON-LD schema generation (FAQPage, Organization, BreadcrumbList)
- Edge cases (empty arrays, missing optional fields)

## Verification

### Check Metadata

```bash
curl -s https://yourdedicatedmarketer.com/services/website-design \
  | grep -E 'og:|twitter:|canonical|description'
```

### Check Sitemap

```bash
curl -s https://yourdedicatedmarketer.com/sitemap.xml | head -30
```

### Check Robots.txt

```bash
curl -s https://yourdedicatedmarketer.com/robots.txt
```

### Validate Structured Data

Use Google's [Structured Data Testing Tool](https://search.google.com/test/rich-results) or [Rich Results Test](https://search.google.com/test/rich-results).

## Deep Module Pattern

The SEO infrastructure follows the deep module pattern:

- **Single source of truth**: All SEO logic centralized in `lib/seo.ts` and `lib/json-ld.ts`
- **Simple interface**: Consumers use typed functions, not complex internals
- **Hidden implementation**: File system operations, schema details hidden behind clean APIs
- **Testable**: Pure functions with clear inputs/outputs enable comprehensive testing

## Anti-Patterns to Avoid

- **Hard-coding URLs**: Use the `SITE_URL` constant and path parameters
- **Duplicating metadata logic**: Use `generateMetadata()` instead of manual metadata objects
- **Skipping canonical URLs**: Always set canonical to prevent duplicate content
- **Outdated sitemaps**: Sitemap is dynamically generated, stays in sync with content
- **Missing structured data**: Use JSON-LD for rich results and AEO
- **Blocking all crawlers**: Never use `Disallow: /` in production robots.txt

## Future Enhancements

Potential improvements for later phases:

- **Dynamic OG images**: Generate Open Graph images using `next/og`
- **Article schema**: Add Article schema for blog posts or case studies
- **LocalBusiness schema**: Add if physical location is emphasized
- **Video schema**: Add if video content is added
- **Product schema**: Add if e-commerce functionality is added
- **Review schema**: Add if customer reviews are collected
- **Event schema**: Add if events/workshops are hosted
