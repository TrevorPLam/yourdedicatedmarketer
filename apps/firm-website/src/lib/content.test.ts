import { describe, it, expect } from 'vitest';
import { getAllContent, getAllSlugs, getContentBySlug } from './content';

describe('Content Utilities', () => {
  describe('getAllSlugs', () => {
    it('should return an array of slugs from the pages directory', async () => {
      const slugs = await getAllSlugs('pages');
      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs).toContain('sample');
    });

    it('should return empty array for non-existent directory', async () => {
      const slugs = await getAllSlugs('non-existent');
      expect(slugs).toEqual([]);
    });
  });

  describe('getContentBySlug', () => {
    it('should return content data for a valid slug', async () => {
      const content = await getContentBySlug<{ title: string; slug: string }>('pages', 'sample');
      
      expect(content).not.toBeNull();
      expect(content?.data).toBeDefined();
      expect(content?.data.title).toBe('Sample MDX Page');
      expect(content?.data.slug).toBe('sample-mdx');
      expect(content?.content).toBeDefined();
      expect(typeof content?.content).toBe('string');
    });

    it('should return null for non-existent slug', async () => {
      const content = await getContentBySlug<{ title: string }>('pages', 'non-existent');
      expect(content).toBeNull();
    });

    it('should cache content to avoid repeated file reads', async () => {
      // First call - reads from file
      const firstCall = await getContentBySlug<{ title: string; slug: string }>('pages', 'sample');
      expect(firstCall).not.toBeNull();

      // Second call - should use cache
      const secondCall = await getContentBySlug<{ title: string; slug: string }>('pages', 'sample');
      expect(secondCall).not.toBeNull();

      // Both calls should return the same data
      expect(firstCall?.data.title).toBe(secondCall?.data.title);
      expect(firstCall?.content).toBe(secondCall?.content);
    });
  });

  describe('getAllContent', () => {
    it('should return an array of all content items from pages directory', async () => {
      const contents = await getAllContent<{ title: string; slug: string }>('pages');
      
      expect(Array.isArray(contents)).toBe(true);
      expect(contents.length).toBeGreaterThan(0);
      
      const samplePage = contents.find(item => item.data.slug === 'sample-mdx');
      expect(samplePage).toBeDefined();
      expect(samplePage?.data.title).toBe('Sample MDX Page');
    });

    it('should return empty array for non-existent directory', async () => {
      const contents = await getAllContent<{ title: string }>('non-existent');
      expect(contents).toEqual([]);
    });

    it('should filter out null items', async () => {
      const contents = await getAllContent<{ title: string }>('pages');
      expect(contents.every(item => item !== null)).toBe(true);
    });
  });
});
