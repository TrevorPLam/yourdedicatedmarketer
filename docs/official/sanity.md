# Sanity

Sanity is a composable content cloud that treats content as data. It provides a real-time content operating system with a fully customizable editing environment and powerful APIs for delivering content anywhere.

---

## Overview

**Sanity** is a **structured content platform** built around a real-time database. It offers a customizable editing interface, powerful querying capabilities with GROQ (Graph-Relational Object Queries), and seamless integration with modern development workflows.

### Key Features

- **Real-time** - Live content updates
- **Structured Content** - Content as data, not blobs
- **GROQ** - Powerful query language
- **Portable Text** - Structured rich text format
- **Hotspot & Crop** - Image focal point editing
- **Real-time Collaboration** - Multi-user editing
- **Customizable Studio** - Configurable editing UI
- **Strong Typing** - Schema-first content model

### When to Use Sanity

Sanity is ideal for:

- Real-time collaborative editing
- Content-heavy applications
- Structured content needs
- Multi-platform content delivery
- Headless CMS implementations
- Content with complex relationships
- Teams needing custom editorial workflows

---

## Getting Started

### Installation

```bash
# Install Sanity CLI globally
npm install -g @sanity/cli

# Initialize a new project
sanity init

# Install client library
npm install @sanity/client
# or
yarn add @sanity/client
# or
pnpm add @sanity/client
```

### Quick Start

```typescript
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'your-project-id',
  dataset: 'production',
  apiVersion: '2024-03-15',
  useCdn: true,
  token: process.env.SANITY_TOKEN, // For write operations
});

// Fetch documents
const posts = await client.fetch(`
  *[_type == "post"] {
    _id,
    title,
    slug,
    publishedAt,
    "author": author->name,
    "categories": categories[]->title
  }
`);
```

---

## Core Concepts

### Projects & Datasets

A **Project** is your content workspace. Each project contains **Datasets** that hold your actual content.

```typescript
const client = createClient({
  projectId: 'abc123',        // Your project ID
  dataset: 'production',      // Dataset name
  apiVersion: '2024-03-15',   // API version date
  useCdn: true,               // Use CDN for reads
  perspective: 'published',     // 'published' or 'drafts' or 'previewDrafts'
});
```

**Dataset Types:**
- `production` - Live content
- `staging` - Development content
- `drafts` - Unpublished changes

### Schemas

**Schemas** define the structure and validation of your content types.

```typescript
// schemas/post.ts
export default {
  name: 'post',
  type: 'document',
  title: 'Blog Post',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required().max(100),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'author',
      type: 'reference',
      title: 'Author',
      to: [{ type: 'author' }],
    },
    {
      name: 'mainImage',
      type: 'image',
      title: 'Main Image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        },
      ],
    },
    {
      name: 'categories',
      type: 'array',
      title: 'Categories',
      of: [{ type: 'reference', to: { type: 'category' } }],
    },
    {
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published At',
    },
    {
      name: 'body',
      type: 'array',
      title: 'Body',
      of: [
        { type: 'block' },
        { type: 'image' },
        {
          type: 'object',
          name: 'codeBlock',
          fields: [
            { name: 'language', type: 'string' },
            { name: 'code', type: 'text' },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare({ title, author, media }) {
      return {
        title,
        subtitle: `by ${author}`,
        media,
      };
    },
  },
};
```

**Field Types:**

| Type | Description | Use Case |
|------|-------------|----------|
| `string` | Text input | Titles, names |
| `text` | Multiline text | Descriptions |
| `number` | Numeric input | Prices, quantities |
| `boolean` | True/false | Feature flags |
| `datetime` | Date/time picker | Publish dates |
| `slug` | URL-friendly string | URLs, IDs |
| `url` | URL input | Links |
| `email` | Email validation | Contact info |
| `reference` | Link to other documents | Relations |
| `array` | List of items | Tags, categories |
| `object` | Nested structure | Complex data |
| `image` | Image with hotspot | Photos |
| `file` | File upload | Downloads |
| `block` | Rich text blocks | Content body |

### Documents

**Documents** are instances of schema types containing your content.

