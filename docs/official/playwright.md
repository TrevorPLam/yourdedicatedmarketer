# Playwright Documentation

**Repository Version:** ^1.59.0  
**Official Documentation:** https://playwright.dev/docs/intro  
**Latest Release:** April 2026  
**GitHub Releases:** https://github.com/microsoft/playwright/releases  

## Overview

Playwright enables reliable end-to-end testing for modern web apps. It provides a single API to drive Chromium, Firefox, and WebKit. Playwright supports TypeScript, Python, .NET, and Java, offering reliable web automation for testing, scripting, and AI agents.

### Key Features

- **Cross-Browser**: Test Chromium, Firefox, and WebKit with a single API
- **Cross-Platform**: Run on Windows, Linux, and macOS, locally or in CI
- **Cross-Language**: Use TypeScript, JavaScript, Python, .NET, or Java
- **Test Isolation**: Each test gets a fresh browser context with near-zero overhead
- **Auto-Waiting**: Waits for elements to be actionable before performing actions
- **Web-First Assertions**: Assertions automatically retry until conditions are met
- **Parallel Execution**: Run tests in parallel by default across all configured browsers
- **Rich Tooling**: Test generator, trace viewer, VS Code extension, and more

## Installation

### Introduction

Playwright Test is an end-to-end test framework for modern web apps. It bundles test runner, assertions, isolation, parallelization and rich tooling. Playwright supports Chromium, WebKit and Firefox on Windows, Linux and macOS, locally or in CI, headless or headed, with native mobile emulation for Chrome (Android) and Mobile Safari.

### Installing Playwright

#### Using npm, yarn or pnpm

The command below either initializes a new project or adds Playwright to an existing one.

```bash
# Using npm
npm init playwright@latest

# Using yarn
yarn create playwright

# Using pnpm
pnpm create playwright
```

When prompted, choose/confirm:
- TypeScript or JavaScript (default: TypeScript)
- Tests folder name (default: tests, or e2e if tests already exists)
- Add a GitHub Actions workflow (recommended for CI)
- Install Playwright browsers (default: yes)

#### Using the VS Code Extension

You can also create and run tests with the VS Code Extension.

### What's Installed

Playwright downloads required browser binaries and creates the scaffold below:

```
playwright.config.ts # Test configuration
package.json
package-lock.json # Or yarn.lock / pnpm-lock.yaml
tests/
  example.spec.ts # Minimal example test
```

The playwright.config centralizes configuration: target browsers, timeouts, retries, projects, reporters and more. In existing projects dependencies are added to your current package.json.

tests/ contains a minimal starter test.

### Running the Example Test

By default tests run headless in parallel across Chromium, Firefox and WebKit (configurable in playwright.config). Output and aggregated results display in the terminal.

```bash
# Using npm
npx playwright test

# Using yarn
yarn playwright test

# Using pnpm
pnpm exec playwright test
```

**Tips:**
- See the browser window: add `--headed`
- Run a single project/browser: `--project=chromium`
- Run one file: `npx playwright test tests/example.spec.ts`
- Open testing UI: `--ui`

### HTML Test Reports

After a test run, the HTML Reporter provides a dashboard filterable by the browser, passed, failed, skipped, flaky and more. Click a test to inspect errors, attachments and steps. It auto-opens only when failures occur; open manually with the command below:

```bash
# Using npm
npx playwright show-report

# Using yarn
yarn playwright show-report

# Using pnpm
pnpm exec playwright show-report
```

### Running the Example Test in UI Mode

Run tests with UI Mode for watch mode, live step view, time travel debugging and more:

```bash
# Using npm
npx playwright test --ui

# Using yarn
yarn playwright test --ui

# Using pnpm
pnpm exec playwright test --ui
```

### Updating Playwright

Update Playwright and download new browser binaries and their dependencies:

```bash
# Using npm
npm install -D @playwright/test@latest
npx playwright install --with-deps

# Using yarn
yarn add --dev @playwright/test@latest
yarn playwright install --with-deps

# Using pnpm
pnpm install --save-dev @playwright/test@latest
pnpm exec playwright install --with-deps
```

