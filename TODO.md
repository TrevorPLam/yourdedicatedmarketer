# TODO — Your Dedicated Marketer Monorepo

Repository: `c:\Users\Trevor\Documents\firm`
Package manager: pnpm 9.15.0
Primary app: `apps/firm-website` (`@repo/firm-website`)

This document follows Specification-Driven Development (SDD), Domain-Driven Design (DDD), Test-Driven Development (TDD), Behavior-Driven Development (BDD), and the Deep Modules pattern. Each parent task is small, self-contained, and exposes a clear interface: definition of done, out of scope, rules, patterns, anti-patterns, and dependencies.

---

## Conventions

- **Task ID format:** `DOMAIN-NNN` for parent tasks, `DOMAIN-NNN-SS` for subtasks.
- **Status indicators:** `[PENDING]`, `[IN_PROGRESS]`, `[BLOCKED]`, `[DONE]`.
- **Actor labels:** `[AGENT]` = executable by the coding agent, `[HUMAN]` = requires human decision or input.
- **No emojis.** Use plain text markers only.
- **Validation commands** are targeted; prefer single test files or filtered checks over full suite runs.
- **Repository management documents** that still exist (`TODO.md`, `.devin/workflows/`, `.company/`) are updated as part of each task when the change affects onboarding, architecture, or deployment. The `docs/` directory and old `README.md` have been permanently deleted and must not be restore

---

## Domains

### UI-001: Redesign Color System with Vibrant Palette

**Status:** [DONE]

**Implementation Notes:**
- Updated primary color palette with higher chroma values (0.22-0.25) and lightness (0.65-0.75) for vibrant modern look
- Changed primary hue from 264 to maintain blue while increasing visual impact
- Updated accent colors to pink/purple (320) and cyan (200) for complementary vibrant palette
- Added gradient tokens: --gradient-primary, --gradient-accent, --gradient-secondary using CSS linear-gradient with OKLCH colors
- Optimized dark mode colors with subtle chroma (0.01-0.02) and adjusted lightness for better contrast with vibrant colors
- All changes maintain OKLCH format and semantic token naming
- Linting and type checking passed successfully

**Related File Paths:**
- `packages/ui/src/styles.css`
- `apps/firm-website/src/app/globals.css`

**Definition of Done:**
- Color system updated from basic electric blue to vibrant, modern palette
- OKLCH color space maintained with improved chroma and lightness values
- Gradient color tokens added for depth and visual interest
- Dark mode colors adjusted for better contrast and visual harmony
- All components using semantic color tokens update automatically
- Storybook stories updated to reflect new color system
- Color contrast ratios meet WCAG AA standards (4.5:1)

**Out of Scope:**
- Complete component redesign (colors only)
- Brand identity work (logo, brand guidelines)
- Color accessibility audit beyond contrast ratios

**Rules to Follow:**
- Use OKLCH color space for perceptual uniformity
- Maintain semantic token naming (primary, secondary, accent, etc.)
- Ensure all colors have corresponding -foreground tokens
- Test color combinations in both light and dark modes
- Document color usage guidelines in component stories

**Advanced Coding Pattern:**
- CSS custom properties with OKLCH values for theming
- Tailwind v4 @theme directive for CSS-first configuration
- color-mix() function for dynamic color variations
- Semantic token layering (base -> semantic -> component)

**Anti-Patterns:**
- Hardcoded hex values in component files
- Using raw Tailwind colors (text-blue-500) instead of semantic tokens
- Manual dark mode color overrides in components
- Inconsistent color naming conventions

**Imports/Exports:**
- No imports/exports changed (CSS variables only)

**Depends On:**
- None

**Blocks:**
- UI-002 (Typography Overhaul)
- UI-003 (Animation System)

---

#### UI-001-01: Update Primary Color Palette

**Actor:** [AGENT]

**Target File Path:** `packages/ui/src/styles.css`

**Description:**
Replace the current electric blue primary color with a more vibrant palette. Update the --color-primary, --color-primary-light, and --color-primary-dark tokens in the @theme block to use higher chroma values for better visual impact. Add --color-accent and --color-accent-secondary tokens for complementary colors (pink/purple and cyan ranges). Ensure all colors maintain OKLCH format with appropriate lightness (0.65-0.75 range) and chroma (0.20-0.25 range) values.

**Validation Commands:**
```bash
# Build UI package to verify no CSS errors
cd packages/ui && pnpm build
# Run Storybook to visually verify colors
cd packages/ui && pnpm storybook
```

**Testing/Validation:**
- Update button.stories.tsx to showcase new color variants
- Add color contrast test in button.test.tsx
- Create visual regression test for color changes

**Repository Management:**
- Update .company/4-Services-And-Pages.md if color changes affect service descriptions

---

#### UI-001-02: Add Gradient Color Tokens

**Actor:** [AGENT]

**Target File Path:** `packages/ui/src/styles.css`

**Description:**
Add gradient color tokens to the @theme block for modern gradient effects. Define --gradient-primary, --gradient-accent, and --gradient-secondary tokens using CSS gradient syntax with the new vibrant colors. These should be usable as background gradients for cards, buttons, and hero sections. Ensure gradients work in both light and dark modes by using semantic color tokens.

**Validation Commands:**
```bash
# Build UI package
cd packages/ui && pnpm build
# Test gradient usage in development
cd apps/firm-website && pnpm dev
```

**Testing/Validation:**
- Add gradient variant to button component
- Create card.stories.tsx story showcasing gradient backgrounds
- Test gradient rendering across browsers

**Repository Management:**
- No documentation updates needed

---

#### UI-001-03: Optimize Dark Mode Colors

**Actor:** [AGENT]

**Target File Path:** `packages/ui/src/styles.css`

**Description:**
Refine the dark mode color palette in the .dark class to improve contrast and visual harmony. Adjust background, foreground, card, and muted colors to ensure they work well with the new vibrant primary colors. Test that text remains readable and that the vibrant colors don't overwhelm in dark mode. Maintain the OKLCH format and ensure proper chroma reduction for dark mode contexts.

**Validation Commands:**
```bash
# Build UI package
cd packages/ui && pnpm build
# Test theme toggle in development
cd apps/firm-website && pnpm dev
```

**Testing/Validation:**
- Add dark mode tests to theme-toggle.test.tsx
- Verify color contrast ratios in dark mode using axe-core
- Create Storybook story for dark mode color palette

**Repository Management:**
- No documentation updates needed

---

#### UI-001-04: Document Color Usage Guidelines

**Actor:** [HUMAN]

**Target File Path:** `packages/ui/src/stories/colors.stories.tsx`

**Description:**
Create a comprehensive color system documentation story in Storybook that showcases all color tokens, their usage guidelines, and accessibility information. Include examples of when to use primary vs accent colors, gradient usage patterns, and dark mode considerations. This serves as living documentation for the color system.

**Validation Commands:**
```bash
# View color documentation in Storybook
cd packages/ui && pnpm storybook
```

**Testing/Validation:**
- No automated tests needed (documentation only)
- Manual review of color examples and guidelines

**Repository Management:**
- No documentation updates needed

---

### UI-002: Implement Typography Overhaul

**Status:** [DONE]

