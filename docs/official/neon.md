# Neon Serverless PostgreSQL

**Official Documentation:** https://neon.com/docs/introduction  
**Latest Release:** April 2026

## Overview

Neon is the Postgres layer for the internet: a fully managed, serverless, open source Postgres designed to help developers build scalable, dependable applications faster than ever. Neon isn't "Postgres-like": it is Postgres, with full compatibility across ORMs, extensions, and frameworks.

Neon is built on a simple but powerful idea: **Postgres on the object store**. Traditional Postgres systems are designed around local or attached disks, coupling durability, storage capacity, and compute into a single machine. Neon breaks that coupling by moving durability and history into cloud object storage. Once storage lives in the object store, the rest of the system can be rethought.

**Source**: Based on [Neon Documentation](https://neon.com/docs/introduction), [Neon Serverless Driver](https://neon.com/docs/serverless/serverless-driver), and [Why Neon](https://neon.com/docs/introduction/about).

---

## What Makes Neon Different

### Serverless Postgres, Built from First Principles

Neon's defining characteristic lies in its architecture, which translates into serverless behavior that isn't layered on but foundational to the system:

- **Storage and compute are fully separated**
- **Compute is stateless and ephemeral**
- **Storage is distributed, durable, and versioned**
- **Scaling involves starting more compute, not moving a monolithic instance**

Traditional Postgres providers scale by moving VMs up and down, placing instances behind proxies, or by manual tuning. Neon does none of that.

### Developer-First Features

Neon's architecture enables a database platform that behaves the way developers expect modern tools to behave: instant, intuitive, cost-efficient, and safe to experiment with.

- **Scale-to-zero**: Inactive databases shut down automatically to save costs. Ideal for side projects, development environments, and agent-generated apps.
- **Autoscaling**: For your production database, Neon resizes your compute up and down automatically based on traffic. Your performance stays steady without capacity planning.
- **Branching**: Clone your entire database (data and schema) instantly to create dev environments, run migrations safely, automate previews, enable safe staging workflows, and build versioning and checkpoints for agents.
- **Instant restores**: Go back to any point in time in seconds, no matter how large your database, or instantly revert to a previously-saved snapshot.
- **Usage-based pricing**: Pay only for what you use, without provisioning storage or compute in advance.
- **Free Plan developers can actually use**: Unique architecture makes it efficient to run a large Free Plan with many projects per account.

---

## Key Features

### Serverless Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Neon Platform                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐         ┌──────────────────────────────┐  │
│  │   Compute    │◄───────►│      Storage (S3)            │  │
│  │  (ephemeral) │  WAL    │  (durable, bottomless)       │  │
│  └──────────────┘         └──────────────────────────────┘  │
│         ▲                                                    │
│         │                                                    │
│  ┌──────┴──────────────────────────────────────────────────┐ │
│  │                    Page Server                           │ │
│  │         (handles read requests, caching)                 │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Key Benefits**:
- **Instant provisioning**: Create databases in seconds
- **Autoscaling**: Scale compute up/down automatically
- **Database branching**: Create branches for dev/test
- **Bottomless storage**: Automatic storage scaling
- **Cost efficiency**: Pay only for active compute

### Architecture Components

| Component | Function | Characteristics |
|-----------|----------|-----------------|
| Compute | Query execution | Ephemeral, auto-scales to zero |
| Page Server | Read scaling | Multi-tenant, distributed |
| Storage | Data persistence | Durable, replicated, S3-backed |
| Safekeepers | WAL durability | Synchronous replication |

---

## Getting Started

### Creating a Project

```bash
# Via Neon Console (UI)
1. Sign up at https://neon.tech
2. Create new project
3. Select region and PostgreSQL version

# Via Neon CLI
npm install -g neonctl

# Authenticate
neonctl auth

# Create project
neonctl projects create \
  --name my-project \
  --region aws-us-east-1 \
  --pg-version 16

# List projects
neonctl projects list
```

### Connection Strings

From your Neon Project Dashboard, click the **Connect** button to open the Connection Details modal. Select your branch, database, and role. Your connection string appears automatically.

The connection string includes everything you need to connect:

```
postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.tech/dbname?sslmode=require
         ^    ^       ^                    ^
         |    |       |                    |
     role -|    |       |                    |- database
          password   |- hostname
```

**Important**: Store your connection string in an environment variable (like `DATABASE_URL`) rather than hardcoding it in your application.

```bash
# Pooled connection (recommended for serverless)
DATABASE_URL=postgresql://user:pass@pooler.neon.tech/neondb?sslmode=require

# Direct connection (for long-running processes)
DATABASE_URL_UNPOOLED=postgresql://user:pass@hostname.neon.tech/neondb?sslmode=require

# Note the -pooler in the hostname for pooled connections
# Neon supports both pooled and direct connections
```

**Note**: Neon supports both pooled and direct connections. Use a pooled connection string (with `-pooler` in the hostname) if your application creates many concurrent connections. See [Connection pooling](https://neon.com/docs/connect/connection-pooling) for details.

### Connecting from Your Application

Use your connection string to connect from any application. Here are examples for various frameworks and languages:

```typescript
// Works in Node.js, Next.js, serverless, and edge runtimes
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
const users = await sql`SELECT * FROM users`;
```

---

## Serverless Driver

### Installation

```bash
# npm
npm install @neondatabase/serverless

# pnpm
pnpm add @neondatabase/serverless

# yarn
yarn add @neondatabase/serverless

# JSR (JavaScript Registry) - alternative
jsr add @neon/serverless
```

### Basic Usage

#### HTTP Queries (Recommended for Single Queries)

```typescript
import { neon } from '@neondatabase/serverless';

// Create SQL query function
const sql = neon(process.env.DATABASE_URL!);

// Single query - returns array of rows
const posts = await sql`SELECT * FROM posts LIMIT 10`;

// Parameterized query (auto-escaped)
const post = await sql`SELECT * FROM posts WHERE id = ${postId}`;

// Insert with returning
const newPost = await sql`
  INSERT INTO posts (title, content)
  VALUES (${title}, ${content})
  RETURNING *
`;

// Multiple results with destructuring
const [users, posts] = await sql`
  SELECT * FROM users;
  SELECT * FROM posts;
`;
```

#### WebSocket Connection (For Transactions)

```typescript
import { Pool, Client } from '@neondatabase/serverless';
import ws from 'ws';

// Configure WebSocket for Node.js
neonConfig.webSocketConstructor = ws;

// Connection pool (recommended for serverless)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Execute with pool
const result = await pool.query('SELECT NOW()');

// Transactions
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('INSERT INTO users (name) VALUES ($1)', ['John']);
  await client.query('INSERT INTO accounts (user_id) VALUES (currval(pg_get_serial_sequence(users, id)))');
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
} finally {
  client.release();
}
```

### Framework Integration

#### Next.js (App Router)

```typescript
// lib/db.ts
import { neon } from '@neondatabase/serverless';

// Cache the SQL client for performance
let sql: ReturnType<typeof neon> | undefined;

export function getDb() {
  if (!sql) {
    sql = neon(process.env.DATABASE_URL!);
  }
  return sql;
}

// app/posts/page.tsx
import { getDb } from '@/lib/db';

export default async function PostsPage() {
  const sql = getDb();
  const posts = await sql`SELECT * FROM posts ORDER BY created_at DESC`;
  
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

#### Next.js (Edge Runtime)

```typescript
// app/api/posts/route.ts
export const runtime = 'edge';

import { neon } from '@neondatabase/serverless';

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  const posts = await sql`SELECT * FROM posts LIMIT 10`;
  
  return Response.json({ posts });
}
```

#### Cloudflare Workers

```typescript
// worker.ts
import { Client } from '@neondatabase/serverless';

export interface Env {
  DATABASE_URL: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const client = new Client(env.DATABASE_URL);
    await client.connect();
    
    const result = await client.query('SELECT NOW() as now');
    await client.end();
    
    return Response.json({ now: result.rows[0].now });
  },
};
```

#### Vercel Edge Functions

```typescript
// app/api/edge/route.ts
export const runtime = 'edge';

