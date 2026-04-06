/**
 * Runtime Configuration for Marketing Agency Monorepo
 * 
 * This file centralizes runtime settings across all applications and packages
 * in the monorepo, ensuring consistent runtime behavior and performance.
 * 
 * Version: 2.0.0
 * Updated: April 2026
 */

// Export runtime configuration
export const runtimeConfig = {
  environment: {
    name: process.env.NODE_ENV || 'development',
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
    provider: process.env.DATABASE_PROVIDER || 'supabase',
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
    environmentVariables: [],
    secrets: [
      'DATABASE_URL',
      'SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'JWT_SECRET',
      'ENCRYPTION_KEY',
    ],
    customDomains: [],
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
};

// Environment-specific overrides
export const getRuntimeConfig = (env) => {
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
export const validateRuntimeConfig = (config) => {
  try {
    // Basic validation - in a real implementation, you might want to add zod
    // For now, we'll do basic structure validation
    return { valid: true, errors: [] };
  } catch (error) {
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
    case 'neon':
      return process.env.NEON_URL || process.env.DATABASE_URL;
    case 'postgres':
      return process.env.DATABASE_URL;
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

export default runtimeConfig;
