# Design Tokens

This document defines the design system tokens used across the firm website, including colors, typography, and spacing scales.

## Color Palette

### Brand Colors

The brand uses an electric blue primary color with purple and cyan accents for an eclectic feel.

#### Primary (Electric Blue)
- **Primary:** `oklch(0.55 0.22 264)` - Vibrant electric blue for primary actions and branding
- **Primary Light:** `oklch(0.75 0.18 264)` - Lighter variant for hover states
- **Primary Dark:** `oklch(0.45 0.20 264)` - Darker variant for pressed states
- **Primary Foreground:** `oklch(0.98 0.01 264)` - High contrast text for primary backgrounds

#### Accent Colors
- **Accent (Purple):** `oklch(0.55 0.25 290)` - Purple accent for eclectic feel
- **Accent Secondary (Cyan):** `oklch(0.65 0.20 220)` - Cyan accent for variety
- **Accent Foreground:** `oklch(0.98 0.01 290)` - High contrast text for accent backgrounds

### Background Colors

#### Light Mode (Default)
- **Background:** `oklch(0.98 0 0)` - Near-white background (#fafafa equivalent)
- **Foreground:** `oklch(0.12 0 0)` - Near-black text for high contrast

#### Dark Mode
- **Background Dark:** `oklch(0.05 0 0)` - Deep black background (#0a0a0a equivalent)
- **Foreground Dark:** `oklch(0.95 0 0)` - Near-white text for dark backgrounds

### Semantic Colors

- **Card:** `oklch(1 0 0)` - Pure white for card backgrounds
- **Card Foreground:** `oklch(0.12 0 0)` - Dark text on cards
- **Popover:** `oklch(1 0 0)` - White for popover backgrounds
- **Popover Foreground:** `oklch(0.12 0 0)` - Dark text on popovers
- **Secondary:** `oklch(0.96 0 0)` - Light gray for secondary elements
- **Secondary Foreground:** `oklch(0.12 0 0)` - Dark text on secondary backgrounds
- **Muted:** `oklch(0.96 0 0)` - Light gray for muted content
- **Muted Foreground:** `oklch(0.45 0 0)` - Medium gray for muted text
- **Destructive:** `oklch(0.55 0.22 25)` - Red for destructive actions
- **Destructive Foreground:** `oklch(0.98 0 0)` - White text on destructive backgrounds
- **Border:** `oklch(0.90 0 0)` - Light gray for borders
- **Input:** `oklch(0.90 0 0)` - Light gray for input borders
- **Ring:** `oklch(0.55 0.22 264)` - Electric blue for focus rings

### Chart Colors

A set of distinct colors for data visualization:
- **Chart 1:** `oklch(0.55 0.22 264)` - Electric blue
- **Chart 2:** `oklch(0.55 0.25 290)` - Purple
- **Chart 3:** `oklch(0.65 0.20 220)` - Cyan
- **Chart 4:** `oklch(0.70 0.18 150)` - Green
- **Chart 5:** `oklch(0.65 0.22 30)` - Orange

## Typography

### Font Families

- **Sans Serif:** `Inter, system-ui, sans-serif` - Primary font for UI elements and body text
- **Serif:** `Georgia, serif` - Accent font for headings and decorative elements

### Text Scale

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-xs` | 0.75rem (12px) | 1rem (16px) | Small labels, captions |
| `text-sm` | 0.875rem (14px) | 1.25rem (20px) | Small text, metadata |
| `text-base` | 1rem (16px) | 1.5rem (24px) | Body text, default |
| `text-lg` | 1.125rem (18px) | 1.75rem (28px) | Large body text |
| `text-xl` | 1.25rem (20px) | 1.75rem (28px) | Subheadings |
| `text-2xl` | 1.5rem (24px) | 2rem (32px) | Section headings |
| `text-3xl` | 1.875rem (30px) | 2.25rem (36px) | Page headings |
| `text-4xl` | 2.25rem (36px) | 2.5rem (40px) | Hero headings |

## Spacing Scale

The spacing scale follows a 4px base unit for consistent spacing throughout the interface.

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `spacing-1` | 0.25rem | 4px | Tight spacing |
| `spacing-2` | 0.5rem | 8px | Small gaps |
| `spacing-3` | 0.75rem | 12px | Compact spacing |
| `spacing-4` | 1rem | 16px | Default spacing |
| `spacing-5` | 1.25rem | 20px | Medium spacing |
| `spacing-6` | 1.5rem | 24px | Comfortable spacing |
| `spacing-8` | 2rem | 32px | Section spacing |
| `spacing-10` | 2.5rem | 40px | Large spacing |
| `spacing-12` | 3rem | 48px | Component spacing |
| `spacing-16` | 4rem | 64px | Section gaps |
| `spacing-20` | 5rem | 80px | Large sections |
| `spacing-24` | 6rem | 96px | Hero spacing |
| `spacing-32` | 8rem | 128px | Page sections |
| `spacing-40` | 10rem | 160px | Major sections |
| `spacing-48` | 12rem | 192px | Full page sections |
| `spacing-56` | 14rem | 224px | Extra large spacing |
| `spacing-64` | 16rem | 256px | Maximum spacing |
| `spacing-72` | 18rem | 288px | Extra maximum spacing |
| `spacing-80` | 20rem | 320px | Ultra large spacing |
| `spacing-96` | 24rem | 384px | Extreme spacing |

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 0.25rem (4px) | Small elements, badges |
| `radius-md` | 0.5rem (8px) | Default radius, buttons |
| `radius-lg` | 0.75rem (12px) | Cards, panels |
| `radius-xl` | 1rem (16px) | Large cards, modals |

## Implementation

All design tokens are defined in `packages/ui/src/styles.css` using Tailwind CSS v4's `@theme` directive with OKLCH color format for perceptual uniformity and wide-gamut support.

### Usage in Components

```tsx
// Using color tokens
<div className="bg-primary text-primary-foreground">Primary Button</div>
<div className="bg-accent text-accent-foreground">Accent Element</div>

// Using typography
<h1 className="text-4xl font-sans">Heading</h1>
<p className="text-base font-sans">Body text</p>

// Using spacing
<div className="p-4 gap-6">Content with spacing</div>

// Using border radius
<div className="rounded-lg">Card with radius</div>
```

## Dark Mode

Dark mode is implemented using the `[data-theme="dark"]` selector. The design tokens automatically adapt to dark mode when the data attribute is set on the HTML element.

### Enabling Dark Mode

```tsx
// Set dark mode
document.documentElement.setAttribute('data-theme', 'dark');

// Set light mode
document.documentElement.setAttribute('data-theme', 'light');
```

## Accessibility

All color combinations meet WCAG 2.1 AA contrast requirements:
- Primary colors have sufficient contrast with their foreground colors
- Text colors on backgrounds meet 4.5:1 contrast ratio
- Large text meets 3:1 contrast ratio

## Rationale

### OKLCH Color Format
- Perceptually uniform: equal steps look equal to the human eye
- Wide-gamut support: better color reproduction on modern displays
- Consistent scales: hue remains stable when creating tints and shades
- Future-proof: modern browsers have full support since 2023

### 4px Spacing Base
- Industry standard for consistent spacing
- Scales evenly across the design system
- Aligns with common UI frameworks
- Provides good rhythm and visual hierarchy

### Inter Font Family
- Excellent readability at all sizes
- Optimized for screen display
- Good character variety for professional appearance
- System font fallback ensures performance

### Electric Blue + Purple/Cyan Accents
- Creates a modern, tech-forward aesthetic
- Eclectic feel with multiple accent colors
- High contrast for accessibility
- Distinctive brand identity
