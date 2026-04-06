/**
 * CSP Nonce Middleware (Next.js 16)
 * 
 * Provides dynamic nonce generation and CSP header management
 * for Next.js applications with strict security policies.
 * 
 * This middleware replaces middleware.ts functionality in Next.js 16
 * and integrates with the security.config.ts for centralized management.
 * 
 * Version: 2.0.0
 * Updated: April 2026
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSecurityHeaders, generateNonce, getSecurityConfig } from '@/../../security.config';

// Store nonces for the request duration
const requestNonces = new WeakMap<NextRequest, { script: string; style: string }>();

// Get or generate nonces for the request
function getRequestNonces(request: NextRequest): { script: string; style: string } {
  let nonces = requestNonces.get(request);
  
  if (!nonces) {
    nonces = {
      script: generateNonce(),
      style: generateNonce(),
    };
    requestNonces.set(request, nonces);
  }
  
  return nonces;
}

// Check if request needs nonce-based CSP
function needsNonceCSP(request: NextRequest): boolean {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Skip nonce for static assets and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') && !pathname.endsWith('.html')
  ) {
    return false;
  }
  
  return true;
}

// Add nonce to HTML response
function addNonceToHTML(html: string, nonces: { script: string; style: string }): string {
  // Add nonce meta tags to head
  const nonceMetaTags = `
    <meta name="csp-nonce" content="${nonces.script}">
    <meta name="csp-style-nonce" content="${nonces.style}">
  `;
  
  // Insert after <head> tag
  const headInsertion = html.replace('<head>', `<head>${nonceMetaTags}`);
  
  // Add nonce data attributes to script and style tags that need it
  const withScriptNonces = headInsertion.replace(
    /<script(?![^>]*data-nonce)([^>]*)>/g,
    `<script data-nonce="${nonces.script}"$1 nonce="${nonces.script}">`
  );
  
  const withStyleNonces = withScriptNonces.replace(
    /<style(?![^>]*data-nonce)([^>]*)>/g,
    `<style data-nonce="${nonces.style}"$1 nonce="${nonces.style}">`
  );
  
  return withStyleNonces;
}

// Main middleware function
export function cspNonceMiddleware(request: NextRequest): NextResponse {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Get environment and security config
  const env = process.env.NODE_ENV || 'development';
  const securityConfig = getSecurityConfig(env);
  
  // Generate nonces only for pages that need them
  const shouldUseNonce = needsNonceCSP(request) && securityConfig.csp.nonceSupport;
  const nonces = shouldUseNonce ? getRequestNonces(request) : null;
  
  // Get security headers with nonce
  const securityHeaders = getSecurityHeaders(env, nonces?.script);
  
  // Create response
  let response = NextResponse.next();
  
  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (value) {
      response.headers.set(key, value);
    }
  });
  
  // Add nonce headers for client-side access
  if (nonces) {
    response.headers.set('X-Script-Nonce', nonces.script);
    response.headers.set('X-Style-Nonce', nonces.style);
  }
  
  // Add request tracking headers
  response.headers.set('X-Request-ID', crypto.randomUUID());
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Log CSP violations in development
  if (env === 'development') {
    response.headers.set('Content-Security-Policy-Report-Only', securityHeaders['Content-Security-Policy'] || '');
  }
  
  return response;
}

// Transform response to add nonces to HTML content
export function transformResponseWithNonce(response: NextResponse, request: NextRequest): NextResponse {
  const nonces = requestNonces.get(request);
  
  if (!nonces || !response.headers.get('content-type')?.includes('text/html')) {
    return response;
  }
  
  // Read and modify HTML content
  const html = response.text();
  const modifiedHTML = addNonceToHTML(html, nonces);
  
  // Create new response with modified content
  const newResponse = new NextResponse(modifiedHTML, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
  
  return newResponse;
}

// Utility function for server components to get current nonce
export function getCurrentNonce(request: NextRequest, type: 'script' | 'style' = 'script'): string | null {
  const nonces = requestNonces.get(request);
  return nonces ? nonces[type] : null;
}

// Client-side utility to get nonce from meta tags
export function getClientNonce(type: 'script' | 'style' = 'script'): string | null {
  if (typeof window === 'undefined') return null;
  
  const metaTag = document.querySelector(`meta[name="csp-${type}-nonce"]`);
  return metaTag?.getAttribute('content') || null;
}

// Hook for React components to access nonce
export function useNonce(type: 'script' | 'style' = 'script'): string | null {
  if (typeof window === 'undefined') {
    // Server-side: get from request context
    return null; // Will be provided by server components
  }
  
  // Client-side: get from meta tags
  return getClientNonce(type);
}

export default cspNonceMiddleware;
