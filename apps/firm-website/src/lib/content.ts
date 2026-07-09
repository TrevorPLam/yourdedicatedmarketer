import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { z } from 'zod';
import { FAQSchema, ServiceSchema, IndustrySchema, DemoSchema, PageSchema } from '@repo/lib';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

// In-memory cache to avoid repeated file reads
const contentCache = new Map<string, { data: unknown; content: string }>();

/**
 * Generic validation helper for content frontmatter.
 * Validates data against a Zod schema and logs errors if validation fails.
 */
function validateContent<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  slug: string
): T | null {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`Invalid frontmatter for ${slug}:`, result.error);
    return null;
  }
  return result.data;
}

export async function getAllSlugs(dir: string): Promise<string[]> {
  try {
    const fullPath = path.join(CONTENT_DIR, dir);
    const fileNames = fs.readdirSync(fullPath);
    return fileNames
      .filter((name) => name.endsWith('.mdx'))
      .map((name) => name.replace(/\.mdx$/, ''));
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    return [];
  }
}

export async function getContentBySlug<T>(dir: string, slug: string): Promise<{
  data: T;
  content: string;
} | null> {
  const cacheKey = `${dir}:${slug}`;
  
  // Check cache first
  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey) as { data: T; content: string };
  }

  try {
    const fullPath = path.join(CONTENT_DIR, dir, `${slug}.mdx`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Convert markdown to HTML
    const processedContent = await remark().use(html).process(content);
    const htmlContent = processedContent.toString();

    const result = {
      data: data as T,
      content: htmlContent,
    };

    // Cache the result
    contentCache.set(cacheKey, result);

    return result;
  } catch (error) {
    console.error(`Error reading content for ${slug}:`, error);
    return null;
  }
}

export async function getAllContent<T>(dir: string): Promise<{
  data: T;
  content: string;
}[]> {
  try {
    // Waterfall elimination: Get slugs and fetch content in parallel
    // Instead of awaiting slugs sequentially, we use Promise.all to fetch
    // all content files concurrently. This prevents the waterfall pattern
    // where each content fetch would wait for the previous one to complete.
    const slugs = await getAllSlugs(dir);
    const contents = await Promise.all(
      slugs.map((slug) => getContentBySlug<T>(dir, slug))
    );

    return contents.filter(
      (item): item is { data: T; content: string } => item !== null
    );
  } catch (error) {
    console.error(`Error getting all content from ${dir}:`, error);
    return [];
  }
}

// Type-specific helper functions
export async function getAllServices() {
  const services = await getAllContent('services');
  return services.filter((service) => {
    const validated = validateContent(ServiceSchema, service.data, (service.data as { slug?: string }).slug || 'unknown');
    return validated !== null;
  });
}

export async function getService(slug: string) {
  return getContentBySlug('services', slug);
}

export async function getAllIndustries() {
  const industries = await getAllContent('industries');
  return industries.filter((industry) => {
    const validated = validateContent(IndustrySchema, industry.data, (industry.data as { slug?: string }).slug || 'unknown');
    return validated !== null;
  });
}

export async function getIndustry(slug: string) {
  return getContentBySlug('industries', slug);
}

export async function getAllDemos() {
  const demos = await getAllContent('demos');
  return demos.filter((demo) => {
    const validated = validateContent(DemoSchema, demo.data, (demo.data as { slug?: string }).slug || 'unknown');
    return validated !== null;
  });
}

export async function getDemo(slug: string) {
  return getContentBySlug('demos', slug);
}

export async function getAllFAQs() {
  const faqs = await getAllContent('faq');
  return faqs.filter((faq) => {
    const result = FAQSchema.safeParse(faq.data);
    if (!result.success) {
      console.error(`Invalid FAQ frontmatter for ${(faq.data as { slug?: string }).slug || 'unknown'}:`, result.error);
      return false;
    }
    return true;
  });
}

export async function getFAQ(slug: string) {
  const faq = await getContentBySlug('faq', slug);
  if (!faq) return null;
  const result = FAQSchema.safeParse(faq.data);
  if (!result.success) {
    console.error(`Invalid FAQ frontmatter for ${slug}:`, result.error);
    return null;
  }
  return faq;
}

export async function getAllPages() {
  const pages = await getAllContent('pages');
  return pages.filter((page) => {
    const validated = validateContent(PageSchema, page.data, (page.data as { slug?: string }).slug || 'unknown');
    return validated !== null;
  });
}

export async function getPage(slug: string) {
  return getContentBySlug('pages', slug);
}
