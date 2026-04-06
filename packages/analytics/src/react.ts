/**
 * Analytics React Exports
 *
 * React hooks and components for analytics tracking.
 *
 * @version 1.0.0
 * @agency/analytics
 */

// React hooks
export {
  useAnalytics,
  useEventTracker,
  useInteractionTracker,
  useEcommerceTracker,
  usePerformanceTracker,
  type UseAnalyticsOptions,
  type UseAnalyticsReturn,
} from './hooks/use-analytics';

// React components
export { AnalyticsProvider as AnalyticsContextProvider } from './components/analytics-provider';
export { ConsentBanner } from './components/consent-banner';
