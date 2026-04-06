# clsx & tailwind-merge

`clsx` and `tailwind-merge` are essential utility libraries for managing CSS class names in modern web applications. They work together to provide a powerful solution for conditional class merging and Tailwind CSS deduplication.

---

## Overview

**clsx** is a tiny utility for constructing `className` strings conditionally. **tailwind-merge** provides intelligent Tailwind CSS class merging, resolving conflicts by removing contradictory classes.

### Key Features

**clsx:**
- Tiny (~300 bytes)
- Faster than `classnames`
- Handles arrays, objects, strings
- TypeScript support
- No dependencies

**tailwind-merge:**
- Resolves Tailwind class conflicts
- Removes duplicate classes
- Handles modifiers (responsive, hover, focus)
- Extensible configuration
- Type-safe

### When to Use

Use both libraries together when:
- Building component libraries with conditional styling
- Working with Tailwind CSS
- Accepting className props that need to override defaults
- Handling dynamic class combinations

---

## Getting Started

### Installation

```bash
npm install clsx tailwind-merge
# or
yarn add clsx tailwind-merge
# or
pnpm add clsx tailwind-merge
```

### Quick Start

```typescript
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// Combined utility
function cn(...inputs: (string | undefined | null | false | Record<string, boolean>)[]) {
  return twMerge(clsx(inputs));
}

// Usage
const className = cn(
  'px-4 py-2',           // Base classes
  isActive && 'bg-blue-500',  // Conditional
  isLarge ? 'text-lg' : 'text-sm',  // Ternary
  'hover:bg-blue-600'     // Additional
);
```

---

## clsx

### Basic Usage

```typescript
import clsx from 'clsx';

// String
clsx('foo', 'bar');
// => 'foo bar'

// Objects
clsx({ foo: true, bar: false, baz: true });
// => 'foo baz'

// Arrays
clsx(['foo', 'bar']);
// => 'foo bar'

// Mixed
clsx('foo', { bar: true }, ['baz'], null, undefined, 0, false);
// => 'foo bar baz'
```

### Conditional Classes

```typescript
import clsx from 'clsx';

// Simple condition
clsx(isActive && 'active');
// isActive === true => 'active'
// isActive === false => ''

// Ternary
clsx(isLarge ? 'text-lg' : 'text-sm');

// Object syntax (cleaner for multiple conditions)
clsx({
  'bg-blue-500': isActive,
  'text-white': isActive,
  'bg-gray-200': !isActive,
  'text-gray-800': !isActive,
  'rounded': true,
});

// Nested conditions
clsx('base', {
  'px-4': size === 'sm',
  'px-6': size === 'md',
  'px-8': size === 'lg',
  'py-2': size !== 'lg',
  'py-3': size === 'lg',
});
```

### Arrays and Nested Values

```typescript
import clsx from 'clsx';

// Array of classes
const baseClasses = ['px-4', 'py-2', 'rounded'];
clsx(baseClasses);
// => 'px-4 py-2 rounded'

// Nested arrays
clsx(['px-4', ['py-2', ['rounded']]]);
// => 'px-4 py-2 rounded'

// Combining arrays and objects
const buttonClasses = [
  'inline-flex',
  'items-center',
  'justify-center',
  {
    'bg-blue-500': variant === 'primary',
    'bg-gray-500': variant === 'secondary',
    'h-8 px-3': size === 'sm',
    'h-10 px-4': size === 'md',
  },
];

clsx(buttonClasses);
```

### Null and Undefined Handling

```typescript
import clsx from 'clsx';

// Falsy values are ignored
clsx('foo', null, undefined, false, 0, '');
// => 'foo'

// Useful for optional props
function Button({ className, isActive }) {
  return (
    <button
      className={clsx(
        'base-button',
        className,  // May be undefined
        isActive && 'active'
      )}
    >
      Click me
    </button>
  );
}
```

---

## tailwind-merge

### Basic Usage

```typescript
import { twMerge } from 'tailwind-merge';

// Removes duplicate classes
twMerge('px-4 py-2 px-4');
// => 'py-2 px-4'

// Resolves conflicting classes
twMerge('px-4 px-6');
// => 'px-6'  (last one wins)

twMerge('text-red-500 text-blue-500');
// => 'text-blue-500'
```

### Conflict Resolution

