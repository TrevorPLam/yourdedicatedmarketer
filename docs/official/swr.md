# SWR Documentation

**Repository Version:** ^2.3.0  
**Official Documentation:** https://swr.vercel.app  
**Last Updated:** April 2026

## Overview

SWR (stale-while-revalidate) is a React Hooks library for data fetching that implements the stale-while-revalidate HTTP cache invalidation strategy. It provides automatic caching, revalidation, focus tracking, refetching on interval, and more, making data fetching in React simple, fast, and reusable.

### Core Philosophy

SWR believes in the "stale-while-revalidate" strategy: serve cached (stale) data first for fast UI rendering, then fetch fresh data and update the UI. This approach provides instant feedback while ensuring data eventually becomes consistent.

### Why SWR?

- **Automatic Caching**: Built-in caching with smart invalidation
- **Real-Time Updates**: Revalidate on focus, reconnect, or interval
- **Request Deduplication**: Avoid duplicate requests
- **Pagination**: Built-in support for paginated data
- **TypeScript**: First-class TypeScript support
- **Lightweight**: Small bundle size (~4KB gzipped)

---

## Installation

### Package Installation

```bash
# Core
pnpm add swr

# With Zod validation
pnpm add swr zod
```

### Repository Setup

In `pnpm-workspace.yaml`:

```yaml
catalog:
  swr: '^2.3.0'
```

In package `package.json`:

```json
{
  "dependencies": {
    "swr": "catalog:"
  }
}
```

---

## Basic Usage

### useSWR Hook

```typescript
import useSWR from 'swr';

// Fetcher function
const fetcher = (url: string) => fetch(url).then((res) => res.json());

function Profile() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher);
  
  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;
  
  return <div>Hello {data.name}!</div>;
}
```

### Global Configuration

```typescript
// app/providers.tsx
import { SWRConfig } from 'swr';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then((res) => res.json()),
        suspense: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshInterval: 30000,
        dedupingInterval: 2000,
        errorRetryCount: 3,
        errorRetryInterval: 5000,
        loadingTimeout: 3000,
      }}
    >
      {children}
    </SWRConfig>
  );
}
```

---

## Core API

### useSWR

```typescript
import useSWR from 'swr';

const { data, error, isLoading, mutate } = useSWR(
  key,           // unique key (string, array, function, null)
  fetcher,       // fetcher function
  options        // configuration options
);
```

### Return Values

```typescript
const {
  data,          // Fetched data (undefined while loading)
  error,         // Error if request failed
  isLoading,     // Boolean: is data loading
  isValidating,  // Boolean: is revalidating
  mutate,        // Function to mutate cached data
} = useSWR('/api/data', fetcher);
```

### Key Patterns

```typescript
// String key
useSWR('/api/user', fetcher);

// Array key (useful for multiple params)
useSWR(['/api/user', id], ([url, id]) => fetch(`${url}/${id}`));

// Function key (conditional fetching)
useSWR(() => shouldFetch ? '/api/data' : null, fetcher);

// Null key (pause fetching)
useSWR(shouldFetch ? '/api/data' : null, fetcher);
```

---

## Fetching Strategies

### Conditional Fetching

```typescript
// Only fetch when userId exists
const { data: user } = useSWR(
  userId ? `/api/users/${userId}` : null,
  fetcher
);

// Dependent fetching (wait for first request)
const { data: user } = useSWR('/api/user', fetcher);
const { data: orders } = useSWR(
  user ? `/api/orders/${user.id}` : null,
  fetcher
);
```

### Dependent Fetching

```typescript
function Dashboard() {
  const { data: user, error: userError } = useSWR('/api/user', fetcher);
  
  // Fetch projects after user loads
  const { data: projects } = useSWR(
    user ? `/api/projects?userId=${user.id}` : null,
    fetcher
  );
  
  // Fetch team after projects load
  const { data: team } = useSWR(
    projects?.[0]?.teamId ? `/api/teams/${projects[0].teamId}` : null,
    fetcher
  );
  
  // Render states
  if (userError) return <div>Failed to load user</div>;
  if (!user || !projects || !team) return <div>Loading...</div>;
  
  return <DashboardView user={user} projects={projects} team={team} />;
}
```

---

## Mutation

### Local Mutation

```typescript
const { data, mutate } = useSWR('/api/user', fetcher);

// Update locally without revalidation
mutate(
  { ...data, name: 'New Name' },
  false // Don't revalidate
);

// Update and revalidate
mutate({ ...data, name: 'New Name' });

// Optimistic update
mutate(
  async (currentData) => {
    const newData = { ...currentData, name: 'New Name' };
    await updateUser(newData);
    return newData;
  },
  {
    optimisticData: (current) => ({ ...current, name: 'New Name' }),
    rollbackOnError: true,
  }
);
```

### Global Mutation

```typescript
import { mutate } from 'swr';

// Update specific cache key
mutate('/api/user', updateUser(newData), false);

// Revalidate multiple keys matching pattern
import { useSWRConfig } from 'swr';

function RefreshButton() {
  const { mutate } = useSWRConfig();
  
  return (
    <button onClick={() => mutate((key) => key?.startsWith('/api/'))}>
      Refresh All
    </button>
  );
}
```

---

## Configuration Options

### Revalidation

```typescript
useSWR('/api/data', fetcher, {
  // Revalidate on window focus
  revalidateOnFocus: true,
  
  // Revalidate on reconnect
  revalidateOnReconnect: true,
  
  // Revalidate when mounting (even if cached)
  revalidateIfStale: true,
  
  // Refresh interval (polling)
  refreshInterval: 30000,
  
  // Refresh when window is visible
  refreshWhenHidden: false,
  
  // Refresh when offline
  refreshWhenOffline: false,
});
```

