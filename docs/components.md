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

## Footer

A responsive footer component with navigation links, contact information, and social media links.

### Usage

```tsx
import { Footer } from '@repo/ui';
import { Twitter, Linkedin, Github } from 'lucide-react';

const footerNavLinks = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
];

const contactInfo = {
  email: 'contact@example.com',
  phone: '+1 (555) 123-4567',
  address: '123 Marketing St, Business City, BC 12345',
};

const socialLinks = [
  { href: 'https://twitter.com', icon: <Twitter className="h-5 w-5" />, label: 'Twitter' },
  { href: 'https://linkedin.com', icon: <Linkedin className="h-5 w-5" />, label: 'LinkedIn' },
  { href: 'https://github.com', icon: <Github className="h-5 w-5" />, label: 'GitHub' },
];

<Footer
  navLinks={footerNavLinks}
  contactInfo={contactInfo}
  socialLinks={socialLinks}
  copyright="© 2025 Your Company. All rights reserved."
/>
```

### Props

- `logo` - Optional custom logo component (defaults to text "Your Dedicated Marketer")
- `navLinks` - Array of navigation items with `href` and `label` properties
- `contactInfo` - Object with optional `email`, `phone`, and `address` properties
- `socialLinks` - Array of social links with `href`, `icon`, and `label` properties
- `copyright` - Copyright text (defaults to current year with placeholder text)
- `className` - Additional CSS classes

### Features

- **Responsive layout** - Grid layout that stacks on mobile, multi-column on desktop
- **Semantic HTML** - Uses `<footer>` and `<nav>` elements for accessibility
- **Dark/light mode** - Automatically adapts to theme
- **Accessibility** - Social links include `aria-label`, proper `target` and `rel` attributes
- **Container** - Uses Container component for consistent max-width and padding

### Types

```tsx
type NavItem = {
  href: string;
  label: string;
};

type ContactInfo = {
  email?: string;
  phone?: string;
  address?: string;
};

type SocialLink = {
  href: string;
  icon: React.ReactNode;
  label: string;
};
```

## Input

A text input component with brand-themed focus states.

### Usage

```tsx
import { Input } from '@repo/ui';

<Input placeholder="Enter your email" />
<Input type="email" placeholder="Email address" />
<Input disabled placeholder="Disabled input" />
```

### Props

- All standard HTML input attributes are supported
- `className` - Additional CSS classes
- `type` - Input type (text, email, password, etc.)

### Features

- **Brand theming** - Focus ring uses brand primary color
- **Accessible** - Proper ARIA attributes and keyboard navigation
- **Responsive** - Adapts to different screen sizes
- **File input support** - Styled file upload with custom classes

## Textarea

A multi-line text input component with brand-themed focus states.

### Usage

```tsx
import { Textarea } from '@repo/ui';

<Textarea placeholder="Enter your message" />
<Textarea disabled placeholder="Disabled textarea" />
```

### Props

- All standard HTML textarea attributes are supported
- `className` - Additional CSS classes
- `placeholder` - Placeholder text

### Features

- **Auto-sizing** - Uses `field-sizing-content` for automatic height adjustment
- **Brand theming** - Focus ring uses brand primary color
- **Minimum height** - Default minimum height of 4rem (min-h-16)
- **Accessible** - Proper ARIA attributes and keyboard navigation

## Label

A label component for form inputs with accessible associations.

### Usage

```tsx
import { Label } from '@repo/ui';

<Label htmlFor="email">Email</Label>
<Input id="email" />
```

### Props

- All standard HTML label attributes are supported
- `className` - Additional CSS classes
- `htmlFor` - Associates label with input element

### Features

- **Accessible** - Proper association with form inputs via `htmlFor`
- **Brand theming** - Uses foreground color for consistency
- **Disabled state** - Automatically styles when parent input is disabled
- **Error state** - Supports error styling when used with Form components

## Form Components

A set of form components built on React Hook Form for accessible, type-safe form handling.

### Components

- `Form` - Form provider from React Hook Form
- `FormField` - Connects form fields to React Hook Form
- `FormItem` - Container for form field layout
- `FormLabel` - Label component with error state support
- `FormControl` - Wraps form controls with ARIA attributes
- `FormDescription` - Helper text for form fields
- `FormMessage` - Error message display
- `useFormField` - Hook to access form field context

### Usage

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@repo/ui';
import { Input } from '@repo/ui';
import { useForm } from 'react-hook-form';

function MyForm() {
  const form = useForm({
    defaultValues: {
      email: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
```

### Features

- **Type-safe** - Full TypeScript support with React Hook Form
- **Accessible** - Proper ARIA attributes for screen readers
- **Error handling** - Automatic error display with FormMessage
- **Validation** - Integrates with Zod schemas for validation
- **Deep module pattern** - Form components are pure wrappers around React Hook Form

### Best Practices

1. **Use Controller for controlled components** - FormField uses Controller internally for UI library components
2. **Always use FormControl** - Ensures proper ARIA attributes are injected
3. **Don't duplicate error messages** - FormMessage handles error display automatically
4. **Use onBlur validation mode** - Provides natural, non-intrusive validation experience
5. **Keep form components pure** - No business logic inside form components

## Accordion

A collapsible content component built on Radix UI for organizing content in expandable sections.

### Usage

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@repo/ui';

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>What is your service?</AccordionTrigger>
    <AccordionContent>
      We provide comprehensive marketing solutions tailored to your business needs.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>How much does it cost?</AccordionTrigger>
    <AccordionContent>
      Pricing varies based on the scope of work. Contact us for a custom quote.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Props

#### Accordion

- `type` - Behavior mode
  - `single` - Only one item can be open at a time
  - `multiple` - Multiple items can be open simultaneously
- `collapsible` - Whether items can be collapsed (required for `type="single"`)
- `defaultValue` - Default open item(s)
- `value` - Controlled open item(s)
- `onValueChange` - Callback when open item(s) change
- `className` - Additional CSS classes

#### AccordionItem

- `value` - Unique identifier for the item (required)
- `className` - Additional CSS classes

#### AccordionTrigger

- `className` - Additional CSS classes
- `children` - Trigger content (typically text)

#### AccordionContent

- `className` - Additional CSS classes
- `children` - Content to show when expanded

### Features

- **Brand theming** - Uses brand primary color for hover, focus, and active states
- **Accessibility** - Full keyboard navigation and ARIA attributes from Radix UI
- **Smooth animations** - Animated expand/collapse transitions
- **Responsive** - Works on all screen sizes
- **Single/Multiple mode** - Supports both single and multiple open items

### Best Practices

1. **Use for FAQs** - Perfect for frequently asked questions sections
2. **Keep content concise** - Accordion content should be scannable
3. **Use descriptive triggers** - Trigger text should clearly indicate what content will be revealed
4. **Consider default state** - Set `defaultValue` if one item should be open by default
5. **Test accessibility** - Ensure keyboard navigation works (Tab, Enter, Space, Arrow keys)

## Best Practices

1. **Use Server Components by default** - All components are Server Components unless they need interactivity
2. **Use variants instead of raw classes** - Prefer variant props over passing raw Tailwind classes
3. **Compose components** - Use Container and Section together for consistent layouts
4. **Test components** - All components have unit tests using Vitest and React Testing Library
5. **Navigation components** - Header, NavLink, and MobileMenu are Client Components that use Next.js hooks for routing
6. **Form components** - Form components are Client Components that use React Hook Form for state management
7. **Accordion components** - Accordion is a Client Component that uses Radix UI for accessibility and state management
