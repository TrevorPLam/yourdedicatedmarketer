---
title: Development Setup
description: Complete guide to setting up your development environment
---

# Development Setup

This guide covers everything you need to set up a productive development
environment for the marketing agency monorepo.

## System Requirements

### Minimum Requirements

- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Node.js**: 22.12.0 or later
- **Memory**: 8GB RAM (16GB+ recommended)
- **Storage**: 10GB free space
- **Network**: Stable internet connection for dependencies

### Recommended Hardware

| Component | Minimum   | Recommended |
| --------- | --------- | ----------- |
| CPU       | 4 cores   | 8+ cores    |
| RAM       | 8GB       | 16GB+       |
| SSD       | 256GB     | 512GB+      |
| Display   | 1920x1080 | 2560x1440+  |

## Software Installation

### 1. Node.js

We recommend using **nvm** (Node Version Manager) for Node.js installation:

```bash
# Install nvm (macOS/Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install nvm (Windows)
# Download from https://github.com/coreybutler/nvm-windows

# Install and use Node.js 22.12.0
nvm install 22.12.0
nvm use 22.12.0
nvm alias default 22.12.0

# Verify installation
node --version
npm --version
```

### 2. pnpm Package Manager

```bash
# Install pnpm globally
npm install -g pnpm@10.0.0

# Or use corepack (Node 16+)
corepack enable
corepack prepare pnpm@10.0.0 --activate

# Verify installation
pnpm --version
```

### 3. Git

```bash
# Install Git (if not already installed)
# Windows: https://git-scm.com/download/win
# macOS: brew install git
# Linux: sudo apt install git

# Configure Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Enable credential helper
git config --global credential.helper store
```

## IDE Setup

### Visual Studio Code (Recommended)

Install VS Code and these essential extensions:

```bash
# Install VS Code
# Download from https://code.visualstudio.com/

# Install extensions (run in VS Code terminal)
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-json
code --install-extension ms-playwright.playwright
code --install-extension ms-vscode.test-adapter-converter
code --install-extension Vitest.explorer
```

#### VS Code Configuration

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "emmet.includeLanguages": {
    "astro": "html"
  },
  "files.associations": {
    "*.astro": "astro"
  },
  "tailwindCSS.includeLanguages": {
    "astro": "html"
  }
}
```

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "ms-playwright.playwright",
    "ms-vscode.test-adapter-converter",
    "Vitest.explorer"
  ]
}
```

### Alternative IDEs

- **WebStorm**: Built-in TypeScript and monorepo support
- **Neovim**: With LSP configuration
- **Vim**: With CoC configuration

## Environment Setup

### 1. Clone Repository

```bash
# Clone the repository
git clone https://github.com/your-org/marketing-agency-monorepo.git
cd marketing-agency-monorepo
```

### 2. Environment Variables

```bash
# Copy environment template
cp .env.example .env.local

# Edit the file with your configuration
# Required variables:
# - DATABASE_URL
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - NEXT_PUBLIC_SITE_URL
```

### 3. Install Dependencies

```bash
# Install all workspace dependencies
pnpm install
```

### 4. Database Setup

```bash
# Run database migrations
pnpm run db:migrate

# Seed initial data
pnpm run db:seed

# Verify database connection
pnpm run db:studio
```

## Development Workflow

### Daily Development

```bash
# Start all development servers
pnpm run dev

# Individual app development
pnpm --filter @agency/agency-website dev
pnpm --filter @agency/project-manager dev
pnpm --filter @agency/ui-components storybook
```

### Code Quality

```bash
# Lint and fix code
pnpm run lint:fix

# Format code
pnpm run format

# Type checking
pnpm run type-check

# Run tests
pnpm run test
pnpm run test:watch
```

### Building

```bash
# Build all packages
pnpm run build

# Build specific package
pnpm --filter @agency/agency-website build

# Test production build
pnpm run preview
```

## Database Management

### Local Development

```bash
# Start database (if using Docker)
docker-compose up -d postgres

# Create new migration
pnpm run db:migration:create add_feature_table

# Run migrations
pnpm run db:migrate

# Reset database
pnpm run db:reset

# Open database studio
pnpm run db:studio
```

