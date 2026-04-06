/**
 * SEO Utility Functions
 * Helper utilities for SEO optimization and validation
 */

import type { SEOConfig, SiteConfig, MetaTag } from '../types/seo.types';

/**
 * Validate SEO configuration
 */
export function validateSEOConfig(config: SEOConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!config.title || config.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!config.description || config.description.trim().length === 0) {
    errors.push('Description is required');
  }

  // Title length validation (2026 best practices)
  if (config.title.length > 60) {
    errors.push('Title should be 60 characters or less for optimal search display');
  }

  // Description length validation
  if (config.description.length > 160) {
    errors.push('Description should be 160 characters or less for optimal search display');
  }

  // URL validation
  if (config.canonical && !isValidURL(config.canonical)) {
    errors.push('Canonical URL must be a valid URL');
  }

  // Image validation
  if (config.ogImage && !isValidURL(config.ogImage)) {
    errors.push('OG image must be a valid URL');
  }

  // Keywords validation
  if (config.keywords && config.keywords.length > 10) {
    errors.push('Too many keywords (maximum 10 recommended)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generate SEO-friendly URL slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Extract keywords from text
 */
export function extractKeywords(text: string, maxKeywords: number = 10): string[] {
  // Remove common stop words
  const stopWords = new Set([
    'the',
    'be',
    'to',
    'of',
    'and',
    'a',
    'in',
    'that',
    'have',
    'i',
    'it',
    'for',
    'not',
    'on',
    'with',
    'he',
    'as',
    'you',
    'do',
    'at',
    'this',
    'but',
    'his',
    'by',
    'from',
    'they',
    'we',
    'say',
    'her',
    'she',
    'or',
    'an',
    'will',
    'my',
    'one',
    'all',
    'would',
    'there',
    'their',
    'what',
    'so',
    'up',
    'out',
    'if',
    'about',
    'who',
    'get',
    'which',
    'go',
    'me',
    'when',
    'make',
    'can',
    'like',
    'time',
    'no',
    'just',
    'him',
    'know',
    'take',
    'people',
    'into',
    'year',
    'your',
    'good',
    'some',
    'could',
    'them',
    'see',
    'other',
    'than',
    'then',
    'now',
    'look',
    'only',
    'come',
    'its',
    'over',
    'think',
    'also',
    'back',
    'after',
    'use',
    'two',
    'how',
    'our',
    'work',
    'first',
    'well',
    'way',
    'even',
    'new',
    'want',
    'because',
    'any',
    'these',
    'give',
    'day',
    'most',
    'us',
    'is',
    'was',
    'are',
    'been',
    'has',
    'had',
    'were',
    'said',
    'did',
    'getting',
    'made',
    'find',
    'where',
    'much',
    'too',
    'very',
    'still',
    'being',
    'going',
    'why',
    'before',
    'never',
    'here',
    'more',
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

  // Count word frequency
  const wordFreq = new Map<string, number>();
  words.forEach((word) => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  });

  // Sort by frequency and return top keywords
  return Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Generate meta description from content
 */
export function generateMetaDescription(content: string, maxLength: number = 160): string {
  // Remove HTML tags and extra whitespace
  const cleanContent = content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Truncate to max length
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  // Find the last complete sentence before the limit
  const truncated = cleanContent.substring(0, maxLength);
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?')
  );

  if (lastSentenceEnd > maxLength * 0.7) {
    return truncated.substring(0, lastSentenceEnd + 1);
  }

  return truncated + '...';
}

/**
 * Calculate SEO score
 */
export function calculateSEOScore(config: SEOConfig): { score: number; suggestions: string[] } {
  let score = 0;
  const suggestions: string[] = [];

  // Title optimization (30 points)
  if (config.title && config.title.length <= 60 && config.title.length >= 30) {
    score += 30;
  } else {
    if (config.title.length > 60) {
      suggestions.push('Shorten title to 60 characters or less');
    } else if (config.title.length < 30) {
      suggestions.push('Lengthen title to at least 30 characters');
    }
  }

  // Description optimization (25 points)
  if (config.description && config.description.length <= 160 && config.description.length >= 120) {
    score += 25;
  } else {
    if (config.description.length > 160) {
      suggestions.push('Shorten description to 160 characters or less');
    } else if (config.description.length < 120) {
      suggestions.push('Lengthen description to at least 120 characters');
    }
  }

  // Open Graph optimization (20 points)
  if (config.ogImage) {
    score += 20;
  } else {
    suggestions.push('Add Open Graph image for better social sharing');
  }

  // Structured data (15 points)
  if (config.structuredData && config.structuredData.length > 0) {
    score += 15;
  } else {
    suggestions.push('Add structured data for enhanced search results');
  }

  // Keywords (10 points)
  if (config.keywords && config.keywords.length >= 3 && config.keywords.length <= 8) {
    score += 10;
  } else {
    if (!config.keywords || config.keywords.length === 0) {
      suggestions.push('Add relevant keywords (3-8 recommended)');
    } else if (config.keywords.length > 8) {
      suggestions.push('Reduce keywords to 8 or fewer');
    } else if (config.keywords.length < 3) {
      suggestions.push('Add more keywords (at least 3 recommended)');
    }
  }

  return { score, suggestions };
}

/**
 * Format phone number for SEO
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Format based on length
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  return phone; // Return original if formatting fails
}

/**
 * Generate breadcrumbs from URL path
 */
export function generateBreadcrumbs(
  path: string,
  siteConfig: SiteConfig
): Array<{ name: string; url: string }> {
  const parts = path.split('/').filter((part) => part);
  const breadcrumbs: Array<{ name: string; url: string }> = [];

  // Add home
  breadcrumbs.push({
    name: 'Home',
    url: siteConfig.baseUrl,
  });

  // Add path segments
  let currentPath = siteConfig.baseUrl;
  parts.forEach((part, index) => {
    currentPath += `/${part}`;
    const name = formatBreadcrumbName(part);

    breadcrumbs.push({
      name,
      url: currentPath,
    });
  });

  return breadcrumbs;
}

/**
 * Format breadcrumb name
 */
function formatBreadcrumbName(segment: string): string {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Check if URL is valid
 */
function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate reading time estimate
 */
export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Extract featured image from content
 */
export function extractFeaturedImage(content: string): string | null {
  // Look for the first img tag
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  return imgMatch ? imgMatch[1] : null;
}

/**
 * Generate excerpt from content
 */
export function generateExcerpt(content: string, length: number = 300): string {
  const cleanContent = content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleanContent.length <= length) {
    return cleanContent;
  }

  return cleanContent.substring(0, length) + '...';
}

/**
 * Check if content meets SEO best practices
 */
export function analyzeContentSEO(content: string): {
  wordCount: number;
  readingTime: number;
  hasHeadings: boolean;
  hasImages: boolean;
  hasInternalLinks: boolean;
  hasExternalLinks: boolean;
  suggestions: string[];
} {
  const suggestions: string[] = [];

  // Word count
  const wordCount = content.split(/\s+/).length;
  if (wordCount < 300) {
    suggestions.push('Content should be at least 300 words for better SEO');
  }

  // Reading time
  const readingTime = estimateReadingTime(content);

  // Headings analysis
  const hasHeadings = /<h[1-6]/i.test(content);
  if (!hasHeadings) {
    suggestions.push('Add headings to improve content structure');
  }

  // Images analysis
  const hasImages = /<img/i.test(content);
  if (!hasImages) {
    suggestions.push('Add images to improve engagement');
  }

  // Links analysis
  const hasInternalLinks = /<a[^>]+href=["'][^"']*\/[^"']*["'][^>]*>/i.test(content);
  const hasExternalLinks = /<a[^>]+href=["']https?:\/\/[^"']*["'][^>]*>/i.test(content);

  return {
    wordCount,
    readingTime,
    hasHeadings,
    hasImages,
    hasInternalLinks,
    hasExternalLinks,
    suggestions,
  };
}