```typescript
import { twMerge } from 'tailwind-merge';

// Color conflicts
twMerge('text-red-500 text-blue-500 text-green-500');
// => 'text-green-500'

// Size conflicts
twMerge('px-4 px-6 px-2');
// => 'px-2'

// Mixed properties
twMerge('p-4 px-6');  // px overrides p's x-padding
// => 'p-4 px-6'

twMerge('m-4 mx-6');  // mx overrides m's x-margin
// => 'm-4 mx-6'

// Completely overriding
twMerge('p-4 p-8');
// => 'p-8'
```

### Handling Modifiers

```typescript
import { twMerge } from 'tailwind-merge';

// Responsive modifiers
twMerge('px-4 md:px-6 lg:px-8 md:px-4');
// => 'px-4 md:px-4 lg:px-8'

// State modifiers
twMerge('hover:bg-blue-500 hover:bg-red-500');
// => 'hover:bg-red-500'

// Focus modifiers
twMerge('focus:ring-2 focus:ring-blue-500 focus:ring-red-500');
// => 'focus:ring-2 focus:ring-red-500'

// Combined
twMerge(
  'px-4 py-2',
  'md:px-6 md:py-3',
  'hover:bg-blue-500',
  'focus:ring-2'
);
// => 'px-4 py-2 md:px-6 md:py-3 hover:bg-blue-500 focus:ring-2'
```

### Arbitrary Values

```typescript
import { twMerge } from 'tailwind-merge';

// Arbitrary values
twMerge('w-[100px] w-[200px]');
// => 'w-[200px]'

twMerge('bg-[#000] bg-[#fff]');
// => 'bg-[#fff]'

// Conflicts with standard values
twMerge('w-10 w-[100px]');
// => 'w-[100px]'
```

---

## Combined Usage (cn utility)

### Creating the cn Utility

```typescript
// lib/utils.ts
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}
```

### Basic Examples

```typescript
import { cn } from '@/lib/utils';

// Simple combination
cn('px-4 py-2', 'bg-blue-500');
// => 'px-4 py-2 bg-blue-500'

// With conditions
cn(
  'px-4 py-2',
  isActive && 'bg-blue-500',
  !isActive && 'bg-gray-200'
);
// => isActive ? 'px-4 py-2 bg-blue-500' : 'px-4 py-2 bg-gray-200'

// With deduplication
cn('px-4 py-2 px-6', 'text-red-500 text-blue-500');
// => 'py-2 px-6 text-blue-500'
```

### Component Usage

```tsx
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
  className?: string;
}

function Button({
  children,
  variant = 'primary',
  size = 'md',
  isDisabled = false,
  className,
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',

        // Variant styles
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
          'bg-transparent hover:bg-gray-100': variant === 'ghost',
        },

        // Size styles
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4 text-base': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
        },

        // Disabled styles
        isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',

        // Override with external className
        className
      )}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
}

// Usage examples
<Button>Default</Button>
<Button variant="secondary" size="lg">Large Secondary</Button>
<Button className="w-full">Full Width</Button>
```

### Complex Component Example

```tsx
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

function Card({
  children,
  variant = 'default',
  padding = 'md',
  shadow = 'sm',
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        // Base
        'rounded-lg',

        // Variant
        {
          'bg-white border border-gray-200': variant === 'default',
          'border-2 border-gray-200 bg-transparent': variant === 'outline',
          'bg-transparent': variant === 'ghost',
        },

        // Padding
        {
          'p-0': padding === 'none',
          'p-4': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
        },

        // Shadow
        {
          'shadow-none': shadow === 'none',
          'shadow-sm': shadow === 'sm',
          'shadow-md': shadow === 'md',
          'shadow-lg': shadow === 'lg',
        },

        className
      )}
    >
      {children}
    </div>
  );
}
```

---

## Advanced Patterns

### Dynamic Class Composition

```typescript
import { cn } from '@/lib/utils';

function getVariantClasses(variant: string) {
  return cn(
    'rounded-md',
    {
      'bg-blue-500': variant === 'primary',
      'bg-red-500': variant === 'danger',
      'bg-green-500': variant === 'success',
      'bg-gray-500': variant === 'secondary',
    }
  );
}

function getSizeClasses(size: string) {
  return cn(
    {
      'px-2 py-1 text-sm': size === 'sm',
      'px-4 py-2 text-base': size === 'md',
      'px-6 py-3 text-lg': size === 'lg',
    }
  );
}

// Combine both
function getButtonClasses(variant: string, size: string) {
  return cn(getVariantClasses(variant), getSizeClasses(size));
}
```

