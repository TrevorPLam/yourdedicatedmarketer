# Vitest Documentation

**Repository Version:** ^4.1.2  
**Official Documentation:** https://vitest.dev/guide/  
**API Reference:** https://vitest.dev/api/  
**Configuration:** https://vitest.dev/config/

## Overview

Vitest (pronounced as "veetest") is a next-generation testing framework powered by Vite. It provides a fast, efficient testing experience with excellent TypeScript support, hot module replacement, and a comprehensive feature set for modern web development.

### Key Advantages

- **Unified Configuration**: Shares the same configuration as Vite
- **Lightning Fast**: Powered by Vite's esbuild and HMR
- **First-class TypeScript Support**: No extra configuration needed
- **Smart Watch Mode**: Only runs affected tests
- **Rich API**: Comprehensive mocking, coverage, and assertion libraries

## Requirements

- **Node.js**: >= v20.0.0
- **Vite**: >= v6.0.0
- **Package Manager**: npm, yarn, pnpm, or bun

## Installation

### Standard Installation

```bash
# npm
npm install -D vitest

# yarn
yarn add -D vitest

# pnpm
pnpm add -D vitest

# bun
bun add -D vitest
```

### Basic Setup

Add the test script to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

## Getting Started

### Basic Test Structure

#### Simple Test Example

```javascript
// src/sum.js
export function sum(a, b) {
  return a + b
}

// src/sum.test.js
import { expect, test } from 'vitest'
import { sum } from './sum.js'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})
```

#### Using describe Blocks

```typescript
import { describe, it, expect } from 'vitest'
import { sum } from './sum'

describe('sum function', () => {
  it('should add positive numbers', () => {
    expect(sum(2, 3)).toBe(5)
  })

  it('should handle negative numbers', () => {
    expect(sum(-2, -3)).toBe(-5)
  })

  it('should handle zero', () => {
    expect(sum(0, 0)).toBe(0)
  })
})
```

### Test File Naming

By default, tests must contain `.test.` or `.spec.` in their file name. Supported patterns:

- `*.test.js`
- `*.test.ts`
- `*.spec.js`
- `*.spec.ts`
- `*.test.jsx`
- `*.test.tsx`

## Configuration

### Unified Configuration with Vite

Vitest reads your `vite.config.ts` automatically. Add the `test` property:

```typescript
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    // Vitest specific configuration
    globals: true,
    environment: 'jsdom',
  },
})
```

### Separate Vitest Configuration

