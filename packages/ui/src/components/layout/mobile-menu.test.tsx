import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileMenu } from './mobile-menu';

describe('MobileMenu', () => {
  const mockNavItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
  ];

  beforeEach(() => {
    // Reset body style before each test
    document.body.style.overflow = '';
  });

  afterEach(() => {
    // Clean up body style after each test
    document.body.style.overflow = '';
  });

  it('does not render when isOpen is false', () => {
    render(<MobileMenu isOpen={false} onClose={vi.fn()} navItems={mockNavItems} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders menu when isOpen is true', () => {
    render(<MobileMenu isOpen={true} onClose={vi.fn()} navItems={mockNavItems} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('renders navigation items', () => {
    render(<MobileMenu isOpen={true} onClose={vi.fn()} navItems={mockNavItems} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
  });

  it('sets body overflow to hidden when open', () => {
    render(<MobileMenu isOpen={true} onClose={vi.fn()} navItems={mockNavItems} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('resets body overflow when closed', () => {
    const { rerender } = render(
      <MobileMenu isOpen={true} onClose={vi.fn()} navItems={mockNavItems} />
    );
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<MobileMenu isOpen={false} onClose={vi.fn()} navItems={mockNavItems} />);
    expect(document.body.style.overflow).toBe('');
  });

  it('calls onClose when overlay is clicked', () => {
    const handleClose = vi.fn();
    render(<MobileMenu isOpen={true} onClose={handleClose} navItems={mockNavItems} />);
    
    const overlay = document.querySelector('.fixed.inset-0') as HTMLElement;
    overlay?.click();
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<MobileMenu isOpen={true} onClose={handleClose} navItems={mockNavItems} />);
    
    const closeButton = screen.getByLabelText('Close menu');
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when nav item is clicked', () => {
    const handleClose = vi.fn();
    render(<MobileMenu isOpen={true} onClose={handleClose} navItems={mockNavItems} />);
    
    const homeLink = screen.getByText('Home');
    homeLink.click();
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(<MobileMenu isOpen={true} onClose={handleClose} navItems={mockNavItems} />);
    
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(escapeEvent);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when other keys are pressed', () => {
    const handleClose = vi.fn();
    render(<MobileMenu isOpen={true} onClose={handleClose} navItems={mockNavItems} />);
    
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    document.dispatchEvent(enterEvent);
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('applies active class to current path', () => {
    render(
      <MobileMenu isOpen={true} onClose={vi.fn()} navItems={mockNavItems} currentPath="/about" />
    );
    const aboutLink = screen.getByText('About');
    expect(aboutLink).toHaveClass('text-primary', 'font-semibold');
  });

  it('has proper accessibility attributes', () => {
    render(<MobileMenu isOpen={true} onClose={vi.fn()} navItems={mockNavItems} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'Navigation menu');
  });

  it('renders empty nav items array', () => {
    render(<MobileMenu isOpen={true} onClose={vi.fn()} navItems={[]} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });

  it('forwards ref to menu panel', () => {
    const ref = { current: null };
    render(<MobileMenu isOpen={true} onClose={vi.fn()} navItems={mockNavItems} ref={ref} />);
    expect(ref.current).not.toBeNull();
  });
});
