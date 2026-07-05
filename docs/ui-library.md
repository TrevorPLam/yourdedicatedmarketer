# UI Library Setup

This document describes the UI package setup and how to use shadcn/ui components in the monorepo.

## Overview

The UI library is located in `packages/ui` and provides a set of reusable React components based on shadcn/ui. It follows the "New York" style with a Neutral base color.

## Package Structure

```
packages/ui/
├── src/
│   ├── components/ui/    # shadcn/ui components
│   ├── lib/
│   │   └── utils.ts      # utility functions (cn helper)
│   ├── styles.css       # CSS variables and theme configuration
│   └── index.ts          # public API entry point
├── components.json       # shadcn/ui configuration
├── package.json
└── tsconfig.json
```

## Configuration

### components.json

The `components.json` file configures shadcn/ui for the monorepo:

- **Style**: New York
- **Base Color**: Neutral
- **CSS Variables**: Enabled
- **Icon Library**: Lucide React

### Tailwind CSS v4

The UI package uses Tailwind CSS v4 with a CSS-first approach. Theme tokens are defined in `src/styles.css` using the `@theme` directive:

```css
@import "tailwindcss";

@theme {
  --color-background: 0 0% 100%;
  --color-foreground: 0 0% 3.9%;
  /* ... more color tokens */
  --radius: 0.5rem;
}
```

## Available Components

The following shadcn/ui components are currently available:

- **Button** - Various button styles and sizes
- **Card** - Card container with header, content, and footer
- **Input** - Text input field
- **Label** - Form label component
- **Accordion** - Collapsible content sections

## Usage in Applications

To use the UI components in an application (e.g., `apps/firm-website`):

### 1. Add Dependency

Add `@repo/ui` to the application's `package.json`:

```json
{
  "dependencies": {
    "@repo/ui": "workspace:*"
  }
}
```

### 2. Configure Next.js

Add `@repo/ui` to the `transpilePackages` array in `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui'],
  // ... other config
};
```

### 3. Import Styles

Import the UI styles in the application's global CSS:

```css
@import 'tailwindcss';
@import '@repo/ui/src/styles.css';
```

### 4. Use Components

Import and use components in your React components:

```tsx
import { Button, Card, Input } from '@repo/ui';

export default function MyComponent() {
  return (
    <Card>
      <Button>Click me</Button>
      <Input placeholder="Enter text" />
    </Card>
  );
}
```

## Adding New Components

To add new shadcn/ui components:

1. Navigate to `packages/ui/`
2. Run the shadcn CLI: `npx shadcn@latest add [component-name]`
3. The component will be added to `src/components/ui/`
4. Export the component in `src/index.ts`

## Customization

### Theme Tokens

Customize theme tokens in `packages/ui/src/styles.css` by modifying the `@theme` directive:

```css
@theme {
  --color-primary: 220 90% 56%; /* Custom primary color */
  --radius: 0.75rem; /* Custom border radius */
}
```

### Component Styles

Component styles can be customized by modifying the component files in `src/components/ui/`. The components use Tailwind utility classes and the `cn()` helper for conditional styling.

## Dependencies

The UI package depends on:

- **React 19** - UI framework
- **Radix UI** - Headless UI primitives
- **Tailwind CSS v4** - Styling
- **class-variance-authority** - Component variants
- **clsx** - Conditional class names
- **tailwind-merge** - Tailwind class merging
- **lucide-react** - Icon library

## Best Practices

- Always use the `cn()` utility for conditional class names
- Follow the existing component patterns when adding new components
- Keep components as Server Components by default
- Use the exported types from components for type safety
- Test components in isolation before using them in applications
