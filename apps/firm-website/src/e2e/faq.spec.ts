import { test, expect } from '@playwright/test'

test('faq hub page loads', async ({ page }) => {
  await page.goto('/faq')

  // Verify page loads successfully
  await expect(page).toHaveURL('/faq')
})

test('faq hub displays accordion items', async ({ page }) => {
  await page.goto('/faq')

  // Wait for content to load
  await page.waitForLoadState('networkidle')

  // Check that accordion items are present
  const accordionItems = page.locator('[data-testid="faq-item"]')
  await expect(accordionItems.first()).toBeVisible()
})

test('faq accordion expands', async ({ page }) => {
  await page.goto('/faq')

  // Wait for content to load
  await page.waitForLoadState('networkidle')

  // Click on the first FAQ item trigger
  const firstFaqTrigger = page.locator('[data-testid="faq-item"]').first().locator('button')
  await firstFaqTrigger.click()

  // Wait for expansion animation
  await page.waitForTimeout(300)

  // Verify that the accordion trigger is now pressed/active
  await expect(firstFaqTrigger).toHaveAttribute('data-state', 'open')
})
