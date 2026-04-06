# Lucide React

Lucide is a beautiful and consistent icon library. Lucide React provides React components for each icon, making it easy to use icons in React applications with full TypeScript support and tree-shaking capabilities.

---

## Overview

Lucide React is a **React icon library** that provides over 1,500 icons as React components. It is the official React distribution of the Lucide icon library, offering a clean, modern API with excellent developer experience.

### Key Features

- **1,500+ Icons** - Comprehensive icon collection
- **Tree-shakeable** - Only bundle icons you use
- **TypeScript** - Full TypeScript support
- **Customizable** - Easy styling with props
- **Accessible** - Built-in accessibility attributes
- **Lightweight** - Optimized SVG icons
- **Dynamic Imports** - Load icons on demand

### When to Use Lucide React

Lucide React is ideal for:

- UI buttons and controls
- Navigation menus
- Form inputs and validation
- Status indicators
- Empty states and illustrations
- Feature highlights
- Dashboard widgets

---

## Getting Started

### Installation

```bash
npm install lucide-react
# or
yarn add lucide-react
# or
pnpm add lucide-react
```

### Quick Start

```tsx
import { Home, User, Settings, ArrowRight } from 'lucide-react';

function App() {
  return (
    <div>
      <Home size={24} color="#333" />
      <User size={32} strokeWidth={1.5} />
      <Settings className="icon-settings" />
      <ArrowRight />
    </div>
  );
}
```

---

## Core Concepts

### Icon Components

Every icon in Lucide is exported as a React component:

```tsx
import { Camera, Heart, Mail } from 'lucide-react';

// Basic usage
<Camera />

// With props
<Heart size={48} color="#ef4444" fill="#ef4444" />

// With event handlers
<Mail onClick={() => console.log('Clicked!')} />
```

### Icon Naming

Icon names follow PascalCase convention:

```tsx
// File names become component names
// arrow-right.svg -> ArrowRight
// menu-square.svg -> MenuSquare
// git-branch.svg -> GitBranch

import { ArrowRight, MenuSquare, GitBranch } from 'lucide-react';
```

### Props Interface

All icons accept these standard props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `24` | Icon size in pixels |
| `color` | `string` | `currentColor` | Stroke color |
| `strokeWidth` | `number` | `2` | Stroke width |
| `fill` | `string` | `none` | Fill color |
| `className` | `string` | - | CSS class names |
| `style` | `CSSProperties` | - | Inline styles |

---

## Usage Patterns

### Basic Styling

```tsx
import { Home, Search, Bell } from 'lucide-react';

function Navigation() {
  return (
    <nav>
      <Home size={20} color="#666" />
      <Search size={20} strokeWidth={1.5} />
      <Bell size={24} color="#3b82f6" />
    </nav>
  );
}
```

### With Tailwind CSS

```tsx
import { User, Mail, Phone } from 'lucide-react';

function ContactCard() {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex items-center gap-3">
        <User className="w-5 h-5 text-gray-500" />
        <span className="text-gray-700">John Doe</span>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <Mail className="w-5 h-5 text-blue-500" strokeWidth={2} />
        <span className="text-gray-700">john@example.com</span>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <Phone className="w-5 h-5 text-green-500" />
        <span className="text-gray-700">+1 234 567 890</span>
      </div>
    </div>
  );
}
```

### Button Icons

```tsx
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';

function ButtonExamples() {
  return (
    <div className="flex gap-2">
      <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded">
        <Plus className="w-4 h-4" />
        Add New
      </button>

      <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded">
        <Trash2 className="w-4 h-4" />
        Delete
      </button>

      <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded">
        <Save className="w-4 h-4" />
        Save
      </button>

      <button className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded" disabled>
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading...
      </button>
    </div>
  );
}
```

### Form Inputs

```tsx
import { Mail, Lock, Eye, EyeOff, Search } from 'lucide-react';
import { useState } from 'react';

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="space-y-4">
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="email"
          placeholder="Email"
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          className="w-full pl-10 pr-10 py-2 border rounded-lg"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5 text-gray-400" />
          ) : (
            <Eye className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="search"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>
    </form>
  );
}
```

---

## Dynamic Icons

### Icon by Name

```tsx
import * as LucideIcons from 'lucide-react';

function DynamicIcon({ name, ...props }) {
  const IconComponent = LucideIcons[name];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent {...props} />;
}

// Usage
<DynamicIcon name="Home" size={24} />
<DynamicIcon name="User" size={32} color="blue" />
```

### Selective Imports for Dynamic Icons

```tsx
import {
  Home,
  User,
  Settings,
  Bell,
  Search,
  Menu,
} from 'lucide-react';

const iconMap = {
  home: Home,
  user: User,
  settings: Settings,
  bell: Bell,
  search: Search,
  menu: Menu,
};

function AppIcon({ name, ...props }) {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent {...props} />;
}
```

