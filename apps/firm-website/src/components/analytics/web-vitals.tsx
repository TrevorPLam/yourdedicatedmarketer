'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { event } from '@/lib/gtag';

type ReportWebVitalsMetric = Parameters<typeof useReportWebVitals>[0] extends (
  metric: infer M
) => void
  ? M
  : never;

/**
 * Report Core Web Vitals metrics to Google Analytics and the console.
 * CLS is scaled by 1000 so it can be sent as an integer to GA.
 */
function reportWebVitals(metric: ReportWebVitalsMetric) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', metric.name, metric.value, metric.id);
  }

  if (typeof window === 'undefined') {
    return;
  }

  const value = Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value);

  event(metric.name, {
    value,
    event_label: metric.id,
    non_interaction: true,
  });
}

export function WebVitals() {
  useReportWebVitals(reportWebVitals);
  return null;
}