Check your installed version:

```bash
# Using npm
npx playwright --version

# Using yarn
yarn playwright --version

# Using pnpm
pnpm exec playwright --version
```

### System Requirements

- **Node.js**: latest 20.x, 22.x or 24.x
- **Windows 11+**, Windows Server 2019+ or Windows Subsystem for Linux (WSL)
- **macOS 14 (Ventura)** or later
- **Debian 12 / 13**, **Ubuntu 22.04 / 24.04** (x86-64 or arm64)
## Writing Tests

### Introduction

Playwright tests are simple: they perform actions and assert the state against expectations.
Playwright automatically waits for actionability checks to pass before performing each action. You don't need to add manual waits or deal with race conditions. Playwright assertions are designed to describe expectations that will eventually be met, eliminating flaky timeouts and racy checks.

### First Test

Take a look at the following example to see how to write a test.

```typescript
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  
  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();
  
  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
```

Add `// @ts-check` at the start of each test file when using JavaScript in VS Code to get automatic type checking.

```javascript
// @ts-check
```

### Actions

#### Navigation

```typescript
await page.goto('https://playwright.dev/');
```

#### Interactions

Playwright provides a rich set of actions that mirror how users interact with web pages.

```typescript
// Click a link
await page.getByRole('link', { name: 'Get started' }).click();

// Fill an input
await page.getByLabel('Email').fill('user@example.com');

// Select from dropdown
await page.getByLabel('Country').selectOption('US');

// Check a checkbox
await page.getByLabel('Subscribe').check();

// Upload file
await page.getByLabel('Upload').setInputFiles('path/to/file.txt');
```

#### Basic Actions

Playwright includes many actions for interacting with elements:

- `click()` - Click an element
- `dblclick()` - Double click an element
- `rightClick()` - Right click an element
- `fill()` - Fill an input field
- `type()` - Type text character by character
- `press()` - Press a key or key combination
- `check()` - Check a checkbox
- `uncheck()` - Uncheck a checkbox
- `selectOption()` - Select from dropdown
- `focus()` - Focus an element
- `hover()` - Hover over an element

### Assertions

Playwright comes with a set of auto-retrying assertions that wait until the condition is met.

```typescript
// Text assertions
await expect(page.locator('.title')).toHaveText('Welcome');
await expect(page.locator('.title')).toContainText('Welcome');

// Visibility assertions
await expect(page.locator('.button')).toBeVisible();
await expect(page.locator('.hidden')).toBeHidden();

// State assertions
await expect(page.locator('.checkbox')).toBeChecked();
await expect(page.locator('.button')).toBeEnabled();
await expect(page.locator('.input')).toBeDisabled();

// Attribute assertions
await expect(page.locator('.link')).toHaveAttribute('href', '/home');
await expect(page.locator('.input')).toHaveClass('active');

// Page assertions
await expect(page).toHaveTitle('Page Title');
await expect(page).toHaveURL('/dashboard');
```

### Test Isolation

Each test in Playwright gets a fresh browser context. This means:
- Fresh cookies
- Fresh localStorage
- Fresh sessionStorage
- Fresh browser permissions

Tests are completely isolated from each other.

```typescript
import { test, expect } from '@playwright/test';

test('test 1', async ({ page }) => {
  await page.goto('/');
  // This test gets a fresh context
});

test('test 2', async ({ page }) => {
  await page.goto('/');
  // This test gets another fresh context
});
```

### Using Test Hooks

Use test hooks to set up and tear down tests.

```typescript
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Runs before each test
  await page.goto('/login');
});

test.afterEach(async ({ page }) => {
  // Runs after each test
  await page.close();
});

test.beforeAll(async () => {
  // Runs once before all tests
});

test.afterAll(async () => {
  // Runs once after all tests
});

test('login test', async ({ page }) => {
  await page.getByLabel('Username').fill('user');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('/dashboard');
});
```

## Configuration

