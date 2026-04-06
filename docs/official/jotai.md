# Jotai Documentation

**Repository Version:** ^2.10.0  
**Official Documentation:** https://jotai.org  
**Last Updated:** April 2026

## Overview

Jotai is a primitive and flexible state management library for React based on the atomic approach. It takes a bottom-up approach to state management with an atomic model inspired by Recoil, providing a simple and scalable solution for global and local React state.

### Core Philosophy

Jotai treats state as individual atoms—small, composable units of state that can be derived from each other. This atomic approach provides automatic dependency tracking, eliminates unnecessary re-renders, and makes state management predictable and debuggable.

### Why Jotai?

- **Atomic State**: Fine-grained state management with atoms
- **Automatic Dependency Tracking**: Derived atoms update automatically
- **Minimal API**: Simple, focused API with minimal boilerplate
- **TypeScript**: First-class TypeScript support
- **Small Bundle**: ~3KB with no dependencies
- **Extensible**: Rich ecosystem of official and third-party utilities

---

## Installation

### Package Installation

```bash
# Core
pnpm add jotai

# DevTools (optional)
pnpm add jotai-devtools

# Integration packages
pnpm add jotai-cache
pnpm add jotai-location
```

### Repository Setup

In `pnpm-workspace.yaml`:

```yaml
catalog:
  jotai: '^2.10.0'
```

In package `package.json`:

```json
{
  "dependencies": {
    "jotai": "catalog:"
  }
}
```

---

## Basic Usage

### Primitive Atoms

```typescript
import { atom, useAtom } from 'jotai';

// Define atoms
const countAtom = atom(0);
const nameAtom = atom('John');
const isActiveAtom = atom(true);

// Usage in component
function Counter() {
  const [count, setCount] = useAtom(countAtom);
  
  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
      <button onClick={() => setCount((c) => c - 1)}>-</button>
    </div>
  );
}
```

### Read-Only Atoms

```typescript
// Derived atom (read-only)
const doubleCountAtom = atom((get) => get(countAtom) * 2);

function Display() {
  const [double] = useAtom(doubleCountAtom);
  return <div>Double: {double}</div>;
}
```

### Write-Only Atoms

```typescript
// Action atom (write-only)
const incrementAtom = atom(null, (get, set, update: number) => {
  set(countAtom, (c) => c + update);
});

function IncrementButton() {
  const [, increment] = useAtom(incrementAtom);
  return <button onClick={() => increment(10)}>+10</button>;
}
```

### Read-Write Atoms

```typescript
// Derived atom with setter
const countWithOffsetAtom = atom(
  (get) => get(countAtom) + 100,
  (get, set, newValue: number) => {
    set(countAtom, newValue - 100);
  }
);

function OffsetCounter() {
  const [count, setCount] = useAtom(countWithOffsetAtom);
  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount(150)}>Set to 150 (stores 50)</button>
    </div>
  );
}
```

---

## Core Hooks

### useAtom

```typescript
import { useAtom } from 'jotai';

function Component() {
  const [value, setValue] = useAtom(atom);
  // ...
}
```

### useAtomValue

```typescript
import { useAtomValue } from 'jotai';

function Display() {
  const count = useAtomValue(countAtom);
  return <div>{count}</div>;
}
```

### useSetAtom

```typescript
import { useSetAtom } from 'jotai';

function Controls() {
  const setCount = useSetAtom(countAtom);
  return <button onClick={() => setCount(0)}>Reset</button>;
}
```

### useReducerAtom

```typescript
import { atomWithReducer } from 'jotai/utils';

const reducer = (state: number, action: 'inc' | 'dec') => {
  switch (action) {
    case 'inc': return state + 1;
    case 'dec': return state - 1;
    default: return state;
  }
};

const countReducerAtom = atomWithReducer(0, reducer);

function ReducerCounter() {
  const [count, dispatch] = useAtom(countReducerAtom);
  return (
    <div>
      {count}
      <button onClick={() => dispatch('inc')}>+</button>
      <button onClick={() => dispatch('dec')}>-</button>
    </div>
  );
}
```

