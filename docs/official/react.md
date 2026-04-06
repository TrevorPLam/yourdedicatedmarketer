# React Documentation

**Repository Version:** ^19.2.0  
**Official Documentation:** https://react.dev/  
**Latest Reference:** https://react.dev/reference  
**Stable Release:** React 19.2 (December 2024)

## Overview

React is the library for web and native user interfaces. Build user interfaces out of individual pieces called components written in JavaScript. React is designed to let you seamlessly combine components written by independent people, teams, and organizations.

React lets you build user interfaces out of individual pieces called components. Create your own React components like Thumbnail, LikeButton, and Video. Then combine them into entire screens, pages, and apps.

React components are JavaScript functions. Want to show some content conditionally? Use an if statement. Displaying a list? Try array map(). Learning React is learning programming.

## React 19 Features

### What's New in React 19

React 19 introduces groundbreaking features that transform how you build user interfaces:

#### Actions

Actions are a new way to handle data mutations with built-in support for pending states, error handling, optimistic updates, and form management.

```javascript
// Before Actions - Manual state management
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  
  const handleSubmit = async () => {
    setIsPending(true);
    const error = await updateName(name);
    setIsPending(false);
    if (error) {
      setError(error);
      return;
    }
    redirect("/path");
  };
  
  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}

// With Actions - Automatic state management
function ChangeName({ name, setName }) {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const error = await updateName(formData.get("name"));
      if (error) {
        return error;
      }
      redirect("/path");
      return null;
    },
    null,
  );
  
  return (
    <form action={submitAction}>
      <input type="text" name="name" />
      <button type="submit" disabled={isPending}>Update</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

#### New Hooks

##### useActionState

A hook that simplifies common Action patterns by managing the action's state and providing a wrapped action function.

```javascript
const [error, submitAction, isPending] = useActionState(
  async (previousState, newName) => {
    const error = await updateName(newName);
    if (error) {
      return error;
    }
    return null;
  },
  null,
);
```

##### useFormStatus

A hook that provides status information about the parent `<form>` to design system components.

```javascript
import { useFormStatus } from 'react-dom';

function DesignButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} />;
}
```

##### useOptimistic

A hook for managing optimistic UI updates during data mutations.

```javascript
function ChangeName({ currentName, onUpdateName }) {
  const [optimisticName, setOptimisticName] = useOptimistic(currentName);
  
  const submitAction = async formData => {
    const newName = formData.get("name");
    setOptimisticName(newName);
    const updatedName = await updateName(newName);
    onUpdateName(updatedName);
  };
  
  return (
    <form action={submitAction}>
      <p>Your name is: {optimisticName}</p>
      <p>
        <label>Change Name:</label>
        <input type="text" name="name" disabled={currentName !== optimisticName} />
      </p>
    </form>
  );
}
```

**use** (New API)

A new API for reading resources in render, supporting promises and context conditionally.

```javascript
import { use } from 'react';

function Comments({ commentsPromise }) {
  // `use` will suspend until the promise resolves.
  const comments = use(commentsPromise);
  return comments.map(comment => <p key={comment.id}>{comment}</p>);
}

function Page({ commentsPromise }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  );
}

