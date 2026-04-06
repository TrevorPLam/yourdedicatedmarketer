# Enterprise Monorepo Patterns

## Overview

Enterprise monorepos consolidate multiple related applications, libraries, and tools into a single version-controlled repository. This approach enables atomic commits across projects, simplified dependency management, and consistent tooling across the organization.

**Source**: Based on [Vercel Academy Production Monorepos](https://vercel.com/academy/production-monorepos), [Turborepo v2.9 Documentation](https://turborepo.dev/docs), [Nx Enterprise Patterns](https://nx.dev/), and [Google Piper/Meta Sapling research](https://research.google/pubs/pub45407/).

---

## When to Use a Monorepo

### Team Size Thresholds (2026)

| Team Size | Recommendation | Rationale |
|-----------|----------------|-----------|
| 1-3 developers | npm workspaces + Makefile | Minimal complexity needed |
| 3-15 developers | Turborepo | Fast, simple, effective caching |
| 15-50 developers | Turborepo + Vercel Remote Cache | Balance of simplicity and features |
| 50+ developers | Nx or Turborepo Enterprise | Architectural governance required |

**Minimum Requirements for Monorepo (2026)**:
- 10+ developers sharing code
- Multiple related applications
- CI taking 20+ minutes without optimization
- Frequent cross-project changes requiring atomic commits
- Shared component libraries across applications

### Use Case Matrix

| Scenario | Monorepo Fit | Alternative |
|----------|--------------|-------------|
| 5+ microservices with shared libraries | Excellent | - |
| Single application with 2-3 packages | Good | Consider separate repos |
| Multi-platform mobile apps (iOS/Android/Web) | Excellent | - |
| Independent SaaS products | Poor | Separate repositories |
| Legacy migration projects | Good | Gradual consolidation |

---

## Architecture Patterns

### 1. Repository Structure

```
enterprise-monorepo/
├── apps/                          # Deployable applications
│   ├── web-app/                  # Next.js production app
│   ├── mobile-app/               # React Native/Expo app
│   ├── admin-dashboard/            # Internal tooling
│   └── api-gateway/                # Backend services
├── packages/                      # Shared libraries
│   ├── ui-components/              # Design system
│   ├── utils/                      # Shared utilities
│   ├── types/                      # TypeScript definitions
│   ├── api-client/                 # API abstractions
│   └── config/                     # Shared configurations
├── tools/                         # Infrastructure
│   ├── generators/                 # Code scaffolding
│   ├── scripts/                    # Automation scripts
│   └── testing/                    # Test utilities
├── docs/                          # Documentation
└── infrastructure/                # DevOps/IaC
    ├── terraform/
    ├── kubernetes/
    └── docker/
```

### 2. Dependency Graph Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐  │
│  │  web-app    │ │ mobile-app  │ │   admin-dashboard   │  │
│  └──────┬──────┘ └──────┬──────┘ └──────────┬──────────┘  │
└─────────┼───────────────┼────────────────────┼─────────────┘
          │               │                    │
          └───────────────┼────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                         ▼                                   │
│                 Shared Packages                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐  │
│  │ui-components│ │  api-client  │ │       utils         │  │
│  └──────┬──────┘ └──────┬──────┘ └──────────┬──────────┘  │
└─────────┼───────────────┼────────────────────┼─────────────┘
          │               │                    │
          └───────────────┼────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Foundation Layer                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐    │
│  │    types    │ │    config    │ │   design-tokens     │    │
│  └─────────────┘ └─────────────┘ └─────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 3. Layered Architecture Rules

```typescript
// tools/governance/layer-enforcement.ts
interface LayerRule {
  layer: 'application' | 'domain' | 'platform';
  canImportFrom: string[];
  cannotImportFrom: string[];
}

export const layerRules: LayerRule[] = [
  {
    layer: 'application',
    canImportFrom: ['domain', 'platform'],
    cannotImportFrom: ['application'], // No app-to-app deps
  },
  {
    layer: 'domain',
    canImportFrom: ['platform'],
    cannotImportFrom: ['application', 'domain'],
  },
  {
    layer: 'platform',
    canImportFrom: [], // Foundation layer
    cannotImportFrom: ['application', 'domain'],
  },
];
```

---

## Tool Selection

### Turborepo vs Nx Comparison (2026)

| Feature | Turborepo 2.9+ | Nx 20+ |
|---------|----------------|--------|
| **Performance** | 96% faster Time to First Task | ~3s startup |
| **Remote Caching** | Built-in (Vercel) | Nx Cloud required |
| **Task Orchestration** | Excellent | Excellent |
| **Code Generation** | Basic (turbo gen) | Advanced generators |
| **Module Boundaries** | Package boundaries (stable) | Advanced lint rules |
| **Visual Graph** | CLI + Web UI | Excellent Nx Console |
| **Best For** | Fast, simple setups | 50+ devs, governance |
| **Pricing** | Free remote cache | $19/active contributor |

### Decision Matrix

```
Choose Turborepo when:
✓ Team size: 3-50 developers
✓ Need: Fast builds, simple setup
✓ Priority: Developer experience
✓ Budget: Free remote caching

Choose Nx when:
✓ Team size: 50+ developers
✓ Need: Advanced governance
✓ Priority: Code ownership enforcement
✓ Budget: Enterprise tooling investment
```

---

## Implementation Patterns

### 1. Workspace Configuration (pnpm)

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tools/*'

# Dependency catalog for consistency
catalog:
  react: ^19.2.0
  next: ^16.0.0
  typescript: ^5.9.0
  turbo: ^2.9.0
  
  # Only in catalog if used by 3+ packages
  '@types/node': ^22.12.0
  vitest: ^3.0.0
```

### 2. Turborepo Pipeline Configuration

```json
{
  "$schema": "https://turborepo.com/schema.json",
  "globalDependencies": [
    ".env",
    "$TURBO_CACHE_KEY"
  ],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"],
      "env": ["NODE_ENV", "API_URL"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "inputs": ["src/**", "test/**"]
    },
    "lint": {
      "dependsOn": [],
      "outputs": [],
      "inputs": ["src/**", "*.config.*"]
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": [],
      "inputs": ["src/**", "types/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  },
  "remoteCache": {
    "enabled": true
  }
}
```

### 3. Package Boundaries Configuration

```typescript
// tools/governance/package-configs.ts
export interface PackageConfig {
  name: string;
  type: 'app' | 'ui' | 'utils' | 'platform';
  layer: 'application' | 'domain' | 'platform';
  allowedDependencies: string[];
  forbiddenDependencies: string[];
}

export const packageConfigs: PackageConfig[] = [
  {
    name: '@company/ui-components',
    type: 'ui',
    layer: 'domain',
    allowedDependencies: [
      '@company/design-tokens',
      '@company/types',
      '@company/utils'
    ],
    forbiddenDependencies: [
      '@company/api-client', // UI shouldn't know about API
      'apps/*'              // No app imports
    ]
  },
  {
    name: '@company/api-client',
    type: 'utils',
    layer: 'domain',
    allowedDependencies: [
      '@company/types',
      '@company/config'
    ],
    forbiddenDependencies: [
      '@company/ui-components', // No circular deps
      'apps/*'
    ]
  }
];
```

---

## Enterprise Patterns

### 1. Multi-Team Repository Structure

```
monorepo/
├── apps/
│   ├── team-alpha/          # Team ownership
│   │   ├── web-app/
│   │   └── mobile-app/
│   └── team-beta/
│       ├── dashboard/
│       └── api/
├── shared/                  # Platform team owns
│   ├── ui-components/
│   ├── utils/
│   └── types/
└── infrastructure/         # DevOps team owns
    ├── ci-cd/
    └── terraform/
```

### 2. CODEOWNERS Enforcement

```
# CODEOWNERS
# Global ownership
* @platform-team

# Team-specific apps
apps/team-alpha/** @team-alpha @platform-team
apps/team-beta/** @team-beta @platform-team

# Shared packages (requires platform approval)
shared/** @platform-team
packages/** @platform-team

# Infrastructure
infrastructure/** @devops-team
.github/** @devops-team
```

### 3. CI/CD Pipeline Pattern

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Determine which packages changed
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      packages: ${{ steps.changes.outputs.packages }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v2
        id: changes
        with:
          filters: |
            web-app:
              - 'apps/web-app/**'
              - 'packages/ui-components/**'
            api:
              - 'apps/api/**'
              - 'packages/api-client/**'

  # Run affected tests only
  test:
    needs: detect-changes
    runs-on: ubuntu-latest
    strategy:
      matrix:
        package: ${{ fromJson(needs.detect-changes.outputs.packages) }}
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo run test --filter=${{ matrix.package }}
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ vars.TURBO_TEAM }}
```

---

## Performance Optimization

### 1. Caching Strategy

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"],
      "inputs": [
        "src/**",
        "package.json",
        "tsconfig.json",
        "$TURBO_HASH_KEYS"
      ]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "inputs": [
        "src/**",
        "test/**",
        "package.json"
      ]
    }
  }
}
```

### 2. Remote Caching Setup

```bash
# Enable Vercel Remote Cache
turbo login
turbo link

# Or configure in turbo.json
{
  "remoteCache": {
    "enabled": true,
    "signature": true
  }
}
```

### 3. Build Performance Benchmarks (2026)

| Scenario | Traditional | Optimized | Improvement |
|----------|-------------|-----------|-------------|
| Full build (10 packages) | 15 min | 6 min | 60% faster |
| Single package change | 15 min | 90 sec | 90% faster |
| Cache hit scenario | 45 sec | 1.8 sec | 96% faster |
| Parallel type-check | 8 min | 1.5 min | 81% faster |

---

## Governance Patterns

### 1. Automated Dependency Checking

```typescript
// tools/governance/check-dependencies.ts
import { packageConfigs } from './package-configs';

export function checkPackageBoundaries(
  packageName: string,
  dependencies: string[]
): boolean {
  const config = packageConfigs.find(p => p.name === packageName);
  if (!config) return true;

  const violations = dependencies.filter(dep => {
    // Check forbidden dependencies
    const isForbidden = config.forbiddenDependencies.some(forbidden =>
      dep === forbidden || dep.startsWith(forbidden.replace('*', ''))
    );
    
    // Check not in allowed list
    const isAllowed = config.allowedDependencies.some(allowed =>
      dep === allowed || dep.startsWith(allowed.replace('*', ''))
    );
    
    return isForbidden || (!isAllowed && !dep.startsWith('@types/'));
  });

  if (violations.length > 0) {
    console.error(`❌ ${packageName} has dependency violations:`);
    violations.forEach(v => console.error(`   - ${v}`));
    return false;
  }

  return true;
}
```

### 2. Dependency Governance Rules

```json
{
  "forbiddenDependencies": {
    "reason": "Use native JavaScript alternatives",
    "packages": [
      "lodash",
      "moment",
      "jquery",
      "underscore"
    ]
  },
  "requiredDevDependencies": {
    "all": ["typescript", "eslint", "prettier"],
    "apps": ["@types/node"],
    "packages": ["vitest"]
  },
  "versionConsistency": {
    "react": "catalog:",
    "typescript": "catalog:"
  }
}
```

---

## Migration Strategies

### 1. From Multi-Repo to Monorepo

```bash
# Step 1: Create monorepo structure
git init enterprise-monorepo
mkdir -p apps packages tools

# Step 2: Import existing repos with history
git subtree add --prefix=apps/legacy-app \
  https://github.com/company/legacy-app.git main

git subtree add --prefix=packages/shared-lib \
  https://github.com/company/shared-lib.git main

# Step 3: Consolidate configurations
pnpm init
# Configure pnpm-workspace.yaml
# Configure turbo.json

# Step 4: Update imports
# Find: from '@company/shared-lib'
# Replace: from '@company/shared-lib'

# Step 5: Establish CI/CD
# Configure GitHub Actions
# Set up remote caching
```

### 2. Gradual Consolidation Plan

| Phase | Timeline | Activities |
|-------|----------|------------|
| 1 | Week 1-2 | Infrastructure setup, shared packages |
| 2 | Week 3-4 | Migrate 2-3 apps, establish patterns |
| 3 | Week 5-8 | Migrate remaining apps |
| 4 | Week 9-12 | Optimize CI/CD, governance |

---

## Best Practices

### Do's

✅ **Keep packages small and focused**  
✅ **Use workspace protocol (`workspace:*`)** for internal deps  
✅ **Enable remote caching for CI**  
✅ **Automate dependency checking**  
✅ **Use CODEOWNERS for clear ownership**  
✅ **Document package purposes**  
✅ **Version shared packages independently**  
✅ **Test cross-package changes**  

### Don'ts

❌ **Don't create circular dependencies**  
❌ **Don't commit build artifacts**  
❌ **Don't use exact versions for internal deps**  
❌ **Don't skip CI for monorepo changes**  
❌ **Don't allow cross-app imports**  
❌ **Don't ignore build cache misses**  

---

## Troubleshooting

### Common Issues

**Slow builds despite caching**
```bash
# Check cache hit rate
turbo run build --dry-run

# Verify input patterns in turbo.json
# Ensure consistent environment variables
```

**Circular dependencies**
```bash
# Visualize dependency graph
turbo run build --graph

# Check for: packages/a → packages/b → packages/a
```

**CI cache misses**
```bash
# Ensure TURBO_TOKEN is set
# Verify environment variable consistency
# Check .gitignore for build outputs
```

---

## Resources

### Official Documentation
- [Turborepo Documentation](https://turborepo.dev/docs)
- [Nx Documentation](https://nx.dev/getting-started/intro)
- [pnpm Workspaces](https://pnpm.io/workspaces)

### Research Papers
- [Google Piper Paper](https://research.google/pubs/pub45407/)
- [Meta Sapling Documentation](https://sapling-scm.com/)
- [Microsoft Git Monorepo Case Study](https://devblogs.microsoft.com/bharry/scaling-git/)

### Tools
- [Turborepo](https://turbo.build/)
- [Nx](https://nx.dev/)
- [Changesets](https://github.com/changesets/changesets)

---

_Updated April 2026 based on official vendor documentation and enterprise best practices._
