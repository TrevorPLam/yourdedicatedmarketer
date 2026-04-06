/**
 * Default theme configuration
 * Provides the base theme for the design system
 */

import { colors, semanticColors, typography, spacing } from '../tokens';
import type { ThemeConfig } from '../tokens';

export const defaultThemeConfig: ThemeConfig = {
  name: 'default',
  colors: {
    primary: colors.primary[600],
    secondary: colors.neutral[100],
    accent: colors.neutral[200],
    neutral: colors.neutral[500],
    success: colors.success[600],
    warning: colors.warning[600],
    error: colors.error[600],
    info: colors.info[600],
  },
  typography: {
    fontFamily: {
      display: typography.fonts.display,
      body: typography.fonts.body,
      mono: typography.fonts.mono,
    },
    scale: typography.sizes,
  },
  spacing: {
    base: spacing.base,
    scale: spacing.scale,
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
};

// Light theme semantic colors
export const lightTheme = {
  ...defaultThemeConfig,
  semanticColors: semanticColors.light,
};

// Dark theme semantic colors
export const darkTheme = {
  ...defaultThemeConfig,
  semanticColors: semanticColors.dark,
  colors: {
    ...defaultThemeConfig.colors,
    background: colors.neutral[900],
    foreground: colors.neutral[50],
    muted: colors.neutral[800],
    'muted-foreground': colors.neutral[400],
    border: colors.neutral[700],
    input: colors.neutral[800],
    secondary: colors.neutral[800],
    accent: colors.neutral[700],
  },
};

// Theme utilities
export const themeUtils = {
  /**
   * Get theme by name
   */
  getTheme: (name: string) => {
    switch (name) {
      case 'light':
        return lightTheme;
      case 'dark':
        return darkTheme;
      default:
        return lightTheme;
    }
  },

  /**
   * Generate CSS custom properties for theme
   */
  generateCSSVariables: (theme: typeof lightTheme | typeof darkTheme) => {
    const variables: string[] = [];

    // Color variables
    Object.entries(theme.semanticColors).forEach(([key, value]) => {
      variables.push(`--color-${key}: ${value};`);
    });

    // Typography variables
    Object.entries(theme.typography.fontFamily).forEach(([key, value]) => {
      variables.push(`--font-${key}: ${value};`);
    });

    // Spacing variables
    variables.push(`--spacing: ${theme.spacing.base};`);

    // Border radius variables
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      variables.push(`--radius-${key}: ${value};`);
    });

    // Shadow variables
    Object.entries(theme.shadows).forEach(([key, value]) => {
      variables.push(`--shadow-${key}: ${value};`);
    });

    return variables.join('\n');
  },

  /**
   * Detect system theme preference
   */
  getSystemTheme: (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  },

  /**
   * Watch for system theme changes
   */
  watchSystemTheme: (callback: (theme: 'light' | 'dark') => void) => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        callback(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    return () => {};
  },
} as const;
