/**
 * Astro Testing Utilities
 *
 * Astro-specific testing utilities for the monorepo.
 */

export function createAstroTestUtils() {
  return {
    // Astro component testing utilities will be added here
    renderAstroComponent: async (_component: unknown, _props?: unknown) => {
      // Placeholder for Astro component rendering
      return { html: '', status: 200 };
    },
  };
}
