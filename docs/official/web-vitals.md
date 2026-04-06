# Web Vitals

Web Vitals is an initiative by Google to provide unified guidance for quality signals that are essential to delivering a great user experience on the web. The web-vitals library is a tiny (~1KB), production-ready library to measure all the Web Vitals metrics on real users in the field.

---

## Overview

The **Web Vitals** initiative aims to simplify the landscape of performance measurement and help sites focus on the metrics that matter most. The web-vitals library provides a straightforward way to measure these metrics in your application.

### Core Web Vitals

| Metric | Description | Target |
|--------|-------------|--------|
| **LCP** | Largest Contentful Paint - loading performance | ≤ 2.5s |
| **FID** | First Input Delay - interactivity | ≤ 100ms |
| **CLS** | Cumulative Layout Shift - visual stability | ≤ 0.1 |

### Additional Web Vitals

| Metric | Description | Target |
|--------|-------------|--------|
| **TTFB** | Time to First Byte - server response time | ≤ 600ms |
| **FCP** | First Contentful Paint - first paint | ≤ 1.8s |
| **INP** | Interaction to Next Paint - responsiveness | ≤ 200ms |

---

## Getting Started

### Installation

```bash
npm install web-vitals
# or
yarn add web-vitals
# or
pnpm add web-vitals
```

### Quick Start

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Basic usage
getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

---

## Core Metrics

### CLS (Cumulative Layout Shift)

Measures visual stability by quantifying how much unexpected layout shift occurs during page load.

```typescript
import { getCLS } from 'web-vitals';

getCLS((metric) => {
  console.log('CLS:', metric.value);
  // Good: < 0.1, Needs Improvement: 0.1-0.25, Poor: > 0.25
});

// With options
getCLS((metric) => {
  console.log('CLS:', metric.value);
}, {
  reportAllChanges: false, // Only report final value
});
```

**Metric Details:**

```typescript
interface CLSMetric {
  name: 'CLS';
  value: number;           // Layout shift score
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;           // Change since last report
  entries: LayoutShift[];  // Performance entries
  id: string;             // Unique ID
  navigationType: 'navigate' | 'reload' | 'back-forward' | 'prerender';
}
```

**Common Causes of CLS:**

- Images without dimensions
- Ads or embeds without reserved space
- Web fonts causing FOIT/FOUT
- Dynamically injected content
- Actions waiting for network response

### LCP (Largest Contentful Paint)

Measures loading performance by marking the point when the main content has likely loaded.

```typescript
import { getLCP } from 'web-vitals';

getLCP((metric) => {
  console.log('LCP:', metric.value);
  // Good: ≤ 2.5s, Needs Improvement: 2.5s-4s, Poor: > 4s
});

// Track element attribution
getLCP((metric) => {
  console.log('LCP:', metric.value);
  console.log('Element:', metric.entries[0]?.element);
  console.log('URL:', metric.entries[0]?.url);
});
```

**LCP Elements:**

- `<img>` elements
- `<image>` elements inside SVG
- `<video>` elements with poster
- Elements with background image
- Block-level elements containing text

### FID (First Input Delay)

Measures interactivity by quantifying the experience users feel when trying to interact with unresponsive pages.

```typescript
import { getFID } from 'web-vitals';

getFID((metric) => {
  console.log('FID:', metric.value);
  // Good: ≤ 100ms, Needs Improvement: 100ms-300ms, Poor: > 300ms
});
```

**Note:** FID is being replaced by INP (Interaction to Next Paint) as the primary responsiveness metric.

### INP (Interaction to Next Paint)

Measures responsiveness by observing the latency of all interactions a user has made with the page.

```typescript
import { getINP } from 'web-vitals';

getINP((metric) => {
  console.log('INP:', metric.value);
  // Good: ≤ 200ms, Needs Improvement: 200ms-500ms, Poor: > 500ms
});

// With detailed attribution
getINP((metric) => {
  console.log('INP:', metric.value);
  console.log('Interaction type:', metric.entries[0]?.name);
  console.log('Processing duration:', metric.entries[0]?.processingDuration);
});
```

### FCP (First Contentful Paint)

Measures the time from when the page starts loading to when any part of the page's content is rendered.

```typescript
import { getFCP } from 'web-vitals';

getFCP((metric) => {
  console.log('FCP:', metric.value);
  // Good: ≤ 1.8s, Needs Improvement: 1.8s-3s, Poor: > 3s
});
```

