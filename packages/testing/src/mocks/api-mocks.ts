// API mocks for testing
import { vi } from 'vitest';

export const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  patch: vi.fn(),
};

export function setupApiMocks() {
  mockApi.get.mockResolvedValue({ data: [], success: true });
  mockApi.post.mockResolvedValue({ data: {}, success: true });
  mockApi.put.mockResolvedValue({ data: {}, success: true });
  mockApi.delete.mockResolvedValue({ data: {}, success: true });
  mockApi.patch.mockResolvedValue({ data: {}, success: true });
}
