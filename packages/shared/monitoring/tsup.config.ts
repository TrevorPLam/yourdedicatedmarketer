import { defineConfig } from 'tsup';

export default defineConfig([
  // Main bundle
  {
    entry: {
      index: 'src/index.ts',
      react: 'src/react.ts',
      astro: 'src/astro.ts',
      nextjs: 'src/nextjs.ts'
    },
    format: ['esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    external: [
      'react',
      'react-dom',
      'next',
      'astro',
      '@sentry/nextjs',
      '@sentry/react',
      '@sentry/node',
      '@sentry/core'
    ]
  }
]);