Create `vitest.config.ts` for test-specific configuration:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['node_modules/', 'dist/', '.idea/', '.git/', '.cache/'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@utils': resolve(__dirname, './src/utils'),
      '@lib': resolve(__dirname, './src/lib'),
      '@types': resolve(__dirname, './src/types'),
    },
  },
})
```

### Configuration Options

#### Test Environment

```typescript
test: {
  environment: 'jsdom' | 'node' | 'happy-dom',
  environmentOptions: {
    jsdom: {
      url: 'http://localhost:3000',
    },
  },
}
```

#### Global Variables

```typescript
test: {
  globals: true, // Enable global test functions
  globalSetup: './src/test/global-setup.ts',
  setupFiles: ['./src/test/setup.ts'],
}
```

#### Coverage Configuration

```typescript
test: {
  coverage: {
    provider: 'v8' | 'istanbul',
    reporter: ['text', 'json', 'html', 'lcov'],
    reportsDirectory: './coverage',
    exclude: [
      'node_modules/',
      'src/test/',
      '**/*.d.ts',
      '**/*.config.*',
      'dist/',
      'coverage/',
    ],
    thresholds: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
}
```

#### Reporter Configuration

```typescript
test: {
  reporter: ['verbose', 'html', 'json'],
  outputFile: {
    html: './coverage/test-report.html',
    json: './coverage/test-report.json',
  },
}
```

## Test API Reference

### Test Functions

#### test() / it()

```typescript
function test(
  name: string | Function,
  body?: () => unknown,
  timeout?: number
): void

function test(
  name: string | Function,
  options: TestOptions,
  body?: () => unknown
): void
```

```typescript
import { test } from 'vitest'

test('should work as expected', () => {
  expect(Math.sqrt(4)).toBe(2)
})

test('with timeout', () => {
  // test code
}, 1000)

test('with options', {
  timeout: 1000,
  retry: 3,
}, () => {
  // test code
})
```

#### Test Options

```typescript
interface TestOptions {
  timeout?: number
  retry?: number
  repeats?: number
  tags?: string[]
  meta?: Record<string, any>
  concurrent?: boolean
  sequential?: boolean
  skip?: boolean
  only?: boolean
  todo?: boolean
  fails?: boolean
}
```

#### describe()

```typescript
function describe(name: string | Function, fn: () => void): void
```

```typescript
import { describe, test } from 'vitest'

describe('math operations', () => {
  test('addition', () => {
    expect(2 + 2).toBe(4)
  })

  test('subtraction', () => {
    expect(4 - 2).toBe(2)
  })
})
```

#### Hooks

```typescript
describe('suite', () => {
  beforeAll(() => {
    // Runs once before all tests
  })

  afterAll(() => {
    // Runs once after all tests
  })

  beforeEach(() => {
    // Runs before each test
  })

  afterEach(() => {
    // Runs after each test
  })

  // Available in 4.1.0+
  aroundEach((fn) => {
    // Wraps each test
    return fn()
  })

  aroundAll((fn) => {
    // Wraps the entire suite
    return fn()
  })
})
```

### Test Modifiers

#### Skipping Tests

```typescript
test.skip('skipped test', () => {
  // This test will be skipped
})

test.skipIf(process.env.NODE_ENV === 'production')('conditional skip', () => {
  // Skipped in production
})

test.runIf(process.env.NODE_ENV === 'test')('conditional run', () => {
  // Only runs in test environment
})
```

#### Focusing Tests

```typescript
test.only('focused test', () => {
  // Only this test will run
})

describe.only('focused suite', () => {
  // Only tests in this suite will run
})
```

#### Todo Tests

```typescript
test.todo('test to be implemented later')

describe.todo('suite to be implemented later', () => {
  // Empty suite marked as todo
})
```

#### Expected Failures

```typescript
test.fails('test expected to fail', () => {
  // Test is expected to fail
})
```

#### Concurrent Tests

```typescript
test.concurrent('concurrent test 1', async () => {
  // Runs in parallel
})

test.concurrent('concurrent test 2', async () => {
  // Runs in parallel
})

describe.concurrent('concurrent suite', () => {
  test('runs in parallel', () => {
    // Parallel execution
  })
})

test.sequential('sequential test', () => {
  // Runs sequentially (default)
})
```

### Parameterized Tests

#### test.each()

```typescript
test.each([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3],
])('adds %i + %i to equal %i', (a, b, expected) => {
  expect(a + b).toBe(expected)
})

test.each([
  { a: 1, b: 1, expected: 2 },
  { a: 1, b: 2, expected: 3 },
])('adds $a + $b to equal $expected', ({ a, b, expected }) => {
  expect(a + b).toBe(expected)
})
```

#### test.for() (4.1.0+)

```typescript
test.for([1, 2, 3])('number %i', (value) => {
  expect(typeof value).toBe('number')
})
```

## Mocking API

### vi Helper

Access the vi helper globally (when globals are enabled) or import it:

```typescript
import { vi } from 'vitest'
```

### Mock Modules

#### vi.mock()

```typescript
// Mock entire module
vi.mock('./module.js')

// Mock with factory function
vi.mock('./module.js', () => ({
  default: vi.fn(),
  namedExport: vi.fn(),
}))

// Mock with async factory
vi.mock('./module.js', async () => {
  const actual = await vi.importActual('./module.js')
  return {
    ...actual,
    default: vi.fn(),
  }
})
```

#### vi.doMock()

```typescript
// Mock module conditionally
if (process.env.NODE_ENV === 'test') {
  vi.doMock('./module.js', () => ({
    default: vi.fn(),
  }))
}
```

#### vi.importActual() / vi.importMock()

```typescript
// Import actual module
const actualModule = await vi.importActual('./module.js')

// Import mocked module
const mockedModule = await vi.importMock('./module.js')
```

#### vi.unmock() / vi.doUnmock()

```typescript
// Unmock module
vi.unmock('./module.js')

// Conditionally unmock
vi.doUnmock('./module.js')
```

### Mock Functions

#### vi.fn()

```typescript
// Create mock function
const mockFn = vi.fn()

// With implementation
const mockFn = vi.fn(() => 'mocked return')

// With return value
const mockFn = vi.fn().mockReturnValue('value')

// With resolved value
const mockFn = vi.fn().mockResolvedValue('async value')

// With rejected value
const mockFn = vi.fn().mockRejectedValue(new Error('error'))
```

#### vi.mocked()

```typescript
import { vi } from 'vitest'
import { myFunction } from './module'

vi.mock('./module')

// Type-safe mock access
const mockedFunction = vi.mocked(myFunction)
mockedFunction.mockReturnValue('mocked')
```

### Spying

#### vi.spyOn()

```typescript
const object = {
  method: () => 'original',
}

