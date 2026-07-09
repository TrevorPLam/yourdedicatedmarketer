import { describe, it, expect } from 'vitest';
import { FAQSchema, ServiceSchema, IndustrySchema, DemoSchema, PageSchema } from '../schemas/content';

describe('FAQSchema', () => {
  it('should validate a valid FAQ frontmatter object', () => {
    const validFAQ = {
      title: 'How much does a website cost?',
      slug: 'cost',
      description: 'Transparent pricing for small business websites.',
      category: 'pricing' as const,
      order: 1,
    };

    const result = FAQSchema.safeParse(validFAQ);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validFAQ);
    }
  });

  it('should validate FAQ without optional order field', () => {
    const validFAQ = {
      title: 'What is the process?',
      slug: 'process',
      description: 'Website build process for small businesses.',
      category: 'process' as const,
    };

    const result = FAQSchema.safeParse(validFAQ);
    expect(result.success).toBe(true);
  });

  it('should reject invalid category', () => {
    const invalidFAQ = {
      title: 'Test question',
      slug: 'test',
      description: 'Test description',
      category: 'invalid-category',
    };

    const result = FAQSchema.safeParse(invalidFAQ);
    expect(result.success).toBe(false);
  });

  it('should reject missing required fields', () => {
    const invalidFAQ = {
      title: 'Test question',
      // missing slug, description, category
    };

    const result = FAQSchema.safeParse(invalidFAQ);
    expect(result.success).toBe(false);
  });

  it('should reject extra fields (strict mode)', () => {
    const invalidFAQ = {
      title: 'Test question',
      slug: 'test',
      description: 'Test description',
      category: 'general' as const,
      extraField: 'should not be allowed',
    };

    const result = FAQSchema.safeParse(invalidFAQ);
    expect(result.success).toBe(false);
  });

  it('should accept all valid category values', () => {
    const categories = ['general', 'pricing', 'process'] as const;

    categories.forEach((category) => {
      const validFAQ = {
        title: 'Test question',
        slug: 'test',
        description: 'Test description',
        category,
      };

      const result = FAQSchema.safeParse(validFAQ);
      expect(result.success).toBe(true);
    });
  });
});

describe('ServiceSchema', () => {
  it('should validate a valid Service frontmatter object', () => {
    const validService = {
      title: 'Website Design',
      slug: 'website-design',
      description: 'Professional website design services.',
      featured: true,
      order: 1,
    };

    const result = ServiceSchema.safeParse(validService);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validService);
    }
  });

  it('should validate Service without optional fields', () => {
    const validService = {
      title: 'SEO Services',
      slug: 'seo',
      description: 'Search engine optimization.',
    };

    const result = ServiceSchema.safeParse(validService);
    expect(result.success).toBe(true);
  });

  it('should reject missing required fields', () => {
    const invalidService = {
      title: 'Test Service',
      // missing slug, description
    };

    const result = ServiceSchema.safeParse(invalidService);
    expect(result.success).toBe(false);
  });

  it('should reject extra fields (strict mode)', () => {
    const invalidService = {
      title: 'Test Service',
      slug: 'test',
      description: 'Test description',
      extraField: 'should not be allowed',
    };

    const result = ServiceSchema.safeParse(invalidService);
    expect(result.success).toBe(false);
  });
});

describe('IndustrySchema', () => {
  it('should validate a valid Industry frontmatter object', () => {
    const validIndustry = {
      title: 'Medical',
      slug: 'medical',
      description: 'Healthcare industry.',
      icon: '🏥',
      featured: true,
      order: 2,
    };

    const result = IndustrySchema.safeParse(validIndustry);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validIndustry);
    }
  });

  it('should validate Industry without optional fields', () => {
    const validIndustry = {
      title: 'Retail',
      slug: 'retail',
      description: 'Retail industry.',
    };

    const result = IndustrySchema.safeParse(validIndustry);
    expect(result.success).toBe(true);
  });

  it('should reject missing required fields', () => {
    const invalidIndustry = {
      title: 'Test Industry',
      // missing slug, description
    };

    const result = IndustrySchema.safeParse(invalidIndustry);
    expect(result.success).toBe(false);
  });

  it('should reject extra fields (strict mode)', () => {
    const invalidIndustry = {
      title: 'Test Industry',
      slug: 'test',
      description: 'Test description',
      extraField: 'should not be allowed',
    };

    const result = IndustrySchema.safeParse(invalidIndustry);
    expect(result.success).toBe(false);
  });
});

describe('DemoSchema', () => {
  it('should validate a valid Demo frontmatter object', () => {
    const validDemo = {
      title: 'Dental Clinic',
      slug: 'dental',
      description: 'A dental clinic website demo.',
      industry: 'medical',
      liveUrl: 'https://example.com',
      repoUrl: 'https://github.com/example',
      thumbnail: '/images/dental.jpg',
      featured: true,
      order: 1,
    };

    const result = DemoSchema.safeParse(validDemo);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validDemo);
    }
  });

  it('should validate Demo without optional fields', () => {
    const validDemo = {
      title: 'Restaurant Demo',
      slug: 'restaurant',
      description: 'A restaurant website demo.',
    };

    const result = DemoSchema.safeParse(validDemo);
    expect(result.success).toBe(true);
  });

  it('should reject missing required fields', () => {
    const invalidDemo = {
      title: 'Test Demo',
      // missing slug, description
    };

    const result = DemoSchema.safeParse(invalidDemo);
    expect(result.success).toBe(false);
  });

  it('should reject extra fields (strict mode)', () => {
    const invalidDemo = {
      title: 'Test Demo',
      slug: 'test',
      description: 'Test description',
      extraField: 'should not be allowed',
    };

    const result = DemoSchema.safeParse(invalidDemo);
    expect(result.success).toBe(false);
  });
});

describe('PageSchema', () => {
  it('should validate a valid Page frontmatter object', () => {
    const validPage = {
      title: 'About',
      slug: 'about',
      description: 'About us page.',
      metaTitle: 'About Our Company',
      metaDescription: 'Learn about our company.',
    };

    const result = PageSchema.safeParse(validPage);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validPage);
    }
  });

  it('should validate Page without optional fields', () => {
    const validPage = {
      title: 'Contact',
      slug: 'contact',
    };

    const result = PageSchema.safeParse(validPage);
    expect(result.success).toBe(true);
  });

  it('should reject missing required fields', () => {
    const invalidPage = {
      title: 'Test Page',
      // missing slug
    };

    const result = PageSchema.safeParse(invalidPage);
    expect(result.success).toBe(false);
  });

  it('should reject extra fields (strict mode)', () => {
    const invalidPage = {
      title: 'Test Page',
      slug: 'test',
      extraField: 'should not be allowed',
    };

    const result = PageSchema.safeParse(invalidPage);
    expect(result.success).toBe(false);
  });
});