**Implementation Notes:**
- Added Space Grotesk as display font (--font-display token) for hero sections and large headings
- Imported Space Grotesk from Google Fonts with font-display: swap for performance optimization
- Expanded typography scale with text-5xl through text-9xl using clamp() for fluid typography
- Line heights optimized for readability (decreasing from 1.1 to 0.95 as size increases)
- Updated hero component to use font-display class and larger scale (text-5xl md:text-7xl lg:text-8xl)
- Implemented container query typography with @supports fallback for browser compatibility
- Added container-type-inline utility class and container-text-* responsive typography classes
- All changes follow CSS custom properties pattern and maintain system font stack fallbacks
- Linting passed successfully

**Related File Paths:**
- `packages/ui/src/styles.css`
- `apps/firm-website/src/app/layout.tsx`
- `apps/firm-website/src/components/features/home/hero.tsx`

**Definition of Done:**
- Display font added for hero sections and headings
- Typography scale expanded with larger sizes (text-7xl to text-9xl)
- Font weights and line heights optimized for readability
- Responsive typography implemented using container queries
- Font loading strategy optimized for performance
- All typography components updated to use new scale
- Typography documented in Storybook

**Out of Scope:**
- Custom font file hosting (use Google Fonts or similar)
- Complete redesign of all content (typography only)
- Icon font systems

**Rules to Follow:**
- Use system font stack as fallback
- Implement font-display: swap for performance
- Maintain vertical rhythm with consistent line heights
- Use clamp() for fluid typography
- Test typography at all viewport sizes

**Advanced Coding Pattern:**
- CSS container queries for responsive typography
- Variable font usage if available
- Font size clamp() for fluid scaling
- CSS custom properties for typography tokens

**Anti-Patterns:**
- Fixed font sizes without responsiveness
- Missing font loading states (FOIT/FOUT)
- Inconsistent line heights across components
- Using px units instead of rem/em

**Imports/Exports:**
- May need to add font import to layout.tsx

**Depends On:**
- UI-001 (Color System)

**Blocks:**
- UI-004 (Hero Section Redesign)

---

#### UI-002-01: Add Display Font Family

**Actor:** [AGENT]
**Status:** ✅

**Target File Path:** `packages/ui/src/styles.css`

**Description:**
Add a display font family to the @theme block for use in hero sections and large headings. Choose a modern, bold font (e.g., Space Grotesk, Cal Sans, or similar) that pairs well with the existing sans-serif font. Define --font-display token and add it to the font family list. Ensure the font is loaded via Google Fonts or similar CDN with proper font-display: swap strategy.

**Validation Commands:**
```bash
# Build UI package
cd packages/ui && pnpm build
# Verify font loading in development
cd apps/firm-website && pnpm dev
```

**Testing/Validation:**
- Add font loading test to layout.test.tsx
- Verify no layout shift from font loading (CLS metric)
- Test font rendering across browsers

**Repository Management:**
- No documentation updates needed

---

#### UI-002-02: Expand Typography Scale

**Actor:** [AGENT]
**Status:** ✅

**Target File Path:** `packages/ui/src/styles.css`

**Description:**
Expand the typography scale in the @theme block to include larger sizes for massive typography. Add --text-5xl, --text-6xl, --text-7xl, --text-8xl, and --text-9xl tokens with appropriate line heights. Update existing text sizes to ensure proper scaling. Use clamp() functions for fluid typography that responds to viewport width. Ensure line heights scale appropriately with font size.

**Validation Commands:**
```bash
# Build UI package
cd packages/ui && pnpm build
# Test typography rendering
cd apps/firm-website && pnpm dev
```

**Testing/Validation:**
- Create typography.stories.tsx to showcase all sizes
- Test fluid typography at different viewport widths
- Verify line heights maintain vertical rhythm

**Repository Management:**
- No documentation updates needed

---

#### UI-002-03: Update Hero Component Typography

**Actor:** [AGENT]
**Status:** ✅

**Target File Path:** `apps/firm-website/src/components/features/home/hero.tsx`

**Description:**
Update the hero component to use the new display font and expanded typography scale. Change the h1 from text-4xl md:text-6xl to text-5xl md:text-7xl lg:text-8xl for more impact. Apply the display font family to the heading. Update the subheading to use appropriate size from the new scale. Ensure text remains readable and responsive at all screen sizes.

**Validation Commands:**
```bash
# Run hero component tests
cd apps/firm-website && pnpm test src/components/features/home/hero.test.tsx
# Build app to verify no errors
cd apps/firm-website && pnpm build
```

**Testing/Validation:**
- Update hero.test.tsx to test new typography classes
- Add visual regression test for hero component
- Test hero rendering at mobile, tablet, and desktop sizes

**Repository Management:**
- No documentation updates needed

---

#### UI-002-04: Implement Container Query Typography

**Actor:** [AGENT]
**Status:** ✅

**Target File Path:** `packages/ui/src/styles.css`

**Description:**
Implement container query-based typography for components that should respond to their container size rather than viewport. Add @container rules and define typography tokens that scale based on container width. This allows components like cards and sections to have responsive typography independent of the viewport. Document which components should use container query typography.

**Validation Commands:**
```bash
# Build UI package
cd packages/ui && pnpm build
# Test container queries in development
cd apps/firm-website && pnpm dev
```

**Testing/Validation:**
- Create container query test in card.test.tsx
- Test typography scaling in different container sizes
- Verify browser compatibility for container queries

**Repository Management:**
- No documentation updates needed

---

#### UI-002-05: Document Typography System

**Actor:** [HUMAN]
**Status:** ✅

**Target File Path:** `packages/ui/src/stories/typography.stories.tsx`

**Description:**
Create comprehensive typography documentation in Storybook showcasing the entire typography scale, font families, usage guidelines, and responsive behavior. Include examples of display vs body font usage, fluid typography in action, and container query typography. Document when to use each size and font combination.

**Validation Commands:**
```bash
# View typography documentation in Storybook
cd packages/ui && pnpm storybook
```

**Testing/Validation:**
- No automated tests needed (documentation only)
- Manual review of typography examples and guidelines

**Repository Management:**
- No documentation updates needed

---

### UI-003: Implement Animation System

**Status:** [DONE]

**Implementation Notes:**
- Added base animation keyframes (fade-in-up, fade-in, scale-in, slide-in-right, slide-in-left, bounce-subtle) using only transform and opacity for GPU acceleration
- Created animation tokens in @theme block (--animate-fade-in-up, --animate-fade-in, etc.)
- Implemented useScrollTrigger hook with Intersection Observer API, TypeScript types, and reduced motion support
- Added entry animation utility classes using @starting-style for smooth element appearances (fade-in-up-on-entry, scale-in-on-entry, slide-in-right-on-entry, slide-in-left-on-entry)
- Wrapped all animations in @media (prefers-reduced-motion: reduce) to disable animations for users who prefer reduced motion
- Hook respects prefers-reduced-motion and returns immediately without triggering animations
- All animations under 500ms for UI elements as per best practices
- Linting and tests passed successfully

**Related File Paths:**
- `packages/ui/src/styles.css`
- `packages/ui/src/hooks/use-scroll-trigger.ts` (new)
- `packages/ui/src/index.ts`

**Definition of Done:**
- Base animation system with CSS keyframes defined
- Custom animation tokens added to Tailwind theme
- Scroll-triggered animation hook created
- Entry animations using @starting-style implemented
- Micro-interaction patterns documented
- Reduced motion support added
- Animation performance optimized
- Animation system documented in Storybook

