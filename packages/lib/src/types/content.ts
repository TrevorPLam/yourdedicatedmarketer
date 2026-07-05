/**
 * Content type definitions for the firm website.
 * These interfaces define the structure of all content entities.
 */

/**
 * A branded type for URL-friendly slugs.
 * Prevents accidental substitution of regular strings where slugs are expected.
 */
export type Slug = string & { __brand: 'slug' };

/**
 * FAQ category union type.
 */
export type FAQCategory = 'general' | 'pricing' | 'process';

/**
 * Service content interface.
 * Represents a service offering provided by the firm.
 */
export interface Service {
  /** Display title of the service */
  title: string;
  /** URL-friendly identifier for the service */
  slug: Slug;
  /** Short description of the service */
  description: string;
  /** Full body content of the service page */
  body: string;
  /** Whether to feature this service prominently */
  featured?: boolean;
  /** Display order for sorting */
  order?: number;
}

/**
 * Industry content interface.
 * Represents an industry vertical the firm serves.
 */
export interface Industry {
  /** Display title of the industry */
  title: string;
  /** URL-friendly identifier for the industry */
  slug: Slug;
  /** Short description of the industry focus */
  description: string;
  /** Full body content of the industry page */
  body: string;
  /** Whether to feature this industry prominently */
  featured?: boolean;
  /** Display order for sorting */
  order?: number;
  /** Optional icon for the industry (emoji or icon identifier) */
  icon?: string;
}

/**
 * Demo/Proof-of-Concept content interface.
 * Represents a portfolio item or demo project.
 */
export interface Demo {
  /** Display title of the demo */
  title: string;
  /** URL-friendly identifier for the demo */
  slug: Slug;
  /** Short description of the demo */
  description: string;
  /** The challenge this demo addresses */
  challenge: string;
  /** The approach taken to solve the challenge */
  approach: string;
  /** The outcome or results achieved */
  outcome: string;
  /** The industry this demo relates to */
  industry: Slug;
}

/**
 * FAQ content interface.
 * Represents a frequently asked question.
 */
export interface FAQ {
  /** The question text */
  question: string;
  /** Short answer (40-60 words) */
  answer: string;
  /** Category for grouping FAQs */
  category: FAQCategory;
  /** Display order for sorting */
  order?: number;
}

/**
 * Page content interface.
 * Represents a static page on the website.
 */
export interface Page {
  /** Display title of the page */
  title: string;
  /** URL-friendly identifier for the page */
  slug: Slug;
  /** Short description of the page */
  description: string;
  /** Full body content of the page */
  body: string;
}
