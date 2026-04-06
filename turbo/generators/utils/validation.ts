import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load the JSON schema
const schemaPath = join(__dirname, '../config/client-config.schema.json');
const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));

// Initialize AJV with format support
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Compile the schema
const validate = ajv.compile(schema);

export interface ClientConfig {
  client: {
    name: string;
    slug: string;
    domain?: string;
    framework: 'astro' | 'nextjs' | 'hybrid';
    database: 'supabase' | 'neon' | 'postgres';
    theme: 'default' | 'alpha' | 'beta' | 'gamma' | 'custom';
  };
  features: {
    blog?: boolean;
    contact?: boolean;
    portfolio?: boolean;
    analytics?: boolean;
    seo?: boolean;
    cms?: boolean;
    ecommerce?: boolean;
    auth?: boolean;
  };
  site: {
    title: string;
    description: string;
    url: string;
    author: string;
    image?: string;
    icon?: string;
    locale?: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    darkMode?: boolean;
    borderRadius?: string;
    fontFamily: string;
  };
  database: {
    provider: 'supabase' | 'neon' | 'postgres';
    realtime?: boolean;
    auth?: boolean;
    storage?: boolean;
    serverless?: boolean;
    pooling?: boolean;
    native?: boolean;
  };
  seo: {
    enableSitemap: boolean;
    enableRobotsTxt: boolean;
    enableStructuredData?: boolean;
    enableOpenGraph?: boolean;
    enableTwitterCards?: boolean;
    metaTitleTemplate: string;
    metaDescription: string;
  };
  analytics: {
    enabled: boolean;
    providers?: {
      googleAnalytics?: string;
      googleTagManager?: string;
      agencyDashboard?: boolean;
    };
  };
  content?: {
    provider?: string;
    enablePreview?: boolean;
    enableVisualEditor?: boolean;
    enableBlog?: boolean;
    blogPath?: string;
    postsPerPage?: number;
    enableComments?: boolean;
    enableCategories?: boolean;
    enableTags?: boolean;
    enablePortfolio?: boolean;
    portfolioPath?: string;
    projectsPerPage?: number;
  };
  contact: {
    enabled: boolean;
    email?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    };
    social?: {
      twitter?: string;
      linkedin?: string;
      facebook?: string;
      instagram?: string;
    };
  };
  ecommerce: {
    enabled: boolean;
    provider?: string;
    currency?: string;
    enableShipping?: boolean;
    enableTaxes?: boolean;
    enableInventory?: boolean;
  };
  auth: {
    enabled: boolean;
    provider?: string;
    enableSocialLogin?: boolean;
    enableEmailLogin?: boolean;
    enableMagicLink?: boolean;
    providers?: {
      google?: boolean;
      github?: boolean;
      twitter?: boolean;
      facebook?: boolean;
    };
  };
  performance: {
    enableImageOptimization: boolean;
    enableFontOptimization: boolean;
    enableCodeSplitting?: boolean;
    enableLazyLoading?: boolean;
    enableCaching?: boolean;
    enableCompression?: boolean;
    enableCDN?: boolean;
  };
  development: {
    enableHotReload: boolean;
    enableErrorReporting?: boolean;
    enablePerformanceMonitoring?: boolean;
    enableDebugMode?: boolean;
    enableStorybook?: boolean;
  };
}

export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
  warnings?: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
  path: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  recommendation?: string;
}

export function validateClientConfig(config: any): ValidationResult {
  const isValid = validate(config);

  if (isValid) {
    return {
      valid: true,
      warnings: generateWarnings(config),
    };
  }

  const errors: ValidationError[] =
    validate.errors?.map((error) => ({
      field: error.instancePath || error.schemaPath,
      message: error.message || 'Validation error',
      value: error.data,
      path: error.instancePath,
    })) || [];

  return {
    valid: false,
    errors,
    warnings: generateWarnings(config),
  };
}

