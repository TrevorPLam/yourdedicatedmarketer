/**
 * Color tokens using modern oklch color space
 * Provides comprehensive color system with semantic mappings
 */

export const colors = {
  // Primary brand colors
  primary: {
    50: 'oklch(0.99 0.013 250.79)',
    100: 'oklch(0.97 0.034 252.24)',
    200: 'oklch(0.94 0.064 251.86)',
    300: 'oklch(0.90 0.108 252.21)',
    400: 'oklch(0.84 0.158 252.54)',
    500: 'oklch(0.74 0.214 252.59)',
    600: 'oklch(0.64 0.201 252.75)',
    700: 'oklch(0.53 0.158 252.86)',
    800: 'oklch(0.44 0.109 252.86)',
    900: 'oklch(0.38 0.069 252.75)',
    950: 'oklch(0.24 0.041 252.86)',
  },

  // Neutral colors (grayscale)
  neutral: {
    50: 'oklch(0.99 0.002 106.42)',
    100: 'oklch(0.97 0.006 106.42)',
    200: 'oklch(0.95 0.011 106.42)',
    300: 'oklch(0.91 0.018 106.42)',
    400: 'oklch(0.82 0.028 106.42)',
    500: 'oklch(0.71 0.034 106.42)',
    600: 'oklch(0.58 0.032 106.42)',
    700: 'oklch(0.45 0.025 106.42)',
    800: 'oklch(0.35 0.019 106.42)',
    900: 'oklch(0.27 0.015 106.42)',
    950: 'oklch(0.15 0.011 106.42)',
  },

  // Success colors (green)
  success: {
    50: 'oklch(0.97 0.074 142.5)',
    100: 'oklch(0.94 0.132 142.5)',
    200: 'oklch(0.89 0.172 142.5)',
    300: 'oklch(0.84 0.188 142.5)',
    400: 'oklch(0.79 0.179 142.5)',
    500: 'oklch(0.72 0.149 142.5)',
    600: 'oklch(0.63 0.124 142.5)',
    700: 'oklch(0.53 0.098 142.5)',
    800: 'oklch(0.44 0.074 142.5)',
    900: 'oklch(0.37 0.055 142.5)',
    950: 'oklch(0.21 0.034 142.5)',
  },

  // Warning colors (amber/yellow)
  warning: {
    50: 'oklch(0.98 0.019 95.29)',
    100: 'oklch(0.95 0.041 95.29)',
    200: 'oklch(0.91 0.068 95.29)',
    300: 'oklch(0.87 0.094 95.29)',
    400: 'oklch(0.83 0.116 95.29)',
    500: 'oklch(0.78 0.134 95.29)',
    600: 'oklch(0.69 0.124 95.29)',
    700: 'oklch(0.58 0.098 95.29)',
    800: 'oklch(0.47 0.071 95.29)',
    900: 'oklch(0.39 0.051 95.29)',
    950: 'oklch(0.22 0.031 95.29)',
  },

  // Error colors (red)
  error: {
    50: 'oklch(0.97 0.051 27.33)',
    100: 'oklch(0.94 0.098 27.33)',
    200: 'oklch(0.90 0.149 27.33)',
    300: 'oklch(0.86 0.191 27.33)',
    400: 'oklch(0.82 0.221 27.33)',
    500: 'oklch(0.76 0.237 27.33)',
    600: 'oklch(0.67 0.198 27.33)',
    700: 'oklch(0.56 0.149 27.33)',
    800: 'oklch(0.45 0.106 27.33)',
    900: 'oklch(0.37 0.074 27.33)',
    950: 'oklch(0.21 0.046 27.33)',
  },

  // Info colors (blue)
  info: {
    50: 'oklch(0.97 0.041 238.74)',
    100: 'oklch(0.94 0.079 238.74)',
    200: 'oklch(0.90 0.116 238.74)',
    300: 'oklch(0.86 0.149 238.74)',
    400: 'oklch(0.82 0.174 238.74)',
    500: 'oklch(0.76 0.191 238.74)',
    600: 'oklch(0.67 0.164 238.74)',
    700: 'oklch(0.56 0.128 238.74)',
    800: 'oklch(0.45 0.091 238.74)',
    900: 'oklch(0.37 0.064 238.74)',
    950: 'oklch(0.21 0.041 238.74)',
  },
} as const;

