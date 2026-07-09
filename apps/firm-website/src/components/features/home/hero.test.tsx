import { render, screen } from '@testing-library/react';
import { Hero } from './hero';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() { return []; }
  unobserve() {}
} as any;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

describe('Hero', () => {
  it('renders headline with primary text', () => {
    render(<Hero />);
    expect(screen.getByText('Professional Marketing Services')).toBeInTheDocument();
    expect(screen.getByText('For Local Businesses')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<Hero />);
    expect(
      screen.getByText(/We help local businesses grow with affordable, high-quality marketing services/)
    ).toBeInTheDocument();
  });

  it('renders contact CTA button linking to /contact', () => {
    render(<Hero />);
    const contactButton = screen.getByRole('link', { name: /Book a Free Consultation/i });
    expect(contactButton).toBeInTheDocument();
    expect(contactButton).toHaveAttribute('href', '/contact');
  });

  it('renders demos CTA button linking to /demos', () => {
    render(<Hero />);
    const demosButton = screen.getByRole('link', { name: /See a Demo Site/i });
    expect(demosButton).toBeInTheDocument();
    expect(demosButton).toHaveAttribute('href', '/demos');
  });

  it('renders both CTA buttons', () => {
    render(<Hero />);
    const buttons = screen.getAllByRole('link');
    const ctaButtons = buttons.filter((button) =>
      button.textContent?.includes('Book') || button.textContent?.includes('See a Demo')
    );
    expect(ctaButtons).toHaveLength(2);
  });

  it('renders feature statistics', () => {
    render(<Hero />);
    expect(screen.getByText('500+')).toBeInTheDocument();
    expect(screen.getByText('Local Businesses Served')).toBeInTheDocument();
    expect(screen.getByText('98%')).toBeInTheDocument();
    expect(screen.getByText('Client Satisfaction Rate')).toBeInTheDocument();
  });
});
