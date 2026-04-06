# Cloudflare Pages

**Official Documentation:** https://developers.cloudflare.com/pages/  
**Latest Release:** April 2026

## Overview

Create full-stack applications that are instantly deployed to the Cloudflare global network. Deploy your Pages project by connecting to your Git provider, uploading prebuilt assets directly to Pages with Direct Upload or using C3 from the command line.

Cloudflare Pages is a JAMstack platform for frontend developers, providing the collaboration and automation features you need to build and deploy dynamic websites. Optimized for Astro, static sites, and applications using Cloudflare Workers for serverless functions.

**Source**: Based on [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/) and [Cloudflare Workers](https://developers.cloudflare.com/workers/).

---

## Platform Features

### Core Capabilities

| Feature | Description | Availability |
|---------|-------------|--------------|
| **Unlimited Bandwidth** | No egress fees | All plans |
| **Unlimited Requests** | Handle any traffic | All plans |
| **Global CDN** | 300+ locations worldwide | All plans |
| **Workers Integration** | Edge functions & APIs | All plans |
| **Git Integration** | Auto-deploy on push | All plans |
| **Preview Deployments** | Every PR gets URL | All plans |
| **Pages Functions** | Server-side code for dynamic functionality | All plans |
| **Rollbacks** | Instantly revert to previous deployment | All plans |
| **Redirects** | Custom URL routing | All plans |
| **KV Storage** | Key-value edge storage | All plans |
| **R2 Storage** | Object storage (S3-compatible) | All plans |
| **D1 Database** | SQLite at the edge | All plans |
| **Durable Objects** | Stateful coordination | Workers Paid |

### Features Deep Dive

#### Pages Functions
Use Pages Functions to deploy server-side code to enable dynamic functionality without running a dedicated server.

#### Rollbacks
Rollbacks allow you to instantly revert your project to a previous production deployment.

#### Redirects
Set up redirects for your Cloudflare Pages project to handle URL routing, domain redirects, and more.

### Framework Support

```
Astro (v6+)              [Optimized]
  ├── Static Output       [Best Performance]
  ├── Server Output       [Hybrid Rendering]
  └── Edge Functions      [Full Support]

Next.js                  [Supported via Static Export]
  ├── Static HTML Export  [Recommended]
  └── Edge Runtime        [Via Custom Worker]

SvelteKit               [Adapter Available]
Remix                   [Adapter Available]
Qwik                    [Native Support]
SolidStart              [Native Support]
Hono                    [Native Support]
```

---

## Project Configuration

### Wrangler Configuration

```toml
# wrangler.toml
name = "marketing-agency-site"
compatibility_date = "2024-04-01"
compatibility_flags = ["nodejs_compat"]

# Build settings
[build]
command = "npm run build"
cwd = "."
watch_dir = "dist"

# Environment variables
[env.production]
NODE_ENV = "production"
CF_PAGES = "1"
ANALYTICS_ID = "my-analytics-id"

[env.staging]
NODE_ENV = "staging"
DEBUG = "true"

# D1 Database binding
[[env.production.d1_databases]]
binding = "DB"
database_name = "production-db"
database_id = "your-database-id"

# KV Namespace binding
[[env.production.kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"

# R2 Bucket binding
[[env.production.r2_buckets]]
binding = "STORAGE"
bucket_name = "production-assets"

# Secrets (set via CLI, not in this file)
# wrangler secret put API_KEY
# wrangler secret put DATABASE_URL
```

### Build Configuration

```json
// package.json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "wrangler pages dev",
    "deploy": "wrangler pages deploy",
    "cf-typegen": "wrangler types"
  }
}
```

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',  // or 'hybrid' or 'static'
  adapter: cloudflare({
    mode: 'directory',  // or 'advanced'
    functionPerRoute: true,
  }),
  
  // Image optimization
  image: {
    service: {
      entrypoint: 'astro/assets/services/noop',
    },
  },
});
```

### Directory Structure

```
project/
├── functions/                # Edge functions (optional)
│   ├── api/
│   │   ├── hello.ts
│   │   └── users.ts
│   └── _middleware.ts        # Global middleware
│
├── public/                   # Static assets
│   ├── images/
│   └── fonts/
│
├── src/
│   ├── pages/               # Astro pages
│   ├── components/
│   └── layouts/
│
├── dist/                    # Build output (gitignored)
├── wrangler.toml            # Configuration
├── .wrangler/               # Local state (gitignored)
└── package.json
```

---

## Edge Functions

### Basic Function

```typescript
// functions/api/hello.ts
export interface Env {
  // Environment bindings
  DB: D1Database;
  CACHE: KVNamespace;
  STORAGE: R2Bucket;
  
