# Astro Documentation

**Repository Version:** ^6.0.0  
**Official Documentation:** https://docs.astro.build/

## Overview

Astro is a modern web framework for building fast, content-focused websites. It's designed around the concept of "Islands Architecture" where you can ship zero client-side JavaScript by default and progressively add interactivity where needed.

Astro components are the basic building blocks of any Astro project. They are HTML-only templating components with no client-side runtime and use the .astro file extension.

**Note:** If you know HTML, you already know enough to write your first Astro component.

The most important thing to know about Astro components is that they don't render on the client. They render to HTML either at build-time or on-demand. You can include JavaScript code inside of your component frontmatter, and all of it will be stripped from the final page sent to your users' browsers. The result is a faster site, with zero JavaScript footprint added by default.

When your Astro component does need client-side interactivity, you can add standard HTML <script> tags or UI Framework components as "client islands".

For components that need to render personalized or dynamic content, you can defer their server rendering by adding a server directive. These "server islands" will render their content when it is available, without delaying the entire page load.

## Installation

### Prerequisites

- **Node.js**: 22.12.0 or later (required for Astro 6.0)
- **Package Manager**: npm, pnpm, yarn, or bun

### Browser Compatibility

Astro supports all modern browsers:
- Safari 16.4+
- Chrome 111+
- Firefox 113+

### Install from the CLI Wizard

The `create astro` CLI command is the fastest way to start a new Astro project from scratch:

```bash
npm create astro@latest
```

This command will walk you through every step of setting up your new Astro project and allow you to choose from a few different official starter templates.

#### CLI Installation Flags

**Add integrations:**
```bash
npm create astro@latest -- --template blog -- --install
```

**Use a theme or starter template:**
```bash
npm create astro@latest -- --template <theme-name>
```

### Manual Setup

For manual installation:

1. **Create project directory:**
```bash
mkdir my-astro-project
cd my-astro-project
```

2. **Initialize npm:**
```bash
npm init -y
```

3. **Install Astro:**
```bash
npm install astro
```

4. **Create basic files:**
```bash
mkdir -p src/pages src/layouts src/components
```

5. **Create astro.config.mjs:**
```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  // your configuration options here...
});
```

6. **Create package.json scripts:**
```json
{
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  }
}
```

## Astro 6.0 Major Features

Astro 6 is here! Astro 6 introduces a broad set of new capabilities, including a built-in Fonts API, Content Security Policy API, and support for Live Content Collections that work with your externally-hosted content through the unified Astro content layer.

Alongside these new features, we also completed a major refactor of the Astro dev server and much of the build pipeline. Powered by Vite's new Environment API, Astro can now run your exact production runtime during development. That means fewer "works in dev, breaks in prod" surprises — especially on non-Node.js runtimes like Cloudflare Workers, Bun, and Deno.

Full release highlights include:

- A redesigned astro dev
- Improved Cloudflare support
- Built-in Fonts API
- Live Content Collections
- Content Security Policy
- Upgraded Packages
- Experimental: Rust Compiler
- Experimental: Queued Rendering
- Experimental: Route Caching

One more thing: Astro 6 includes an experimental new Rust compiler — the successor to our original Go-based .astro compiler. It's still early, but the results are already impressive (and in some cases, even more reliable than our current Go compiler). We'll continue to invest in Rust-powered tooling throughout the 6.x release line to improve performance and scalability for large sites.

### A redesigned astro dev

```bash
astro dev
```

Astro's dev server was originally built for Node.js — and for most Astro users, that worked great. But as non-Node runtimes like Cloudflare Workers, Bun, and Deno gained traction, that assumption became a blind spot. Developers targeting these platforms had no way to run their actual production runtime during development, so the behavior you saw locally didn't always match what you shipped.

Astro 6 changes that. By leveraging Vite's new Environment API, `astro dev` can now run a custom runtime environment during development. The dev server and build pipeline now share the same code paths, unifying your development experience with production.

#### Improved Cloudflare Support