### Introduction

Playwright has many options to configure how your tests are run. You can specify these options in the configuration file. Note that test runner options are top-level, do not put them into the use section.

### Basic Configuration

Here are some of the most common configuration options.

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: 'tests',
  
  // Run all tests in parallel.
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only.
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: 'html',
  
  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: 'http://localhost:3000',
    
    // Collect trace when retrying the failed test.
    trace: 'on-first-retry',
  },
  
  // Configure projects for major browsers.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  
  // Run your local dev server before starting the tests.
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Filtering Tests

Filter tests by glob patterns or regular expressions.

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Glob patterns or regular expressions to ignore test files.
  testIgnore: '*test-assets',
  
  // Glob patterns or regular expressions that match test files.
  testMatch: '*todo-tests/*.spec.ts',
});
```

### Advanced Configuration

#### Test Organization

- `testDir`: Directory containing test files
- `testMatch`: Pattern to match test files  
- `testIgnore`: Pattern to ignore files

#### Execution Control

- `fullyParallel`: Run all tests in parallel
- `forbidOnly`: Fail if test.only is present (useful in CI)
- `retries`: Number of retry attempts on failure
- `workers`: Number of parallel workers

#### Timeouts

- `timeout`: Global test timeout in milliseconds
- `expect.timeout`: Expectation timeout in milliseconds

#### Reporting

- `reporter`: Configure test reporters (HTML, JSON, JUnit, etc.)
- `outputDir`: Directory for test artifacts

#### Projects

- Configure multiple browser projects
- Device presets for mobile emulation
- Custom configurations for different environments

#### Web Server

- `webServer`: Automatically start a dev server before tests
- `reuseExistingServer`: Reuse running server in development
- `timeout`: Server startup timeout

## Locators

### Introduction

Playwright locators are the central piece of Playwright's auto-waiting and retry-ability. Locators represent a way to find element(s) on the page at any moment and are used to perform actions on elements.

### Best Practices

Playwright recommends using user-facing attributes that would stay the same for all users regardless of implementation details.

#### Recommended Selector Priority:

1. **Role Locators** - Most accessible and user-friendly
2. **Label Locators** - Form inputs and controls  
3. **Placeholder Locators** - Input placeholders
4. **Text Locators** - Text content
5. **Alt Text Locators** - Image alt text
6. **Title Locators** - Tooltip titles
7. **Test ID Locators** - Test-only attributes

### Role Locators

```typescript
// Find by role
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByRole('heading', { name: 'Sign up' }).isVisible();

// Find by role with exact match
await page.getByRole('button', { name: 'Submit', exact: true }).click();

// Find by role with additional filters
await page.getByRole('button', { name: 'Submit' }).filter({ hasText: 'Save' }).click();
```

### Label Locators

```typescript
// Find by label
await page.getByLabel('Email').fill('user@example.com');
await page.getByLabel('Password').fill('password');

// Find by label with exact match
await page.getByLabel('Email', { exact: true }).fill('user@example.com');
```

### Placeholder Locators

```typescript
// Find by placeholder
await page.getByPlaceholder('Enter your email').fill('user@example.com');
```

### Text Locators

```typescript
// Find by text
await page.getByText('Welcome').isVisible();
await page.getByText('Submit', { exact: true }).click();
```

### Alt Text Locators

```typescript
// Find by alt text
await page.getByAltText('Profile picture').click();
```

### Title Locators

```typescript
// Find by title
await page.getByTitle('Help').hover();
```

### Test ID Locators

```typescript
// Find by test id
await page.getByTestId('submit-button').click();
```

### CSS and XPath Locators

```typescript
// CSS selector
await page.locator('.submit-button').click();
await page.locator('#username').fill('user');

// XPath selector
await page.locator('xpath=//button[contains(text(), "Submit")]').click();
```

### Chaining Locators

```typescript
// Chain locators for more specific targeting
await page.getByRole('navigation').getByRole('link', { name: 'Home' }).click();
await page.locator('.form').getByLabel('Email').fill('user@example.com');
```

### Filtering Locators

```typescript
// Filter locators
const buttons = page.getByRole('button');
await buttons.filter({ hasText: 'Save' }).click();