### TTFB (Time to First Byte)

Measures the time between the request for a resource and when the first byte of a response begins to arrive.

```typescript
import { getTTFB } from 'web-vitals';

getTTFB((metric) => {
  console.log('TTFB:', metric.value);
  // Good: ≤ 600ms, Needs Improvement: 600ms-1000ms, Poor: > 1000ms
});
```

---

## Reporting Strategies

### Report All Changes

By default, metrics only report their final value. Enable `reportAllChanges` to get updates throughout the page lifecycle.

```typescript
import { getCLS, getLCP } from 'web-vitals';

getCLS(console.log, { reportAllChanges: true });
// Reports every layout shift as it happens

getLCP(console.log, { reportAllChanges: true });
// Reports every candidate element until final LCP is determined
```

### Threshold-Based Reporting

Only report metrics that exceed certain thresholds.

```typescript
import { getCLS, getLCP, getFID } from 'web-vitals';

const thresholds = {
  CLS: 0.1,
  LCP: 2500,
  FID: 100,
};

getCLS((metric) => {
  if (metric.value > thresholds.CLS) {
    reportToAnalytics(metric);
  }
});

getLCP((metric) => {
  if (metric.value > thresholds.LCP) {
    reportToAnalytics(metric);
  }
});

getFID((metric) => {
  if (metric.value > thresholds.FID) {
    reportToAnalytics(metric);
  }
});
```

### Debounced Reporting

Prevent excessive reporting by debouncing metric updates.

```typescript
import { getCLS } from 'web-vitals';

function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

const debouncedReport = debounce((metric) => {
  console.log('CLS:', metric.value);
}, 1000);

getCLS((metric) => {
  debouncedReport(metric);
}, { reportAllChanges: true });
```

---

## Framework Integrations

### React

```tsx
import { useEffect } from 'react';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function useWebVitals(onReport: (metric: any) => void) {
  useEffect(() => {
    getCLS(onReport);
    getFID(onReport);
    getFCP(onReport);
    getLCP(onReport);
    getTTFB(onReport);
  }, [onReport]);
}

// Usage in component
function App() {
  useWebVitals((metric) => {
    console.log(metric.name, metric.value);
  });

  return <div>Your App</div>;
}
```

### Next.js

```tsx
// pages/_app.tsx or app/layout.tsx
import type { AppProps } from 'next/app';
import { useReportWebVitals } from 'next/web-vitals';

function App({ Component, pageProps }: AppProps) {
  useReportWebVitals((metric) => {
    console.log(metric);

    // Send to analytics
    sendToAnalytics(metric);

    // Or log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.table(metric);
    }
  });

  return <Component {...pageProps} />;
}

export default App;
```

### Svelte

```svelte
<script>
  import { onMount } from 'svelte';
  import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

  onMount(() => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
</script>
```

---

## Analytics Integration

### Google Analytics 4

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

type GA4EventParams = {
  event_category: 'Web Vitals';
  event_label: string;
  value: number;
  non_interaction: true;
};

function sendToGA4({ name, delta, id, value }: any) {
  const eventParams: GA4EventParams = {
    event_category: 'Web Vitals',
    event_label: id,
    value: Math.round(name === 'CLS' ? delta * 1000 : delta),
    non_interaction: true,
  };

  gtag('event', name, eventParams);
}

getCLS(sendToGA4);
getFID(sendToGA4);
getFCP(sendToGA4);
getLCP(sendToGA4);
getTTFB(sendToGA4);
```

### Google Tag Manager

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToGTM(metric: any) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'web-vitals',
    webVitalsName: metric.name,
    webVitalsId: metric.id,
    webVitalsValue: metric.value,
    webVitalsDelta: metric.delta,
    webVitalsRating: metric.rating,
  });
}

getCLS(sendToGTM);
getFID(sendToGTM);
getFCP(sendToGTM);
getLCP(sendToGTM);
getTTFB(sendToGTM);
```

### Custom Analytics Endpoint

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

async function sendToCustomAnalytics(metric: any) {
  const body = JSON.stringify({
    metric: metric.name,
    value: metric.value,
    id: metric.id,
    rating: metric.rating,
    delta: metric.delta,
    navigationType: metric.navigationType,
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  });

  // Use beacon API for reliability during page unload
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/web-vitals', body);
  } else {
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      body,
      keepalive: true,
    });
  }
}

