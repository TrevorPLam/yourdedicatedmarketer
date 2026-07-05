import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      thresholds: {
        statements: 80,
        lines: 80,
        functions: 80,
        branches: 80
      },
      exclude: [
        'src/**/*.d.ts',
        'src/**/index.ts',
      ],
    }
  },
});
