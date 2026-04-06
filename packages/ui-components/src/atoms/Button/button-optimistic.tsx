// React 19.2 Client Component Button with Optimistic Updates
// Uses React 19.2's new concurrent features

'use client';

import { useState, useOptimistic } from 'react';
import { cn } from '../../utils/cn';
import type { ButtonProps } from './Button';

export interface OptimisticButtonProps extends ButtonProps {
  onAction?: () => Promise<void>;
  optimisticLabel?: string;
}

export function useButtonOptimistic(initialState: boolean) {
  const [optimisticState, addOptimistic] = useOptimistic(
    initialState,
    (_, newState: boolean) => newState
  );

  return [optimisticState, addOptimistic] as const;
}

export function OptimisticButton({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  onAction,
  optimisticLabel,
  ...props
}: OptimisticButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOptimistic, addOptimistic] = useButtonOptimistic(false);

  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    default: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    link: 'text-blue-600 hover:text-blue-800 focus:ring-blue-500',
    ghost: 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:ring-gray-500',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    icon: 'p-2',
    'icon-sm': 'p-1.5',
    'icon-lg': 'p-3',
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant || 'default'],
    sizeClasses[size || 'md'],
    (disabled || isLoading || isOptimistic) && 'opacity-50 cursor-not-allowed',
    className
  );

  const handleClick = async () => {
    if (!onAction || disabled || isLoading || isOptimistic) return;

    addOptimistic(true);
    setIsLoading(true);

    try {
      await onAction();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
      // Note: optimistic state will be resolved when the server state updates
    }
  };

  return (
    <button
      className={classes}
      disabled={disabled || isLoading || isOptimistic}
      onClick={handleClick}
      {...props}
    >
      {isOptimistic && optimisticLabel ? optimisticLabel : children}
    </button>
  );
}
