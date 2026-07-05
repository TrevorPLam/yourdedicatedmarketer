import { describe, it, expect } from 'vitest';
import { getNavItems, getBreadcrumbs, getRelatedContent } from './navigation';

describe('Navigation Utilities', () => {
  describe('getNavItems', () => {
    it('should return an array of navigation items', async () => {
      const navItems = await getNavItems();
      
      expect(Array.isArray(navItems)).toBe(true);
      expect(navItems.length).toBeGreaterThan(0);
    });

    it('should return navigation items with label and href', async () => {
      const navItems = await getNavItems();
      
      navItems.forEach((item) => {
        expect(item).toHaveProperty('label');
        expect(item).toHaveProperty('href');
        expect(typeof item.label).toBe('string');
        expect(typeof item.href).toBe('string');
      });
    });

    it('should include all primary navigation items', async () => {
      const navItems = await getNavItems();
      const labels = navItems.map((item) => item.label);
      
      expect(labels).toContain('Home');
      expect(labels).toContain('Services');
      expect(labels).toContain('Industries');
      expect(labels).toContain('Demos');
      expect(labels).toContain('Pricing');
      expect(labels).toContain('About');
      expect(labels).toContain('Contact');
    });

    it('should have correct href paths', async () => {
      const navItems = await getNavItems();
      
      const homeItem = navItems.find((item) => item.label === 'Home');
      expect(homeItem).toBeDefined();
      expect(homeItem?.href).toBe('/');
      
      const servicesItem = navItems.find((item) => item.label === 'Services');
      expect(servicesItem).toBeDefined();
      expect(servicesItem?.href).toBe('/services');
    });
  });

  describe('getBreadcrumbs', () => {
    it('should return an array of breadcrumb items', async () => {
      const breadcrumbs = await getBreadcrumbs('about');
      
      expect(Array.isArray(breadcrumbs)).toBe(true);
      expect(breadcrumbs.length).toBeGreaterThan(0);
    });

    it('should always include Home as first breadcrumb', async () => {
      const breadcrumbs = await getBreadcrumbs('about');
      
      expect(breadcrumbs[0]?.label).toBe('Home');
      expect(breadcrumbs[0]?.href).toBe('/');
    });

    it('should return correct breadcrumbs for service pages', async () => {
      const breadcrumbs = await getBreadcrumbs('website-design');
      
      expect(breadcrumbs.length).toBeGreaterThanOrEqual(2);
      expect(breadcrumbs[1]?.label).toBe('Services');
      expect(breadcrumbs[1]?.href).toBe('/services');
    });

    it('should return correct breadcrumbs for industry pages', async () => {
      const breadcrumbs = await getBreadcrumbs('home-services');
      
      expect(breadcrumbs.length).toBeGreaterThanOrEqual(2);
      expect(breadcrumbs[1]?.label).toBe('Industries');
      expect(breadcrumbs[1]?.href).toBe('/industries');
    });

    it('should return correct breadcrumbs for demo pages', async () => {
      const breadcrumbs = await getBreadcrumbs('plumbing');
      
      expect(breadcrumbs.length).toBeGreaterThanOrEqual(2);
      expect(breadcrumbs[1]?.label).toBe('Demos');
      expect(breadcrumbs[1]?.href).toBe('/demos');
    });

    it('should return correct breadcrumbs for static pages', async () => {
      const aboutBreadcrumbs = await getBreadcrumbs('about');
      expect(aboutBreadcrumbs.length).toBe(2);
      expect(aboutBreadcrumbs[1]?.label).toBe('About');
      expect(aboutBreadcrumbs[1]?.href).toBe(null);

      const pricingBreadcrumbs = await getBreadcrumbs('pricing');
      expect(pricingBreadcrumbs.length).toBe(2);
      expect(pricingBreadcrumbs[1]?.label).toBe('Pricing');
    });

    it('should return only Home for unknown slugs', async () => {
      const breadcrumbs = await getBreadcrumbs('unknown-page');
      
      expect(breadcrumbs.length).toBe(1);
      expect(breadcrumbs[0]?.label).toBe('Home');
    });

    it('should set href to null for current page', async () => {
      const breadcrumbs = await getBreadcrumbs('about');
      
      const currentPage = breadcrumbs[breadcrumbs.length - 1];
      expect(currentPage?.href).toBe(null);
    });
  });

  describe('getRelatedContent', () => {
    it('should return an array of related content items', async () => {
      const related = await getRelatedContent('plumbing', 'demo');
      
      expect(Array.isArray(related)).toBe(true);
    });

    it('should return related demos in the same industry', async () => {
      const related = await getRelatedContent('plumbing', 'demo');
      
      related.forEach((item) => {
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('slug');
        expect(item).toHaveProperty('type');
        expect(item.type).toBe('demo');
      });
    });

    it('should return related industries', async () => {
      const related = await getRelatedContent('home-services', 'industry');
      
      related.forEach((item) => {
        expect(item.type).toBe('industry');
        expect(item.slug).not.toBe('home-services');
      });
    });

    it('should return related services', async () => {
      const related = await getRelatedContent('website-design', 'service');
      
      related.forEach((item) => {
        expect(item.type).toBe('service');
        expect(item.slug).not.toBe('website-design');
      });
    });

    it('should return related FAQs in the same category', async () => {
      const related = await getRelatedContent('cost', 'faq');
      
      related.forEach((item) => {
        expect(item.type).toBe('faq');
        expect(item.slug).not.toBe('cost');
      });
    });

    it('should limit related content to 3 items', async () => {
      const related = await getRelatedContent('home-services', 'industry');
      
      expect(related.length).toBeLessThanOrEqual(3);
    });

    it('should return empty array for non-existent content', async () => {
      const related = await getRelatedContent('non-existent', 'service');
      
      expect(related).toEqual([]);
    });

    it('should return empty array for unknown type', async () => {
      const related = await getRelatedContent('website-design', 'unknown' as 'service' | 'industry' | 'demo' | 'faq');
      
      expect(related).toEqual([]);
    });
  });
});