### With External Libraries

```tsx
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center rounded-md',
          'bg-primary text-primary-foreground',
          'hover:bg-primary/90',
          'disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
```

### Form Input Styling

```tsx
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ReactNode;
}

function Input({ className, error, icon, ...props }: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        className={cn(
          // Base styles
          'flex w-full rounded-md border border-gray-300',
          'bg-white px-3 py-2 text-sm',
          'placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',

          // Error state
          error && 'border-red-500 focus:ring-red-500',

          // With icon
          icon && 'pl-10',

          // External overrides
          className
        )}
        {...props}
      />
    </div>
  );
}
```

---

## Configuration

### Custom tailwind-merge Configuration

```typescript
// lib/utils.ts
import clsx from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Extend with custom classes
const customTwMerge = extendTailwindMerge({
  classGroups: {
    // Add custom font size group
    'font-size': [
      { text: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'] },
    ],
    // Add custom color group
    'custom-color': [
      { 'bg-brand': ['primary', 'secondary', 'accent'] },
      { 'text-brand': ['primary', 'secondary', 'accent'] },
    ],
  },
});

export function cn(...inputs: Parameters<typeof clsx>) {
  return customTwMerge(clsx(inputs));
}
```

### Prefix Support

```typescript
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  prefix: 'tw-',  // If using Tailwind with prefix
});

twMerge('tw-bg-red-500 tw-bg-blue-500');
// => 'tw-bg-blue-500'
```

### Separator Support

```typescript
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  separator: '_',  // Custom separator
});

twMerge('bg-red-500_hover:bg-red-600');
// => 'bg-red-500_hover:bg-red-600'
```

---

## Performance

### Benchmarks

**clsx vs classnames:**
- clsx: ~300 bytes (minified + gzipped)
- classnames: ~600 bytes (minified + gzipped)
- clsx is ~1.5x faster

**tailwind-merge:**
- ~1.5KB (minified + gzipped)
- Optimized for common use cases
- Caches results for repeated calls

### Best Practices

```typescript
// ✅ Good: Static outside component
const baseClasses = 'px-4 py-2 rounded';

function Button({ isActive }) {
  return (
    <button className={cn(baseClasses, isActive && 'bg-blue-500')}>
      Click
    </button>
  );
}

// ✅ Good: Memoized for complex calculations
import { useMemo } from 'react';

function ComplexButton({ variant, size, state }) {
  const className = useMemo(() => {
    return cn(
      'base-classes',
      getVariantClasses(variant),
      getSizeClasses(size),
      getStateClasses(state)
    );
  }, [variant, size, state]);

  return <button className={className}>Click</button>;
}

// ❌ Avoid: Creating objects in render without memoization
function BadButton({ isActive }) {
  return (
    <button
      className={cn('base', {
        'bg-blue-500': isActive,  // Object created every render
      })}
    >
      Click
    </button>
  );
}
```

---

## TypeScript Support

### Typed cn Function

```typescript
// lib/utils.ts
import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage with type safety
interface Props {
  className?: string;
}

function Component({ className }: Props) {
  return <div className={cn('base', className)} />;
}
```

### Generic ClassName Prop

```typescript
import { cn } from '@/lib/utils';

type WithClassName<P = {}> = P & {
  className?: string;
};

interface ButtonProps extends WithClassName {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

function Button({ children, variant = 'primary', className }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded',
        variant === 'primary' && 'bg-blue-500',
        variant === 'secondary' && 'bg-gray-500',
        className
      )}
    >
      {children}
    </button>
  );
}
```

---

## Common Patterns

### Responsive Design

```typescript
import { cn } from '@/lib/utils';

function ResponsiveCard() {
  return (
    <div
      className={cn(
        'w-full',
        'p-4',
        'md:p-6',
        'lg:p-8',
        'text-sm',
        'md:text-base',
        'lg:text-lg'
      )}
    >
      Content
    </div>
  );
}
```

### State-based Styling

