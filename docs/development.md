# Development Guide

This guide provides developers with the information needed to work effectively with the Your Dedicated Marketer monorepo.

## Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v9.15.0
- **Git**: For version control
- **VS Code**: Recommended IDE (with extensions listed below)

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/yourdedicatedmarketer.git
cd yourdedicatedmarketer
```

### 2. Install Dependencies

```bash
pnpm install
```

This installs all dependencies for the monorepo using the lockfile for reproducible builds.

### 3. Configure Environment Variables

```bash
cp apps/firm-website/.env.example apps/firm-website/.env.local
```

Edit `apps/firm-website/.env.local` with your configuration. See [Environment Variables](environment.md) for details.

### 4. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Development Workflow

### Running Commands

#### From the Root

Most commands can be run from the repository root using Turborepo:

```bash
# Development
pnpm dev

# Build
pnpm build

# Lint
pnpm lint

# Test
pnpm test

# Type check
pnpm check-types
```

#### For Specific Packages

Use the `--filter` flag to run commands for specific packages:

```bash
# Run dev for firm-website only
pnpm --filter @repo/firm-website dev

# Run tests for lib package
pnpm --filter @repo/lib test

# Build ui package
pnpm --filter @repo/ui build
```

### Adding a New Application

To add a new application to the monorepo:

1. **Create the app directory**:
   ```bash
   mkdir apps/new-app
   cd apps/new-app
   ```

2. **Initialize the package**:
   ```bash
   pnpm init
   ```

3. **Configure package.json**:
   ```json
   {
     "name": "@repo/new-app",
     "version": "0.0.0",
     "private": true,
     "type": "module",
     "scripts": {
       "dev": "next dev",
       "build": "next build",
       "lint": "next lint",
       "test": "vitest",
       "check-types": "tsc --noEmit"
     }
   }
   ```

4. **Add dependencies**:
   ```bash
   pnpm add next react react-dom
   pnpm add -D typescript @types/react @types/node
   ```

5. **Add to turbo.json**:
   Add the new app to the pipeline configuration in `turbo.json`.

6. **Update workspace**:
   The app will be automatically detected by pnpm workspaces.

### Adding a New Package

To add a new shared package:

1. **Create the package directory**:
   ```bash
   mkdir packages/new-package
   cd packages/new-package
   ```

2. **Initialize the package**:
   ```bash
   pnpm init
   ```

3. **Configure package.json**:
   ```json
   {
     "name": "@repo/new-package",
     "version": "0.0.0",
     "private": true,
     "type": "module",
     "main": "./src/index.ts",
     "types": "./src/index.ts",
     "exports": {
       ".": "./src/index.ts"
     },
     "scripts": {
       "build": "tsc",
       "lint": "eslint .",
       "test": "vitest",
       "check-types": "tsc --noEmit"
     }
   }
   ```

4. **Create source files**:
   ```bash
   mkdir src
   touch src/index.ts
   ```

5. **Add dependencies**:
   ```bash
   pnpm add -D typescript
   ```

6. **Add to turbo.json**:
   Add the new package to the pipeline configuration.

### Adding a New Component to @repo/ui

To add a new component to the UI package:

1. **Navigate to the UI package**:
   ```bash
   cd packages/ui
   ```

2. **Create the component file**:
   ```bash
   touch src/components/ui/your-component.tsx
   ```

3. **Implement the component**:
   ```tsx
   import * as React from "react"
   import { cn } from "@/lib/utils"

   interface YourComponentProps extends React.HTMLAttributes<HTMLDivElement> {
   // Add your custom props here
   }

   const YourComponent = React.forwardRef<HTMLDivElement, YourComponentProps>(
     ({ className, ...props }, ref) => {
       return (
         <div
           ref={ref}
           className={cn("your-base-classes", className)}
           {...props}
         >
           {/* Component content */}
         </div>
       )
     }
   )
   YourComponent.displayName = "YourComponent"

   export { YourComponent }
   ```

4. **Export from the UI package**:
   Add the export to `src/index.ts`:
   ```typescript
   export { YourComponent } from './components/ui/your-component'
   ```

5. **Write a Storybook story**:
   Create `src/components/ui/your-component.stories.tsx`:
   ```tsx
   import type { Meta, StoryObj } from '@storybook/react'
   import { YourComponent } from './your-component'

   const meta: Meta<typeof YourComponent> = {
     title: 'UI/YourComponent',
     component: YourComponent,
     tags: ['autodocs'],
   }

   export default meta
   type Story = StoryObj<typeof YourComponent>

   export const Default: Story = {
     args: {
       // Default props
     },
   }
   ```

6. **Write unit tests**:
   Create `src/components/ui/your-component.test.tsx`:
   ```tsx
   import { describe, it, expect } from 'vitest'
   import { render, screen } from '@testing-library/react'
   import { YourComponent } from './your-component'

   describe('YourComponent', () => {
     it('renders correctly', () => {
       render(<YourComponent>Test</YourComponent>)
       expect(screen.getByText('Test')).toBeInTheDocument()
     })
   })
   ```

7. **Update documentation**:
   Add component documentation to `docs/components.md` with usage examples, props, and best practices.

8. **Run tests and Storybook**:
   ```bash
   # Run unit tests
   pnpm --filter @repo/ui test

   # Start Storybook to view your component
   pnpm --filter @repo/ui storybook
   ```

#### Component Guidelines

- **Use Server Components by default** - Only use `"use client"` when you need interactivity
- **Use forwardRef** - Components should forward refs for composition
- **Use cn utility** - Use the `cn` utility for conditional class merging
- **Follow shadcn/ui patterns** - Use class-variance-authority for variants when needed
- **Add TypeScript types** - Properly type all props with interfaces
- **Write tests** - All components should have unit tests
- **Create stories** - All components should have Storybook stories
- **Document usage** - Update docs/components.md with usage examples

### Adding Dependencies

#### Adding to a Specific Package

```bash
# Add to firm-website
pnpm --filter @repo/firm-website add package-name