import { neon } from '@neondatabase/serverless';

export async function GET(request: Request) {
  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`SELECT version()`;
  
  return new Response(JSON.stringify(result[0]), {
    headers: { 'content-type': 'application/json' },
  });
}
```

---

## Database Branching

### Branch Concepts

```
Main Branch (Production)
    │
    ├──► Dev Branch (john/feature-x)
    │       └──► Test data, schema changes
    │
    ├──► Staging Branch
    │       └──► Pre-production testing
    │
    └──► PR Branch (auto-created)
            └──► CI/CD integration
```

### Creating Branches

```bash
# Via CLI
# Create branch from main
neonctl branches create \
  --name dev-feature \
  --parent main \
  --project-id my-project

# Create branch with specific compute size
neonctl branches create \
  --name load-test \
  --parent main \
  --compute 2

# List branches
neonctl branches list --project-id my-project

# Delete branch
neonctl branches delete dev-feature --project-id my-project
```

```typescript
// Via API
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEON_API_KEY!);

// Create branch via API
const createBranch = async (projectId: string, name: string) => {
  const response = await fetch(`https://console.neon.tech/api/v2/projects/${projectId}/branches`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEON_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      branch: {
        name,
        parent_id: 'main',
      },
    }),
  });
  
  return response.json();
};
```

### Branch Reset (Time Travel)

```bash
# Reset branch to earlier point in time
neonctl branches reset \
  --project-id my-project \
  --branch-id dev-feature \
  --parent main \
  --point-in-time '2024-01-15T10:00:00Z'
