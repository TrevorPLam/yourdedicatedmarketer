# Radix UI Documentation

**Repository Version:** ^2.2.0  
**Official Documentation:** https://www.radix-ui.com/  
**Latest Release:** April 2026

## Overview

Radix UI is a comprehensive set of accessible, unstyled, and fully customizable UI primitives for building high-quality design systems and web applications. It provides the foundational behavior and accessibility features that developers can style to match their design system.

In this monorepo, Radix UI serves as the foundation for our accessible component library, providing robust primitives that ensure WCAG compliance and excellent user experience across all devices and assistive technologies.

## Key Features

### **Accessibility First**
- **WCAG Compliance**: Built-in accessibility features following WCAG guidelines
- **Keyboard Navigation**: Full keyboard support for all components
- **Screen Reader Support**: Optimized for screen readers and assistive technologies
- **Focus Management**: Proper focus trapping and management
- **ARIA Attributes**: Automatic ARIA attribute management

### **Unstyled Primitives**
- **Headless Components**: No default styles, complete design freedom
- **Customizable**: Full control over appearance and behavior
- **Design System Integration**: Perfect for building design systems
- **Theme Support**: Built-in theme and CSS variable support
- **CSS-in-JS Friendly**: Works with any styling solution

### **Developer Experience**
- **TypeScript Support**: First-class TypeScript with full type safety
- **Composition API**: Flexible composition patterns
- **Extensive API**: Rich set of props and callbacks
- **Tree Shakeable**: Optimized bundle sizes
- **Modern React**: Built for modern React with hooks and patterns

## Installation

### Core Dependencies

```bash
# Install individual Radix UI primitives
pnpm add @radix-ui/react-dialog@^2.2.0
pnpm add @radix-ui/react-dropdown-menu@^2.2.0
pnpm add @radix-ui/react-select@^2.2.0
pnpm add @radix-ui/react-tabs@^2.2.0
pnpm add @radix-ui/react-slot@^2.2.0

# Install utility packages
pnpm add @radix-ui/react-icons@^1.3.0
pnpm add @radix-ui/react-collections@^1.1.0
pnpm add @radix-ui/react-utils@^1.1.0
```

### **Package.json Setup**

```json
{
  "dependencies": {
    "@radix-ui/react-dialog": "^2.2.0",
    "@radix-ui/react-dropdown-menu": "^2.2.0",
    "@radix-ui/react-select": "^2.2.0",
    "@radix-ui/react-tabs": "^2.2.0",
    "@radix-ui/react-slot": "^2.2.0",
    "@radix-ui/react-icons": "^1.3.0"
  }
}
```

## Core Primitives

### **Dialog**

```typescript
// src/components/Dialog.tsx
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '../utils/cn';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, title, description, children }: DialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
            {title}
          </Dialog.Title>
          {description && (
            <Dialog.Description className="text-sm text-muted-foreground">
              {description}
            </Dialog.Description>
          )}
          {children}
          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <Cross2Icon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Usage
export function DialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen} title="Confirm Action" description="This action cannot be undone.">
      <p className="mb-4">Are you sure you want to proceed?</p>
      <div className="flex gap-2">
        <button onClick={() => setOpen(false)}>Cancel</button>
        <button onClick={() => setOpen(false)}>Confirm</button>
      </div>
    </Dialog>
  );
}
```

### **Dropdown Menu**

```typescript
// src/components/DropdownMenu.tsx
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '../utils/cn';

interface DropdownMenuProps {
  children: React.ReactNode;
  items: Array<{
    label: string;
    onClick: () => void;
    disabled?: boolean;
    separator?: boolean;
  }>;
}

export function DropdownMenu({ children, items }: DropdownMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {children}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.separator && <DropdownMenu.Separator className="my-1 h-px bg-muted" />}
              <DropdownMenu.Item
                className={cn(
                  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
                disabled={item.disabled}
                onClick={item.onClick}
              >
                {item.label}
              </DropdownMenu.Item>
            </React.Fragment>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

// Usage
export function DropdownMenuExample() {
  const items = [
    { label: 'Edit', onClick: () => console.log('Edit') },
    { label: 'Delete', onClick: () => console.log('Delete') },
    { separator: true },
    { label: 'Export', onClick: () => console.log('Export') },
  ];

  return (
    <DropdownMenu items={items}>
      <button>Menu</button>
    </DropdownMenu>
  );
}
```

### **Select**

```typescript
// src/components/Select.tsx
import * as Select from '@radix-ui/react-select';
import { cn } from '../utils/cn';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
}

export function Select({ value, onValueChange, placeholder, options }: SelectProps) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="h-4 w-4 opacity-50">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
          <Select.Viewport className="p-1">
            <Select.Group>
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

// Usage
export function SelectExample() {
  const [value, setValue] = useState('');

  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
  ];

  return (
    <Select
      value={value}
      onValueChange={setValue}
      placeholder="Select a fruit"
      options={options}
    />
  );
}
```

