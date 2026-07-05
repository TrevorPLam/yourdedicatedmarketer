# Architecture

This document describes the system architecture, design decisions, and technical choices for the Your Dedicated Marketer monorepo.

## High-Level Architecture

The project follows a monorepo architecture using Turborepo for task orchestration and pnpm workspaces for dependency management. This approach enables:

- **Code sharing** across applications and packages
- **Unified tooling** with consistent linting, testing, and build processes
- **Efficient caching** to avoid redundant work
- **Atomic commits** that span multiple packages

## Monorepo Design

### Directory Structure

```
.
├── apps/
│   └── firm-website/     # Next.js 15 marketing website
├── packages/
│   ├── ui/               # Shared UI components (shadcn/ui)
│   ├── lib/              # Shared utility libraries and schemas
│   ├── eslint-config/    # Shared ESLint configuration
│   ├── typescript-config/# Shared TypeScript configuration
│   └── tailwind-config/  # Shared Tailwind CSS configuration
├── docs/                 # Project documentation
└── .github/              # GitHub Actions workflows
```

### Package Boundaries

The monorepo is organized into clear bounded contexts:

- **firm-website**: The marketing website application - a Next.js app that consumes shared packages
- **ui**: Reusable UI components built on shadcn/ui - provides a consistent design system
- **lib**: Shared utilities, schemas, and types - provides common functionality across apps
- **Config packages**: Shared configuration for ESLint, TypeScript, and Tailwind - ensures consistency

### Dependency Flow

```
firm-website → ui → lib
firm-website → lib
firm-website → eslint-config
firm-website → typescript-config
firm-website → tailwind-config
```

Applications depend on packages, but packages do not depend on applications. This ensures packages remain reusable and testable in isolation.

## Technology Stack

### Core Technologies

- **Next.js 15**: React framework with App Router, Server Components, and optimized performance
- **React 19**: Latest React with concurrent features and improved performance
- **TypeScript**: Type-safe development with strict mode enabled
- **Tailwind CSS v4**: Utility-first CSS with the new PostCSS-based architecture

### Build Tooling

- **Turborepo**: Task orchestration with caching and dependency awareness
- **pnpm**: Fast, disk-space efficient package manager with strict dependency management
- **Next.js Compiler**: Built-in Rust-based compiler for fast builds

### Testing

- **Vitest**: Fast unit testing with native ESM support
- **Playwright**: E2E testing with cross-browser support
- **@testing-library/react**: Component testing utilities

### Content Management

- **MDX (Markdown + JSX)**: Content stored as `.mdx` files with React component support
- **Frontmatter**: YAML metadata for content properties (title, slug, description, etc.)
- **gray-matter**: Frontmatter parsing library
- **remark + remark-html**: Markdown to HTML conversion
- **Zod**: Runtime schema validation for content types
- **In-memory caching**: Map-based cache to avoid repeated file reads

## Layout Architecture

The Next.js App Router uses a hierarchical layout system with route groups to organize layouts by concern.

### Layout Hierarchy

```
app/
├── layout.tsx              # Root layout (global providers only)
└── (marketing)/            # Route group (no URL path impact)
    ├── layout.tsx          # Marketing layout (Header + Footer)
    └── page.tsx            # Homepage
```

### Root Layout

The root layout (`app/layout.tsx`) is minimal and contains only global providers:

- `<html>` and `<body>` tags with `suppressHydrationWarning`
- `ThemeProvider` from `@repo/ui` for dark/light theme support
- Font configuration (Inter)
- Metadata configuration

**Purpose**: Provides global context and providers that apply to all routes.

### Marketing Route Group

The `(marketing)` route group (`app/(marketing)/`) organizes marketing pages without affecting URL paths:

- **Marketing layout** (`layout.tsx`): Contains `Header` and `Footer` from `@repo/ui`
- **Navigation**: Uses `getNavItems()` from navigation utilities for data-driven navigation
- **Footer**: Includes contact info, navigation links, and social links
- **Pages**: All marketing pages (home, services, industries, etc.) live in this group

**Purpose**: Provides consistent page structure (header/footer) for marketing pages.

### Route Group Benefits

- **No URL impact**: Parentheses in directory names prevent route segments from affecting URL paths
- **Layout separation**: Different concerns can have different layouts
- **Code organization**: Related pages are grouped together
- **Shared layout**: All pages in the group inherit the group layout

### Layout Composition

When a page in the `(marketing)` group is rendered:

1. Root layout wraps with `ThemeProvider`
2. Marketing layout wraps with `Header` and `Footer`
3. Page content renders in the middle

