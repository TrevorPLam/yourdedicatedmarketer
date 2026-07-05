import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Disable sending user data and HTTP bodies for privacy
  dataCollection: {
    userInfo: false,
    httpBodies: [],
  },

  // Only enable in production
  enabled: process.env.NODE_ENV === 'production',

  // Set traces sample rate to 1.0 in development, 0.1 in production
  // Adjust based on your traffic volume
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
});
