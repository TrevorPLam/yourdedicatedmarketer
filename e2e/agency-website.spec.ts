import { test, expect } from '@playwright/test';
import { navigateTo } from './test-utils';

test.describe('Agency Website E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await navigateTo(page, '/');
  });

  test('homepage loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Your Dedicated Marketer/);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
    await expect(page.locator('[data-testid="footer"]')).toBeVisible();
  });

  test('navigation links are present and correctly configured', async ({ page }) => {
    // Verify desktop nav links exist with correct hrefs
    await expect(page.locator('[data-testid="nav-services"]')).toHaveAttribute('href', '/services');
    await expect(page.locator('[data-testid="nav-portfolio"]')).toHaveAttribute('href', '/portfolio');
    await expect(page.locator('[data-testid="nav-home"]')).toHaveAttribute('href', '/');
  });

  test('responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check mobile navigation toggle is visible
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();

    // Open mobile menu
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

    // Verify mobile services link is accessible
    await expect(page.locator('[data-testid="mobile-nav-services"]')).toBeVisible();
  });

  test('dark mode functionality', async ({ page }) => {
    // Check for dark mode toggle
    const darkModeToggle = page.locator('[data-testid="dark-mode-toggle"]');

    if (await darkModeToggle.isVisible()) {
      // Enable dark mode
      await darkModeToggle.click();

      // Verify dark mode is applied
      await expect(page.locator('body')).toHaveClass(/dark/);

      // Disable dark mode
      await darkModeToggle.click();

      // Verify light mode is restored
      await expect(page.locator('body')).not.toHaveClass(/dark/);
    }
  });

  test('accessibility compliance', async ({ page }) => {
    // Check for proper heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    await expect(headings.first()).toHaveText(/./); // At least one heading

    // Check for alt text on images
    const imagesWithoutAlt = page.locator('img:not([alt])');
    await expect(imagesWithoutAlt).toHaveCount(0);

    // Check for proper form labels
    const inputs = page.locator('input[type="text"], input[type="email"], textarea');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const hasLabel = await input.evaluate((el) => {
        const id = el.getAttribute('id');
        const label = id ? document.querySelector(`label[for="${id}"]`) : null;
        return label || el.getAttribute('aria-label') || el.getAttribute('placeholder');
      });

      expect(hasLabel).toBeTruthy();
    }
  });

  test('performance metrics', async ({ page }) => {
    // Measure page load time
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);

    // Check for Core Web Vitals (basic implementation)
    const performanceMetrics = await page.evaluate(() => {
      return {
        fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
        lcp: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime || 0,
      };
    });

    // First Contentful Paint should be under 1.5 seconds
    expect(performanceMetrics.fcp).toBeLessThan(1500);
  });
});
