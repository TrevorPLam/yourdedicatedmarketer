/**
 * Tailwind CSS v4.0 Configuration
 * CSS-first configuration using @theme directive
 * This file is primarily for IDE support and tooling integration
 * 
 * Note: In v4.0, most configuration is done in CSS via @theme
 * This file exists for compatibility with development tools
 */

/** @type {import('tailwindcss').Config} */
export default {
  // In v4.0, content is automatically detected
  // This is just a fallback for tools that require it
  content: [
    './src/**/*.{js,ts,jsx,tsx,astro}',
    '../ui-components/**/*.{js,ts,jsx,tsx}',
    '../../apps/agency-website/**/*.{js,ts,jsx,tsx,astro}',
    '../../apps/client-sites/**/*.{js,ts,jsx,tsx,astro}',
    '../../apps/internal-tools/**/*.{js,ts,jsx,tsx,astro}',
  ],
  
  // Theme configuration is now in CSS via @theme directive
  // See: ./src/styles/globals.css
  
  // V4.0 uses CSS-first configuration, but some tools still need these references
  theme: {
    // These are placeholders - actual values are in CSS @theme
    extend: {
      // Colors are defined in CSS @theme as --color-* variables
      // Typography is defined in CSS @theme as --font-* variables
      // Spacing is defined in CSS @theme as --spacing variable
      // Breakpoints are defined in CSS @theme as --breakpoint-* variables
    },
  },
  
  // V4.0 plugins - most are built-in now
  plugins: [],
  
  // Prefix for utility classes (if needed)
  prefix: '',
  
  // Important utility for specificity
  important: false,
  
  // Core plugins (v4.0 has most built-in)
  corePlugins: {
    // All core plugins are enabled by default in v4.0
    // Use false to disable specific plugins if needed
  },
};
