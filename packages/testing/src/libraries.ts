/**
 * Testing Library Re-exports
 *
 * Separate file for commonly used testing library exports
 * to keep the main index file focused on internal utilities
 */

// Vitest exports
export { vi, expect, describe, it, test, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

// Testing Library exports
export { screen, waitFor, fireEvent } from '@testing-library/dom';
export { default as user } from '@testing-library/user-event';
