import { test, expect } from '@playwright/test'

test('services hub page loads', async ({ page }) => {
  await page.goto('/services')

  // Verify page loads successfully
  await expect(page).toHaveURL('/services')
})

test('services hub displays service cards', async ({ page }) => {
  await page.goto('/services')

  // Wait for content to load
  await page.waitForLoadState('networkidle')

  // Check that service cards are present
  const serviceCards = page.locator('[data-testid="service-card"]')
  await expect(serviceCards.first()).toBeVisible()
})

test('service detail page loads', async ({ page }) => {
  await page.goto('/services/website-design')

  // Verify page loads successfully
  await expect(page).toHaveURL('/services/website-design')
})