### **Tabs**

```typescript
// src/components/Tabs.tsx
import * as Tabs from '@radix-ui/react-tabs';
import { cn } from '../utils/cn';

interface TabsProps {
  defaultValue: string;
  tabs: Array<{
    value: string;
    label: string;
    content: React.ReactNode;
  }>;
}

export function Tabs({ defaultValue, tabs }: TabsProps) {
  return (
    <Tabs.Root defaultValue={defaultValue} className="w-full">
      <Tabs.List className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map((tab) => (
        <Tabs.Content
          key={tab.value}
          value={tab.value}
          className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

// Usage
export function TabsExample() {
  const tabs = [
    {
      value: 'account',
      label: 'Account',
      content: <div>Account settings content</div>,
    },
    {
      value: 'password',
      label: 'Password',
      content: <div>Password settings content</div>,
    },
  ];

  return <Tabs defaultValue="account" tabs={tabs} />;
}
```

## Advanced Patterns

### **Custom Component with Radix Primitives**

```typescript
// src/components/CustomButton.tsx
import * as Slot from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

CustomButton.displayName = "CustomButton";
```

### **Form Integration**

```typescript
// src/components/FormField.tsx
import * as Label from '@radix-ui/react-label';
import { cn } from '../utils/cn';

interface FormFieldProps {
  id: string;
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ id, label, description, error, required, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label.Root
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label.Root>
      {children}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

// Usage
export function FormExample() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (value: string) => {
    if (!value) {
      setError('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setError('Invalid email format');
    } else {
      setError('');
    }
  };

  return (
    <FormField
      id="email"
      label="Email"
      description="Enter your email address"
      error={error}
      required
    >
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          validateEmail(e.target.value);
        }}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive"
        )}
      />
    </FormField>
  );
}
```

### **Tooltip Integration**

```typescript
// src/components/Tooltip.tsx
import * as Tooltip from '@radix-ui/react-tooltip';
import { cn } from '../utils/cn';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
}

export function Tooltip({ content, children, side = 'top', align = 'center', delayDuration = 0 }: TooltipProps) {
  return (
    <Tooltip.Provider delayDuration={delayDuration}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side={side}
            align={align}
            className="z-50 overflow-hidden rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          >
            {content}
            <Tooltip.Arrow className="fill-popover" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

// Usage
export function TooltipExample() {
  return (
    <Tooltip content="This action cannot be undone">
      <button>Delete</button>
    </Tooltip>
  );
}
```

## Design System Integration

### **Theme Provider**

```typescript
// src/providers/ThemeProvider.tsx
import { createContext, useContext } from 'react';

interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    muted: string;
    accent: string;
    destructive: string;
    border: string;
    input: string;
    ring: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
}

const defaultTheme: Theme = {
  colors: {
    primary: 'hsl(222.2 84% 4.9%)',
    secondary: 'hsl(210 40% 96%)',
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(222.2 84% 4.9%)',
    muted: 'hsl(210 40% 96%)',
    accent: 'hsl(210 40% 96%)',
    destructive: 'hsl(0 84.2% 60.2%)',
    border: 'hsl(214.3 31.8% 91.4%)',
    input: 'hsl(214.3 31.8% 91.4%)',
    ring: 'hsl(222.2 84% 4.9%)',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
  },
};

const ThemeContext = createContext<Theme>(defaultTheme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={defaultTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
```

### **CSS Variables Integration**

```css
/* src/styles/globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}

* {
  border-color: hsl(var(--border));
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
```

## Testing

### **Component Testing**

```typescript
// src/components/Dialog.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Dialog } from './Dialog';

describe('Dialog', () => {
  it('should render dialog when open', () => {
    render(
      <Dialog open={true} onOpenChange={() => {}} title="Test Dialog">
        <p>Dialog content</p>
      </Dialog>
    );

    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    expect(screen.getByText('Dialog content')).toBeInTheDocument();
  });

  it('should not render dialog when closed', () => {
    render(
      <Dialog open={false} onOpenChange={() => {}} title="Test Dialog">
        <p>Dialog content</p>
      </Dialog>
    );

    expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
  });

  it('should call onOpenChange when closed', () => {
    const onOpenChange = jest.fn();
    render(
      <Dialog open={true} onOpenChange={onOpenChange} title="Test Dialog">
        <p>Dialog content</p>
      </Dialog>
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
```

### **Accessibility Testing**

