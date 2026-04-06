import { cn } from '../../utils/cn';
import type { ButtonProps } from './Button';
import type { AnchorHTMLAttributes } from 'react';

export interface ServerButtonProps extends Omit<ButtonProps, 'onClick'> {
  href?: string;
  target?: string;
}

export function ServerButton({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  href,
  target,
  ...props
}: ServerButtonProps) {
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
    disabled && 'opacity-50 cursor-not-allowed',
    className
  );

  // Filter props for anchor element
  const anchorProps: AnchorHTMLAttributes<HTMLAnchorElement> = {};
  const allowedAnchorProps = [
    'download', 'hrefLang', 'media', 'ping', 'rel', 'target', 'type',
    'referrerPolicy', 'onBlur', 'onClick', 'onFocus', 'onMouseDown', 'onMouseUp',
    'onKeyDown', 'onKeyUp', 'onKeyPress', 'aria-label', 'aria-describedby', 'title'
  ];

  allowedAnchorProps.forEach(prop => {
    if (prop in props) {
      (anchorProps as any)[prop] = (props as any)[prop];
    }
  });

  if (href) {
    return (
      <a href={href} target={target} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