// Filter with another locator
const saveButton = page.getByRole('button').filter({ has: page.getByText('Save') });
```

## API Testing

### Introduction

Playwright can be used to get access to the REST API of your application.
Sometimes you may want to send requests to the server directly from Node.js without loading a page and running js code in it. A few examples where it may come in handy:
- Test your server API.
- Prepare server side state before visiting the web application in a test.
- Validate server side post-conditions after running some actions in the browser.

All of that could be achieved via APIRequestContext methods.

### Writing API Test

APIRequestContext can send all kinds of HTTP(S) requests over network.
The following example demonstrates how to use Playwright to test issues creation via GitHub API. The test suite will do the following:
- Create a new repository before running tests.
- Create a few issues and validate server state.
- Delete the repository after running tests.

```typescript
import { test, expect } from '@playwright/test';

const REPO = 'test-repo-1';
const USER = 'github-username';

// Request context is inherited by all tests in this file.
test.beforeAll(async ({ request }) => {
  // Create a repository.
  const response = await request.post(`https://api.github.com/user/repos`, {
    data: {
      name: REPO,
    },
  });
  expect(response.ok()).toBeTruthy();
});

test.afterAll(async ({ request }) => {
  // Delete repository.
  const response = await request.delete(`https://api.github.com/repos/${USER}/${REPO}`);
  expect(response.ok()).toBeTruthy();
});

test('should create a bug report', async ({ request }) => {
  const newIssue = await request.post(`https://api.github.com/repos/${USER}/${REPO}/issues`, {
    data: {
      title: '[Bug] report 1',
      body: 'Bug description',
    },
  });
  expect(newIssue.ok()).toBeTruthy();

  const issues = await request.get(`https://api.github.com/repos/${USER}/${REPO}/issues`);
  expect(issues.ok()).toBeTruthy();
  expect(await issues.json()).toContainEqual(expect.objectContaining({
    title: '[Bug] report 1',
    body: 'Bug description',
  }));
});

test('should create a feature request', async ({ request }) => {
  const newIssue = await request.post(`https://api.github.com/repos/${USER}/${REPO}/issues`, {
    data: {
      title: '[Feature] request 1',
      body: 'Feature description',
    },
  });
  expect(newIssue.ok()).toBeTruthy();

  const issues = await request.get(`https://api.github.com/repos/${USER}/${REPO}/issues`);
  expect(issues.ok()).toBeTruthy();
  expect(await issues.json()).toContainEqual(expect.objectContaining({
    title: '[Feature] request 1',
    body: 'Feature description',
  }));
});
```

### Using Request Context

#### Sending API requests from UI tests

You can use the same APIRequestContext in your UI tests to prepare server state before visiting the web application.

```typescript
import { test, expect } from '@playwright/test';

test('should create new article', async ({ page, request }) => {
  // Create a new article via API.
  const response = await request.post('/api/articles', {
    data: {
      title: 'New Article',
      body: 'Article content',
    },
  });
  expect(response.ok()).toBeTruthy();
  
  // Visit the page with the new article.
  await page.goto('/articles');
  await expect(page.getByText('New Article')).toBeVisible();
});
```

#### Establishing preconditions

```typescript
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  // Delete all existing articles.
  await request.delete('/api/articles');
  
  // Create a new article.
  await request.post('/api/articles', {
    data: {
      title: 'Test Article',
      body: 'Test content',
    },
  });
});

test('should display article', async ({ page }) => {
  await page.goto('/articles');
  await expect(page.getByText('Test Article')).toBeVisible();
});
```

#### Validating postconditions

```typescript
import { test, expect } from '@playwright/test';

