# Content Pipeline Documentation

This document describes the content structure, how to add new content files, and the API for accessing content in the firm website.

## Content Structure

All content is stored in `apps/firm-website/src/content/` with the following directories:

- `services/` - Service offerings (e.g., website design, SEO, consulting)
- `industries/` - Industry-specific content and case studies
- `demos/` - Portfolio items and demo projects
- `faq/` - Frequently asked questions
- `pages/` - Static page content (about, contact, etc.)

## Service Content Structure

Service pages are the core content type for the firm website. Each service is represented as an MDX file with frontmatter metadata and markdown body content.

### Current Services

The following service pages are currently available:

1. **Website Design & Development** (`website-design.mdx`) - Anchor service, 800-1000+ words, order 1, featured
2. **Local SEO Services** (`local-seo.mdx`) - Local SEO bundle, 400-600 words, order 2
3. **Paid Ads Management** (`paid-ads.mdx`) - Lead acceleration bundle, 400-600 words, order 3
4. **Email & SMS Marketing** (`email-sms.mdx`) - Retention starter bundle, 400-600 words, order 4
5. **Copywriting & Branding** (`copywriting-branding.mdx`) - Build-time add-ons, 400-600 words, order 5
6. **Hosting & Care Plan** (`hosting-care.mdx`) - Monthly retainer, 400-600 words, order 6

### Service File Format

Each service MDX file includes:

- **Frontmatter fields**:
  - `title` - Display title of the service
  - `slug` - URL-friendly identifier
  - `description` - Short description for SEO and previews
  - `featured` - Boolean flag for prominent display (optional)
  - `order` - Display order for sorting (optional)

- **Content sections**:
  - Service overview and value proposition
  - Pricing information with market context
  - Service features and deliverables
  - Target audience and use cases
  - Process or methodology
  - Call-to-action

### Adding New Services

To add a new service:

1. Create a new `.mdx` file in `apps/firm-website/src/content/services/`
2. Add frontmatter with required fields (`title`, `slug`, `description`)
3. Include optional fields (`featured`, `order`) as needed
4. Write the content body following the established structure
5. Update the service list in this documentation
6. The content will be automatically available through `getAllServices()` and `getService(slug)`

### Content Guidelines

- **Word count**: Anchor service (website design) should be 800-1000+ words; other services 400-600 words
- **Tone**: Professional, customer-focused, benefit-oriented
- **Structure**: Use clear headings, bullet points, and sections for readability
- **SEO**: Include relevant keywords naturally in headings and body content
- **Pricing**: Include pricing context and market positioning when applicable
- **CTA**: End with a clear call-to-action

## Industry Content Structure

Industry pages showcase the firm's expertise across different business sectors. Each industry is represented as an MDX file with frontmatter metadata and markdown body content.

### Current Industries

The following industry pages are currently available:

1. **Home Service & Trades** (`home-services.mdx`) - Plumbers, electricians, HVAC, order 1, icon 🔧
2. **Medical & Wellness Clinics** (`medical.mdx`) - Medical clinics, dental practices, order 2, icon 🏥
3. **Personal Services** (`personal-services.mdx`) - Salons, spas, fitness studios, order 3, icon 💇
4. **Professional Services** (`professional-services.mdx`) - Law firms, accountants, consultants, order 4, icon ⚖️
5. **Restaurants & Food Service** (`restaurants.mdx`) - Restaurants, cafes, food trucks, order 5, icon 🍽️
6. **Retail & Local Shops** (`retail.mdx`) - Retail stores, boutiques, local shops, order 6, icon 🛍️

### Industry File Format

Each industry MDX file includes:

- **Frontmatter fields**:
  - `title` - Display title of the industry
  - `slug` - URL-friendly identifier
  - `description` - Short description for SEO and previews
  - `icon` - Icon for the industry (emoji or icon identifier)
  - `order` - Display order for sorting (optional)

- **Content sections**:
  - Industry-specific pain points and challenges
  - Why this industry needs specialized web design
  - What's included for this industry (features, integrations)
  - Link to relevant demo/proof-of-concept
  - FAQ section with AEO format
  - Call-to-action

### Adding New Industries

To add a new industry:

