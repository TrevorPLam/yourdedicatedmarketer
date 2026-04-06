# TanStack Query Documentation

**Repository Version:** ^5.96.0  
**Official Documentation:** https://tanstack.com/query/latest  
**Latest Release:** April 2026

## Overview

TanStack Query (formerly React Query) is a powerful data synchronization library for React applications. It provides a declarative, opinionated, and simple way to fetch, cache, and update server state in your React components.

In this monorepo, TanStack Query serves as the primary solution for server state management, providing a robust foundation for API interactions, data caching, and real-time synchronization across all applications.

## Key Features

### **Data Fetching**
- **Declarative Queries**: Simple, declarative API for data fetching
- **Automatic Caching**: Built-in intelligent caching with background updates
- **Retry Logic**: Automatic retry with exponential backoff
- **Pagination**: Built-in pagination and infinite scrolling support
- **Prefetching**: Data prefetching for improved user experience

### **State Management**
- **Server State**: Dedicated server state management separate from client state
- **Background Updates**: Automatic background refetching with stale-while-revalidate
- **Optimistic Updates**: Immediate UI updates with rollback on failure
- **Mutation Support**: Comprehensive mutation API with side effects

### **Developer Experience**
- **DevTools**: Powerful DevTools for debugging and inspection
- **TypeScript Support**: First-class TypeScript support with full type safety
- **Suspense Integration**: React Suspense integration for async data loading
- **Framework Agnostic**: Works with React, Vue, Solid, and Svelte

## Installation

### Core Dependencies

```bash
# Install TanStack Query
pnpm add @tanstack/react-query@^5.96.0

# Install DevTools (development only)
pnpm add -D @tanstack/react-query-devtools@^5.96.0

# Install ESLint Plugin (recommended)
pnpm add -D @tanstack/eslint-plugin-query@^5.96.0
```

### Basic Setup

```typescript
// src/providers/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
```

### **App Integration**

```typescript
// src/App.tsx
import { QueryProvider } from './providers/QueryProvider';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';

export function App() {
  return (
    <BrowserRouter>
      <QueryProvider>
        <AppRoutes />
      </QueryProvider>
    </BrowserRouter>
  );
}
```

## Basic Usage

### **Simple Query**

```typescript
// src/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../services/api';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

```typescript
// src/components/UserList.tsx
import { useUsers } from '../hooks/useUsers';

export function UserList() {
  const { data: users, isLoading, error, refetch } = useUsers();

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;

  return (
    <div>
      <h2>Users</h2>
      <button onClick={() => refetch()}>Refresh</button>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### **Query with Parameters**

```typescript
// src/hooks/useUser.ts
import { useQuery } from '@tanstack/react-query';
import { getUser } from '../services/api';

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
    enabled: !!id, // Only run query if ID is provided
  });
}
```

### **Mutation**

```typescript
// src/hooks/useCreateUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../services/api';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
    },
  });
}
```

```typescript
// src/components/CreateUserForm.tsx
import { useState } from 'react';
import { useCreateUser } from '../hooks/useCreateUser';

export function CreateUserForm() {
  const [name, setName] = useState('');
  const createUser = useCreateUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser.mutate({ name });
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="User name"
      />
      <button type="submit" disabled={createUser.isPending}>
        {createUser.isPending ? 'Creating...' : 'Create User'}
      </button>
      {createUser.isError && (
        <div>Error: {createUser.error.message}</div>
      )}
      {createUser.isSuccess && (
        <div>User created successfully!</div>
      )}
    </form>
  );
}
```

## Advanced Patterns

### **Optimistic Updates**

```typescript
// src/hooks/useUpdateUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '../services/api';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onMutate: async (newUser) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users'] });

      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData(['users']);

      // Optimistically update to the new value
      queryClient.setQueryData(['users'], (old: any[]) => 
        old?.map(user => 
          user.id === newUser.id ? newUser : user
        )
      );

      // Return a context object with the snapshotted value
      return { previousUsers };
    },
    onError: (err, newUser, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(['users'], context?.previousUsers);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

### **Infinite Queries**

```typescript
// src/hooks/useInfiniteUsers.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { getUsers } from '../services/api';

export function useInfiniteUsers() {
  return useInfiniteQuery({
    queryKey: ['users', 'infinite'],
    queryFn: ({ pageParam = 0 }) => getUsers({ page: pageParam, limit: 10 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 10) return undefined;
      return allPages.length;
    },
  });
}
```

```typescript
// src/components/InfiniteUserList.tsx
import { useInfiniteUsers } from '../hooks/useInfiniteUsers';

export function InfiniteUserList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteUsers();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Users (Infinite)</h2>
      {data?.pages.map((page, i) => (
        <ul key={i}>
          {page.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      ))}
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
            ? 'Load More'
            : 'Nothing more to load'}
        </button>
      </div>
    </div>
  );
}
```

### **Dependent Queries**

```typescript
// src/hooks/useUserPosts.ts
import { useQuery } from '@tanstack/react-query';
import { getUserPosts } from '../services/api';

