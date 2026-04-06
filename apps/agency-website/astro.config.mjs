import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { SITE_CONFIG } from './src/site.config.js';

export default defineConfig({
  site: SITE_CONFIG.site,
  integrations: [
    react(),
    // Tailwind v4.0 doesn't use @astrojs/tailwind integration
  ],
  output: 'static',
  build: {
    format: 'directory',
  },
  vite: {
    optimizeDeps: {
      include: ['react', 'react-dom'],
      exclude: ['@agency/design-system'],
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
  security: {
    csp: true
  },
  devToolbar: {
    enabled: true,
  },
});
