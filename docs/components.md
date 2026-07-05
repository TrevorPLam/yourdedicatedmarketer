# UI Components Documentation

This document describes the core UI components available in `@repo/ui`.

## Button

A versatile button component with multiple variants and sizes.

### Usage

```tsx
import { Button } from '@repo/ui';

<Button>Default Button</Button>
<Button variant="primary">Primary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button size="lg">Large Button</Button>
```

### Variants

- `default` - Primary brand color
- `primary` - Uses brand primary color
- `destructive` - Red for destructive actions
- `outline` - Outlined button
- `ghost` - Ghost button with hover effect
- `link` - Link-style button

### Sizes

- `default` - Standard size (h-10)
- `sm` - Small (h-9)
- `lg` - Large (h-11)
- `icon` - Icon-sized (h-10 w-10)

## Card

A card component for grouping related content.

### Usage

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@repo/ui';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Components

- `Card` - Main container
- `CardHeader` - Header section
- `CardTitle` - Title text
- `CardDescription` - Description text
- `CardContent` - Main content area
- `CardFooter` - Footer section

## Container

A container component that centers content with responsive max-width and padding.

### Usage

```tsx
import { Container } from '@repo/ui';

<Container maxWidth="xl">
  <p>Centered content</p>
</Container>
```

### Props

- `maxWidth` - Maximum width of the container
  - `sm` - Small (max-w-sm)
  - `md` - Medium (max-w-md)
  - `lg` - Large (max-w-lg)
  - `xl` - Extra large (max-w-xl, default)
  - `full` - Full width (max-w-full)
- `className` - Additional CSS classes

### Responsive Padding

The container includes responsive padding:
- Mobile: `px-4`
- Small screens: `sm:px-6`
- Large screens: `lg:px-8`

## Section

A section component that adds consistent vertical spacing.

### Usage

```tsx
import { Section } from '@repo/ui';

<Section>
  <p>Content with vertical spacing</p>
</Section>
```

### Props

- `as` - HTML element to render (`section` or `div`, default: `section`)
- `className` - Additional CSS classes

### Spacing

- Mobile: `py-12` (3rem)
- Medium screens and up: `md:py-20` (5rem)

## Header

A responsive header component with navigation links, theme toggle, and mobile menu support.

### Usage

```tsx
import { Header } from '@repo/ui';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
];

<Header navItems={navItems} />
```

### Props

- `navItems` - Array of navigation items with `href` and `label` properties
- `logo` - Optional custom logo component (defaults to text "Logo")

### Features

- **Sticky positioning** - Header stays at top when scrolling
- **Responsive design** - Desktop shows horizontal nav, mobile shows hamburger menu
- **Active state highlighting** - Current page link is highlighted
- **Theme toggle** - Includes dark/light mode toggle button
- **Accessibility** - Semantic HTML with ARIA labels

## NavLink

A navigation link component that supports active state styling and ARIA attributes.

### Usage

```tsx
import { NavLink } from '@repo/ui';

<NavLink href="/about" isActive={pathname === '/about'} className="text-sm">
  About
</NavLink>
```

### Props

- `href` - Link destination
- `isActive` - Whether the link is currently active
- `activeClassName` - CSS class for active state (default: `text-primary font-semibold`)
- `className` - Additional CSS classes
- `children` - Link content

### Accessibility

- Sets `aria-current="page"` when active
- Supports keyboard navigation

## MobileMenu

A slide-out mobile menu component with overlay and keyboard support.

### Usage

```tsx
import { MobileMenu } from '@repo/ui';

<MobileMenu
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  navItems={navItems}
  currentPath={pathname}
/>
```

### Props

- `isOpen` - Whether the menu is open
- `onClose` - Callback to close the menu
- `navItems` - Array of navigation items
- `currentPath` - Current pathname for active state

### Features

- **Slide-out animation** - Smooth slide-in from right
- **Overlay backdrop** - Semi-transparent background
- **Keyboard support** - Press Escape to close
- **Body scroll lock** - Prevents scrolling when open
- **Accessibility** - ARIA dialog with proper labels

## Best Practices

1. **Use Server Components by default** - All components are Server Components unless they need interactivity
2. **Use variants instead of raw classes** - Prefer variant props over passing raw Tailwind classes
3. **Compose components** - Use Container and Section together for consistent layouts
4. **Test components** - All components have unit tests using Vitest and React Testing Library
5. **Navigation components** - Header, NavLink, and MobileMenu are Client Components that use Next.js hooks for routing
