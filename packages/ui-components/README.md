# @agency/ui-components

Shared UI component library for marketing agency applications built with React
and Tailwind CSS v4.0.

## Features

- **Atomic Design**: Organized into atoms, molecules, organisms, and templates
- **TypeScript**: Full type safety for all components
- **Accessibility**: WCAG 2.2 AA compliant components
- **Variants**: Consistent styling with class-variance-authority
- **Storybook**: Interactive component documentation
- **Testing**: Comprehensive test coverage with Vitest
- **Framework Agnostic**: Works with React and Astro

## Installation

```bash
pnpm add @agency/ui-components --workspace
```

### Peer Dependencies

```bash
pnpm add react react-dom
# Optional for Astro projects
pnpm add astro
```

## Usage

### Import Components

```typescript
import { Button } from '@agency/ui-components';
import { cn } from '@agency/ui-components/utils';
```

### Import Styles

```css
/* In your main CSS file */
@import '@agency/ui-components/styles';
```

## Components

### Button

```typescript
import { Button } from '@agency/ui-components';

function Example() {
  return (
    <div className="space-x-4">
      <Button variant="primary">Primary Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button variant="outline">Outline Button</Button>
      <Button loading>Loading...</Button>
      <Button icon={<Icon />}>With Icon</Button>
    </div>
  );
}
```

#### Button Variants

- `primary` - Main action button
- `secondary` - Secondary action button
- `outline` - Outlined button
- `ghost` - Minimal button
- `link` - Link-style button
- `destructive` - Destructive action button

#### Button Sizes

- `sm` - Small button
- `md` - Medium button (default)
- `lg` - Large button
- `icon` - Square icon button
- `icon-sm` - Small icon button
- `icon-lg` - Large icon button

## Utilities

### cn() Function

```typescript
import { cn } from '@agency/ui-components';

// Merge classnames with proper Tailwind precedence
const className = cn(
  'base-class',
  'additional-class',
  condition && 'conditional-class'
);
```

### createClassFactory()

```typescript
import { createClassFactory } from '@agency/ui-components';

const buttonClass = createClassFactory('btn-base');
const finalClass = buttonClass('btn-primary', 'btn-large');
```

## Development

### Storybook

```bash
# Start Storybook development server
pnpm storybook

# Build Storybook for production
pnpm build-storybook
```

### Testing

```bash
# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

### Build

```bash
# Build the package
pnpm build

# Watch for changes
pnpm dev
```

### Type Checking

```bash
pnpm type-check
```

### Linting

```bash
pnpm lint
pnpm lint:fix
```

## Architecture

### Atomic Design Structure

```
src/
├── atoms/           # Basic UI elements (Button, Input, etc.)
├── molecules/       # Component combinations (HeroSection, etc.)
├── organisms/       # Complex UI sections (Header, Footer, etc.)
├── templates/       # Page templates (MarketingPage, etc.)
├── utils/           # Component utilities and helpers
└── styles/          # Global styles and CSS imports
```

### Component Structure

Each component follows this structure:

```
ComponentName/
├── ComponentName.tsx    # Component implementation
├── ComponentName.test.tsx # Component tests
├── ComponentName.stories.tsx # Storybook stories
└── index.ts             # Component exports
```

## Styling

### Tailwind CSS Integration

Components use Tailwind CSS v4.0 with CSS-first configuration:

```typescript
import { cva } from 'class-variance-authority';
import { cn } from '../utils/cn';

const componentVariants = cva('base-styles', {
  variants: {
    variant: {
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
    },
    size: {
      sm: 'h-8 px-3',
      md: 'h-10 px-4',
      lg: 'h-12 px-6',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
```

### Design System Integration

Components integrate with `@agency/design-system`:

```typescript
import { colors, spacing } from '@agency/design-system/tokens';

// Use design tokens in components
const styles = {
  backgroundColor: colors.primary[600],
  padding: spacing.scale[4],
};
```

## Accessibility

All components follow WCAG 2.2 AA guidelines:

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Sufficient contrast ratios for text and UI elements
- **Focus Management**: Visible focus indicators and logical tab order
- **Reduced Motion**: Respects user's motion preferences

## Testing

### Component Testing

Components are tested with Vitest and React Testing Library:

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

test('renders button with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
});
```

### Accessibility Testing

Components include accessibility tests:

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

test('button has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Browser Support

This component library supports modern browsers:

- **Chrome**: 111+
- **Firefox**: 113+
- **Safari**: 16.4+
- **Edge**: 111+

## Contributing

When contributing components:

1. **Atomic Design**: Follow the atomic design methodology
2. **TypeScript**: Maintain full type safety
3. **Accessibility**: Ensure WCAG 2.2 AA compliance
4. **Testing**: Add comprehensive tests
5. **Documentation**: Update Storybook stories
6. **Variants**: Use class-variance-authority for styling

### Adding New Components

1. Create component in appropriate directory (`atoms/`, `molecules/`, etc.)
2. Implement with TypeScript and proper props interface
3. Add variants with class-variance-authority
4. Write comprehensive tests
5. Create Storybook stories
6. Update exports

## License

MIT License - see LICENSE file for details.
