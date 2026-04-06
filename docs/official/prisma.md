# Prisma ORM Documentation

**Repository Version:** ^6.19.3  
**Official Documentation:** https://prisma.io/docs  
**Last Updated:** April 2026

## Overview

Prisma is a next-generation Node.js and TypeScript ORM that provides a type-safe database client, declarative data modeling, automated migrations, and a visual database management tool (Prisma Studio). It supports PostgreSQL, MySQL, SQLite, SQL Server, MongoDB, and CockroachDB.

### Core Philosophy

Prisma prioritizes developer productivity and type safety. It generates a type-safe database client from your schema definition, providing excellent autocomplete and preventing runtime errors through static type checking.

### Why Prisma?

- **Type-Safe Database Client**: Auto-generated types from schema
- **Declarative Data Modeling**: Clean, intuitive schema syntax
- **Auto-Generated Migrations**: Database migrations from schema changes
- **Prisma Studio**: Visual database management tool
- **Connection Pooling**: Built-in connection management
- **Query Optimization**: Performance insights and query analysis
- **Query Compiler (Preview)**: Rust-free ORM for PostgreSQL & SQLite
- **Driver Adapters**: Flexible database driver architecture

---

## Installation

### Package Installation

```bash
# Core packages
pnpm add @prisma/client
pnpm add -D prisma

# Database drivers (if needed separately)
pnpm add pg  # PostgreSQL
pnpm add mysql2  # MySQL

# Driver adapters for Query Compiler (Preview)
pnpm add @prisma/adapter-pg  # PostgreSQL adapter
pnpm add @prisma/adapter-neon  # Neon adapter
pnpm add @prisma/adapter-libsql  # SQLite/Turso adapter
```

### Repository Setup

In `pnpm-workspace.yaml`:

```yaml
catalog:
  prisma: '^6.19.3'
  '@prisma/client': '^6.19.3'
```

In package `package.json`:

```json
{
  "dependencies": {
    "@prisma/client": "catalog:"
  },
  "devDependencies": {
    "prisma": "catalog:"
  }
}
```

---

## Configuration

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/.prisma/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Shadow database for development
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}

// Models
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  posts     Post[]
  profile   Profile?
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  author   User   @relation(fields: [authorId], references: [id])
  authorId String
  
  // Indexes
  @@index([authorId])
}

model Profile {
  id     String  @id @default(uuid())
  bio    String?
  avatar String?
  
  // Relations
  user   User   @relation(fields: [userId], references: [id])
  userId String @unique
}
```

### Environment Variables

```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
SHADOW_DATABASE_URL="postgresql://user:password@localhost:5432/shadow"
```

### Client Initialization (Query Compiler with Driver Adapter)

```typescript
// lib/prisma.ts
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

export const prisma = new PrismaClient({ adapter });

// Type exports
export type { User, Post, Profile } from '../generated/prisma';
```

---

## New in Prisma 6.x

### Query Compiler (Rust-Free ORM) - Preview

The Query Compiler represents a major architectural shift from the Rust-based query engine to a TypeScript/WASM-based architecture. Available in Preview for PostgreSQL and SQLite.

#### Benefits

- **No Binary Targets**: Eliminates native build issues
- **Better Serverless/Edge Support**: Works seamlessly in Bun, Deno, serverless functions
- **Improved Performance**: Skips serialization between Rust and JavaScript
- **Simpler Deployment**: No query engine binaries to manage

#### Enabling Query Compiler

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["queryCompiler", "driverAdapters"]
  output          = "../generated/prisma"
}
```

```bash
# Generate client with Query Compiler
npx prisma generate

# Install driver adapter
npm install @prisma/adapter-pg
```

```typescript
// Initialize with driver adapter
import { PrismaClient } from './generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });
```

### Prisma Postgres Local Development

New `prisma dev` command for local development using PGlite (embedded PostgreSQL).

```bash
# Initialize with local Prisma Postgres (sets connection string automatically)
npx prisma init

# Start local Prisma Postgres with persistent data
npx prisma dev
```

#### Features

