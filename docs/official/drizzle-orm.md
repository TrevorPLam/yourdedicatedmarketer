# Drizzle ORM Documentation

**Repository Version:** ^1.0.0-beta.20  
**Official Documentation:** https://orm.drizzle.team  
**Last Updated:** April 2026

## Overview

Drizzle ORM is a headless TypeScript ORM with a focus on type safety, SQL-like syntax, and developer experience. It provides a thin abstraction layer over SQL while maintaining full type safety and excellent performance.

### Core Philosophy

Drizzle believes developers should write SQL. It provides a thin, type-safe abstraction that feels like writing raw SQL but with the benefits of TypeScript's type system. The ORM is designed to be predictable, performant, and easy to learn.

### Why Drizzle?

- **SQL-like**: Write queries that look like actual SQL
- **Type-safe**: Full TypeScript inference from database schema
- **Lightweight**: Small bundle size with minimal overhead
- **Flexible**: Works with any SQL database
- **Migrations**: Built-in migration system with Drizzle Kit
- **v1.0 Beta**: Stabilized migration system with versioned migration tracking

---

## Installation

### Package Installation

```bash
# Core ORM
pnpm add drizzle-orm

# Driver for your database
pnpm add @neondatabase/serverless  # Neon
pnpm add postgres                    # PostgreSQL
pnpm add mysql2                      # MySQL
pnpm add better-sqlite3              # SQLite

# Development tools
pnpm add -D drizzle-kit
```

### Repository Setup

In `pnpm-workspace.yaml`:

```yaml
catalog:
  drizzle-orm: '^1.0.0-beta.20'
  drizzle-kit: '^0.32.0'
  '@neondatabase/serverless': '^0.10.0'
```

In package `package.json`:

```json
{
  "dependencies": {
    "drizzle-orm": "catalog:",
    "@neondatabase/serverless": "catalog:"
  },
  "devDependencies": {
    "drizzle-kit": "catalog:"
  }
}
```

---

## Configuration

### Database Connection

```typescript
// db/index.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Neon serverless driver
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

// For local PostgreSQL
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
```

### Drizzle Kit Configuration

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql', // 'postgresql' | 'mysql' | 'sqlite'
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Migration configuration
  migrations: {
    table: 'migrations',
    schema: 'public',
  },
  // TypeScript strict mode
  strict: true,
  // Print SQL during migrations
  verbose: true,
});
```

---

## New in v1.0 Beta

Drizzle ORM v1.0.0-beta brings significant stability improvements, particularly to the migration system.

### Versioned Migration System

The v1.0 Beta introduces a redesigned migration tracking system with:

- **Versioned Migration Table**: Tracks migrations with version metadata
- **Folder-Based Matching**: Matches migrations by folder name instead of timestamps
- **Automatic Upgrades**: Smart backfilling for existing migrations
- **Commutativity Checks**: `drizzle-kit check` validates migration integrity
- **Conflict Resolution**: Improved handling of migration edge cases

### New SQLite Driver Support

```typescript
// node-sqlite driver support (v1.0-beta.17+)
import { drizzle } from 'drizzle-orm/node-sqlite';
import { Database } from 'better-sqlite3';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite, { schema });
```

### sqlcommenter Support

```typescript
// Automatic SQL comment injection for query tagging (v1.0-beta.19+)
// Works with PostgreSQL and MySQL
import { drizzle } from 'drizzle-orm/postgres-js';

const db = drizzle(client, {
  schema,
  // SQL comments are automatically added for observability
});
```

### Migration Improvements

```bash
# Check migration status and commutativity
drizzle-kit check

# New migration commands with better validation
drizzle-kit up       # Apply pending migrations
drizzle-kit down     # Rollback migrations
drizzle-kit status   # Show migration status
```

### Stability Improvements

- **10 Developer Team**: Drizzle now has a dedicated 10-person development team
- **Active Contributor Program**: Recognition and support for active community contributors
- **v1.0 Roadmap**: Clear timeline to stable v1.0 release

---

## Schema Definition

### Basic Tables

```typescript
// schema.ts
import { 
  pgTable, 
  serial, 
  varchar, 
  text, 
  integer, 
  boolean, 
  timestamp,
  pgEnum 
} from 'drizzle-orm/pg-core';

// Enum definition
export const userRoleEnum = pgEnum('user_role', ['admin', 'user', 'guest']);