```typescript
// Fetch a single document
const post = await client.fetch(`
  *[_type == "post" && slug.current == $slug][0]
`, { slug: 'my-post' });

// Fetch multiple documents
const posts = await client.fetch(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)
`);
```

---

## GROQ (Graph-Relational Object Queries)

GROQ is Sanity's query language for filtering, joining, and transforming document data.

### Basic Queries

```typescript
// All documents of a type
const posts = await client.fetch(`*[_type == "post"]`);

// Filter by field
const published = await client.fetch(`
  *[_type == "post" && published == true]
`);

// Filter by date range
const recent = await client.fetch(`
  *[_type == "post" && publishedAt > $date]
`, { date: '2024-01-01' });

// Full-text search
const results = await client.fetch(`
  *[_type == "post" && [title, body] match $search]
`, { search: 'search term*' });
```

### Projections

```typescript
// Select specific fields
const posts = await client.fetch(`
  *[_type == "post"] {
    _id,
    title,
    "slug": slug.current
  }
`);

// Rename fields
const posts = await client.fetch(`
  *[_type == "post"] {
    "postTitle": title,
    "postSlug": slug.current
  }
`);

// Computed fields
const posts = await client.fetch(`
  *[_type == "post"] {
    ...,
    "wordCount": length(string::split(pt::text(body), " "))
  }
`);
```

### References & Joins

```typescript
// Resolve references (dereference)
const posts = await client.fetch(`
  *[_type == "post"] {
    title,
    "author": author->name,
    "authorImage": author->image,
    categories[]-> {
      title,
      description
    }
  }
`);

// Conditional dereference
const posts = await client.fetch(`
  *[_type == "post"] {
    title,
    author-> {
      name,
      "isFeatured": featured == true
    }
  }
`);
```

### Ordering & Pagination

```typescript
// Order results
const posts = await client.fetch(`
  *[_type == "post"] | order(publishedAt desc)
`);

// Multiple sort criteria
const posts = await client.fetch(`
  *[_type == "post"] | order(isFeatured desc, publishedAt desc)
`);

// Pagination with slice
const page1 = await client.fetch(`
  *[_type == "post"] | order(publishedAt desc) [0...10]
`);

const page2 = await client.fetch(`
  *[_type == "post"] | order(publishedAt desc) [10...20]
`);
```

### Advanced Filters

```typescript
// IN operator
const posts = await client.fetch(`
  *[_type == "post" && status in ["published", "featured"]]
`);

// Comparison operators
const posts = await client.fetch(`
  *[_type == "post" && publishedAt > "2024-01-01" && publishedAt < "2024-12-31"]
`);

// Array containment
const posts = await client.fetch(`
  *[_type == "post" && "technology" in tags]
`);

// Existence check
const posts = await client.fetch(`
  *[_type == "post" && defined(body)]
`);

// Regex matching
const posts = await client.fetch(`
  *[_type == "post" && title match "^The.*"]
`);
```

### Aggregations

```typescript
// Count documents
const count = await client.fetch(`
  count(*[_type == "post"])
`);

// Group by category
const categories = await client.fetch(`
  *[_type == "category"] {
    title,
    "postCount": count(*[_type == "post" && references(^._id)])
  }
`);
```

---

## Portable Text

Portable Text is Sanity's structured rich text format - a JSON-based specification for rich text editing.

### Structure

```json
{
  "_type": "block",
  "style": "normal",
  "children": [
    {
      "_type": "span",
      "text": "Hello ",
      "marks": []
    },
    {
      "_type": "span",
      "text": "world",
      "marks": ["strong"]
    }
  ]
}
```

### Rendering Portable Text

```tsx
import { PortableText } from '@portabletext/react';

