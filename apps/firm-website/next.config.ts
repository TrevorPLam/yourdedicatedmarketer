import type { NextConfig } from 'next';
import createMDX from '@next/mdx';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  typedRoutes: true,
  transpilePackages: ['@repo/ui'],
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 96, 128, 256, 384, 640],
    minimumCacheTTL: 604800,
  },
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Vary',
            value: 'RSC, Next-Router-State-Tree, Next-Router-Prefetch, Accept-Encoding',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          ...(process.env.NODE_ENV === 'production'
            ? [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=31536000; includeSubDomains; preload',
                },
              ]
            : []),
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:; frame-ancestors 'none'; upgrade-insecure-requests;",
            // NOTE: 'unsafe-inline' and 'unsafe-eval' are currently required in script-src:
            // - 'unsafe-eval': React uses eval() in development for enhanced debugging (server-side error stack reconstruction)
            // - 'unsafe-inline': Required for Sentry scripts, GA4, and inline JSON-LD/MDX rendering
            // Future hardening: Implement CSP nonces via middleware to selectively allow inline scripts without 'unsafe-inline'
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const sentryOptions = {
  hideSourceMaps: true,
  webpack: {
    autoInstrumentServerFunctions: true,
  },
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
};

export default withSentryConfig(withMDX(nextConfig), sentryOptions);
