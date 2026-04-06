import React, { createContext, useContext, useEffect, useState } from 'react';
import { AnalyticsManager } from '../core/analytics-manager';
import { ConsentManager } from '../consent/consent-manager';

interface AnalyticsContextType {
  analytics: AnalyticsManager | null;
  consent: ConsentManager | null;
  isInitialized: boolean;
  hasConsent: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

interface AnalyticsProviderProps {
  children: React.ReactNode;
  config?: {
    trackingId?: string;
    autoInit?: boolean;
  };
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children, config = {} }) => {
  const [analytics, setAnalytics] = useState<AnalyticsManager | null>(null);
  const [consent, setConsent] = useState<ConsentManager | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const consentManager = new ConsentManager({
      defaultConsent: {
        analytics: false,
        advertising: false,
        functional: false,
        personalization: false,
      },
      region: 'GLOBAL',
    });
    const analyticsManager = new AnalyticsManager({
      providers: [], // Will be configured later
      consentConfig: {
        defaultConsent: {
          analytics: false,
          advertising: false,
          functional: false,
          personalization: false,
        },
        region: 'GLOBAL',
        cookieDomain: window.location.hostname,
        cookieExpiryDays: 365,
      },
    });

    setConsent(consentManager);
    setAnalytics(analyticsManager);

    // Check consent status
    const consentStatus = consentManager.hasConsent('analytics');
    setHasConsent(consentStatus);

    if (config.autoInit !== false && consentStatus) {
      analyticsManager.initialize().then(() => {
        setIsInitialized(true);
      });
    } else {
      setIsInitialized(true);
    }
  }, [config.trackingId, config.autoInit]);

  const value: AnalyticsContextType = {
    analytics,
    consent,
    isInitialized,
    hasConsent,
  };

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
};

export const useAnalyticsContext = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
};
