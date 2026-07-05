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

  it('renders content and title', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    vi.mocked(getBreadcrumbs).mockResolvedValue([]);

    render(
      await <ServiceDetail
        content="<p>Service content</p>"
        title="Website Design"
        slug="website-design"
      />
    );
    expect(screen.getByText('Website Design')).toBeInTheDocument();
    expect(screen.getByText('Service content')).toBeInTheDocument();
  });

  it('renders breadcrumbs', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    vi.mocked(getBreadcrumbs).mockResolvedValue([
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'Website Design', href: null },
    ]);

    render(
      await <ServiceDetail
        content="<p>Content</p>"
        title="Website Design"
        slug="website-design"
      />
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Website Design')).toBeInTheDocument();
  });

  it('calls getBreadcrumbs with correct slug', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    vi.mocked(getBreadcrumbs).mockResolvedValue([]);

    render(
      await <ServiceDetail
        content="<p>Content</p>"
        title="Website Design"
        slug="website-design"
      />
    );
    expect(getBreadcrumbs).toHaveBeenCalledWith('website-design');
  });

  it('renders breadcrumb navigation with correct structure', async () => {
    const { getBreadcrumbs } = await import('@/lib/navigation');
    vi.mocked(getBreadcrumbs).mockResolvedValue([
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
    ]);

    render(
      await <ServiceDetail
        content="<p>Content</p>"
        title="Website Design"
        slug="website-design"
      />
    );
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav).toBeInTheDocument();
  });
});
