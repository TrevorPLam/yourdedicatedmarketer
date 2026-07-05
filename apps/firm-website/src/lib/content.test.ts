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

  describe('Service Content', () => {
    it('should return all service slugs', async () => {
      const slugs = await getAllSlugs('services');
      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs.length).toBe(6);
      expect(slugs).toContain('website-design');
      expect(slugs).toContain('local-seo');
      expect(slugs).toContain('paid-ads');
      expect(slugs).toContain('email-sms');
      expect(slugs).toContain('copywriting-branding');
      expect(slugs).toContain('hosting-care');
    });

    it('should return content for each service', async () => {
      const services = await getAllContent<{ title: string; slug: string; order: number }>('services');
      
      expect(services.length).toBe(6);
      
      const websiteDesign = services.find(item => item.data.slug === 'website-design');
      expect(websiteDesign).toBeDefined();
      expect(websiteDesign?.data.title).toBe('Website Design & Development');
      expect(websiteDesign?.data.order).toBe(1);

      const localSeo = services.find(item => item.data.slug === 'local-seo');
      expect(localSeo).toBeDefined();
      expect(localSeo?.data.title).toBe('Local SEO Services');
      expect(localSeo?.data.order).toBe(2);

      const paidAds = services.find(item => item.data.slug === 'paid-ads');
      expect(paidAds).toBeDefined();
      expect(paidAds?.data.title).toBe('Paid Ads Management');
      expect(paidAds?.data.order).toBe(3);

      const emailSms = services.find(item => item.data.slug === 'email-sms');
      expect(emailSms).toBeDefined();
      expect(emailSms?.data.title).toBe('Email & SMS Marketing');
      expect(emailSms?.data.order).toBe(4);

      const copywritingBranding = services.find(item => item.data.slug === 'copywriting-branding');
      expect(copywritingBranding).toBeDefined();
      expect(copywritingBranding?.data.title).toBe('Copywriting & Branding');
      expect(copywritingBranding?.data.order).toBe(5);

      const hostingCare = services.find(item => item.data.slug === 'hosting-care');
      expect(hostingCare).toBeDefined();
      expect(hostingCare?.data.title).toBe('Hosting & Care Plan');
      expect(hostingCare?.data.order).toBe(6);
    });

    it('should parse service content with correct metadata', async () => {
      const websiteDesign = await getContentBySlug<{ title: string; slug: string; featured: boolean }>('services', 'website-design');
      
      expect(websiteDesign).not.toBeNull();
      expect(websiteDesign?.data.title).toBe('Website Design & Development');
      expect(websiteDesign?.data.slug).toBe('website-design');
      expect(websiteDesign?.data.featured).toBe(true);
      expect(websiteDesign?.content).toBeDefined();
      expect(websiteDesign?.content.length).toBeGreaterThan(0);
    });
  });

  describe('Industry Content', () => {
    it('should return all industry slugs', async () => {
      const slugs = await getAllSlugs('industries');
      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs.length).toBe(6);
      expect(slugs).toContain('home-services');
      expect(slugs).toContain('medical');
      expect(slugs).toContain('personal-services');
      expect(slugs).toContain('professional-services');
      expect(slugs).toContain('restaurants');
      expect(slugs).toContain('retail');
    });

    it('should return content for each industry', async () => {
      const industries = await getAllContent<{ title: string; slug: string; order: number; icon: string }>('industries');
      
      expect(industries.length).toBe(6);
      
      const homeServices = industries.find(item => item.data.slug === 'home-services');
      expect(homeServices).toBeDefined();
      expect(homeServices?.data.title).toBe('Home Service & Trades');
      expect(homeServices?.data.order).toBe(1);
      expect(homeServices?.data.icon).toBe('🔧');

      const medical = industries.find(item => item.data.slug === 'medical');
      expect(medical).toBeDefined();
      expect(medical?.data.title).toBe('Medical & Wellness Clinics');
      expect(medical?.data.order).toBe(2);
      expect(medical?.data.icon).toBe('🏥');

      const personalServices = industries.find(item => item.data.slug === 'personal-services');
      expect(personalServices).toBeDefined();
      expect(personalServices?.data.title).toBe('Personal Services');
      expect(personalServices?.data.order).toBe(3);
      expect(personalServices?.data.icon).toBe('💇');

      const professionalServices = industries.find(item => item.data.slug === 'professional-services');
      expect(professionalServices).toBeDefined();
      expect(professionalServices?.data.title).toBe('Professional Services');
      expect(professionalServices?.data.order).toBe(4);
      expect(professionalServices?.data.icon).toBe('⚖️');

      const restaurants = industries.find(item => item.data.slug === 'restaurants');
      expect(restaurants).toBeDefined();
      expect(restaurants?.data.title).toBe('Restaurants & Food Service');
      expect(restaurants?.data.order).toBe(5);
      expect(restaurants?.data.icon).toBe('🍽️');

      const retail = industries.find(item => item.data.slug === 'retail');
      expect(retail).toBeDefined();
      expect(retail?.data.title).toBe('Retail & Local Shops');
      expect(retail?.data.order).toBe(6);
      expect(retail?.data.icon).toBe('🛍️');
    });

    it('should parse industry content with correct metadata', async () => {
      const homeServices = await getContentBySlug<{ title: string; slug: string; icon: string }>('industries', 'home-services');
      
      expect(homeServices).not.toBeNull();
      expect(homeServices?.data.title).toBe('Home Service & Trades');
      expect(homeServices?.data.slug).toBe('home-services');
      expect(homeServices?.data.icon).toBe('🔧');
      expect(homeServices?.content).toBeDefined();
      expect(homeServices?.content.length).toBeGreaterThan(0);
    });
  });

  describe('Demo Content', () => {
    it('should return all demo slugs', async () => {
      const slugs = await getAllSlugs('demos');
      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs.length).toBe(6);
      expect(slugs).toContain('plumbing');
      expect(slugs).toContain('dental');
      expect(slugs).toContain('salon');
      expect(slugs).toContain('law-firm');
      expect(slugs).toContain('restaurant');
      expect(slugs).toContain('retail-shop');
    });

    it('should return content for each demo', async () => {
      const demos = await getAllContent<{ title: string; slug: string; industry: string }>('demos');
      
      expect(demos.length).toBe(6);
      
      const plumbing = demos.find(item => item.data.slug === 'plumbing');
      expect(plumbing).toBeDefined();
      expect(plumbing?.data.title).toBe('Plumbing Business Website');
      expect(plumbing?.data.industry).toBe('home-services');

      const dental = demos.find(item => item.data.slug === 'dental');
      expect(dental).toBeDefined();
      expect(dental?.data.title).toBe('Dental Clinic Website');
      expect(dental?.data.industry).toBe('medical');

      const salon = demos.find(item => item.data.slug === 'salon');
      expect(salon).toBeDefined();
      expect(salon?.data.title).toBe('Salon & Spa Website');
      expect(salon?.data.industry).toBe('personal-services');

      const lawFirm = demos.find(item => item.data.slug === 'law-firm');
      expect(lawFirm).toBeDefined();
      expect(lawFirm?.data.title).toBe('Law Firm Website');
      expect(lawFirm?.data.industry).toBe('professional-services');

      const restaurant = demos.find(item => item.data.slug === 'restaurant');
      expect(restaurant).toBeDefined();
      expect(restaurant?.data.title).toBe('Restaurant Website');
      expect(restaurant?.data.industry).toBe('restaurants');

      const retailShop = demos.find(item => item.data.slug === 'retail-shop');
      expect(retailShop).toBeDefined();
      expect(retailShop?.data.title).toBe('Retail Shop Website');
      expect(retailShop?.data.industry).toBe('retail');
    });

    it('should parse demo content with correct metadata', async () => {
      const plumbing = await getContentBySlug<{ title: string; slug: string; industry: string }>('demos', 'plumbing');
      
      expect(plumbing).not.toBeNull();
      expect(plumbing?.data.title).toBe('Plumbing Business Website');
      expect(plumbing?.data.slug).toBe('plumbing');
      expect(plumbing?.data.industry).toBe('home-services');
      expect(plumbing?.content).toBeDefined();
      expect(plumbing?.content.length).toBeGreaterThan(0);
    });
  });
});
