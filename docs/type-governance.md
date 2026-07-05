# Type Governance Policy

This document defines the governance policies for TypeScript usage across the monorepo, ensuring type safety, maintainability, and developer experience at scale.

## Core Principles

1. **Type Safety is Non-Negotiable** - All code must pass type checking before merging
2. **Domain Types Over Transport Types** - Model business concepts, not API responses
3. **Strict Mode with Guardrails** - Enable strictness but provide clear policies for exceptions
4. **Runtime Validation at Boundaries** - Use Zod for data crossing network boundaries

## TypeScript Configuration

### Strict Mode Settings

All packages use strict mode with the following configuration:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "verbatimModuleSyntax": true
  }
}
```

### Rationale

- `strict`: true - Catches common errors at compile time
- `noUncheckedIndexedAccess`: Prevents undefined access on array/object lookups
- `noImplicitOverride`: Ensures method overrides are explicit
- `verbatimModuleSyntax`: Prevents accidental CommonJS/ESM mixing

## Type-Related ESLint Rules

### Enabled Rules

- `@typescript-eslint/no-explicit-any`: Warn on `any` usage (review required)
- `@typescript-eslint/no-floating-promises`: Warn on unhandled promises
- `@typescript-eslint/no-misused-promises`: Warn on promise misuse
- `@typescript-eslint/no-unused-vars`: Error on unused variables (with `_` prefix exception)

### Type-Aware Linting

Type-aware linting is **disabled by default** for performance. Enable per-package if needed by adding:

```javascript
parserOptions: {
  project: './tsconfig.json',
}
```

Only enable when:
- Project structure is stable
- Type information provides significant value
- Performance impact is acceptable

## @ts-ignore and @ts-expect-error Policy

### @ts-ignore

**Usage:** FORBIDDEN in production code

- Never use `@ts-ignore` in new code
- Existing uses must have a TODO comment with issue reference
- Must be reviewed and removed within 1 sprint

### @ts-expect-error

**Usage:** ALLOWED for intentional error suppression

- Use when testing error handling code
- Must include comment explaining why
- Must be reviewed in code review

Example:
```typescript
// @ts-expect-error - Testing error handling for invalid input
const result = parseInvalidInput();
```

## Type Errors in CI

**Policy:** Type errors BLOCK CI

- All packages must pass `pnpm check-types` before merging
- Type errors are considered build failures
- Exceptions require team lead approval

## Domain Types vs Transport Types

### Anti-Pattern: Mirroring API Responses

```typescript
// ❌ BAD - Mirrors backend structure
interface UserResponse {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
}
```

### Better: Domain Modeling

```typescript
// ✅ GOOD - Models business concept
interface User {
  id: UserId;
  name: FullName;
  createdAt: Date;
}
```

### Guidelines

1. **Model domain concepts** - Think in business terms, not database fields
2. **Separate transport from domain** - Use adapters to convert between layers
3. **Version shared contracts** - Treat shared types as versioned interfaces
4. **Prefer composition over inheritance** - Build complex types from simple ones

## Runtime Validation

### Principle: TypeScript ≠ Runtime Safety

TypeScript disappears after compilation. Data crossing network boundaries must be validated at runtime.

### Zod Integration

Use Zod schemas for:
- API request/response validation
- Environment variable validation
- Form input validation
- Local storage data validation

Example:
```typescript
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
});

// Validate at boundary
const user = UserSchema.parse(apiResponse);
```

### Performance Optimization

For performance-critical internal APIs where input shape is controlled, use `z.interface()` instead of `z.object()`:

```typescript
// 2x faster for controlled inputs
const UserInterface = z.interface({
  id: z.string().uuid(),
  name: z.string().min(1),
});
```

## Monorepo Type Organization

### Package Boundaries

- **packages/lib** - Shared types and utilities
- **packages/ui** - UI component types (React-specific)
- **apps/** - Application-specific types

### Cross-Package Dependencies

- Avoid circular dependencies
- Prefer composition over deep import chains
- Use workspace protocol for internal dependencies
- Document public API of shared packages

### Type Debt Management

**Monthly Audit:**
1. Run complexity analysis on types
2. Identify overly complex types (5+ generic parameters, deep nesting)
3. Refactor into simpler, composable types
4. Update documentation

## Type Complexity Guidelines

### Prefer Clarity Over Cleverness

```typescript
// ❌ OVER-ENGINEERED
type ExtractRouteParams<T extends string> = T extends `${infer Start}:${infer Param}/${infer Rest}`
  ? { [K in Param | keyof ExtractRouteParams<Rest>]: string }
  : T extends `${infer Start}:${infer Param}`
  ? { [K in Param]: string }
  : never;

// ✅ CLEAR
interface RouteParams {
  userId: string;
  postId: string;
}
```

### Guidelines

- Limit generic parameters to 2-3 maximum
- Avoid conditional types unless necessary
- Prefer named types over inline anonymous types
- Document complex types with JSDoc

## Migration and Versioning

### Type Changes

**Breaking changes require:**
1. Major version bump
2. Migration guide
3. Deprecation period (minimum 1 sprint)
4. Update all consumers

### Expand-Contract Pattern

For shared types, use expand-contract migrations:

1. **Expand:** Add new field as optional
2. **Deploy:** Update all consumers
3. **Contract:** Make field required, remove old field
4. **Deploy:** Final deployment

## References

- [TypeScript at scale in 2026](https://blog.logrocket.com/typescript-at-scale-2026/)
- [Zod v4 validation guide](https://pristren.com/blog/zod-v4-validation-guide/)
- [ESLint TypeScript rules](https://typescript-eslint.io/rules/)
