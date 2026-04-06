/**
 * NextAuth Proxy with Security Integration
 * 
 * Integrates NextAuth with our custom security middleware for
 * enhanced authentication protection using Next.js 16 proxy.ts.
 * 
 * Version: 2.0.0
 * Updated: April 2026
 */

import { NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authOptions } from './auth';
import { authSecurityMiddleware, clearLoginAttempts } from './auth-security-middleware';

// Create NextAuth handler
const nextAuthHandler = NextAuth(authOptions);

// Enhanced proxy wrapper
export async function proxy(request: NextRequest): Promise<NextResponse> {
  const url = request.url;
  const method = request.method;
  
  // Apply security middleware first
  const securityResponse = authSecurityMiddleware(request);
  if (securityResponse) {
    return securityResponse;
  }
  
  // Only intercept authentication requests
  if (url.includes('/api/auth/')) {
    try {
      // For credential-based authentication, extract email for tracking
      if (url.includes('/api/auth/callback/credentials') && method === 'POST') {
        try {
          // Clone the request to read the body
          const clonedRequest = request.clone();
          const body = await clonedRequest.json();
          
          if (body.email) {
            // Add email to headers for security middleware
            const headers = new Headers(request.headers);
            headers.set('x-user-email', body.email);
            
            // Create new request with modified headers
            const modifiedRequest = new Request(request.url, {
              method: request.method,
              headers: headers,
              body: JSON.stringify(body),
            });
            
            // Process with NextAuth
            const response = await nextAuthHandler(modifiedRequest);
            
            // If authentication was successful, clear login attempts
            if (response.status === 200 && body.email) {
              clearLoginAttempts(body.email);
            }
            
            return response;
          }
        } catch (error) {
          console.error('Error processing credential auth:', error);
          // Continue with normal processing
        }
      }
      
      // Process with NextAuth for all other auth requests
      return await nextAuthHandler(request);
      
    } catch (error) {
      console.error('Authentication proxy error:', error);
      
      return NextResponse.json(
        { error: 'Authentication service temporarily unavailable' },
        { status: 503 }
      );
    }
  }
  
  // For non-auth routes, continue normally
  return NextResponse.next();
}

// Export the NextAuth handler for direct use in API routes
export { nextAuthHandler };

// Configure proxy matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
