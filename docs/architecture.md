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

- **Markdown with frontmatter**: Content stored as MD files with YAML metadata
- **gray-matter**: Frontmatter parsing
- **remark + remark-html**: Markdown to HTML conversion
- **Zod**: Runtime schema validation for content types

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
