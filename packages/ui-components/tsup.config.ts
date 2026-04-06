import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    react: 'src/react/index.ts',
    astro: 'src/astro/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: false, // Temporarily disabled for Next.js security upgrade
  clean: true,
  external: ['react', 'react-dom', 'astro'],
  splitting: false,
  sourcemap: true,
  minify: false,
  treeshake: true, // Enable tree shaking for unused exports
  onSuccess: async () => {
    // Copy styles after build
    const { copyFile } = await import('fs/promises');
    try {
      await copyFile('src/styles/globals.css', 'dist/styles.css');
    } catch (error) {
      console.warn('Could not copy styles:', error);
    }
  },
});
