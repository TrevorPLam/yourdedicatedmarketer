# Contentful

Contentful is a composable content platform that enables teams to create, manage, and deliver content across multiple channels. It provides a headless CMS approach with a powerful Content Delivery API (CDA) and Content Management API (CMA).

---

## Overview

**Contentful** is a **headless content management system** that separates content from presentation. It provides a cloud-based platform for creating, managing, and delivering content through APIs, making it ideal for multi-channel content delivery.

### Key Features

- **Headless Architecture** - Content as a service via APIs
- **Content Modeling** - Flexible content type system
- **Multi-space Support** - Separate environments for dev/staging/prod
- **Localization** - Built-in i18n support for 100+ locales
- **Rich Text** - Structured rich text content
- **Asset Management** - Image and file management with transformations
- **Webhooks** - Event-driven integrations
- **App Framework** - Extend functionality with custom apps

### When to Use Contentful

Contentful is ideal for:

- Multi-channel content delivery
- Marketing websites with dynamic content
- E-commerce product catalogs
- Mobile app content
- Digital signage systems
- Content that requires frequent updates
- Teams needing editorial workflows

---

## Getting Started

### Installation

```bash
npm install contentful
# or
yarn add contentful
# or
pnpm add contentful
```

### Quick Start

```typescript
import { createClient } from 'contentful';

// Create CDA (Content Delivery API) client
const client = createClient({
  space: '<your-space-id>',
  accessToken: '<your-access-token>',
  environment: 'master',
});

// Fetch entries
const entries = await client.getEntries({
  content_type: 'blogPost',
  limit: 10,
});

console.log(entries.items);
```

---

## Core Concepts

### Spaces

A **Space** is a container for all content and media. Each space has its own content model, entries, and assets.

```typescript
// Space configuration
const client = createClient({
  space: 'abc123xyz',           // Space ID
  accessToken: 'YOUR_TOKEN',     // CDA or CMA token
  environment: 'master',         // Environment (master, staging, etc.)
});
```

### Content Types

**Content Types** define the structure of content. They consist of fields with various data types.

```typescript
// Example: Blog Post Content Type
interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: Document;            // Rich text
  author: Entry<Author>;        // Reference
  tags: Entry<Tag>[];           // Multiple references
  featuredImage: Asset;
  publishDate: string;          // Date/time
  featured: boolean;            // Boolean
}
```

**Field Types:**
- `Symbol` - Short text (max 255 chars)
- `Text` - Long text
- `RichText` - Structured rich text
- `Integer` - Whole numbers
- `Number` - Decimal numbers
- `Date` - Date/time picker
- `Boolean` - True/false
- `Location` - Geolocation
- `Object` - JSON object
- `Link` - Reference to Asset or Entry
- `Array` - List of links

### Entries

**Entries** are instances of content types containing actual content.

```typescript
// Fetch single entry
const entry = await client.getEntry('entry-id');

// Fetch multiple entries
const entries = await client.getEntries({
  content_type: 'blogPost',
  'fields.slug': 'my-post',
  include: 2,                   // Resolve linked entries
});
```

### Assets

**Assets** represent media files (images, videos, documents) with metadata.

```typescript
// Fetch an asset
const asset = await client.getAsset('asset-id');

// Asset URL with image transformations
const imageUrl = `${asset.fields.file.url}?w=800&h=600&fit=fill`;
```

**Image API Parameters:**
- `w` - Width
- `h` - Height
- `fit` - Resizing behavior (pad, fill, crop, thumb)
- `f` - Focus area (face, center, etc.)
- `fm` - Format (jpg, png, webp, gif)
- `q` - Quality (1-100)
- `bg` - Background color

---

## Content Delivery API (CDA)

The CDA is read-only and optimized for delivering content to end users.

### Creating a Client

```typescript
import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
  host: 'cdn.contentful.com',   // Default for CDA
});
```

### Fetching Entries

```typescript
// Get all entries of a type
const posts = await client.getEntries({
  content_type: 'blogPost',
});

// Get entry by ID
const post = await client.getEntry('post-id');

// Pagination
const page1 = await client.getEntries({
  content_type: 'blogPost',
  limit: 10,
  skip: 0,
});

const page2 = await client.getEntries({
  content_type: 'blogPost',
  limit: 10,
  skip: 10,
});

// Sorting
const sorted = await client.getEntries({
  content_type: 'blogPost',
  order: '-fields.publishDate', // Descending
});

// Select specific fields
const minimal = await client.getEntries({
  content_type: 'blogPost',
  select: 'fields.title,fields.slug',
});
```

### Querying Entries

