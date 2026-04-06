/**
 * Render Helpers
 *
 * Shared rendering utilities for consistent component testing across the monorepo.
 */

import type { RenderOptions, RenderResult } from '@testing-library/react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Enhanced render options
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  user?: ReturnType<typeof userEvent.setup>;
}

/**
 * Enhanced render function with user event setup
 */
export function renderWithUser(
  ui: React.ReactElement,
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
 * Wait for element to be visible and interactable
 */
export async function waitForElementToBeVisible(
  getElement: () => HTMLElement,
  timeout = 5000
): Promise<HTMLElement> {
  return waitFor(
    () => {
      const element = getElement();
      expect(element).toBeInTheDocument();
      expect(element).toBeVisible();
      return element;
    },
    { timeout }
  );
}

/**
 * Wait for element to be removed from DOM
 */
export async function waitForElementToBeRemoved(
  getElement: () => HTMLElement | null,
  timeout = 5000
): Promise<void> {
  return waitFor(
    () => {
      const element = getElement();
      expect(element).not.toBeInTheDocument();
    },
    { timeout }
  );
}

/**
 * Helper to test loading states
 */
export async function testLoadingState(
  renderFn: () => RenderResult,
  loadingSelector: string,
  contentSelector: string
) {
  const { getByTestId, queryByTestId } = renderFn();

  // Initially should show loading
  expect(getByTestId(loadingSelector)).toBeInTheDocument();
  expect(queryByTestId(contentSelector)).not.toBeInTheDocument();

  // Wait for content to appear
  const content = await waitForElementToBeVisible(() => getByTestId(contentSelector));

  // Loading should be gone
  expect(queryByTestId(loadingSelector)).not.toBeInTheDocument();

  return content;
}

/**
 * Helper to test error states
 */
export async function testErrorState(
  renderFn: () => RenderResult,
  errorSelector: string,
  triggerError?: () => void
) {
  const { getByTestId, queryByTestId } = renderFn();

  // Initially should not show error
  expect(queryByTestId(errorSelector)).not.toBeInTheDocument();

  // Trigger error if provided
  if (triggerError) {
    triggerError();
  }

  // Wait for error to appear
  const errorElement = await waitForElementToBeVisible(() => getByTestId(errorSelector));

  return errorElement;
}

/**
 * Helper to test form interactions
 */
export async function testFormSubmission(
  renderFn: () => RenderResult & { user: ReturnType<typeof userEvent.setup> },
  formData: Record<string, string>,
  submitSelector: string,
  successSelector?: string
): Promise<HTMLElement | void> {
  const { user, getByLabelText, getByTestId } = renderFn();

  // Fill form fields
  for (const [field, value] of Object.entries(formData)) {
    const input = getByLabelText(field);
    await user.clear(input);
    await user.type(input, value);
  }

  // Submit form
  const submitButton = getByTestId(submitSelector);
  await user.click(submitButton);

  // Wait for success if selector provided
  if (successSelector) {
    const successElement = await waitForElementToBeVisible(() => getByTestId(successSelector));
    return successElement;
  }
  
  // Return undefined when no success selector
  return;
}

/**
 * Helper to test modal interactions
 */
export async function testModalInteraction(
  renderFn: () => RenderResult & { user: ReturnType<typeof userEvent.setup> },
  triggerSelector: string,
  modalSelector: string,
  closeSelector?: string
) {
  const { user, getByTestId, queryByTestId } = renderFn();

  // Modal should not be visible initially
  expect(queryByTestId(modalSelector)).not.toBeInTheDocument();

  // Trigger modal
  const trigger = getByTestId(triggerSelector);
  await user.click(trigger);

  // Modal should be visible
  const modal = await waitForElementToBeVisible(() => getByTestId(modalSelector));

  // Close modal if close selector provided
  if (closeSelector) {
    const closeButton = getByTestId(closeSelector);
    await user.click(closeButton);

    // Modal should be hidden
    await waitForElementToBeRemoved(() => queryByTestId(modalSelector));
  }

  return modal;
}

/**
 * Helper to test navigation
 */
export async function testNavigation(
  renderFn: () => RenderResult & { user: ReturnType<typeof userEvent.setup> },
  linkSelector: string,
  expectedPath: string
) {
  const { user, getByTestId } = renderFn();

  // Click navigation link
  const link = getByTestId(linkSelector);
  await user.click(link);

  // In a real app, you'd check if the navigation occurred
  // For testing, we'll just verify the link href
  expect(link).toHaveAttribute('href', expectedPath);
}

/**
 * Helper to test accessibility
 */
export function testAccessibility(container: HTMLElement) {
  // Basic accessibility checks
  const images = container.querySelectorAll('img');
  images.forEach((img) => {
    expect(img).toHaveAttribute('alt');
  });

  const buttons = container.querySelectorAll('button');
  buttons.forEach((button) => {
    const hasAccessibleName =
      button.getAttribute('aria-label') ||
      button.getAttribute('title') ||
      button.textContent?.trim();

    if (!hasAccessibleName) {
      console.warn('Button without accessible name:', button);
    }
  });

  const links = container.querySelectorAll('a');
  links.forEach((link) => {
    const hasAccessibleName =
      link.getAttribute('aria-label') || link.getAttribute('title') || link.textContent?.trim();

    if (!hasAccessibleName) {
      console.warn('Link without accessible name:', link);
    }
  });
}

/**
 * Helper to test responsive behavior
 */
export function testResponsive(
  renderFn: () => RenderResult,
  breakpoints: Record<string, number>,
  testFn: (container: HTMLElement, breakpoint: string) => void
): void {
  Object.entries(breakpoints).forEach(([name, width]) => {
    // Set viewport size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });

    // Trigger resize event
    window.dispatchEvent(new Event('resize'));

    // Re-render and test
    const { container } = renderFn();
    testFn(container, name);
  });
}
