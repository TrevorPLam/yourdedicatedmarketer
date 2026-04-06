import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    astro: 'src/astro.ts',
    react: 'src/react.ts',
    types: 'src/types.ts'
  },
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'astro'],
  splitting: false,
  sourcemap: true,
  minify: false,
});
