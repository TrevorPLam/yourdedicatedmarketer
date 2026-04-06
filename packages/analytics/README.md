# @agency/analytics

Privacy-compliant analytics tracking with multi-provider support for marketing
agency applications.

## Features

- 🔒 **GDPR/CCPA Compliant**: Built-in consent management with regional support
- 🔄 **Multi-Provider Support**: Google Analytics 4, Plausible Analytics, and
  custom adapters
- 🎯 **Type-Safe**: Full TypeScript support with comprehensive interfaces
- ⚡ **Performance Optimized**: Event batching, debouncing, and intelligent
  filtering
- 🛠️ **React Ready**: Custom hooks for seamless React integration
- 🌍 **Regional Support**: Automatic region detection and consent requirements
- 📊 **Rich Analytics**: Page views, custom events, user properties, and
  e-commerce tracking

## Installation

```bash
pnpm add @agency/analytics
```

## Quick Start

### Basic Setup with GA4

```typescript
import { AnalyticsManager, GA4Adapter } from '@agency/analytics';

// Initialize analytics
const analytics = new AnalyticsManager({
  providers: [new GA4Adapter()],
  consentConfig: {
    region: 'EU', // or 'US', 'CA', 'UK', 'GLOBAL'
    requireExplicitConsent: true,
    showConsentBanner: true,
  },
});

await analytics.initialize();

// Track events
await analytics.track({
  name: 'button_click',
  parameters: {
    button_id: 'signup',
    location: 'homepage',
  },
});

// Track page views
await analytics.pageview({
  path: '/about',
  title: 'About Us',
});
```

### React Integration

```tsx
import { useAnalytics } from '@agency/analytics/react';
import { GA4Adapter } from '@agency/analytics';

function App() {
  const { track, pageview, isReady } = useAnalytics({
    provider: new GA4Adapter(),
    config: {
      provider: 'ga4',
      trackingId: 'G-XXXXXXXXXX',
    },
    consentConfig: {
      region: 'EU',
      requireExplicitConsent: true,
    },
    autoTrackPageViews: true,
  });

  const handleSignup = async () => {
    await track({
      name: 'signup_attempt',
      parameters: {
        method: 'email',
        source: 'homepage',
      },
    });
  };

  return (
    <div>
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}
```

## Consent Management

### Automatic Consent Banner

```typescript
import { ConsentManager } from '@agency/analytics';

const consentManager = new ConsentManager({
  region: 'EU',
  requireExplicitConsent: true,
  showConsentBanner: true,
  privacyPolicyUrl: '/privacy-policy',
});

consentManager.initialize();
```

### Custom Consent Handling

```typescript
// Grant all consent
consentManager.grantAllConsent();

// Deny all consent
consentManager.denyAllConsent();

// Update specific categories
consentManager.updateConsent({
  analytics: true,
  advertising: false,
  functional: true,
  personalization: false,
});

// Listen for consent changes
const unsubscribe = consentManager.addListener((event) => {
  console.log('Consent updated:', event);
});
```

## Provider Configuration

### Google Analytics 4

```typescript
import { GA4Adapter } from '@agency/analytics';

const ga4 = new GA4Adapter();

await ga4.initialize({
  provider: 'ga4',
  trackingId: 'G-XXXXXXXXXX',
  debug: true,
  sampleRate: 100,
  respectDoNotTrack: true,
});

// Enhanced measurement
ga4.configureEnhancedMeasurement({
  scrollTracking: true,
  outboundClickTracking: true,
  fileDownloadTracking: true,
});

// Cross-domain tracking
ga4.configureCrossDomain(['example.com', 'blog.example.com']);
```

### Plausible Analytics

```typescript
import { PlausibleAdapter } from '@agency/analytics';

const plausible = new PlausibleAdapter();

await plausible.initialize({
  provider: 'plausible',
  domain: 'example.com',
  debug: true,
});

// Enable automatic tracking
plausible.enableOutboundLinkTracking();
plausible.enableFileDownloadTracking();

// Track revenue
plausible.trackRevenue(99.99, 'USD', {
  product_id: 'premium_plan',
  customer_type: 'new',
});
```

## React Hooks

### useAnalytics

Main hook for analytics functionality:

```tsx
import { useAnalytics } from '@agency/analytics/react';

function MyComponent() {
  const {
    track,
    pageview,
    setUserProperty,
    setUserId,
    isReady,
    isLoading,
    error,
    consent,
    updateConsent,
  } = useAnalytics({
    provider: new GA4Adapter(),
    config: { trackingId: 'G-XXXXXXXXXX' },
    consentConfig: { region: 'EU' },
  });

  // Track events
  const handleClick = () => {
    track({
      name: 'button_click',
      parameters: { element: 'cta_button' },
    });
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

### useEventTracker

Simplified event tracking:

```tsx
import { useEventTracker } from '@agency/analytics/react';

function TrackingComponent() {
  const { trackEvent } = useEventTracker({
    provider: new GA4Adapter(),
    config: { trackingId: 'G-XXXXXXXXXX' },
  });

  return (
    <button onClick={() => trackEvent('form_submit', { form: 'contact' })}>
      Submit
    </button>
  );
}
```

### useInteractionTracker

User interaction tracking:

```tsx
import { useInteractionTracker } from '@agency/analytics/react';