1. Create a new `.mdx` file in `apps/firm-website/src/content/industries/`
2. Add frontmatter with required fields (`title`, `slug`, `description`, `icon`)
3. Include optional field (`order`) as needed
4. Write the content body following the established structure
5. Update the industry list in this documentation
6. The content will be automatically available through `getAllIndustries()` and `getIndustry(slug)`

### Industry Content Guidelines

- **Word count**: 400-600 words per industry page
- **Tone**: Industry-specific, addressing unique pain points and solutions
- **Structure**: Use clear headings, bullet points, and sections for readability
- **Differentiation**: Each industry must be distinct with specific pain points and solutions
- **Cross-linking**: Link to relevant demo/proof-of-concept pages
- **FAQ**: Include industry-specific questions in AEO format

## Demo Content Structure

Demo pages showcase portfolio items and proof-of-concept projects. Each demo is represented as an MDX file with frontmatter metadata and markdown body content.

### Current Demos

The following demo pages are currently available:

1. **Plumbing Business Website** (`plumbing.mdx`) - Home service demo, industry "home-services"
2. **Dental Clinic Website** (`dental.mdx`) - Medical demo, industry "medical"
3. **Salon & Spa Website** (`salon.mdx`) - Personal services demo, industry "personal-services"
4. **Law Firm Website** (`law-firm.mdx`) - Professional services demo, industry "professional-services"
5. **Restaurant Website** (`restaurant.mdx`) - Restaurant demo, industry "restaurants"
6. **Retail Shop Website** (`retail-shop.mdx`) - Retail demo, industry "retail"

## FAQ Content Structure

FAQ pages provide answers to common questions about pricing, process, and general inquiries. Each FAQ is represented as an MDX file with frontmatter metadata and markdown body content following AEO (Answer Engine Optimization) format.

### Current FAQs

The following FAQ pages are currently available:

1. **How much does a website cost for a small business in DFW?** (`cost.mdx`) - Pricing category, order 1
2. **How long does it take to build a website?** (`timeline.mdx`) - Process category, order 2
3. **Do I own my website once it's built?** (`ownership.mdx`) - General category, order 3
4. **What if I need changes after launch?** (`revisions.mdx`) - Pricing category, order 4
5. **Will my website rank on Google?** (`seo.mdx`) - General category, order 5
6. **What's included in the Hosting & Care Plan?** (`care-plan.mdx`) - Pricing category, order 6
7. **Are there any hidden fees?** (`hidden-fees.mdx`) - Pricing category, order 7
8. **Do I have to sign a long-term contract?** (`contract.mdx`) - General category, order 8
9. **What industries do you serve?** (`industries.mdx`) - General category, order 9
10. **What's the process for building a website?** (`process.mdx`) - Process category, order 10

### FAQ File Format

Each FAQ MDX file includes:

- **Frontmatter fields**:
  - `title` - Display title (the question)
  - `slug` - URL-friendly identifier
  - `description` - Short description for SEO and previews
  - `category` - Category for grouping ('general' | 'pricing' | 'process')
  - `order` - Display order for sorting

- **Content sections**:
  - Direct answer (40-60 words) - AEO format for answer engine extraction
  - Expanded details and context
  - Supporting information and examples
  - Clear, actionable information

### Adding New FAQs

To add a new FAQ:

1. Create a new `.mdx` file in `apps/firm-website/src/content/faq/`
2. Add frontmatter with required fields (`title`, `slug`, `description`, `category`, `order`)
3. Write the content body following AEO format (direct answer first, then expansion)
4. Update the FAQ list in this documentation
5. The content will be automatically available through `getAllFAQs()` and `getFAQ(slug)`

### FAQ Content Guidelines

- **AEO Format**: Start with a direct 40-60 word answer before any context or preamble
- **Categories**: Use 'general', 'pricing', or 'process' for consistent grouping
- **Tone**: Direct, honest, and transparent - avoid evasive answers
- **Structure**: Use clear headings, bullet points, and sections for readability
- **Honesty**: Address tough questions directly; don't avoid difficult topics
- **Actionability**: Provide clear, actionable information in each answer

### Demo File Format

Each demo MDX file includes:

- **Frontmatter fields**:
  - `title` - Display title of the demo
  - `slug` - URL-friendly identifier
  - `description` - Short description for SEO and previews
  - `industry` - The industry this demo relates to (slug reference)

