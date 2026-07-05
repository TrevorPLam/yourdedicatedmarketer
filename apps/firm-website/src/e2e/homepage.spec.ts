import { test, expect } from '@playwright/test'

test('homepage loads and displays main heading', async ({ page }) => {
  await page.goto('/')

  const heading = page.getByRole('heading', { name: /Professional Marketing Services/i })
  await expect(heading).toBeVisible()
})

test('homepage displays CTA buttons', async ({ page }) => {
  await page.goto('/')

  const contactButton = page.getByRole('link', { name: /Book a Free Consultation/i })
  await expect(contactButton.first()).toBeVisible()

  const demosButton = page.getByRole('link', { name: /See a Demo Site/i })
  await expect(demosButton).toBeVisible()
})

test('homepage CTA buttons navigate to correct pages', async ({ page }) => {
  await page.goto('/')

  const contactButton = page.getByRole('link', { name: /Book a Free Consultation/i }).first()
  await contactButton.click()
  await expect(page).toHaveURL('/contact')

  await page.goto('/')

  const demosButton = page.getByRole('link', { name: /See a Demo Site/i })
  await demosButton.click()
  await expect(page).toHaveURL('/demos')
})
