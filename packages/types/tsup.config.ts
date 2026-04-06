import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'api/index': 'src/api/index.ts',
    'cms/index': 'src/cms/index.ts',
    'database/index': 'src/database/index.ts'
  },
  format: ['esm'],
  dts: {
    resolve: true,
  },
  clean: true,
  external: [],
  splitting: false,
  sourcemap: true,
  minify: false,
  outExtension: () => ({
    js: '.js',
  }),
  tsconfig: 'tsconfig.build.json',
  onSuccess: async () => {
    console.log('✅ Types package built successfully');
  }
});
