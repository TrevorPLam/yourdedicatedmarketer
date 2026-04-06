import type { ErrorEvent, EventHint, SeverityLevel } from '@sentry/core';
import type { Metric } from 'web-vitals';

export interface MonitoringConfig {
  sentryDsn: string;
  environment: 'development' | 'staging' | 'production';
  release?: string;
  sampleRate?: number;
  enablePerformanceMonitoring?: boolean;
  enableUserTracking?: boolean;
  enableSessionReplay?: boolean;
  tracesSampleRate?: number;
  profilesSampleRate?: number;
  debug?: boolean;
}

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  level?: SeverityLevel;
  fingerprint?: string[];
}

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id?: string;
  navigationType?: string;
}

export interface UserMetric {
  userId: string;
  sessionId: string;
  timestamp: number;
  eventType: 'page_view' | 'click' | 'form_submit' | 'error' | 'performance';
  eventName: string;
  properties?: Record<string, any>;
}

export interface AlertConfig {
  enabled: boolean;
  thresholds: {
    errorRate: number; // errors per minute
    responseTime: number; // milliseconds
    bounceRate: number; // percentage
    conversionRate: number; // percentage
  };
  channels: {
    email: boolean;
    slack: boolean;
    webhook?: string;
  };
  cooldown: number; // minutes between alerts
}

export interface MonitoringDashboardData {
  errors: {
    total: number;
    rate: number;
    topErrors: Array<{
      message: string;
      count: number;
      lastOccurrence: Date;
    }>;
  };
  performance: {
    webVitals: PerformanceMetric[];
    pageLoadTimes: Array<{
      url: string;
      avgTime: number;
      sampleSize: number;
    }>;
  };
  users: {
    active: number;
    totalSessions: number;
    avgSessionDuration: number;
    bounceRate: number;
  };
  system: {
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
  };
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
  errorId?: string;
}

export interface MonitoringProviderProps {
  children: React.ReactNode;
  config: MonitoringConfig;
  user?: {
    id: string;
    email?: string;
    name?: string;
  };
}

export interface UseMonitoringReturn {
  trackError: (error: Error, context?: ErrorContext) => void;
  trackPerformance: (metric: PerformanceMetric) => void;
  trackUserEvent: (event: Omit<UserMetric, 'userId' | 'sessionId' | 'timestamp'>) => void;
  setUser: (user: { id: string; email?: string; name?: string }) => void;
  clearUser: () => void;
  addBreadcrumb: (breadcrumb: {
    message: string;
    category?: string;
    level?: SeverityLevel;
    data?: Record<string, any>;
  }) => void;
}

export interface MonitoringHookOptions {
  enableErrorTracking?: boolean;
  enablePerformanceTracking?: boolean;
  enableUserTracking?: boolean;
  customTags?: Record<string, string>;
}
