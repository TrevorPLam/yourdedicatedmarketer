import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { FAQHub } from './faq-hub';

// Mock content utilities
vi.mock('@/lib/content', () => ({
  getAllFAQs: vi.fn(() => Promise.resolve([])),
}));

// Mock JSON-LD utility
vi.mock('@/lib/json-ld', () => ({
  generateFAQSchema: vi.fn(() => '{"@context":"https://schema.org","@type":"FAQPage"}'),
}));

describe('FAQHub', () => {
  it('renders without crashing', async () => {
    render(await <FAQHub />);
  });
});
