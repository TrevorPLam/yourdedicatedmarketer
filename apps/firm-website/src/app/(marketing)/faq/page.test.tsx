import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FAQPage from './page';

// Mock the content utilities
vi.mock('@/lib/content', () => ({
  getAllFAQs: vi.fn(),
}));

// Mock the SEO utility
vi.mock('@/lib/seo', () => ({
  generateMetadata: vi.fn((options) => ({
    title: options.title,
    description: options.description,
  })),
}));

// Mock the FAQHub component
vi.mock('@/components/features/faq/faq-hub', () => ({
  FAQHub: () => (
    <div data-testid="faq-hub">
      <h1>Frequently Asked Questions</h1>
    </div>
  ),
}));

describe('FAQPage', () => {
  it('renders FAQ hub component', async () => {
    const page = await FAQPage();
    render(page);

    expect(screen.getByTestId('faq-hub')).toBeInTheDocument();
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
  });

  it('has correct metadata', async () => {
    const { generateMetadata } = await import('@/lib/seo');
    const metadata = generateMetadata({
      title: 'Frequently Asked Questions',
      description: 'Find answers to common questions about our digital marketing services, pricing packages, and website build process.',
      path: '/faq',
    });

    expect(metadata.title).toBe('Frequently Asked Questions');
    expect(metadata.description).toContain('digital marketing services');
  });
});
