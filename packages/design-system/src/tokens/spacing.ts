/**
 * Spacing tokens and layout utilities
 * Logical spacing system with CSS custom properties
 */

export const spacing = {
  // Base spacing unit (4px = 0.25rem)
  base: '0.25rem',

  // Spacing scale
  scale: {
    0: '0',
    px: '1px',
    0.5: '0.125rem', // 2px
    1: '0.25rem', // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem', // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem', // 12px
    3.5: '0.875rem', // 14px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    7: '1.75rem', // 28px
    8: '2rem', // 32px
    9: '2.25rem', // 36px
    10: '2.5rem', // 40px
    11: '2.75rem', // 44px
    12: '3rem', // 48px
    14: '3.5rem', // 56px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
    28: '7rem', // 112px
    32: '8rem', // 128px
    36: '9rem', // 144px
    40: '10rem', // 160px
    44: '11rem', // 176px
    48: '12rem', // 192px
    52: '13rem', // 208px
    56: '14rem', // 224px
    60: '15rem', // 240px
    64: '16rem', // 256px
    72: '18rem', // 288px
    80: '20rem', // 320px
    96: '24rem', // 384px
  },

  // Container max widths
  containers: {
    xs: '20rem', // 320px
    sm: '24rem', // 384px
    md: '28rem', // 448px
    lg: '32rem', // 512px
    xl: '36rem', // 576px
    '2xl': '42rem', // 672px
    '3xl': '48rem', // 768px
    '4xl': '56rem', // 896px
    '5xl': '64rem', // 1024px
    '6xl': '72rem', // 1152px
    '7xl': '80rem', // 1280px
    full: '100%',
  },

  // Common spacing patterns
  patterns: {
    // Component spacing
    component: {
      padding: {
        xs: '0.5rem', // 8px
        sm: '0.75rem', // 12px
        md: '1rem', // 16px
        lg: '1.5rem', // 24px
        xl: '2rem', // 32px
      },
      margin: {
        xs: '0.25rem', // 4px
        sm: '0.5rem', // 8px
        md: '0.75rem', // 12px
        lg: '1rem', // 16px
        xl: '1.5rem', // 24px
      },
      gap: {
        xs: '0.25rem', // 4px
        sm: '0.5rem', // 8px
        md: '0.75rem', // 12px
        lg: '1rem', // 16px
        xl: '1.5rem', // 24px
      },
    },

    // Layout spacing
    layout: {
      section: {
        padding: '3rem', // 48px
        margin: '4rem', // 64px
      },
      container: {
        padding: '1.5rem', // 24px
        margin: '0 auto',
      },
      grid: {
        gap: '1.5rem', // 24px
        gapSm: '1rem', // 16px
        gapLg: '2rem', // 32px
      },
    },

    // Content spacing
    content: {
      paragraph: {
        marginBottom: '1.5rem', // 24px
      },
      heading: {
        marginBottom: '1rem', // 16px
      },
      list: {
        marginLeft: '1.5rem', // 24px
        marginBottom: '0.5rem', // 8px
      },
    },
  },
} as const;

// Layout utilities
export const layout = {
  // Max width utilities
  maxWidth: {
    container: 'max-w-7xl', // 1280px
    narrow: 'max-w-4xl', // 896px
    wide: 'max-w-full', // 100%
    prose: 'max-w-prose', // 65ch
  },

  // Centering utilities
  center: {
    block: 'mx-auto',
    flex: 'flex items-center justify-center',
    grid: 'grid place-items-center',
  },

  // Aspect ratios
  aspectRatio: {
    square: 'aspect-square',
    video: 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '3/2': 'aspect-[3/2]',
    '16/9': 'aspect-[16/9]',
    '21/9': 'aspect-[21/9]',
  },

  // Position utilities
  position: {
    relative: 'relative',
    absolute: 'absolute',
    fixed: 'fixed',
    sticky: 'sticky',
    static: 'static',
  },

  // Z-index scale
  zIndex: {
    hide: '-z-10',
    auto: 'z-auto',
    base: 'z-0',
    docked: 'z-10',
    dropdown: 'z-20',
    sticky: 'z-30',
    banner: 'z-40',
    overlay: 'z-50',
    modal: 'z-60',
    popover: 'z-70',
    tooltip: 'z-80',
    toast: 'z-90',
  },
} as const;

