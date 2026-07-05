import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ContactPage from './page';

// Mock the server action
vi.mock('@/app/actions/contact', () => ({
  submitContact: vi.fn(),
  initialContactState: {
    success: false,
    message: '',
    errors: {},
  },
}));

// Mock the SEO metadata generator
vi.mock('@/lib/seo', () => ({
  generateMetadata: vi.fn(() => ({
    title: 'Contact Us',
    description: 'Test description',
  })),
}));

describe('ContactPage', () => {
  it('renders the contact page with form', () => {
    render(<ContactPage />);

    expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    expect(
      screen.getByText(/Have a project in mind?/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('displays contact information', () => {
    render(<ContactPage />);

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('contact@yourdedicatedmarketer.com')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('+1 (555) 123-4567')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText(/Marketing St/)).toBeInTheDocument();
    expect(screen.getByText('Hours')).toBeInTheDocument();
  });

  it('renders required form fields with required attribute', () => {
    render(<ContactPage />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);

    expect(nameInput).toBeRequired();
    expect(emailInput).toBeRequired();
    expect(messageInput).toBeRequired();
  });

  it('renders optional fields without required attribute', () => {
    render(<ContactPage />);

    const phoneInput = screen.getByLabelText(/phone/i);
    const companyInput = screen.getByLabelText(/company/i);

    expect(phoneInput).not.toBeRequired();
    expect(companyInput).not.toBeRequired();
  });
});
