import { describe, it, expect } from 'vitest';
import { getAllContent, getAllSlugs, getContentBySlug } from './content';

describe('Content Utilities - Integration Tests with Real File System', () => {

  describe('getAllContent', () => {
    it('should return all service files', async () => {
      const services = await getAllContent('services');

      expect(Array.isArray(services)).toBe(true);
      expect(services.length).toBeGreaterThan(0);
      
      // Verify each service has required metadata
      services.forEach((service) => {
        expect(service.data).toBeDefined();
        expect(typeof (service.data as { title: string }).title).toBe('string');
        expect(typeof (service.data as { slug: string }).slug).toBe('string');
        expect(service.content).toBeDefined();
        expect(typeof service.content).toBe('string');
      });
    });

    it('should return all industry files', async () => {
      const industries = await getAllContent('industries');

      expect(Array.isArray(industries)).toBe(true);
      expect(industries.length).toBeGreaterThan(0);
      
      industries.forEach((industry) => {
        expect(industry.data).toBeDefined();
        expect(typeof (industry.data as { title: string }).title).toBe('string');
        expect(typeof (industry.data as { slug: string }).slug).toBe('string');
        expect(industry.content).toBeDefined();
      });
    });

    it('should return all demo files', async () => {
      const demos = await getAllContent('demos');

      expect(Array.isArray(demos)).toBe(true);
      expect(demos.length).toBeGreaterThan(0);
      
      demos.forEach((demo) => {
        expect(demo.data).toBeDefined();
        expect(typeof (demo.data as { title: string }).title).toBe('string');
        expect(typeof (demo.data as { slug: string }).slug).toBe('string');
        expect(demo.content).toBeDefined();
      });
    });

    it('should return empty array for non-existent directory', async () => {
      const content = await getAllContent('non-existent-directory');
      
      expect(Array.isArray(content)).toBe(true);
      expect(content).toEqual([]);
    });
  });

  describe('getContentBySlug', () => {
    it('should return correct data for services/website-design', async () => {
      const content = await getContentBySlug('services', 'website-design');

      expect(content).not.toBeNull();
      expect((content?.data as { title: string }).title).toBe('Website Design & Development');
      expect((content?.data as { slug: string }).slug).toBe('website-design');
      expect((content?.data as { description: string }).description).toBeDefined();
      expect(typeof (content?.data as { description: string }).description).toBe('string');
      expect(content?.content).toBeDefined();
      expect(typeof content?.content).toBe('string');
      
      // Verify content is HTML (processed by remark)
      expect(content?.content).toContain('<');
      expect(content?.content).toContain('>');
    });

    it('should return correct data for industries/medical', async () => {
      const content = await getContentBySlug('industries', 'medical');

      expect(content).not.toBeNull();
      expect((content?.data as { title: string }).title).toBe('Medical & Wellness Clinics');
      expect((content?.data as { slug: string }).slug).toBe('medical');
      expect((content?.data as { icon: string }).icon).toBe('🏥');
      expect(content?.content).toBeDefined();
      expect(typeof content?.content).toBe('string');
    });

    it('should return null for non-existent slug', async () => {
      const content = await getContentBySlug('services', 'non-existent-slug');
      
      expect(content).toBeNull();
    });

    it('should return null for non-existent directory', async () => {
      const content = await getContentBySlug('non-existent-dir', 'some-slug');
      
      expect(content).toBeNull();
    });
  });

  describe('getAllSlugs', () => {
    it('should return all industry slugs', async () => {
      const slugs = await getAllSlugs('industries');

      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs.length).toBeGreaterThan(0);
      
      // Verify expected slugs exist
      expect(slugs).toContain('medical');
      expect(slugs).toContain('retail');
      expect(slugs).toContain('restaurants');
      
      // Verify all slugs are strings
      slugs.forEach((slug) => {
        expect(typeof slug).toBe('string');
        expect(slug).not.toContain('.mdx');
      });
    });

    it('should return all service slugs', async () => {
      const slugs = await getAllSlugs('services');

      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs.length).toBeGreaterThan(0);
      
      // Verify expected slugs exist
      expect(slugs).toContain('website-design');
      expect(slugs).toContain('local-seo');
      expect(slugs).toContain('paid-ads');
    });

    it('should return all demo slugs', async () => {
      const slugs = await getAllSlugs('demos');

      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs.length).toBeGreaterThan(0);
      
      // Verify expected slugs exist
      expect(slugs).toContain('dental');
      expect(slugs).toContain('law-firm');
      expect(slugs).toContain('restaurant');
    });

    it('should return empty array for non-existent directory', async () => {
      const slugs = await getAllSlugs('non-existent-directory');
      
      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs).toEqual([]);
    });
  });

  describe('metadata parsing', () => {
    it('should parse title, slug, and description correctly', async () => {
      const content = await getContentBySlug('services', 'website-design');

      expect((content?.data as { title: string }).title).toBe('Website Design & Development');
      expect((content?.data as { slug: string }).slug).toBe('website-design');
      expect((content?.data as { description: string }).description).toBe('Professional website design services that create stunning, user-friendly experiences tailored to your business needs. Fast turnaround with AI-assisted build process.');
    });

    it('should parse additional metadata fields', async () => {
      const content = await getContentBySlug('services', 'website-design');

      expect((content?.data as { featured: boolean }).featured).toBe(true);
      expect((content?.data as { order: number }).order).toBe(1);
    });

    it('should parse icon field for industries', async () => {
      const content = await getContentBySlug('industries', 'medical');

      expect((content?.data as { icon: string }).icon).toBe('🏥');
      expect((content?.data as { order: number }).order).toBe(2);
    });

    it('should handle MDX content conversion to HTML', async () => {
      const content = await getContentBySlug('services', 'website-design');

      expect(content?.content).toBeDefined();
      expect(typeof content?.content).toBe('string');
      
      // Verify markdown was converted to HTML
      expect(content?.content).toContain('<h1>');
      expect(content?.content).toContain('<h2>');
      expect(content?.content).toContain('<p>');
      expect(content?.content).toContain('<li>');
      
      // Verify markdown-specific elements were converted
      expect(content?.content).toContain('<strong>');
    });
  });

  describe('caching behavior', () => {
    it('should return consistent data for repeated calls', async () => {
      const slug = 'website-design';
      
      // First call
      const firstCall = await getContentBySlug('services', slug);
      expect(firstCall).not.toBeNull();
      
      // Second call - should return same data (cached or fresh read)
      const secondCall = await getContentBySlug('services', slug);
      expect(secondCall).not.toBeNull();
      
      // Both calls should return identical data
      expect(firstCall).toEqual(secondCall);
    });
  });
});
