import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

/**
 * Root Vitest Workspace Configuration
 * 
 * This configuration sets up a monorepo-wide testing environment with:
 * - Workspace support for multiple packages
 * - Shared test utilities and setup
 * - Comprehensive coverage reporting
 * - Type checking integration
 * - Performance optimizations
 */

export default defineConfig({
  test: {
    // Global test configuration
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./packages/testing/src/setup/global-setup.ts'],
    
    // Performance and optimization
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: 4,
        minThreads: 1,
      },
    },
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/**',
        'coverage/**',
        'dist/**',
        '.next/**',
        '.turbo/**',
        '**/*.config.{js,ts,mjs}',
        '**/*.d.ts',
        '**/test/**',
        '**/__tests__/**',
        '**/*.test.{js,ts,jsx,tsx}',
        '**/*.spec.{js,ts,jsx,tsx}',
        'packages/testing/**', // Exclude test utilities from coverage
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    
    // Reporting and output
    reporter: ['verbose', 'json', 'html'],
    outputFile: {
      json: './test-results/results.json',
    },
    
    // Watch mode configuration
    watchExclude: [
      'node_modules/**',
      'dist/**',
      '.next/**',
      'coverage/**',
    ],
    
    // Test file patterns
    include: [
      '**/*.{test,spec}.{js,ts,jsx,tsx}',
    ],
    exclude: [
      'node_modules/**',
      'dist/**',
      '.next/**',
      'coverage/**',
    ],
    
    // Timeout and retry configuration
    testTimeout: 10000,
    hookTimeout: 10000,
    bail: 5, // Stop after 5 failed tests
    
    // Global environment variables
    env: {
      NODE_ENV: 'test',
      TS_PROJECT: './tsconfig.json',
    },
    // Test projects (monorepo workspace)
    projects: [
      // UI Components Package
      {
        test: {
          name: 'ui-components',
          root: './packages/ui-components',
          environment: 'jsdom',
          setupFiles: ['./src/test/setup.ts'],
          include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
        },
      },

      // Design System Package
      {
        test: {
          name: 'design-system',
          root: './packages/design-system',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
        },
      },

      // Types Package
      {
        test: {
          name: 'types',
          root: './packages/types',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
        },
      },

      // Analytics Package
      {
        test: {
          name: 'analytics',
          root: './packages/analytics',
          environment: 'jsdom',
          include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
        },
      },

      // Platform Auth Package
      {
        test: {
          name: 'platform-auth',
          root: './packages/platform/auth',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
        },
      },

      // Platform CMS Package
      {
        test: {
          name: 'platform-cms',
          root: './packages/platform/cms',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
        },
      },

      // Platform Database Package
      {
        test: {
          name: 'platform-database',
          root: './packages/platform/database',
          environment: 'node',
          setupFiles: ['./src/test/setup.ts'],
          include: ['src/**/*.{test,spec}.{js,ts}'],
        },
      },

      // Shared Monitoring Package
      {
        test: {
          name: 'shared-monitoring',
          root: './packages/shared/monitoring',
          environment: 'jsdom',
          include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
        },
      },

      // Shared SEO Package
      {
        test: {
          name: 'shared-seo',
          root: './packages/shared/seo',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
        },
      },

      // Shared Utils Package
      {
        test: {
          name: 'shared-utils',
          root: './packages/shared/utils',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
        },
      },

      // Testing Package
      {
        test: {
          name: 'testing',
          root: './packages/testing',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
        },
      },

      // Agency Website App
      {
        test: {
          name: 'agency-website',
          root: './apps/agency-website',
          environment: 'jsdom',
          include: ['src/**/*.{test,spec}.{js,ts}'],
        },
      },

      // Client Alpha App
      {
        test: {
          name: 'client-alpha',
          root: './apps/client-sites/client-alpha',
          environment: 'jsdom',
          include: ['src/**/*.{test,spec}.{js,ts}'],
        },
      },

      // Client Beta App
      {
        test: {
          name: 'client-beta',
          root: './apps/client-sites/client-beta',
          environment: 'jsdom',
          include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
        },
      },

      // Project Manager App
      {
        test: {
          name: 'project-manager',
          root: './apps/internal-tools/project-manager',
          environment: 'jsdom',
          include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
        },
      },
    ],
  },

  // Resolve configuration for workspace packages
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@agency/test': resolve(__dirname, './packages/testing/src'),
      '@agency/types': resolve(__dirname, './packages/types/src'),
      '@agency/design-system': resolve(__dirname, './packages/design-system/src'),
      '@agency/ui-components': resolve(__dirname, './packages/ui-components/src'),
      '@agency/analytics': resolve(__dirname, './packages/analytics/src'),
      '@agency/platform-auth': resolve(__dirname, './packages/platform/auth/src'),
      '@agency/platform-cms': resolve(__dirname, './packages/platform/cms/src'),
      '@agency/platform-database': resolve(__dirname, './packages/platform/database/src'),
      '@agency/shared-monitoring': resolve(__dirname, './packages/shared/monitoring/src'),
      '@agency/shared-seo': resolve(__dirname, './packages/shared/seo/src'),
      '@agency/shared-utils': resolve(__dirname, './packages/shared/utils/src'),
    },
  },
});
