/**
 * Enhanced Security Headers Utility
 * 
 * Implements 2026 best practices for security headers including
 * nonce-based CSP, Permissions-Policy, and IPv6 support.
 * 
 * Version: 2.1.0
 * Updated: April 2026
 */

import { getSecurityConfig } from '../../../security.config';

export interface SecurityHeadersContext {
  nonce?: string;
  isDevelopment?: boolean;
  isProduction?: boolean;
  requestUrl?: string;
  userAgent?: string;
}

export interface CSPDirectives {
  'default-src'?: string[];
  'script-src'?: string[];
  'style-src'?: string[];
  'img-src'?: string[];
  'connect-src'?: string[];
  'font-src'?: string[];
  'object-src'?: string[];
  'media-src'?: string[];
  'frame-src'?: string[];
  'child-src'?: string[];
  'worker-src'?: string[];
  'manifest-src'?: string[];
  'frame-ancestors'?: string[];
  'form-action'?: string[];
  'base-uri'?: string[];
  'upgrade-insecure-requests'?: boolean;
}

export class SecurityHeadersBuilder {
  private headers: Map<string, string> = new Map();
  private context: SecurityHeadersContext;

  constructor(context: SecurityHeadersContext = {}) {
    this.context = {
      isDevelopment: process.env.NODE_ENV === 'development',
      isProduction: process.env.NODE_ENV === 'production',
      ...context
    };
  }

  // Content Security Policy with nonce support
  contentSecurityPolicy(directives: CSPDirectives, nonce?: string): this {
    const config = getSecurityConfig();
    
    if (!config.csp.enabled) {
      return this;
    }

    const cspDirectives = { ...config.csp.directives, ...directives };
    
    // Add nonce to script-src if provided
    if (nonce && cspDirectives['script-src']) {
      cspDirectives['script-src'].push(`'nonce-${nonce}'`);
      
      // Remove unsafe-inline when using nonces in production
      if (this.context.isProduction) {
        const unsafeInlineIndex = cspDirectives['script-src'].indexOf("'unsafe-inline'");
        if (unsafeInlineIndex > -1) {
          cspDirectives['script-src'].splice(unsafeInlineIndex, 1);
        }
      }
    }

    // Build CSP string
    const cspParts: string[] = [];
    
    Object.entries(cspDirectives).forEach(([directive, values]) => {
      if (directive === 'upgrade-insecure-requests' && values === true) {
        cspParts.push(directive);
      } else if (Array.isArray(values)) {
        cspParts.push(`${directive} ${values.join(' ')}`);
      }
    });

    const csp = cspParts.join('; ');
    this.headers.set('Content-Security-Policy', csp);

    // Add CSP-Report-Only header in development or testing
    if (this.context.isDevelopment || !this.context.isProduction) {
      this.headers.set('Content-Security-Policy-Report-Only', csp);
    }

    return this;
  }

  // HTTP Strict Transport Security
  strictTransportSecurity(options: {
    maxAge?: number;
    includeSubDomains?: boolean;
    preload?: boolean;
  } = {}): this {
    if (!this.context.isProduction) {
      return this;
    }

    const {
      maxAge = 31536000, // 1 year
      includeSubDomains = true,
      preload = true
    } = options;

    const directives = [`max-age=${maxAge}`];
    
    if (includeSubDomains) {
      directives.push('includeSubDomains');
    }
    
    if (preload) {
      directives.push('preload');
    }

    this.headers.set('Strict-Transport-Security', directives.join('; '));
    return this;
  }

  // Frame protection
  frameProtection(options: {
    action?: 'DENY' | 'SAMEORIGIN';
    allowFrom?: string;
  } = {}): this {
    const { action = 'DENY', allowFrom } = options;

    if (allowFrom) {
      this.headers.set('X-Frame-Options', `ALLOW-FROM ${allowFrom}`);
    } else {
      this.headers.set('X-Frame-Options', action);
    }

    return this;
  }

  // Content type protection
  contentTypeOptions(): this {
    this.headers.set('X-Content-Type-Options', 'nosniff');
    return this;
  }

