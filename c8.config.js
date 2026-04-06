/**
 * Coverage Configuration (c8)
 * 
 * Comprehensive coverage reporting configuration for the monorepo.
 * Uses c8 for Node.js coverage with Vitest integration.
 */

export default {
  // Coverage collection settings
  include: [
    'src/**/*.{js,ts,jsx,tsx}',
    'apps/*/src/**/*.{js,ts,jsx,tsx}',
    'packages/*/src/**/*.{js,ts,jsx,tsx}',
  ],
  
  // Exclude patterns
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
    '**/stories/**', // Exclude Storybook stories
    '**/mocks/**', // Exclude mock files
  ],
  
  // Reporter configuration
  reporter: [
    'text',           // Console output
    'text-summary',   // Summary in console
    'json',           // JSON for CI
    'html',           // HTML report
    'lcov',           // LCOV for coverage services
  ],
  
  // Output directories
  reportsDirectory: 'coverage',
  
  // Coverage thresholds
  thresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // Per-package thresholds
    'packages/ui-components': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    'packages/design-system': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    'packages/types': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  
  // Additional options
  checkCoverage: true,
  branches: 80,
  functions: 80,
  lines: 80,
  statements: 80,
  
  // Exclude files from coverage calculation
  excludeAfterRemap: true,
  
  // Temporary directory for coverage files
  tempDirectory: '.nyc_output',
  
  // Clean output directory before generating reports
  clean: true,
  
  // All files should be considered for coverage
  all: true,
  
  // Skip files with no coverage
  skipFull: false,
  
  // Show uncovered lines
  showUncoveredLines: true,
  
  // Watermarks for coverage visualization
  watermarks: {
    statements: [50, 80],
    functions: [50, 80],
    branches: [50, 80],
    lines: [50, 80],
  },
};