  // Secrets
  API_KEY: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, params, data } = context;
  
  // Access request info
  const url = new URL(request.url);
  const method = request.method;
  
  // Access environment variables
  const apiKey = env.API_KEY;
  
  // Access KV storage
  const cached = await env.CACHE.get(`cache:${url.pathname}`);
  if (cached) {
    return new Response(cached, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // Query D1 database
  const results = await env.DB.prepare(
    'SELECT * FROM users WHERE active = ?'
  ).bind(true).all();
  
  // Return response
  const response = JSON.stringify(results);
  
  // Cache the response
  await env.CACHE.put(`cache:${url.pathname}`, response, {
    expirationTtl: 3600, // 1 hour
  });
  
  return new Response(response, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
```

### Middleware Pattern

```typescript
// functions/_middleware.ts
import { PagesFunction } from '@cloudflare/workers-types';

export const onRequest: PagesFunction = async (context) => {
  const { request, next, env } = context;
  
  // Authentication check
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Rate limiting
  const clientIP = request.headers.get('CF-Connecting-IP');
  const rateLimitKey = `rate_limit:${clientIP}`;
  const requests = await env.CACHE.get(rateLimitKey);
  
  if (requests && parseInt(requests) > 100) {
    return new Response('Rate limit exceeded', { status: 429 });
  }
  
  // Continue to next handler
  const response = await next();
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  return response;
};
```

### API Routes with Parameters

```typescript
// functions/api/users/[id].ts
interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { params, env } = context;
  const userId = params.id;
  
  const user = await env.DB.prepare(
    'SELECT id, name, email FROM users WHERE id = ?'
  ).bind(userId).first();
  
  if (!user) {
    return new Response('User not found', { status: 404 });
  }
  
  return Response.json(user);
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const { params, env, request } = context;
  const userId = params.id;
  const body = await request.json();
  
  const result = await env.DB.prepare(
    'UPDATE users SET name = ?, email = ? WHERE id = ? RETURNING *'
  ).bind(body.name, body.email, userId).first();
  
  return Response.json(result);
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { params, env } = context;
  const userId = params.id;
  
  await env.DB.prepare('DELETE FROM users WHERE id = ?')
    .bind(userId).run();
  
  return new Response(null, { status: 204 });
};
```

### CORS and Security Headers

```typescript
// functions/_headers.ts (or in middleware)
export const onRequest: PagesFunction = async (context) => {
  const response = await context.next();
  
  // CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Security headers
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'");
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  return response;
};
```

---

## Database Integration

### D1 Database (SQLite at Edge)

```typescript
// lib/db.ts
import { D1Database } from '@cloudflare/workers-types';

export class Database {
  constructor(private db: D1Database) {}
  
  async getUsers(): Promise<User[]> {
    const { results } = await this.db.prepare(
      'SELECT * FROM users ORDER BY created_at DESC'
    ).all();
    return results as User[];
  }
  
  async getUser(id: string): Promise<User | null> {
    return await this.db.prepare(
      'SELECT * FROM users WHERE id = ?'
    ).bind(id).first();
  }
  
  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const result = await this.db.prepare(
      'INSERT INTO users (name, email) VALUES (?, ?) RETURNING *'
    ).bind(user.name, user.email).first();
    return result as User;
  }
  
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const setClause = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const result = await this.db.prepare(
      `UPDATE users SET ${setClause} WHERE id = ? RETURNING *`
    ).bind(...Object.values(updates), id).first();
    
    return result as User;
  }
}

