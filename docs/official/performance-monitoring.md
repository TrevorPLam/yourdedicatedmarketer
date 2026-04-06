# Performance Monitoring

## Overview

Performance monitoring ensures applications meet user expectations for speed and reliability. This guide covers Core Web Vitals, real user monitoring (RUM), and synthetic monitoring for production applications.

---

## Core Web Vitals

### Metrics Reference

| Metric | Target | Description | Tool |
|--------|--------|-------------|------|
| **LCP** | < 2.5s | Largest Contentful Paint | Lighthouse, RUM |
| **INP** | < 200ms | Interaction to Next Paint | Lighthouse, RUM |
| **CLS** | < 0.1 | Cumulative Layout Shift | Lighthouse, RUM |
| **TTFB** | < 600ms | Time to First Byte | Server logs, RUM |
| **FCP** | < 1.8s | First Contentful Paint | Lighthouse, RUM |

### Implementation

```typescript
// lib/analytics/vitals.ts
import { onCLS, onFCP, onFID, onLCP, onTTFB, onINP } from 'web-vitals';

export function reportWebVitals(metric: any) {
  const body = JSON.stringify(metric);
  
  // Send to analytics endpoint
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/vitals', body);
  } else {
    fetch('/api/analytics/vitals', {
      method: 'POST',
      body,
      keepalive: true,
    });
  }
}

export function initWebVitals() {
  onCLS(reportWebVitals);
  onFCP(reportWebVitals);
  onFID(reportWebVitals);
  onLCP(reportWebVitals);
  onTTFB(reportWebVitals);
  onINP(reportWebVitals);
}
```

---

## Vercel Analytics

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## Sentry Integration

```typescript
// lib/monitoring/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Performance monitoring
  tracesSampleRate: 1.0,
  
  // Replay for user sessions
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      maskAllInputs: false,
    }),
  ],
});
```

---

## Best Practices

- Monitor Core Web Vitals in production
- Set up performance budgets
- Use real user monitoring (RUM)
- Track custom metrics
- Alert on performance regressions

---

_Updated April 2026_
