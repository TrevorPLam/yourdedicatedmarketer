/**
 * Platform Barrel File
 * 
 * WARNING: This barrel file has 10 exports.
 * Consider splitting into smaller, focused barrel files:
 * - adapters/index.ts
 * - types/index.ts  
 * - utils/index.ts
 * - contracts/index.ts
 */

/**
 * CMS Platform Package - Main Exports
 * Multi-provider CMS adapters and utilities with 2026 best practices
 */

// Core types and interfaces
export * from './types/cms.types';
export * from './contracts/cms-adapter.contract';
export * from './contracts/cms-config.contract';

// CMS adapters
export { SanityAdapter } from './adapters/sanity.adapter';
export { ContentfulAdapter } from './adapters/contentful.adapter';

// Factory and utilities
export { cmsAdapterFactory } from './interfaces/cms.adapter';
export { generateCMSTypes } from './generators/type-generator';

// Version information
export const CMS_PACKAGE_VERSION = '1.0.0';
export const SUPPORTED_PROVIDERS = ['contentful', 'sanity'] as const;

/**
 * Create a CMS adapter for the specified provider
 */
export function createCMSAdapter(config: any): any {
  return cmsAdapterFactory.create(config);
}

