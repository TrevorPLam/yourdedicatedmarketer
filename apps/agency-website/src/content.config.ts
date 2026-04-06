import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Services collection
const services = defineCollection({
  loader: glob({ 
    pattern: '**/[^_]*.{md,mdx}', 
    base: './src/content/services' 
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    featured: z.boolean().default(false),
    price: z.string().optional(),
    duration: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

// Portfolio collection
const portfolio = defineCollection({
  loader: glob({ 
    pattern: '**/[^_]*.{md,mdx}', 
    base: './src/content/portfolio' 
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    client: z.string(),
    industry: z.string(),
    technologies: z.array(z.string()),
    featured: z.boolean().default(false),
    completionDate: z.coerce.date(),
    liveUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    imageUrl: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

// Blog collection
const blog = defineCollection({
  loader: glob({ 
    pattern: '**/[^_]*.{md,mdx}', 
    base: './src/content/blog' 
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    category: z.string(),
    readingTime: z.number().optional(),
    imageUrl: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

// Team collection
const team = defineCollection({
  loader: glob({ 
    pattern: '**/[^_]*.{md,mdx}', 
    base: './src/content/team' 
  }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    imageUrl: z.string(),
    imageAlt: z.string(),
    email: z.string().email().optional(),
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
    order: z.number().default(0),
  }),
});

// Testimonials collection
const testimonials = defineCollection({
  loader: glob({ 
    pattern: '**/[^_]*.{md,mdx}', 
    base: './src/content/testimonials' 
  }),
  schema: z.object({
    clientName: z.string(),
    clientCompany: z.string(),
    clientRole: z.string().optional(),
    content: z.string(),
    rating: z.number().min(1).max(5).default(5),
    featured: z.boolean().default(false),
    projectUrl: z.string().url().optional(),
    imageUrl: z.string().optional(),
    imageAlt: z.string().optional(),
    date: z.coerce.date().optional(),
  }),
});

export const collections = {
  services,
  portfolio,
  blog,
  team,
  testimonials,
};
