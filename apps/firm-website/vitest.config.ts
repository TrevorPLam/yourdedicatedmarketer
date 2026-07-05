import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
    clearMocks: true,
    css: true,
    pool: 'threads',
    isolate: true,
    fileParallelism: true,
    dir: './src',
    experimental: {
      fsModuleCache: true,
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75
      },
      exclude: [
        'src/**/*.d.ts',
        'src/**/index.ts',
        'src/app/**/layout.tsx',
      ],
    }
  },
})
