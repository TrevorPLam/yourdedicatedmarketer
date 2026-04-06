---
title: Quick Start
description: Get up and running with the marketing agency monorepo
---

# Quick Start

Get your development environment set up and running with the marketing agency
monorepo.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 22.12.0 or later
- **pnpm** 10.0.0 or later
- **Git** for version control
- **VS Code** (recommended) with extensions

### Verify Requirements

```bash
# Check Node.js version
node --version  # Should be v22.12.0 or later

# Check pnpm version
pnpm --version  # Should be 10.0.0 or later

# Check Git version
git --version
```

## Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/marketing-agency-monorepo.git
cd marketing-agency-monorepo
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

```bash
# Copy the environment template (if provided)
cp .env.example .env.local

# Required variables:
# DATABASE_URL=postgresql://user:password@host:5432/db
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=your-anon-key
```

### 4. Start Development

```bash
# Start all applications in parallel
pnpm run dev
```

## What's Running

After setup, each application runs on its own port:

| Application       | URL                   | Description                 |
| ----------------- | --------------------- | --------------------------- |
| Agency Website    | http://localhost:4321 | Main marketing site (Astro) |
| Project Manager   | http://localhost:3002 | Internal tool (Next.js)     |
| Component Library | http://localhost:6006 | Storybook (run separately)  |
| Documentation     | http://localhost:4322 | This documentation site     |

> **Note**: Run Storybook separately with `pnpm --filter @agency/ui-components storybook`.

## Development Workflow

### Daily Development

```bash
# Start development servers
pnpm run dev

# Run tests in watch mode
pnpm run test:watch

# Type checking
pnpm run type-check

# Linting and formatting
pnpm run lint:fix
pnpm run format
```

### Building for Production

```bash
# Build all applications
pnpm run build
```

## Common Tasks

### Adding Dependencies

```bash
# Add to a specific package
pnpm --filter @agency/ui-components add lodash

# Add to workspace root (dev dependency)
pnpm add -D -w prettier

# Add with exact version
pnpm add react@19.2.0
```

### Code Generation

```bash
# Generate API types from database schema
pnpm run db:generate
```

## Database Commands

```bash
# Run database migrations
pnpm run db:migrate

# Seed initial data
pnpm run db:seed

# Open database studio
pnpm run db:studio
```

> **Note**: Database commands require `DATABASE_URL` to be set in `.env.local`.

## Troubleshooting

### Common Issues

**"Node version too old"**

```bash
# Update Node.js using nvm
nvm install 22.12.0
nvm use 22.12.0
```

**"pnpm not found"**

```bash
# Install pnpm globally
npm install -g pnpm@10.0.0

# Or use corepack (Node 16+)
corepack enable
corepack prepare pnpm@10.0.0 --activate
```

**"Database connection failed"**

```bash
# Verify environment variables are set
cat .env.local

# Verify database URL format
# postgresql://user:password@host:port/database
```

**"Port already in use"**

```bash
# Check what is running on a port (Windows)
netstat -ano | findstr :4321

# Kill the process (Windows)
taskkill /PID <pid> /F
```

### Get Help

- **Documentation**: [Browse guides](/guides/)
- **GitHub Issues**: [Report bugs](https://github.com/your-org/marketing-agency-monorepo/issues)

## Next Steps

1. **[Development Setup](/guides/dev-setup/)** — Full IDE and tooling setup
2. **[Developer Guide](/onboarding/developer-guide/)** — Workflows and conventions
