'use client';

import * as React from 'react';

export interface NavLinkProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  href?: string;
  className?: string;
  activeClassName?: string;
  isActive?: boolean;
}

const NavLink = React.forwardRef<HTMLElement, NavLinkProps>(
  ({ children, className, activeClassName = 'text-primary font-semibold', isActive = false, ...props }, ref) => {
    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        className={className}
        aria-current={isActive ? 'page' : undefined}
        {...props}
      >
        {typeof children === 'string' ? (
          <span className={isActive ? activeClassName : undefined}>{children}</span>
        ) : (
          children
        )}
      </span>
    );
  }
);

NavLink.displayName = 'NavLink';

export { NavLink };
