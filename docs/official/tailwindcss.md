# Tailwind CSS v4.0 Documentation

**Repository Version:** ^4.0.0  
**Official Documentation:** <https://tailwindcss.com/docs>  
**Release Date:** April 2026

## Overview

Tailwind CSS works by scanning all of your HTML files, JavaScript components, and any other templates for class names, generating the corresponding styles and then writing them to a static CSS file.

It's fast, flexible, and reliable — with zero-runtime.

Tailwind CSS v4.0 is an all-new version of the framework optimized for performance and flexibility, with a reimagined configuration and customization experience, and taking full advantage of the latest advancements the web platform has to offer.

### What's New in v4.0

- **New high-performance engine** — where full builds are up to 5x faster, and incremental builds are over 100x faster — and measured in microseconds.
- **Designed for the modern web** — built on cutting-edge CSS features like cascade layers, registered custom properties with @property, and color-mix().
- **Simplified installation** — fewer dependencies, zero configuration, and just a single line of code in your CSS file.
- **First-party Vite plugin** — tight integration for maximum performance and minimum configuration.
- **Automatic content detection** — all of your template files are discovered automatically, with no configuration required.
- **Built-in import support** — no additional tooling necessary to bundle multiple CSS files.
- **CSS-first configuration** — a reimagined developer experience where you customize and extend the framework directly in CSS instead of a JavaScript configuration file.
- **CSS theme variables** — all of your design tokens exposed as native CSS variables so you can access them anywhere.
- **Dynamic utility values and variants** — stop guessing what values exist in your spacing scale, or extending your configuration for things like basic data attributes.
- **Modernized P3 color palette** — a redesigned, more vivid color palette that takes full advantage of modern display technology.
- **Container queries** — first-class APIs for styling elements based on their container size, no plugins required.
- **New 3D transform utilities** — transform elements in 3D space directly in your HTML.
- **Expanded gradient APIs** — radial and conic gradients, interpolation modes, and more.
- **@starting-style support** — a new variant you can use to create enter and exit transitions, without the need for JavaScript.
- **not-* variant** — style an element only when it doesn't match another variant, custom selector, or media or feature query.
- **Even more new utilities and variants** — including support for color-scheme, field-sizing, complex shadows, inert, and more.

## Installation

### Browser Requirements

Tailwind CSS v4.0 is designed for modern browsers and targets Safari 16.4, Chrome 111, and Firefox 128. We depend on modern CSS features like @property and color-mix() for core framework features, and Tailwind CSS v4.0 will not work in older browsers.

If you need to support older browsers, we recommend sticking with v3.4 for now.

### Using PostCSS

Installing Tailwind CSS as a PostCSS plugin is the most seamless way to integrate it with frameworks like Next.js and Angular.

#### Install Tailwind CSS

Install tailwindcss, @tailwindcss/postcss, and postcss via npm.

```bash
npm install tailwindcss @tailwindcss/postcss postcss
```

#### Add Tailwind to your PostCSS configuration

Add @tailwindcss/postcss to your postcss.config.mjs file, or wherever PostCSS is configured in your project.

```javascript
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  }
}
```

#### Import Tailwind CSS

Add an @import to your CSS file that imports Tailwind CSS.

```css
/* src/styles/globals.css */
@import "tailwindcss";
```

#### Start your build process

Run your build process with npm run dev or whatever command is configured in your package.json file.

```bash
npm run dev
```

#### Start using Tailwind in your HTML

Make sure your compiled CSS is included in the <head> (your framework might handle this for you), then start using Tailwind's utility classes to style your content.

```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="/dist/styles.css" rel="stylesheet">
  </head>
  <body>
    <h1 class="text-3xl font-bold underline">
      Hello world!
    </h1>
  </body>
</html>
```

### Using Vite Plugin

Installing Tailwind CSS as a Vite plugin is the most seamless way to integrate it with frameworks like Laravel, SvelteKit, React Router, Nuxt, and SolidJS.

#### Create your project

Start by creating a new Vite project if you don't have one set up already. The most common approach is to use [Create Vite](https://vite.dev/guide/).

```bash
npm create vite@latest my-project
cd my-project
```

#### Install Tailwind CSS

Install tailwindcss and @tailwindcss/vite via npm.

```bash
npm install tailwindcss @tailwindcss/vite
```

#### Configure the Vite plugin

Add the @tailwindcss/vite plugin to your Vite configuration.

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```

#### Import Tailwind CSS

Add an @import to your CSS file that imports Tailwind CSS.

```css
/* src/style.css */
@import "tailwindcss";
```

#### Start your build process

Run your build process with npm run dev or whatever command is configured in your package.json file.

```bash
npm run dev
```

#### Start using Tailwind in your HTML

Make sure your compiled CSS is included in the <head> (your framework might handle this for you), then start using Tailwind's utility classes to style your content.

```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="/src/style.css" rel="stylesheet">
  </head>
  <body>
    <h1 class="text-3xl font-bold underline">
      Hello world!
    </h1>
  </body>
</html>
```

## Core Concepts

### Theme Variables

#### Overview

Tailwind is a framework for building custom designs, and different designs need different typography, colors, shadows, breakpoints, and more.

These low-level design decisions are often called design tokens, and in Tailwind projects you store those values in theme variables.

#### What are theme variables?

Theme variables are special CSS variables defined using the @theme directive that influence which utility classes exist in your project.

```css
@import "tailwindcss";

@theme {
  --color-mint-500: oklch(0.72 0.11 178);
}
```

Now you can use utility classes like `bg-mint-500`, `text-mint-500`, or `fill-mint-500` in your HTML:

```html
<div class="bg-mint-500">
  <!-- ... -->