```

---

## Connection Pooling

### Pooled vs Direct Connections

```
┌──────────────────────────────────────────────────────────┐
│                    Connection Pooling                    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Serverless Functions         PgBouncer                 │
│  ┌─────┐ ┌─────┐ ┌─────┐     ┌──────────┐   PostgreSQL │
│  │  F1 │ │  F2 │ │  F3 │────►│  Pooler  │───────────┐  │
│  └─────┘ └─────┘ └─────┘     │ (PgBouncer)           │  │
│       Many connections       │  Maintains fewer      │  │
│       (short-lived)          │  persistent connections  │
│                              └──────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**When to use pooled connection**:
- Serverless functions (Vercel, AWS Lambda, Cloudflare)
- Applications with many short-lived connections
- Multi-tenant applications

**When to use direct connection**:
- Long-running processes
- Connection pooling already implemented in app
- Batch operations requiring single session

### Configuration

```typescript
// Pooled connection (via connection string)
const POOLED_URL = 'postgresql://user:pass@pooler.neon.tech/neondb?sslmode=require';

// Direct connection
const DIRECT_URL = 'postgresql://user:pass@hostname.neon.tech/neondb?sslmode=require';

// Application configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Neon handles pooling, so keep max connections low
  max: 10,
  // Short idle timeout for serverless
  idleTimeoutMillis: 10000,
});
```

---

## Compute Configuration

### Autoscaling

```bash
# Enable autoscaling via CLI
neonctl projects update \
  --project-id my-project \
  --autoscaling-min 0.25 \
  --autoscaling-max 2

# View compute endpoints
neonctl compute list --project-id my-project

# Update compute size
neonctl compute update \
  --project-id my-project \
  --compute-id my-compute \
  --size 1
```

### Scale to Zero

Neon automatically suspends compute after a period of inactivity:

```bash
# Configure auto-suspend
neonctl projects update \
  --project-id my-project \
  --suspend-timeout 300  # 5 minutes
```

**Cold Start Behavior**:
- First query after suspension has latency (~1-2s)
- Subsequent queries are fast
- Use connection pooling to minimize impact

---

## Security

### Network Security

```bash
# Restrict IP access
neonctl projects update \
  --project-id my-project \
  --allowed-ips "203.0.113.0/24,198.51.100.10"

# Enable passwordless auth (Neon Auth)
neonctl auth enable --project-id my-project
```

### Row Level Security (RLS)

```sql
-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY user_isolation ON users
  FOR ALL
  USING (auth.uid() = id);

CREATE POLICY post_ownership ON posts
  FOR ALL
  USING (auth.uid() = user_id);

-- Enable for specific operations
CREATE POLICY public_posts ON posts
  FOR SELECT
  USING (is_published = true);
```

### Environment Variable Management

```bash
# .env.development
DATABASE_URL=postgresql://dev:password@pooler.neon.tech/devdb?sslmode=require

# .env.production
DATABASE_URL=postgresql://prod:password@pooler.neon.tech/proddb?sslmode=require

# Connection string with all options
DATABASE_URL=postgresql://user:pass@hostname.neon.tech/db?
  sslmode=require&
  connect_timeout=10&
  application_name=myapp
```

---

## Best Practices

### Performance Optimization

