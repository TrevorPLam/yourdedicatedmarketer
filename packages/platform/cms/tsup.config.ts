import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'adapters/index': 'src/adapters/index.ts',
    'generators/index': 'src/generators/index.ts',
    'preview/index': 'src/preview/index.ts',
    'types/index': 'src/types/index.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  external: [
    '@agency/types',
    'contentful',
    '@sanity/client',
    '@sanity/codegen',
    'graphql',
    'graphql-request',
  ],
  treeshake: true,
  splitting: false,
  minify: false,
});