// Conditional context reading
function Heading({ children }) {
  if (children == null) {
    return null;
  }
  // This works with use but not useContext due to early return
  const theme = use(ThemeContext);
  return (
    <h1 style={{ color: theme.color }}>
      {children}
    </h1>
  );
}
```

#### React Server Components (RSC)

React 19 includes stable support for Server Components, allowing components to run exclusively on the server.

```javascript
// Server Component (runs on server)
async function UserProfile({ userId }) {
  const user = await getUser(userId);
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// Client Component (runs on client)
'use client';

import { useState } from 'react';

function InteractiveProfile({ userId }) {
  const [isFollowing, setIsFollowing] = useState(false);
  
  return (
    <div>
      <UserProfile userId={userId} />
      <button onClick={() => setIsFollowing(!isFollowing)}>
        {isFollowing ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  );
}
```

#### Server Actions

Server Actions allow Client Components to call async functions executed on the server.

```javascript
// Server Action with "use server" directive
async function updateName(formData) {
  'use server';
  const name = formData.get('name');
  // Update name in database
  await updateUser(name);
  return { success: true };
}

// Usage in Client Component
function NameForm() {
  return (
    <form action={updateName}>
      <input type="text" name="name" />
      <button type="submit">Update Name</button>
    </form>
  );
}
```

### Improvements in React 19

#### ref as a prop

Function components can now accept `ref` as a prop without `forwardRef`.

```javascript
// Before: Required forwardRef
const MyInput = forwardRef(function MyInput({ placeholder }, ref) {
  return <input placeholder={placeholder} ref={ref} />;
});

// After: ref as a prop
function MyInput({ placeholder, ref }) {
  return <input placeholder={placeholder} ref={ref} />;
}

// Usage
<MyInput ref={ref} />
```

#### <Context> as a provider

Context components can now be rendered directly as providers.

```javascript
// Before: Context.Provider
const ThemeContext = createContext('');

function App({ children }) {
  return (
    <ThemeContext.Provider value="dark">
      {children}
    </ThemeContext.Provider>
  );
}

// After: Context as provider
function App({ children }) {
  return (
    <ThemeContext value="dark">
      {children}
    </ThemeContext>
  );
}
```

#### Document Metadata Support

Native support for document metadata tags in components.

```javascript
function BlogPost({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <title>{post.title}</title>
      <meta name="author" content="Josh" />
      <link rel="author" href="https://twitter.com/joshcstory/" />
      <meta name="keywords" content={post.keywords} />
      <p>Eee equals em-see-squared...</p>
    </article>
  );
}
```

#### Stylesheet Support

Built-in support for stylesheets with automatic deduplication and precedence management.

```javascript
function ComponentOne() {
  return (
    <Suspense fallback="loading...">
      <link rel="stylesheet" href="foo" precedence="default" />
      <link rel="stylesheet" href="bar" precedence="high" />
      <article className="foo-class bar-class">
        {...}
      </article>
    </Suspense>
  );
}

function ComponentTwo() {
  return (
    <div>
      <p>{...}</p>
      <link rel="stylesheet" href="baz" precedence="default" />
      {/* will be inserted between foo & bar */}
    </div>
  );
}
```

#### Async Script Support

Native support for async scripts with automatic deduplication.

```javascript
function MyComponent() {
  return (
    <div>
      <script async={true} src="..." />
      Hello World
    </div>
  );
}

function App() {
  return (
    <html>
      <body>
        <MyComponent />
        {/* Multiple instances won't create duplicate scripts */}
        <MyComponent />
      </body>
    </html>
  );
}
```

#### Resource Preloading APIs

New APIs for loading and preloading browser resources.

```javascript
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom';

function MyComponent() {
  preinit('https://.../path/to/some/script.js', { as: 'script' });
  preload('https://.../path/to/font.woff', { as: 'font' });
  preload('https://.../path/to/stylesheet.css', { as: 'style' });
  prefetchDNS('https://...');
  preconnect('https://...');
}
```

#### Enhanced Error Reporting

Improved error handling with single error logging and new root options.

```javascript
// New root options
const root = createRoot(container, {
  onCaughtError: (error, errorInfo) => {
    console.log('Caught error:', error, errorInfo);
  },
  onUncaughtError: (error, errorInfo) => {
    console.log('Uncaught error:', error, errorInfo);
  },
  onRecoverableError: (error, errorInfo) => {
    console.log('Recoverable error:', error, errorInfo);
  },
});
```

#### Custom Elements Support

Full support for custom elements with proper property/attribute handling.

```javascript
// Custom elements now work seamlessly
function MyCustomElementWrapper() {
  return (
    <my-custom-element
      primitive-prop="string"
      number-prop={42}
      boolean-prop={true}
      object-prop={{ key: 'value' }}
    />
  );
}
```

#### useDeferredValue Initial Value

Added `initialValue` option to `useDeferredValue`.

```javascript
function Search({ deferredValue }) {
  // On initial render the value is ''.
  // Then a re-render is scheduled with the deferredValue.
  const value = useDeferredValue(deferredValue, '');
  return <Results query={value} />;
}
```

#### Ref Cleanup Functions

Support for cleanup functions in ref callbacks.

```javascript
<input
  ref={(ref) => {
    // ref created
    // NEW: return a cleanup function to reset the ref
    // when element is removed from DOM.
    return () => {
      // ref cleanup
    };
  }}
/>
```

---

## React 19.2 Features

### What's New in React 19.2

React 19.2 introduces powerful new features for managing component lifecycles and effects:

#### Activity Component (New in 19.2)

The `<Activity>` component lets you break your app into "activities" that can be controlled and prioritized. It provides a way to preserve state and keep rendering hidden parts of your app without impacting performance.

```javascript
import { Activity } from 'react';

// Before: Conditionally render (state is lost when hidden)
{isVisible && <Page />}

// After: Activity with state preservation
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <Page />
</Activity>
```

**Modes:**
- `visible`: Shows the children, mounts effects, and allows updates to be processed normally
- `hidden`: Hides the children, unmounts effects, and defers all updates until React has nothing else to work on

**Use Cases:**
- Pre-render hidden pages a user is likely to navigate to next
- Save state when users navigate away (back navigation preserves state)
- Load data, CSS, and images in the background for faster navigation
- Maintain state such as input fields, scroll position, and form data

```javascript
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  
  return (
    <>
      <nav>
        <button onClick={() => setCurrentPage('home')}>Home</button>
        <button onClick={() => setCurrentPage('profile')}>Profile</button>
        <button onClick={() => setCurrentPage('settings')}>Settings</button>
      </nav>
      
      {/* All pages are rendered but only current is visible */}
      <Activity mode={currentPage === 'home' ? 'visible' : 'hidden'}>
        <HomePage />
      </Activity>
      
      <Activity mode={currentPage === 'profile' ? 'visible' : 'hidden'}>
        <ProfilePage />
      </Activity>
      
      <Activity mode={currentPage === 'settings' ? 'visible' : 'hidden'}>
        <SettingsPage />
      </Activity>
    </>
  );
}
```

#### useEffectEvent (New in 19.2)

`useEffectEvent` is a new Hook that lets you extract "event" logic from Effects without including it in the dependency array. This solves the common problem where you need to use a value inside an effect without re-triggering the effect when that value changes.

```javascript
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  // Create an effect event for notifications
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    
    connection.on('connected', () => {
      onConnected(); // Uses latest theme value without re-subscribing
    });
    
    connection.connect();
    
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // ✅ theme NOT needed here - no extra reconnections!
  
  return <div>Connected to {roomId}</div>;
}
```

**Key Benefits:**
- Effect Events always "see" the latest props and state (similar to DOM events)
- Effect Events should NOT be declared in the dependency array
- Only works when declared in the same component or Hook as "their" Effect
- Requires `eslint-plugin-react-hooks@latest` to avoid linter warnings

**Before useEffectEvent (the problem):**
```javascript
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]); // ❌ Changing theme reconnects the room!
}
```

**After useEffectEvent (the solution):**
```javascript
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => onConnected());
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared correctly
}
```

#### React Server Components Improvements (19.2)

- **Partial Pre-rendering**: Enhanced support for streaming and partial hydration
- **Performance Tracks**: New APIs for tracking component performance metrics
- **cacheSignal**: New API for caching and signal-based reactivity

#### Notable Changes in 19.2

- **Batching Suspense Boundaries for SSR**: Improved server-side rendering performance
- **Web Streams support for Node**: Better streaming support in Node.js environments
- **Updated default useId prefix**: Changed prefix for generated IDs
- **eslint-plugin-react-hooks v6**: Updated ESLint plugin with support for useEffectEvent

---

## Getting Started

### Installation

```bash
# Using npm
npm install react react-dom

