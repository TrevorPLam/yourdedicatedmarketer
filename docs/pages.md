# Pages Documentation

This document describes the structure and components of all pages in the firm website.

## Homepage

The homepage (`/`) is the main landing page of the website. It follows a deep module pattern with each section as a standalone component.

### Structure

The homepage consists of the following sections (in order):

1. **Hero** (`components/features/home/hero.tsx`)
   - Headline and subheadline
   - Primary CTA: "Book a Free Consultation" → `/contact`
   - Secondary CTA: "See a Demo Site" → `/demos`
   - Uses gradient background

2. **Three Pillars** (`components/features/home/pillars.tsx`)
   - Three service pillars: Website Design, Local SEO, Paid Advertising
   - Each pillar has an icon, title, and description
   - Links to `/services`
   - Uses Card components from `@repo/ui`

3. **Demo Preview** (`components/features/home/demo-preview.tsx`)
   - Fetches first 3 demos from `getAllDemos()`
   - Renders demo cards with title, description, and content preview
   - "View All Demos" button → `/demos`
   - Async component (server-side data fetching)

4. **How It Works** (`components/features/home/how-it-works.tsx`)
   - 4-step process: Discovery → Design & Build → Launch → Ongoing Support
   - Each step has an icon, title, and description
   - Numbered steps with visual indicators

5. **FAQ Snippet** (`components/features/home/faq-snippet.tsx`)
   - Fetches first 3 FAQs from `getAllFAQs()`
   - Renders FAQ cards with question and answer
   - "View All FAQs" button → `/faq`
   - Async component (server-side data fetching)

6. **Final CTA** (`components/features/home/final-cta.tsx`)
   - Heading: "Ready to Grow Your Business?"
   - Description and consultation booking button
   - Uses primary background color

### Implementation Details

- **Metadata**: Uses `generateMetadata()` from SEO utilities with title, description, and Open Graph tags
- **JSON-LD**: Includes Organization schema for entity identity
- **Components**: All sections use `@repo/ui` primitives (Container, Section, Button, Card)
- **Navigation**: Uses `next/link` with `Route` type for type-safe internal links
- **Data Fetching**: Demo and FAQ sections use async server components to fetch content

### Best Practices

- Each section is a standalone component with a clear interface
- Sections are composable and can be reordered
- Async components for data fetching follow Next.js 15 patterns
- Type-safe navigation links prevent broken routes
- Responsive design with mobile-first approach

## Static Pages

Static pages use the `ContentPage` component pattern for rendering HTML content from MDX files.

### ContentPage Component

The `ContentPage` component (`components/features/content-page.tsx`) is a reusable wrapper for rendering static page content. It follows the deep module pattern by encapsulating content rendering layout.

**Props:**
- `content`: HTML string from content utilities (parsed via gray-matter/remark)
- `title`: Optional title for the page (rendered as H1)

**Features:**
- Wraps content in `Container` and `Section` from `@repo/ui`
- Renders HTML content with `dangerouslySetInnerHTML`
- Applies basic Tailwind spacing classes for content layout
- Handles missing content gracefully

### About Page (`/about`)

- **Path:** `app/(marketing)/about/page.tsx`
- **Content Source:** `src/content/pages/about.mdx`
- **Features:**
  - Fetches content using `getPage('about')` utility
  - Renders with `ContentPage` component
  - Metadata generated via `generateMetadata()` utility
  - Title extracted from frontmatter
  - Handles 404 case when content not found

### Pricing Page (`/pricing`)

- **Path:** `app/(marketing)/pricing/page.tsx`
- **Content Source:** `src/content/pages/pricing.mdx`
- **Features:**
  - Fetches content using `getPage('pricing')` utility
  - Renders with `ContentPage` component
  - Metadata generated via `generateMetadata()` utility
  - Title extracted from frontmatter
  - Handles 404 case when content not found

## Dynamic Pages

Dynamic pages are generated from content collections.

### Service Pages

#### Services Hub (`/services`)

- **Path:** `app/(marketing)/services/page.tsx`
- **Component:** `components/features/services/services-hub.tsx`
- **Content Source:** `src/content/services/*.mdx` (all service files)
- **Features:**
  - Lists all services as cards using `getAllServices()` utility
  - Services sorted by `order` field from frontmatter
  - Each card shows title, description, and links to detail page
  - Responsive grid layout (1 column mobile, 2 columns tablet, 3 columns desktop)
  - Hover effects on cards for better UX
  - Metadata generated via `generateMetadata()` utility

**ServicesHub Component:**
- Props: `title` (optional), `description` (optional)
- Fetches services using `getAllServices()` from content utilities
- Sorts services by order field if available
- Renders cards with `Card`, `CardHeader`, `CardTitle`, `CardContent` from `@repo/ui`
- Uses `next/link` with `Route` type for type-safe navigation
- Follows deep module pattern with simple interface

#### Service Detail Pages (`/services/[slug]`)

- **Path:** `app/(marketing)/services/[slug]/page.tsx`
- **Component:** `components/features/services/service-detail.tsx`
- **Content Source:** `src/content/services/[slug].mdx` (individual service file)
- **Features:**
  - Dynamic route with slug parameter
  - `generateStaticParams()` pre-renders all service pages at build time
  - `generateMetadata()` sets dynamic metadata per service (title, description from frontmatter)
  - `dynamicParams = false` returns 404 for unknown slugs
  - Breadcrumbs implemented with `getBreadcrumbs()` utility
  - Renders MDX content via `ContentPage` pattern
  - Handles 404 case when service not found

**ServiceDetail Component:**
- Props: `content` (HTML string), `title` (string), `slug` (string)
- Generates breadcrumbs using `getBreadcrumbs()` utility
- Renders breadcrumb navigation with semantic HTML
- Uses `ContentPage` component for consistent content layout
- Follows deep module pattern by encapsulating service detail rendering

**Dynamic Page Implementation:**
- `generateStaticParams()`: Fetches all service slugs using `getAllSlugs('services')`
- `generateMetadata()`: Fetches service by slug, generates metadata with title and description
- Default export: Fetches service content, renders with `ServiceDetail`, calls `notFound()` if service doesn't exist
- Uses Next.js 15 async params pattern (params is a Promise)

### Industry Pages (`/industries/[slug]`)

- Generated from `src/content/industries/*.mdx`
- Dynamic route with slug parameter
- Renders industry content with metadata

### Demo Pages (`/demos/[slug]`)

- Generated from `src/content/demos/*.mdx`
- Dynamic route with slug parameter
- Renders demo content with metadata

### FAQ Pages (`/faq`)

- Hub page listing all FAQs by category
- Generated from `src/content/faq/*.mdx`
- Uses accordion component for expandable answers

## Adding New Pages

### Adding a New Static Page

1. Create MDX file in `src/content/pages/`
2. Add frontmatter with title, slug, description
3. Create page component in `app/(marketing)/[slug]/page.tsx`
4. Use `ContentPage` component to render content
5. Add metadata using `generateMetadata()`

### Adding a New Section to Homepage

1. Create component in `components/features/home/[section-name].tsx`
2. Export as named export
3. Import and add to `app/(marketing)/page.tsx`
4. Follow existing patterns for consistency

## Page Metadata

All pages should include:

- Title (50-60 characters recommended)
- Description (150-160 characters recommended)
- Open Graph tags
- Twitter card tags
- Canonical URL
- JSON-LD structured data (where applicable)

Use the `generateMetadata()` utility from `@/lib/seo` for consistent metadata across all pages.
