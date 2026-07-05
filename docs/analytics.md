# Analytics Documentation

This document describes the analytics implementation for the marketing website, including Google Analytics 4 (GA4) setup, page view tracking, and conversion event tracking.

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
