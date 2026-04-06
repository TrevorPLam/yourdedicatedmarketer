/**
 * Database Testing Utilities
 *
 * Database-specific testing utilities for the monorepo.
 */

import { vi } from 'vitest';

export function createDatabaseMocks() {
  return {
    mockQuery: vi.fn(),
    mockTransaction: vi.fn(),
    mockConnection: {
      query: vi.fn(),
      transaction: vi.fn(),
      close: vi.fn(),
    },
  };
}

export function setupDatabaseTestUtils() {
  const mocks = createDatabaseMocks();

  // Mock database operations
  mocks.mockQuery.mockResolvedValue({ rows: [], rowCount: 0 });
  mocks.mockTransaction.mockResolvedValue({ commit: vi.fn(), rollback: vi.fn() });

  return mocks;
}