### Error Handling

```typescript
useSWR('/api/data', fetcher, {
  // Error retry count
  errorRetryCount: 3,
  
  // Error retry interval
  errorRetryInterval: 5000,
  
  // Custom retry function
  onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
    // Don't retry on 404
    if (error.status === 404) return;
    
    // Retry after 5 seconds
    setTimeout(() => revalidate({ retryCount }), 5000);
  },
  
  // Error callback
  onError: (error, key) => {
    console.error('SWR Error:', key, error);
  },
});
```

### Deduping

```typescript
useSWR('/api/data', fetcher, {
  // Dedupe interval (requests within this window share the same promise)
  dedupingInterval: 2000,
  
  // Keep previous data while loading new data
  keepPreviousData: true,
  
  // Suspend until data is ready
  suspense: false,
  
  // Loading timeout
  loadingTimeout: 3000,
});
```

---

## Advanced Features

### Pagination

```typescript
import useSWRInfinite from 'swr/infinite';

// Get key for each page
const getKey = (pageIndex: number, previousPageData: any) => {
  // Reached the end
  if (previousPageData && !previousPageData.length) return null;
  
  // First page
  if (pageIndex === 0) return '/api/posts?page=1';
  
  // Next page
  return `/api/posts?page=${pageIndex + 1}`;
};

function Posts() {
  const { data, size, setSize } = useSWRInfinite(getKey, fetcher);
  
  const posts = data ? data.flat() : [];
  const isLoadingMore = data && typeof data[size - 1] === 'undefined';
  
  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      <button
        onClick={() => setSize(size + 1)}
        disabled={isLoadingMore}
      >
        {isLoadingMore ? 'Loading...' : 'Load More'}
      </button>
    </div>
  );
}
```

### Immutable Data

```typescript
import useSWRImmutable from 'swr/immutable';

// Data won't revalidate automatically
const { data } = useSWRImmutable('/api/config', fetcher);

// Still can revalidate manually
const { data, mutate } = useSWRImmutable('/api/config', fetcher);

// Later
mutate();
```

### Preloading

```typescript
import { preload } from 'swr';

// Preload data before component renders
const preloadData = () => {
  preload('/api/data', fetcher);
};

// Usage on hover
<button 
  onMouseEnter={preloadData}
  onClick={() => setShowComponent(true)}
>
  Show Component
</button>
```

### Middleware

```typescript
// Logger middleware
const logger = (useSWRNext: any) => {
  return (key: any, fetcher: any, config: any) => {
    console.log('SWR Request:', key);
    
    const swr = useSWRNext(key, fetcher, config);
    
    console.log('SWR Response:', swr.data);
    
    return swr;
  };
};

// Usage
useSWR('/api/data', fetcher, { use: [logger] });

// Multiple middlewares
useSWR('/api/data', fetcher, {
  use: [logger, auth, cache],
});
```

---

## Best Practices

### Fetcher Patterns

```typescript
// Basic fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Fetcher with authentication
const authFetcher = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  }).then((res) => res.json());

// Fetcher with error handling
const errorFetcher = async (url: string) => {
  const res = await fetch(url);
  
  if (!res.ok) {
    const error = new Error('An error occurred');
    error.status = res.status;
    throw error;
  }
  
  return res.json();
};

// POST request as mutation
const sendRequest = (url: string, { arg }: { arg: any }) =>
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  }).then((res) => res.json());

// Usage with useSWRMutation
import useSWRMutation from 'swr/mutation';

const { trigger } = useSWRMutation('/api/user', sendRequest);

// Later
trigger({ name: 'New Name' });
```

### Type Safety

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

// Typed SWR hook
const fetcher = (url: string): Promise<User> =>
  fetch(url).then((res) => res.json());

function useUser(id: string) {
  const { data, error } = useSWR<User>(
    id ? `/api/users/${id}` : null,
    fetcher
  );
  
  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  };
}
```

### Loading States

```typescript
function Profile() {
  const { data, error, isLoading, isValidating } = useSWR('/api/user', fetcher);
  
  // Initial loading
  if (isLoading) return <Skeleton />;
  
  // Error
  if (error) return <ErrorMessage error={error} />;
  
  // Data with background revalidation indicator
  return (
    <div>
      {isValidating && <Spinner />}
      <h1>{data.name}</h1>
    </div>
  );
}
```

---

## Integration Examples

### With TanStack Query Comparison

```typescript
// SWR
const { data, error, isLoading } = useSWR('/api/data', fetcher);

// Similar to TanStack Query
const { data, error, isLoading } = useQuery({
  queryKey: ['/api/data'],
  queryFn: fetcher,
});

// Key differences:
// - SWR: Automatic deduping, simpler API
// - TanStack Query: More features (dev tools, mutation helpers)
```

### With Zod Validation

```typescript
import { z } from 'zod';

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  return userSchema.parse(data);
};

const { data: user } = useSWR('/api/user', fetcher);
// user is typed as { id: string, name: string, email: string }
```

---

## Resources

- **Official Docs**: https://swr.vercel.app
- **GitHub**: https://github.com/vercel/swr
- **Examples**: https://github.com/vercel/swr/tree/main/examples

---

## Version Notes

- **v2.3.x**: Current stable with improved TypeScript support
- Repository uses catalog version `^2.3.0`