// Semantic color mappings
export const semanticColors = {
  // Light theme
  light: {
    background: colors.neutral[50],
    foreground: colors.neutral[900],
    muted: colors.neutral[100],
    'muted-foreground': colors.neutral[500],
    popover: colors.neutral[50],
    'popover-foreground': colors.neutral[900],
    card: colors.neutral[50],
    'card-foreground': colors.neutral[900],
    border: colors.neutral[200],
    input: colors.neutral[50],
    'input-border': colors.neutral[300],

    primary: colors.primary[600],
    'primary-foreground': colors.neutral[50],
    'primary-hover': colors.primary[700],
    'primary-active': colors.primary[800],

    secondary: colors.neutral[100],
    'secondary-foreground': colors.neutral[900],
    'secondary-hover': colors.neutral[200],
    'secondary-active': colors.neutral[300],

    accent: colors.neutral[200],
    'accent-foreground': colors.neutral[900],
    'accent-hover': colors.neutral[300],
    'accent-active': colors.neutral[400],

    destructive: colors.error[600],
    'destructive-foreground': colors.neutral[50],
    'destructive-hover': colors.error[700],
    'destructive-active': colors.error[800],

    ring: colors.primary[400],
    'ring-offset': colors.neutral[50],
    'ring-offset-border': colors.neutral[200],
  },

  // Dark theme
  dark: {
    background: colors.neutral[900],
    foreground: colors.neutral[50],
    muted: colors.neutral[800],
    'muted-foreground': colors.neutral[400],
    popover: colors.neutral[900],
    'popover-foreground': colors.neutral[50],
    card: colors.neutral[900],
    'card-foreground': colors.neutral[50],
    border: colors.neutral[700],
    input: colors.neutral[800],
    'input-border': colors.neutral[600],

    primary: colors.primary[500],
    'primary-foreground': colors.neutral[900],
    'primary-hover': colors.primary[400],
    'primary-active': colors.primary[300],

    secondary: colors.neutral[800],
    'secondary-foreground': colors.neutral[50],
    'secondary-hover': colors.neutral[700],
    'secondary-active': colors.neutral[600],

    accent: colors.neutral[700],
    'accent-foreground': colors.neutral[50],
    'accent-hover': colors.neutral[600],
    'accent-active': colors.neutral[500],

    destructive: colors.error[500],
    'destructive-foreground': colors.neutral[900],
    'destructive-hover': colors.error[400],
    'destructive-active': colors.error[300],

    ring: colors.primary[500],
    'ring-offset': colors.neutral[900],
    'ring-offset-border': colors.neutral[700],
  },
} as const;

// Color utilities
export const colorUtils = {
  /**
   * Get color value by key
   */
  getColor: (colorPath: string): string => {
    const keys = colorPath.split('.');
    let value: any = colors;

    for (const key of keys) {
      value = value?.[key];
    }

    return value || colorPath;
  },

  /**
   * Get semantic color for theme
   */
  getSemanticColor: (colorKey: string, theme: 'light' | 'dark' = 'light'): string => {
    return semanticColors[theme]?.[colorKey as keyof typeof semanticColors.light] || colorKey;
  },

  /**
   * Generate CSS custom properties
   */
  generateCSSVariables: (theme: 'light' | 'dark' = 'light') => {
    const themeColors = semanticColors[theme];
    return Object.entries(themeColors)
      .map(([key, value]) => `--color-${key}: ${value};`)
      .join('\n');
  },

  /**
   * Check if color is light or dark
   */
  isLightColor: (color: string): boolean => {
    // Simple check for oklch lightness
    const match = color.match(/oklch\(([\d.]+)/);
    if (match && match[1]) {
      return parseFloat(match[1]) > 0.5;
    }
    return true;
  },
} as const;

export type ColorKey = keyof typeof colors;
export type SemanticColorKey = keyof typeof semanticColors.light;
export type Theme = 'light' | 'dark';
