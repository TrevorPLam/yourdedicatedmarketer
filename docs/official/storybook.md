# Storybook Documentation

**Repository Version:** ^10.3.3  
**Official Documentation:** https://storybook.js.org/docs  
**Latest Release:** April 2026

## Overview

Storybook is a frontend workshop for building UI components and pages in isolation. It helps you develop and share hard-to-reach states and edge cases without needing to run your whole app. Thousands of teams use it for UI development, testing, and documentation. It's open source and free.

In this monorepo, Storybook serves as the central hub for component development, design system documentation, and cross-team collaboration. It integrates seamlessly with our design system, UI components package, and agency workflow.

## What's New in Storybook 9

### Storybook Test

In Storybook 9, we teamed up with Vitest, the ecosystem's fastest test runner, to create a superior tool for testing components. Kick off tests across all your stories at once. Enable "Watch mode" to run only the relevant tests when you save a file.

### 48% Leaner

Storybook 9 is less than half the size of Storybook 8 with a flatter dependency structure that prevents conflicts in your package.json. The lighter weight also results in a faster install.

### Story Generation

Storybook 9's story generation allows you to create and edit stories from the UI, to capture every state of your component. With the Test Codegen addon, you don't need to write code to test your components either. You can record your interactions with your component, add assertions, and save your test... all without leaving Storybook.

### Tags-based Organization

Tags help you to organize and filter stories and components in large Storybooks. Tag stories based on status (alpha, stable, deprecated, etc.), role (design, dev, product), team, feature area, or whatever fits your needs.

```typescript
// Tag examples
const meta = {
  component: Button,
  tags: ['alpha', 'design'],
};
```

### Story Globals

Story globals let you set context variables—like the theme, viewport, locale, or background—on a per-story or per-component basis. That makes it easy to test and document your UI under real conditions: dark mode, mobile view, right-to-left locale, and more.

```typescript
// Button.stories.ts
export default {
  component: Button,
};

// Normal story: theme is configurable in UI
export const Default = {
  args: { label: 'Button' }
};

// Force this story to be in the "dark" theme
export const Dark = {
  ...Default,
  globals: { theme: 'dark' }
};
```

## Key Features

### **Component Development**
- **Isolated Environment**: Build components in isolation from app logic
- **Interactive Playground**: Live component editing and prop manipulation
- **Addons Ecosystem**: Extensive addon library for enhanced functionality
- **Hot Reloading**: Instant feedback during development
- **Accessibility Testing**: Built-in a11y checking and validation
- **Story Generation**: Create and edit stories from the UI (Storybook 9)

### **Design System Integration**
- **Design Tokens**: Integration with design system tokens and themes
- **Theme Switching**: Live theme switching and preview with globals (Storybook 9)
- **Component Variants**: Documentation of all component states and variants
- **Brand Guidelines**: Enforced brand consistency across components
- **Tags Organization**: Organize stories by status, role, team, or feature (Storybook 9)

### **Documentation & Collaboration**
- **Auto-generated Docs**: Automatic documentation generation from component code
- **Interactive Examples**: Live, interactive component examples
- **Design Review**: Collaborative design review and feedback workflow
- **Version Control**: Component versioning and change tracking

## Installation

### Quick Start

```bash
npm create storybook@latest
```

### Core Dependencies

```bash
# Core Storybook packages
pnpm add -D storybook@^9.0.0

# React integration
pnpm add -D @storybook/react@^9.0.0 @storybook/react-vite@^9.0.0

# Next.js with Vite (new in Storybook 9)
pnpm add -D @storybook/nextjs-vite@^9.0.0

# Essential addons
pnpm add -D @storybook/addon-essentials@^9.0.0
pnpm add -D @storybook/addon-interactions@^9.0.0
pnpm add -D @storybook/addon-links@^9.0.0
pnpm add -D @storybook/addon-docs@^9.0.0

# Testing integration (includes Vitest)
pnpm add -D @storybook/test@^9.0.0 @storybook/testing-library@^0.2.0

# Story generation addon
pnpm add -D storybook-addon-test-codegen
```

### Configuration Files

#### **Main Configuration**
```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
    '@storybook/addon-docs',
    'storybook-addon-test-codegen', // Story generation addon (Storybook 9)
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
};

export default config;
```