// Usage in function
export const onRequest: PagesFunction<{ DB: D1Database }> = async (context) => {
  const db = new Database(context.env.DB);
  const users = await db.getUsers();
  return Response.json(users);
};
```

### Schema Management

```sql
-- schema.sql
-- Run via: wrangler d1 execute DB --file=./schema.sql

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  title TEXT NOT NULL,
  content TEXT,
  author_id TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);

-- Triggers for updated_at
CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
AFTER UPDATE ON users
BEGIN
  UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
```

### KV Storage (Caching)

```typescript
// lib/cache.ts
import { KVNamespace } from '@cloudflare/workers-types';

export class Cache {
  constructor(private kv: KVNamespace) {}
  
  async get<T>(key: string): Promise<T | null> {
    const value = await this.kv.get(key);
    return value ? JSON.parse(value) : null;
  }
  
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await this.kv.put(key, serialized, { expirationTtl: ttl });
    } else {
      await this.kv.put(key, serialized);
    }
  }
  
  async delete(key: string): Promise<void> {
    await this.kv.delete(key);
  }
  
  async getWithMetadata<T>(key: string): Promise<{ value: T; metadata: any } | null> {
    const result = await this.kv.getWithMetadata(key);
    if (!result.value) return null;
    return {
      value: JSON.parse(result.value),
      metadata: result.metadata,
    };
  }
}

// Usage
export const onRequest: PagesFunction<{ CACHE: KVNamespace }> = async (context) => {
  const cache = new Cache(context.env.CACHE);
  const cacheKey = `page:${context.request.url}`;
  
  // Try cache first
  const cached = await cache.get<string>(cacheKey);
  if (cached) {
    return new Response(cached, {
      headers: { 'Content-Type': 'text/html' },
    });
  }
  
  // Generate page
  const page = await renderPage(context);
  
  // Cache for 1 hour
  await cache.set(cacheKey, page, 3600);
  
  return new Response(page, {
    headers: { 'Content-Type': 'text/html' },
  });
};
```

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/deploy-cloudflare.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Build
        run: npm run build
        env:
          NODE_ENV: production
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=marketing-agency
        
      - name: Comment PR with Preview URL
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🚀 Preview deployed to Cloudflare Pages'
            })
```

### Wrangler CLI Commands

```bash
# Install Wrangler
npm install -g wrangler

# Authenticate
wrangler login

# Local development
wrangler pages dev

# Build and preview locally
npm run build
wrangler pages dev dist

# Deploy
wrangler pages deploy dist

# Deploy specific branch
wrangler pages deploy dist --branch=feature/new-page

# View deployment logs
wrangler pages deployment-tail

# Manage secrets
wrangler secret put API_KEY
wrangler secret put DATABASE_URL

# D1 database operations
wrangler d1 create my-database
wrangler d1 execute DB --file=./schema.sql
wrangler d1 migrations list DB

# KV operations
wrangler kv:namespace create "CACHE"
wrangler kv:key put --namespace-id=xxx "key" "value"
```

---

## Performance Optimization

### Caching Strategy

```typescript
// functions/_middleware.ts
export const onRequest: PagesFunction<{ CACHE: KVNamespace }> = async (context) => {
  const url = new URL(context.request.url);
  const cacheKey = `page:${url.pathname}`;
  
  // Check KV cache
  const cached = await context.env.CACHE.get(cacheKey);
  if (cached) {
    return new Response(cached, {
      headers: {
        'Content-Type': 'text/html',
        'CF-Cache-Status': 'HIT',
      },
    });
  }
  
  // Fetch and cache
  const response = await context.next();
  const body = await response.text();
  
  // Cache for 5 minutes (dynamic content)
  await context.env.CACHE.put(cacheKey, body, { expirationTtl: 300 });
  
  return new Response(body, {
    headers: {
      ...Object.fromEntries(response.headers),
      'CF-Cache-Status': 'MISS',
    },
  });
};
```

