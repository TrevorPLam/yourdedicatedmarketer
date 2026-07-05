/* eslint-disable no-undef */
import { describe, it, expect } from 'vitest';
import { getAllContent, getAllSlugs, getContentBySlug } from './content';
import type { Service } from '../types/content';

describe('Content Utilities', () => {
  describe('getAllSlugs', () => {
    it('should return an array of slugs from the services directory', async () => {
      const slugs = await getAllSlugs('services');
      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs).toContain('website-design');
    });

    it('should return empty array for non-existent directory', async () => {
      const slugs = await getAllSlugs('non-existent');
      expect(slugs).toEqual([]);
    });
  });

  describe('getContentBySlug', () => {
    it('should return content data for a valid slug', async () => {
      const content = await getContentBySlug<Service>('services', 'website-design');
      
      expect(content).not.toBeNull();
      expect(content?.data).toBeDefined();
      expect(content?.data.title).toBe('Website Design');
      expect(content?.data.slug).toBe('website-design');
      expect(content?.data.description).toBeDefined();
      expect(content?.content).toBeDefined();
      expect(typeof content?.content).toBe('string');
    });

    it('should return null for non-existent slug', async () => {
      const content = await getContentBySlug<Service>('services', 'non-existent');
      expect(content).toBeNull();
    });
  });

  describe('getAllContent', () => {
    it('should return an array of all content items from services directory', async () => {
      const contents = await getAllContent<Service>('services');
      
      expect(Array.isArray(contents)).toBe(true);
      expect(contents.length).toBeGreaterThan(0);
      
      const websiteDesign = contents.find(item => item.data.slug === 'website-design');
      expect(websiteDesign).toBeDefined();
      expect(websiteDesign?.data.title).toBe('Website Design');
    });

    it('should return empty array for non-existent directory', async () => {
      const contents = await getAllContent<Service>('non-existent');
      expect(contents).toEqual([]);
    });

    it('should filter out null items', async () => {
      const contents = await getAllContent<Service>('services');
      expect(contents.every(item => item !== null)).toBe(true);
    });
  });
});
