/**
 * Unit tests for SEO utilities.
 */

import { describe, it, expect } from 'vitest';
import { generateMetadata, getOpenGraphTags } from './seo';
import { generateFAQSchema, generateOrganizationSchema, generateBreadcrumbSchema } from './json-ld';

// Type definitions for test assertions
interface TwitterMetadata {
  card: string;
  title: string;
  description?: string;
  images?: string[];
}

interface OpenGraphMetadata {
  type: 'website' | 'article';
  title: string;
  description: string;
  url: string;
  images?: Array<{ url: string; width: number; height: number; alt: string }>;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
}

describe('SEO Utilities', () => {
  describe('generateMetadata', () => {
    it('should generate basic metadata with title and description', () => {
      const metadata = generateMetadata({
        title: 'Test Page',
        description: 'Test description',
        path: '/test',
      });

      expect(metadata.title).toBe('Test Page');
      expect(metadata.description).toBe('Test description');
      expect(metadata.alternates?.canonical).toBe('https://yourdedicatedmarketer.com/test');
    });

    it('should include Open Graph tags', () => {
      const metadata = generateMetadata({
        title: 'Test Page',
        description: 'Test description',
        path: '/test',
      });

      expect(metadata.openGraph).toBeDefined();
      expect(metadata.openGraph?.title).toBe('Test Page');
      expect(metadata.openGraph?.description).toBe('Test description');
      expect(metadata.openGraph?.url).toBe('https://yourdedicatedmarketer.com/test');
    });

    it('should include Twitter card tags', () => {
      const metadata = generateMetadata({
        title: 'Test Page',
        description: 'Test description',
        path: '/test',
      });

      expect(metadata.twitter).toBeDefined();
      expect((metadata.twitter as TwitterMetadata)?.card).toBe('summary_large_image');
      expect((metadata.twitter as TwitterMetadata)?.title).toBe('Test Page');
    });

    it('should use custom image when provided', () => {
      const customImage = 'https://example.com/custom-image.png';
      const metadata = generateMetadata({
        title: 'Test Page',
        description: 'Test description',
        path: '/test',
        image: customImage,
      });

      expect((metadata.openGraph as OpenGraphMetadata)?.images?.[0]?.url).toBe(customImage);
      expect((metadata.twitter as TwitterMetadata)?.images?.[0]).toBe(customImage);
    });

    it('should include article-specific properties when provided', () => {
      const metadata = generateMetadata({
        title: 'Test Article',
        description: 'Test description',
        path: '/test',
        publishedTime: '2024-01-01T00:00:00Z',
        modifiedTime: '2024-01-02T00:00:00Z',
        authors: ['John Doe'],
        section: 'Marketing',
        tags: ['SEO', 'Marketing'],
      });

      expect((metadata.openGraph as OpenGraphMetadata)?.type).toBe('article');
      expect((metadata.openGraph as OpenGraphMetadata)?.publishedTime).toBe('2024-01-01T00:00:00Z');
      expect((metadata.openGraph as OpenGraphMetadata)?.modifiedTime).toBe('2024-01-02T00:00:00Z');
      expect((metadata.openGraph as OpenGraphMetadata)?.authors).toEqual(['John Doe']);
      expect((metadata.openGraph as OpenGraphMetadata)?.section).toBe('Marketing');
      expect((metadata.openGraph as OpenGraphMetadata)?.tags).toEqual(['SEO', 'Marketing']);
    });

    it('should default to website type when no article properties provided', () => {
      const metadata = generateMetadata({
        title: 'Test Page',
        description: 'Test description',
        path: '/test',
      });

      expect((metadata.openGraph as OpenGraphMetadata)?.type).toBe('website');
    });
  });

  describe('getOpenGraphTags', () => {
    it('should generate Open Graph tags for website', () => {
      const ogTags = getOpenGraphTags({
        title: 'Test Page',
        description: 'Test description',
        url: 'https://yourdedicatedmarketer.com/test',
      });

      expect(ogTags.type).toBe('website');
      expect(ogTags.title).toBe('Test Page');
      expect(ogTags.description).toBe('Test description');
      expect(ogTags.url).toBe('https://yourdedicatedmarketer.com/test');
    });

    it('should generate Open Graph tags for article', () => {
      const ogTags = getOpenGraphTags({
        title: 'Test Article',
        description: 'Test description',
        url: 'https://yourdedicatedmarketer.com/test',
        type: 'article',
        publishedTime: '2024-01-01T00:00:00Z',
      });

      expect(ogTags.type).toBe('article');
      expect(ogTags.publishedTime).toBe('2024-01-01T00:00:00Z');
    });

    it('should use custom image when provided', () => {
      const customImage = 'https://example.com/custom-image.png';
      const ogTags = getOpenGraphTags({
        title: 'Test Page',
        description: 'Test description',
        url: 'https://yourdedicatedmarketer.com/test',
        image: customImage,
      });

      expect(ogTags.images?.[0]?.url).toBe(customImage);
    });
  });
});

