/**
 * Plausible Analytics Adapter
 *
 * Privacy-focused analytics adapter for Plausible Analytics.
 * Cookieless, GDPR/CCPA compliant, and lightweight.
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
} from '../interfaces/analytics.adapter';

declare global {
  interface Window {
    plausible?: ((...args: any[]) => void) & { q?: any[] };
  }
}

export class PlausibleAdapter implements AnalyticsProvider {
  private config: AnalyticsConfig | null = null;
  private isInitialized = false;
  private domain: string = '';
  private debugMode = false;

  constructor() {
    this.loadPlausibleScript();
  }

  /**
   * Load Plausible Analytics script
   */
  private loadPlausibleScript(): void {
    if (typeof window === 'undefined' || window.plausible) {
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = 'https://plausible.io/js/script.js';
    script.setAttribute('data-domain', 'auto'); // Will be updated during initialization

    document.head.appendChild(script);

    // Initialize plausible function
    const plausibleFn = function plausible(...args: any[]) {
      // Queue events if script not loaded
      (plausibleFn.q = plausibleFn.q || []).push(arguments);
    } as ((...args: any[]) => void) & { q?: any[] };

    window.plausible = plausibleFn;
  }

  async initialize(config: AnalyticsConfig): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    this.config = config;
    this.domain = config.domain || window.location.hostname;
    this.debugMode = config.debug || false;

    // Wait for plausible to be available
    await this.waitForPlausible();

    // Update script data-domain attribute
    const script = document.querySelector('script[data-domain]');
    if (script) {
      script.setAttribute('data-domain', this.domain);
    }

    // Initialize plausible
    if (window.plausible) {
      window.plausible('pageview', {
        u: window.location.href,
        d: this.domain,
      });
    }

    this.isInitialized = true;
  }

  async track(event: AnalyticsEvent): Promise<void> {
    if (!this.isInitialized || !window.plausible) {
      throw this.createError('NOT_INITIALIZED', 'Plausible adapter not initialized');
    }

    try {
      const eventData = {
        props: event.parameters || {},
        callback: event.parameters?.callback,
        u: window.location.href,
        d: this.domain,
      };

      window.plausible(event.name, eventData);
    } catch (error) {
      throw this.createError('TRACK_FAILED', 'Failed to track event', { error, event });
    }
  }

  async pageview(pageView: PageView): Promise<void> {
    if (!this.isInitialized || !window.plausible) {
      throw this.createError('NOT_INITIALIZED', 'Plausible adapter not initialized');
    }

    try {
      const pageData = {
        u: pageView.location || `${window.location.origin}${pageView.path}`,
        d: this.domain,
        r: pageView.referrer,
        props: {
          title: pageView.title,
        },
      };

      window.plausible('pageview', pageData);
    } catch (error) {
      throw this.createError('PAGEVIEW_FAILED', 'Failed to track page view', { error, pageView });
    }
  }

  async setUserProperty(property: UserProperty): Promise<void> {
    if (!this.isInitialized || !window.plausible) {
      throw this.createError('NOT_INITIALIZED', 'Plausible adapter not initialized');
    }

    try {
      // Plausible handles user properties through custom event props
      // We'll track this as a custom event for user property changes
      window.plausible('user_property', {
        props: {
          property: property.name,
          value: property.value,
          timestamp: property.timestamp || Date.now(),
        },
      });
    } catch (error) {
      throw this.createError('USER_PROPERTY_FAILED', 'Failed to set user property', {
        error,
        property,
      });
    }
  }

  async setUserId(userId: string): Promise<void> {
    if (!this.isInitialized || !window.plausible) {
      throw this.createError('NOT_INITIALIZED', 'Plausible adapter not initialized');
    }

    try {
      // Plausible doesn't support user IDs directly (privacy-focused)
      // We'll track this as a custom event for user identification
      window.plausible('user_identified', {
        props: {
          user_id_hash: this.hashUserId(userId), // Hash for privacy
          timestamp: Date.now(),
        },
      });
    } catch (error) {
      throw this.createError('USER_ID_FAILED', 'Failed to set user ID', { error, userId });
    }
  }

  async updateConsent(consent: ConsentState): Promise<void> {
    // Plausible is privacy-first and doesn't require consent management
    // But we'll track consent changes for analytics purposes
    if (!this.isInitialized || !window.plausible) {
      return;
    }

    try {
      window.plausible('consent_updated', {
        props: {
          analytics_consent: consent.analytics,
          advertising_consent: consent.advertising,
          functional_consent: consent.functional,
          personalization_consent: consent.personalization,
          region: consent.region,
          timestamp: consent.timestamp,
        },
      });
    } catch (error) {
      throw this.createError('CONSENT_UPDATE_FAILED', 'Failed to update consent', {
        error,
        consent,
      });
    }
  }

  isReady(): boolean {
    return this.isInitialized && typeof window !== 'undefined' && !!window.plausible;
  }

  getCapabilities(): AnalyticsCapabilities {
    return {
      pageViews: true,
      customEvents: true,
      userProperties: true, // Limited - through custom events
      crossDomainTracking: false, // Not supported in Plausible
      ecommerceTracking: false, // Not supported in Plausible
      consentMode: false, // Not required - privacy-first
      serverSideTracking: false, // Not supported
      realTimeReporting: true,
      dataRetention: 365, // days - configurable in Plausible
      cookielessTracking: true, // Plausible is cookieless by default
    };
  }

  async destroy(): Promise<void> {
    // Plausible doesn't provide a destroy method
    // We can remove the script if needed
    const script = document.querySelector('script[src*="plausible.io"]');
    if (script && script.parentNode) {
      script.parentNode.removeChild(script);
    }

    if (window.plausible) {
      delete window.plausible;
    }

    this.isInitialized = false;
    this.config = null;
  }

  /**
   * Wait for plausible to be available
   */
  private waitForPlausible(timeout = 5000): Promise<void> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const checkPlausible = () => {
        if (window.plausible) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(this.createError('PLAUSIBLE_TIMEOUT', 'plausible not available within timeout'));
        } else {
          setTimeout(checkPlausible, 100);
        }
      };

      checkPlausible();
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
    error.provider = 'plausible';
    error.code = code;
    error.details = details;
    return error;
  }

  /**
   * Hash user ID for privacy (simple hash function)
   * In production, use a proper cryptographic hash
   */
  private hashUserId(userId: string): string {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  /**
   * Configure custom event tracking
   */
  public configureCustomEvents(events: string[]): void {
    // Plausible automatically tracks custom events
    // This is for documentation and validation purposes
    if (this.debugMode) {
      console.log('Plausible: Custom events configured:', events);
    }
  }

  /**
   * Enable outbound link tracking
   */
  public enableOutboundLinkTracking(): void {
    if (!this.isInitialized) {
      return;
    }

    // Plausible automatically tracks outbound links
    // This method is for explicit control
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.hostname !== window.location.hostname) {
        window.plausible?.('outbound_link', {
          props: {
            url: link.href,
            text: link.textContent?.trim() || '',
          },
        });
      }
    });
  }

  /**
   * Enable file download tracking
   */
  public enableFileDownloadTracking(): void {
    if (!this.isInitialized) {
      return;
    }

    // Plausible automatically tracks file downloads
    // This method is for explicit control
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');

      if (link && this.isFileDownloadLink(link.href)) {
        window.plausible?.('file_download', {
          props: {
            url: link.href,
            file_type: this.getFileType(link.href),
          },
        });
      }
    });
  }

  /**
   * Check if link is a file download
   */
  private isFileDownloadLink(url: string): boolean {
    const fileExtensions = [
      '.pdf',
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
      '.ppt',
      '.pptx',
      '.zip',
      '.rar',
      '.7z',
      '.tar',
      '.gz',
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.bmp',
      '.svg',
      '.mp3',
      '.wav',
      '.ogg',
      '.mp4',
      '.avi',
      '.mov',
    ];

    return fileExtensions.some((ext) => url.toLowerCase().includes(ext));
  }

  /**
   * Get file type from URL
   */
  private getFileType(url: string): string {
    const lastDot = url.lastIndexOf('.');
    return lastDot !== -1 ? url.substring(lastDot + 1).toLowerCase() : 'unknown';
  }

  /**
   * Configure revenue tracking (e-commerce)
   */
  public trackRevenue(amount: number, currency: string = 'USD', props?: Record<string, any>): void {
    if (!this.isInitialized || !window.plausible) {
      return;
    }

    window.plausible('revenue', {
      props: {
        amount: amount.toString(),
        currency,
        ...props,
      },
    });
  }

  /**
   * Track 404 errors
   */
  public track404(path: string): void {
    if (!this.isInitialized || !window.plausible) {
      return;
    }

    window.plausible('404', {
      props: {
        path,
      },
    });
  }
}
