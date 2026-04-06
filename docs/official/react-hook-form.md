# React Hook Form Documentation

**Repository Version:** ^7.54.0  
**Official Documentation:** https://react-hook-form.com  
**Last Updated:** April 2026

## Overview

React Hook Form is a performant, flexible, and extensible form library for React with easy-to-use validation. It embraces uncontrolled components and native HTML form validation, resulting in better performance and less re-renders.

### Core Philosophy

React Hook Form reduces the amount of code you need to write while removing unnecessary re-renders. It works with uncontrolled components using `ref`, making forms faster and more performant by avoiding unnecessary state updates.

### Why React Hook Form?

- **Performance**: Minimizes re-renders and improves form performance
- **Developer Experience**: Simple, intuitive API with minimal boilerplate
- **Validation**: Built-in validation with support for schema validation (Zod, Yup, Joi)
- **Tiny Bundle**: Small footprint with no dependencies
- **TypeScript**: First-class TypeScript support

---

## Installation

### Package Installation

```bash
# npm
npm install react-hook-form

# pnpm (recommended)
pnpm add react-hook-form

# yarn
yarn add react-hook-form
```

### With Resolvers (Zod/Yup/Joi)

```bash
# For Zod validation
pnpm add @hookform/resolvers zod

# For Yup validation
pnpm add @hookform/resolvers yup

# For Joi validation
pnpm add @hookform/resolvers joi
```

### Repository Setup

In `pnpm-workspace.yaml`:

```yaml
catalog:
  react-hook-form: '^7.54.0'
  '@hookform/resolvers': '^3.10.0'
```

In package `package.json`:

```json
{
  "dependencies": {
    "react-hook-form": "catalog:",
    "@hookform/resolvers": "catalog:",
    "zod": "catalog:"
  }
}
```

---

## Basic Usage

### Simple Form

```typescript
import { useForm } from 'react-hook-form';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

function SimpleForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('firstName', { required: 'First name is required' })} />
      {errors.firstName && <span>{errors.firstName.message}</span>}

      <input {...register('lastName', { required: 'Last name is required' })} />
      {errors.lastName && <span>{errors.lastName.message}</span>}

      <input 
        {...register('email', { 
          required: 'Email is required',
          pattern: {
            value: /^\S+@\S+$/i,
            message: 'Invalid email address'
          }
        })} 
      />
      {errors.email && <span>{errors.email.message}</span>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## Core API

### useForm Hook

```typescript
const {
  register,
  handleSubmit,
  watch,
  setValue,
  getValues,
  reset,
  resetField,
  trigger,
  clearErrors,
  setError,
  formState: { errors, isDirty, isSubmitting, isValid, isSubmitted },
  control,
} = useForm<FormData>({
  // Configuration options
  mode: 'onBlur',           // Validation mode: onChange | onBlur | onSubmit | onTouched | all
  defaultValues: {},        // Default form values
  resolver: undefined,      // Schema validation resolver
  context: undefined,       // Context for resolver
  criteriaMode: 'firstError', // Error display: firstError | all
  shouldFocusError: true,   // Auto-focus first error field
  delayError: undefined,    // Delay error display (ms)
});
```

### Register

The `register` function connects input fields to React Hook Form:

```typescript
// Basic registration
<input {...register('fieldName')} />

// With validation rules
<input 
  {...register('fieldName', {
    required: 'This field is required',
    minLength: { value: 4, message: 'Minimum 4 characters' },
    maxLength: { value: 20, message: 'Maximum 20 characters' },
    pattern: { value: /^[A-Za-z]+$/i, message: 'Alphabetic characters only' },
    validate: (value) => value !== 'admin' || 'Cannot use "admin"'
  })} 
/>

// Validation rules reference
register('name', {
  required: string | boolean | { value: boolean, message: string },
  min: number | { value: number, message: string },
  max: number | { value: number, message: string },
  minLength: number | { value: number, message: string },
  maxLength: number | { value: number, message: string },
  pattern: RegExp | { value: RegExp, message: string },
  validate: Function | Record<string, Function>
});
```

### Handle Submit

```typescript
const onSubmit = (data: FormData) => {
  // data contains validated form values
  console.log(data);
};

const onError = (errors: FieldErrors<FormData>) => {
  // errors contains validation errors
  console.log(errors);
};

