/**
 * Analytics Package Main Exports
 *
 * Privacy-compliant analytics tracking with multi-provider support.
 *
 * @version 1.0.0
 * @agency/analytics
 */

// Core interfaces and types
export type {
  AnalyticsEvent,
  PageView,
  UserProperty,
  ConsentState,
  AnalyticsConfig,
  AnalyticsProvider,
  AnalyticsCapabilities,
  AnalyticsError,
  AnalyticsContext,
  AnalyticsMiddleware,
  AnalyticsFilter,
  AnalyticsProviderFactory,
  AnalyticsParameterValue,
  AnalyticsEventParameters,
} from './interfaces/analytics.adapter';

// Adapters
export { GA4Adapter } from './adapters/ga4.adapter';
export { PlausibleAdapter } from './adapters/plausible.adapter';

// Consent Management
export {
  ConsentManager,
  type ConsentConfig,
  type ConsentBannerConfig,
  type ConsentCategory,
  type ConsentEvent,
} from './consent/consent-manager';

// Analytics Manager (main class)
export { AnalyticsManager, type AnalyticsManagerConfig } from './core/analytics-manager';

// Utilities
export { AnalyticsUtils } from './utils/analytics-utils';

// React integration
export { AnalyticsProvider, useAnalytics, useConsent } from './react';

// Type guards and utilities
export type { 
  isAnalyticsEvent,
  isPageView,
  isUserProperty,
  isValidConsentState,
} from './utils/type-guards';
