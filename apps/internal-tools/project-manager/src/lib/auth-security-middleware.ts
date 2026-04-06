/**
 * Authentication Security Middleware
 * 
 * Provides rate limiting, account lockout, and security monitoring
 * for authentication endpoints in the marketing agency monorepo.
 * 
 * Version: 2.0.0
 * Updated: April 2026
 */

import { NextRequest, NextResponse } from 'next/server';
import { securityConfig } from '@/../../security.config';

// In-memory store for development (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number; lockoutUntil?: number }>();
const loginAttemptsStore = new Map<string, { attempts: number; lastAttempt: number; lockoutUntil?: number }>();

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: securityConfig.api.rateLimiting.maxRequests,
  lockoutDuration: securityConfig.auth.lockoutDuration,
  maxLoginAttempts: securityConfig.auth.maxLoginAttempts,
};

// Get client IP from request
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const ip = request.ip;
  
  return forwarded?.split(',')[0] || realIP || ip || 'unknown';
}

// Get user identifier from request body or headers
function getUserIdentifier(request: NextRequest): string | null {
  try {
    // Try to get email from request body for login attempts
    const url = request.url;
    if (url.includes('/api/auth/signin') || url.includes('/api/auth/callback/credentials')) {
      // For POST requests, we'd need to parse the body
      // This is a simplified version - in production, parse the actual request body
      const email = request.headers.get('x-user-email');
      return email || getClientIP(request);
    }
    
    return getClientIP(request);
  } catch (error) {
    console.error('Error getting user identifier:', error);
    return getClientIP(request);
  }
}

// Check rate limit
function checkRateLimit(identifier: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const key = `rate_limit:${identifier}`;
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    });
    return { allowed: true };
  }

  // Check if currently locked out
  if (record.lockoutUntil && now < record.lockoutUntil) {
    return {
      allowed: false,
      retryAfter: Math.ceil((record.lockoutUntil - now) / 1000),
    };
  }

  // Increment counter
  record.count++;

  // Check if limit exceeded
  if (record.count > RATE_LIMIT_CONFIG.maxRequests) {
    record.lockoutUntil = now + RATE_LIMIT_CONFIG.lockoutDuration;
    
    console.warn('Rate limit exceeded', {
      identifier,
      count: record.count,
      maxRequests: RATE_LIMIT_CONFIG.maxRequests,
      lockoutUntil: new Date(record.lockoutUntil).toISOString(),
    });
    
    return {
      allowed: false,
      retryAfter: Math.ceil(RATE_LIMIT_CONFIG.lockoutDuration / 1000),
    };
  }

  return { allowed: true };
}

// Check login attempts for account lockout
function checkLoginAttempts(email: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const key = `login_attempts:${email}`;
  const record = loginAttemptsStore.get(key);

  if (!record) {
    loginAttemptsStore.set(key, {
      attempts: 1,
      lastAttempt: now,
    });
    return { allowed: true };
  }

  // Check if currently locked out
  if (record.lockoutUntil && now < record.lockoutUntil) {
    return {
      allowed: false,
      retryAfter: Math.ceil((record.lockoutUntil - now) / 1000),
    };
  }

  // Reset if window has passed
  if (now - record.lastAttempt > RATE_LIMIT_CONFIG.windowMs) {
    record.attempts = 1;
    record.lastAttempt = now;
    return { allowed: true };
  }

  // Increment attempts
  record.attempts++;
  record.lastAttempt = now;

  // Check if max attempts exceeded
  if (record.attempts > RATE_LIMIT_CONFIG.maxLoginAttempts) {
    record.lockoutUntil = now + RATE_LIMIT_CONFIG.lockoutDuration;
    
    console.warn('Account locked due to too many login attempts', {
      email,
      attempts: record.attempts,
      maxAttempts: RATE_LIMIT_CONFIG.maxLoginAttempts,
      lockoutUntil: new Date(record.lockoutUntil).toISOString(),
    });
    
    return {
      allowed: false,
      retryAfter: Math.ceil(RATE_LIMIT_CONFIG.lockoutDuration / 1000),
    };
  }

  return { allowed: true };
}