---

## Derived Atoms

### Basic Derivation

```typescript
const countAtom = atom(0);
const doubleAtom = atom((get) => get(countAtom) * 2);
const tripleAtom = atom((get) => get(countAtom) * 3);
```

### Chained Derivation

```typescript
const baseAtom = atom(10);
const derived1Atom = atom((get) => get(baseAtom) + 1);
const derived2Atom = atom((get) => get(derived1Atom) * 2);
const derived3Atom = atom((get) => get(derived2Atom) - 5);

// Updates flow: base -> derived1 -> derived2 -> derived3
```

### Multi-Dependency Atoms

```typescript
const widthAtom = atom(10);
const heightAtom = atom(20);

const areaAtom = atom((get) => get(widthAtom) * get(heightAtom));

const perimeterAtom = atom(
  (get) => 2 * (get(widthAtom) + get(heightAtom))
);
```

### Async Derived Atoms

```typescript
import { atom } from 'jotai';

const idAtom = atom(1);

const userAtom = atom(async (get) => {
  const id = get(idAtom);
  const response = await fetch(`/api/users/${id}`);
  return response.json();
});

// Usage with Suspense
function UserDisplay() {
  const user = useAtomValue(userAtom);
  return <div>{user.name}</div>;
}

// Wrap in Suspense
function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserDisplay />
    </Suspense>
  );
}
```

---

## Advanced Patterns

### Family Atoms

```typescript
import { atomFamily } from 'jotai/utils';

const todoAtomFamily = atomFamily((id: number) =>
  atom({ id, text: '', completed: false })
);

function TodoItem({ id }: { id: number }) {
  const [todo, setTodo] = useAtom(todoAtomFamily(id));
  
  return (
    <div>
      <input
        value={todo.text}
        onChange={(e) => setTodo({ ...todo, text: e.target.value })}
      />
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={(e) => setTodo({ ...todo, completed: e.target.checked })}
      />
    </div>
  );
}
```

### Atom With Storage

```typescript
import { atomWithStorage } from 'jotai/utils';

// Local storage
const persistedCountAtom = atomWithStorage('count', 0);

// Session storage
const sessionAtom = atomWithStorage(
  'session',
  { user: null },
  {
    getItem: (key) => JSON.parse(sessionStorage.getItem(key) || 'null'),
    setItem: (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
    removeItem: (key) => sessionStorage.removeItem(key),
    subscribe: (key, callback) => {
      const handler = (e: StorageEvent) => {
        if (e.key === key) callback();
      };
      window.addEventListener('storage', handler);
      return () => window.removeEventListener('storage', handler);
    },
  }
);
```

### Atom With Reset

```typescript
import { atomWithReset, useResetAtom, RESET } from 'jotai/utils';

const countAtom = atomWithReset(0);

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const reset = useResetAtom(countAtom);
  
  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
      <button onClick={reset}>Reset</button>
      <button onClick={() => setCount(RESET)}>Reset (alternative)</button>
    </div>
  );
}
```

### Atom With Reducer

```typescript
import { atomWithReducer } from 'jotai/utils';

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'set'; value: number };

const countReducerAtom = atomWithReducer(0, (prev, action: Action) => {
  switch (action.type) {
    case 'increment':
      return prev + 1;
    case 'decrement':
      return prev - 1;
    case 'set':
      return action.value;
    default:
      return prev;
  }
});
```

### Select Atom

```typescript
import { selectAtom } from 'jotai/utils';

const userAtom = atom({ id: 1, name: 'John', email: 'john@example.com' });

const userNameAtom = selectAtom(userAtom, (user) => user.name);

function UserName() {
  const name = useAtomValue(userNameAtom);
  // Only re-renders when name changes, not other user properties
  return <span>{name}</span>;
}
```

---

## Async Patterns

### Suspend Atoms