```typescript
// src/components/Dialog.a11y.test.tsx
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Dialog } from './Dialog';

expect.extend(toHaveNoViolations);

describe('Dialog Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <Dialog open={true} onOpenChange={() => {}} title="Test Dialog">
        <p>Dialog content</p>
      </Dialog>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes', () => {
    render(
      <Dialog open={true} onOpenChange={() => {}} title="Test Dialog">
        <p>Dialog content</p>
      </Dialog>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-describedby');
  });
});
```

## Performance Optimization

### **Lazy Loading Components**

```typescript
// src/components/LazyDialog.tsx
import { lazy, Suspense } from 'react';

const LazyDialogContent = lazy(() => import('./DialogContent'));

export function LazyDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyDialogContent />
      </Suspense>
    </Dialog>
  );
}
```

### **Memoization**

```typescript
// src/components/OptimizedSelect.tsx
import { memo, useMemo } from 'react';
import * as Select from '@radix-ui/react-select';

interface OptimizedSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}

export const OptimizedSelect = memo(function OptimizedSelect({ value, onValueChange, options }: OptimizedSelectProps) {
  const memoizedOptions = useMemo(() => options, [options]);

  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content>
          <Select.Viewport>
            {memoizedOptions.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
});
```

## Best Practices

### **Component Composition**

```typescript
// Good: Compose smaller components
export function CustomDialog({ children, ...props }: DialogProps) {
  return (
    <Dialog {...props}>
      <DialogHeader>
        <DialogTitle />
        <DialogDescription />
      </DialogHeader>
      <DialogContent>{children}</DialogContent>
      <DialogFooter>
        <DialogClose />
      </DialogFooter>
    </Dialog>
  );
}

// Bad: Monolithic component
export function MonolithicDialog({ open, onOpenChange, title, description, children }: DialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
          {children}
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

### **Styling Strategy**

```typescript
// Good: Use CSS variables for theming
const buttonStyles = {
  backgroundColor: 'hsl(var(--primary))',
  color: 'hsl(var(--primary-foreground))',
  borderRadius: 'var(--radius)',
};

// Bad: Hardcoded values
const buttonStyles = {
  backgroundColor: '#000000',
  color: '#ffffff',
  borderRadius: '0.5rem',
};
```

### **Error Boundaries**

```typescript
// src/components/ErrorBoundary.tsx
import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}

// Usage
export function SafeDialog(props: DialogProps) {
  return (
    <ErrorBoundary>
      <Dialog {...props} />
    </ErrorBoundary>
  );
}
```

## Migration Guide

### **From Custom Components**

```typescript
// Before: Custom dropdown
export function CustomDropdown({ items, onSelect }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('');

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)}>
        {selected || 'Select an option'}
      </button>
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded">
          {items.map((item) => (
            <li key={item.value}>
              <button onClick={() => {
                setSelected(item.label);
                setIsOpen(false);
                onSelect(item.value);
              }}>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// After: Radix UI dropdown
export function AccessibleDropdown({ items, onSelect }: DropdownProps) {
  const [value, setValue] = useState('');

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button>{value || 'Select an option'}</button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content>
          {items.map((item) => (
            <DropdownMenu.Item
              key={item.value}
              onSelect={() => {
                setValue(item.label);
                onSelect(item.value);
              }}
            >
              {item.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
```

## Troubleshooting

### **Common Issues**

#### **Focus Management**
```typescript
// Problem: Focus not trapped in dialog
// Solution: Ensure proper DOM order and use Radix's built-in focus management
<Dialog.Root>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      {/* Content here */}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

#### **Z-index Issues**
```typescript
// Problem: Dropdown appears behind other elements
// Solution: Use proper z-index values and Portal
<DropdownMenu.Portal>
  <DropdownMenu.Content className="z-50">
    {/* Content */}
  </DropdownMenu.Content>
</DropdownMenu.Portal>
```

#### **Animation Issues**
```typescript
// Problem: Animations not working
// Solution: Use CSS data attributes provided by Radix
<style>
  data-[state=open] {
    animation: fadeIn 0.2s ease-in-out;
  }
  data-[state=closed] {
    animation: fadeOut 0.2s ease-in-out;
  }
</style>
```

## Resources

### **Official Documentation**
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Component Gallery](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [Styling Guide](https://www.radix-ui.com/primitives/docs/guides/styling)

### **Community Resources**
- [Radix UI Discord](https://discord.gg/radix-ui)
- [GitHub Discussions](https://github.com/radix-ui/primitives/discussions)
- [Examples Repository](https://github.com/radix-ui/primitives/tree/main/packages/react/primitives/src)

### **Tools and Extensions**
- [Radix UI Icons](https://www.radix-ui.com/icons)
- [CVA (Class Variance Authority)](https://cva.style/)
- [Tailwind CSS Integration](https://tailwindcss.com/)
