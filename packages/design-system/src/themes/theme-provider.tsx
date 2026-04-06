/**
 * React Theme Provider for Design System
 * Provides theme switching functionality with system preference detection
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
  storageKey = 'agency-theme',
}) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme;
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      setThemeState(stored);
    }
  }, [storageKey]);

  // Resolve actual theme (system -> light/dark)
  useEffect(() => {
    const resolveTheme = () => {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return theme;
    };

    setResolvedTheme(resolveTheme());

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Apply theme to DOM
  useEffect(() => {
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');

    // Add current theme class
    root.classList.add(resolvedTheme);

    // Set data-theme attribute for CSS targeting
    root.setAttribute('data-theme', resolvedTheme);

    // Set color-scheme
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(storageKey, newTheme);
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Theme toggle component
export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return '🌙';
      case 'dark':
        return '☀️';
      case 'system':
        return '💻';
      default:
        return '💻';
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Switch to dark mode';
      case 'dark':
        return 'Switch to system mode';
      case 'system':
        return 'Switch to light mode';
      default:
        return 'Switch theme';
    }
  };

  return (
    <button onClick={toggleTheme} className={className} title={getLabel()} aria-label={getLabel()}>
      <span className="text-xl">{getIcon()}</span>
    </button>
  );
};

// Theme-aware hook for CSS variables
export const useThemeVariable = (variable: string) => {
  const { resolvedTheme } = useTheme();

  return React.useMemo(() => {
    if (typeof window === 'undefined') return '';

    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    return computedStyle.getPropertyValue(variable).trim();
  }, [resolvedTheme, variable]);
};

// Theme-aware hook for color tokens
export const useColorToken = (token: string) => {
  const colorVar = `--color-${token}`;
  return useThemeVariable(colorVar);
};
