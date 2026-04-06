# Zustand Documentation

**Repository Version:** ^5.0.0  
**Official Documentation:** https://docs.pmnd.rs/zustand  
**Last Updated:** April 2026

## Overview

Zustand is a small, fast, and scalable bearbones state management solution for React. It has a simple API based on hooks and minimal boilerplate, making it an excellent choice for both small and large applications.

### Core Philosophy

Zustand embraces simplicity. It provides just enough functionality for state management without forcing architectural patterns or complex abstractions. The API is straightforward: create a store, use it in components.

### Why Zustand?

- **Simple API**: Minimal boilerplate with intuitive hooks-based API
- **Small Bundle**: ~1KB with no dependencies
- **No Context**: No need to wrap app in providers
- **TypeScript**: Excellent TypeScript support out of the box
- **Middleware**: Extensible with powerful middleware system
- **DevTools**: Redux DevTools integration

---

## Installation

### Package Installation

```bash
# npm
npm install zustand

# pnpm (recommended)
pnpm add zustand

# yarn
yarn add zustand
```

### Repository Setup

In `pnpm-workspace.yaml`:

```yaml
catalog:
  zustand: '^5.0.0'
```

In package `package.json`:

```json
{
  "dependencies": {
    "zustand": "catalog:"
  }
}
```

---

## Basic Usage

### Simple Store

```typescript
import { create } from 'zustand';

interface BearState {
  bears: number;
  increase: () => void;
  decrease: () => void;
  reset: () => void;
}

const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
  decrease: () => set((state) => ({ bears: state.bears - 1 })),
  reset: () => set({ bears: 0 }),
}));

// Usage in component
function BearCounter() {
  const { bears, increase, decrease } = useBearStore();

  return (
    <div>
      <h1>{bears} bears</h1>
      <button onClick={increase}>+</button>
      <button onClick={decrease}>-</button>
    </div>
  );
}
```

---

## Core API

### Create Store

```typescript
import { create } from 'zustand';

// Basic store
const useStore = create((set, get, api) => ({
  // State
  count: 0,
  
  // Actions
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  
  // Get current state
  logCount: () => {
    const current = get().count;
    console.log('Current count:', current);
  },
  
  // Subscribe to changes
  setupSubscription: () => {
    api.subscribe((state, prevState) => {
      console.log('State changed from', prevState, 'to', state);
    });
  },
}));
```

### Set Function

```typescript
// Set with function (recommended for dependent updates)
set((state) => ({ count: state.count + 1 }));

// Set with object (overwrites)
set({ count: 10 });

// Replace entire state
set({}, true); // Second argument: replace = true
```

### Get Function

```typescript
// Access current state within actions
const useStore = create((set, get) => ({
  count: 0,
  doubleCount: () => {
    const current = get().count;
    return current * 2;
  },
}));
```

---

## TypeScript Usage

### Typed Store

```typescript
import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  // State
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  removeUser: (id: string) => void;
  selectUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const useUserStore = create<UserState>((set) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  
  setUsers: (users) => set({ users }),
  
  addUser: (user) => set((state) => ({
    users: [...state.users, user],
  })),
  
  removeUser: (id) => set((state) => ({
    users: state.users.filter((u) => u.id !== id),
  })),
  
  selectUser: (user) => set({ selectedUser: user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
```

### Selector Pattern

```typescript
// Select specific state (prevents unnecessary re-renders)
function UserList() {
  const users = useUserStore((state) => state.users);
  const addUser = useUserStore((state) => state.addUser);
  
  // Component only re-renders when users change
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Multiple selectors with shallow equality
import { shallow } from 'zustand/shallow';

function UserStats() {
  const { users, selectedUser } = useUserStore(
    (state) => ({ users: state.users, selectedUser: state.selectedUser }),
    shallow // Prevents re-render if values are shallowly equal
  );
  
  return (
    <div>
      <p>Total users: {users.length}</p>
      <p>Selected: {selectedUser?.name || 'None'}</p>
    </div>
  );
}
```

