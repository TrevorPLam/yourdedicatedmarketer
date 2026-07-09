# Security Notes

This document tracks security-related decisions, limitations, and future hardening plans for the Your Dedicated Marketer application.

## Content Security Policy (CSP) Limitations

### Current State

The application uses a Content Security Policy (CSP) header with `'unsafe-inline'` and `'unsafe-eval'` directives in `script-src`. This configuration is documented in `apps/firm-website/next.config.ts`.

### Why These Directives Are Required

**`'unsafe-eval'` in script-src:**
- React uses `eval()` in development environments to provide enhanced debugging capabilities
- Specifically, it reconstructs server-side error stacks in the browser to show where errors originated on the server
- This is a documented requirement by Next.js for development mode

**`'unsafe-inline'` in script-src:**
- Required for Sentry error tracking scripts
- Required for Google Analytics 4 (GA4) integration
- Required for inline JSON-LD structured data injection
- Required for MDX content rendering that may include inline scripts

### Current CSP Configuration

```typescript
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:; frame-ancestors 'none'; upgrade-insecure-requests;
```

### Security Implications

- `'unsafe-inline'` allows any inline script to execute, which could be exploited if an attacker can inject malicious scripts
- `'unsafe-eval'` allows the use of `eval()` and similar functions, which can be a vector for code injection attacks
- These directives weaken the security posture of the CSP

### Future Hardening Plan

**Recommended Approach: CSP Nonces**

The long-term solution is to implement CSP nonces (cryptographically random tokens used once) to selectively allow specific inline scripts without using `'unsafe-inline'`.

**Implementation Steps:**

1. Create a middleware that generates a nonce for each request
2. Inject the nonce into the CSP header via the middleware
3. Pass the nonce to Next.js `next/script` components and inline scripts
4. Update the CSP to use `'nonce-{nonce}'` instead of `'unsafe-inline'`
5. For development, conditionally include `'unsafe-eval'` only when `NODE_ENV === 'development'`

**Example Implementation Pattern:**

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDev = process.env.NODE_ENV === 'development'
  
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ''};
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data: https:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
  
  const response = NextResponse.next()
  response.headers.set('Content-Security-Policy', cspHeader.replace(/\s{2,}/g, ' ').trim())
  response.headers.set('x-nonce', nonce)
  
  return response
}
```

**Alternative: Subresource Integrity (SRI)**

Next.js also supports experimental Subresource Integrity (SRI) as an alternative to nonces. SRI uses cryptographic hashes to verify script integrity. However, SRI has limitations:
- Does not work with inline scripts
- Requires script content to be stable across builds
- Currently experimental in Next.js

### Dependencies Blocking Implementation

- Sentry integration may require additional configuration to work with nonces
- GA4 integration may need to be converted to use `next/script` with nonce support
- MDX rendering pipeline may need updates to support nonce propagation
- Inline JSON-LD injection may need to be refactored to use external scripts or nonce-aware injection

### Related Files

- `apps/firm-website/next.config.ts` - CSP header configuration
- `apps/firm-website/src/lib/json-ld.ts` - JSON-LD structured data injection
- `apps/firm-website/src/lib/gtag.ts` - Google Analytics integration
- `apps/firm-website/instrumentation.ts` - Sentry server-side configuration
- `apps/firm-website/instrumentation-client.ts` - Sentry client-side configuration

### References

- [Next.js CSP Guide](https://nextjs.org/docs/app/guides/content-security-policy)
- [MDN CSP Documentation](https://developer.mozilla.org/docs/Web/HTTP/CSP)
- [OWASP CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)

---

Last updated: 2025-01-08
Related task: INF-005
