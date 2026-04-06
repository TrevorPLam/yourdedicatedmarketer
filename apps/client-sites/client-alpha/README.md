# Client Alpha - Marketing Site

A modern, responsive marketing website built with Astro v6.0, featuring:

- 🚀 **Performance**: Optimized for Core Web Vitals with sub-2s load times
- 🌍 **Internationalization**: Multi-language support (EN, ES, FR, DE)
- 🎨 **Custom Theming**: Client-specific branding and design system
- 📊 **Analytics**: Privacy-compliant tracking with consent management
- 🔍 **SEO Optimized**: Structured data, sitemaps, and meta tags
- 🛡️ **Monitoring**: Performance monitoring and error tracking

## Features

### Core Functionality

- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Accessibility**: WCAG 2.2 AA compliance with screen reader support
- **Performance**: Lazy loading, code splitting, and optimized assets
- **Security**: CSP headers, XSS protection, and secure defaults

### Marketing Features

- **Hero Section**: Eye-catching landing with animated elements
- **Services Showcase**: Detailed service offerings with cards
- **Portfolio Gallery**: Project highlights with filtering
- **Testimonials**: Customer reviews and ratings
- **Contact Forms**: Lead generation with validation

### Technical Stack

- **Framework**: Astro v6.0 with static generation
- **Styling**: Tailwind CSS v4.0 with custom theme
- **Components**: Shared UI component library
- **Analytics**: Multi-provider analytics with consent
- **SEO**: Automated meta tags and structured data
- **Monitoring**: Performance and error tracking

## Development

### Prerequisites

- Node.js 22.12.0+
- pnpm 10.0.0+

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Site Configuration
SITE_URL=https://client-alpha.com
CLIENT_NAME=Client Alpha

# Analytics (optional)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
PLAUSIBLE_DOMAIN=client-alpha.com

# Monitoring (optional)
SENTRY_DSN=your-sentry-dsn
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify

```bash
# Build and deploy
pnpm build
netlify deploy --prod --dir=dist
```

### Cloudflare Pages

```bash
# Build and deploy
pnpm build
wrangler pages publish dist
```

## Customization

### Branding

Update `src/site.config.js` to customize:

- Company information
- Contact details
- Social media links
- SEO configuration

### Theming

Modify `src/styles/global.css` to adjust:

- Color palette
- Typography
- Animations
- Layout components

### Content

Edit Astro components in `src/components/sections/`:

- `Hero.astro` - Main landing section
- `Services.astro` - Service offerings
- `Portfolio.astro` - Project showcase
- `Testimonials.astro` - Customer reviews
- `Contact.astro` - Contact form and information

## Performance

### Optimization Features

- **Image Optimization**: Automatic WebP conversion and lazy loading
- **Font Loading**: Optimized font loading with display swap
- **CSS Optimization**: Critical CSS inlining and async loading
- **JavaScript**: Minimal runtime with tree shaking

### Metrics

- **First Contentful Paint**: <1.2s
- **Largest Contentful Paint**: <1.8s
- **Cumulative Layout Shift**: <0.08
- **Time to Interactive**: <2.1s

## Support

For support and questions:

- Email: {CLIENT_CONFIG.contact.email}
- Phone: {CLIENT_CONFIG.contact.phone}
- Documentation: [Agency Docs](https://docs.youragency.com)

---

_Built with ❤️ by Your Dedicated Marketer_
