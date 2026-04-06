# Next.js Documentation

**Repository Version:** ^16.2.2  
**Official Documentation:** https://nextjs.org/docs  
**Latest Release:** April 2, 2026

## Overview

Next.js is a React framework for building full-stack web applications. You use React Components to build user interfaces, and Next.js for additional features and optimizations. It also automatically configures lower-level tools like bundlers and compilers, allowing you to focus on building your product and shipping quickly.

Whether you're an individual developer or part of a larger team, Next.js can help you build interactive, dynamic, and fast React applications.

## Documentation Structure

The Next.js documentation is organized into 3 main sections:

- **[Getting Started](https://nextjs.org/docs/app/getting-started)**: Step-by-step tutorials to help you create a new application and learn the core Next.js features
- **[Guides](https://nextjs.org/docs/app/guides)**: Tutorials on specific use cases, choose what's relevant to you
- **[API Reference](https://nextjs.org/docs/app/api-reference)**: Detailed technical reference for every feature

Use the sidebar to navigate through the sections, or search (Ctrl+K or Cmd+K) to quickly find a page.

## App Router vs Pages Router

Next.js has two different routers:

- **App Router**: The newer router that supports new React features like Server Components, Suspense, and Server Functions. This is the recommended approach for new applications.
- **Pages Router**: The original router, still supported and being improved. Use this for existing applications or specific use cases.

At the top of the Next.js documentation sidebar, you'll notice a dropdown menu that allows you to switch between the App Router and the Pages Router docs.

## Key Features for This Repository

### App Router (Primary)
- **Server Components by default**: Fetch data and render UI on the server with optional caching
- **Improved performance and SEO**: Better First Contentful Paint (FCP) and streaming
- **Built-in data fetching patterns**: Direct database access and API calls in components
- **Layouts and nested routing**: Shared UI with state preservation across navigation
- **File-system based routing**: Intuitive routing based on folder structure

### Modern Features (Next.js 16.2.2)
- **Cache Components**: New "use cache" directive for explicit, flexible caching
- **Next.js DevTools MCP**: AI-assisted debugging with contextual insights
- **proxy.ts**: Replaces middleware.ts with explicit network boundary
- **React Compiler support**: Stable automatic memoization (v1.0)
- **Turbopack (stable)**: 2-5× faster production builds, 10× faster Fast Refresh
- **File System Caching**: Persistent compiler artifacts for faster restarts
- **Enhanced logging**: Detailed build timing and request analysis
- **Partial Prerendering (PPR)**: Eliminates static vs dynamic dichotomy

## Installation and Setup

### System Requirements

Before you begin, make sure your development environment meets the following requirements:
- **Minimum Node.js version**: 20.9 or higher
- **Operating systems**: macOS, Windows (including WSL), and Linux
- **Package managers**: npm, yarn, pnpm, or bun

### Supported Browsers

Next.js supports modern browsers with zero configuration:
- Chrome 111+
- Edge 111+
- Firefox 111+
- Safari 16.4+

Learn more about [browser support](https://nextjs.org/docs/architecture/supported-browsers), including how to configure polyfills and target specific browsers.

### Quick Start

The quickest way to create a new Next.js app is using `create-next-app`, which sets up everything automatically for you.

```bash
# Create a new Next.js app
pnpm create next-app@latest my-app

# Navigate to the directory
cd my-app

# Start the development server
pnpm dev
```

Visit `http://localhost:3000` to see your application.

#### Installation Prompts

On installation, you'll see the following prompts:

```text
What is your project named? my-app
Would you like to use the recommended Next.js defaults?
✔ Yes, use recommended defaults - TypeScript, ESLint, Tailwind CSS, App Router, AGENTS.md
✔ No, reuse previous settings
✔ No, customize settings - Choose your own preferences
```

If you choose to customize settings, you'll see these prompts:

```text
Would you like to use TypeScript? No / Yes
Which linter would you like to use? ESLint / Biome / None
Would you like to use React Compiler? No / Yes
Would you like to use Tailwind CSS? No / Yes
Would you like your code inside a `src/` directory? No / Yes
Would you like to use App Router? (recommended) No / Yes
Would you like to customize the import alias (`@/*` by default)? No / Yes
What import alias would you like configured? @/*
Would you like to include AGENTS.md to guide coding agents to write up-to-date Next.js code? No / Yes
```

### Recommended Defaults

The default setup includes:
- **TypeScript**: For type safety and better developer experience
- **ESLint**: For code quality and consistency
- **Tailwind CSS**: For utility-first styling
- **App Router**: Modern routing pattern with Server Components
- **Turbopack**: Faster bundler for development and production
- **Import alias `@/*`**: For clean import paths
- **AGENTS.md**: Documentation to guide coding agents

### Manual Installation

If you prefer to set up your project manually:

1. **Create the app directory**

```bash
mkdir my-app
cd my-app
npm init -y
```

2. **Install dependencies**

```bash
npm install next@latest react@latest react-dom@latest
npm install -D typescript @types/node @types/react @types/react-dom
```

3. **Create the app directory structure**

```text
my-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/
├── next.config.js
├── package.json
└── tsconfig.json
```

4. **Add scripts to package.json**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

5. **Run the development server**

```bash
npm run dev
```

## Core Concepts

### 1. App Router Structure

#### File-based Routing

```text
app/
├── layout.tsx          # Root layout
├── page.tsx           # Home page
├── globals.css        # Global styles
├── clients/
│   ├── layout.tsx     # Clients section layout
│   ├── page.tsx       # Clients index
│   ├── [slug]/
│   │   └── page.tsx   # Dynamic client page
│   └── new/
│       └── page.tsx   # New client form
├── api/
│   ├── clients/
│   │   ├── route.ts   # /api/clients
│   │   └── [id]/
│   │       └── route.ts # /api/clients/[id]
│   └── auth/
│       └── route.ts   # /api/auth
└── (dashboard)/       # Route groups
    ├── layout.tsx
    └── analytics/
        └── page.tsx
```

#### Root Layout
```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Marketing Agency',
  description: 'Building digital experiences for modern brands',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="main-nav">
          <a href="/">Home</a>
          <a href="/clients">Clients</a>
          <a href="/dashboard">Dashboard</a>
        </nav>
        <main>{children}</main>
        <footer>
          <p>&copy; 2026 Marketing Agency</p>
        </footer>
      </body>
    </html>
  );
}
```

#### Page Components
```typescript
// app/clients/page.tsx
import { Suspense } from 'react';
import ClientList from '@/components/ClientList';
import ClientListSkeleton from '@/components/ClientListSkeleton';
import { getClients } from '@/lib/clients';

export default async function ClientsPage() {
  return (
    <div className="clients-page">
      <h1>Our Clients</h1>
      <p>Partnering with amazing brands to create exceptional experiences.</p>
      
      <Suspense fallback={<ClientListSkeleton />}>
        <ClientList />
      </Suspense>
    </div>
  );
}

// Server-side data fetching
async function ClientList() {
  const clients = await getClients();
  
  return (
    <div className="client-grid">
      {clients.map((client) => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  );
}
```

### When to use Server and Client Components?

**Use Client Components when you need:**
- State and event handlers (e.g., `onClick`, `onChange`)
- Lifecycle logic (e.g., `useEffect`)
- Browser-only APIs (e.g., `localStorage`, `window`, `Navigator.geolocation`)
- Custom hooks

**Use Server Components when you need:**
- Fetch data from databases or APIs close to the source
- Use API keys, tokens, and other secrets without exposing them to the client
- Reduce the amount of JavaScript sent to the browser
- Improve First Contentful Paint (FCP) and stream content progressively

#### Example: Server and Client Component Composition

```typescript
// app/posts/[id]/page.tsx - Server Component
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'

export default async function Page({ 
  params, 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const post = await getPost(id)
  
  return (
    <div>
      <main>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
        <LikeButton likes={post.likes} />
      </main>
    </div>
  )
}

// app/ui/like-button.tsx - Client Component
'use client'

import { useState } from 'react'

export default function LikeButton({ likes }: { likes: number }) {
  const [likesCount, setLikesCount] = useState(likes)
  
  return (
    <button onClick={() => setLikesCount(likesCount + 1)}>
      Likes: {likesCount}
    </button>
  )
}
```

### 2. Dynamic Routes

#### Dynamic Segments
```typescript
// app/clients/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getClientBySlug } from '@/lib/clients';
import ClientDetail from '@/components/ClientDetail';

interface Props {
  params: { slug: string };
}

export default async function ClientPage({ params }: Props) {
  const client = await getClientBySlug(params.slug);
  
  if (!client) {
    notFound();
  }

  return <ClientDetail client={client} />;
}

// Generate static params for static generation
export async function generateStaticParams() {
  const clients = await getClients();
  
  return clients.map((client) => ({
    slug: client.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props) {
  const client = await getClientBySlug(params.slug);
  
  return {
    title: client?.name || 'Client Not Found',
    description: client?.description || 'Client details',
  };
}
```

### 3. API Routes

#### Route Handlers
```typescript
// app/api/clients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getClients, createClient } from '@/lib/clients';
import { z } from 'zod';

const createClientSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  website: z.string().url(),
  featured: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get('featured') === 'true';
  
  try {
    const clients = await getClients({ featured });
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createClientSchema.parse(body);
    
    const client = await createClient(validatedData);
    
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}
```

#### Dynamic API Routes
```typescript
// app/api/clients/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getClientById, updateClient, deleteClient } from '@/lib/clients';

interface Props {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const client = await getClientById(params.id);
    
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch client' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const updates = await request.json();
    const client = await updateClient(params.id, updates);
    
    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    await deleteClient(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}
```

### 4. Data Fetching Patterns

#### Server Components with Caching
```typescript
// app/dashboard/analytics/page.tsx
import { unstable_cache } from 'next/cache';
import AnalyticsChart from '@/components/AnalyticsChart';

// Cache expensive data fetching
const getAnalyticsData = unstable_cache(
  async () => {
    // Expensive analytics computation
    const data = await computeAnalytics();
    return data;
  },
  ['analytics-data'],
  {
    revalidate: 3600, // 1 hour
    tags: ['analytics'],
  }
);

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();
  
  return (
    <div>
      <h1>Analytics Dashboard</h1>
      <AnalyticsChart data={data} />
    </div>
  );
}
```

#### Client Components with Data Fetching
```typescript
// components/ClientSearch.tsx
'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export default function ClientSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  useEffect(() => {
    if (debouncedSearch) {
      setLoading(true);
      fetch(`/api/clients/search?q=${encodeURIComponent(debouncedSearch)}`)
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Search error:', error);
          setLoading(false);
        });
    } else {
      setResults([]);
    }
  }, [debouncedSearch]);
  
  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search clients..."
        className="search-input"
      />
      
      {loading && <p>Searching...</p>}
      
      <ul className="search-results">
        {results.map((client) => (
          <li key={client.id}>
            <a href={`/clients/${client.slug}`}>
              {client.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 5. Forms and Actions

#### Server Actions
```typescript
// app/actions/clients.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const createClientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  website: z.string().url('Invalid website URL'),
  featured: z.boolean().default(false),
});

export async function createClientAction(formData: FormData) {
  const validatedFields = createClientSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    website: formData.get('website'),
    featured: formData.get('featured') === 'on',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const client = await createClient(validatedFields.data);
    
    // Revalidate the clients page to show the new client
    revalidatePath('/clients');
    
    // Redirect to the new client page
    redirect(`/clients/${client.slug}`);
  } catch (error) {
    return {
      error: 'Failed to create client. Please try again.',
    };
  }
}
```

#### Form Component
```typescript
// components/ClientForm.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createClientAction } from '@/app/actions/clients';

const initialState = {
  errors: {},
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Client'}
    </button>
  );
}

export default function ClientForm() {
  const [state, formAction] = useFormState(createClientAction, initialState);
  
  return (
    <form action={formAction} className="client-form">
      <div>
        <label htmlFor="name">Client Name</label>
        <input type="text" id="name" name="name" required />
        {state.errors.name && (
          <p className="error">{state.errors.name[0]}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={4} />
        {state.errors.description && (
          <p className="error">{state.errors.description[0]}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="website">Website</label>
        <input type="url" id="website" name="website" required />
        {state.errors.website && (
          <p className="error">{state.errors.website[0]}</p>
        )}
      </div>
      
      <div>
        <label>
          <input type="checkbox" name="featured" />
          Featured Client
        </label>
      </div>
      
      {state.error && (
        <p className="error">{state.error}</p>
      )}
      
      <SubmitButton />
    </form>
  );
}
```

### 6. proxy.ts (Middleware Replacement)

#### proxy.ts Configuration

**What changed:**
- `middleware.ts` → `proxy.ts`
- Exported function renamed from `middleware` → `proxy`
- Runs on Node.js runtime (explicit network boundary)
- Logic remains the same

**Why:**
- Clearer naming and single, predictable runtime
- Explicit network boundary definition

#### Example proxy.ts

```typescript
// proxy.ts
import { NextRequest, NextResponse } from 'next/server'

export default function proxy(request: NextRequest) {
  // Check for authentication
  const isAuthenticated = request.cookies.get('auth-token')?.value
  
  if (request.nextUrl.pathname.startsWith('/dashboard') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Add security headers
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/admin/:path*'],
}
```

**Note:** `middleware.ts` is still available for Edge runtime use cases but is deprecated and will be removed in a future version.

### 7. Error Handling

#### Error Pages
```typescript
// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="error-page">
      <h1>Page Not Found</h1>
      <p>Sorry, we couldn't find the page you're looking for.</p>
      <Link href="/" className="home-link">
        Go back home
      </Link>
    </div>
  );
}
```

```typescript
// app/error.tsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="error-page">
      <h2>Something went wrong!</h2>
      <p>We encountered an unexpected error.</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## Advanced Features

### 1. Cache Components (Next.js 16)

#### Overview

Cache Components are a new set of features designed to make caching in Next.js both more explicit and more flexible. They center around the new "use cache" directive, which can be used to cache pages, components, and functions, and which leverages the compiler to automatically generate cache keys wherever it's used.

Unlike the implicit caching found in previous versions of the App Router, caching with Cache Components is entirely opt-in. All dynamic code in any page, layout, or API route is executed at request time by default, giving Next.js an out-of-the-box experience that's better aligned with what developers expect from a full-stack application framework.

Cache Components also complete the story of Partial Prerendering (PPR), which was first introduced in 2023. Prior to PPR, Next.js had to choose whether to render each URL statically or dynamically; there was no middle ground. PPR eliminated this dichotomy, and let developers opt portions of their static pages into dynamic rendering (via Suspense) without sacrificing the fast initial load of fully static pages.

#### Enabling Cache Components

To enable Cache Components in your application, add the `cacheComponents` flag to your `next.config.ts` file:

```typescript
// next.config.ts
const nextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

#### "use cache" Directive

The `use cache` directive allows you to mark a route, React component, or a function as cacheable. It can be used at the top of a file to indicate that all exports in the file should be cached, or inline at the top of function or component to cache the return value.

**Good to know:**

- To use cookies or headers, read them outside cached scopes and pass values as arguments. This is the preferred pattern.
- If the in-memory cache isn't sufficient for runtime data, `use cache: remote` allows platforms to provide a dedicated cache handler, though it requires a network roundtrip to check the cache and typically incurs platform fees.
- For compliance requirements or when you can't refactor to pass runtime data as arguments to a use cache scope, see `use cache: private`.

#### Usage Examples

**Page-level caching:**

```typescript
// app/page.tsx
"use cache"

export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  return <div>{data}</div>
}
```

**Component-level caching:**

```typescript
// components/CachedComponent.tsx
function CachedComponent({ id }: { id: string }) {
  "use cache"
  
  const data = await getData(id)
  return <div>{data}</div>
}
```

**Function-level caching:**

```typescript
// lib/cache.ts
async function getCachedData(id: string) {
  "use cache"
  
  const data = await fetchData(id)
  return data
}
```

**File-level caching:**

```typescript
// app/api/data/route.ts
"use cache"

export async function GET() {
  const data = await fetchData()
  return NextResponse.json(data)
}
```

#### How "use cache" Works

**Cache Keys:**

The compiler automatically generates cache keys based on:
- File location
- Function/component name
- Arguments passed to the function
- Code content hash

**Serialization:**

Arguments and return values use different serialization systems:

**Supported types:**
- Primitive values (string, number, boolean, null, undefined)
- Plain objects and arrays
- Built-in types (Date, RegExp, URL, etc.)
- React Server Components

**Unsupported types:**
- Functions and classes
- Symbols
- WeakMap/WeakSet

**Pass-through (non-serializable arguments):**
If you need to pass non-serializable data, read it outside the cached scope and pass serializable values as arguments.

#### Constraints

**Request-time APIs:**
Cannot use request-time APIs inside cached scopes:
- `cookies()`, `headers()`, `params`
- `searchParams`

**Runtime caching considerations:**
- Cache is isolated per request
- Shared across concurrent requests
- Memory-based by default

**React.cache isolation:**
Cache scopes are isolated from React.cache for better control.

#### Revalidation

**Customizing cache lifetime:**

```typescript
// Configure cache lifetime
"use cache" with { lifetime: 3600 } // 1 hour
```

**On-demand revalidation:**

```typescript
import { revalidateTag } from 'next/cache'

// Revalidate specific cache
revalidateTag('cache-key')
```

#### Key Benefits

- **Explicit caching**: Unlike implicit caching in previous versions, caching is entirely opt-in
- **Automatic cache key generation**: Compiler automatically generates cache keys
- **Better alignment with full-stack expectations**: Dynamic code executes at request time by default
- **Completes Partial Prerendering (PPR)**: Eliminates static vs dynamic dichotomy
- **Better performance**: Optimized for runtime data fetching scenarios
- **Simplified mental model**: Clear separation between cached and dynamic code

### 2. Next.js DevTools MCP

#### AI-Assisted Debugging

Next.js 16 introduces Next.js DevTools MCP, a Model Context Protocol integration for AI-assisted debugging with contextual insight into your application.

#### Features for AI Agents

- **Next.js knowledge**: Routing, caching, and rendering behavior
- **Unified logs**: Browser and server logs without switching contexts
- **Automatic error access**: Detailed stack traces without manual copying
- **Page awareness**: Contextual understanding of the active route

This enables AI agents to diagnose issues, explain behavior, and suggest fixes directly within your development workflow.

#### Integration

The MCP integration happens automatically when using Next.js 16 with supported AI agents. AI agents can access contextual debugging information through the MCP protocol without additional configuration.

#### Usage

```typescript
// MCP configuration happens automatically
// AI agents can access contextual debugging information
// through the MCP protocol
```

Learn more in the documentation [here](https://nextjs.org/docs/app/guides/mcp).

### 3. proxy.ts (Middleware Replacement)

#### Overview

`proxy.ts` replaces `middleware.ts` and makes the app's network boundary explicit. `proxy.ts` runs on the Node.js runtime, providing clearer naming and a single, predictable runtime for request interception.

#### Migration Guide

**What to do:**
- Rename `middleware.ts` → `proxy.ts`
- Rename the exported function from `middleware` → `proxy`
- Logic stays the same

**Why:**
- Clearer naming and single, predictable runtime
- Explicit network boundary definition

#### Example proxy.ts

```typescript
// proxy.ts
import { NextRequest, NextResponse } from 'next/server'

export default function proxy(request: NextRequest) {
  // Check for authentication
  const isAuthenticated = request.cookies.get('auth-token')?.value
  
  if (request.nextUrl.pathname.startsWith('/dashboard') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Add security headers
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/admin/:path*'],
}
```

#### Configuration

```typescript
// proxy.ts configuration
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

**Note:** The `middleware.ts` file is still available for Edge runtime use cases, but it is deprecated and will be removed in a future version.

Learn more in the documentation [here](https://nextjs.org/docs/app/getting-started/proxy).

### 4. Turbopack (Stable)

#### Overview

Turbopack has reached stability for both development and production builds, and is now the default bundler for all new Next.js projects.

#### Performance Gains

- **2-5× faster production builds**
- **Up to 10× faster Fast Refresh**
- **More than 50% of development sessions** running on Turbopack
- **20% of production builds** on Next.js 15.3+ using Turbopack

#### Using Turbopack

Turbopack is now the default for all new Next.js applications. For existing applications, you can enable it with:

```bash
# Development with Turbopack (default)
next dev

# Production build with Turbopack (default)
next build
```

#### Using Webpack (if needed)

If you need to use Webpack for specific reasons:

```bash
# Development with webpack
next dev --webpack

# Production build with webpack
next build --webpack
```

### 5. Turbopack File System Caching (Beta)

#### Overview

Turbopack now supports filesystem caching in development, storing compiler artifacts on disk between runs for significantly faster compile times across restarts.

#### Configuration

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
}

export default nextConfig
```

#### Benefits

- **Faster restarts**: Especially beneficial for large projects
- **Improved developer productivity**: Notable improvements across large repositories
- **Production-tested**: All internal Vercel apps using this feature

#### Cache Location

The cache is stored in `.next/cache/turbopack` by default. You can clear it with:

```bash
rm -rf .next/cache/turbopack
```

### 6. React Compiler Support (Stable)

#### Overview

Built-in support for the React Compiler is now stable in Next.js 16 following the React Compiler's 1.0 release. The React Compiler automatically memoizes components, reducing unnecessary re-renders with zero manual code changes.

#### Configuration

```typescript
// next.config.ts
const nextConfig = {
  reactCompiler: true,
}

export default nextConfig
```

#### Installation

```bash
npm install babel-plugin-react-compiler@latest
```

#### Important Notes

- **Not enabled by default**: Still gathering build performance data
- **Higher compile times**: React Compiler relies on Babel
- **Zero manual changes**: Automatic memoization without code modifications
- **Best for large applications**: More beneficial for complex component trees

#### Usage

Once enabled, the React Compiler automatically optimizes your components:

```typescript
// No changes needed - React Compiler handles this automatically
function MyComponent({ data, onClick }) {
  return (
    <div>
      <h1>{data.title}</h1>
      <button onClick={onClick}>Click me</button>
    </div>
  )
}
```

### 7. Enhanced Logging

#### Development Request Logs

In Next.js 16, development request logs are extended showing where time is spent:

- **Compile**: Routing and compilation
- **Render**: Running your code and React rendering

#### Build Timing

The build process now shows detailed timing for each step:

```bash
▲ Next.js 16 (Turbopack)
✓ Compiled successfully in 615ms
✓ Finished TypeScript in 1114ms
✓ Collecting page data in 208ms
✓ Generating static pages in 239ms
✓ Finalizing page optimization in 5ms
```

#### Request Timing Details

During development, you'll see detailed timing information:

```bash
GET /clients 200 in 45ms (Compile: 12ms, Render: 33ms)
GET /api/clients 200 in 123ms (Compile: 8ms, Render: 115ms)
```

This helps identify performance bottlenecks during development.

### 8. Build Adapters API (Alpha)

#### Overview

Following the Build Adapters RFC, the first alpha version of the Build Adapters API allows custom adapters that hook into the build process.

#### Configuration

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    adapterPath: require.resolve('./my-adapter.js'),
  },
}

module.exports = nextConfig
```

#### Use Cases

- **Deployment platforms**: Custom platform integrations
- **Build output processing**: Modify Next.js build output
- **Custom configuration**: Platform-specific build modifications

#### Example Adapter

```javascript
// my-adapter.js
module.exports = function MyAdapter(options) {
  return {
    name: 'My Custom Adapter',
    async build(buildContext) {
      // Custom build logic
      console.log('Custom adapter building...')
      
      // Modify build output
      buildContext.addOutput('custom-file.txt', 'Hello from adapter')
    },
    async dev(devContext) {
      // Custom development logic
      console.log('Custom adapter in dev mode...')
    },
  }
}
```

### 9. Simplified create-next-app

#### Updated Project Structure

create-next-app has been redesigned with:

- **Simplified setup flow**: Streamlined initialization process
- **Updated project structure**: Modern organization patterns
- **Improved defaults**: Better out-of-the-box experience

#### New Template Features

- **App Router by default**: Modern routing pattern
- **TypeScript-first configuration**: Strong typing from start
- **Tailwind CSS**: Utility-first styling
- **ESLint**: Code quality and consistency
- **React Compiler option**: Automatic optimization
- **AGENTS.md**: Documentation for AI coding agents

#### Quick Setup with All Defaults

```bash
# Create app with all recommended defaults
pnpm create next-app@latest my-app --yes
```

This automatically enables:
- TypeScript
- ESLint
- Tailwind CSS
- App Router
- React Compiler (prompt)
- AGENTS.md for AI agents

## Legacy Advanced Features

### 10. Caching Strategies (Previous Model)

> **Note**: This section applies when not using Cache Components (the new default in Next.js 16).

#### Route-level Caching
```typescript
// app/api/analytics/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json(getAnalyticsData());
  
  // Cache for 5 minutes
  response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  
  return response;
}
```

#### Data Caching with Tags
```typescript
// lib/cache.ts
import { cache } from 'react';

export const getClients = cache(async (options?: { featured?: boolean }) => {
  const response = await fetch(`${process.env.API_URL}/clients`, {
    next: {
      tags: ['clients'],
      revalidate: 3600, // 1 hour
    },
  });
  
  const clients = await response.json();
  
  if (options?.featured) {
    return clients.filter((client: Client) => client.featured);
  }
  
  return clients;
});

// Revalidate cache
export async function revalidateClients() {
  revalidateTag('clients');
}
```

### 10. Internationalization

#### i18n Setup
```typescript
// app/[lang]/layout.tsx
import { notFound } from 'next/navigation';
import { dictionaries } from '@/dictionaries';

interface Props {
  children: React.ReactNode;
  params: { lang: string };
}

export default async function LocaleLayout({
  children,
  params: { lang },
}: Props) {
  const dictionary = await dictionaries[lang];
  
  if (!dictionary) {
    notFound();
  }

  return (
    <html lang={lang}>
      <body>
        <IntlProvider messages={dictionary} locale={lang}>
          {children}
        </IntlProvider>
      </body>
    </html>
  );
}
```

### 11. Performance Optimization

#### Image Optimization
```typescript
// components/OptimizedImage.tsx
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width || 800}
      height={height || 600}
      priority={priority}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
```

#### Bundle Analysis
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@agency/ui-components', 'lucide-react'],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Bundle analyzer for production builds
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
```

## Configuration

### next.config.js (Next.js 16)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cache Components (Next.js 16)
  cacheComponents: true,
  
  // React Compiler (stable)
  reactCompiler: true,
  
  // App Router configuration
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
    optimizePackageImports: ['@agency/ui-components', 'lucide-react'],
    turbopackFileSystemCacheForDev: true, // File system caching
    adapterPath: require.resolve('./my-adapter.js'), // Build adapters
  },
  
  // Image optimization
  images: {
    domains: ['cdn.example.com', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ];
  },
  
  // Rewrites
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://external-api.com/:path*',
      },
    ];
  },
  
  // Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  
  // Webpack configuration (fallback from Turbopack)
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
{
  "name": "my-next-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "dependencies": {
    "next": "^16.2.2",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.9.0",
    "eslint": "^9.23.0",
    "eslint-config-next": "^16.2.2",
    "prettier": "^3.5.0"
  }
}

## Best Practices

### 1. Performance

- Use Server Components by default
- Implement proper caching strategies with Cache Components
- Optimize images and fonts
- Use code splitting for large applications
- Leverage Turbopack for faster builds
- Enable file system caching for development
- Monitor Core Web Vitals

### 2. SEO

- Implement proper metadata with generateMetadata
- Use semantic HTML
- Create XML sitemaps
- Implement structured data
- Optimize Core Web Vitals
- Use proper heading hierarchy
- Add alt text to images

### 3. Security

- Validate all inputs with Zod schemas
- Use HTTPS
- Implement proper authentication
- Set security headers in proxy.ts
- Use environment variables for secrets
- Sanitize user input
- Implement CSRF protection
- Use Content Security Policy

### 4. Developer Experience

- Use TypeScript throughout with strict mode
- Implement proper error handling
- Create reusable components
- Use proper file organization
- Leverage Next.js DevTools MCP for debugging
- Use React Compiler for automatic optimization
- Set up proper linting and formatting
- Write comprehensive tests

### 5. Next.js 16 Specific

- Enable Cache Components for explicit caching
- Use proxy.ts instead of middleware.ts
- Configure React Compiler for automatic memoization
- Use Turbopack for better performance
- Enable file system caching for faster restarts
- Leverage AI-assisted debugging with MCP
- Use the new create-next-app defaults

## Migration Guide

### From Next.js 15 to 16

#### Required Changes

1. **Update dependencies**:
```bash
npm install next@16 react@19 react-dom@19
```

2. **Enable Cache Components** (optional but recommended):
```typescript
// next.config.ts
const nextConfig = {
  cacheComponents: true,
}
```

3. **Migrate middleware.ts to proxy.ts**:
```bash
mv middleware.ts proxy.ts
# Update the exported function name from 'middleware' to 'proxy'
```

#### Optional Changes

1. **Enable React Compiler**:
```bash
npm install babel-plugin-react-compiler@latest
```

```typescript
// next.config.ts
const nextConfig = {
  reactCompiler: true,
}
```

2. **Enable Turbopack file system caching**:
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
}
```

#### Breaking Changes

- **experimental.ppr flag removed**: Use Cache Components instead
- **middleware.ts deprecated**: Migrate to proxy.ts
- **React 19 required**: Update React dependencies

## Troubleshooting

### Common Issues

#### Cache Components Issues

**Error**: "Uncached data was accessed outside of <Suspense>"

**Solution**: Wrap dynamic components in Suspense or add "use cache" directive:

```typescript
// Option 1: Wrap in Suspense
<Suspense fallback={<Loading />}>
  <DynamicComponent />
</Suspense>

// Option 2: Add "use cache"
function DynamicComponent() {
  "use cache"
  // Component code
}
```

#### Build Performance Issues

**Issue**: Slow builds with Turbopack

**Solutions**:
1. Enable file system caching
2. Optimize package imports
3. Use React Compiler for runtime optimization

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
    optimizePackageImports: ['lodash', 'date-fns'],
  },
}
```

#### Migration Issues

**Issue**: proxy.ts not working

**Solution**: Ensure the function is named correctly:

```typescript
// Correct
export default function proxy(request: NextRequest) {
  return NextResponse.next()
}

// Incorrect
export default function middleware(request: NextRequest) {
  return NextResponse.next()
}
```

## Resources

### Official Documentation

- **[Next.js Docs](https://nextjs.org/docs)**: Complete documentation
- **[App Router Guide](https://nextjs.org/docs/app)**: App Router specific documentation
- **[API Reference](https://nextjs.org/docs/app/api-reference)**: Detailed API documentation

### Learning Resources

- **[Next.js Learn](https://nextjs.org/learn)**: Interactive tutorials
- **[Next.js Conf](https://nextjs.org/conf)**: Annual conference talks
- **[Next.js Blog](https://nextjs.org/blog)**: Latest updates and features

### Community

- **[GitHub Discussions](https://github.com/vercel/next.js/discussions)**: Community discussions
- **[Discord Community](https://discord.gg/nextjs)**: Real-time chat
- **[Stack Overflow](https://stackoverflow.com/questions/tagged/next.js)**: Q&A

### Tools and Extensions

- **[Next.js DevTools](https://nextjs.org/docs/app/guides/mcp)**: AI-assisted debugging
- **[VS Code Extension](https://marketplace.visualstudio.com/items?itemName=vercel.vscode-nextjs)**: Official VS Code extension
- **[Chrome DevTools Extension](https://chrome.google.com/webstore/detail/nextjs-devtools)**: Browser dev tools

---

**Last Updated**: April 2026  
**Version**: Next.js 16.2.2  
**Maintained by**: Vercel and the Next.js community

## Common Patterns in This Repository

### 1. Dashboard Layout
```typescript
// app/(dashboard)/layout.tsx
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
}
```

### 2. API Client Pattern
```typescript
// lib/api-client.ts
class ApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }
  
  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  }
}

export const apiClient = new ApiClient(process.env.API_URL!);
```

### 3. Data Fetching Hook
```typescript
// hooks/useData.ts
import { useState, useEffect } from 'react';

export function useData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url]);
  
  return { data, loading, error };
}
```

## Version-Specific Features (Next.js 16.2.2)

### New Features
- **Cache Components**: New "use cache" directive for explicit, flexible caching
- **Next.js DevTools MCP**: AI-assisted debugging with contextual insights
- **proxy.ts**: Replaces middleware.ts with explicit network boundary
- **React Compiler support**: Stable automatic memoization (v1.0)
- **Turbopack (stable)**: Default bundler with 2-5× faster builds
- **File System Caching**: Persistent compiler artifacts for faster restarts
- **Enhanced logging**: Detailed build timing and request analysis
- **Build Adapters API**: Custom build integrations (alpha)
- **Simplified create-next-app**: Updated templates with App Router by default

### Breaking Changes
- **middleware.ts → proxy.ts**: Export function renamed from `middleware` to `proxy`
- **Cache behavior**: Dynamic code executes at request time by default (opt-in caching)
- **experimental.ppr removed**: Replaced by Cache Components configuration
- **Build output format**: Updated for Turbopack optimization

### Migration Guide

#### From Next.js 15 to 16

1. **Update dependencies**:
```bash
npm install next@16.2.2 react@19.2.0 react-dom@19.2.0
```

2. **Rename middleware.ts to proxy.ts**:
```typescript
// Before: middleware.ts
export default function middleware(request: NextRequest) {
  // ...
}

// After: proxy.ts  
export default function proxy(request: NextRequest) {
  // ...
}
```

3. **Enable Cache Components (optional)**:
```typescript
// next.config.ts
const nextConfig = {
  cacheComponents: true,
}
```

4. **Update caching patterns**:
```typescript
// Before: Implicit caching
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 }
  })
  return <div>{data}</div>
}

// After: Explicit caching with "use cache"
"use cache"
export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  return <div>{data}</div>
}
```

5. **Enable React Compiler (optional)**:
```typescript
// next.config.ts
const nextConfig = {
  reactCompiler: true,
}
```

6. **Install React Compiler plugin**:
```bash
npm install babel-plugin-react-compiler@latest
```

### Performance Improvements

#### Turbopack Benefits
- **Development**: Up to 10× faster Fast Refresh
- **Production**: 2-5× faster builds
- **File System Caching**: Faster restarts for large projects

#### React Compiler Benefits
- **Automatic memoization**: Zero manual code changes
- **Reduced re-renders**: Improved performance
- **Stable integration**: Production-ready optimization

#### Cache Components Benefits
- **Explicit control**: Opt-in caching behavior
- **Better alignment**: Full-stack application expectations
- **Automatic keys**: Compiler-generated cache keys

### Developer Experience Improvements

#### Next.js DevTools MCP
- **AI-assisted debugging**: Contextual insights
- **Unified logging**: Browser and server logs
- **Error access**: Detailed stack traces
- **Page awareness**: Route context understanding

#### Enhanced Logging
- **Build timing**: Detailed step-by-step timing
- **Request analysis**: Compile vs render time breakdown
- **Performance insights**: Where time is spent

#### Simplified Setup
- **create-next-app**: Modern templates by default
- **App Router**: Default routing pattern
- **TypeScript-first**: Strong typing from start
- **Tailwind CSS**: Utility-first styling included

### Compatibility

#### Supported Versions
- **Node.js**: >=22.12.0
- **React**: 19.2.0+
- **TypeScript**: 5.0+

#### Browser Support
- **Chrome**: 111+
- **Firefox**: 113+
- **Safari**: 16.4+
- **Edge**: 111+

### Known Issues

#### React Compiler
- **Higher compile times**: Due to Babel processing
- **Not enabled by default**: Gathering performance data

#### Cache Components
- **New API**: Ecosystem still adapting
- **Migration required**: From implicit to explicit caching

#### Build Adapters API
- **Alpha status**: API may change
- **Limited documentation**: Still evolving

### Resources

- **Official Documentation**: <https://nextjs.org/docs>
- **Next.js 16 Blog Post**: <https://nextjs.org/blog/next-16>
- **Cache Components Guide**: <https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents>
- **DevTools MCP Guide**: <https://nextjs.org/docs/app/guides/mcp>
- **Migration Guide**: <https://nextjs.org/docs/app/building-your-application/upgrading/version-16>

---

*This documentation covers Next.js ^16.2.2 as used in this repository. For the latest features, check the official Next.js documentation.*
