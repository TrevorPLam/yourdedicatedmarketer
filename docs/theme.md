# Dark Mode Implementation

This document describes the dark mode implementation using `next-themes` in the firm website.

## Overview

The application uses `next-themes` for theme management, providing:
- Light and dark mode support
- System preference detection and automatic switching
- Theme persistence via localStorage
- No flash of unstyled content (FOUC) on page load
- Theme synchronization across tabs and windows

## Architecture

### ThemeProvider

Located in `packages/ui/src/theme-provider.tsx`, the `ThemeProvider` wraps the entire application and handles:
- Theme state management
- System preference detection
- localStorage persistence
- Preventing hydration mismatches

**Configuration:**
- `attribute="class"`: Uses CSS class-based theme switching (`.dark` class)
- `defaultTheme="system"`: Respects OS preference by default
- `enableSystem={true}`: Enables system theme detection
- `disableTransitionOnChange`: Disables CSS transitions during theme switch for instant changes

### ThemeToggle

Located in `packages/ui/src/theme-toggle.tsx`, the `ThemeToggle` component provides:
- A button to switch between light and dark modes
- Icons (Sun/Moon from lucide-react) indicating current theme
- Mounted check to prevent hydration mismatches
- Accessible with screen reader support

**Important:** The component uses a mounted check (`useEffect`) to prevent hydration errors since `useTheme()` returns `undefined` during server-side rendering.

## Usage

### Adding Theme Support to Components

To make a component theme-aware:

1. **Use Tailwind's dark mode variant:**
```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50">
  Content
</div>
```

2. **Use CSS variables from design tokens:**
```tsx
<div className="bg-background text-foreground">
  Content
</div>
```

The CSS variables automatically switch values when the `.dark` class is applied to the html element.

### Design Tokens

Design tokens are defined in `packages/ui/src/styles.css`:
- Light mode tokens are in `:root` (via `@theme`)
- Dark mode tokens are in `.dark` selector

All colors, spacing, and typography are available as CSS variables that automatically adapt to the current theme.

## Best Practices

1. **Always use Tailwind's dark variant:** `dark:className` for conditional styling
2. **Prefer CSS variables over hard-coded values:** Use design tokens for consistency
3. **Test in both themes:** Ensure components look good in light and dark modes
4. **Check contrast ratios:** Ensure accessibility in both themes (WCAG 2.1 AA)
5. **Use mounted check in client components:** Prevent hydration errors when using `useTheme()`

## Implementation Details

### Preventing FOUC

`next-themes` automatically injects a script into the `<head>` that:
- Reads the stored theme from localStorage before page render
- Applies the correct class to the `<html>` element
- Prevents any flash of incorrect theme

### Hydration Mismatch Prevention

The `html` element has `suppressHydrationWarning` because `next-themes` modifies the class attribute before hydration, which would normally trigger React warnings.

### Theme Persistence

User theme preferences are stored in localStorage with the key `'theme'`. The preference persists across sessions and syncs across tabs.

## Files Modified

- `packages/ui/package.json`: Added `next-themes` dependency
- `packages/ui/src/theme-provider.tsx`: Created ThemeProvider component
- `packages/ui/src/theme-toggle.tsx`: Created ThemeToggle component
- `packages/ui/src/index.ts`: Exported ThemeProvider and ThemeToggle
- `packages/ui/src/styles.css`: Changed dark mode selector from `[data-theme="dark"]` to `.dark`
- `apps/firm-website/src/app/layout.tsx`: Wrapped app with ThemeProvider, added suppressHydrationWarning
- `apps/firm-website/src/components/header.tsx`: Created header with ThemeToggle
- `apps/firm-website/src/app/page.tsx`: Added Header component and dark mode styles

## Testing

To test dark mode:
1. Run `pnpm dev` from the root
2. Navigate to `http://localhost:3000`
3. Click the theme toggle button in the header
4. Verify the theme switches between light and dark
5. Check that the preference persists on page refresh
6. Test system preference by changing OS theme settings
7. Verify no flash of unstyled content on load
8. Check browser console for hydration warnings (should be none)