  // XSS protection
  xssProtection(options: {
    enabled?: boolean;
    block?: boolean;
  } = {}): this {
    const { enabled = true, block = true } = options;

    if (enabled) {
      const value = block ? '1; mode=block' : '1';
      this.headers.set('X-XSS-Protection', value);
    }

    return this;
  }

  // Referrer policy
  referrerPolicy(policy: string = 'strict-origin-when-cross-origin'): this {
    this.headers.set('Referrer-Policy', policy);
    return this;
  }

  // Permissions Policy (new in 2026)
  permissionsPolicy(permissions: Record<string, string[]>): this {
    const permissionsArray: string[] = [];
    
    Object.entries(permissions).forEach(([feature, origins]) => {
      const value = origins.length > 0 ? `${feature}=(${origins.join(' ')})` : feature;
      permissionsArray.push(value);
    });

    this.headers.set('Permissions-Policy', permissionsArray.join(', '));
    return this;
  }

  // Cross-Origin policies
  crossOriginPolicies(options: {
    embedderPolicy?: 'require-corp' | 'unsafe-none';
    openerPolicy?: 'same-origin' | 'unsafe-none';
    resourcePolicy?: 'same-origin' | 'cross-origin';
  } = {}): this {
    const {
      embedderPolicy = 'require-corp',
      openerPolicy = 'same-origin',
      resourcePolicy = 'same-origin'
    } = options;

    this.headers.set('Cross-Origin-Embedder-Policy', embedderPolicy);
    this.headers.set('Cross-Origin-Opener-Policy', openerPolicy);
    this.headers.set('Cross-Origin-Resource-Policy', resourcePolicy);

    return this;
  }

  // DNS prefetch control
  dnsPrefetchControl(allow: boolean = false): this {
    this.headers.set('X-DNS-Prefetch-Control', allow ? 'on' : 'off');
    return this;
  }

  // Download options
  downloadOptions(options: {
    noOpen?: boolean;
  } = {}): this {
    const { noOpen = true } = options;

    if (noOpen) {
      this.headers.set('X-Download-Options', 'noopen');
    }

    return this;
  }

  // Permitted cross-domain policies
  permittedCrossDomainPolicies(policy: string = 'none'): this {
    this.headers.set('X-Permitted-Cross-Domain-Policies', policy);
    return this;
  }

  // Origin agent cluster
  originAgentCluster(enabled: boolean = true): this {
    this.headers.set('Origin-Agent-Cluster', enabled ? '?1' : '?0');
    return this;
  }

  // Remove powered by header
  hidePoweredBy(): this {
    this.headers.delete('X-Powered-By');
    return this;
  }

  // Custom security headers
  custom(name: string, value: string): this {
    this.headers.set(name, value);
    return this;
  }

  // Build headers object
  build(): Record<string, string> {
    return Object.fromEntries(this.headers);
  }

  // Apply to Response object
  applyToResponse(response: Response): void {
    this.headers.forEach((value, name) => {
      response.headers.set(name, value);
    });
  }

  // Apply to NextResponse object
  applyToNextResponse(response: any): void {
    this.headers.forEach((value, name) => {
      response.headers.set(name, value);
    });
  }
}

// Factory functions for common configurations
export function createDefaultSecurityHeaders(context?: SecurityHeadersContext): SecurityHeadersBuilder {
  const builder = new SecurityHeadersBuilder(context);
  
  return builder
    .contentSecurityPolicy({
      'default-src': ["'self'"],
      'script-src': ["'self'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", "data:", "https:"],
      'connect-src': ["'self'"],
      'font-src': ["'self'", "data:"],
      'object-src': ["'none'"],
      'media-src': ["'self'"],
      'frame-src': ["'none'"],
      'child-src': ["'none'"],
      'worker-src': ["'self'"],
      'manifest-src': ["'self'"],
      'frame-ancestors': ["'none'"],
      'form-action': ["'self'"],
      'base-uri': ["'self'"],
      'upgrade-insecure-requests': true
    }, context?.nonce)
    .strictTransportSecurity()
    .frameProtection()
    .contentTypeOptions()
    .xssProtection()
    .referrerPolicy()
    .permissionsPolicy({
      'geolocation': [],
      'microphone': [],
      'camera': [],
      'payment': [],
      'usb': [],
      'magnetometer': [],
      'gyroscope': [],
      'accelerometer': [],
      'ambient-light-sensor': [],
      'autoplay': [],
      'encrypted-media': [],
      'fullscreen': ['self'],
      'picture-in-picture': ['self']
    })
    .crossOriginPolicies()
    .dnsPrefetchControl(false)
    .downloadOptions()
    .permittedCrossDomainPolicies()
    .originAgentCluster()
    .hidePoweredBy();
}