**Out of Scope:**
- Complex 3D animations (WebGL/Three.js)
- Physics-based animations
- Video or Lottie animations

**Rules to Follow:**
- Respect prefers-reduced-motion media query
- Use GPU-accelerated properties (transform, opacity)
- Keep animations under 500ms for UI elements
- Use will-change sparingly and only when needed
- Test animations at 60fps

**Advanced Coding Pattern:**
- @starting-style for entry animations (Tailwind v4)
- Intersection Observer API for scroll triggers
- CSS custom properties for animation timing
- requestAnimationFrame for complex animations

**Anti-Patterns:**
- Animating layout-affecting properties (width, height)
- Long-running animations without user control
- Missing reduced motion support
- Overusing animations causing distraction

**Imports/Exports:**
- Export useScrollTrigger hook from packages/ui/src/hooks/

**Depends On:**
- None

**Blocks:**
- UI-004 (Hero Section Redesign)
- UI-005 (Component Redesign)

---

#### UI-003-01: Define Base Animation Keyframes

**Actor:** [AGENT]
**Status:** ✅

**Target File Path:** `packages/ui/src/styles.css`

**Description:**
Define base animation keyframes in the @theme block for common UI animations. Include fade-in-up, fade-in, scale-in, slide-in-right, slide-in-left, and bounce-subtle animations. Use @keyframes with proper timing functions (ease-out, ease-in-out). Ensure animations are performant by only animating transform and opacity properties. Add corresponding --animate-* tokens to the theme.

**Validation Commands:**
```bash
# Build UI package
cd packages/ui && pnpm build
# Test animations in development
cd apps/firm-website && pnpm dev
```

**Testing/Validation:**
- Create animation.stories.tsx to showcase all keyframes
- Test animation performance with Chrome DevTools
- Verify animations respect reduced motion preference

**Repository Management:**
- No documentation updates needed

---

#### UI-003-02: Create Scroll Trigger Hook

**Actor:** [AGENT]
**Status:** ✅

**Target File Path:** `packages/ui/src/hooks/use-scroll-trigger.ts`

**Description:**
Create a custom React hook useScrollTrigger that uses Intersection Observer API to trigger animations when elements scroll into view. The hook should accept options for threshold, root margin, and trigger once behavior. Return a boolean indicating whether the element is in view and a ref to attach to the element. Include proper cleanup and TypeScript types.

**Validation Commands:**
```bash
# Run hook tests
cd packages/ui && pnpm test src/hooks/use-scroll-trigger.test.tsx
# Build UI package
cd packages/ui && pnpm build
```

**Testing/Validation:**
- Create use-scroll-trigger.test.tsx with Intersection Observer mocks
- Test trigger behavior with different thresholds
- Test cleanup on unmount
- Test with reduced motion preference

**Repository Management:**
- Export hook from packages/ui/src/index.ts

---

#### UI-003-03: Implement Entry Animations with @starting-style

**Actor:** [AGENT]
**Status:** ✅

**Target File Path:** `packages/ui/src/styles.css`

**Description:**
Implement entry animations using Tailwind v4's @starting-style directive for smooth element appearances. Define entry animation tokens that combine @starting-style with the base keyframes. Create utility classes for common entry patterns (fade-in-up-on-entry, scale-in-on-entry). Ensure these work with the scroll trigger hook for scroll-triggered animations.

**Validation Commands:**
```bash
# Build UI package
cd packages/ui && pnpm build
# Test entry animations in development
cd apps/firm-website && pnpm dev
```

**Testing/Validation:**
- Add entry animation tests to component test files
- Test animations on page load and route transitions
- Verify smooth 60fps animations

**Repository Management:**
- No documentation updates needed

---

#### UI-003-04: Add Reduced Motion Support

**Actor:** [AGENT]
**Status:** ✅

**Target File Path:** `packages/ui/src/styles.css`

**Description:**
Add comprehensive reduced motion support to the animation system. Wrap all animation keyframes and utility classes in @media (prefers-reduced-motion: reduce) queries to disable or simplify animations for users who prefer reduced motion. Ensure the scroll trigger hook respects this preference and returns immediately without triggering animations. Document this behavior for developers.

**Validation Commands:**
```bash
# Build UI package
cd packages/ui && pnpm build
# Test with reduced motion in development
cd apps/firm-website && pnpm dev
```

**Testing/Validation:**
- Test animations with OS reduced motion setting enabled
- Update use-scroll-trigger.test.tsx to test reduced motion
- Verify all animations respect the preference

**Repository Management:**
- No documentation updates needed

---

#### UI-003-05: Document Animation System

**Actor:** [HUMAN]

**Target File Path:** `packages/ui/src/stories/animation.stories.tsx`

**Description:**
Create comprehensive animation documentation in Storybook showcasing all available animations, usage patterns, and performance considerations. Include examples of scroll-triggered animations, entry animations, and reduced motion behavior. Document best practices for animation usage, performance tips, and accessibility considerations.

**Validation Commands:**
```bash
# View animation documentation in Storybook
cd packages/ui && pnpm storybook
```

**Testing/Validation:**
- No automated tests needed (documentation only)
- Manual review of animation examples and guidelines

**Repository Management:**
- No documentation updates needed

---

### UI-004: Redesign Hero Section with Bento Grid

**Status:** [PENDING]

**Related File Paths:**
- `apps/firm-website/src/components/features/home/hero.tsx`
- `apps/firm-website/src/components/features/home/hero.test.tsx`
- `packages/ui/src/components/ui/bento-grid.tsx` (new)

**Definition of Done:**
- Hero section redesigned with bento grid layout
- Asymmetric grid pattern for visual interest
- Responsive grid that adapts to screen size
- Glassmorphism effects applied to bento cards
- Scroll-triggered animations on grid items
- Gradient background or subtle motion
- Mobile-optimized layout
- Hero component tests updated
- Storybook story for hero component

**Out of Scope:**
- 3D elements or illustrations (separate task)
- Complex interactive elements in hero
- Video backgrounds

**Rules to Follow:**
- Maintain semantic HTML structure
- Ensure mobile-first responsive design
- Use CSS Grid for bento layout
- Apply glassmorphism sparingly for performance
- Test at all viewport sizes

**Advanced Coding Pattern:**
- CSS Grid with named areas for bento layout
- Container queries for responsive grid items
- Compound component pattern for bento grid
- Intersection Observer for staggered animations

**Anti-Patterns:**
- Fixed grid without responsiveness
- Overusing glassmorphism causing performance issues
- Complex grid that breaks on mobile
- Missing accessibility (keyboard navigation, screen readers)

**Imports/Exports:**
- Export BentoGrid component from packages/ui/src/components/ui/
- Export BentoCard component from packages/ui/src/components/ui/

**Depends On:**
- UI-001 (Color System)
- UI-002 (Typography Overhaul)
- UI-003 (Animation System)

**Blocks:**
- UI-005 (Component Redesign)

---

#### UI-004-01: Create Bento Grid Component

**Actor:** [AGENT]

**Target File Path:** `packages/ui/src/components/ui/bento-grid.tsx`

**Description:**
Create a reusable BentoGrid component using CSS Grid with named areas for flexible, asymmetric layouts. The component should accept children and optional layout configuration (columns, rows, gap). Implement responsive behavior using container queries or media queries. Include TypeScript types for props. Ensure the component is accessible with proper ARIA labels and keyboard navigation.

