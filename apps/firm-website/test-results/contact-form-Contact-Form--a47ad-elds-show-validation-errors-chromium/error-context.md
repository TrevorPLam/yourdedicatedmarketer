# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: contact-form.spec.ts >> Contact Form E2E Tests >> missing required fields show validation errors
- Location: src\e2e\contact-form.spec.ts:33:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Name must be at least 2 characters')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Name must be at least 2 characters')

```

```yaml
- banner:
  - link "Logo":
    - /url: /
  - button "Toggle theme":
    - img
    - text: Toggle theme
  - button "Open menu":
    - img
- heading "Get in Touch" [level=1]
- paragraph: Have a project in mind? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
- text: Name *
- textbox "Name *":
  - /placeholder: Your name
- text: Email *
- textbox "Email *":
  - /placeholder: your@email.com
- text: Phone (Optional)
- textbox "Phone (Optional)":
  - /placeholder: +1 (555) 123-4567
- text: Company (Optional)
- textbox "Company (Optional)":
  - /placeholder: Your company
- text: Message *
- textbox "Message *":
  - /placeholder: Tell us about your project...
- button "Send Message"
- heading "Email" [level=3]
- paragraph: contact@yourdedicatedmarketer.com
- heading "Phone" [level=3]
- paragraph: +1 (555) 123-4567
- heading "Address" [level=3]
- paragraph: 123 Marketing St Business City, BC 12345
- heading "Hours" [level=3]
- paragraph: Monday - Friday 9:00 AM - 5:00 PM PST
- contentinfo:
  - text: Your Dedicated Marketer
  - paragraph: Professional marketing services to help your business grow.
  - heading "Navigation" [level=3]
  - navigation:
    - list:
      - listitem:
        - link "About":
          - /url: /about
      - listitem:
        - link "Services":
          - /url: /services
      - listitem:
        - link "Pricing":
          - /url: /pricing
      - listitem:
        - link "Contact":
          - /url: /contact
  - heading "Contact" [level=3]
  - list:
    - listitem:
      - img
      - link "contact@yourdedicatedmarketer.com":
        - /url: mailto:contact@yourdedicatedmarketer.com
    - listitem:
      - img
      - link "+1 (555) 123-4567":
        - /url: tel:+1 (555) 123-4567
    - listitem:
      - img
      - text: 123 Marketing St, Business City, BC 12345
  - heading "Follow Us" [level=3]
  - link "Twitter":
    - /url: https://twitter.com
    - img
  - link "LinkedIn":
    - /url: https://linkedin.com
    - img
  - link "GitHub":
    - /url: https://github.com
    - img
  - paragraph: © 2026 Your Dedicated Marketer. All rights reserved.
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Contact Form E2E Tests', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/contact');
  6  |   });
  7  | 
  8  |   test('form loads with all required fields', async ({ page }) => {
  9  |     // Check that all form fields are present
  10 |     await expect(page.getByLabel('Name *')).toBeVisible();
  11 |     await expect(page.getByLabel('Email *')).toBeVisible();
  12 |     await expect(page.getByLabel('Phone (Optional)')).toBeVisible();
  13 |     await expect(page.getByLabel('Company (Optional)')).toBeVisible();
  14 |     await expect(page.getByLabel('Message *')).toBeVisible();
  15 |     
  16 |     // Check that submit button is present
  17 |     await expect(page.getByRole('button', { name: 'Send Message' })).toBeVisible();
  18 |   });
  19 | 
  20 |   test('invalid email shows validation error', async ({ page }) => {
  21 |     // Fill form with invalid email
  22 |     await page.getByLabel('Name *').fill('John Doe');
  23 |     await page.getByLabel('Email *').fill('invalid-email');
  24 |     await page.getByLabel('Message *').fill('This is a test message with enough characters');
  25 |     
  26 |     // Submit form
  27 |     await page.getByRole('button', { name: 'Send Message' }).click();
  28 |     
  29 |     // Wait for validation error
  30 |     await expect(page.getByText('Invalid email address')).toBeVisible();
  31 |   });
  32 | 
  33 |   test('missing required fields show validation errors', async ({ page }) => {
  34 |     // Submit form without filling required fields
  35 |     await page.getByRole('button', { name: 'Send Message' }).click();
  36 |     
  37 |     // Check for validation errors
> 38 |     await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();
     |                                                                        ^ Error: expect(locator).toBeVisible() failed
  39 |     await expect(page.getByText('Invalid email address')).toBeVisible();
  40 |     await expect(page.getByText('Message must be at least 10 characters')).toBeVisible();
  41 |   });
  42 | 
  43 |   test('valid submission shows success toast (with test env vars)', async ({ page }) => {
  44 |     // Fill form with valid data
  45 |     await page.getByLabel('Name *').fill('John Doe');
  46 |     await page.getByLabel('Email *').fill('john@example.com');
  47 |     await page.getByLabel('Phone (Optional)').fill('+1 (555) 123-4567');
  48 |     await page.getByLabel('Company (Optional)').fill('Test Company');
  49 |     await page.getByLabel('Message *').fill('This is a test message with enough characters to meet the minimum requirement');
  50 |     
  51 |     // Submit form
  52 |     await page.getByRole('button', { name: 'Send Message' }).click();
  53 |     
  54 |     // Wait for success toast or error toast (if Resend not configured)
  55 |     // This validates the form submission flow regardless of Resend configuration
  56 |     await expect(page.getByText(/Message sent successfully|Failed to send message|Server configuration error/)).toBeVisible({ timeout: 10000 });
  57 |   });
  58 | });
  59 | 
```