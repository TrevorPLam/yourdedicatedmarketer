/**
 * Google Analytics 4 Adapter
 *
 * Modern GA4 implementation with consent mode v2, enhanced measurement,
 * and privacy compliance features for 2026.
 *
 * @version 1.0.0
 * @agency/analytics
 */

import type {
  AnalyticsProvider,
  AnalyticsConfig,
  AnalyticsEvent,
  PageView,
  UserProperty,
  ConsentState,
  AnalyticsCapabilities,
  AnalyticsError,
  AnalyticsContext,
} from '../interfaces/analytics.adapter';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export class GA4Adapter implements AnalyticsProvider {
  private config: AnalyticsConfig | null = null;
  private isInitialized = false;
  private trackingId: string = '';
  private debugMode = false;

  constructor() {
    this.loadGAScript();
  }

  /**
   * Load Google Analytics script
   */
  private loadGAScript(): void {
    if (typeof window === 'undefined' || window.gtag) {
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';

    // Replace GA_MEASUREMENT_ID when config is set
    script.onload = () => {
      if (this.trackingId) {
        script.src = script.src.replace('GA_MEASUREMENT_ID', this.trackingId);
      }
    };

    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: any[]) {
      window.dataLayer!.push(arguments);
    };

    // Set default consent state (will be updated during initialization)
    window.gtag('consent', 'default', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      personalization_storage: 'denied',
      functionality_storage: 'denied',
      security_storage: 'granted',
    });
  }

  async initialize(config: AnalyticsConfig): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    this.config = config;
    this.trackingId = config.trackingId || '';
    this.debugMode = config.debug || false;

    if (!this.trackingId) {
      throw this.createError('MISSING_TRACKING_ID', 'GA4 tracking ID is required');
    }

    // Wait for gtag to be available
    await this.waitForGtag();

    // Initialize GA4
    window.gtag!('js', new Date());
    window.gtag!('config', this.trackingId, {
      debug_mode: this.debugMode,
      cookie_domain: config.cookieDomain || 'auto',
      sample_rate: config.sampleRate || 100,
      send_page_view: false, // We'll handle page views manually
      cookie_flags: 'SameSite=Lax;Secure',
      privacy_features: {
        enable_consent_mode: true,
        redact_device_info: true,
        anonymize_ip: true,
      },
    });

    // Set initial consent state
    if (config.defaultConsent) {
      const consentState: ConsentState = {
        analytics: config.defaultConsent.analytics ?? false,
        advertising: config.defaultConsent.advertising ?? false,
        functional: config.defaultConsent.functional ?? false,
        personalization: config.defaultConsent.personalization ?? false,
        timestamp: Date.now(),
      };
      await this.updateConsent(consentState);
    }

    this.isInitialized = true;
  }

  async track(event: AnalyticsEvent): Promise<void> {
    if (!this.isInitialized || !window.gtag) {
      throw this.createError('NOT_INITIALIZED', 'GA4 adapter not initialized');
    }

    try {
      const eventData = {
        event_category: event.parameters?.category || 'engagement',
        event_label: event.parameters?.label,
        value: event.parameters?.value,
        custom_parameters: event.parameters,
        send_to: this.trackingId,
      };

      window.gtag('event', event.name, eventData);
    } catch (error) {
      throw this.createError('TRACK_FAILED', 'Failed to track event', { error, event });
    }
  }

  async pageview(pageView: PageView): Promise<void> {
    if (!this.isInitialized || !window.gtag) {
      throw this.createError('NOT_INITIALIZED', 'GA4 adapter not initialized');
    }

    try {
      const pageData = {
        page_path: pageView.path,
        page_title: pageView.title,
        page_location: pageView.location,
        send_to: this.trackingId,
      };

      window.gtag('config', this.trackingId, pageData);
      window.gtag('event', 'page_view', pageData);
    } catch (error) {
      throw this.createError('PAGEVIEW_FAILED', 'Failed to track page view', { error, pageView });
    }
  }

  async setUserProperty(property: UserProperty): Promise<void> {
    if (!this.isInitialized || !window.gtag) {
      throw this.createError('NOT_INITIALIZED', 'GA4 adapter not initialized');
    }

    try {
      window.gtag('config', this.trackingId, {
        [property.name]: property.value,
      });
    } catch (error) {
      throw this.createError('USER_PROPERTY_FAILED', 'Failed to set user property', {
        error,
        property,
      });
    }
  }

  async setUserId(userId: string): Promise<void> {
    if (!this.isInitialized || !window.gtag) {
      throw this.createError('NOT_INITIALIZED', 'GA4 adapter not initialized');
    }

    try {
      window.gtag('config', this.trackingId, {
        user_id: userId,
      });
    } catch (error) {
      throw this.createError('USER_ID_FAILED', 'Failed to set user ID', { error, userId });
    }
  }

  async updateConsent(consent: ConsentState): Promise<void> {
    if (!window.gtag) {
      throw this.createError('NOT_INITIALIZED', 'GA4 adapter not initialized');
    }

    try {
      const consentConfig = {
        ad_storage: consent.advertising ? 'granted' : 'denied',
        analytics_storage: consent.analytics ? 'granted' : 'denied',
        ad_user_data: consent.advertising ? 'granted' : 'denied',
        ad_personalization: consent.personalization ? 'granted' : 'denied',
        personalization_storage: consent.personalization ? 'granted' : 'denied',
        functionality_storage: consent.functional ? 'granted' : 'denied',
        security_storage: 'granted', // Always granted for security
      };

      window.gtag('consent', 'update', consentConfig);
    } catch (error) {
      throw this.createError('CONSENT_UPDATE_FAILED', 'Failed to update consent', {
        error,
        consent,
      });
    }
  }

  isReady(): boolean {
    return this.isInitialized && typeof window !== 'undefined' && !!window.gtag;
  }

  getCapabilities(): AnalyticsCapabilities {
    return {
      pageViews: true,
      customEvents: true,
      userProperties: true,
      crossDomainTracking: true,
      ecommerceTracking: true,
      consentMode: true,
      serverSideTracking: true,
      realTimeReporting: true,
      dataRetention: 14, // months
      cookielessTracking: false, // GA4 requires cookies
    };
  }

  async destroy(): Promise<void> {
    // GA4 doesn't provide a destroy method, but we can clear the dataLayer
    if (window.dataLayer) {
      window.dataLayer.length = 0;
    }
    this.isInitialized = false;
    this.config = null;
  }

  /**
   * Wait for gtag to be available
   */
  private waitForGtag(timeout = 5000): Promise<void> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const checkGtag = () => {
        if (window.gtag) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(this.createError('GTAG_TIMEOUT', 'gtag not available within timeout'));
        } else {
          setTimeout(checkGtag, 100);
        }
      };

      checkGtag();
    });
  }

  /**
   * Create a standardized error
   */
  private createError(
    code: string,
    message: string,
    details?: Record<string, any>
  ): AnalyticsError {
    const error = new Error(message) as AnalyticsError;
    error.provider = 'ga4';
    error.code = code;
    error.details = details;
    return error;
  }

  /**
   * Enhanced measurement configuration
   */
  public configureEnhancedMeasurement(config: {
    scrollTracking?: boolean;
    outboundClickTracking?: boolean;
    fileDownloadTracking?: boolean;
    videoEngagementTracking?: boolean;
    siteSearchTracking?: boolean;
    formInteractionTracking?: boolean;
  }): void {
    if (!this.isInitialized || !window.gtag) {
      return;
    }

    const enhancedMeasurement: Record<string, boolean> = {
      scroll_tracking: config.scrollTracking ?? true,
      outbound_click_tracking: config.outboundClickTracking ?? true,
      file_download_tracking: config.fileDownloadTracking ?? true,
      video_engagement_tracking: config.videoEngagementTracking ?? true,
      site_search_tracking: config.siteSearchTracking ?? true,
      form_interaction_tracking: config.formInteractionTracking ?? true,
    };

    window.gtag('config', this.trackingId, {
      enhanced_measurement: enhancedMeasurement,
    });
  }

  /**
   * Set up cross-domain tracking
   */
  public configureCrossDomain(domains: string[]): void {
    if (!this.isInitialized || !window.gtag) {
      return;
    }

    window.gtag('config', this.trackingId, {
      linker: {
        domains: domains,
        accept_incoming: true,
        decorate_forms: true,
      },
    });
  }

  /**
   * Configure server-side tagging
   */
  public configureServerSide(containerUrl: string): void {
    if (!this.isInitialized || !window.gtag) {
      return;
    }

    window.gtag('config', this.trackingId, {
      server_container_url: containerUrl,
    });
  }
}
