import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './theme-toggle';

const mockSetTheme = vi.fn();

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: mockSetTheme,
  }),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
  });

  it('renders button with sun icon when theme is light', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('calls setTheme with "dark" when clicked in light mode', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('has screen reader text for accessibility', () => {
    render(<ThemeToggle />);
    const srText = screen.getByText('Toggle theme');
    expect(srText).toBeInTheDocument();
    expect(srText).toHaveClass('sr-only');
  });
});