export function useUserPosts(userId: string) {
  return useQuery({
    queryKey: ['user', userId, 'posts'],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId, // Only run if userId exists
  });
}
```

```typescript
// src/components/UserProfile.tsx
import { useParams } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useUserPosts } from '../hooks/useUserPosts';

export function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading: userLoading } = useUser(id!);
  const { data: posts, isLoading: postsLoading } = useUserPosts(id!);

  if (userLoading || postsLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user?.name}</h1>
      <h2>Posts</h2>
      <ul>
        {posts?.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Configuration

### **QueryClient Configuration**

```typescript
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds that data is considered fresh
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // Time in milliseconds that unused data is garbage collected
      gcTime: 10 * 60 * 1000, // 10 minutes
      
      // Number of retry attempts
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus
      refetchOnWindowFocus: false,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
      
      // Refetch on mount
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
  logger: {
    log: console.log,
    warn: console.warn,
    error: (error) => {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
    },
  },
});
```

### **Custom Query Hook**

```typescript
// src/hooks/useApiQuery.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { apiRequest } from '../services/api';

interface UseApiQueryOptions<TData, TError>
  extends Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> {
  endpoint: string;
  params?: Record<string, any>;
}

export function useApiQuery<TData = any, TError = Error>(
  options: UseApiQueryOptions<TData, TError>
) {
  const { endpoint, params, ...queryOptions } = options;

  return useQuery<TData, TError>({
    queryKey: [endpoint, params],
    queryFn: () => apiRequest<TData>(endpoint, params),
    ...queryOptions,
  });
}
```

### **Custom Mutation Hook**

```typescript
// src/hooks/useApiMutation.ts
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { apiRequest } from '../services/api';

interface UseApiMutationOptions<TData, TError, TVariables>
  extends Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'> {
  endpoint: string;
  method?: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}

export function useApiMutation<TData = any, TError = Error, TVariables = any>(
  options: UseApiMutationOptions<TData, TError, TVariables>
) {
  const { endpoint, method = 'POST', ...mutationOptions } = options;

  return useMutation<TData, TError, TVariables>({
    mutationFn: (variables) => 
      apiRequest<TData>(endpoint, variables, method),
    ...mutationOptions,
  });
}
```

## DevTools Integration

### **DevTools Setup**

```typescript
// src/providers/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
          position="bottom"
        />
      )}
    </QueryClientProvider>
  );
}
```

### **DevTools Features**

- **Query Inspector**: View all active queries and their status
- **Mutation Inspector**: Track mutation states and history
- **Cache Explorer**: Browse cached data and query keys
- **Network Requests**: Monitor API requests and responses
- **Performance Metrics**: Analyze query performance and timing

## Best Practices

### **Query Key Design**

```typescript
// Good: Hierarchical and descriptive
queryKey: ['users', 'list', { page: 1, active: true }]

// Bad: Non-descriptive
queryKey: ['data']

// Good: Specific to resource
queryKey: ['user', userId]

// Good: Include all relevant parameters
queryKey: ['posts', { userId, category, page }]
```

### **Error Handling**

```typescript
// src/hooks/useUsers.ts
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    onError: (error) => {
      // Global error handling
      console.error('Failed to fetch users:', error);
    },
  });
}
```

### **Loading States**

```typescript
// src/components/LoadingStates.tsx
export function QueryLoadingState({ isLoading, error, children }: {
  isLoading: boolean;
  error?: Error;
  children: React.ReactNode;
}) {
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <>{children}</>;
}

// Usage
export function UserList() {
  const { data: users, isLoading, error } = useUsers();

  return (
    <QueryLoadingState isLoading={isLoading} error={error}>
      <div>
        {users?.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </QueryLoadingState>
  );
}
```

### **Cache Management**

```typescript
// src/hooks/useCacheManagement.ts
import { useQueryClient } from '@tanstack/react-query';

export function useCacheManagement() {
  const queryClient = useQueryClient();

  const invalidateUserQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  const prefetchUser = (userId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => getUser(userId),
    });
  };

  const clearCache = () => {
    queryClient.clear();
  };

  return {
    invalidateUserQueries,
    prefetchUser,
    clearCache,
  };
}
```

## Testing

### **Testing Queries**

```typescript
// src/hooks/useUsers.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUsers } from './useUsers';
import { getUsers } from '../services/api';

// Mock the API
jest.mock('../services/api');
const mockedGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;

describe('useUsers', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  it('should fetch users successfully', async () => {
    const mockUsers = [{ id: 1, name: 'John' }];
    mockedGetUsers.mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useUsers(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockUsers);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should handle errors', async () => {
    const error = new Error('Failed to fetch');
    mockedGetUsers.mockRejectedValue(error);

    const { result } = renderHook(() => useUsers(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.error).toEqual(error);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
```

### **Testing Mutations**

```typescript
// src/hooks/useCreateUser.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateUser } from './useCreateUser';
import { createUser } from '../services/api';

jest.mock('../services/api');
const mockedCreateUser = createUser as jest.MockedFunction<typeof createUser>;

describe('useCreateUser', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
      },
    });
  });

  it('should create user successfully', async () => {
    const newUser = { id: 1, name: 'John' };
    mockedCreateUser.mockResolvedValue(newUser);

    const { result } = renderHook(() => useCreateUser(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    result.current.mutate({ name: 'John' });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(newUser);
    });
  });
});
```

## Performance Optimization

### **Selective Updates**

```typescript
// src/hooks/useUser.ts
export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
    select: (data) => ({
      id: data.id,
      name: data.name,
      email: data.email,
      // Only select fields needed by component
    }),
  });
}
```

### **Background Refetching**

```typescript
// src/hooks/useRealTimeData.ts
export function useRealTimeData() {
  return useQuery({
    queryKey: ['realtime-data'],
    queryFn: fetchRealTimeData,
    refetchInterval: 5000, // Refetch every 5 seconds
    staleTime: 0, // Always consider data stale
    gcTime: 1000, // Clean up quickly
  });
}
```

### **Memory Management**

```typescript
// src/hooks/useLargeDataset.ts
export function useLargeDataset() {
  return useQuery({
    queryKey: ['large-dataset'],
    queryFn: fetchLargeDataset,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    select: (data) => data.slice(0, 100), // Limit data size
  });
}
```

## Integration Patterns

### **With React Router**

```typescript
// src/hooks/useRouteQuery.ts
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

export function useRouteQuery<T>(queryKey: string[], queryFn: () => Promise<T>) {
  const params = useParams();
  
  return useQuery({
    queryKey: [...queryKey, params],
    queryFn,
    enabled: !!Object.keys(params).length,
  });
}
```

### **With Forms**

```typescript
// src/hooks/useFormMutation.ts
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

export function useFormMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>
) {
  const mutation = useMutation({
    mutationFn,
  });

  const form = useForm<TVariables>();

  const onSubmit = (data: TVariables) => {
    mutation.mutate(data);
  };

  return {
    form,
    onSubmit,
    mutation,
  };
}
```

### **With WebSockets**

```typescript
// src/hooks/useWebSocketQuery.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useWebSocketQuery<T>(queryKey: string[], websocketUrl: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey,
    queryFn: () => fetch(websocketUrl).then(res => res.json()),
  });

  useEffect(() => {
    const ws = new WebSocket(websocketUrl);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      queryClient.setQueryData(queryKey, data);
    };

    return () => ws.close();
  }, [websocketUrl, queryKey, queryClient]);

  return query;
}
```

## Troubleshooting

### **Common Issues**

#### **Query Not Refetching**
```typescript
// Problem: Query not refetching on parameter change
// Solution: Include parameters in query key
const { data } = useQuery({
  queryKey: ['users', { page, active }], // Include all parameters
  queryFn: () => getUsers({ page, active }),
});
```

#### **Memory Leaks**
```typescript
// Problem: Memory leaks from uncanceled queries
// Solution: Cancel queries in cleanup
useEffect(() => {
  const query = queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  return () => {
    query.cancel();
  };
}, []);
```

#### **Stale Data**
```typescript
// Problem: Data not updating
// Solution: Adjust stale time and refetch settings
useQuery({
  queryKey: ['users'],
  queryFn: getUsers,
  staleTime: 0, // Always consider data stale
  refetchOnWindowFocus: true, // Refetch on focus
});
```

### **Debugging Tools**

```typescript
// Enable debug logging
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
  logger: {
    log: console.log,
    warn: console.warn,
    error: console.error,
  },
});

// Query inspection
const queries = queryClient.getQueryCache().getAll();
console.log('Active queries:', queries);
```

## Migration Guide

### **From React Query v4 to v5**

```typescript
// v4
import { useQuery } from 'react-query';

// v5
import { useQuery } from '@tanstack/react-query';

// v4
const { data, isLoading, error } = useQuery('users', getUsers);

// v5
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: getUsers,
});
```

### **From v5 to Latest**

```typescript
// v5.0
useQuery({
  queryKey: ['users'],
  queryFn: getUsers,
  cacheTime: 10 * 60 * 1000, // Renamed
});

// v5.62+
useQuery({
  queryKey: ['users'],
  queryFn: getUsers,
  gcTime: 10 * 60 * 1000, // New name
});
```

## Resources

### **Official Documentation**
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Query Guide](https://tanstack.com/query/latest/react/framework/react/guide)
- [DevTools Guide](https://tanstack.com/query/latest/react/devtools)

### **Community Resources**
- [TanStack Discord](https://discord.gg/tanstack)
- [GitHub Discussions](https://github.com/TanStack/query/discussions)
- [Examples Repository](https://github.com/TanStack/query/tree/main/examples)

### **Tools and Extensions**
- [React Query DevTools](https://tanstack.com/query/latest/devtools)
- [Query Key Factory](https://tanstack.com/query/latest/react/guide/query-keys)
- [Suspense Integration](https://tanstack.com/query/latest/react/guide/suspense)