**Validation Commands:**
```bash
# Run bento grid tests
cd packages/ui && pnpm test src/components/ui/bento-grid.test.tsx
# Build UI package
cd packages/ui && pnpm build
```

**Testing/Validation:**
- Create bento-grid.test.tsx with layout tests
- Test responsive behavior at different viewport sizes
- Test accessibility with keyboard navigation
- Create bento-grid.stories.tsx showcasing different layouts

**Repository Management:**
- Export BentoGrid from packages/ui/src/index.ts

---

#### UI-004-02: Create Bento Card Component

**Actor:** [AGENT]

**Target File Path:** `packages/ui/src/components/ui/bento-card.tsx`

**Description:**
Create a BentoCard component that represents individual items in the bento grid. The component should support glassmorphism effects, gradient backgrounds, and hover animations. Accept props for content, span (row/column span), and variant. Implement proper TypeScript types. Ensure the card is accessible with focus states and ARIA attributes.

**Validation Commands:**
```bash
# Run bento card tests
cd packages/ui && pnpm test src/components/ui/bento-card.test.tsx
# Build UI package
cd packages/ui && pnpm build
```

**Testing/Validation:**
- Create bento-card.test.tsx with variant tests
- Test glassmorphism rendering and performance
- Test hover animations and transitions
- Create bento-card.stories.tsx showcasing variants

**Repository Management:**
- Export BentoCard from packages/ui/src/index.ts

---

#### UI-004-03: Redesign Hero Component with Bento Grid

**Actor:** [AGENT]

**Target File Path:** `apps/firm-website/src/components/features/home/hero.tsx`

**Description:**
Redesign the hero component to use the new BentoGrid and BentoCard components. Create an asymmetric bento layout with the main headline, subheadline, CTA buttons, and supporting content distributed across cards. Apply the new vibrant color palette and display typography. Implement scroll-triggered animations using the useScrollTrigger hook for staggered entry effects. Add a subtle gradient background.

**Validation Commands:**
```bash
# Run hero component tests
cd apps/firm-website && pnpm test src/components/features/home/hero.test.tsx
# Build app to verify no errors
cd apps/firm-website && pnpm build
```

**Testing/Validation:**
- Update hero.test.tsx to test bento grid layout
- Add visual regression test for new hero design
- Test responsive behavior at mobile, tablet, and desktop
- Test scroll-triggered animations

**Repository Management:**
- No documentation updates needed

---

#### UI-004-04: Optimize Hero Performance

**Actor:** [AGENT]

**Target File Path:** `apps/firm-website/src/components/features/home/hero.tsx`

**Description:**
Optimize the hero component for performance by implementing lazy loading for heavy elements, using CSS containment for bento cards, and ensuring animations are GPU-accelerated. Add proper loading states to prevent layout shift. Test Core Web Vitals (LCP, CLS, FID) to ensure the hero performs well. Optimize images and assets if present.

**Validation Commands:**
```bash
# Build app with production mode
cd apps/firm-website && pnpm build
# Run Lighthouse audit
npx lighthouse http://localhost:3000 --view
```

**Testing/Validation:**
- Test Lighthouse scores (target: 90+ performance)
- Test animation performance with Chrome DevTools
- Verify no layout shift during loading
- Test on slow 3G connection

**Repository Management:**
- No documentation updates needed

---

#### UI-004-05: Document Hero Component

**Actor:** [HUMAN]

**Target File Path:** `apps/firm-website/src/components/features/home/hero.stories.tsx` (new)

**Description:**
Create a Storybook story for the hero component showcasing the bento grid layout, different content configurations, and responsive behavior. Document the design decisions, layout patterns, and usage guidelines. Include examples of how to customize the hero for different pages or purposes.

**Validation Commands:**
```bash
# View hero documentation in Storybook
cd apps/firm-website && pnpm storybook
```

**Testing/Validation:**
- No automated tests needed (documentation only)
- Manual review of hero examples and guidelines

**Repository Management:**
- No documentation updates needed

---

### UI-005: Implement Glassmorphism Effects

**Status:** [PENDING]

**Related File Paths:**
- `packages/ui/src/styles.css`
- `packages/ui/src/lib/utils.ts`
- `apps/firm-website/src/components/features/home/pillars.tsx`
- `apps/firm-website/src/components/features/home/demo-preview.tsx`

**Definition of Done:**
- Glassmorphism utility classes defined in theme
- Glass card component created
- Existing components updated with glassmorphism
- Performance optimized for backdrop-filter
- Dark mode glassmorphism implemented
- Glassmorphism documented in Storybook
- Accessibility considered (contrast, focus states)

**Out of Scope:**
- Complete component redesign (glassmorphism only)
- Complex glass morphing with 3D transforms

**Rules to Follow:**
- Use backdrop-filter sparingly for performance
- Ensure text contrast remains readable
- Provide fallback for browsers without backdrop-filter support
- Test on mobile devices (performance varies)
- Use subtle effects, not overwhelming glass

**Advanced Coding Pattern:**
- CSS custom properties for glassmorphism tokens
- @supports queries for fallback behavior
- CSS containment for performance optimization
- GPU-accelerated compositing

**Anti-Patterns:**
- Overusing glassmorphism causing performance issues
- Missing fallbacks for unsupported browsers
- Poor contrast on glass backgrounds
- Heavy blur values causing lag

**Imports/Exports:**
- Export glassmorphism utilities from packages/ui/src/lib/utils.ts

**Depends On:**
- UI-001 (Color System)

**Blocks:**
- UI-006 (Component Redesign)

---

#### UI-005-01: Define Glassmorphism Tokens

**Actor:** [AGENT]

**Target File Path:** `packages/ui/src/styles.css`

**Description:**
Define glassmorphism tokens in the @theme block for consistent glass effects across components. Create tokens for background transparency, blur amount, border opacity, and shadow. Use CSS custom properties for easy customization. Include light and dark mode variants. Add @supports query for browsers that don't support backdrop-filter.

**Validation Commands:**
```bash
# Build UI package
cd packages/ui && pnpm build
# Test glassmorphism in development
cd apps/firm-website && pnpm dev
```

**Testing/Validation:**
- Create glassmorphism.stories.tsx to showcase tokens
- Test rendering in different browsers
- Test performance on mobile devices
- Verify fallback behavior

**Repository Management:**
- No documentation updates needed

---

#### UI-005-02: Create Glass Card Component

**Actor:** [AGENT]

**Target File Path:** `packages/ui/src/components/ui/glass-card.tsx` (new)

**Description:**
Create a GlassCard component that applies glassmorphism effects to card content. The component should accept props for blur intensity, background opacity, and border strength. Implement proper TypeScript types. Ensure the component is accessible with focus states and maintains text contrast. Include fallback styles for browsers without backdrop-filter support.

**Validation Commands:**
```bash
# Run glass card tests
cd packages/ui && pnpm test src/components/ui/glass-card.test.tsx
# Build UI package
cd packages/ui && pnpm build
```

**Testing/Validation:**
- Create glass-card.test.tsx with variant tests
- Test backdrop-filter support detection
- Test accessibility with screen readers
- Create glass-card.stories.tsx showcasing variants

**Repository Management:**
- Export GlassCard from packages/ui/src/index.ts

---

#### UI-005-03: Update Pillars Component with Glassmorphism

**Actor:** [AGENT]

**Target File Path:** `apps/firm-website/src/components/features/home/pillars.tsx`

