import * as Sentry from '@sentry/core';
import type { ErrorEvent, EventHint, SeverityLevel, Breadcrumb } from '@sentry/core';
import type { MonitoringConfig, ErrorContext } from '../types/monitoring.types';

export class ErrorTracker {
  private static instance: ErrorTracker;
  private config: MonitoringConfig;
  private isInitialized = false;
  private sessionStartTime: number;
  private errorCounts: Map<string, number> = new Map();
  private lastAlertTime: Map<string, number> = new Map();

  private constructor(config: MonitoringConfig) {
    this.config = config;
    this.sessionStartTime = Date.now();
  }

  public static getInstance(config?: MonitoringConfig): ErrorTracker {
    if (!ErrorTracker.instance) {
      if (!config) {
        throw new Error('ErrorTracker requires config on first initialization');
      }
      ErrorTracker.instance = new ErrorTracker(config);
    }
    return ErrorTracker.instance;
  }

  public initialize(): void {
    if (this.isInitialized) {
      return;
    }

    try {
      Sentry.init({
        dsn: this.config.sentryDsn,
        environment: this.config.environment,
        release: this.config.release,
        sampleRate: this.config.sampleRate || 0.1,
        tracesSampleRate: this.config.tracesSampleRate || 0.05,
        profilesSampleRate: this.config.profilesSampleRate || 0.01,
        debug: this.config.debug || false,
        integrations: [
          new Sentry.BrowserTracing(),
          ...(this.config.enableSessionReplay ? [new Sentry.Replay()] : []),
        ],
        beforeSend: this.beforeSend.bind(this),
        beforeBreadcrumb: this.beforeBreadcrumb.bind(this),
        ignoreErrors: [
          // Common browser errors that are not actionable
          'Non-Error promise rejection captured',
          'ResizeObserver loop limit exceeded',
          'Network request failed',
          'Failed to fetch',
        ],
        denyUrls: [
          // Browser extensions
          /extensions\//i,
          /^chrome:\/\//i,
          /^chrome-extension:\/\//i,
          /^safari-web-extension:\/\//i,
          // Third-party scripts that often cause noise
          /googletagmanager\.com/i,
          /google-analytics\.com/i,
          /facebook\.net/i,
          /connect\.facebook\.net/i,
        ],
      });

      this.isInitialized = true;
      this.addBreadcrumb({
        message: 'Error tracking initialized',
        category: 'system',
        level: 'info',
        data: {
          environment: this.config.environment,
          sessionStartTime: this.sessionStartTime,
        },
      });
    } catch (error) {
      console.error('Failed to initialize error tracking:', error);
    }
  }

  private beforeSend(event: ErrorEvent, hint?: EventHint): ErrorEvent | null {
    // Add custom context to all events
    event.contexts = {
      ...event.contexts,
      monitoring: {
        sessionDuration: Date.now() - this.sessionStartTime,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
        url: typeof window !== 'undefined' ? window.location.href : 'server',
      },
    };

    // Track error counts for alerting
    const errorKey = this.getErrorKey(event);
    const currentCount = this.errorCounts.get(errorKey) || 0;
    this.errorCounts.set(errorKey, currentCount + 1);

    // Check if we should trigger an alert
    this.checkErrorAlerts(errorKey, event);

    // Filter out low-severity errors in production
    if (this.config.environment === 'production' && event.level === 'debug') {
      return null;
    }

    return event;
  }

  private beforeBreadcrumb(breadcrumb: Breadcrumb): Breadcrumb | null {
    // Filter out noisy breadcrumbs
    if (breadcrumb.category === 'xhr' && breadcrumb.data?.url) {
      const url = breadcrumb.data.url as string;
      // Filter out health checks and analytics calls
      if (url.includes('/health') || url.includes('/analytics') || url.includes('/ping')) {
        return null;
      }
    }

    // Add timestamp if missing
    if (!breadcrumb.timestamp) {
      breadcrumb.timestamp = Date.now() / 1000;
    }

    return breadcrumb;
  }

