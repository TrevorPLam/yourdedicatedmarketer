/**
 * Analytics React Hooks
 *
 * React hooks for analytics tracking with automatic context,
 * error handling, and consent management.
 *
 * @version 1.0.0
 * @agency/analytics
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  AnalyticsProvider,
  AnalyticsConfig,
  AnalyticsEvent,
  PageView,
  UserProperty,
} from '../interfaces/analytics.adapter';
import { ConsentManager, type ConsentConfig } from '../consent/consent-manager';

export interface UseAnalyticsOptions {
  provider: AnalyticsProvider;
  config: AnalyticsConfig;
  consentConfig?: ConsentConfig;
  autoTrackPageViews?: boolean;
  trackHashChanges?: boolean;
  debug?: boolean;
}

export interface UseAnalyticsReturn {
  track: (event: AnalyticsEvent) => Promise<void>;
  pageview: (pageView: PageView) => Promise<void>;
  setUserProperty: (property: UserProperty) => Promise<void>;
  setUserId: (userId: string) => Promise<void>;
  isReady: boolean;
  isLoading: boolean;
  error: Error | null;
  consent: ReturnType<ConsentManager['getConsent']>;
  updateConsent: (consent: Partial<Parameters<ConsentManager['updateConsent']>[0]>) => void;
}

export interface AnalyticsContext {
  userId?: string;
  sessionId: string;
  path: string;
  referrer: string;
  userAgent: string;
  language: string;
  timezone: string;
}

type QueuedAnalyticsOperation =
  | { type: 'track'; payload: AnalyticsEvent }
  | { type: 'pageview'; payload: PageView };

function getInitialConsentState(consentConfig?: ConsentConfig): ReturnType<ConsentManager['getConsent']> {
  return {
    analytics: consentConfig?.defaultConsent.analytics ?? false,
    advertising: consentConfig?.defaultConsent.advertising ?? false,
    functional: consentConfig?.defaultConsent.functional ?? false,
    personalization: consentConfig?.defaultConsent.personalization ?? false,
    timestamp: Date.now(),
    region: consentConfig?.region ?? 'GLOBAL',
    version: consentConfig?.consentVersion ?? '1.0.0',
  };
}

/**
 * Main analytics hook
 */
