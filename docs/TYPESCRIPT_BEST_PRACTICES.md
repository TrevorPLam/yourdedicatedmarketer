# TypeScript Best Practices Guide (2026)

This guide outlines the TypeScript patterns, conventions, and best practices for our marketing agency monorepo. Following these guidelines ensures type safety, maintainability, and excellent developer experience.

## Table of Contents

- [Configuration](#configuration)
- [Type Safety](#type-safety)
- [Code Patterns](#code-patterns)
- [React Components](#react-components)
- [Package Structure](#package-structure)
- [Error Handling](#error-handling)
- [Performance](#performance)
- [Testing](#testing)

## Configuration

### TypeScript Configuration

Our `tsconfig.json` is optimized for 2026 best practices:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true
  }
}
```

### Key Compiler Options

- **`strict`**: Enables all strict type checking options
- **`exactOptionalPropertyTypes`**: Prevents undefined values in optional properties
- **`noUncheckedIndexedAccess`**: Requires explicit checks for array/object access
- **`verbatimModuleSyntax`**: Enforces type-only imports with `type` keyword

## Type Safety

### Avoid `any` Type

Never use `any` in new code. Use proper typing:

```typescript
// ❌ Bad
const data: any = fetchData();

// ✅ Good
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
const data: ApiResponse<UserData> = fetchData();
```

### Use Generic Types

Prefer generic types over concrete ones:

```typescript
// ❌ Bad
interface StringMap {
  [key: string]: string;
}

// ✅ Good
interface Map<T = unknown> {
  [key: string]: T;
}
```

### Type Guards

Implement type guards for runtime type checking:

```typescript
function isAnalyticsEvent(obj: unknown): obj is AnalyticsEvent {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'name' in obj &&
    typeof obj.name === 'string'
  );
}
```

## Code Patterns

### Interface Design

Use interfaces for object shapes and types for primitives/unions:

```typescript
// ✅ Interface for objects
interface UserConfig {
  name: string;
  email: string;
  preferences?: UserPreferences;
}

// ✅ Type for unions/primitives
type Status = 'active' | 'inactive' | 'pending';
type ID = string | number;
```

### Utility Types

Leverage TypeScript's built-in utility types:

```typescript
interface FullUser {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Create public-facing type without sensitive data
type PublicUser = Omit<FullUser, 'password'>;
type UserPreview = Pick<FullUser, 'id' | 'name'>;
type PartialUser = Partial<FullUser>;
```

### Function Signatures

Be explicit with function return types:

```typescript
// ✅ Explicit return type
function getUser(id: string): Promise<User | null> {
  return database.users.find({ id });
}

// ✅ Generic functions
function createApiResponse<T>(
  data: T,
  success = true
): ApiResponse<T> {
  return { success, data };
}
```

## React Components

### Component Props

Use interfaces for component props with proper typing:

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, loading, icon, children, ...props }, ref) => {
    // Component implementation
  }
);
```

### Generic Components

Create reusable generic components:

```typescript
interface DataTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({ data, columns, onRowClick }: DataTableProps<T>) {
  // Generic table implementation
}
```

### Event Handlers

Type event handlers properly:

```typescript
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
  // Handle click
};

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;
  // Handle change
};
```

## Package Structure

### Type Exports

Export types explicitly from package entry points:

```typescript
// packages/analytics/src/index.ts
export type { 
  AnalyticsEvent, 
  PageView, 
  UserProperty 
} from './interfaces/analytics.adapter';

export { AnalyticsManager } from './core/analytics-manager';
export { ConsentManager } from './consent/consent-manager';
```

### Import Patterns

Use type-only imports for types:

```typescript
// ✅ Type-only import
import type { AnalyticsEvent, UserConfig } from '@agency/analytics';

// ✅ Value import
import { AnalyticsManager } from '@agency/analytics';

// ✅ Mixed import
import { AnalyticsManager, type AnalyticsEvent } from '@agency/analytics';
```

### Module Boundaries

Respect package boundaries. Use proper imports:

```typescript
// ✅ From shared types package
import type { ApiResponse } from '@agency/types';

// ✅ From specific package
import { Button } from '@agency/ui-components';

// ❌ Don't import from internal paths
import { Something } from '../../../internal/path';
```

## Error Handling

### Error Types

Define specific error types:

```typescript
interface AnalyticsError extends Error {
  provider: string;
  code: string;
  details?: Record<string, unknown>;
}

class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### Result Pattern

Use Result pattern for operations that can fail:

```typescript
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const user = await database.users.find({ id });
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```

## Performance

### Type Inference

Let TypeScript infer types when possible:

```typescript
// ✅ Let TypeScript infer
const users = await fetchUsers(); // Type: User[]

// ❌ Unnecessary annotation
const users: User[] = await fetchUsers();
```

### Efficient Generics

Use efficient generic constraints:

```typescript
// ✅ Good generic constraint
interface Repository<T extends { id: string }> {
  find(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
}

// ❌ Too broad constraint
interface Repository<T extends Record<string, unknown>> {
  // Less type safety
}
```

### Conditional Types

Use conditional types for complex type logic:

```typescript
type ApiResponse<T> = T extends string 
  ? { message: T }
  : { data: T };

type NonNullable<T> = T extends null | undefined ? never : T;
```

## Testing

### Test Types

Type your test utilities:

```typescript
interface MockUser {
  id: string;
  name: string;
  email: string;
}

export function createMockUser(overrides?: Partial<MockUser>): MockUser {
  return {
    id: 'test-id',
    name: 'Test User',
    email: 'test@example.com',
    ...overrides,
  };
}
```

### Component Testing

Type component testing utilities:

```typescript
import { render, screen } from '@testing-library/react';
import type { ButtonProps } from './Button';

const defaultProps: ButtonProps = {
  variant: 'primary',
  size: 'md',
  children: 'Click me',
};

test('renders button correctly', () => {
  render(<Button {...defaultProps} />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

## ESLint Rules

Our ESLint configuration enforces these patterns:

- `@typescript-eslint/no-explicit-any`: Disallows `any` type
- `@typescript-eslint/prefer-nullish-coalescing`: Prefers `??` over `||`
- `@typescript-eslint/prefer-optional-chain`: Prefers optional chaining
- `@typescript-eslint/strict-boolean-expressions`: Enforces strict boolean checks
- `@typescript-eslint/no-floating-promises`: Requires proper promise handling

## Migration Guide

### From `any` to Proper Types

```typescript
// Step 1: Identify any usage
const data: any = response.data;

// Step 2: Create proper interface
interface ResponseData {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

// Step 3: Update usage
const data: ResponseData = response.data;
```

### From Loose Types to Strict Types

```typescript
// Before
interface Config {
  [key: string]: any;
}

// After
interface Config {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}
```

## Common Pitfalls

### 1. Using `Object.create`

```typescript
// ❌ Bad - loses type safety
const obj = Object.create(null);

// ✅ Good - maintains type safety
const obj: Record<string, unknown> = {};
```

### 2. Type Assertion Abuse

```typescript
// ❌ Bad - unsafe assertion
const user = response.data as User;

// ✅ Good - type guard
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'id' in obj;
}
const user = isUser(response.data) ? response.data : null;
```

### 3. Optional Property Abuse

```typescript
// ❌ Bad - too many optionals
interface User {
  id?: string;
  name?: string;
  email?: string;
}

// ✅ Good - required properties with defaults
interface User {
  id: string;
  name: string;
  email: string;
  preferences?: UserPreferences;
}
```

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript ESLint Rules](https://typescript-eslint.io/rules/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Utility Types Reference](https://www.typescriptlang.org/docs/handbook/utility-types.html)

## Conclusion

Following these TypeScript best practices ensures:

1. **Type Safety**: Fewer runtime errors and better IDE support
2. **Maintainability**: Clear, self-documenting code
3. **Performance**: Optimized compilation and type checking
4. **Developer Experience**: Better autocomplete and refactoring support

Remember: TypeScript is a tool that helps us write better JavaScript. Use it to its full potential!