```typescript
// Equality
const posts = await client.getEntries({
  content_type: 'blogPost',
  'fields.category': 'technology',
});

// Multiple values (OR)
const posts = await client.getEntries({
  content_type: 'blogPost',
  'fields.category[in]': 'technology,design,marketing',
});

// Exclusion
const posts = await client.getEntries({
  content_type: 'blogPost',
  'fields.category[ne]': 'draft',
});

// Range queries
const recent = await client.getEntries({
  content_type: 'blogPost',
  'fields.publishDate[gte]': '2024-01-01',
  'fields.publishDate[lte]': '2024-12-31',
});

// Full-text search
const results = await client.getEntries({
  query: 'search term',
});

// Near location
const nearby = await client.getEntries({
  content_type: 'restaurant',
  'fields.location[near]': '40.7128,-74.0060',
});

// Within bounding box
const inArea = await client.getEntries({
  content_type: 'restaurant',
  'fields.location[within]': '40.7,-74.1,40.8,-73.9',
});
```

### Including Linked Content

```typescript
// Resolve linked entries (up to 10 levels)
const post = await client.getEntry('post-id', {
  include: 2,  // Include 2 levels of linked content
});

// Access linked content
const author = post.fields.author.fields.name;
const tags = post.fields.tags.map(tag => tag.fields.name);
```

---

## Content Management API (CMA)

The CMA allows creating, updating, and deleting content.

### Creating a Client

```bash
npm install contentful-management
```

```typescript
import { createClient } from 'contentful-management';

const managementClient = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

// Get space
const space = await managementClient.getSpace('space-id');
const environment = await space.getEnvironment('master');
```

### Creating Content

```typescript
// Create an entry
const entry = await environment.createEntry('blogPost', {
  fields: {
    title: {
      'en-US': 'My New Post',
    },
    slug: {
      'en-US': 'my-new-post',
    },
    content: {
      'en-US': {
        nodeType: 'document',
        data: {},
        content: [
          {
            nodeType: 'paragraph',
            data: {},
            content: [
              {
                nodeType: 'text',
                value: 'Hello World',
                marks: [],
                data: {},
              },
            ],
          },
        ],
      },
    },
  },
});

// Publish entry
await entry.publish();
```

### Updating Content

```typescript
// Fetch and update
const entry = await environment.getEntry('entry-id');
entry.fields.title['en-US'] = 'Updated Title';
const updated = await entry.update();
await updated.publish();
```

### Uploading Assets

```typescript
// Create asset
const asset = await environment.createAssetFromFiles({
  fields: {
    title: {
      'en-US': 'My Image',
    },
    description: {
      'en-US': 'Image description',
    },
    file: {
      'en-US': {
        contentType: 'image/jpeg',
        fileName: 'photo.jpg',
        file: fs.readFileSync('./photo.jpg'),
      },
    },
  },
});

// Process and publish
await asset.processForAllLocales();
await asset.publish();
```

---

## Rich Text

Contentful uses a structured JSON format for rich text content.

### Rich Text Document Structure

```typescript
interface RichTextDocument {
  nodeType: 'document';
  data: {};
  content: RichTextNode[];
}

type RichTextNode =
  | Paragraph
  | Heading
  | List
  | Quote
  | HorizontalRule
  | EmbeddedEntry
  | EmbeddedAsset
  | Table;
```

### Rendering Rich Text

```tsx
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';

const options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <p>{children}</p>,
    [BLOCKS.HEADING_1]: (node, children) => <h1>{children}</h1>,
    [BLOCKS.HEADING_2]: (node, children) => <h2>{children}</h2>,
    [BLOCKS.UL_LIST]: (node, children) => <ul>{children}</ul>,
    [BLOCKS.OL_LIST]: (node, children) => <ol>{children}</ol>,
    [BLOCKS.LIST_ITEM]: (node, children) => <li>{children}</li>,
    [BLOCKS.QUOTE]: (node, children) => <blockquote>{children}</blockquote>,
    [BLOCKS.HR]: () => <hr />,
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      const entry = node.data.target;
      return <CustomComponent entry={entry} />;
    },
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const asset = node.data.target;
      return <img src={asset.fields.file.url} alt={asset.fields.title} />;
    },
    [INLINES.HYPERLINK]: (node, children) => (
      <a href={node.data.uri}>{children}</a>
    ),
    [INLINES.ENTRY_HYPERLINK]: (node, children) => {
      const entry = node.data.target;
      return <Link to={`/post/${entry.fields.slug}`}>{children}</Link>;
    },
  },
  renderMark: {
    bold: (text) => <strong>{text}</strong>,
    italic: (text) => <em>{text}</em>,
    underline: (text) => <u>{text}</u>,
    code: (text) => <code>{text}</code>,
  },
};

function RichTextContent({ document }) {
  return <div>{documentToReactComponents(document, options)}</div>;
}
```

