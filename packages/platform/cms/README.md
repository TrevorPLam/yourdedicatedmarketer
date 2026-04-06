# @agency/platform-cms

Multi-provider CMS adapters and utilities with 2026 best practices for marketing
agency operations.

## Features

- 🔄 **Provider-Agnostic**: Unified interface for Contentful, Sanity, and custom
  CMS providers
- 🚀 **Real-Time Updates**: Live content synchronization with Sanity, webhook
  support for Contentful
- 🔧 **Type Generation**: Automated TypeScript type generation from CMS schemas
- 👁️ **Preview Mode**: Draft mode and content preview system with real-time
  updates
- 🛡️ **Type Safety**: Full TypeScript support with comprehensive error handling
- ⚡ **Performance Optimized**: Built-in caching, retry logic, and connection
  pooling
- 🔍 **Health Monitoring**: Comprehensive health checks and monitoring
  capabilities

## Supported Providers

- **Contentful** v11.0+ - GraphQL and REST API support
- **Sanity** v6.24+ - Real-time updates, GROQ queries
- **Custom** - Extensible adapter system for any headless CMS

## Quick Start

### Installation

```bash
pnpm add @agency/platform-cms
```

### Basic Usage

```typescript
import {
  createCMSAdapter,
  ContentfulAdapter,
  SanityAdapter,
} from '@agency/platform-cms';

// Contentful
const contentfulAdapter = createCMSAdapter({
  provider: 'contentful',
  spaceId: 'your-space-id',
  accessToken: 'your-access-token',
  environment: 'master',
});

// Sanity
const sanityAdapter = createCMSAdapter({
  provider: 'sanity',
  projectId: 'your-project-id',
  dataset: 'production',
  apiVersion: '2024-01-01',
});

// Initialize and connect
await contentfulAdapter.initialize();
await contentfulAdapter.connect();

// Fetch content
const content = await contentfulAdapter.getContent('article-id');
const articles = await contentfulAdapter.queryContent({
  contentType: 'article',
  limit: 10,
  sort: [{ field: 'publishedAt', direction: 'desc' }],
});
```

## Advanced Usage

### Type Generation

```typescript
import { generateTypes } from '@agency/platform-cms';

// Generate TypeScript types from CMS schema
await generateTypes(contentfulAdapter, './src/types/cms');
```

### Preview Mode

```typescript
import { createCMSPreviewManager } from '@agency/platform-cms';

const previewManager = createCMSPreviewManager(contentfulAdapter, {
  enabled: true,
  draftMode: true,
  previewToken: 'your-preview-token',
  refreshInterval: 30,
});

// Enable preview mode
await previewManager.enablePreview();

// Subscribe to real-time changes
const subscription = await previewManager.subscribeToContent(
  { contentType: 'article' },
  (change) => {
    console.log('Content changed:', change);
  }
);
```

### Real-Time Updates (Sanity)

```typescript
// Subscribe to content changes
const subscription = await sanityAdapter.subscribe(
  { contentType: 'post' },
  (change) => {
    switch (change.type) {
      case 'created':
        console.log('New post created:', change.data);
        break;
      case 'updated':
        console.log('Post updated:', change.data);
        break;
      case 'deleted':
        console.log('Post deleted:', change.contentId);
        break;
    }
  }
);

// Unsubscribe when done
await sanityAdapter.unsubscribe(subscription);
```

## Configuration

### Contentful Configuration

```typescript
interface ContentfulConfig {
  provider: 'contentful';
  spaceId: string;
  accessToken: string;
  environment?: string;
  previewAccessToken?: string;
  host?: string;
  resolveLinks?: boolean;
  removeUnresolved?: boolean;
}
```

### Sanity Configuration

```typescript
interface SanityConfig {
  provider: 'sanity';
  projectId: string;
  dataset: string;
  apiVersion: string;
  useCdn?: boolean;
  token?: string;
  perspective?: string;
}
```

### Cache Configuration

```typescript
interface CacheConfig {
  enabled: boolean;
  ttl?: number; // Time to live in seconds
  strategy?: 'memory' | 'redis' | 'file';
  maxSize?: number;
}
```

## API Reference

### CMSAdapter Interface

