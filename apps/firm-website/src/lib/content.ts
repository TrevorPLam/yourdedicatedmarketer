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

// Export function to clear cache (useful for testing)
export function clearContentCache() {
  contentCache.clear();
}

/**
 * Generic validation helper for content frontmatter.
 * Validates data against a Zod schema and logs errors if validation fails.
 * Returns null if validation fails, allowing callers to filter out invalid content.
 */
function parseFrontmatter<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  slug: string
): T | null {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`Invalid frontmatter for ${slug}:`, z.treeifyError(result.error));
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

export async function getContentBySlug<T>(
  dir: string,
  slug: string,
  schema?: z.ZodSchema<T>
): Promise<{
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

    // Validate frontmatter if schema is provided
    const validatedData = schema ? parseFrontmatter(schema, data, slug) : (data as T);
    if (schema && !validatedData) {
      return null;
    }

    // Convert markdown to HTML
    const processedContent = await remark().use(html).process(content);
    const htmlContent = processedContent.toString();

    const result = {
      data: validatedData as T,
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

export async function getAllContent<T>(
  dir: string,
  schema?: z.ZodSchema<T>
): Promise<{
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
      slugs.map((slug) => getContentBySlug<T>(dir, slug, schema))
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
  return getAllContent('services', ServiceSchema);
}

export async function getService(slug: string) {
  return getContentBySlug('services', slug, ServiceSchema);
}

export async function getAllIndustries() {
  return getAllContent('industries', IndustrySchema);
}

export async function getIndustry(slug: string) {
  return getContentBySlug('industries', slug, IndustrySchema);
}

export async function getAllDemos() {
  return getAllContent('demos', DemoSchema);
}

export async function getDemo(slug: string) {
  return getContentBySlug('demos', slug, DemoSchema);
}

export async function getAllFAQs() {
  return getAllContent('faq', FAQSchema);
}

export async function getFAQ(slug: string) {
  return getContentBySlug('faq', slug, FAQSchema);
}

export async function getAllPages() {
  return getAllContent('pages', PageSchema);
}

export async function getPage(slug: string) {
  return getContentBySlug('pages', slug, PageSchema);
}
