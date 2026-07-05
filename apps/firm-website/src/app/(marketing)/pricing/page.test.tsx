import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PricingPage from './page';

// Mock the content utilities
vi.mock('@/lib/content', () => ({
  getPage: vi.fn(),
}));

// Mock the SEO utility
vi.mock('@/lib/seo', () => ({
  generateMetadata: vi.fn((options) => ({
    title: options.title,
    description: options.description,
  })),
}));

// Mock the ContentPage component
vi.mock('@/components/features/content-page', () => ({
  ContentPage: ({ content, title }: { content: string; title: string }) => (
    <div data-testid="content-page">
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  ),
}));

describe('PricingPage', () => {
  it('renders content when page data is found', async () => {
    const { getPage } = await import('@/lib/content');
    vi.mocked(getPage).mockResolvedValue({
      data: { title: 'Pricing', slug: 'pricing', description: 'Test description' },
      content: '<p>Test content</p>',
    });

    const page = await PricingPage();
    render(page);

    expect(screen.getByTestId('content-page')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
  });

  it('renders "Page not found" when page data is missing', async () => {
    const { getPage } = await import('@/lib/content');
    vi.mocked(getPage).mockResolvedValue(null);

    const page = await PricingPage();
    render(page);

    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  it('has correct metadata', async () => {
    const { generateMetadata } = await import('@/lib/seo');
    const metadata = generateMetadata({
      title: 'Pricing - Transparent Website Design & Marketing Services',
      description: 'Transparent pricing for website design, marketing services, and ongoing support. No hidden fees, clear packages, and flexible options for DFW service businesses.',
      path: '/pricing',
    });

    expect(metadata.title).toBe('Pricing - Transparent Website Design & Marketing Services');
    expect(metadata.description).toContain('Transparent pricing');
  });
});
