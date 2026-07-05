import { z } from 'zod';

export const ServiceSchema = z
  .object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    body: z.string(),
    featured: z.boolean().optional(),
    order: z.number().optional(),
  })
  .strict();

export const IndustrySchema = z
  .object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    body: z.string(),
    featured: z.boolean().optional(),
    order: z.number().optional(),
  })
  .strict();

export const DemoSchema = z
  .object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    body: z.string(),
    liveUrl: z.string().optional(),
    repoUrl: z.string().optional(),
    thumbnail: z.string().optional(),
    featured: z.boolean().optional(),
    order: z.number().optional(),
  })
  .strict();

export const FAQSchema = z
  .object({
    question: z.string(),
    slug: z.string(),
    answer: z.string(),
    category: z.string().optional(),
    order: z.number().optional(),
  })
  .strict();

export const PageSchema = z
  .object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    body: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  })
  .strict();
