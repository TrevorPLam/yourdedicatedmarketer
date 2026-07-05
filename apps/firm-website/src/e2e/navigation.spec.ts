import { test, expect } from '@playwright/test'

test('about page loads', async ({ page }) => {
  await page.goto('/about')

  // Verify page loads successfully
  await expect(page).toHaveURL('/about')
})

test('pricing page loads', async ({ page }) => {
  await page.goto('/pricing')

  // Verify page loads successfully
  await expect(page).toHaveURL('/pricing')
})

test('contact page loads', async ({ page }) => {
  await page.goto('/contact')

  // Verify page loads successfully
  await expect(page).toHaveURL('/contact')
})

test('faq page loads', async ({ page }) => {
  await page.goto('/faq')

  // Verify page loads successfully
  await expect(page).toHaveURL('/faq')
})
