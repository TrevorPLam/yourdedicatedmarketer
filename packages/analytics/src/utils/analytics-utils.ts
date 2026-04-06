/**
 * Analytics Utilities
 *
 * Utility functions for analytics tracking and data processing.
 *
 * @version 1.0.0
 * @agency/analytics
 */

import type {
  AnalyticsEvent,
  PageView,
  UserProperty,
  ConsentState,
} from '../interfaces/analytics.adapter';

export class AnalyticsUtils {
  /**
   * Sanitize event parameters by removing PII
   */
  static sanitizeEvent(event: AnalyticsEvent): AnalyticsEvent {
    const sanitized = { ...event };

    if (sanitized.parameters) {
      sanitized.parameters = this.sanitizeParameters(sanitized.parameters);
    }

    return sanitized;
  }

  /**
   * Sanitize parameters by removing PII and sensitive data
   */
  static sanitizeParameters(parameters: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    const piiPatterns = [
      /email/i,
      /name/i,
      /phone/i,
      /address/i,
      /credit/i,
      /ssn/i,
      /password/i,
      /token/i,
      /key/i,
      /secret/i,
    ];

    Object.entries(parameters).forEach(([key, value]) => {
      // Check if key contains PII patterns
      const isPii = piiPatterns.some((pattern) => pattern.test(key));

      if (isPii && typeof value === 'string') {
        // Hash sensitive values
        sanitized[key] = this.hashValue(value);
      } else if (typeof value === 'string') {
        // Remove potential PII from string values
        sanitized[key] = this.removePiiFromString(value);
      } else {
        sanitized[key] = value;
      }
    });

    return sanitized;
  }

  /**
   * Remove PII from string values
   */
  static removePiiFromString(value: string): string {
    // Remove email addresses
    let cleaned = value.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[email]');

    // Remove phone numbers
    cleaned = cleaned.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[phone]');

    // Remove credit card numbers (basic pattern)
    cleaned = cleaned.replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[card]');

    // Remove SSN patterns
    cleaned = cleaned.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[ssn]');

    return cleaned;
  }

  /**
   * Hash a value for privacy
   */
  static hashValue(value: string): string {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      const char = value.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  /**
   * Validate event data
   */
  static validateEvent(event: AnalyticsEvent): boolean {
    if (!event.name || typeof event.name !== 'string') {
      return false;
    }

    if (event.name.length > 100) {
      return false;
    }

    if (event.parameters && typeof event.parameters !== 'object') {
      return false;
    }

    return true;
  }

  /**
   * Validate page view data
   */
  static validatePageView(pageView: PageView): boolean {
    if (!pageView.path || typeof pageView.path !== 'string') {
      return false;
    }

    if (pageView.path.length > 2048) {
      return false;
    }

    return true;
  }

  /**
   * Validate user property data
   */
  static validateUserProperty(property: UserProperty): boolean {
    if (!property.name || typeof property.name !== 'string') {
      return false;
    }

    if (property.name.length > 100) {
      return false;
    }

    if (property.value === undefined || property.value === null) {
      return false;
    }

    const allowedTypes = ['string', 'number', 'boolean'];
    if (!allowedTypes.includes(typeof property.value)) {
      return false;
    }

    return true;
  }

  /**
   * Get user's region based on timezone and language
   */
  static getUserRegion(): string {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return 'GLOBAL';
    }

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;

    // EU timezones
    const euTimezones = [
      'Europe/London',
      'Europe/Paris',
      'Europe/Berlin',
      'Europe/Rome',
      'Europe/Madrid',
      'Europe/Amsterdam',
      'Europe/Brussels',
      'Europe/Vienna',
      'Europe/Stockholm',
      'Europe/Copenhagen',
      'Europe/Helsinki',
      'Europe/Warsaw',
      'Europe/Prague',
      'Europe/Budapest',
      'Europe/Bucharest',
      'Europe/Sofia',
      'Europe/Athens',
      'Europe/Istanbul',
      'Europe/Moscow',
    ];

    // UK specific
    if (timezone === 'Europe/London' && language.startsWith('en-GB')) {
      return 'UK';
    }

    // EU region
    if (euTimezones.includes(timezone)) {
      return 'EU';
    }

    // California specific (CCPA)
    if (timezone.includes('America/Los_Angeles') || timezone.includes('America/Denver')) {
      return 'CA';
    }

    // US region
    if (timezone.startsWith('America/')) {
      return 'US';
    }

    return 'GLOBAL';
  }

