import * as React from "react"
import { cn } from "#lib/utils"

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div'
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, as = 'section', ...props }, ref) => {
    if (as === 'div') {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={cn('py-12 md:py-20', className)}
          {...props}
        />
      )
    }
    return (
      <section
        ref={ref as React.Ref<HTMLElement>}
        className={cn('py-12 md:py-20', className)}
        {...props}
      />
    )
  }
)
Section.displayName = "Section"

export { Section }
