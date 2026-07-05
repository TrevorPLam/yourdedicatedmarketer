# Content Pipeline Documentation

This document describes the content structure, how to add new content files, and the API for accessing content in the firm website.

## Content Structure

All content is stored in `apps/firm-website/src/content/` with the following directories:

- `services/` - Service offerings (e.g., website design, SEO, consulting)
- `industries/` - Industry-specific content and case studies
- `demos/` - Portfolio items and demo projects
- `faq/` - Frequently asked questions
- `pages/` - Static page content (about, contact, etc.)

## Content File Format

Each content file is a Markdown file (`.md`) with YAML frontmatter. The frontmatter contains metadata, and the body contains the content in Markdown format.

### Example: Service File

```markdown
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

### Service

Fields:
- `title` (string, required) - Display title
- `slug` (string, required) - URL-friendly identifier
- `description` (string, required) - Short description
- `featured` (boolean, optional) - Whether to feature prominently
- `order` (number, optional) - Display order

### Industry

Fields:
- `title` (string, required) - Display title
- `slug` (string, required) - URL-friendly identifier
- `description` (string, required) - Short description
- `featured` (boolean, optional) - Whether to feature prominently
- `order` (number, optional) - Display order

### Demo

Fields:
- `title` (string, required) - Display title
- `slug` (string, required) - URL-friendly identifier
- `description` (string, required) - Short description
- `liveUrl` (string, optional) - URL to live demo
- `repoUrl` (string, optional) - URL to repository
- `thumbnail` (string, optional) - Path to thumbnail image
- `featured` (boolean, optional) - Whether to feature prominently
- `order` (number, optional) - Display order

### FAQ

Fields:
- `question` (string, required) - The question
- `slug` (string, required) - URL-friendly identifier
- `answer` (string, required) - The answer
- `category` (string, optional) - Category for grouping
- `order` (number, optional) - Display order

### Page

Fields:
- `title` (string, required) - Display title
- `slug` (string, required) - URL-friendly identifier
- `description` (string, optional) - Short description
- `metaTitle` (string, optional) - SEO meta title
- `metaDescription` (string, optional) - SEO meta description

## Content API

The content utilities are located in `apps/firm-website/src/lib/content.ts`.

### Core Functions

- `getAllSlugs(dir: string)` - Returns an array of all slugs in a directory
- `getContentBySlug<T>(dir: string, slug: string)` - Returns parsed content for a specific slug
- `getAllContent<T>(dir: string)` - Returns all content items from a directory

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

1. Create a new `.md` file in the appropriate directory
2. Add frontmatter with required fields
3. Write the content body in Markdown
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
