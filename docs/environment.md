# Environment Variables

This document describes how to set up and manage environment variables for the firm website application.

## Required Environment Variables

### Public Variables (Client-Side)

- `NEXT_PUBLIC_SITE_URL` - The base URL of the site (default: `http://localhost:3000`)
- `NEXT_PUBLIC_ANALYTICS_ID` - Analytics tracking ID (optional)

### Private Variables (Server-Side Only)

- `FORM_API_KEY` - API key for form submissions (optional)

## Setup Instructions

1. Copy the example environment file:
   ```bash
   cp apps/firm-website/.env.example apps/firm-website/.env.local
   ```

2. Edit `apps/firm-website/.env.local` with your actual values:
   ```bash
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
   FORM_API_KEY=your-api-key
   ```

3. Restart the development server to apply changes:
   ```bash
   pnpm dev
   ```

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
