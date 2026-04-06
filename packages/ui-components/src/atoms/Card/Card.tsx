import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const cardVariants = cva('rounded-lg border bg-card text-card-foreground shadow-sm', {
  variants: {
    variant: {
      default: 'border-border',
      elevated: 'shadow-md border-border/50',
      outlined: 'border-2 border-border',
      ghost: 'border-transparent bg-transparent shadow-none',
    },
    padding: {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    },
    interactive: {
      true: 'cursor-pointer transition-all duration-200 hover:shadow-md hover:border-border/80 active:scale-[0.98]',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
    interactive: false,
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  /**
   * Card title
   */
  title?: string;
  /**
   * Card description
   */
  description?: string;
  /**
   * Card footer content
   */
  footer?: React.ReactNode;
  /**
   * Card header actions
   */
  actions?: React.ReactNode;
  /**
   * Show card header divider
   */
  showDivider?: boolean;
  /**
   * Ref to the card element
   */
  ref?: React.Ref<HTMLDivElement>;
}

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string;
    description?: string;
    actions?: React.ReactNode;
    showDivider?: boolean;
  }
>(({ className, title, description, actions, showDivider = false, children, ...props }, ref) => {
  if (!title && !description && !actions && !children) return null;

  return (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', showDivider && 'border-b', className)}
      {...props}
    >
      <div className="flex items-center justify-between space-y-0">
        <div className="space-y-1">
          {title && <h3 className="text-lg font-semibold leading-none tracking-tight">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
);

CardFooter.displayName = 'CardFooter';

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      padding,
      interactive,
      title,
      description,
      footer,
      actions,
      showDivider = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, interactive }), className)}
        {...props}
      >
        {(title || description || actions) && (
          <CardHeader
            {...(title && { title })}
            {...(description && { description })}
            {...(actions && { actions })}
            showDivider={showDivider}
          />
        )}
        {children && <CardContent>{children}</CardContent>}
        {footer && <CardFooter>{footer}</CardFooter>}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { CardHeader, CardContent, CardFooter };
