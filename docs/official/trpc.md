# tRPC Documentation

**Repository Version:** ^11.0.0  
**Official Documentation:** https://trpc.io  
**Last Updated:** April 2026

## Overview

TypeScript RPC (tRPC) allows you to build end-to-end typesafe APIs without schemas or code generation. It provides a seamless developer experience by enabling direct TypeScript function calls between your client and server, with full type inference across the network boundary.

### Core Philosophy

tRPC eliminates the need for API contracts, OpenAPI specs, or generated code. TypeScript's type system becomes the API contract, enabling confident refactoring and immediate feedback when API changes break client code.

### Why tRPC?

- **End-to-End Type Safety**: TypeScript types flow from backend to frontend
- **No Code Generation**: Types are inferred, not generated
- **Lightweight**: Minimal overhead and small bundle size
- **Framework Agnostic**: Works with Next.js, Express, Fastify, and more
- **Great DX**: Autocomplete, type inference, and immediate error feedback

---

## Installation

### Package Installation

```bash
# Core packages
pnpm add @trpc/server @trpc/client

# React integration
pnpm add @trpc/react-query

# For Next.js
pnpm add @trpc/next

# TanStack Query (required for React)
pnpm add @tanstack/react-query
```

### Repository Setup

In `pnpm-workspace.yaml`:

```yaml
catalog:
  '@trpc/server': '^11.0.0'
  '@trpc/client': '^11.0.0'
  '@trpc/react-query': '^11.0.0'
  '@trpc/next': '^11.0.0'
```

In package `package.json`:

```json
{
  "dependencies": {
    "@trpc/server": "catalog:",
    "@trpc/client": "catalog:",
    "@trpc/react-query": "catalog:",
    "@tanstack/react-query": "catalog:"
  }
}
```

---

## Basic Setup

### Server Setup

```typescript
// server/trpc.ts
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

// Initialize tRPC
const t = initTRPC.create();

// Export reusable router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Context (optional, for auth, db, etc.)
export const createContext = async () => {
  return {
    // Add context here: auth, database, etc.
  };
};

type Context = Awaited<ReturnType<typeof createContext>>;

// Create router
export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return `Hello, ${input.name}!`;
    }),
    
  getUsers: publicProcedure.query(async () => {
    // Database call
    return [{ id: '1', name: 'John' }];
  }),
});

// Export type definition for the API
export type AppRouter = typeof appRouter;
```

### Client Setup

```typescript
// utils/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@/server/trpc';

export const trpc = createTRPCReact<AppRouter>();

// Client configuration
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      // Optional: Add headers
      headers() {
        return {
          authorization: `Bearer ${getToken()}`,
        };
      },
    }),
  ],
});
```

### Next.js App Router Integration

```typescript
// app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/trpc';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({}),
  });

export { handler as GET, handler as POST };
```

### Provider Setup

```typescript
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc, trpcClient } from '@/utils/trpc';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

---

## Procedures

### Query Procedures

```typescript
// server/routers/user.ts
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const userRouter = router({
  // Get all users
  getAll: publicProcedure.query(async () => {
    return db.user.findMany();
  }),
  
  // Get user by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return db.user.findUnique({ where: { id: input.id } });
    }),
    
  // Search users
  search: publicProcedure
    .input(z.object({ 
      query: z.string(),
      limit: z.number().min(1).max(100).default(10),
    }))
    .query(async ({ input }) => {
      return db.user.findMany({
        where: { name: { contains: input.query } },
        take: input.limit,
      });
    }),
});
```

### Mutation Procedures

```typescript
export const userRouter = router({
  // Create user
  create: publicProcedure
    .input(z.object({
      name: z.string().min(2),
      email: z.string().email(),
    }))
    .mutation(async ({ input }) => {
      return db.user.create({
        data: input,
      });
    }),
    
  // Update user
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(2).optional(),
      email: z.string().email().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return db.user.update({
        where: { id },
        data,
      });
    }),
    
  // Delete user
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return db.user.delete({ where: { id: input.id } });
    }),
});
```

### Subscription Procedures (WebSocket)

```typescript
import { observable } from '@trpc/server/observable';

