// Next.js specific monitoring utilities
import * as Sentry from '@sentry/nextjs';
import type { NextConfig } from 'next';
import { ErrorTracker, PerformanceMonitor, AlertManager } from './index';

// Next.js configuration for monitoring
export const createNextMonitoringConfig = (sentryDsn: string): Partial<NextConfig> => ({
  sentry: {
    hideSourceMaps: true,
    widenClientFileUpload: true,
  },
  experimental: {
    instrumentationHook: true,
  },
  // Add performance headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
      ],
    },
  ],
});

// Sentry configuration files content
export const sentryClientConfig = `
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  debug: process.env.NODE_ENV === 'development',
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  beforeSend(event) {
    // Filter out certain errors
    if (event.exception) {
      const error = event.exception.values?.[0];
      if (error?.value?.includes('Non-Error promise rejection')) {
        return null;
      }
    }
    return event;
  },
});
`;

export const sentryServerConfig = `
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  debug: process.env.NODE_ENV === 'development',
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
  ],
});
`;

export const sentryEdgeConfig = `
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
});
`;

// Global error boundary for Next.js App Router
export const globalErrorContent = `
'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#dc2626' }}>
            Something went wrong
          </h2>
          <p style={{ marginBottom: '2rem', textAlign: 'center', color: '#6b7280' }}>
            We've been notified about this issue and are working to fix it.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Try again
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '2rem', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', marginBottom: '1rem' }}>
                Error details
              </summary>
              <pre style={{
                backgroundColor: '#f3f4f6',
                padding: '1rem',
                borderRadius: '0.375rem',
                overflow: 'auto',
                fontSize: '0.875rem'
              }}>
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </body>
    </html>
  );
}
`;

// Middleware for monitoring
export const monitoringMiddleware = `
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const start = Date.now();
  
  // Add monitoring headers
  const response = NextResponse.next();
  
  // Add request timing header
  response.headers.set('X-Response-Time', String(Date.now() - start));
  
  // Add request ID for tracing
  response.headers.set('X-Request-ID', crypto.randomUUID());
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api/health|_next/static|_next/image|favicon.ico).*)',
  ],
};
`;

// API route wrapper for monitoring
export const withMonitoring = <T extends any[], R>(handler: (...args: T) => Promise<R>) => {
  return async (...args: T): Promise<R> => {
    const start = performance.now();

    try {
      const result = await handler(...args);
      const duration = performance.now() - start;

      // Track successful API call
      const performanceMonitor = PerformanceMonitor.getInstance();
      performanceMonitor.trackApiCall(args[0]?.url || 'unknown', start, performance.now(), 200);

      return result;
    } catch (error) {
      const duration = performance.now() - start;

      // Track failed API call
      const performanceMonitor = PerformanceMonitor.getInstance();
      performanceMonitor.trackApiCall(args[0]?.url || 'unknown', start, performance.now(), 500);

      // Track error
      const errorTracker = ErrorTracker.getInstance();
      errorTracker.trackError(error as Error, {
        tags: {
          component: 'api',
          endpoint: args[0]?.url || 'unknown',
        },
      });

      throw error;
    }
  };
};

// Server Actions wrapper
export const withServerActionMonitoring = <T extends any[], R>(
  actionName: string,
  handler: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    return Sentry.withServerActionInstrumentation(
      actionName,
      { recordResponse: true },
      async () => {
        const start = performance.now();

        try {
          const result = await handler(...args);
          const duration = performance.now() - start;

          // Track performance
          const performanceMonitor = PerformanceMonitor.getInstance();
          performanceMonitor.trackCustomMetric(`server-action-${actionName}`, duration, 'ms');

          return result;
        } catch (error) {
          // Track error
          const errorTracker = ErrorTracker.getInstance();
          errorTracker.trackError(error as Error, {
            tags: {
              component: 'server-action',
              action: actionName,
            },
          });

          throw error;
        }
      }
    );
  };
};