</div>
```

Tailwind also generates regular CSS variables for your theme variables so you can reference your design tokens in arbitrary values or inline styles:

```html
<div style="background-color: var(--color-mint-500)">
  <!-- ... -->
</div>
```

#### Why @theme instead of :root?

Theme variables aren't just CSS variables — they also instruct Tailwind to create new utility classes that you can use in your HTML. Since they do more than regular CSS variables, Tailwind uses special syntax so that defining theme variables is always explicit.

Use `@theme` when you want a design token to map directly to a utility class, and use `:root` for defining regular CSS variables that shouldn't have corresponding utility classes.

#### Relationship to utility classes

Some utility classes in Tailwind like flex and object-cover are static, and are always the same from project to project. But many others are driven by theme variables, and only exist because of the theme variables you've defined.

For example, theme variables defined in the --font-* namespace determine all of the font-family utilities that exist in a project:

```css
@theme {
  --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  /* ... */
}
```

The font-sans, font-serif, and font-mono utilities only exist by default because Tailwind's default theme defines the --font-sans, --font-serif, and --font-mono theme variables.

If another theme variable like --font-poppins were defined, a font-poppins utility class would become available to go with it:

```css
@import "tailwindcss";
@theme {
  --font-poppins: Poppins, sans-serif;
}
```

```html
<h1 class="font-poppins">This headline will use Poppins.</h1>
```

You can name your theme variables whatever you want within these namespaces, and a corresponding utility with the same name will become available to use in your HTML.

#### Theme variable namespaces

Theme variables are defined in namespaces and each namespace corresponds to one or more utility class or variant APIs.

Defining new theme variables in these namespaces will make new corresponding utilities and variants available in your project:

- **--color-*** → bg-red-500, text-sky-300
- **--font-*** → font-sans
- **--text-*** → text-xl
- **--font-weight-*** → font-bold
- **--tracking-*** → tracking-wide
- **--leading-*** → leading-tight
- **--breakpoint-*** → sm:*
- **--container-*** → @sm:*
- **--max-w-*** → max-w-md
- **--spacing-*** → px-4, max-h-16
- **--radius-*** → rounded-sm
- **--shadow-*** → shadow-md
- **--inset-shadow-*** → inset-shadow-xs
- **--drop-shadow-*** → drop-shadow-md
- **--blur-*** → blur-md
- **--perspective-*** → perspective-near
- **--aspect-*** → aspect-video
- **--ease-*** → ease-out
- **--animate-*** → animate-spin

For a list of all of the default theme variables, see the default theme variable reference.

### CSS-First Configuration

Instead of a `tailwind.config.js` file, you can configure all of your customizations directly in the CSS file where you import Tailwind:

```css
@import "tailwindcss";

@theme {
  --font-display: "Satoshi", "sans-serif";
  --breakpoint-3xl: 1920px;
  --color-avocado-100: oklch(0.99 0 0);
  --color-avocado-200: oklch(0.98 0.04 113.22);
  --color-avocado-300: oklch(0.94 0.11 115.03);
  --color-avocado-400: oklch(0.92 0.19 114.08);
  --color-avocado-500: oklch(0.84 0.18 117.33);
  --color-avocado-600: oklch(0.53 0.12 118.34);
  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
  /* ... */
}
```

### Automatic Content Detection

You no longer need to configure the content array in Tailwind CSS v4.0. We've come up with a bunch of heuristics for detecting all of that stuff automatically so you don't have to configure it at all.

For example, we automatically ignore anything in your .gitignore file to avoid scanning dependencies or generated files that aren't under version control:

```gitignore
/node_modules
coverage
.next
/build
```

We also automatically ignore all binary extensions like images, videos, .zip files, and more.

If you ever need to explicitly add a source that's excluded by default, you can always add it with the @source directive, right in your CSS file:

```css
@import "tailwindcss";
@source "../node_modules/@my-company/ui-lib";
```

### Built-in Import Support

Before v4.0, if you wanted to inline other CSS files using @import you'd have to configure another plugin like postcss-import to handle it for you. Now we handle this out of the box, so you don't need any other tools.

## Utility Classes

### Layout and Spacing

#### Container and Grid

```html
<!-- Container and padding -->
<div class="container mx-auto px-4 py-8">
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold mb-6">Marketing Agency</h1>
    <p class="text-gray-600 mb-8">Building digital experiences</p>
  </div>
</div>

<!-- Dynamic grid layout -->
<div class="grid grid-cols-15">
  <!-- 15 column grid -->
</div>

<!-- Responsive grid with container queries -->
<div class="@container">
  <div class="grid grid-cols-1 @sm:grid-cols-3 @lg:grid-cols-4">
    <!-- Container query responsive layout -->
  </div>
</div>

<!-- Max-width container queries -->
<div class="@container">
  <div class="grid grid-cols-3 @max-md:grid-cols-1">
    <!-- Hide columns on small containers -->
  </div>
</div>

<!-- Stacked container query ranges -->
<div class="@container">
  <div class="flex @min-md:@max-xl:hidden">
    <!-- Only show between medium and extra-large containers -->
  </div>
</div>
```

#### Dynamic Spacing

Spacing utilities like `px-*`, `mt-*`, `w-*`, `h-*`, and more are now dynamically derived from a single spacing scale variable and accept any value out of the box:

```css
@layer theme {
  :root {
    --spacing: 0.25rem;
  }
}

