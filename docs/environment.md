# Environment Variables

This document describes how to set up and manage environment variables for the firm website application.

## Required Environment Variables

### Public Variables (Client-Side)

- `NEXT_PUBLIC_SITE_URL` - The base URL of the site (default: `http://localhost:3000`)
- `NEXT_PUBLIC_ANALYTICS_ID` - Analytics tracking ID (optional)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics 4 measurement ID (format: `G-XXXXXXXXXX`)
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN for error tracking (format: `https://xxxx@xxxx.ingest.sentry.io/xxxx`)

### Private Variables (Server-Side Only)

- `RESEND_API_KEY` - Resend API key for email sending (format: `re_xxxx`)
- `CONTACT_EMAIL` - Destination email for contact form submissions (e.g., `hello@yourdedicatedmarketer.com`)
- `FROM_EMAIL` - Sender email for contact form submissions (e.g., `noreply@yourdedicatedmarketer.com`)
- `FORM_API_KEY` - API key for form submissions (optional, legacy)

## Setup Instructions

1. Copy the example environment file:
   ```bash
   cp apps/firm-website/.env.example apps/firm-website/.env.local
   ```

2. Edit `apps/firm-website/.env.local` with your actual values:
   ```bash
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   NEXT_PUBLIC_SENTRY_DSN=https://xxxx@xxxx.ingest.sentry.io/xxxx
   RESEND_API_KEY=re_xxxx
   CONTACT_EMAIL=hello@yourdedicatedmarketer.com
   FROM_EMAIL=noreply@yourdedicatedmarketer.com
   ```

3. Restart the development server to apply changes:
   ```bash
   pnpm dev
   ```

## Vercel Environment Variables Setup

### Production Environment

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables for **Production**:

   **Public Variables:**
   - `NEXT_PUBLIC_SITE_URL` - Set to your production URL (e.g., `https://yourdedicatedmarketer.com`)
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Your Google Analytics 4 measurement ID
   - `NEXT_PUBLIC_SENTRY_DSN` - Your Sentry DSN from Sentry project setup

   **Private Variables:**
   - `RESEND_API_KEY` - Your Resend API key (get from Resend dashboard)
   - `CONTACT_EMAIL` - Destination email for contact form (e.g., `hello@yourdedicatedmarketer.com`)
   - `FROM_EMAIL` - Sender email for contact form (e.g., `noreply@yourdedicatedmarketer.com`)

4. Click **Save** to apply the changes

### Preview Environment

For preview deployments, you can either:

1. **Inherit from Production** - Use the same values as production for most variables
2. **Set specific preview values** - Add environment variables specifically for Preview environment

Recommended approach:
- Set `NEXT_PUBLIC_SITE_URL` to the preview deployment URL (Vercel provides this automatically)
- Use the same `RESEND_API_KEY`, `CONTACT_EMAIL`, and `FROM_EMAIL` as production for testing
- Use a separate Google Analytics property or the same one with custom dimensions for preview tracking
- Use a separate Sentry project or environment to distinguish preview errors

### Important Notes

- **Never** prefix sensitive variables with `NEXT_PUBLIC_` - this exposes them to the browser
- Only `NEXT_PUBLIC_SENTRY_DSN` is intentionally public because Sentry needs it on the client
- Environment variables are automatically injected at build time for `NEXT_PUBLIC_` variables
- Server-only variables are available in Server Components, API routes, and Server Actions
- Changes to environment variables require a redeployment to take effect

## Environment Variable Validation

The application uses Zod to validate environment variables at startup. If any required variables are missing or invalid, the application will fail to start with a clear error message.

The validation logic is in `apps/firm-website/src/lib/env.ts` and exports a typed `env` object that should be used throughout the application instead of accessing `process.env` directly.

## Usage in Code

Import the validated env object:

```typescript
import { env } from '@/lib/env';

// Use the typed environment variables
const siteUrl = env.NEXT_PUBLIC_SITE_URL;
```

## Environment Files

- `.env.example` - Template file (committed to git)
- `.env.local` - Local development overrides (gitignored)
- `.env.development` - Development environment (gitignored)
- `.env.production` - Production environment (gitignored)

## Security Notes

- Never commit `.env.local`, `.env.development`, or `.env.production` files
- Only prefix variables with `NEXT_PUBLIC_` if they need to be exposed to the browser
- Server-only variables (without `NEXT_PUBLIC_` prefix) are only available in server components and API routes
