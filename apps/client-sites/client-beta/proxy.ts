/**
 * Client Beta Security Proxy (Next.js 16)
 * 
 * Security proxy for client beta dashboard with CSP nonce generation
 * and comprehensive security headers implementation.
 * 
 * Version: 2.0.0
 * Updated: April 2026
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSecurityConfig, generateNonce, buildCSPHeader, getSecurityHeaders } from '../../../security.config';

// Client-specific configuration
const CLIENT_CONFIG = {
  name: 'client-beta',
  domain: process.env.CLIENT_BETA_DOMAIN || 'beta-client.com',
  theme: 'beta-brand',
};

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/analytics',
  '/settings',
  '/api/dashboard',
  '/api/analytics',
  '/api/settings',
];

// Public routes
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/api/auth',
  '/api/health',
];

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = new URL(request.url);
  const nonce = generateNonce();
  const isDev = process.env.NODE_ENV === 'development';
  const environment = process.env.NODE_ENV || 'development';
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
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
  
  // Add client identification headers
  response.headers.set('X-Client-Name', CLIENT_CONFIG.name);
  response.headers.set('X-Client-Domain', CLIENT_CONFIG.domain);
  response.headers.set('X-Client-Theme', CLIENT_CONFIG.theme);
  response.headers.set('X-App-Type', 'client-dashboard');
  response.headers.set('X-Request-ID', crypto.randomUUID());
  response.headers.set('X-Nonce-Used', nonce);
  
  // Client-specific CSP adjustments for analytics and third-party scripts
  if (securityConfig.csp.enabled) {
    const clientCSP = cspHeader.replace(
      "script-src 'self'",
      "script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com"
    );
    response.headers.set('Content-Security-Policy', clientCSP);
  }
  
  // Log security events in development
  if (isDev) {
    console.log('Client beta security proxy applied', {
      pathname,
      nonce: nonce.substring(0, 8) + '...', // Log partial nonce for debugging
      environment,
      cspApplied: !!securityHeaders['Content-Security-Policy'],
    });
  }
  
  // Validate domain access for multi-tenant isolation
  if (origin && !origin.includes(CLIENT_CONFIG.domain)) {
    console.warn('Cross-origin request detected', {
      origin,
      clientDomain: CLIENT_CONFIG.domain,
      pathname,
    });
    
    // In production, this might be blocked
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Cross-origin access not allowed' },
        { status: 403 }
      );
    }
  }
  
  // Check if route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  // For protected routes, check authentication
  if (isProtectedRoute) {
    const session = request.cookies.get('session')?.value;
    const authToken = request.headers.get('authorization');
    
    if (!session && !authToken) {
      // Redirect to login for protected routes
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Validate client access token
    if (authToken) {
      try {
        // This would validate the JWT and extract client context
        // For now, we'll simulate the validation
        const tokenData = JSON.parse(atob(authToken.replace('Bearer ', '')));
        
        if (tokenData.client !== CLIENT_CONFIG.name) {
          return NextResponse.json(
            { error: 'Invalid client access' },
            { status: 403 }
          );
        }
        
        // Add client context to headers for downstream use
        response.headers.set('X-Client-ID', tokenData.clientId);
        response.headers.set('X-User-ID', tokenData.userId);
        response.headers.set('X-User-Role', tokenData.role);
        
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid authentication token' },
          { status: 401 }
        );
      }
    }
  }
  
  // Add client-specific security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN'); // Allow same-origin for client sites
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Add cache control based on route type
  if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  } else if (isPublicRoute) {
    response.headers.set('Cache-Control', 'public, max-age=3600'); // 1 hour for public routes
  } else {
    response.headers.set('Cache-Control', 'private, max-age=300'); // 5 minutes for protected routes
  }
  
  // Add CSP for client-specific content
  const csp = [
    `default-src 'self' https://${CLIENT_CONFIG.domain}`,
    `script-src 'self' 'unsafe-inline' https://${CLIENT_CONFIG.domain}`,
    `style-src 'self' 'unsafe-inline' https://${CLIENT_CONFIG.domain}`,
    `img-src 'self' data: https: https://${CLIENT_CONFIG.domain}`,
    `connect-src 'self' https://${CLIENT_CONFIG.domain} https://api.supabase.co`,
    `font-src 'self' data: https://${CLIENT_CONFIG.domain}`,
    `frame-src 'self' https://${CLIENT_CONFIG.domain}`,
    `object-src 'none'`,
    `media-src 'self' https://${CLIENT_CONFIG.domain}`,
  ];
  
  response.headers.set('Content-Security-Policy', csp.join('; '));
  
  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