**Description:**
Update the pillars component to use glassmorphism effects on the service cards. Replace the standard Card component with GlassCard or apply glassmorphism utility classes. Ensure text remains readable and the effect is subtle. Test the component in both light and dark modes. Maintain existing functionality and tests.

**Validation Commands:**
```bash
# Run pillars component tests
cd apps/firm-website && pnpm test src/components/features/home/pillars.test.tsx
# Build app to verify no errors
cd apps/firm-website && pnpm build
```

**Testing/Validation:**
- Update pillars.test.tsx to test glassmorphism rendering
- Test contrast ratios with glass backgrounds
- Test performance with multiple glass cards
- Verify responsive behavior unchanged

**Repository Management:**
- No documentation updates needed

---

#### UI-005-04: Update Demo Preview with Glassmorphism

**Actor:** [AGENT]

**Target File Path:** `apps/firm-website/src/components/features/home/demo-preview.tsx`

**Description:**
Update the demo preview component to use glassmorphism effects on the demo cards. Apply glassmorphism to create visual depth and modernize the design. Ensure the effect doesn't interfere with card content readability. Test in both light and dark modes. Maintain existing functionality and tests.

**Validation Commands:**
```bash
# Run demo preview tests
cd apps/firm-website && pnpm test src/components/features/home/demo-preview.test.tsx
# Build app to verify no errors
cd apps/firm-website && pnpm build
```

**Testing/Validation:**
- Update demo-preview.test.tsx to test glassmorphism rendering
- Test contrast ratios with glass backgrounds
- Test performance with multiple glass cards
- Verify responsive behavior unchanged

**Repository Management:**
- No documentation updates needed

---

#### UI-005-05: Document Glassmorphism Usage

**Actor:** [HUMAN]

**Target File Path:** `packages/ui/src/stories/glassmorphism.stories.tsx`

**Description:**
Create comprehensive glassmorphism documentation in Storybook showcasing the GlassCard component, utility classes, usage patterns, and performance considerations. Include examples of when to use glassmorphism, browser support, fallback strategies, and accessibility guidelines. Document best practices for subtle vs bold glass effects.

**Validation Commands:**
```bash
# View glassmorphism documentation in Storybook
cd packages/ui && pnpm storybook
```

**Testing/Validation:**
- No automated tests needed (documentation only)
- Manual review of glassmorphism examples and guidelines

**Repository Management:**
- No documentation updates needed

---

### UI-006: Redesign Buttons with Advanced Variants

**Status:** [PENDING]

**Related File Paths:**
- `packages/ui/src/components/ui/button.tsx`
- `packages/ui/src/components/ui/button.test.tsx`
- `packages/ui/src/components/ui/button.stories.tsx`

**Definition of Done:**
- Gradient button variants added
- Glow effect on hover implemented
- Magnetic hover effect added
- Loading state with animation
- Ripple effect on click
- All variants documented in Storybook
- Accessibility maintained (focus states, ARIA)
- Performance optimized

**Out of Scope:**
- Complete button redesign (variants only)
- Complex 3D button effects

**Rules to Follow:**
- Maintain existing button API for backward compatibility
- Ensure all variants are accessible
- Test button states (normal, hover, active, disabled, loading)
- Use GPU-accelerated animations
- Respect reduced motion preference

**Advanced Coding Pattern:**
- class-variance-authority (CVA) for variant management
- CSS custom properties for dynamic effects
- Compound component pattern for button with icon
- requestAnimationFrame for smooth animations

**Anti-Patterns:**
- Breaking existing button API
- Missing disabled state styling
- Overusing effects causing performance issues
- Inconsistent sizing across variants

**Imports/Exports:**
- No changes to imports/exports

**Depends On:**
- UI-001 (Color System)
- UI-003 (Animation System)

**Blocks:**
- None

---

#### UI-006-01: Add Gradient Button Variants

**Actor:** [AGENT]

**Target File Path:** `packages/ui/src/components/ui/button.tsx`

**Description:**
Add gradient button variants to the buttonVariants CVA configuration. Create gradient-primary, gradient-accent, and gradient-secondary variants that use the new gradient color tokens. Ensure proper contrast for text on gradient backgrounds. Add hover states that subtly shift the gradient. Maintain accessibility with focus states.

**Validation Commands:**
```bash
# Run button tests
cd packages/ui && pnpm test src/components/ui/button.test.tsx
# Build UI package
cd packages/ui && pnpm build
```

**Testing/Validation:**
- Update button.test.tsx to test gradient variants
- Test contrast ratios on gradient backgrounds
- Test gradient rendering across browsers
- Update button.stories.tsx to showcase gradient variants

**Repository Management:**
- No documentation updates needed

---

#### UI-006-02: Implement Glow Effect on Hover

**Actor:** [AGENT]

**Target File Path:** `packages/ui/src/components/ui/button.tsx`

**Description:**
Add a glow effect variant that creates a subtle shadow/glow on button hover. Use CSS box-shadow with the primary color for the glow effect. Ensure the effect is performant and doesn't cause layout shifts. Add the glow as an optional variant or modifier. Test in both light and dark modes.

**Validation Commands:**
```bash
# Run button tests
cd packages/ui && pnpm test src/components/ui/button.test.tsx
# Build UI package
cd packages/ui && pnpm build
```

**Testing/Validation:**
- Update button.test.tsx to test glow effect
- Test performance with multiple glowing buttons
- Test glow effect in dark mode
- Update button.stories.tsx to showcase glow effect

**Repository Management:**
- No documentation updates needed

---

#### UI-006-03: Add Loading State with Animation

**Actor:** [AGENT]

**Target File Path:** `packages/ui/src/components/ui/button.tsx`

**Description:**
Enhance the button component to support a loading state with a spinner animation. Add a loading prop that disables the button and shows a loading indicator. Use CSS animation for the spinner. Ensure the loading state is accessible with proper ARIA attributes. Maintain the button's width during loading to prevent layout shift.

**Validation Commands:**
```bash
# Run button tests
cd packages/ui && pnpm test src/components/ui/button.test.tsx
# Build UI package
cd packages/ui && pnpm build
```

**Testing/Validation:**
- Update button.test.tsx to test loading state
- Test accessibility with screen readers
- Test button width stability during loading
- Update button.stories.tsx to showcase loading state

**Repository Management:**
- No documentation updates needed

---

#### UI-006-04: Document Button Variants

**Actor:** [HUMAN]

**Target File Path:** `packages/ui/src/components/ui/button.stories.tsx`

**Description:**
Update the button Storybook stories to comprehensively document all button variants, including the new gradient, glow, and loading states. Include usage guidelines for when to use each variant, accessibility considerations, and design patterns. Add examples of button composition with icons and different sizes.

**Validation Commands:**
```bash
# View button documentation in Storybook
cd packages/ui && pnpm storybook
```

**Testing/Validation:**
- No automated tests needed (documentation only)
- Manual review of button examples and guidelines

**Repository Management:**
- No documentation updates needed

---

### UI-007: Add Depth to Cards with Advanced Effects

**Status:** [PENDING]

**Related File Paths:**
- `packages/ui/src/components/ui/card.tsx`
- `packages/ui/src/components/ui/card.test.tsx`
- `packages/ui/src/components/ui/card.stories.tsx`

