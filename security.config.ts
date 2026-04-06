/**
 * Security Configuration for Marketing Agency Monorepo
 * 
 * This file centralizes security settings across all applications and packages
 * in the monorepo, ensuring consistent security posture and compliance.
 * 
 * Version: 2.0.0
 * Updated: April 2026
 */

import { z, ZodError } from 'zod';

// Security configuration schema
const SecurityConfigSchema = z.object({
  // Content Security Policy
  csp: z.object({
    enabled: z.boolean(),
    directives: z.object({
      defaultSrc: z.array(z.string()),
      scriptSrc: z.array(z.string()),
      styleSrc: z.array(z.string()),
      imgSrc: z.array(z.string()),
      connectSrc: z.array(z.string()),
      fontSrc: z.array(z.string()),
      objectSrc: z.array(z.string()),
      mediaSrc: z.array(z.string()),
      frameSrc: z.array(z.string()),
      childSrc: z.array(z.string()),
      workerSrc: z.array(z.string()),
      manifestSrc: z.array(z.string()),
      upgradeInsecureRequests: z.boolean(),
      reportUri: z.array(z.string()).optional(),
      // Nonce support for dynamic content
      nonceSupport: z.boolean(),
      // Hash-based CSP for known inline scripts
      scriptHashes: z.array(z.string()),
      styleHashes: z.array(z.string()),
    }),
  }),
  
  // Authentication & Authorization
  auth: z.object({
    sessionTimeout: z.number().positive(),
    maxLoginAttempts: z.number().positive(),
    lockoutDuration: z.number().positive(),
    passwordPolicy: z.object({
      minLength: z.number().positive(),
      requireUppercase: z.boolean(),
      requireLowercase: z.boolean(),
      requireNumbers: z.boolean(),
      requireSpecialChars: z.boolean(),
    }),
    jwt: z.object({
      algorithm: z.enum(['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512']),
      expiresIn: z.string(),
      issuer: z.string(),
      audience: z.string(),
    }),
  }),
  
  // API Security
  api: z.object({
    rateLimiting: z.object({
      enabled: z.boolean(),
      windowMs: z.number().positive(),
      maxRequests: z.number().positive(),
      skipSuccessfulRequests: z.boolean(),
      skipFailedRequests: z.boolean(),
    }),
    cors: z.object({
      enabled: z.boolean(),
      origins: z.array(z.string()),
      methods: z.array(z.string()),
      allowedHeaders: z.array(z.string()),
      credentials: z.boolean(),
      maxAge: z.number().positive(),
    }),
    helmet: z.object({
      enabled: z.boolean(),
      contentSecurityPolicy: z.boolean(),
      crossOriginEmbedderPolicy: z.boolean(),
      crossOriginOpenerPolicy: z.boolean(),
      crossOriginResourcePolicy: z.boolean(),
      dnsPrefetchControl: z.boolean(),
      frameguard: z.boolean(),
      hidePoweredBy: z.boolean(),
      hsts: z.boolean(),
      ieNoOpen: z.boolean(),
      noSniff: z.boolean(),
      originAgentCluster: z.boolean(),
      permittedCrossDomainPolicies: z.boolean(),
      referrerPolicy: z.boolean(),
      xssFilter: z.boolean(),
    }),
  }),
  
  // Data Protection
  dataProtection: z.object({
    encryption: z.object({
      algorithm: z.enum(['AES-256-GCM', 'ChaCha20-Poly1305']),
      keyRotation: z.object({
        enabled: z.boolean(),
        interval: z.string(), // e.g., '90d', '6m'
      }),
    }),
    pii: z.object({
      enabled: z.boolean(),
      fields: z.array(z.string()),
      hashing: z.object({
        algorithm: z.enum(['bcrypt', 'argon2']),
        rounds: z.number().positive(),
      }),
    }),
    gdpr: z.object({
      enabled: z.boolean(),
      consentRequired: z.boolean(),
      dataRetention: z.object({
        enabled: z.boolean(),
        defaultPeriod: z.string(), // e.g., '365d', '2y'
      }),
    }),
  }),
  
  // Infrastructure Security
  infrastructure: z.object({
    environment: z.enum(['development', 'staging', 'production']),
    monitoring: z.object({
      enabled: z.boolean(),
      securityEvents: z.boolean(),
      errorTracking: z.boolean(),
      performanceMonitoring: z.boolean(),
      logLevel: z.enum(['error', 'warn', 'info', 'debug']),
    }),
    secrets: z.object({
      management: z.enum(['dotenv', 'vault', 'aws-secrets-manager', 'azure-key-vault']),
      rotation: z.object({
        enabled: z.boolean(),
        interval: z.string(),
      }),
    }),
  }),
  
  // Package Security
  packages: z.object({
    dependencyScanning: z.object({
      enabled: z.boolean(),
      frequency: z.enum(['on-push', 'daily', 'weekly']),
      failOnHighSeverity: z.boolean(),
      allowedLicenses: z.array(z.string()),
    }),
    supplyChain: z.object({
      checksumVerification: z.boolean(),
      signatureVerification: z.boolean(),
      trustedRegistries: z.array(z.string()),
    }),
  }),
});

