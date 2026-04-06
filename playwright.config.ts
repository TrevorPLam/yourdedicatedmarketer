import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Testing Configuration
 * 
 * This configuration sets up comprehensive E2E testing for the monorepo with:
 * - Multi-browser testing (Chrome, Firefox, Safari)
 * - Mobile and desktop viewport testing
 * - Parallel execution for faster test runs
 * - Comprehensive reporting and screenshots
 * - Integration with monorepo structure
 */

export default defineConfig({
  // Test directory
  testDir: './e2e',
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: './playwright-report', open: 'never' }],
    ['json', { outputFile: './test-results/results.json' }],
    ['junit', { outputFile: './test-results/results.xml' }],
    process.env.CI ? ['github'] : ['list'],
  ],
  
  // Global setup and teardown
  globalSetup: './e2e/global-setup.ts',
  globalTeardown: './e2e/global-teardown.ts',
  
  // Test timeout
  timeout: 30 * 1000, // 30 seconds
  expect: {
    timeout: 10 * 1000, // 10 seconds
  },
  
  // Output directories
  outputDir: './test-results',
  
  // Projects for different browsers and devices
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: '**/e2e/**/*.firefox.spec.{ts,js}',
    },
    
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: '**/e2e/**/*.webkit.spec.{ts,js}',
    },
    
    // Mobile browsers
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      testMatch: '**/e2e/**/*.mobile.spec.{ts,js}',
    },
    
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
      testMatch: '**/e2e/**/*.mobile.spec.{ts,js}',
    },
    
    // Tablet testing
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro'] },
      testMatch: '**/e2e/**/*.tablet.spec.{ts,js}',
    },
    
    // Dark mode testing
    {
      name: 'Dark Mode',
      use: { 
        ...devices['Desktop Chrome'],
        colorScheme: 'dark',
        reducedMotion: 'reduce',
      },
      testMatch: '**/e2e/**/*.dark.spec.{ts,js}',
    },
    
    // Accessibility testing
    {
      name: 'Accessibility',
      use: { 
        ...devices['Desktop Chrome'],
        // Enable accessibility testing
      },
      testMatch: '**/e2e/**/*.a11y.spec.{ts,js}',
    },
  ],
  
  // Web server configuration
  webServer: [
    {
      command: 'pnpm --filter @agency/agency-website dev',
      port: 4321,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000, // 2 minutes
    },
    {
      command: 'pnpm --filter @agency/project-manager dev',
      port: 3002,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000, // 2 minutes
    },
  ],
  
  // Global test configuration
  use: {
    // Base URL for all tests
    baseURL: 'http://localhost:4321',
    
    // Collect trace when retrying on CI
    trace: 'on-first-retry',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Global timeout for actions
    actionTimeout: 10 * 1000, // 10 seconds
    
    // Navigation timeout
    navigationTimeout: 30 * 1000, // 30 seconds
  },
  
  // Environment variables
  env: {
    // Test environment
    NODE_ENV: 'test',
    
    // API endpoints
    API_BASE_URL: 'http://localhost:3002/api',
    
    // Test credentials — set via environment variables or a .env.test file (never hardcode here)
    TEST_USER_EMAIL: process.env.TEST_USER_EMAIL ?? '',
    TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD ?? '',
    
    // Feature flags
    ENABLE_ANALYTICS: 'false',
    ENABLE_ERROR_TRACKING: 'false',
  },
  
  // Test ignore patterns
  testIgnore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.next/**',
    '**/coverage/**',
    '**/playwright-report/**',
  ],
  
  // Metadata for test organization
  metadata: {
    'Test Environment': process.env.NODE_ENV || 'test',
    'Test Suite': 'E2E Tests',
    'Browser': 'Playwright',
  },
});