const spy = vi.spyOn(object, 'method')

// Spy on implementation
spy.mockImplementation(() => 'mocked')

// Restore original
spy.mockRestore()
```

### Mock Objects

#### vi.mockObject() (3.2.0+)

```typescript
const mockObject = vi.mockObject({
  method: vi.fn(),
  property: 'value',
})
```

### Mock Management

```typescript
// Clear all mocks
vi.clearAllMocks()

// Reset all mocks
vi.resetAllMocks()

// Restore all mocks
vi.restoreAllMocks()

// Check if function is mocked
vi.isMockFunction(someFunction)
```

## Fake Timers

### Timer Control

```typescript
// Enable fake timers
vi.useFakeTimers()

// Disable fake timers
vi.useRealTimers()

// Check if timers are fake
vi.isFakeTimers()
```

### Timer Manipulation

```typescript
// Advance time
vi.advanceTimersByTime(1000)
await vi.advanceTimersByTimeAsync(1000)

// Advance to next timer
vi.advanceTimersToNextTimer()
await vi.advanceTimersToNextTimerAsync()

// Run all timers
vi.runAllTimers()
await vi.runAllTimersAsync()

// Run only pending timers
vi.runOnlyPendingTimers()
await vi.runOnlyPendingTimersAsync()

// Clear all timers
vi.clearAllTimers()
```

### Time Manipulation

```typescript
// Set system time
vi.setSystemTime(new Date('2024-01-01'))

// Get mocked time
vi.getMockedSystemTime()

// Get real time
vi.getRealSystemTime()
```

### Timer Configuration

```typescript
// Set timer tick mode (4.1.0+)
vi.setTimerTickMode('auto' | 'immediate' | 'frame')
```

## Environment Mocking

### Environment Variables

```typescript
// Stub environment variable
vi.stubEnv('NODE_ENV', 'test')

// Unstub all environment variables
vi.unstubAllEnvs()
```

### Global Variables

```typescript
// Stub global variable
vi.stubGlobal('fetch', vi.fn())

// Unstub all globals
vi.unstubAllGlobals()
```

## Async Testing

### waitFor()

```typescript
import { vi, waitFor } from 'vitest'

test('async test with waitFor', async () => {
  const result = await waitFor(() => {
    return document.querySelector('#element')
  }, {
    timeout: 1000,
    interval: 50,
  })
})
```

### waitUntil()

```typescript
test('wait until condition', async () => {
  await waitUntil(() => {
    return condition()
  }, {
    timeout: 5000,
  })
})
```

## Performance Testing

### bench() (Experimental)

```typescript
import { bench, describe } from 'vitest'

describe('performance', () => {
  bench('function 1', () => {
    expensiveFunction()
  })

  bench('function 2', () => {
    optimizedFunction()
  })
})
```

### Benchmark Modifiers

```typescript
bench.skip('skipped benchmark', () => {})
bench.only('focused benchmark', () => {})
bench.todo('benchmark todo')
```

## Coverage

### Coverage Providers

#### V8 Provider (Default)

```typescript
test: {
  coverage: {
    provider: 'v8',
    // V8-specific options
  },
}
```

#### Istanbul Provider

```typescript
test: {
  coverage: {
    provider: 'istanbul',
    // Istanbul-specific options
  },
}
```

### Coverage Configuration

```typescript
test: {
  coverage: {
    // Provider selection
    provider: 'v8' | 'istanbul',
    
    // Reporters
    reporter: ['text', 'json', 'html', 'lcov', 'clover'],
    
    // Output directory
    reportsDirectory: './coverage',
    
    // File inclusion/exclusion
    include: ['src/**/*.{js,ts,jsx,tsx}'],
    exclude: [
      'node_modules/',
      'src/test/',
      '**/*.d.ts',
      '**/*.config.*',
      'dist/',
      'coverage/',
    ],
    
    // Thresholds
    thresholds: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
      // Per-file thresholds
      files: {
        'src/utils/**/*': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
      },
    },
    
    // Additional options
    all: true, // Include all files
    clean: true, // Clean coverage output
    cleanOnRerun: true, // Clean on rerun
    skipFull: false, // Skip files with full coverage
  },
}
```

### Ignoring Code

```typescript
// Ignore lines
if (process.env.NODE_ENV === 'development') {
  /* istanbul ignore next */
  console.log('debug info')
}

// Ignore entire block
/* istanbul ignore if */
if (someCondition) {
  // Complex logic
}

