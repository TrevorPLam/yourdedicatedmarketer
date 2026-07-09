import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './error';

describe('Error Boundary', () => {
  const mockError = new Error('Test error');
  mockError.stack = 'Test stack trace';

  const mockReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('logs error to console in development', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    // @ts-expect-error - NODE_ENV is read-only in some environments
    process.env.NODE_ENV = 'development';

    const consoleErrorSpy = vi.spyOn(console, 'error');

    render(<ErrorBoundary error={mockError} reset={mockReset} />);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error boundary caught:', mockError);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error message:', 'Test error');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error stack:', 'Test stack trace');

    consoleErrorSpy.mockRestore();
    // @ts-expect-error - NODE_ENV is read-only in some environments
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('does not log error to console in production', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    // @ts-expect-error - NODE_ENV is read-only in some environments
    process.env.NODE_ENV = 'production';

    const consoleErrorSpy = vi.spyOn(console, 'error');

    render(<ErrorBoundary error={mockError} reset={mockReset} />);

    expect(consoleErrorSpy).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
    // @ts-expect-error - NODE_ENV is read-only in some environments
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('displays error details in development', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    // @ts-expect-error - NODE_ENV is read-only in some environments
    process.env.NODE_ENV = 'development';

    render(<ErrorBoundary error={mockError} reset={mockReset} />);

    expect(screen.getByText('Error details (development only)')).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Test error'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Test stack trace'))).toBeInTheDocument();

    // @ts-expect-error - NODE_ENV is read-only in some environments
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('hides error details in production', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    // @ts-expect-error - NODE_ENV is read-only in some environments
    process.env.NODE_ENV = 'production';

    render(<ErrorBoundary error={mockError} reset={mockReset} />);

    expect(screen.queryByText('Error details (development only)')).not.toBeInTheDocument();
    expect(screen.queryByText('Test error')).not.toBeInTheDocument();
    expect(screen.queryByText('Test stack trace')).not.toBeInTheDocument();

    // @ts-expect-error - NODE_ENV is read-only in some environments
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('calls reset function when Try again button is clicked', () => {
    render(<ErrorBoundary error={mockError} reset={mockReset} />);

    const tryAgainButton = screen.getByText('Try again');
    tryAgainButton.click();

    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
