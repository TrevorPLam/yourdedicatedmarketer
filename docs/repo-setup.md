# Repository Setup

This document describes the monorepo structure and tooling decisions for the Your Dedicated Marketer project.

## Monorepo Structure

The project uses a monorepo architecture managed by **Turborepo** with **pnpm workspaces**.

### Directory Layout

```
.
├── apps/
│   └── firm-website/     # Next.js 15 marketing website
├── packages/
│   ├── ui/               # Shared UI components
│   ├── lib/              # Shared utility libraries
│   ├── eslint-config/    # Shared ESLint configuration
│   ├── typescript-config/# Shared TypeScript configuration
│   └── tailwind-config/  # Shared Tailwind CSS configuration
├── docs/                 # Documentation
├── turbo.json            # Turborepo configuration
├── pnpm-workspace.yaml   # pnpm workspace configuration
└── package.json          # Root package.json
```

## Tooling Decisions

### Turborepo + pnpm Workspaces

We chose Turborepo combined with pnpm workspaces for the following reasons:

- **Efficient caching**: Turborepo caches task outputs to avoid redundant work
- **Task orchestration**: Defines dependencies between tasks across packages
- **Parallel execution**: Runs tasks in parallel where possible
- **pnpm efficiency**: pnpm uses hard links and a content-addressable store for disk space efficiency
- **Strict dependency management**: pnpm prevents phantom dependencies

### Workspace Configuration

The `pnpm-workspace.yaml` defines:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

This includes all packages in the `apps/` and `packages/` directories.

### Turborepo Pipeline

The `turbo.json` defines the following tasks:

- `dev`: Development servers (no caching, persistent)
- `build`: Build tasks with dependency awareness and output caching
- `lint`: Linting tasks with dependency awareness
- `test`: Test tasks with build dependencies
- `check-types`: Type checking tasks with dependency awareness

## CI/CD Considerations

### Reproducible Builds

CI should use `pnpm install --frozen-lockfile` to ensure reproducible builds by:
- Using the exact versions from `pnpm-lock.yaml`
- Preventing automatic lockfile updates
- Ensuring consistent dependency resolution across environments

### Lockfile Commit

The `pnpm-lock.yaml` is committed to version control to guarantee:
- Consistent dependency installation across all environments
- Reproducible builds in CI/CD pipelines
- Team-wide dependency synchronization

## Package Naming Convention

All workspace packages follow the `@repo/*` naming convention:
- `@repo/firm-website` for the marketing website
- `@repo/ui` for shared UI components
- `@repo/lib` for shared libraries
- `@repo/eslint-config` for ESLint configuration
- `@repo/typescript-config` for TypeScript configuration
- `@repo/tailwind-config` for Tailwind configuration

## Module System

All packages use `"type": "module"` in their `package.json` to enable ES modules by default.
