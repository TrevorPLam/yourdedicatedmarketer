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
# Run content utility unit tests
pnpm --filter @repo/firm-website test -- content.test

# Run navigation utility tests
pnpm --filter @repo/firm-website test -- navigation

# Run content utility integration tests
pnpm --filter @repo/firm-website test -- content.integration
```

## Integration Testing

Integration tests verify that content utilities work correctly with the real file system and actual MDX files, testing the end-to-end content pipeline without mocking.

### Test Location
- **Content integration tests**: `apps/firm-website/src/lib/content.integration.test.ts`

### Testing Approach

#### Core Principles
- **Use real file system**: Tests read actual MDX files from `src/content/` directories
- **No mocking**: `fs` and `path` modules are not mocked to verify real-world behavior
- **Focus on critical paths**: Test services, industries, and demos (most important content types)
- **Verify metadata parsing**: Ensure frontmatter is correctly parsed and typed
- **Test HTML conversion**: Verify remark converts markdown to HTML correctly

#### Test Coverage

**Content Utilities Integration Tests:**
- `getAllContent('services')` - Returns all service files with correct metadata
- `getAllContent('industries')` - Returns all industry files with correct metadata
- `getAllContent('demos')` - Returns all demo files with correct metadata
- `getContentBySlug('services', 'website-design')` - Returns correct data for specific slug
- `getContentBySlug('industries', 'medical')` - Returns correct data with icon field
- `getAllSlugs('industries')` - Returns all industry slugs
- `getAllSlugs('services')` - Returns all service slugs
- `getAllSlugs('demos')` - Returns all demo slugs
- Metadata parsing - Verifies title, slug, description, featured, order, icon fields
- MDX to HTML conversion - Verifies markdown is processed correctly
- Caching behavior - Verifies consistent data across repeated calls
- Error handling - Non-existent directories return empty arrays, missing files return null

**Example:**
```typescript
import { describe, it, expect } from 'vitest';
import { getAllContent, getAllSlugs, getContentBySlug } from './content';

