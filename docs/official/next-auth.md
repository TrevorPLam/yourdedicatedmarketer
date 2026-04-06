# NextAuth.js (Auth.js) Documentation

**Repository Version:** ^5.0.0-beta.30  
**Official Documentation:** https://authjs.dev  
**Last Updated:** April 2026

## Overview

Auth.js (formerly NextAuth.js) is the open-source authentication solution for Next.js applications. Version 5 brings first-class support for Next.js App Router, server components, and server actions, with a focus on edge compatibility and type safety.

### Core Philosophy

Auth.js prioritizes security and simplicity while maintaining flexibility. It supports multiple authentication providers, session strategies, and database adapters while keeping the API intuitive and well-typed.

### Why Auth.js v5?

- **App Router Native**: First-class support for Next.js 13+ App Router
- **Edge Compatible**: Runs on Edge Runtime
- **Type Safe**: Full TypeScript support with generated types
- **Multiple Providers**: OAuth, credentials, email magic links, WebAuthn
- **Database Agnostic**: Works with any database via adapters
- **Session Flexibility**: JWT or database sessions

---

## Installation

### Package Installation

```bash
# Core package (v5 uses next-auth with @auth/core)
pnpm add next-auth@beta

# Database adapters (choose one)
pnpm add @auth/prisma-adapter
pnpm add @auth/supabase-adapter
pnpm add @auth/drizzle-adapter

# Additional providers
pnpm add @auth/sveltekit  # For SvelteKit
pnpm add @auth/express    # For Express
```

### Repository Setup

In `pnpm-workspace.yaml`:

```yaml
catalog:
  next-auth: '^5.0.0-beta.30'
  '@auth/prisma-adapter': '^5.0.0'
  '@auth/supabase-adapter': '^1.5.0'
```

In package `package.json`:

```json
{
  "dependencies": {
    "next-auth": "catalog:",
    "@auth/supabase-adapter": "catalog:"
  }
}
```

---

## Configuration

### Environment Variables

```bash
# .env.local
AUTH_SECRET=your-secret-key-min-32-characters-long

# OAuth Providers
AUTH_GITHUB_ID=your-github-oauth-id
AUTH_GITHUB_SECRET=your-github-oauth-secret

AUTH_GOOGLE_ID=your-google-oauth-id
AUTH_GOOGLE_SECRET=your-google-oauth-secret

# Database (for session storage)
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# Email provider (optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
EMAIL_FROM=noreply@example.com
```

### Auth Config File

```typescript
// auth.ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { SupabaseAdapter } from '@auth/supabase-adapter';

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Secret for JWT signing (auto-generated if not provided)
  secret: process.env.AUTH_SECRET,
  
  // Configure authentication providers
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  
  // Database adapter (optional, for database sessions)
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }),
  
  // Session configuration
  session: {
    strategy: 'jwt', // 'jwt' | 'database'
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  
  // Callbacks for customizing behavior
  callbacks: {
    jwt({ token, user, account, profile }) {
      // Persist user data to token
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      // Send user data to client
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
    signIn({ user, account, profile }) {
      // Control who can sign in
      return true;
    },
    redirect({ url, baseUrl }) {
      // Customize redirect behavior
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  
  // Events for lifecycle hooks
  events: {
    signIn({ user, account, profile }) {
      console.log('User signed in:', user.email);
    },
    signOut({ token }) {
      console.log('User signed out');
    },
    createUser({ user }) {
      console.log('New user created:', user.email);
    },
  },
  
  // Pages (custom routes)
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user',
  },
  
  // Debug mode (development only)
  debug: process.env.NODE_ENV === 'development',
});
```

---

## Route Handlers

### App Router Setup

```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth';
export const { GET, POST } = handlers;
```

### Middleware (Optional)

```typescript
// middleware.ts
import { auth } from '@/auth';

export default auth((req) => {
  // Check if user is authenticated
  if (!req.auth && req.nextUrl.pathname !== '/login') {
    const newUrl = new URL('/login', req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

## Server-Side Usage

### Server Components

```typescript
// app/dashboard/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();
  
  // Redirect if not authenticated
  if (!session) {
    redirect('/api/auth/signin');
  }
  
  return (
    <div>
      <h1>Welcome, {session.user?.name}</h1>
      <p>Email: {session.user?.email}</p>
      <p>Role: {session.user?.role}</p>
    </div>
  );
}
```

### Server Actions

```typescript
// app/actions.ts
'use server';

import { auth } from '@/auth';