```typescript
import { cn } from '@/lib/utils';

interface InputProps {
  error?: string;
  touched?: boolean;
  value?: string;
}

function SmartInput({ error, touched, value }: InputProps) {
  const isEmpty = !value;
  const isValid = touched && !error;
  const isInvalid = touched && !!error;

  return (
    <input
      className={cn(
        'border-2 rounded-md px-3 py-2',
        'focus:outline-none focus:ring-2',

        // Default state
        !touched && 'border-gray-300 focus:ring-blue-500',

        // Valid state
        isValid && 'border-green-500 focus:ring-green-500',

        // Invalid state
        isInvalid && 'border-red-500 focus:ring-red-500',

        // Empty warning
        isEmpty && touched && 'border-yellow-500'
      )}
    />
  );
}
```

### Animation Classes

```typescript
import { cn } from '@/lib/utils';

interface AnimatedProps {
  isVisible: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
}

function AnimatedBox({ isVisible, direction = 'up' }: AnimatedProps) {
  return (
    <div
      className={cn(
        'transition-all duration-300 ease-in-out',

        // Visibility
        isVisible ? 'opacity-100' : 'opacity-0',

        // Direction transforms
        !isVisible && {
          'translate-y-4': direction === 'up',
          '-translate-y-4': direction === 'down',
          'translate-x-4': direction === 'left',
          '-translate-x-4': direction === 'right',
        }
      )}
    >
      Content
    </div>
  );
}
```

---

## Testing

### Unit Tests

```typescript
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('merges classes correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('base', true && 'active')).toBe('base active');
    expect(cn('base', false && 'active')).toBe('base');
  });

  it('resolves Tailwind conflicts', () => {
    expect(cn('px-4 px-6')).toBe('px-6');
    expect(cn('text-red-500 text-blue-500')).toBe('text-blue-500');
  });

  it('handles objects', () => {
    expect(cn({ 'bg-red-500': true, 'bg-blue-500': false })).toBe('bg-red-500');
  });

  it('handles arrays', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
  });

  it('ignores falsy values', () => {
    expect(cn('foo', null, undefined, false, 0, '')).toBe('foo');
  });
});
```

### Component Testing

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('applies base classes', () => {
    render(<Button>Click</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('inline-flex');
    expect(button).toHaveClass('rounded-md');
  });

  it('applies variant classes', () => {
    render(<Button variant="secondary">Click</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('bg-gray-200');
  });

  it('merges external className', () => {
    render(<Button className="custom-class">Click</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('inline-flex');  // Base classes preserved
  });
});
```

---

## Troubleshooting

### Common Issues

**Classes not merging correctly:**
- Ensure classes are valid Tailwind classes
- Check for typos in class names
- Verify tailwind-merge configuration

**Conflicting classes both appearing:**
- tailwind-merge only removes conflicts within same group
- Different property classes won't conflict (e.g., `px-4` and `py-4`)
- Use arbitrary values carefully

**TypeScript errors:**
- Ensure `@types/node` is installed
- Check that `ClassValue` type is imported from clsx
- Verify function signature matches

### Debug Helper

```typescript
import { twMerge } from 'tailwind-merge';

// Debug mode
const debugMerge = (...classes: string[]) => {
  const input = classes.join(' ');
  const output = twMerge(...classes);

  console.log('Input:', input);
  console.log('Output:', output);
  console.log('Removed:', input.split(' ').filter(c => !output.includes(c)));

  return output;
};

// Usage
debugMerge('px-4 py-2 px-6', 'text-red-500 text-blue-500');
// Input: px-4 py-2 px-6 text-red-500 text-blue-500
// Output: py-2 px-6 text-blue-500
// Removed: [px-4, text-red-500]
```

---

## Resources

- [clsx GitHub](https://github.com/lukeed/clsx)
- [tailwind-merge GitHub](https://github.com/dcastil/tailwind-merge)
- [clsx on npm](https://www.npmjs.com/package/clsx)
- [tailwind-merge on npm](https://www.npmjs.com/package/tailwind-merge)

---

## Version Information

- **clsx Current Version:** 2.x
- **tailwind-merge Current Version:** 2.x
- **clsx License:** MIT
- **tailwind-merge License:** MIT
- **clsx Size:** ~300 bytes (minified + gzipped)
- **tailwind-merge Size:** ~1.5KB (minified + gzipped)
- **TypeScript:** Full support for both