#### **Preview Configuration**
```typescript
// .storybook/preview.ts
import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      toc: true,
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#333333',
        },
      ],
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'brand', title: 'Brand' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const { theme } = context.globals;
      
      return (
        <div className={`theme-${theme}`}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
```

## Supported Frameworks

### Official Frameworks
- **Next.js** - Full support with Navigation/Route mocking, Image and Font components
- **Next.js with Vite** - New in Storybook 9, modern development experience compatible with Storybook Test
- **React with Vite** - Fast, modern React development
- **React with Webpack** - Traditional webpack-based setup
- **React Native Web with Vite** - In-browser React Native development
- **React Native on device** - Full device/simulator development
- **Preact with Vite** - Lightweight React alternative
- **Vue with Vite** - Vue 3 composition API support
- **Angular** - Full Angular framework support
- **SvelteKit** - Svelte 5 support with runes and snippets (new in Storybook 9)
- **Svelte with Vite** - Modern Svelte development
- **Web Components with Vite** - Native web components

### Community-maintained Frameworks
- **Analog with Vite**
- **Nuxt with Vite**
- **SolidJS with Vite**
- **React with Rspack/Rsbuild**
- **Vue with Rspack/Rsbuild**
- **Web Components with Rspack/Rsbuild**

## Component Stories

### **Basic Story Structure**

```typescript
// src/components/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants and sizes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    disabled: {
      control: 'boolean',
    },
    children: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Click me',
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};
```

### **Complex Component Stories**

```typescript
// src/components/Card/Card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible card component for content display with multiple layout options.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Card Title</h3>
        <p className="text-gray-600">Card content goes here.</p>
      </div>
    ),
  },
};

export const WithImage: Story = {
  args: {
    children: (
      <div>
        <img 
          src="https://via.placeholder.com/400x200" 
          alt="Card image" 
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Card with Image</h3>
          <p className="text-gray-600">This card has an image at the top.</p>
        </div>
      </div>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Elevated Card</h3>
        <p className="text-gray-600">This card has elevation.</p>
      </div>
    ),
  },
};
```

### **Template Stories**

```typescript
// src/components/Form/Form.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Form } from './Form';

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  component: Form,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const Template: Story = {
  render: (args) => (
    <Form {...args}>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter your email"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </Form>
  ),
};

export const Default: Story = {
  ...Template,
  args: {
    onSubmit: (data) => console.log('Form submitted:', data),
  },
};
```

## Design System Integration

### **Theme Integration**

```typescript
// .storybook/preview.ts
import { ThemeProvider } from '../src/providers/ThemeProvider';

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const { theme } = context.globals;
      
      return (
        <ThemeProvider theme={theme}>
          <Story />
        </ThemeProvider>
      );
    },
  ],
};
```

### **Design Tokens**

```typescript
// src/tokens/colors.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { colors } from '../tokens/colors';

const meta: Meta = {
  title: 'Design Tokens/Colors',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Color tokens used throughout the design system.',
      },
    },
  },
};

export default meta;

export const PrimaryColors: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(colors.primary).map(([name, value]) => (
        <div key={name} className="text-center">
          <div 
            className="w-full h-20 rounded-lg mb-2"
            style={{ backgroundColor: value }}
          />
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-gray-500">{value}</p>
        </div>
      ))}
    </div>
  ),
};
```

### **Component Variants Documentation**

```typescript
// src/components/Button/Button.stories.tsx
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Variants</h3>
        <div className="flex gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Sizes</h3>
        <div className="flex gap-2 items-center">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">States</h3>
        <div className="flex gap-2">
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </div>
      </div>
    </div>
  ),
};
```

## Advanced Features

### **Interactive Stories**

```typescript
// src/components/Counter/Counter.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Counter } from './Counter';

const meta: Meta<typeof Counter> = {
  title: 'Components/Counter',
  component: Counter,
  parameters: {
    docs: {
      description: {
        component: 'An interactive counter component with increment/decrement functionality.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: () => {
    const [count, setCount] = useState(0);
    
    return (
      <Counter
        count={count}
        onIncrement={() => setCount(count + 1)}
        onDecrement={() => setCount(count - 1)}
        onReset={() => setCount(0)}
      />
    );
  },
};
```