export const messageRouter = router({
  onMessage: publicProcedure
    .input(z.object({ channelId: z.string() }))
    .subscription(({ input }) => {
      return observable<Message>((emit) => {
        const unsubscribe = subscribeToChannel(
          input.channelId,
          (message) => {
            emit.next(message);
          }
        );
        
        return () => {
          unsubscribe();
        };
      });
    }),
});
```

---

## Client Usage

### React Hooks

```typescript
'use client';

import { trpc } from '@/utils/trpc';

function UserList() {
  // Query
  const { data: users, isLoading } = trpc.user.getAll.useQuery();
  
  // Query with parameters
  const { data: user } = trpc.user.getById.useQuery({ id: '1' });
  
  // Mutation
  const createUser = trpc.user.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch
      utils.user.getAll.invalidate();
    },
  });
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {users?.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
      <button onClick={() => createUser.mutate({ name: 'New User', email: 'new@example.com' })}>
        Add User
      </button>
    </div>
  );
}
```

### Advanced Queries

```typescript
function UserSearch() {
  const [search, setSearch] = useState('');
  
  // Conditional query
  const { data } = trpc.user.search.useQuery(
    { query: search, limit: 10 },
    {
      enabled: search.length > 0, // Only run when search has content
      staleTime: 5000, // Consider data fresh for 5 seconds
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );
  
  // Infinite query
  const infiniteUsers = trpc.user.getInfinite.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  
  return (
    <div>
      <input 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
      />
      {data?.map((user) => <div key={user.id}>{user.name}</div>)}
    </div>
  );
}
```

### Optimistic Updates

```typescript
function CreatePost() {
  const utils = trpc.useUtils();
  
  const createPost = trpc.post.create.useMutation({
    async onMutate(newPost) {
      // Cancel outgoing refetches
      await utils.post.getAll.cancel();
      
      // Snapshot previous value
      const previousPosts = utils.post.getAll.getData();
      
      // Optimistically update
      utils.post.getAll.setData(undefined, (old) => [
        ...(old || []),
        { ...newPost, id: 'temp-id', createdAt: new Date() },
      ]);
      
      // Return context with snapshotted value
      return { previousPosts };
    },
    
    onError(err, newPost, context) {
      // Rollback on error
      utils.post.getAll.setData(undefined, context?.previousPosts);
    },
    
    onSettled() {
      // Always refetch after error or success
      utils.post.getAll.invalidate();
    },
  });
  
  return (
    <button onClick={() => createPost.mutate({ title: 'New Post' })}>
      Create Post
    </button>
  );
}
```

---

## Middleware and Context

### Authentication Middleware

```typescript
// server/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';

const t = initTRPC.context<typeof createContext>().create();

// Auth middleware
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // User is now non-optional
    },
  });
});

// Protected procedure
export const protectedProcedure = t.procedure.use(isAuthed);

// Usage
export const appRouter = router({
  // Public
  hello: publicProcedure.query(() => 'Hello'),
  
  // Protected
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.user; // Type-safe, guaranteed to exist
  }),
  
  updateProfile: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return db.user.update({
        where: { id: ctx.user.id },
        data: input,
      });
    }),
});
```

### Rate Limiting Middleware

```typescript
import { TRPCError } from '@trpc/server';

const rateLimit = t.middleware(async ({ ctx, path, next }) => {
  const key = `${ctx.user?.id ?? 'anonymous'}:${path}`;
  const limit = await checkRateLimit(key);
  
  if (!limit.allowed) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: `Rate limit exceeded. Try again in ${limit.retryAfter}s`,
    });
  }
  
  return next();
});

export const rateLimitedProcedure = t.procedure.use(rateLimit);
```

### Logging Middleware

```typescript
const logger = t.middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const duration = Date.now() - start;
  
  console.log(`[${type}] ${path} - ${duration}ms`);
  
  return result;
});

export const loggedProcedure = t.procedure.use(logger);
```

---

## Error Handling

### Error Types

```typescript
import { TRPCError } from '@trpc/server';