// User table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }),
  role: userRoleEnum('role').default('user').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Posts table with relations
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  published: boolean('published').default(false).notNull(),
  authorId: integer('author_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### Column Types

```typescript
import { 
  serial, 
  integer, 
  bigint, 
  varchar, 
  char, 
  text, 
  boolean,
  timestamp,
  date,
  time,
  json,
  jsonb,
  uuid,
  decimal,
  numeric,
  real,
  doublePrecision,
  enum,
  array,
} from 'drizzle-orm/pg-core';

// Numeric types
serial('id');                    // Auto-increment integer
integer('count');                // Integer
bigint('big_number');            // BigInt
decimal('price', { precision: 10, scale: 2 }); // Decimal
numeric('amount');               // Numeric
real('rating');                  // 4-byte float
doublePrecision('precise');      // 8-byte float

// String types
varchar('name', { length: 255 }); // Variable length
char('code', { length: 10 });     // Fixed length
text('description');              // Unlimited length

// Date/Time types
timestamp('created_at');          // Timestamp with timezone
date('birth_date');               // Date only
time('start_time');               // Time only

// Other types
boolean('is_active');             // Boolean
uuid('identifier');               // UUID
json('metadata');                 // JSON
jsonb('indexed_metadata');        // Binary JSON (indexed)
enum('status', ['pending', 'active', 'archived']); // Enum
array(text('tags'));              // Array type
```

### Constraints and Indexes

```typescript
import { pgTable, serial, varchar, integer, index, uniqueIndex } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 50 }).notNull(),
  searchVector: text('search_vector'),
}, (table) => ({
  // Named indexes
  emailIdx: uniqueIndex('email_idx').on(table.email),
  usernameIdx: index('username_idx').on(table.username),
  
  // Partial index
  activeUsersIdx: index('active_users_idx')
    .on(table.email)
    .where(sql`${table.isActive} = true`),
  
  // Expression index
  searchIdx: index('search_idx')
    .on(sql`to_tsvector('english', ${table.searchVector})`),
  
  // Composite index
  compositeIdx: index('composite_idx').on(table.email, table.username),
}));
```

---

## Relations

### One-to-Many Relations

```typescript
// schema.ts
import { relations } from 'drizzle-orm';

// Define tables
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }),
  authorId: integer('author_id').references(() => users.id),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));
```

### Many-to-Many Relations

```typescript
// Join table
export const usersToGroups = pgTable('users_to_groups', {
  userId: integer('user_id').notNull().references(() => users.id),
  groupId: integer('group_id').notNull().references(() => groups.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.groupId] }),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export const groupsRelations = relations(groups, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
  group: one(groups, {
    fields: [usersToGroups.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [usersToGroups.userId],
    references: [users.id],
  }),
}));
```

### Self-Referential Relations

```typescript
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  parentId: integer('parent_id'),
});

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
}));
```

---

## Queries

### Select Queries

```typescript
import { eq, and, or, gt, lt, like, ilike, desc, asc, sql } from 'drizzle-orm';

// Select all users
const allUsers = await db.select().from(users);

// Select specific columns
const userEmails = await db.select({
  email: users.email,
  name: users.name,
}).from(users);

// Where clause
const user = await db.select().from(users)
  .where(eq(users.id, 1));

// Multiple conditions
const activeAdmins = await db.select().from(users)
  .where(and(
    eq(users.role, 'admin'),
    eq(users.isActive, true)
  ));

// OR conditions
const result = await db.select().from(users)
  .where(or(
    eq(users.role, 'admin'),
    eq(users.role, 'moderator')
  ));

// Comparison operators
const recentUsers = await db.select().from(users)
  .where(gt(users.createdAt, new Date('2024-01-01')));

// Like/ILike for search
const johnUsers = await db.select().from(users)
  .where(like(users.name, '%John%'));

// Order by
const sortedUsers = await db.select().from(users)
  .orderBy(desc(users.createdAt));

// Limit and offset
const paginatedUsers = await db.select().from(users)
  .limit(10)
  .offset(20);
```

### Joins

```typescript
// Inner join
const postsWithAuthors = await db.select({
  post: posts,
  author: users,
}).from(posts)
  .innerJoin(users, eq(posts.authorId, users.id));

// Left join
const allPostsWithAuthors = await db.select({
  post: posts,
  author: users,
}).from(posts)
  .leftJoin(users, eq(posts.authorId, users.id));

// Right join
const result = await db.select().from(users)
  .rightJoin(posts, eq(users.id, posts.authorId));

// Full join
const result = await db.select().from(users)
  .fullJoin(posts, eq(users.id, posts.authorId));

// Multiple joins
const result = await db.select({
  post: posts,
  author: users,
  category: categories,
}).from(posts)
  .innerJoin(users, eq(posts.authorId, users.id))
  .innerJoin(categories, eq(posts.categoryId, categories.id));
```

### Aggregations

```typescript
import { count, avg, sum, max, min } from 'drizzle-orm';

// Count
const userCount = await db.select({
  count: count(),
}).from(users);

// Count with condition
const activeCount = await db.select({
  count: count(),
}).from(users)
  .where(eq(users.isActive, true));

// Group by with aggregations
const stats = await db.select({
  role: users.role,
  count: count(),
  avgAge: avg(users.age),
}).from(users)
  .groupBy(users.role);

// Having clause
const popularRoles = await db.select({
  role: users.role,
  count: count(),
}).from(users)
  .groupBy(users.role)
  .having(({ count }) => gt(count, 10));
```

### With Relations (Query Builder)

```typescript
// Query with relations
const usersWithPosts = await db.query.users.findMany({
  with: {
    posts: true,
  },
});

// Nested relations
const usersWithPostsAndCategories = await db.query.users.findMany({
  with: {
    posts: {
      with: {
        category: true,
      },
    },
  },
});

// With filtering
const userWithPublishedPosts = await db.query.users.findFirst({
  where: eq(users.id, 1),
  with: {
    posts: {
      where: eq(posts.published, true),
    },
  },
});

// Column selection in relations
const usersWithPostTitles = await db.query.users.findMany({
  with: {
    posts: {
      columns: {
        title: true,
        id: true,
      },
    },
  },
});
```

---

## Insert, Update, Delete

### Insert

```typescript
// Single insert
const newUser = await db.insert(users).values({
  email: 'john@example.com',
  name: 'John Doe',
  role: 'user',
});

// Insert returning
const insertedUser = await db.insert(users).values({
  email: 'jane@example.com',
  name: 'Jane Doe',
}).returning();

// Insert returning specific columns
const inserted = await db.insert(users).values({
  email: 'bob@example.com',
  name: 'Bob Smith',
}).returning({
  id: users.id,
  email: users.email,
});

// Multiple inserts
const newUsers = await db.insert(users).values([
  { email: 'user1@example.com', name: 'User 1' },
  { email: 'user2@example.com', name: 'User 2' },
  { email: 'user3@example.com', name: 'User 3' },
]);

// Insert on conflict
await db.insert(users).values({
  email: 'existing@example.com',
  name: 'Existing User',
}).onConflictDoNothing();

await db.insert(users).values({
  email: 'existing@example.com',
  name: 'Updated Name',
}).onConflictDoUpdate({
  target: users.email,
  set: { name: 'Updated Name' },
});
```

### Update

```typescript
// Update all (use with caution!)
await db.update(users).set({ role: 'user' });

// Update with where clause
await db.update(users)
  .set({ name: 'Updated Name' })
  .where(eq(users.id, 1));

// Update returning
const updated = await db.update(users)
  .set({ name: 'New Name' })
  .where(eq(users.id, 1))
  .returning();

// Update multiple columns
await db.update(users)
  .set({
    name: 'New Name',
    role: 'admin',
    updatedAt: new Date(),
  })
  .where(eq(users.id, 1));
```

### Delete

```typescript
// Delete all (use with caution!)
await db.delete(users);

// Delete with where
await db.delete(users).where(eq(users.id, 1));

// Delete returning
const deleted = await db.delete(users)
  .where(eq(users.id, 1))
  .returning();

// Delete multiple
await db.delete(users).where(gt(users.id, 100));
```

---

## Prepared Statements

For better performance with repeated queries:

```typescript
// Prepare a query
const prepared = db.select().from(users)
  .where(eq(users.id, sql.placeholder('id')))
  .prepare('get_user');

// Execute with different parameters
const user1 = await prepared.execute({ id: 1 });
const user2 = await prepared.execute({ id: 2 });

// With multiple placeholders
const getUsersByRole = db.select().from(users)
  .where(and(
    eq(users.role, sql.placeholder('role')),
    eq(users.isActive, sql.placeholder('active'))
  ))
  .prepare('get_users_by_role');

const admins = await getUsersByRole.execute({ role: 'admin', active: true });
```

---

## Transactions

### Basic Transactions

```typescript
// Using transaction callback
await db.transaction(async (tx) => {
  const user = await tx.insert(users).values({
    email: 'user@example.com',
    name: 'New User',
  }).returning();

  await tx.insert(posts).values({
    title: 'First Post',
    authorId: user[0].id,
  });
});

// With isolation level
await db.transaction({
  isolationLevel: 'serializable',
}, async (tx) => {
  // Transaction operations
});
```

### Savepoints

```typescript
await db.transaction(async (tx) => {
  await tx.insert(users).values({ ... });
  
  // Create savepoint
  await tx.savepoint('after_user');
  
  try {
    await tx.insert(posts).values({ ... });
  } catch (e) {
    // Rollback to savepoint on error
    await tx.rollbackToSavepoint('after_user');
  }
});
```

---

## Migrations

### Generating Migrations

```bash
# Generate migration from schema changes
pnpm drizzle-kit generate

# Push changes directly (development only)
pnpm drizzle-kit push

# Check for schema drift
pnpm drizzle-kit check

# Drop all tables
pnpm drizzle-kit drop
```

### Migration Files

Migrations are stored in the `drizzle` directory:

```
drizzle/
├── 0000_initial.sql
├── 0001_add_users_table.sql
├── 0002_add_posts_table.sql
└── meta/
    ├── 0000_snapshot.json
    ├── 0001_snapshot.json
    └── _journal.json
```

### Running Migrations

```typescript
// migrate.ts
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { db } from './index';

async function runMigrations() {
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations completed');
}

runMigrations().catch(console.error);
```

---

## Best Practices

### Schema Organization

```typescript
// schema/index.ts
export * from './users';
export * from './posts';
export * from './relations';

// schema/users.ts
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// schema/relations.ts
import { relations } from 'drizzle-orm';
import { users } from './users';
import { posts } from './posts';

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));
```

### Type Safety

```typescript
// Infer types from schema
export type User = typeof users.$inferSelect;      // Select type
export type NewUser = typeof users.$inferInsert;   // Insert type

// Use in your application
type UserProfile = User & {
  posts: Post[];
};

// Custom query result types
const userWithPosts = await db.query.users.findFirst({
  where: eq(users.id, 1),
  with: { posts: true },
});

type UserWithPosts = typeof userWithPosts;
```

### Repository Pattern

```typescript
// repositories/users.ts
import { db } from '../db';
import { users, User, NewUser } from '../schema';
import { eq } from 'drizzle-orm';

export const userRepository = {
  async findById(id: number): Promise<User | undefined> {
    return db.query.users.findFirst({
      where: eq(users.id, id),
    });
  },

  async findByEmail(email: string): Promise<User | undefined> {
    return db.query.users.findFirst({
      where: eq(users.email, email),
    });
  },

  async create(data: NewUser): Promise<User> {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  },

  async update(id: number, data: Partial<NewUser>): Promise<User> {
    const [user] = await db.update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  },

  async delete(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  },
};
```

---

## Troubleshooting

### Common Issues

**Issue**: "Cannot find module 'drizzle-orm/...'"
```typescript
// Ensure correct import paths
import { drizzle } from 'drizzle-orm/neon-http';  // ✓ Correct
import { drizzle } from 'drizzle-orm/neon';         // ✗ Incorrect
```

**Issue**: Type inference not working
```typescript
// Make sure to export schema from db setup
export const db = drizzle(sql, { schema });  // Schema required for relations
```

**Issue**: Migration errors with existing data
```bash
# Use push for development (handles existing data)
pnpm drizzle-kit push

# Or create custom migration with data transformation
```

---

## Resources

- **Official Docs**: https://orm.drizzle.team
- **GitHub**: https://github.com/drizzle-team/drizzle-orm
- **Discord**: https://discord.gg/yfjKNqE6
- **Examples**: https://github.com/drizzle-team/drizzle-orm/tree/main/examples

---

## Version Notes

- **v1.0.0-beta.20**: Current beta with stabilized migration system
- **v1.0 Beta highlights**:
  - Redesigned versioned migration tracking system
  - Folder-based migration matching (not timestamps)
  - Automatic migration upgrades with smart backfilling
  - New commutativity checks (`drizzle-kit check`)
  - `node-sqlite` driver support
  - sqlcommenter support for PostgreSQL and MySQL
  - 10-person dedicated development team
  - Clear v1.0 stable release roadmap
- **Recent beta releases**:
  - beta.20: Latest bug fixes and stability improvements
  - beta.19: sqlcommenter support for PostgreSQL and MySQL
  - beta.18: New driver support for Drizzle Kit and Studio
  - beta.17: New `node-sqlite` driver support
  - beta.16: Versioned migration table with improved architecture
- Repository uses catalog version `^1.0.0-beta.20`
- **Drizzle Kit**: v0.32.0 with improved migration commands

---

## Migration Guide: 0.35.x to 1.0.0-beta

### Breaking Changes

1. **Migration System**: Complete redesign of migration tracking
2. **Command Updates**: New CLI commands (`drizzle-kit up`, `down`, `status`)
3. **Folder Naming**: Migrations now matched by folder name, not timestamps

### Upgrading

```bash
# Update packages
npm install drizzle-orm@beta drizzle-kit@latest

# Check migration status
drizzle-kit check

# Run migrations with new system
drizzle-kit up
```

### Automatic Migration Upgrade

Drizzle Kit v1.0 Beta automatically:
1. Detects existing migrations from 0.x versions
2. Creates versioned migration table entries
3. Backfills metadata for existing migrations
4. Validates migration integrity

No manual intervention required for most projects.
