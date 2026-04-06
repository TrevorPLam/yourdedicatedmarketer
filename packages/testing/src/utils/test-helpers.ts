/**
 * Test Helpers
 *
 * Core testing utilities and helper functions used across the monorepo.
 */

import { vi } from 'vitest';
import { faker } from '@faker-js/faker';

// Domain model types for mock data generation
interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Client {
  id: string;
  name: string;
  domain: string;
  status: string;
  framework: string;
  database: string;
  theme: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  clientId: string;
  startDate: Date;
  endDate: Date;
  budget: number;
}

// Mock data generators
export function createMockUser(overrides?: Partial<User>) {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    avatar: faker.image.avatar(),
    role: 'user' as const,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  };
}

export function createMockClient(overrides?: Partial<Client>) {
  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    domain: faker.internet.url(),
    status: 'active' as const,
    framework: 'astro' as const,
    database: 'supabase' as const,
    theme: 'default' as const,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  };
}

export function createMockProject(overrides?: Partial<Project>) {
  return {
    id: faker.string.uuid(),
    name: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    status: 'active' as const,
    clientId: faker.string.uuid(),
    startDate: faker.date.past(),
    endDate: faker.date.future(),
    budget: faker.number.int({ min: 1000, max: 100000 }),
    ...overrides,
  };
}

// Async testing helpers
export async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  timeout = 5000,
  interval = 100
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`Condition not met within ${timeout}ms`);
}

export function createAsyncMock<T>(defaultValue: T, delay = 0) {
  let value = defaultValue;
  let resolve: ((value: T) => void) | null = null;

  const mock = vi.fn(() => {
    return new Promise<T>((res) => {
      resolve = res;
      if (delay > 0) {
        setTimeout(() => res(value), delay);
      } else {
        res(value);
      }
    });
  }) as any;

  mock.resolveWithValue = (newValue: T) => {
    value = newValue;
    resolve?.(newValue);
  };

  return mock;
}

// DOM testing helpers
export function getByTestId(container: HTMLElement, testId: string) {
  return container.querySelector(`[data-testid="${testId}"]`);
}

export function queryByTestId(container: HTMLElement, testId: string) {
  return container.querySelector(`[data-testid="${testId}"]`);
}

export function getByTextContent(container: HTMLElement, text: string) {
  return Array.from(container.querySelectorAll('*')).find((element) =>
    element.textContent?.includes(text)
  );
}

// Event testing helpers
export function createMockEvent(type: string, properties?: Record<string, unknown>) {
  return {
    type,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    target: { value: '', ...properties },
    ...properties,
  };
}

export function fireCustomEvent(element: HTMLElement, eventName: string, detail?: unknown) {
  const event = new CustomEvent(eventName, { detail });
  element.dispatchEvent(event);
}

// Form testing helpers
export function fillFormField(element: HTMLInputElement | HTMLTextAreaElement, value: string) {
  element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

export function submitForm(form: HTMLFormElement) {
  form.dispatchEvent(new Event('submit', { bubbles: true }));
}

// LocalStorage testing helpers
export function createMockLocalStorage() {
  const store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
}

// IntersectionObserver testing helper
export function createMockIntersectionObserver() {
  const callbacks: Array<(entries: IntersectionObserverEntry[]) => void> = [];

  return {
    observe: vi.fn((element: Element) => {
      // Simulate intersection
      const entry = {
        target: element,
        isIntersecting: true,
        intersectionRatio: 1,
        boundingClientRect: element.getBoundingClientRect(),
        intersectionRect: element.getBoundingClientRect(),
        rootBounds: null,
        time: Date.now(),
      };

      callbacks.forEach((callback) => callback([entry]));
    }),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    root: null,
    rootMargin: '',
    thresholds: [0],
    takeRecords: vi.fn(() => []),
    _callbacks: callbacks,
  };
}

// ResizeObserver testing helper
export function createMockResizeObserver() {
  const callbacks: Array<(entries: ResizeObserverEntry[]) => void> = [];

  return {
    observe: vi.fn((element: Element) => {
      // Simulate resize
      const entry = {
        target: element,
        contentRect: element.getBoundingClientRect(),
        borderBoxSize: [{ inlineSize: 100, blockSize: 100 }],
        contentBoxSize: [{ inlineSize: 100, blockSize: 100 }],
        devicePixelContentBoxSize: [{ inlineSize: 100, blockSize: 100 }],
      };

      callbacks.forEach((callback) => callback([entry]));
    }),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    _callbacks: callbacks,
  };
}

// Performance testing helpers
export function measurePerformance<T>(
  fn: () => T | Promise<T>,
  iterations = 1
): Promise<{ result: T; duration: number; average: number }> {
  const runIteration = async (): Promise<{ result: T; duration: number }> => {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    return { result, duration: end - start };
  };

  return Promise.all(Array.from({ length: iterations }, () => runIteration())).then(
    (allResults) => {
      const totalDuration = allResults.reduce((sum, r) => sum + r.duration, 0);
      const average = totalDuration / iterations;

      return {
        result: allResults[0]!.result,
        duration: totalDuration,
        average,
      };
    }
  );
}