getCLS(sendToCustomAnalytics);
getFID(sendToCustomAnalytics);
getFCP(sendToCustomAnalytics);
getLCP(sendToCustomAnalytics);
getTTFB(sendToCustomAnalytics);
```

### Vercel Analytics

```tsx
// Next.js with Vercel
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics /> {/* Automatically tracks Web Vitals */}
    </>
  );
}
```

---

## Performance Monitoring

### Real User Monitoring (RUM)

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB, getINP } from 'web-vitals';

interface RUMMetrics {
  [key: string]: any[];
}

class WebVitalsMonitor {
  private metrics: RUMMetrics = {};

  constructor() {
    this.init();
  }

  private init() {
    getCLS(this.handleMetric);
    getFID(this.handleMetric);
    getFCP(this.handleMetric);
    getLCP(this.handleMetric);
    getTTFB(this.handleMetric);
    getINP(this.handleMetric);
  }

  private handleMetric = (metric: any) => {
    if (!this.metrics[metric.name]) {
      this.metrics[metric.name] = [];
    }

    this.metrics[metric.name].push({
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      timestamp: Date.now(),
      url: window.location.href,
    });
  };

  getMetrics() {
    return this.metrics;
  }

  getAverage(metricName: string): number {
    const values = this.metrics[metricName]?.map(m => m.value) || [];
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  getPercentile(metricName: string, percentile: number): number {
    const values = this.metrics[metricName]?.map(m => m.value) || [];
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }
}

export const monitor = new WebVitalsMonitor();
```

### Dashboard Component

```tsx
import { useEffect, useState } from 'react';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

interface MetricData {
  name: string;
  value: number;
  rating: string;
  timestamp: number;
}

function WebVitalsDashboard() {
  const [metrics, setMetrics] = useState<MetricData[]>([]);

  useEffect(() => {
    const handleMetric = (metric: any) => {
      setMetrics(prev => [
        ...prev,
        {
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          timestamp: Date.now(),
        }
      ]);
    };

    getCLS(handleMetric);
    getFID(handleMetric);
    getFCP(handleMetric);
    getLCP(handleMetric);
    getTTFB(handleMetric);
  }, []);

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600';
      case 'needs-improvement': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Web Vitals</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">{metric.name}</div>
            <div className={`text-2xl font-bold ${getRatingColor(metric.rating)}`}>
              {metric.name === 'CLS'
                ? metric.value.toFixed(3)
                : `${Math.round(metric.value)}ms`}
            </div>
            <div className="text-xs text-gray-500 capitalize">{metric.rating}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Optimization Strategies

### CLS Optimization

```typescript
// Reserve space for images
<img width="800" height="600" src="..." />

// Reserve space for ads
<div style={{ minHeight: '250px' }}>
  <AdComponent />
</div>

// Avoid inserting content above existing content
// Bad: Loading spinner pushes content down
// Good: Reserve space for loading state
```

### LCP Optimization

```typescript
// Preload LCP image
<link rel="preload" as="image" href="/hero-image.webp" />

// Use priority loading
<img src="/hero.webp" fetchpriority="high" />

// Optimize rendering
// - Remove render-blocking resources
// - Inline critical CSS
// - Use CDN for assets
```

### FID/INP Optimization

```typescript
// Break up long tasks
async function processLargeDataset() {
  const chunks = chunkArray(data, 100);

  for (const chunk of chunks) {
    await new Promise(resolve => {
      requestIdleCallback(() => {
        processChunk(chunk);
        resolve(undefined);
      });
    });
  }
}

// Use web workers for heavy computation
const worker = new Worker('worker.js');
worker.postMessage({ data: largeDataset });

// Optimize event handlers
function OptimizedButton() {
  const handleClick = useCallback(() => {
    // Use scheduler for non-urgent work
    scheduleCallback(() => {
      doNonUrgentWork();
    });
  }, []);

  return <button onClick={handleClick}>Click me</button>;
}
```

### TTFB Optimization

```typescript
// Server-side optimizations
// - Enable compression (gzip/brotli)
// - Use CDN for static assets
// - Implement caching strategies
// - Optimize database queries

// Edge caching
export const config = {
  runtime: 'edge',
};

