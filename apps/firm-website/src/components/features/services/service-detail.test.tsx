import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ServiceDetail } from './service-detail';

// Mock navigation utilities
vi.mock('@/lib/navigation', () => ({
  getBreadcrumbs: vi.fn(),
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

describe('ServiceDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls getBreadcrumbs with correct slug', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    vi.mocked(getBreadcrumbs).mockResolvedValue([]);

    const element = await ServiceDetail({
      content: '<p>Content</p>',
      title: 'Website Design',
      slug: 'website-design',
    });

    render(element);
    expect(getBreadcrumbs).toHaveBeenCalledWith('website-design');
  });

  it('renders content and title when breadcrumbs are empty', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    vi.mocked(getBreadcrumbs).mockResolvedValue([]);

    const element = await ServiceDetail({
      content: '<p>Service content</p>',
      title: 'Website Design',
      slug: 'website-design',
    });

    render(element);
    expect(screen.getByText('Website Design')).toBeInTheDocument();
    expect(screen.getByText('Service content')).toBeInTheDocument();
  });

  it('renders breadcrumbs when provided', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    vi.mocked(getBreadcrumbs).mockResolvedValue([
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'Website Design', href: null },
    ]);

    const element = await ServiceDetail({
      content: '<p>Content</p>',
      title: 'Website Design',
      slug: 'website-design',
    });

    render(element);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    // Title is tested separately in the content/title test
  });

  it('renders breadcrumb navigation with correct structure', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    vi.mocked(getBreadcrumbs).mockResolvedValue([
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
    ]);

    const element = await ServiceDetail({
      content: '<p>Content</p>',
      title: 'Website Design',
      slug: 'website-design',
    });

    render(element);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav).toBeInTheDocument();
  });
});
