import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';

// CSS imports are not needed in unit test environments
// import '@agency/design-system/styles/globals.css';

// Global test cleanup
afterEach(() => {
  vi.clearAllMocks();
});
