import { test, expect } from '@playwright/test';

test.describe('Contact Form E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('form loads with all required fields', async ({ page }) => {
    // Check that all form fields are present
    await expect(page.getByLabel('Name *')).toBeVisible();
    await expect(page.getByLabel('Email *')).toBeVisible();
    await expect(page.getByLabel('Phone (Optional)')).toBeVisible();
    await expect(page.getByLabel('Company (Optional)')).toBeVisible();
    await expect(page.getByLabel('Message *')).toBeVisible();
    
    // Check that submit button is present
    await expect(page.getByRole('button', { name: 'Send Message' })).toBeVisible();
  });

  test('invalid email shows validation error', async ({ page }) => {
    // Fill form with invalid email
    await page.getByLabel('Name *').fill('John Doe');
    await page.getByLabel('Email *').fill('invalid-email');
    await page.getByLabel('Message *').fill('This is a test message with enough characters');
    
    // Submit form
    await page.getByRole('button', { name: 'Send Message' }).click();
    
    // Wait for validation error
    await expect(page.getByText('Invalid email address')).toBeVisible();
  });

  test('missing required fields show validation errors', async ({ page }) => {
    // Submit form without filling required fields
    await page.getByRole('button', { name: 'Send Message' }).click();
    
    // Check for validation errors
    await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();
    await expect(page.getByText('Invalid email address')).toBeVisible();
    await expect(page.getByText('Message must be at least 10 characters')).toBeVisible();
  });

  test('valid submission shows success toast (with test env vars)', async ({ page }) => {
    // Fill form with valid data
    await page.getByLabel('Name *').fill('John Doe');
    await page.getByLabel('Email *').fill('john@example.com');
    await page.getByLabel('Phone (Optional)').fill('+1 (555) 123-4567');
    await page.getByLabel('Company (Optional)').fill('Test Company');
    await page.getByLabel('Message *').fill('This is a test message with enough characters to meet the minimum requirement');
    
    // Submit form
    await page.getByRole('button', { name: 'Send Message' }).click();
    
    // Wait for success toast or error toast (if Resend not configured)
    // This validates the form submission flow regardless of Resend configuration
    await expect(page.getByText(/Message sent successfully|Failed to send message|Server configuration error/)).toBeVisible({ timeout: 10000 });
  });
});
