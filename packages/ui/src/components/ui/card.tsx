import * as React from "react"

import { cn } from "#lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  lift?: boolean
  variant?: "default" | "gradient-primary" | "gradient-accent"
  innerShadow?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, lift = false, variant = "default", innerShadow = false, children, ...props }, ref) => {
    const gradientStyles: Record<string, React.CSSProperties> = {
      "gradient-primary": {
        background: "linear-gradient(135deg, oklch(0.65 0.24 264), oklch(0.68 0.25 320))",
      },
      "gradient-accent": {
        background: "linear-gradient(135deg, oklch(0.68 0.25 320), oklch(0.70 0.22 200))",
      },
    }

    const innerShadowStyle: React.CSSProperties = {
      boxShadow: innerShadow ? "inset 0 2px 4px rgba(0, 0, 0, 0.06)" : undefined,
    }

    const isGradient = variant !== "default"

    if (isGradient) {
      return (
        <div
          ref={ref}
          className={cn(
            "rounded-lg p-[1px] shadow-sm transition-all duration-300 ease-out hover:shadow-md",
            lift && "hover:-translate-y-1 hover:shadow-lg",
            "motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none motion-reduce:transition-none",
            className
          )}
          style={gradientStyles[variant]}
          {...props}
        >
          <div
            className={cn(
              "rounded-lg border bg-card text-card-foreground shadow-none h-full w-full transition-all duration-300 ease-out",
              "border-transparent hover:brightness-[1.02]"
            )}
            style={innerShadowStyle}
          >
            {children}
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 ease-out hover:border-primary/20 hover:brightness-[1.02] hover:shadow-md",
          lift && "hover:-translate-y-1 hover:shadow-lg",
          "motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none motion-reduce:transition-none",
          className
        )}
        style={innerShadowStyle}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
