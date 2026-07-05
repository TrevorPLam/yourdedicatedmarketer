import { describe, it, expect, beforeEach, vi } from 'vitest';
import { submitContact, initialContactState } from './contact';

// Mock Resend before importing the action
const { mockEmailsSend, MockResend } = vi.hoisted(() => {
  const mockEmailsSend = vi.fn();
  class MockResend {
    constructor() {
      // Mock constructor
    }
    emails = {
      send: mockEmailsSend,
    };
  }
  return { mockEmailsSend, MockResend };
});

vi.mock('resend', () => ({
  Resend: MockResend,
}));

describe('submitContact Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set required environment variables
    process.env.RESEND_API_KEY = 'test_api_key';
    process.env.CONTACT_EMAIL = 'test@example.com';
    process.env.FROM_EMAIL = 'noreply@example.com';
  });

  describe('P034-01: Valid form data returns success and calls Resend', () => {
    it('should return success and call Resend with valid form data', async () => {
      mockEmailsSend.mockResolvedValue({ data: { id: 'test-id' }, error: null });

      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'john@example.com');
      formData.append('phone', '123-456-7890');
      formData.append('company', 'Acme Corp');
      formData.append('message', 'This is a test message with sufficient length.');

      const result = await submitContact(initialContactState, formData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Thank you for your message! We\'ll get back to you soon.');
      expect(result.errors).toEqual({});
      expect(mockEmailsSend).toHaveBeenCalledTimes(1);
      expect(mockEmailsSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'noreply@example.com',
          to: 'test@example.com',
          subject: 'New Contact Form Submission from John Doe',
          replyTo: 'john@example.com',
        })
      );
    });
  });

  describe('P034-02: Invalid email returns validation error', () => {
    it('should return validation error for invalid email format', async () => {
      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'not-an-email');
      formData.append('message', 'This is a test message with sufficient length.');

      const result = await submitContact(initialContactState, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Please fix the errors below.');
      expect(result.errors).toHaveProperty('email');
      expect(result.errors.email).toContain('Invalid email address');
      expect(mockEmailsSend).not.toHaveBeenCalled();
    });
  });

  describe('P034-03: Missing required fields return validation error', () => {
    it('should return validation error for missing name', async () => {
      const formData = new FormData();
      formData.append('email', 'john@example.com');
      formData.append('message', 'This is a test message with sufficient length.');

      const result = await submitContact(initialContactState, formData);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveProperty('name');
      expect(mockEmailsSend).not.toHaveBeenCalled();
    });

    it('should return validation error for missing email', async () => {
      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('message', 'This is a test message with sufficient length.');

      const result = await submitContact(initialContactState, formData);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveProperty('email');
      expect(mockEmailsSend).not.toHaveBeenCalled();
    });

    it('should return validation error for missing message', async () => {
      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'john@example.com');

      const result = await submitContact(initialContactState, formData);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveProperty('message');
      expect(mockEmailsSend).not.toHaveBeenCalled();
    });

    it('should return validation error for name too short', async () => {
      const formData = new FormData();
      formData.append('name', 'A');
      formData.append('email', 'john@example.com');
      formData.append('message', 'This is a test message with sufficient length.');

      const result = await submitContact(initialContactState, formData);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveProperty('name');
      expect(result.errors.name).toContain('Name must be at least 2 characters');
      expect(mockEmailsSend).not.toHaveBeenCalled();
    });

    it('should return validation error for message too short', async () => {
      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'john@example.com');
      formData.append('message', 'short');

      const result = await submitContact(initialContactState, formData);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveProperty('message');
      expect(result.errors.message).toContain('Message must be at least 10 characters');
      expect(mockEmailsSend).not.toHaveBeenCalled();
    });
  });

  describe('P034-04: Resend failure returns error state', () => {
    it('should return error when Resend API fails', async () => {
      mockEmailsSend.mockRejectedValue(new Error('Resend API error'));

      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'john@example.com');
      formData.append('message', 'This is a test message with sufficient length.');

      const result = await submitContact(initialContactState, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to send message. Please try again later.');
      expect(result.errors).toEqual({});
      expect(mockEmailsSend).toHaveBeenCalledTimes(1);
    });
  });

  describe('Additional validation scenarios', () => {
    it('should handle optional fields (phone, company) when not provided', async () => {
      mockEmailsSend.mockResolvedValue({ data: { id: 'test-id' }, error: null });

      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'john@example.com');
      formData.append('message', 'This is a test message with sufficient length.');

      const result = await submitContact(initialContactState, formData);

      expect(result.success).toBe(true);
      expect(result.errors).toEqual({});
      expect(mockEmailsSend).toHaveBeenCalledTimes(1);
    });

    it('should return error when environment variables are missing', async () => {
      delete process.env.RESEND_API_KEY;

      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'john@example.com');
      formData.append('message', 'This is a test message with sufficient length.');

      const result = await submitContact(initialContactState, formData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Server configuration error. Please try again later.');
      expect(result.errors).toEqual({});
      expect(mockEmailsSend).not.toHaveBeenCalled();
    });
  });
});