export function createMarketingSiteHeaders(context?: SecurityHeadersContext): SecurityHeadersBuilder {
  const builder = new SecurityHeadersBuilder(context);
  
  return builder
    .contentSecurityPolicy({
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
      'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      'img-src': ["'self'", "data:", "https:", "https://www.google-analytics.com"],
      'connect-src': ["'self'", "https://www.google-analytics.com", "https://analytics.google.com"],
      'font-src': ["'self'", "data:", "https://fonts.gstatic.com"],
      'object-src': ["'none'"],
      'media-src': ["'self'"],
      'frame-src': ["'self'"], // Allow same-origin for embedded content
      'child-src': ["'none'"],
      'worker-src': ["'self'"],
      'manifest-src': ["'self'"],
      'frame-ancestors': ["'self'"], // More permissive for marketing sites
      'form-action': ["'self'"],
      'base-uri': ["'self'"],
      'upgrade-insecure-requests': true
    }, context?.nonce)
    .strictTransportSecurity()
    .frameProtection({ action: 'SAMEORIGIN' }) // More permissive for marketing
    .contentTypeOptions()
    .xssProtection()
    .referrerPolicy('strict-origin-when-cross-origin')
    .permissionsPolicy({
      'geolocation': ['self'],
      'microphone': [],
      'camera': [],
      'payment': [],
      'usb': [],
      'magnetometer': [],
      'gyroscope': [],
      'accelerometer': [],
      'ambient-light-sensor': [],
      'autoplay': ['self'],
      'encrypted-media': ['self'],
      'fullscreen': ['self'],
      'picture-in-picture': ['self']
    })
    .crossOriginPolicies()
    .dnsPrefetchControl(false)
    .downloadOptions()
    .permittedCrossDomainPolicies()
    .originAgentCluster()
    .hidePoweredBy();
}

export function createAPISecurityHeaders(context?: SecurityHeadersContext): SecurityHeadersBuilder {
  const builder = new SecurityHeadersBuilder(context);
  
  return builder
    .contentSecurityPolicy({
      'default-src': ["'self'"],
      'script-src': ["'self'"], // No unsafe-inline for APIs
      'style-src': ["'self'"], // No unsafe-inline for APIs
      'img-src': ["'self'", "data:"],
      'connect-src': ["'self'"],
      'font-src': ["'self'"],
      'object-src': ["'none'"],
      'media-src': ["'none'"],
      'frame-src': ["'none'"],
      'child-src': ["'none'"],
      'worker-src': ["'none'"],
      'manifest-src': ["'none'"],
      'frame-ancestors': ["'none'"],
      'form-action': ["'self'"],
      'base-uri': ["'self'"],
      'upgrade-insecure-requests': true
    }, context?.nonce)
    .strictTransportSecurity()
    .frameProtection()
    .contentTypeOptions()
    .xssProtection()
    .referrerPolicy('no-referrer') // Stricter for APIs
    .permissionsPolicy({
      'geolocation': [],
      'microphone': [],
      'camera': [],
      'payment': [],
      'usb': [],
      'magnetometer': [],
      'gyroscope': [],
      'accelerometer': [],
      'ambient-light-sensor': [],
      'autoplay': [],
      'encrypted-media': [],
      'fullscreen': [],
      'picture-in-picture': []
    })
    .crossOriginPolicies()
    .dnsPrefetchControl(false)
    .downloadOptions()
    .permittedCrossDomainPolicies()
    .originAgentCluster()
    .hidePoweredBy()
    .custom('X-API-Security', 'active');
}