@layer utilities {
  .mt-8 { margin-top: calc(var(--spacing) * 8); }
  .w-17 { width: calc(var(--spacing) * 17); }
  .pr-29 { padding-right: calc(var(--spacing) * 29); }
}
```

```html
<!-- Use any spacing value without configuration -->
<div class="mt-8 w-17 pr-29">
  <!-- Custom spacing values -->
</div>
```

### Typography

#### Font Families and Sizes

```html
<!-- Custom font families -->
<h1 class="font-display text-4xl">Display Heading</h1>
<p class="font-sans text-base">Sans serif text</p>
<code class="font-mono text-sm">Monospace code</code>

<!-- Font stretch for variable fonts -->
<p class="font-stretch-narrow">Narrow text</p>
<p class="font-stretch-normal">Normal text</p>
<p class="font-stretch-wide">Wide text</p>

<!-- Text sizing -->
<h1 class="text-display">Display size</h1>
<h2 class="text-heading">Heading size</h2>
<p class="text-tiny">Tiny text</p>
```

### Colors and Backgrounds

#### Modernized P3 Color Palette

We've upgraded the entire default color palette from rgb to oklch, taking advantage of the wider gamut to make the colors more vivid in places where we were previously limited by the sRGB color space.

```html
<!-- Standard color utilities -->
<div class="bg-blue-500 text-white p-4 rounded">Blue background</div>
<div class="bg-gray-100 text-gray-900 p-4 rounded">Light gray background</div>

<!-- Text colors -->
<p class="text-red-500 font-semibold">Error text</p>
<p class="text-green-500 font-semibold">Success text</p>
<p class="text-blue-500 font-semibold">Info text</p>

<!-- Opacity (new syntax in v4) -->
<div class="bg-black/50">50% opacity black</div>
<div class="text-white/75">75% opacity white text</div>
<div class="border-blue-500/25">25% opacity blue border</div>
```

#### Expanded Gradient APIs

##### Linear Gradient Angles

Linear gradients now support angles as values, so you can use utilities like `bg-linear-45` to create a gradient on a 45 degree angle:

```html
<div class="bg-linear-45 from-indigo-500 via-purple-500 to-pink-500">
  45-degree gradient
</div>
```

##### Gradient Interpolation Modifiers

We've added the ability to control the color interpolation mode for gradients using a modifier:

```html
<!-- sRGB interpolation -->
<div class="bg-linear-to-r/srgb from-indigo-500 to-teal-400">
  sRGB gradient
</div>

<!-- OKLCH interpolation (default) -->
<div class="bg-linear-to-r/oklch from-indigo-500 to-teal-400">
  OKLCH gradient
</div>
```

##### Conic and Radial Gradients

We've added new `bg-conic-*` and `bg-radial-*` utilities for creating conic and radial gradients:

```html
<!-- Conic gradient with HSL interpolation -->
<div class="size-24 rounded-full bg-conic/[in_hsl_longer_hue] from-red-600 to-red-600">
  <!-- ... -->
</div>

<!-- Radial gradient with custom position -->
<div class="size-24 rounded-full bg-radial-[at_25%_25%] from-white to-zinc-900 to-75%">
  <!-- ... -->
</div>
```

### 3D Transforms

We've finally added APIs for doing 3D transforms:

```html
<div class="perspective-distant">
  <article class="rotate-x-51 rotate-z-43 transform-3d ...">
    <!-- 3D transformed content -->
  </article>
</div>

<!-- 3D transform utilities -->
<div class="rotate-x-45">Rotate on X axis</div>
<div class="rotate-y-45">Rotate on Y axis</div>
<div class="rotate-z-45">Rotate on Z axis</div>
<div class="scale-z-150">Scale on Z axis</div>
<div class="translate-z-10">Translate on Z axis</div>
```

### Shadows and Effects

#### Complex Shadows

New `inset-shadow-*` and `inset-ring-*` utilities make it possible to stack up to four layers of box shadows on a single element:

```html
<!-- Multiple shadow layers -->
<div class="shadow-lg inset-shadow-md inset-ring-2 inset-ring-blue-500">
  <!-- Complex shadow stacking -->
</div>
```

#### Field Sizing

New field-sizing utilities for auto-resizing textareas without writing a single line of JavaScript:

```html
<textarea class="field-sizing-content w-full" placeholder="Auto-resizing textarea"></textarea>
```

## Responsive Design

### Overview

Tailwind CSS uses a mobile-first responsive system, where utilities are applied by default at the smallest breakpoint, and then applied at larger breakpoints unless overridden.

### Working mobile-first

#### Targeting mobile screens

Utilities like `p-4`, `text-lg`, and `grid` apply at all screen sizes by default. These are your mobile-first styles.

#### Targeting a breakpoint range

Use breakpoint prefixes like `md:` and `lg:` to apply utilities at specific screen sizes and up:

```html
<!-- Responsive typography -->
<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
  Responsive heading
</h1>

<!-- Responsive layout -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <div class="bg-white p-4 rounded">Item 1</div>
  <div class="bg-white p-4 rounded">Item 2</div>
  <div class="bg-white p-4 rounded">Item 3</div>
  <div class="bg-white p-4 rounded">Item 4</div>
</div>

<!-- Responsive spacing -->
<div class="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
  Responsive container
</div>
```

#### Targeting a single breakpoint

To only apply a utility at a single breakpoint and not at larger breakpoints, combine it with the `max-*` variant:

```html
<div class="text-lg md:text-xl max-md:text-base">
  <!-- text-lg by default, text-xl at md and up, but text-base below md -->