// Spacing utilities
export const spacingUtils = {
  /**
   * Generate spacing class
   */
  spacing: (property: 'padding' | 'margin' | 'gap', value: keyof typeof spacing.scale) => {
    const prop = property === 'padding' ? 'p' : property === 'margin' ? 'm' : 'gap';
    return `${prop}-${value}`;
  },

  /**
   * Generate responsive spacing
   */
  responsiveSpacing: (
    property: 'padding' | 'margin' | 'gap',
    values: {
      base?: keyof typeof spacing.scale;
      sm?: keyof typeof spacing.scale;
      lg?: keyof typeof spacing.scale;
    }
  ) => {
    const classes = [];
    if (values.base) classes.push(spacingUtils.spacing(property, values.base));
    if (values.sm) classes.push(`sm:${spacingUtils.spacing(property, values.sm)}`);
    if (values.lg) classes.push(`lg:${spacingUtils.spacing(property, values.lg)}`);
    return classes.join(' ');
  },

  /**
   * Generate logical spacing (inline/block)
   */
  logicalSpacing: (property: 'inline' | 'block', value: keyof typeof spacing.scale) => {
    const prop = property === 'inline' ? 'x' : 'y';
    return `${prop}-${value}`;
  },

  /**
   * Generate space between utilities
   */
  spaceBetween: (value: keyof typeof spacing.scale) => `space-y-${value}`,

  /**
   * Generate divide utilities
   */
  divide: (value: keyof typeof spacing.scale) => `divide-y-${value}`,

  /**
   * Generate gap utilities for flex/grid
   */
  gap: (value: keyof typeof spacing.scale) => `gap-${value}`,

  /**
   * Generate gap utilities for grid columns/rows
   */
  gapX: (value: keyof typeof spacing.scale) => `gap-x-${value}`,
  gapY: (value: keyof typeof spacing.scale) => `gap-y-${value}`,
} as const;

// Container queries utilities
export const containerQueries = {
  /**
   * Container query breakpoints
   */
  breakpoints: {
    sm: '20rem', // 320px
    md: '32rem', // 512px
    lg: '48rem', // 768px
    xl: '64rem', // 1024px
    '2xl': '80rem', // 1280px
  } as const,

  /**
   * Generate container query class
   */
  container: function (minWidth: keyof typeof this.breakpoints) {
    return `@container (min-width: ${this.breakpoints[minWidth]})`;
  },

  /**
   * Container query utilities
   */
  utilities: {
    // Container definition
    container: '@container',

    // Container query variants
    'container-sm': '@container (min-width: 20rem)',
    'container-md': '@container (min-width: 32rem)',
    'container-lg': '@container (min-width: 48rem)',
    'container-xl': '@container (min-width: 64rem)',
  },
} as const;

// Fluid spacing utilities
export const fluidSpacing = {
  /**
   * Generate fluid spacing with clamp
   */
  fluid: (
    minSize: keyof typeof spacing.scale,
    maxSize: keyof typeof spacing.scale,
    minViewport = '20rem',
    maxViewport = '80rem'
  ) =>
    `clamp(${spacing.scale[minSize]}, ${spacing.scale[minSize]} + calc(${spacing.scale[maxSize]} - ${spacing.scale[minSize]}) * ((100vw - ${minViewport}) / (${maxViewport} - ${minViewport})), ${spacing.scale[maxSize]})`,

  /**
   * Generate responsive container padding
   */
  containerPadding: (
    minPadding: keyof typeof spacing.scale,
    maxPadding: keyof typeof spacing.scale
  ) => fluidSpacing.fluid(minPadding, maxPadding),

  /**
   * Generate responsive section spacing
   */
  sectionSpacing: (
    minSpacing: keyof typeof spacing.scale,
    maxSpacing: keyof typeof spacing.scale
  ) => fluidSpacing.fluid(minSpacing, maxSpacing),
} as const;

export type SpacingValue = keyof typeof spacing.scale;
export type ContainerSize = keyof typeof spacing.containers;
export type ZIndexValue = keyof typeof layout.zIndex;
