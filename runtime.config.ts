/**
 * Runtime Configuration for Marketing Agency Monorepo
 * 
 * This file centralizes runtime settings across all applications and packages
 * in the monorepo, ensuring consistent runtime behavior and performance.
 * 
 * Version: 2.0.0
 * Updated: April 2026
 */

import { z, ZodError } from 'zod';
import type { SecurityConfig } from './security.config';

// Runtime configuration schema
const RuntimeConfigSchema = z.object({
  // Environment Configuration
  environment: z.object({
    name: z.enum(['development', 'staging', 'production']),
    debug: z.boolean(),
    verbose: z.boolean(),
    hotReload: z.boolean(),
    sourceMaps: z.boolean(),
  }),
  
  // Server Configuration
  server: z.object({
    port: z.number().positive().max(65535),
    host: z.string(),
    https: z.boolean(),
    cors: z.boolean(),
    compression: z.boolean(),
    bodyLimit: z.string(),
    timeout: z.number().positive(),
  }),
  
  // Database Configuration - Based on actual workspace providers
  database: z.object({
    provider: z.literal('supabase'), // Only Supabase is actively used
    ssl: z.boolean(),
    poolSize: z.number().positive(),
    connectionTimeout: z.number().positive(),
    queryTimeout: z.number().positive(),
    retryAttempts: z.number().positive(),
    retryDelay: z.number().positive(),
  }),
  
  // Cache Configuration - Based on actual workspace setup
  cache: z.object({
    enabled: z.boolean(),
    provider: z.literal('memory'), // Only memory cache is configured
    ttl: z.number().positive(),
    maxSize: z.string(),
    compression: z.boolean(),
    invalidationStrategy: z.literal('time-based'), // Only time-based is used
  }),
  
  // Performance Configuration
  performance: z.object({
    bundling: z.object({
      minification: z.boolean(),
      treeshaking: z.boolean(),
      codeSplitting: z.boolean(),
      compression: z.boolean(),
    }),
    monitoring: z.object({
      enabled: z.boolean(),
      metrics: z.boolean(),
      profiling: z.boolean(),
      traces: z.boolean(),
      sampleRate: z.number().min(0).max(1),
    }),
    optimization: z.object({
      imageOptimization: z.boolean(),
      fontOptimization: z.boolean(),
      cssOptimization: z.boolean(),
      jsOptimization: z.boolean(),
    }),
  }),
  
  // Feature Flags
  features: z.object({
    analytics: z.boolean(),
    errorTracking: z.boolean(),
    performanceMonitoring: z.boolean(),
    logging: z.boolean(),
    debugging: z.boolean(),
    testing: z.boolean(),
    a11yTesting: z.boolean(),
    visualRegression: z.boolean(),
  }),
  
  // Client Configuration - Based on actual workspace setup
  client: z.object({
    framework: z.enum(['astro', 'nextjs']), // Astro and Next.js are actively used
    rendering: z.enum(['ssr', 'ssg', 'csr', 'hybrid']),
    hydration: z.boolean(),
    prefetching: z.boolean(),
    lazyLoading: z.boolean(),
    serviceWorker: z.boolean(),
  }),
  
  // Build Configuration - Based on actual workspace setup
  build: z.object({
    output: z.enum(['static', 'server', 'hybrid']),
    target: z.enum(['es2015', 'es2016', 'es2017', 'es2018', 'es2019', 'es2020', 'es2021', 'es2022']),
    nodeVersion: z.string(),
    platform: z.literal('node'), // Node.js is primary platform
    experimentalFeatures: z.array(z.string()),
  }),
  
  // Deployment Configuration - Based on actual workspace setup
  deployment: z.object({
    platform: z.literal('vercel'), // Vercel is primary deployment platform
    region: z.string(),
    environmentVariables: z.record(z.string(), z.record(z.string(), z.string())),
    secrets: z.array(z.string()),
    customDomains: z.array(z.string()),
    ssl: z.boolean(),
  }),
  
  // Monitoring Configuration - Based on actual workspace dependencies
  monitoring: z.object({
    sentry: z.object({
      enabled: z.boolean(),
      dsn: z.string().optional(),
      environment: z.string(),
      sampleRate: z.number().min(0).max(1),
      tracesSampleRate: z.number().min(0).max(1),
    }),
    analytics: z.object({
      enabled: z.boolean(),
      provider: z.enum(['google-analytics', 'vercel-analytics', 'plausible', 'custom']),
      trackingId: z.string().optional(),
      sampleRate: z.number().min(0).max(1),
    }),
    performance: z.object({
      enabled: z.boolean(),
      provider: z.literal('vitals'), // Using web-vitals from monitoring package
      apiKey: z.string().optional(),
      reportInterval: z.string(),
    }),
  }),
});