</div>
```

### Container Queries

#### What are container queries?

[Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries) are a modern CSS feature that let you style something based on the size of a parent element instead of the size of the entire viewport. They let you build components that are a lot more portable and reusable because they can change based on the actual space available for that component.

#### Basic example

Use the @container class to mark an element as a container, then use variants like @sm and @md to style child elements based on the size of the container:

```html
<div class="@container">
  <div class="flex flex-col @md:flex-row">
    <!-- ... -->
  </div>
</div>
```

Just like breakpoint variants, container queries are mobile-first in Tailwind CSS and apply at the target container size and up.

#### Max-width container queries

Use variants like @max-sm and @max-md to apply a style below a specific container size:

```html
<div class="@container">
  <div class="flex flex-row @max-md:flex-col">
    <!-- ... -->
  </div>
</div>
```

#### Container query ranges

Stack a regular container query variant with a max-width container query variant to target a specific range:

```html
<div class="@container">
  <div class="flex flex-row @sm:@max-md:flex-col">
    <!-- ... -->
  </div>
</div>
```

#### Named containers

For complex designs that use multiple nested containers, you can name containers using @container/{name} and target specific containers with variants like @sm/{name} and @md/{name}:

```html
<div class="@container/main">
  <!-- ... -->
  <div class="flex flex-row @sm/main:flex-col">
    <!-- ... -->
  </div>
</div>
```

This makes it possible to style something based on the size of a distant container, rather than just the nearest container.

#### Using custom container sizes

Use the --container-* theme variables to customize your container sizes:

```css
@import "tailwindcss";
@theme {
  --container-8xl: 96rem;
}
```

This adds a new 8xl container query variant that can be used in your markup:

```html
<div class="@container">
  <div class="flex flex-col @8xl:flex-row">
    <!-- ... -->
  </div>
</div>
```

#### Using arbitrary values

Use variants like @min-[475px] and @max-[960px] for one-off container query sizes you don't want to add to your theme:

```html
<div class="@container">
  <div class="flex flex-col @min-[475px]:flex-row">
    <!-- ... -->
  </div>
</div>
```

#### Using container query units

Use [container query length units](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries) like cqw as arbitrary values in other utility classes to reference the container size:

```html
<div class="@container">
  <div class="w-[50cqw]">
    <!-- ... -->
  </div>
</div>
```

### Using custom breakpoints

#### Customizing your theme

Use the --breakpoint-* theme variables to customize your breakpoints:

```css
@import "tailwindcss";
@theme {
  --breakpoint-3xl: 120rem;
}
```

#### Removing default breakpoints

To remove a default breakpoint, set it to `0`:

```css
@theme {
  --breakpoint-lg: 0;
}
```

#### Using arbitrary values

Use breakpoint prefixes like `max-[896px]:` for one-off breakpoints you don't want to add to your theme:

```html
<div class="max-[896px]:text-sm">
  <!-- Text size is smaller below 896px -->
</div>
```

## States and Variants

### Dynamic Variants

#### Data Attributes

You can target custom boolean data attributes without needing to define them:

```html
<div data-current class="opacity-75 data-current:opacity-100">
  <!-- Full opacity when data-current is present -->
</div>
```

#### not-* Variant

We've added a new `not-*` variant which finally adds support for the CSS `:not()` pseudo-class:

```html
<div class="not-hover:opacity-75">
  <!-- 75% opacity when NOT hovering -->
</div>
```

It does double duty and also lets you negate media queries and @supports queries:

```html
<div class="not-supports-hanging-punctuation:px-4">
  <!-- Add padding when hanging punctuation is NOT supported -->
</div>
```

#### New Variants

- **in-*** variant — which is a lot like group-*, but without the need for the group class
- **inert** variant — for styling non-interactive elements marked with the inert attribute
- **nth-*** variants — for doing really clever things you'll eventually regret
- **descendant** variant — for styling all descendant elements
- **:popover-open** — using the existing open variant to also target open popovers

```html
<!-- in-* variant (no group class needed) -->
<div class="in-hover:bg-blue-500">
  <div>Hover me to turn blue</div>
</div>

<!-- inert variant -->
<div class="inert:opacity-50" inert>
  <!-- Styled when inert -->
</div>

<!-- nth variants -->
<div class="nth-odd:bg-gray-100 nth-even:bg-white">
  <!-- Alternating row colors -->
</div>

<!-- descendant variant -->
<div class="descendant:text-sm">
  <!-- All descendants get small text -->
</div>

<!-- popover-open -->
<div popover id="my-popover" class="open:bg-blue-500">
  <!-- Blue background when popover is open -->
</div>
```

### @starting-style Support

The new starting variant adds support for the new CSS @starting-style feature, making it possible to transition element properties when an element is first displayed:

```html
<div>
  <button popovertarget="my-popover">Check for updates</button>
  <div popover id="my-popover" class="transition-discrete starting:open:opacity-0 ...">
    <!-- Fade in when popover opens -->
  </div>
</div>
```

## Component Patterns

### Buttons

```html
<!-- Primary button -->
<button class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200">
  Primary Button
</button>

<!-- Secondary button -->
<button class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition-colors duration-200">
  Secondary Button
</button>

<!-- Outline button -->
<button class="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold py-2 px-4 rounded transition-all duration-200">
  Outline Button
</button>

<!-- Ghost button -->
<button class="text-blue-500 hover:bg-blue-50 font-semibold py-2 px-4 rounded transition-colors duration-200">
  Ghost Button
</button>

<!-- Scale on hover -->
<button class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transform hover:scale-105 transition-all duration-200">
  Scale on Hover
</button>
```

### Cards

```html
<!-- Basic card -->
<div class="bg-white rounded-lg shadow-md overflow-hidden">
  <img src="/image.jpg" alt="Card image" class="w-full h-48 object-cover">
  <div class="p-6">
    <h3 class="text-xl font-semibold mb-2">Card Title</h3>
    <p class="text-gray-600 mb-4">Card description goes here.</p>
    <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
      Learn More
    </button>
  </div>