- **Persistent Data**: Data survives between `prisma dev` sessions
- **Multiple Instances**: Run multiple local instances for parallel testing
- **Offline Development**: Work without internet connection
- **Same Experience**: Identical to remote Prisma Postgres

### Driver Adapters

Flexible database driver architecture for different environments:

| Adapter | Database | Use Case |
|---------|----------|----------|
| `@prisma/adapter-pg` | PostgreSQL | Standard Node.js PostgreSQL |
| `@prisma/adapter-neon` | Neon | Serverless/Edge PostgreSQL |
| `@prisma/adapter-libsql` | Turso/LibSQL | SQLite at the edge |
| `@prisma/adapter-planetscale` | PlanetScale | MySQL serverless |

```typescript
// Neon adapter for edge functions
import { PrismaClient } from './generated/prisma';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neon } from '@neondatabase/serverless';

const neonClient = neon(process.env.DATABASE_URL);
const adapter = new PrismaNeon(neonClient);
const prisma = new PrismaClient({ adapter });
```

### VS Code Extension Enhancements

- **Embedded Database Editor**: Manage Prisma Postgres directly in VS Code
- **Local Database UI**: View and edit local Prisma Postgres databases
- **Backup Management**: Easily restore database backups

### New Prisma Regions

Prisma Postgres now available in:
- Frankfurt (eu-central-1)
- San Francisco (us-west-1)
- Additional regions planned

---

## Schema Definition

### Data Types

```prisma
model Example {
  // String types
  id          String    @id @default(uuid())
  email       String    @unique
  name        String    @db.VarChar(255)
  description String?   @db.Text
  
  // Numeric types
  count       Int       @default(0)
  rating      Float
  price       Decimal   @db.Decimal(10, 2)
  bigNumber   BigInt
  
  // Date/Time types
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  dateOnly    DateTime? @db.Date
  
  // Boolean
  isActive    Boolean   @default(true)
  
  // JSON
  metadata    Json?
  
  // Enums
  role        Role      @default(USER)
  
  // Array (PostgreSQL only)
  tags        String[]
}

enum Role {
  USER
  ADMIN
  MODERATOR
}
```

### Field Attributes

```prisma
model User {
  // ID fields
  id        String  @id @default(uuid())
  // or
  id        Int     @id @default(autoincrement())
  // or
  id        String  @id @default(cuid())
  
  // Unique constraint
  email     String  @unique
  
  // Multiple unique fields (composite)
  @@unique([email, name])
  
  // Index
  @@index([createdAt])
  
  // Map to different column name
  createdAt DateTime @map("created_at")
  
  // Database-level default
  views     Int     @default(0) @db.Integer
  
  // Ignore field in client
  password  String  @ignore
}
```

### Relations

```prisma
// One-to-One
model User {
  id      String   @id @default(uuid())
  profile Profile?
}

model Profile {
  id     String @id @default(uuid())
  user   User   @relation(fields: [userId], references: [id])
  userId String @unique
}

// One-to-Many
model User {
  id    String @id @default(uuid())
  posts Post[]
}

model Post {
  id       String @id @default(uuid())
  author   User   @relation(fields: [authorId], references: [id])
  authorId String
}

// Many-to-Many (implicit)
model Post {
  id    String @id @default(uuid())
  tags  Tag[]
}

model Tag {
  id    String @id @default(uuid())
  name  String @unique
  posts Post[]
}

// Many-to-Many (explicit with join table)
model Post {
  id            String          @id @default(uuid())
  categories    CategoriesOnPosts[]
}

model Category {
  id    String              @id @default(uuid())
  name  String              @unique
  posts CategoriesOnPosts[]
}

model CategoriesOnPosts {
  post       Post     @relation(fields: [postId], references: [id])
  postId     String
  category   Category @relation(fields: [categoryId], references: [id])
  categoryId String
  assignedAt DateTime @default(now())
  assignedBy String
  
  @@id([postId, categoryId])
}

// Self-relations
model User {
  id           String  @id @default(uuid())
  invitedBy   User?   @relation("UserInvites", fields: [invitedById], references: [id])
  invitedById String?
  invites     User[]  @relation("UserInvites")
}
```

---

## CRUD Operations

### Create

