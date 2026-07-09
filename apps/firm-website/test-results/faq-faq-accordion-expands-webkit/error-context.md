# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: faq.spec.ts >> faq accordion expands
- Location: src\e2e\faq.spec.ts:21:1

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('[data-testid="faq-item"]').first().locator('button')
Expected: "open"
Received: "closed"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" with timeout 5000ms
  - waiting for locator('[data-testid="faq-item"]').first().locator('button')
    13 × locator resolved to <button type="button" data-state="closed" aria-expanded="false" id="radix-_R_1j9bsnn5tjb_" data-orientation="vertical" data-radix-collection-item="" class="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]]:text-primary text-left">…</button>
       - unexpected value "closed"

```

```yaml
- button "How much does a website cost for a small business in DFW?":
  - text: How much does a website cost for a small business in DFW?
  - img
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test('faq hub page loads', async ({ page }) => {
  4  |   await page.goto('/faq')
  5  | 
  6  |   // Verify page loads successfully
  7  |   await expect(page).toHaveURL('/faq')
  8  | })
  9  | 
  10 | test('faq hub displays accordion items', async ({ page }) => {
  11 |   await page.goto('/faq')
  12 | 
  13 |   // Wait for content to load
  14 |   await page.waitForLoadState('networkidle')
  15 | 
  16 |   // Check that accordion items are present
  17 |   const accordionItems = page.locator('[data-testid="faq-item"]')
  18 |   await expect(accordionItems.first()).toBeVisible()
  19 | })
  20 | 
  21 | test('faq accordion expands', async ({ page }) => {
  22 |   await page.goto('/faq')
  23 | 
  24 |   // Wait for content to load
  25 |   await page.waitForLoadState('networkidle')
  26 | 
  27 |   // Click on the first FAQ item trigger
  28 |   const firstFaqTrigger = page.locator('[data-testid="faq-item"]').first().locator('button')
  29 |   await firstFaqTrigger.click()
  30 | 
  31 |   // Wait for expansion animation
  32 |   await page.waitForTimeout(300)
  33 | 
  34 |   // Verify that the accordion trigger is now pressed/active
> 35 |   await expect(firstFaqTrigger).toHaveAttribute('data-state', 'open')
     |                                 ^ Error: expect(locator).toHaveAttribute(expected) failed
  36 | })
  37 | 
  38 | test('faq detail page loads', async ({ page }) => {
  39 |   await page.goto('/faq/cost')
  40 | 
  41 |   // Verify page loads successfully
  42 |   await expect(page).toHaveURL('/faq/cost')
  43 | })
  44 | 
  45 | test('faq detail displays content', async ({ page }) => {
  46 |   await page.goto('/faq/cost')
  47 | 
  48 |   // Wait for content to load
  49 |   await page.waitForLoadState('networkidle')
  50 | 
  51 |   // Check that the title is present
  52 |   const title = page.locator('h1')
  53 |   await expect(title).toBeVisible()
  54 | 
  55 |   // Check that content is present
  56 |   const content = page.locator('.max-w-none')
  57 |   await expect(content).toBeVisible()
  58 | })
  59 | 
```