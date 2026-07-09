/**
 * Content type definitions for the firm website.
 * These types are derived from Zod schemas to ensure single source of truth.
 */

import { z } from 'zod';
import { FAQSchema, ServiceSchema, IndustrySchema, DemoSchema, PageSchema } from '../schemas/content';

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
 * Service content type.
 * Represents a service offering provided by the firm.
 * Derived from ServiceSchema to ensure single source of truth.
 */
export type Service = z.infer<typeof ServiceSchema>;

/**
 * Industry content type.
 * Represents an industry vertical the firm serves.
 * Derived from IndustrySchema to ensure single source of truth.
 */
export type Industry = z.infer<typeof IndustrySchema>;

/**
 * Demo/Proof-of-Concept content type.
 * Represents a portfolio item or demo project.
 * Derived from DemoSchema to ensure single source of truth.
 */
export type Demo = z.infer<typeof DemoSchema>;

/**
 * FAQ content type.
 * Represents a frequently asked question.
 * Derived from FAQSchema to ensure single source of truth.
 */
export type FAQ = z.infer<typeof FAQSchema>;

/**
 * Page content type.
 * Represents a static page on the website.
 * Derived from PageSchema to ensure single source of truth.
 */
export type Page = z.infer<typeof PageSchema>;