// Export runtime configuration
export const runtimeConfig = RuntimeConfigSchema.parse({
  environment: {
    name: (process.env.NODE_ENV as 'development' | 'staging' | 'production') || 'development',
    debug: process.env.NODE_ENV === 'development',
    verbose: process.env.VERBOSE === 'true',
    hotReload: process.env.NODE_ENV === 'development',
    sourceMaps: process.env.NODE_ENV !== 'production',
  },
  
  server: {
    port: parseInt(process.env.PORT || '3000'),
    host: process.env.HOST || 'localhost',
    https: process.env.HTTPS === 'true',
    cors: true,
    compression: true,
    bodyLimit: '10mb',
    timeout: 30000, // 30 seconds
  },
  
  database: {
    provider: (process.env.DATABASE_PROVIDER as 'supabase') || 'supabase',
    ssl: process.env.NODE_ENV === 'production',
    poolSize: parseInt(process.env.DB_POOL_SIZE || '10'),
    connectionTimeout: 10000, // 10 seconds
    queryTimeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },
  
  cache: {
    enabled: true,
    provider: 'memory',
    ttl: 3600, // 1 hour in seconds
    maxSize: '100mb',
    compression: true,
    invalidationStrategy: 'time-based',
  },
  
  performance: {
    bundling: {
      minification: process.env.NODE_ENV === 'production',
      treeshaking: true,
      codeSplitting: true,
      compression: process.env.NODE_ENV === 'production',
    },
    monitoring: {
      enabled: true,
      metrics: true,
      profiling: process.env.NODE_ENV !== 'production',
      traces: process.env.NODE_ENV === 'production',
      sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    },
    optimization: {
      imageOptimization: true,
      fontOptimization: true,
      cssOptimization: true,
      jsOptimization: true,
    },
  },
  
  features: {
    analytics: process.env.ENABLE_ANALYTICS === 'true',
    errorTracking: process.env.ENABLE_ERROR_TRACKING === 'true',
    performanceMonitoring: process.env.ENABLE_PERFORMANCE_MONITORING === 'true',
    logging: true,
    debugging: process.env.NODE_ENV === 'development',
    testing: process.env.NODE_ENV === 'development',
    a11yTesting: process.env.NODE_ENV === 'development',
    visualRegression: process.env.NODE_ENV === 'development',
  },
  
  client: {
    framework: 'astro', // Default framework for new projects
    rendering: 'ssr', // Server-side rendering by default
    hydration: true,
    prefetching: true,
    lazyLoading: true,
    serviceWorker: process.env.NODE_ENV === 'production',
  },
  
  build: {
    output: 'static',
    target: 'es2022',
    nodeVersion: '22.12.0',
    platform: 'node',
    experimentalFeatures: [
      'turbo-cache',
      'react-compiler',
      'partial-prerendering',
    ],
  },
  
  deployment: {
    platform: 'vercel',
    region: 'us-east-1',
    environmentVariables: {}, // Empty object for now
    secrets: [
      'DATABASE_URL',
      'SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'JWT_SECRET',
      'ENCRYPTION_KEY',
    ],
    customDomains: [], // Empty array for now
    ssl: true,
  },
  
  monitoring: {
    sentry: {
      enabled: process.env.SENTRY_DSN ? true : false,
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      sampleRate: 1.0,
      tracesSampleRate: 0.1,
    },
    analytics: {
      enabled: process.env.GOOGLE_ANALYTICS_ID ? true : false,
      provider: 'google-analytics',
      trackingId: process.env.GOOGLE_ANALYTICS_ID,
      sampleRate: 1.0,
    },
    performance: {
      enabled: true,
      provider: 'vitals',
      apiKey: undefined, // Using built-in vitals
      reportInterval: '24h',
    },
  },
});

