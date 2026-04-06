/**
 * Performance Optimization Note:
 * 
 * Consider using defer imports for heavy modules:
 * 
 * // Instead of:
 * import * as heavyModule from './heavy-analytics';
 * 
 * // Use:
 * import defer * as heavyModule from './heavy-analytics';
 * 
 * This delays module evaluation until first use.
 */

/**
 * Analytics Manager
 *
 * Main analytics orchestrator that manages multiple providers,
 * consent, and provides a unified interface.
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
  AnalyticsMiddleware,
  AnalyticsFilter,
  AnalyticsContext,
  AnalyticsError,
} from '../interfaces/analytics.adapter';
import { ConsentManager, type ConsentConfig } from '../consent/consent-manager';

export interface AnalyticsManagerConfig {
  providers: AnalyticsProvider[];
  consentConfig?: ConsentConfig;
  middleware?: AnalyticsMiddleware[];
  filters?: AnalyticsFilter[];
  debug?: boolean;
  respectDoNotTrack?: boolean;
}

export class AnalyticsManager {
  private providers: AnalyticsProvider[] = [];
  private consentManager: ConsentManager | null = null;
  private middleware: AnalyticsMiddleware[] = [];
  private filters: AnalyticsFilter[] = [];
  private isInitialized = false;
  private debug = false;
  private respectDoNotTrack = true;

  constructor(config: AnalyticsManagerConfig) {
    this.providers = config.providers;
    this.middleware = config.middleware || [];
    this.filters = config.filters || [];
    this.debug = config.debug || false;
    this.respectDoNotTrack = config.respectDoNotTrack !== false;

    // Initialize consent manager if provided
    if (config.consentConfig) {
      this.consentManager = new ConsentManager(config.consentConfig);
    }
  }

  /**
   * Initialize all providers
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    // Check Do Not Track
    if (this.respectDoNotTrack && this.isDoNotTrackEnabled()) {
      this.logDebug('Analytics disabled: Do Not Track is enabled');
      return;
    }

    try {
      // Initialize consent manager first
      if (this.consentManager) {
        this.consentManager.initialize();

        // Listen for consent changes
        this.consentManager.addListener((event) => {
          this.updateProvidersConsent(this.consentManager!.getConsent());
        });
      }

      // Initialize all providers
      await Promise.all(this.providers.map((provider) => this.initializeProvider(provider)));

      this.isInitialized = true;

      this.logDebug('Analytics Manager initialized successfully');
    } catch (error) {
      this.logError('Failed to initialize Analytics Manager:', error);
      throw error;
    }
  }

  /**
   * Track an event across all providers
   */
  async track(event: AnalyticsEvent): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Analytics Manager not initialized');
    }

    const context = this.createContext();

    try {
      // Apply middleware (before)
      let processedEvent = event;
      for (const middleware of this.middleware) {
        if (middleware.beforeTrack) {
          const result = middleware.beforeTrack(processedEvent, context);
          if (result === null) {
            // Middleware blocked the event
            return;
          }
          processedEvent = result;
        }
      }

      // Apply filters
      for (const filter of this.filters) {
        if (filter.shouldTrack && !filter.shouldTrack(processedEvent, context)) {
          return;
        }
      }

      // Track across all providers
      await Promise.allSettled(
        this.providers.map((provider) => this.trackWithProvider(provider, processedEvent))
      );

      // Apply middleware (after)
      for (const middleware of this.middleware) {
        if (middleware.afterTrack) {
          middleware.afterTrack(processedEvent, context);
        }
      }

      this.logDebug('Event tracked successfully:', processedEvent.name);
    } catch (error) {
      this.handleError(error as AnalyticsError, context);
      throw error;
    }
  }

  /**
   * Track a page view across all providers
   */
  async pageview(pageView: PageView): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Analytics Manager not initialized');
    }

    const context = this.createContext();

    try {
      // Apply filters
      for (const filter of this.filters) {
        if (filter.shouldPageview && !filter.shouldPageview(pageView, context)) {
          return;
        }
      }

      // Track across all providers
      await Promise.allSettled(
        this.providers.map((provider) => this.pageviewWithProvider(provider, pageView))
      );

      this.logDebug('Page view tracked successfully:', pageView.path);
    } catch (error) {
      this.handleError(error as AnalyticsError, context);
      throw error;
    }
  }

  /**
   * Set user property across all providers
   */
  async setUserProperty(property: UserProperty): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Analytics Manager not initialized');
    }

    await Promise.allSettled(
      this.providers.map((provider) => this.setUserPropertyWithProvider(provider, property))
    );

    this.logDebug('User property set successfully:', property.name);
  }

  /**
   * Set user ID across all providers
   */
  async setUserId(userId: string): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Analytics Manager not initialized');
    }

    await Promise.allSettled(
      this.providers.map((provider) => this.setUserIdWithProvider(provider, userId))
    );

    this.logDebug('User ID set successfully:', userId);
  }

  /**
   * Update consent across all providers
   */
  async updateConsent(consent: ConsentState): Promise<void> {
    await this.updateProvidersConsent(consent);
  }

  /**
   * Get current consent state
   */
  getConsent(): ConsentState {
    return (
      this.consentManager?.getConsent() || {
        analytics: true,
        advertising: true,
        functional: true,
        personalization: true,
        timestamp: Date.now(),
        region: 'GLOBAL',
        version: '1.0.0',
      }
    );
  }

  /**
   * Check if analytics is ready
   */
  isReady(): boolean {
    return this.isInitialized && this.providers.every((provider) => provider.isReady());
  }

  /**
   * Get provider capabilities
   */
  getCapabilities(): Record<string, ReturnType<AnalyticsProvider['getCapabilities']>> {
    const capabilities: Record<string, ReturnType<AnalyticsProvider['getCapabilities']>> = {};

    this.providers.forEach((provider) => {
      const providerName = provider.constructor.name;
      capabilities[providerName] = provider.getCapabilities();
    });

    return capabilities;
  }

  /**
   * Add middleware
   */
  addMiddleware(middleware: AnalyticsMiddleware): void {
    this.middleware.push(middleware);
  }

  /**
   * Add filter
   */
  addFilter(filter: AnalyticsFilter): void {
    this.filters.push(filter);
  }

  /**
   * Add provider
   */
  addProvider(provider: AnalyticsProvider): void {
    this.providers.push(provider);

    if (this.isInitialized) {
      this.initializeProvider(provider);
    }
  }

  /**
   * Remove provider
   */
  removeProvider(provider: AnalyticsProvider): void {
    const index = this.providers.indexOf(provider);
    if (index > -1) {
      this.providers.splice(index, 1);
      provider.destroy();
    }
  }

  /**
   * Destroy all providers
   */
  async destroy(): Promise<void> {
    await Promise.allSettled(this.providers.map((provider) => provider.destroy()));

    this.consentManager?.destroy();
    this.consentManager = null;

    this.providers = [];
    this.isInitialized = false;
  }

  /**
   * Initialize a single provider
   */
  private async initializeProvider(provider: AnalyticsProvider): Promise<void> {
    try {
      const config = this.createProviderConfig();
      await provider.initialize(config);
    } catch (error) {
      this.logError(`Failed to initialize provider ${provider.constructor.name}:`, error);
      throw error;
    }
  }

  /**
   * Create provider configuration
   */
  private createProviderConfig(): AnalyticsConfig {
    const consent = this.getConsent();

    return {
      provider: 'custom', // Will be overridden by specific provider
      debug: this.debug,
      respectDoNotTrack: this.respectDoNotTrack,
      defaultConsent: consent,
      region: consent.region,
    };
  }

  /**
   * Update consent for all providers
   */
  private async updateProvidersConsent(consent: ConsentState): Promise<void> {
    await Promise.allSettled(this.providers.map((provider) => provider.updateConsent(consent)));
  }

  /**
   * Track event with a specific provider
   */
  private async trackWithProvider(
    provider: AnalyticsProvider,
    event: AnalyticsEvent
  ): Promise<void> {
    try {
      await provider.track(event);
    } catch (error) {
      this.logError(`Failed to track event with ${provider.constructor.name}:`, error);
      throw error;
    }
  }

  /**
   * Track page view with a specific provider
   */
  private async pageviewWithProvider(
    provider: AnalyticsProvider,
    pageView: PageView
  ): Promise<void> {
    try {
      await provider.pageview(pageView);
    } catch (error) {
      this.logError(`Failed to track page view with ${provider.constructor.name}:`, error);
      throw error;
    }
  }

  /**
   * Set user property with a specific provider
   */
  private async setUserPropertyWithProvider(
    provider: AnalyticsProvider,
    property: UserProperty
  ): Promise<void> {
    try {
      await provider.setUserProperty(property);
    } catch (error) {
      this.logError(`Failed to set user property with ${provider.constructor.name}:`, error);
      throw error;
    }
  }

  /**
   * Set user ID with a specific provider
   */
  private async setUserIdWithProvider(provider: AnalyticsProvider, userId: string): Promise<void> {
    try {
      await provider.setUserId(userId);
    } catch (error) {
      this.logError(`Failed to set user ID with ${provider.constructor.name}:`, error);
      throw error;
    }
  }

  /**
   * Create analytics context
   */
  private createContext(): AnalyticsContext {
    if (typeof window === 'undefined') {
      return {
        sessionId: this.generateSessionId(),
        userAgent: '',
        language: '',
        timezone: '',
        consent: this.getConsent(),
      };
    }

    return {
      sessionId: this.generateSessionId(),
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      consent: this.getConsent(),
    };
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private shouldLogToConsole(): boolean {
    return process.env.NODE_ENV !== 'production';
  }

  private logDebug(message: string, ...args: unknown[]): void {
    if (this.debug && this.shouldLogToConsole()) {
      console.log(message, ...args);
    }
  }

  private logError(message: string, ...args: unknown[]): void {
    if (this.shouldLogToConsole()) {
      console.error(message, ...args);
    }
  }

  /**
   * Check if Do Not Track is enabled
   */
  private isDoNotTrackEnabled(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return false;
    }

    return navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes';
  }

  /**
   * Handle errors with proper typing
   */
  private handleError(error: AnalyticsError, context: AnalyticsContext): void {
    // Apply middleware error handlers
    for (const middleware of this.middleware) {
      if (middleware.onError) {
        try {
          middleware.onError(error, context);
        } catch (handlerError) {
          this.logError('Error in middleware error handler:', handlerError);
        }
      }
    }

    if (this.debug && this.shouldLogToConsole()) {
      console.error('Analytics error:', {
        provider: error.provider,
        code: error.code,
        message: error.message,
        details: error.details,
        context: {
          sessionId: context.sessionId,
          userAgent: context.userAgent,
          consent: context.consent,
        },
      });
    }
  }
}
