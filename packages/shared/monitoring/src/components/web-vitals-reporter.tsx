import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';
import { ErrorTracker } from '../error/error-tracker';
import { PerformanceMonitor } from '../performance/web-vitals';

interface WebVitalsReporterProps {
  enabled?: boolean;
  onError?: (metric: any) => void;
  onReport?: (metric: any) => void;
}

export const WebVitalsReporter: React.FC<WebVitalsReporterProps> = ({
  enabled = true,
  onError,
  onReport,
}) => {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Initialize performance monitoring
    try {
      const performanceMonitor = PerformanceMonitor.getInstance();
      performanceMonitor.initialize();
    } catch (error) {
      console.warn('Failed to initialize performance monitoring:', error);
    }
  }, [enabled]);

  useReportWebVitals((metric) => {
    if (!enabled) return;

    try {
      // Send to Sentry
      if (window.Sentry) {
        window.Sentry.captureMessage(`Web Vital: ${metric.name}`, {
          level: 'info',
          tags: {
            web_vital: metric.name,
            rating: metric.rating,
          },
          contexts: {
            web_vitals: {
              value: metric.value,
              rating: metric.rating,
              delta: metric.delta,
              id: metric.id,
            },
          },
        });
      }

      // Send to our monitoring system
      const errorTracker = ErrorTracker.getInstance();
      errorTracker.trackMessage(`Web Vital: ${metric.name}`, {
        level: 'info',
        tags: {
          'web-vital': metric.name,
          rating: metric.rating,
          component: 'performance',
        },
        extra: {
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          url: window.location.href,
        },
      });

      // Custom callbacks
      onReport?.(metric);

      // Handle poor performance
      if (metric.rating === 'poor') {
        onError?.(metric);

        // Trigger alert for poor performance
        const alertManager = AlertManager.getInstance();
        alertManager.triggerAlert(
          'performance',
          'medium',
          `Poor ${metric.name} performance`,
          `${metric.name} is ${metric.rating}: ${metric.value}`,
          {
            metric: metric.name,
            value: metric.value,
            rating: metric.rating,
            url: window.location.href,
          }
        );
      }
    } catch (error) {
      console.error('Failed to report web vital:', error);
    }
  });

  return null;
};