### Database Providers

Choose your preferred database provider:

#### Supabase (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Link to project
supabase link --project-ref your-project-ref
```

#### Neon

```bash
# Set environment variables
NEON_URL=your_neon_database_url
NEON_API_KEY=your_neon_api_key
```

#### PostgreSQL

```bash
# Install PostgreSQL
# macOS: brew install postgresql
# Ubuntu: sudo apt install postgresql postgresql-contrib
# Windows: Download from postgresql.org

# Start PostgreSQL service
brew services start postgresql  # macOS
sudo systemctl start postgresql  # Linux
```

## Testing Setup

### Unit Testing

```bash
# Run all tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:coverage

# Run tests for specific package
pnpm --filter @agency/ui-components test
```

### E2E Testing

```bash
# Install Playwright browsers
pnpm exec playwright install

# Run E2E tests
pnpm run test:e2e

# Run E2E tests in watch mode
pnpm run test:e2e:watch

# Debug E2E tests
pnpm run test:e2e:debug
```

## Performance Optimization

### Build Performance

```bash
# Enable Turbo caching
export TURBO_TOKEN=your_turbo_token

# Use parallel builds
pnpm run build --parallel

# Use incremental builds
pnpm run build --filter=...  # Only build changed packages
```

### Development Performance

```bash
# Use file watcher exclusions
echo "node_modules" > .git/info/exclude
echo ".turbo" >> .git/info/exclude
echo "dist" >> .git/info/exclude

# Use SSD for better performance
# Ensure sufficient RAM (16GB+ recommended)
```

## Troubleshooting

### Common Issues

#### "Node version too old"

```bash
# Update Node.js using nvm
nvm install 22.12.0
nvm use 22.12.0
```

#### "pnpm command not found"

```bash
# Reinstall pnpm
npm install -g pnpm@10.0.0

# Or use corepack
corepack enable
corepack prepare pnpm@10.0.0 --activate
```

#### "Port already in use"

```bash
# Find and kill process on port
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Or use different port
PORT=3001 pnpm run dev
```

#### "Database connection failed"

```bash
# Check environment variables
cat .env.local

# Test database connection
pnpm run db:health

# Reset database
pnpm run db:reset
```

#### "Out of memory errors"

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Use yarn for better memory management
# (alternative to pnpm for large builds)
```

### Performance Issues

#### Slow builds

```bash
# Clear cache
pnpm run clean

# Use incremental builds
pnpm run build --filter=changed

# Enable parallel processing
export TURBO_FORCE_COLOR=1
```

#### Slow tests

```bash
# Run tests in parallel
pnpm run test --parallel

# Use test coverage filtering
pnpm run test --coverage --changed
```

## Advanced Configuration

### Custom Scripts

Create custom scripts in `package.json`:

```json
{
  "scripts": {
    "dev:fast": "turbo run dev --parallel --force",
    "build:ci": "turbo run build --filter=!@agency/docs",
    "test:ci": "turbo run test --coverage --reporter=junit",
    "lint:all": "turbo run lint --all"
  }
}
```

### Git Hooks

Customize Git hooks in `.husky/`:

```bash
# Add custom pre-commit hook
echo "pnpm run type-check && pnpm run test:affected" > .husky/pre-commit
chmod +x .husky/pre-commit
```

### Docker Development

Use Docker for consistent development:

```dockerfile
# Dockerfile.dev
FROM node:22.12.0-alpine
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm@10.0.0
RUN pnpm install
COPY . .
CMD ["pnpm", "run", "dev"]
```

## Next Steps

With your development environment set up:

1. **[Project Structure](/guides/structure/)** - Understand the monorepo layout
2. **[Architecture Overview](/architecture/monorepo/)** - Learn design
   principles
3. **[Client Sites](/apps/client-sites/)** - Create client projects
4. **[UI Components](/packages/ui-components/)** - Build reusable components

:::tip[Pro Tip] Bookmark the [documentation site](http://localhost:4321) and
keep it open during development for quick reference. :::

---

**Need help?** Join our [Discord community](https://discord.gg/your-agency) or
check the [troubleshooting guide](/guides/troubleshooting/).
