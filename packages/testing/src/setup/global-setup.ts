/**
 * Global Test Setup
 *
 * This file sets up the global testing environment for all packages in the monorepo.
 * It configures testing utilities, mocks, and global settings.
 */

// Import testing utilities
import '@testing-library/jest-dom';
import { vi, expect, beforeAll, afterEach, afterAll } from 'vitest';

// Mock design system styles globally
// import '@agency/design-system/styles/globals.css';

// Global test configuration
beforeAll(() => {
  // Set up global test environment
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock IntersectionObserver
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })),
  });

  // Mock ResizeObserver
  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })),
  });

  // Mock fetch API
  global.fetch = vi.fn();
});

// Cleanup after each test
afterEach(() => {
  // Clear all mocks
  vi.clearAllMocks();

  // Reset DOM
  document.body.innerHTML = '';

  // Reset fetch mock
  if (global.fetch) {
    (global.fetch as any).mockReset();
  }
});

// Global cleanup
afterAll(() => {
  // Clean up any global state
  vi.restoreAllMocks();
});

// Extend Vitest's matchers with custom matchers
import '@testing-library/jest-dom/matchers';

// Custom matchers can be added here
expect.extend({
  // Example custom matcher for checking if element has specific design system class
  toHaveDesignSystemClass(received: HTMLElement, className: string) {
    const pass = received.classList.contains(className);
    return {
      pass,
      message: () =>
        pass
          ? `expected element not to have design system class "${className}"`
          : `expected element to have design system class "${className}"`,
    };
  },
});

// Type augmentation for custom matchers
declare module 'vitest' {
  interface Assertion<T = any> {
    toHaveDesignSystemClass(className: string): T;
  }
}