describe('JSON-LD Utilities', () => {
  describe('generateFAQSchema', () => {
    it('should generate valid FAQPage schema', () => {
      const faqs = [
        { title: 'What is SEO?', content: 'SEO stands for Search Engine Optimization.' },
        { title: 'How much does it cost?', content: 'Pricing varies based on services needed.' },
      ];

      const schema = generateFAQSchema(faqs);
      const parsed = JSON.parse(schema);

      expect(parsed['@context']).toBe('https://schema.org');
      expect(parsed['@type']).toBe('FAQPage');
      expect(parsed.mainEntity).toHaveLength(2);
      expect(parsed.mainEntity[0]['@type']).toBe('Question');
      expect(parsed.mainEntity[0].name).toBe('What is SEO?');
      expect(parsed.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
      expect(parsed.mainEntity[0].acceptedAnswer.text).toBe('SEO stands for Search Engine Optimization.');
    });

    it('should handle empty FAQ array', () => {
      const schema = generateFAQSchema([]);
      const parsed = JSON.parse(schema);

      expect(parsed.mainEntity).toHaveLength(0);
    });
  });

  describe('generateOrganizationSchema', () => {
    it('should generate valid Organization schema with defaults', () => {
      const schema = generateOrganizationSchema({});
      const parsed = JSON.parse(schema);

      expect(parsed['@context']).toBe('https://schema.org');
      expect(parsed['@type']).toBe('Organization');
      expect(parsed.name).toBe('Your Dedicated Marketer');
      expect(parsed.url).toBe('https://yourdedicatedmarketer.com');
    });

    it('should generate Organization schema with custom values', () => {
      const schema = generateOrganizationSchema({
        name: 'Custom Name',
        description: 'Custom description',
        url: 'https://example.com',
        logo: 'https://example.com/logo.png',
        sameAs: ['https://twitter.com/example', 'https://linkedin.com/company/example'],
      });
      const parsed = JSON.parse(schema);

      expect(parsed.name).toBe('Custom Name');
      expect(parsed.description).toBe('Custom description');
      expect(parsed.url).toBe('https://example.com');
      expect(parsed.logo).toBe('https://example.com/logo.png');
      expect(parsed.sameAs).toEqual(['https://twitter.com/example', 'https://linkedin.com/company/example']);
    });

    it('should include address when provided', () => {
      const schema = generateOrganizationSchema({
        address: {
          streetAddress: '123 Main St',
          addressLocality: 'City',
          addressRegion: 'ST',
          postalCode: '12345',
          addressCountry: 'US',
        },
      });
      const parsed = JSON.parse(schema);

      expect(parsed.address).toBeDefined();
      expect(parsed.address['@type']).toBe('PostalAddress');
      expect(parsed.address.streetAddress).toBe('123 Main St');
    });

    it('should include contact point when provided', () => {
      const schema = generateOrganizationSchema({
        contactPoint: {
          telephone: '+1-555-555-5555',
          contactType: 'customer service',
          email: 'contact@example.com',
        },
      });
      const parsed = JSON.parse(schema);

      expect(parsed.contactPoint).toBeDefined();
      expect(parsed.contactPoint['@type']).toBe('ContactPoint');
      expect(parsed.contactPoint.telephone).toBe('+1-555-555-5555');
    });
  });

  describe('generateBreadcrumbSchema', () => {
    it('should generate valid BreadcrumbList schema', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://yourdedicatedmarketer.com/' },
        { name: 'Services', url: 'https://yourdedicatedmarketer.com/services' },
        { name: 'Website Design', url: 'https://yourdedicatedmarketer.com/services/website-design' },
      ];

      const schema = generateBreadcrumbSchema(breadcrumbs);
      const parsed = JSON.parse(schema);

      expect(parsed['@context']).toBe('https://schema.org');
      expect(parsed['@type']).toBe('BreadcrumbList');
      expect(parsed.itemListElement).toHaveLength(3);
      expect(parsed.itemListElement[0]['@type']).toBe('ListItem');
      expect(parsed.itemListElement[0].position).toBe(1);
      expect(parsed.itemListElement[0].name).toBe('Home');
      expect(parsed.itemListElement[0].item).toBe('https://yourdedicatedmarketer.com/');
    });

    it('should handle single breadcrumb', () => {
      const breadcrumbs = [{ name: 'Home', url: 'https://yourdedicatedmarketer.com/' }];
      const schema = generateBreadcrumbSchema(breadcrumbs);
      const parsed = JSON.parse(schema);

      expect(parsed.itemListElement).toHaveLength(1);
      expect(parsed.itemListElement[0].position).toBe(1);
    });

    it('should assign correct positions to breadcrumbs', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://yourdedicatedmarketer.com/' },
        { name: 'Services', url: 'https://yourdedicatedmarketer.com/services' },
        { name: 'Website Design', url: 'https://yourdedicatedmarketer.com/services/website-design' },
      ];
      const schema = generateBreadcrumbSchema(breadcrumbs);
      const parsed = JSON.parse(schema);

      expect(parsed.itemListElement[0].position).toBe(1);
      expect(parsed.itemListElement[1].position).toBe(2);
      expect(parsed.itemListElement[2].position).toBe(3);
    });
  });
});