- **Content sections**:
  - The Situation - Context and background
  - The Challenge - Problems and constraints
  - The Approach - Solutions and design decisions
  - The Outcome - Results and impact

### Adding New Demos

To add a new demo:

1. Create a new `.mdx` file in `apps/firm-website/src/content/demos/`
2. Add frontmatter with required fields (`title`, `slug`, `description`, `industry`)
3. Write the content body following the established structure (Situation, Challenge, Approach, Outcome)
4. Update the demo list in this documentation
5. The content will be automatically available through `getAllDemos()` and `getDemo(slug)`

### Demo Content Guidelines

- **Word count**: 300-500 words per demo page
- **Tone**: Professional, honest about proof-of-concept nature
- **Structure**: Use clear section headings (Situation, Challenge, Approach, Outcome)
- **Honesty**: Clearly state these are proof-of-concepts, not fabricated metrics
- **Differentiation**: Each demo must be distinct with industry-specific challenges and solutions
- **Industry linking**: Link back to the corresponding industry page

## Content File Format

Each content file is an MDX file (`.mdx`) with YAML frontmatter. The frontmatter contains metadata, and the body contains the content in Markdown/MDX format.

### Example: Service File

```mdx
---
title: "Website Design"
slug: "website-design"
description: "Professional website design services..."
featured: true
order: 1
---

We create beautiful, functional websites...
```

## Content Types

Content types are defined in `packages/lib/src/types/content.ts` and exported from `@repo/lib`. They use TypeScript interfaces with branded types for type safety.

### Service

Interface: `Service`

Fields:
- `title` (string, required) - Display title
- `slug` (Slug, required) - URL-friendly identifier (branded type)
- `description` (string, required) - Short description
- `body` (string, required) - Full body content
- `featured` (boolean, optional) - Whether to feature prominently
- `order` (number, optional) - Display order

### Industry

Interface: `Industry`

Fields:
- `title` (string, required) - Display title
- `slug` (Slug, required) - URL-friendly identifier (branded type)
- `description` (string, required) - Short description
- `body` (string, required) - Full body content
- `featured` (boolean, optional) - Whether to feature prominently
- `order` (number, optional) - Display order
- `icon` (string, optional) - Icon for the industry (emoji or icon identifier)

### Demo

Interface: `Demo`

Fields:
- `title` (string, required) - Display title
- `slug` (Slug, required) - URL-friendly identifier (branded type)
- `description` (string, required) - Short description
- `challenge` (string, required) - The challenge this demo addresses
- `approach` (string, required) - The approach taken to solve the challenge
- `outcome` (string, required) - The outcome or results achieved
- `industry` (Slug, required) - The industry this demo relates to

### FAQ

Interface: `FAQ`

Fields:
- `question` (string, required) - The question
- `answer` (string, required) - Short answer (40-60 words)
- `category` (FAQCategory, required) - Category for grouping ('general' | 'pricing' | 'process')
- `order` (number, optional) - Display order

### Page

Interface: `Page`

Fields:
- `title` (string, required) - Display title
- `slug` (Slug, required) - URL-friendly identifier (branded type)
- `description` (string, required) - Short description
- `body` (string, required) - Full body content

### Branded Types

The `Slug` type is a branded type that prevents accidental substitution of regular strings where slugs are expected:

```typescript
export type Slug = string & { __brand: 'slug' };
```

This provides compile-time type safety to ensure that only validated slugs are used in content-related operations.

## Content API

The content utilities are located in `apps/firm-website/src/lib/content.ts`.

### Core Functions

- `getAllSlugs(dir: string)` - Returns an array of all slugs in a directory
- `getContentBySlug<T>(dir: string, slug: string)` - Returns parsed content for a specific slug
- `getAllContent<T>(dir: string)` - Returns all content items from a directory

### Caching

The content utilities use an in-memory cache (Map) to avoid repeated file reads. When `getContentBySlug` is called, it first checks the cache before reading from the file system. This improves performance for repeated requests to the same content.

The cache key is formatted as `{dir}:{slug}`, ensuring that content from different directories is cached separately.

### Type-Specific Helpers

Services:
- `getAllServices()` - Get all services
- `getService(slug: string)` - Get a specific service

