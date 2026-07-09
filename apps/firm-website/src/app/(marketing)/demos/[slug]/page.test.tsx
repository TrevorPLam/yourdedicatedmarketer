import { describe, it, expect, vi, beforeEach } from 'vitest';
import DemoPage, { generateStaticParams, generateMetadata } from './page';
import { getDemo, getAllSlugs } from '@/lib/content';
import { notFound } from 'next/navigation';

// Mock the content utilities
vi.mock('@/lib/content', () => ({
  getDemo: vi.fn(),
  getAllSlugs: vi.fn(),
}));

// Mock the SEO utility
vi.mock('@/lib/seo', () => ({
  generateMetadata: vi.fn(({ title, description, path }) => ({
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://yourdedicatedmarketer.com${path}`,
    },
  })),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

describe('DemoPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateStaticParams', () => {
    it('should generate static params for all demo slugs', async () => {
      const mockSlugs = ['plumbing', 'dental', 'law-firm'];
      vi.mocked(getAllSlugs).mockResolvedValue(mockSlugs);

      const params = await generateStaticParams();

      expect(params).toEqual([
        { slug: 'plumbing' },
        { slug: 'dental' },
        { slug: 'law-firm' },
      ]);
      expect(getAllSlugs).toHaveBeenCalledWith('demos');
    });
  });

  describe('generateMetadata', () => {
    it('should generate metadata for existing demo', async () => {
      const mockDemo = {
        data: {
          title: 'Plumbing Business Website',
          slug: 'plumbing',
          description: 'A mobile-first website for a DFW plumbing business optimized for emergency searches',
        },
        content: '<p>Test content</p>',
      };
      vi.mocked(getDemo).mockResolvedValue(mockDemo);

      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: 'plumbing' }),
      });

      expect(metadata).toEqual(
        expect.objectContaining({
          title: 'Plumbing Business Website',
          description: 'A mobile-first website for a DFW plumbing business optimized for emergency searches',
        })
      );
      expect(getDemo).toHaveBeenCalledWith('plumbing');
    });

    it('should generate fallback metadata for non-existent demo', async () => {
      vi.mocked(getDemo).mockResolvedValue(null);

      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: 'non-existent' }),
      });

      expect(metadata).toEqual(
        expect.objectContaining({
          title: 'Demo Not Found',
          description: 'The requested demo could not be found.',
        })
      );
    });
  });

  describe('default export (page component)', () => {
    it('should render demo detail when demo exists', async () => {
      const mockDemo = {
        data: {
          title: 'Plumbing Business Website',
          slug: 'plumbing',
          industry: 'home-services',
          description: 'A plumbing business website',
        },
        content: '<p>Demo content</p>',
      };
      vi.mocked(getDemo).mockResolvedValue(mockDemo);

      // Note: In Next.js 15, we need to await the params promise
      const rendered = await DemoPage({
        params: Promise.resolve({ slug: 'plumbing' }),
      });

      expect(rendered).toBeTruthy();
      expect(getDemo).toHaveBeenCalledWith('plumbing');
    });

    it('should call notFound when demo does not exist', async () => {
      vi.mocked(getDemo).mockResolvedValue(null);

      await expect(
        DemoPage({
          params: Promise.resolve({ slug: 'non-existent' }),
        })
      ).rejects.toThrow('NEXT_NOT_FOUND');

      expect(getDemo).toHaveBeenCalledWith('non-existent');
      expect(notFound).toHaveBeenCalled();
    });
  });
});
