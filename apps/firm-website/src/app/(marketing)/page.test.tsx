import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from './page';

// Mock the env module
vi.mock('@/lib/env', () => ({
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://yourdedicatedmarketer.com',
    NEXT_PUBLIC_GA_MEASUREMENT_ID: 'G-XXXXXXXXXX',
    NEXT_PUBLIC_SENTRY_DSN: 'https://xxxx@xxxx.ingest.sentry.io/xxxx',
    RESEND_API_KEY: 're_test',
    CONTACT_EMAIL: 'hello@yourdedicatedmarketer.com',
    FROM_EMAIL: 'noreply@yourdedicatedmarketer.com',
  },
}));

// Mock the components
vi.mock('@/components/features/home/hero', () => ({
  Hero: () => <div data-testid="hero">Hero Section</div>,
}));

vi.mock('@/components/features/home/pillars', () => ({
  Pillars: () => <div data-testid="pillars">Pillars Section</div>,
}));

vi.mock('@/components/features/home/demo-preview', () => ({
  DemoPreview: () => <div data-testid="demo-preview">Demo Preview Section</div>,
}));

vi.mock('@/components/features/home/how-it-works', () => ({
  HowItWorks: () => <div data-testid="how-it-works">How It Works Section</div>,
}));

vi.mock('@/components/features/home/faq-snippet', () => ({
  FAQSnippet: () => <div data-testid="faq-snippet">FAQ Snippet Section</div>,
}));

vi.mock('@/components/features/home/final-cta', () => ({
  FinalCTA: () => <div data-testid="final-cta">Final CTA Section</div>,
}));

describe('HomePage', () => {
  it('renders all sections', () => {
    render(<HomePage />);
    
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('pillars')).toBeInTheDocument();
    expect(screen.getByTestId('demo-preview')).toBeInTheDocument();
    expect(screen.getByTestId('how-it-works')).toBeInTheDocument();
    expect(screen.getByTestId('faq-snippet')).toBeInTheDocument();
    expect(screen.getByTestId('final-cta')).toBeInTheDocument();
  });

  it('includes JSON-LD organization schema', () => {
    render(<HomePage />);
    
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
    
    if (script) {
      const schema = JSON.parse(script.textContent || '{}');
      expect(schema['@type']).toBe('Organization');
      expect(schema.name).toBe('Your Dedicated Marketer');
    }
  });
});
