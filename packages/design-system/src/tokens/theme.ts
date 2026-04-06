// Design token interface
export interface DesignTokens {
  colors: typeof import('./colors').colors;
  typography: typeof import('./typography').typography;
  spacing: typeof import('./spacing').spacing;
}

// Theme configuration interface
export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  typography: {
    fontFamily: {
      display: string;
      body: string;
      mono: string;
    };
    scale: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
      '6xl': string;
    };
  };
  spacing: {
    base: string;
    scale: Record<string, string>;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

// Default theme configuration
export const defaultTheme: ThemeConfig = {
  name: 'default',
  colors: {
    primary: 'oklch(0.64 0.201 252.75)',
    secondary: 'oklch(0.71 0.034 106.42)',
    accent: 'oklch(0.82 0.028 106.42)',
    neutral: 'oklch(0.71 0.034 106.42)',
    success: 'oklch(0.63 0.124 142.5)',
    warning: 'oklch(0.69 0.124 95.29)',
    error: 'oklch(0.67 0.198 27.33)',
    info: 'oklch(0.67 0.164 238.74)',
  },
  typography: {
    fontFamily: {
      display: '"Inter", "system-ui", "sans-serif"',
      body: '"Inter", "system-ui", "sans-serif"',
      mono: '"JetBrains Mono", "Consolas", "monospace"',
    },
    scale: {
      xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
      sm: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
      base: 'clamp(1rem, 0.925rem + 0.375vw, 1.125rem)',
      lg: 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
      xl: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
      '2xl': 'clamp(1.5rem, 1.3rem + 1vw, 1.875rem)',
      '3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem)',
      '4xl': 'clamp(2.25rem, 1.9rem + 1.75vw, 3rem)',
      '5xl': 'clamp(3rem, 2.5rem + 2.5vw, 4rem)',
      '6xl': 'clamp(3.75rem, 3rem + 3.75vw, 5rem)',
    },
  },
  spacing: {
    base: '0.25rem',
    scale: {
      0: '0',
      px: '1px',
      0.5: '0.125rem',
      1: '0.25rem',
      1.5: '0.375rem',
      2: '0.5rem',
      2.5: '0.625rem',
      3: '0.75rem',
      3.5: '0.875rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      9: '2.25rem',
      10: '2.5rem',
      11: '2.75rem',
      12: '3rem',
      14: '3.5rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      28: '7rem',
      32: '8rem',
      36: '9rem',
      40: '10rem',
      44: '11rem',
      48: '12rem',
      52: '13rem',
      56: '14rem',
      60: '15rem',
      64: '16rem',
      72: '18rem',
      80: '20rem',
      96: '24rem',
    },
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