// Environment-specific overrides
export const getRuntimeConfig = (env?: string) => {
  const environment = env || runtimeConfig.environment.name;
  
  switch (environment) {
    case 'production':
      return {
        ...runtimeConfig,
        environment: {
          ...runtimeConfig.environment,
          debug: false,
          verbose: false,
          hotReload: false,
          sourceMaps: false,
        },
        performance: {
          ...runtimeConfig.performance,
          monitoring: {
            ...runtimeConfig.performance.monitoring,
            profiling: false,
            sampleRate: 0.1, // 10% sampling in production
          },
        },
        features: {
          ...runtimeConfig.features,
          debugging: false,
          testing: false,
          a11yTesting: false,
          visualRegression: false,
        },
        build: {
          ...runtimeConfig.build,
          output: 'static',
          experimentalFeatures: [
            'turbo-cache',
            'react-compiler',
            'partial-prerendering',
          ],
        },
      };
      
    case 'staging':
      return {
        ...runtimeConfig,
        environment: {
          ...runtimeConfig.environment,
          debug: false,
          verbose: true,
          hotReload: false,
          sourceMaps: true,
        },
        performance: {
          ...runtimeConfig.performance,
          monitoring: {
            ...runtimeConfig.performance.monitoring,
            profiling: true,
            sampleRate: 0.5, // 50% sampling in staging
          },
        },
        features: {
          ...runtimeConfig.features,
          debugging: true,
          testing: true,
          a11yTesting: true,
          visualRegression: true,
        },
        build: {
          ...runtimeConfig.build,
          output: 'static',
          experimentalFeatures: [
            'turbo-cache',
            'react-compiler',
            'partial-prerendering',
          ],
        },
      };
      
    case 'development':
    default:
      return {
        ...runtimeConfig,
        environment: {
          ...runtimeConfig.environment,
          debug: true,
          verbose: true,
          hotReload: true,
          sourceMaps: true,
        },
        performance: {
          ...runtimeConfig.performance,
          monitoring: {
            ...runtimeConfig.performance.monitoring,
            profiling: true,
            sampleRate: 1.0, // 100% sampling in development
          },
        },
        features: {
          ...runtimeConfig.features,
          debugging: true,
          testing: true,
          a11yTesting: true,
          visualRegression: true,
        },
        build: {
          ...runtimeConfig.build,
          experimentalFeatures: [
            'turbo-cache',
            'react-compiler',
            'partial-prerendering',
            'fast-refresh',
            'hmr',
          ],
        },
      };
  }
};

// Runtime validation utilities
export const validateRuntimeConfig = (config: typeof runtimeConfig) => {
  try {
    RuntimeConfigSchema.parse(config);
    return { valid: true, errors: [] };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        valid: false,
        errors: error.issues.map((err: any) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return { valid: false, errors: [{ path: 'unknown', message: 'Validation error' }] };
  }
};

// Configuration helpers
export const isDevelopment = () => runtimeConfig.environment.name === 'development';
export const isProduction = () => runtimeConfig.environment.name === 'production';
export const isStaging = () => runtimeConfig.environment.name === 'staging';

export const getDatabaseUrl = () => {
  switch (runtimeConfig.database.provider) {
    case 'supabase':
      return process.env.SUPABASE_URL || process.env.DATABASE_URL;
    default:
      return process.env.DATABASE_URL;
  }
};

export const getCacheConfig = () => {
  return {
    enabled: runtimeConfig.cache.enabled,
    provider: runtimeConfig.cache.provider,
    options: {
      ttl: runtimeConfig.cache.ttl,
      maxSize: runtimeConfig.cache.maxSize,
      compression: runtimeConfig.cache.compression,
      invalidationStrategy: runtimeConfig.cache.invalidationStrategy,
    },
  };
};

// Export types
export type RuntimeConfig = z.infer<typeof RuntimeConfigSchema>;
export type Environment = 'development' | 'staging' | 'production';
export type DatabaseProvider = 'supabase';
export type CacheProvider = 'memory';
export type Framework = 'astro' | 'nextjs';
export type RenderingStrategy = 'ssr' | 'ssg' | 'csr' | 'hybrid';
export type DeploymentPlatform = 'vercel';

export default runtimeConfig;