# Using yarn
yarn add react react-dom

# Using pnpm
pnpm add react react-dom
```

### Project Setup

```javascript
// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

### Creating and Nesting Components

React apps are made out of components. A component is a piece of the UI that has its own logic and appearance.

```javascript
function MyButton() {
  return <button>I'm a button</button>;
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

### Writing Markup with JSX

JSX is a syntax extension for JavaScript that lets you write markup-like code.

```javascript
function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p>Hello there.<br />How do you do?</p>
    </>
  );
}
```

### Adding Styles

Use `className` for CSS classes and manage styles in separate CSS files.

```javascript
<img className="avatar" />
```

```css
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```

### Displaying Data

Use curly braces to embed JavaScript expressions in JSX.

```javascript
return (
  <h1>{user.name}</h1>
);

return (
  <img
    className="avatar"
    src={user.imageUrl}
    alt={'Photo of ' + user.name}
    style={{
      width: user.imageSize,
      height: user.imageSize,
    }}
  />
);
```

### Conditional Rendering

Use JavaScript conditional statements and operators.

```javascript
// Using if statement
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return <div>{content}</div>;

// Using ternary operator
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>

// Using logical AND
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

### Rendering Lists

Use `map()` to transform arrays into lists of components.

```javascript
const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];

const listItems = products.map((product) => (
  <li key={product.id}>{product.title}</li>
));

return <ul>{listItems}</ul>;
```

### Responding to Events

Declare event handler functions inside components.

```javascript
function MyButton() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

### Updating the Screen

Use the `useState` Hook to add state to components.

```javascript
import { useState } from 'react';

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

### Using Hooks

Hooks are functions that let you use React features in function components.