### Asset Optimization

```javascript
// astro.config.mjs
export default defineConfig({
  build: {
    assets: '_assets',
  },
  
  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom'],
          },
        },
      },
    },
  },
  
  // Image optimization via Cloudflare Image Resizing
  image: {
    service: {
      entrypoint: 'astro/assets/services/noop',
    },
  },
});
```

### Web Analytics

```html
<!-- Add to head -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' 
  data-cf-beacon='{"token": "your-analytics-token"}'>
</script>
```

---

## Security

### Access Control

```typescript
// functions/admin/_middleware.ts
export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;
  
  // Check admin API key
  const apiKey = request.headers.get('X-Admin-Key');
  if (apiKey !== env.ADMIN_API_KEY) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Check IP whitelist
  const clientIP = request.headers.get('CF-Connecting-IP');
  const allowedIPs = env.ALLOWED_IPS?.split(',') || [];
  
  if (allowedIPs.length > 0 && !allowedIPs.includes(clientIP)) {
    return new Response('Forbidden', { status: 403 });
  }
  
  return context.next();
};
```

### Security Headers

```toml
# wrangler.toml
[headers]
  # Apply to all routes
  for = "/*"
  
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
```

---

## Best Practices

### Do's

✅ **Use Edge Functions for APIs** - Low latency globally  
✅ **Cache aggressively** - KV for dynamic, CDN for static  
✅ **Use D1 for relational data** - Perfect for content sites  
✅ **Set proper cache headers** - Control CDN behavior  
✅ **Optimize images** - Use Cloudflare Image Resizing  
✅ **Monitor analytics** - Built-in Web Analytics  
✅ **Use preview deployments** - Test every change  

### Don'ts

❌ **Don't store secrets in code** - Use wrangler secrets  
❌ **Don't forget rate limiting** - Protect your functions  
❌ **Don't ignore cold starts** - Minimize function size  
❌ **Don't use long-running functions** - Max 50s (Workers Paid)  
❌ **Don't skip error handling** - Functions can fail  

---

## Troubleshooting

### Common Issues

**Build fails**
```bash
# Check Node version
node --version  # Should be 18+

# Clear and rebuild
rm -rf dist node_modules
npm install
npm run build
```

**Function timeout**
```typescript
// Reduce complexity
export const onRequest: PagesFunction = async (context) => {
  // Offload heavy work to background (Queues)
  await context.env.QUEUE.send({ task: 'heavy-job', data: payload });
  
  return Response.json({ accepted: true });
};
```

**KV not working locally**
```bash
# Use local KV
wrangler pages dev --kv=CACHE

# Or use remote KV
wrangler pages dev --kv=CACHE --remote
```

**D1 connection issues**
```bash
# Verify database exists
wrangler d1 list

# Check bindings in wrangler.toml
wrangler pages dev --d1=DB
```

### Debug Commands

```bash
# View logs
wrangler pages deployment-tail

# Check bindings
wrangler pages functions build

# Validate wrangler.toml
wrangler config validate

# Test function locally
wrangler pages dev --compatibility-date=2024-04-01
```

---

## Resources

### Official Documentation
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [D1 Database](https://developers.cloudflare.com/d1/)
- [KV Storage](https://developers.cloudflare.com/kv/)
- [R2 Storage](https://developers.cloudflare.com/r2/)

### Framework Adapters
- [Astro Cloudflare Adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [SvelteKit Adapter](https://kit.svelte.dev/docs/adapter-cloudflare)

### Tools
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Dashboard](https://dash.cloudflare.com)
- [Workers Playground](https://workers.cloudflare.com/playground)

---

_Updated April 2026 based on Cloudflare Pages and Workers documentation._
