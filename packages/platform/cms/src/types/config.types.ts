/**
 * Provider-specific configuration types
 * Extends the base CMSConfig with provider-specific options
 */

import type { CMSConfig } from './cms.types';

// ============================================================================
// Contentful Configuration
// ============================================================================

export interface ContentfulConfig extends CMSConfig {
  provider: 'contentful';
  spaceId: string;
  accessToken: string;
  environment?: string;
  previewAccessToken?: string;
  host?: string;
  basePath?: string;
  httpAgent?: any;
  httpsAgent?: any;
  proxy?: {
    host: string;
    port: number;
    auth?: {
      username: string;
      password: string;
    };
  };
  resolveLinks?: boolean;
  removeUnresolved?: boolean;
  includeContentSource?: boolean;
}

// ============================================================================
// Sanity Configuration
// ============================================================================

export interface SanityConfig extends CMSConfig {
  provider: 'sanity';
  projectId: string;
  dataset: string;
  apiVersion: string;
  useCdn?: boolean;
  perspective?: string;
  token?: string;
  withCredentials?: boolean;
  requestTagPrefix?: string;
  stega?: {
    enabled: boolean;
    studioUrl: string;
    logger?: any;
  };
  ignoreBrowserTokenWarning?: boolean;
  filterResponse?: boolean;
}

// ============================================================================
// Strapi Configuration
// ============================================================================

export interface StrapiConfig extends CMSConfig {
  provider: 'strapi';
  url: string;
  prefix?: string;
  timeout?: number;
  headers?: Record<string, string>;
  auth?:
    | {
        identifier: string;
        password: string;
      }
    | {
        token: string;
      };
  axiosConfig?: {
    headers?: Record<string, string>;
    timeout?: number;
    withCredentials?: boolean;
  };
}

// ============================================================================
// Custom CMS Configuration
// ============================================================================

export interface CustomCMSConfig extends CMSConfig {
  provider: 'custom';
  client: any; // Custom CMS client instance
  customOptions?: Record<string, any>;
}

// ============================================================================
// Configuration Union Type
// ============================================================================

export type AnyCMSConfig = ContentfulConfig | SanityConfig | StrapiConfig | CustomCMSConfig;

// ============================================================================
// Configuration Validation
// ============================================================================

export interface ConfigValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ConfigValidator {
  validate(config: CMSConfig): ConfigValidationResult;
}

// ============================================================================
// Environment Variable Mapping
// ============================================================================

export interface EnvironmentConfig {
  // Contentful
  CONTENTFUL_SPACE_ID?: string;
  CONTENTFUL_ACCESS_TOKEN?: string;
  CONTENTFUL_ENVIRONMENT?: string;
  CONTENTFUL_PREVIEW_ACCESS_TOKEN?: string;

  // Sanity
  SANITY_PROJECT_ID?: string;
  SANITY_DATASET?: string;
  SANITY_API_VERSION?: string;
  SANITY_TOKEN?: string;

  // Strapi
  STRAPI_URL?: string;
  STRAPI_TOKEN?: string;

  // Common
  CMS_CACHE_ENABLED?: string;
  CMS_CACHE_TTL?: string;
  CMS_RETRY_ATTEMPTS?: string;
  CMS_RETRY_DELAY?: string;
  CMS_RATE_LIMIT_RPS?: string;
}

// ============================================================================
// Configuration Factory
// ============================================================================

export interface CMSConfigFactory {
  createContentfulConfig(options: Partial<ContentfulConfig>): ContentfulConfig;
  createSanityConfig(options: Partial<SanityConfig>): SanityConfig;
  createStrapiConfig(options: Partial<StrapiConfig>): StrapiConfig;
  createCustomConfig(options: Partial<CustomCMSConfig>): CustomCMSConfig;
  fromEnvironment(provider: CMSConfig['provider'], env?: EnvironmentConfig): AnyCMSConfig;
}
