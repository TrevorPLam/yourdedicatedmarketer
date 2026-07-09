import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from './header';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>
      {children}
    </a>
  ),
}));

describe('Header', () => {
  const mockNavItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
  ];

  it('renders header with navigation items', () => {
    render(<Header navItems={mockNavItems} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
  });

  it('renders custom logo when provided', () => {
    const customLogo = <span>Custom Logo</span>;
    render(<Header navItems={mockNavItems} logo={customLogo} />);
    
    expect(screen.getByText('Custom Logo')).toBeInTheDocument();
  });

  it('renders default logo when none provided', () => {
    render(<Header navItems={mockNavItems} />);
    
    expect(screen.getByText('Logo')).toBeInTheDocument();
  });

  it('toggles mobile menu when hamburger button is clicked', () => {
    render(<Header navItems={mockNavItems} />);
    
    const menuButton = screen.getByLabelText('Open menu');
    expect(menuButton).toBeInTheDocument();
    
    fireEvent.click(menuButton);
    
    // Mobile menu should be visible after clicking
    const mobileMenu = screen.getByRole('dialog');
    expect(mobileMenu).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    render(<Header navItems={mockNavItems} />);

    // Theme toggle renders but may not have label in test environment
    const themeToggleButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(themeToggleButton).toBeInTheDocument();
  });

  it('applies glassmorphism class to header', () => {
    const { container } = render(<Header navItems={mockNavItems} />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('header-glass');
  });
});
