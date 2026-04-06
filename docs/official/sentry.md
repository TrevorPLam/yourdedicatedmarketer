# Sentry Documentation

**Repository Version:** ^10.47.0  
**Official Documentation:** https://docs.sentry.io  
**Last Updated:** April 2026

## Overview

Sentry is a comprehensive error tracking and performance monitoring platform that helps developers identify, diagnose, and fix issues in production. It provides real-time error tracking, performance monitoring, session replay, and release tracking across the entire stack.

### Core Philosophy

Sentry believes developers should spend less time debugging and more time building. It provides actionable error context, from stack traces to user context, enabling faster root cause analysis and resolution.

### Why Sentry?

- **Real-Time Error Tracking**: Immediate notification of production issues
- **Rich Context**: Stack traces, breadcrumbs, user context, and more
- **Performance Monitoring**: Track transactions, spans, and web vitals
- **Release Health**: Monitor release adoption and stability
- **Session Replay**: See exactly what users experienced
- **Distributed Tracing**: Follow requests across services

---

## Installation

### Package Installation

```bash
# Next.js
pnpm add @sentry/nextjs

# React
pnpm add @sentry/react

# Node.js
pnpm add @sentry/node

# Browser
pnpm add @sentry/browser
```

### Repository Setup

In `pnpm-workspace.yaml`:

```yaml
catalog:
  '@sentry/nextjs': '^8.47.0'
  '@sentry/react': '^8.47.0'
  '@sentry/node': '^8.47.0'
  '@sentry/browser': '^8.47.0'
```

In package `package.json`:

```json
{
  "dependencies": {
    "@sentry/nextjs": "catalog:"
  }
}
```

---

## Configuration

### Next.js Setup

```typescript
// instrumentation.ts (Next.js 13+)
import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
      
      // Performance monitoring
      tracesSampleRate: 1.0,
      
      // Error sampling
      sampleRate: 1.0,
      
      // Debug mode in development
      debug: process.env.NODE_ENV === 'development',
      
      // Before send hook for PII filtering
      beforeSend(event) {
        // Remove sensitive data
        if (event.request?.headers) {
          delete event.request.headers['authorization'];
          delete event.request.headers['cookie'];
        }
        return event;
      },
    });
  }
  
  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
    });
  }
}
```

### Client-Side Configuration

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Performance monitoring
  tracesSampleRate: 1.0,
  
  // Replay configuration
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      maskAllInputs: true,
    }),
  ],
  
  // Environment
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
  
  // Release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  
  // Enable debugging in development
  debug: process.env.NODE_ENV === 'development',
});
```

### Server-Side Configuration

```typescript
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
});
```

### Edge Runtime Configuration

```typescript
// sentry.edge.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
});
```

---

## Error Capturing

### Automatic Error Capturing

Sentry automatically captures:
- Unhandled exceptions
- Unhandled promise rejections
- Console errors
- Fetch/XHR errors
- Navigation errors

### Manual Error Capturing

```typescript
import * as Sentry from '@sentry/nextjs';

// Capture exception
Sentry.captureException(new Error('Something went wrong'));

// Capture message
Sentry.captureMessage('User action failed', 'warning');

// Capture with context
Sentry.captureException(error, {
  extra: {
    userId: user.id,
    action: 'checkout',
    cartValue: cart.total,
  },
  tags: {
    section: 'payment',
  },
  user: {
    id: user.id,
    email: user.email,
  },
});
```

### Error Boundaries

```typescript
'use client';

import * as Sentry from '@sentry/react';

function FallbackComponent({ error, resetError }: { 
  error: Error; 
  resetError: () => void;
}) {
  return (
    <div role="alert">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={resetError}>Try again</button>
    </div>
  );
}