**Definition of Done:**
- Hover lift effect added to cards
- Gradient border variants implemented
- Subtle inner shadows for depth
- Staggered animation on scroll
- All effects documented in Storybook
- Performance optimized
- Accessibility maintained

**Out of Scope:**
- Complete card redesign (effects only)
- 3D card transforms

**Rules to Follow:**
- Maintain existing card API
- Ensure effects are subtle, not overwhelming
- Test performance with multiple cards
- Respect reduced motion preference
- Maintain accessibility (focus states, keyboard navigation)

**Advanced Coding Pattern:**
- CSS custom properties for dynamic effects
- Transform with GPU acceleration
- Box-shadow layering for depth
- Transition timing functions for natural motion

**Anti-Patterns:**
- Breaking existing card API
- Overusing effects causing distraction
- Missing focus states on interactive cards
- Performance issues with shadows

**Imports/Exports:**
- No changes to imports/exports

**Depends On:**
- UI-001 (Color System)
- UI-003 (Animation System)

**Blocks:**
- None

---

#### UI-007-01: Add Hover Lift Effect

**Actor:** [AGENT]

**Target File Path:** `packages/ui/src/components/ui/card.tsx`

**Description:**
Add a hover lift effect to cards that subtly raises the card on hover using CSS transform. Add a corresponding shadow increase to enhance the depth effect. Ensure the effect is smooth with proper transition timing. Make the effect optional via a prop or variant. Test performance and ensure no layout shift.

**Validation Commands:**
```bash
# Run card tests
cd packages/ui && pnpm test src/components/ui/card.test.tsx
# Build UI package
cd packages/ui && pnpm build
```

**Testing/Validation:**
- Update card.test.tsx to test hover lift effect
- Test performance with multiple cards
- Test smooth transitions
- Update card.stories.tsx to showcase hover effect

**Repository Management:**
- No documentation updates needed

---

#### UI-007-02: Implement Gradient Border Variants

**Actor:** [AGENT]

**Target File Path:** `packages/ui/src/components/ui/card.tsx`

**Description:**
Add gradient border variants to cards using CSS border-image or pseudo-elements. Create gradient-primary and gradient-accent border variants. Ensure the gradient border works in both light and dark modes. Make the effect optional via a prop. Test browser compatibility and provide fallbacks if needed.

**Validation Commands:**
```bash
# Run card tests
cd packages/ui && pnpm test src/components/ui/card.test.tsx
# Build UI package
cd packages/ui && pnpm build
```

**Testing/Validation:**
- Update card.test.tsx to test gradient border
- Test rendering across browsers
- Test in light and dark modes
- Update card.stories.tsx to showcase gradient borders

**Repository Management:**
- No documentation updates needed

---

#### UI-007-03: Add Subtle Inner Shadows

**Actor:** [AGENT]

**Target File Path:** `packages/ui/src/components/ui/card.tsx`

**Description:**
Add subtle inner shadows to cards for additional depth and visual interest. Use inset box-shadow with low opacity for a subtle effect. Ensure the shadow works well with the card background color. Make the effect optional via a prop. Test in both light and dark modes.

**Validation Commands:**
```bash
# Run card tests
cd packages/ui && pnpm test src/components/ui/card.test.tsx
# Build UI package
cd packages/ui && pnpm build
```

**Testing/Validation:**
- Update card.test.tsx to test inner shadows
- Test visual appearance in different modes
- Test performance impact
- Update card.stories.tsx to showcase inner shadows

**Repository Management:**
- No documentation updates needed

---

#### UI-007-04: Document Card Effects

**Actor:** [HUMAN]

**Target File Path:** `packages/ui/src/components/ui/card.stories.tsx`

**Description:**
Update the card Storybook stories to document all card effects, including hover lift, gradient borders, and inner shadows. Include usage guidelines for when to use each effect, performance considerations, and design patterns. Add examples combining multiple effects for advanced use cases.

**Validation Commands:**
```bash
# View card documentation in Storybook
cd packages/ui && pnpm storybook
```

**Testing/Validation:**
- No automated tests needed (documentation only)
- Manual review of card examples and guidelines

**Repository Management:**
- No documentation updates needed

---

### UI-008: Implement Header Glassmorphism

**Status:** [PENDING]

**Related File Paths:**
- `packages/ui/src/components/layout/header.tsx`
- `packages/ui/src/components/layout/header.test.tsx`

**Definition of Done:**
- Header updated with glassmorphism effect
- Backdrop blur applied to header background
- Border added for visual separation
- Performance optimized
- Mobile menu maintained
- Accessibility maintained
- Header documented in Storybook

**Out of Scope:**
- Complete header redesign (glassmorphism only)
- Mega menu implementation

**Rules to Follow:**
- Maintain existing header functionality
- Ensure glassmorphism doesn't affect readability
- Test performance on scroll
- Maintain mobile menu behavior
- Keep accessibility (keyboard navigation, ARIA)

**Advanced Coding Pattern:**
- CSS custom properties for glass effect
- Sticky positioning with backdrop-filter
- CSS containment for performance
- Intersection Observer for scroll effects

**Anti-Patterns:**
- Breaking existing header API
- Overusing blur causing performance issues
- Missing mobile menu functionality
- Poor contrast on glass background

**Imports/Exports:**
- No changes to imports/exports

**Depends On:**
- UI-001 (Color System)
- UI-005 (Glassmorphism Effects)

**Blocks:**
- None

---

#### UI-008-01: Apply Glassmorphism to Header

**Actor:** [AGENT]

**Target File Path:** `packages/ui/src/components/layout/header.tsx`

**Description:**
Update the header component to apply glassmorphism effects. Add backdrop blur, semi-transparent background, and subtle border using the glassmorphism tokens. Ensure the effect works in both light and dark modes. Test that the header remains readable and navigation links are accessible. Maintain the sticky positioning behavior.

**Validation Commands:**
```bash
# Run header tests
cd packages/ui && pnpm test src/components/layout/header.test.tsx
# Build UI package
cd packages/ui && pnpm build
```

**Testing/Validation:**
- Update header.test.tsx to test glassmorphism rendering
- Test header readability with glass background
- Test performance on scroll
- Test mobile menu functionality

**Repository Management:**
- No documentation updates needed

---

#### UI-008-02: Optimize Header Performance

**Actor:** [AGENT]

**Target File Path:** `packages/ui/src/components/layout/header.tsx`

**Description:**
Optimize the header component for performance by using CSS containment, will-change sparingly, and ensuring the backdrop-filter doesn't cause jank. Test the header performance while scrolling. Ensure the glassmorphism effect doesn't impact frame rate. Consider using CSS transforms instead of position changes if needed.

**Validation Commands:**
```bash
# Build UI package
cd packages/ui && pnpm build
# Test performance in development
cd apps/firm-website && pnpm dev
```

**Testing/Validation:**
- Test frame rate while scrolling with Chrome DevTools
- Test on mobile devices for performance
- Verify no layout shift
- Test with multiple elements in header

**Repository Management:**
- No documentation updates needed

---

#### UI-008-03: Document Header Component

**Actor:** [HUMAN]

**Target File Path:** `packages/ui/src/components/layout/header.stories.tsx` (new)

**Description:**
Create a Storybook story for the header component showcasing the glassmorphism effect, navigation behavior, and responsive design. Document the glassmorphism implementation, performance considerations, and usage guidelines. Include examples of header customization and mobile menu behavior.

