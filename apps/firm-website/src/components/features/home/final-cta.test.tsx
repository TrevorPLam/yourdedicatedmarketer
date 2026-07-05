import { render, screen } from '@testing-library/react';
import { FinalCTA } from './final-cta';

describe('FinalCTA', () => {
  it('renders headline', () => {
    render(<FinalCTA />);
    expect(screen.getByText('Ready to Grow Your Business?')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<FinalCTA />);
    expect(
      screen.getByText(/Book a free consultation to discuss your marketing needs/)
    ).toBeInTheDocument();
  });

  it('renders CTA button linking to /contact', () => {
    render(<FinalCTA />);
    const ctaButton = screen.getByRole('link', { name: /Book a Free Consultation/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute('href', '/contact');
  });

  it('renders with primary background styling', () => {
    const { container } = render(<FinalCTA />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-primary');
  });
});
