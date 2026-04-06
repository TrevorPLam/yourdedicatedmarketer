# class-variance-authority (cva)

class-variance-authority (cva) is a utility for creating type-safe, composable, and reusable component variants. It provides a powerful API for managing component styling variants with TypeScript support.

---

## Overview

**class-variance-authority** is a **variant management library** for styling components. It works alongside `tailwind-merge` and `clsx` to create type-safe component variants with a clean, composable API.

### Key Features

- **Type-safe** - Full TypeScript support with autocomplete
- **Composable** - Compose variants across component hierarchies
- **Reusable** - Create variant-driven design systems
- **Framework Agnostic** - Works with any framework or vanilla JS
- **Lightweight** - Tiny footprint (~1KB)
- **Developer Experience** - Great autocomplete and type inference

### When to Use cva

CVA is ideal for:

- Button component variants (size, color, state)
- Card component variants (padding, shadow, border)
- Input component variants (size, state, intent)
- Badge/Tag component variants
- Alert/Toast component variants
- Any component with multiple style combinations

---

## Getting Started

### Installation

```bash
npm install class-variance-authority
# or
yarn add class-variance-authority
# or
pnpm add class-variance-authority
```

**Peer Dependencies:**
```bash
npm install clsx tailwind-merge
```

### Quick Start

```typescript
import { cva } from 'class-variance-authority';

const button = cva('inline-flex items-center justify-center rounded-md', {
  variants: {
    intent: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    },
    size: {
      small: 'px-2 py-1 text-sm',
      medium: 'px-4 py-2 text-base',
      large: 'px-6 py-3 text-lg',
    },
  },
  compoundVariants: [
    {
      intent: 'primary',
      size: 'large',
      class: 'font-bold',
    },
  ],
  defaultVariants: {
    intent: 'primary',
    size: 'medium',
  },
});

// Usage
button({ intent: 'primary', size: 'large' });
// => "inline-flex items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 text-lg font-bold"

button({ intent: 'secondary' });
// => "inline-flex items-center justify-center rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300 px-4 py-2 text-base"
```

---

## Core Concepts

### Basic Variant Definition

```typescript
import { cva } from 'class-variance-authority';

const component = cva('base-classes', {
  variants: {
    variantName: {
      option1: 'classes-for-option-1',
      option2: 'classes-for-option-2',
    },
  },
  defaultVariants: {
    variantName: 'option1',
  },
});
```

### The cva Function

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

// 1. Define base classes
// 2. Define variants object
// 3. Optional: compoundVariants for special combinations
// 4. Optional: defaultVariants for fallback values

const example = cva('base-class', {
  variants: {
    color: {
      red: 'text-red-600',
      blue: 'text-blue-600',
    },
    size: {
      sm: 'text-sm',
      lg: 'text-lg',
    },
  },
  compoundVariants: [
    {
      color: 'red',
      size: 'lg',
      class: 'font-bold',
    },
  ],
  defaultVariants: {
    color: 'blue',
    size: 'sm',
  },
});

// Extract variant props type
type ExampleProps = VariantProps<typeof example>;
// => { color?: 'red' | 'blue', size?: 'sm' | 'lg' }
```

---

## Variants

### Simple Variants

```typescript
const button = cva('rounded', {
  variants: {
    color: {
      blue: 'bg-blue-500',
      red: 'bg-red-500',
    },
  },
});

button({ color: 'blue' });
// => "rounded bg-blue-500"
```

### Multiple Variant Groups

```typescript
const button = cva('inline-flex items-center justify-center rounded-md', {
  variants: {
    variant: {
      solid: '',
      outline: 'border-2 bg-transparent',
      ghost: 'bg-transparent',
    },
    color: {
      primary: '',
      secondary: '',
      danger: '',
    },
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
    },
  },
  defaultVariants: {
    variant: 'solid',
    color: 'primary',
    size: 'md',
  },
});

// Usage with all variants
button({ variant: 'outline', color: 'danger', size: 'lg' });
```

### Boolean Variants

```typescript
const button = cva('rounded', {
  variants: {
    disabled: {
      true: 'opacity-50 cursor-not-allowed',
      false: '',
    },
    loading: {
      true: 'cursor-wait',
      false: '',
    },
  },
  defaultVariants: {
    disabled: false,
    loading: false,
  },
});

