import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'tokens/index': 'src/tokens/index.ts',
    'themes/index': 'src/themes/index.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  tsconfig: 'tsconfig.build.json',
  external: [
    'react',
    'react-dom',
    'tailwindcss',
    '@tailwindcss/cli',
    '@tailwindcss/postcss',
    '@agency/types',
  ],
  splitting: false,
  minify: false,
});