export function useAnalytics(options: UseAnalyticsOptions): UseAnalyticsReturn {
  const {
    provider,
    config,
    consentConfig,
    autoTrackPageViews = true,
    trackHashChanges = true,
    debug = false,
  } = options;

  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [consent, setConsentState] = useState(() => getInitialConsentState(consentConfig));

  const providerRef = useRef(provider);
  const consentManagerRef = useRef<ConsentManager | null>(null);
  const sessionIdRef = useRef<string>(generateSessionId());
  const contextRef = useRef<AnalyticsContext | null>(null);
  const queuedOperationsRef = useRef<QueuedAnalyticsOperation[]>([]);
  const pageViewTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTrackedLocationRef = useRef<string | null>(null);
  const isDebugEnabled = debug && process.env.NODE_ENV !== 'production';

  // Generate session ID
  function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get current context
  function getCurrentContext(): AnalyticsContext {
    if (typeof window === 'undefined') {
      return {
        sessionId: sessionIdRef.current,
        path: '',
        referrer: '',
        userAgent: '',
        language: '',
        timezone: '',
      };
    }

    return {
      userId: contextRef.current?.userId,
      sessionId: sessionIdRef.current,
      path:
        window.location.pathname +
        window.location.search +
        (trackHashChanges ? window.location.hash : ''),
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  const getTrackedLocation = useCallback(() => {
    if (typeof window === 'undefined') {
      return '';
    }

    return window.location.pathname + window.location.search + (trackHashChanges ? window.location.hash : '');
  }, [trackHashChanges]);

  const executeTrack = useCallback(
    async (event: AnalyticsEvent) => {
      try {
        const context = getCurrentContext();
        const enrichedEvent = {
          ...event,
          timestamp: event.timestamp || Date.now(),
          userId: event.userId || context.userId,
          sessionId: event.sessionId || context.sessionId,
        };

        await providerRef.current.track(enrichedEvent);

        if (isDebugEnabled) {
          console.log('Event tracked:', enrichedEvent);
        }
      } catch (err) {
        const trackedError = err instanceof Error ? err : new Error('Failed to track event');
        setError(trackedError);

        if (isDebugEnabled) {
          console.error('Failed to track event:', err);
        }

        throw trackedError;
      }
    },
    [isDebugEnabled]
  );

  const executePageview = useCallback(
    async (pageView: PageView) => {
      try {
        const context = getCurrentContext();
        const enrichedPageView = {
          ...pageView,
          timestamp: pageView.timestamp || Date.now(),
          userId: pageView.userId || context.userId,
          sessionId: pageView.sessionId || context.sessionId,
        };

        await providerRef.current.pageview(enrichedPageView);

        if (isDebugEnabled) {
          console.log('Page view tracked:', enrichedPageView);
        }
      } catch (err) {
        const trackedError = err instanceof Error ? err : new Error('Failed to track page view');
        setError(trackedError);

        if (isDebugEnabled) {
          console.error('Failed to track page view:', err);
        }

        throw trackedError;
      }
    },
    [isDebugEnabled]
  );

  const executeSetUserProperty = useCallback(
    async (property: UserProperty) => {
      try {
        const enrichedProperty = {
          ...property,
          timestamp: property.timestamp || Date.now(),
        };

        await providerRef.current.setUserProperty(enrichedProperty);

        if (isDebugEnabled) {
          console.log('User property set:', enrichedProperty);
        }
      } catch (err) {
        const trackedError = err instanceof Error ? err : new Error('Failed to set user property');
        setError(trackedError);

        if (isDebugEnabled) {
          console.error('Failed to set user property:', err);
        }

        throw trackedError;
      }
    },
    [isDebugEnabled]
  );

  const executeSetUserId = useCallback(
    async (userId: string) => {
      try {
        await providerRef.current.setUserId(userId);

        if (contextRef.current) {
          contextRef.current.userId = userId;
        } else {
          contextRef.current = { ...getCurrentContext(), userId };
        }

        if (isDebugEnabled) {
          console.log('User ID set:', userId);
        }
      } catch (err) {
        const trackedError = err instanceof Error ? err : new Error('Failed to set user ID');
        setError(trackedError);

        if (isDebugEnabled) {
          console.error('Failed to set user ID:', err);
        }

        throw trackedError;
      }
    },
    [isDebugEnabled]
  );

  useEffect(() => {
    providerRef.current = provider;
  }, [provider]);

  // Initialize analytics
  useEffect(() => {
    let isMounted = true;
    let cleanupConsentListener = () => {};

    const initialize = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setIsReady(false);

        // Initialize consent manager if provided
        if (consentConfig) {
          consentManagerRef.current = new ConsentManager(consentConfig);

          // Listen for consent changes
          cleanupConsentListener = consentManagerRef.current.addListener(() => {
            if (isMounted) {
              setConsentState(consentManagerRef.current!.getConsent());

              // Update provider consent
              providerRef.current.updateConsent(consentManagerRef.current!.getConsent());
            }
          });

          // Initialize consent management
          consentManagerRef.current.initialize();
          setConsentState(consentManagerRef.current.getConsent());
        }

        // Initialize provider
        await providerRef.current.initialize(config);

        if (isMounted) {
          setIsReady(true);
          setIsLoading(false);

          if (isDebugEnabled) {
            console.log('Analytics initialized successfully');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to initialize analytics'));
          setIsLoading(false);

          if (isDebugEnabled) {
            console.error('Analytics initialization failed:', err);
          }
        }
      }
    };

    void initialize();

    return () => {
      isMounted = false;
      cleanupConsentListener();
      consentManagerRef.current?.destroy();
      consentManagerRef.current = null;
    };
  }, [config, consentConfig, isDebugEnabled]);

  useEffect(() => {
    if (!isReady || queuedOperationsRef.current.length === 0) {
      return;
    }

    const operations = [...queuedOperationsRef.current];
    queuedOperationsRef.current = [];

    void (async () => {
      for (const operation of operations) {
        if (operation.type === 'track') {
          await executeTrack(operation.payload);
        } else {
          await executePageview(operation.payload);
        }
      }
    })();
  }, [isReady, executeTrack, executePageview]);

  // Auto-track page views
  useEffect(() => {
    if (!autoTrackPageViews || !isReady) {
      return () => {};
    }

    const schedulePageView = () => {
      if (pageViewTimeoutRef.current) {
        clearTimeout(pageViewTimeoutRef.current);
      }

      pageViewTimeoutRef.current = setTimeout(() => {
        const trackedLocation = getTrackedLocation();
        if (trackedLocation === lastTrackedLocationRef.current) {
          return;
        }

        lastTrackedLocationRef.current = trackedLocation;
        const context = getCurrentContext();

        void executePageview({
          path: context.path,
          title: document.title,
          location: window.location.href,
          referrer: context.referrer,
          userId: context.userId,
          sessionId: context.sessionId,
        }).catch((trackedError) => {
          if (isDebugEnabled) {
            console.error('Failed to track page view:', trackedError);
          }
        });
      }, 100);
    };

    // Track initial page view
    schedulePageView();

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function pushState(...args: Parameters<History['pushState']>) {
      const result = originalPushState.apply(window.history, args);
      schedulePageView();
      return result;
    };

    window.history.replaceState = function replaceState(...args: Parameters<History['replaceState']>) {
      const result = originalReplaceState.apply(window.history, args);
      schedulePageView();
      return result;
    };

    // Listen for popstate (browser back/forward)
    const handlePopState = () => {
      schedulePageView();
    };

    const handleHashChange = () => {
      schedulePageView();
    };

    window.addEventListener('popstate', handlePopState);
    if (trackHashChanges) {
      window.addEventListener('hashchange', handleHashChange);
    }

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', handlePopState);
      if (trackHashChanges) {
        window.removeEventListener('hashchange', handleHashChange);
      }
      if (pageViewTimeoutRef.current) {
        clearTimeout(pageViewTimeoutRef.current);
        pageViewTimeoutRef.current = null;
      }
    };
  }, [autoTrackPageViews, trackHashChanges, isReady, getTrackedLocation, executePageview, isDebugEnabled]);

  // Track event
  const track = useCallback(
    async (event: AnalyticsEvent) => {
      if (!isReady) {
        queuedOperationsRef.current.push({ type: 'track', payload: event });
        return;
      }

      await executeTrack(event);
    },
    [isReady, executeTrack]
  );

  // Track page view
  const pageview = useCallback(
    async (pageView: PageView) => {
      if (!isReady) {
        queuedOperationsRef.current.push({ type: 'pageview', payload: pageView });
        return;
      }

      await executePageview(pageView);
    },
    [isReady, executePageview]
  );

  // Set user property
  const setUserProperty = useCallback(
    async (property: UserProperty) => {
      if (!isReady) {
        return;
      }

      await executeSetUserProperty(property);
    },
    [isReady, executeSetUserProperty]
  );

  // Set user ID
  const setUserId = useCallback(
    async (userId: string) => {
      if (!isReady) {
        contextRef.current = { ...getCurrentContext(), userId };
        return;
      }

      await executeSetUserId(userId);
    },
    [isReady, executeSetUserId]
  );

  // Update consent
  const updateConsent = useCallback(
    (consentUpdate: Partial<Parameters<ConsentManager['updateConsent']>[0]>) => {
      if (consentManagerRef.current) {
        consentManagerRef.current.updateConsent(consentUpdate);
      }
    },
    []
  );

  return {
    track,
    pageview,
    setUserProperty,
    setUserId,
    isReady,
    isLoading,
    error,
    consent,
    updateConsent,
  };
}

