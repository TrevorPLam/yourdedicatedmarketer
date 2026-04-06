// Astro specific monitoring utilities
import type { AstroIntegration } from 'astro';
import { ErrorTracker, PerformanceMonitor } from './index';

// Astro integration for monitoring
export function monitoringIntegration({
  sentryDsn,
  environment = 'development',
  enablePerformanceMonitoring = true,
}: {
  sentryDsn: string;
  environment?: string;
  enablePerformanceMonitoring?: boolean;
}): AstroIntegration {
  return {
    name: 'astro-monitoring',
    hooks: {
      'astro:config:setup': ({ injectScript, updateConfig }) => {
        // Inject monitoring setup script
        injectScript('page', () => {
          return `
            // Initialize monitoring
            (function() {
              if (typeof window !== 'undefined' && window.location) {
                // Initialize error tracking
                try {
                  const script = document.createElement('script');
                  script.src = 'https://browser.sentry-cdn.com/8.47.0/bundle.tracing.replay.min.js';
                  script.crossOrigin = 'anonymous';
                  script.onload = function() {
                    window.Sentry && window.Sentry.init({
                      dsn: '${sentryDsn}',
                      environment: '${environment}',
                      tracesSampleRate: 0.1,
                      replaysSessionSampleRate: 0.1,
                      replaysOnErrorSampleRate: 1.0,
                    });
                  };
                  document.head.appendChild(script);
                } catch (error) {
                  console.warn('Failed to initialize monitoring:', error);
                }
                
                // Initialize performance monitoring
                if (${enablePerformanceMonitoring}) {
                  try {
                    // Load web-vitals
                    const vitalsScript = document.createElement('script');
                    vitalsScript.src = 'https://unpkg.com/web-vitals@4/dist/web-vitals.iife.js';
                    vitalsScript.onload = function() {
                      if (window.webVitals) {
                        window.webVitals.getCLS((metric) => {
                          window.Sentry?.captureMessage('Web Vital: CLS', {
                            level: 'info',
                            tags: { web_vital: 'CLS', rating: metric.rating },
                            extra: { value: metric.value, rating: metric.rating }
                          });
                        });
                        window.webVitals.getFID((metric) => {
                          window.Sentry?.captureMessage('Web Vital: FID', {
                            level: 'info',
                            tags: { web_vital: 'FID', rating: metric.rating },
                            extra: { value: metric.value, rating: metric.rating }
                          });
                        });
                        window.webVitals.getLCP((metric) => {
                          window.Sentry?.captureMessage('Web Vital: LCP', {
                            level: 'info',
                            tags: { web_vital: 'LCP', rating: metric.rating },
                            extra: { value: metric.value, rating: metric.rating }
                          });
                        });
                      }
                    };
                    document.head.appendChild(vitalsScript);
                  } catch (error) {
                    console.warn('Failed to initialize performance monitoring:', error);
                  }
                }
              }
            })();
          `;
        });

        // Update Astro config for performance
        updateConfig({
          vite: {
            build: {
              rollupOptions: {
                output: {
                  manualChunks: {
                    vendor: ['@sentry/browser'],
                    monitoring: ['web-vitals'],
                  },
                },
              },
            },
          },
        });
      },
      'astro:build:done': ({ pages, dir }) => {
        // Post-build monitoring setup
        console.log('✅ Monitoring integration completed');
        console.log(`📊 Built ${pages.length} pages with monitoring`);
      },
    },
  };
}

// Astro component for error boundaries
export const MonitoringErrorBoundary = `
---
interface Props {
  fallback?: string;
}

const { fallback = 'Something went wrong.' } = Astro.props;
---

<div id="error-boundary-fallback" style="display: none;">
  <div style="
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    padding: 2rem;
    font-family: system-ui, sans-serif;
  ">
    <h2 style="color: #dc2626; margin-bottom: 1rem;">⚠️ Error</h2>
    <p style="color: #6b7280; text-align: center; margin-bottom: 2rem;">${fallback}</p>
    <button
      onclick="window.location.reload()"
      style="
        padding: 0.75rem 1.5rem;
        background-color: #3b82f6;
        color: white;
        border: none;
        border-radius: 0.375rem;
        cursor: pointer;
      "
    >
      Reload Page
    </button>
  </div>
</div>

<script>
  // Global error handler for Astro pages
  window.addEventListener('error', (event) => {
    if (window.Sentry) {
      window.Sentry.captureException(event.error);
    }
    
    // Show fallback UI
    const fallback = document.getElementById('error-boundary-fallback');
    if (fallback) {
      fallback.style.display = 'block';
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (window.Sentry) {
      window.Sentry.captureException(event.reason);
    }
  });
</script>
`;

