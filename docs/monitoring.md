# Monitoring

This document describes the monitoring and error tracking setup for the application.

## Sentry Error Tracking

Sentry is configured to capture unhandled errors and performance issues in production.

### Configuration

Sentry is initialized across three runtime environments:

- **Client** (`sentry.client.config.ts`) - Browser-side error tracking
- **Server** (`sentry.server.config.ts`) - Node.js server-side error tracking
- **Edge** (`sentry.edge.config.ts`) - Edge runtime error tracking

All configurations:

- Use `NEXT_PUBLIC_SENTRY_DSN` environment variable for the DSN
- Only enable in production (`NODE_ENV === 'production'`)
- Disable sending user data and HTTP bodies for privacy
- Set traces sample rate to 1.0 in development, 0.1 in production

### Next.js Integration

The Next.js configuration is wrapped with `withSentryConfig` to enable:

- Source map uploads (hidden from public)
- Automatic server function instrumentation
- Error capture for Server Actions

The `instrumentation.ts` file registers Sentry for both Node.js and Edge runtimes.

### Environment Variables

Required environment variable:

- `NEXT_PUBLIC_SENTRY_DSN` - Sentry Data Source Name (public, client-side)

### Viewing Errors

1. Log into your Sentry account
2. Navigate to your project
3. View issues, errors, and performance data

### Best Practices

- **Only enable in production** - Sentry is disabled in development to avoid noise
- **Privacy first** - User data and HTTP bodies are not sent to Sentry
- **Source maps hidden** - Source maps are uploaded but not exposed to the public
- **Sample rate** - Performance tracing is sampled at 10% in production to manage quota

### Future Enhancements

- Performance monitoring (currently disabled)
- Session replay (currently disabled)
- User feedback integration
- Custom error boundaries for better error context