// Streaming SSR
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SlowComponent />
    </Suspense>
  );
}
```

---

## TypeScript Support

### Type Definitions

```typescript
import type {
  CLSMetric,
  CLSReportCallback,
  FCPMetric,
  FCPReportCallback,
  FIDMetric,
  FIDReportCallback,
  INPMetric,
  INPReportCallback,
  LCPMetric,
  LCPReportCallback,
  TTFBMetric,
  TTFBReportCallback,
  Metric,
  ReportCallback,
  ReportOpts,
} from 'web-vitals';

// Custom callback type
type CustomReportCallback = (metric: Metric) => void;

// Metric handler with type safety
function handleMetric(metric: CLSMetric | FIDMetric | LCPMetric): void {
  console.log(`${metric.name}: ${metric.value}`);
}

// Options with type safety
const options: ReportOpts = {
  reportAllChanges: false,
};

getCLS(handleMetric as CLSReportCallback, options);
```

### Custom Metric Interface

```typescript
interface WebVitalsMetric {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  entries: PerformanceEntry[];
  id: string;
  navigationType: 'navigate' | 'reload' | 'back-forward' | 'prerender';
  attribution?: {
    largestShiftTarget?: Node;
    largestShiftTime?: number;
    largestShiftValue?: number;
  };
}

interface AnalyticsPayload {
  metric: WebVitalsMetric;
  sessionId: string;
  timestamp: number;
  url: string;
  userAgent: string;
}
```

---

## Best Practices

### 1. Measure in Production

```typescript
// Only load web-vitals in production
if (process.env.NODE_ENV === 'production') {
  import('web-vitals').then(({ getCLS, getFID, getLCP }) => {
    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getLCP(sendToAnalytics);
  });
}
```

### 2. Use sendBeacon for Reliability

```typescript
function sendToAnalytics(metric: any) {
  const body = JSON.stringify(metric);

  // Use sendBeacon for reliability during page unload
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/analytics', body);
  } else {
    fetch('/analytics', {
      body,
      method: 'POST',
      keepalive: true,
    });
  }
}
```

### 3. Report Percentiles, Not Averages

```typescript
function reportPercentiles(metrics: number[]) {
  const sorted = [...metrics].sort((a, b) => a - b);

  return {
    p50: sorted[Math.floor(sorted.length * 0.5)],
    p75: sorted[Math.floor(sorted.length * 0.75)],
    p90: sorted[Math.floor(sorted.length * 0.9)],
    p95: sorted[Math.floor(sorted.length * 0.95)],
    p99: sorted[Math.floor(sorted.length * 0.99)],
  };
}
```

### 4. Debug Mode

```typescript
const DEBUG = process.env.NODE_ENV === 'development';

function logMetric(metric: any) {
  if (DEBUG) {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      entries: metric.entries,
    });
  }

  // Always report to analytics in production
  if (!DEBUG) {
    sendToAnalytics(metric);
  }
}

getCLS(logMetric);
getFID(logMetric);
getLCP(logMetric);
```

---

## Troubleshooting

### Common Issues

**Metrics not reporting:**
- Ensure code runs after page load
- Check browser support (requires modern browsers)
- Verify no ad blockers interfering

**CLS constantly updating:**
- Use `{ reportAllChanges: false }` for final value only
- Check for layout shifts in your UI
- Review third-party scripts

**INP not reporting:**
- Requires user interaction on the page
- Only reports after interaction occurs
- May not report on pages without interactions

### Debug Helpers

```typescript
// Enable debug logging
import { getCLS, getFID, getLCP } from 'web-vitals';

function debugMetric(metric: any) {
  console.group(`[Web Vitals] ${metric.name}`);
  console.log('Value:', metric.value);
  console.log('Rating:', metric.rating);
  console.log('Entries:', metric.entries);
  console.log('Attribution:', metric.attribution);
  console.groupEnd();
}

if (location.search.includes('debug-web-vitals')) {
  getCLS(debugMetric, { reportAllChanges: true });
  getFID(debugMetric);
  getLCP(debugMetric, { reportAllChanges: true });
}
```

---

## Resources

- [Web Vitals Official Site](https://web.dev/vitals/)
- [web-vitals GitHub](https://github.com/GoogleChrome/web-vitals)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Web Vitals Chrome Extension](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibne)

---

## Version Information

- **Current Version:** 4.x
- **License:** Apache-2.0
- **Browser Support:** Chrome 77+, Edge 79+, Firefox 75+, Safari 14+
- **Bundle Size:** ~1KB gzipped
- **TypeScript:** Full support
