'use client';

import Script from 'next/script';
import { GA_MEASUREMENT_ID } from '@/lib/gtag';

/**
 * GA4Script component loads the Google Analytics 4 tracking script
 * Only loads in production to avoid skewing development data
 */
export function GA4Script() {
  // Only load GA4 in production
  if (process.env.NODE_ENV !== 'production' || !GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