---

## Middleware

### DevTools Middleware

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    {
      name: 'MyStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);
```

### Persist Middleware

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      token: '',
      setToken: (token: string) => set({ token }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Persist only specific fields
      partialize: (state) => ({ token: state.token }),
    }
  )
);
```

### Custom Middleware

```typescript
import { StateCreator, StoreMutatorIdentifier } from 'zustand';

// Logger middleware
const logger = <T>(f: StateCreator<T>) =>
  (set, get, api) =>
    f(
      (args) => {
        console.log('Applying', args);
        set(args);
        console.log('New state', get());
      },
      get,
      api
    );

// Usage
const useStore = create(
  logger((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
  }))
);

// Type-safe custom middleware
type Logger = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<T, Mps, Mcs>
) => StateCreator<T, Mps, Mcs>;
```

### Combining Middleware

```typescript
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const useStore = create(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set) => ({
          count: 0,
          increment: () =>
            set((draft) => {
              draft.count += 1;
            }),
        }))
      ),
      { name: 'counter-storage' }
    ),
    { name: 'CounterStore' }
  )
);
```

---

## Immer Integration

### Using Immer for Mutable Updates

```typescript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface Store {
  user: {
    name: string;
    settings: {
      theme: string;
      notifications: boolean;
    };
  };
  updateTheme: (theme: string) => void;
  updateName: (name: string) => void;
}

const useStore = create(
  immer<Store>((set) => ({
    user: {
      name: '',
      settings: {
        theme: 'light',
        notifications: true,
      },
    },
    
    // Mutate nested objects easily
    updateTheme: (theme) =>
      set((state) => {
        state.user.settings.theme = theme;
      }),
    
    updateName: (name) =>
      set((state) => {
        state.user.name = name;
      }),
  }))
);
```

---

## Async Actions

### Handling Async Operations

```typescript
interface StoreState {
  data: any | null;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

const useAsyncStore = create<StoreState>((set, get) => ({
  data: null,
  isLoading: false,
  error: null,
  
  fetchData: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      set({ data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false 
      });
    }
  },
}));

// Usage in component
function DataComponent() {
  const { data, isLoading, error, fetchData } = useAsyncStore();
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{JSON.stringify(data)}</div>;
}
```

---

## Advanced Patterns

### Subscribe to Store Changes

```typescript
import { useEffect } from 'react';
import { useStore } from './store';

// Outside React
const unsubscribe = useStore.subscribe(
  (state) => state.count,
  (count, previousCount) => {
    console.log('Count changed from', previousCount, 'to', count);
  }
);

// Inside React component
function SubscribeExample() {
  useEffect(() => {
    const unsub = useStore.subscribe(
      (state) => state.selectedUser,
      (user) => {
        console.log('Selected user changed:', user);
      }
    );
    return unsub;
  }, []);
  
  return null;
}

// Subscribe to all changes
useStore.subscribe((state, prevState) => {
  console.log('State changed:', prevState, '->', state);
});
```

### Accessing Store Outside React

```typescript
// Get current state
const currentCount = useStore.getState().count;

// Set state outside component
useStore.setState({ count: 10 });

// Call actions
useStore.getState().increment();

// Subscribe outside React
useStore.subscribe((state) => {
  console.log('Store updated:', state);
});
```

### Store Composition

```typescript
// Separate stores for different domains
const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id),
  })),
}));

// Combine in component
function Header() {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  
  return (
    <header>
      <span>Welcome, {user?.name}</span>
      <span>Cart: {items.length} items</span>
      <button onClick={logout}>Logout</button>
    </header>
  );
}
```

### Derived State

```typescript
interface CartState {
  items: { id: string; price: number; quantity: number }[];
}

const useCartStore = create<CartState>(() => ({
  items: [],
}));

// Derived selectors
export const cartSelectors = {
  totalItems: (state: CartState) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  
  totalPrice: (state: CartState) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  
  isEmpty: (state: CartState) => state.items.length === 0,
};

// Usage
function CartSummary() {
  const items = useCartStore((state) => state.items);
  const totalItems = cartSelectors.totalItems({ items });
  const totalPrice = cartSelectors.totalPrice({ items });
  
  return (
    <div>
      <p>Items: {totalItems}</p>
      <p>Total: ${totalPrice.toFixed(2)}</p>
    </div>
  );
}
```

---

## Best Practices

### Store Structure

```typescript
// Organize by domain
// stores/userStore.ts
interface UserState {
  // State
  profile: UserProfile | null;
  preferences: UserPreferences;
  
  // Computed (derived from state)
  isLoggedIn: () => boolean;
  
  // Actions
  login: (profile: UserProfile) => void;
  logout: () => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

// Keep stores focused on a single domain
// Bad: One giant store for everything
// Good: Multiple focused stores (userStore, cartStore, uiStore)
```

### Action Naming

```typescript
// Use descriptive action names
const useStore = create((set) => ({
  // ✓ Good: Describes what happened
  setUser: (user) => set({ user }),
  removeItem: (id) => set(...),
  toggleSidebar: () => set(...),
  
  // ✗ Bad: Vague or internal-sounding
  updateState: () => set(...),
  handleClick: () => set(...),
  onChange: () => set(...),
}));
```

### Performance Optimization

```typescript
// ✓ Good: Select only what you need
const count = useStore((state) => state.count);

// ✗ Bad: Selects entire store (causes re-render on any change)
const { count, name, items } = useStore();

// ✓ Good: Multiple selections with shallow comparison
const { count, increment } = useStore(
  (state) => ({ count: state.count, increment: state.increment }),
  shallow
);

// ✓ Good: Split into separate selections
const count = useStore((state) => state.count);
const increment = useStore((state) => state.increment);
```

### Async Patterns

```typescript
interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  
  // Action states for UI feedback
  fetch: () => Promise<void>;
  reset: () => void;
}

function createAsyncStore<T>(fetcher: () => Promise<T>) {
  return create<AsyncState<T>>((set) => ({
    data: null,
    isLoading: false,
    error: null,
    
    fetch: async () => {
      set({ isLoading: true, error: null });
      try {
        const data = await fetcher();
        set({ data, isLoading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error : new Error('Unknown error'),
          isLoading: false 
        });
      }
    },
    
    reset: () => set({ data: null, isLoading: false, error: null }),
  }));
}
```

---

## Troubleshooting

### Common Issues

**Issue**: Component re-renders too often
```typescript
// ✗ Bad: Entire store subscription
const state = useStore();

// ✓ Good: Select specific slices
const count = useStore((state) => state.count);

// ✓ Good: Multiple selections with shallow
const { count, name } = useStore(
  (state) => ({ count: state.count, name: state.name }),
  shallow
);
```

**Issue**: Actions not updating state
```typescript
// ✗ Bad: Direct mutation
increment: () => {
  state.count += 1; // Won't trigger update
}

// ✓ Good: Use set function
increment: () => set((state) => ({ count: state.count + 1 })),

// ✓ Good: Use immer for nested updates
import { immer } from 'zustand/middleware/immer';
increment: () => set((draft) => { draft.count += 1; }),
```

**Issue**: Store not persisting
```typescript
// Ensure storage is available (SSR compatibility)
const useStore = create(
  persist(
    (set) => ({ ... }),
    {
      name: 'my-storage',
      storage: createJSONStorage(() => 
        typeof window !== 'undefined' ? localStorage : null
      ),
    }
  )
);
```

---

## Resources

- **Official Docs**: https://docs.pmnd.rs/zustand
- **GitHub**: https://github.com/pmndrs/zustand
- **Discord**: https://discord.gg/poimandres
- **Examples**: https://github.com/pmndrs/zustand/tree/main/examples

---

## Version Notes

- **v5.0.x**: Current stable with React 19 support
- **v4.x**: Previous stable version
- Repository uses catalog version `^5.0.0`