test('should delete article', async ({ page, request }) => {
  await page.goto('/articles');
  await page.getByRole('button', { name: 'Delete' }).click();
  
  // Validate that article was deleted via API.
  const response = await request.get('/api/articles');
  expect(response.ok()).toBeTruthy();
  expect(await response.json()).toEqual([]);
});
```

### Reusing Authentication State

Playwright allows you to reuse authentication state across tests and contexts.

```typescript
import { test, expect } from '@playwright/test';

test.describe('authenticated tests', () => {
  test.use({ storageState: 'auth-state.json' });
  
  test('should display user profile', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.getByText('John Doe')).toBeVisible();
  });
  
  test('should allow logout', async ({ page }) => {
    await page.goto('/profile');
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL('/login');
  });
});
```

## Authentication

### Introduction

Playwright provides a way to handle authentication in your tests. You can either:
- Sign in via UI in each test
- Use API to authenticate and reuse session state
- Use storage state to persist authentication across tests

### UI Authentication

```typescript
import { test, expect } from '@playwright/test';

test('should login with valid credentials', async ({ page }) => {
  await page.goto('/login');
  
  await page.getByLabel('Username').fill('user');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText('Welcome, user')).toBeVisible();
});
```

### API Authentication

```typescript
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Authenticate via API
  await page.goto('/login');
  await page.evaluate(({ username, password }) => {
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
  }, { username: 'user', password: 'password' });
  
  // Reload page to apply authentication
  await page.reload();
});

test('should access protected content', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByText('Welcome, user')).toBeVisible();
});
```

### Storage State

```typescript
import { test, expect } from '@playwright/test';

// Save storage state
test('save storage state', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('user');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  
  // Wait for authentication to complete
  await expect(page).toHaveURL('/dashboard');
  
  // Save storage state
  await page.context().storageState({ path: 'auth-state.json' });
});

// Use storage state
test.use({ storageState: 'auth-state.json' });

test('should access protected content', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByText('Welcome, user')).toBeVisible();
});
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npx playwright test

# Run tests in headed mode
npx playwright test --headed

# Run tests with UI
npx playwright test --ui

# Run specific test file
npx playwright test tests/example.spec.ts

# Run tests with specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Debug Mode

```bash
# Run in debug mode
npx playwright test --debug

# Run with trace
npx playwright test --trace on

# Run with video recording
npx playwright test --video on
```

### Filtering Tests

```bash
# Run tests matching a grep pattern
npx playwright test --grep "login"

# Run tests by file name
npx playwright test login.spec.ts

# Run tests by line numbers
npx playwright test login.spec.ts:42

# Run tests with titles
npx playwright test --title "should login"
```

### UI Mode Features

UI Mode provides:
- **Watch Mode**: Automatically rerun tests on file changes
- **Live Step View**: See test execution step by step
- **Time Travel Debugging**: Step back and forth through test execution
- **Trace Integration**: View detailed traces alongside tests
- **Test Filtering**: Interactive test filtering and selection

### Reporters

#### HTML Reporter
```bash
# Generate HTML report
npx playwright test --reporter=html

# View existing report
npx playwright show-report
```

#### JSON Reporter
```bash
# Generate JSON report
npx playwright test --reporter=json
```

#### JUnit Reporter
```bash
# Generate JUnit report for CI
npx playwright test --reporter=junit
```

#### Multiple Reporters
```typescript
// playwright.config.ts
export default defineConfig({
  reporter: [
    ['html'],
    ['json', { outputFile: 'results.json' }],
    ['junit', { outputFile: 'junit.xml' }],
  ],
});
```

### Package.json Scripts

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:codegen": "playwright codegen",
    "test:e2e:install": "playwright install",
    "test:e2e:report": "playwright show-report"
  }
}
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
        
      - name: Run Playwright tests
        run: npx playwright test
        
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### Docker Support

```dockerfile
FROM mcr.microsoft.com/playwright:v1.59.0-focal

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Install Playwright browsers
RUN npx playwright install --with-deps

# Run tests
CMD ["npx", "playwright", "test"]
```

## Advanced Features

### Test Generator

Record your actions in the browser and Playwright writes the test code:

