import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders button with default variant', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toHaveClass('bg-destructive');
  });

  it('applies size classes correctly', () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole('button', { name: 'Large Button' });
    expect(button).toHaveClass('h-11');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders gradient variant', () => {
    render(<Button variant="gradient">Gradient</Button>);
    const button = screen.getByRole('button', { name: 'Gradient' });
    expect(button).toHaveClass('bg-gradient-primary');
  });

  it('renders gradient-accent variant', () => {
    render(<Button variant="gradient-accent">Gradient Accent</Button>);
    const button = screen.getByRole('button', { name: 'Gradient Accent' });
    expect(button).toHaveClass('bg-gradient-accent');
  });

  it('renders gradient-secondary variant', () => {
    render(<Button variant="gradient-secondary">Gradient Secondary</Button>);
    const button = screen.getByRole('button', { name: 'Gradient Secondary' });
    expect(button).toHaveClass('bg-gradient-secondary');
  });

  it('renders glow variant', () => {
    render(<Button variant="glow">Glow</Button>);
    const button = screen.getByRole('button', { name: 'Glow' });
    expect(button).toHaveClass('hover:shadow-lg');
  });

  it('shows loading spinner when loading is true', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button', { name: 'Loading' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('does not show loading spinner when loading is false', () => {
    render(<Button loading={false}>Not Loading</Button>);
    const button = screen.getByRole('button', { name: 'Not Loading' });
    expect(button).not.toBeDisabled();
    expect(button).not.toHaveAttribute('aria-busy', 'true');
    expect(button.querySelector('.animate-spin')).not.toBeInTheDocument();
  });

  it('disables button when loading and disabled are both true', () => {
    render(<Button loading disabled>Double Disabled</Button>);
    const button = screen.getByRole('button', { name: 'Double Disabled' });
    expect(button).toBeDisabled();
  });
});
