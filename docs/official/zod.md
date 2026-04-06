# Zod Documentation

**Repository Version:** ^3.24.0 (v4.0 upcoming)  
**Official Documentation:** https://zod.dev  
**Last Updated:** April 2026

## Overview

Zod is a TypeScript-first schema validation with static type inference. It provides a declarative way to define data structures and validate runtime data against them, automatically inferring TypeScript types from the schema definitions.

### Core Philosophy

Zod is designed to be as developer-friendly as possible. The goal is to eliminate duplicative type declarations by allowing you to define your schemas once and infer static TypeScript types from them.

### Why Zod?

- **TypeScript-first**: Built for TypeScript with automatic type inference
- **Zero dependencies**: Lightweight with no external dependencies
- **Chainable API**: Fluent, composable API for building complex schemas
- **Great DX**: Excellent error messages and developer experience
- **Battle-tested**: Used by major frameworks like tRPC, Next.js, and more

---

## Installation

### Package Installation

```bash
# npm
npm install zod

# pnpm (recommended)
pnpm add zod

# yarn
yarn add zod
```

### Repository Setup

In `pnpm-workspace.yaml`:

```yaml
catalog:
  zod: '^4.0.0'  # Catalog version for consistency
```

In package `package.json`:

```json
{
  "dependencies": {
    "zod": "catalog:"
  }
}
```

---

## Basic Usage

### Defining Schemas

```typescript
import { z } from 'zod';

// String schema
const nameSchema = z.string();

// Number schema with constraints
const ageSchema = z.number().min(0).max(150);

// Boolean schema
const activeSchema = z.boolean();

// Date schema
const createdAtSchema = z.date();
```

### Parsing and Validation

```typescript
// Parse (throws on invalid data)
const name = nameSchema.parse('John'); // ✓ Returns "John"
const name = nameSchema.parse(123);    // ✗ Throws ZodError

// Safe parse (returns result object)
const result = nameSchema.safeParse('John');
if (result.success) {
  console.log(result.data); // "John"
} else {
  console.log(result.error.issues); // Error details
}

// Type inference
 type Name = z.infer<typeof nameSchema>; // string
```

---

## Primitive Types

### String Schemas

```typescript
const stringSchema = z.string();

// String validations
z.string().min(5);           // Minimum length
z.string().max(100);         // Maximum length
z.string().length(10);       // Exact length
z.string().email();          // Email format
z.string().url();            // URL format
z.string().uuid();           // UUID format
z.string().cuid();           // CUID format
z.string().cuid2();          // CUID2 format
z.string().ulid();           // ULID format
z.string().regex(/^[a-z]+$/); // Regex pattern
z.string().startsWith('https'); // Prefix
z.string().endsWith('.com');    // Suffix
z.string().trim();           // Auto-trim
z.string().datetime();       // ISO datetime
z.string().ip();             // IP address
z.string().emoji();          // Contains emoji

// Transformations
z.string().toLowerCase();    // Transform to lowercase
z.string().toUpperCase();    // Transform to uppercase
```

### Number Schemas

```typescript
const numberSchema = z.number();

// Number validations
z.number().gt(0);            // Greater than
z.number().gte(0);           // Greater than or equal
z.number().lt(100);          // Less than
z.number().lte(100);         // Less than or equal
z.number().int();            // Integer only
z.number().positive();       // > 0
z.number().negative();       // < 0
z.number().nonnegative();    // >= 0
z.number().nonpositive();    // <= 0
z.number().multipleOf(0.5);  // Multiple of
z.number().finite();         // Finite number
z.number().safe();           // Safe integer
```

### BigInt, Boolean, Date, and More

```typescript
// BigInt
const bigIntSchema = z.bigint();
z.bigint().positive();

// Boolean
const boolSchema = z.boolean();

// Date
const dateSchema = z.date();
z.date().min(new Date('2020-01-01'));
z.date().max(new Date('2030-12-31'));

// Symbol
const symbolSchema = z.symbol();

// Undefined and Null
const undefinedSchema = z.undefined();
const nullSchema = z.null();

// Literal types
const literalSchema = z.literal('hello');
const numLiteral = z.literal(42);
const boolLiteral = z.literal(true);
```

---

## Object Schemas

### Basic Objects

```typescript
const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(2).max(100),
  age: z.number().int().positive().optional(),
  role: z.enum(['admin', 'user', 'guest']).default('user'),
  createdAt: z.date().default(() => new Date()),
  metadata: z.record(z.string()).optional(),
});

// Type inference
type User = z.infer<typeof userSchema>;
// {
//   id: string;
//   email: string;
//   name: string;
//   age?: number | undefined;
//   role: 'admin' | 'user' | 'guest';
//   createdAt: Date;
//   metadata?: Record<string, string> | undefined;
// }
```

### Object Methods

