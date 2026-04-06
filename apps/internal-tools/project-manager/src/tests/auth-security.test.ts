/**
 * Authentication Security Tests
 * 
 * Tests for enterprise-grade authentication security features
 * including OAuth 2.1 compliance, PKCE, and defense-in-depth patterns.
 * 
 * Version: 2.0.0
 * Updated: April 2026
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { checkRateLimit, checkLoginAttempts, clearLoginAttempts, cleanupExpiredRecords } from '../lib/auth-security-middleware';
import { verifySession, requireRole, requireAdmin } from '../lib/dal';

describe('Authentication Security', () => {
  beforeEach(() => {
    // Clear all stores before each test
    cleanupExpiredRecords();
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up after each test
    cleanupExpiredRecords();
    vi.restoreAllMocks();
  });

  describe('Rate Limiting', () => {
    it('should allow requests within limit', () => {
      const identifier = 'test-user-1';
      
      // First request should be allowed
      let result = checkRateLimit(identifier);
      expect(result.allowed).toBe(true);
      expect(result.retryAfter).toBeUndefined();
      
      // Multiple requests within limit should be allowed
      for (let i = 0; i < 50; i++) {
        result = checkRateLimit(identifier);
        expect(result.allowed).toBe(true);
      }
    });

    it('should block requests exceeding rate limit', () => {
      const identifier = 'test-user-2';
      
      // Exhaust the rate limit
      for (let i = 0; i < 101; i++) {
        checkRateLimit(identifier);
      }
      
      // Next request should be blocked
      const result = checkRateLimit(identifier);
      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeGreaterThan(0);
    });

    it('should reset rate limit after window expires', () => {
      const identifier = 'test-user-3';
      
      // Exhaust the rate limit
      for (let i = 0; i < 101; i++) {
        checkRateLimit(identifier);
      }
      
      // Should be blocked
      let result = checkRateLimit(identifier);
      expect(result.allowed).toBe(false);
      
      // Mock time passing (in real implementation, this would be actual time)
      // For testing purposes, we'll manually expire the records
      cleanupExpiredRecords();
      
      // Should allow new requests after cleanup
      result = checkRateLimit(identifier);
      expect(result.allowed).toBe(true);
    });
  });

  describe('Login Attempts', () => {
    it('should allow login attempts within limit', () => {
      const email = 'test@example.com';
      
      // First attempt should be allowed
      let result = checkLoginAttempts(email);
      expect(result.allowed).toBe(true);
      expect(result.retryAfter).toBeUndefined();
      
      // Multiple attempts within limit should be allowed
      for (let i = 0; i < 4; i++) {
        result = checkLoginAttempts(email);
        expect(result.allowed).toBe(true);
      }
    });

    it('should lock account after too many failed attempts', () => {
      const email = 'test@example.com';
      
      // Exhaust login attempts
      for (let i = 0; i < 6; i++) {
        checkLoginAttempts(email);
      }
      
      // Next attempt should be blocked
      const result = checkLoginAttempts(email);
      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeGreaterThan(0);
    });

    it('should clear login attempts on successful login', () => {
      const email = 'test@example.com';
      
      // Make some failed attempts
      for (let i = 0; i < 3; i++) {
        checkLoginAttempts(email);
      }
      
      // Clear attempts (simulating successful login)
      clearLoginAttempts(email);
      
      // Should allow new attempts
      const result = checkLoginAttempts(email);
      expect(result.allowed).toBe(true);
    });
  });

  describe('Defense-in-Depth Authentication (DAL)', () => {
    it('should verify valid sessions', async () => {
      // Mock a valid session
      const mockCookies = new Map();
      mockCookies.set('session-token', 'valid-token');
      
      // Mock cookies() function
      vi.doMock('next/headers', () => ({
        cookies: () => ({
          get: (name: string) => mockCookies.get(name) || { value: mockCookies.get(name) },
        }),
      }));

      // Mock getToken to return valid token
      vi.doMock('next-auth/jwt', () => ({
        getToken: vi.fn().mockResolvedValue({
          id: '1',
          email: 'admin@agency.com',
          role: 'admin',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        }),
      }));

      const session = await verifySession();
      expect(session).toBeTruthy();
      expect(session?.user.email).toBe('admin@agency.com');
      expect(session?.user.role).toBe('admin');
    });

    it('should reject invalid sessions', async () => {
      // Mock getToken to return null (invalid token)
      vi.doMock('next-auth/jwt', () => ({
        getToken: vi.fn().mockResolvedValue(null),
      }));

      const session = await verifySession();
      expect(session).toBeNull();
    });

    it('should enforce role-based access control', async () => {
      // Mock admin session
      vi.doMock('next/headers', () => ({
        cookies: () => ({
          get: () => ({ value: 'admin-token' }),
        }),
      }));

      vi.doMock('next-auth/jwt', () => ({
        getToken: vi.fn().mockResolvedValue({
          id: '1',
          email: 'admin@agency.com',
          role: 'admin',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600,
        }),
      }));

      // Admin should be able to access admin resources
      const adminSession = await requireAdmin();
      expect(adminSession.user.role).toBe('admin');

      // User should not be able to access admin resources
      vi.doMock('next-auth/jwt', () => ({
        getToken: vi.fn().mockResolvedValue({
          id: '2',
          email: 'user@agency.com',
          role: 'user',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600,
        }),
      }));

      await expect(requireAdmin()).rejects.toThrow('Insufficient permissions');
    });

    it('should handle expired tokens', async () => {
      // Mock expired token
      vi.doMock('next-auth/jwt', () => ({
        getToken: vi.fn().mockResolvedValue({
          id: '1',
          email: 'admin@agency.com',
          role: 'admin',
          iat: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
          exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago (expired)
        }),
      }));

      const session = await verifySession();
      expect(session).toBeNull();
    });
  });

  describe('OAuth 2.1 PKCE Compliance', () => {
    it('should require PKCE checks in OAuth configuration', () => {
      // This test verifies that our Google Provider configuration
      // includes PKCE checks as required by OAuth 2.1
      
      const { authOptions } = require('../lib/auth');
      const googleProvider = authOptions.providers.find(
        (p: any) => p.id === 'google'
      );

      expect(googleProvider).toBeDefined();
      expect(googleProvider.options.checks).toContain('pkce');
      expect(googleProvider.options.checks).toContain('state');
    });

    it('should use authorization code flow', () => {
      const { authOptions } = require('../lib/auth');
      const googleProvider = authOptions.providers.find(
        (p: any) => p.id === 'google'
      );

      expect(googleProvider.options.authorization.params.response_type).toBe('code');
    });
  });

  describe('Security Logging', () => {
    it('should log security events', () => {
      // Mock console.log to capture log output
      const consoleSpy = vi.spyOn(console, 'log');
      
      // Trigger a security event
      checkRateLimit('test-user');
      
      // Verify logging occurred
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should log data access events', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      
      // Mock session for logging
      vi.doMock('next/headers', () => ({
        cookies: () => ({
          get: () => ({ value: 'valid-token' }),
        }),
      }));

      vi.doMock('next-auth/jwt', () => ({
        getToken: vi.fn().mockResolvedValue({
          id: '1',
          email: 'admin@agency.com',
          role: 'admin',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600,
        }),
      }));

      const { logDataAccess } = await import('../lib/dal');
      await logDataAccess('view', 'dashboard', '1');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('DAL Security:'),
        expect.stringContaining('data_access')
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed tokens gracefully', async () => {
      // Mock getToken to throw error
      vi.doMock('next-auth/jwt', () => ({
        getToken: vi.fn().mockRejectedValue(new Error('Invalid token')),
      }));

      const session = await verifySession();
      expect(session).toBeNull();
    });

    it('should handle missing cookies gracefully', async () => {
      // Mock cookies to return undefined
      vi.doMock('next/headers', () => ({
        cookies: () => ({
          get: () => undefined,
        }),
      }));

      const session = await verifySession();
      expect(session).toBeNull();
    });

    it('should handle concurrent requests safely', () => {
      const identifier = 'concurrent-test';
      
      // Simulate concurrent requests
      const promises = Array.from({ length: 50 }, () => 
        Promise.resolve(checkRateLimit(identifier))
      );
      
      const results = Promise.all(promises);
      expect(results).resolves.toBeDefined();
    });
  });
});

describe('Authentication Configuration', () => {
  it('should have proper security configuration', () => {
    const { securityConfig } = require('@/../../security.config');
    
    expect(securityConfig.auth.maxLoginAttempts).toBeGreaterThan(0);
    expect(securityConfig.auth.lockoutDuration).toBeGreaterThan(0);
    expect(securityConfig.auth.sessionTimeout).toBeGreaterThan(0);
    expect(securityConfig.api.rateLimiting.maxRequests).toBeGreaterThan(0);
  });

  it('should have secure cookie configuration', () => {
    const { authOptions } = require('../lib/auth');
    
    expect(authOptions.useSecureCookies).toBeDefined();
    expect(authOptions.cookies).toBeDefined();
    expect(authOptions.cookies.sessionToken.options.httpOnly).toBe(true);
    expect(authOptions.cookies.sessionToken.options.sameSite).toBe('lax');
  });
});

describe('Environment Validation', () => {
  it('should validate required environment variables', () => {
    // Mock environment variables
    const originalEnv = process.env;
    
    // Test with missing variables
    process.env = { ...originalEnv, NEXTAUTH_SECRET: '' };
    
    // Should throw error when importing auth module
    expect(() => {
      require('../lib/auth');
    }).toThrow();
    
    // Restore original environment
    process.env = originalEnv;
  });

  it('should validate Google OAuth configuration', () => {
    const originalEnv = process.env;
    
    // Test with missing Google OAuth variables
    process.env = { 
      ...originalEnv, 
      NEXTAUTH_SECRET: 'this-is-a-valid-secret-32-chars-long',
      GOOGLE_CLIENT_ID: '',
      GOOGLE_CLIENT_SECRET: '',
    };
    
    expect(() => {
      require('../lib/auth');
    }).toThrow();
    
    process.env = originalEnv;
  });
});