/**
 * Hook for tracking events with automatic error handling
 */
export function useEventTracker(options: UseAnalyticsOptions) {
  const { track, isReady, error } = useAnalytics(options);

  const trackEvent = useCallback(
    async (eventName: string, parameters?: Record<string, any>) => {
      if (!isReady) {
        return;
      }

      try {
        await track({
          name: eventName,
          parameters,
        });
      } catch (err) {
        // Error is already handled by useAnalytics
        // Silent failure for event tracking
      }
    },
    [track, isReady]
  );

  return { trackEvent, isReady, error };
}

/**
 * Hook for tracking user interactions
 */
export function useInteractionTracker(options: UseAnalyticsOptions) {
  const { trackEvent } = useEventTracker(options);

  const trackClick = useCallback(
    (element: string, properties?: Record<string, any>) => {
      trackEvent('click', {
        element,
        ...properties,
      });
    },
    [trackEvent]
  );

  const trackFormSubmit = useCallback(
    (formName: string, properties?: Record<string, any>) => {
      trackEvent('form_submit', {
        form_name: formName,
        ...properties,
      });
    },
    [trackEvent]
  );

  const trackDownload = useCallback(
    (filename: string, properties?: Record<string, any>) => {
      trackEvent('file_download', {
        filename,
        ...properties,
      });
    },
    [trackEvent]
  );

  const trackSearch = useCallback(
    (query: string, resultsCount?: number, properties?: Record<string, any>) => {
      trackEvent('search', {
        query,
        results_count: resultsCount,
        ...properties,
      });
    },
    [trackEvent]
  );

  return {
    trackClick,
    trackFormSubmit,
    trackDownload,
    trackSearch,
  };
}

