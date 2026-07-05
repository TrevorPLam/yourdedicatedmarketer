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

## Utility Testing

Unit tests for utility functions (content.ts, navigation.ts) use Vitest with mocked file system and content dependencies to test public API behavior without touching real files or external systems.

### Content Utilities (`content.test.ts`)

Tests cover the core content management functions:
- `getAllSlugs()` - Returns array of slugs from a directory, handles non-existent directories
- `getContentBySlug()` - Returns content data for valid slugs, returns null for missing files/errors
- `getAllContent()` - Returns array of all content items, filters nulls, handles errors

**Mocking Strategy:**
- `fs` module mocked using `vi.hoisted()` to create mock functions before `vi.mock()`
- `path` module mocked for path joining
- gray-matter and remark libraries work naturally with test data (valid MDX format required)
- Unique cache keys (different dir/slug combinations) used per test to avoid module-level cache collisions

**Example:**
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockReaddirSync, mockReadFileSync, mockExistsSync } = vi.hoisted(() => ({
  mockReaddirSync: vi.fn(),
  mockReadFileSync: vi.fn(),
  mockExistsSync: vi.fn(),
}));

vi.mock('fs', () => ({
  default: {
    readdirSync: mockReaddirSync,
    readFileSync: mockReadFileSync,
    existsSync: mockExistsSync,
  },
}));

describe('Content Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return an array of slugs from directory', async () => {
    mockReaddirSync.mockReturnValue(['test1.mdx', 'test2.mdx']);
    const slugs = await getAllSlugs('test-dir');
    expect(slugs).toEqual(['test1', 'test2']);
  });
});
```

### Navigation Utilities (`navigation.test.ts`)

Tests cover navigation, breadcrumbs, and related content functions:
- `getNavItems()` - Returns array of navigation items with label and href
- `getBreadcrumbs()` - Returns breadcrumb trail for pages, handles services/industries/demos/static pages
- `getRelatedContent()` - Returns related items based on type and current slug, limits to 3 items

**Mocking Strategy:**
- Content utilities (`getAllServices`, `getAllIndustries`, etc.) mocked with default empty array returns
- Mocks overridden in specific tests to provide test data
- Tests verify public API behavior, not internal implementation

**Example:**
```typescript
vi.mock('./content', () => ({
  getAllServices: vi.fn(() => Promise.resolve([])),
  getAllIndustries: vi.fn(() => Promise.resolve([])),
  getAllDemos: vi.fn(() => Promise.resolve([])),
  getAllFAQs: vi.fn(() => Promise.resolve([])),
}));

describe('Navigation Utilities', () => {
  it('should return correct breadcrumbs for service pages', async () => {
    vi.mocked(getAllServices).mockResolvedValue([
      { data: { title: 'Website Design', slug: 'website-design' }, content: '' },
    ]);
    const breadcrumbs = await getBreadcrumbs('website-design');
    expect(breadcrumbs[1]?.label).toBe('Services');
  });
});
```

### Running Utility Tests

```bash
# Run content utility tests
pnpm --filter @repo/firm-website test -- content.test

# Run navigation utility tests
pnpm --filter @repo/firm-website test -- navigation
```

## Best Practices

### Unit Testing
- Write tests against public APIs, not implementation details
- Use descriptive test names that explain the behavior
- Follow the Arrange-Act-Assert pattern
- Mock external dependencies to isolate the unit under test
- Use `vi.hoisted()` for mocks that need to be referenced in `vi.mock()`
- Use unique cache keys when testing functions with module-level caching

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
