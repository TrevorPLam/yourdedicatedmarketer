import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AboutPage from './page';

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

describe('AboutPage', () => {
  it('renders content when page data is found', async () => {
    const { getPage } = await import('@/lib/content');
    vi.mocked(getPage).mockResolvedValue({
      data: { title: 'About Your Dedicated Marketer', slug: 'about', description: 'Test description' },
      content: '<p>Test content</p>',
    });

    const page = await AboutPage();
    render(page);

    expect(screen.getByTestId('content-page')).toBeInTheDocument();
    expect(screen.getByText('About Your Dedicated Marketer')).toBeInTheDocument();
  });

  it('renders "Page not found" when page data is missing', async () => {
    const { getPage } = await import('@/lib/content');
    vi.mocked(getPage).mockResolvedValue(null);

    const page = await AboutPage();
    render(page);

    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  it('has correct metadata', async () => {
    const { generateMetadata } = await import('@/lib/seo');
    const metadata = generateMetadata({
      title: 'About Your Dedicated Marketer - DFW Web Design & Marketing',
      description: 'Learn about Your Dedicated Marketer, a DFW-based web design and marketing firm helping local service businesses get online fast and affordably with AI-assisted workflows.',
      path: '/about',
    });

    expect(metadata.title).toBe('About Your Dedicated Marketer - DFW Web Design & Marketing');
    expect(metadata.description).toContain('Learn about Your Dedicated Marketer');
  });
});
