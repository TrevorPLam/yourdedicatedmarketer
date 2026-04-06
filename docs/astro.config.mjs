import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Marketing Agency Docs',
      description: 'Comprehensive documentation for the marketing agency monorepo',
      logo: {
        src: './src/assets/logo.svg',
        replacesTitle: true,
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/your-org/marketing-agency-monorepo',
        },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', slug: 'guides/intro' },
            { label: 'Quick Start', slug: 'guides/quickstart' },
            { label: 'Development Setup', slug: 'guides/dev-setup' },
          ],
        },
        {
          label: 'Onboarding',
          items: [
            { label: 'Developer Guide', slug: 'onboarding/developer-guide' },
          ],
        },
      ],
      customCss: [
        './src/styles/custom.css',
      ],
      components: {
        Head: './src/components/Head.astro',
        PageTitle: './src/components/PageTitle.astro',
      },
      editLink: {
        baseUrl: 'https://github.com/your-org/marketing-agency-monorepo/edit/main/docs/src/content/docs/',
      },
      lastUpdated: true,
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 3,
      },
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'English',
          lang: 'en',
        },
      },
    }),
  ],
  server: {
    port: 4322,
  },
  build: {
    format: 'directory',
  },
  vite: {
    optimizeDeps: {
      exclude: ['@astrojs/starlight'],
    },
  },
});
