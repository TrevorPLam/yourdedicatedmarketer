# Vercel Deployment

## Overview

Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration. Optimized for Next.js applications with zero-configuration deployment, global CDN, and automatic preview environments.

**Source**: Based on [Vercel Documentation](https://vercel.com/docs), [Vercel Monorepo Guide](https://vercel.com/docs/monorepos), and [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs).

---

## Platform Features

### Core Capabilities

| Feature | Description | Availability |
|---------|-------------|--------------|
| **Zero Config** | Automatic framework detection | All plans |
| **Preview Deployments** | Every PR gets unique URL | All plans |
| **Edge Network** | Global CDN (100+ locations) | All plans |
| **Serverless Functions** | API routes & middleware | All plans |
| **Analytics** | Web Vitals monitoring | Pro+ |
| **Image Optimization** | On-the-fly optimization | All plans |
| **Remote Caching** | Turborepo cache sharing | All plans |

### Framework Support

```
Next.js (v16+)          [Optimized]
  ├── App Router        [Full Support]
  ├── Pages Router      [Full Support]
  ├── Edge Runtime      [Full Support]
  └── Cache Components  [Supported]

Astro (v6+)             [Supported]
  ├── Hybrid Rendering  [Supported]
  ├── Edge Functions    [Supported]
  └── Static Output     [Optimized]

SvelteKit               [Supported]
Remix                   [Supported]
Nuxt                    [Supported]
```

---

## Project Configuration

### vercel.json

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "version": 2,
  "name": "marketing-agency-monorepo",
  
  "framework": "nextjs",
  "buildCommand": "cd ../.. && turbo run build --filter=web...",
  "outputDirectory": ".next",
  "installCommand": "pnpm install",
  "devCommand": "next dev",
  
  "regions": ["iad1", "sfo1", "hnd1"],
  
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  
  "rewrites": [
    {
      "source": "/blog/:slug",
      "destination": "/api/blog-redirect?slug=:slug"
    }
  ],
  
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ],
  
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ],
  
  "crons": [
    {
      "path": "/api/cron/daily",
      "schedule": "0 0 * * *"
    }
  ],
  
  "git": {
    "deploymentEnabled": {
      "main": true,
      "staging": true,
      "feature/*": false
    }
  }
}
```

### Environment Variables

```bash
# .env.local (development only)
# Vercel CLI - Set via dashboard or CLI

# Add environment variable
vercel env add DATABASE_URL

# Add for specific environment
vercel env add API_KEY production

# Pull environment variables
vercel env pull .env.local

# List all variables
vercel env ls

# Remove variable
vercel env rm API_KEY
```

**Environment Variable Types**:

```
Production    → Only on production deployments
Preview       → Preview deployments (all non-production)
Development   → Local development (vercel dev)
```

### Project Structure for Monorepos

```
monorepo/
├── apps/
│   ├── web/                    # Next.js app
│   │   ├── app/               # App Router
│   │   ├── pages/             # Pages Router (legacy)
│   │   ├── public/            # Static assets
│   │   ├── next.config.js     # Framework config
│   │   ├── vercel.json        # Vercel-specific config
│   │   └── package.json
│   │
│   └── dashboard/              # Separate Vercel project
│       ├── app/
│       ├── next.config.js
│       └── vercel.json
│
├── packages/
│   ├── ui/                    # Shared UI components
│   ├── utils/                 # Shared utilities
│   └── types/                 # TypeScript definitions
│
└── vercel.json                # Root config (optional)
```

---

## Deployment Configuration

### Turborepo Remote Caching

```bash
# Link monorepo to Vercel Remote Cache
cd apps/web
vercel link

# Enable remote caching
turbo login
turbo link

# Verify setup
turbo run build --dry-run
```

```json
// turbo.json (root)
{
  "$schema": "https://turborepo.com/schema.json",
  "globalDependencies": [".env"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"],
      "env": [
        "DATABASE_URL",
        "API_KEY",
        "NEXT_PUBLIC_API_URL"
      ]
    }
  }
}
```

### Build Settings

```json
// apps/web/vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  
  "buildCommand": "cd ../.. && turbo run build --filter=web...",
  
  "ignoreCommand": "git diff --quiet HEAD^ HEAD -- ./apps/web ./packages",
  
  "installCommand": "pnpm install"
}
```

### Framework Presets

```json
// Automatically detected, but can be overridden
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "devCommand": "next dev"
}

// Other presets
{
  "framework": "astro",
  "buildCommand": "astro build",
  "outputDirectory": "dist",
  "devCommand": "astro dev"
}

{
  "framework": "sveltekit",
  "buildCommand": "vite build",
  "outputDirectory": ".svelte-kit/output",
  "devCommand": "vite dev"
}
```

---

## Advanced Features

### Edge Functions

```typescript
// middleware.ts (App Router)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
};

export function middleware(request: NextRequest) {
  // Edge runtime - runs globally
  const country = request.geo?.country || 'US';
  
  // Redirect based on country
  if (country === 'CN') {
    return NextResponse.redirect('https://example.cn');
  }
  
  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Country', country);
  
  return response;
}
```

### Serverless Functions

```typescript
// app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';  // or 'edge'
export const preferredRegion = 'iad1';
export const maxDuration = 30;    // seconds (Pro+)

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Process webhook
  await processWebhook(body);
  
  return NextResponse.json({ success: true });
}
```

### Cron Jobs

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 2 * * *"      // 2 AM daily
    },
    {
      "path": "/api/cron/reports",
      "schedule": "0 9 * * 1"      // 9 AM Monday
    }
  ]
}
```

