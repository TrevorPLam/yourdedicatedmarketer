import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'adapters/index': 'src/adapters/index.ts',
    'migrations/index': 'src/migrations/index.ts',
    'types/index': 'src/types/index.ts',
  },
  format: ['esm'],
  dts: {
    resolve: true,
  },
  clean: true,
  sourcemap: true,
  splitting: false,
  minify: false,
  outExtension: () => ({
    js: '.js',
  }),
  tsconfig: 'tsconfig.build.json',
});