### Lazy Loading Icons

```tsx
import { lazy, Suspense } from 'react';

function LazyIcon({ name, ...props }) {
  const IconComponent = lazy(() =>
    import('lucide-react').then((module) => ({
      default: module[name],
    }))
  );

  return (
    <Suspense fallback={<div style={{ width: props.size, height: props.size }} />}>
      <IconComponent {...props} />
    </Suspense>
  );
}
```

---

## Accessibility

### ARIA Labels

```tsx
import { Trash2, Edit, Plus } from 'lucide-react';

function AccessibleButtons() {
  return (
    <div>
      <button aria-label="Delete item">
        <Trash2 className="w-5 h-5" aria-hidden="true" />
      </button>

      <button aria-label="Edit item">
        <Edit className="w-5 h-5" aria-hidden="true" />
      </button>

      <button aria-label="Add new item">
        <Plus className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
}
```

### Screen Reader Support

```tsx
import { Check, X, AlertCircle } from 'lucide-react';

function StatusMessage({ type, message }) {
  const icons = {
    success: { icon: Check, color: 'text-green-500', label: 'Success' },
    error: { icon: X, color: 'text-red-500', label: 'Error' },
    warning: { icon: AlertCircle, color: 'text-yellow-500', label: 'Warning' },
  };

  const { icon: Icon, color, label } = icons[type];

  return (
    <div className={`flex items-center gap-2 ${color}`} role="alert">
      <Icon className="w-5 h-5" aria-hidden="true" />
      <span className="sr-only">{label}:</span>
      <span>{message}</span>
    </div>
  );
}
```

---

## Animations

### CSS Animations

```tsx
import { Loader2, RefreshCw, Spin } from 'lucide-react';

function LoadingSpinner() {
  return (
    <div>
      <Loader2 className="w-6 h-6 animate-spin" />
      <RefreshCw className="w-6 h-6 animate-spin" />
    </div>
  );
}
```

### Tailwind Animations

```tsx
import { ArrowRight, ChevronDown, Check } from 'lucide-react';

function AnimatedIcons() {
  return (
    <div>
      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
      <Check className="w-5 h-5 animate-bounce" />
    </div>
  );
}
```

### Custom Animations

```tsx
import { Heart } from 'lucide-react';
import { useState } from 'react';

function LikeButton() {
  const [liked, setLiked] = useState(false);

  return (
    <button
      onClick={() => setLiked(!liked)}
      className="relative"
    >
      <Heart
        className={`w-8 h-8 transition-all duration-300 ${
          liked ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-400'
        }`}
      />
    </button>
  );
}
```

---

## Advanced Patterns

### Icon System

```tsx
import { icons } from 'lucide-react';

// Size variants
const iconSizes = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

// Color variants
const iconColors = {
  primary: 'text-blue-500',
  secondary: 'text-gray-500',
  success: 'text-green-500',
  danger: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-cyan-500',
};

interface IconProps {
  name: keyof typeof icons;
  size?: keyof typeof iconSizes;
  color?: keyof typeof iconColors;
  className?: string;
}

function SystemIcon({ name, size = 'md', color = 'secondary', className }: IconProps) {
  const IconComponent = icons[name];

  if (!IconComponent) {
    return null;
  }

  return (
    <IconComponent
      size={iconSizes[size]}
      className={`${iconColors[color]} ${className}`}
    />
  );
}

// Usage
<SystemIcon name="Home" size="lg" color="primary" />
<SystemIcon name="Trash2" size="sm" color="danger" />
```

### Icon Button Component

```tsx
import { LucideIcon } from 'lucide-react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const variants = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600',
  secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
};

const sizes = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3',
};

function IconButton({
  icon: Icon,
  label,
  variant = 'secondary',
  size = 'md',
  isLoading,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-lg transition-colors disabled:opacity-50 ${
        variants[variant]
      } ${sizes[size]} ${className}`}
      aria-label={label}
      disabled={isLoading}
      {...props}
    >
      <Icon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
    </button>
  );
}

// Usage
<IconButton icon={Plus} label="Add item" variant="primary" />
<IconButton icon={Trash2} label="Delete" variant="danger" />
<IconButton icon={Loader2} isLoading label="Loading" />
```

### Icon Input Component

```tsx
import { LucideIcon, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  rightIcon?: LucideIcon;
  error?: string;
  label?: string;
}

