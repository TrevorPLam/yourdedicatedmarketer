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

### Industry Pages

#### Industries Hub (`/industries`)

- **Path:** `app/(marketing)/industries/page.tsx`
- **Component:** `components/features/industries/industries-hub.tsx`
- **Content Source:** `src/content/industries/*.mdx` (all industry files)
- **Features:**
  - Lists all industries as cards using `getAllIndustries()` utility
  - Industries sorted by `order` field from frontmatter
  - Each card shows icon (if available), title, description, and links to detail page
  - Responsive grid layout (1 column mobile, 2 columns tablet, 3 columns desktop)
  - Hover effects on cards for better UX
  - Metadata generated via `generateMetadata()` utility

**IndustriesHub Component:**
- Props: `title` (optional), `description` (optional)
- Fetches industries using `getAllIndustries()` from content utilities
- Sorts industries by order field if available
- Renders cards with `Card`, `CardHeader`, `CardTitle`, `CardContent` from `@repo/ui`
- Displays icon from frontmatter if available (emoji or icon identifier)
- Uses `next/link` with `Route` type for type-safe navigation
- Follows deep module pattern with simple interface

#### Industry Detail Pages (`/industries/[slug]`)

- **Path:** `app/(marketing)/industries/[slug]/page.tsx`
- **Component:** `components/features/industries/industry-detail.tsx`
- **Content Source:** `src/content/industries/[slug].mdx` (individual industry file)
- **Features:**
  - Dynamic route with slug parameter
  - `generateStaticParams()` pre-renders all industry pages at build time
  - `generateMetadata()` sets dynamic metadata per industry (title, description from frontmatter)
  - `dynamicParams = false` returns 404 for unknown slugs
  - Breadcrumbs implemented with `getBreadcrumbs()` utility
  - Renders MDX content via `ContentPage` pattern
  - "See it in Action" section links to matching demo page when available
  - Handles 404 case when industry not found

**IndustryDetail Component:**
- Props: `content` (HTML string), `title` (string), `slug` (string)
- Generates breadcrumbs using `getBreadcrumbs()` utility
- Renders breadcrumb navigation with semantic HTML
- Uses `ContentPage` component for consistent content layout
- Finds matching demo page using `getAllDemos()` and industry slug
- Displays "See it in Action" call-to-action with link to demo when available
- Follows deep module pattern by encapsulating industry detail rendering

**Dynamic Page Implementation:**
- `generateStaticParams()`: Fetches all industry slugs using `getAllSlugs('industries')`
- `generateMetadata()`: Fetches industry by slug, generates metadata with title and description
- Default export: Fetches industry content, renders with `IndustryDetail`, calls `notFound()` if industry doesn't exist
- Uses Next.js 15 async params pattern (params is a Promise)

### Demo Pages

#### Demos Hub (`/demos`)

- **Path:** `app/(marketing)/demos/page.tsx`
- **Component:** `components/features/demos/demos-hub.tsx`
- **Content Source:** `src/content/demos/*.mdx` (all demo files)
- **Features:**
  - Lists all demos as cards using `getAllDemos()` utility
  - Demos sorted alphabetically by title
  - Each card shows title, description, industry, and links to detail page
  - Responsive grid layout (1 column mobile, 2 columns tablet, 3 columns desktop)
  - Hover effects on cards for better UX
  - Metadata generated via `generateMetadata()` utility

**DemosHub Component:**
- Props: `title` (optional), `description` (optional)
- Fetches demos using `getAllDemos()` from content utilities
- Sorts demos alphabetically by title
- Renders cards with `Card`, `CardHeader`, `CardTitle`, `CardContent` from `@repo/ui`
- Displays industry from frontmatter with formatted text (kebab-case to title case)
- Uses `next/link` with `Route` type for type-safe navigation
- Follows deep module pattern with simple interface

#### Demo Detail Pages (`/demos/[slug]`)