button({ disabled: true });
// => "rounded opacity-50 cursor-not-allowed"
```

### Enum-like Variants

```typescript
const alert = cva('p-4 rounded', {
  variants: {
    status: {
      info: 'bg-blue-50 text-blue-800 border border-blue-200',
      success: 'bg-green-50 text-green-800 border border-green-200',
      warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
      error: 'bg-red-50 text-red-800 border border-red-200',
    },
  },
  defaultVariants: {
    status: 'info',
  },
});
```

---

## Compound Variants

Compound variants apply classes when specific combinations of variants are met.

### Basic Compound Variants

```typescript
const button = cva('inline-flex items-center justify-center rounded', {
  variants: {
    variant: {
      solid: '',
      outline: 'border-2 bg-transparent',
    },
    color: {
      primary: '',
      secondary: '',
    },
  },
  compoundVariants: [
    {
      variant: 'solid',
      color: 'primary',
      class: 'bg-blue-600 text-white hover:bg-blue-700',
    },
    {
      variant: 'solid',
      color: 'secondary',
      class: 'bg-gray-600 text-white hover:bg-gray-700',
    },
    {
      variant: 'outline',
      color: 'primary',
      class: 'border-blue-600 text-blue-600 hover:bg-blue-50',
    },
    {
      variant: 'outline',
      color: 'secondary',
      class: 'border-gray-600 text-gray-600 hover:bg-gray-50',
    },
  ],
  defaultVariants: {
    variant: 'solid',
    color: 'primary',
  },
});
```

### Array Syntax for Multiple Matches

```typescript
const button = cva('rounded', {
  variants: {
    intent: {
      primary: '',
      secondary: '',
      danger: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  compoundVariants: [
    {
      // Apply to multiple intents
      intent: ['primary', 'secondary'],
      size: 'lg',
      class: 'font-bold',
    },
    {
      intent: 'danger',
      // Apply to multiple sizes
      size: ['md', 'lg'],
      class: 'uppercase tracking-wide',
    },
  ],
});
```

---

## Default Variants

Default variants are used when no value is provided for a variant.

```typescript
const button = cva('inline-flex items-center justify-center', {
  variants: {
    variant: {
      solid: 'bg-blue-600 text-white',
      outline: 'border-2 border-blue-600 text-blue-600',
    },
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
});

// Uses defaults: variant='solid', size='md'
button();
// => "inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 text-base"

// Overrides default variant
button({ variant: 'outline' });
// => "inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 px-4 py-2 text-base"
```

---

## TypeScript Support

### VariantProps Type Helper

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const button = cva('rounded', {
  variants: {
    intent: {
      primary: 'bg-blue-500',
      secondary: 'bg-gray-500',
    },
    size: {
      sm: 'px-2 py-1',
      lg: 'px-4 py-2',
    },
  },
});

// Extract props type
type ButtonVariantProps = VariantProps<typeof button>;
// => { intent?: 'primary' | 'secondary', size?: 'sm' | 'lg' }

// Use in component interface
interface ButtonProps extends ButtonVariantProps {
  children: React.ReactNode;
  onClick?: () => void;
}

function Button({ intent, size, children, onClick }: ButtonProps) {
  return (
    <button className={button({ intent, size })} onClick={onClick}>
      {children}
    </button>
  );
}
```

### Type-safe Component Props

```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils'; // Your clsx + tailwind-merge utility

// Define variants
const alertVariants = cva('p-4 rounded-md', {
  variants: {
    variant: {
      default: 'bg-gray-100 text-gray-900',
      destructive: 'bg-red-100 text-red-900',
      success: 'bg-green-100 text-green-900',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

// Export type for external use
export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

// Component with full type safety
export function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}
```

### Extending Variant Types

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const baseButton = cva('rounded', {
  variants: {
    size: {
      sm: 'px-2 py-1',
      md: 'px-4 py-2',
    },
  },
});

const iconButton = cva('rounded-full', {
  variants: {
    size: {
      sm: 'p-1',
      md: 'p-2',
      lg: 'p-3',
    },
  },
});

// Reuse variant props
type BaseButtonProps = VariantProps<typeof baseButton>;
type IconButtonProps = VariantProps<typeof iconButton>;
```

---

## React Integration

### Basic Button Component

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

### Card Component with Variants

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva('rounded-lg border bg-card text-card-foreground shadow-sm', {
  variants: {
    variant: {
      default: 'border-border',
      ghost: 'border-transparent shadow-none',
      outline: 'border-2',
    },
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
});

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

function Card({ className, variant, padding, ...props }: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    />
  );
}

// Card parts
const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5', className)} {...props} />
);

const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />
);

const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props} />
);

const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('pt-0', className)} {...props} />
);

const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center pt-0', className)} {...props} />
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
```

### Badge Component

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
```

---

## Advanced Patterns

### Composing Variants

```typescript
import { cva } from 'class-variance-authority';

// Base component styles
const base = cva('rounded', {
  variants: {
    size: {
      sm: 'text-sm',
      lg: 'text-lg',
    },
  },
});

// Extended component
const extended = cva(['font-bold', base()], {
  variants: {
    color: {
      red: 'text-red-500',
      blue: 'text-blue-500',
    },
  },
});
```

### Slot-based Variants

```tsx
import { cva } from 'class-variance-authority';

// For components with multiple styled parts
const alertVariants = cva('relative w-full rounded-lg border p-4', {
  variants: {
    variant: {
      default: 'bg-background text-foreground',
      destructive: 'border-destructive/50 text-destructive dark:border-destructive',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const alertTitleVariants = cva('mb-1 font-medium leading-none tracking-tight');

const alertDescriptionVariants = cva('text-sm [&_p]:leading-relaxed');

// Usage
function Alert({ children, variant }) {
  return (
    <div className={alertVariants({ variant })} role="alert">
      {children}
    </div>
  );
}

function AlertTitle({ children }) {
  return <h5 className={alertTitleVariants()}>{children}</h5>;
}

function AlertDescription({ children }) {
  return <div className={alertDescriptionVariants()}>{children}</div>;
}
```

### Responsive Variants

```typescript
import { cva } from 'class-variance-authority';

const responsiveButton = cva(
  'inline-flex items-center justify-center rounded-md',
  {
    variants: {
      size: {
        default: 'h-9 px-4 py-2 text-sm',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-8 text-base',
      },
      responsive: {
        true: 'md:h-10 md:px-6 md:text-base',
        false: '',
      },
    },
    defaultVariants: {
      size: 'default',
      responsive: false,
    },
  }
);
```

### With Tailwind Merge

```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

// Utility function
export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const button = cva('rounded', {
  variants: {
    size: {
      sm: 'px-2 py-1',
      lg: 'px-4 py-2',
    },
  },
});

// cva handles tailwind-merge internally
// But you can also compose manually
function Button({ className, size }) {
  return (
    <button className={cn(button({ size }), className)}>
      Click me
    </button>
  );
}
```

---

## Utility Functions

### Combining with clsx

```typescript
import { cva } from 'class-variance-authority';
import clsx from 'clsx';

const button = cva('rounded', {
  variants: {
    active: {
      true: 'bg-blue-500',
      false: 'bg-gray-500',
    },
  },
});

// Conditionally apply additional classes
function MyButton({ isActive, isDisabled }) {
  return (
    <button
      className={clsx(
        button({ active: isActive }),
        isDisabled && 'opacity-50 cursor-not-allowed',
        isActive && 'ring-2 ring-blue-300'
      )}
    >
      Button
    </button>
  );
}
```

### Dynamic Variant Selection

```typescript
const button = cva('rounded', {
  variants: {
    color: {
      primary: 'bg-blue-500',
      secondary: 'bg-gray-500',
    },
  },
});

// Dynamic variant based on props
function DynamicButton({ importance }) {
  const color = importance > 5 ? 'primary' : 'secondary';
  return <button className={button({ color })}>Dynamic</button>;
}
```

---

## Best Practices

### Organizing Variants

```typescript
// components/ui/button.ts
import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-input bg-background',
        secondary: 'bg-secondary text-secondary-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Export for use in other components
export type ButtonVariants = typeof buttonVariants;
```

### Naming Conventions

```typescript
// Use descriptive variant names
const button = cva('base', {
  variants: {
    // Good: Clear intent
    intent: {
      primary: '...',
      secondary: '...',
    },
    // Good: Self-explanatory
    size: {
      small: '...',
      medium: '...',
      large: '...',
    },
    // Good: Boolean states
    isDisabled: {
      true: '...',
      false: '...',
    },
    isLoading: {
      true: '...',
      false: '...',
    },
  },
});
```

### Avoiding Class Conflicts

```typescript
// cva handles conflicts intelligently, but be careful with:
// 1. Ordering in class strings
// 2. !important in base classes
// 3. Overlapping responsive prefixes

const problematic = cva('p-4 md:p-6', {
  variants: {
    padding: {
      none: 'p-0',  // This might not override p-4 as expected
    },
  },
});

// Better: Use consistent approach
const better = cva('', {
  variants: {
    padding: {
      none: 'p-0',
      sm: 'p-2 md:p-4',
      md: 'p-4 md:p-6',
      lg: 'p-6 md:p-8',
    },
  },
  defaultVariants: {
    padding: 'md',
  },
});
```

---

## Troubleshooting

### Common Issues

**Classes not applying:**
- Check for typos in variant names
- Ensure classes are valid Tailwind classes
- Verify variant values are defined

**TypeScript errors:**
- Make sure to use `VariantProps` from cva
- Check that variant names match in definition and usage
- Ensure component props extend the variant props type

**Unexpected styling:**
- Check compoundVariants for unintended matches
- Verify defaultVariants are set correctly
- Review class ordering and specificity

### Debug Helper

```typescript
import { cva } from 'class-variance-authority';

// Enable debug logging
const debugButton = cva('rounded', {
  variants: {
    size: {
      sm: 'px-2',
      lg: 'px-4',
    },
  },
});

// Test all combinations
console.log('Default:', debugButton());
console.log('Small:', debugButton({ size: 'sm' }));
console.log('Large:', debugButton({ size: 'lg' }));
```

---

## Resources

- [GitHub Repository](https://github.com/joe-bell/cva)
- [NPM Package](https://www.npmjs.com/package/class-variance-authority)
- [shadcn/ui](https://ui.shadcn.com/) - Uses cva extensively

---

## Version Information

- **Current Version:** 0.7.x
- **License:** Apache-2.0
- **Bundle Size:** ~1KB
- **TypeScript:** Full support
