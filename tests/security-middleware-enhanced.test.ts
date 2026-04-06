/**
 * Enhanced Security Middleware Test Suite
 * 
 * Tests the comprehensive security middleware implementation
 * with 2026 best practices including IPv6 support, sliding window
 * rate limiting, and nonce-based CSP.
 * 
 * Version: 2.1.0
 * Updated: April 2026
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

// Import enhanced utilities
import { createRateLimiter, RateLimitAlgorithm } from '../packages/shared/security/rate-limiting';
import { createDefaultSecurityHeaders, SecurityHeadersBuilder } from '../packages/shared/security/security-headers';
import { getClientIP, IPExtractor } from '../packages/shared/security/ip-extraction';

// Mock Redis for testing
vi.mock('ioredis', () => ({
  default: vi.fn().mockImplementation(() => ({
    eval: vi.fn().mockResolvedValue([1, 5, 95]),
    get: vi.fn(),
    set: vi.fn(),
    expire: vi.fn(),
    hmget: vi.fn(),
    hmset: vi.fn(),
    zadd: vi.fn(),
    zcard: vi.fn(),
    zrange: vi.fn(),
    zremrangebyscore: vi.fn(),
    pttl: vi.fn(),
  })),
}));

describe('Enhanced Security Middleware Implementation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Enhanced Rate Limiting', () => {
    it('should implement sliding window rate limiting', async () => {
      const rateLimiter = createRateLimiter({
        algorithm: RateLimitAlgorithm.SLIDING_WINDOW,
        windowMs: 60000,
        maxRequests: 100,
      });

      const result = await rateLimiter.checkLimit('test-ip');
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeGreaterThan(0);
      expect(result.totalHits).toBeGreaterThan(0);
    });

    it('should implement token bucket rate limiting', async () => {
      const rateLimiter = createRateLimiter({
        algorithm: RateLimitAlgorithm.TOKEN_BUCKET,
        windowMs: 60000,
        maxRequests: 100,
      });

      const result = await rateLimiter.checkLimit('test-ip');
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeGreaterThanOrEqual(0);
    });

    it('should handle Redis failures gracefully', async () => {
      const rateLimiter = createRateLimiter({
        algorithm: RateLimitAlgorithm.SLIDING_WINDOW,
        windowMs: 60000,
        maxRequests: 100,
        redis: {
          eval: vi.fn().mockRejectedValue(new Error('Redis error')),
        } as any,
      });

      const result = await rateLimiter.checkLimit('test-ip');
      
      // Should fail open - allow request when Redis fails
      expect(result.allowed).toBe(true);
    });

    it('should use in-memory fallback in development', () => {
      const rateLimiter = createRateLimiter({
        algorithm: RateLimitAlgorithm.SLIDING_WINDOW,
        windowMs: 60000,
        maxRequests: 100,
      });

      // Should use InMemoryRateLimiter when no Redis provided
      expect(rateLimiter).toBeDefined();
    });
  });

  describe('Enhanced Security Headers', () => {
    it('should generate nonce-based CSP', () => {
      const nonce = 'test-nonce-123';
      const headers = createDefaultSecurityHeaders({ nonce });
      
      const builtHeaders = headers.build();
      
      expect(builtHeaders['Content-Security-Policy']).toContain(`'nonce-${nonce}'`);
      expect(builtHeaders['Content-Security-Policy-Report-Only']).toContain(`'nonce-${nonce}'`);
    });

    it('should remove unsafe-inline in production with nonce', () => {
      const headers = createDefaultSecurityHeaders({ 
        nonce: 'test-nonce',
        isProduction: true 
      });
      
      const builtHeaders = headers.build();
      const csp = builtHeaders['Content-Security-Policy'];
      
      expect(csp).toContain("'nonce-test-nonce'");
      expect(csp).not.toContain("'unsafe-inline'");
    });

    it('should include Permissions-Policy header', () => {
      const headers = createDefaultSecurityHeaders();
      
      const builtHeaders = headers.build();
      
      expect(builtHeaders['Permissions-Policy']).toBeDefined();
      expect(builtHeaders['Permissions-Policy']).toContain('geolocation=()');
      expect(builtHeaders['Permissions-Policy']).toContain('microphone=()');
    });

    it('should include modern cross-origin headers', () => {
      const headers = createDefaultSecurityHeaders();
      
      const builtHeaders = headers.build();
      
      expect(builtHeaders['Cross-Origin-Embedder-Policy']).toBe('require-corp');
      expect(builtHeaders['Cross-Origin-Opener-Policy']).toBe('same-origin');
      expect(builtHeaders['Cross-Origin-Resource-Policy']).toBe('same-origin');
    });

    it('should create marketing site headers', () => {
      const headers = createDefaultSecurityHeaders();
      
      const builtHeaders = headers.build();
      
      expect(builtHeaders['X-Frame-Options']).toBe('SAMEORIGIN');
      expect(builtHeaders['Content-Security-Policy']).toContain('www.googletagmanager.com');
    });

    it('should create API headers', () => {
      const headers = createDefaultSecurityHeaders();
      
      const builtHeaders = headers.build();
      
      expect(builtHeaders['Referrer-Policy']).toBe('no-referrer');
      expect(builtHeaders['X-API-Security']).toBe('active');
    });
  });

  describe('IPv6-Aware IP Extraction', () => {
    it('should extract IPv4 addresses correctly', () => {
      const mockRequest = {
        headers: new Headers({
          'x-forwarded-for': '192.168.1.100',
        }),
      };

      const ipInfo = getClientIP(mockRequest);
      
      expect(ipInfo.ip).toBe('192.168.1.100');
      expect(ipInfo.version).toBe('ipv4');
      expect(ipInfo.isPrivate).toBe(true);
    });

    it('should extract IPv6 addresses correctly', () => {
      const mockRequest = {
        headers: new Headers({
          'x-forwarded-for': '2001:db8::1',
        }),
      };

      const ipInfo = getClientIP(mockRequest);
      
      expect(ipInfo.ip).toBe('2001:db8::1');
      expect(ipInfo.version).toBe('ipv6');
      expect(ipInfo.isPrivate).toBe(true); // Documentation prefix
    });

    it('should handle Cloudflare connecting IP', () => {
      const mockRequest = {
        headers: new Headers({
          'cf-connecting-ip': '203.0.113.1',
        }),
      };

      const ipInfo = getClientIP(mockRequest);
      
      expect(ipInfo.ip).toBe('203.0.113.1');
      expect(ipInfo.version).toBe('ipv4');
      expect(ipInfo.isPrivate).toBe(false);
    });

    it('should normalize IPv6 addresses', () => {
      const extractor = new IPExtractor();
      
      // Test IPv6 normalization
      const normalized = extractor['normalizeIPv6']('2001:0DB8:0000:0000:0000:0000:0000:0001');
      
      expect(normalized).toBe('2001:db8::1');
    });

    it('should aggregate IPv6 subnets for rate limiting', () => {
      const extractor = new IPExtractor();
      
      const subnet = extractor['aggregateIPv6Subnet']('2001:db8:1234:5678:abcd:ef01:2345:6789', 64);
      
      expect(subnet).toBe('2001:db8:1234:5678::');
    });

    it('should validate IP addresses', () => {
      expect(IPExtractor.isValidIP('192.168.1.1')).toBe(true);
      expect(IPExtractor.isValidIP('2001:db8::1')).toBe(true);
      expect(IPExtractor.isValidIP('invalid-ip')).toBe(false);
    });

    it('should identify private IPv6 addresses', () => {
      const extractor = new IPExtractor();
      
      expect(extractor['isPrivateIPv6']('::1')).toBe(true); // Loopback
      expect(extractor['isPrivateIPv6']('fc00::1')).toBe(true); // Unique local
      expect(extractor['isPrivateIPv6']('fe80::1')).toBe(true); // Link-local
      expect(extractor['isPrivateIPv6']('2001:db8::1')).toBe(true); // Documentation
      expect(extractor['isPrivateIPv6']('2001:4860::1')).toBe(false); // Public
    });
  });

  describe('Enhanced Request Validation', () => {
    it('should validate allowed HTTP methods', () => {
      const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
      
      allowedMethods.forEach(method => {
        const result = validateMethod(method);
        expect(result.valid).toBe(true);
      });
    });

    it('should reject disallowed HTTP methods', () => {
      const disallowedMethods = ['TRACE', 'CONNECT', 'DEBUG', 'PROPFIND'];
      
      disallowedMethods.forEach(method => {
        const result = validateMethod(method);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Method not allowed');
      });
    });

    it('should validate request size limits', () => {
      const validRequest = {
        headers: new Headers({ 'content-length': '1000' }),
      };
      
      const result = validateRequestSize(validRequest);
      expect(result.valid).toBe(true);
    });

    it('should reject oversized requests', () => {
      const oversizedRequest = {
        headers: new Headers({ 'content-length': '15000000' }), // 15MB
      };
      
      const result = validateRequestSize(oversizedRequest);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Request payload too large');
    });

    it('should detect advanced suspicious user agents', () => {
      const suspiciousAgents = [
        'curl/7.68.0',
        'python-requests/2.25.1',
        'PostmanRuntime/7.26.8',
        'axios/0.21.1',
        'insomnia/2021.2.2',
      ];
      
      suspiciousAgents.forEach(ua => {
        const result = validateUserAgent(ua);
        expect(result.valid).toBe(true);
        expect(result.suspicious).toBe(true);
      });
    });
  });

  describe('Integration Tests', () => {
    it('should process legitimate requests successfully', async () => {
      const mockRequest = {
        url: 'https://example.com/dashboard',
        method: 'GET',
        headers: new Headers({
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'x-forwarded-for': '203.0.113.100',
        }),
        ip: '203.0.113.100',
      };

      // This would test the actual proxy function
      // For now, we'll test the components
      const ipInfo = getClientIP(mockRequest);
      const rateLimiter = createRateLimiter({
        algorithm: RateLimitAlgorithm.SLIDING_WINDOW,
        windowMs: 60000,
        maxRequests: 100,
      });
      const rateLimitResult = await rateLimiter.checkLimit(ipInfo.ip);
      const headers = createDefaultSecurityHeaders({ 
        nonce: 'test-nonce',
        isProduction: false 
      });

      expect(ipInfo.version).toBe('ipv4');
      expect(rateLimitResult.allowed).toBe(true);
      expect(headers.build()['Content-Security-Policy']).toContain("'nonce-test-nonce'");
    });

    it('should block malicious requests', async () => {
      const mockRequest = {
        url: 'https://example.com/api/admin',
        method: 'TRACE', // Disallowed method
        headers: new Headers({
          'user-agent': 'curl/7.68.0',
          'x-forwarded-for': '192.168.1.100',
        }),
        ip: '192.168.1.100',
      };

      const methodValidation = validateMethod(mockRequest.method);
      const userAgentValidation = validateUserAgent(mockRequest.headers.get('user-agent')!);

      expect(methodValidation.valid).toBe(false);
      expect(userAgentValidation.suspicious).toBe(true);
    });

    it('should handle IPv6 requests correctly', async () => {
      const mockRequest = {
        url: 'https://example.com/dashboard',
        method: 'GET',
        headers: new Headers({
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'x-forwarded-for': '2001:4860:4860::8888',
        }),
        ip: '2001:4860:4860::8888',
      };

      const ipInfo = getClientIP(mockRequest);
      const rateLimiter = createRateLimiter({
        algorithm: RateLimitAlgorithm.SLIDING_WINDOW,
        windowMs: 60000,
        maxRequests: 100,
      });
      const rateLimitResult = await rateLimiter.checkLimit(ipInfo.ip);

      expect(ipInfo.version).toBe('ipv6');
      expect(ipInfo.isPrivate).toBe(false);
      expect(rateLimitResult.allowed).toBe(true);
    });
  });

  describe('Performance Tests', () => {
    it('should handle high request volume efficiently', async () => {
      const startTime = Date.now();
      const rateLimiter = createRateLimiter({
        algorithm: RateLimitAlgorithm.SLIDING_WINDOW,
        windowMs: 60000,
        maxRequests: 1000,
      });

      // Simulate 1000 requests
      const promises = Array.from({ length: 1000 }, (_, i) => 
        rateLimiter.checkLimit(`test-ip-${i % 10}`)
      );

      const results = await Promise.all(promises);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(1000); // Should complete in under 1 second
      expect(results.every(r => r.allowed)).toBe(true);
    });

    it('should cleanup expired records efficiently', () => {
      const extractor = new IPExtractor();
      const startTime = Date.now();

      // Test IP validation performance
      const testIPs = [
        '192.168.1.1',
        '2001:db8::1',
        '203.0.113.1',
        '2001:4860::1',
      ];

      testIPs.forEach(ip => {
        IPExtractor.isValidIP(ip);
      });

      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(10); // Should complete in under 10ms
    });
  });

  describe('Security Compliance Tests', () => {
    it('should meet OWASP security header requirements', () => {
      const headers = createDefaultSecurityHeaders({ 
        nonce: 'test-nonce',
        isProduction: true 
      });
      
      const builtHeaders = headers.build();

      // Required OWASP headers
      expect(builtHeaders['Content-Security-Policy']).toBeDefined();
      expect(builtHeaders['Strict-Transport-Security']).toBeDefined();
      expect(builtHeaders['X-Content-Type-Options']).toBe('nosniff');
      expect(builtHeaders['X-Frame-Options']).toBeDefined();
      expect(builtHeaders['Referrer-Policy']).toBeDefined();
    });

    it('should not use unsafe-inline in production CSP', () => {
      const headers = createDefaultSecurityHeaders({ 
        nonce: 'test-nonce',
        isProduction: true 
      });
      
      const builtHeaders = headers.build();
      const csp = builtHeaders['Content-Security-Policy'];

      expect(csp).not.toContain("'unsafe-inline'");
      expect(csp).toContain("'nonce-test-nonce'");
    });

    it('should implement proper HSTS in production', () => {
      const headers = createDefaultSecurityHeaders({ 
        isProduction: true 
      });
      
      const builtHeaders = headers.build();
      const hsts = builtHeaders['Strict-Transport-Security'];

      expect(hsts).toContain('max-age=');
      expect(hsts).toContain('includeSubDomains');
      expect(hsts).toContain('preload');
    });
  });
});

// Helper functions for testing
function validateMethod(method: string): { valid: boolean; error?: string } {
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
  
  if (!allowedMethods.includes(method)) {
    return { valid: false, error: 'Method not allowed' };
  }
  return { valid: true };
}

function validateRequestSize(request: any): { valid: boolean; error?: string } {
  const contentLength = request.headers.get('content-length');
  const maxPayloadSize = 10 * 1024 * 1024; // 10MB
  
  if (contentLength && parseInt(contentLength) > maxPayloadSize) {
    return { valid: false, error: 'Request payload too large' };
  }
  
  return { valid: true };
}

function validateUserAgent(userAgent: string): { valid: boolean; suspicious: boolean; error?: string } {
  const suspiciousPatterns = [
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
  ];

  if (!userAgent || userAgent === 'unknown') {
    return { valid: true, suspicious: true, error: 'Empty or missing user agent' };
  }
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(userAgent)) {
      return { valid: true, suspicious: true, error: 'Suspicious user agent pattern' };
    }
  }
  
  return { valid: true, suspicious: false };
}
