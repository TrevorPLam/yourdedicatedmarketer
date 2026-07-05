import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './footer';
import { Twitter, Linkedin } from 'lucide-react';

describe('Footer', () => {
  it('renders footer with logo and description', () => {
    render(<Footer />);
    expect(screen.getByText('Your Dedicated Marketer')).toBeInTheDocument();
    expect(
      screen.getByText('Professional marketing services to help your business grow.')
    ).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    const navLinks = [
      { href: '/about', label: 'About' },
      { href: '/services', label: 'Services' },
    ];

    render(<Footer navLinks={navLinks} />);
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
  });

  it('renders contact information', () => {
    const contactInfo = {
      email: 'test@example.com',
      phone: '+1 555-123-4567',
      address: '123 Test St',
    };

    render(<Footer contactInfo={contactInfo} />);
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('+1 555-123-4567')).toBeInTheDocument();
    expect(screen.getByText('123 Test St')).toBeInTheDocument();
  });

  it('renders social links with proper accessibility', () => {
    const socialLinks = [
      { href: 'https://twitter.com', icon: <Twitter className="h-5 w-5" />, label: 'Twitter' },
      { href: 'https://linkedin.com', icon: <Linkedin className="h-5 w-5" />, label: 'LinkedIn' },
    ];

    render(<Footer socialLinks={socialLinks} />);
    expect(screen.getByText('Follow Us')).toBeInTheDocument();
    
    const twitterLink = screen.getByLabelText('Twitter');
    expect(twitterLink).toBeInTheDocument();
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com');
    expect(twitterLink).toHaveAttribute('target', '_blank');
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');

    const linkedinLink = screen.getByLabelText('LinkedIn');
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com');
  });

  it('renders copyright notice', () => {
    const copyright = '© 2025 Test Company. All rights reserved.';
    render(<Footer copyright={copyright} />);
    expect(screen.getByText(copyright)).toBeInTheDocument();
  });

  it('renders custom logo when provided', () => {
    const customLogo = <span>Custom Logo</span>;
    render(<Footer logo={customLogo} />);
    expect(screen.getByText('Custom Logo')).toBeInTheDocument();
    expect(screen.queryByText('Your Dedicated Marketer')).not.toBeInTheDocument();
  });

  it('does not render navigation section when no navLinks provided', () => {
    render(<Footer navLinks={[]} />);
    expect(screen.queryByText('Navigation')).not.toBeInTheDocument();
  });

  it('does not render contact section when no contactInfo provided', () => {
    render(<Footer contactInfo={{}} />);
    expect(screen.queryByText('Contact')).not.toBeInTheDocument();
  });

  it('does not render social section when no socialLinks provided', () => {
    render(<Footer socialLinks={[]} />);
    expect(screen.queryByText('Follow Us')).not.toBeInTheDocument();
  });
});
