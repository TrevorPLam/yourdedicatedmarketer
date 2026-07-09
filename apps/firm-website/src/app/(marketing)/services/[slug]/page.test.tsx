import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import ServicePage from './page';

// Mock the dependencies
vi.mock('@/components/features/services/service-detail', () => ({
  ServiceDetail: ({ content, title, slug }: { content: string; title: string; slug: string }) => (
    <div data-testid="service-detail">
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <span data-testid="slug">{slug}</span>
    </div>
  ),
}));

vi.mock('@/lib/content', () => ({
  getService: vi.fn(),
  getAllSlugs: vi.fn(),
}));

vi.mock('@/lib/seo', () => ({
  generateMetadata: vi.fn(() => ({
    title: 'Test Service',
    description: 'Test description',
  })),
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NOT_FOUND');
  }),
}));

describe('ServicePage', () => {
  it('should render service detail when service exists', async () => {
    const { getService } = await import('@/lib/content');
    vi.mocked(getService).mockResolvedValue({
      data: {
        title: 'Website Design',
        slug: 'website-design',
        description: 'Professional website design services',
      },
      content: '<p>Test content</p>',
    });

    const params = Promise.resolve({ slug: 'website-design' });
    const page = await ServicePage({ params });
    const { container } = render(page);

    expect(container.querySelector('[data-testid="service-detail"]')).toBeInTheDocument();
  });

  it('should call notFound when service does not exist', async () => {
    const { getService } = await import('@/lib/content');
    
    vi.mocked(getService).mockResolvedValue(null);
    
    const params = Promise.resolve({ slug: 'non-existent' });
    
    await expect(ServicePage({ params })).rejects.toThrow('NOT_FOUND');
  });
});