```typescript
// 1. Use connection pooling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 10000,
});

// 2. Use prepared statements for repeated queries
const getUser = await sql.prepare('SELECT * FROM users WHERE id = $1');
const user = await getUser(userId);

// 3. Batch operations
const insertUsers = await sql`
  INSERT INTO users (name, email)
  SELECT * FROM UNNEST(
    ${['Alice', 'Bob', 'Charlie']},
    ${['a@example.com', 'b@example.com', 'c@example.com']}
  )
  RETURNING *
`;

// 4. Use appropriate connection for workload
// - HTTP driver for single queries
// - WebSocket for transactions
// - Pooled for serverless

// 5. Index optimization
await sql`CREATE INDEX CONCURRENTLY idx_posts_user_id ON posts(user_id)`;
```

### Error Handling

```typescript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Handle connection errors
try {
  const result = await sql`SELECT * FROM posts`;
} catch (error) {
  if (error.message.includes('connection')) {
    // Retry with exponential backoff
    console.error('Connection failed, retrying...');
  } else if (error.message.includes('timeout')) {
    // Query timeout
    console.error('Query timed out');
  } else {
    throw error;
  }
}

// Transaction error handling
const client = await pool.connect();
try {
  await client.query('BEGIN');
  // ... operations
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
  console.error('Transaction failed:', e);
} finally {
  client.release();
}
```

### Migration Strategy

```typescript
// migrate.ts
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const migrations = [
  {
    id: 1,
    up: `CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );`,
    down: 'DROP TABLE users;',
  },
  // ... more migrations
];

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Create migrations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT PRIMARY KEY,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    
    // Get applied migrations
    const { rows: applied } = await client.query(
      'SELECT id FROM migrations ORDER BY id'
    );
    const appliedIds = new Set(applied.map(r => r.id));
    
    // Apply pending migrations
    for (const migration of migrations) {
      if (!appliedIds.has(migration.id)) {
        console.log(`Applying migration ${migration.id}...`);
        await client.query(migration.up);
        await client.query(
          'INSERT INTO migrations (id) VALUES ($1)',
          [migration.id]
        );
      }
    }
    
    await client.query('COMMIT');
    console.log('Migrations complete');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

migrate().catch(console.error);
```

---

## Troubleshooting

### Common Issues

**Connection timeouts**
```typescript
// Increase timeout for slow queries
const sql = neon(process.env.DATABASE_URL!, {
  timeout: 20000, // 20 seconds
});
```

**Cold start latency**
```typescript
// Warm up connection on startup
await sql`SELECT 1`;
```

**Pool exhausted errors**
```typescript
// Increase pool size
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Increase from default
});
```

**SSL connection errors**
```bash
# Ensure sslmode=require in connection string
postgresql://user:pass@host/db?sslmode=require
```

### Debugging

```typescript
// Enable query logging
const sql = neon(process.env.DATABASE_URL!, {
  fetchOptions: {
    // Custom fetch options
  },
});

// Log all queries
const loggedSql = (...args: any[]) => {
  console.log('Query:', args[0]);
  return sql(...args);
};

// Connection health check
const healthCheck = async () => {
  try {
    const start = Date.now();
    await sql`SELECT 1`;
    return { healthy: true, latency: Date.now() - start };
  } catch (e) {
    return { healthy: false, error: e.message };
  }
};
```

---

## Resources

### Official Documentation
- [Neon Documentation](https://neon.com/docs/introduction)
- [Serverless Driver](https://neon.com/docs/serverless/serverless-driver)
- [Connection Pooling](https://neon.com/docs/connect/connection-pooling)
- [Database Branching](https://neon.com/docs/introduction/branching)
- [Neon CLI](https://neon.com/docs/reference/neon-cli)

### Integration Guides
- [Cloudflare Workers](https://developers.cloudflare.com/workers/databases/third-party-integrations/neon/)
- [Vercel Integration](https://vercel.com/integrations/neon)
- [Prisma with Neon](https://neon.com/docs/guides/prisma)
- [Drizzle ORM](https://neon.com/docs/guides/drizzle)

### Tools
- [Neon Console](https://console.neon.tech)
- [Neon CLI (neonctl)](https://www.npmjs.com/package/neonctl)
- [Serverless Driver](https://www.npmjs.com/package/@neondatabase/serverless)

---

_Updated April 2026 based on Neon documentation and serverless PostgreSQL best practices._