```javascript
import { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Component mounted');
    return () => {
      console.log('Component will unmount');
    };
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### Sharing Data Between Components

Lift state up to the closest common ancestor.

```javascript
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
```

## React Hooks Reference

### useState

`useState` is a React Hook that lets you add a state variable to your component.

```javascript
const [state, setState] = useState(initialState);
```

#### Reference

##### `useState(initialState)`

Call `useState` at the top level of your component to declare a state variable.

```javascript
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  // ...
}
```

##### Parameters

- `initialState`: The value you want the state to be initially. It may be a value of any type, but for functions it's treated specially.

##### Returns

`useState` returns an array with exactly two values:

1. The current state. During the first render, it will match the `initialState` you passed.
2. The `set` function that lets you update the state to a different value and trigger a re-render.

##### Set functions, like `setSomething(nextState)`

You can call the set function to update the state.

```javascript
const [age, setAge] = useState(42);

function handleClick() {
  setAge(age + 1); // Re-render with age + 1
}
```

##### Parameters

- `nextState`: The value you want the state to become. It can be any value, but for functions it's treated specially.

##### Returns

`set` functions do not have a return value.

#### Usage

##### Adding state to a component

```javascript
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You clicked me {count} times
    </button>
  );
}
```

##### Updating state based on the previous state

```javascript
function handleClick() {
  setAge((a) => a + 1);
}
```

##### Updating objects and arrays in state

```javascript
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  },
});

function handleNameChange(e) {
  setPerson({
    ...person,
    name: e.target.value,
  });
}
```

### useEffect

`useEffect` is a React Hook that lets you synchronize a component with an external system.

```javascript
useEffect(setup, dependencies?);
```

#### Reference

##### `useEffect(setup, dependencies?)`

Call `useEffect` at the top level of your component to declare an Effect.

```javascript
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    // Runs after every render
    console.log('Component rendered');

    return () => {
      // Cleanup function
      console.log('Component will unmount');
    };
  }, []); // Empty dependency array = runs once
}
```

##### Parameters

- `setup`: The function with your Effect's logic. Your setup function may optionally return a cleanup function.
- `dependencies` (optional): The list of all reactive values referenced inside of the `setup` code.

##### Returns

`useEffect` returns `undefined`.

#### Usage

##### Connecting to an external system

```javascript
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  // ...
}
```

##### Fetching data with Effects

```javascript
import { useState, useEffect } from 'react';

function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      setIsLoading(true);
      const response = await fetch(`https://api.example.com/search?q=${query}`);
      const data = await response.json();

      if (!ignore) {
        setResults(data);
        setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, [query]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {results.map((item) => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  );
}
```

### useContext

`useContext` is a React Hook that lets you read and subscribe to context from your component.

```javascript
const value = useContext(SomeContext);
```

#### Reference

##### `useContext(SomeContext)`

Call `useContext` at the top level of your component to read and subscribe to a context.

```javascript
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
}
```

##### Parameters

- `SomeContext`: The context that you've previously created with `createContext`.

##### Returns

`useContext` returns the context value for the calling component.

#### Usage

##### Passing data deeply into the tree

```javascript
import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>I am a {theme} button</button>;
}
```

##### Updating data passed via context

```javascript
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Form />
    </ThemeContext.Provider>
  );
}

function Button() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Switch to {theme === 'dark' ? 'light' : 'dark'} mode
    </button>
  );
}
```

### useMemo

`useMemo` is a React Hook that lets you cache the result of a calculation between re-renders.

```javascript
const cachedValue = useMemo(calculateValue, dependencies);
```

#### Reference

##### `useMemo(calculateValue, dependencies)`

Call `useMemo` at the top level of your component to cache a calculation between re-renders.

```javascript
import { useMemo } from 'react';

function TodoList({ todos, filter }) {
  const visibleTodos = useMemo(() => {
    return todos.filter((todo) => todo.text.includes(filter));
  }, [todos, filter]);
  // ...
}
```

##### Parameters

- `calculateValue`: The function that calculates the value you want to cache.
- `dependencies`: The list of all reactive values referenced inside of the `calculateValue` code.

##### Returns

`useMemo` returns the cached value itself.

#### Usage

##### Skipping expensive recalculations

```javascript
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab],
  );
  // ...
}
```

##### Skipping re-rendering of components

```javascript
import { useMemo } from 'react';

