import { useEffect, useRef, useState } from 'react'

export interface UseScrollTriggerOptions {
  /** Threshold value (0-1) for when to trigger */
  threshold?: number
  /** Margin around the root element */
  rootMargin?: string
  /** Whether to trigger only once */
  triggerOnce?: boolean
}

export interface UseScrollTriggerReturn {
  /** Whether the element is in view */
  isInView: boolean
  /** Ref to attach to the element */
  ref: React.RefObject<HTMLElement | null>
}

/**
 * Custom hook that uses Intersection Observer API to trigger animations
 * when elements scroll into view.
 *
 * @param options - Configuration options for the intersection observer
 * @returns Object containing isInView state and ref
 *
 * @example
 * ```tsx
 * const { isInView, ref } = useScrollTrigger({ threshold: 0.1, triggerOnce: true })
 * return <div ref={ref} className={isInView ? 'animate-fade-in-up' : ''}>Content</div>
 * ```
 */
export function useScrollTrigger(
  options: UseScrollTriggerOptions = {}
): UseScrollTriggerReturn {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = false } = options

  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, rootMargin, triggerOnce])

  return { isInView, ref }
}