```typescript
interface CMSAdapter {
  // Lifecycle
  initialize(config: CMSConfig): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;

  // Content operations
  getContent<T>(
    id: string,
    options?: ContentQueryOptions
  ): Promise<ContentResult<T>>;
  queryContent<T>(
    query: ContentQuery,
    options?: ContentQueryOptions
  ): Promise<ContentCollection<T>>;
  setContent<T>(
    id: string,
    content: T,
    options?: SetContentOptions
  ): Promise<ContentResult<T>>;
  deleteContent(id: string): Promise<boolean>;

  // Real-time updates
  subscribe(
    query: ContentQuery,
    callback: ContentChangeCallback
  ): Promise<ContentSubscription>;
  unsubscribe(subscription: ContentSubscription): Promise<void>;

  // Schema and types
  getContentTypes(): Promise<ContentType[]>;
  generateTypes(): Promise<TypeScriptTypes>;

  // Health monitoring
  healthCheck(): Promise<CMSHealth>;
}
```

### Content Query Interface

```typescript
interface ContentQuery {
  contentType?: string;
  locale?: string;
  filters?: Record<string, any>;
  sort?: SortOption[];
  search?: string;
  fields?: string[];
  limit?: number;
  offset?: number;
}
```

## Examples

### Blog Post Management

```typescript
// Fetch published blog posts
const posts = await adapter.queryContent({
  contentType: 'blogPost',
  filters: { status: 'published' },
  sort: [{ field: 'publishedAt', direction: 'desc' }],
  limit: 10,
});

// Create a new blog post
const newPost = await adapter.setContent('new', {
  title: 'My New Post',
  slug: 'my-new-post',
  content: 'This is the content...',
  author: 'John Doe',
  publishedAt: new Date().toISOString(),
});

// Update existing post
const updatedPost = await adapter.setContent('post-id', {
  title: 'Updated Title',
  content: 'Updated content...',
});
```

### Multi-Language Content

```typescript
// Fetch content in multiple locales
const englishContent = await adapter.getContent('page-id', { locale: 'en-US' });
const spanishContent = await adapter.getContent('page-id', { locale: 'es-ES' });

// Query content across all locales
const allLocales = await adapter.queryContent({
  contentType: 'page',
  locale: '*',
});
```

### Error Handling

```typescript
import {
  CMSError,
  ContentNotFoundError,
  ValidationError,
} from '@agency/platform-cms';

try {
  const content = await adapter.getContent('non-existent-id');
} catch (error) {
  if (error instanceof ContentNotFoundError) {
    console.log('Content not found');
  } else if (error instanceof ValidationError) {
    console.log('Validation failed:', error.validationErrors);
  } else if (error instanceof CMSError) {
    console.log('CMS error:', error.message);
  }
}
```

## Best Practices

### 1. Connection Management

```typescript
// Always initialize and connect before using
await adapter.initialize(config);
await adapter.connect();

// Properly disconnect when done
await adapter.disconnect();
```

### 2. Error Handling

```typescript
// Use retry logic for transient errors
try {
  const content = await adapter.getContent(id);
} catch (error) {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    // Wait and retry
    await new Promise((resolve) =>
      setTimeout(resolve, error.retryAfter * 1000)
    );
    return adapter.getContent(id);
  }
  throw error;
}
```

### 3. Type Safety

```typescript
// Generate types for better type safety
await generateTypes(adapter);

// Use generated types
interface BlogPost {
  title: string;
  slug: string;
  content: string;
  author: string;
  publishedAt: string;
}

const post = await adapter.getContent<BlogPost>('post-id');
console.log(post.content.title); // Fully typed
```

### 4. Performance Optimization

```typescript
// Use specific fields to reduce payload size
const posts = await adapter.queryContent({
  contentType: 'blogPost',
  fields: ['title', 'slug', 'publishedAt'],
  limit: 10,
});

// Use caching for frequently accessed content
const config = {
  cache: {
    enabled: true,
    ttl: 300, // 5 minutes
    strategy: 'memory',
  },
};
```

## Development

### Building

```bash
pnpm build
```

### Testing

```bash
pnpm test
pnpm test:coverage
```

### Type Generation

```bash
# Generate types for Contentful
pnpm generate:contentful

# Generate types for Sanity
pnpm generate:sanity

# Generate types from custom schema
pnpm generate:types
```

## License

MIT © 2026 Your Agency Name