</div>

<!-- Client card with hover effects -->
<div class="bg-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
  <div class="relative overflow-hidden">
    <img src="/client-logo.jpg" alt="Client" class="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300">
    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
  </div>
  <div class="p-6">
    <h3 class="text-lg font-semibold mb-2">Client Name</h3>
    <p class="text-gray-600 text-sm mb-4">Brief description</p>
    <a href="#" class="text-blue-500 hover:text-blue-600 font-medium text-sm">
      View Case Study →
    </a>
  </div>
</div>
```

### Navigation

```html
<!-- Header navigation -->
<header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
  <nav class="container mx-auto px-4">
    <div class="flex justify-between items-center h-16">
      <!-- Logo -->
      <div class="flex items-center">
        <span class="text-2xl font-bold text-blue-600">Agency</span>
      </div>
      
      <!-- Desktop navigation -->
      <div class="hidden md:flex items-center space-x-8">
        <a href="#" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
        <a href="#" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">Clients</a>
        <a href="#" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">Services</a>
        <a href="#" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</a>
        <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
          Contact
        </button>
      </div>
      
      <!-- Mobile menu button -->
      <button class="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </nav>
</header>
```

## Forms

### Form Elements

```html
<!-- Input fields -->
<div class="space-y-4">
  <div>
    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
      Full Name
    </label>
    <input
      type="text"
      id="name"
      name="name"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="John Doe"
    />
  </div>
  
  <div>
    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
      Email Address
    </label>
    <input
      type="email"
      id="email"
      name="email"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="john@example.com"
    />
  </div>
  
  <div>
    <label for="message" class="block text-sm font-medium text-gray-700 mb-1">
      Message
    </label>
    <textarea
      id="message"
      name="message"
      rows="4"
      class="field-sizing-content w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="Your message here..."
    ></textarea>
  </div>
  
  <button
    type="submit"
    class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
  >
    Send Message
  </button>
</div>
```

### Form States

```html
<!-- Success state -->
<div class="bg-green-50 border border-green-200 rounded-md p-4">
  <div class="flex">
    <div class="flex-shrink-0">
      <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="ml-3">
      <h3 class="text-sm font-medium text-green-800">Success</h3>
      <p class="mt-1 text-sm text-green-700">Your message has been sent successfully!</p>
    </div>
  </div>
</div>

<!-- Error state -->
<div class="bg-red-50 border border-red-200 rounded-md p-4">
  <div class="flex">
    <div class="flex-shrink-0">
      <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="ml-3">
      <h3 class="text-sm font-medium text-red-800">Error</h3>
      <p class="mt-1 text-sm text-red-700">Please fix the errors below and try again.</p>
    </div>
  </div>
</div>
```

## Animation and Transitions

### Hover and Focus Effects

```html
<!-- Card with hover effects -->
<div class="bg-white rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
  <div class="p-6">
    <h3 class="text-xl font-semibold mb-2">Hover Me</h3>
    <p class="text-gray-600">This card lifts and changes shadow on hover.</p>
  </div>
</div>

<!-- Link with underline animation -->
<a href="#" class="text-blue-500 hover:text-blue-600 relative group">
  Underline Animation
  <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
</a>
```

### Loading States

```html
<!-- Skeleton loader -->
<div class="animate-pulse">
  <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
  <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
  <div class="h-4 bg-gray-200 rounded w-5/6"></div>
</div>

<!-- Spinner -->
<div class="flex justify-center items-center h-32">
  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
</div>

<!-- Progress bar -->
<div class="w-full bg-gray-200 rounded-full h-2">
  <div class="bg-blue-500 h-2 rounded-full transition-all duration-500" style="width: 75%"></div>
</div>
```

## Dark Mode

### Overview

Now that dark mode is a first-class feature of many operating systems, it's becoming more and more common to design a dark version of your website to go along with the default design.

To make this as easy as possible, Tailwind includes a dark variant that lets you style your site differently when dark mode is enabled:

```html
<div class="bg-white dark:bg-gray-800 rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5">
  <div>
    <span class="inline-flex items-center justify-center rounded-md bg-indigo-500 p-2 shadow-lg">
      <svg class="h-6 w-6 stroke-white" ...>
        <!-- ... -->
      </svg>
    </span>
  </div>
  <h3 class="text-gray-900 dark:text-white mt-5 text-base font-medium tracking-tight ">
    Writes upside-down
  </h3>
  <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm ">
    The Zero Gravity Pen can be used to write in any orientation, including upside-down. It even works in outer space.
  </p>
</div>
```

By default this uses the prefers-color-scheme CSS media feature, but you can also build sites that support toggling dark mode manually by overriding the dark variant.

### Toggling dark mode manually

If you want your dark theme to be driven by a CSS selector instead of the prefers-color-scheme media query, override the dark variant to use your custom selector:

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

Now instead of dark:* utilities being applied based on prefers-color-scheme, they will be applied whenever the dark class is present earlier in the HTML tree:

```html
<html class="dark">
  <body>
    <div class="bg-white dark:bg-black">
      <!-- ... -->
    </div>
  </body>
</html>
```

How you add the dark class to the html element is up to you, but a common approach is to use a bit of JavaScript that updates the class attribute and syncs that preference to somewhere like localStorage.

#### Using a data attribute

To use a data attribute instead of a class to activate dark mode, just override the dark variant with an attribute selector instead:

```css
@import "tailwindcss";
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