For Cloudflare users, this gap was especially painful. The dev server ran on Node.js, but production ran on Cloudflare's workerd runtime. Bugs only showed up after the deploy. Cloudflare bindings — KV, D1, R2, Durable Objects — weren't available during development at all. You were coding blind and hoping it would work in production.

The rebuilt `@astrojs/cloudflare` adapter now runs workerd at every stage: development, prerendering, and production. You develop directly against Cloudflare's platform APIs using `cloudflare:workers`, with full access to your bindings locally. No more simulation layers, and no more `Astro.locals.runtime` workarounds. This work grew out of our official partnership with Cloudflare announced last year, with the goal of making Cloudflare a first-class Astro runtime.

### Built-in Fonts API

Almost every website uses custom fonts, but getting them right is surprisingly complicated. There are performance tradeoffs, privacy concerns, and a dozen small decisions that are easy to get wrong.

Astro 6 adds a built-in Fonts API that takes care of the hard parts for you. You configure your fonts from local files or providers like Google and Fontsource, and Astro handles the rest: downloading and caching for self-hosting, generating optimized fallbacks, and adding preload links — keeping your site fast and your users' data private.

To get started, configure a fonts object with one or more fonts that you'd like to use in your project:

```javascript
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  fonts: [
    {
      name: 'Roboto',
      cssVariable: '--font-roboto',
      provider: fontProviders.fontsource(),
    },
  ],
});
```

Then, add a `<Font />` component and styling wherever you need it — a global layout, a single page, or a specific section of your site:

```astro
---
import { Font } from 'astro:assets';
---

<Font cssVariable="--font-roboto" preload />

<style is:global>
  body {
    font-family: var(--font-roboto);
  }
</style>
```

Behind the scenes, Astro downloads the font files, generates optimized fallback fonts, and adds the right preload hints — so you get best-practice font loading without configuring it yourself.

To learn more, check out the fonts guide.

### Live Content Collections

Live Content Collections are now stable in Astro 6, bringing request-time content fetching to Astro's unified content layer.

Content Collections have been a core part of Astro since 2.0. But they've always required a rebuild when content changed. Live Content Collections fetch content at request time instead, using the same APIs, with no rebuild step required. Your content updates the moment it's published, without touching your build pipeline. That means CMS content, API data, and editorial updates all go live instantly.

Use `defineLiveCollection()` to define a live source in `src/live.config.ts`:

```typescript
import { defineLiveCollection } from 'astro:content';
import { z } from 'astro/zod';
import { cmsLoader } from './loaders/my-cms';

const updates = defineLiveCollection({
  loader: cmsLoader({ apiKey: process.env.MY_API_KEY }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    excerpt: z.string(),
    publishedAt: z.coerce.date(),
  }),
});

export const collections = { updates };
```

Then query live content in your page with built-in error handling:

```astro
---
import { getLiveEntry } from 'astro:content';

const { entry: update, error } = await getLiveEntry(
  'updates',
  Astro.params.slug,
);

if (error || !update) {
  return Astro.redirect('/404');
}
---

<h1>{update.data.title}</h1>
<p>{update.data.excerpt}</p>
<time>{update.data.publishedAt.toDateString()}</time>
```

Live Content Collections use the same familiar APIs as build-time collections (`getCollection()`, `getEntry()`, schemas, loaders), so there's no new mental model to learn. If your content needs real-time freshness, define a live collection with a live loader and your content goes live on every request. If it doesn't, keep using build-time collections for the best performance. Both can coexist in the same project.

For more on live content collections, see the content collections guide.

### Content Security Policy

Astro's Content Security Policy API is now stable in Astro 6. Astro is one of the first JavaScript meta-frameworks to offer built-in CSP configuration for both static and dynamic pages, in both server and serverless environments.

CSP is deceptively hard to implement in a framework like Astro. It requires knowing every script and style on a page so they can be hashed and included in the policy. For static pages, that can be computed at build time. But for dynamic pages, content can change per request — which means hashing on the fly and injecting the right headers at runtime. Supporting both modes in a single, unified API is why no other meta-framework has done this before.