**Validation Commands:**
```bash
# View header documentation in Storybook
cd packages/ui && pnpm storybook
```

**Testing/Validation:**
- No automated tests needed (documentation only)
- Manual review of header examples and guidelines

**Repository Management:**
- No documentation updates needed

---

### UI-009: Add Micro-Interactions to Components

**Status:** [PENDING]

**Related File Paths:**
- `packages/ui/src/components/ui/button.tsx`
- `packages/ui/src/components/ui/card.tsx`
- `apps/firm-website/src/components/features/home/pillars.tsx`
- `apps/firm-website/src/components/features/home/demo-preview.tsx`

**Definition of Done:**
- Hover effects added to all interactive elements
- Focus states enhanced for accessibility
- Active states for buttons and links
- Icon animations on hover
- Smooth transitions throughout
- All micro-interactions documented
- Performance optimized
- Reduced motion respected

**Out of Scope:**
- Complex gesture-based interactions
- Physics-based animations

**Rules to Follow:**
- Keep animations under 300ms for micro-interactions
- Use GPU-accelerated properties
- Ensure interactions feel responsive
- Maintain accessibility with visible focus states
- Respect reduced motion preference

**Advanced Coding Pattern:**
- CSS custom properties for interaction states
- Transition timing functions for natural feel
- Transform for GPU acceleration
- CSS :has() for parent-based interactions

**Anti-Patterns:**
- Over-animating causing distraction
- Missing focus states for keyboard users
- Slow transitions feeling sluggish
- Breaking existing component behavior

**Imports/Exports:**
- No changes to imports/exports

**Depends On:**
- UI-003 (Animation System)

**Blocks:**
- None

---

#### UI-009-01: Enhance Button Hover States

**Actor:** [AGENT]

**Target File Path:** `packages/ui/src/components/ui/button.tsx`

**Description:**
Enhance button hover states with subtle scale, brightness, or position changes. Add smooth transitions for all hover effects. Ensure the effects are subtle and don't cause layout shift. Test all button variants with enhanced hover states. Maintain accessibility with visible focus states.

**Validation Commands:**
```bash
# Run button tests
cd packages/ui && pnpm test src/components/ui/button.test.tsx
# Build UI package
cd packages/ui && pnpm build
```

**Testing/Validation:**
- Update button.test.tsx to test hover states
- Test transition smoothness
- Test with reduced motion preference
- Update button.stories.tsx to showcase hover effects

**Repository Management:**
- No documentation updates needed

---

#### UI-009-02: Add Icon Animations on Hover

**Actor:** [AGENT]

**Target File Path:** `apps/firm-website/src/components/features/home/pillars.tsx`

**Description:**
Add subtle icon animations to the service cards in the pillars component. Icons should scale, rotate, or bounce slightly on hover. Use CSS transforms for performance. Ensure animations are subtle and don't distract from content. Test in both light and dark modes.

**Validation Commands:**
```bash
# Run pillars tests
cd apps/firm-website && pnpm test src/components/features/home/pillars.test.tsx
# Build app to verify no errors
cd apps/firm-website && pnpm build
```

**Testing/Validation:**
- Update pillars.test.tsx to test icon animations
- Test animation performance
- Test with reduced motion preference
- Verify animations don't affect readability

**Repository Management:**
- No documentation updates needed

---

#### UI-009-03: Enhance Card Hover Effects

**Actor:** [AGENT]

**Target File Path:** `packages/ui/src/components/ui/card.tsx`

**Description:**
Enhance card hover effects with subtle transitions on background, border, or shadow. Ensure effects work with the existing hover lift effect. Add smooth transitions for all hover properties. Test that effects don't cause performance issues with multiple cards.

**Validation Commands:**
```bash
# Run card tests
cd packages/ui && pnpm test src/components/ui/card.test.tsx
# Build UI package
cd packages/ui && pnpm build
```

**Testing/Validation:**
- Update card.test.tsx to test enhanced hover effects
- Test performance with multiple cards
- Test transition smoothness
- Update card.stories.tsx to showcase hover effects

**Repository Management:**
- No documentation updates needed

---

#### UI-009-04: Document Micro-Interactions

**Actor:** [HUMAN]

**Target File Path:** `packages/ui/src/stories/micro-interactions.stories.tsx` (new)

**Description:**
Create comprehensive micro-interaction documentation in Storybook showcasing all hover, focus, and active states across components. Include usage guidelines for implementing micro-interactions, performance considerations, and accessibility best practices. Document the transition timing functions and animation patterns used.

**Validation Commands:**
```bash
# View micro-interaction documentation in Storybook
cd packages/ui && pnpm storybook
```

**Testing/Validation:**
- No automated tests needed (documentation only)
- Manual review of micro-interaction examples and guidelines

**Repository Management:**
- No documentation updates needed

---

### UI-010: Performance Optimization

**Status:** [PENDING]

**Related File Paths:**
- `apps/firm-website/src/app/layout.tsx`
- `packages/ui/src/styles.css`
- `turbo.json`

**Definition of Done:**
- Core Web Vitals optimized (LCP, FID, CLS)
- CSS bundle size minimized
- Font loading strategy optimized
- Image optimization implemented
- Animation performance ensured
- Build configuration optimized
- Performance monitoring added
- Performance documented

**Out of Scope:**
- Server-side optimization (caching, CDN)
- Database optimization

**Rules to Follow:**
- Target Lighthouse scores above 90
- Minimize layout shift (CLS < 0.1)
- Ensure fast first contentful paint
- Optimize for mobile devices
- Test on slow connections

**Advanced Coding Pattern:**
- CSS containment for isolation
- Font loading with font-display: swap
- Lazy loading for heavy components
- Code splitting with dynamic imports

**Anti-Patterns:**
- Blocking render with large CSS
- Missing image optimization
- Unnecessary JavaScript bundles
- Poor font loading strategy

**Imports/Exports:**
- No changes to imports/exports

**Depends On:**
- UI-001 through UI-009 (All UI tasks)

**Blocks:**
- None

---

#### UI-010-01: Optimize CSS Bundle Size

**Actor:** [AGENT]

**Target File Path:** `packages/ui/src/styles.css`

**Description:**
Optimize the CSS bundle size by removing unused Tailwind utilities, minimizing custom CSS, and leveraging Tailwind's purge functionality. Ensure the CSS-first configuration in Tailwind v4 is properly set up for automatic content detection. Test the bundle size before and after optimization. Ensure no visual regressions.

**Validation Commands:**
```bash
# Build UI package
cd packages/ui && pnpm build
# Analyze bundle size
cd packages/ui && pnpm build --analyze
```

**Testing/Validation:**
- Compare bundle sizes before and after
- Test visual regression with screenshots
- Verify all components still render correctly
- Test in production build mode

**Repository Management:**
- No documentation updates needed

---

#### UI-010-02: Optimize Font Loading

**Actor:** [AGENT]

**Target File Path:** `apps/firm-website/src/app/layout.tsx`

**Description:**
Optimize font loading strategy by using font-display: swap, preloading critical fonts, and implementing a font loading state. Ensure no layout shift from font loading (CLS). Test font loading on slow connections. Use system fonts as fallback. Optimize font file sizes if using custom fonts.

**Validation Commands:**
```bash
# Build app
cd apps/firm-website && pnpm build
# Run Lighthouse audit
npx lighthouse http://localhost:3000 --view
```