function ProfilePage({ userId }) {
  const memoizedPosts = useMemo(() => {
    return getPosts(userId);
  }, [userId]);

  return <Timeline posts={memoizedPosts} />;
}
```

### useCallback

`useCallback` is a React Hook that lets you cache a function definition between re-renders.

```javascript
const cachedFn = useCallback(fn, dependencies);
```

#### Reference

##### `useCallback(fn, dependencies)`

Call `useCallback` at the top level of your component to cache a function definition between re-renders.

```javascript
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
}
```

##### Parameters

- `fn`: The function value that you want to cache.
- `dependencies`: The list of all reactive values referenced inside of the `fn` code.

##### Returns

`useCallback` returns the same function object as long as the dependencies haven't changed.

#### Usage

##### Skipping re-rendering of components

```javascript
import { useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return <ShippingForm onSubmit={handleSubmit} />;
}
```

### useRef

`useRef` is a React Hook that lets you reference a value that's not needed for rendering.

```javascript
const ref = useRef(initialValue);
```

#### Reference

##### `useRef(initialValue)`

Call `useRef` at the top level of your component to declare a ref.

```javascript
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
}
```

##### Parameters

- `initialValue`: The value you want the ref object's `current` property to be initially.

##### Returns

`useRef` returns an object with a single property:

- `current`: Initially, it's set to the `initialValue` you passed.

#### Usage

##### Referencing a value with a ref

```javascript
import { useRef, useState } from 'react';

function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
    </>
  );
}
```

##### Manipulating the DOM with a ref

```javascript
import { useRef } from 'react';

function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

### memo

`memo` lets you skip re-rendering a component when its props are unchanged.

```javascript
const MemoizedComponent = memo(Component, arePropsEqual?);
```

#### Reference

##### `memo(Component, arePropsEqual?)`

Wrap a component in `memo` to get a memoized version of that component.

```javascript
const MemoizedComponent = memo(SomeComponent, arePropsEqual);
```

##### Parameters

- `Component`: The component you want to memoize.
- `arePropsEqual` (optional): A function that takes two props objects and returns `true` if the props are equal.

##### Returns

`memo` returns a new React component.

#### Usage

##### Skipping re-rendering when props are unchanged

```javascript
import { memo } from 'react';

const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={address} onChange={(e) => setAddress(e.target.value)} />
      <Greeting name={name} />
    </>
  );
}
```

### useTransition

`useTransition` lets you update the state without blocking the UI.

```javascript
const [isPending, startTransition] = useTransition();
```

#### Reference

##### `useTransition()`

Call `useTransition` at the top level of your component to mark state updates as transitions.

```javascript
import { useState, useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {isPending && <p>Loading...</p>}
      <TabPanel tab={tab} />
    </>
  );
}
```

##### Returns

`useTransition` returns an array with exactly two items:

1. The `isPending` state that tells you whether there is a pending transition.
2. The `startTransition` function that lets you mark a state update as a transition.

### useDeferredValue

`useDeferredValue` lets you defer updating a part of the UI.

```javascript
const deferredValue = useDeferredValue(value, initialValue?);
```

#### Reference

##### `useDeferredValue(value, initialValue?)`

Call `useDeferredValue` at the top level of your component to get a deferred version of that value.

```javascript
import { useState, useDeferredValue } from 'react';

function SearchPage({ query }) {
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

##### Parameters

- `value`: The value you want to defer. It can have any type.
- `initialValue` (optional): A value to use during the initial render of the component. If omitted, the initial deferred value will be the same as the value you passed.

##### Returns

During the initial render, the returned deferred value will match the `value` you provided or `initialValue`. During updates, React will first attempt to re-render with the old value (so it will return the old deferred value), then re-render in the background with the new value (so it returns the new deferred value).

## React 19 Specific Hooks

### useActionState

`useActionState` is a Hook that simplifies managing state for form actions.

```javascript
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
```

#### Reference

##### `useActionState(fn, initialState, permalink?)`

Call `useActionState` at the top level of your component to create state for a form action.

```javascript
import { useActionState } from 'react';

function ChangeName() {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const name = formData.get('name');
      if (name.length <= 0) {
        return 'Name must be longer than empty string';
      }
      const error = await updateName(name);
      if (error) {
        return error;
      }
      redirect('/profile');
      return null;
    },
    null,
  );

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending} />
      <button type="submit" disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

##### Parameters

- `fn`: The function to be called when the form is submitted or the button pressed. When the function is first called, it will receive the `initialState` as its first argument. On subsequent calls, it will receive the previous state as its first argument.
- `initialState`: The initial value you want the state to have.
- `permalink` (optional): A string containing the URL of the page that submits the form. Used for progressive enhancement.

##### Returns

`useActionState` returns an array with exactly three items:

1. The current state. During the first render, it will be `initialState`.
2. A new action function that you can pass as the `action` prop to your form or button.
3. The pending state. `true` during the action, `false` otherwise.

### useOptimistic

`useOptimistic` is a Hook that lets you show a different state while an async action is in progress.

```javascript
const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
```

#### Reference

##### `useOptimistic(state, updateFn)`

Call `useOptimistic` at the top level of your component to show an optimistic state while an async action is underway.

```javascript
import { useOptimistic } from 'react';

function Thread({ messages, sendMessage }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true,
      },
    ],
  );

  const formRef = useRef(null);

  async function formAction(formData) {
    addOptimisticMessage(formData.get('message'));
    formRef.current.reset();
    await sendMessage(formData.get('message'));
  }

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small>Sending...</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" disabled={message.sending} />
        <button type="submit" disabled={message.sending}>
          Send
        </button>
      </form>
    </>
  );
}
```

##### Parameters

- `state`: The value to be returned initially and whenever no action is in progress.
- `updateFn`: A function that takes the current state and the value passed to `addOptimistic`, and returns the optimistic state.

##### Returns

`useOptimistic` returns an array with exactly two items:

1. The current optimistic state. If no action is in progress, it equals the passed `state`. If an action is pending, it equals the result of calling `updateFn` with the `state` and the latest optimistic value.
2. An `addOptimistic` function that you can call to trigger an optimistic update.

### useFormStatus

`useFormStatus` is a Hook that provides status information about the last form submission.

```javascript
const { pending, data, method, action } = useFormStatus();
```

#### Reference

##### `useFormStatus()`

Call `useFormStatus` at the top level of your component to read form status.

```javascript
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}
```

##### Returns

`useFormStatus` returns a status object with the following properties:

- `pending`: Boolean. `true` if the form is actively submitting, `false` otherwise.
- `data`: Object containing the form data that was submitted. Will be undefined if the form is not submitting.
- `method`: String. Either `'get'` or `'post'` depending on the form's `method` property.
- `action`: A reference to the function passed to the form's `action` prop. Will be undefined if the form is not submitting.

### use

`use` is a React API that lets you read the value of a resource like a Promise or context.

```javascript
const value = use(resource);
```

#### Reference

##### `use(resource)`

Call `use` at the top level of your component to read a resource.

```javascript
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  return <p>{message}</p>;
}

function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>Waiting for message...</p>}>
      <MessageComponent messagePromise={messagePromise} />
    </Suspense>
  );
}
```

##### Parameters

- `resource`: A resource representing the data you want to read. A resource can be a Promise or a context.

##### Returns

`use` returns the value read from the resource.

## Advanced Patterns

### Higher-Order Components (HOCs)

A higher-order component is a function that takes a component and returns a new component with additional props or behavior.

```javascript
import React from 'react';

function withLoading(Component) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return <Component {...props} />;
  };
}

const ButtonWithLoading = withLoading(Button);
```

### Render Props

The term "render prop" refers to a technique for sharing code between React components using a prop whose value is a function.

```javascript
import { useState, useEffect } from 'react';

function DataFetcher({ url, children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [url]);

  return children({ data, loading, error });
}

// Usage
<DataFetcher url="/api/users">
  {({ data, loading, error }) => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return <UserList users={data} />;
  }}
</DataFetcher>
```

### Compound Components

Compound components allow you to create components that share state and work together.

```javascript
import { createContext, useContext, useState } from 'react';

const TabsContext = createContext();

function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div className="tab-list">{children}</div>;
}

function Tab({ children, tabId }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);

  return (
    <button
      className={activeTab === tabId ? 'active' : ''}
      onClick={() => setActiveTab(tabId)}
    >
      {children}
    </button>
  );
}

function TabPanel({ children, tabId }) {
  const { activeTab } = useContext(TabsContext);

  if (activeTab !== tabId) return null;

  return <div className="tab-panel">{children}</div>;
}

// Usage
<Tabs defaultTab="profile">
  <TabList>
    <Tab tabId="profile">Profile</Tab>
    <Tab tabId="settings">Settings</Tab>
  </TabList>
  <TabPanel tabId="profile">
    <ProfileContent />
  </TabPanel>
  <TabPanel tabId="settings">
    <SettingsContent />
  </TabPanel>
</Tabs>
```

## Performance Optimization

### Code Splitting

Split your code into smaller chunks that can be loaded on demand.

```javascript
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
}
```

### Virtualization

For long lists, only render the visible items.