```typescript
// app/api/cron/cleanup/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Run cleanup
  await cleanupOldData();
  
  return NextResponse.json({ success: true });
}
```

### Image Optimization

```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
      },
      {
        protocol: 'https',
        hostname: '**.s3.amazonaws.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

```tsx
// Usage
import Image from 'next/image';

<Image
  src="https://cdn.example.com/photo.jpg"
  alt="Description"
  width={800}
  height={600}
  priority              // Preload critical images
  placeholder="blur"    // Blur placeholder
  blurDataURL="data:image/jpeg;base64,..."
/>
```

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/deploy-vercel.yml
name: Deploy to Vercel

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
      
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      
      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Build
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy to Preview
        if: github.ref != 'refs/heads/main'
        run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy to Production
        if: github.ref == 'refs/heads/main'
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### Monorepo Strategy

```yaml
# Deploy multiple apps from monorepo
name: Deploy Monorepo

on:
  push:
    branches: [main]

jobs:
  changes:
    runs-on: ubuntu-latest
    outputs:
      web: ${{ steps.changes.outputs.web }}
      dashboard: ${{ steps.changes.outputs.dashboard }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v2
        id: changes
        with:
          filters: |
            web:
              - 'apps/web/**'
              - 'packages/ui/**'
            dashboard:
              - 'apps/dashboard/**'

  deploy-web:
    needs: changes
    if: ${{ needs.changes.outputs.web == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_WEB }}
          working-directory: ./apps/web

  deploy-dashboard:
    needs: changes
    if: ${{ needs.changes.outputs.dashboard == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_DASHBOARD }}
          working-directory: ./apps/dashboard
```

---

## Performance Optimization

### Analytics & Monitoring

```bash
# Install Vercel Analytics
npm i @vercel/analytics

# Install Speed Insights
npm i @vercel/speed-insights
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### Caching Strategy

```javascript
// next.config.js
module.exports = {
  headers: async () => [
    {
      source: '/api/revalidate',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=0, must-revalidate',
        },
      ],
    },
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Vercel-CDN-Cache-Control',
          value: 'max-age=31536000',
        },
      ],
    },
  ],
};
```

```typescript
// ISR with revalidation
export const revalidate = 3600; // 1 hour

export async function generateStaticParams() {
  const posts = await fetchPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// On-demand revalidation
export async function POST(request: Request) {
  const { tag } = await request.json();
  revalidateTag(tag);
  return Response.json({ revalidated: true });
}
```

---

## Troubleshooting

### Common Issues

**Build fails**
```bash
# Check build locally first
cd apps/web
pnpm run build

# Clear build cache
rm -rf .next
vercel --force

# Debug build
vercel --debug
```

**Environment variables not available**
```bash
# Pull latest env vars
vercel env pull .env.local

# Check Vercel dashboard
# Project Settings → Environment Variables

# Verify in build logs
# Look for "Environment variables loaded"
```

**Function timeout**
```typescript
// Increase timeout (Pro+)
export const maxDuration = 300; // 5 minutes

// Use Edge for faster cold starts
export const runtime = 'edge';
```

**Cache issues**
```bash
# Purge cache
vercel --force

# Check cache headers in browser dev tools
# Look for x-vercel-cache header
```

### Debug Commands

```bash
# Local development matching production
vercel dev

# Build locally
vercel build

# Inspect deployment
vercel inspect <deployment-url>

# View logs
vercel logs <deployment-url>

# List deployments
vercel list

# Remove deployment
vercel remove <deployment-url>
```

---

## Best Practices

### Do's

✅ **Use Preview Deployments** - Test every PR  
✅ **Enable Remote Caching** - Faster builds with Turborepo  
✅ **Set Environment Variables** - Via dashboard, not in code  
✅ **Use Edge Runtime** - For low-latency global functions  
✅ **Optimize Images** - Let Vercel handle optimization  
✅ **Monitor Analytics** - Track Core Web Vitals  
✅ **Use ISR** - Balance static/dynamic content  

### Don'ts

❌ **Commit .env files** - Use dashboard or Doppler  
❌ **Build in runtime** - Pre-build at deploy time  
❌ **Ignore build errors** - Fix before deploying  
❌ **Use long serverless functions** - Break into smaller chunks  
❌ **Skip cache headers** - Control CDN caching explicitly  

---

## Resources

### Official Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Monorepos](https://vercel.com/docs/monorepos)
- [Edge Functions](https://vercel.com/docs/functions/edge-functions)

### CLI Reference
- [Vercel CLI](https://vercel.com/docs/cli)
- [CLI Commands](https://vercel.com/docs/cli#commands)

### Integration Guides
- [GitHub Integration](https://vercel.com/docs/deployments/git/vercel-for-github)
- [GitLab Integration](https://vercel.com/docs/deployments/git/vercel-for-gitlab)
- [Bitbucket Integration](https://vercel.com/docs/deployments/git/vercel-for-bitbucket)

---

_Updated April 2026 based on Vercel documentation and platform features._
