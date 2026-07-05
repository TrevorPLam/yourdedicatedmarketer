# Security

This document outlines the security measures implemented in the Your Dedicated Marketer application.

## Security Headers

Security headers are configured in `apps/firm-website/next.config.ts` and applied to all routes via the `headers()` function.

### Implemented Headers

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Frame-Options` | `SAMEORIGIN` | Prevents clickjacking by restricting frame embedding to same origin |
| `X-XSS-Protection` | `1; mode=block` | Enables browser XSS filtering and blocks attacks |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME type sniffing, reducing drive-by download risks |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` (production only) | Enforces HTTPS connections for 1 year, including subdomains |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls referrer information sent on navigation |
| `Vary` | `RSC, Next-Router-State-Tree, Next-Router-Prefetch, Accept-Encoding` | Required for Next.js RSC caching and prefetching |

### Next.js-Specific Headers

The `Vary` header with RSC-related values is critical for Next.js App Router:
- `RSC` - React Server Component caching
- `Next-Router-State-Tree` - Router state management
- `Next-Router-Prefetch` - Prefetching behavior
- `Accept-Encoding` - Compression negotiation

**Note:** Do not remove these Vary values as they will break RSC caching and cause incorrect content to be served.

### HSTS in Development

`Strict-Transport-Security` is only applied in production (`NODE_ENV === 'production'`) to avoid issues during local development with HTTP.

### Powered By Header

The `X-Powered-By` header is disabled via `poweredByHeader: false` to reduce information disclosure.

## Content Security Policy (CSP)

A Content Security Policy is configured in `apps/firm-website/next.config.ts` and applied to all routes via the `headers()` function.

### Implemented Policy

The CSP header includes the following directives:

| Directive | Value | Purpose |
|-----------|-------|---------|
| `default-src` | `'self'` | Restricts all content types to the same origin by default |
| `script-src` | `'self' 'unsafe-inline' 'unsafe-eval'` | Allows scripts from same origin; `unsafe-inline` and `unsafe-eval` are required for Next.js development and runtime |
| `style-src` | `'self' 'unsafe-inline'` | Allows styles from same origin; `unsafe-inline` is required for Tailwind CSS |
| `img-src` | `'self' data: https:` | Allows images from same origin, data URIs, and HTTPS sources |
| `font-src` | `'self' https:` | Allows fonts from same origin and HTTPS sources |
| `connect-src` | `'self' https:` | Allows API calls to same origin and HTTPS endpoints |
| `frame-ancestors` | `'none'` | Prevents the site from being embedded in frames (clickjacking protection) |
| `upgrade-insecure-requests` | - | Upgrades HTTP requests to HTTPS automatically |

### Exceptions and Rationale

- **`unsafe-inline` in script-src**: Required for Next.js inline scripts and development mode
- **`unsafe-eval` in script-src**: Required for Next.js runtime and some third-party libraries
- **`unsafe-inline` in style-src**: Required for Tailwind CSS inline styles
- **data: in img-src**: Allows data URIs for images (used by some components)
- **https: in img-src, font-src, connect-src**: Allows loading external resources from HTTPS sources (e.g., Google Fonts, analytics)

### Future Enhancements

Post-launch, consider:
- Nonce-based CSP for stricter script-src control
- CSP reporting endpoint for monitoring violations
- Restricting specific domains instead of broad `https:`

## Environment Variables

Sensitive environment variables are never prefixed with `NEXT_PUBLIC_` to prevent client-side exposure. See `docs/environment.md` for the full list.

## Server Actions Security

Next.js Server Actions include built-in CSRF protection by comparing the `Origin` header against the `Host` header. Custom API routes that modify state should still verify the Origin or use CSRF tokens.

## Future Security Enhancements

- Content Security Policy (T009)
- Sentry error tracking (T010)
- Rate limiting on API routes
- Input validation and sanitization
- Regular dependency updates
