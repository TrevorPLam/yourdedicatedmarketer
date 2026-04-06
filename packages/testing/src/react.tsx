/**
 * React Testing Utilities
 *
 * React-specific testing utilities and helpers for the monorepo.
 * Includes render functions, component testing helpers, and React-specific mocks.
 */

import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi, expect } from 'vitest';
import '@testing-library/jest-dom';

// Re-export React testing library utilities
export { render, screen, waitFor, fireEvent, act } from '@testing-library/react';

export { default as user } from '@testing-library/user-event';

// Enhanced render function with default providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  user?: ReturnType<typeof userEvent.setup>;
}

/**
 * Enhanced render function with default user event setup
 */
export function renderWithUser(
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult & { user: ReturnType<typeof userEvent.setup> } {
  const { user: userOptions, ...renderOptions } = options;
  const userInstance = userOptions || userEvent.setup();

  return {
    ...render(ui, renderOptions),
    user: userInstance,
  };
}

/**
 * Render component with theme provider
 */
export function renderWithTheme(ui: ReactElement, options: CustomRenderOptions = {}): RenderResult {
  // This would be implemented once we have the theme provider
  // For now, just use regular render
  return renderWithUser(ui, options);
}

/**
 * Render component with mock providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  // This would wrap with necessary providers (theme, auth, etc.)
  // For now, just use regular render
  return renderWithUser(ui, options);
}

// Component testing helpers
export class ComponentTester {
  constructor(
    private component: ReactElement,
    private options: CustomRenderOptions = {}
  ) {}

  /**
   * Test if component renders without errors
   */
  renders() {
    const { container } = renderWithUser(this.component, this.options);
    expect(container).toBeInTheDocument();
    return this;
  }

  /**
   * Test if component has specific text
   */
  hasText(text: string) {
    const { getByText } = renderWithUser(this.component, this.options);
    expect(getByText(text)).toBeInTheDocument();
    return this;
  }

  /**
   * Test if component has specific element by role
   */
  hasRole(role: string, name?: string) {
    const { getByRole } = renderWithUser(this.component, this.options);
    if (name) {
      expect(getByRole(role, { name })).toBeInTheDocument();
    } else {
      expect(getByRole(role)).toBeInTheDocument();
    }
    return this;
  }

  /**
   * Test click interaction
   */
  async clicks(selector: string) {
    const { user, getByTestId } = renderWithUser(this.component, this.options);
    await user.click(getByTestId(selector));
    return this;
  }

  /**
   * Test form submission
   */
  async submitsForm() {
    const { user, getByRole } = renderWithUser(this.component, this.options);
    await user.click(getByRole('button', { name: /submit/i }));
    return this;
  }
}

/**
 * Helper function to create component tester
 */
export function createTester(component: ReactElement, options?: CustomRenderOptions) {
  return new ComponentTester(component, options);
}

// Form testing utilities
export class FormTester {
  constructor(
    private form: ReactElement,
    private options: CustomRenderOptions = {}
  ) {}

  /**
   * Fill form fields
   */
  async fillForm(fields: Record<string, string>) {
    const { user, getByLabelText, getByRole } = renderWithUser(this.form, this.options);

    for (const [field, value] of Object.entries(fields)) {
      try {
        // Try by label first
        const input = getByLabelText(field);
        await user.clear(input);
        await user.type(input, value);
      } catch {
        // Fallback to placeholder or role
        const input = getByRole('textbox', { name: field }) || getByRole('input', { name: field });
        if (input) {
          await user.clear(input);
          await user.type(input, value);
        }
      }
    }

    return this;
  }

  /**
   * Submit form
   */
  async submit() {
    const { user, container } = renderWithUser(this.form, this.options);
    const submitButton = container.querySelector('button[type="submit"]');
    if (submitButton) {
      await user.click(submitButton);
    }
    return this;
  }
}

/**
 * Helper function to create form tester
 */
export function createFormTester(form: ReactElement, options?: CustomRenderOptions) {
  return new FormTester(form, options);
}

// Accessibility testing helpers
export function checkAccessibility(container: HTMLElement) {
  // Basic accessibility checks
  const interactiveElements = container.querySelectorAll('button, a, input, select, textarea');

  interactiveElements.forEach((element) => {
    // Check for aria-label or text content
    const hasAccessibleName =
      element.getAttribute('aria-label') ||
      element.getAttribute('title') ||
      element.textContent?.trim();

    if (!hasAccessibleName) {
      console.warn('Interactive element without accessible name:', element);
    }
  });
}

// Mock React Router
export const mockNavigate = vi.fn();
export const mockLocation = { pathname: '/', search: '', hash: '', state: '' };

export function mockReactRouter() {
  vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
    Link: ({ children, to, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
    NavLink: ({ children, to, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  }));
}
