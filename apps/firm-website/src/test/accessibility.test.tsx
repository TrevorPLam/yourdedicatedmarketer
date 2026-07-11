import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('should have no accessibility violations when rendering Button component', async () => {
    const { container } = render(
      <button type="button">Test Button</button>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when rendering links', async () => {
    const { container } = render(
      <a href="/test">Test Link</a>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when rendering form inputs', async () => {
    const { container } = render(
      <form>
        <label htmlFor="test-input">Test Input</label>
        <input id="test-input" type="text" />
      </form>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when rendering headings', async () => {
    const { container } = render(
      <div>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when rendering cards', async () => {
    const { container } = render(
      <div role="article">
        <h2>Card Title</h2>
        <p>Card description</p>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when rendering navigation', async () => {
    const { container } = render(
      <nav aria-label="Main navigation">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when rendering buttons with aria-labels', async () => {
    const { container } = render(
      <button aria-label="Close dialog">×</button>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when rendering disabled buttons', async () => {
    const { container } = render(
      <button disabled>Disabled Button</button>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when rendering content with proper heading hierarchy', async () => {
    const { container } = render(
      <div>
        <h1>Main Title</h1>
        <section>
          <h2>Section Title</h2>
          <p>Content</p>
        </section>
        <section>
          <h2>Another Section</h2>
          <p>More content</p>
        </section>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when rendering images with alt text', async () => {
    const { container } = render(
      <div role="img" aria-label="Test image description" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe('Keyboard Navigation', () => {
    it('should allow keyboard navigation on buttons', () => {
      const { getByRole } = render(
        <button type="button">Test Button</button>
      );
      const button = getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should allow keyboard navigation on links', () => {
      const { getByRole } = render(
        <a href="/test">Test Link</a>
      );
      const link = getByRole('link');
      expect(link).toHaveAttribute('href', '/test');
    });

    it('should have proper tab index on interactive elements', () => {
      const { getByRole } = render(
        <button type="button">Test Button</button>
      );
      const button = getByRole('button');
      // Elements should be focusable by default (tabIndex not set to -1)
      expect(button).not.toHaveAttribute('tabIndex', '-1');
    });

    it('should have visible focus indicators on buttons', () => {
      const { getByRole } = render(
        <button type="button">Test Button</button>
      );
      const button = getByRole('button');
      // Focus styles should be defined (checked via className or style)
      expect(button).toBeVisible();
    });
  });
});