  /**
   * Check if consent is required for region
   */
  static isConsentRequired(region: string): boolean {
    const consentRequiredRegions = ['EU', 'UK'];
    return consentRequiredRegions.includes(region);
  }

  /**
   * Get default consent state for region
   */
  static getDefaultConsent(region: string): Partial<ConsentState> {
    const timestamp = Date.now();

    switch (region) {
      case 'EU':
      case 'UK':
        return {
          analytics: false,
          advertising: false,
          functional: false,
          personalization: false,
          timestamp,
          region,
        };

      case 'CA':
        return {
          analytics: true,
          advertising: false,
          functional: true,
          personalization: false,
          timestamp,
          region,
        };

      case 'US':
      default:
        return {
          analytics: true,
          advertising: true,
          functional: true,
          personalization: true,
          timestamp,
          region,
        };
    }
  }

  /**
   * Format event name for analytics
   */
  static formatEventName(name: string): string {
    // Convert to lowercase and replace spaces/special chars with underscores
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .substring(0, 100); // Limit to 100 characters
  }

  /**
   * Create event with common parameters
   */
  static createEvent(name: string, parameters?: Record<string, any>): AnalyticsEvent {
    return {
      name: this.formatEventName(name),
      parameters: {
        ...parameters,
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
    };
  }

  /**
   * Create page view with common parameters
   */
  static createPageView(path: string, title?: string): PageView {
    if (typeof window !== 'undefined') {
      return {
        path,
        title: title || document.title,
        location: window.location.href,
        referrer: document.referrer,
        timestamp: Date.now(),
      };
    }

    return {
      path,
      title: title || '',
      timestamp: Date.now(),
    };
  }

  /**
   * Create user property with validation
   */
  static createUserProperty(name: string, value: string | number | boolean): UserProperty {
    return {
      name: this.formatEventName(name),
      value,
      timestamp: Date.now(),
    };
  }

  /**
   * Debounce function for event tracking
   */
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Throttle function for event tracking
   */
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Batch events for performance
   */
  static batchEvents(events: AnalyticsEvent[]): AnalyticsEvent[] {
    // Group similar events and combine parameters
    const batched: AnalyticsEvent[] = [];
    const eventGroups: Record<string, AnalyticsEvent[]> = {};

    events.forEach((event) => {
      const key = event.name;
      if (!eventGroups[key]) {
        eventGroups[key] = [];
      }
      eventGroups[key].push(event);
    });

    Object.entries(eventGroups).forEach(([name, groupedEvents]) => {
      if (groupedEvents.length === 1) {
        batched.push(groupedEvents[0]);
      } else {
        // Combine parameters from multiple events
        const combinedParameters: Record<string, any> = {};
        groupedEvents.forEach((event) => {
          if (event.parameters) {
            Object.assign(combinedParameters, event.parameters);
          }
        });

        batched.push({
          name,
          parameters: {
            ...combinedParameters,
            event_count: groupedEvents.length,
            batch_timestamp: Date.now(),
          },
          timestamp: Date.now(),
        });
      }
    });

    return batched;
  }

  /**
   * Get device information
   */
  static getDeviceInfo(): Record<string, string> {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return {};
    }

    return {
      user_agent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookie_enabled: navigator.cookieEnabled.toString(),
      on_line: navigator.onLine.toString(),
      screen_resolution: `${screen.width}x${screen.height}`,
      color_depth: screen.colorDepth.toString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  /**
   * Check if user is using mobile device
   */
  static isMobile(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return false;
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = [
      'android',
      'iphone',
      'ipad',
      'ipod',
      'blackberry',
      'windows phone',
      'mobile',
      'webos',
      'opera mini',
    ];

    return mobileKeywords.some((keyword) => userAgent.includes(keyword));
  }

  /**
   * Get performance metrics
   */
  static getPerformanceMetrics(): Record<string, number> {
    if (typeof window === 'undefined' || !window.performance) {
      return {};
    }

    const navigation = window.performance.navigation;
    const timing = window.performance.timing;

    return {
      load_time: timing.loadEventEnd - timing.navigationStart,
      dom_content_loaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      first_paint: timing.responseStart - timing.navigationStart,
      redirect_count: navigation.redirectCount,
      navigation_type: navigation.type,
    };
  }
}
