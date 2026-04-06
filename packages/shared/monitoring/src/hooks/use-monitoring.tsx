import { useEffect, useCallback, useRef, useMemo } from 'react';
import type { ErrorContext, PerformanceMetric, UserMetric, UseMonitoringReturn, MonitoringHookOptions } from '../types/monitoring.types';
import { ErrorTracker } from '../error/error-tracker';
import { PerformanceMonitor } from '../performance/web-vitals';
import { AlertManager } from '../alerts/alert-manager';
import { MonitoringErrorBoundary } from '../components/error-boundary';

let errorTrackerInstance: ErrorTracker | null = null;
let performanceMonitorInstance: PerformanceMonitor | null = null;
let alertManagerInstance: AlertManager | null = null;

export const useMonitoring = (
  config?: MonitoringHookOptions
): UseMonitoringReturn => {
  const isInitialized = useRef(false);

  // Initialize monitoring instances
  useEffect(() => {
    if (!isInitialized.current && typeof window !== 'undefined') {
      try {
        // Initialize instances (they would be configured globally)
        errorTrackerInstance = ErrorTracker.getInstance();
        performanceMonitorInstance = PerformanceMonitor.getInstance();
        alertManagerInstance = AlertManager.getInstance();

        // Initialize if not already done
        errorTrackerInstance.initialize();
        performanceMonitorInstance.initialize();
        alertManagerInstance.initialize();

        isInitialized.current = true;
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Failed to initialize monitoring:', error);
        }
      }
    }
  }, []);

  const trackError = useCallback(
    (error: Error, context?: ErrorContext): string => {
      if (!errorTrackerInstance) {
        console.error('Error tracker not initialized:', error);
        return 'fallback';
      }

      const enhancedContext = {
        ...context,
        tags: {
          ...context?.tags,
          ...config?.customTags,
        },
      };

      return errorTrackerInstance.trackError(error, enhancedContext);
    },
    [config?.customTags]
  );

  const trackPerformance = useCallback(
    (metric: PerformanceMetric): void => {
      if (!performanceMonitorInstance) {
        console.warn('Performance monitor not initialized');
        return;
      }

      performanceMonitorInstance.trackCustomMetric(
        metric.name,
        metric.value,
        'ms',
        metric.rating === 'poor' ? 1000 : metric.rating === 'needs-improvement' ? 500 : undefined
      );
    },
    []
  );

  const trackUserEvent = useCallback(
    (event: Omit<UserMetric, 'userId' | 'sessionId' | 'timestamp'>): void => {
      if (!errorTrackerInstance) {
        console.warn('Error tracker not initialized');
        return;
      }

      const userEvent: UserMetric = {
        ...event,
        userId: 'unknown', // Would be set by setUser
        sessionId: 'unknown', // Would be generated
        timestamp: Date.now(),
      };

      errorTrackerInstance.addBreadcrumb({
        message: `User event: ${event.eventName}`,
        category: 'user',
        level: 'info',
        data: {
          eventType: event.eventType,
          eventName: event.eventName,
          properties: event.properties,
        },
      });
    },
    []
  );

  const setUser = useCallback(
    (user: { id: string; email?: string; name?: string }): void => {
      if (!errorTrackerInstance) {
        console.warn('Error tracker not initialized');
        return;
      }

      errorTrackerInstance.setUser(user);
    },
    []
  );

  const clearUser = useCallback((): void => {
    if (!errorTrackerInstance) {
      console.warn('Error tracker not initialized');
      return;
    }

    errorTrackerInstance.clearUser();
  }, []);

  const addBreadcrumb = useCallback(
    (breadcrumb: {
      message: string;
      category?: string;
      level?: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
      data?: Record<string, any>;
    }): void => {
      if (!errorTrackerInstance) {
        console.warn('Error tracker not initialized');
        return;
      }

      errorTrackerInstance.addBreadcrumb(breadcrumb);
    },
    []
  );

  return {
    trackError,
    trackPerformance,
    trackUserEvent,
    setUser,
    clearUser,
    addBreadcrumb,
  };
};

export const useErrorTracking = (context?: ErrorContext) => {
  const { trackError, addBreadcrumb } = useMonitoring();

  const handleError = useCallback(
    (error: Error, additionalContext?: ErrorContext) => {
      const enhancedContext = {
        ...context,
        ...additionalContext,
      };
      return trackError(error, enhancedContext);
    },
    [trackError, context]
  );

  const trackMessage = useCallback(
    (message: string, level: ErrorContext['level'] = 'info') => {
      if (!ErrorTracker.getInstance()) {
        console.log(message);
        return;
      }

      return ErrorTracker.getInstance().trackMessage(message, {
        ...context,
        level,
      });
    },
    [context]
  );

  return {
    handleError,
    trackMessage,
    addBreadcrumb,
  };
};