```bash
# Start codegen
npx playwright codegen https://example.com

# Record specific page
npx playwright codegen https://example.com/login
```

### Trace Viewer

Full timeline of test execution with DOM snapshots, network requests, console logs, and screenshots:

```bash
# Run tests with trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

### Network Interception

Mock and modify network requests:

```typescript
// Mock API response
await page.route('/api/users', async route => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ name: 'John' }])
  });
});

// Modify request
await page.route('**/*', async route => {
  const headers = route.request().headers();
  headers['Authorization'] = 'Bearer token';
  await route.continue({ headers });
});
```

### Visual Testing

Take screenshots and compare with baseline:

```typescript
// Screenshot comparison
await expect(page).toHaveScreenshot('homepage.png');

// Element screenshot
await expect(page.locator('.header')).toHaveScreenshot('header.png');

// Full page screenshot
await expect(page).toHaveScreenshot('full-page.png', { fullPage: true });
```

### Mobile Testing

Test on mobile devices:

```typescript
// Use device presets
import { devices } from '@playwright/test';

test.use({ ...devices['iPhone 12'] });

// Custom viewport
test.use({ viewport: { width: 375, height: 667 } });

// Device emulation
const context = await browser.newContext({
  ...devices['Pixel 5'],
  userAgent: 'Custom User Agent'
});
```

### Accessibility Testing

```typescript
import { injectAxe, checkA11y } from 'axe-playwright';

test.beforeEach(async ({ page }) => {
  await injectAxe(page);
});

test('should be accessible', async ({ page }) => {
  await page.goto('/');
  await checkA11y(page);
});
```

### Aria Snapshots and Locator Improvements (v1.59)

Capture and use Aria snapshots for accessibility testing:

```typescript
// Capture aria snapshot of the page
const snapshot = await page.ariaSnapshot();

// Capture aria snapshot of a specific element with options
const elementSnapshot = await page.locator('.card').ariaSnapshot({
  depth: 3,  // Control depth of the snapshot
  mode: 'tree'  // or 'flat'
});

// Normalize locator to follow best practices
const normalized = page.locator('.btn').normalize();

// Pick locator interactively
const picked = await page.pickLocator();
await page.cancelPickLocator();  // Cancel picking
```

### Async Disposables with `await using` (v1.59)

Many APIs now return async disposables for automatic cleanup:

```typescript
// Automatic cleanup with await using
await using page = await context.newPage();
{
  await using route = await page.route('**/*', route => route.continue());
  await using script = await page.addInitScript('console.log("init script")');
  await page.goto('https://playwright.dev');
  // route and init script are automatically removed here
}
// page is automatically closed here
```

## Playwright v1.59 New Features

### Screencast API

The new Screencast API provides a unified interface for capturing page content with video recordings, action annotations, and visual overlays.

#### Video Recording

Record video with precise start/stop control:

```typescript
// Start screencast recording
await page.screencast.start({ path: 'video.webm' });

// ... perform actions ...
await page.goto('https://example.com');
await page.getByRole('button').click();

// Stop recording
await page.screencast.stop();
```

#### Real-time Frame Capture

Stream JPEG-encoded frames for custom processing:

```typescript
await page.screencast.start({
  onFrame: ({ data }) => {
    // Send to vision model, create thumbnails, etc.
    sendToVisionModel(data);
  },
  size: { width: 800, height: 600 }
});
```

#### Action Annotations

Enable visual annotations that highlight interacted elements:

```typescript
// Show action annotations in top-right corner
await page.screencast.showActions({ position: 'top-right' });

// Or configure in playwright.config.ts
export default defineConfig({
  use: {
    video: {
      mode: 'on',
      show: {
        actions: { position: 'top-left' },
        test: { position: 'top-right' }
      }
    }
  }
});
```

Available positions: `'top-left'`, `'top'`, `'top-right'`, `'bottom-left'`, `'bottom'`, `'bottom-right'`

#### Visual Overlays and Chapters

Add chapter titles and custom HTML overlays:

```typescript
// Show chapter with title and description
await page.screencast.showChapter('Adding TODOs', {
  description: 'Type and press enter for each TODO',
  duration: 1000
});

