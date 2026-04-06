/**
 * Client Beta Cache Warming Utility
 * 
 * Provides cache warming functionality for critical client dashboard pages
 * to ensure fast initial loads after deployment or cache invalidation.
 * 
 * Version: 1.0.0
 * Updated: April 2026
 */

import { revalidateTag, revalidatePath } from 'next/cache';

// Critical client dashboard pages that should be warmed
const CRITICAL_PAGES = [
  '/',
  '/login',
  '/dashboard',
  '/analytics',
  '/reports',
  '/users',
  '/settings',
] as const;

// Cache tags that should be warmed
const CRITICAL_CACHE_TAGS = [
  'dashboard-layout',
  'client-data',
  'analytics-data',
  'reports-data',
  'users-data',
  'settings-data',
] as const;

/**
 * Warm cache for critical client pages
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
      revalidateTag(tag, 'cache-warming'); // Add second parameter for Next.js 16
    }

    console.log('Client cache warming completed for critical pages and tags');
  } catch (error) {
    console.error('Client cache warming failed:', error);
    // Don't throw error to avoid breaking deployment
  }
}

/**
 * Warm cache for specific client page
 */
export async function warmPage(path: string): Promise<void> {
  try {
    revalidatePath(path);
    console.log(`Client cache warmed for page: ${path}`);
  } catch (error) {
    console.error(`Client cache warming failed for page ${path}:`, error);
  }
}

/**
 * Warm cache by tag for client-specific data
 */
export async function warmCacheTag(tag: string): Promise<void> {
  try {
    revalidateTag(tag, 'cache-warming'); // Add second parameter for Next.js 16
    console.log(`Client cache warmed for tag: ${tag}`);
  } catch (error) {
    console.error(`Client cache warming failed for tag ${tag}:`, error);
  }
}

/**
 * Get list of critical client pages for warming
 */
export function getCriticalPages(): readonly string[] {
  return CRITICAL_PAGES;
}

/**
 * Get list of critical client cache tags for warming
 */
export function getCriticalCacheTags(): readonly string[] {
  return CRITICAL_CACHE_TAGS;
}