// Clear login attempts on successful login
function clearLoginAttempts(email: string): void {
  const key = `login_attempts:${email}`;
  loginAttemptsStore.delete(key);
  
  console.log('Login attempts cleared after successful login', {
    email,
    timestamp: new Date().toISOString(),
  });
}

// Log security events
function logSecurityEvent(event: string, details: Record<string, any>): void {
  const logEntry = {
    event,
    timestamp: new Date().toISOString(),
    ...details,
  };
  
  console.log('Security Event:', JSON.stringify(logEntry));
  
  // In production, send to security monitoring service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to security monitoring system
  }
}

// Main middleware function
export function authSecurityMiddleware(request: NextRequest): NextResponse | null {
  const url = request.url;
  const method = request.method;
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  // Only apply to authentication endpoints
  if (!url.includes('/api/auth/')) {
    return null; // Let NextAuth handle other routes
  }

  const userIdentifier = getUserIdentifier(request);
  
  // Log authentication attempts
  logSecurityEvent('auth_request', {
    endpoint: url,
    method,
    clientIP,
    userAgent,
    userIdentifier,
  });

  // Apply rate limiting
  if (userIdentifier) {
    const rateLimitResult = checkRateLimit(userIdentifier);
    
    if (!rateLimitResult.allowed) {
      logSecurityEvent('rate_limit_exceeded', {
        userIdentifier,
        clientIP,
        retryAfter: rateLimitResult.retryAfter,
      });
      
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '900',
            'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_CONFIG.windowMs).toISOString(),
          },
        }
      );
    }

    // Apply login attempt tracking for credential-based auth
    if (url.includes('/api/auth/callback/credentials') && method === 'POST') {
      const email = request.headers.get('x-user-email');
      if (email) {
        const loginAttemptsResult = checkLoginAttempts(email);
        
        if (!loginAttemptsResult.allowed) {
          logSecurityEvent('account_locked', {
            email,
            clientIP,
            retryAfter: loginAttemptsResult.retryAfter,
          });
          
          return NextResponse.json(
            { error: 'Account temporarily locked due to too many failed login attempts. Please try again later.' },
            { 
              status: 423,
              headers: {
                'Retry-After': loginAttemptsResult.retryAfter?.toString() || '900',
                'X-Account-Lockout': 'true',
              },
            }
          );
        }
      }
    }
  }

  // Add security headers
  const response = NextResponse.next();
  
  // Add rate limit headers
  if (userIdentifier) {
    const record = rateLimitStore.get(`rate_limit:${userIdentifier}`);
    if (record) {
      response.headers.set('X-RateLimit-Limit', RATE_LIMIT_CONFIG.maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT_CONFIG.maxRequests - record.count).toString());
      response.headers.set('X-RateLimit-Reset', new Date(record.resetTime).toISOString());
    }
  }
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  
  logSecurityEvent('auth_request_allowed', {
    endpoint: url,
    method,
    clientIP,
    userIdentifier,
  });

  return null; // Let NextAuth handle the request
}

// Export utility functions for use in auth routes
export { clearLoginAttempts, checkLoginAttempts, checkRateLimit };

// Cleanup function for expired records (call periodically)
export function cleanupExpiredRecords(): void {
  const now = Date.now();
  
  // Clean rate limit records
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime && (!record.lockoutUntil || now > record.lockoutUntil)) {
      rateLimitStore.delete(key);
    }
  }
  
  // Clean login attempt records
  for (const [key, record] of loginAttemptsStore.entries()) {
    if (now > record.lastAttempt + RATE_LIMIT_CONFIG.windowMs && (!record.lockoutUntil || now > record.lockoutUntil)) {
      loginAttemptsStore.delete(key);
    }
  }
}

// Auto-cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredRecords, 5 * 60 * 1000);
}