Getting started is simple. Enable CSP with a single flag, and Astro handles the rest — automatically hashing all scripts and styles in your pages and generating the appropriate CSP headers:

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  security: {
    csp: true,
  },
  experimental: {
    csp: true,
  },
});
```

That's all you need for most sites. When you need more control — custom hashing algorithms, additional directives for external scripts or styles — the full configuration API is available:

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  security: {
    csp: {
      algorithm: 'SHA-512',
      directives: [
        "default-src 'self'",
        "img-src 'self' https://images.cdn.example.com",
      ],
      styleDirective: {
        hashes: ['sha384-styleHash']
      },
      scriptDirective: {
        hashes: ['sha384-scriptHash']
      },
    },
  },
});
```

As part of this stabilization, CSP also works with Astro's responsive images out of the box. Responsive image styles are calculated at build time and applied using CSS classes and data-* attributes, so they can be hashed and included in your CSP policy automatically — no extra configuration needed.

See the security configuration reference for full details.

### Upgraded Packages

Astro 6 includes major upgrades to several core dependencies:

- **Vite 7** is now used across Astro and all `@astrojs` packages. If your project pins a custom Vite version, update it to v7 or later before upgrading.
- **Shiki 4** now powers code highlighting in the `<Code />` component and Markdown/MDX code blocks.
- **Zod 4** now powers content schema validation. When defining schemas, import Zod from `astro/zod` rather than `astro:content`.

Astro 6 also now requires Node 22 or later, dropping support for Node 18 and Node 20, which have reached or are approaching end-of-life. Node 22 is faster, more secure, and lets us drop polyfills for older Node versions — resulting in a smaller, more maintainable package and better performance in Astro across the board.

See the upgrade guide for detailed migration steps.

### Experimental: Rust Compiler

Astro 6 includes an experimental new Rust compiler — the successor to our original Go-based `.astro` compiler.

What started as an AI experiment while updating our Go compiler for Astro 6 quickly moved from "can this work?" to "why isn't this the default?" The new compiler is faster, produces stronger diagnostics, and in some cases is even more reliable than our current Go compiler. We hope to make it the default in a future major release.

You can try it today by enabling the rustCompiler flag and installing the `@astrojs/compiler-rs` package:

```bash
npm install @astrojs/compiler-rs
```

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  experimental: {
    rustCompiler: true,
  },
});
```

We're actively exploring more Rust-powered tooling across Astro, with more to share soon.

Read our reference documentation on the Rust compiler for more details.

### Experimental: Queued Rendering

Astro 6 introduces an experimental new rendering strategy, with early benchmarks showing up to 2x faster rendering.

Today, Astro renders components recursively. Rendering functions call themselves as they walk the component tree. Queued rendering replaces this with a two-pass approach: the first pass traverses the tree and emits an ordered queue, then the second pass renders it. The result is both faster and more memory-efficient, and we plan to make it the default rendering strategy in Astro v7.

Try it today by enabling the experimental flag:

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  experimental: {
    queuedRendering: {
      enabled: true,
    },
  },
});
```

See the experimental queued rendering documentation for more on this feature, including additional options like node pooling and content caching.

## Astro 6.1 Features

Astro 6.1 introduces additional image optimization controls, enhanced Markdown configuration, and improved i18n integration support.

### Sharp Codec-Specific Image Defaults

