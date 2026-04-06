# Packages Directory

This directory contains all shared packages for the marketing agency monorepo.

## Package Structure

### Types (`packages/types/`)

Shared TypeScript definitions and interfaces used across all applications and
packages.

- **api/**: API type definitions
- **cms/**: CMS content type definitions
- **database/**: Database schema types

### Design System (`packages/design-system/`)

Design tokens, themes, and brand configurations.

- **tokens/**: Design tokens (colors, typography, spacing)
- **themes/**: Theme configurations (light, dark, client-specific)
- **brand-kits/**: Client-specific brand configurations

### UI Components (`packages/ui-components/`)

Reusable UI component library following atomic design principles.

- **atoms/**: Basic UI elements (Button, Input, Card, etc.)
- **molecules/**: Component combinations (HeroSection, FeatureCard, etc.)
- **organisms/**: Complex UI sections (Header, Footer, PageLayout, etc.)
- **templates/**: Page templates (MarketingPage, DashboardLayout, etc.)
- **utils/**: Component utilities and helpers

### Platform Packages (`packages/platform/`)

Core platform packages providing infrastructure capabilities.

#### Database (`packages/platform/database/`)

Database adapters and utilities for multi-provider support.

- **adapters/**: Database adapters (Supabase, Neon, PostgreSQL)
- **migrations/**: Database migration files
- **seeds/**: Database seed data
- **types/**: Database-specific types

#### Auth (`packages/platform/auth/`)

Authentication utilities and providers.

#### CMS (`packages/platform/cms/`)

Headless CMS integrations and adapters.

- **adapters/**: CMS adapters (Contentful, Strapi, Sanity, etc.)

#### Deployment (`packages/platform/deployment/`)

Deployment configurations and utilities.

### Shared Packages (`packages/shared/`)

Business logic utilities shared across applications.

- **analytics/**: Analytics tracking utilities
- **seo/**: SEO optimization utilities
- **monitoring/**: Error tracking and monitoring
- **utils/**: Common utility functions

## Development Guidelines

### Package Dependencies

- All packages should follow the dependency boundaries defined in the
  architecture
- Use workspace references for internal dependencies (`workspace:*`)
- Keep dependencies minimal and well-defined

### Naming Conventions

- Package names should use the `@agency/` scope
- Use kebab-case for package names
- Follow atomic design principles for UI components

### Build Configuration

- All packages should have proper build scripts
- Use TypeScript for type safety
- Include proper exports in package.json

## Usage

Install packages using workspace references:

```bash
pnpm add @agency/ui-components @agency/design-system --workspace
```

Import in applications:

```typescript
import { Button } from '@agency/ui-components';
import { designTokens } from '@agency/design-system';
```
