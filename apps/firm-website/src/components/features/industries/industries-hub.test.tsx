import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { IndustriesHub } from './industries-hub';

// Mock content utilities
vi.mock('@/lib/content', () => ({
  getAllIndustries: vi.fn(() => Promise.resolve([])),
}));

describe('IndustriesHub', () => {
  it('renders without crashing', async () => {
    render(await <IndustriesHub />);
  });
});