This follows the deep module principle: each layout has a single, clear responsibility.

## Content Architecture

The content architecture follows a file-based approach with static generation, enabling fast build times and easy content management without a database.

### Content Structure

All content is stored in `apps/firm-website/src/content/` with the following directory structure:

```
src/content/
├── services/       # Service offerings (6 files)
├── industries/     # Industry-specific content (6 files)
├── demos/          # Portfolio/proof-of-concept items (6 files)
├── faq/            # Frequently asked questions (10 files)
└── pages/          # Static page content (2 files)
```

### MDX Format

Each content file is an MDX file (`.mdx`) that combines:
- **YAML frontmatter** for metadata
- **Markdown/MDX body** for content
- **React components** for interactive elements

Example structure:
```mdx
---
title: "Website Design"
slug: "website-design"
description: "Professional website design services"
featured: true
order: 1
---

# Website Design

We create beautiful, functional websites...

<Button variant="default">Get Started</Button>
```

### Frontmatter Schema

Each content type has specific frontmatter fields:

**Services**: `title`, `slug`, `description`, `featured?`, `order?`
**Industries**: `title`, `slug`, `description`, `icon?`, `order?`
**Demos**: `title`, `slug`, `description`, `industry`
**FAQs**: `title`, `slug`, `description`, `category`, `order?`
**Pages**: `title`, `slug`, `description`

### Content Types and Validation

TypeScript interfaces are defined in `packages/lib/src/types/content.ts` with branded types for type safety:

```typescript
export type Slug = string & { __brand: 'slug' };

interface Service {
  title: string;
  slug: Slug;
  description: string;
  body: string;
  featured?: boolean;
  order?: number;
}
```

Zod schemas in `packages/lib/src/schemas/content.ts` provide runtime validation for content data.

### Content Utilities

Server-side utility functions in `apps/firm-website/src/lib/content.ts` provide:

- `getAllContent(dir)` - Read all `.mdx` files from a directory
- `getContentBySlug(dir, slug)` - Get a single content item
- `getAllSlugs(dir)` - Get all slugs from a directory
- Type-specific helpers: `getServices()`, `getIndustries()`, `getDemos()`, `getFAQs()`, `getPages()`

These utilities use:
- Node.js `fs` and `path` for file operations (server-only)
- `gray-matter` for frontmatter parsing
- In-memory `Map` cache to avoid repeated file reads
- Error handling for missing files and invalid frontmatter

### Static Generation

Content is generated at build time using Next.js static generation:

- All content is pre-rendered during build
- No database required for static content
- Fast page loads with pre-generated HTML
- SEO-friendly with static URLs
- Easy to deploy to CDN (Vercel)

### Navigation Architecture

Navigation utilities in `apps/firm-website/src/lib/navigation.ts` provide:

- `getNavItems()` - Primary navigation items (data-driven)
- `getBreadcrumbs(slug)` - Hierarchical breadcrumb trails
- `getRelatedContent(currentSlug, type)` - Related content based on categories/tags

These utilities are data-driven from content, ensuring navigation stays in sync with the actual content structure.

### MDX Component Mapping

MDX files can use React components from `@repo/ui`:
- `Button` - Interactive buttons
- `Card` - Content cards with header/footer
- `Container` - Responsive containers
- `Section` - Sectioned content areas
- `Accordion` - Collapsible content

Components are mapped in `apps/firm-website/mdx-components.tsx` for use in MDX files.

### Content Workflow

1. **Create content**: Add `.mdx` file to appropriate directory
2. **Add frontmatter**: Include required metadata fields
3. **Write content**: Use Markdown and MDX components
4. **Automatic availability**: Content utilities automatically detect new files
5. **Type safety**: TypeScript interfaces ensure correct usage
6. **Runtime validation**: Zod schemas validate data at runtime

### Benefits of This Architecture

- **No database required**: Static content is version-controlled
- **Fast builds**: File-based content is quick to process
- **Type safety**: Branded types prevent slug substitution errors
- **Easy editing**: Content authors work with familiar Markdown
- **SEO-friendly**: Static generation with pre-rendered HTML
- **Scalable**: Easy to add new content files
- **Cacheable**: In-memory cache improves performance

## Design Principles

### Domain-Driven Design (DDD)

The monorepo is organized around bounded contexts that align with business domains:

- **Marketing Website**: The primary application context
- **UI Components**: Reusable design system components
- **Shared Libraries**: Cross-cutting concerns and utilities

Each bounded context has its own package with clear interfaces and dependencies.

