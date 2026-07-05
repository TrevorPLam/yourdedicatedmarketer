'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '@/lib/gtag';

/**
 * PageViewTracker - Tracks page views in GA4 on route changes
 * 
 * This component automatically tracks page views when the user navigates
 * to different pages. It uses usePathname and useSearchParams to detect
 * route changes and calls the pageview function from gtag.ts.
 * 
 * Tracking only occurs in production to avoid skewing analytics data.
 */
export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only track in production
    if (process.env.NODE_ENV === 'production') {
      // Build the full URL with search parameters
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      pageview(url);
    }
  }, [pathname, searchParams]);

  // This component doesn't render anything
  return null;
}
