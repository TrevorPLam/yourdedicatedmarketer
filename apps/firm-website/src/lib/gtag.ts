export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Type declarations for window.gtag
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

/**
 * Track a page view in GA4
 * @param url - The URL to track
 */
export const pageview = (url: string): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID || '', {
      page_path: url,
    });
  }
};

/**
 * Track a custom event in GA4
 * @param name - The event name
 * @param params - Additional event parameters
 */
export const event = (
  name: string,
  params: Record<string, unknown> = {}
): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params);
  }
};