### Creating Rich Text Programmatically

```typescript
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';

const richTextDocument = {
  nodeType: BLOCKS.DOCUMENT,
  data: {},
  content: [
    {
      nodeType: BLOCKS.HEADING_1,
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'My Heading',
          marks: [],
          data: {},
        },
      ],
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'This is ',
          marks: [],
          data: {},
        },
        {
          nodeType: 'text',
          value: 'bold',
          marks: [{ type: MARKS.BOLD }],
          data: {},
        },
        {
          nodeType: 'text',
          value: ' text.',
          marks: [],
          data: {},
        },
      ],
    },
  ],
};
```

---

## Localization

Contentful supports content in multiple locales.

### Setting up Locales

```typescript
// Fetch entries for specific locale
const entries = await client.getEntries({
  content_type: 'blogPost',
  locale: 'de-DE',
});

// Fallback to default locale if translation missing
const entries = await client.getEntries({
  content_type: 'blogPost',
  locale: 'de-DE',
  fallback_locale: 'en-US',
});
```

### Creating Localized Content

```typescript
const entry = await environment.createEntry('blogPost', {
  fields: {
    title: {
      'en-US': 'Hello World',
      'de-DE': 'Hallo Welt',
      'fr-FR': 'Bonjour le Monde',
    },
  },
});
```

### Locale-Specific Queries

```typescript
// Get all available locales
const locales = await client.getLocales();

// Check if content exists in locale
const entry = await client.getEntry('entry-id');
const hasGerman = entry.fields.title && entry.fields.title['de-DE'];
```

---

## Preview API

The Preview API allows viewing unpublished content.

```typescript
const previewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN,
  host: 'preview.contentful.com',
});

// Fetch draft content
const draftEntry = await previewClient.getEntry('entry-id');
```

---

## Webhooks

Webhooks notify external services when content changes.

### Webhook Events

- `Entry.publish`
- `Entry.unpublish`
- `Entry.save`
- `Entry.delete`
- `Asset.publish`
- `Asset.unpublish`

### Handling Webhooks

```typescript
// Next.js API route
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify webhook signature
  const signature = req.headers['x-contentful-webhook-signature'];

  if (!verifySignature(req.body, signature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { sys, fields } = req.body;

  // Handle different events
  switch (req.headers['x-contentful-topic']) {
    case 'ContentManagement.Entry.publish':
      // Trigger revalidation or cache clear
      await revalidatePage(fields.slug['en-US']);
      break;
    case 'ContentManagement.Entry.unpublish':
      await removePage(fields.slug['en-US']);
      break;
  }

  res.status(200).json({ received: true });
}

function verifySignature(body: string, signature: string): boolean {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET);
  hmac.update(body);
  const expected = hmac.digest('hex');
  return signature === expected;
}
```

---

## GraphQL

Contentful provides a GraphQL API for type-safe queries.

```typescript
const query = `
  query {
    blogPostCollection(limit: 10) {
      items {
        sys {
          id
        }
        title
        slug
        author {
          name
          avatar {
            url
          }
        }
        featuredImage {
          url
        }
      }
    }
  }
`;

const response = await fetch(
  `https://graphql.contentful.com/content/v1/spaces/${spaceId}`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query }),
  }
);

const data = await response.json();
```

---

## Best Practices

### Environment Management

```typescript
// config/contentful.ts
const environments = {
  development: {
    space: 'dev-space-id',
    accessToken: process.env.CONTENTFUL_DEV_TOKEN,
    environment: 'develop',
  },
  staging: {
    space: 'staging-space-id',
    accessToken: process.env.CONTENTFUL_STAGING_TOKEN,
    environment: 'staging',
  },
  production: {
    space: 'prod-space-id',
    accessToken: process.env.CONTENTFUL_PROD_TOKEN,
    environment: 'master',
  },
};

export const getConfig = (env: string) => environments[env];
```

### Error Handling

```typescript
async function safeFetchEntries(query: any) {
  try {
    const entries = await client.getEntries(query);
    return { success: true, data: entries };
  } catch (error) {
    if (error.name === 'NotFound') {
      return { success: false, error: 'Content not found' };
    }
    if (error.name === 'AccessTokenInvalid') {
      return { success: false, error: 'Invalid credentials' };
    }
    console.error('Contentful error:', error);
    return { success: false, error: 'Unknown error' };
  }
}
```

### Caching Strategy

```typescript
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes

async function getCachedEntries(query: any) {
  const key = JSON.stringify(query);
  const cached = cache.get(key);

  if (cached) {
    return cached;
  }

  const entries = await client.getEntries(query);
  cache.set(key, entries);
  return entries;
}

// Invalidate on webhook
export async function invalidateCache(contentType: string) {
  const keys = cache.keys().filter(key => key.includes(contentType));
  cache.del(keys);
}
```

### Type Generation

```bash
# Generate TypeScript types from content model
npx cf-content-types-generator -s <space-id> -t <management-token>
```

```typescript
// types/contentful.ts
export interface TypeBlogPost {
  contentTypeId: 'blogPost';
  fields: {
    title: Contentful.EntryFields.Symbol;
    slug: Contentful.EntryFields.Symbol;
    content: Contentful.EntryFields.RichText;
    author: Contentful.Entry<TypeAuthor>;
    tags: Contentful.Entry<TypeTag>[];
  };
}
```

---

## React Integration

### Custom Hook

```tsx
import { useEffect, useState } from 'react';
import { createClient } from 'contentful';

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN!,
});

export function useContentfulEntries(contentType: string, query: any = {}) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEntries() {
      try {
        const response = await client.getEntries({
          content_type: contentType,
          ...query,
        });
        setEntries(response.items);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, [contentType, JSON.stringify(query)]);

  return { entries, loading, error };
}

// Usage
function BlogList() {
  const { entries, loading, error } = useContentfulEntries('blogPost', {
    limit: 10,
    order: '-fields.publishDate',
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {entries.map(post => (
        <article key={post.sys.id}>
          <h2>{post.fields.title}</h2>
        </article>
      ))}
    </div>
  );
}
```

### Next.js Integration

```tsx
// app/blog/[slug]/page.tsx
import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

export async function generateStaticParams() {
  const posts = await client.getEntries({
    content_type: 'blogPost',
  });

  return posts.items.map(post => ({
    slug: post.fields.slug,
  }));
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const posts = await client.getEntries({
    content_type: 'blogPost',
    'fields.slug': params.slug,
    include: 2,
  });

  const post = posts.items[0];

  if (!post) {
    notFound();
  }

  return (
    <article>
      <h1>{post.fields.title}</h1>
      <RichTextContent document={post.fields.content} />
    </article>
  );
}
```

---

## Image Optimization

### URL Parameters

```typescript
function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpg' | 'png' | 'webp' | 'avif';
    fit?: 'pad' | 'fill' | 'crop' | 'thumb';
  }
): string {
  const params = new URLSearchParams();

  if (options.width) params.set('w', String(options.width));
  if (options.height) params.set('h', String(options.height));
  if (options.quality) params.set('q', String(options.quality));
  if (options.format) params.set('fm', options.format);
  if (options.fit) params.set('fit', options.fit);

  return `${url}?${params.toString()}`;
}

// Usage
const thumbnail = getOptimizedImageUrl(asset.fields.file.url, {
  width: 400,
  height: 300,
  quality: 80,
  format: 'webp',
  fit: 'crop',
});
```

### Responsive Images

```tsx
function ResponsiveImage({ asset, alt }: { asset: Asset; alt: string }) {
  const srcSet = [400, 800, 1200, 1600]
    .map(width => {
      const url = `${asset.fields.file.url}?w=${width}&q=80&fm=webp`;
      return `${url} ${width}w`;
    })
    .join(', ');

  return (
    <img
      src={`${asset.fields.file.url}?w=800&q=80&fm=webp`}
      srcSet={srcSet}
      sizes="(max-width: 768px) 100vw, 50vw"
      alt={alt}
      loading="lazy"
    />
  );
}
```

---

## Troubleshooting

### Common Issues

**Rate Limiting:**
- CDA: 55 requests/second per space
- CMA: 7 requests/second per space
- Implement caching and request batching

**Content Not Found:**
- Check content type ID spelling
- Verify entry is published
- Check locale settings

**Image Not Loading:**
- Verify asset is published
- Check image URL construction
- Validate file format support

---

## Resources

- [Contentful Documentation](https://www.contentful.com/developers/docs/)
- [Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/)
- [Content Management API](https://www.contentful.com/developers/docs/references/content-management-api/)
- [JavaScript SDK](https://github.com/contentful/contentful.js)
- [Rich Text](https://www.contentful.com/developers/docs/concepts/rich-text/)

---

## Version Information

- **JavaScript SDK Version:** 10.x
- **Content Delivery API:** v1
- **Content Management API:** v1
- **License:** MIT
- **TypeScript:** Full support