const components = {
  types: {
    image: ({ value }) => (
      <img
        src={urlFor(value).width(800).url()}
        alt={value.alt || ''}
      />
    ),
    codeBlock: ({ value }) => (
      <pre className={`language-${value.language}`}>
        <code>{value.code}</code>
      </pre>
    ),
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => <code>{children}</code>,
    link: ({ value, children }) => (
      <a href={value.href}>{children}</a>
    ),
  },
  block: {
    h1: ({ children }) => <h1>{children}</h1>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    normal: ({ children }) => <p>{children}</p>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
};

function PostBody({ content }) {
  return <PortableText value={content} components={components} />;
}
```

### Custom Blocks

```typescript
// Schema definition
{
  name: 'callout',
  type: 'object',
  title: 'Callout',
  fields: [
    {
      name: 'type',
      type: 'string',
      options: {
        list: [
          { title: 'Info', value: 'info' },
          { title: 'Warning', value: 'warning' },
          { title: 'Success', value: 'success' },
        ],
      },
    },
    {
      name: 'content',
      type: 'array',
      of: [{ type: 'block' }],
    },
  ],
}

// Component
const components = {
  types: {
    callout: ({ value }) => (
      <div className={`callout callout-${value.type}`}>
        <PortableText value={value.content} />
      </div>
    ),
  },
};
```

---

## Image Handling

### URL Builder

```typescript
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

// Usage
const imageUrl = urlFor(post.mainImage)
  .width(800)
  .height(600)
  .format('webp')
  .quality(80)
  .url();
```

### Image Transformations

```typescript
// Basic resizing
urlFor(image).width(800).height(600);

// Format conversion
urlFor(image).format('webp');
urlFor(image).format('jpg').quality(80);

// Cropping with hotspot
urlFor(image).width(400).height(400).fit('crop');

// Focal point cropping
urlFor(image)
  .width(800)
  .height(400)
  .fit('crop')
  .crop('focalpoint')
  .focalPoint(0.5, 0.5);

// Background fill
urlFor(image).width(800).height(600).fit('fill').bg('ffffff');
```

### Next.js Image Component

```tsx
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';

function SanityImage({ image, alt, width, height, priority = false }) {
  const imageUrl = urlFor(image).width(width).height(height).url();

  return (
    <Image
      src={imageUrl}
      alt={alt || image.alt || ''}
      width={width}
      height={height}
      priority={priority}
      className="object-cover"
    />
  );
}
```

---

## Mutations (Write Operations)

### Creating Documents

```typescript
// Create a document
const doc = await client.create({
  _type: 'post',
  title: 'My New Post',
  slug: { _type: 'slug', current: 'my-new-post' },
  publishedAt: new Date().toISOString(),
});

// Create with ID
const doc = await client.createOrReplace({
  _id: 'post.my-new-post',
  _type: 'post',
  title: 'My New Post',
});
```

### Updating Documents

```typescript
// Patch operations
await client
  .patch('document-id')
  .set({ title: 'Updated Title' })
  .setIfMissing({ tags: [] })
  .insert('after', 'tags[-1]', ['new-tag'])
  .commit();

// Append to array
await client
  .patch('document-id')
  .append('categories', [{ _type: 'reference', _ref: 'category-id' }])
  .commit();

// Increment number
await client
  .patch('document-id')
  .inc({ viewCount: 1 })
  .commit();

// Conditional update
await client
  .patch('document-id')
  .set({ status: 'published' })
  .ifRevisionId('previous-revision')
  .commit();
```

### Deleting Documents

```typescript
// Delete by ID
await client.delete('document-id');

// Delete multiple
await client.delete({
  query: '*[_type == "post" && publishedAt < $date]',
  params: { date: '2020-01-01' },
});
```

### Transactions

```typescript
import { Transaction } from '@sanity/client';

const transaction = client.transaction();

transaction.create({
  _type: 'post',
  title: 'Post 1',
});

transaction.create({
  _type: 'post',
  title: 'Post 2',
});

transaction.patch('existing-doc', {
  set: { updatedAt: new Date().toISOString() },
});

await transaction.commit();
```

---

## Real-time Listeners

### Subscribe to Changes

```typescript
import { listen } from '@sanity/client';

// Subscribe to all changes
const subscription = client.listen(`*[_type == "post"]`).subscribe((update) => {
  console.log('Update:', update);
  // { documentId, transition: 'appear' | 'disappear' | 'update', result }
});

// Subscribe with specific transitions
const subscription = client
  .listen(`*[_type == "post"]`, {}, { events: ['welcome', 'mutation', 'reconnect'] })
  .subscribe(console.log);

// Unsubscribe
subscription.unsubscribe();
```

### React Hook

```tsx
import { useEffect, useState } from 'react';

function useSanitySubscription(query: string) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const subscription = client.listen(query).subscribe((update) => {
      if (update.transition === 'update') {
        setData((prev) =>
          prev.map((item) =>
            item._id === update.result._id ? update.result : item
          )
        );
      } else if (update.transition === 'appear') {
        setData((prev) => [...prev, update.result]);
      } else if (update.transition === 'disappear') {
        setData((prev) => prev.filter((item) => item._id !== update.documentId));
      }
    });

    return () => subscription.unsubscribe();
  }, [query]);

  return data;
}
```

---

## React Integration

### Custom Hook

```tsx
import { useEffect, useState } from 'react';
import { client } from '@/lib/sanity';