Now dark mode utilities will be applied whenever the data-theme attribute is set to dark somewhere up the tree:

```html
<html data-theme="dark">
  <body>
    <div class="bg-white dark:bg-black">
      <!-- ... -->
    </div>
  </body>
</html>
```

#### With system theme support

To build three-way theme toggles that support light mode, dark mode, and your system theme, use a custom dark mode selector and the [window.matchMedia() API](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) to detect the system theme and update the html element when needed.

Here's a simple example of how you can support light mode, dark mode, as well as respecting the operating system preference:

```javascript
// On page load or when changing themes, best to add inline in `head` to avoid FOUC
document.documentElement.classList.toggle(
  "dark",
  localStorage.theme === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
);

// Whenever the user explicitly chooses light mode
localStorage.theme = "light";

// Whenever the user explicitly chooses dark mode
localStorage.theme = "dark";

// Whenever the user explicitly chooses to respect the OS preference
localStorage.removeItem("theme");
```

Again you can manage this however you like, even storing the preference server-side in a database and rendering the class on the server — it's totally up to you.

## Functions and Directives

### Directives

#### @import

Use the @import directive to inline import CSS files, including Tailwind itself:

```css
@import "tailwindcss";
```

#### @theme

Use the @theme directive to define your project's custom design tokens, like fonts, colors, and breakpoints:

```css
@theme {
  --font-display: "Satoshi", "sans-serif";
  --breakpoint-3xl: 120rem;
  --color-avocado-100: oklch(0.99 0 0);
  --color-avocado-200: oklch(0.98 0.04 113.22);
  --color-avocado-300: oklch(0.94 0.11 115.03);
  --color-avocado-400: oklch(0.92 0.19 114.08);
  --color-avocado-500: oklch(0.84 0.18 117.33);
  --color-avocado-600: oklch(0.53 0.12 118.34);
  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
  /* ... */
}
```

#### @source

Use the @source directive to explicitly specify source files that aren't picked up by Tailwind's automatic content detection:

```css
@source "../node_modules/@my-company/ui-lib";
```

#### @utility

Use the @utility directive to add custom utilities to your project that work with variants like hover, focus and lg:

```css
@utility tab-4 {
  tab-size: 4;
}
```

#### @variant

Use the @variant directive to apply a Tailwind variant to styles in your CSS:

```css
.my-element {
  background: white;
  @variant dark {
    background: black;
  }
}
```

#### @custom-variant

Use the @custom-variant directive to add a custom variant in your project:

```css
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
```

This lets you write utilities theme-midnight:bg-black and theme-midnight:text-white.

#### @apply

Use the @apply directive to inline any existing utility classes into your own custom CSS:

```css
.select2-dropdown {
  @apply rounded-b-lg shadow-md;
}
.select2-search {
  @apply rounded border border-gray-300;
}
.select2-results__group {
  @apply text-lg font-bold text-gray-900;
}
```

This is useful when you need to write custom CSS (like to override the styles in a third-party library) but still want to work with your design tokens and use the same syntax you're used to using in your HTML.

### Functions

#### --alpha()

Use the --alpha() function to calculate the alpha channel of a color:

```css
.my-element {
  background-color: oklch(0.72 0.11 178 / --alpha(--color-mint-500));
}
```

#### --spacing()

Use the --spacing() function to calculate spacing values:

```css
.my-element {
  padding: --spacing(4);
}
```

### Compatibility

#### @config (v3 compatibility)

The @config directive is not supported in v4. Use @theme instead.

#### @plugin (v3 compatibility)

The @plugin directive is not supported in v4. Plugins should be configured through your build tool.

#### theme() (v3 compatibility)

The theme() function is not supported in v4. Use CSS custom properties instead.

## Upgrade Guide

### Using the upgrade tool

If you'd like to upgrade a project from v3 to v4, you can use our upgrade tool to do the vast majority of the heavy lifting for you:

```bash
$ npx @tailwindcss/upgrade
```

For most projects, the upgrade tool will automate the entire migration process including updating your dependencies, migrating your configuration file to CSS, and handling any changes to your template files.

The upgrade tool requires Node.js 20 or higher, so ensure your environment is updated before running it.

We recommend running the upgrade tool in a new branch, then carefully reviewing the diff and testing your project in the browser to make sure all of the changes look correct. You may need to tweak a few things by hand in complex projects, but the tool will save you a ton of time either way.

It's also a good idea to go over all of the breaking changes in v4 and get a good understanding of what's changed, in case there are other things you need to update in your project that the upgrade tool doesn't catch.

### Upgrading manually

### Changes from v3

Here's a comprehensive list of all the breaking changes in Tailwind CSS v4.0.

Our upgrade tool will handle most of these changes for you automatically, so we highly recommend using it if you can.

#### Browser requirements

Tailwind CSS v4.0 is designed for modern browsers and targets Safari 16.4, Chrome 111, and Firefox 128. We depend on modern CSS features like @property and color-mix() for core framework features, and Tailwind CSS v4.0 will not work in older browsers.

If you need to support older browsers, we recommend sticking with v3.4 for now. We're actively exploring a compatibility mode to help people upgrade sooner that we hope to share more news on in the future.

#### Removed @tailwind directives

In v4 you import Tailwind using a regular CSS @import statement, not using the @tailwind directives you used in v3:

```css
/* Old v3 way */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* New v4 way */
@import "tailwindcss";
```

#### Removed deprecated utilities

We've removed any utilities that were deprecated in v3 and have been undocumented for several years. Here's a list of what's been removed along with the modern alternative:

