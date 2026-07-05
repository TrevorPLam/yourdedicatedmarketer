import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Container } from './container';

describe('Container', () => {
  it('renders container with default xl maxWidth', () => {
    render(<Container>Container content</Container>);
    const container = screen.getByText('Container content');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('max-w-xl');
  });

  it('renders container with sm maxWidth', () => {
    render(<Container maxWidth="sm">Small container</Container>);
    const container = screen.getByText('Small container');
    expect(container).toHaveClass('max-w-sm');
  });

  it('renders container with md maxWidth', () => {
    render(<Container maxWidth="md">Medium container</Container>);
    const container = screen.getByText('Medium container');
    expect(container).toHaveClass('max-w-md');
  });

  it('renders container with lg maxWidth', () => {
    render(<Container maxWidth="lg">Large container</Container>);
    const container = screen.getByText('Large container');
    expect(container).toHaveClass('max-w-lg');
  });

  it('renders container with full maxWidth', () => {
    render(<Container maxWidth="full">Full width container</Container>);
    const container = screen.getByText('Full width container');
    expect(container).toHaveClass('max-w-full');
  });

  it('applies horizontal padding classes', () => {
    render(<Container>Content</Container>);
    const container = screen.getByText('Content');
    expect(container).toHaveClass('mx-auto', 'px-4', 'sm:px-6', 'lg:px-8');
  });

  it('applies custom className', () => {
    render(<Container className="custom-class">Content</Container>);
    const container = screen.getByText('Content');
    expect(container).toHaveClass('custom-class');
  });

  it('forwards ref to container', () => {
    const ref = { current: null };
    render(<Container ref={ref}>Content</Container>);
    expect(ref.current).not.toBeNull();
  });

  it('passes through additional props', () => {
    render(<Container data-testid="test-container">Content</Container>);
    const container = screen.getByTestId('test-container');
    expect(container).toBeInTheDocument();
  });
});
