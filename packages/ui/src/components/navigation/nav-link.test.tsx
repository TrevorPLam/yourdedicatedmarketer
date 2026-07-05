import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NavLink } from './nav-link';

describe('NavLink', () => {
  it('renders link with text children', () => {
    render(<NavLink href="/about">About</NavLink>);
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('renders link with non-text children', () => {
    render(
      <NavLink href="/about">
        <span data-testid="custom-child">Custom Link</span>
      </NavLink>
    );
    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<NavLink className="custom-class" href="/about">About</NavLink>);
    const link = screen.getByText('About').parentElement;
    expect(link).toHaveClass('custom-class');
  });

  it('applies active styles when isActive is true', () => {
    render(<NavLink isActive href="/about">About</NavLink>);
    const activeSpan = screen.getByText('About');
    expect(activeSpan).toHaveClass('text-primary', 'font-semibold');
  });

  it('does not apply active styles when isActive is false', () => {
    render(<NavLink isActive={false} href="/about">About</NavLink>);
    const inactiveSpan = screen.getByText('About');
    expect(inactiveSpan).not.toHaveClass('text-primary', 'font-semibold');
  });

  it('applies custom activeClassName when isActive is true', () => {
    render(
      <NavLink isActive activeClassName="custom-active" href="/about">
        About
      </NavLink>
    );
    const activeSpan = screen.getByText('About');
    expect(activeSpan).toHaveClass('custom-active');
  });

  it('sets aria-current when isActive is true', () => {
    render(<NavLink isActive href="/about">About</NavLink>);
    const link = screen.getByText('About').parentElement;
    expect(link).toHaveAttribute('aria-current', 'page');
  });

  it('does not set aria-current when isActive is false', () => {
    render(<NavLink isActive={false} href="/about">About</NavLink>);
    const link = screen.getByText('About').parentElement;
    expect(link).not.toHaveAttribute('aria-current');
  });

  it('passes through additional props', () => {
    render(<NavLink data-testid="nav-link" href="/about">About</NavLink>);
    const link = screen.getByTestId('nav-link');
    expect(link).toBeInTheDocument();
  });

  it('forwards ref to link', () => {
    const ref = { current: null };
    render(<NavLink ref={ref} href="/about">About</NavLink>);
    expect(ref.current).not.toBeNull();
  });

  it('handles onClick event', () => {
    const handleClick = vi.fn();
    render(<NavLink onClick={handleClick} href="/about">About</NavLink>);
    const link = screen.getByText('About').parentElement;
    link?.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
