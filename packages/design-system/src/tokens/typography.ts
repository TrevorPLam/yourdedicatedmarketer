/**
 * Typography tokens and utilities
 * Modern font system with performance optimization
 */

export const typography = {
  // Font families
  fonts: {
    display: '"Inter", "system-ui", "sans-serif"',
    body: '"Inter", "system-ui", "sans-serif"',
    mono: '"JetBrains Mono", "Consolas", "monospace"',
  },

  // Font sizes (clamp for fluid typography)
  sizes: {
    xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', // 12px - 14px
    sm: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)', // 14px - 16px
    base: 'clamp(1rem, 0.925rem + 0.375vw, 1.125rem)', // 16px - 18px
    lg: 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)', // 18px - 20px
    xl: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)', // 20px - 24px
    '2xl': 'clamp(1.5rem, 1.3rem + 1vw, 1.875rem)', // 24px - 30px
    '3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem)', // 30px - 36px
    '4xl': 'clamp(2.25rem, 1.9rem + 1.75vw, 3rem)', // 36px - 48px
    '5xl': 'clamp(3rem, 2.5rem + 2.5vw, 4rem)', // 48px - 64px
    '6xl': 'clamp(3.75rem, 3rem + 3.75vw, 5rem)', // 60px - 80px
  },

  // Font weights
  weights: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Line heights
  lineHeights: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Font features
  fontFeatures: {
    // Common ligatures and contextual alternates
    standard: '"liga" 1, "calt" 1',
    // Tabular numbers
    tabular: '"tnum" 1, "liga" 1, "calt" 1',
    // Discretionary ligatures
    discretionary: '"dlig" 1, "liga" 1, "calt" 1',
    // Stylistic alternatives
    stylistic: '"salt" 1, "liga" 1, "calt" 1',
  },
} as const;