describe('Content Utilities - Integration Tests with Real File System', () => {
  it('should return all service files', async () => {
    const services = await getAllContent('services');

    expect(Array.isArray(services)).toBe(true);
    expect(services.length).toBeGreaterThan(0);
    
    services.forEach((service) => {
      expect(service.data).toBeDefined();
      expect(typeof (service.data as { title: string }).title).toBe('string');
      expect(typeof (service.data as { slug: string }).slug).toBe('string');
      expect(service.content).toBeDefined();
    });
  });

  it('should return correct data for services/website-design', async () => {
    const content = await getContentBySlug('services', 'website-design');

    expect(content).not.toBeNull();
    expect((content?.data as { title: string }).title).toBe('Website Design & Development');
    expect((content?.data as { slug: string }).slug).toBe('website-design');
    expect(content?.content).toContain('<h1>'); // HTML conversion
  });
});
```

### Type Assertions

Since `getAllContent` and `getContentBySlug` use generic types, integration tests use type assertions to access specific metadata fields:

```typescript
expect(typeof (service.data as { title: string }).title).toBe('string');
expect((content?.data as { featured: boolean }).featured).toBe(true);
```

This approach allows testing without defining strict TypeScript interfaces for each content type while maintaining type safety.

### Running Integration Tests

```bash
# Run content integration tests
pnpm --filter @repo/firm-website test -- content.integration
```

## UI Component Testing

Component tests for `@repo/ui` verify rendering, props, variants, and user interactions using React Testing Library and Vitest.

### Test Location
- **UI components**: `packages/ui/src/components/ui/*.test.tsx`
- **Layout components**: `packages/ui/src/components/layout/*.test.tsx`
- **Navigation components**: `packages/ui/src/components/navigation/*.test.tsx`
- **Theme components**: `packages/ui/src/*.test.tsx`

### Testing Approach

#### Core Principles
- **Test behavior, not implementation**: Focus on what users see and interact with
- **Use accessible queries**: Prioritize `getByRole`, `getByText` over CSS selectors
- **User-centric interactions**: Use `userEvent` for realistic user behavior
- **Mock external dependencies**: Isolate components from Next.js routing, theme providers, etc.

#### Component Coverage

**UI Components:**
- `Button` - Variants, sizes, click events, `asChild` prop
- `Card` - Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- `Container` - maxWidth variants (sm, md, lg, xl, full)
- `Section` - Rendering as section/div, padding classes
- `Input` - Placeholder, onChange, error state, different types
- `Textarea` - Placeholder, minimum height, custom className
- `Label` - Text rendering, htmlFor association with inputs
- `Accordion` - Expand/collapse, single/multiple modes, accessibility
- `Form` - Integration of Input, Textarea, Label components

**Layout Components:**
- `Header` - Navigation items, logo, mobile menu toggle, theme toggle
- `Footer` - Navigation links, contact info, social links, copyright
- `MobileMenu` - Open/close state, overlay click, escape key, body scroll lock

**Navigation Components:**
- `NavLink` - Active state, custom className, aria-current attribute

**Theme Components:**
- `ThemeToggle` - Icon switching (sun/moon), theme toggle function, screen reader text

### Mocking Strategy

#### Next.js Navigation
Mock `next/navigation` for components that use routing hooks:

```typescript
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));
```

#### Next.js Link
Mock `next/link` to test navigation without actual routing:

```typescript
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
```

#### Theme Provider
Use `renderWithProviders` from `@repo/test-utils` for components requiring theme context:

```typescript
import { renderWithProviders } from '@repo/test-utils';

renderWithProviders(<Header navItems={navItems} />);
```

### Example Tests

#### Button Component
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders button with default variant', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Card Component
```typescript
describe('Card', () => {
  it('renders complete card with all subcomponents', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
```

#### Accordion Component
```typescript
describe('Accordion', () => {
  it('expands item when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByText('Item 1');
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();

    await user.click(trigger);
    const content = screen.getByText('Content 1');
    expect(content).toBeVisible();
  });
});
```

### Running UI Component Tests

```bash
# Run all UI component tests
pnpm --filter @repo/ui test

# Run specific component test
pnpm --filter @repo/ui test -- button.test

# Run in watch mode for development
pnpm --filter @repo/ui test:watch
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

## Server Action Testing

Server Actions are functions marked with `'use server'` that run on the server. Testing them requires mocking external dependencies and testing the decision logic in isolation.

### Test Location
- **Server Actions**: `apps/firm-website/src/app/actions/*.test.ts`

### Testing Approach

#### Core Principles
- **Mock external dependencies**: Use `vi.mock()` for services like Resend, databases, etc.
- **Test decision logic**: Focus on validation, error handling, and control flow
- **Use vi.hoisted()**: Define mock classes/functions before `vi.mock()` to avoid hoisting issues
- **Test all code paths**: Success, validation errors, API failures, missing configuration

#### Mocking Strategy

##### Resend Email Service
Mock the Resend SDK to prevent real email sending during tests:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { submitContact, initialContactState } from './contact';

// Use vi.hoisted() to define mock before vi.mock()
const { mockEmailsSend, MockResend } = vi.hoisted(() => {
  const mockEmailsSend = vi.fn();
  class MockResend {
    constructor() {
      // Mock constructor
    }
    emails = {
      send: mockEmailsSend,
    };
  }
  return { mockEmailsSend, MockResend };
});

vi.mock('resend', () => ({
  Resend: MockResend,
}));

describe('submitContact Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set required environment variables
    process.env.RESEND_API_KEY = 'test_api_key';
    process.env.CONTACT_EMAIL = 'test@example.com';
    process.env.FROM_EMAIL = 'noreply@example.com';
  });

  it('should return success and call Resend with valid form data', async () => {
    mockEmailsSend.mockResolvedValue({ data: { id: 'test-id' }, error: null });

    const formData = new FormData();
    formData.append('name', 'John Doe');
    formData.append('email', 'john@example.com');
    formData.append('message', 'This is a test message with sufficient length.');

    const result = await submitContact(initialContactState, formData);

    expect(result.success).toBe(true);
    expect(mockEmailsSend).toHaveBeenCalledTimes(1);
  });

  it('should return validation error for invalid email', async () => {
    const formData = new FormData();
    formData.append('name', 'John Doe');
    formData.append('email', 'not-an-email');
    formData.append('message', 'This is a test message with sufficient length.');

    const result = await submitContact(initialContactState, formData);

    expect(result.success).toBe(false);
    expect(result.errors).toHaveProperty('email');
    expect(mockEmailsSend).not.toHaveBeenCalled();
  });

  it('should return error when Resend API fails', async () => {
    mockEmailsSend.mockRejectedValue(new Error('Resend API error'));

    const formData = new FormData();
    formData.append('name', 'John Doe');
    formData.append('email', 'john@example.com');
    formData.append('message', 'This is a test message with sufficient length.');

    const result = await submitContact(initialContactState, formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Failed to send message. Please try again later.');
    expect(mockEmailsSend).toHaveBeenCalledTimes(1);
  });
});
```

### Running Server Action Tests

```bash
# Run server action tests
pnpm --filter @repo/firm-website test -- contact.test
```

### Best Practices

- **Use vi.hoisted()**: Always use `vi.hoisted()` when defining mocks that reference variables
- **Clear mocks in beforeEach**: Reset mock state between tests to avoid interference
- **Set environment variables**: Configure required env vars in beforeEach for tests that need them
- **Test validation logic**: Verify Zod schema validation returns correct error messages
- **Test error handling**: Ensure external service failures are caught and return appropriate error states
- **Don't test implementation**: Focus on public API behavior (inputs/outputs), not internal logic

## CI/CD Integration

All test suites are integrated with Turborepo:
- `pnpm test` runs all unit tests across the monorepo
- `pnpm test:e2e` runs all E2E tests across the monorepo
- `pnpm storybook` runs Storybook for visual testing
- Tests depend on build completion (configured in turbo.json)
