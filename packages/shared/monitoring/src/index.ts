// Core monitoring classes
export { ErrorTracker } from './error/error-tracker';
export { PerformanceMonitor } from './performance/web-vitals';
export { AlertManager, type AlertEvent, type AlertChannel } from './alerts/alert-manager';

// Types
export type {
  MonitoringConfig,
  ErrorContext,
  PerformanceMetric,
  UserMetric,
  AlertConfig,
  MonitoringDashboardData,
  ErrorBoundaryState,
  MonitoringProviderProps,
  UseMonitoringReturn,
  MonitoringHookOptions,
} from './types/monitoring.types';

// Dashboard component
export { MonitoringDashboard } from './dashboard/monitoring-dashboard';

// Utility functions
export const createMonitoringConfig = (config: Partial<MonitoringConfig>): MonitoringConfig => ({
  sentryDsn: config.sentryDsn || '',
  environment: config.environment || 'development',
  release: config.release,
  sampleRate: config.sampleRate || 0.1,
  enablePerformanceMonitoring: config.enablePerformanceMonitoring ?? true,
  enableUserTracking: config.enableUserTracking ?? true,
  enableSessionReplay: config.enableSessionReplay ?? false,
  tracesSampleRate: config.tracesSampleRate || 0.05,
  profilesSampleRate: config.profilesSampleRate || 0.01,
  debug: config.debug || false,
});

export const createAlertConfig = (config: Partial<AlertConfig>): AlertConfig => ({
  enabled: config.enabled ?? true,
  thresholds: {
    errorRate: config.thresholds?.errorRate || 5,
    responseTime: config.thresholds?.responseTime || 1000,
    bounceRate: config.thresholds?.bounceRate || 0.5,
    conversionRate: config.thresholds?.conversionRate || 0.01,
    ...config.thresholds,
  },
  channels: {
    email: config.channels?.email ?? false,
    slack: config.channels?.slack ?? false,
    webhook: config.channels?.webhook,
    ...config.channels,
  },
  cooldown: config.cooldown || 5,
});
