/**
 * Classname utility function
 * Combines clsx and tailwind-merge for optimal class handling
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge classnames with tailwind-merge and clsx
 * This ensures proper Tailwind class precedence and removes conflicts
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Create a component classname factory
 * Useful for creating consistent class naming patterns
 */
export function createClassFactory(base: string) {
  return (...modifiers: (string | undefined | null | false)[]) => {
    return cn(base, ...modifiers.filter(Boolean));
  };
}

/**
 * Create a variant classname factory
 * Useful for component variants with different states
 */
export function createVariantFactory<T extends Record<string, string>>(variants: T) {
  return (variant: keyof T, ...additional: ClassValue[]) => {
    return cn(variants[variant], ...additional);
  };
}

/**
 * Conditional classname helper
 * Returns classname if condition is true
 */
export function conditionalClass(condition: boolean, className: string): string {
  return condition ? className : '';
}

/**
 * Responsive classname helper
 * Applies different classes at different breakpoints
 */
export function responsiveClass(
  base: string,
  responsive: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  }
) {
  const classes = [base];

  Object.entries(responsive).forEach(([breakpoint, className]) => {
    if (className) {
      classes.push(`${breakpoint}:${className}`);
    }
  });

  return cn(classes);
}

/**
 * Theme-aware classname helper
 * Applies different classes for light/dark themes
 */
export function themeClass(light: string, dark: string): string {
  return cn(light, `dark:${dark}`);
}