Astro 6.1 adds `image.service.config` to set codec-specific defaults once in your Astro config, applied to every image processed during the build:

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  image: {
    service: {
      config: {
        jpeg: {
          mozjpeg: true
        },
        webp: {
          effort: 6,
          alphaQuality: 80
        },
        avif: {
          effort: 4,
          chromaSubsampling: '4:2:0'
        },
        png: {
          compressionLevel: 9
        }
      }
    }
  }
});
```

Per-image quality settings still take precedence when set, so global defaults and per-image overrides work together without conflict.

### Advanced SmartyPants Configuration

Astro 6.1 opens up the full SmartyPants configuration for non-English content, allowing customization of each transformation:

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  markdown: {
    smartypants: {
      dashes: 'oldschool',
      openingQuotes: {
        double: '«',
        single: '‹'
      },
      closingQuotes: {
        double: '»',
        single: '›'
      },
      ellipses: 'unspaced',
      quotes: false
    }
  }
});
```

Supported options follow the [retext-smartypants](https://github.com/retextjs/retext-smartypants) configuration.

### i18n Fallback Routes for Integrations

Astro 6.1 exposes `fallbackRoutes` on every route in the `astro:routes:resolved` hook, giving integrations access to additional routes generated for locales that don't have their own content when using `fallbackType: 'rewrite'`:

```javascript
{
  'astro:routes:resolved': ({ routes }) => {
    for (const route of routes) {
      const fallbacks = route.fallbackRoutes.map((f) => f.pathname);
      console.log(route.pathname, '->', fallbacks);
      // '/about/' -> ['/fr/about/', '/de/about/']
    }
  }
}
```

The `@astrojs/sitemap` integration now automatically includes i18n fallback pages in the generated sitemap.

## Configuration Reference

### Top-Level Options

#### security

Type: `Record<"checkOrigin", boolean> | undefined`  
Default: `{checkOrigin: true}`  
Added in: `astro@4.9.0`

Enables security measures for an Astro website. These features only exist for pages rendered on demand (SSR) using server mode or pages that opt out of prerendering in static mode.

##### security.checkOrigin

Type: `boolean`  
Default: `true`  
Added in: `astro@4.9.0`

Performs a check that the "origin" header, automatically passed by all modern browsers, matches the URL sent by each Request. This is used to provide Cross-Site Request Forgery (CSRF) protection.

The "origin" check is executed only for pages rendered on demand, and only for the requests POST, PATCH, DELETE and PUT with one of the following content-type headers: `'application/x-www-form-urlencoded'`, `'multipart/form-data'`, `'text/plain'`.

If the "origin" header doesn't match the pathname of the request, Astro will return a 403 status code and will not render the page.

##### security.allowedDomains

Type: `Array<RemotePattern>`  
Default: `[]`  
Added in: `astro@5.14.2`

Defines a list of permitted host patterns for incoming requests when using SSR. When configured, Astro will validate the X-Forwarded-Host header against these patterns for security.

Each pattern can specify protocol, hostname, and port. All three are validated if provided. The patterns support wildcards for flexible hostname matching:

- `*.example.com` - matches exactly one subdomain level (e.g., sub.example.com but not deep.sub.example.com)
- `**.example.com` - matches any subdomain depth (e.g., both sub.example.com and deep.sub.example.com)

```javascript
{
  security: {
    // Example: Allow any subdomain of example.com on https
    allowedDomains: [
      { hostname: '**.example.com', protocol: 'https' },
      { hostname: 'staging.myapp.com', protocol: 'https', port: '443' }
    ]
  }
}
```

##### security.actionBodySizeLimit

Type: `number`  
Default: `1048576` (1 MB)  
Added in: `astro@5.18.0`

Sets the maximum size in bytes allowed for action request bodies. By default, action request bodies are limited to 1 MB (1048576 bytes) to prevent abuse.

#### fonts

Type: `Array<FontFamily>`  
Default: `[]`  
Added in: `astro@6.0.0`

Configures fonts and allows you to specify some customization options on a per-font basis.

##### Font Configuration Options

Each font object supports the following properties:

- **provider**: Font provider (fontsource, google, local)
- **name**: Font family name
- **cssVariable**: CSS custom property name
- **fallbacks**: Array of fallback font families
- **optimizedFallbacks**: Generate optimized fallback fonts
- **weights**: Font weights to include
- **styles**: Font styles to include
- **subsets**: Font subsets to include
- **formats**: Font formats to include

## Breaking Changes from Astro 5 to 6

### Dependency Upgrades

#### Node 22 + Vite 7.0 + Vite Environment API

- Node 18 reached its End of Life in March 2025 and Node 20 is scheduled to reach its End of Life in April 2026. Astro v6.0 drops Node 18 and Node 20 support entirely so that all Astro users can take advantage of Node's more modern features.
- Vite 7 is now required across Astro and all `@astrojs` packages
- The new Vite Environment API powers the redesigned dev server

#### Zod 4 + Shiki 4.0

- Zod 4 now powers content schema validation. Import Zod from `astro/zod` rather than `astro:content`
- Shiki 4 now powers code highlighting in the `<Code />` component and Markdown/MDX code blocks

#### Official Astro Integrations

All official `@astrojs` integrations have been updated to support Vite 7 and the new Environment API.

### Removed Features

#### Removed: legacy content collections

Legacy content collections have been completely removed. Use the new content collections API.

#### Removed: `<ViewTransitions />` component

The `<ViewTransitions />` component has been removed. Use the new View Transitions API instead.

#### Removed: `emitESMImage()`

The `emitESMImage()` function has been removed from the image service API.

#### Removed: `Astro.glob()`

`Astro.glob()` has been removed. Use `getCollection()` and `getEntry()` from `astro:content` instead.

### Deprecated Features

#### Deprecated: Astro in getStaticPaths()

Using `Astro` inside `getStaticPaths()` is deprecated and will be removed in a future version.

#### Deprecated: import.meta.env.ASSETS_PREFIX

`import.meta.env.ASSETS_PREFIX` is deprecated. Use the new asset prefix configuration instead.

#### Deprecated: astro:schema and z from astro:content

Importing schema validation utilities from `astro:content` is deprecated. Use `astro/zod` instead.

#### Deprecated: exposed astro:transitions internals

Internal APIs from `astro:transitions` are no longer exposed and should not be used directly.

## Core Concepts

### 1. Astro Components

#### Component Structure

An Astro component is made up of two main parts: the Component Script and the Component Template. Each part performs a different job, but together they provide a framework that is both easy to use and expressive enough to handle whatever you might want to build.

```astro
---
// Component Script (JavaScript)
---
<!-- Component Template (HTML + JS Expressions) -->
```

#### The Component Script

Astro uses a code fence (---) to identify the component script in your Astro component. If you've ever written Markdown before, you may already be familiar with a similar concept called frontmatter. Astro's idea of a component script was directly inspired by this concept.

You can use the component script to write any JavaScript code that you need to render your template. This can include:

- importing other Astro components
- importing other framework components, like React
- importing data, like a JSON file
- fetching content from an API or database
- creating variables that you will reference in your template

```astro
---
import SomeAstroComponent from '../components/SomeAstroComponent.astro';
import SomeReactComponent from '../components/SomeReactComponent.jsx';
import someData from '../data/pokemon.json';

// Access passed-in component props, like `<X title="Hello, World" />`
const { title } = Astro.props;

// Fetch external data, even from a private API or database
const data = await fetch('SOME_SECRET_API_URL/users').then(r => r.json());
---
<!-- Your template here! -->
```

The code fence is designed to guarantee that the JavaScript that you write in it is "fenced in." It won't escape into your frontend application, or fall into your user's hands. You can safely write code here that is expensive or sensitive (like a call to your private database) without worrying about it ever ending up in your user's browser.

**Note:** The Astro component script is TypeScript, which allows you to add additional syntax to JavaScript for editor tooling, and error checking.

#### The Component Template

The component template is where you write your HTML. It can include JavaScript expressions that are evaluated at build time or on the server, and it can also include special Astro syntax like props, slots, and references.

```astro
---
const { title, description } = Astro.props;
import Layout from '../layouts/Layout.astro';
---

<Layout title={title}>
  <main>
    <h1>{title}</h1>
    <p>{description}</p>
  </main>
</Layout>

<style>
  h1 {
    color: #2563eb;
  }
  
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
</style>
```

#### Props with TypeScript

```astro
---
// Define props with TypeScript
interface Props {
  title: string;
  description?: string;
  featured?: boolean;
  tags?: string[];
}

const { title, description = "", featured = false, tags = [] } = Astro.props;
---

<article class={`client-card ${featured ? 'featured' : ''}`}>
  <h2>{title}</h2>
  {description && <p>{description}</p>}
  {tags.length > 0 && (
    <div class="tags">
      {tags.map(tag => <span class="tag">{tag}</span>)}
    </div>
  )}
</article>

<style>
  .client-card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
  }
  
  .featured {
    border-color: #3b82f6;
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);
  }
  
  .tag {
    background: #f3f4f6;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
  }
</style>
```

### 2. Layouts

#### Base Layout

```astro
---
// src/layouts/Layout.astro
interface Props {
  title: string;
  description?: string;
}

const { title, description = "" } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="description" content={description} />
  <title>{title}</title>
</head>
<body>
  <header>
    <nav>
      <a href="/">Home</a>
      <a href="/clients">Clients</a>
      <a href="/about">About</a>
    </nav>
  </header>
  
  <main>
    <slot />
  </main>
  
  <footer>
    <p>&copy; 2026 Marketing Agency. All rights reserved.</p>
  </footer>
</body>
</html>

<style is:global>
  body {
    font-family: system-ui, sans-serif;
    line-height: 1.6;
    margin: 0;
  }
  
  header {
    background: white;
    border-bottom: 1px solid #e5e7eb;
    padding: 1rem 0;
  }
  
  nav {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  nav a {
    margin-right: 2rem;
    text-decoration: none;
    color: #374151;
  }
  
  nav a:hover {
    color: #3b82f6;
  }
  
  main {
    min-height: calc(100vh - 120px);
  }
  
  footer {
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
    padding: 2rem 0;
    text-align: center;
  }
</style>
```

### 3. Pages and Routing

#### File-based Routing

Astro uses file-based routing to generate your build URLs based on the file layout of your project src/pages/ directory.

Astro uses standard HTML `<a>` elements to navigate between routes. There is no framework-specific `<Link>` component provided.

```html
<p>Read more <a href="/about/">about</a> Astro!</p>
<!-- With `base: "/docs"` configured -->
<p>Learn more in our <a href="/docs/reference/">reference</a> section!</p>
```

#### Static routes

.astro page components as well as Markdown and MDX Files (.md, .mdx) within the src/pages/ directory automatically become pages on your website. Each page's route corresponds to its path and filename within the src/pages/ directory.

```text
# Example: Static routes
src/pages/index.astro -> mysite.com/
src/pages/about.astro -> mysite.com/about
src/pages/about/index.astro -> mysite.com/about
src/pages/about/me.astro -> mysite.com/about/me
src/pages/posts/1.md -> mysite.com/posts/1
```

**Tip:** There is no separate "routing config" to maintain in an Astro project! When you add a file to the src/pages/ directory, a new route is automatically created for you. In static builds, you can customize the file output format using the build.format configuration option.

#### Dynamic routes

An Astro page file can specify dynamic route parameters in its filename to generate multiple, matching pages. For example, src/pages/authors/[author].astro generates a bio page for every author on your blog. author becomes a parameter that you can access from inside the page.

In Astro's default static output mode, these pages are generated at build time, and so you must predetermine the list of authors that get a corresponding file. In SSR mode, a page will be generated on request for any route that matches.

#### File-based Routing Example

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
import ClientCard from '../components/ClientCard.astro';
import { getClients } from '../utils/clients';
---

<Layout title="Marketing Agency - Home">
  <section class="hero">
    <h1>Building Digital Experiences</h1>
    <p>We help brands connect with their audience through innovative web solutions.</p>
    <a href="/contact" class="cta-button">Get Started</a>
  </section>
  
  <section class="featured-clients">
    <h2>Featured Clients</h2>
    <div class="client-grid">
      {getClients().slice(0, 6).map(client => (
        <ClientCard client={client} />
      ))}
    </div>
  </section>
</Layout>

<style>
  .hero {
    text-align: center;
    padding: 4rem 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  .cta-button {
    display: inline-block;
    background: white;
    color: #667eea;
    padding: 1rem 2rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: bold;
  }
  
  .client-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }
</style>
```

#### Dynamic Routes

```astro
---
// src/pages/clients/[slug].astro
import Layout from '../../layouts/Layout.astro';
import { getClientBySlug } from '../../utils/clients';
import NotFound from '../../pages/404.astro';

export async function getStaticPaths() {
  const clients = await getAllClients();
  return clients.map((client) => ({
    params: { slug: client.slug },
    props: { client },
  }));
}

const { client } = Astro.props;

if (!client) {
  return Astro.redirect(NotFound);
}
---

<Layout title={client.name}>
  <article class="client-detail">
    <header>
      <h1>{client.name}</h1>
      <p class="client-description">{client.description}</p>
    </header>
    
    <section class="client-website">
      <h2>Website</h2>
      <a href={client.website} target="_blank" rel="noopener noreferrer">
        {client.website}
      </a>
    </section>
    
    <section class="client-case-study">
      <h2>Case Study</h2>
      <div class="case-study-content">
        <slot />
      </div>
    </section>
  </article>
</Layout>

<style>
  .client-detail {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .client-description {
    font-size: 1.25rem;
    color: #6b7280;
  }
</style>
```

### 4. Content Collections

#### Define Collection

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const clientsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    website: z.string().url(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    publishDate: z.date(),
    author: z.string(),
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    author: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  clients: clientsCollection,
  blog: blogCollection,
};
```

#### Use Collection

```astro
---
// src/pages/blog/index.astro
import Layout from '../../layouts/Layout.astro';
import { getCollection } from 'astro:content';
import BlogCard from '../../components/BlogCard.astro';

const blogPosts = await getCollection('blog');
const featuredPosts = blogPosts.filter(post => post.data.featured);
---

<Layout title="Blog - Marketing Agency">
  <section class="blog-hero">
    <h1>Marketing Insights</h1>
    <p>Tips, strategies, and case studies from our team.</p>
  </section>
  
  {featuredPosts.length > 0 && (
    <section class="featured-posts">
      <h2>Featured Posts</h2>
      <div class="featured-grid">
        {featuredPosts.map(post => (
          <BlogCard post={post} featured={true} />
        ))}
      </div>
    </section>
  )}
  
  <section class="all-posts">
    <h2>All Posts</h2>
    <div class="blog-grid">
      {blogPosts.map(post => (
        <BlogCard post={post} />
      ))}
    </div>
  </section>
</Layout>

<style>
  .blog-hero {
    text-align: center;
    padding: 4rem 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  .featured-grid,
  .blog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }
</style>
```

### 5. API Routes

#### Create API Endpoint

```typescript
// src/pages/api/clients.ts
import type { APIRoute } from 'astro';
import { getClients } from '../../utils/clients';

export const GET: APIRoute = async ({ url }) => {
  const searchParams = new URL(url).searchParams;
  const featured = searchParams.get('featured') === 'true';
  
  let clients = await getClients();
  
  if (featured) {
    clients = clients.filter(client => client.featured);
  }
  
  return new Response(JSON.stringify(clients), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  
  // Validate and create new client
  const newClient = await createClient(body);
  
  return new Response(JSON.stringify(newClient), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
```

### 6. Integrations

#### React Integration

```tsx
// src/components/InteractiveCounter.tsx
import { useState } from 'react';

export default function InteractiveCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
}
```

```astro
---
// src/pages/demo.astro
import Layout from '../layouts/Layout.astro';
import InteractiveCounter from '../components/InteractiveCounter.tsx';
---

<Layout title="Interactive Demo">
  <section>
    <h1>Interactive Components</h1>
    <p>This is a React component loaded in Astro:</p>
    <InteractiveCounter client:load />
  </section>
</Layout>
```

### 7. Advanced Features

#### View Transitions

```astro
---
// src/layouts/Layout.astro
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width" />
  <title>{title}</title>
  <script>
    import { ViewTransitions } from 'astro:transitions/client';
    ViewTransitions.subscribe();
  </script>
</head>
<body>
  <main>
    <slot />
  </main>
</body>
</html>
```

```astro
---
// src/pages/clients/[slug].astro
---

<article transition:name="client-card">
  <!-- Content -->
</article>
```

#### Image Optimization

```astro
---
import { Image } from 'astro:assets';
import clientImage from '../../images/client-hero.jpg';
---

<div class="hero">
  <Image 
    src={clientImage} 
    alt="Client project showcase"
    widths={[400, 800, 1200]}
    sizes="(max-width: 768px) 400px, 1200px"
    format="webp"
    loading="eager"
  />
</div>
```

#### SEO and Meta Tags

```astro
---
// src/pages/blog/[slug].astro
import Layout from '../../layouts/Layout.astro';
import { getEntry } from 'astro:content';

const post = await getEntry('blog', Astro.params.slug);
const { Content } = await post.render();
---

<Layout title={post.data.title}>
  <meta name="description" content={post.data.description} />
  <meta property="og:title" content={post.data.title} />
  <meta property="og:description" content={post.data.description} />
  <meta property="og:type" content="article" />
  <meta property="og:image" content={`/images/blog/${post.slug}.jpg`} />
  <meta name="twitter:card" content="summary_large_image" />
  
  <article>
    <header>
      <h1>{post.data.title}</h1>
      <p>By {post.data.author} on {post.data.publishDate.toLocaleDateString()}</p>
    </header>
    
    <Content />
  </article>
</Layout>
```

## Configuration

### astro.config.mjs

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './src/utils/env';

export default defineConfig({
  site: SITE_URL,
  integrations: [
    react(),
    tailwind(),
    sitemap(),
  ],
  build: {
    format: 'directory',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
  vite: {
    define: {
      global: 'globalThis',
    },
  },
  experimental: {
    viewTransitions: true,
  },
});
```

## Best Practices

### 1. Performance

- Use islands architecture for minimal JavaScript
- Optimize images with Astro's Image component
- Implement proper caching strategies
- Use view transitions for smooth navigation

### 2. SEO

- Use semantic HTML structure
- Implement proper meta tags
- Create XML sitemaps
- Use structured data

### 3. Accessibility

- Use proper heading hierarchy
- Implement ARIA labels where needed
- Ensure keyboard navigation
- Test with screen readers

### 4. Content Management

- Use content collections for type safety
- Implement proper content validation
- Use MDX for complex content
- Create reusable content components

### 5. Security

- Enable CSP for all sites
- Use proper middleware for authentication
- Validate all user inputs
- Implement proper error handling

## Migration Guide

### Automated Upgrade Process

To upgrade an existing project to Astro 6, use the automated `@astrojs/upgrade` CLI tool:

```bash
npx @astrojs/upgrade
```

### Manual Upgrade Process

For manual upgrade:

```bash
npm install astro@latest
```

### Required Migration Steps

1. **Update Node.js** to version 22.12.0 or later
2. **Update Vite** to version 7 or later
3. **Update Zod imports** from `astro:content` to `astro/zod`
4. **Remove deprecated APIs** and replace with new equivalents
5. **Update Cloudflare adapter** for workerd support if using Cloudflare

### Optional Enhancement Steps

1. **Enable Rust compiler** for improved performance
2. **Enable queued rendering** for faster builds
3. **Configure Fonts API** for better font loading
4. **Enable CSP** for enhanced security

---

*This documentation covers Astro ^6.0.0 as used in this repository. For the latest features, check the official Astro documentation at <https://docs.astro.build/>*