// Standard error codes
throw new TRPCError({
  code: 'BAD_REQUEST',        // 400
  code: 'UNAUTHORIZED',       // 401
  code: 'FORBIDDEN',          // 403
  code: 'NOT_FOUND',          // 404
  code: 'TIMEOUT',            // 408
  code: 'CONFLICT',           // 409
  code: 'PRECONDITION_FAILED', // 412
  code: 'PAYLOAD_TOO_LARGE',  // 413
  code: 'METHOD_NOT_SUPPORTED', // 405
  code: 'UNPROCESSABLE_CONTENT', // 422
  code: 'TOO_MANY_REQUESTS',   // 429
  code: 'CLIENT_CLOSED_REQUEST', // 499
  code: 'INTERNAL_SERVER_ERROR', // 500
});
```

### Client-Side Error Handling

```typescript
function UserComponent() {
  const { data, error, isError } = trpc.user.getById.useQuery({ id: '1' });
  
  if (isError) {
    // Type-safe error handling
    if (error.data?.code === 'NOT_FOUND') {
      return <div>User not found</div>;
    }
    
    if (error.data?.code === 'UNAUTHORIZED') {
      return <div>Please log in</div>;
    }
    
    return <div>Error: {error.message}</div>;
  }
  
  return <div>{data?.name}</div>;
}
```

---

## Router Organization

### Merging Routers

```typescript
// server/routers/user.ts
export const userRouter = router({ ... });

// server/routers/post.ts
export const postRouter = router({ ... });

// server/routers/comment.ts
export const commentRouter = router({ ... });

// server/trpc.ts
export const appRouter = router({
  user: userRouter,
  post: postRouter,
  comment: commentRouter,
});
```

### Nested Routers

```typescript
export const postRouter = router({
  // /post/list
  list: publicProcedure.query(...),
  
  // /post/byId
  byId: publicProcedure.input(...).query(...),
  
  // Nested comment router
  // /post/comment/list
  comment: router({
    list: publicProcedure.input(...).query(...),
    create: protectedProcedure.input(...).mutation(...),
  }),
});
```

---

## Best Practices

### Input Validation

```typescript
// Always validate inputs with Zod
const createPost = protectedProcedure
  .input(z.object({
    title: z.string().min(1).max(200),
    content: z.string().min(1),
    published: z.boolean().default(false),
    tags: z.array(z.string()).max(10),
  }))
  .mutation(async ({ ctx, input }) => {
    // Input is fully typed and validated
    return db.post.create({
      data: {
        ...input,
        authorId: ctx.user.id,
      },
    });
  });
```

### Type Exports

```typescript
// server/trpc.ts
export type AppRouter = typeof appRouter;

// Export individual router types
export type UserRouter = typeof userRouter;

// Client types
type RouterInputs = inferRouterInputs<AppRouter>;
type RouterOutputs = inferRouterOutputs<AppRouter>;

// Specific input/output types
type CreatePostInput = RouterInputs['post']['create'];
type CreatePostOutput = RouterOutputs['post']['create'];
```

### React Query Integration

```typescript
// Use tRPC's React Query utilities
const utils = trpc.useUtils();

// Prefetch data
await utils.post.getAll.prefetch();

// Invalidate queries
utils.post.getAll.invalidate();
utils.post.getAll.invalidate({ id: '1' });

// Set query data
utils.post.getAll.setData(undefined, (old) => [...old, newPost]);

// Cancel queries
await utils.post.getAll.cancel();
```

---

## Troubleshooting

### Common Issues

**Issue**: "Cannot find module '@trpc/react-query'"
```bash
# Ensure all packages are installed
pnpm add @trpc/server @trpc/client @trpc/react-query @tanstack/react-query
```

**Issue**: Types not inferring correctly
```typescript
// Ensure AppRouter type is exported
export type AppRouter = typeof appRouter;

// Check client setup
const trpc = createTRPCReact<AppRouter>(); // Generic required
```

**Issue**: Query not refetching after mutation
```typescript
const mutation = trpc.post.create.useMutation({
  onSuccess: () => {
    // Invalidate the query
    utils.post.getAll.invalidate();
  },
});
```

---

## Resources

- **Official Docs**: https://trpc.io
- **GitHub**: https://github.com/trpc/trpc
- **Discord**: https://trpc.io/discord
- **Examples**: https://github.com/trpc/trpc/tree/main/examples

---

## Version Notes

- **v11.x**: Current stable with React 19 support
- **v10.x**: Previous stable version
- Repository uses catalog version `^11.0.0`
