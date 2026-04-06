/**
 * Tailwind CSS v4.0 Configuration for @agency/ui-components
 *
 * In v4.0, most configuration lives in CSS via the @theme directive.
 * This file exists so the ./tailwind package export resolves and
 * downstream consumers can reference it from their own Tailwind configs.
 *
 * Note: In v4.0 content scanning is automatic; the paths below are kept
 * as reference for tools that still require an explicit content list.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Component-level theme extensions are declared in
      // src/styles/globals.css under the @theme directive.
    },
  },
  plugins: [],
};
