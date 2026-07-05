import { test, expect } from '@playwright/test'

test('homepage loads and displays main heading', async ({ page }) => {
  await page.goto('/')

  const heading = page.getByRole('heading', { name: 'Your Dedicated Marketer' })
  await expect(heading).toBeVisible()
})

test('homepage displays get started button', async ({ page }) => {
  await page.goto('/')

  const button = page.getByRole('button', { name: 'Get Started' })
  await expect(button).toBeVisible()
})
