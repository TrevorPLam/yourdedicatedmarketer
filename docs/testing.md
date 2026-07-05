# Testing Strategy

This document outlines the testing infrastructure and strategy for the firm website project.

## Shared Test Utilities

The `@repo/test-utils` package provides common testing utilities and mocks shared across all workspaces to reduce boilerplate and ensure consistency.

### Location
- **Package**: `packages/test-utils/`
- **Entry point**: `packages/test-utils/src/index.ts`

### Exports

#### `renderWithProviders`
A wrapper around `@testing-library/react`'s `render` that includes the `ThemeProvider` from `@repo/ui` for components that require theme context.

```typescript
import { renderWithProviders } from '@repo/test-utils';

renderWithProviders(<MyComponent />);
```

#### Mock Functions

- `mockNextNavigation()` - Mocks Next.js App Router navigation hooks (`useRouter`, `usePathname`, `useSearchParams`, `useParams`, `redirect`, `notFound`)
- `mockResend()` - Mocks the Resend email SDK to prevent real email sending during tests
- `mockUseActionState()` - Mocks React's `useActionState` hook for Server Action testing

### Usage

Import and call mock functions at the top of your test files:

```typescript
import { mockNextNavigation, renderWithProviders } from '@repo/test-utils';

mockNextNavigation();

describe('MyComponent', () => {
  it('renders correctly', () => {
    renderWithProviders(<MyComponent />);
    // ...
  });
});
```

## Unit Testing with Vitest

Vitest is used for unit testing utility functions and components. It provides a fast, modern testing experience with native ESM support.

### App-Level Testing

#### Configuration
- **Config file**: `apps/firm-website/vitest.config.ts`
- **Environment**: jsdom for DOM testing
- **Setup file**: `apps/firm-website/src/test/setup.ts` (imports @testing-library/jest-dom)
- **Test location**: `apps/firm-website/src/test/`

#### Commands
```bash
# Run unit tests once
pnpm --filter @repo/firm-website test

# Run unit tests in watch mode (for development)
pnpm --filter @repo/firm-website test:watch

# Run all unit tests from root
pnpm test
```

### UI Package Testing

#### Configuration
- **Config file**: `packages/ui/vitest.config.ts`
- **Environment**: jsdom for DOM testing
- **Setup file**: `packages/ui/src/test/setup.ts` (imports @testing-library/jest-dom)
- **Test location**: `packages/ui/src/components/ui/*.test.tsx`
- **Additional**: Storybook integration with @storybook/addon-vitest for visual testing

#### Commands
```bash
# Run UI package unit tests once
pnpm --filter @repo/ui test

# Run UI package unit tests in watch mode (for development)
pnpm --filter @repo/ui test:watch

# Run Storybook tests with Vitest
pnpm --filter @repo/ui test --project=storybook
```

#### Testing Libraries
- `vitest` - Test runner
- `@vitejs/plugin-react` - React support for Vite/Vitest
- `@testing-library/react` - Component testing utilities
- `@testing-library/jest-dom` - Custom Jest matchers
- `@testing-library/user-event` - User interaction simulation
- `@storybook/addon-vitest` - Storybook integration for visual testing
- `@vitest/browser-playwright` - Browser-based testing for Storybook stories

## End-to-End Testing with Playwright

Playwright is used for E2E testing to verify the application works end-to-end in a real browser.

### Configuration
- **Config file**: `apps/firm-website/playwright.config.ts`
- **Test location**: `apps/firm-website/src/e2e/`
- **Browser**: Chromium (can be extended to Firefox and WebKit)
- **Base URL**: http://localhost:3000

### Commands
```bash
# Run E2E tests
pnpm --filter @repo/firm-website test:e2e

# Run E2E tests from root
pnpm test:e2e

# Install Playwright browsers (if needed)
pnpm --filter @repo/firm-website exec playwright install
```

### Test Structure
E2E tests use Playwright's test API with page objects and locators for reliable element selection.

## Best Practices

### Unit Testing
- Write tests against public APIs, not implementation details
- Use descriptive test names that explain the behavior
- Follow the Arrange-Act-Assert pattern
- Mock external dependencies to isolate the unit under test

### E2E Testing
- Test user flows and critical paths
- Use semantic locators (getByRole, getByText) over CSS selectors
- Keep tests independent and avoid coupling between tests
- Use webServer configuration to start the dev server automatically

## Visual Testing with Storybook and Chromatic

Storybook is used for component development and visual testing. Chromatic provides automated visual regression testing for Storybook stories.

### Configuration
- **Config location**: `packages/ui/.storybook/`
- **Framework**: @storybook/nextjs-vite (Storybook 10.4.6)
- **Stories location**: `packages/ui/src/components/**/*.stories.tsx`
- **Addons**: Chromatic, Vitest, A11y, Docs, MCP

### Commands
```bash
# Start Storybook development server
pnpm --filter @repo/ui storybook

# Build Storybook for production
pnpm --filter @repo/ui build-storybook

# Run Storybook tests with Vitest
npx vitest --project=storybook
```

### Component Stories
Stories are written for core UI components:
- **Button**: All variants (default, destructive, outline, secondary, ghost, link) and sizes
- **Card**: Various layouts (with/without header/footer, long content)
- **Header**: Navigation items, custom logo, minimal configurations
- **Footer**: Navigation links, contact info, social links

### Chromatic Integration
Chromatic runs on every pull request to detect visual regressions:
- **Workflow**: `.github/workflows/chromatic.yml`
- **Trigger**: Pull requests to main branch
- **Secret**: `CHROMATIC_PROJECT_TOKEN` (must be configured in GitHub secrets)

### Setup Instructions
1. Create a Chromatic account at https://www.chromatic.com
2. Create a new project and get the project token
3. Add the token as a GitHub secret named `CHROMATIC_PROJECT_TOKEN`
4. The workflow will automatically build and publish Storybook on PRs

### Best Practices
- Keep stories simple and focused on component variants
- Avoid including business logic in stories
- Use autodocs tag for automatic documentation generation
- Test key components first before expanding coverage

## CI/CD Integration

All test suites are integrated with Turborepo:
- `pnpm test` runs all unit tests across the monorepo
- `pnpm test:e2e` runs all E2E tests across the monorepo
- `pnpm storybook` runs Storybook for visual testing
- Tests depend on build completion (configured in turbo.json)
