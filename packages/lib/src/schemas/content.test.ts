import { describe, it, expect } from 'vitest';
import {
  ServiceSchema,
  IndustrySchema,
  DemoSchema,
  FAQSchema,
  PageSchema,
} from './content';

describe('ServiceSchema', () => {
  it('should accept valid service data', () => {
    const validService = {
      title: 'Web Development',
      slug: 'web-development',
      description: 'Custom web development services',
      body: 'We build custom websites...',
    };
    const result = ServiceSchema.parse(validService);
    expect(result).toEqual(validService);
  });

  it('should accept service data with optional fields', () => {
    const serviceWithOptionals = {
      title: 'Web Development',
      slug: 'web-development',
      description: 'Custom web development services',
      body: 'We build custom websites...',
      featured: true,
      order: 1,
    };
    const result = ServiceSchema.parse(serviceWithOptionals);
    expect(result).toEqual(serviceWithOptionals);
  });

  it('should reject service data with missing required fields', () => {
    const invalidService = {
      title: 'Web Development',
      slug: 'web-development',
    };
    expect(() => ServiceSchema.parse(invalidService)).toThrow();
  });

  it('should reject service data with extra fields', () => {
    const serviceWithExtra = {
      title: 'Web Development',
      slug: 'web-development',
      description: 'Custom web development services',
      body: 'We build custom websites...',
      extraField: 'should not be here',
    };
    expect(() => ServiceSchema.parse(serviceWithExtra)).toThrow();
  });
});

describe('IndustrySchema', () => {
  it('should accept valid industry data', () => {
    const validIndustry = {
      title: 'Healthcare',
      slug: 'healthcare',
      description: 'Healthcare industry solutions',
      body: 'We serve healthcare providers...',
    };
    const result = IndustrySchema.parse(validIndustry);
    expect(result).toEqual(validIndustry);
  });

  it('should accept industry data with optional fields', () => {
    const industryWithOptionals = {
      title: 'Healthcare',
      slug: 'healthcare',
      description: 'Healthcare industry solutions',
      body: 'We serve healthcare providers...',
      featured: true,
      order: 2,
    };
    const result = IndustrySchema.parse(industryWithOptionals);
    expect(result).toEqual(industryWithOptionals);
  });

  it('should reject industry data with missing required fields', () => {
    const invalidIndustry = {
      title: 'Healthcare',
    };
    expect(() => IndustrySchema.parse(invalidIndustry)).toThrow();
  });

  it('should reject industry data with extra fields', () => {
    const industryWithExtra = {
      title: 'Healthcare',
      slug: 'healthcare',
      description: 'Healthcare industry solutions',
      body: 'We serve healthcare providers...',
      extraField: 'should not be here',
    };
    expect(() => IndustrySchema.parse(industryWithExtra)).toThrow();
  });
});

describe('DemoSchema', () => {
  it('should accept valid demo data', () => {
    const validDemo = {
      title: 'E-commerce Platform',
      slug: 'e-commerce-platform',
      description: 'Full-featured e-commerce solution',
      body: 'A complete e-commerce platform...',
    };
    const result = DemoSchema.parse(validDemo);
    expect(result).toEqual(validDemo);
  });

  it('should accept demo data with optional fields', () => {
    const demoWithOptionals = {
      title: 'E-commerce Platform',
      slug: 'e-commerce-platform',
      description: 'Full-featured e-commerce solution',
      body: 'A complete e-commerce platform...',
      liveUrl: 'https://example.com',
      repoUrl: 'https://github.com/example/repo',
      thumbnail: '/images/demo-thumb.jpg',
      featured: true,
      order: 3,
    };
    const result = DemoSchema.parse(demoWithOptionals);
    expect(result).toEqual(demoWithOptionals);
  });

  it('should reject demo data with missing required fields', () => {
    const invalidDemo = {
      title: 'E-commerce Platform',
    };
    expect(() => DemoSchema.parse(invalidDemo)).toThrow();
  });

  it('should reject demo data with extra fields', () => {
    const demoWithExtra = {
      title: 'E-commerce Platform',
      slug: 'e-commerce-platform',
      description: 'Full-featured e-commerce solution',
      body: 'A complete e-commerce platform...',
      extraField: 'should not be here',
    };
    expect(() => DemoSchema.parse(demoWithExtra)).toThrow();
  });
});

describe('FAQSchema', () => {
  it('should accept valid FAQ data', () => {
    const validFAQ = {
      title: 'What services do you offer?',
      slug: 'what-services-do-you-offer',
      description: 'We offer web development, mobile apps, and consulting.',
      category: 'general' as const,
    };
    const result = FAQSchema.parse(validFAQ);
    expect(result).toEqual(validFAQ);
  });

  it('should accept FAQ data with optional fields', () => {
    const faqWithOptionals = {
      title: 'What services do you offer?',
      slug: 'what-services-do-you-offer',
      description: 'We offer web development, mobile apps, and consulting.',
      category: 'general' as const,
      order: 1,
    };
    const result = FAQSchema.parse(faqWithOptionals);
    expect(result).toEqual(faqWithOptionals);
  });

  it('should reject FAQ data with missing required fields', () => {
    const invalidFAQ = {
      title: 'What services do you offer?',
    };
    expect(() => FAQSchema.parse(invalidFAQ)).toThrow();
  });

  it('should reject FAQ data with extra fields', () => {
    const faqWithExtra = {
      title: 'What services do you offer?',
      slug: 'what-services-do-you-offer',
      description: 'We offer web development, mobile apps, and consulting.',
      category: 'general' as const,
      extraField: 'should not be here',
    };
    expect(() => FAQSchema.parse(faqWithExtra)).toThrow();
  });
});

describe('PageSchema', () => {
  it('should accept valid page data', () => {
    const validPage = {
      title: 'About Us',
      slug: 'about-us',
      body: 'Learn more about our company...',
    };
    const result = PageSchema.parse(validPage);
    expect(result).toEqual(validPage);
  });

  it('should accept page data with optional fields', () => {
    const pageWithOptionals = {
      title: 'About Us',
      slug: 'about-us',
      description: 'Company information',
      body: 'Learn more about our company...',
      metaTitle: 'About Our Company',
      metaDescription: 'Learn about our mission and values',
    };
    const result = PageSchema.parse(pageWithOptionals);
    expect(result).toEqual(pageWithOptionals);
  });

  it('should reject page data with missing required fields', () => {
    const invalidPage = {
      title: 'About Us',
    };
    expect(() => PageSchema.parse(invalidPage)).toThrow();
  });

  it('should reject page data with extra fields', () => {
    const pageWithExtra = {
      title: 'About Us',
      slug: 'about-us',
      body: 'Learn more about our company...',
      extraField: 'should not be here',
    };
    expect(() => PageSchema.parse(pageWithExtra)).toThrow();
  });
});
