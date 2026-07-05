import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Section } from './section';

describe('Section', () => {
  it('renders section element by default', () => {
    render(<Section>Section content</Section>);
    const section = screen.getByText('Section content');
    expect(section.tagName).toBe('SECTION');
  });

  it('renders div when as prop is div', () => {
    render(<Section as="div">Div content</Section>);
    const div = screen.getByText('Div content');
    expect(div.tagName).toBe('DIV');
  });

  it('applies vertical padding classes', () => {
    render(<Section>Content</Section>);
    const section = screen.getByText('Content');
    expect(section).toHaveClass('py-12', 'md:py-20');
  });

  it('applies custom className', () => {
    render(<Section className="custom-class">Content</Section>);
    const section = screen.getByText('Content');
    expect(section).toHaveClass('custom-class');
  });

  it('forwards ref to section', () => {
    const ref = { current: null };
    render(<Section ref={ref}>Content</Section>);
    expect(ref.current).not.toBeNull();
  });

  it('passes through additional props', () => {
    render(<Section data-testid="test-section">Content</Section>);
    const section = screen.getByTestId('test-section');
    expect(section).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(
      <Section>
        <h1>Heading</h1>
        <p>Paragraph</p>
      </Section>
    );
    expect(screen.getByText('Heading')).toBeInTheDocument();
    expect(screen.getByText('Paragraph')).toBeInTheDocument();
  });
});
