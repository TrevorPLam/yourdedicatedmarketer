import { defineLiveCollection } from 'astro:content';
import { z } from 'astro/zod';

// Custom CMS loader for live content
interface CMSEntry {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  category?: string;
  tags?: string[];
  featured?: boolean;
  status: 'published' | 'draft';
}

// Live blog posts from CMS
const liveBlog = defineLiveCollection({
  loader: {
    async loadCollection() {
      // This would connect to your actual CMS API
      // For now, returning empty array as placeholder
      try {
        const response = await fetch(`${process.env.CMS_API_URL}/posts?status=published`, {
          headers: {
            'Authorization': `Bearer ${process.env.CMS_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }

        const posts: CMSEntry[] = await response.json();
        
        return posts.map(post => ({
          id: post.id,
          data: {
            title: post.title,
            description: post.excerpt || post.content.substring(0, 160) + '...',
            content: post.content,
            pubDate: new Date(post.publishedAt),
            updatedDate: post.updatedAt ? new Date(post.updatedAt) : undefined,
            author: post.author || 'Your Agency',
            featured: post.featured || false,
            tags: post.tags || [],
            category: post.category || 'general',
            readingTime: Math.ceil(post.content.split(' ').length / 200), // Approximate reading time
          },
        }));
      } catch (error) {
        console.error('Error loading live blog posts:', error);
        return [];
      }
    },

    async loadEntry(id: string) {
      try {
        const response = await fetch(`${process.env.CMS_API_URL}/posts/${id}`, {
          headers: {
            'Authorization': `Bearer ${process.env.CMS_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch post: ${response.statusText}`);
        }

        const post: CMSEntry = await response.json();
        
        return {
          id: post.id,
          data: {
            title: post.title,
            description: post.excerpt || post.content.substring(0, 160) + '...',
            content: post.content,
            pubDate: new Date(post.publishedAt),
            updatedDate: post.updatedAt ? new Date(post.updatedAt) : undefined,
            author: post.author || 'Your Agency',
            featured: post.featured || false,
            tags: post.tags || [],
            category: post.category || 'general',
            readingTime: Math.ceil(post.content.split(' ').length / 200),
          },
        };
      } catch (error) {
        console.error(`Error loading blog post ${id}:`, error);
        return null;
      }
    },
  },

  schema: z.object({
    title: z.string(),
    description: z.string(),
    content: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    category: z.string(),
    readingTime: z.number(),
  }),
});

// Live services from CMS
const liveServices = defineLiveCollection({
  loader: {
    async loadCollection() {
      try {
        const response = await fetch(`${process.env.CMS_API_URL}/services`, {
          headers: {
            'Authorization': `Bearer ${process.env.CMS_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.statusText}`);
        }

        const services = await response.json();
        
        return services.map((service: any) => ({
          id: service.id,
          data: {
            title: service.title,
            description: service.description,
            icon: service.icon,
            featured: service.featured || false,
            price: service.price,
            duration: service.duration,
            tags: service.tags || [],
          },
        }));
      } catch (error) {
        console.error('Error loading live services:', error);
        return [];
      }
    },

    async loadEntry(id: string) {
      try {
        const response = await fetch(`${process.env.CMS_API_URL}/services/${id}`, {
          headers: {
            'Authorization': `Bearer ${process.env.CMS_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch service: ${response.statusText}`);
        }

        const service = await response.json();
        
        return {
          id: service.id,
          data: {
            title: service.title,
            description: service.description,
            icon: service.icon,
            featured: service.featured || false,
            price: service.price,
            duration: service.duration,
            tags: service.tags || [],
          },
        };
      } catch (error) {
        console.error(`Error loading service ${id}:`, error);
        return null;
      }
    },
  },

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

export const collections = {
  liveBlog,
  liveServices,
};
