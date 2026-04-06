/**
 * Agency Website Security Middleware (Astro)
 * 
 * Security middleware for the agency website (Astro-based).
 * Provides security headers and rate limiting for the marketing site.
 * 
 * Version: 2.0.0
 * Updated: April 2026
 */

import { getSecurityConfig } from '../../../security.config';

// In-memory stores for development (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 1000, // Higher limit for marketing site
};

// Get client IP from request
function getClientIP(request: Request): string {
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  return cfConnectingIP || forwarded?.split(',')[0] || realIP || 'unknown';
}

// Check rate limit
function checkRateLimit(identifier: string): { allowed: boolean; retryAfter?: number; remaining?: number } {
  const now = Date.now();
  const key = `rate_limit:${identifier}`;
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    });
    return { allowed: true, remaining: RATE_LIMIT_CONFIG.maxRequests - 1 };
  }

  // Increment counter
  record.count++;

  // Check if limit exceeded
  if (record.count > RATE_LIMIT_CONFIG.maxRequests) {
    console.warn('Rate limit exceeded on agency website', {
      identifier,
      count: record.count,
      maxRequests: RATE_LIMIT_CONFIG.maxRequests,
    });
    
    return {
      allowed: false,
      retryAfter: Math.ceil(RATE_LIMIT_CONFIG.windowMs / 1000),
      remaining: 0,
    };
  }

  return { 
    allowed: true, 
    remaining: Math.max(0, RATE_LIMIT_CONFIG.maxRequests - record.count) 
  };
}

// Generate Content Security Policy
function generateCSP(): string {
  const config = getSecurityConfig();
  const directives = config.csp.directives;
  
  // Marketing site has more permissive CSP for analytics and marketing tools
  const cspDirectives = [
    `default-src ${directives.defaultSrc.join(' ')}`,
    `script-src ${directives.scriptSrc.join(' ')} 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com`,
    `style-src ${directives.styleSrc.join(' ')} 'unsafe-inline'`,
    `img-src ${directives.imgSrc.join(' ')} data: https: https://www.google-analytics.com`,
    `connect-src ${directives.connectSrc.join(' ')} https://www.google-analytics.com https://analytics.google.com`,
    `font-src ${directives.fontSrc.join(' ')} data: https:`,
    `object-src ${directives.objectSrc.join(' ')}`,
    `media-src ${directives.mediaSrc.join(' ')}`,
    `frame-src ${directives.frameSrc.join(' ')}`,
    `child-src ${directives.childSrc.join(' ')}`,
    `worker-src ${directives.workerSrc.join(' ')}`,
    `manifest-src ${directives.manifestSrc.join(' ')}`,
  ];

  return cspDirectives.join('; ');
}

// Astro middleware function
export async function onRequest({ request, response }: { request: Request; response: Response }): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  // Skip middleware for static assets
  if (
    pathname.startsWith('/_astro/') ||
    pathname.includes('.') && !pathname.endsWith('.html') // Static files
  ) {
    return response;
  }

  console.log('Agency website request', {
    pathname,
    clientIP,
    userAgent,
  });

  // Apply rate limiting
  const rateLimitResult = checkRateLimit(clientIP);
  
  if (!rateLimitResult.allowed) {
    console.warn('Rate limit exceeded on agency website', {
      clientIP,
      userAgent,
      retryAfter: rateLimitResult.retryAfter,
    });
    
    return new Response('Too many requests', {
      status: 429,
      headers: {
        'Retry-After': rateLimitResult.retryAfter?.toString() || '900',
        'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_CONFIG.windowMs).toISOString(),
      },
    });
  }

  // Add security headers
  const securityConfig = getSecurityConfig();
  const helmetConfig = securityConfig.api.helmet;
  
  if (helmetConfig.enabled) {
    // Content Security Policy
    if (helmetConfig.contentSecurityPolicy && securityConfig.csp.enabled) {
      const csp = generateCSP();
      response.headers.set('Content-Security-Policy', csp);
    }
    
    // Other security headers (slightly relaxed for marketing site)
    response.headers.set('X-Frame-Options', 'SAMEORIGIN'); // Allow same-origin for embedded content
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
    
    if (helmetConfig.hidePoweredBy) {
      response.headers.delete('X-Powered-By');
    }
    
    if (helmetConfig.hsts && securityConfig.infrastructure.environment === 'production') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }
  }
  
  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', RATE_LIMIT_CONFIG.maxRequests.toString());
  response.headers.set('X-RateLimit-Remaining', (rateLimitResult.remaining || 0).toString());
  response.headers.set('X-RateLimit-Reset', new Date(Date.now() + RATE_LIMIT_CONFIG.windowMs).toISOString());
  
  // Add marketing-specific headers
  response.headers.set('X-Site-Type', 'marketing-agency');
  response.headers.set('X-Request-ID', crypto.randomUUID());
  
  return response;
}

// Cleanup function for expired records
export function cleanupExpiredRecords(): void {
  const now = Date.now();
  
  // Clean rate limit records
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Auto-cleanup every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredRecords, 10 * 60 * 1000);
}
