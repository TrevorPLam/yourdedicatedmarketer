import * as React from 'react'
import { cn } from '@repo/ui/lib/utils'

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns this card spans */
  colSpan?: number
  /** Number of rows this card spans */
  rowSpan?: number
  /** Card variant for different visual styles */
  variant?: 'default' | 'glass' | 'gradient' | 'outline'
  /** Hover animation effect */
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'none'
}

/**
 * BentoCard component for individual items in a bento grid.
 * Supports glassmorphism, gradients, and hover animations.
 *
 * @example
 * ```tsx
 * <BentoCard colSpan={2} rowSpan={2} variant="glass" hoverEffect="lift">
 *   Content
 * </BentoCard>
 * ```
 */
export function BentoCard({
  className,
  colSpan = 1,
  rowSpan = 1,
  variant = 'default',
  hoverEffect = 'none',
  children,
  ...props
}: BentoCardProps) {
  const cardStyle: React.CSSProperties = {
    gridColumn: `span ${colSpan}`,
    gridRow: `span ${rowSpan}`,
  }

  const variantStyles = {
    default: 'bg-card border border-border',
    glass: 'bg-card/50 backdrop-blur-md border border-border/50',
    gradient: 'bg-gradient-to-br from-primary/20 to-accent/20 border border-border',
    outline: 'bg-transparent border-2 border-border',
  }

  const hoverStyles = {
    lift: 'hover:-translate-y-1 hover:shadow-lg transition-transform duration-300',
    glow: 'hover:shadow-lg hover:shadow-primary/20 transition-shadow duration-300',
    scale: 'hover:scale-105 transition-transform duration-300',
    none: '',
  }

  return (
    <div
      className={cn(
        'rounded-lg p-6 overflow-hidden',
        variantStyles[variant],
        hoverStyles[hoverEffect],
        className
      )}
      style={{ ...cardStyle, contain: 'layout style paint' }}
      role="gridcell"
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  )
}