**Testing/Validation:**
- Test CLS metric with Lighthouse
- Test font loading on 3G connection
- Verify no flash of unstyled text
- Test font rendering across browsers

**Repository Management:**
- No documentation updates needed

---

#### UI-010-03: Implement Lazy Loading for Components

**Actor:** [AGENT]

**Target File Path:** `apps/firm-website/src/app/(marketing)/page.tsx`

**Description:**
Implement lazy loading for heavy components below the fold using Next.js dynamic imports. Lazy load components like DemoPreview, HowItWorks, and FAQSnippet to improve initial page load. Add loading states or skeletons for lazy-loaded components. Ensure SEO is not affected by lazy loading.

**Validation Commands:**
```bash
# Build app
cd apps/firm-website && pnpm build
# Run Lighthouse audit
npx lighthouse http://localhost:3000 --view
```

**Testing/Validation:**
- Test LCP improvement with Lighthouse
- Test lazy loading behavior in development
- Verify components load when scrolled into view
- Test SEO with crawler tools

**Repository Management:**
- No documentation updates needed

---

#### UI-010-04: Add Performance Monitoring

**Actor:** [AGENT]

**Target File Path:** `apps/firm-website/src/app/layout.tsx`

**Description:**
Add performance monitoring using Web Vitals library to track LCP, FID, CLS, and other Core Web Vitals. Log performance metrics to analytics. Set up alerts for performance regressions. Document performance baselines and targets. Ensure monitoring doesn't affect performance itself.

**Validation Commands:**
```bash
# Build app
cd apps/firm-website && pnpm build
# Test in development
cd apps/firm-website && pnpm dev
```

**Testing/Validation:**
- Test Web Vitals reporting
- Verify metrics are logged correctly
- Test monitoring doesn't affect performance
- Set up performance baselines

**Repository Management:**
- No documentation updates needed

---

#### UI-010-05: Document Performance Optimizations

**Actor:** [HUMAN]

**Target File Path:** `packages/ui/src/stories/performance.md` (new)

**Description:**
Create documentation for all performance optimizations implemented, including CSS optimization, font loading, lazy loading, and monitoring. Include performance targets, measurement techniques, and maintenance guidelines. Document how to run performance audits and interpret results.

**Validation Commands:**
```bash
# View performance documentation
cat packages/ui/src/stories/performance.md
```

**Testing/Validation:**
- No automated tests needed (documentation only)
- Manual review of performance documentation

**Repository Management:**
- No documentation updates needed

---

### UI-011: Accessibility Audit and Fixes

**Status:** [PENDING]

**Related File Paths:**
- All component files
- `apps/firm-website/src/app/layout.tsx`

**Definition of Done:**
- WCAG AA compliance achieved
- Color contrast ratios verified
- Keyboard navigation tested
- Screen reader compatibility verified
- Focus management implemented
- ARIA labels added where needed
- Accessibility documented
- Automated accessibility tests added

**Out of Scope:**
- WCAG AAA compliance (not required)
- Specialized assistive technology beyond screen readers

**Rules to Follow:**
- Target WCAG 2.1 Level AA compliance
- Test with keyboard only
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Ensure color contrast minimum 4.5:1
- Provide text alternatives for non-text content

**Advanced Coding Pattern:**
- ARIA attributes for semantic information
- Focus trap for modals
- Skip links for keyboard users
- Semantic HTML over ARIA

**Anti-Patterns:**
- Relying on color alone for meaning
- Missing focus indicators
- Inaccessible form controls
- Poor heading structure

**Imports/Exports:**
- No changes to imports/exports

**Depends On:**
- UI-001 through UI-009 (All UI tasks)

**Blocks:**
- None

---

#### UI-011-01: Audit Color Contrast

**Actor:** [AGENT]

**Target File Path:** `packages/ui/src/styles.css`

**Description:**
Audit all color combinations for WCAG AA compliance (4.5:1 for normal text, 3:1 for large text). Use axe-core or similar tool to automate contrast checking. Fix any contrast issues by adjusting color tokens. Ensure contrast works in both light and dark modes. Document contrast ratios for all color combinations.

**Validation Commands:**
```bash
# Run accessibility audit
cd apps/firm-website && pnpm test:e2e --grep "accessibility"
# Or use axe-core
npx axe http://localhost:3000
```

**Testing/Validation:**
- Run automated contrast checks
- Manual verification of color combinations
- Test in both light and dark modes
- Document contrast ratios

**Repository Management:**
- No documentation updates needed

---

#### UI-011-02: Test Keyboard Navigation

**Actor:** [AGENT]

**Target File Path:** All interactive component files

**Description:**
Test keyboard navigation across all interactive elements. Ensure all buttons, links, and form controls are keyboard accessible. Verify focus order is logical. Add visible focus indicators if missing. Test skip links if implemented. Ensure no keyboard traps exist.

**Validation Commands:**
```bash
# Run accessibility tests
cd apps/firm-website && pnpm test:e2e --grep "keyboard"
# Manual keyboard navigation test
cd apps/firm-website && pnpm dev
```

**Testing/Validation:**
- Manual keyboard navigation testing
- Test with Tab, Enter, Escape keys
- Verify focus indicators are visible
- Test focus order is logical

**Repository Management:**
- No documentation updates needed

---

#### UI-011-03: Verify Screen Reader Compatibility

**Actor:** [HUMAN]

**Target File Path:** All component files

**Description:**
Test the application with screen readers (NVDA for Windows, VoiceOver for Mac, TalkBack for Android). Verify semantic HTML is properly announced. Add ARIA labels where semantic HTML is insufficient. Test form controls, navigation, and interactive elements. Ensure dynamic content updates are announced.

**Validation Commands:**
```bash
# Manual screen reader testing
cd apps/firm-website && pnpm dev
```

**Testing/Validation:**
- Manual testing with screen readers
- Verify ARIA labels are appropriate
- Test dynamic content announcements
- Document any issues found

**Repository Management:**
- No documentation updates needed

---

#### UI-011-04: Add Automated Accessibility Tests

**Actor:** [AGENT]

**Target File Path:** `apps/firm-website/src/test/accessibility.test.tsx` (new)

**Description:**
Add automated accessibility tests using axe-core or @axe-core/react. Create tests for critical user flows including navigation, form submission, and content consumption. Integrate tests into the test suite. Set up accessibility testing in CI/CD pipeline. Document test coverage and maintenance.

**Validation Commands:**
```bash
# Run accessibility tests
cd apps/firm-website && pnpm test src/test/accessibility.test.tsx
# Run full test suite
cd apps/firm-website && pnpm test
```

**Testing/Validation:**
- Verify automated tests catch known issues
- Test integration with CI/CD
- Document test coverage
- Maintain test suite

**Repository Management:**
- No documentation updates needed

---

#### UI-011-05: Document Accessibility Features

**Actor:** [HUMAN]

**Target File Path:** `packages/ui/src/stories/accessibility.md` (new)

**Description:**
Create comprehensive accessibility documentation covering WCAG compliance, keyboard navigation, screen reader support, and accessibility features implemented. Include testing guidelines, maintenance procedures, and resources for developers. Document known limitations and future improvements.

**Validation Commands:**
```bash
# View accessibility documentation
cat packages/ui/src/stories/accessibility.md
```

**Testing/Validation:**
- No automated tests needed (documentation only)
- Manual review of accessibility documentation

**Repository Management:**
- No documentation updates needed

---