// Add custom HTML overlay
await page.screencast.showOverlay('<div style="color: red">Recording</div>');

// Control overlay visibility
await page.screencast.showOverlays();
await page.screencast.hideOverlays();
```

#### Agentic Video Receipts

Create video evidence for automated testing workflows:

```typescript
// Recording a verification walkthrough
await page.screencast.start({ path: 'receipt.webm' });
await page.screencast.showActions({ position: 'top-right' });
await page.screencast.showChapter('Verifying checkout flow', {
  description: 'Added coupon code support per ticket #1234'
});

// Perform verification steps
await page.locator('#coupon').fill('SAVE20');
await page.locator('#apply-coupon').click();
await expect(page.locator('.discount')).toContainText('20%');

await page.screencast.showChapter('Done', {
  description: 'Coupon applied, discount reflected in total'
});
await page.screencast.stop();
```

### Browser Interoperability API

The `browser.bind()` API makes launched browsers available for playwright-cli, @playwright/mcp, and other clients.

#### Binding a Browser

```typescript
// Start and bind a browser for external connections
const { endpoint } = await browser.bind('my-session', {
  workspaceDir: '/my/project'
});

// endpoint can be used by multiple clients
```

#### Connecting from playwright-cli

```bash
# Attach to bound browser
playwright-cli attach my-session

# Take snapshot
playwright-cli -s my-session snapshot
```

#### Connecting from @playwright/mcp

```bash
# Point MCP server to running browser
@playwright/mcp --endpoint=my-session
```

#### Connecting from Playwright Client

```typescript
// Multiple clients can connect simultaneously
const browser = await chromium.connect(endpoint);
```

#### WebSocket Binding

Bind over WebSocket instead of named pipe:

```typescript
const { endpoint } = await browser.bind('my-session', {
  host: 'localhost',
  port: 0  // Auto-assign port
});
// endpoint is now a ws:// URL
```

#### Unbinding

```typescript
// Stop accepting new connections
await browser.unbind();
```

### Observability Dashboard

View all bound browsers and their statuses:

```bash
# Open observability dashboard
playwright-cli show
```

Features:
- See what agents are doing on background browsers
- Click into sessions for manual interventions
- Open DevTools to inspect pages
- View @playwright/test browsers with `PLAYWRIGHT_DASHBOARD=1`

```bash
PLAYWRIGHT_DASHBOARD=1 npx playwright test
```

### CLI Debugger for Agents

Coding agents can debug tests over playwright-cli:

```bash
# Run tests with CLI debug mode
npx playwright test --debug=cli
```

Output example:
```
### Debugging Instructions
- Run "playwright-cli attach tw-87b59e" to attach to this test
$ playwright-cli attach tw-87b59e

### Session `tw-87b59e` created, attached to `tw-87b59e`.
Run commands with: playwright-cli --session=tw-87b59e <command>

### Paused
- Navigate to "/" at output/tests/example.spec.ts:4
$ playwright-cli --session tw-87b59e step-over
```

### CLI Trace Analysis

Explore Playwright Traces from command line:

```bash
# Open trace from command line
npx playwright trace open test-results/example-has-title-chromium/trace.zip

# List all actions
npx playwright trace actions --grep="expect"

# View specific action
npx playwright trace action 9

# View snapshot
npx playwright trace snapshot 9 --name after

# Close trace viewer
npx playwright trace close
```

### Storage and Console Management (v1.59)

#### Storage State Management

Clear and set storage state without creating new context:

```typescript
// Clear existing cookies, localStorage, and IndexedDB, then set new state
await browserContext.setStorageState({
  cookies: [...],
  origins: [...]
});
```

#### Console and Error Management

```typescript
// Clear stored console messages
await page.clearConsoleMessages();

// Clear stored page errors
await page.clearPageErrors();

// Get filtered console messages
const messages = await page.consoleMessages({
  filter: msg => msg.type() === 'error'
});

