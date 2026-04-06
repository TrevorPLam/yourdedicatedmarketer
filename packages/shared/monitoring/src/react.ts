// React-specific exports
export {
  useMonitoring,
  useErrorTracking,
  usePerformanceTracking,
  useUserTracking,
  useMonitoringBoundary,
  useApiMonitoring,
  useSessionTracking,
  MonitoringProvider,
  type MonitoringProviderProps,
} from './hooks/use-monitoring';

// Error boundary component
export { MonitoringErrorBoundary } from './components/error-boundary';

// Performance components
export { WebVitalsReporter } from './components/web-vitals-reporter';