- **Path:** `app/(marketing)/demos/[slug]/page.tsx`
- **Component:** `components/features/demos/demo-detail.tsx`
- **Content Source:** `src/content/demos/[slug].mdx` (individual demo file)
- **Features:**
  - Dynamic route with slug parameter
  - `generateStaticParams()` pre-renders all demo pages at build time
  - `generateMetadata()` sets dynamic metadata per demo (title, description from frontmatter)
  - `dynamicParams = false` returns 404 for unknown slugs
  - Breadcrumbs implemented with `getBreadcrumbs()` utility
  - Renders MDX content via `ContentPage` pattern
  - "Learn More About This Industry" section links to matching industry page when available
  - "View Live Demo" placeholder button (disabled, "Coming Soon")
  - Handles 404 case when demo not found

**DemoDetail Component:**
- Props: `content` (HTML string), `title` (string), `slug` (string), `industry` (string)
- Generates breadcrumbs using `getBreadcrumbs()` utility
- Renders breadcrumb navigation with semantic HTML
- Uses `ContentPage` component for consistent content layout
- Finds matching industry page using `getAllIndustries()` and industry slug
- Displays "Learn More About This Industry" call-to-action with link to industry when available
- Displays "View Live Demo" placeholder with disabled button (coming soon)
- Follows deep module pattern by encapsulating demo detail rendering

**Dynamic Page Implementation:**
- `generateStaticParams()`: Fetches all demo slugs using `getAllSlugs('demos')`
- `generateMetadata()`: Fetches demo by slug, generates metadata with title and description
- Default export: Fetches demo content, renders with `DemoDetail`, calls `notFound()` if demo doesn't exist
- Uses Next.js 15 async params pattern (params is a Promise)

### FAQ Pages

#### FAQ Hub (`/faq`)

- **Path:** `app/(marketing)/faq/page.tsx`
- **Component:** `components/features/faq/faq-hub.tsx`
- **Content Source:** `src/content/faq/*.mdx` (all FAQ files)
- **Features:**
  - Lists all FAQs grouped by category using `getAllFAQs()` utility
  - Categories: `general`, `pricing`, `process`
  - FAQs sorted by `order` field from frontmatter within each category
  - Uses Accordion component from `@repo/ui` for expandable answers
  - FAQPage JSON-LD schema injected for SEO and AI citations
  - Category display names mapped to user-friendly labels
  - Metadata generated via `generateMetadata()` utility

**FAQHub Component:**
- Props: `title` (optional), `description` (optional)
- Fetches FAQs using `getAllFAQs()` from content utilities
- Groups FAQs by category field from frontmatter
- Sorts FAQs within each category by order field if available
- Renders category headings with FAQAccordion component
- Generates FAQPage JSON-LD schema using `generateFAQSchema()` utility
- Injects JSON-LD via `<script type="application/ld+json">` tag
- Follows deep module pattern by encapsulating FAQ listing, grouping, and schema generation

**FAQAccordion Component:**
- Props: `faqs` (array of FAQ items with question and answer)
- Renders FAQs using Accordion, AccordionItem, AccordionTrigger, AccordionContent from `@repo/ui`
- Uses Radix UI's Accordion primitive with proper ARIA accessibility
- Answers rendered as HTML via `dangerouslySetInnerHTML` (from content utilities)
- Single collapsible accordion type (only one item open at a time)
- Follows deep module pattern with simple interface

**FAQ Page Implementation:**
- Default export: Renders `FAQHub` component
- `generateMetadata()`: Generates metadata with title and description
- Server component (async data fetching)
- No dynamic routing (hub page only, no individual FAQ pages)

### Contact Page (`/contact`)