### **Mock Data Stories**

```typescript
// src/components/UserCard/UserCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { UserCard } from './UserCard';

const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'Developer',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    role: 'Designer',
  },
];

const meta: Meta<typeof UserCard> = {
  title: 'Components/UserCard',
  component: UserCard,
  parameters: {
    docs: {
      description: {
        component: 'A user profile card with avatar and information.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: mockUsers[0],
  },
};

export const Designer: Story = {
  args: {
    user: mockUsers[1],
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mockUsers.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  ),
};
```

### **Control Panel Stories**

```typescript
// src/components/DataTable/DataTable.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';

const mockData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager' },
];

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    docs: {
      description: {
        component: 'A sortable and filterable data table component.',
      },
    },
  },
  argTypes: {
    data: {
      control: 'object',
    },
    sortable: {
      control: 'boolean',
    },
    filterable: {
      control: 'boolean',
    },
    pagination: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: mockData,
    sortable: true,
    filterable: true,
    pagination: true,
  },
};
```

## Testing Integration

### **Interaction Testing**

```typescript
// src/components/Button/Button.test.tsx
import { expect, fn } from '@storybook/test';
import { within, userEvent } from '@storybook/testing-library';
import { composeStories } from '@storybook/react';

import * as stories from './Button.stories';

const { Default, Disabled } = composeStories(stories);

export default {
  title: 'Components/Button/Tests',
  component: Default,
};

export const ClickTest = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    
    await userEvent.click(button);
    
    // Assert button was clicked
    expect(button).toBeInTheDocument();
  },
};

export const DisabledTest = {
  ...Disabled,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    
    // Assert button is disabled
    expect(button).toBeDisabled();
  },
};
```

### **Accessibility Testing**

```typescript
// src/components/Button/Button.a11y.test.tsx
import { checkAccessibility } from '@storybook/addon-a11y';
import { composeStories } from '@storybook/react';

import * as stories from './Button.stories';

const { Default, Secondary } = composeStories(stories);

export const AccessibilityTest = {
  ...Default,
  play: async ({ canvasElement }) => {
    await checkAccessibility(canvasElement);
  },
};

export const SecondaryAccessibilityTest = {
  ...Secondary,
  play: async ({ canvasElement }) => {
    await checkAccessibility(canvasElement);
  },
};
```

## Monorepo Integration

### **Package Configuration**

```json
// packages/ui-components/package.json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "storybook:test": "storybook test", // Storybook 9 testing
    "storybook:build": "storybook build --output-dir dist/storybook"
  },
  "devDependencies": {
    "@storybook/react": "^9.0.0",
    "@storybook/react-vite": "^9.0.0",
    "@storybook/addon-essentials": "^9.0.0",
    "@storybook/test": "^9.0.0"
  }
}
```

### **Turbo Integration**

```json
// turbo.json
{
  "tasks": {
    "storybook": {
      "cache": false,
      "persistent": true,
      "dependsOn": ["^build"]
    },
    "storybook:test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"],
      "cache": true
    },
    "build-storybook": {
      "dependsOn": ["^build"],
      "outputs": ["storybook-static/**"],
      "inputs": [
        "src/**",
        "stories/**",
        "package.json",
        ".storybook/**"
      ],
      "cache": true
    }
  }
}
```

### **Workspace Stories**

```typescript
// packages/ui-components/src/index.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { Input } from './components/Input';

const meta: Meta = {
  title: 'UI Components/Overview',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Overview of all available UI components in the design system.',
      },
    },
  },
};

export default meta;

export const ComponentShowcase: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Buttons</h2>
        <div className="flex gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Cards</h2>
        <Card className="max-w-sm">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Sample Card</h3>
            <p className="text-gray-600">This is a sample card component.</p>
          </div>
        </Card>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Inputs</h2>
        <Input placeholder="Enter text..." />
      </div>
    </div>
  ),
};
```

## Deployment and Publishing

### **Static Build**

```bash
# Build Storybook for deployment
pnpm build-storybook

# Output: dist/storybook/
```

### **GitHub Pages Deployment**

