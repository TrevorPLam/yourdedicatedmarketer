import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Button } from '../Button/Button';

describe('Button Component', () => {
  const user = userEvent.setup();

  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('bg-secondary');
  });

  it('applies size classes correctly', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('h-12');
  });

  it('renders with icon', () => {
    render(<Button icon="🔥">With Icon</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    expect(screen.getByText('🔥')).toBeInTheDocument();
  });

  it('supports full width', () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('w-full');
  });

  it('is accessible', async () => {
    const { container } = render(<Button>Accessible Button</Button>);

    // Check for proper button semantics
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    // Check for focus management
    button.focus();
    expect(button).toHaveFocus();
  });
});