- **Path:** `app/(marketing)/contact/page.tsx`
- **Component:** `components/features/contact/contact-form.tsx`
- **Server Action:** `app/actions/contact.ts`
- **Features:**
  - Contact form with fields: Name, Email, Phone (optional), Company (optional), Message
  - Server-side validation using Zod schema
  - React 19 `useActionState` for form state management
  - `useFormStatus` for loading state on submit button
  - Field-level validation errors displayed next to inputs
  - Success/error messages shown after submission
  - Contact information displayed below form (email, phone, address, hours)
  - Metadata generated via `generateMetadata()` utility

**ContactForm Component:**
- Props: None (encapsulated component)
- Client component (uses React hooks: `useActionState`, `useFormStatus`)
- Uses `Input`, `Textarea`, `Label`, `Button` from `@repo/ui`
- Form fields: name (required), email (required), phone (optional), company (optional), message (required)
- Validation errors displayed as red text below each field
- Submit button shows "Sending..." during submission, "Send Message" otherwise
- Success message shown in green, error message in red
- Form resets on successful submission (via `useActionState` state management)
- Follows deep module pattern by encapsulating form logic and state

**Server Action (`submitContact`):**
- Path: `app/actions/contact.ts`
- Uses `'use server'` directive for Next.js Server Actions
- Zod schema validates: name (min 2 chars), email (valid email), phone (optional), company (optional), message (min 10 chars)
- Returns `ContactFormState` interface with: success (boolean), message (string), errors (Record<string, string[]>)
- On validation failure: returns field errors via `result.error.flatten().fieldErrors`
- On success: logs submission data (placeholder for email sending in Phase 4)
- Currently logs to console; email sending deferred to Phase 4 (P022)
- Follows deep module pattern by encapsulating validation and submission logic

**Contact Page Implementation:**
- Default export: Server component rendering `ContactForm` in a card layout
- Contact information displayed in a 2-column grid below the form
- `generateMetadata()`: Generates metadata with title and description
- Responsive design with centered container and max-width constraint
- No dynamic routing (single contact page)

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

## Loading States and Error Handling

The marketing route group (`app/(marketing)/`) includes loading states and error boundaries to improve user experience.

### Loading State (`loading.tsx`)

- **Path:** `app/(marketing)/loading.tsx`
- **Component:** Server component (no `"use client"` directive)
- **Features:**
  - Automatically shown by Next.js when a page is loading
  - Uses Skeleton component from `@repo/ui` for placeholder UI
  - Mimics page structure: hero section, section with cards, card grid, CTA section
  - Animated pulse effect via Tailwind's `animate-pulse` utility
  - Prevents layout shifts by matching actual page dimensions

**Skeleton Component:**
- Exported from `@repo/ui` as `Skeleton`
- Accepts `className` prop for customization
- Uses `animate-pulse` and `bg-muted` for shimmer effect
- Rounded corners match actual UI elements
- Reusable across the application

### Error Boundary (`error.tsx`)

- **Path:** `app/(marketing)/error.tsx`
- **Component:** Client component (uses `"use client"` directive)
- **Features:**
  - Catches rendering errors in the marketing route group
  - Displays user-friendly error message
  - "Try again" button calls `reset()` to retry rendering
  - "Go to homepage" button for navigation fallback
  - Logs errors to console for debugging
  - Shows error details in development mode only (via `details` element)
  - Production mode hides technical details for security

**Error Boundary Props:**
- `error`: Error object with optional `digest` field
- `reset`: Function to reset error boundary and retry rendering

**Best Practices:**
- Error boundary is client component (required by React)
- Loading state is server component (can be server-side)
- Skeleton mimics actual page structure to prevent CLS
- Error messages are user-friendly, not technical
- Development mode shows error details for debugging
- Production mode hides error details for security

## Page Metadata

All pages should include:

- Title (50-60 characters recommended)
- Description (150-160 characters recommended)
- Open Graph tags
- Twitter card tags
- Canonical URL
- JSON-LD structured data (where applicable)

Use the `generateMetadata()` utility from `@/lib/seo` for consistent metadata across all pages.