- `bg-opacity-*` → Use `bg-black/50` instead
- `text-opacity-*` → Use `text-black/50` instead
- `border-opacity-*` → Use `border-black/50` instead
- `divide-opacity-*` → Use `divide-black/50` instead
- `ring-opacity-*` → Use `ring-black/50` instead
- `placeholder-opacity-*` → Use `placeholder-black/50` instead
- `flex-shrink-*` → Use `shrink-*` instead
- `flex-grow-*` → Use `grow-*` instead
- `overflow-ellipsis` → Use `text-ellipsis` instead
- `decoration-slice` → Use `box-decoration-slice` instead
- `decoration-clone` → Use `box-decoration-clone` instead

#### Renamed utilities

Several utilities have been renamed for consistency:

- `shadow-outline` → `ring` (now uses outline rings)
- `ring-inset` → `inset-ring` (for consistency with inset-shadow)
- `space-x-*` → `gap-x-*` (use gap utilities instead)
- `space-y-*` → `gap-y-*` (use gap utilities instead)

#### Space-between selector

The space-between selector has been removed. Use gap utilities instead:

```html
<!-- Old -->
<div class="space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- New -->
<div class="flex flex-col gap-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

#### Divide selector

The divide selector now uses the gap utilities instead of border utilities:

```html
<!-- Old -->
<div class="divide-y divide-gray-200">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- New -->
<div class="flex flex-col divide-y divide-gray-200">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

#### Using variants with gradients

Gradient utilities now require explicit gradient prefixes:

```html
<!-- Old -->
<div class="from-blue-500 to-purple-500">

<!-- New -->
<div class="bg-linear-to-r from-blue-500 to-purple-500">
```

#### Container configuration

Container queries are now built-in and don't require plugins. Use @container instead of container:

```html
<!-- Old -->
<div class="container">
  <div class="sm:grid-cols-2">

<!-- New -->
<div class="@container">
  <div class="@sm:grid-cols-2">
```

#### Default border color

The default border color is now `border-gray-200` instead of `border-current`.

#### Default ring width and color

The default ring width is now `1px` and the default ring color is `ring-blue-500`.

#### Preflight changes

Some preflight styles have been updated for better defaults:

- `img` elements now have `max-width: 100%` by default
- `table` elements now have `border-collapse: collapse` by default
- `button` elements now have `cursor: pointer` by default

#### Using a prefix

The prefix option is now configured through CSS:

```css
@theme {
  --prefix: "tw-";
}
```

#### The important modifier

The important modifier is now configured through CSS:

```css
@theme {
  --important: true;
}
```

#### Adding custom utilities

Use the @utility directive instead of plugins:

```css
/* Old */
plugin(function({ addUtilities }) {
  addUtilities({
    '.tab-4': { 'tab-size': '4' }
  })
})

/* New */
@utility tab-4 {
  tab-size: 4;
}
```

#### Variant stacking order

The variant stacking order has been updated for more predictable behavior.

#### Variables in arbitrary values

You can now use CSS custom properties in arbitrary values:

```html
<div class="w-[var(--my-width)]">
```

#### Arbitrary values in grid and object-position utilities

Arbitrary values are now supported in more utilities:

```html
<div class="grid-cols-[repeat(3,1fr)] object-[center_20%]">
```

#### Hover styles on mobile

Hover styles are now disabled on touch devices by default for better UX.

#### Transitioning outline-color

Outline color transitions now work properly with the new ring utilities.

#### Individual transform properties

Individual transform properties like `translate-x-*` and `scale-*` are now more consistent.

#### Disabling core plugins

Core plugins can be disabled through CSS:

```css
@theme {
  --plugins: none;
}
```

#### Using the theme() function

The theme() function is no longer supported. Use CSS custom properties instead.

#### Using a JavaScript config file

JavaScript config files are no longer supported. Use CSS configuration instead.

#### Theme values in JavaScript

Theme values are no longer accessible in JavaScript. Use CSS custom properties.

#### Using @apply with Vue, Svelte, or CSS modules

The @apply directive now works better with CSS-in-JS solutions.

#### Using Sass, Less, and Stylus

Preprocessor support has been improved for better integration.

## Best Practices

### Performance

- Use the new high-performance engine for faster builds
- Take advantage of automatic content detection
- Leverage CSS custom properties for theming
- Use dynamic utility values to reduce configuration
- Optimize your CSS bundle size with tree-shaking
- Minimize the use of arbitrary values in production
- Use container queries for component-level responsiveness

### Maintainability

- Create a design system with CSS-first configuration
- Use consistent spacing and color scales with theme variables
- Document custom utilities and components
- Use semantic HTML with utility classes
- Follow a naming convention for custom theme variables
- Keep your CSS configuration organized and modular
- Use CSS layers for better style organization

### Accessibility

- Ensure sufficient color contrast with modernized palette
- Use focus states for interactive elements
- Provide appropriate text sizing
- Test with screen readers
- Use color-scheme utilities for better dark mode support
- Implement proper heading hierarchy
- Add appropriate ARIA labels and roles
- Ensure keyboard navigation works properly

### Responsive Design

- Mobile-first approach
- Use container queries for component-level responsiveness
- Test on various screen sizes
- Consider touch interactions
- Use relative units for better scalability
- Implement proper breakpoints for different devices
- Test on real devices, not just emulators

### Code Organization

- Group related utilities together
- Use CSS layers for better specificity control
- Keep custom utilities in dedicated sections
- Document your design tokens and conventions
- Use consistent naming patterns
- Separate concerns (layout, typography, colors)
- Maintain a clean and readable CSS structure

## Framework Integration

### Astro Integration