  private getErrorKey(event: ErrorEvent): string {
    const message = event.message || 'Unknown error';
    const stack = event.exception?.values?.[0]?.stacktrace;
    const stackHash = stack
      ? this.hashString(stack.frames?.map((f) => f.function).join('|') || '')
      : '';
    return `${message}:${stackHash}`;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  private checkErrorAlerts(errorKey: string, event: ErrorEvent): void {
    const count = this.errorCounts.get(errorKey) || 0;
    const lastAlert = this.lastAlertTime.get(errorKey) || 0;
    const now = Date.now();

    // Alert if error count exceeds threshold and cooldown period has passed
    if (count >= 5 && now - lastAlert > 5 * 60 * 1000) {
      // 5 errors, 5 minute cooldown
      this.triggerErrorAlert(errorKey, event, count);
      this.lastAlertTime.set(errorKey, now);
    }
  }

  private triggerErrorAlert(errorKey: string, event: ErrorEvent, count: number): void {
    // This would integrate with your alert system
    console.warn('Error threshold exceeded:', {
      errorKey,
      count,
      message: event.message,
      level: event.level,
    });

    // Add alert as breadcrumb
    this.addBreadcrumb({
      message: 'Error threshold alert triggered',
      category: 'alert',
      level: 'warning',
      data: {
        errorKey,
        count,
        threshold: 5,
      },
    });
  }

  public trackError(error: Error, context?: ErrorContext): string {
    if (!this.isInitialized) {
      console.warn('Error tracker not initialized, falling back to console');
      console.error(error, context);
      return 'fallback';
    }

    const errorId = Sentry.captureException(error, {
      level: context?.level || 'error',
      tags: {
        ...context?.tags,
        component: context?.tags?.component || 'unknown',
      },
      extra: {
        ...context?.extra,
        userId: context?.userId,
        sessionId: context?.sessionId,
      },
      fingerprint: context?.fingerprint,
    });

    // Add user context if available
    if (context?.userId) {
      Sentry.setUser({
        id: context.userId,
        email: context?.extra?.email,
        username: context?.extra?.username,
      });
    }

    return errorId;
  }

  public trackMessage(message: string, context: ErrorContext): string {
    if (!this.isInitialized) {
      console.warn('Error tracker not initialized, falling back to console');
      console.log(message, context);
      return 'fallback';
    }

    return Sentry.captureMessage(message, {
      level: context.level || 'info',
      tags: context?.tags,
      extra: context?.extra,
      fingerprint: context?.fingerprint,
    });
  }

  public addBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: SeverityLevel;
    data?: Record<string, any>;
  }): void {
    if (!this.isInitialized) {
      return;
    }

    Sentry.addBreadcrumb({
      message: breadcrumb.message,
      category: breadcrumb.category || 'custom',
      level: breadcrumb.level || 'info',
      data: breadcrumb.data,
      timestamp: Date.now() / 1000,
    });
  }

  public setUser(user: { id: string; email?: string; name?: string }): void {
    if (!this.isInitialized) {
      return;
    }

    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.name,
    });

    this.addBreadcrumb({
      message: 'User identified',
      category: 'auth',
      level: 'info',
      data: { userId: user.id },
    });
  }

  public clearUser(): void {
    if (!this.isInitialized) {
      return;
    }

    Sentry.setUser(null);
    this.addBreadcrumb({
      message: 'User cleared',
      category: 'auth',
      level: 'info',
    });
  }

  public setTag(key: string, value: string): void {
    if (!this.isInitialized) {
      return;
    }

    Sentry.setTag(key, value);
  }

  public setExtra(key: string, value: any): void {
    if (!this.isInitialized) {
      return;
    }

    Sentry.setExtra(key, value);
  }

  public getSessionStats(): {
    duration: number;
    errorCount: number;
    topError: string;
  } {
    const duration = Date.now() - this.sessionStartTime;
    let totalErrors = 0;
    let topError = '';
    let maxCount = 0;

    for (const [errorKey, count] of this.errorCounts.entries()) {
      totalErrors += count;
      if (count > maxCount) {
        maxCount = count;
        topError = errorKey;
      }
    }

    return {
      duration,
      errorCount: totalErrors,
      topError,
    };
  }

  public resetSession(): void {
    this.sessionStartTime = Date.now();
    this.errorCounts.clear();
    this.lastAlertTime.clear();

    this.addBreadcrumb({
      message: 'Session reset',
      category: 'system',
      level: 'info',
    });
  }
}