/**
 * Hook for tracking e-commerce events
 */
export function useEcommerceTracker(options: UseAnalyticsOptions) {
  const { trackEvent } = useEventTracker(options);

  const trackPurchase = useCallback(
    (
      transactionId: string,
      revenue: number,
      currency: string,
      properties?: Record<string, any>
    ) => {
      trackEvent('purchase', {
        transaction_id: transactionId,
        revenue,
        currency,
        ...properties,
      });
    },
    [trackEvent]
  );

  const trackAddToCart = useCallback(
    (productId: string, quantity: number, price: number, properties?: Record<string, any>) => {
      trackEvent('add_to_cart', {
        product_id: productId,
        quantity,
        price,
        ...properties,
      });
    },
    [trackEvent]
  );

  const trackRemoveFromCart = useCallback(
    (productId: string, quantity: number, properties?: Record<string, any>) => {
      trackEvent('remove_from_cart', {
        product_id: productId,
        quantity,
        ...properties,
      });
    },
    [trackEvent]
  );

  const trackBeginCheckout = useCallback(
    (properties?: Record<string, any>) => {
      trackEvent('begin_checkout', properties);
    },
    [trackEvent]
  );

  return {
    trackPurchase,
    trackAddToCart,
    trackRemoveFromCart,
    trackBeginCheckout,
  };
}

/**
 * Hook for tracking performance metrics
 */
export function usePerformanceTracker(options: UseAnalyticsOptions) {
  const { trackEvent } = useEventTracker(options);

  const trackPageLoad = useCallback(
    (metrics: {
      loadTime: number;
      domContentLoaded: number;
      firstPaint: number;
      firstContentfulPaint: number;
    }) => {
      trackEvent('page_load', metrics);
    },
    [trackEvent]
  );

  const trackWebVitals = useCallback(
    (vitals: {
      lcp?: number; // Largest Contentful Paint
      fid?: number; // First Input Delay
      cls?: number; // Cumulative Layout Shift
      fcp?: number; // First Contentful Paint
      ttfb?: number; // Time to First Byte
    }) => {
      trackEvent('web_vitals', vitals);
    },
    [trackEvent]
  );

  return {
    trackPageLoad,
    trackWebVitals,
  };
}
