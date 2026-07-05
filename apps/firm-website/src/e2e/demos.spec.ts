import { test, expect } from '@playwright/test'

test('demos hub page loads', async ({ page }) => {
  await page.goto('/demos')

  // Verify page loads successfully
  await expect(page).toHaveURL('/demos')
})

test('demos hub displays demo cards', async ({ page }) => {
  await page.goto('/demos')

  // Wait for content to load
  await page.waitForLoadState('networkidle')

  // Check that demo cards are present
  const demoCards = page.locator('[data-testid="demo-card"]')
  await expect(demoCards.first()).toBeVisible()
})

test('demo detail page loads', async ({ page }) => {
  await page.goto('/demos/restaurant')

  // Verify page loads successfully
  await expect(page).toHaveURL('/demos/restaurant')
})