// Typography scale definitions
export const typeScale = {
  // Display text (headings, hero text)
  display: {
    '1': {
      fontSize: typography.sizes['6xl'],
      fontWeight: typography.weights.black,
      lineHeight: typography.lineHeights.tight,
      letterSpacing: typography.letterSpacing.tighter,
    },
    '2': {
      fontSize: typography.sizes['5xl'],
      fontWeight: typography.weights.extrabold,
      lineHeight: typography.lineHeights.tight,
      letterSpacing: typography.letterSpacing.tighter,
    },
    '3': {
      fontSize: typography.sizes['4xl'],
      fontWeight: typography.weights.bold,
      lineHeight: typography.lineHeights.tight,
      letterSpacing: typography.letterSpacing.tight,
    },
  },

  // Heading text
  heading: {
    '1': {
      fontSize: typography.sizes['3xl'],
      fontWeight: typography.weights.bold,
      lineHeight: typography.lineHeights.tight,
      letterSpacing: typography.letterSpacing.tight,
    },
    '2': {
      fontSize: typography.sizes['2xl'],
      fontWeight: typography.weights.semibold,
      lineHeight: typography.lineHeights.snug,
      letterSpacing: typography.letterSpacing.normal,
    },
    '3': {
      fontSize: typography.sizes.xl,
      fontWeight: typography.weights.semibold,
      lineHeight: typography.lineHeights.snug,
      letterSpacing: typography.letterSpacing.normal,
    },
    '4': {
      fontSize: typography.sizes.lg,
      fontWeight: typography.weights.medium,
      lineHeight: typography.lineHeights.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
  },

  // Body text
  body: {
    '1': {
      fontSize: typography.sizes.base,
      fontWeight: typography.weights.normal,
      lineHeight: typography.lineHeights.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
    '2': {
      fontSize: typography.sizes.sm,
      fontWeight: typography.weights.normal,
      lineHeight: typography.lineHeights.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
    '3': {
      fontSize: typography.sizes.xs,
      fontWeight: typography.weights.normal,
      lineHeight: typography.lineHeights.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
  },

  // UI elements
  ui: {
    button: {
      fontSize: typography.sizes.sm,
      fontWeight: typography.weights.medium,
      lineHeight: typography.lineHeights.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
    label: {
      fontSize: typography.sizes.sm,
      fontWeight: typography.weights.medium,
      lineHeight: typography.lineHeights.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
    caption: {
      fontSize: typography.sizes.xs,
      fontWeight: typography.weights.normal,
      lineHeight: typography.lineHeights.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
    code: {
      fontFamily: typography.fonts.mono,
      fontSize: typography.sizes.sm,
      fontWeight: typography.weights.normal,
      lineHeight: typography.lineHeights.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
  },
} as const;

// Responsive typography utilities
export const responsiveType = {
  /**
   * Generate fluid typography clamp values
   */
  fluid: (minSize: string, maxSize: string, minViewport = '20rem', maxViewport = '80rem') =>
    `clamp(${minSize}, ${minSize} + calc(${maxSize} - ${minSize}) * ((100vw - ${minViewport}) / (${maxViewport} - ${minViewport})), ${maxSize})`,

  /**
   * Generate responsive font size with breakpoints
   */
  responsive: (sizes: { base: string; md?: string; lg?: string; xl?: string }) => {
    const responsive = [sizes.base];
    if (sizes.md) responsive.push(`md:${sizes.md}`);
    if (sizes.lg) responsive.push(`lg:${sizes.lg}`);
    if (sizes.xl) responsive.push(`xl:${sizes.xl}`);
    return responsive.join(' ');
  },

  /**
   * Generate typography classes
   */
  typographyClass: (variant: keyof typeof typeScale, size: string) => {
    const variantConfig = typeScale[variant];
    if (!variantConfig) return '';

    const config = variantConfig[size as keyof typeof variantConfig];
    if (!config) return '';

    return Object.entries(config)
      .map(([property, value]) => {
        switch (property) {
          case 'fontSize':
            return `text-[${value}]`;
          case 'fontWeight':
            return `font-${value}`;
          case 'lineHeight':
            return `leading-[${value}]`;
          case 'letterSpacing':
            return `tracking-[${value}]`;
          case 'fontFamily':
            return `font-[${value}]`;
          default:
            return '';
        }
      })
      .filter(Boolean)
      .join(' ');
  },
} as const;

// Text utilities
export const textUtils = {
  /**
   * Truncate text with ellipsis
   */
  truncate: (lines: number = 1) => {
    if (lines === 1) return 'truncate';
    return `line-clamp-${lines}`;
  },

  /**
   * Balance text for better typography
   */
  balance: 'text-balance',

  /**
   * Optimize font rendering
   */
  optimize: {
    antialiased: 'antialiased',
    subpixelAntialiased: 'subpixel-antialiased',
  },

  /**
   * Text alignment utilities
   */
  align: {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  },

  /**
   * Text transform utilities
   */
  transform: {
    uppercase: 'uppercase',
    lowercase: 'lowercase',
    capitalize: 'capitalize',
    normalCase: 'normal-case',
  },
} as const;

// Font loading strategy
export const fontLoading = {
  /**
   * Generate font preload links
   */
  preload: (fonts: Array<{ family: string; weight?: string; display?: string }>) => {
    return fonts
      .map((font) => {
        const weight = font.weight || '400';
        const fontDisplay = font.display || 'swap';
        return `<link rel="preload" href="/fonts/${font.family}-${weight}.woff2" as="font" type="font/woff2" crossorigin="${fontDisplay}">`;
      })
      .join('\n');
  },

  /**
   * Generate font face CSS
   */
  fontFace: (
    family: string,
    src: string,
    weight: string = '400',
    style: string = 'normal',
    display: string = 'swap'
  ) => `
@font-face {
  font-family: '${family}';
  src: url('${src}');
  font-weight: ${weight};
  font-style: ${style};
  font-display: ${display};
}
  `,

  /**
   * Variable font configuration
   */
  variableFont: (
    family: string,
    src: string,
    weightRange: string = '100 900',
    display: string = 'swap'
  ) => `
@font-face {
  font-family: '${family}';
  src: url('${src}');
  font-weight: ${weightRange};
  font-style: normal;
  font-display: ${display};
}
  `,
} as const;

export type FontFamily = keyof typeof typography.fonts;
export type FontSize = keyof typeof typography.sizes;
export type FontWeight = keyof typeof typography.weights;
export type LineHeight = keyof typeof typography.lineHeights;
export type LetterSpacing = keyof typeof typography.letterSpacing;