export async function updateUserProfile(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  
  // Perform authenticated action
  await db.user.update({
    where: { id: session.user.id },
    data: { name: formData.get('name') },
  });
}
```

### Route Handlers (API Routes)

```typescript
// app/api/protected/route.ts
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return NextResponse.json({ 
    message: 'Protected data',
    user: session.user 
  });
}
```

---

## Client-Side Usage

### Authentication Hooks

```typescript
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export function AuthButton() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  
  if (session) {
    return (
      <>
        <span>Signed in as {session.user?.email}</span>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  
  return (
    <>
      <span>Not signed in</span>
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
```

### Session Provider Setup

```typescript
// app/layout.tsx
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

### Sign In with Redirect

```typescript
'use client';

import { signIn } from 'next-auth/react';

export function LoginButton() {
  return (
    <button onClick={() => signIn('github', { callbackUrl: '/dashboard' })}>
      Sign in with GitHub
    </button>
  );
}
```

---

## Providers

### OAuth Providers

```typescript
// auth.ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Discord from 'next-auth/providers/discord';
import Slack from 'next-auth/providers/slack';
import Twitter from 'next-auth/providers/twitter';

export const { handlers, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      // Custom scopes
      authorization: {
        params: { scope: 'read:user user:email repo' },
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
});
```

### Credentials Provider

```typescript
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const { handlers, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validate credentials
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        
        if (!user || !user.passwordHash) {
          return null;
        }
        
        const valid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        
        if (!valid) {
          return null;
        }
        
        // Return user object
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});
```

### Email Provider (Magic Links)

```typescript
import Resend from 'next-auth/providers/resend';
import Nodemailer from 'next-auth/providers/nodemailer';

export const { handlers, auth } = NextAuth({
  providers: [
    // Using Resend
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: 'auth@example.com',
    }),
    
    // Using Nodemailer (SMTP)
    Nodemailer({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
});
```

---

## Database Adapters

### Prisma Adapter

```typescript
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [...],
});
```

### Supabase Adapter

```typescript
import { SupabaseAdapter } from '@auth/supabase-adapter';

export const { handlers, auth } = NextAuth({
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }),
  providers: [...],
});
```

### Drizzle Adapter

```typescript
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './db';

export const { handlers, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [...],
});
```

---

## Advanced Configuration

### Custom JWT Strategy

```typescript
export const { handlers, auth } = NextAuth({
  session: { strategy: 'jwt' },
  
  callbacks: {
    async jwt({ token, trigger, session, account }) {
      // Initial sign in
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      
      // Session update triggered
      if (trigger === 'update' && session?.name) {
        token.name = session.name;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.id = token.sub;
      session.user.provider = token.provider;
      return session;
    },
  },
});
```

### Role-Based Access Control

```typescript
// auth.ts
export const { handlers, auth } = NextAuth({
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow only specific email domains
      if (user.email?.endsWith('@company.com')) {
        return true;
      }
      return false;
    },
    
    async jwt({ token, user }) {
      if (user) {
        // Fetch user role from database
        const dbUser = await db.user.findUnique({
          where: { email: user.email },
        });
        token.role = dbUser?.role ?? 'user';
      }
      return token;
    },
    
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
});

// Middleware for role protection
// middleware.ts
import { auth } from '@/auth';

export default auth((req) => {
  const { nextUrl, auth } = req;
  
  const isAdminRoute = nextUrl.pathname.startsWith('/admin');
  const isAdmin = auth?.user?.role === 'admin';
  
  if (isAdminRoute && !isAdmin) {
    return Response.redirect(new URL('/unauthorized', nextUrl.origin));
  }
});
```

---

## TypeScript Types

### Module Augmentation

```typescript
// types/auth.d.ts
import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
    accessToken?: string;
  }

  interface User extends DefaultUser {
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    accessToken?: string;
  }
}
```

---

## Best Practices

### Security

```typescript
// Always use HTTPS in production
// Set secure cookies
cookies: {
  sessionToken: {
    name: `__Secure-next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    },
  },
},

// Use strong secrets
secret: process.env.AUTH_SECRET, // Min 32 characters

// Implement CSRF protection
csrfToken: true,
```

### Environment Configuration

```typescript
// Validate environment variables
import { z } from 'zod';

const envSchema = z.object({
  AUTH_SECRET: z.string().min(32),
  AUTH_GITHUB_ID: z.string(),
  AUTH_GITHUB_SECRET: z.string(),
  DATABASE_URL: z.string().url(),
});

envSchema.parse(process.env);
```

---

## Troubleshooting

### Common Issues

**Issue**: "Cannot find module 'next-auth/react'"
```bash
# Ensure correct version
pnpm add next-auth@beta
```

**Issue**: Session not persisting
```typescript
// Check session configuration
session: {
  strategy: 'jwt', // or 'database' with adapter
  maxAge: 30 * 24 * 60 * 60,
}
```

**Issue**: Callbacks not firing
```typescript
// Ensure callbacks are properly exported
export const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
    jwt({ token, user }) {
      // Must return token
      return token;
    },
  },
});
```

---

## Resources

- **Official Docs**: https://authjs.dev
- **NextAuth.js v5 Guide**: https://authjs.dev/getting-started/installation
- **GitHub**: https://github.com/nextauthjs/next-auth
- **Examples**: https://github.com/nextauthjs/next-auth/tree/main/apps/examples

---

## Version Notes

- **v5.0 (beta)**: Current version with App Router support
- **v4.x**: Legacy version for Pages Router
- Repository uses catalog version `^5.0.0-beta.30`
