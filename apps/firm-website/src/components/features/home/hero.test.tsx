import { render, screen } from '@testing-library/react';
import { Hero } from './hero';

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
});
