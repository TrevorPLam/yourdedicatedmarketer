import { test, expect } from '@playwright/test'

test('industries hub page loads', async ({ page }) => {
  await page.goto('/industries')

  // Verify page loads successfully
  await expect(page).toHaveURL('/industries')
})

test('industries hub displays industry cards', async ({ page }) => {
  await page.goto('/industries')

  // Wait for content to load
  await page.waitForLoadState('networkidle')

  // Check that industry cards are present
  const industryCards = page.locator('[data-testid="industry-card"]')
  await expect(industryCards.first()).toBeVisible()
})

test('industry detail page loads', async ({ page }) => {
  await page.goto('/industries/home-services')

  // Verify page loads successfully
  await expect(page).toHaveURL('/industries/home-services')
})
