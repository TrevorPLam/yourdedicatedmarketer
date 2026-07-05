import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { DemoDetail } from './demo-detail';

// Mock navigation utilities
vi.mock('@/lib/navigation', () => ({
  getBreadcrumbs: vi.fn(),
}));

// Mock content utilities
vi.mock('@/lib/content', () => ({
  getAllIndustries: vi.fn(),
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

describe('DemoDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders content and title', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    const { getAllIndustries } = await import('@/lib/content');
    vi.mocked(getBreadcrumbs).mockResolvedValue([]);
    vi.mocked(getAllIndustries).mockResolvedValue([]);

    render(
      await <DemoDetail
        content="<p>Demo content</p>"
        title="Retail Demo"
        slug="retail-demo"
        industry="retail"
      />
    );
    expect(screen.getByText('Retail Demo')).toBeInTheDocument();
    expect(screen.getByText('Demo content')).toBeInTheDocument();
  });

  it('renders breadcrumbs', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    const { getAllIndustries } = await import('@/lib/content');
    vi.mocked(getBreadcrumbs).mockResolvedValue([
      { label: 'Home', href: '/' },
      { label: 'Demos', href: '/demos' },
      { label: 'Retail Demo', href: null },
    ]);
    vi.mocked(getAllIndustries).mockResolvedValue([]);

    render(
      await <DemoDetail
        content="<p>Content</p>"
        title="Retail Demo"
        slug="retail-demo"
        industry="retail"
      />
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Demos')).toBeInTheDocument();
    expect(screen.getByText('Retail Demo')).toBeInTheDocument();
  });

  it('calls getBreadcrumbs with correct slug', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    const { getAllIndustries } = await import('@/lib/content');
    vi.mocked(getBreadcrumbs).mockResolvedValue([]);
    vi.mocked(getAllIndustries).mockResolvedValue([]);

    render(
      await <DemoDetail
        content="<p>Content</p>"
        title="Retail Demo"
        slug="retail-demo"
        industry="retail"
      />
    );
    expect(getBreadcrumbs).toHaveBeenCalledWith('retail-demo');
  });

  it('renders industry link when matching industry exists', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    const { getAllIndustries } = await import('@/lib/content');
    vi.mocked(getBreadcrumbs).mockResolvedValue([]);
    vi.mocked(getAllIndustries).mockResolvedValue([
      {
        data: {
          title: 'Retail',
          slug: 'retail',
        },
        content: '<p>Industry content</p>',
      },
    ]);

    render(
      await <DemoDetail
        content="<p>Content</p>"
        title="Retail Demo"
        slug="retail-demo"
        industry="retail"
      />
    );
    expect(screen.getByText('Learn More About This Industry')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View Industry Page/i })).toBeInTheDocument();
  });

  it('does not render industry link when no matching industry', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    const { getAllIndustries } = await import('@/lib/content');
    vi.mocked(getBreadcrumbs).mockResolvedValue([]);
    vi.mocked(getAllIndustries).mockResolvedValue([
      {
        data: {
          title: 'Healthcare',
          slug: 'healthcare',
        },
        content: '<p>Industry content</p>',
      },
    ]);

    render(
      await <DemoDetail
        content="<p>Content</p>"
        title="Retail Demo"
        slug="retail-demo"
        industry="retail"
      />
    );
    expect(screen.queryByText('Learn More About This Industry')).not.toBeInTheDocument();
  });

  it('industry link points to correct industry page', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    const { getAllIndustries } = await import('@/lib/content');
    vi.mocked(getBreadcrumbs).mockResolvedValue([]);
    vi.mocked(getAllIndustries).mockResolvedValue([
      {
        data: {
          title: 'Retail',
          slug: 'retail',
        },
        content: '<p>Industry content</p>',
      },
    ]);

    render(
      await <DemoDetail
        content="<p>Content</p>"
        title="Retail Demo"
        slug="retail-demo"
        industry="retail"
      />
    );
    const industryLink = screen.getByRole('link', { name: /View Industry Page/i });
    expect(industryLink).toHaveAttribute('href', '/industries/retail');
  });

  it('renders View Live Demo placeholder', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    const { getAllIndustries } = await import('@/lib/content');
    vi.mocked(getBreadcrumbs).mockResolvedValue([]);
    vi.mocked(getAllIndustries).mockResolvedValue([]);

    render(
      await <DemoDetail
        content="<p>Content</p>"
        title="Retail Demo"
        slug="retail-demo"
        industry="retail"
      />
    );
    expect(screen.getByText('View Live Demo')).toBeInTheDocument();
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
  });

  it('View Live Demo button is disabled', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    const { getAllIndustries } = await import('@/lib/content');
    vi.mocked(getBreadcrumbs).mockResolvedValue([]);
    vi.mocked(getAllIndustries).mockResolvedValue([]);

    render(
      await <DemoDetail
        content="<p>Content</p>"
        title="Retail Demo"
        slug="retail-demo"
        industry="retail"
      />
    );
    const comingSoonButton = screen.getByRole('button', { name: /Coming Soon/i });
    expect(comingSoonButton).toBeDisabled();
  });
});