// Astro layout component for monitoring
export const MonitoringLayout = `
---
interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="generator" content={Astro.generator} />
  <title>{title}</title>
  {description && <meta name="description" content={description} />}
  
  <!-- Performance optimizations -->
  <link rel="dns-prefetch" href="//cdn.sentry-cdn.com" />
  <link rel="preconnect" href="//browser.sentry-cdn.com" crossorigin />
  
  <!-- Security headers -->
  <meta http-equiv="X-Content-Type-Options" content="nosniff" />
  <meta http-equiv="X-Frame-Options" content="DENY" />
  <meta http-equiv="X-XSS-Protection" content="1; mode=block" />
  
  <slot />
</head>
<body>
  <slot />
  
  <!-- Performance monitoring -->
  <script>
    // Track page load performance
    window.addEventListener('load', () => {
      if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        
        if (window.Sentry) {
          window.Sentry.addBreadcrumb({
            message: 'Page load completed',
            category: 'performance',
            level: 'info',
            data: { loadTime, url: window.location.href }
          });
          
          if (loadTime > 3000) {
            window.Sentry.captureMessage('Slow page load detected', {
              level: 'warning',
              extra: { loadTime, url: window.location.href }
            });
          }
        }
      }
    });
    
    // Track Core Web Vitals
    if ('webVitals' in window) {
      window.webVitals.getCLS((metric) => {
        console.log('CLS:', metric);
        if (window.Sentry) {
          window.Sentry.captureMessage('Web Vital: CLS', {
            level: 'info',
            tags: { web_vital: 'CLS', rating: metric.rating },
            extra: { value: metric.value, rating: metric.rating }
          });
        }
      });
      
      window.webVitals.getFID((metric) => {
        console.log('FID:', metric);
        if (window.Sentry) {
          window.Sentry.captureMessage('Web Vital: FID', {
            level: 'info',
            tags: { web_vital: 'FID', rating: metric.rating },
            extra: { value: metric.value, rating: metric.rating }
          });
        }
      });
      
      window.webVitals.getLCP((metric) => {
        console.log('LCP:', metric);
        if (window.Sentry) {
          window.Sentry.captureMessage('Web Vital: LCP', {
            level: 'info',
            tags: { web_vital: 'LCP', rating: metric.rating },
            extra: { value: metric.value, rating: metric.rating }
          });
        }
      });
    }
  </script>
</body>
</html>
`;

// Utility for Astro API routes
export const withAstroMonitoring = (handler: (context: any) => Promise<Response>) => {
  return async (context: any): Promise<Response> => {
    const start = performance.now();

    try {
      const result = await handler(context);
      const duration = performance.now() - start;

      // Log performance
      console.log(`API call completed in ${duration.toFixed(2)}ms`);

      // Add performance headers
      result.headers.set('X-Response-Time', duration.toString());
      result.headers.set('X-Request-ID', crypto.randomUUID());

      return result;
    } catch (error) {
      const duration = performance.now() - start;

      // Log error
      console.error(`API call failed after ${duration.toFixed(2)}ms:`, error);

      // Track error if Sentry is available
      if (typeof globalThis !== 'undefined' && (globalThis as any).Sentry) {
        (globalThis as any).Sentry.captureException(error, {
          tags: {
            component: 'astro-api',
            route: context.url?.pathname || 'unknown',
          },
          extra: {
            duration,
            method: context.request?.method,
          },
        });
      }

      throw error;
    }
  };
};
