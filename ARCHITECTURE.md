# Marketing Agency Monorepo Architecture Blueprint

## Executive Summary

This document provides a comprehensive blueprint for implementing an
enterprise-grade monorepo architecture specifically designed for marketing
agencies managing multiple client websites, landing pages, and business
applications. The architecture prioritizes scalability, maintainability,
developer productivity, and operational excellence.

---

## Table of Contents

1. [Repository Structure Overview](#repository-structure-overview)
2. [Root Configuration Files](#root-configuration-files)
3. [Applications Directory](#applications-directory)
4. [Packages Directory](#packages-directory)
5. [Tools Directory](#tools-directory)
6. [Documentation Directory](#documentation-directory)
7. [Governance Directory](#governance-directory)
8. [Development Environment](#development-environment)
9. [Build System Configuration](#build-system-configuration)
10. [Testing Strategy](#testing-strategy)
11. [Deployment Architecture](#deployment-architecture)
12. [Security Framework](#security-framework)
13. [Migration Strategy](#migration-strategy)
14. [Operational Procedures](#operational-procedures)

---

## Repository Structure Overview

### Complete Directory Blueprint

```
marketing-agency-monorepo/
├── 📁 apps/                           # Deployable applications
│   ├── 📁 agency-website/              # Main agency marketing site (Astro)
│   ├── 📁 client-sites/                 # Client-specific applications
│   │   ├── 📁 client-alpha/            # Alpha client site
│   │   ├── 📁 client-beta/              # Beta client dashboard
│   │   ├── 📁 client-gamma/            # Gamma client hybrid app
│   │   └── 📁 client-templates/        # Reusable client templates
│   ├── 📁 internal-tools/              # Agency internal applications
│   │   ├── 📁 project-manager/         # Project management tool
│   │   ├── 📁 analytics-dashboard/     # Analytics visualization
│   │   ├── 📁 client-portal/           # Client collaboration portal
│   │   └── 📁 resource-planner/        # Resource allocation tool
│   └── 📁 shared-services/             # Cross-cutting services
│       ├── 📁 auth-service/            # Authentication microservice
│       ├── 📁 notification-service/    # Communication service
│       └── 📁 analytics-service/       # Data aggregation service
├── 📁 packages/                        # Shared code libraries
│   ├── 📁 ui-components/               # UI component library
│   │   ├── 📁 src/
│   │   │   ├── 📁 atoms/                   # Basic UI elements
│   │   │   ├── 📁 molecules/               # Component combinations
│   │   │   ├── 📁 organisms/               # Complex UI sections
│   │   │   ├── 📁 templates/               # Page templates
│   │   │   └── 📁 utils/                   # Component utilities
│   │   ├── 📁 stories/                  # Storybook stories
│   │   ├── 📁 tests/                    # Component tests
│   │   ├── 📁 package.json
│   │   ├── 📁 tsconfig.json
│   │   ├── 📁 tailwind.config.js
│   │   └── 📁 README.md
│   ├── 📁 design-system/              # Design tokens and themes
│   │   ├── 📁 tokens/                  # Design tokens
│   │   │   ├── 📁 colors.ts
│   │   │   ├── 📁 typography.ts
│   │   │   ├── 📁 spacing.ts
│   │   │   └── 📁 shadows.ts
│   │   ├── 📁 themes/                  # Client-specific themes
│   │   │   ├── 📁 default.ts
│   │   │   ├── 📁 dark.ts
│   │   │   └── 📁 brand-kits/              # Custom brand configurations
│   │   └── 📁 brand-kits/
│   │       ├── 📁 alpha-brand.ts
│   │       ├── 📁 beta-brand.ts
│   │       └── 📁 gamma-brand.ts
│   ├── 📁 platform/                    # Core platform packages
│   │   ├── 📁 database/                # Database adapters
│   │   │   ├── 📁 src/
│   │   │   │   ├── 📁 adapters/
│   │   │   │   │   ├── 📁 supabase.ts
│   │   │   │   ├── 📁 neon.ts
│   │   │   │   └── 📁 postgres.ts
│   │   │   ├── 📁 migrations/
│   │   │   ├── 📁 seeds/
│   │   │   └── 📁 types/
│   │   ├── 📁 auth/                    # Authentication utilities
│   │   ├── 📁 cms/                     # Headless CMS integrations
│   │   └── 📁 deployment/              # Deployment configurations
│   ├── 📁 shared/                      # Business logic utilities
│   │   ├── 📁 analytics/               # Analytics tracking
│   │   ├── 📁 seo/                     # SEO optimization
│   │   ├── 📁 monitoring/              # Error tracking
│   │   └── �── utils/                   # Common utilities
│   └── 📁 types/                       # Shared TypeScript definitions
│       ├── 📁 api/                     # API type definitions
│       ├── 📁 cms/                     # CMS content types
│       └── 📁 database/                # Database schemas
├── 📁 tools/                            # Development and automation tools
│   ├── 📁 build-scripts/              # Custom build automation
│   ├── 📁 generators/                 # Turbo Gen generators
│   │   ├── 📁 client/
│   │   │   ├── 📄 prompts.js
│   │   │   ├── � template.hbs
│   │   │   └── 📄 package.json.hbs
│   │   ├── 📁 component/
│   │   │   ├── 📄 prompts.js
│   │   │   ├── � template.hbs
│   │   │   └── 📄 stories.hbs
│   │   └── 📁 package/
│   │       ├── 📄 prompts.js
│   │       └── � template.hbs
│   │       ├── 📁 astro-marketing/
│   │       ├── 📁 nextjs-dashboard/
│   │       └── 📁 hybrid-application/
│   ├── 📁 deployment/                 # CI/CD configurations
│   │   ├── 📁 scripts/
│   │   ├── 📁 github-actions/
│   │   └── 📁 vercel-configs/
│   └── 📁 governance/                 # Automated governance tools
│       ├── 📁 policy-checker.js
│       ├── 📁 boundary-enforcer.js
│       └── 📁 compliance-validator.js
├── 📁 docs/                             # Documentation
│   ├── 📁 architecture/               # System design documents
│   │   ├── 📁 monorepo-design.md
│   │   ├── 📁 security-framework.md
│   │   └── 📁 deployment-strategy.md
│   ├── 📁 client-onboarding/          # Client workflow documentation
│   │   ├── 📁 getting-started.md
│   │   ├── 📁 best-practices.md
│   │   └── 📁 troubleshooting.md
│   ├── 📁 component-library/          # Storybook documentation
│   │   ├── 📁 getting-started.md
│   │   ├── 📁 component-api.md
│   │   └── 📁 design-tokens.md
│   └── 📁 playbooks/                 # Standard operating procedures
│       ├── 📁 client-onboarding.md
│       ├── 📁 deployment.md
│       └── 📁 incident-response.md
├── 📁 governance/                        # Governance and policies
│   ├── 📄 CODEOWNERS                 # Code ownership rules
│   ├── 📁 policies/                  # Architectural policies
│   │   ├── 📄 dependency-policy.md
│   │   ├── 📄 security-policy.md
│   │   └── 📄 code-quality-policy.md
│   └── 📁 templates/                 # PR/issue templates
│       ├── 📄 pr-template.md
│       ├── 📄 issue-template.md
│       └── 📄 security-report.md
├── 📄 .env.example                      # Environment variable template
├── 📄 .gitignore                       # Git ignore patterns
├── 📄 .devcontainer.json              # Development container config
├── 📄 docker-compose.dev.yml           # Development services
├── 📄 docker-compose.prod.yml          # Production services
├── 📄 pnpm-workspace.yaml            # Workspace configuration
├── 📄 package.json                     # Root package configuration
├── 📄 turbo.json                      # Build system configuration
├── 📄 tsconfig.json                    # TypeScript configuration
├── 📄 .eslintrc.js                    # ESLint configuration
├── 📄 .prettierrc                    # Prettier configuration
├── 📄 tailwind.config.js              # Tailwind CSS configuration
└── 📁 .github/                        # GitHub workflows
    └── 📁 workflows/
        ├── 📄 ci.yml
        ├── 📄 deploy.yml
        ├── 📄 security.yml
        └── 📄 governance.yml
```

### Repository Principles

1. **Single Source of Truth**: All configuration centralized at root
2. **Clear Boundaries**: Each package has well-defined responsibilities
3. **Consistent Tooling**: Shared build system, linting, testing
4. **Scalable Structure**: Supports growth from 1 to 100+ developers
5. **Automated Governance**: Policies enforced through automation

---

## Root Configuration Files

### 1. pnpm-workspace.yaml

```yaml
# Workspace configuration for pnpm package manager
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tools/*'

# Dependency catalog for version consistency across workspace
catalog:
  # Core Frameworks
  react: '^19.2.0'
  typescript: '^5.9.0'
  astro: '^6.0.0'
  next: '^16.0.0'

  # Database Providers
  '@supabase/supabase-js': '^2.49.0'
  '@neondatabase/serverless': '^0.10.0'
  postgres: '^15.0.0'

  # Development Tools
  turbo: '^2.9.0'
  vitest: '^3.0.0'
  playwright: '^1.60.0'
  eslint: '^9.23.0'
  prettier: '^3.5.0'

  # UI Libraries
  tailwindcss: '^4.0.0'
  '@headlessui/react': '^2.2.0'
  framer-motion: '^12.0.0'
  lucide-react: '^0.487.0'
```

### 2. Root package.json

```json
{
  "name": "marketing-agency-monorepo",
  "version": "2.0.0",
  "description": "Enterprise-grade monorepo for marketing agency operations",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@10.0.0",

  "scripts": {
    "# Development Commands": "=== Development Commands ===",
    "dev": "turbo run dev --parallel",
    "dev:setup": "pnpm install && turbo run db:migrate && turbo run db:seed && turbo run dev",
    "dev:client": "node tools/generators/create-client.js && cd apps/client-sites/$CLIENT_NAME && pnpm dev",

    "# Build Commands": "=== Build Commands ===",
    "build": "turbo run build",
    "build:affected": "turbo run build --filter=!@agency/docs",
    "build:production": "NODE_ENV=production turbo run build",
    "build:client": "turbo run build --filter=$CLIENT_NAME",

    "# Testing Commands": "=== Testing Commands ===",
    "test": "turbo run test",
    "test:e2e": "turbo run test:e2e",
    "test:coverage": "turbo run test --coverage",
    "test:affected": "turbo run test --filter=!@agency/docs",
    "test:watch": "turbo run test --watch",

    "# Code Quality Commands": "=== Code Quality Commands ===",
    "lint": "turbo run lint",
    "lint:fix": "turbo run lint --fix",
    "lint:all": "turbo run lint --all",
    "type-check": "turbo run type-check",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,md,json}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,md,json}\"",

    "# Database Commands": "=== Database Commands ===",
    "db:migrate": "turbo run db:migrate",
    "db:generate": "turbo run db:generate",
    "db:seed": "turbo run db:seed",
    "db:reset": "turbo run db:reset",
    "db:studio": "turbo run db:studio",

    "# Deployment Commands": "=== Deployment Commands ===",
    "deploy:staging": "turbo run deploy:staging",
    "deploy:production": "turbo run deploy:production",
    "deploy:client": "node tools/scripts/deploy-client.js",
    "deploy:preview": "turbo run deploy:preview",

    "# Package Management Commands": "=== Package Management Commands ===",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "turbo run build --filter=!@agency/docs && changeset publish",
    "clean": "turbo run clean && rm -rf node_modules",
    "clean:full": "pnpm clean && rm -rf node_modules && rm -rf .turbo",

    "# Generator Commands": "=== Generator Commands ===",
    "new:client": "node tools/generators/create-client.js",
    "new:component": "node tools/generators/create-component.js",
    "new:package": "node tools/generators/create-package.js",
    "new:service": "node tools/generators/create-service.js",

    "# Documentation Commands": "=== Documentation Commands ===",
    "docs:dev": "turbo run docs:dev",
    "docs:build": "turbo run docs:build",
    "storybook": "turbo run storybook",
    "storybook:build": "turbo run storybook:build"
  },

  "devDependencies": {
    "# Build System": "# Build System",
    "turbo": "^2.9.0",
    "@changesets/cli": "^3.27.0",

    "# TypeScript & Quality": "# TypeScript & Quality",
    "@types/node": "^22.12.0",
    "typescript": "^5.9.0",
    "turbo": "^2.9.0",
    "eslint": "^9.23.0",
    "prettier": "^3.5.0",
    "@typescript-eslint/eslint-plugin": "^8.29.0",
    "@typescript-eslint/parser": "^8.29.0",
    "vitest": "^3.0.0",
    "playwright": "^1.60.0"

    "# Development Tools": "# Development Tools",
    "nodemon": "^3.1.0",
    "concurrently": "^9.1.0",
    "cross-env": "^7.0.0"
  },

  "engines": {
    "node": ">=22.12.0",
    "pnpm": ">=10.0.0"
  },

  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/marketing-agency-monorepo.git"
  },

  "keywords": [
    "monorepo",
    "marketing-agency",
    "astro",
    "nextjs",
    "typescript",
    "turborepo"
  ],

  "author": "Your Agency Name",
  "license": "MIT"
}
```

### 3. turbo.json (Complete Build Configuration)

```json
{
  "$schema": "https://turborepo.com/schema.json",
  "globalDependencies": ["~/.env"],
  "globalEnv": [
    "NODE_ENV",
    "DATABASE_URL",
    "NEXT_PUBLIC_SITE_URL",
    "VERCEL_ENV",
    "CF_PAGES",
    "TURBO_TOKEN",
    "SENTRY_DSN"
  ],

  "pipeline": {
    "# Build Tasks": "# Build Tasks",
    "build": {
      "dependsOn": ["^build", "db:generate"],
      "outputs": ["dist/**", ".next/**", "public/build/**"],
      "inputs": [
        "src/**",
        "package.json",
        "tsconfig.json",
        "tailwind.config.*"
      ],
      "cache": true
    },

    "# Development Tasks": "# Development Tasks",
    "dev": {
      "cache": false,
      "persistent": true,
      "passThruEnv": ["NODE_ENV", "DATABASE_URL", "NEXT_PUBLIC_SITE_URL"]
    },

    "# Testing Tasks": "# Testing Tasks",
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "inputs": ["src/**", "test/**", "package.json"],
      "cache": true
    },
    "test:e2e": {
      "dependsOn": ["build"],
      "outputs": ["test-results/**"],
      "cache": false
    },
    "test:coverage": {
      "dependsOn": ["test"],
      "outputs": ["coverage/**"],
      "cache": true
    },

    "# Code Quality Tasks": "# Code Quality Tasks",
    "lint": {
      "outputs": [],
      "inputs": ["src/**", "package.json", "eslint.config.*"],
      "cache": true
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": [],
      "inputs": ["src/**", "types/**", "package.json"],
      "cache": true
    },

    "# Database Tasks": "# Database Tasks",
    "db:migrate": {
      "cache": false,
      "outputs": []
    },
    "db:generate": {
      "outputs": ["packages/types/generated/**"],
      "inputs": ["packages/database/**"],
      "cache": true
    },
    "db:seed": {
      "dependsOn": ["db:migrate"],
      "cache": false,
      "outputs": []
    },
    "db:studio": {
      "cache": false,
      "persistent": true
    },

    "# Documentation Tasks": "# Documentation Tasks",
    "docs:dev": {
      "cache": false,
      "persistent": true
    },
    "docs:build": {
      "dependsOn": ["^build"],
      "outputs": ["docs-dist/**"],
      "cache": true
    },

    "# Storybook Tasks": "# Storybook Tasks",
    "storybook": {
      "dependsOn": ["^build"],
      "cache": false,
      "persistent": true
    },
    "storybook:build": {
      "dependsOn": ["^build"],
      "outputs": ["storybook-static/**"],
      "cache": true
    },

    "# Deployment Tasks": "# Deployment Tasks",
    "deploy:staging": {
      "dependsOn": ["build"],
      "cache": false
    },
    "deploy:production": {
      "dependsOn": ["build"],
      "cache": false
    },

    "# Utility Tasks": "# Utility Tasks",
    "clean": {
      "cache": false,
      "outputs": []
    }
  },

  "remoteCache": {
    "enabled": true,
    "team": "agency-team",
    "token": "$TURBO_TOKEN"
  }
}
```

### 4. Environment Configuration

```bash
# .env.example - Complete environment template
# ===========================================
# CORE INFRASTRUCTURE
# ===========================================
NODE_ENV=development
PNPM_STORE_DIR=~/.pnpm-store
TURBO_TOKEN=your_turbo_token_here

# ===========================================
# DATABASE CONFIGURATION
# ===========================================
DATABASE_PROVIDER=supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

NEON_URL=your_neon_database_url
NEON_API_KEY=your_neon_api_key

# Local development database
DATABASE_URL=postgresql://dev:dev123@localhost:5432/agency_dev

# ===========================================
# PLATFORM CONFIGURATION
# ===========================================
VERCEL_ORG_ID=your_vercel_organization_id
VERCEL_TOKEN=your_vercel_personal_access_token
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id

# ===========================================
# CLIENT CONFIGURATION
# ===========================================
CLIENT_ALPHA_DOMAIN=alpha-client.com
CLIENT_BETA_DOMAIN=beta-client.com
CLIENT_GAMMA_DOMAIN=gamma-client.com

# ===========================================
# MONITORING & ANALYTICS
# ===========================================
SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_sentry_auth_token
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
GOOGLE_TAG_MANAGER_ID=GTM_CONTAINER_ID

# ===========================================
# DEVELOPMENT TOOLS
# ===========================================
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_AGENCY_URL=http://localhost:3000
VERCEL_ENV=development
CF_PAGES=0

# ===========================================
# SECURITY & COMPLIANCE
# ===========================================
JWT_SECRET=your_jwt_secret_key_here
ENCRYPTION_KEY=your_32_character_encryption_key
API_RATE_LIMIT=100
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# ===========================================
# FEATURE FLAGS
# ===========================================
ENABLE_ANALYTICS=true
ENABLE_ERROR_TRACKING=true
ENABLE_PERFORMANCE_MONITORING=true
ENABLE_DEBUG_MODE=false
ENABLE_STORYBOOK=true
```

---

## Applications Directory

### Agency Website (apps/agency-website)

#### Purpose

Main marketing website for the agency, showcasing services, portfolio, and
thought leadership content.

#### Technology Stack (Astro v6.0+)

- **Framework**: Astro 6.0+ with React islands
- **Content**: Live Collections with real-time content loading and error
  handling
- **Features**: Built-in CSP support with automatic hash generation, Cloudflare
  Workers runtime
- **Styling**: Tailwind CSS 4.0 with CSS-first configuration
- **Deployment**: Cloudflare Pages for optimal performance
- **Analytics**: Google Analytics 4 + agency dashboard
- **Node Requirements**: Requires Node 22.12.0+

#### Directory Structure

```
apps/agency-website/
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 layout/
│   │   │   ├── 📄 Header.astro
│   │   │   ├── 📄 Footer.astro
│   │   │   └── 📄 Navigation.astro
│   │   ├── 📁 sections/
│   │   │   ├── 📄 Hero.astro
│   │   │   ├── 📄 Services.astro
│   │   │   ├── 📄 Portfolio.astro
│   │   │   └── 📄 Contact.astro
│   │   └── 📁 ui/
│   │       ├── 📄 Button.astro
│   │       ├── 📄 Card.astro
│   │       └── 📄 Modal.astro
│   ├── 📁 layouts/
│   │   ├── 📄 Base.astro
│   │   └── 📄 Blog.astro
│   ├── 📁 pages/
│   │   ├── 📄 index.astro
│   │   ├── 📄 about.astro
│   │   ├── 📄 services.astro
│   │   ├── 📄 portfolio.astro
│   │   ├── 📄 blog/
│   │   │   ├── 📄 [...slug].astro
│   │   │   └── 📄 index.astro
│   │   └── 📄 contact.astro
│   ├── 📁 content/
│   │   ├── 📁 services/
│   │   ├── 📁 portfolio/
│   │   └── 📁 blog/
│   └── 📁 styles/
├── 📁 public/
│   ├── 📁 images/
│   ├── 📁 icons/
│   └── 📄 favicon.svg
├── 📄 astro.config.mjs
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 tailwind.config.js
└── 📄 README.md
```

#### Key Configuration Files

**astro.config.mjs**:

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { SITE_CONFIG } from './src/site.config';

export default defineConfig({
  site: SITE_CONFIG,
  integrations: [tailwind()],
  output: 'static',
  build: {
    format: 'directory',
  },
  vite: {
    optimizeDeps: true,
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
```

**package.json**:

```json
{
  "name": "@agency/agency-website",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx,.astro",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@agency/ui-components": "workspace:*",
    "@agency/design-system": "workspace:*",
    "@agency/analytics": "workspace:*",
    "@astrojs/react": "^4.0.0",
    "@astrojs/tailwind": "^6.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "@types/react": "^19.1.0",
    "@types/react-dom": "^19.1.0",
    "eslint": "^9.23.0",
    "prettier": "^3.5.0",
    "typescript": "^5.9.0"
  }
}
```

### Client Sites (apps/client-sites)

#### Template Structure

Each client site follows a consistent structure with framework-specific
adaptations:

#### Astro Marketing Site Template

```
apps/client-sites/client-alpha/
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 layout/
│   │   ├── 📁 sections/
│   │   └── 📁 ui/
│   ├── 📁 layouts/
│   ├── 📁 pages/
│   ├── 📁 content/
│   └── 📁 styles/
├── 📁 public/
├── 📄 astro.config.mjs
├── 📄 package.json
├── 📄 client.config.js
└── 📄 README.md
```

#### Next.js Dashboard Template

```
apps/client-sites/client-beta/
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📄 layout.tsx
│   │   ├── 📄 page.tsx
│   │   ├── 📄 globals.css
│   │   ├── 📁 dashboard/
│   │   │   ├── 📄 page.tsx
│   │   │   ├── 📁 components/
│   │   │   └── 📁 analytics/
│   │   └── 📁 settings/
│   ├── 📁 components/
│   ├── 📁 lib/
│   └── 📁 styles/
├── 📁 public/
├── 📄 next.config.js
├── 📄 package.json
├── 📄 client.config.js
└── 📄 README.md
```

#### Client Configuration System

```javascript
// client.config.js
module.exports = {
  client: {
    name: 'Client Alpha',
    domain: 'alpha-client.com',
    framework: 'astro',
    database: 'supabase',
    theme: 'alpha-brand',
  },

  features: {
    analytics: true,
    cms: true,
    blog: true,
    contact: true,
    portfolio: true,
    customBranding: true,
  },

  deployment: {
    platform: 'cloudflare',
    environment: 'production',
    customDomain: true,
    ssl: true,
  },
};
```

### Internal Tools (apps/internal-tools)

#### Project Manager (apps/internal-tools/project-manager)

```typescript
// Purpose: Agency project and client management system
// Features: Project tracking, resource allocation, timeline management
// Technology: Next.js with TypeScript, Prisma, Supabase
```

#### Analytics Dashboard (apps/internal-tools/analytics-dashboard)

```typescript
// Purpose: Cross-client analytics and reporting
// Features: Real-time data, custom dashboards, automated reports
// Technology: Next.js with Chart.js, WebSocket updates
```

#### Client Portal (apps/internal-tools/client-portal)

```typescript
// Purpose: Client collaboration and communication
// Features: Project updates, file sharing, messaging
// Technology: Next.js with real-time updates
```

---

## Packages Directory

### UI Components (packages/ui-components)

#### Architecture Overview

Centralized component library supporting both React and Astro frameworks with
consistent design system integration.

#### Directory Structure

```
packages/ui-components/
├── 📁 src/
│   ├── 📁 atoms/                   # Basic UI elements
│   │   ├── 📄 Button/
│   │   │   ├── 📄 Button.tsx
│   │   │   ├── 📄 Button.test.tsx
│   │   │   ├── 📄 Button.stories.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📄 Input/
│   │   ├── 📄 Modal/
│   │   ├── 📄 Card/
│   │   └── 📄 Badge/
│   ├── 📁 molecules/               # Component combinations
│   │   ├── 📄 HeroSection/
│   │   ├── 📄 FeatureCard/
│   │   ├── 📄 TestimonialCard/
│   │   └── 📄 NavigationMenu/
│   ├── 📁 organisms/               # Complex UI sections
│   │   ├── 📄 Header/
│   │   ├── 📄 Footer/
│   │   ├── 📄 PageLayout/
│   │   └── 📄 Sidebar/
│   ├── 📁 templates/               # Page templates
│   │   ├── 📄 MarketingPage/
│   │   ├── 📄 DashboardLayout/
│   │   └── 📄 BlogLayout/
│   └── 📁 utils/                   # Component utilities
│       ├── 📄 cn.ts                    # Classname utility
│       ├── 📄 animations.ts             # Animation helpers
│       └── 📄 accessibility.ts         # A11y utilities
├── 📁 stories/                  # Storybook stories
├── 📁 tests/                    # Component tests
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 tailwind.config.js
├── 📄 .storybook/
│   ├── 📄 main.ts
│   └── 📄 preview.ts
└── 📄 README.md
```

#### Component Architecture Pattern

```typescript
// packages/ui-components/src/atoms/Button/Button.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { designTokens } from '@agency/design-system';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 text-white hover:bg-primary-700',
        secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8 text-lg'
      }
    }
  }
);

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
};
```

#### Package Configuration

```json
{
  "name": "@agency/ui-components",
  "version": "1.0.0",
  "description": "Shared UI component library for marketing agency applications",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./astro": "./dist/astro.js",
    "./react": "./dist/react.js",
    "./styles": "./dist/styles.css"
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup && tailwindcss -i ./src/styles/globals.css -o ./dist/styles.css",
    "dev": "tsup --watch",
    "test": "vitest",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "peerDependencies": {
    "react": "^19.2.0",
    "astro": "^6.0.0"
  },
  "dependencies": {
    "@agency/design-system": "workspace:*",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

### Design System (packages/design-system)

#### Token Architecture

```typescript
// packages/design-system/src/tokens/colors.ts
export const colors = {
  // Primary brand colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Neutral colors
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Semantic colors
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

export const semanticColors = {
  background: colors.neutral[50],
  foreground: colors.neutral[900],
  card: colors.neutral[100],
  'card-foreground': colors.neutral[800],
  primary: colors.primary[600],
  'primary-foreground': colors.neutral[50],
  secondary: colors.neutral[100],
  'secondary-foreground': colors.neutral[900],
  muted: colors.neutral[200],
  'muted-foreground': colors.neutral[700],
  accent: colors.neutral[300],
  'accent-foreground': colors.neutral[900],
  destructive: colors.error,
  'destructive-foreground': colors.neutral[50],
  border: colors.neutral[300],
  input: colors.neutral[100],
  ring: colors.primary[600],
};
```

#### Theme System

```typescript
// packages/design-system/src/themes/default.ts
import { colors } from '../tokens/colors';
import { typography } from '../tokens/typography';
import { spacing } from '../tokens/spacing';

export const defaultTheme = {
  colors,
  typography,
  spacing,
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
};

export type Theme = typeof defaultTheme;
```

### Database Package (packages/database)

#### Multi-Provider Architecture

```typescript
// packages/database/src/adapters/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { DatabaseAdapter } from '../types';

export class SupabaseAdapter implements DatabaseAdapter {
  private client: ReturnType<typeof createClient>;

  constructor(config: SupabaseConfig) {
    this.client = createClient(config);
  }

  async connect(): Promise<void> {
    // Test connection
    const { data, error } = await this.client
      .from('profiles')
      .select('count')
      .single();
    if (error) throw error;
  }

  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    // Execute SQL query
    const { data, error } = await this.client.rpc('execute_sql', {
      sql,
      params,
    });

    if (error) throw error;
    return data as T[];
  }

  // CRUD operations
  async create<T>(table: string, data: Partial<T>): Promise<T> {
    const { data, error } = await this.client
      .from(table)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return data as T;
  }

  async read<T>(table: string, id: string): Promise<T | null> {
    const { data, error } = await this.client
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as T;
  }

  async update<T>(table: string, id: string, data: Partial<T>): Promise<T> {
    const { data, error } = await this.client
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as T;
  }

  async delete(table: string, id: string): Promise<void> {
    const { error } = await this.client.from(table).delete().eq('id', id);

    if (error) throw error;
  }
}
```

#### Migration System

```typescript
// packages/database/src/migrations/migration.ts
export interface Migration {
  id: string;
  name: string;
  version: string;
  up: (db: DatabaseAdapter) => Promise<void>;
  down: (db: DatabaseAdapter) => Promise<void>;
}

export const createTableMigrations: Migration[] = [
  {
    id: '001_create_profiles_table',
    name: 'Create profiles table',
    version: '1.0.0',
    up: async (db) => {
      await db.query(`
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          client_id VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          role VARCHAR(50) DEFAULT 'user',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Enable Row Level Security
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
        
        -- Create policy for client isolation
        CREATE POLICY client_isolation ON profiles
          FOR ALL TO authenticated_users
          USING (client_id = current_setting('app.client_id'));
      `);
    },
    down: async (db) => {
      await db.query('DROP TABLE IF EXISTS profiles CASCADE;');
    },
  },
];
```

---

## Tools Directory

### Code Generators (tools/generators)

#### Client Project Generator

```javascript
// tools/generators/create-client.js (Complete implementation)
const inquirer = require('inquirer');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const clientTemplates = {
  'astro-marketing': {
    framework: 'astro',
    description: 'High-performance marketing site with Astro',
    packages: [
      '@agency/ui-components',
      '@agency/design-system',
      '@agency/analytics',
    ],
    features: ['seo-optimized', 'content-collections', 'static-generation'],
  },
  'nextjs-dashboard': {
    framework: 'nextjs',
    description: 'Interactive dashboard with Next.js',
    packages: [
      '@agency/ui-components',
      '@agency/analytics',
      '@agency/database',
    ],
    features: ['server-components', 'api-routes', 'real-time-updates'],
  },
  'hybrid-application': {
    framework: 'hybrid',
    description: 'Complex application with multiple frameworks',
    packages: ['@agency/ui-components', '@agency/analytics', '@agency/cms'],
    features: ['multi-framework', 'advanced-routing', 'microservices'],
  },
};

async function createClientProject() {
  console.log('🚀 Marketing Agency Client Project Generator\n');

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'clientName',
      message: 'Client name (kebab-case):',
      validate: (input) =>
        /^[a-z0-9-]+$/.test(input) ||
        'Use only lowercase, numbers, and hyphens',
      filter: (input) => input.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    },
    {
      type: 'list',
      name: 'template',
      message: 'Choose project template:',
      choices: Object.entries(clientTemplates).map(([key, value]) => ({
        name: `${value.description} (${key})`,
        value: key,
      })),
    },
    {
      type: 'list',
      name: 'database',
      message: 'Select database provider:',
      choices: [
        { name: 'Supabase (Recommended)', value: 'supabase' },
        { name: 'Neon (PostgreSQL)', value: 'neon' },
        { name: 'Custom PostgreSQL', value: 'custom-postgres' },
      ],
    },
    {
      type: 'input',
      name: 'domain',
      message: 'Production domain:',
      validate: (input) => {
        const domainRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
        return (
          domainRegex.test(input) || 'Enter a valid domain (e.g., client.com)'
        );
      },
    },
    {
      type: 'confirm',
      name: 'setupDeployment',
      message: 'Setup deployment configuration?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'setupAnalytics',
      message: 'Configure analytics tracking?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'setupMonitoring',
      message: 'Configure error monitoring?',
      default: true,
    },
  ]);

  const {
    clientName,
    template,
    database,
    domain,
    setupDeployment,
    setupAnalytics,
    setupMonitoring,
  } = answers;

  console.log(`\n📋 Configuration Summary:`);
  console.log(`   Client: ${clientName}`);
  console.log(`   Template: ${clientTemplates[template].description}`);
  console.log(`   Database: ${database}`);
  console.log(`   Domain: ${domain}`);
  console.log(`   Deployment: ${setupDeployment ? 'Yes' : 'No'}`);
  console.log(`   Analytics: ${setupAnalytics ? 'Yes' : 'No'}`);
  console.log(`   Monitoring: ${setupMonitoring ? 'Yes' : 'No'}`);

  // Create project structure
  const appPath = path.join(process.cwd(), 'apps', 'client-sites', clientName);

  console.log(`\n🏗️  Creating project structure...`);
  fs.mkdirSync(appPath, { recursive: true });

  // Copy template
  const templatePath = path.join(__dirname, 'templates', template);
  if (fs.existsSync(templatePath)) {
    execSync(`cp -r "${templatePath}/*" "${appPath}/"`, { stdio: 'inherit' });
    console.log(`✅ Template copied from ${template}`);
  } else {
    console.log(`❌ Template ${template} not found at ${templatePath}`);
    process.exit(1);
  }

  // Update package.json
  console.log('📦 Updating package.json...');
  updatePackageJson(
    appPath,
    clientName,
    template,
    setupAnalytics,
    setupMonitoring
  );

  // Generate environment files
  console.log('⚙️  Generating environment files...');
  generateEnvironmentFiles(
    appPath,
    clientName,
    database,
    domain,
    setupAnalytics,
    setupMonitoring
  );

  // Setup deployment configuration
  if (setupDeployment) {
    console.log('🚀 Setting up deployment configuration...');
    setupDeploymentConfig(appPath, clientName, domain, template, database);
  }

  // Update CODEOWNERS
  console.log('👥 Updating CODEOWNERS...');
  updateCodeOwners(clientName);

  // Install dependencies
  console.log('📚 Installing dependencies...');
  execSync('pnpm install', { cwd: appPath, stdio: 'inherit' });

  // Generate types
  console.log('🔷 Generating database types...');
  execSync(`pnpm run db:generate --filter=${clientName}`, {
    cwd: appPath,
    stdio: 'inherit',
  });

  console.log(`\n✅ ${clientName} project created successfully!`);
  console.log(`📁 Location: ${appPath}`);
  console.log(`\n🎯 Next Steps:`);
  console.log(`   cd apps/client-sites/${clientName}`);
  console.log(`   pnpm dev`);
  console.log(`   pnpm run build`);
  console.log(`   pnpm run deploy:production`);

  if (setupDeployment) {
    console.log(`\n🌐 Deployment Configuration:`);
    console.log(`   Platform: ${getPlatformName(template)}`);
    console.log(`   Domain: ${domain}`);
    console.log(`   Run: pnpm run deploy:production`);
  }
}

function updatePackageJson(
  appPath,
  clientName,
  template,
  setupAnalytics,
  setupMonitoring
) {
  const packageJsonPath = path.join(appPath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const templateConfig = clientTemplates[template];

  packageJson.name = `@agency/${clientName}`;
  packageJson.description = `${clientName} - ${templateConfig.description}`;
  packageJson.version = '1.0.0';

  // Add workspace dependencies
  packageJson.dependencies = {
    ...packageJson.dependencies,
    ...templateConfig.packages.reduce((acc, pkg) => {
      acc[pkg] = `workspace:*`;
      return acc;
    }, {}),
  };

  // Add analytics if requested
  if (setupAnalytics) {
    packageJson.dependencies['@agency/analytics'] = 'workspace:*';
  }

  // Add monitoring if requested
  if (setupMonitoring) {
    packageJson.dependencies['@agency/monitoring'] = 'workspace:*';
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

function generateEnvironmentFiles(
  appPath,
  clientName,
  database,
  domain,
  setupAnalytics,
  setupMonitoring
) {
  const envTemplate = `# ${clientName.toUpperCase()} Environment Configuration
# ===========================================
# FRAMEWORK CONFIGURATION
# ===========================================
NODE_ENV=development
NEXT_PUBLIC_CLIENT_NAME=${clientName.replace('-', ' ').toUpperCase()}
NEXT_PUBLIC_SITE_URL=http://localhost:3001

# ===========================================
# DATABASE CONFIGURATION
# ===========================================
DATABASE_PROVIDER=${database}
${getDatabaseConfig(database)}

# ===========================================
# SITE CONFIGURATION
# ===========================================
NEXT_PUBLIC_DOMAIN=${domain}
VERCEL_PROJECT_ID=${clientName}

# ===========================================
# ANALYTICS CONFIGURATION
# ===========================================
${
  setupAnalytics
    ? `
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID_HERE
NEXT_PUBLIC_GTM_ID=GTM_CONTAINER_ID_HERE
`
    : ''
}

# ===========================================
# MONITORING CONFIGURATION
# ===========================================
${
  setupMonitoring
    ? `
SENTRY_DSN=SENTRY_DSN_HERE
NEXT_PUBLIC_SENTRY_DSN=SENTRY_DSN_HERE
`
    : ''
}

# ===========================================
# DEVELOPMENT NOTES
# ===========================================
# 1. Update GOOGLE_ANALYTICS_ID with actual GA measurement ID
# 2. Update SENTRY_DSN with actual Sentry DSN
# 3. Configure custom domain in deployment settings
# 4. Run 'pnpm run db:migrate' after first setup
`;

  fs.writeFileSync(path.join(appPath, '.env.example'), envTemplate);
  fs.writeFileSync(
    path.join(appPath, '.env.local'),
    `# Local development environment\n${envTemplate}`
  );
}

function getDatabaseConfig(database) {
  switch (database) {
    case 'supabase':
      return `
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
`;
    case 'neon':
      return `
NEON_URL=your_neon_database_url
NEON_API_KEY=your_neon_api_key
`;
    case 'custom-postgres':
      return `
DATABASE_URL=postgresql://user:password@localhost:5432/${clientName}_dev
`;
    default:
      return `# Database configuration for ${database} not implemented`;
  }
}

function setupDeploymentConfig(
  appPath,
  clientName,
  domain,
  template,
  database
) {
  const deploymentConfig = {
    client: {
      name: clientName,
      domain,
      framework: clientTemplates[template].framework,
      database,
      template,
    },
    deployment: {
      platform: getPlatformName(template),
      buildCommand: 'npm run build',
      outputDirectory:
        clientTemplates[template].framework === 'astro' ? 'dist' : '.next',
      environmentVariables: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: `https://${domain}`,
        NEXT_PUBLIC_CLIENT_NAME: clientName.replace('-', ' ').toUpperCase(),
      },
    },
    created: new Date().toISOString(),
    version: '1.0.0',
  };

  fs.writeFileSync(
    path.join(appPath, 'deployment.json'),
    JSON.stringify(deploymentConfig, null, 2)
  );
}

function getPlatformName(template) {
  switch (template) {
    case 'astro-marketing':
      return 'Cloudflare Pages';
    case 'nextjs-dashboard':
      return 'Vercel';
    case 'hybrid-application':
      return 'Vercel (Advanced)';
    default:
      return 'Manual';
  }
}

function updateCodeOwners(clientName) {
  const codeOwnersPath = path.join(process.cwd(), 'CODEOWNERS');
  const existingContent = fs.existsSync(codeOwnersPath)
    ? fs.readFileSync(codeOwnersPath, 'utf8')
    : '';

  const newEntry = `\n# ${clientName}\napps/client-sites/${clientName}/ @agency/client-teams @agency/tech-lead\n`;

  fs.writeFileSync(codeOwnersPath, existingContent + newEntry);
}

module.exports = { createClientProject };
```

### Component Generator

```javascript
// tools/generators/create-component.js
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

async function createComponent() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Component name (PascalCase):',
      validate: (input) =>
        /^[A-Z][a-zA-Z0-9]*$/.test(input) ||
        'Use PascalCase (e.g., MyComponent)',
    },
    {
      type: 'list',
      name: 'type',
      message: 'Component type:',
      choices: [
        { name: 'Atom (Basic UI element)', value: 'atom' },
        { name: 'Molecule (Component combination)', value: 'molecule' },
        { name: 'Organism (Complex UI section)', value: 'organism' },
        { name: 'Template (Page template)', value: 'template' },
      ],
    },
    {
      type: 'list',
      name: 'framework',
      message: 'Target framework:',
      choices: [
        { name: 'React (for Next.js)', value: 'react' },
        { name: 'Astro (for Astro sites)', value: 'astro' },
        { name: 'Both (React + Astro)', value: 'both' },
      ],
    },
    {
      type: 'confirm',
      name: 'withTests',
      message: 'Include test files?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'withStorybook',
      message: 'Include Storybook stories?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'withStyles',
      message: 'Include separate styles file?',
      default: true,
    },
  ]);

  const { name, type, framework, withTests, withStorybook, withStyles } =
    answers;

  const componentPath = path.join(
    process.cwd(),
    'packages',
    'ui-components',
    'src',
    type + 's',
    name
  );
  fs.mkdirSync(componentPath, { recursive: true });

  console.log(`🧩 Creating ${name} component...`);

  // Generate component files
  generateComponentFiles(
    componentPath,
    name,
    type,
    framework,
    withTests,
    withStorybook,
    withStyles
  );

  // Update barrel exports
  updateBarrelExports(type, name);

  console.log(`✅ ${name} component created successfully!`);
  console.log(`📁 Location: packages/ui-components/src/${type}s/${name}`);

  if (withTests) {
    console.log(
      `🧪 Test file: packages/ui-components/src/${type}s/${name}/${name}.test.tsx`
    );
  }

  if (withStorybook) {
    console.log(
      `📖 Storybook file: packages/ui-components/src/${type}s/${name}/${name}.stories.tsx`
    );
  }
}

function generateComponentFiles(
  componentPath,
  name,
  type,
  framework,
  withTests,
  withStorybook,
  withStyles
) {
  // Component file
  const componentTemplate = getComponentTemplate(name, type, framework);
  fs.writeFileSync(
    path.join(
      componentPath,
      `${name}.${framework === 'astro' ? 'astro' : 'tsx'}`
    ),
    componentTemplate
  );

  // Test file
  if (withTests) {
    const testTemplate = getTestTemplate(name, framework);
    fs.writeFileSync(
      path.join(componentPath, `${name}.test.tsx`),
      testTemplate
    );
  }

  // Storybook file
  if (withStorybook) {
    const storyTemplate = getStorybookTemplate(name, framework);
    fs.writeFileSync(
      path.join(componentPath, `${name}.stories.tsx`),
      storyTemplate
    );
  }

  // Styles file
  if (withStyles) {
    const stylesTemplate = getStylesTemplate(name, type);
    fs.writeFileSync(
      path.join(componentPath, `${name}.module.css`),
      stylesTemplate
    );
  }

  // Index file
  const indexTemplate = getIndexTemplate(name);
  fs.writeFileSync(path.join(componentPath, 'index.ts'), indexTemplate);
}

function getComponentTemplate(name, type, framework) {
  if (framework === 'astro') {
    return `---
// ${name} Astro Component
import type { HTMLAttributes } from 'astro';

interface Props extends HTMLAttributes {
  // Add your props here
}

const ${name}: Astro.Component<Props> = ({ ...props }) => {
  return (
    <div class="${type.toLowerCase()}-component" {...props}>
      <h1>${name} Component</h1>
      <p>This is a ${type} component for Astro applications.</p>
    </div>
  );
};

export default ${name};
`;
  } else {
    return `import React from 'react';

interface ${name}Props {
  // Add your props here
}

export const ${name}: React.FC<${name}Props> = ({ ...props }) => {
  return (
    <div className="${type.toLowerCase()}-component" {...props}>
      <h1>${name} Component</h1>
      <p>This is a ${type} component for React applications.</p>
    </div>
  );
};
`;
  }
}

function getTestTemplate(name, framework) {
  if (framework === 'astro') {
    return `import { test, expect } from 'vitest';
import { render } from '@testing-library/astro';

import ${name} from './${name}.astro';

describe('${name}', () => {
  test('renders correctly', () => {
    const { getByText } = render(${name} {});
    
    expect(getByText('${name} Component')).toBeInTheDocument();
    expect(getByText('This is a atom component for Astro applications.')).toBeInTheDocument();
  });
});
`;
  } else {
    return `import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import ${name} from './${name}';

describe('${name}', () => {
  test('renders correctly', () => {
    render(<${name} />);
    
    expect(screen.getByText('${name} Component')).toBeInTheDocument();
    expect(screen.getByText('This is a atom component for React applications.')).toBeInTheDocument();
  });
});
`;
  }
}

function getStorybookTemplate(name, framework) {
  if (framework === 'astro') {
    return `import type { Meta, StoryObj } from '@storybook/addon-svelte-csf';

import ${name} from './${name}.astro';

const meta: Meta<typeof ${name}> = {
  title: 'Components/${name}',
  component: ${name},
};

export default meta;
type Story = StoryObj<typeof ${name}>;

export const Default: Story = {
  args: {},
  render: (args) => ({
    Component: ${name},
    props: args,
  }),
};
`;
  } else {
    return `import type { Meta, StoryObj } from '@storybook/react';

import ${name} from './${name}';

const meta: Meta<typeof ${name}> = {
  title: 'Components/${name}',
  component: ${name},
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ${name}>;

export const Default: Story = {
  args: {},
};

export const Interactive: Story = {
  args: {
    // Add interactive props here
  },
};
`;
  }
}

function getStylesTemplate(name, type) {
  return `/* ${name} Component Styles */
.${type.toLowerCase()}-component {
  /* Base styles */
  padding: 1rem;
  border-radius: 0.5rem;
  background: var(--color-background);
  color: var(--color-foreground);
  
  /* Type-specific styles */
  ${getTypeSpecificStyles(type)}
}

${getTypeSpecificStyles(type)}

/* Responsive styles */
@media (max-width: 768px) {
  .${type.toLowerCase()}-component {
    padding: 0.75rem;
    font-size: 0.875rem;
  }
}
`;
}

function getTypeSpecificStyles(type) {
  switch (type) {
    case 'atom':
      return `
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
`;
    case 'molecule':
      return `
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;
    case 'organism':
      return `
  margin: 1rem 0;
  width: 100%;
`;
    case 'template':
      return `
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;
    default:
      return '';
  }
}

function getIndexTemplate(name) {
  return `export { default as ${name} } from './${name}';
export type { ${name}Props } from './${name}';
`;
}

function updateBarrelExports(type, name) {
  const indexPath = path.join(
    process.cwd(),
    'packages',
    'ui-components',
    'src',
    type + 's',
    'index.ts'
  );

  if (fs.existsSync(indexPath)) {
    const existingContent = fs.readFileSync(indexPath, 'utf8');
    const newExport = `export { ${name} } from './${name}';\n`;
    fs.writeFileSync(indexPath, existingContent + newExport);
  } else {
    fs.writeFileSync(indexPath, `export { ${name} } from './${name}';\n`);
  }
}

module.exports = { createComponent };
```

### Deployment Scripts (tools/deployment)

#### Automated Deployment System

```javascript
// tools/scripts/deploy-client.js
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

class DeploymentManager {
  constructor(clientName) {
    this.clientName = clientName;
    this.clientPath = path.join(
      process.cwd(),
      'apps',
      'client-sites',
      clientName
    );
  }

  async deploy(environment = 'production') {
    console.log(
      `🚀 Starting deployment of ${this.clientName} to ${environment}...`
    );

    try {
      // Load deployment configuration
      const deploymentConfig = this.loadDeploymentConfig();

      // Validate configuration
      this.validateDeploymentConfig(deploymentConfig);

      // Build application
      await this.buildApplication();

      // Deploy based on platform
      await this.deployToPlatform(deploymentConfig, environment);

      // Post-deployment verification
      await this.verifyDeployment(deploymentConfig);

      console.log(
        `✅ ${this.clientName} deployed successfully to ${environment}!`
      );
    } catch (error) {
      console.error(`❌ Deployment failed:`, error);
      process.exit(1);
    }
  }

  loadDeploymentConfig() {
    const configPath = path.join(this.clientPath, 'deployment.json');
    if (!fs.existsSync(configPath)) {
      throw new Error('deployment.json not found. Run setup first.');
    }

    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }

  validateDeploymentConfig(config) {
    const required = ['client', 'deployment', 'platform', 'domain'];
    const missing = required.filter((key) => !config[key]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required deployment config: ${missing.join(', ')}`
      );
    }
  }

  async buildApplication() {
    console.log('📦 Building application...');

    // Clean previous build
    this.cleanBuildDirectory();

    // Run build command
    execSync('npm run build', {
      cwd: this.clientPath,
      stdio: 'inherit',
    });

    console.log('✅ Build completed');
  }

  cleanBuildDirectory() {
    const config = this.loadDeploymentConfig();
    const buildDir = path.join(
      this.clientPath,
      config.deployment.outputDirectory
    );

    if (fs.existsSync(buildDir)) {
      execSync(`rm -rf "${buildDir}"`, { stdio: 'inherit' });
    }
  }

  async deployToPlatform(config, environment) {
    switch (config.deployment.platform.toLowerCase()) {
      case 'vercel':
        await this.deployToVercel(config, environment);
        break;
      case 'cloudflare':
        await this.deployToCloudflare(config, environment);
        break;
      default:
        throw new Error(`Unsupported platform: ${config.deployment.platform}`);
    }
  }

  async deployToVercel(config, environment) {
    console.log('🌐 Deploying to Vercel...');

    // Set environment variables
    this.setVercelEnvironment(config, environment);

    // Deploy to Vercel
    execSync('vercel --prod', {
      cwd: this.clientPath,
      stdio: 'inherit',
    });

    console.log('✅ Deployed to Vercel');
  }

  async deployToCloudflare(config, environment) {
    console.log('☁️ Deploying to Cloudflare Pages...');

    // Deploy to Cloudflare Pages
    execSync(
      'wrangler pages deploy dist --project-name ' + config.client.name,
      {
        cwd: this.clientPath,
        stdio: 'inherit',
      }
    );

    console.log('✅ Deployed to Cloudflare Pages');
  }

  setVercelEnvironment(config, environment) {
    const projectName = `${config.client.name}-${environment}`;

    // Set environment variables
    Object.entries(config.deployment.environmentVariables).forEach(
      ([key, value]) => {
        execSync(`vercel env add ${key}="${value}" ${projectName}`, {
          stdio: 'inherit',
        });
      }
    );
  }

  async verifyDeployment(config) {
    console.log('🔍 Verifying deployment...');

    // Wait for deployment to propagate
    await new Promise((resolve) => setTimeout(resolve, 30000));

    // Check if site is accessible
    const url = `https://${config.client.domain}`;
    const response = await fetch(url);

    if (response.ok) {
      console.log(`✅ Deployment verified: ${url} is accessible`);
    } else {
      console.log(
        `⚠️  Deployment verification failed: ${url} returned ${response.status}`
      );
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node deploy-client.js <client-name> [environment]');
    console.log('Environment defaults to "production"');
    process.exit(1);
  }

  const [clientName, environment = 'production'] = args;

  const deployer = new DeploymentManager(clientName);
  await deployer.deploy(environment);
}

if (require.main === module) {
  main();
}

module.exports = DeploymentManager;
```

---

## Documentation Directory

### Architecture Documentation (docs/architecture)

#### System Design Documents

```markdown
# docs/architecture/monorepo-design.md

# Marketing Agency Monorepo Architecture

## Overview

This monorepo architecture is designed specifically for marketing agencies
managing multiple client websites, landing pages, and business applications with
a focus on scalability, maintainability, and developer productivity.

## Design Principles

### 1. Single Source of Truth

- All configuration centralized at root level
- Consistent tooling across all packages
- Shared dependencies managed through workspace

### 2. Clear Boundaries

- Each package has well-defined responsibilities
- Enforced dependency rules prevent circular dependencies
- Module boundaries protect architectural integrity

### 3. Framework Optimization

- Astro for content-heavy, SEO-optimized sites
- Next.js for interactive applications
- Hybrid approach for complex requirements

### 4. Developer Experience

- Comprehensive code generation
- Automated testing and deployment
- Hot reloading across packages
- Consistent development environment

## Package Categories

### Applications (apps/)

Deployable applications serving specific business purposes:

- **Agency Website**: Marketing and portfolio
- **Client Sites**: Custom client applications
- **Internal Tools**: Agency operations and management

### Packages (packages/)

Shared code libraries providing common functionality:

- **UI Components**: Reusable React/Astro components
- **Design System**: Design tokens and themes
- **Platform**: Core infrastructure (database, auth, CMS)
- **Shared**: Business logic and utilities

### Tools (tools/)

Development and automation utilities:

- **Generators**: Code scaffolding and templates
- **Deployment**: CI/CD automation
- **Governance**: Policy enforcement and compliance

## Technology Stack

### Frontend

- **Frameworks**: Astro 6.0, Next.js 16
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4.0 with CSS-first configuration
- **Components**: Custom component library with React 19.2+
- **Build Tools**: Turborepo 2.9 with 96% performance improvement

### Backend

- **Database**: Supabase (PostgreSQL), Neon
- **Authentication**: Supabase Auth
- **API**: RESTful with TypeScript

### Infrastructure

- **Deployment**: Vercel, Cloudflare Pages
- **Monitoring**: Sentry, Google Analytics
- **CI/CD**: GitHub Actions, Turborepo

## Scaling Strategy

### Team Size 1-10 Developers

- Turborepo for build optimization
- Shared component library
- Basic governance through CODEOWNERS

### Team Size 10-50 Developers

- Turborepo with Nx Cloud caching
- Advanced code generation
- Automated policy enforcement

### Team Size 50+ Developers

- Full Nx implementation
- Distributed task execution
- Advanced governance and compliance

## Migration Path

### Phase 1: Foundation (Weeks 1-4)

1. Repository setup with pnpm workspaces
2. Core package development
3. Basic CI/CD pipeline
4. Development environment configuration

### Phase 2: Templates (Weeks 5-8)

1. Client project templates
2. Code generators
3. Component library expansion
4. Deployment automation

### Phase 3: Advanced (Weeks 9-12)

1. Advanced security features
2. Performance optimization
3. Comprehensive monitoring
4. Enterprise governance
```

### Client Onboarding (docs/client-onboarding)

#### Getting Started Guide

````markdown
# docs/client-onboarding/getting-started.md

# Client Onboarding Guide

## Quick Start

### Prerequisites

- Node.js 18+ and pnpm 8+
- Git and GitHub account
- Access to agency repository
- Basic familiarity with TypeScript and React

### Initial Setup

#### 1. Repository Access

```bash
# Clone the repository
git clone https://github.com/your-org/marketing-agency-monorepo.git
cd marketing-agency-monorepo

# Install dependencies
pnpm install

# Setup development environment
pnpm run dev:setup
```
````

#### 2. Create Your First Client Project

```bash
# Generate a new client project
pnpm run new:client

# Follow the interactive prompts:
# - Client name (kebab-case)
# - Template selection
# - Database provider
# - Domain configuration
# - Analytics setup
```

#### 3. Development Workflow

```bash
# Navigate to client project
cd apps/client-sites/your-client-name

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

### Development Best Practices

#### Code Organization

- Follow established directory structure
- Use TypeScript for all new code
- Write tests for all components
- Document complex business logic

#### Collaboration

- Create feature branches from main
- Use descriptive commit messages
- Request code reviews for all changes
- Update documentation with new features

#### Quality Assurance

- Run linting before commits
- Maintain test coverage above 85%
- Use Storybook for component development
- Test across different browsers

### Common Workflows

#### Adding New Features

1. Create feature branch: `git checkout -b feature/new-feature`
2. Develop and test locally
3. Commit changes: `git commit -m "feat: add new feature"`
4. Push and create pull request
5. Request review from team lead

#### Deploying Changes

1. Update version in package.json
2. Build application: `pnpm build`
3. Deploy to staging: `pnpm run deploy:staging`
4. Test on staging environment
5. Deploy to production: `pnpm run deploy:production`

### Troubleshooting

#### Common Issues

**Build Failures**

- Check TypeScript errors: `pnpm run type-check`
- Verify dependencies: `pnpm install`
- Clear build cache: `pnpm run clean`

**Development Server Issues**

- Check port conflicts: `lsof -i :3000`
- Verify environment variables: `cat .env.local`
- Restart services: `pnpm run dev:setup`

**Deployment Problems**

- Verify domain configuration
- Check build output directory
- Review deployment logs
- Validate environment variables

#### Getting Help

- Check documentation: `docs/` directory
- Review templates: `tools/templates/`
- Contact team: `@agency/tech-lead`
- Create issue: Use GitHub issue template

````

---

## Governance Directory

### CODEOWNERS Configuration

```markdown
# governance/CODEOWNERS

# Agency Core Platform
packages/platform/ @agency/platform-team @agency/tech-lead
packages/ui-components/ @agency/design-system-team
packages/design-system/ @agency/design-system-team @agency/tech-lead

# Client-Specific Code
apps/client-sites/client-alpha/ @team-alpha @agency/oversight
apps/client-sites/client-beta/ @team-beta @agency/oversight
apps/client-sites/client-gamma/ @team-gamma @agency/oversight

# Internal Tools
apps/internal-tools/ @agency/internal-tools-team

# Shared Packages
packages/shared/ @agency/platform-team @agency/tech-lead
packages/analytics/ @agency/platform-team

# All packages require platform review
packages/ @agency/platform-team @agency/tech-lead

# Emergency changes
* @agency/tech-lead @agency/devops-team

# Documentation
docs/ @agency/tech-lead @agency/documentation-team
````

### Policy Documentation

```markdown
# governance/policies/dependency-policy.md

# Dependency Management Policy

## Purpose

Establish clear guidelines for managing dependencies across the monorepo to
ensure security, maintainability, and performance.

## Policy Rules

### 1. Dependency Categories

- **Production Dependencies**: Required for runtime functionality
- **Development Dependencies**: Used only during development
- **Peer Dependencies**: Must be provided by consuming applications
- **Optional Dependencies**: Enhance functionality but not required

### 2. Approval Process

- **Security Updates**: Immediate approval and deployment
- **Major Updates**: Review within 3 business days
- **New Dependencies**: Architectural review required
- **Breaking Changes**: Requires team consensus

### 3. Prohibited Dependencies

- **Deprecated Packages**: No packages without active maintenance
- **Security Risk**: Packages with known vulnerabilities
- **Size Restrictions**: Packages > 10MB compressed require justification
- **Duplicate Functionality**: No multiple packages serving same purpose

### 4. Version Management

- **Semantic Versioning**: Follow semver for all packages
- **Workspace Dependencies**: Use `workspace:*` for internal packages
- **Catalog Management**: Centralized version control through pnpm catalog
- **Update Cadence**: Monthly security updates, quarterly feature updates

### 5. Audit Requirements

- **Weekly Scans**: Automated vulnerability scanning
- **License Compliance**: Verify all package licenses
- **Supply Chain Security**: Monitor transitive dependencies
- **Remediation Timeline**: Critical issues within 24 hours

## Enforcement

### Automated Checks

- CI/CD pipeline validates dependency rules
- Automated security scanning on all changes
- License compliance checks in pull requests
- Size monitoring for new dependencies

### Manual Review

- Architectural review for major dependency changes
- Security team approval for high-risk packages
- Performance impact assessment for significant additions

## Exceptions

### Emergency Exceptions

- Critical security fixes may bypass normal process
- Document emergency exceptions with post-mortem
- Review emergency exceptions within 1 business day

### Compliance

### Regulatory Requirements

- GDPR compliance for all European client data
- SOC 2 Type II compliance for enterprise clients
- Data processing agreements for all client projects
- Privacy by design principles in all packages
```

---

## Development Environment

### DevContainer Configuration

```json
// .devcontainer/devcontainer.json
{
  "name": "Marketing Agency Monorepo",
  "dockerComposeFile": "../docker-compose.dev.yml",
  "service": "workspace",
  "workspaceFolder": "/workspace",
  "features": {
    "ghcr.io/devcontainers/features/node:1": {
      "version": "20",
      "pnpm": "latest"
    },
    "ghcr.io/devcontainers/features/github-cli:1": {},
    "ghcr.io/devcontainers/features/common-utils:2": {},
    "ghcr.io/devcontainers/features/docker-in-docker:1": {}
  },
  "postCreateCommand": "pnpm install && turbo run dev:setup",
  "postStartCommand": "turbo run dev --parallel",
  "forwardPorts": [3000, 3001, 3002, 6006, 8911],
  "portsAttributes": {
    "3000": {
      "label": "Agency Website (Astro)",
      "onAutoForward": "notify"
    },
    "3001": {
      "label": "Client Alpha (Next.js)",
      "onAutoForward": "notify"
    },
    "3002": {
      "label": "Client Beta (Astro)",
      "onAutoForward": "notify"
    },
    "6006": {
      "label": "Storybook",
      "onAutoForward": "notify"
    },
    "8911": {
      "label": "Database Admin",
      "onAutoForward": "notify"
    }
  },
  "customizations": {
    "vscode": {
      "extensions": [
        "bradlc.vscode-tailwindcss",
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint",
        "ms-vscode.vscode-typescript-next",
        "ms-vscode.vscode-prisma",
        "ms-vscode-azuretools",
        "github.copilot",
        "ms-vscode.vscode-json"
      ],
      "settings": {
        "typescript.preferences.importModuleSpecifier": "relative",
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.codeActionsOnSave": {
          "source.fixAll.eslint": true
        },
        "files.associations": {
          "*.astro": "astro",
          "*.mdx": "mdx"
        },
        "emmet.includeLanguages": ["astro", "typescriptreact", "typescript"]
      }
    }
  }
}
```

### Docker Development Services

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  workspace:
    build:
      context: .
      dockerfile: Dockerfile.dev
      target: development
    volumes:
      - ..:/workspace:cached
    command: sleep infinity
    environment:
      - NODE_ENV=development
      - PNPM_HOME=/pnpm
      - TURBO_TOKEN=${TURBO_TOKEN}
      - DATABASE_URL=postgresql://dev:dev123@postgres:5432/agency_dev
    ports:
      - '3000:3000'
    depends_on:
      - postgres
      - redis
      - minio

  postgres:
    image: postgres:15-alpine
    container_name: agency-postgres-dev
    environment:
      POSTGRES_DB: agency_dev
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev123
      POSTGRES_INITDB_ARGS: '--encoding=UTF-8'
      POSTGRES_HOST_AUTH_METHOD: 'trust'
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./tools/database/init:/docker-entrypoint-initdb.d
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U dev -d agency_dev']
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: agency-redis-dev
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 3s
      retries: 3
    restart: unless-stopped

  minio:
    image: minio/minio:latest
    container_name: agency-minio-dev
    ports:
      - '9000:9000'
      - '9001:9001'
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
      MINIO_DEFAULT_BUCKET: agency-assets
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"
    restart: unless-stopped

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  minio_data:
    driver: local

networks:
  default:
    driver: bridge
```

---

## Build System Configuration

### Turborepo Optimization

#### Remote Caching Setup

```json
{
  "remoteCache": {
    "enabled": true,
    "team": "agency-team",
    "token": "$TURBO_TOKEN",
    "signature": true
  }
}
```

#### Task Dependency Graph

```typescript
// tools/build-system/task-graph.ts
export const taskDependencies = {
  // Database tasks must run first
  'db:generate': [],
  'db:migrate': ['db:generate'],
  'db:seed': ['db:migrate'],

  // Build tasks depend on database and types
  build: ['^build', 'db:generate'],

  // Test tasks depend on build
  test: ['build'],
  'test:e2e': ['build'],

  // Linting can run in parallel
  lint: [],
  'type-check': ['^build'],

  // Documentation depends on build
  'docs:build': ['^build'],
  'storybook:build': ['^build'],
};
```

---

## Testing Strategy

### Multi-Level Testing Approach

#### 1. Unit Testing

- **Framework**: Vitest for fast unit tests
- **Coverage**: Minimum 85% for all packages
- **Automation**: Pre-commit hooks and CI integration

#### 2. Integration Testing

- **Database**: Test with real PostgreSQL instances
- **API**: Test all package integrations
- **Cross-package**: Verify workspace dependencies

#### 3. End-to-End Testing

- **Framework**: Playwright for browser automation
- **Environments**: Test against staging and production
- **Visual Regression**: Automated screenshot comparisons

#### 4. Performance Testing

- **Bundle Analysis**: Automated size monitoring
- **Load Testing**: Simulate traffic patterns
- **Core Web Vitals**: Automated performance tracking

---

## Deployment Architecture

### Multi-Platform Strategy

#### Vercel Deployment (Next.js)

```typescript
// tools/deployment/vercel-config.ts
export const vercelConfig = {
  framework: 'nextjs',
  buildCommand: 'next build',
  outputDirectory: '.next',
  installCommand: 'pnpm install',
  devCommand: 'next dev',
  functions: {
    directory: 'api',
    maxDuration: 10,
  },
  env: {
    NODE_ENV: 'production',
    NEXT_PUBLIC_SITE_URL: '${VERCEL_URL}',
  },
  regions: ['iad1', 'sfo1', 'hnd1'],
  domains: {
    custom: true,
  },
};
```

#### Cloudflare Pages Deployment (Astro)

```typescript
// tools/deployment/cloudflare-config.ts
export const cloudflareConfig = {
  framework: 'astro',
  buildCommand: 'astro build',
  outputDirectory: 'dist',
  installCommand: 'pnpm install',
  devCommand: 'astro dev',
  functions: false,
  env: {
    NODE_ENV: 'production',
    CF_PAGES: '1',
  },
  compatibilityDate: '2024-01-01',
};
```

---

## Security Framework

### Multi-Layer Security

#### 1. Application Security

```typescript
// packages/security/src/middleware.ts
export const securityConfig = {
  // Content Security Policy
  csp: {
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'font-src': ["'self'", 'https:'],
      'connect-src': ["'self'", 'https://api.supabase.io'],
    },
  },

  // Security headers
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  },
};
```

#### 2. Database Security

```typescript
// packages/database/src/security.ts
export const databaseSecurity = {
  // Row Level Security policies
  rlsPolicies: `
    -- Enable RLS on all client tables
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
    ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
    
    -- Client isolation policies
    CREATE POLICY client_isolation ON profiles
      FOR ALL TO authenticated_users
      USING (client_id = current_setting('app.client_id'));
    
    CREATE POLICY client_isolation ON projects
      FOR ALL TO authenticated_users
      USING (client_id = current_setting('app.client_id'));
  `,

  // Encryption at rest
  encryption: {
    algorithm: 'AES-256',
    keyRotation: '90-days',
    fields: ['email', 'phone', 'ssn', 'financial_data'],
  },

  // Audit logging
  audit: {
    enabled: true,
    logLevel: 'INFO',
    retention: '7-years',
    events: ['LOGIN', 'DATA_ACCESS', 'SCHEMA_CHANGE', 'PERMISSION_CHANGE'],
  },
};
```

---

## Migration Strategy

### Phase-Based Implementation

#### Phase 1: Foundation (Weeks 1-4)

**Goal**: Establish core infrastructure and basic workflows

**Week 1**: Repository Setup

- [ ] Initialize monorepo with pnpm workspaces
- [ ] Configure Turborepo with basic pipeline
- [ ] Set up root package.json with essential scripts
- [ ] Create basic folder structure
- [ ] Initialize Git repository with standard branches

**Week 2**: Core Packages

- [ ] Create `packages/types` with base TypeScript definitions
- [ ] Set up `packages/design-system` with design tokens
- [ ] Initialize `packages/ui-components` with basic components
- [ ] Configure `packages/database` with Supabase/Neon adapters
- [ ] Set up `packages/testing` with Vitest/Playwright

**Week 3**: Development Environment

- [ ] Configure Docker development environment
- [ ] Set up DevContainer for consistent development
- [ ] Create environment variable templates
- [ ] Configure local database services
- [ ] Set up hot reloading across packages

**Week 4**: CI/CD Foundation

- [ ] Configure GitHub Actions workflows
- [ ] Set up automated testing pipeline
- [ ] Configure build and deployment scripts
- [ ] Implement basic security scanning
- [ ] Set up code quality checks

#### Phase 2: Templates & Automation (Weeks 5-8)

**Goal**: Build reusable templates and automation tools

**Week 5**: Template Development

- [ ] Create Astro marketing site template
- [ ] Develop Next.js dashboard template
- [ ] Build hybrid application template
- [ ] Set up component library integration
- [ ] Configure theme system

**Week 6**: Code Generators

- [ ] Implement client project generator
- [ ] Create component generator
- [ ] Build package generator
- [ ] Set up template customization system
- [ ] Create documentation generators

**Week 7**: Deployment Automation

- [ ] Configure Vercel deployment pipeline
- [ ] Set up Cloudflare Pages deployment
- [ ] Implement multi-environment support
- [ ] Create deployment monitoring
- [ ] Set up rollback procedures

**Week 8**: Testing Infrastructure

- [ ] Configure comprehensive test suites
- [ ] Set up E2E testing with Playwright
- [ ] Implement visual regression testing
- [ ] Configure performance testing
- [ ] Set up test reporting

#### Phase 3: Advanced Features (Weeks 9-12)

**Goal**: Implement enterprise-grade features and governance

**Week 9**: Advanced Security

- [ ] Implement Row Level Security policies
- [ ] Set up comprehensive audit logging
- [ ] Configure advanced threat detection
- [ ] Implement secret management
- [ ] Set up compliance reporting

**Week 10**: Monitoring & Observability

- [ ] Configure application performance monitoring
- [ ] Set up error tracking with Sentry
- [ ] Implement real user monitoring
- [ ] Configure Core Web Vitals tracking
- [ ] Set up custom dashboards

**Week 11**: Advanced Governance

- [ ] Implement architectural policy enforcement
- [ ] Set up automated dependency checking
- [ ] Configure code ownership automation
- [ ] Implement change management procedures
- [ ] Set up compliance automation

**Week 12**: Production Readiness

- [ ] Complete performance optimization
- [ ] Finalize security hardening
- [ ] Complete compliance documentation
- [ ] Set up production monitoring
- [ ] Create disaster recovery procedures

---

## Operational Procedures

### Daily Operations

#### Development Workflow

1. **Morning Standup** (9:00 AM)
   - Review昨日 commits and pull requests
   - Check CI/CD pipeline status
   - Address any blocking issues

2. **Development Sprints** (9:30 AM - 5:30 PM)
   - Feature development on current sprint
   - Code reviews for completed work
   - Update documentation as needed

3. **End-of-Day Wrap-up** (5:30 PM)
   - Commit completed work
   - Update project tracking
   - Plan next day's priorities

#### Weekly Operations

#### Monday: Planning & Architecture

- Sprint planning and goal setting
- Architecture reviews and decisions
- Technical debt assessment

#### Tuesday: Development Focus

- Core development work
- Code reviews and pair programming
- Knowledge sharing sessions

#### Wednesday: Quality & Testing

- Comprehensive testing efforts
- Bug fixes and optimizations
- Performance improvements

#### Thursday: Integration & Deployment

- Feature integration testing
- Staging deployments
- Client demonstrations

#### Friday: Review & Documentation

- Sprint review and retrospectives
- Documentation updates
- Planning for next sprint

### Incident Response

#### Severity Levels

- **Critical**: Production down, data breach, security incident
- **High**: Major functionality broken, performance degradation
- **Medium**: Partial functionality loss, UI issues
- **Low**: Minor bugs, documentation updates

#### Response Times

- **Critical**: 15 minutes response, 1 hour resolution
- **High**: 1 hour response, 4 hour resolution
- **Medium**: 4 hours response, 24 hour resolution
- **Low**: 24 hours response, 1 week resolution

#### Escalation Procedures

1. **Detection**: Automated monitoring alerts
2. **Assessment**: Impact analysis and severity determination
3. **Response**: Incident assignment and communication
4. **Resolution**: Fix implementation and verification
5. **Post-mortem**: Root cause analysis and prevention

---

## Conclusion

This comprehensive architecture blueprint provides a production-ready foundation
for building and scaling a marketing agency monorepo. The design emphasizes:

### Key Success Factors

1. **Scalability**: Supports growth from 1 to 100+ developers
2. **Maintability**: Clear boundaries and automated governance
3. **Productivity**: Comprehensive automation and developer experience
4. **Security**: Multi-layer security with compliance built-in
5. **Flexibility**: Hybrid framework approach for diverse client needs

### Implementation Approach

- **Phased Rollout**: Gradual implementation over 12 weeks
- **Team Training**: Comprehensive documentation and onboarding
- **Continuous Improvement**: Regular assessment and optimization

### Next Steps

1. Review and customize architecture based on specific agency needs
2. Begin Phase 1 implementation with focus on foundation
3. Establish team training and documentation processes
4. Gradually implement advanced features as team scales

This architecture provides the foundation for building a world-class marketing
agency capable of delivering exceptional results for clients while maintaining
operational excellence and developer satisfaction.

---

_Architecture Blueprint v1.0 - Created April 2026_ _Based on research from
Google, Meta, Microsoft, Uber engineering practices_ _Optimized for marketing
agency workflows and client delivery excellence_