# Add dev dependency to lib
pnpm --filter @repo/lib add -D typescript
```

#### Adding to Multiple Packages

```bash
# Add to all packages
pnpm add -w package-name

# Add to specific packages
pnpm add --filter @repo/firm-website --filter @repo/ui package-name
```

#### Using Workspace Packages

To use a workspace package in another package:

```bash
# Add ui package as dependency to firm-website
pnpm --filter @repo/firm-website add @repo/ui
```

## Working with Content

### Adding New Content

Content is stored in `apps/firm-website/src/content/`. To add new content:

1. **Create a new markdown file** in the appropriate directory:
   - `services/` - Service offerings
   - `industries/` - Industry-specific content
   - `demos/` - Portfolio items
   - `faq/` - Frequently asked questions
   - `pages/` - Static page content

2. **Add frontmatter** with required fields:
   ```markdown
   ---
   title: "Your Title"
   slug: "your-slug"
   description: "Short description"
   ---
   
   Your content here...
   ```

3. **The content is automatically available** through the content API.

See [Content Pipeline](content.md) for detailed information.

### Accessing Content in Components

```typescript
import { getAllServices, getService } from '@/lib/content';

// Get all services
const services = await getAllServices();

// Get a specific service
const service = await getService('website-design');
```

## Testing

### Writing Unit Tests

Unit tests are located in `apps/firm-website/src/test/`:

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '@/lib/utils';

describe('myFunction', () => {
  it('should return the expected result', () => {
    expect(myFunction('input')).toBe('output');
  });
});
```

### Writing E2E Tests

E2E tests are located in `apps/firm-website/src/e2e/`:

```typescript
import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Your Dedicated Marketer/);
});
```

### Running Tests

```bash
# Run all unit tests
pnpm test

# Run unit tests in watch mode
pnpm --filter @repo/firm-website test:watch

# Run E2E tests
pnpm test:e2e

# Run tests with coverage
pnpm test:coverage
```

## Linting and Formatting

### Linting

```bash
# Lint all packages
pnpm lint

# Lint specific package
pnpm --filter @repo/firm-website lint

# Auto-fix linting issues
pnpm --filter @repo/firm-website lint --fix
```

### Formatting

The project uses Prettier for code formatting:

```bash
# Format all files
pnpm format

# Format specific package
pnpm --filter @repo/firm-website format
```

## Type Checking

```bash
# Type check all packages
pnpm check-types

# Type check specific package
pnpm --filter @repo/firm-website check-types
```

## Git Workflow

### Branch Strategy

- `main`: Production branch
- `develop`: Development branch (optional)
- Feature branches: `feature/feature-name`
- Bugfix branches: `bugfix/bug-description`

### Commit Convention

Follow conventional commit format:

```
type(scope): subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build process or tooling changes

Example:
```
feat(ui): add button component

Add a new button component with multiple variants and sizes.

Closes #123
```

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and linting: `pnpm lint && pnpm test && pnpm check-types`
4. Commit with conventional commit format
5. Push to GitHub
6. Create a pull request
7. Wait for CI to pass
8. Request review
9. Merge after approval

## Troubleshooting

### Common Issues

#### Dependency Issues

If you encounter dependency issues:

```bash
# Clear node_modules and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm pnpm-lock.yaml
pnpm install
```

#### Turborepo Cache Issues

If Turborepo cache causes issues:

```bash
# Clear Turborepo cache
rm -rf .turbo
```

#### Port Already in Use

If port 3000 is already in use:

```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### TypeScript Errors

If TypeScript errors persist:

```bash
# Clear TypeScript cache
rm -rf apps/*/node_modules/.cache packages/*/node_modules/.cache
```

## Recommended VS Code Extensions

- **ESLint**: `dbaeumer.vscode-eslint`
- **Prettier**: `esbenp.prettier-vscode`
- **TypeScript**: `ms-vscode.vscode-typescript-next`
- **Tailwind CSS IntelliSense**: `bradlc.vscode-tailwindcss`
- **Vitest**: `vitest.explorer`
- **Playwright**: `ms-playwright.playwright`

## Additional Resources

- [Repository Setup](repo-setup.md) - Monorepo structure and tooling
- [Architecture](architecture.md) - System architecture and design decisions
- [Environment Variables](environment.md) - Environment configuration
- [Testing Strategy](testing.md) - Testing infrastructure
- [Deployment Guide](deployment.md) - Deployment process
- [Content Pipeline](content.md) - Content structure and API
