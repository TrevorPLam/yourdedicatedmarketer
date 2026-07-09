import { describe, it, expect, vi, beforeEach } from 'vitest';
import IndustryPage, { generateStaticParams, generateMetadata } from './page';
import { getIndustry, getAllSlugs } from '@/lib/content';
import { notFound } from 'next/navigation';

// Mock the content utilities
vi.mock('@/lib/content', () => ({
  getIndustry: vi.fn(),
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

describe('IndustryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateStaticParams', () => {
    it('should generate static params for all industry slugs', async () => {
      const mockSlugs = ['home-services', 'medical', 'retail'];
      vi.mocked(getAllSlugs).mockResolvedValue(mockSlugs);

      const params = await generateStaticParams();

      expect(params).toEqual([
        { slug: 'home-services' },
        { slug: 'medical' },
        { slug: 'retail' },
      ]);
      expect(getAllSlugs).toHaveBeenCalledWith('industries');
    });
  });

  describe('generateMetadata', () => {
    it('should generate metadata for existing industry', async () => {
      const mockIndustry = {
        data: {
          title: 'Home Services',
          slug: 'home-services',
          description: 'Professional website design for home service businesses',
        },
        content: '<p>Test content</p>',
      };
      vi.mocked(getIndustry).mockResolvedValue(mockIndustry);

      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: 'home-services' }),
      });

      expect(metadata).toEqual(
        expect.objectContaining({
          title: 'Home Services',
          description: 'Professional website design for home service businesses',
        })
      );
      expect(getIndustry).toHaveBeenCalledWith('home-services');
    });

    it('should generate fallback metadata for non-existent industry', async () => {
      vi.mocked(getIndustry).mockResolvedValue(null);

      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: 'non-existent' }),
      });

      expect(metadata).toEqual(
        expect.objectContaining({
          title: 'Industry Not Found',
          description: 'The requested industry could not be found.',
        })
      );
    });
  });

  describe('default export (page component)', () => {
    it('should render industry detail when industry exists', async () => {
      const mockIndustry = {
        data: {
          title: 'Home Services',
          slug: 'home-services',
          description: 'Test description',
        },
        content: '<p>Industry content</p>',
      };
      vi.mocked(getIndustry).mockResolvedValue(mockIndustry);

      // Note: In Next.js 15, we need to await the params promise
      const rendered = await IndustryPage({
        params: Promise.resolve({ slug: 'home-services' }),
      });

      expect(rendered).toBeTruthy();
      expect(getIndustry).toHaveBeenCalledWith('home-services');
    });

    it('should call notFound when industry does not exist', async () => {
      vi.mocked(getIndustry).mockResolvedValue(null);

      await expect(
        IndustryPage({
          params: Promise.resolve({ slug: 'non-existent' }),
        })
      ).rejects.toThrow('NEXT_NOT_FOUND');

      expect(getIndustry).toHaveBeenCalledWith('non-existent');
      expect(notFound).toHaveBeenCalled();
    });
  });
});
