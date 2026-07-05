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

  it('calls getBreadcrumbs with correct slug', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    const { getAllIndustries } = await import('@/lib/content');
    vi.mocked(getBreadcrumbs).mockResolvedValue([]);
    vi.mocked(getAllIndustries).mockResolvedValue([]);

    const element = await DemoDetail({
      content: '<p>Content</p>',
      title: 'Retail Demo',
      slug: 'retail-demo',
      industry: 'retail',
    });

    render(element);
    expect(getBreadcrumbs).toHaveBeenCalledWith('retail-demo');
  });

  it('renders content and title when breadcrumbs are empty', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    const { getAllIndustries } = await import('@/lib/content');
    vi.mocked(getBreadcrumbs).mockResolvedValue([]);
    vi.mocked(getAllIndustries).mockResolvedValue([]);

    const element = await DemoDetail({
      content: '<p>Demo content</p>',
      title: 'Retail Demo',
      slug: 'retail-demo',
      industry: 'retail',
    });

    render(element);
    expect(screen.getByText('Retail Demo')).toBeInTheDocument();
    expect(screen.getByText('Demo content')).toBeInTheDocument();
  });

  it('renders breadcrumbs when provided', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    const { getAllIndustries } = await import('@/lib/content');
    vi.mocked(getBreadcrumbs).mockResolvedValue([
      { label: 'Home', href: '/' },
      { label: 'Demos', href: '/demos' },
      { label: 'Retail Demo', href: null },
    ]);
    vi.mocked(getAllIndustries).mockResolvedValue([]);

    const element = await DemoDetail({
      content: '<p>Content</p>',
      title: 'Retail Demo',
      slug: 'retail-demo',
      industry: 'retail',
    });

    render(element);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Demos')).toBeInTheDocument();
    // Title is tested separately in the content/title test
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

    const element = await DemoDetail({
      content: '<p>Content</p>',
      title: 'Retail Demo',
      slug: 'retail-demo',
      industry: 'retail',
    });

    render(element);
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

    const element = await DemoDetail({
      content: '<p>Content</p>',
      title: 'Retail Demo',
      slug: 'retail-demo',
      industry: 'retail',
    });

    render(element);
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

    const element = await DemoDetail({
      content: '<p>Content</p>',
      title: 'Retail Demo',
      slug: 'retail-demo',
      industry: 'retail',
    });

    render(element);
    const industryLink = screen.getByRole('link', { name: /View Industry Page/i });
    expect(industryLink).toHaveAttribute('href', '/industries/retail');
  });

  it('renders View Live Demo placeholder', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    const { getAllIndustries } = await import('@/lib/content');
    vi.mocked(getBreadcrumbs).mockResolvedValue([]);
    vi.mocked(getAllIndustries).mockResolvedValue([]);

    const element = await DemoDetail({
      content: '<p>Content</p>',
      title: 'Retail Demo',
      slug: 'retail-demo',
      industry: 'retail',
    });

    render(element);
    expect(screen.getByText('View Live Demo')).toBeInTheDocument();
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
  });

  it('View Live Demo button is disabled', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    const { getAllIndustries } = await import('@/lib/content');
    vi.mocked(getBreadcrumbs).mockResolvedValue([]);
    vi.mocked(getAllIndustries).mockResolvedValue([]);

    const element = await DemoDetail({
      content: '<p>Content</p>',
      title: 'Retail Demo',
      slug: 'retail-demo',
      industry: 'retail',
    });

    render(element);
    const comingSoonButton = screen.getByRole('button', { name: /Coming Soon/i });
    expect(comingSoonButton).toBeDisabled();
  });
});
