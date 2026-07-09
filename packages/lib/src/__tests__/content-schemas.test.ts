import { describe, it, expect } from 'vitest';
import { FAQSchema } from '../schemas/content';

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
