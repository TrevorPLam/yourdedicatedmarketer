/**
 * Button component with variants and accessibility
 * Built with class-variance-authority for consistent styling
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

// Enhanced button variants with better typing
const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

// Enhanced button props with better typing
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, 
    VariantProps<typeof buttonVariants> {
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Loading text (shows when loading is true)
   */
  loadingText?: string;
  /**
   * Icon to display
   */
  icon?: React.ReactNode;
  /**
   * Icon position
   */
  iconPosition?: 'left' | 'right';
  /**
   * Button type for better semantic meaning
   */
  buttonType?: 'button' | 'submit' | 'reset';
  /**
   * Accessibility label for icon-only buttons
   */
  ariaLabel?: string;
}

/**
 * Button component with consistent styling and accessibility
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading = false,
      loadingText,
      icon,
      iconPosition = 'left',
      buttonType = 'button',
      ariaLabel,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        ref={ref}
        type={buttonType}
        disabled={isDisabled}
        aria-disabled={isDisabled ? 'true' : 'false'}
        aria-busy={loading ? 'true' : 'false'}
        aria-label={ariaLabel || (icon && !children ? 'Button action' : undefined)}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
            role="status"
            aria-label="Loading"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Icon on the left */}
        {icon && iconPosition === 'left' && !loading && (
          <span className="mr-2" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Button content */}
        <span className="truncate">
          {loading && loadingText ? loadingText : children}
        </span>

        {/* Icon on the right */}
        {icon && iconPosition === 'right' && !loading && (
          <span className="ml-2" aria-hidden="true">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