export function SentryErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <Sentry.ErrorBoundary 
      fallback={FallbackComponent}
      onError={(error) => {
        console.error('Error caught by boundary:', error);
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}
```

---

## Performance Monitoring

### Automatic Instrumentation

Sentry automatically instruments:
- Page loads
- Navigation transitions
- API requests
- Component renders (React)

### Custom Transactions

```typescript
import * as Sentry from '@sentry/nextjs';

async function processOrder(orderId: string) {
  const transaction = Sentry.startTransaction({
    name: 'Process Order',
    op: 'order.process',
    data: {
      orderId,
    },
  });
  
  Sentry.configureScope((scope) => {
    scope.setSpan(transaction);
  });
  
  try {
    // Validate order
    const validationSpan = transaction.startChild({
      op: 'order.validate',
      description: 'Validate order data',
    });
    await validateOrder(orderId);
    validationSpan.finish();
    
    // Process payment
    const paymentSpan = transaction.startChild({
      op: 'order.payment',
      description: 'Process payment',
    });
    await processPayment(orderId);
    paymentSpan.finish();
    
    // Fulfill order
    const fulfillmentSpan = transaction.startChild({
      op: 'order.fulfill',
      description: 'Create fulfillment',
    });
    await createFulfillment(orderId);
    fulfillmentSpan.finish();
    
    transaction.setStatus('ok');
  } catch (error) {
    transaction.setStatus('internal_error');
    Sentry.captureException(error);
    throw error;
  } finally {
    transaction.finish();
  }
}
```

### Database Query Tracing

```typescript
import * as Sentry from '@sentry/nextjs';

async function getUserWithPosts(userId: string) {
  return Sentry.startSpan(
    {
      name: 'db.user.findWithPosts',
      op: 'db.query',
    },
    async (span) => {
      span?.setAttribute('db.userId', userId);
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { posts: true },
      });
      
      return user;
    }
  );
}
```

---

## Context and Breadcrumbs

### User Context

```typescript
// Set user context
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.username,
  ip_address: '{{auto}}',
});

// Clear user context (on logout)
Sentry.setUser(null);
```

### Tags and Extra Data

```typescript
// Set global tags
Sentry.setTag('section', 'checkout');
Sentry.setTag('payment_method', 'credit_card');

// Set extra context
Sentry.setExtra('cart_items', cart.items.length);
Sentry.setExtra('cart_value', cart.total);

// Set context (grouped in Sentry UI)
Sentry.setContext('cart', {
  items: cart.items,
  total: cart.total,
  currency: cart.currency,
});
```

### Breadcrumbs

```typescript
// Add manual breadcrumb
Sentry.addBreadcrumb({
  category: 'auth',
  message: 'User login initiated',
  level: 'info',
  data: {
    provider: 'google',
  },
});

// Navigation breadcrumb
Sentry.addBreadcrumb({
  category: 'navigation',
  message: `Navigated to ${pathname}`,
  level: 'info',
});

// HTTP request breadcrumb
Sentry.addBreadcrumb({
  category: 'xhr',
  message: `GET ${url}`,
  level: 'info',
  data: {
    status_code: response.status,
    response_size: response.headers.get('content-length'),
  },
});
```

---

## Release and Deployment Tracking

### Release Creation

```bash
# Create release
npx sentry-cli releases new <release-version>

# Associate commits
npx sentry-cli releases set-commits <release-version> --auto

# Upload source maps
npx sentry-cli releases files <release-version> upload-sourcemaps ./dist

# Finalize release
npx sentry-cli releases finalize <release-version>

# Create deployment
npx sentry-cli releases deploys <release-version> new -e production
```

### Source Maps

```typescript
// next.config.js
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  // Your Next.js config
};

module.exports = withSentryConfig(nextConfig, {
  // Sentry Webpack Plugin Options
  silent: true,
  org: 'your-org',
  project: 'your-project',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  
  // Upload source maps
  sourcemaps: {
    filesToDeleteAfterUpload: '.next/**/*.map',
  },
  
  // Set release version
  release: {
    name: process.env.VERCEL_GIT_COMMIT_SHA,
    create: true,
    setCommits: {
      auto: true,
    },
  },
});
```

---

## Feedback and Session Replay

### User Feedback

```typescript
'use client';

