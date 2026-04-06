/**
 * Analytics Adapter Interface
 *
 * Provider-agnostic analytics interface supporting multiple analytics providers
 * with privacy compliance and consent management built-in.
 *
 * @version 1.0.0
 * @agency/analytics
 */

// Base parameter types for analytics events
export type AnalyticsParameterValue = string | number | boolean | null | undefined;
export type AnalyticsEventParameters = Record<string, AnalyticsParameterValue>;

export interface AnalyticsEvent {
  name: string;
  parameters?: AnalyticsEventParameters;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

export interface PageView {
  path: string;
  title?: string;
  location?: string;
  referrer?: string;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

export interface UserProperty {
  name: string;
  value: AnalyticsParameterValue;
  timestamp?: number;
}

export interface ConsentState {
  analytics: boolean;
  advertising: boolean;
  functional: boolean;
  personalization: boolean;
  timestamp: number;
  region?: string;
  version?: string;
}

export interface AnalyticsConfig {
  provider: 'ga4' | 'plausible' | 'custom';
  trackingId?: string;
  domain?: string;
  customEndpoint?: string;
  debug?: boolean;
  respectDoNotTrack?: boolean;
  defaultConsent?: Partial<ConsentState>;
  region?: string;
  cookieDomain?: string;
  sampleRate?: number;
}

export interface AnalyticsProvider {
  /**
   * Initialize the analytics provider
   */
  initialize(config: AnalyticsConfig): Promise<void>;

  /**
   * Track a custom event
   */
  track(event: AnalyticsEvent): Promise<void>;

  /**
   * Track a page view
   */
  pageview(pageView: PageView): Promise<void>;

  /**
   * Set user properties
   */
  setUserProperty(property: UserProperty): Promise<void>;

  /**
   * Set user ID for cross-session tracking
   */
  setUserId(userId: string): Promise<void>;

  /**
   * Update consent state
   */
  updateConsent(consent: ConsentState): Promise<void>;

  /**
   * Check if provider is ready
   */
  isReady(): boolean;

  /**
   * Get provider capabilities
   */
  getCapabilities(): AnalyticsCapabilities;

  /**
   * Clean up resources
   */
  destroy(): Promise<void>;
}

export interface AnalyticsCapabilities {
  pageViews: boolean;
  customEvents: boolean;
  userProperties: boolean;
  crossDomainTracking: boolean;
  ecommerceTracking: boolean;
  consentMode: boolean;
  serverSideTracking: boolean;
  realTimeReporting: boolean;
  dataRetention: number; // days
  cookielessTracking: boolean;
}

export interface AnalyticsError extends Error {
  provider: string;
  code: string;
  details?: AnalyticsEventParameters;
}

export interface AnalyticsContext {
  userId?: string;
  sessionId: string;
  userAgent: string;
  language: string;
  timezone: string;
  screenResolution?: string;
  viewportSize?: string;
  consent: ConsentState;
}

export interface AnalyticsMiddleware {
  name: string;
  beforeTrack?(event: AnalyticsEvent, context: AnalyticsContext): AnalyticsEvent | null;
  afterTrack?(event: AnalyticsEvent, context: AnalyticsContext): void;
  onError?(error: AnalyticsError, context: AnalyticsContext): void;
}

export interface AnalyticsFilter {
  name: string;
  shouldTrack?(event: AnalyticsEvent, context: AnalyticsContext): boolean;
  shouldPageview?(pageView: PageView, context: AnalyticsContext): boolean;
}

export type AnalyticsProviderFactory = (config: AnalyticsConfig) => AnalyticsProvider;