```typescript
// Single create
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    posts: {
      create: {
        title: 'First Post',
        content: 'Hello World',
      },
    },
  },
  include: {
    posts: true,
  },
});

// Multiple creates
const users = await prisma.user.createMany({
  data: [
    { email: 'user1@example.com', name: 'User 1' },
    { email: 'user2@example.com', name: 'User 2' },
  ],
  skipDuplicates: true,
});

// Upsert (create or update)
const result = await prisma.user.upsert({
  where: { email: 'user@example.com' },
  update: { name: 'Updated Name' },
  create: { email: 'user@example.com', name: 'John Doe' },
});
```

### Read

```typescript
// Find unique
const user = await prisma.user.findUnique({
  where: { id: 'user-id' },
  include: { posts: true },
});

// Find first
const user = await prisma.user.findFirst({
  where: { email: { contains: '@example.com' } },
  orderBy: { createdAt: 'desc' },
});

// Find many
const users = await prisma.user.findMany({
  where: {
    AND: [
      { email: { endsWith: '@example.com' } },
      { createdAt: { gte: new Date('2024-01-01') } },
    ],
  },
  include: { posts: { where: { published: true } } },
  orderBy: { createdAt: 'desc' },
  take: 10,
  skip: 20,
});

// Select specific fields
const user = await prisma.user.findUnique({
  where: { id: 'user-id' },
  select: {
    id: true,
    email: true,
    posts: {
      select: {
        id: true,
        title: true,
      },
    },
  },
});
```

### Update

```typescript
// Update single
const user = await prisma.user.update({
  where: { id: 'user-id' },
  data: { name: 'Updated Name' },
});

// Update many
const count = await prisma.user.updateMany({
  where: { role: 'USER' },
  data: { role: 'PREMIUM' },
});

// Update with relation
const user = await prisma.user.update({
  where: { id: 'user-id' },
  data: {
    posts: {
      create: { title: 'New Post' },
      update: { where: { id: 'post-id' }, data: { title: 'Updated' } },
      delete: { id: 'old-post-id' },
    },
  },
});
```

### Delete

```typescript
// Delete single
const user = await prisma.user.delete({
  where: { id: 'user-id' },
});

// Delete many
const count = await prisma.user.deleteMany({
  where: { isActive: false },
});

// Delete if exists
const user = await prisma.user.delete({
  where: { email: 'user@example.com' },
}).catch(() => null);
```

---

## Query Filters

### Where Conditions

```typescript
// String filters
const users = await prisma.user.findMany({
  where: {
    email: {
      equals: 'user@example.com',
      // or
      contains: '@example.com',
      startsWith: 'admin',
      endsWith: '@company.com',
      in: ['a@example.com', 'b@example.com'],
      notIn: ['spam@example.com'],
      not: { equals: 'blocked@example.com' },
    },
    name: { mode: 'insensitive' }, // Case insensitive
  },
});

// Numeric filters
const posts = await prisma.post.findMany({
  where: {
    views: {
      gt: 100,
      gte: 100,
      lt: 1000,
      lte: 1000,
    },
  },
});

// Date filters
const users = await prisma.user.findMany({
  where: {
    createdAt: {
      gte: new Date('2024-01-01'),
      lte: new Date('2024-12-31'),
    },
  },
});

// Logical operators
const users = await prisma.user.findMany({
  where: {
    OR: [
      { role: 'ADMIN' },
      { role: 'MODERATOR' },
    ],
    AND: [
      { isActive: true },
      { emailVerified: { not: null } },
    ],
    NOT: {
      email: { endsWith: '@blocked.com' },
    },
  },
});

// Relation filters
const users = await prisma.user.findMany({
  where: {
    posts: {
      some: { published: true },
      none: { status: 'DRAFT' },
      every: { views: { gt: 100 } },
    },
  },
});
```

---

## Aggregations

```typescript
// Count
const count = await prisma.user.count({
  where: { isActive: true },
});

// Aggregate
const result = await prisma.post.aggregate({
  _count: { _all: true },
  _avg: { views: true },
  _sum: { views: true },
  _min: { views: true },
  _max: { views: true },
  where: { published: true },
});

// Group by
const grouped = await prisma.post.groupBy({
  by: ['authorId'],
  _count: { id: true },
  _sum: { views: true },
  having: {
    views: { _sum: { gt: 1000 } },
  },
});
```