// Get console message timestamp
for (const msg of await page.consoleMessages()) {
  console.log(msg.timestamp());
}
```

### New Configuration Options

#### Enhanced Trace Mode

New trace mode for comparing passing and failing traces:

```typescript
export default defineConfig({
  use: {
    // Record trace for each run, retain all on failure
    trace: 'retain-on-failure-and-retries'
  }
});
```

#### Artifacts Directory

Configure artifacts directory in launch options:

```typescript
const browser = await chromium.launch({
  artifactsDir: './custom-artifacts'
});
```

### Browser Versions (v1.59)

- **Chromium**: 147.0.7727.15
- **Mozilla Firefox**: 148.0.2
- **WebKit**: 26.4

Tested against stable channels:
- Google Chrome 146
- Microsoft Edge 146

## Best Practices

### Test Organization

- Use Page Object Model for maintainability
- Group related tests with `describe`
- Use descriptive test names
- Keep tests independent and isolated
- Use fixtures for reusable test setup

### Selector Strategy

- Prefer user-facing selectors (role, text)
- Use test-specific data attributes when needed
- Avoid fragile selectors like CSS classes
- Use `data-testid` for test-only elements

#### Recommended Selector Priority:

1. `getByRole()` - Most accessible and user-friendly
2. `getByLabel()` - Form inputs and controls
3. `getByPlaceholder()` - Input placeholders
4. `getByText()` - Text content
5. `getByAltText()` - Image alt text
6. `getByTitle()` - Tooltip titles
7. `getByTestId()` - Test-only attributes

### Data Management

- Use consistent test data
- Clean up test data after each test
- Use fixtures for reusable test setup
- Mock external dependencies
- Use test databases for isolation

### Performance Optimization

- Run tests in parallel
- Use efficient selectors
- Avoid unnecessary waits
- Reuse browser contexts when possible
- Use `test.step()` for logical grouping

### Error Handling

- Use proper assertions with clear messages
- Implement retry logic for flaky operations
- Use try-catch blocks for cleanup
- Provide meaningful error messages

## Troubleshooting

### Common Issues

#### Timeout Issues
```typescript
// Increase timeout for specific tests
test.setTimeout(60000); // 60 seconds

// Use specific waits instead of arbitrary timeouts
await page.waitForSelector('[data-testid="element"]');
await page.waitForLoadState('networkidle');
```

#### Flaky Tests
```typescript
// Use retry mechanisms
test.describe.configure({ retries: 3 });

// Add explicit waits
await page.waitForLoadState('networkidle');
await expect(page.locator('[data-testid="element"]')).toBeVisible();
```

#### Selector Issues
```typescript
// Use more robust selectors
// Bad: page.locator('.btn-primary')
// Good: page.getByRole('button', { name: /submit/i })

// Use data-testid for test-specific elements
await page.locator('[data-testid="submit-button"]').click();
```

#### Browser Context Issues
```typescript
// Clean up context after each test
test.afterEach(async ({ context }) => {
  await context.clearCookies();
  await context.clearPermissions();
});
```

## Community and Resources

### Official Resources

- **Documentation**: <https://playwright.dev/docs/intro>
- **API Reference**: <https://playwright.dev/docs/api/class-test>
- **GitHub**: <https://github.com/microsoft/playwright>
- **Discord**: <https://aka.ms/playwright/discord>
- **Stack Overflow**: <https://stackoverflow.com/questions/tagged/playwright>

### Learning Resources

- **Playwright Training**: Microsoft Learn modules
- **Community Videos**: Feature demonstrations and tutorials
- **Blog Posts**: Latest updates and best practices
- **Ambassadors**: Community experts and advocates

### Tools and Extensions

- **VS Code Extension**: Integrated development experience
- **Trace Viewer**: Detailed test execution analysis
- **Test Generator**: Record and generate tests
- **HTML Reporter**: Interactive test reports

---

*This documentation covers Playwright ^1.59.0 as used in this repository. For the latest features, check the official Playwright documentation.*
