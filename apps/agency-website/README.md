# Agency Website

Main marketing website for Your Dedicated Marketer, built with Astro v6.0 and
modern web technologies.

## Features

### 🚀 Modern Tech Stack

- **Astro v6.0** - Static site generator with Live Collections
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe development
- **React 19** - Interactive components
- **Node 22.12.0+** - Latest Node.js runtime

### 🎯 Performance Optimized

- **Core Web Vitals** monitoring
- **Lazy loading** for images
- **Optimized fonts** with preload hints
- **CSS-in-JS** with minimal bundle size
- **Static generation** for maximum performance

### 🔍 SEO Ready

- **Semantic HTML5** structure
- **Structured data** with JSON-LD
- **Open Graph** and Twitter Card meta tags
- **Automatic sitemaps**
- **Robots.txt** configuration

### ♿ Accessible

- **WCAG 2.2 AA** compliance
- **ARIA labels** and landmarks
- **Keyboard navigation** support
- **Screen reader** optimization
- **Focus management**

## Project Structure

```
apps/agency-website/
├── src/
│   ├── components/
│   │   ├── layout/          # Header, Footer, Navigation
│   │   ├── sections/        # Hero, Services, Portfolio, etc.
│   │   └── ui/              # Reusable UI components
│   ├── layouts/             # Base and Blog layouts
│   ├── pages/               # Route pages
│   ├── content/             # Markdown content
│   │   ├── services/        # Service descriptions
│   │   ├── portfolio/       # Project showcases
│   │   ├── blog/           # Blog posts
│   │   ├── team/           # Team member profiles
│   │   └── testimonials/    # Client testimonials
│   └── styles/              # Global CSS and styles
├── public/                  # Static assets
└── astro.config.mjs        # Astro configuration
```

## Content Management

### Content Collections

- **Build-time collections** for static content (services, portfolio, blog)
- **Live collections** for dynamic CMS integration
- **Type-safe schemas** with Zod validation
- **Automatic type generation**

### Adding New Content

#### Blog Posts

Create a new file in `src/content/blog/`:

```markdown
---
title: 'Your Blog Post Title'
description: 'Brief description'
pubDate: 2024-01-15
author: 'Author Name'
featured: true
tags: ['tag1', 'tag2']
category: 'marketing'
---

Your blog content here...
```

#### Services

Create a new file in `src/content/services/`:

```markdown
---
title: 'Service Name'
description: 'Service description'
icon: 'palette'
featured: true
price: 'Starting at $X,XXX'
duration: 'X-X weeks'
tags: ['tag1', 'tag2']
---

Service details...
```

## Development

### Prerequisites

- Node.js 22.12.0 or higher
- pnpm 10.0.0 or higher

### Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Start development server:

```bash
pnpm dev
```

3. Build for production:

```bash
pnpm build
```

4. Preview production build:

```bash
pnpm preview
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# CMS Configuration (for Live Collections)
CMS_API_URL=your_cms_api_url
CMS_API_KEY=your_cms_api_key

# Analytics
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
SENTRY_DSN=your_sentry_dsn
```

## Deployment

### Static Hosting

This site is optimized for static hosting platforms:

- **Vercel** (recommended)
- **Netlify**
- **Cloudflare Pages**
- **GitHub Pages**

### Build Configuration

- **Output**: Static files
- **Node version**: 22.12.0+
- **Build command**: `pnpm build`
- **Output directory**: `dist/`

## Performance

### Core Web Vitals

- **LCP**: < 2.5s (Large Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### Optimization Features

- **Image optimization** with lazy loading
- **Font preloading** and optimization
- **CSS minification** and purging
- **JavaScript tree shaking**
- **Gzip compression**

## SEO Features

### Meta Tags

- Dynamic title and description generation
- Open Graph and Twitter Card support
- Structured data with JSON-LD
- Canonical URL handling

### Sitemap

Automatic sitemap generation at `/sitemap.xml`.

### Robots.txt

Search engine directives at `/robots.txt`.

## Accessibility

### WCAG 2.2 Compliance

- Semantic HTML structure
- ARIA labels and landmarks
- Keyboard navigation
- Screen reader support
- Focus management
- Color contrast compliance

### Testing

Accessibility testing with:

- axe-core automated testing
- Keyboard navigation testing
- Screen reader testing

## Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Test accessibility changes
4. Update documentation
5. Follow Git commit conventions

## License

MIT License - see LICENSE file for details.

---

Built with ❤️ using [Astro](https://astro.build/) and modern web technologies.