```yaml
# .github/workflows/storybook.yml
name: Deploy Storybook

on:
  push:
    branches: [main]
    paths: ['packages/ui-components/**']

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Build Storybook
        run: pnpm --filter @agency/ui-components build-storybook
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: packages/ui-components/storybook-static
```

### **Chromatic Integration**

```bash
# Install Chromatic
pnpm add -D chromatic

# Deploy to Chromatic
pnpm chromatic --project-token=your-token
```

## Best Practices

### **Story Organization with Tags**

1. **Use Tags**: Tag stories based on status (`stable`, `alpha`, `beta`, `deprecated`), role (`design`, `dev`, `product`), or team (Storybook 9)
2. **Co-locate Stories**: Keep `.stories.tsx` files next to component files
3. **Consistent Naming**: Use clear, descriptive story names
4. **Logical Grouping**: Group related stories and components
5. **Autodocs**: Enable autodocs for automatic documentation generation

### **Component Documentation**

1. **Component Descriptions**: Provide clear component descriptions
2. **Prop Documentation**: Document all props with controls
3. **Usage Examples**: Show real-world usage patterns
4. **Accessibility Notes**: Include accessibility information
5. **Story Globals**: Use globals for theme, viewport, and locale testing (Storybook 9)

### **Testing Strategy (Storybook 9)**

1. **Storybook Test**: Use Vitest-powered testing for all stories
2. **Watch Mode**: Enable watch mode during development
3. **Interaction Tests**: Record and replay user interactions
4. **Visual Regression**: Implement visual testing for UI consistency
5. **Accessibility**: Automate a11y checks in CI

### **Performance Optimization**

1. **Leaner Bundle**: Storybook 9 is 48% smaller - take advantage of faster installs
2. **Lazy Loading**: Use lazy loading for large component sets
3. **Build Optimization**: Optimize build configuration for production
4. **Asset Management**: Properly manage images and assets
5. **Bundle Analysis**: Monitor bundle size and performance

## Troubleshooting

### **Common Issues**

#### **Build Errors**
```bash
# Error: "Cannot find module"
# Solution: Check import paths and dependencies
import { Button } from './Button'; // Ensure correct relative path
```

#### **Theme Issues**
```bash
# Error: "Theme not applied"
# Solution: Check theme provider setup
const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};
```

#### **Performance Issues**
```bash
# Slow Storybook startup
# Solutions:
# 1. Enable lazy loading
# 2. Optimize imports
# 3. Use storyshots for testing
```

### **Debugging Tools**

```bash
# Debug Storybook configuration
npx storybook debug

# Check for issues
npx storybook doctor

# Build with verbose output
npx build-storybook --verbose

# Run tests in debug mode
npx storybook test --debug
```

## Migration to Storybook 9

### From Storybook 8

```bash
# Upgrade Storybook packages
npx storybook@latest upgrade

# Run automigrations
npx storybook@latest automigrate
```

### Key Changes
- **48% smaller bundle** - Flatter dependency structure
- **Storybook Test** - New Vitest-powered testing
- **Story Generation** - Create stories from UI
- **Tags** - New organization system
- **Globals** - Per-story context variables
- **Next.js Vite** - New framework option

## Resources

### **Official Documentation**
- [Storybook Official Docs](https://storybook.js.org/docs)
- [Storybook 9 Blog Post](https://storybook.js.org/blog/storybook-9/)
- [React Storybook Guide](https://storybook.js.org/docs/react/get-started/introduction)
- [Addon Documentation](https://storybook.js.org/docs/addons/addon-essentials)
- [Storybook Test](https://storybook.js.org/docs/writing-tests/test-runner)

### **Community Resources**
- [Storybook Examples](https://github.com/storybookjs/storybook/tree/main/examples)
- [Design System Examples](https://storybook.js.org/examples/design-system/)
- [Component Library Best Practices](https://storybook.js.org/docs/writing-docs/doc-blocks)

### **Tools and Extensions**
- [Storybook CLI](https://storybook.js.org/docs/cli)
- [Chromatic](https://www.chromatic.com/)
- [Storybook Design Token](https://github.com/storybookjs/design-token)
- [Test Codegen Addon](https://github.com/igrlk/storybook-addon-test-codegen)
- [Tag Badges Addon](https://github.com/Sidnioulz/storybook-addon-tag-badges)
