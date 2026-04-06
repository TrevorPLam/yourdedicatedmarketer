import { test, expect, type Page } from '@playwright/test';

/**
 * E2E Test Utilities
 *
 * Shared utilities and helper functions for E2E testing across the monorepo.
 */

// Test data fixtures
export function testUserFixture() {
  return {
    email: 'test@example.com',
    password: 'testpassword123',
    name: 'Test User',
  };
}

export function testClientFixture() {
  return {
    name: 'Test Client',
    domain: 'test-client.example.com',
    plan: 'professional',
  };
}

// Authentication helpers
export async function login(page: Page, user?: { email: string; password: string }) {
  const testUser = user || createTestUser();

  await page.goto('/login');
  await page.fill('input[name="email"]', testUser.email);
  await page.fill('input[name="password"]', testUser.password);
  await page.click('button[type="submit"]');

  // Wait for successful login
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
}

export async function logout(page: Page) {
  await page.click('[data-testid="user-menu"]');
  await page.click('button:has-text("Logout")');

  // Wait for logout
  await expect(page).toHaveURL('/');
}

// Navigation helpers
export async function navigateTo(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
}

export async function waitForElement(page: Page, selector: string, timeout = 10000) {
  await page.waitForSelector(selector, { timeout });
  return page.locator(selector);
}

// Form helpers
export async function fillForm(page: Page, fields: Record<string, string>) {
  for (const [selector, value] of Object.entries(fields)) {
    await page.fill(selector, value);
  }
}

export async function submitForm(page: Page, submitSelector = 'button[type="submit"]') {
  await page.click(submitSelector);
  await page.waitForLoadState('networkidle');
}

// Assertion helpers
export async function expectToast(page: Page, message: string) {
  const toast = page.locator('[data-testid="toast"]');
  await expect(toast).toBeVisible();
  await expect(toast).toContainText(message);
}

export async function expectError(page: Page, message: string) {
  const error = page.locator('[data-testid="error"]');
  await expect(error).toBeVisible();
  await expect(error).toContainText(message);
}

export async function expectSuccess(page: Page, message: string) {
  const success = page.locator('[data-testid="success"]');
  await expect(success).toBeVisible();
  await expect(success).toContainText(message);
}

// Mobile testing helpers
export async function setupMobileViewport(page: Page) {
  await page.setViewportSize({ width: 375, height: 667 });
}

export async function setupTabletViewport(page: Page) {
  await page.setViewportSize({ width: 768, height: 1024 });
}

// Accessibility helpers
export async function checkAccessibility(page: Page) {
  // Basic accessibility checks
  const images = await page.locator('img:not([alt])').count();
  if (images > 0) {
    throw new Error(`Found ${images} images without alt text`);
  }

  const buttonsWithoutText = await page
    .locator('button:not(:has-text(/\\w/)):not([aria-label]):not([title])')
    .count();
  if (buttonsWithoutText > 0) {
    throw new Error(`Found ${buttonsWithoutText} buttons without accessible text`);
  }
}

// Performance helpers
export async function measurePageLoad(page: Page, url: string) {
  const startTime = Date.now();
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  const endTime = Date.now();

  return {
    loadTime: endTime - startTime,
    url,
  };
}

// Database helpers (for test setup)
export async function createTestDatabaseEntry(page: Page, data: any) {
  // This would make API calls to create test data
  await page.evaluate((testData) => {
    // In a real implementation, this would call your API
    console.log('Creating test data:', testData);
  }, data);
}

export async function cleanupTestData(page: Page) {
  // This would clean up test data
  await page.evaluate(() => {
    // In a real implementation, this would call your cleanup API
    console.log('Cleaning up test data');
  });
}

// Custom test fixtures
export const testWithAuth = test.extend({
  authenticatedPage: async ({ page }, use) => {
    await login(page);
    await use(page);
    await logout(page);
  },
});

export const testWithMobile = test.extend({
  mobilePage: async ({ page }, use) => {
    await setupMobileViewport(page);
    await use(page);
  },
});

export const testWithTablet = test.extend({
  tabletPage: async ({ page }, use) => {
    await setupTabletViewport(page);
    await use(page);
  },
});