### Deep Modules

Packages are designed as deep modules with simple interfaces:

- **High cohesion**: Related functionality is grouped together
- **Low coupling**: Packages depend on minimal external interfaces
- **Information hiding**: Implementation details are encapsulated

### Test-Driven Development (TDD)

The project follows TDD principles:

- Tests are written before or alongside implementation
- Unit tests cover business logic and utilities
- E2E tests verify critical user flows
- High test coverage is maintained

### Behavior-Driven Development (BDD)

E2E tests follow BDD patterns with given-when-then structure to describe behavior from the user's perspective.

## Key Architectural Decisions

### Monorepo over Polyrepo

**Decision**: Use a monorepo instead of separate repositories for each project.

**Rationale**:
- Easier code sharing between applications
- Unified tooling and configuration
- Atomic changes across multiple packages
- Simplified CI/CD with single pipeline
- Better developer experience with consistent setup

**Trade-offs**:
- Larger repository size
- Potential for slower CI if not properly cached
- Requires discipline to maintain package boundaries

### Turborepo + pnpm

**Decision**: Use Turborepo for task orchestration with pnpm workspaces.

**Rationale**:
- Turborepo provides intelligent caching and task dependency management
- pnpm offers efficient disk usage and strict dependency management
- Both tools are well-maintained and have strong community support
- Excellent integration with Next.js and modern tooling

### shadcn/ui for Component Library

**Decision**: Use shadcn/ui as the foundation for the UI component library.

**Rationale**:
- Components are copied into the repo (full ownership and customization)
- Built on Radix UI (accessible primitives)
- Tailwind CSS integration (consistent with our styling approach)
- Modern, well-designed components
- Active community and regular updates

### Content as Markdown

**Decision**: Store content as Markdown files with frontmatter.

**Rationale**:
- Easy to edit and maintain
- Version-controlled alongside code
- No database required for static content
- Fast build times with static generation
- Enables content authors to work with familiar format

### Server Components by Default

**Decision**: Use Next.js Server Components as the default.

**Rationale**:
- Improved performance with server-side rendering
- Reduced client-side JavaScript bundle
- Direct access to server resources (databases, APIs)
- Better security with server-only code
- Simplified data fetching patterns

## Performance Considerations

### Build Performance

- **Turborepo caching**: Task outputs are cached to avoid redundant work
- **Remote caching**: Vercel provides remote caching for CI/CD builds
- **Parallel execution**: Tasks run in parallel where dependencies allow
- **Incremental builds**: Only changed packages are rebuilt

### Runtime Performance

- **Server Components**: Reduce client-side JavaScript
- **Image optimization**: Next.js Image component for automatic optimization
- **Code splitting**: Automatic route-based code splitting
- **Static generation**: Pre-render pages where possible

### Bundle Size

- **Tree shaking**: Unused code is eliminated from bundles
- **Dynamic imports**: Load code only when needed
- **External libraries**: Use CDN for large libraries when appropriate

## Security Considerations

### Environment Variables

- Server-only variables are never exposed to the client
- Public variables are prefixed with `NEXT_PUBLIC_`
- Validation with Zod ensures required variables are present
- `.env.local` is gitignored to prevent accidental commits

### Dependencies

- pnpm's strict mode prevents phantom dependencies
- Regular dependency audits with `pnpm audit`
- Automated security updates via Dependabot (if enabled)

### Content Security

- Markdown content is sanitized during HTML conversion
- No arbitrary code execution from user content
- CSP headers configured for production

## Scalability Considerations

### Horizontal Scaling

- Stateless Next.js application can be scaled horizontally
- Vercel's edge network provides global distribution
- Content is static and cacheable

### Vertical Scaling

- Server Components reduce client-side load
- Efficient caching reduces server load
- Database queries optimized (when database is added)

### Content Scaling

- Markdown-based content scales well
- No database required for static content
- Easy to add new content files

## Future Considerations

### Potential Enhancements

- **Database**: Add a database for dynamic content (e.g., blog comments, contact forms)
- **CMS**: Consider a headless CMS for non-technical content authors
- **Internationalization**: Add i18n support for multiple languages
- **Analytics**: Integrate analytics for user behavior tracking
- **A/B Testing**: Add experimentation framework

### Architectural Evolution

- **Micro-frontends**: Consider if multiple applications are added
- **Service workers**: Add offline support with PWA capabilities
- **API routes**: Expand API routes for dynamic functionality
- **Edge functions**: Leverage Vercel Edge Functions for global performance

## References

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Documentation](https://pnpm.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