export const usePerformanceTracking = () => {
  const { trackPerformance } = useMonitoring();
  const startTimeRef = useRef<number>();

  const startTiming = useCallback((name: string): (() => void) => {
    startTimeRef.current = performance.now();
    
    return () => {
      if (startTimeRef.current) {
        const duration = performance.now() - startTimeRef.current;
        trackPerformance({
          name,
          value: duration,
          rating: duration > 1000 ? 'poor' : duration > 500 ? 'needs-improvement' : 'good',
        });
        startTimeRef.current = undefined;
      }
    };
  }, [trackPerformance]);

  const trackPageLoad = useCallback((url?: string) => {
    if (typeof window === 'undefined') return;

    const pageUrl = url || window.location.href;
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigationEntry) {
      const loadTime = navigationEntry.loadEventEnd - navigationEntry.navigationStart;
      const performanceMonitor = PerformanceMonitor.getInstance();
      if (performanceMonitor) {
        performanceMonitor.trackPageLoad(pageUrl, loadTime);
      }
    }
  }, []);

  const trackApiCall = useCallback(
    (endpoint: string, startTime: number, endTime: number, status: number) => {
      const duration = endTime - startTime;
      const performanceMonitor = PerformanceMonitor.getInstance();
      if (performanceMonitor) {
        performanceMonitor.trackApiCall(endpoint, duration, status);
      }
    },
    []
  );

  return {
    startTiming,
    trackPageLoad,
    trackApiCall,
  };
};

export const useUserTracking = (userId?: string) => {
  const { trackUserEvent, setUser } = useMonitoring();

  useEffect(() => {
    if (userId) {
      setUser({ id: userId });
    }
  }, [userId, setUser]);

  const trackPageView = useCallback(
    (page: string, properties?: Record<string, any>) => {
      trackUserEvent({
        eventType: 'page_view',
        eventName: 'page_view',
        properties: {
          page,
          ...properties,
        },
      });
    },
    [trackUserEvent]
  );

  const trackClick = useCallback(
    (element: string, properties?: Record<string, any>) => {
      trackUserEvent({
        eventType: 'click',
        eventName: 'click',
        properties: {
          element,
          ...properties,
        },
      });
    },
    [trackUserEvent]
  );

  const trackFormSubmit = useCallback(
    (formName: string, properties?: Record<string, any>) => {
      trackUserEvent({
        eventType: 'form_submit',
        eventName: 'form_submit',
        properties: {
          formName,
          ...properties,
        },
      });
    },
    [trackUserEvent]
  );

  const trackCustomEvent = useCallback(
    (eventName: string, properties?: Record<string, any>) => {
      trackUserEvent({
        eventType: 'custom',
        eventName,
        properties,
      });
    },
    [trackUserEvent]
  );

  return {
    trackPageView,
    trackClick,
    trackFormSubmit,
    trackCustomEvent,
  };
};

export const useMonitoringBoundary = () => {
  const { handleError } = useErrorTracking();

  const captureException = useCallback(
    (error: Error, errorInfo?: any) => {
      handleError(error, {
        extra: {
          componentStack: errorInfo?.componentStack,
          errorBoundary: true,
        },
        tags: {
          component: 'error-boundary',
        },
      });
    },
    [handleError]
  );

  return {
    captureException,
  };
};

export const useApiMonitoring = () => {
  const { trackError } = useErrorTracking();
  const { trackApiCall } = usePerformanceTracking();

  const monitorApiCall = useCallback(
    async <T>(
      apiCall: () => Promise<T>,
      endpoint: string,
      context?: Record<string, any>
    ): Promise<T> => {
      const startTime = performance.now();
      
      try {
        const result = await apiCall();
        const endTime = performance.now();
        trackApiCall(endpoint, startTime, endTime, 200);
        return result;
      } catch (error) {
        const endTime = performance.now();
        trackApiCall(endpoint, startTime, endTime, 500);
        
        trackError(error as Error, {
          tags: {
            component: 'api',
            endpoint,
          },
          extra: context,
        });
        
        throw error;
      }
    },
    [trackError, trackApiCall]
  );

  return {
    monitorApiCall,
  };
};

export const useSessionTracking = () => {
  const { addBreadcrumb } = useMonitoring();
  const sessionStartTime = useRef<number>(Date.now());
  const lastActivityTime = useRef<number>(Date.now());

  const trackActivity = useCallback(() => {
    lastActivityTime.current = Date.now();
    addBreadcrumb({
      message: 'User activity',
      category: 'session',
      level: 'info',
      data: {
        sessionDuration: Date.now() - sessionStartTime.current,
      },
    });
  }, [addBreadcrumb]);

  const getSessionDuration = useCallback((): number => {
    return Date.now() - sessionStartTime.current;
  }, []);

  const getTimeSinceLastActivity = useCallback((): number => {
    return Date.now() - lastActivityTime.current;
  }, []);

  useEffect(() => {
    const handleActivity = () => trackActivity();
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [trackActivity]);

  return {
    trackActivity,
    getSessionDuration,
    getTimeSinceLastActivity,
  };
};

// Provider component for global monitoring configuration
export interface MonitoringProviderProps {
  children: React.ReactNode;
  config: {
    sentryDsn: string;
    environment: 'development' | 'staging' | 'production';
    enablePerformanceMonitoring?: boolean;
    enableUserTracking?: boolean;
    user?: {
      id: string;
      email?: string;
      name?: string;
    };
  };
}

export const MonitoringProvider: React.FC<MonitoringProviderProps> = ({
  children,
  config,
}) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Initialize global monitoring instances
        const errorTracker = ErrorTracker.getInstance({
          sentryDsn: config.sentryDsn,
          environment: config.environment,
          enablePerformanceMonitoring: config.enablePerformanceMonitoring,
          enableUserTracking: config.enableUserTracking,
        });

        errorTracker.initialize();

        if (config.user) {
          errorTracker.setUser(config.user);
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to initialize monitoring provider:', error);
        }
      }
    }
  }, [config]);

  return <MonitoringErrorBoundary>{children}</MonitoringErrorBoundary>;
};