<form onSubmit={handleSubmit(onSubmit, onError)}>
```

---

## Schema Validation with Zod

### Zod Resolver Setup

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

function RegistrationForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} />
      {errors.username && <span>{errors.username.message}</span>}

      <input type="email" {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}

      <input type="password" {...register('confirmPassword')} />
      {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}

      <button type="submit">Register</button>
    </form>
  );
}
```

---

## Form State Management

### Watching Values

```typescript
function WatchExample() {
  const { register, watch } = useForm();

  // Watch single field
  const firstName = watch('firstName');

  // Watch multiple fields
  const [firstName, lastName] = watch(['firstName', 'lastName']);

  // Watch all fields
  const allFields = watch();

  // Watch with callback
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log('Field changed:', name, type);
      console.log('New value:', value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <form>
      <input {...register('firstName')} />
      <p>Current: {firstName}</p>
      <input {...register('lastName')} />
    </form>
  );
}
```

### Set Value Programmatically

```typescript
const { setValue, getValues } = useForm();

// Set single value
setValue('firstName', 'John');

// Set with options
setValue('firstName', 'John', {
  shouldValidate: true,    // Trigger validation
  shouldDirty: true,       // Mark field as dirty
  shouldTouch: true,       // Mark field as touched
});

// Get values
const firstName = getValues('firstName');
const { firstName, lastName } = getValues(['firstName', 'lastName']);
const allValues = getValues();
```

### Reset Form

```typescript
const { reset, resetField } = useForm({
  defaultValues: {
    firstName: '',
    lastName: '',
  }
});

// Reset entire form
reset();

// Reset with new values
reset({
  firstName: 'John',
  lastName: 'Doe',
});

// Reset with options
reset(defaultValues, {
  keepErrors: false,
  keepDirty: false,
  keepValues: false,
  keepDefaultValues: false,
  keepIsSubmitted: false,
  keepTouched: false,
  keepIsValid: false,
  keepSubmitCount: false,
});

// Reset single field
resetField('firstName');
resetField('firstName', { defaultValue: 'John' });
```

---

## Controller Component

For controlled components (MUI, Chakra, Ant Design, etc.):

```typescript
import { useForm, Controller } from 'react-hook-form';
import { TextField, Select, MenuItem } from '@mui/material';
import DatePicker from 'react-datepicker';

interface FormData {
  name: string;
  date: Date;
  category: string;
}

function ControlledForm() {
  const { control, handleSubmit } = useForm<FormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Material-UI TextField */}
      <Controller
        name="name"
        control={control}
        defaultValue=""
        rules={{ required: 'Name is required' }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Name"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      {/* React Datepicker */}
      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <DatePicker
            selected={field.value}
            onChange={(date) => field.onChange(date)}
          />
        )}
      />

      {/* Material-UI Select */}
      <Controller
        name="category"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Select {...field}>
            <MenuItem value="tech">Technology</MenuItem>
            <MenuItem value="design">Design</MenuItem>
          </Select>
        )}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## Advanced Patterns

### Nested Fields

```typescript
interface FormData {
  user: {
    name: string;
    email: string;
  };
  address: {
    street: string;
    city: string;
    zip: string;
  };
}

function NestedForm() {
  const { register } = useForm<FormData>();

  return (
    <form>
      <input {...register('user.name')} />
      <input {...register('user.email')} />
      <input {...register('address.street')} />
      <input {...register('address.city')} />
      <input {...register('address.zip')} />
    </form>
  );
}
```

### Array Fields (useFieldArray)

```typescript
import { useForm, useFieldArray } from 'react-hook-form';

interface FormData {
  items: { name: string; quantity: number }[];
}

function DynamicForm() {
  const { register, control } = useForm<FormData>({
    defaultValues: {
      items: [{ name: '', quantity: 1 }]
    }
  });

  const { fields, append, remove, insert, move, swap, prepend } = useFieldArray({
    control,
    name: 'items',
  });

  return (
    <form>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input 
            {...register(`items.${index}.name`)} 
            defaultValue={field.name}
          />
          <input 
            type="number"
            {...register(`items.${index}.quantity`)} 
            defaultValue={field.quantity}
          />
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}

      <button 
        type="button" 
        onClick={() => append({ name: '', quantity: 1 })}
      >
        Add Item
      </button>
    </form>
  );
}
```

### Conditional Fields

```typescript
function ConditionalForm() {
  const { register, watch, control } = useForm();
  const hasPromotion = watch('hasPromotion');

  return (
    <form>
      <label>
        <input type="checkbox" {...register('hasPromotion')} />
        Has Promotion
      </label>

      {hasPromotion && (
        <Controller
          name="discountCode"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input {...field} placeholder="Discount Code" />
          )}
        />
      )}
    </form>
  );
}
```

---

## Form Context

For deep nesting without prop drilling:

```typescript
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