```typescript
// Make all properties optional
const partialUser = userSchema.partial();

// Make all properties required
const requiredUser = userSchema.required();

// Pick specific keys
const userCredentials = userSchema.pick({ email: true, name: true });

// Omit specific keys
const userWithoutMetadata = userSchema.omit({ metadata: true });

// Extend schema
const adminSchema = userSchema.extend({
  permissions: z.array(z.string()),
  department: z.string(),
});

// Merge schemas
const mergedSchema = userSchema.merge(otherSchema);

// Strict mode (disallow unknown keys)
const strictUser = userSchema.strict();

// Strip unknown keys (default)
const stripUser = userSchema.strip();

// Passthrough (allow and retain unknown keys)
const passUser = userSchema.passthrough();

// Catchall for unknown keys
const catchallSchema = userSchema.catchall(z.string());
```

---

## Array and Tuple Schemas

### Arrays

```typescript
// Basic array
const stringArray = z.array(z.string());

// Array validations
z.array(z.string()).min(1);      // Non-empty
z.array(z.string()).max(100);    // Max length
z.array(z.string()).length(5);   // Exact length
z.array(z.string()).nonempty();  // At least one element

// Element validations
const taggedUsers = z.array(
  z.object({
    id: z.string(),
    tags: z.array(z.string()).min(1),
  })
);
```

### Tuples

```typescript
// Fixed-length tuple
const coordinate = z.tuple([z.number(), z.number()]);

// Tuple with rest elements
const namedCoordinate = z.tuple([
  z.string(),    // name
  z.number(),    // x
  z.number(),    // y
]).rest(z.number()); // additional coordinates

// Enum-like tuples
const httpResponse = z.tuple([
  z.number(),    // status
  z.string(),    // status text
  z.object({}),  // body
]);
```

---

## Union and Intersection Types

### Unions

```typescript
// Simple union
const stringOrNumber = z.union([z.string(), z.number()]);

// Discriminated union (discriminated by 'type' field)
const shapeSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('circle'), radius: z.number() }),
  z.object({ type: z.literal('square'), side: z.number() }),
  z.object({ type: z.literal('rectangle'), width: z.number(), height: z.number() }),
]);

// Nullable
const nullableString = z.string().nullable(); // string | null

// Optional (undefined)
const optionalString = z.string().optional(); // string | undefined

// Nullish (null or undefined)
const nullishString = z.string().nullish(); // string | null | undefined
```

### Intersections

```typescript
const nameSchema = z.object({ name: z.string() });
const ageSchema = z.object({ age: z.number() });

// Intersection
const personSchema = z.intersection(nameSchema, ageSchema);
// Or using .and()
const personSchema = nameSchema.and(ageSchema);

// Result: { name: string } & { age: number }
```

---

## Enums and Literals

### Native Enums

```typescript
enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}

const roleSchema = z.nativeEnum(UserRole);
```

### Zod Enums

```typescript
const roleSchema = z.enum(['admin', 'user', 'guest']);

type Role = z.infer<typeof roleSchema>; // 'admin' | 'user' | 'guest'

// Access enum values
roleSchema.enum.admin; // 'admin'
roleSchema.options; // ['admin', 'user', 'guest']
```

### Const Assertions (as const)

```typescript
const roles = ['admin', 'user', 'guest'] as const;
const roleSchema = z.enum(roles);
```

---

## Records and Maps

### Records

```typescript
// Record with string keys and number values
const scores = z.record(z.number());
// { [key: string]: number }

// Record with enum keys
const rolesPermissions = z.record(
  z.enum(['admin', 'user']),
  z.array(z.string())
);

// Record with validated keys
const validKeys = z.record(
  z.string().regex(/^[a-z]+$/),
  z.string()
);
```

### Maps and Sets

```typescript
// Map schema
const stringNumberMap = z.map(z.string(), z.number());

// Set schema
const uniqueStrings = z.set(z.string());
z.set(z.number()).min(1).max(100); // Set validations
```

---

## Advanced Validation

### Refinements (Custom Validation)

```typescript
const passwordSchema = z.string()
  .min(8)
  .refine((val) => /[A-Z]/.test(val), {
    message: 'Password must contain at least one uppercase letter',
  })
  .refine((val) => /[0-9]/.test(val), {
    message: 'Password must contain at least one number',
  });

// Async refinement
const emailExistsSchema = z.string().email().refine(
  async (email) => {
    const exists = await checkEmailExists(email);
    return !exists;
  },
  {
    message: 'Email already registered',
  }
);
```

### Transforms

```typescript
// String to number transform
const stringToNumber = z.string().transform((val) => val.length);

// Date string to Date object
const dateString = z.string().datetime().transform((val) => new Date(val));

// Preprocess for coercion
const coerceNumber = z.preprocess(
  (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
  z.number()
);

// Pipeline transforms (v3.23+)
const trimmedString = z.string().transform((val) => val.trim()).pipe(z.string().min(1));
```

