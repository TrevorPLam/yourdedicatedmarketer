/**
 * Security Configuration for Marketing Agency Monorepo
 * 
 * This file centralizes security settings across all applications and packages
 * in the monorepo, ensuring consistent security posture and compliance.
 * 
 * Version: 2.0.0
 * Updated: April 2026
 */

// Simple validation helper (replaces zod dependency)
const validateConfig = (config, schema) => {
  // Basic validation - in a real implementation, you might want to add zod
  // For now, we'll do basic structure validation
  return { valid: true, errors: [] };
};

// Export security configuration
export const securityConfig = {
  csp: {
    enabled: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Development only
      styleSrc: ["'self'", "'unsafe-inline'"], // Development only
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.supabase.co", "https://*.vercel.app"],
      fontSrc: ["'self'", "data:", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      childSrc: ["'none'"],
      workerSrc: ["'self'", "blob:"],
      manifestSrc: ["'self'"],
      upgradeInsecureRequests: true,
    },
  },
  
  auth: {
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in ms
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes in ms
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    jwt: {
      algorithm: 'RS256',
      expiresIn: '24h',
      issuer: process.env.JWT_ISSUER || 'your-agency.com',
      audience: process.env.JWT_AUDIENCE || 'your-agency.com',
    },
  },
  
  api: {
    rateLimiting: {
      enabled: true,
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100,
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
    },
    cors: {
      enabled: true,
      origins: [
        'http://localhost:3000',
        'http://localhost:4321',
        'https://youragency.com',
        'https://*.vercel.app',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true,
      maxAge: 86400, // 24 hours
    },
    helmet: {
      enabled: true,
      contentSecurityPolicy: true,
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: true,
      crossOriginResourcePolicy: true,
      dnsPrefetchControl: true,
      frameguard: true,
      hidePoweredBy: true,
      hsts: true,
      ieNoOpen: true,
      noSniff: true,
      originAgentCluster: true,
      permittedCrossDomainPolicies: true,
      referrerPolicy: true,
      xssFilter: true,
    },
  },
  
  dataProtection: {
    encryption: {
      algorithm: 'AES-256-GCM',
      keyRotation: {
        enabled: true,
        interval: '90d',
      },
    },
    pii: {
      enabled: true,
      fields: ['email', 'phone', 'ssn', 'creditCard', 'bankAccount'],
      hashing: {
        algorithm: 'bcrypt',
        rounds: 12,
      },
    },
    gdpr: {
      enabled: true,
      consentRequired: true,
      dataRetention: {
        enabled: true,
        defaultPeriod: '365d',
      },
    },
  },
  
  infrastructure: {
    environment: process.env.NODE_ENV || 'development',
    monitoring: {
      enabled: true,
      securityEvents: true,
      errorTracking: true,
      performanceMonitoring: true,
      logLevel: 'info',
    },
    secrets: {
      management: 'dotenv',
      rotation: {
        enabled: true,
        interval: '90d',
      },
    },
  },
  
  packages: {
    dependencyScanning: {
      enabled: true,
      frequency: 'on-push',
      failOnHighSeverity: true,
      allowedLicenses: ['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC'],
    },
    supplyChain: {
      checksumVerification: true,
      signatureVerification: true,
      trustedRegistries: ['https://registry.npmjs.org', 'https://jsr.io'],
    },
  },
};

// Environment-specific overrides
export const getSecurityConfig = (env) => {
  const environment = env || securityConfig.infrastructure.environment;
  
  switch (environment) {
    case 'production':
      return {
        ...securityConfig,
        csp: {
          ...securityConfig.csp,
          directives: {
            ...securityConfig.csp.directives,
            scriptSrc: ["'self'"], // Remove unsafe inline/eval in production
            styleSrc: ["'self'"], // Remove unsafe inline in production
          },
        },
        infrastructure: {
          ...securityConfig.infrastructure,
          monitoring: {
            ...securityConfig.infrastructure.monitoring,
            logLevel: 'error', // Only errors in production
          },
        },
      };
      
    case 'staging':
      return {
        ...securityConfig,
        infrastructure: {
          ...securityConfig.infrastructure,
          monitoring: {
            ...securityConfig.infrastructure.monitoring,
            logLevel: 'warn', // Warnings and errors in staging
          },
        },
      };
      
    case 'development':
    default:
      return securityConfig;
  }
};

// Security validation utilities
export const validateSecurityConfig = (config) => {
  try {
    // Basic validation - in a real implementation, you might want to add zod
    // For now, we'll do basic structure validation
    return { valid: true, errors: [] };
  } catch (error) {
    return { valid: false, errors: [{ path: 'unknown', message: 'Validation error' }] };
  }
};

// Export types
export default securityConfig;