// Parent component
function FormContainer() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <NestedInput />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}

// Deeply nested child component
function NestedInput() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <>
      <input {...register('deeply.nested.field')} />
      {errors.deeply?.nested?.field && (
        <span>{errors.deeply.nested.field.message}</span>
      )}
    </>
  );
}
```

---

## Server Actions (Next.js App Router)

### Server Action with React Hook Form

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createUser } from './actions';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

type FormData = z.infer<typeof schema>;

export function UserForm() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    setError 
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const result = await createUser(data);
    
    if (result.error) {
      // Set server error
      setError('root', { message: result.error });
      return;
    }

    // Handle success
    console.log('User created:', result.user);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errors.root && (
        <div className="error">{errors.root.message}</div>
      )}
      
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
```

### Server Action File

```typescript
// actions.ts
'use server';

import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

export async function createUser(input: unknown) {
  const result = schema.safeParse(input);
  
  if (!result.success) {
    return { error: 'Invalid input', issues: result.error.issues };
  }

  try {
    const user = await db.user.create({ data: result.data });
    return { user };
  } catch (error) {
    return { error: 'Failed to create user' };
  }
}
```

---

## Best Practices

### Schema-First Validation

```typescript
// Always use schema validation for complex forms
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const { register } = useForm({
  resolver: zodResolver(schema),
});
```

### Default Values

```typescript
// Always provide defaultValues for controlled components
const { control } = useForm({
  defaultValues: {
    name: '',
    email: '',
    items: [],
  }
});
```

### Type Safety

```typescript
// Define interface for form data
interface UserFormData {
  email: string;
  name: string;
  role: 'admin' | 'user';
}

// Use with useForm
const { register } = useForm<UserFormData>();

// Type-safe field names
register('email');      // ✓ Valid
register('invalid');    // ✗ TypeScript error
```

### Error Handling

```typescript
const { formState: { errors } } = useForm();

// Display errors consistently
const ErrorMessage = ({ error }: { error?: FieldError }) => 
  error ? <span className="text-red-500">{error.message}</span> : null;

// Usage
<input {...register('email')} />
<ErrorMessage error={errors.email} />
```

### Performance Optimization

```typescript
// Use mode: 'onBlur' for better performance
const { register } = useForm({
  mode: 'onBlur', // Validate on blur instead of onChange
});

// Memoize expensive computations
const watchedValues = useWatch({ control });
const computedValue = useMemo(() => 
  expensiveComputation(watchedValues), 
  [watchedValues]
);
```

---

## Troubleshooting

### Common Issues

**Issue**: Form not submitting
```typescript
// Ensure handleSubmit is properly connected
<form onSubmit={handleSubmit(onSubmit)}>
  <button type="submit">Submit</button> // Must be type="submit"
</form>
```

**Issue**: Controlled component not updating
```typescript
// Always use Controller for controlled components
<Controller
  name="field"
  control={control}
  defaultValue="" // Required
  render={({ field }) => <Component {...field} />}
/>
```

**Issue**: Array fields losing focus
```typescript
// Use field.id as key, not index
{fields.map((field, index) => (
  <div key={field.id}> {/* Use field.id */}
    <input {...register(`items.${index}.name`)} />
  </div>
))}
```

---

## Resources

- **Official Docs**: https://react-hook-form.com
- **API Reference**: https://react-hook-form.com/docs
- **Examples**: https://github.com/react-hook-form/react-hook-form/tree/master/examples
- **Resolvers**: https://github.com/react-hook-form/resolvers

---

## Version Notes

- **v7.x**: Current stable version with improved performance
- **v8.0 (planned)**: React 19+ support, smaller bundle
- Repository uses catalog version `^7.54.0`