// Ignore file completely
/* istanbul ignore file */
export function debugFunction() {
  // Debug code
}
```

## Browser Mode

### Browser Testing Setup

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      name: 'chrome', // 'chrome' | 'firefox' | 'webkit'
      provider: 'playwright', // 'playwright' | 'webdriverio'
      headless: true,
    },
  },
})
```

### Browser-Specific APIs

```typescript
import { expect, test } from 'vitest'

test('browser-specific test', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await page.click('button')
  expect(await page.textContent('h1')).toBe('Hello World')
})
```

## Advanced Features

### test.extend()

```typescript
import { test } from 'vitest'

interface TestContext {
  user: User
  database: Database
}

const extendedTest = test.extend<TestContext>({
  user: async ({}, use) => {
    const user = await createUser()
    await use(user)
    await cleanupUser(user)
  },
  database: async ({}, use) => {
    const db = await createDatabase()
    await use(db)
    await db.close()
  },
})

extendedTest('with extended context', ({ user, database }) => {
  expect(user).toBeDefined()
  expect(database).toBeDefined()
})
```

### test.override() (4.1.0+)

```typescript
test.override({
  timeout: 10000,
  retry: 3,
})('overridden test', () => {
  // Test with overridden options
})
```

### test.scoped() (3.1.0+ - Deprecated)

```typescript
test.scoped('scoped test', () => {
  // Test with scoped context
})
```

## Command Line Interface

### Basic Commands

```bash
# Run tests
vitest

# Run tests once
vitest run

# Run tests in watch mode
vitest watch

# Run tests with UI
vitest --ui

# Run tests with coverage
vitest --coverage

# Run specific test file
vitest run src/test.spec.ts

# Run tests matching pattern
vitest run "**/*.test.ts"
```

### CLI Options

```bash
# Configuration
--config <path>          # Path to config file
--mode <mode>            # Mode to run in

# Test selection
--name <pattern>         # Test name pattern
--file <pattern>         # File pattern
--dir <path>             # Directory path

# Execution
--run                    # Run once
--watch                  # Watch mode
--ui                     # UI mode
--threads                # Enable threads
--no-threads             # Disable threads

# Output
--reporter <type>        # Reporter type
--outputFile <path>      # Output file
--coverage               # Enable coverage
--coverage-provider <type> # Coverage provider

# Development
--inspect-brk            # Debug mode
--no-coverage           # Disable coverage
--no-notify             # Disable notifications
```

## Integration with Testing Libraries

### React Testing Library

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})

// src/test/setup.ts
import '@testing-library/jest-dom/vitest'
```

### Component Testing Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Button from './Button'

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## Best Practices

### Test Organization

1. **Group related tests** with `describe` blocks
2. **Use descriptive test names** that explain the behavior
3. **Keep tests focused** on a single behavior
4. **Use setup/teardown** functions for common code

### Mocking Strategy

1. **Mock external dependencies** at module level
2. **Use consistent mock data** across tests
3. **Reset mocks between tests** to avoid state leakage
4. **Avoid over-mocking** - only mock what's necessary

### Assertion Patterns

1. **Use specific matchers** for better error messages
2. **Test both success and failure cases**
3. **Include edge cases and boundary conditions**
4. **Use meaningful error messages** in custom assertions

### Performance Considerations

1. **Use `vi.hoisted()`** for expensive setup operations
2. **Avoid unnecessary DOM operations** in tests
3. **Use appropriate test timeouts** for async operations
4. **Run tests in parallel** when possible

## Troubleshooting

### Common Issues

#### Test Environment Issues

```typescript
// Ensure proper test environment setup
import { configure } from '@testing-library/dom'

configure({ testIdAttribute: 'data-testid' })
```

#### Mock Issues

```typescript
// Clear mocks properly
beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
})
```

#### Async Test Issues

```typescript
// Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Expected text')).toBeInTheDocument()
})
```

#### Module Resolution Issues

```typescript
// Configure aliases properly
// vitest.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
```

## Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run",
    "test:related": "vitest related",
    "test:debug": "vitest --inspect-brk",
    "test:browser": "vitest --browser",
    "test:ci": "vitest run --coverage --reporter=junit"
  }
}
```

## IDE Integration

### VS Code

Install the official Vitest extension for:
- Test runner integration
- Inline test results
- Debugging support
- Coverage visualization

### WebStorm/IntelliJ

Built-in Vitest support includes:
- Test navigation
- Run/debug tests
- Coverage reports
- Test status indicators

---

*This documentation covers Vitest ^4.1.2 as used in this repository. For the latest features and updates, visit the official Vitest documentation at https://vitest.dev/*
