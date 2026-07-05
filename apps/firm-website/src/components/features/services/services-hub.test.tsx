import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { ServicesHub } from './services-hub';

// Mock content utilities
vi.mock('@/lib/content', () => ({
  getAllServices: vi.fn(() => Promise.resolve([])),
}));

describe('ServicesHub', () => {
  it('renders without crashing', async () => {
    render(await <ServicesHub />);
  });
});