Industries:
- `getAllIndustries()` - Get all industries
- `getIndustry(slug: string)` - Get a specific industry

Demos:
- `getAllDemos()` - Get all demos
- `getDemo(slug: string)` - Get a specific demo

FAQs:
- `getAllFAQs()` - Get all FAQs
- `getFAQ(slug: string)` - Get a specific FAQ

Pages:
- `getAllPages()` - Get all pages
- `getPage(slug: string)` - Get a specific page

## Usage Example

```typescript
import { getAllServices, getService } from '@/lib/content';
import type { Service } from '@/types/content';

// Get all services
const services = await getAllServices();

// Get a specific service
const websiteDesign = await getService('website-design');

if (websiteDesign) {
  console.log(websiteDesign.data.title); // "Website Design"
  console.log(websiteDesign.content); // HTML content
}
```

## Adding New Content

1. Create a new `.mdx` file in the appropriate directory
2. Add frontmatter with required fields
3. Write the content body in Markdown/MDX format
4. The content will be automatically available through the API

## Zod Schema Validation

The content types have corresponding Zod schemas for runtime validation. These schemas are defined in `packages/lib/src/schemas/content.ts` and can be used to validate content data at runtime.

### Available Schemas

- `ServiceSchema` - Validates service content
- `IndustrySchema` - Validates industry content
- `DemoSchema` - Validates demo content
- `FAQSchema` - Validates FAQ content
- `PageSchema` - Validates page content

### Usage Example

```typescript
import { ServiceSchema } from '@repo/lib';

// Validate service data
const serviceData = {
  title: 'Website Design',
  slug: 'website-design',
  description: 'Professional website design services',
  body: 'We create beautiful, functional websites...',
};

const validatedService = ServiceSchema.parse(serviceData);
// If validation fails, Zod will throw an error with detailed information
```

### Schema Features

- **Strict validation**: All schemas use `.strict()` to reject unknown fields
- **Optional fields**: Optional fields are marked with `.optional()`
- **Type inference**: TypeScript types can be inferred from schemas using `z.infer<typeof SchemaName>`

### Best Practices

- Use schemas to validate content at the boundary (e.g., when parsing markdown files)
- Use `safeParse()` instead of `parse()` when you need to handle validation errors gracefully
- Keep schemas in sync with TypeScript interfaces in `apps/firm-website/src/types/content.ts`

## MDX Configuration

The firm website supports MDX (Markdown + JSX) for creating rich, interactive content. MDX allows you to use React components directly in your markdown files.

### Setup

MDX is configured using `@next/mdx` in the Next.js app. The configuration includes:

1. **Dependencies**: `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `@types/mdx`
2. **Next.js Config**: `apps/firm-website/next.config.ts` is configured with `createMDX` and `pageExtensions` includes `.md` and `.mdx`
3. **MDX Components**: `apps/firm-website/mdx-components.tsx` maps UI components for use in MDX files

### Available MDX Components

The following UI components from `@repo/ui` are available in MDX files:

- `Button` - Button component with variants (default, outline, ghost, etc.)
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` - Card components
- `Container` - Container with maxWidth options
- `Section` - Section component with padding
- `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` - Accordion components

### Creating MDX Content

MDX files should be placed in `src/content/` directories (e.g., `src/content/pages/`). Use the `.mdx` extension.

Example MDX file:

```mdx
---
title: Sample Page
slug: sample-page
---

# Sample MDX Content

<Button variant="default">Click Me</Button>

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content here</p>
  </CardContent>
</Card>
```

### Using MDX in Pages

Import and render MDX files directly in your page components:

```typescript
import SampleMDX from '@/content/pages/sample.mdx';

export default function Page() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <SampleMDX />
    </div>
  );
}
```

### Type Declarations

TypeScript declarations for `.mdx` files are included in `src/global.d.ts` to ensure proper type checking.

## Notes

- All content functions are server-side only (Node.js)
- Markdown is automatically converted to HTML using `remark` and `remark-html`
- Frontmatter is parsed using `gray-matter`
- MDX files can use React components directly in markdown
- TypeScript types are defined in `src/types/content.ts`
- Zod schemas are defined in `packages/lib/src/schemas/content.ts` for runtime validation
