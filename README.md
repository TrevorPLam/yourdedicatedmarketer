# Your Dedicated Marketer - Monorepo

A modern monorepo for the Your Dedicated Marketer marketing website, built with Turborepo and pnpm workspaces.

## Structure

- `apps/firm-website` - Next.js 15 marketing website
- `packages/ui` - Shared UI components
- `packages/lib` - Shared utility libraries
- `packages/eslint-config` - Shared ESLint configuration
- `packages/typescript-config` - Shared TypeScript configuration
- `packages/tailwind-config` - Shared Tailwind CSS configuration

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v9.15.0)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Lint

```bash
pnpm lint
```

### Test

```bash
pnpm test
```

### Type Check

```bash
pnpm check-types
```

## Technology Stack

- **Package Manager**: pnpm with workspaces
- **Task Orchestration**: Turborepo
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