function generateWarnings(config: ClientConfig): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Check for missing recommended features
  if (!config.analytics.enabled) {
    warnings.push({
      field: 'analytics.enabled',
      message: 'Analytics is disabled - you will miss important user insights',
      recommendation: 'Enable analytics to track user behavior and improve your site',
    });
  }

  if (!config.seo.enableSitemap && !config.seo.enableRobotsTxt) {
    warnings.push({
      field: 'seo',
      message: 'SEO features are disabled - search engine visibility may be reduced',
      recommendation: 'Enable sitemap and robots.txt for better SEO',
    });
  }

  // Check for security recommendations
  if (config.auth.enabled && !config.auth.enableSocialLogin) {
    warnings.push({
      field: 'auth.enableSocialLogin',
      message: 'Social login is disabled - users may have a harder time signing up',
      recommendation: 'Consider enabling social login for better user experience',
    });
  }

  // Check for performance optimizations
  if (!config.performance.enableImageOptimization || !config.performance.enableLazyLoading) {
    warnings.push({
      field: 'performance',
      message: 'Some performance optimizations are disabled - site may load slower',
      recommendation: 'Enable image optimization and lazy loading for better performance',
    });
  }

  // Check for development vs production settings
  if (config.development.enableDebugMode) {
    warnings.push({
      field: 'development.enableDebugMode',
      message: 'Debug mode is enabled - not recommended for production',
      recommendation: 'Disable debug mode in production environments',
    });
  }

  // Check for database-specific recommendations
  if (config.database.provider === 'supabase' && !config.database.realtime) {
    warnings.push({
      field: 'database.realtime',
      message: 'Real-time features are disabled - missing out on Supabase benefits',
      recommendation: 'Enable real-time features for dynamic content updates',
    });
  }

  // Check for theme consistency
  if (config.theme.primaryColor === config.theme.secondaryColor) {
    warnings.push({
      field: 'theme',
      message: 'Primary and secondary colors are the same - design may lack contrast',
      recommendation: 'Use different colors for better visual hierarchy',
    });
  }

  return warnings;
}

export function validateClientName(name: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!name || name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Client name is required',
      value: name,
      path: '',
    });
  }

  if (name.length > 100) {
    errors.push({
      field: 'name',
      message: 'Client name must be 100 characters or less',
      value: name,
      path: '',
    });
  }

  if (!/^[A-Za-z0-9\s\-_]+$/.test(name)) {
    errors.push({
      field: 'name',
      message: 'Client name can only contain letters, numbers, spaces, hyphens, and underscores',
      value: name,
      path: '',
    });
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

export function validateClientSlug(slug: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!slug || slug.trim().length === 0) {
    errors.push({
      field: 'slug',
      message: 'Client slug is required',
      value: slug,
      path: '',
    });
  }

  if (slug.length > 50) {
    errors.push({
      field: 'slug',
      message: 'Client slug must be 50 characters or less',
      value: slug,
      path: '',
    });
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    errors.push({
      field: 'slug',
      message: 'Client slug must contain only lowercase letters, numbers, and hyphens',
      value: slug,
      path: '',
    });
  }

  if (slug.startsWith('-') || slug.endsWith('-')) {
    errors.push({
      field: 'slug',
      message: 'Client slug cannot start or end with a hyphen',
      value: slug,
      path: '',
    });
  }

  if (slug.includes('--')) {
    errors.push({
      field: 'slug',
      message: 'Client slug cannot contain consecutive hyphens',
      value: slug,
      path: '',
    });
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

export function validateDomain(domain: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!domain || domain.trim().length === 0) {
    return { valid: true }; // Domain is optional
  }

  // Basic domain validation
  const domainRegex =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;

  if (!domainRegex.test(domain)) {
    errors.push({
      field: 'domain',
      message: 'Invalid domain format',
      value: domain,
      path: '',
    });
  }

  // Check for common TLDs
  const commonTlds = ['.com', '.org', '.net', '.io', '.co', '.app', '.dev', '.tech', '.store'];
  const hasCommonTld = commonTlds.some((tld) => domain.endsWith(tld));

  if (!hasCommonTld) {
    errors.push({
      field: 'domain',
      message: 'Domain should end with a common TLD',
      value: domain,
      path: '',
    });
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

export function validateColor(color: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!color || color.trim().length === 0) {
    errors.push({
      field: 'color',
      message: 'Color is required',
      value: color,
      path: '',
    });
  }

  const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

  if (!hexColorRegex.test(color)) {
    errors.push({
      field: 'color',
      message: 'Color must be a valid hex color (e.g., #FF0000)',
      value: color,
      path: '',
    });
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

// Utility function to format validation errors for display
export function formatValidationErrors(errors: ValidationError[]): string {
  return errors
    .map((error) => {
      const field = error.field.replace(/^\//, '').replace(/\//g, '.');
      return `• ${field}: ${error.message}`;
    })
    .join('\n');
}

// Utility function to format validation warnings for display
export function formatValidationWarnings(warnings: ValidationWarning[]): string {
  return warnings
    .map((warning) => {
      const field = warning.field.replace(/^\//, '').replace(/\//g, '.');
      let message = `⚠ ${field}: ${warning.message}`;
      if (warning.recommendation) {
        message += `\n  Recommendation: ${warning.recommendation}`;
      }
      return message;
    })
    .join('\n');
}
