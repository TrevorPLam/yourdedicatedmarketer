# @agency/types

Shared TypeScript definitions for the marketing agency monorepo.

## Overview

This package provides common TypeScript interfaces and types used across all
applications and packages in the monorepo. It ensures type consistency and
enables better developer experience through shared type definitions.

## Installation

```bash
pnpm add @agency/types --workspace
```

## Usage

### Import all types

```typescript
import * as AgencyTypes from '@agency/types';
```

### Import specific modules

```typescript
import { ApiResponse, ApiEndpoints } from '@agency/types/api';
import { CMSContent, ContentCollection } from '@agency/types/cms';
import { DatabaseAdapter, Migration } from '@agency/types/database';
```

### Import common types

```typescript
import { BaseEntity, PaginatedResponse, Environment } from '@agency/types';
```

## Modules

### API Types (`./api`)

REST API, GraphQL, and WebSocket type definitions.

- `ApiRequest` / `ApiResponse`: HTTP request/response types
- `ApiEndpoints`: Common API endpoint definitions
- `GraphQLQuery` / `GraphQLResponse`: GraphQL types
- `WebSocketMessage`: WebSocket message types

### CMS Types (`./cms`)

Content management system and content collection types.

- `CMSContent`: Base content entity
- `ContentCollection`: Astro v6.0+ content collections
- `LiveCollection`: Real-time content collections
- `CMSAdapter`: CMS provider interface

### Database Types (`./database`)

Database adapter and ORM-style types.

- `DatabaseAdapter`: Database provider interface
- `Migration`: Database migration types
- `QueryBuilder`: Query builder interface
- `Model`: ORM model definitions

### Common Types (`./index`)

Shared types used across the monorepo.

- `BaseEntity`: Base entity with id and timestamps
- `PaginatedResponse`: Standardized pagination response
- `ApiResponse`: Standardized API response
- `Environment`: Environment configuration types

## Development

### Build

```bash
pnpm build
```

### Watch mode

```bash
pnpm dev
```

### Type checking

```bash
pnpm type-check
```

## Type Safety

All types are strictly typed with:

- No implicit `any` types
- Proper null/undefined handling
- Generic type parameters where appropriate
- Comprehensive JSDoc documentation

## Version Compatibility

This package follows semantic versioning and maintains backward compatibility
within major versions.

## Contributing

When adding new types:

1. Add them to the appropriate module file
2. Export them from the module index
3. Update the main index if needed
4. Add comprehensive JSDoc documentation
5. Ensure all types are properly tested
