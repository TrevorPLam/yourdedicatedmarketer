# Your Dedicated Marketer - Monorepo

A modern monorepo for the Your Dedicated Marketer marketing website, built with Turborepo and pnpm workspaces.

## Overview

This monorepo contains the marketing website for Your Dedicated Marketer, a professional marketing services firm. The project uses a monorepo architecture to manage code, dependencies, and tooling across multiple packages and applications.

## Deployment

The production site is deployed on Vercel: [https://yourdedicatedmarketer.vercel.app](https://yourdedicatedmarketer.vercel.app)

## Structure

- `apps/firm-website` - Next.js 15 marketing website
- `packages/ui` - Shared UI components
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
- **Testing**: Vitest (unit), Playwright (E2E)
- **Deployment**: Vercel

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
