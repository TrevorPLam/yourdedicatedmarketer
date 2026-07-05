import { describe, it, expect, beforeEach } from 'vitest';
import { submitContact, initialContactState } from './contact';

describe('submitContact Server Action', () => {
  beforeEach(() => {
    // Set required environment variables for validation tests
    process.env.RESEND_API_KEY = 'test_api_key';
    process.env.CONTACT_EMAIL = 'test@example.com';
    process.env.FROM_EMAIL = 'noreply@example.com';
  });

  it('should validate form data and return errors for invalid input', async () => {
    const formData = new FormData();
    formData.append('name', 'A'); // Too short
    formData.append('email', 'invalid-email');
    formData.append('message', 'short'); // Too short

    const result = await submitContact(initialContactState, formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Please fix the errors below.');
    expect(result.errors).toHaveProperty('name');
    expect(result.errors).toHaveProperty('email');
    expect(result.errors).toHaveProperty('message');
  });

  it('should validate name minimum length', async () => {
    const formData = new FormData();
    formData.append('name', 'A');
    formData.append('email', 'john@example.com');
    formData.append('message', 'This is a test message with sufficient length.');

    const result = await submitContact(initialContactState, formData);

    expect(result.success).toBe(false);
    expect(result.errors).toHaveProperty('name');
  });

  it('should validate email format', async () => {
    const formData = new FormData();
    formData.append('name', 'John Doe');
    formData.append('email', 'not-an-email');
    formData.append('message', 'This is a test message with sufficient length.');

    const result = await submitContact(initialContactState, formData);

    expect(result.success).toBe(false);
    expect(result.errors).toHaveProperty('email');
  });

  it('should validate message minimum length', async () => {
    const formData = new FormData();
    formData.append('name', 'John Doe');
    formData.append('email', 'john@example.com');
    formData.append('message', 'short');

    const result = await submitContact(initialContactState, formData);

    expect(result.success).toBe(false);
    expect(result.errors).toHaveProperty('message');
  });

  it('should accept valid form data', async () => {
    const formData = new FormData();
    formData.append('name', 'John Doe');
    formData.append('email', 'john@example.com');
    formData.append('phone', '123-456-7890');
    formData.append('company', 'Acme Corp');
    formData.append('message', 'This is a test message with sufficient length.');

    const result = await submitContact(initialContactState, formData);

    // Note: This will fail to send email in test environment since Resend is not configured
    // But validation should pass, so it will attempt to send and fail with a configuration error
    // or API error, not a validation error
    expect(result.errors).toEqual({});
  });

  it('should handle optional fields (phone, company) when not provided', async () => {
    const formData = new FormData();
    formData.append('name', 'John Doe');
    formData.append('email', 'john@example.com');
    formData.append('message', 'This is a test message with sufficient length.');

    const result = await submitContact(initialContactState, formData);

    // Validation should pass for optional fields
    expect(result.errors).toEqual({});
  });
});
