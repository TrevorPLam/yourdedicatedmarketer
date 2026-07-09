import * as React from 'react'
import { cn } from '@repo/ui/lib/utils'

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns in the grid, or 'auto' for auto-fit */
  columns?: number | 'auto'
  /** Gap between grid items */
  gap?: string
  /** Minimum width for auto-fit columns */
  minWidth?: string
  /** Enable dense packing to fill gaps */
  dense?: boolean
  /** Auto-rows height */
  autoRows?: string
}

/**
 * BentoGrid component for creating asymmetric, bento-style layouts using CSS Grid.
 * Supports responsive design with auto-fit columns and flexible spacing.
 *
 * @example
 * ```tsx
 * <BentoGrid columns={4} gap="1rem" dense>
 *   <BentoCard colSpan={2} rowSpan={2}>Content</BentoCard>
 *   <BentoCard>Content</BentoCard>
 * </BentoGrid>
 * ```
 */
export function BentoGrid({
  className,
  columns = 4,
  gap = '1rem',
  minWidth = '250px',
  dense = false,
  autoRows = 'auto',
  ...props
}: BentoGridProps) {
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: columns === 'auto' 
      ? `repeat(auto-fit, minmax(${minWidth}, 1fr))`
      : `repeat(${columns}, 1fr)`,
    gap,
    gridAutoRows: autoRows,
    gridAutoFlow: dense ? 'dense' : 'row',
  }

  return (
    <div
      className={cn('w-full', className)}
      style={gridStyle}
      role="grid"
      aria-label="Bento grid layout"
      {...props}
    />
  )
}