---

## Transactions

### Sequential Transactions

```typescript
const [user, post] = await prisma.$transaction([
  prisma.user.create({ data: { email: 'user@example.com' } }),
  prisma.post.create({ data: { title: 'First Post', authorId: 'user-id' } }),
]);
```

### Interactive Transactions

```typescript
const result = await prisma.$transaction(async (tx) => {
  // Debit from account A
  const accountA = await tx.account.update({
    where: { id: 'A' },
    data: { balance: { decrement: 100 } },
  });
  
  // Check balance
  if (accountA.balance < 0) {
    throw new Error('Insufficient funds');
  }
  
  // Credit to account B
  const accountB = await tx.account.update({
    where: { id: 'B' },
    data: { balance: { increment: 100 } },
  });
  
  return { accountA, accountB };
}, {
  isolationLevel: 'Serializable',
  maxWait: 5000,
  timeout: 10000,
});
```

---

## Migrations

### CLI Commands

```bash
# Initialize Prisma
npx prisma init

# Generate migration
npx prisma migrate dev --name add_user_table

# Deploy migrations (production)
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset

# Generate client only (no migration)
npx prisma generate

# Format schema
npx prisma format

# Validate schema
npx prisma validate
```

### Migration Workflow

```bash
# 1. Update schema.prisma
# 2. Generate migration
npx prisma migrate dev --name descriptive_name

# 3. Review generated migration in prisma/migrations/
# 4. Apply to database
npx prisma migrate dev

# 5. Regenerate client
npx prisma generate
```

---

## Best Practices

### Repository Pattern

```typescript
// repositories/user.ts
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export const userRepository = {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { posts: true },
    });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  },

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },
};
```

### Error Handling

```typescript
import { Prisma } from '@prisma/client';

try {
  await prisma.user.create({ data: { email: 'exists@example.com' } });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Unique constraint violation
    if (error.code === 'P2002') {
      console.log('Email already exists');
    }
    // P2025: Record not found
    if (error.code === 'P2025') {
      console.log('User not found');
    }
  }
}
```

### Connection Management

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

---

## Resources

- **Official Docs**: https://prisma.io/docs
- **GitHub**: https://github.com/prisma/prisma
- **Prisma Studio**: Run `npx prisma studio`
- **Examples**: https://github.com/prisma/prisma-examples
- **Query Compiler Docs**: https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/no-rust-engine
- **Driver Adapters**: https://www.prisma.io/docs/orm/overview/databases/database-drivers

---

## Version Notes

- **v6.19.3**: Current stable with Query Compiler Preview, Driver Adapters, Prisma Postgres local development
- **v6.x highlights**:
  - Query Compiler (Rust-free ORM) in Preview for PostgreSQL & SQLite
  - Driver Adapters architecture for flexible database connections
  - Prisma Postgres local development with `prisma dev`
  - VS Code embedded database editor
  - Enhanced caching layer (v7 preview)
- Repository uses catalog version `^6.19.3`
- **Node.js Requirements**: Minimum Node.js 18.18.0 (v6.x), TypeScript 5.1.0+

---

## Migration Guide: 5.x to 6.x

### Breaking Changes

1. **Node.js Version**: Minimum Node.js 18.18.0 required
2. **TypeScript Version**: Minimum TypeScript 5.1.0 required
3. **Deprecated Features**: Some legacy features removed (check Prisma documentation)

### Upgrading

```bash
# Update packages
npm install prisma@latest @prisma/client@latest

# Regenerate client
npx prisma generate

# Run migrations (if needed)
npx prisma migrate dev
```

### Adopting Query Compiler (Optional)

```prisma
# Add preview features to schema
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["queryCompiler", "driverAdapters"]
  output          = "../generated/prisma"
}
```

```bash
# Install driver adapter
npm install @prisma/adapter-pg

# Regenerate client
npx prisma generate
```

```typescript
// Update client initialization
import { PrismaClient } from './generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
```