export function useSanityQuery<T>(
  query: string,
  params?: Record<string, any>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await client.fetch<T>(query, params);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [query, JSON.stringify(params)]);

  return { data, loading, error };
}

// Usage
function PostList() {
  const { data: posts, loading, error } = useSanityQuery(`
    *[_type == "post"] {
      _id,
      title,
      slug,
      publishedAt
    }
  `);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {posts?.map((post) => (
        <li key={post._id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### Next.js Integration

```tsx
// lib/sanity.ts
import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-15',
  useCdn: true,
});

// app/blog/[slug]/page.tsx
import { client } from '@/lib/sanity';

export async function generateStaticParams() {
  const slugs = await client.fetch(`
    *[_type == "post" && defined(slug.current)].slug.current
  `);

  return slugs.map((slug) => ({ slug }));
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]`,
    { slug: params.slug }
  );

  if (!post) {
    notFound();
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <PortableText value={post.body} />
    </article>
  );
}
```

---

## Best Practices

### Environment Configuration

```typescript
// lib/sanity.ts
const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-15',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
};

export const client = createClient(config);

// Preview client for draft content
export const previewClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_PREVIEW_TOKEN,
  perspective: 'previewDrafts',
});
```

### Caching Strategy

```typescript
import { client } from '@/lib/sanity';

export async function getPosts() {
  return client.fetch(
    `*[_type == "post" && publishedAt < now()] | order(publishedAt desc)`,
    {},
    { cache: 'force-cache', next: { revalidate: 60 } }
  );
}

export async function getPost(slug: string) {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0]`,
    { slug },
    { cache: 'force-cache', next: { revalidate: 60 } }
  );
}
```

### Type Generation

```bash
# Generate TypeScript types from schema
npx sanity typegen generate
```

```typescript
// types/sanity.ts
import type { SanityDocument, Image as SanityImage } from 'sanity';

export interface Post extends SanityDocument {
  _type: 'post';
  title: string;
  slug: { current: string };
  author: Author;
  mainImage: SanityImage;
  body: PortableTextBlock[];
}
```

---

## Troubleshooting

### Common Issues

**CORS Errors:**
- Ensure correct API version
- Check project ID and dataset
- Verify token permissions

**Image Not Loading:**
- Verify asset ID exists
- Check image pipeline configuration
- Validate hotspot/crop settings

**Query Errors:**
- Use GROQ syntax checker
- Validate field names in schema
- Check for undefined values

### Debug Queries

```typescript
// Enable debug mode
const client = createClient({
  ...config,
  // Add request tag for debugging
  requestTagPrefix: 'debug',
});

// Log queries
async function debugQuery(query: string, params = {}) {
  console.log('Query:', query);
  console.log('Params:', params);
  const start = Date.now();
  const result = await client.fetch(query, params);
  console.log('Duration:', Date.now() - start, 'ms');
  console.log('Result count:', Array.isArray(result) ? result.length : 1);
  return result;
}
```

---

## Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Reference](https://www.sanity.io/docs/groq)
- [Sanity Studio](https://www.sanity.io/studio)
- [Portable Text](https://www.portabletext.org/)
- [Sanity Learn](https://www.sanity.io/learn)

---

## Version Information

- **Sanity Client:** 6.x
- **Sanity Studio:** 3.x
- **GROQ:** 1.x
- **License:** MIT
- **TypeScript:** Full support