```javascript
import { FixedSizeList as List } from 'react-window';

function Row({ index, style }) {
  return (
    <div style={style}>
      Row {index}
    </div>
  );
}

function VirtualizedList() {
  return (
    <List height={500} itemCount={1000} itemSize={35} width={300}>
      {Row}
    </List>
  );
}
```

### Memoization Strategies

```javascript
// Component memoization
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return data.map((item) => expensiveCalculation(item));
  }, [data]);

  return <div>{/* render processedData */}</div>;
});

// Function memoization
const handleClick = useCallback(() => {
  // handler logic
}, [dependency]);

// Value memoization
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

## Testing

### Unit Testing with React Testing Library

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

describe('Counter', () => {
  it('renders with initial count', () => {
    render(<Counter />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  it('increments count when button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await user.click(screen.getByRole('button', { name: /increment/i }));

    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  it('handles async operations', async () => {
    render(<AsyncComponent />);

    await waitFor(() => {
      expect(screen.getByText('Data loaded')).toBeInTheDocument();
    });
  });
});
```

### Integration Testing

```javascript
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Integration', () => {
  it('renders the complete application flow', async () => {
    render(<App />);

    // Test initial state
    expect(screen.getByText('Welcome')).toBeInTheDocument();

    // Test user interactions
    fireEvent.click(screen.getByText('Get Started'));

    // Test navigation
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });
});
```

### Testing React 19 Features

```javascript
import { render, screen } from '@testing-library/react';
import { act } from 'react';
import MyForm from './MyForm';

describe('React 19 Features', () => {
  it('tests useActionState', async () => {
    render(<MyForm />);

    const input = screen.getByLabelText('Name');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    await act(async () => {
      await userEvent.type(input, 'John Doe');
      await userEvent.click(submitButton);
    });

    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  it('tests useOptimistic', async () => {
    render(<OptimisticForm />);

    const button = screen.getByText('Update');
    await act(async () => {
      await userEvent.click(button);
    });

    expect(screen.getByText('Optimistic value')).toBeInTheDocument();
  });
});
```

## Error Handling

### Error Boundaries

Error boundaries catch JavaScript errors in their child component tree, log those errors, and display a fallback UI.

```javascript
import { Component, ErrorInfo, ReactNode } from 'react';

interface State {
  hasError: boolean;
  error?: Error;
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div>
            <h2>Something went wrong.</h2>
            <details>{this.state.error?.toString()}</details>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>
```

### Error Handling in Hooks

```javascript
function useErrorHandler() {
  const [error, setError] = useState<Error | null>(null);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((error: Error) => {
    setError(error);
  }, []);

  useEffect(() => {
    if (error) {
      // Log error to monitoring service
      console.error('Application error:', error);
    }
  }, [error]);

  return { error, handleError, resetError };
}
```

### React 19 Error Reporting

```javascript
// Enhanced error handling with React 19
const root = createRoot(container, {
  onCaughtError: (error, errorInfo) => {
    console.error('Caught error:', error, errorInfo);
    // Send to error reporting service
    reportError(error, errorInfo);
  },
  onUncaughtError: (error, errorInfo) => {
    console.error('Uncaught error:', error, errorInfo);
    // Send to error reporting service
    reportError(error, errorInfo);
  },
  onRecoverableError: (error, errorInfo) => {
    console.error('Recoverable error:', error, errorInfo);
    // Log for debugging
    logRecoverableError(error, errorInfo);
  },
});
```

## Best Practices

### Component Design

1. **Single Responsibility**: Each component should have one clear purpose
2. **Composition over Inheritance**: Prefer composition patterns
3. **Props Interface**: Use TypeScript interfaces for type safety
4. **Default Props**: Provide sensible defaults

```javascript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
}) => {
  const baseClasses = 'btn';
  const variantClasses = `btn-${variant}`;
  const sizeClasses = `btn-${size}`;

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### State Management Patterns

1. **Local State**: Use `useState` for component-specific state
2. **Lifting State**: Share state by moving it up to common ancestor
3. **Context**: Use for global state that many components need
4. **External Libraries**: Consider for complex state management

```javascript
// Local State
function LocalComponent() {
  const [isOpen, setIsOpen] = useState(false);
  return <div>{/* ... */}</div>;
}

// Context Pattern
const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}
```

### Performance Patterns

1. **Memoization**: Use `React.memo`, `useMemo`, and `useCallback` appropriately
2. **Key Props**: Always provide stable keys for lists
3. **Avoid Inline Functions**: Define functions outside render when possible
4. **Lazy Loading**: Load components and routes on demand

```javascript
// Memoized component
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return data.map((item) => expensiveCalculation(item));
  }, [data]);

  return <div>{/* render processedData */}</div>;
});

