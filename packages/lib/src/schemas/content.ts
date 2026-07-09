import { z } from 'zod';

// Note: Using z.strictObject() instead of z.interface() for content schemas
// because strict validation (rejecting unknown keys) is more valuable than
// the 2x performance gain for content parsing. z.interface() is better suited
// for performance-critical internal API validation where input shape is controlled.
export const ServiceSchema = z.strictObject({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  body: z.string(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
});

export const IndustrySchema = z.strictObject({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  body: z.string(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
});

export const DemoSchema = z.strictObject({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  body: z.string(),
  liveUrl: z.string().optional(),
  repoUrl: z.string().optional(),
  thumbnail: z.string().optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
});

export const FAQSchema = z.strictObject({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  category: z.enum(['general', 'pricing', 'process']),
  order: z.number().optional(),
});

export const PageSchema = z.strictObject({
  title: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  body: z.string(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});
