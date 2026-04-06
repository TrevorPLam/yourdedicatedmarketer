/**
 * CMS Configuration Contract
 * Defines configuration structure for CMS adapters
 */

export interface BaseCMSConfig {
  apiKey: string;
  environment?: string;
  timeout?: number;
  retryAttempts?: number;
}

export interface SanityConfig extends BaseCMSConfig {
  projectId: string;
  dataset: string;
  useCdn?: boolean;
}

export interface ContentfulConfig extends BaseCMSConfig {
  space: string;
  environment: string;
}

export type CMSConfig = SanityConfig | ContentfulConfig;

export type CMSProvider = 'sanity' | 'contentful';