### Coercion

```typescript
// Coerce primitives
const coerceString = z.coerce.string();
const coerceNumber = z.coerce.number();
const coerceBoolean = z.coerce.boolean();
const coerceDate = z.coerce.date();
const coerceBigint = z.coerce.bigint();

// Usage
coerceNumber.parse('42');    // 42 (number)
coerceString.parse(42);      // '42' (string)
coerceBoolean.parse('true'); // true (boolean)
```

---

## Error Handling

### ZodError

```typescript
import { ZodError } from 'zod';

try {
  userSchema.parse(invalidData);
} catch (error) {
  if (error instanceof ZodError) {
    console.log(error.issues);
    // [
    //   {
    //     code: 'invalid_type',
    //     expected: 'string',
    //     received: 'number',
    //     path: ['name'],
    //     message: 'Expected string, received number'
    //   }
    // ]
  }
}
```

### Error Formatting

```typescript
// Flatten errors
const result = userSchema.safeParse(invalidData);
if (!result.success) {
  const formatted = result.error.format();
  // {
  //   _errors: [],
  //   email: { _errors: ['Invalid email'] },
  //   name: { _errors: ['String must contain at least 2 character(s)'] }
  // }

  // Flatten to single array
  const issues = result.error.flatten();
  // {
  //   formErrors: [],
  //   fieldErrors: {
  //     email: ['Invalid email'],
  //     name: ['String must contain at least 2 character(s)']
  //   }
  // }
}
```

### Custom Error Messages

```typescript
const nameSchema = z.string({
  required_error: 'Name is required',
  invalid_type_error: 'Name must be a string',
});

const ageSchema = z.number({
  required_error: 'Age is required',
}).gte(0, { message: 'Age must be non-negative' });
```

---

## Integration Patterns

### React Hook Form Integration

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof formSchema>;

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Login</button>
    </form>
  );
}
```

### tRPC Integration

```typescript
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const appRouter = t.router({
  getUser: t.procedure
    .input(z.object({ id: z.string().uuid() }))
    .output(z.object({ id: z.string(), name: z.string() }))
    .query(({ input }) => {
      return fetchUser(input.id);
    }),
});
```

### Next.js API Route Validation

```typescript
// app/api/users/route.ts
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const result = createUserSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid input', issues: result.error.issues },
      { status: 400 }
    );
  }

  const user = await createUser(result.data);
  return NextResponse.json(user);
}
```

---

## Best Practices

### Schema Organization

```typescript
// schemas/user.ts
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(2).max(100),
  createdAt: z.date(),
});

export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
});

export const updateUserSchema = createUserSchema.partial();

export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
```

### Reusable Validators

```typescript
// schemas/common.ts
export const uuidSchema = z.string().uuid();
export const emailSchema = z.string().email();
export const timestampSchema = z.string().datetime();
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// Reusable refinements
export const passwordSchema = z.string()
  .min(8)
  .refine((val) => /[A-Z]/.test(val), 'Must contain uppercase')
  .refine((val) => /[a-z]/.test(val), 'Must contain lowercase')
  .refine((val) => /[0-9]/.test(val), 'Must contain number');
```

### DRY Schema Composition

```typescript
// Base schema
const baseEntitySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Extended schemas
const userSchema = baseEntitySchema.extend({
  email: z.string().email(),
  name: z.string(),
});

const postSchema = baseEntitySchema.extend({
  title: z.string(),
  content: z.string(),
  authorId: z.string().uuid(),
});
```

---

## Troubleshooting

### Common Issues

**Issue**: Coercion not working as expected
```typescript
// ✗ Won't coerce automatically
z.number().parse('42'); // throws

// ✓ Use coerce
z.coerce.number().parse('42'); // 42
```

**Issue**: Date parsing from JSON
```typescript
// ✗ Date objects don't survive JSON serialization
const schema = z.object({ date: z.date() });

// ✓ Use preprocess for ISO strings
const schema = z.object({
  date: z.preprocess(
    (val) => (typeof val === 'string' ? new Date(val) : val),
    z.date()
  ),
});
```

**Issue**: Optional vs nullable confusion
```typescript
// undefined only
z.string().optional(); // string | undefined

// null only
z.string().nullable(); // string | null

// null or undefined
z.string().nullish(); // string | null | undefined

// Provide default
z.string().default('');
```

---

## Resources

- **Official Docs**: https://zod.dev
- **GitHub**: https://github.com/colinhacks/zod
- **Error Translation**: https://github.com/aiji42/zod-i18n
- **Form Libraries**: @hookform/resolvers, react-hook-form
- **API Libraries**: tRPC, trpc-zod

---

## Version Notes

- **v3.x**: Current stable, feature-complete
- **v4.0 (upcoming)**: Performance improvements, smaller bundle
- This repository uses catalog version `^4.0.0` when available
