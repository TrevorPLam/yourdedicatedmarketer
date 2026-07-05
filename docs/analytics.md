# Analytics Documentation

This document describes the analytics implementation for the marketing website, including Google Analytics 4 (GA4) setup, Vercel Analytics, page view tracking, and conversion event tracking.

## Vercel Analytics

Vercel Analytics provides automatic web vitals tracking and performance monitoring for applications deployed on Vercel. It requires no additional configuration beyond installation and integration.

### Installation

Vercel Analytics is installed as a dependency in the firm-website app:

```bash
pnpm --filter @repo/firm-website add @vercel/analytics
```

### Implementation

The Analytics component is imported from `@vercel/analytics/next` and rendered in the root layout:

```tsx
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Features

- **Automatic Web Vitals**: Tracks Core Web Vitals (LCP, CLS, FID, INP) automatically
- **Route Tracking**: Automatically tracks page views across all routes
- **Production Only**: Only loads in production to avoid skewing development data
- **No Configuration Required**: Works out of the box with Vercel deployment
- **Dashboard**: View analytics in the Vercel dashboard (Pro plan required for full features)

### Requirements

- Application must be deployed on Vercel
- Vercel Analytics must be enabled in the project settings
- Pro plan required for advanced features and historical data

### Viewing Analytics

1. Go to your Vercel project dashboard
2. Navigate to the Analytics tab
3. View Web Vitals, page views, and performance metrics

## Google Analytics 4 (GA4) Setup

### Environment Variables

The following environment variable is required for GA4 tracking:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Your GA4 Measurement ID (format: `G-XXXXXXXXXX`)

Add this to your `.env.local` file:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Implementation

GA4 is implemented using a custom approach with `next/script` for maximum control and flexibility:

1. **GA4 Script Component** (`src/components/analytics/ga4-script.tsx`):
   - Loads the gtag.js script from Google Tag Manager
   - Only loads in production to avoid skewing development data
   - Uses `afterInteractive` strategy for optimal performance

2. **Helper Functions** (`src/lib/gtag.ts`):
   - `pageview(url)`: Tracks page views in GA4
   - `event(name, params)`: Tracks custom events with optional parameters
   - Includes TypeScript type declarations for `window.gtag`

3. **Root Layout Integration** (`src/app/layout.tsx`):
   - GA4Script component is rendered in the root layout
   - Loads GA4 for all routes automatically

### Getting Your Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a GA4 property or use an existing one
3. Navigate to Admin > Data Streams
4. Select your web data stream
5. Copy the Measurement ID (format: `G-XXXXXXXXXX`)

## Page View Tracking

Page view tracking is implemented in a separate component (`src/components/analytics/page-view-tracker.tsx`) that:

- Uses `usePathname` and `useSearchParams` from Next.js
- Tracks route changes automatically
- Only tracks in production
- Includes search parameters in the page path

The PageViewTracker is added to the marketing layout to track all marketing pages.

## Conversion Event Tracking

### Contact Form Submission

The contact form tracks successful submissions as conversion events using GA4. When a user successfully submits the contact form:

- Event name: `form_submission`
- Event parameter: `form_type: 'contact'`
- Event fires only once per submission (prevents double-firing)
- No PII (personally identifiable information) is sent to GA4

The event is triggered in the `ContactForm` component (`src/components/features/contact/contact-form.tsx`) when the server action returns a successful state. A ref is used to ensure the event fires only once per submission, even if React re-renders.

### Custom Events

Custom events can be tracked using the `event()` helper function from `src/lib/gtag.ts`:

```typescript
import { event } from '@/lib/gtag';

// Track a form submission
event('generate_lead', {
  form_name: 'contact_form',
  form_location: 'homepage',
});

// Track a button click
event('click', {
  button_name: 'cta_button',
  button_location: 'hero_section',
});
```

### Recommended Events

Based on Google's recommended events, consider tracking:

- `generate_lead`: When a contact form is submitted
- `login`: When a user logs in (if applicable)
- `sign_up`: When a user creates an account (if applicable)
- `purchase`: When a purchase is made (if applicable)
- `view_item`: When a product/service is viewed
- `search`: When a search is performed (if applicable)

## Privacy and Compliance

### Production-Only Tracking

GA4 only loads in production (`NODE_ENV === 'production'`). This prevents:

- Skewed analytics data from development
- Unnecessary script loading during development
- Privacy concerns during testing

### Cookie Consent

Cookie consent is not currently implemented. This should be added to comply with GDPR and other privacy regulations. Consider implementing:

- A cookie consent banner
- User opt-in/opt-out for analytics
- Integration with consent management platforms

## Testing

### Verify GA4 is Loading

1. Open your site in production
2. Open browser DevTools > Network tab
3. Filter by "gtag" or "google-analytics"
4. Verify the script is loaded

### Verify Events are Tracked

1. Open your site in production
2. Open browser DevTools > Console
3. Type `window.dataLayer` to see tracked events
4. Check GA4 Real-Time report to verify events appear

## References

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Next.js Script Component](https://nextjs.org/docs/app/api-reference/components/script)
- [Google Tag Manager vs gtag.js](https://developers.google.com/analytics/devguides/collection/ga4/tag-options)
