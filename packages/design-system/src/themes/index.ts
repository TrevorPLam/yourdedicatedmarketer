// Theme exports
export * from './default';
export * from './theme-provider';

import React from 'react';

// Theme provider utilities
export interface ThemeProvider {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  resolvedTheme: 'light' | 'dark';
}

// Legacy theme context for backward compatibility
export const createThemeContext = () => {
  if (typeof React === 'undefined') {
    throw new Error('React is required for theme context');
  }

  const { createContext, useContext, useState, useEffect } = React;

  const ThemeContext = createContext<
    | {
        theme: 'light' | 'dark';
        setTheme: (theme: 'light' | 'dark' | 'system') => void;
        resolvedTheme: 'light' | 'dark';
      }
    | undefined
  >(undefined);

  const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
      throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
  };

  const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const updateTheme = () => {
        if (theme === 'system') {
          setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
        } else {
          setResolvedTheme(theme);
        }
      };

      updateTheme();
      mediaQuery.addEventListener('change', updateTheme);

      return () => mediaQuery.removeEventListener('change', updateTheme);
    }, [theme]);

    useEffect(() => {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(resolvedTheme);
    }, [resolvedTheme]);

    const setThemeState = (newTheme: 'light' | 'dark' | 'system') => {
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system';
      if (savedTheme) {
        setThemeState(savedTheme);
      }
    }, []);

    useEffect(() => {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(resolvedTheme);
    }, [resolvedTheme]);

    return React.createElement(
      ThemeContext.Provider,
      { value: { theme: resolvedTheme, setTheme, resolvedTheme } },
      children
    );
  };

  return { ThemeProvider, useTheme };
};

// CSS-only theme switching
export const cssThemeUtils = {
  /**
   * Generate theme CSS classes
   */
  themeClasses: {
    light: 'light',
    dark: 'dark',
  },

  /**
   * Generate theme selector CSS
   */
  themeSelectorCSS: `
    :root {
      --theme-transition-duration: 0.2s;
      --theme-transition-timing: ease;
    }
    
    [data-theme="light"] {
      color-scheme: light;
    }
    
    [data-theme="dark"] {
      color-scheme: dark;
    }
    
    @media (prefers-color-scheme: dark) {
      :root:not([data-theme="light"]) {
        color-scheme: dark;
      }
    }
    
    * {
      transition: 
        background-color var(--theme-transition-duration) var(--theme-transition-timing),
        border-color var(--theme-transition-duration) var(--theme-transition-timing),
        color var(--theme-transition-duration) var(--theme-transition-timing);
    }
  `,

  /**
   * Initialize theme in browser
   */
  initTheme: () => {
    if (typeof window === 'undefined') return;

    const getTheme = (): 'light' | 'dark' => {
      const stored = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
      if (stored === 'light' || stored === 'dark') return stored;

      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const theme = getTheme();
    document.documentElement.setAttribute('data-theme', theme);

    // Watch for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const stored = localStorage.getItem('theme');
      if (stored !== 'light' && stored !== 'dark') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', systemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return {
      setTheme: (newTheme: 'light' | 'dark' | 'system') => {
        localStorage.setItem('theme', newTheme);
        const resolvedTheme =
          newTheme === 'system' ? (mediaQuery.matches ? 'dark' : 'light') : newTheme;
        document.documentElement.setAttribute('data-theme', resolvedTheme);
      },
      cleanup: () => {
        mediaQuery.removeEventListener('change', handleChange);
      },
    };
  },
} as const;