// Stable event handler
const handleClick = useCallback(() => {
  // handler logic
}, [dependency]);
```

### Accessibility Patterns

1. **Semantic HTML**: Use appropriate HTML elements
2. **ARIA Attributes**: Add ARIA labels and roles
3. **Keyboard Navigation**: Ensure keyboard accessibility
4. **Focus Management**: Manage focus properly

```javascript
function AccessibleButton({ children, onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      {children}
    </button>
  );
}

function AccessibleModal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {children}
    </div>
  );
}
```

## Framework Integration

### Next.js Integration

```javascript
// pages/users/[id].tsx
import { GetServerSideProps } from 'next';

interface UserPageProps {
  user: User;
}

export const getServerSideProps: GetServerSideProps<UserPageProps> = async ({
  params,
}) => {
  const user = await getUser(params?.id as string);

  if (!user) {
    return { notFound: true };
  }

  return { props: { user } };
};

const UserPage: React.FC<UserPageProps> = ({ user }) => {
  return <UserProfile user={user} />;
};

export default UserPage;
```

### Remix Integration

```javascript
// app/routes/users/$userId.tsx
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getUser } from '~/models/user.server';

export async function loader({ params }) {
  const user = await getUser(params.userId);
  if (!user) {
    throw new Response('Not Found', { status: 404 });
  }
  return json({ user });
}

export default function UserRoute() {
  const { user } = useLoaderData<typeof loader>();
  return <UserProfile user={user} />;
}
```

### Astro Integration

```typescript
// src/components/ReactCounter.tsx
import { useState } from 'react';

export default function ReactCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

```astro
---
import ReactCounter from '../components/ReactCounter.tsx';
---
<html>
  <body>
    <ReactCounter client:load />
  </body>
</html>
```

## Migration Guide

### From Class Components to Hooks

```javascript
// Before: Class Component
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Count: {this.state.count}
      </button>
    );
  }
}

// After: Function Component with Hooks
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <button onClick={handleClick}>
      Count: {count}
    </button>
  );
}
```

### From Legacy Context API to Modern Context

```javascript
// Before: Legacy Context
const ThemeContext = React.createContext('light');

class ThemedButton extends React.Component {
  static contextType = ThemeContext;

  render() {
    return (
      <button theme={this.context}>
        Click me
      </button>
    );
  }
}

// After: Modern Context with Hooks
const ThemeContext = createContext('light');

function ThemedButton() {
  const theme = useContext(ThemeContext);

  return (
    <button theme={theme}>
      Click me
    </button>
  );
}
```

### Migrating to React 19

#### Step 1: Update Dependencies

```bash
npm install react@19 react-dom@19
```

#### Step 2: Update Component Refs

```javascript
// Before: forwardRef
const MyInput = forwardRef(function MyInput({ placeholder }, ref) {
  return <input placeholder={placeholder} ref={ref} />;
});

// After: ref as prop
function MyInput({ placeholder, ref }) {
  return <input placeholder={placeholder} ref={ref} />;
}
```

#### Step 3: Update Context Providers

```javascript
// Before: Context.Provider
<ThemeContext.Provider value="dark">
  {children}
</ThemeContext.Provider>

// After: Context as provider
<ThemeContext value="dark">
  {children}
</ThemeContext>
```

#### Step 4: Replace useActionState (if using useFormState)

```javascript
// Before: useFormState (deprecated)
const [state, formAction] = useFormState(action, initialState);

// After: useActionState
const [state, formAction, isPending] = useActionState(action, initialState);
```

## Resources

### Official Documentation

- [React Documentation](https://react.dev/)
- [React API Reference](https://react.dev/reference/react)
- [React DOM API Reference](https://react.dev/reference/react-dom)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)

### Learning Resources

- [Learn React](https://react.dev/learn)
- [Interactive Tutorials](https://react.dev/learn/tutorial-tic-tac-toe)
- [React Patterns](https://react.dev/learn/thinking-in-react)

### Community

- [React Community](https://react.dev/community)
- [React GitHub](https://github.com/facebook/react)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react)

### Tools and Extensions

- [React DevTools](https://react.dev/learn/react-developer-tools)
- [ESLint React Plugin](https://github.com/jsx-eslint/eslint-plugin-react)
- [TypeScript React Types](https://www.npmjs.com/package/@types/react)

---

*This documentation covers React ^19.2.0 as used in this repository. For the latest features and updates, visit the official React documentation at https://react.dev/*