function InteractionComponent() {
  const { trackClick, trackFormSubmit, trackDownload } = useInteractionTracker({
    provider: new GA4Adapter(),
    config: { trackingId: 'G-XXXXXXXXXX' },
  });

  return (
    <div>
      <button onClick={() => trackClick('header_logo')}>Logo</button>
      <form onSubmit={() => trackFormSubmit('newsletter')}>
        <input type="email" placeholder="Email" />
        <button type="submit">Subscribe</button>
      </form>
      <a href="/guide.pdf" onClick={() => trackDownload('guide.pdf')}>
        Download Guide
      </a>
    </div>
  );
}
```

### useEcommerceTracker

E-commerce event tracking:

```tsx
import { useEcommerceTracker } from '@agency/analytics/react';

function ProductComponent() {
  const {
    trackPurchase,
    trackAddToCart,
    trackRemoveFromCart,
    trackBeginCheckout,
  } = useEcommerceTracker({
    provider: new GA4Adapter(),
    config: { trackingId: 'G-XXXXXXXXXX' },
  });

  const handlePurchase = () => {
    trackPurchase('txn_123', 99.99, 'USD', {
      items: [{ id: 'product_1', name: 'Premium Plan' }],
    });
  };

  return <button onClick={handlePurchase}>Buy Now</button>;
}
```

## Advanced Usage

### Custom Middleware

```typescript
import { AnalyticsManager } from '@agency/analytics';

const analytics = new AnalyticsManager({
  providers: [new GA4Adapter()],
  middleware: [
    {
      name: 'enrichment',
      beforeTrack: (event, context) => {
        // Add context to all events
        return {
          ...event,
          parameters: {
            ...event.parameters,
            user_agent: context.userAgent,
            timestamp: Date.now(),
          },
        };
      },
      onError: (error, context) => {
        console.error('Analytics error:', error);
      },
    },
  ],
});
```

### Event Filtering

```typescript
const analytics = new AnalyticsManager({
  providers: [new GA4Adapter()],
  filters: [
    {
      name: 'development-filter',
      shouldTrack: (event, context) => {
        // Don't track events in development
        return process.env.NODE_ENV === 'production';
      },
    },
  ],
});
```

### Multi-Provider Setup

```typescript
import {
  AnalyticsManager,
  GA4Adapter,
  PlausibleAdapter,
} from '@agency/analytics';

const analytics = new AnalyticsManager({
  providers: [new GA4Adapter(), new PlausibleAdapter()],
  consentConfig: {
    region: 'EU',
  },
});

await analytics.initialize();

// Events will be sent to both providers
await analytics.track({
  name: 'user_action',
  parameters: { action: 'login' },
});
```

## Utilities

### Data Sanitization

```typescript
import { AnalyticsUtils } from '@agency/analytics';

// Sanitize events to remove PII
const cleanEvent = AnalyticsUtils.sanitizeEvent({
  name: 'user_signup',
  parameters: {
    email: 'user@example.com', // Will be hashed
    name: 'John Doe', // Will be hashed
    plan: 'premium', // Will remain
  },
});

// Validate event data
if (AnalyticsUtils.validateEvent(event)) {
  await analytics.track(event);
}

// Get user region
const region = AnalyticsUtils.getUserRegion();
const consentRequired = AnalyticsUtils.isConsentRequired(region);
```

### Performance Optimization

```typescript
// Debounced event tracking
const debouncedTrack = AnalyticsUtils.debounce(
  (event) => analytics.track(event),
  1000
);

// Throttled page views
const throttledPageview = AnalyticsUtils.throttle(
  (pageView) => analytics.pageview(pageView),
  5000
);

// Batch events
const events = [
  { name: 'click', parameters: { element: 'button1' } },
  { name: 'click', parameters: { element: 'button2' } },
];
const batched = AnalyticsUtils.batchEvents(events);
```

## Configuration Options

### AnalyticsConfig

```typescript
interface AnalyticsConfig {
  provider: 'ga4' | 'plausible' | 'custom';
  trackingId?: string;
  domain?: string;
  customEndpoint?: string;
  debug?: boolean;
  respectDoNotTrack?: boolean;
  defaultConsent?: Partial<ConsentState>;
  region?: string;
  cookieDomain?: string;
  sampleRate?: number;
}
```

### ConsentConfig

```typescript
interface ConsentConfig {
  defaultConsent: Partial<ConsentState>;
  region: 'EU' | 'US' | 'CA' | 'UK' | 'GLOBAL';
  cookieDomain?: string;
  cookieExpiryDays?: number;
  requireExplicitConsent?: boolean;
  showConsentBanner?: boolean;
  consentVersion?: string;
  privacyPolicyUrl?: string;
  customCategories?: string[];
}
```

## Privacy & Compliance

### GDPR Compliance

- Explicit consent required for EU users
- Right to withdraw consent at any time
- Data portability and deletion support
- Clear consent logging and audit trails

### CCPA Compliance

- California-specific privacy rights
- Opt-out mechanisms
- Data collection transparency
- Do Not Sell tracking

### Privacy Features

- Automatic PII detection and hashing
- Cookie-less tracking options
- Regional consent management
- Data retention controls

## Browser Support

- Chrome 111+
- Firefox 113+
- Safari 16.4+
- Edge 111+

## License

MIT © Agency Team
