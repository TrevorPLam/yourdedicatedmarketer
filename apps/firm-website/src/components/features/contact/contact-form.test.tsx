import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ContactForm } from './contact-form';

// Mock server action
vi.mock('@/app/actions/contact', () => ({
  submitContact: vi.fn(),
  initialContactState: {
    success: false,
    message: '',
    errors: {},
  },
}));

// Mock GA4
vi.mock('@/lib/gtag', () => ({
  event: vi.fn(),
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<ContactForm />);
    const submitButton = screen.getByRole('button', { name: /Send Message/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('marks required fields with asterisk', () => {
    render(<ContactForm />);
    expect(screen.getByText('Name *')).toBeInTheDocument();
    expect(screen.getByText('Email *')).toBeInTheDocument();
    expect(screen.getByText('Message *')).toBeInTheDocument();
  });

  it('phone and company fields are optional', () => {
    render(<ContactForm />);
    expect(screen.getByText('Phone (Optional)')).toBeInTheDocument();
    expect(screen.getByText('Company (Optional)')).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    const { submitContact } = await import('@/app/actions/contact');
    vi.mocked(submitContact).mockResolvedValue({
      success: false,
      message: 'Invalid email',
      errors: { email: ['Invalid email format'] },
    });

    render(<ContactForm />);
    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Send Message/i });

    await userEvent.type(emailInput, 'invalid-email');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitContact).toHaveBeenCalled();
    });
  });

  it('shows validation error for missing required field', async () => {
    const { submitContact } = await import('@/app/actions/contact');
    vi.mocked(submitContact).mockResolvedValue({
      success: false,
      message: 'Name is required',
      errors: { name: ['Name is required'] },
    });

    render(<ContactForm />);
    const submitButton = screen.getByRole('button', { name: /Send Message/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitContact).toHaveBeenCalled();
    });
  });

  it('shows success state on successful submission', async () => {
    const { submitContact } = await import('@/app/actions/contact');
    vi.mocked(submitContact).mockResolvedValue({
      success: true,
      message: 'Message sent successfully!',
      errors: {},
    });

    render(<ContactForm />);
    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const messageInput = screen.getByLabelText(/Message/i);
    const submitButton = screen.getByRole('button', { name: /Send Message/i });

    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(messageInput, 'Test message');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitContact).toHaveBeenCalled();
    });
  });

  it('shows error state on server error', async () => {
    const { submitContact } = await import('@/app/actions/contact');
    vi.mocked(submitContact).mockResolvedValue({
      success: false,
      message: 'Server error',
      errors: {},
    });

    render(<ContactForm />);
    const submitButton = screen.getByRole('button', { name: /Send Message/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitContact).toHaveBeenCalled();
    });
  });

  it('shows loading state during submission', async () => {
    const { submitContact } = await import('@/app/actions/contact');
    let resolveSubmit: (value: { success: boolean; message: string; errors: Record<string, string[]> }) => void;
    vi.mocked(submitContact).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSubmit = resolve;
        })
    );

    render(<ContactForm />);
    const submitButton = screen.getByRole('button', { name: /Send Message/i });

    fireEvent.click(submitButton);

    expect(screen.getByText('Sending...')).toBeInTheDocument();

    resolveSubmit!({ success: true, message: '', errors: {} });

    await waitFor(() => {
      expect(screen.getByText('Send Message')).toBeInTheDocument();
    });
  });

  it('disables submit button during loading', async () => {
    const { submitContact } = await import('@/app/actions/contact');
    let resolveSubmit: (value: { success: boolean; message: string; errors: Record<string, string[]> }) => void;
    vi.mocked(submitContact).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSubmit = resolve;
        })
    );

    render(<ContactForm />);
    const submitButton = screen.getByRole('button', { name: /Send Message/i });

    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();

    resolveSubmit!({ success: true, message: '', errors: {} });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
