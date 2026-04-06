import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
// import i18n from "astro-i18n-aut";
import { SITE_CONFIG } from './src/site.config.js';

export default defineConfig({
  // site: SITE_CONFIG,
  integrations: [
    react(),
    // Tailwind v4.0 doesn't use @astrojs/tailwind integration
    // i18n({
    //   include: ["src/pages/**/*"],
    //   exclude: ["src/pages/api/**/*"],
    //   defaultLocale: "en",
    //   locales: ["en", "es", "fr", "de"],
    //   fallbackLocale: "en",
    //   routing: {
    //     prefixDefaultLocale: false,
    //   },
    // }),
  ],
  output: 'static',
  build: {
    format: 'directory',
  },
  vite: {
    optimizeDeps: {
      exclude: ['@agency/design-system'],
    },
    build: {
      rollupOptions: {
        external: ['react', 'react-dom', 'react-dom/server'],
      },
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
  security: {
    // CSP is enabled. Shiki syntax highlighting renders inline styles, so
    // 'unsafe-inline' is required for style-src. Script hashes are handled
    // automatically by Astro's built-in CSP support.
    csp: {
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'"],
        // Shiki emits inline style attributes for syntax highlighting colors.
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'font-src': ["'self'"],
        'connect-src': ["'self'"],
        'frame-ancestors': ["'none'"],
      },
    },
  },
  devToolbar: {
    enabled: true,
  },
});
