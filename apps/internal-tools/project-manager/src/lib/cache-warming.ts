/**
 * Cache Warming Utility
 * 
 * Provides cache warming functionality for critical pages to ensure
 * fast initial loads after deployment or cache invalidation.
 * 
 * Version: 1.0.0
 * Updated: April 2026
 */

import { revalidateTag, revalidatePath } from 'next/cache';

// Critical pages that should be warmed
const CRITICAL_PAGES = [
  '/',
  '/login',
  '/dashboard',
  '/projects',
  '/clients',
] as const;

// Cache tags that should be warmed
const CRITICAL_CACHE_TAGS = [
  'homepage',
  'auth-check',
  'dashboard-data',
  'projects-list',
  'clients-list',
] as const;

/**
 * Warm cache for critical pages
 * This should be called during deployment or after cache invalidation
 */
export async function warmCriticalPages(): Promise<void> {
  try {
    // Revalidate critical paths
    for (const page of CRITICAL_PAGES) {
      revalidatePath(page);
    }

    // Revalidate critical cache tags
    for (const tag of CRITICAL_CACHE_TAGS) {
      revalidateTag(tag);
    }

    console.log('Cache warming completed for critical pages and tags');
  } catch (error) {
    console.error('Cache warming failed:', error);
    // Don't throw error to avoid breaking deployment
  }
}

/**
 * Warm cache for specific page
 */
export async function warmPage(path: string): Promise<void> {
  try {
    revalidatePath(path);
    console.log(`Cache warmed for page: ${path}`);
  } catch (error) {
    console.error(`Cache warming failed for page ${path}:`, error);
  }
}

/**
 * Warm cache by tag
 */
export async function warmCacheTag(tag: string): Promise<void> {
  try {
    revalidateTag(tag);
    console.log(`Cache warmed for tag: ${tag}`);
  } catch (error) {
    console.error(`Cache warming failed for tag ${tag}:`, error);
  }
}

/**
 * Get list of critical pages for warming
 */
export function getCriticalPages(): readonly string[] {
  return CRITICAL_PAGES;
}

/**
 * Get list of critical cache tags for warming
 */
export function getCriticalCacheTags(): readonly string[] {
  return CRITICAL_CACHE_TAGS;
}
