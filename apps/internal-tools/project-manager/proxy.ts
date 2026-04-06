/**
 * Project Manager Security Proxy (Next.js 16)
 * 
 * Security proxy for project management tool with CSP nonce generation
 * and comprehensive security headers implementation.
 * 
 * Version: 2.0.0
 * Updated: April 2026
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSecurityConfig, generateNonce, buildCSPHeader, getSecurityHeaders } from '../../../security.config';
import { authSecurityMiddleware } from './src/lib/auth-security-middleware';

// Application-specific routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/projects',
  '/clients',
  '/settings',
  '/api/projects',
  '/api/clients',
  '/api/users',
];

// Admin-only routes
const ADMIN_ROUTES = [
  '/admin',
  '/api/admin',
  '/settings/team',
];

// API routes that don't require authentication
const PUBLIC_API_ROUTES = [
  '/api/health',
  '/api/auth/signin',
  '/api/auth/callback',
];

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = new URL(request.url);
  const nonce = generateNonce();
  const isDev = process.env.NODE_ENV === 'development';
  const environment = process.env.NODE_ENV || 'development';
  
  // Apply authentication security middleware first
  const authResult = authSecurityMiddleware(request);
  if (authResult) {
    return authResult;
  }
  
  // Get security configuration for current environment
  const securityConfig = getSecurityConfig(environment);
  
  // Build CSP header with nonce
  const cspHeader = buildCSPHeader(securityConfig.csp, nonce);
  
  // Get all security headers
  const securityHeaders = getSecurityHeaders(environment, nonce);
  
  // Set nonce in request headers for Next.js to use
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  
  // Create response with security headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  // Apply all security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Add application-specific headers
  response.headers.set('X-App-Type', 'project-manager');
  response.headers.set('X-Request-ID', crypto.randomUUID());
  response.headers.set('X-Nonce-Used', nonce);
  
  // Log security events in development
  if (isDev) {
    console.log('Security proxy applied', {
      pathname,
      nonce: nonce.substring(0, 8) + '...', // Log partial nonce for debugging
      environment,
      cspApplied: !!securityHeaders['Content-Security-Policy'],
    });
  }
  
  // Check if route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  const isAdminRoute = ADMIN_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  const isPublicAPI = PUBLIC_API_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  // For protected routes, check authentication
  if (isProtectedRoute && !isPublicAPI) {
    // This would integrate with your auth system
    // For now, we'll add a placeholder that checks for session
    const session = request.cookies.get('session')?.value;
    
    if (!session) {
      // Redirect to login for protected routes
      const loginUrl = new URL('/auth/signin', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // For admin routes, check admin role
    if (isAdminRoute) {
      // This would check user role from session or database
      // For now, we'll simulate the check
      try {
        const sessionData = JSON.parse(atob(session));
        if (sessionData.role !== 'admin') {
          return NextResponse.json(
            { error: 'Insufficient permissions' },
            { status: 403 }
          );
        }
      } catch (error) {
        // Invalid session, redirect to login
        const loginUrl = new URL('/auth/signin', request.url);
        return NextResponse.redirect(loginUrl);
      }
    }
  }
  
  // Add cache control for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
