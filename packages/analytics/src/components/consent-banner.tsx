import React, { useState, useEffect } from 'react';
import { ConsentManager } from '../consent/consent-manager';

interface ConsentBannerProps {
  className?: string;
  onAccept?: () => void;
  onDecline?: () => void;
  preferences?: {
    analytics?: boolean;
    marketing?: boolean;
    functional?: boolean;
  };
}

export const ConsentBanner: React.FC<ConsentBannerProps> = ({
  className = '',
  onAccept,
  onDecline,
  preferences = {
    analytics: true,
    marketing: false,
    functional: true,
  },
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [localPreferences, setLocalPreferences] = useState(preferences);

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
    const hasConsent = consentManager.hasConsent('analytics');

    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    const consentManager = new ConsentManager({
      defaultConsent: {
        analytics: false,
        advertising: false,
        functional: false,
        personalization: false,
      },
      region: 'GLOBAL',
    });
    consentManager.grantAllConsent();
    setIsVisible(false);
    onAccept?.();
  };

  const handleDecline = () => {
    const consentManager = new ConsentManager({
      defaultConsent: {
        analytics: false,
        advertising: false,
        functional: false,
        personalization: false,
      },
      region: 'GLOBAL',
    });
    consentManager.denyAllConsent();
    setIsVisible(false);
    onDecline?.();
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50 ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy & Cookie Consent</h3>
            <p className="text-sm text-gray-600 mb-4">
              We use cookies and similar technologies to help personalize content, tailor and
              measure ads, and provide a better experience. By clicking accept, you agree to this,
              as described in our{' '}
              <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                Privacy Policy
              </a>
              .
            </p>

            {showPreferences && (
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localPreferences.analytics}
                    onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">
                    Analytics (helps us improve our service)
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localPreferences.marketing}
                    onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Marketing (personalized ads)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localPreferences.functional}
                    onChange={(e) => handlePreferenceChange('functional', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">
                    Functional (required for the site to work)
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              {showPreferences ? 'Hide' : 'Show'} Preferences
            </button>
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
