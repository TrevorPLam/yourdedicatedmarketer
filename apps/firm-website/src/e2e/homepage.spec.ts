import { test, expect } from '@playwright/test'

test('homepage loads and displays main heading', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('h1')).toContainText('Your Dedicated Marketer')
})

test('homepage displays get started button', async ({ page }) => {
  await page.goto('/')

  const button = page.getByRole('button', { name: 'Get Started' })
  await expect(button).toBeVisible()
})
