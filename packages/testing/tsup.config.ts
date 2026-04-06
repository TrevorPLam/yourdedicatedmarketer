import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'react': 'src/react.tsx',
    'astro': 'src/astro.ts',
    'database': 'src/database.ts',
  },
  format: ['esm'],
  dts: {
    resolve: true,
  },
  clean: true,
  sourcemap: true,
  external: [
    'react',
    'react-dom',
    'astro',
    'vitest',
    'jsdom',
    '@testing-library/react',
    '@testing-library/dom',
    '@testing-library/jest-dom',
    '@testing-library/user-event',
    '@agency/design-system',
    '@faker-js/faker',
  ],
  splitting: false,
  minify: false,
  outExtension: () => ({
    js: '.js',
  }),
  tsconfig: 'tsconfig.build.json',
});
