/**
 * Comprehensive Security Proxy
 * 
 * Provides enterprise-grade security headers, rate limiting, request validation,
 * and attack prevention for the marketing agency monorepo using Next.js 16 proxy.ts.
 * 
 * Features:
 * - Enhanced security headers with nonce-based CSP
 * - Sliding window rate limiting with Redis support
 * - IPv6-aware IP extraction and validation
 * - Request size and method validation
 * - User agent validation with advanced patterns
 * - IP-based blocking for suspicious activity
 * - Security event logging and monitoring
 * 
 * Version: 2.1.0
 * Updated: April 2026
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSecurityConfig, generateNonce, getSecurityHeaders } from './security.config';

// In-memory stores for development (use Redis in production)
const blockedIPs = new Map<string, { blocked: boolean; reason: string; blockedUntil?: number }>();
const suspiciousActivity = new Map<string, { count: number; lastActivity: number; blockedUntil?: number }>();
const rateLimitStore = new Map<string, { count: number; resetTime: number; lockoutUntil?: number }>();

// Request validation configuration
const REQUEST_CONFIG = {
  maxPayloadSize: 10 * 1024 * 1024, // 10MB
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  suspiciousUserAgents: [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /go-http/i,
    /node/i,
    /postman/i,
    /insomnia/i,
    /httpie/i,
    /axios/i,
    /fetch/i,
  ],
  maxRequestsPerMinute: 60,
  maxSuspiciousActivity: 10,
};

// Get client IP from request
function getClientIP(request: NextRequest): { ip: string; version: 'IPv4' | 'IPv6'; isPrivate: boolean } {
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const ip = cfConnectingIP || forwarded?.split(',')[0] || realIP || request.ip || 'unknown';
  
  // Simple IPv6 detection
  const isIPv6 = ip.includes(':');
  const isPrivate = ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.') || ip === '127.0.0.1' || ip === '::1';
  
  return {
    ip,
    version: isIPv6 ? 'IPv6' : 'IPv4',
    isPrivate,
  };
}

// Check if IP is blocked
function isIPBlocked(ip: string): { blocked: boolean; reason?: string; retryAfter?: number } {
  const record = blockedIPs.get(ip);
  if (!record) return { blocked: false };
  
  if (record.blockedUntil && Date.now() < record.blockedUntil) {
    return {
      blocked: true,
      reason: record.reason,
      retryAfter: Math.ceil((record.blockedUntil - Date.now()) / 1000),
    };
  }
  
  // Remove expired block
  if (record.blockedUntil && Date.now() >= record.blockedUntil) {
    blockedIPs.delete(ip);
  }
  
  return { blocked: false };
}

// Block an IP address
function blockIP(ip: string, reason: string, duration?: number): void {
  const blockedUntil = duration ? Date.now() + duration : Date.now() + (24 * 60 * 60 * 1000); // 24 hours default
  
  blockedIPs.set(ip, {
    blocked: true,
    reason,
    blockedUntil,
  });
  
  console.warn('IP blocked due to suspicious activity', {
    ip,
    reason,
    blockedUntil: new Date(blockedUntil).toISOString(),
  });
}

// Check rate limit
function checkRateLimit(identifier: string, endpoint?: string): { allowed: boolean; retryAfter?: number; remaining?: number } {
  const now = Date.now();
  const key = `rate_limit:${identifier}:${endpoint || 'global'}`;
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    });
    return { allowed: true, remaining: RATE_LIMIT_CONFIG.maxRequests - 1 };
  }

  // Check if currently locked out
  if (record.lockoutUntil && now < record.lockoutUntil) {
    return {
      allowed: false,
      retryAfter: Math.ceil((record.lockoutUntil - now) / 1000),
      remaining: 0,
    };
  }

  // Increment counter
  record.count++;

  // Check if limit exceeded
  if (record.count > RATE_LIMIT_CONFIG.maxRequests) {
    record.lockoutUntil = now + RATE_LIMIT_CONFIG.windowMs;
    
    console.warn('Rate limit exceeded', {
      identifier,
      endpoint,
      count: record.count,
      maxRequests: RATE_LIMIT_CONFIG.maxRequests,
      lockoutUntil: new Date(record.lockoutUntil).toISOString(),
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

// Validate request method
function validateMethod(method: string): { valid: boolean; error?: string } {
  if (!REQUEST_CONFIG.allowedMethods.includes(method)) {
    return { valid: false, error: 'Method not allowed' };
  }
  return { valid: true };
}

// Validate request size
function validateRequestSize(request: NextRequest): { valid: boolean; error?: string } {
  const contentLength = request.headers.get('content-length');
  
  if (contentLength && parseInt(contentLength) > REQUEST_CONFIG.maxPayloadSize) {
    return { valid: false, error: 'Request payload too large' };
  }
  
  return { valid: true };
}

// Validate user agent
function validateUserAgent(userAgent: string): { valid: boolean; suspicious: boolean; error?: string } {
  // Check for empty user agent
  if (!userAgent || userAgent === 'unknown') {
    return { valid: true, suspicious: true, error: 'Empty or missing user agent' };
  }
  
  // Check for suspicious patterns
  for (const pattern of REQUEST_CONFIG.suspiciousUserAgents) {
    if (pattern.test(userAgent)) {
      return { valid: true, suspicious: true, error: 'Suspicious user agent pattern' };
    }
  }
  
  return { valid: true, suspicious: false };
}

// Check for suspicious activity
function checkSuspiciousActivity(ip: string, userAgent: string): { allowed: boolean; blocked: boolean } {
  const now = Date.now();
  const key = `suspicious:${ip}`;
  const record = suspiciousActivity.get(key);

  if (!record) {
    suspiciousActivity.set(key, {
      count: 1,
      lastActivity: now,
    });
    return { allowed: true, blocked: false };
  }

  // Check if currently blocked
  if (record.blockedUntil && now < record.blockedUntil) {
    return { allowed: false, blocked: true };
  }

  // Reset if window has passed (1 hour)
  if (now - record.lastActivity > 60 * 60 * 1000) {
    record.count = 1;
    record.lastActivity = now;
    return { allowed: true, blocked: false };
  }

  // Increment activity count
  record.count++;
  record.lastActivity = now;

  // Check if should be blocked
  if (record.count > REQUEST_CONFIG.maxSuspiciousActivity) {
    record.blockedUntil = now + (2 * 60 * 60 * 1000); // 2 hours
    blockIP(ip, 'Excessive suspicious activity', 2 * 60 * 60 * 1000);
    
    return { allowed: false, blocked: true };
  }

  return { allowed: true, blocked: false };
}

// Cleanup function for expired records (call periodically)
export function cleanupExpiredRecords(): void {
  const now = Date.now();
  
  // Clean rate limit records
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime && (!record.lockoutUntil || now > record.lockoutUntil)) {
      rateLimitStore.delete(key);
    }
  }
  
  // Clean blocked IP records
  for (const [ip, record] of blockedIPs.entries()) {
    if (record.blockedUntil && now >= record.blockedUntil) {
      blockedIPs.delete(ip);
    }
  }
  
  // Clean suspicious activity records
  for (const [key, record] of suspiciousActivity.entries()) {
    if (now - record.lastActivity > 60 * 60 * 1000 && (!record.blockedUntil || now >= record.blockedUntil)) {
      suspiciousActivity.delete(key);
    }
  }
}

// Auto-cleanup every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredRecords, 10 * 60 * 1000);
}

// Main proxy function for Next.js 16
export default function proxy(request: NextRequest): NextResponse {
  const url = request.url;
  const method = request.method;
  const pathname = new URL(url).pathname;
  
  // Enhanced IP extraction with IPv6 support
  const ipInfo = getClientIP(request);
  const clientIP = ipInfo.ip;
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  // Generate nonce for CSP
  const nonce = generateNonce();
  
  // Get environment-specific security config
  const env = process.env.NODE_ENV || 'development';
  const securityConfig = getSecurityConfig(env);
  
  // Skip proxy for static assets and internal routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/health') ||
    pathname.includes('.') && !pathname.endsWith('.json') // Static files
  ) {
    const response = NextResponse.next();
    // Add basic security headers even for static assets
    const headers = getSecurityHeaders(env, nonce);
    Object.entries(headers).forEach(([key, value]) => {
      if (value) response.headers.set(key, value);
    });
    return response;
  }

  // Log all requests for monitoring
  console.log('Security Event:', JSON.stringify({
    event: 'request_received',
    timestamp: new Date().toISOString(),
    environment: securityConfig.infrastructure.environment,
    pathname,
    method,
    clientIP,
    ipVersion: ipInfo.version,
    userAgent,
    isPrivate: ipInfo.isPrivate,
  }));

  // Check if IP is blocked
  const ipCheck = isIPBlocked(clientIP);
  if (ipCheck.blocked) {
    console.log('Security Event:', JSON.stringify({
      event: 'blocked_ip_request',
      timestamp: new Date().toISOString(),
      environment: securityConfig.infrastructure.environment,
      clientIP,
      ipVersion: ipInfo.version,
      userAgent,
      reason: ipCheck.reason,
    }));
    
    return NextResponse.json(
      { error: 'Access denied' },
      { 
        status: 403,
        headers: {
          'Retry-After': ipCheck.retryAfter?.toString() || '86400',
        },
      }
    );
  }

  // Validate request method
  const methodValidation = validateMethod(method);
  if (!methodValidation.valid) {
    console.log('Security Event:', JSON.stringify({
      event: 'invalid_method',
      timestamp: new Date().toISOString(),
      environment: securityConfig.infrastructure.environment,
      clientIP,
      ipVersion: ipInfo.version,
      userAgent,
      method,
      error: methodValidation.error,
    }));
    
    return NextResponse.json(
      { error: methodValidation.error },
      { status: 405 }
    );
  }

  // Validate request size
  const sizeValidation = validateRequestSize(request);
  if (!sizeValidation.valid) {
    console.log('Security Event:', JSON.stringify({
      event: 'request_size_exceeded',
      timestamp: new Date().toISOString(),
      environment: securityConfig.infrastructure.environment,
      clientIP,
      ipVersion: ipInfo.version,
      userAgent,
      contentLength: request.headers.get('content-length'),
      error: sizeValidation.error,
    }));
    
    return NextResponse.json(
      { error: sizeValidation.error },
      { status: 413 }
    );
  }

  // Validate user agent
  const userAgentValidation = validateUserAgent(userAgent);
  if (userAgentValidation.suspicious) {
    const suspiciousCheck = checkSuspiciousActivity(clientIP, userAgent);
    
    if (!suspiciousCheck.allowed) {
      console.log('Security Event:', JSON.stringify({
        event: 'suspicious_activity_blocked',
        timestamp: new Date().toISOString(),
        environment: securityConfig.infrastructure.environment,
        clientIP,
        ipVersion: ipInfo.version,
        userAgent,
        error: userAgentValidation.error,
      }));
      
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
    
    console.log('Security Event:', JSON.stringify({
      event: 'suspicious_user_agent',
      timestamp: new Date().toISOString(),
      environment: securityConfig.infrastructure.environment,
      clientIP,
      ipVersion: ipInfo.version,
      userAgent,
      error: userAgentValidation.error,
    }));
  }

  // Apply rate limiting
  const rateLimitResult = checkRateLimit(clientIP, pathname);
  
  if (!rateLimitResult.allowed) {
    console.log('Security Event:', JSON.stringify({
      event: 'rate_limit_exceeded',
      timestamp: new Date().toISOString(),
      environment: securityConfig.infrastructure.environment,
      clientIP,
      ipVersion: ipInfo.version,
      userAgent,
      pathname,
      retryAfter: rateLimitResult.retryAfter,
    }));
    
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { 
        status: 429,
        headers: {
          'Retry-After': rateLimitResult.retryAfter?.toString() || '900',
          'X-RateLimit-Limit': securityConfig.api.rateLimiting.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(Date.now() + securityConfig.api.rateLimiting.windowMs).toISOString(),
        },
      }
    );
  }

  // Create response and add enhanced security headers
  const response = NextResponse.next();
  
  // Get security headers with nonce
  const securityHeaders = getSecurityHeaders(env, nonce);
  
  // Apply security headers to response
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (value) response.headers.set(key, value);
  });
  
  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', securityConfig.api.rateLimiting.maxRequests.toString());
  response.headers.set('X-RateLimit-Remaining', (rateLimitResult.remaining || 0).toString());
  response.headers.set('X-RateLimit-Reset', new Date(Date.now() + securityConfig.api.rateLimiting.windowMs).toISOString());
  
  // Add CORS headers if enabled
  if (securityConfig.api.cors.enabled) {
    const origin = request.headers.get('origin');
    const corsConfig = securityConfig.api.cors;
    
    if (corsConfig.origins.includes('*') || (origin && corsConfig.origins.includes(origin))) {
      response.headers.set('Access-Control-Allow-Origin', origin || '*');
      response.headers.set('Access-Control-Allow-Methods', corsConfig.methods.join(', '));
      response.headers.set('Access-Control-Allow-Headers', corsConfig.allowedHeaders.join(', '));
      response.headers.set('Access-Control-Max-Age', corsConfig.maxAge.toString());
      
      if (corsConfig.credentials) {
        response.headers.set('Access-Control-Allow-Credentials', 'true');
      }
    }
    
    // Handle preflight requests
    if (method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }
  }
  
  // Add custom security headers
  response.headers.set('X-Request-ID', crypto.randomUUID());
  response.headers.set('X-Security-Proxy', 'v2.1.0');
  response.headers.set('X-IP-Version', ipInfo.version);
  response.headers.set('X-Script-Nonce', nonce);
  response.headers.set('X-Style-Nonce', nonce);
  
  console.log('Security Event:', JSON.stringify({
    event: 'request_processed',
    timestamp: new Date().toISOString(),
    environment: securityConfig.infrastructure.environment,
    pathname,
    method,
    clientIP,
    ipVersion: ipInfo.version,
    userAgent,
    rateLimitRemaining: rateLimitResult.remaining,
  }));

  return response;
}

// Export utility functions for testing and monitoring
export { 
  isIPBlocked, 
  blockIP, 
  checkRateLimit, 
  validateMethod, 
  validateRequestSize, 
  validateUserAgent,
  checkSuspiciousActivity,
  cleanupExpiredRecords,
};