```astro
---
// src/layouts/Layout.astro
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width" />
  <title>{title}</title>
  <style>
    @import "tailwindcss";
    
    @theme {
      --color-brand: #3b82f6;
    }
  </style>
</head>
<body>
  <slot />
</body>
</html>
```

### Next.js Integration

```typescript
// app/globals.css
@import "tailwindcss";

@theme {
  --color-brand-50: #eff6ff;
  --color-brand-500: #3b82f6;
  --color-brand-600: #2563eb;
}

@layer components {
  .btn {
    @apply px-4 py-2 rounded-md font-medium transition-colors duration-200;
  }
}
```

### Vite Integration

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
  css: {
    postcss: {
      plugins: ['@tailwindcss/postcss']
    }
  }
})
```

### Laravel Integration

```php
// resources/css/app.css
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
}
```

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    laravel(),
    tailwindcss()
  ]
})
```

### Remix Integration

```typescript
// app/root.css
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --font-sans: ui-sans-serif, system-ui, sans-serif;
}
```

```typescript
// app/root.tsx
import styles from "./root.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];
```

## Common Patterns

### Agency Website Layout

```html
<!-- Header -->
<header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
  <nav class="container mx-auto px-4">
    <div class="flex justify-between items-center h-16">
      <div class="text-2xl font-bold text-brand-600">Agency</div>
      <div class="hidden md:flex space-x-8">
        <a href="#" class="text-gray-700 hover:text-brand-600 font-medium">Services</a>
        <a href="#" class="text-gray-700 hover:text-brand-600 font-medium">Portfolio</a>
        <a href="#" class="text-gray-700 hover:text-brand-600 font-medium">About</a>
        <a href="#" class="text-gray-700 hover:text-brand-600 font-medium">Contact</a>
      </div>
    </div>
  </nav>
</header>

<!-- Hero -->
<section class="bg-gradient-to-r from-brand-600 to-brand-800 text-white py-20">
  <div class="container mx-auto px-4 text-center">
    <h1 class="text-4xl md:text-6xl font-bold mb-6">Building Digital Experiences</h1>
    <p class="text-xl mb-8 max-w-3xl mx-auto">We help brands connect with their audience through innovative web solutions.</p>
    <button class="bg-white text-brand-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
      Get Started
    </button>
  </div>
</section>
```

### Client Cards

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <div class="h-48 bg-gradient-to-br from-brand-400 to-brand-600"></div>
    <div class="p-6">
      <h3 class="text-xl font-semibold mb-2">Client Alpha</h3>
      <p class="text-gray-600 mb-4">Complete brand redesign and website development.</p>
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-500">Web Design</span>
        <a href="#" class="text-brand-600 hover:text-brand-700 font-medium">
          View Project →
        </a>
      </div>
    </div>
  </div>
</div>
```

### Form Components

```html
<form class="max-w-lg mx-auto">
  <div class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
      <input type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
      <input type="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
    </div>
    <button type="submit" class="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
      Send Message
    </button>
  </div>
</form>
```

## Troubleshooting

### Common Issues

#### Build Performance

- **Issue**: Slow build times
- **Solution**: Enable file system caching and use the Vite plugin
- **Code**: Ensure you're using `@tailwindcss/vite` instead of PostCSS when possible

#### CSS Not Applying

- **Issue**: Utility classes not working
- **Solution**: Check that your CSS import is correct and content detection is working
- **Code**: Verify `@import "tailwindcss";` is in your main CSS file

#### Container Queries Not Working

- **Issue**: @container variants not applying
- **Solution**: Ensure parent element has @container class
- **Code**: `<div class="@container"><div class="@sm:grid-cols-2">`

#### Dark Mode Issues

- **Issue**: Dark mode utilities not applying
- **Solution**: Check your dark variant configuration
- **Code**: `@custom-variant dark (&:where(.dark, .dark *));`

#### Theme Variables Not Working

- **Issue**: Custom theme variables not generating utilities
- **Solution**: Ensure variables are defined in @theme block with correct namespace
- **Code**: `@theme { --color-custom-500: #3b82f6; }`

### Performance Issues

#### Large CSS Bundle

- Use CSS purging with automatic content detection
- Avoid excessive arbitrary values
- Use CSS layers for better optimization
- Minimize custom utilities

#### Slow Development Server

- Enable file system caching
- Use the Vite plugin instead of PostCSS
- Exclude unnecessary files with @source
- Optimize your content detection

## Resources

### Official Documentation

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS Playground](https://play.tailwindcss.com/)
- [Tailwind CSS Blog](https://tailwindcss.com/blog)
- [Tailwind CSS GitHub](https://github.com/tailwindlabs/tailwindcss)

### Tools and Resources

- [Headless UI](https://headlessui.com) - Unstyled, fully accessible UI components
- [Heroicons](https://heroicons.com) - Beautiful hand-crafted SVG icons
- [Tailwind UI](https://tailwindui.com) - Official UI component library
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - VS Code extension

### Learning Resources

- [Tailwind CSS: From Zero to Production](https://www.youtube.com/watch?v=bxmDnn7lrnk)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Refactoring UI](https://www.refactoringui.com)
- [Tailwind CSS Components](https://tailwindcomponents.com)

### Community

- [Tailwind CSS Discord](https://tailwindcss.com/discord)
- [Tailwind CSS Twitter](https://twitter.com/tailwindcss)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/tailwind-css)
- [Reddit r/tailwindcss](https://www.reddit.com/r/tailwindcss/)

---

*This documentation covers Tailwind CSS ^4.0.0 as used in this repository. For the latest features and updates, check the official Tailwind CSS documentation at <https://tailwindcss.com/docs>*