// Export security configuration
export const securityConfig = SecurityConfigSchema.parse({
  csp: {
    enabled: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"], // Production: no unsafe-inline or unsafe-eval
      styleSrc: ["'self'"], // Production: no unsafe-inline
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
      reportUri: [], // Will be added dynamically for production/staging
      // Nonce support for dynamic content
      nonceSupport: true,
      // Hash-based CSP for known inline scripts (pre-calculated)
      scriptHashes: [
        "sha256-abcdef1234567890", // Example: React hydration script
        "sha256-bcdef1234567890a", // Example: Analytics inline script
      ],
      styleHashes: [
        "sha256-cdef1234567890ab", // Example: Critical CSS inline
      ],
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
    environment: (process.env.NODE_ENV as 'development' | 'staging' | 'production') || 'development',
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
});

// Environment-specific overrides
export const getSecurityConfig = (env?: string) => {
  const environment = env || securityConfig.infrastructure.environment;
  
  switch (environment) {
    case 'production':
      return {
        ...securityConfig,
        csp: {
          ...securityConfig.csp,
          directives: {
            ...securityConfig.csp.directives,
            scriptSrc: [
              "'self'", 
              ...securityConfig.csp.directives.scriptHashes.map(hash => `'${hash}'`)
            ], // Use hashes only, no unsafe-inline/eval
            styleSrc: [
              "'self'", 
              ...securityConfig.csp.directives.styleHashes.map(hash => `'${hash}'`)
            ], // Use hashes only, no unsafe-inline
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
      return {
        ...securityConfig,
        csp: {
          ...securityConfig.csp,
          directives: {
            ...securityConfig.csp.directives,
            scriptSrc: [
              "'self'", 
              "'unsafe-inline'", 
              "'unsafe-eval'" // Required for React development debugging
            ],
            styleSrc: [
              "'self'", 
              "'unsafe-inline'" // Required for development
            ],
          },
        },
      };
  }
};

// Security validation utilities
export const validateSecurityConfig = (config: typeof securityConfig) => {
  try {
    SecurityConfigSchema.parse(config);
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

// CSP utilities
export const generateNonce = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array)).replace(/[^a-zA-Z0-9]/g, '');
};

export const buildCSPHeader = (config: typeof securityConfig.csp, nonce?: string) => {
  const directives = { ...config.directives };
  
  // Add nonce to script-src and style-src if nonce support is enabled
  if (config.nonceSupport && nonce) {
    if (directives.scriptSrc && !directives.scriptSrc.includes("'unsafe-inline'")) {
      directives.scriptSrc = [...directives.scriptSrc, `'nonce-${nonce}'`];
    }
    if (directives.styleSrc && !directives.styleSrc.includes("'unsafe-inline'")) {
      directives.styleSrc = [...directives.styleSrc, `'nonce-${nonce}'`];
    }
  }
  
  // Add report-uri for CSP violation reporting (in production and staging)
  const env = process.env.NODE_ENV || 'development';
  if (['production', 'staging'].includes(env)) {
    directives.reportUri = ['/api/security/csp-violation'];
  }
  
  // Build CSP header string
  const cspString = Object.entries(directives)
    .filter(([key]) => key !== 'nonceSupport' && key !== 'scriptHashes' && key !== 'styleHashes')
    .map(([key, values]) => {
      const cspKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cspKey} ${values.join(' ')}`;
    })
    .join('; ');
    
  return cspString;
};

// Security headers utility
export const getSecurityHeaders = (env?: string, nonce?: string) => {
  const config = getSecurityConfig(env);
  const headers: Record<string, string> = {};
  
  // CSP Header
  if (config.csp.enabled) {
    headers['Content-Security-Policy'] = buildCSPHeader(config.csp, nonce);
    headers['Content-Security-Policy-Report-Only'] = ''; // For monitoring in development
  }
  
  // HSTS Header (enhanced for production)
  if (config.api.helmet.hsts && env === 'production') {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
  } else if (config.api.helmet.hsts && env === 'staging') {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
  }
  
  // Other security headers (enhanced)
  if (config.api.helmet.enabled) {
    headers['X-Frame-Options'] = 'DENY'; // Always deny for security
    headers['X-Content-Type-Options'] = 'nosniff';
    headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
    headers['X-XSS-Protection'] = '1; mode=block';
    
    // Enhanced Permissions Policy (more restrictive)
    const permissionsPolicy = [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
      'ambient-light-sensor=()',
      'autoplay=()',
      'encrypted-media=()',
      'fullscreen=(self)',
      'picture-in-picture=(self)',
    ];
    headers['Permissions-Policy'] = permissionsPolicy.join(', ');
    
    // Cross-origin policies (enhanced)
    headers['Cross-Origin-Embedder-Policy'] = 'require-corp';
    headers['Cross-Origin-Opener-Policy'] = 'same-origin';
    headers['Cross-Origin-Resource-Policy'] = 'same-origin';
    
    // Additional security headers
    headers['X-Permitted-Cross-Domain-Policies'] = 'none';
    headers['X-Download-Options'] = 'noopen';
    
    // Remove server information
    headers['Server'] = '';
    headers['X-Powered-By'] = '';
  }
  
  // Cache control headers for sensitive routes
  if (env === 'production') {
    headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate';
    headers['Pragma'] = 'no-cache';
    headers['Expires'] = '0';
  }
  
  return headers;
};

// Export types
export type SecurityConfig = z.infer<typeof SecurityConfigSchema>;
export type Environment = 'development' | 'staging' | 'production';

export default securityConfig;