function IconInput({
  icon: Icon,
  rightIcon: RightIcon,
  error,
  label,
  className,
  type,
  ...props
}: IconInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type={inputType}
          className={`w-full pl-10 pr-${RightIcon || isPassword ? '10' : '4'} py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
          {...props}
        />
        {(RightIcon || isPassword) && (
          <button
            type="button"
            onClick={() => isPassword && setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {isPassword ? (
              showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )
            ) : (
              RightIcon && <RightIcon className="w-5 h-5 text-gray-400" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

// Usage
<IconInput
  icon={Mail}
  type="email"
  placeholder="Enter your email"
  label="Email"
/>
<IconInput
  icon={Lock}
  type="password"
  placeholder="Enter your password"
  label="Password"
/>
```

---

## TypeScript Support

### Type Exports

```tsx
import type { LucideProps, LucideIcon } from 'lucide-react';

// Using icon type
const myIcon: LucideIcon = Home;

// Extending icon props
interface CustomIconProps extends LucideProps {
  variant?: 'filled' | 'outlined';
}

function CustomIcon({ variant, ...props }: CustomIconProps) {
  return <Home {...props} />;
}
```

### Icon Name Types

```tsx
import * as Lucide from 'lucide-react';

// Get all icon names as type
type IconName = keyof typeof Lucide;

// Specific icon subset
type NavigationIcon = 'Home' | 'Menu' | 'Search' | 'User';
type ActionIcon = 'Plus' | 'Edit' | 'Trash2' | 'Save';
type StatusIcon = 'Check' | 'X' | 'AlertCircle' | 'Info';

interface IconProps {
  name: NavigationIcon;
  size?: number;
}

function NavigationIcon({ name, size = 24 }: IconProps) {
  const Icon = Lucide[name];
  return <Icon size={size} />;
}
```

---

## Best Practices

### Consistent Sizing

```tsx
// Create a centralized icon configuration
const ICON_SIZES = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

// Use throughout your application
<Home size={ICON_SIZES.sm} />
<User size={ICON_SIZES.md} />
<Settings size={ICON_SIZES.lg} />
```

### Semantic Usage

```tsx
// Use appropriate icons for the context
// Navigation
import { Home, Search, User, Settings } from 'lucide-react';

// Actions
import { Plus, Edit, Trash2, Save, Download } from 'lucide-react';

// Status
import { Check, X, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Media
import { Play, Pause, Volume2, VolumeX, Image, Video } from 'lucide-react';
```

### Color Management

```tsx
// Use currentColor for easy theming
<Home className="text-blue-500" />
<Home className="text-red-500" />
<Home className="text-current" />

// Or with explicit colors
<Home color="#3b82f6" />
<Home color="rgb(59, 130, 246)" />
<Home color="hsl(217, 91%, 60%)" />
```

### Performance

```tsx
// Import only needed icons (tree-shaking)
// ✅ Good
import { Home, User, Settings } from 'lucide-react';

// ❌ Avoid - imports entire library
import * as Icons from 'lucide-react';

// For dynamic icons, use selective imports
const iconMap = {
  home: Home,
  user: User,
  settings: Settings,
};
```

---

## Integration

### Next.js

```tsx
// app/page.tsx
import { Home, ArrowRight } from 'lucide-react';

export default function Page() {
  return (
    <main>
      <Home className="w-6 h-6" />
      <ArrowRight className="w-6 h-6" />
    </main>
  );
}
```

### Astro

```astro
---
import { Rocket, Star } from 'lucide-react';
---

<main>
  <Rocket size={32} />
  <Star size={32} color="gold" />
</main>
```

### React Server Components

```tsx
// Server Component
import { Database } from 'lucide-react';

export default async function ServerPage() {
  const data = await fetchData();

  return (
    <div>
      <Database className="w-8 h-8" />
      <p>Data loaded: {data.length} items</p>
    </div>
  );
}
```

---

## Troubleshooting

### Common Issues

**Icon not found:**
- Check icon name spelling (PascalCase)
- Verify import path
- Check Lucide version for icon availability

**Styling not applied:**
- Ensure className is passed correctly
- Check CSS specificity
- Verify Tailwind classes are processed

**Size not working:**
- Use `size` prop, not `width`/`height`
- For Tailwind, use `w-` and `h-` classes

### Debug Helper

```tsx
import * as Lucide from 'lucide-react';

function listAvailableIcons() {
  const icons = Object.keys(Lucide).filter(
    (key) => typeof Lucide[key] === 'function'
  );
  console.log('Available icons:', icons);
  return icons;
}

function validateIconName(name: string): boolean {
  return name in Lucide && typeof Lucide[name] === 'function';
}
```

---

## Resources

- [Official Website](https://lucide.dev/)
- [Icon Library](https://lucide.dev/icons/)
- [GitHub Repository](https://github.com/lucide-icons/lucide)
- [NPM Package](https://www.npmjs.com/package/lucide-react)
- [Figma Plugin](https://www.figma.com/community/plugin/930120402706102022)

---

## Version Information

- **Current Version:** 0.487.0
- **License:** ISC
- **React Support:** 16.8+
- **TypeScript:** Full support
- **Bundle Size:** ~2-5KB per icon (tree-shaken)
- **Total Icons:** 1,500+
