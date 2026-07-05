# Your Dedicated Marketer - Monorepo

A modern monorepo for the Your Dedicated Marketer marketing website, built with Turborepo and pnpm workspaces.

## Overview

This monorepo contains the marketing website for Your Dedicated Marketer, a professional marketing services firm. The project uses a monorepo architecture to manage code, dependencies, and tooling across multiple packages and applications.

## Deployment

The production site is deployed on Vercel: [https://yourdedicatedmarketer.vercel.app](https://yourdedicatedmarketer.vercel.app)

## Structure

- `apps/firm-website` - Next.js 15 marketing website
- `packages/ui` - Shared UI components with shadcn/ui, Storybook, and Vitest testing
- `packages/lib` - Shared utility libraries
- `packages/eslint-config` - Shared ESLint configuration
- `packages/typescript-config` - Shared TypeScript configuration
- `packages/tailwind-config` - Shared Tailwind CSS configuration
- `docs/` - Project documentation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v9.15.0)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/yourdedicatedmarketer.git
cd yourdedicatedmarketer

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server for all apps
pnpm dev

# Start development server for a specific app
pnpm --filter @repo/firm-website dev
```

The Next.js application will be available at `http://localhost:3000`.

### Build

```bash
# Build all apps and packages
pnpm build

# Build a specific app
pnpm --filter @repo/firm-website build
```

### Lint

```bash
# Lint all packages
pnpm lint

# Lint a specific package
pnpm --filter @repo/firm-website lint
```

### Test

```bash
# Run all tests
pnpm test

# Run unit tests for a specific app
pnpm --filter @repo/firm-website test

# Run E2E tests
pnpm test:e2e
```

### Type Check

```bash
# Type check all packages
pnpm check-types

# Type check a specific package
pnpm --filter @repo/firm-website check-types
```

## Technology Stack

- **Package Manager**: pnpm with workspaces
- **Task Orchestration**: Turborepo
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui with Radix UI primitives
- **Testing**: Vitest (unit), Playwright (E2E), Storybook (visual)
- **Deployment**: Vercel

## Project Status

### Phase 1: Foundation ✅ COMPLETE
- Monorepo structure with Turborepo and pnpm workspaces
- Next.js 15 app with TypeScript and Tailwind CSS v4
- ESLint 9 flat config and TypeScript 6 strict mode
- Vitest and Playwright testing infrastructure
- Basic documentation

### Phase 2: Design System ✅ COMPLETE
- shadcn/ui component library setup with brand theming
- Dark mode with theme switching
- Core components: Button, Card, Container, Section, Header, NavLink, MobileMenu, Footer, Input, Textarea, Label, Form, Accordion
- MDX content rendering infrastructure
- Storybook for component development and visual testing
- Chromatic integration for visual regression testing
- Vitest testing for UI package components
- Comprehensive component documentation

### Phase 1: Content & Data Management ✅ COMPLETE
- TypeScript content types with branded slug types for type safety
- Content utility functions for reading/parsing MDX files with in-memory caching
- 6 service MDX files (Website Design, Local SEO, Paid Ads, Email/SMS, Copywriting & Branding, Hosting & Care)
- 6 industry MDX files (Home Services, Medical, Personal Services, Professional Services, Restaurants, Retail)
- 6 demo MDX files with proof-of-concept case studies
- 10 FAQ MDX files with AEO (Answer Engine Optimization) format
- 2 static page MDX files (About, Pricing)
- Navigation utilities for data-driven navigation, breadcrumbs, and related content
- Comprehensive content documentation

## Documentation

- [Repository Setup](docs/repo-setup.md) - Monorepo structure and tooling decisions
- [Architecture](docs/architecture.md) - System architecture and design decisions
- [Development Guide](docs/development.md) - Developer onboarding and workflows
- [Environment Variables](docs/environment.md) - Environment configuration
- [Testing Strategy](docs/testing.md) - Testing infrastructure and best practices
- [Deployment Guide](docs/deployment.md) - Deployment process and CI/CD
- [Content Pipeline](docs/content.md) - Content structure and API

## License

MIT
