# Performance Optimizations

This document describes the performance optimizations applied to the application and how to maintain them.

## Targets

- **Largest Contentful Paint (LCP):** < 2.5s
- **Interaction to Next Paint (INP):** < 200ms
- **Cumulative Layout Shift (CLS):** < 0.1
- **First Contentful Paint (FCP):** as fast as possible
- **Lighthouse Performance score:** 90+

## Implemented Optimizations

### CSS Bundle

- Tailwind CSS v4 is used in CSS-first mode, which automatically detects used utilities and only generates the required CSS.
- Shared UI styles live in `packages/ui/src/styles.css` and are imported once by the application via `@repo/ui/globals.css`.
- Font family declarations are injected by `next/font` and referenced through CSS variables, avoiding redundant font declarations.

### Font Loading

- Fonts are loaded with `next/font/google` for automatic self-hosting and optimization.
- `font-display: swap` is configured to prevent invisible text while fonts load.
- `Inter` is assigned to `--font-inter` and applied as the default sans font.
- `Space_Grotesk` is assigned to `--font-space-grotesk` and used for display headings via the `font-display` utility.
- System fonts are included as fallbacks to ensure text remains readable before custom fonts arrive.

### Lazy Loading

- The heavy below-the-fold sections on the home page are lazy loaded using `next/dynamic`:
  - `DemoPreview`
  - `HowItWorks`
  - `FAQSnippet`
- Each dynamic section has a skeleton placeholder that minimizes layout shift while the content is prepared.
- Hero, Pillars, and Final CTA are rendered immediately because they are above the fold.

### Performance Monitoring

- Core Web Vitals are collected with the `useReportWebVitals` hook from `next/web-vitals`.
- Metrics are logged to the console in development.
- In production, metrics are sent to Google Analytics as non-interaction events.
- CLS values are multiplied by 1000 before sending to analytics so they are reported as integers.

### Animation Performance

- Animations are implemented with `transform` and `opacity` only, which are GPU-composed properties.
- The `@media (prefers-reduced-motion: reduce)` media query disables animations for users who prefer reduced motion.
- Glassmorphism and other effect classes use `contain: layout style paint` where appropriate.

## Measurement

Run a production build and then measure performance with the following commands:

```bash
# Production build
pnpm build

# Start the production server
pnpm start

# Run a Lighthouse audit
npx lighthouse http://localhost:3000 --view
```

For Web Vitals reporting, the application must be running in a browser environment with Google Analytics configured (`NEXT_PUBLIC_GA_MEASUREMENT_ID`).

## Maintenance

- Keep above-the-fold content lightweight and avoid blocking the initial render with heavy data fetches.
- When adding new sections to the home page, consider whether they belong above or below the fold and lazy load them accordingly.
- Monitor real-user Web Vitals metrics in Google Analytics after each deployment.
- If adding new fonts, use `next/font` with `display: 'swap'` and a system fallback stack.
- Avoid animating layout-affecting properties such as `width`, `height`, `top`, and `margin`.
