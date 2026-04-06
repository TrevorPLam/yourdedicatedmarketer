# @agency/design-system

Modern design system for marketing agency applications built with Tailwind CSS
v4.0.

## Features

- **Tailwind CSS v4.0**: CSS-first configuration with `@theme` directive
- **oklch Color Space**: Modern color system with better color manipulation
- **Fluid Typography**: Responsive typography using `clamp()` functions
- **Semantic Themes**: Light and dark theme support with CSS custom properties
- **Design Tokens**: Comprehensive token system for colors, typography, and
  spacing
- **Container Queries**: Modern responsive design patterns
- **TypeScript**: Full type safety for all design tokens

## Installation

```bash
pnpm add @agency/design-system --workspace
```

## Usage

### Import Styles

```css
/* In your main CSS file */
@import '@agency/design-system/styles';
```

### Import Tokens

```typescript
import { colors, typography, spacing } from '@agency/design-system/tokens';
import { lightTheme, darkTheme } from '@agency/design-system/themes';
```

### Import Everything

```typescript
import * as DesignSystem from '@agency/design-system';
```

## Tokens

### Colors

```typescript
import { colors, semanticColors } from '@agency/design-system';

// Use color tokens
const primaryColor = colors.primary[600];
const backgroundColor = semanticColors.light.background;
```

### Typography

```typescript
import { typography, responsiveType } from '@agency/design-system';

// Use typography tokens
const headingFont = typography.fonts.display;
const fluidText = responsiveType.fluid('1rem', '2rem');
```

### Spacing

```typescript
import { spacing, spacingUtils } from '@agency/design-system';

// Use spacing tokens
const padding = spacing.scale[4];
const responsivePadding = spacingUtils.responsiveSpacing('padding', {
  base: 4,
  md: 6,
  lg: 8,
});
```

## Themes

### CSS-Only Theme Switching

```typescript
import { cssThemeUtils } from '@agency/design-system';

// Initialize theme
const themeManager = cssThemeUtils.initTheme();

// Set theme
themeManager.setTheme('dark');
themeManager.setTheme('light');
themeManager.setTheme('system');
```

### React Theme Provider

```typescript
import { createThemeContext } from '@agency/design-system';
import React from 'react';

// Create theme context
const { ThemeProvider, useTheme } = createThemeContext();

// Use in your app
function App() {
  return (
    <ThemeProvider>
      <MyComponent />
    </ThemeProvider>
  );
}

function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme('dark')}>
        Switch to Dark
      </button>
    </div>
  );
}
```

## Tailwind CSS Configuration

### Import the Tailwind Config

```javascript
// tailwind.config.js
import config from '@agency/design-system/tailwind';

export default config;
```

### Custom Configuration

```javascript
// tailwind.config.js
import baseConfig from '@agency/design-system/tailwind';

export default {
  ...baseConfig,
  content: [
    './src/**/*.{astro,js,ts,jsx,tsx}',
    './node_modules/@agency/ui-components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    ...baseConfig.theme,
    extend: {
      // Your custom extensions
    },
  },
};
```

## Browser Compatibility

This design system requires modern browsers:

- **Chrome**: 111+
- **Firefox**: 113+
- **Safari**: 16.4+
- **Edge**: 111+

### Key Features Requiring Modern Browsers

- **oklch Color Space**: For modern color manipulation
- **CSS `@theme` directive**: Tailwind CSS v4.0 configuration
- **`clamp()` functions**: Fluid typography
- **Container Queries**: Responsive design patterns
- **CSS Custom Properties**: Theme switching

## Development

### Build

```bash
pnpm build
```

### Watch Mode

```bash
pnpm dev
```

### Type Checking

```bash
pnpm type-check
```

### Clean Build

```bash
pnpm clean
```

## Architecture

### Token Structure

```
src/tokens/
├── colors.ts      # Color tokens and semantic mappings
├── typography.ts  # Typography scale and utilities
├── spacing.ts     # Spacing scale and layout utilities
└── index.ts       # Token exports
```

### Theme Structure

```
src/themes/
├── default.ts     # Default theme configuration
└── index.ts       # Theme providers and utilities
```

### Styles Structure

```
src/styles/
└── globals.css    # Global styles and Tailwind config
```

## Customization

### Adding New Colors

```typescript
// src/tokens/colors.ts
export const colors = {
  // ...existing colors
  brand: {
    50: 'oklch(0.99 0.01 200)',
    // ...add your color scale
  },
};
```

### Adding New Typography Scales

```typescript
// src/tokens/typography.ts
export const typography = {
  // ...existing typography
  sizes: {
    // ...existing sizes
    '7xl': 'clamp(4rem, 3.5rem + 2.5vw, 6rem)',
  },
};
```

### Creating Custom Themes

```typescript
// src/themes/custom.ts
import { lightTheme } from './default';

export const customTheme = {
  ...lightTheme,
  name: 'custom',
  colors: {
    ...lightTheme.colors,
    primary: 'oklch(0.65 0.25 180)',
  },
};
```

## Migration from Tailwind CSS v3

If you're migrating from Tailwind CSS v3:

1. **Configuration**: Replace `tailwind.config.js` with CSS `@theme` directive
2. **Colors**: Update to oklch color space
3. **Content Detection**: Remove manual content configuration
4. **Browser Support**: Ensure modern browser support

## Performance

- **Bundle Size**: Optimized with tree-shaking
- **Runtime**: CSS-only theme switching
- **Build**: Fast compilation with Tailwind CSS v4.0
- **Dev Experience**: Hot module replacement for tokens

## Contributing

When contributing to the design system:

1. **Tokens**: Add comprehensive JSDoc documentation
2. **Themes**: Test both light and dark variants
3. **Types**: Maintain TypeScript type safety
4. **Browser**: Test across supported browsers
5. **Documentation**: Update README and examples

## License

MIT License - see LICENSE file for details.
