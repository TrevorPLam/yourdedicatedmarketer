import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { DemoPreview } from './demo-preview';

// Mock content utilities
vi.mock('@/lib/content', () => ({
  getAllDemos: vi.fn(() => Promise.resolve([])),
}));

describe('DemoPreview', () => {
  it('renders without crashing', async () => {
    render(await <DemoPreview />);
  });
});
