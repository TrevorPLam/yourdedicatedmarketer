import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { FAQSnippet } from './faq-snippet';

// Mock content utilities
vi.mock('@/lib/content', () => ({
  getAllFAQs: vi.fn(() => Promise.resolve([])),
}));

describe('FAQSnippet', () => {
  it('renders without crashing', async () => {
    render(await <FAQSnippet />);
  });
});
