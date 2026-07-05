import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { IndustryDetail } from './industry-detail';

// Mock navigation utilities
vi.mock('@/lib/navigation', () => ({
  getBreadcrumbs: vi.fn(),
}));

// Mock content utilities
vi.mock('@/lib/content', () => ({
  getAllDemos: vi.fn(),
}));

// Mock ContentPage component
vi.mock('@/components/features/content-page', () => ({
  ContentPage: ({ title, content }: { title: string; content: string }) => (
    <div>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  ),
}));

describe('IndustryDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders content and title', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    const { getAllDemos } = await import('@/lib/content');
    vi.mocked(getBreadcrumbs).mockResolvedValue([]);
    vi.mocked(getAllDemos).mockResolvedValue([]);

    render(
      await <IndustryDetail
        content="<p>Industry content</p>"
        title="Retail"
        slug="retail"
      />
    );
    expect(screen.getByText('Retail')).toBeInTheDocument();
    expect(screen.getByText('Industry content')).toBeInTheDocument();
  });

  it('renders breadcrumbs', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    const { getAllDemos } = await import('@/lib/content');
    vi.mocked(getBreadcrumbs).mockResolvedValue([
      { label: 'Home', href: '/' },
      { label: 'Industries', href: '/industries' },
      { label: 'Retail', href: null },
    ]);
    vi.mocked(getAllDemos).mockResolvedValue([]);

    render(
      await <IndustryDetail
        content="<p>Content</p>"
        title="Retail"
        slug="retail"
      />
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Industries')).toBeInTheDocument();
    expect(screen.getByText('Retail')).toBeInTheDocument();
  });

  it('calls getBreadcrumbs with correct slug', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    const { getAllDemos } = await import('@/lib/content');
    vi.mocked(getBreadcrumbs).mockResolvedValue([]);
    vi.mocked(getAllDemos).mockResolvedValue([]);

    render(
      await <IndustryDetail
        content="<p>Content</p>"
        title="Retail"
        slug="retail"
      />
    );
    expect(getBreadcrumbs).toHaveBeenCalledWith('retail');
  });

  it('renders demo link when matching demo exists', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    const { getAllDemos } = await import('@/lib/content');
    vi.mocked(getBreadcrumbs).mockResolvedValue([]);
    vi.mocked(getAllDemos).mockResolvedValue([
      {
        data: {
          title: 'Retail Demo',
          slug: 'retail-demo',
          industry: 'retail',
        },
        content: '<p>Demo content</p>',
      },
    ]);

    render(
      await <IndustryDetail
        content="<p>Content</p>"
        title="Retail"
        slug="retail"
      />
    );
    expect(screen.getByText('See It in Action')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View Demo/i })).toBeInTheDocument();
  });

  it('does not render demo link when no matching demo', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    const { getAllDemos } = await import('@/lib/content');
    vi.mocked(getBreadcrumbs).mockResolvedValue([]);
    vi.mocked(getAllDemos).mockResolvedValue([
      {
        data: {
          title: 'Healthcare Demo',
          slug: 'healthcare-demo',
          industry: 'healthcare',
        },
        content: '<p>Demo content</p>',
      },
    ]);

    render(
      await <IndustryDetail
        content="<p>Content</p>"
        title="Retail"
        slug="retail"
      />
    );
    expect(screen.queryByText('See It in Action')).not.toBeInTheDocument();
  });

  it('demo link points to correct demo page', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    const { getAllDemos } = await import('@/lib/content');
    vi.mocked(getBreadcrumbs).mockResolvedValue([]);
    vi.mocked(getAllDemos).mockResolvedValue([
      {
        data: {
          title: 'Retail Demo',
          slug: 'retail-demo',
          industry: 'retail',
        },
        content: '<p>Demo content</p>',
      },
    ]);

    render(
      await <IndustryDetail
        content="<p>Content</p>"
        title="Retail"
        slug="retail"
      />
    );
    const demoLink = screen.getByRole('link', { name: /View Demo/i });
    expect(demoLink).toHaveAttribute('href', '/demos/retail-demo');
  });
});
