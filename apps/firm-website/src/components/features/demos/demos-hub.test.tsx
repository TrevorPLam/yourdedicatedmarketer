import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { DemosHub } from './demos-hub';

// Mock content utilities
vi.mock('@/lib/content', () => ({
  getAllDemos: vi.fn(() => Promise.resolve([])),
}));

describe('DemosHub', () => {
  it('renders without crashing', async () => {
    render(await <DemosHub />);
  });
});
