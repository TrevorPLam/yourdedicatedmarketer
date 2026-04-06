import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const inputVariants = cva(
  'flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-input',
        error: 'border-destructive focus-visible:ring-destructive',
        success: 'border-success focus-visible:ring-success',
      },
      inputSize: {
        sm: 'h-8 px-2 text-xs',
        md: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
  /**
   * Label for the input
   */
  label?: string;
  /**
   * Helper text to display below the input
   */
  helperText?: string;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Show success state
   */
  success?: boolean;
  /**
   * Left icon or element
   */
  leftIcon?: React.ReactNode;
  /**
   * Right icon or element
   */
  rightIcon?: React.ReactNode;
  /**
   * Ref to the input element
   */
  ref?: React.Ref<HTMLInputElement>;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      inputSize,
      label,
      helperText,
      error,
      success,
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${React.useId()}`;
    const hasError = !!error;
    const hasSuccess = success && !hasError;

    // Determine variant based on error/success state
    const finalVariant = hasError ? 'error' : hasSuccess ? 'success' : variant;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            className={cn(
              inputVariants({ variant: finalVariant, inputSize }),
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              className
            )}
            ref={ref}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={helperText || error ? `${inputId}-description` : undefined}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>

        {(helperText || error) && (
          <p
            id={`${inputId}-description`}
            className={cn('text-xs', hasError ? 'text-destructive' : 'text-muted-foreground')}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