```typescript
import { atom } from 'jotai';

const fetchUserAtom = atom(async (get) => {
  const response = await fetch('/api/user');
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
});

function UserProfile() {
  const user = useAtomValue(fetchUserAtom);
  return <div>{user.name}</div>;
}
```

### Loadable Atoms

```typescript
import { loadable } from 'jotai/utils';

const asyncAtom = atom(async () => {
  const response = await fetch('/api/data');
  return response.json();
});

const loadableAtom = loadable(asyncAtom);

function DataDisplay() {
  const [value] = useAtom(loadableAtom);
  
  if (value.state === 'loading') {
    return <div>Loading...</div>;
  }
  
  if (value.state === 'hasError') {
    return <div>Error: {value.error.message}</div>;
  }
  
  return <div>Data: {JSON.stringify(value.data)}</div>;
}
```

### Atom With Refresh

```typescript
import { atomWithRefresh } from 'jotai/utils';

const timestampAtom = atomWithRefresh(() => Date.now());

function Timestamp() {
  const [timestamp, refresh] = useAtom(timestampAtom);
  
  return (
    <div>
      <div>Timestamp: {timestamp}</div>
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

---

## Best Practices

### Store Organization

```typescript
// atoms/index.ts
export * from './userAtoms';
export * from './cartAtoms';
export * from './uiAtoms';

// atoms/userAtoms.ts
import { atom } from 'jotai';

export const userIdAtom = atom<string | null>(null);
export const userProfileAtom = atom(async (get) => {
  const id = get(userIdAtom);
  if (!id) return null;
  return fetchUser(id);
});
export const isAuthenticatedAtom = atom((get) => !!get(userIdAtom));

// atoms/cartAtoms.ts
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

type CartItem = { id: string; quantity: number };

export const cartItemsAtom = atomWithStorage<CartItem[]>('cart', []);
export const cartTotalAtom = atom((get) => {
  const items = get(cartItemsAtom);
  return items.reduce((sum, item) => sum + item.quantity, 0);
});
```

### Action Pattern

```typescript
// Define action atoms for complex state updates
const cartAtom = atom<CartItem[]>([]);

const addToCartAtom = atom(null, (get, set, item: CartItem) => {
  const current = get(cartAtom);
  const existing = current.find((i) => i.id === item.id);
  
  if (existing) {
    set(cartAtom, current.map((i) =>
      i.id === item.id
        ? { ...i, quantity: i.quantity + item.quantity }
        : i
    ));
  } else {
    set(cartAtom, [...current, item]);
  }
});

const removeFromCartAtom = atom(null, (get, set, itemId: string) => {
  set(cartAtom, get(cartAtom).filter((i) => i.id !== itemId));
});

// Usage
function AddToCartButton({ product }: { product: Product }) {
  const [, addToCart] = useAtom(addToCartAtom);
  
  return (
    <button onClick={() => addToCart({ id: product.id, quantity: 1 })}>
      Add to Cart
    </button>
  );
}
```

### Performance Optimization

```typescript
// Split atoms to minimize re-renders
const userAtom = atom({ name: 'John', age: 30, email: 'john@example.com' });

// Bad: Component re-renders on any user change
function Name() {
  const [user] = useAtom(userAtom);
  return <span>{user.name}</span>;
}

// Good: Use selectAtom for fine-grained updates
const userNameAtom = selectAtom(userAtom, (user) => user.name);

function Name() {
  const name = useAtomValue(userNameAtom);
  return <span>{name}</span>;
}

// Good: Use separate atoms
const userNameAtom = atom('John');
const userAgeAtom = atom(30);
const userEmailAtom = atom('john@example.com');
```

---

## Resources

- **Official Docs**: https://jotai.org
- **GitHub**: https://github.com/pmndrs/jotai
- **PMNDRS Discord**: https://discord.gg/poimandres
- **Examples**: https://github.com/pmndrs/jotai/tree/main/examples

---

## Version Notes

- **v2.10.x**: Current stable with improved performance
- Repository uses catalog version `^2.10.0`
