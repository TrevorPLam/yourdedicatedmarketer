import { getCLS, getFID, getFCP, getLCP, getTTFB, getINP, type Metric } from 'web-vitals';
import type { PerformanceMetric, MonitoringConfig } from '../types/monitoring.types';
import { ErrorTracker } from '../error/error-tracker';

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private config: MonitoringConfig;
  private errorTracker: ErrorTracker;
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  private constructor(config: MonitoringConfig) {
    this.config = config;
    this.errorTracker = ErrorTracker.getInstance(config);
  }

  public static getInstance(config?: MonitoringConfig): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      if (!config) {
        throw new Error('PerformanceMonitor requires config on first initialization');
      }
      PerformanceMonitor.instance = new PerformanceMonitor(config);
    }
    return PerformanceMonitor.instance;
  }

  public initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    try {
      // Initialize Core Web Vitals
      this.initializeWebVitals();

      // Initialize custom performance observers
      this.initializePerformanceObservers();

      this.isInitialized = true;

      this.errorTracker.addBreadcrumb({
        message: 'Performance monitoring initialized',
        category: 'performance',
        level: 'info',
        data: {
          enabledMetrics: ['CLS', 'FID', 'FCP', 'LCP', 'TTFB', 'INP', 'custom'],
        },
      });
    } catch (error) {
      this.errorTracker.trackError(error as Error, {
        level: 'warning',
        tags: { component: 'performance-monitor' },
      });
    }
  }

  private initializeWebVitals(): void {
    // Core Web Vitals with proper thresholds
    const vitalsConfig = {
      reportAllChanges: true,
    };

    // Cumulative Layout Shift (CLS) - threshold: 0.1
    getCLS((metric: Metric) => {
      this.handleWebVital(metric, {
        threshold: 0.1,
        unit: 'score',
      });
    }, vitalsConfig);

    // First Input Delay (FID) - threshold: 100ms
    getFID((metric: Metric) => {
      this.handleWebVital(metric, {
        threshold: 100,
        unit: 'ms',
      });
    }, vitalsConfig);

    // First Contentful Paint (FCP) - threshold: 1.8s
    getFCP((metric: Metric) => {
      this.handleWebVital(metric, {
        threshold: 1800,
        unit: 'ms',
      });
    }, vitalsConfig);

    // Largest Contentful Paint (LCP) - threshold: 2.5s
    getLCP((metric: Metric) => {
      this.handleWebVital(metric, {
        threshold: 2500,
        unit: 'ms',
      });
    }, vitalsConfig);

    // Time to First Byte (TTFB) - threshold: 800ms
    getTTFB((metric: Metric) => {
      this.handleWebVital(metric, {
        threshold: 800,
        unit: 'ms',
      });
    }, vitalsConfig);

    // Interaction to Next Paint (INP) - threshold: 200ms
    getINP((metric: Metric) => {
      this.handleWebVital(metric, {
        threshold: 200,
        unit: 'ms',
      });
    }, vitalsConfig);
  }

  private handleWebVital(metric: Metric, options: { threshold: number; unit: string }): void {
    const performanceMetric: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      rating: this.getRating(metric.value, options.threshold),
      delta: metric.delta,
      id: metric.id,
      navigationType: this.getNavigationType(),
    };

    this.metrics.push(performanceMetric);
    this.reportMetric(performanceMetric);

    // Alert on poor performance
    if (performanceMetric.rating === 'poor') {
      this.errorTracker.trackMessage(`Poor ${metric.name}: ${metric.value}${options.unit}`, {
        level: 'warning',
        tags: {
          metric: metric.name,
          rating: 'poor',
          component: 'performance',
        },
        extra: {
          value: metric.value,
          threshold: options.threshold,
          unit: options.unit,
          url: window.location.href,
        },
      });
    }
  }

  private getRating(value: number, threshold: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= threshold * 0.5) return 'good';
    if (value <= threshold) return 'needs-improvement';
    return 'poor';
  }

  private getNavigationType(): string {
    if (typeof window === 'undefined' || !window.performance?.navigation) {
      return 'unknown';
    }

    const navType = window.performance.navigation.type;
    switch (navType) {
      case 0:
        return 'navigate';
      case 1:
        return 'reload';
      case 2:
        return 'back_forward';
      default:
        return 'unknown';
    }
  }

  private initializePerformanceObservers(): void {
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      return;
    }

    // Observe long tasks
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            // Long task threshold
            this.handleLongTask(entry as PerformanceEntry);
          }
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    } catch (error) {
      // Long task API might not be supported
    }

    // Observe resource timing
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.handleResourceTiming(entry as PerformanceResourceTiming);
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    } catch (error) {
      // Resource timing might not be supported
    }

    // Observe navigation timing
    try {
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.handleNavigationTiming(entry as PerformanceNavigationTiming);
        }
      });
      navigationObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navigationObserver);
    } catch (error) {
      // Navigation timing might not be supported
    }
  }

  private handleLongTask(entry: PerformanceEntry): void {
    this.errorTracker.trackMessage(`Long task detected: ${entry.duration.toFixed(2)}ms`, {
      level: 'info',
      tags: {
        'performance.long-task': 'true',
        component: 'performance',
      },
      extra: {
        duration: entry.duration,
        startTime: entry.startTime,
        url: window.location.href,
      },
    });
  }

  private handleResourceTiming(entry: PerformanceResourceTiming): void {
    // Only track significant resources (>100ms or >1MB)
    const duration = entry.responseEnd - entry.requestStart;
    const size = entry.transferSize || 0;

    if (duration > 100 || size > 1024 * 1024) {
      this.errorTracker.addBreadcrumb({
        message: 'Resource performance',
        category: 'performance',
        level: 'info',
        data: {
          name: entry.name,
          duration: duration.toFixed(2),
          size: size,
          type: entry.initiatorType,
        },
      });
    }
  }

  private handleNavigationTiming(entry: PerformanceNavigationTiming): void {
    const navigationMetric: PerformanceMetric = {
      name: 'navigation',
      value: entry.loadEventEnd - entry.navigationStart,
      rating: this.getRating(
        entry.loadEventEnd - entry.navigationStart,
        3000 // 3 second threshold
      ),
      navigationType: this.getNavigationType(),
    };

    this.metrics.push(navigationMetric);
    this.reportMetric(navigationMetric);
  }

  private reportMetric(metric: PerformanceMetric): void {
    // Send to Sentry
    this.errorTracker.trackMessage(`Web Vital: ${metric.name}`, {
      level: 'info',
      tags: {
        'web-vital': metric.name,
        rating: metric.rating,
        component: 'performance',
      },
      extra: {
        value: metric.value,
        rating: metric.rating,
        navigationType: metric.navigationType,
      },
    });

    // Store for dashboard
    this.metrics.push(metric);

    // Keep only last 100 metrics to prevent memory issues
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  public trackCustomMetric(
    name: string,
    value: number,
    unit: string = 'ms',
    threshold?: number
  ): void {
    const metric: PerformanceMetric = {
      name,
      value,
      rating: threshold ? this.getRating(value, threshold) : 'good',
    };

    this.metrics.push(metric);
    this.reportMetric(metric);
  }

  public trackPageLoad(url: string, loadTime: number): void {
    this.trackCustomMetric('page-load', loadTime, 'ms', 3000);

    this.errorTracker.addBreadcrumb({
      message: 'Page load completed',
      category: 'navigation',
      level: 'info',
      data: {
        url,
        loadTime,
      },
    });
  }

  public trackApiCall(endpoint: string, duration: number, status: number): void {
    const metricName = `api-${endpoint.replace(/[^a-zA-Z0-9]/g, '-')}`;
    const threshold = status >= 400 ? 0 : 1000; // Failed calls are always poor

    this.trackCustomMetric(metricName, duration, 'ms', threshold);

    this.errorTracker.addBreadcrumb({
      message: 'API call completed',
      category: 'api',
      level: status >= 400 ? 'warning' : 'info',
      data: {
        endpoint,
        duration,
        status,
      },
    });
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter((metric) => metric.name === name);
  }

  public getAverageMetric(name: string): number | null {
    const nameMetrics = this.getMetricsByName(name);
    if (nameMetrics.length === 0) return null;

    const sum = nameMetrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / nameMetrics.length;
  }

  public getPerformanceScore(): {
    overall: number;
    vitals: Record<string, number>;
  } {
    const vitalMetrics = ['CLS', 'FID', 'FCP', 'LCP', 'TTFB', 'INP'];
    const scores: Record<string, number> = {};
    let totalScore = 0;
    let count = 0;

    for (const vital of vitalMetrics) {
      const metrics = this.getMetricsByName(vital);
      if (metrics.length > 0) {
        const latest = metrics[metrics.length - 1];
        let score = 100;

        switch (latest.rating) {
          case 'good':
            score = 100;
            break;
          case 'needs-improvement':
            score = 50;
            break;
          case 'poor':
            score = 0;
            break;
        }

        scores[vital] = score;
        totalScore += score;
        count++;
      }
    }

    return {
      overall: count > 0 ? Math.round(totalScore / count) : 0,
      vitals: scores,
    };
  }

  public cleanup(): void {
    // Disconnect all observers
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.metrics = [];
    this.isInitialized = false;
  }
}