import * as Sentry from '@sentry/react';

export function FeedbackButton() {
  return (
    <button
      onClick={() => {
        Sentry.showReportDialog({
          eventId: Sentry.lastEventId(),
          title: 'Report a Problem',
          subtitle: 'Help us improve by reporting what went wrong',
          subtitle2: '',
          labelName: 'Name',
          labelEmail: 'Email',
          labelComments: 'What happened?',
          labelClose: 'Close',
          labelSubmit: 'Submit Report',
          errorGeneric: 'An error occurred while submitting. Please try again.',
          errorFormEntry: 'Some fields were invalid. Please correct and try again.',
          successMessage: 'Thank you for your feedback!',
        });
      }}
    >
      Report Issue
    </button>
  );
}
```

### Session Replay

```typescript
// sentry.client.config.ts
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Sample rate for replays
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of error sessions
  
  integrations: [
    Sentry.replayIntegration({
      // Privacy settings
      maskAllText: false,
      maskAllInputs: true,
      unmask: ['[data-sentry-unmask]'],
      
      // Network capture
      networkDetailAllowUrls: ['/api'],
      networkCaptureBodies: true,
      
      // Quality
      quality: 'high',
    }),
  ],
});
```

---

## Best Practices

### PII (Personally Identifiable Information) Handling

```typescript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  beforeSend(event) {
    // Remove sensitive headers
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
      delete event.request.headers['cookie'];
      delete event.request.headers['x-api-key'];
    }
    
    // Remove sensitive query params
    if (event.request?.query_string) {
      const query = event.request.query_string;
      delete query['token'];
      delete query['password'];
      delete query['secret'];
    }
    
    // Scrub user data
    if (event.user) {
      delete event.user.email;
      delete event.user.ip_address;
    }
    
    // Scrub extra data
    if (event.extra) {
      scrubSensitiveData(event.extra);
    }
    
    return event;
  },
  
  // Sanitize error messages
  beforeBreadcrumb(breadcrumb) {
    if (breadcrumb.message) {
      breadcrumb.message = breadcrumb.message.replace(
        /password=[^&]+/g,
        'password=[REDACTED]'
      );
    }
    return breadcrumb;
  },
});
```

### Error Sampling

```typescript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Sample rate based on environment
  sampleRate: process.env.NODE_ENV === 'production' ? 1.0 : 0.1,
  
  // Dynamic traces sample rate
  tracesSampler: (samplingContext) => {
    // Skip health checks
    if (samplingContext.transactionContext.name === 'GET /api/health') {
      return 0;
    }
    
    // Sample more critical paths
    if (samplingContext.transactionContext.name.includes('checkout')) {
      return 1.0;
    }
    
    return 0.5;
  },
});
```

---

## Troubleshooting

### Debug Mode

```typescript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  debug: true, // Enable debug output
});
```

### Common Issues

**Issue**: Events not appearing in Sentry
```typescript
// Check DSN is configured
console.log('Sentry DSN:', process.env.SENTRY_DSN);

// Verify initialization
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  beforeSend(event) {
    console.log('Sending event:', event);
    return event;
  },
});
```

**Issue**: Source maps not working
```bash
# Verify source maps are generated
ls -la .next/static/chunks/*.map

# Check Sentry CLI is configured
npx sentry-cli releases files <version> list
```

---

## Resources

- **Official Docs**: https://docs.sentry.io
- **Next.js Guide**: https://docs.sentry.io/platforms/javascript/guides/nextjs
- **GitHub**: https://github.com/getsentry/sentry-javascript
- **Status Page**: https://status.sentry.io

---

## Version Notes

- **v8.47.x**: Current stable with Next.js App Router support
- Repository uses catalog version `^8.47.0`
