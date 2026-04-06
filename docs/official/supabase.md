# Supabase Documentation

**Repository Version:** ^2.102.0  
**Official Documentation:** https://supabase.com/docs  
**Last Updated:** April 2026

## Overview

Supabase is an open-source Firebase alternative that provides all the backend features you need to build a product in a single platform. Supabase combines a PostgreSQL database with real-time capabilities, authentication, storage, edge functions, and more.

### Core Philosophy

Supabase is built on proven, enterprise-grade technologies. Every Supabase project is a full PostgreSQL database, the world's most trusted relational database. Supabase provides the UI, tooling, and APIs to make working with PostgreSQL as simple and fast as possible.

### Key Features

#### Database
- **Full PostgreSQL Database**: Complete Postgres database with extensions
- **Realtime Subscriptions**: Live database changes and broadcasting
- **Database Functions**: Custom PostgreSQL functions and triggers
- **Row Level Security (RLS)**: Fine-grained access control
- **Database Migrations**: Version control for your database schema
- **Database Backups**: Point-in-time recovery and continuous backups

#### Authentication
- **Multiple Auth Methods**: Email/password, phone, OAuth, passwordless
- **Social Providers**: Google, GitHub, Facebook, Apple, Azure, and more
- **Custom Auth**: Bring your own JWT provider
- **Multi-Factor Authentication**: TOTP and WebAuthn support
- **Security Features**: Session management, password reset, email verification
- **JWT Signing Keys**: Asymmetric key pairs for enhanced security

#### Storage
- **File Storage**: S3-compatible object storage
- **CDN Integration**: Global content delivery network
- **Image Transformation**: Automatic image optimization and resizing
- **Security**: RLS policies for file access control
- **Bucket Management**: Organize files with custom buckets

#### Realtime
- **WebSocket Connections**: Real-time database subscriptions
- **Broadcast Channels**: Custom real-time messaging
- **Presence**: Online user tracking and presence detection
- **Performance**: Efficient change detection and delivery

#### Edge Functions
- **Serverless Functions**: Deploy globally distributed functions
- **Deno Runtime**: Secure JavaScript/TypeScript runtime
- **Auto-scaling**: Scale to zero and handle traffic spikes
- **Local Development**: Test functions locally with hot reload

#### Management
- **Supabase Studio**: Beautiful dashboard for database management
- **CLI Tools**: Local development and deployment automation
- **API Generation**: Automatic REST and GraphQL APIs
- **TypeScript Support**: Generated types for full type safety

## Architecture

### Technology Stack

Supabase is composed of several open-source tools, each chosen for their enterprise-readiness and performance:

- **PostgreSQL**: The world's most advanced relational database
- **PostgREST**: Automatic REST API generation from PostgreSQL schemas
- **pg_graphql**: GraphQL API generation from PostgreSQL schemas
- **GoTrue**: JWT-based authentication service with asymmetric key support
- **Kong**: Cloud-native API gateway
- **Realtime**: Real-time subscription server using Elixir
- **Storage**: Object storage service with Postgres backend
- **imgproxy**: Image processing and CDN service
- **Supavisor**: PostgreSQL connection pooler
- **Logflare**: Log aggregation and analysis platform

### Service Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend     │    │   Mobile App   │    │   Third Party  │
│   Applications │    │   Applications │    │   Integrations │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │      Kong API Gateway     │
                    │   (Rate Limiting, Auth)   │
                    └─────────────┬─────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
┌─────────▼─────────┐  ┌─────────▼─────────┐  ┌─────────▼─────────┐
│    PostgREST      │  │      GoTrue       │  │     Realtime      │
│   (REST API)      │  │   (Auth Service)  │  │  (WebSockets)     │
└───────────────────┘  └───────────────────┘  └───────────────────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │      PostgreSQL           │
                    │   (Database + Extensions) │
                    └───────────────────────────┘
```

## Getting Started

### Quick Start

The fastest way to get started with Supabase is to create a new project on the [Supabase Dashboard](https://supabase.com/dashboard).

#### Create a Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Select your organization
4. Set up your database password and region
5. Wait for the project to be ready (usually takes 2-3 minutes)

#### Get Your API Keys

Navigate to Project Settings > API and copy your Project URL and API keys:

- **Publishable Key** (`sb_publishable_...`): Safe to use in client code
- **Service Role Key** (`sb_secret_...`): Never expose this key, use only on server
- **Legacy Keys**: Still supported during transition period

#### Connect Your Application

```javascript
// JavaScript/TypeScript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_PUBLISHABLE_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)
```

```python
# Python
from supabase import create_client, Client

url: str = "YOUR_SUPABASE_URL"
key: str = "YOUR_SUPABASE_KEY"
supabase: Client = create_client(url, key)
```

```dart
// Dart
import 'package:supabase_flutter/supabase_flutter.dart';

await Supabase.initialize(
  url: 'YOUR_SUPABASE_URL',
  anonKey: 'YOUR_SUPABASE_PUBLISHABLE_KEY',
);

final supabase = Supabase.instance.client;
```

### Local Development

For local development, use the Supabase CLI to run the entire Supabase stack locally.

#### Installing the CLI

<Tabs>
<Tab title="macOS">
```bash
brew install supabase/tap/supabase
```
</Tab>
<Tab title="Windows">
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```
</Tab>
<Tab title="Linux">
```bash
brew install supabase/tap/supabase
```
</Tab>
<Tab title="Node.js">
```bash
npx supabase --help
```
</Tab>
</Tabs>

#### Starting Local Development

1. **Initialize a project**

```bash
supabase init
```

2. **Start the local stack**

```bash
supabase start
```

This will start all Supabase services locally:
- PostgreSQL database
- Authentication service
- Storage service
- Realtime service
- Edge Functions runtime
- Studio (dashboard)

3. **Access local services**

Once started, you'll see output like:

```
Started supabase local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
     Mailpit URL: http://localhost:54324
        anon key: eyJh......
service_role key: eyJh......
```

### Database Setup

#### Creating Tables

You can create tables using the Supabase Studio, SQL Editor, or by writing SQL directly.

```sql
-- Example: Create a profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Create a posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  published BOOLEAN DEFAULT false,
  
  CONSTRAINT title_length CHECK (char_length(title) >= 3)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
```

#### Row Level Security (RLS)

RLS is PostgreSQL's built-in security feature that allows you to define policies that control who can access what data.

```sql
-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Posts policies
CREATE POLICY "Published posts are viewable by everyone" ON posts
  FOR SELECT USING (published = true);

CREATE POLICY "Users can view all their own posts" ON posts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);
```

#### Database Functions

Create custom functions for complex operations:

```sql
-- Function to get user's posts with profile info
CREATE OR REPLACE FUNCTION get_user_posts(user_uuid UUID)
RETURNS TABLE(
  id UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  title TEXT,
  content TEXT,
  published BOOLEAN,
  username TEXT,
  avatar_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.created_at,
    p.title,
    p.content,
    p.published,
    pr.username,
    pr.avatar_url
  FROM posts p
  JOIN profiles pr ON p.user_id = pr.id
  WHERE p.user_id = user_uuid
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search posts
CREATE OR REPLACE FUNCTION search_posts(search_query TEXT)
RETURNS TABLE(
  id UUID,
  title TEXT,
  content TEXT,
  username TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.content,
    pr.username
  FROM posts p
  JOIN profiles pr ON p.user_id = pr.id
  WHERE 
    p.published = true AND (
      p.title % search_query OR
      p.content % search_query OR
      pr.username % search_query
    )
  ORDER BY similarity(p.title, search_query) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Authentication

Supabase Authentication provides a complete authentication solution with support for various authentication methods and security features.

### Authentication Methods

#### Email and Password

```javascript
// Sign up with email and password
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'John Doe',
      username: 'johndoe'
    }
  }
})

// Sign in with email and password
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

#### Phone Authentication

```javascript
// Sign up with phone number
const { data, error } = await supabase.auth.signUp({
  phone: '+1234567890',
  password: 'password123'
})

// Sign in with phone and password
const { data, error } = await supabase.auth.signInWithPassword({
  phone: '+1234567890',
  password: 'password123'
})

// Verify OTP (One-Time Password)
const { data, error } = await supabase.auth.verifyOtp({
  phone: '+1234567890',
  token: '123456',
  type: 'sms'
})
```

#### Social Providers

Configure social providers in your Supabase dashboard under Authentication > Providers.

```javascript
// Sign in with OAuth provider
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://your-app.com/auth/callback',
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    }
  }
})

// Sign in with GitHub
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    redirectTo: 'https://your-app.com/auth/callback'
  }
})
```

#### Passwordless Authentication

```javascript
// Magic link (passwordless email)
const { data, error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    emailRedirectTo: 'https://your-app.com/auth/callback',
    shouldCreateUser: true,
    data: {
      username: 'johndoe'
    }
  }
})

// OTP (passwordless phone)
const { data, error } = await supabase.auth.signInWithOtp({
  phone: '+1234567890'
})
```

### Session Management

#### Current Session

```javascript
// Get current user
const { data: { user }, error } = await supabase.auth.getUser()

// Get current session
const { data: { session }, error } = await supabase.auth.getSession()

// Listen for auth state changes
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    console.log(event, session)
    // event can be: 'SIGNED_IN', 'SIGNED_OUT', 'TOKEN_REFRESHED', 'USER_UPDATED'
  }
)

// Unsubscribe when component unmounts
subscription.unsubscribe()
```

#### Session Persistence

```javascript
// Configure session persistence
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storage: localStorage, // or sessionStorage
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})
```

### Password Management

#### Reset Password

```javascript
// Send password reset email
const { data, error } = await supabase.auth.resetPasswordForEmail(
  'user@example.com',
  {
    redirectTo: 'https://your-app.com/reset-password'
  }
)

// Update password (after reset)
const { data, error } = await supabase.auth.updateUser({
  password: 'new-password123'
})
```

#### Update User Metadata

```javascript
// Update user metadata
const { data, error } = await supabase.auth.updateUser({
  data: {
    full_name: 'Jane Doe',
    avatar_url: 'https://example.com/avatar.jpg'
  }
})

// Update user email
const { data, error } = await supabase.auth.updateUser({
  email: 'new-email@example.com'
})

// Update user phone
const { data, error } = await supabase.auth.updateUser({
  phone: '+0987654321'
})
```

### Multi-Factor Authentication (MFA)

#### Enroll MFA

```javascript
// Generate MFA enrollment challenge
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: 'totp', // or 'webauthn'
  friendlyName: 'My Authenticator App'
})

// Verify and activate MFA factor
const { data, error } = await supabase.auth.mfa.verify({
  factorId: factorId,
  challengeId: challengeId,
  code: '123456' // TOTP code from authenticator app
})
```

#### Challenge MFA

```javascript
// Start MFA challenge
const { data, error } = await supabase.auth.mfa.challenge({
  factorId: factorId
})

// Verify MFA challenge
const { data, error } = await supabase.auth.mfa.verify({
  factorId: factorId,
  challengeId: challengeId,
  code: '123456'
})
```

### Security Best Practices

#### Row Level Security with Auth

```sql
-- Ensure users can only access their own data
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow public access to certain data
CREATE POLICY "Public profiles are viewable" ON profiles
  FOR SELECT USING (is_public = true);
```

#### JWT Claims

```sql
-- Access user information in RLS policies
CREATE POLICY "Users can access their data" ON sensitive_data
  FOR ALL USING (
    auth.uid() = user_id AND
    auth.role() = 'authenticated' AND
    auth.email() = 'verified@example.com'
  );

-- Check custom claims
CREATE POLICY "Premium users access" ON premium_content
  FOR SELECT USING (
    auth.jwt()->>'plan' = 'premium'
  );
```

#### Custom Auth

```javascript
// Use custom JWT provider
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    jwt: 'custom-jwt-token'
  }
})

// Or with custom JWT verification
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    detectSessionInUrl: false,
    persistSession: false
  }
})

// Set custom session
const { data, error } = await supabase.auth.setSession({
  access_token: 'your-custom-jwt',
  refresh_token: 'your-refresh-token'
})
```

### Authentication Configuration

#### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Advanced Configuration

```javascript
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // Session settings
    persistSession: true,
    storage: localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    
    // Flow settings
    flowType: 'implicit', // or 'pkce'
    
    // URL settings
    redirectTo: undefined,
    skipBrowserRedirect: false,
    
    // Verification settings
    emailVerifyRedirectTo: undefined,
    phoneVerifyRedirectTo: undefined,
    
    // Security settings
    debug: false,
    
    // OAuth settings
    oauth: {
      providerOptions: {}
    }
  }
})
```

### JWT Signing Keys

Supabase now supports asymmetric JWT signing keys for enhanced security:

#### Key Types

- **Legacy Symmetric Keys**: HS256 JWTs (still supported for backward compatibility)
- **New Asymmetric Keys**: ES256 JWTs with EC P-256 key pairs
- **New API Keys**: Opaque keys (`sb_publishable_...`, `sb_secret_...`)

#### Configuration

```javascript
// Client configuration with new API keys
const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    // Session settings
    persistSession: true,
    storage: localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    
    // Flow settings
    flowType: 'pkce', // Recommended for OAuth flows
    
    // URL settings
    redirectTo: undefined,
    skipBrowserRedirect: false,
    
    // Verification settings
    emailVerifyRedirectTo: undefined,
    phoneVerifyRedirectTo: undefined,
    
    // Security settings
    debug: false,
    
    // OAuth settings
    oauth: {
      providerOptions: {}
    }
  }
})
```

#### API Key Migration

The new API key system provides enhanced security:

```javascript
// New publishable key format
const publishableKey = 'sb_publishable_xxx_yyy'

// New service role key format  
const serviceRoleKey = 'sb_secret_xxx_yyy'

// Legacy keys still supported
const legacyAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
const legacyServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

#### Key Rotation

For enhanced security, you can rotate API keys:

```bash
# Rotate new API keys (self-hosted)
sh utils/rotate-new-api-keys.sh --update-env

# Regenerate asymmetric key pair (invalidates existing sessions)
sh utils/add-new-auth-keys.sh --update-env
```

#### Environment Variables with New Keys

```bash
# .env.local - New API keys
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx_yyy
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxx_yyy

# Legacy keys still work during transition
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Database

Supabase provides a full PostgreSQL database with additional features and extensions.

### Database Extensions

Supabase includes several PostgreSQL extensions by default:

#### pg_vector

```sql
-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create vector table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT,
  embedding vector(1536)
);

-- Create vector index for similarity search
CREATE INDEX documents_embedding_idx ON documents 
  USING ivfflat (embedding vector_cosine_ops) 
  WITH (lists = 100);

-- Perform similarity search
SELECT content, 1 - (embedding <=> '[0.1,0.2,0.3,...]'::vector) as similarity
FROM documents
ORDER BY embedding <=> '[0.1,0.2,0.3,...]'::vector
LIMIT 10;
```

#### pg_graphql

```sql
-- Enable GraphQL extension
CREATE EXTENSION IF NOT EXISTS pg_graphql;

-- Configure GraphQL
SELECT graphql.rebuild_schema();

-- Query GraphQL
-- POST /graphql/v1
{
  "query": "query { profiles { id username full_name } }"
}
```

#### pg_cron

```sql
-- Enable cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule jobs
SELECT cron.schedule(
  'cleanup-old-sessions',
  '0 2 * * *', -- Every day at 2 AM
  $$DELETE FROM sessions WHERE created_at < NOW() - INTERVAL '7 days'$$
);
```

#### Other Extensions

```sql
-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Geographic data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Cryptographic functions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- HTTP requests
CREATE EXTENSION IF NOT EXISTS http;

-- Time-series data
CREATE EXTENSION IF NOT EXISTS timescaledb;
```

### Database Functions

#### PL/pgSQL Functions

```sql
-- Create or replace function
CREATE OR REPLACE FUNCTION get_user_stats(user_id UUID)
RETURNS TABLE(
  posts_count INTEGER,
  followers_count INTEGER,
  following_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM posts WHERE user_id = get_user_stats.user_id),
    (SELECT COUNT(*) FROM follows WHERE following_id = get_user_stats.user_id),
    (SELECT COUNT(*) FROM follows WHERE follower_id = get_user_stats.user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Call the function
SELECT * FROM get_user_stats('user-uuid');
```

#### SQL Functions

```sql
-- Simple SQL function
CREATE FUNCTION get_published_posts()
RETURNS TABLE(id UUID, title TEXT, created_at TIMESTAMP) AS $$
  SELECT id, title, created_at 
  FROM posts 
  WHERE published = true 
  ORDER BY created_at DESC;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function with parameters
CREATE FUNCTION search_posts(query TEXT, limit_count INTEGER DEFAULT 10)
RETURNS TABLE(id UUID, title TEXT, content TEXT) AS $$
  SELECT id, title, content
  FROM posts
  WHERE 
    published = true AND
    (title ILIKE '%' || query || '%' OR content ILIKE '%' || query || '%')
  ORDER BY ts_rank(to_tsvector(title || ' ' || content), plainto_tsquery(query))
  LIMIT limit_count;
$$ LANGUAGE SQL SECURITY DEFINER;
```

#### Trigger Functions

```sql
-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Audit trigger
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs(
    table_name,
    operation,
    user_id,
    old_values,
    new_values,
    timestamp
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    auth.uid(),
    row_to_json(OLD),
    row_to_json(NEW),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Database Views

```sql
-- User profile view
CREATE VIEW user_profiles AS
SELECT 
  p.id,
  p.username,
  p.full_name,
  p.avatar_url,
  p.created_at,
  COUNT(DISTINCT post.id) as posts_count,
  COUNT(DISTINCT follower.follower_id) as followers_count,
  COUNT(DISTINCT following.following_id) as following_count
FROM profiles p
LEFT JOIN posts post ON p.id = post.user_id AND post.published = true
LEFT JOIN follows follower ON p.id = follower.following_id
LEFT JOIN follows following ON p.id = following.follower_id
GROUP BY p.id, p.username, p.full_name, p.avatar_url, p.created_at;

-- Materialized view for better performance
CREATE MATERIALIZED VIEW popular_posts AS
SELECT 
  posts.*,
  profiles.username,
  COUNT(DISTINCT likes.user_id) as likes_count,
  COUNT(DISTINCT comments.id) as comments_count
FROM posts
JOIN profiles ON posts.user_id = profiles.id
LEFT JOIN likes ON posts.id = likes.post_id
LEFT JOIN comments ON posts.id = comments.post_id
WHERE posts.published = true
GROUP BY posts.id, profiles.username
ORDER BY likes_count DESC;

-- Refresh materialized view
CREATE OR REPLACE FUNCTION refresh_popular_posts()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY popular_posts;
END;
$$ LANGUAGE plpgsql;

-- Schedule refresh
SELECT cron.schedule(
  'refresh-popular-posts',
  '*/30 * * * *', -- Every 30 minutes
  'SELECT refresh_popular_posts()'
);
```

### Database Indexes

```sql
-- B-tree indexes (default)
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- Composite indexes
CREATE INDEX idx_posts_user_published ON posts(user_id, published);
CREATE INDEX idx_posts_published_created ON posts(published, created_at DESC);

-- Partial indexes
CREATE INDEX idx_active_users ON profiles(id) WHERE last_active > NOW() - INTERVAL '30 days';
CREATE INDEX idx_published_posts ON posts(created_at DESC) WHERE published = true;

-- GIN indexes for full-text search
CREATE INDEX idx_posts_search ON posts USING gin(to_tsvector('english', title || ' ' || content));
CREATE INDEX idx_profiles_search ON profiles USING gin(to_tsvector('english', username || ' ' || full_name));

-- Unique indexes
CREATE UNIQUE INDEX idx_profiles_username ON profiles(username);
CREATE UNIQUE INDEX idx_profiles_email ON profiles(email);

-- Expression indexes
CREATE INDEX idx_posts_monthly ON posts(date_trunc('month', created_at));
CREATE INDEX idx_users_lower_email ON profiles(lower(email));
```

### Database Constraints

```sql
-- Primary keys
ALTER TABLE posts ADD CONSTRAINT posts_pkey PRIMARY KEY (id);

-- Foreign keys
ALTER TABLE posts ADD CONSTRAINT posts_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Unique constraints
ALTER TABLE profiles ADD CONSTRAINT profiles_username_unique 
  UNIQUE (username);

-- Check constraints
ALTER TABLE profiles ADD CONSTRAINT check_username_length 
  CHECK (char_length(username) >= 3 AND char_length(username) <= 50);

ALTER TABLE posts ADD CONSTRAINT check_title_not_empty 
  CHECK (char_length(trim(title)) > 0);

-- Not null constraints
ALTER TABLE profiles ALTER COLUMN username SET NOT NULL;
ALTER TABLE posts ALTER COLUMN title SET NOT NULL;
ALTER TABLE posts ALTER COLUMN user_id SET NOT NULL;

-- Exclusion constraints
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL,
  reserved_at TIMESTAMP NOT NULL,
  duration INTERVAL NOT NULL,
  EXCLUDE USING gist (room_id WITH =, reserved_at WITH &&)
);
```

### Database Transactions

```sql
-- Transaction blocks
BEGIN;
  INSERT INTO profiles (id, username, full_name) 
  VALUES ('user-uuid', 'johndoe', 'John Doe');
  
  INSERT INTO posts (user_id, title, content, published) 
  VALUES ('user-uuid', 'My First Post', 'Hello world!', true);
  
  UPDATE profiles 
  SET posts_count = posts_count + 1 
  WHERE id = 'user-uuid';
COMMIT;

-- Transaction with error handling
DO $$
BEGIN
  BEGIN
    -- Your operations here
    INSERT INTO posts (user_id, title) VALUES ('user-uuid', 'New Post');
    
    -- This might fail
    INSERT INTO posts (user_id, title) VALUES (NULL, 'Invalid Post');
  EXCEPTION
    WHEN others THEN
      ROLLBACK;
      RAISE NOTICE 'Transaction rolled back: %', SQLERRM;
  END;
END $$;
```

## Storage

Supabase Storage provides a simple and secure way to manage files with PostgreSQL-based permissions.

### Storage Concepts

#### Buckets

Buckets are containers for your files, similar to folders but with additional features:

```sql
-- Create buckets via SQL
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false);
```

#### File Operations

```javascript
// Upload a file
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('public/avatar1.png', file, {
    cacheControl: '3600',
    upsert: false
  })

// Download a file
const { data, error } = await supabase.storage
  .from('avatars')
  .download('public/avatar1.png')

// Get public URL
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('public/avatar1.png')

// List files
const { data, error } = await supabase.storage
  .from('avatars')
  .list('public', {
    limit: 100,
    offset: 0,
    sortBy: { column: 'created_at', order: 'desc' }
  })

// Update file metadata
const { data, error } = await supabase.storage
  .from('avatars')
  .update('public/avatar1.png', { 
    cacheControl: '7200',
    contentType: 'image/png'
  })

// Move file
const { data, error } = await supabase.storage
  .from('avatars')
  .move('public/avatar1.png', 'public/new-avatar.png')

// Copy file
const { data, error } = await supabase.storage
  .from('avatars')
  .copy('public/avatar1.png', 'public/avatar-copy.png')

// Delete files
const { data, error } = await supabase.storage
  .from('avatars')
  .remove(['public/avatar1.png', 'public/avatar2.png'])
```

### Storage Policies

Apply Row Level Security to control file access:

```sql
-- Allow public access to avatar bucket
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to update their own avatar
CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Restrict document access to owners
CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND 
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

### Advanced Storage Features

#### Image Transformation

```javascript
// Transform images on the fly
const avatarUrl = supabase.storage
  .from('avatars')
  .getPublicUrl('public/avatar1.png', {
    transform: {
      width: 200,
      height: 200,
      resize: 'cover',
      quality: 80
    }
  })

// Multiple transformations
const thumbnailUrl = supabase.storage
  .from('documents')
  .getPublicUrl('user123/preview.jpg', {
    transform: {
      width: 100,
      height: 100,
      resize: 'fill',
      gravity: 'center'
    }
  })
```

#### Folder Operations

```javascript
// Create folder (by uploading empty file)
const { data, error } = await supabase.storage
  .from('documents')
  .upload('user123/.folder', new File([], ''), {
    upsert: true
  })

// List folder contents
const { data, error } = await supabase.storage
  .from('documents')
  .list('user123', {
    search: 'pdf' // Filter by file type
  })

// Get folder size
async function getFolderSize(bucket, folder) {
  const { data } = await supabase.storage
    .from(bucket)
    .list(folder)
  
  return data?.reduce((total, file) => total + file.metadata.size, 0) || 0
}
```

#### File Upload with Progress

```javascript
// Upload with progress tracking
const uploadFile = async (file, bucket, path) => {
  return new Promise((resolve, reject) => {
    const { data, error } = supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        onUploadProgress: (progress) => {
          const percent = (progress.loaded / progress.total) * 100
          console.log(`Upload progress: ${percent}%`)
        }
      })
    
    if (error) reject(error)
    else resolve(data)
  })
}

// Chunked upload for large files
const uploadLargeFile = async (file, bucket, path, chunkSize = 5 * 1024 * 1024) => {
  const chunks = Math.ceil(file.size / chunkSize)
  const uploadPaths = []
  
  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end)
    const chunkPath = `${path}.part${i}`
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(chunkPath, chunk, { upsert: true })
    
    if (error) throw error
    uploadPaths.push(chunkPath)
  }
  
  return uploadPaths
}
```

#### CDN Integration

```javascript
// CDN URLs are automatically generated
const { data } = supabase.storage
  .from('public-assets')
  .getPublicUrl('images/logo.png')

// The returned URL will use the CDN automatically
// https://<project-ref>.supabase.co/storage/v1/object/public/public-assets/images/logo.png
```

#### Advanced File Operations

```javascript
// Upload with metadata
const { data, error } = await supabase.storage
  .from('documents')
  .upload('user123/report.pdf', file, {
    cacheControl: '3600',
    upsert: false,
    metadata: {
      title: 'Annual Report 2024',
      category: 'financial',
      tags: ['report', '2024', 'annual']
    }
  })

// Get file metadata
const { data, error } = await supabase.storage
  .from('documents')
  .getMetadata('user123/report.pdf')

// Update metadata
const { data, error } = await supabase.storage
  .from('documents')
  .updateMetadata('user123/report.pdf', {
    title: 'Updated Annual Report 2024',
    tags: ['report', '2024', 'annual', 'updated']
  })

// Create signed URLs for temporary access
const { data, error } = await supabase.storage
  .from('private-documents')
  .createSignedUrl('secret/contract.pdf', 60) // 60 seconds expiry

// Create signed upload URLs
const { data, error } = await supabase.storage
  .from('uploads')
  .createSignedUploadUrl('temp/file.jpg', 60)
```

#### Storage Security Best Practices

```sql
-- Enable RLS on storage tables
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Bucket-level policies
CREATE POLICY "Users can view their own buckets" ON storage.buckets
  FOR SELECT USING (auth.uid() = owner_id);

-- Object-level policies with time-based access
CREATE POLICY "Temporary access to shared files" ON storage.objects
  FOR SELECT USING (
    is_shared = true AND 
    created_at > NOW() - INTERVAL '24 hours'
  );

-- Size restrictions
CREATE POLICY "Limit file sizes" ON storage.objects
  FOR INSERT WITH CHECK (
    (storage.size(metadata)) <= 50 * 1024 * 1024 -- 50MB limit
  );
```

## Realtime

Supabase Realtime provides real-time database subscriptions and broadcasting capabilities.

### Database Subscriptions

#### Table Subscriptions

```javascript
// Subscribe to all changes on a table
const subscription = supabase
  .channel('public:posts')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'posts' },
    (payload) => console.log('Change received!', payload)
  )
  .subscribe()

// Subscribe to specific events
const subscription = supabase
  .channel('public:posts:insert')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'posts' },
    (payload) => {
      console.log('New post:', payload.new)
      // Handle new post
    }
  )
  .on('postgres_changes', 
    { event: 'UPDATE', schema: 'public', table: 'posts' },
    (payload) => {
      console.log('Post updated:', payload.new)
      // Handle post update
    }
  )
  .on('postgres_changes', 
    { event: 'DELETE', schema: 'public', table: 'posts' },
    (payload) => {
      console.log('Post deleted:', payload.old)
      // Handle post deletion
    }
  )
  .subscribe()

// Subscribe with filters
const subscription = supabase
  .channel('public:posts:filtered')
  .on('postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'posts',
      filter: 'user_id=eq.12345' // Only changes for user 12345
    },
    (payload) => console.log('Filtered change:', payload)
  )
  .subscribe()
```

#### Row Level Subscriptions

```javascript
// Subscribe to specific row changes
const subscription = supabase
  .channel('public:posts:single')
  .on('postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'posts',
      filter: 'id=eq.some-post-id'
    },
    (payload) => console.log('Post change:', payload)
  )
  .subscribe()

// Subscribe to user-specific data
const userSubscription = supabase
  .channel(`user:${userId}`)
  .on('postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'notifications',
      filter: `user_id=eq.${userId}`
    },
    (payload) => console.log('New notification:', payload)
  )
  .subscribe()
```

### Broadcast Channels

#### Custom Broadcasting

```javascript
// Join a broadcast channel
const channel = supabase.channel('room-1')

// Send broadcast messages
channel.send({
  type: 'broadcast',
  event: 'message',
  payload: { user: 'john', message: 'Hello everyone!' }
})

// Listen to broadcasts
channel.on('broadcast', { event: 'message' }, (payload) => {
  console.log('Received message:', payload)
})

channel.subscribe()

// Broadcast with custom events
channel.on('broadcast', { event: 'typing' }, (payload) => {
  console.log(`${payload.user} is typing...`)
})

channel.on('broadcast', { event: 'user_joined' }, (payload) => {
  console.log(`${payload.user} joined the room`)
})

channel.on('broadcast', { event: 'user_left' }, (payload) => {
  console.log(`${payload.user} left the room`)
})
```

### Presence

#### Track Online Users

```javascript
// Track user presence
const channel = supabase.channel('online-users')

// Set up presence tracking
channel.on('presence', { event: 'sync' }, () => {
  console.log('Online users:', channel.presenceState())
})

channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
  console.log('User joined:', newPresences)
})

channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
  console.log('User left:', leftPresences)
})

// Track current user
channel.track({
  user: userId,
  online_at: new Date().toISOString(),
  status: 'online'
})

// Update presence
channel.track({
  user: userId,
  online_at: new Date().toISOString(),
  status: 'away'
})

// Untrack (go offline)
channel.untrack()

channel.subscribe()
```

#### Presence with Metadata

```javascript
// Rich presence tracking
const channel = supabase.channel('collaboration')

channel.track({
  user: userId,
  cursor: { x: 100, y: 200 },
  selection: { start: 10, end: 20 },
  status: 'editing',
  last_seen: new Date().toISOString()
})

// Handle presence changes
channel.on('presence', { event: 'sync' }, () => {
  const presence = channel.presenceState()
  
  // Show user cursors
  Object.entries(presence).forEach(([key, presences]) => {
    presences.forEach(p => {
      if (p.user !== userId) {
        showUserCursor(p.user, p.cursor)
      }
    })
  })
})
```

### Advanced Realtime Patterns

#### Realtime with Authentication

```javascript
// Authenticated realtime subscriptions
const { data: { user } } = await supabase.auth.getUser()

if (user) {
  const subscription = supabase
    .channel(`user:${user.id}`)
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'user_data',
        filter: `user_id=eq.${user.id}`
      },
      (payload) => handleUserDataChange(payload)
    )
    .subscribe()
}

// Clean up on auth state change
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // Unsubscribe all channels
    supabase.removeAllChannels()
  }
})
```

#### Error Handling and Reconnection

```javascript
// Robust subscription with error handling
const createRobustSubscription = (channelName, config, callback) => {
  let retryCount = 0
  const maxRetries = 5
  
  const subscribe = () => {
    const channel = supabase.channel(channelName)
    
    channel.on('postgres_changes', config, callback)
    
    channel.subscribe((status) => {
      console.log('Subscription status:', status)
      
      if (status === 'SUBSCRIBED') {
        retryCount = 0 // Reset retry count on successful subscription
      } else if (status === 'CHANNEL_ERROR') {
        if (retryCount < maxRetries) {
          retryCount++
          console.log(`Retrying subscription (${retryCount}/${maxRetries})`)
          setTimeout(() => subscribe(), 1000 * retryCount)
        } else {
          console.error('Max retries reached, giving up')
        }
      }
    })
    
    return channel
  }
  
  return subscribe()
}

// Usage
const subscription = createRobustSubscription(
  'public:posts',
  { event: '*', schema: 'public', table: 'posts' },
  (payload) => console.log('Change:', payload)
)
```

## Edge Functions

Supabase Edge Functions are serverless functions that run globally on the Deno runtime with enhanced security features.

### Creating Edge Functions

#### Basic Function

```typescript
// supabase/functions/hello-world/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (req) => {
  const { name } = await req.json()
  const data = {
    message: `Hello ${name}!`,
  }

  return new Response(
    JSON.stringify(data), 
    { headers: { "Content-Type": "application/json" } }
  )
})
```

#### Function with Database Access

```typescript
// supabase/functions/get-user/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req) => {
  const { userId } = await req.json()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 400 }
    )
  }

  return new Response(
    JSON.stringify(data), 
    { headers: { "Content-Type": "application/json" } }
  )
})
```

#### Edge Function with Database Access

```typescript
// supabase/functions/get-user-posts/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    const { userId } = await req.json()
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required' }),
        { status: 400 }
      )
    }
    
    const { data, error } = await supabaseClient
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .eq('published', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return new Response(
      JSON.stringify({ posts: data }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    )
  }
})
```

### Securing Edge Functions

#### JWT Verification with New Keys

```typescript
// supabase/functions/_shared/jwt/default.ts
import * as jose from "jsr:@panva/jose@6";

const SUPABASE_JWT_ISSUER = Deno.env.get("SB_JWT_ISSUER") ??
  Deno.env.get("SUPABASE_URL") + "/auth/v1";

const SUPABASE_JWT_KEYS = jose.createRemoteJWKSet(
  new URL(Deno.env.get("SUPABASE_URL")! + "/auth/v1/.well-known/jwks.json"),
);

function getAuthToken(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    throw new Error("Missing authorization header");
  }
  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer") {
    throw new Error(`Auth header is not 'Bearer {token}'`);
  }

  return token;
}

function verifySupabaseJWT(jwt: string) {
  return jose.jwtVerify(jwt, SUPABASE_JWT_KEYS, {
    issuer: SUPABASE_JWT_ISSUER,
  });
}

// Validates authorization header
export async function AuthMiddleware(
  req: Request,
  next: (req: Request) => Promise<Response>,
) {
  if (req.method === "OPTIONS") return await next(req);

  try {
    const token = getAuthToken(req);
    const isValidJWT = await verifySupabaseJWT(token);

    if (isValidJWT) return await next(req);

    return Response.json({ msg: "Invalid JWT" }, {
      status: 401,
    });
  } catch (e) {
    return Response.json({ msg: e?.toString() }, {
      status: 401,
    });
  }
}
```

#### Using the Middleware

```typescript
// supabase/functions/protected-data/index.ts
import { AuthMiddleware } from "../_shared/jwt/default.ts";

interface reqPayload {
  userId: string;
}

Deno.serve((r) =>
  AuthMiddleware(r, async (req) => {
    const { userId }: reqPayload = await req.json();
    
    // Your protected logic here
    const data = {
      message: `Access granted for user ${userId}`,
      timestamp: new Date().toISOString()
    };

    return Response.json(data);
  })
);
```

#### Alternative JWT Verification

```typescript
// supabase/functions/secure-function/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SB_PUBLISHABLE_KEY')!
)

Deno.serve(async (req) => {
  const authHeader = req.headers.get('Authorization')!
  const token = authHeader.replace('Bearer ', '')

  const { data, error } = await supabase.auth.getClaims(token)
  const userEmail = data?.claims?.email
  if (!userEmail || error) {
    return Response.json(
      { msg: 'Invalid JWT' },
      {
        status: 401,
      }
    )
  }

  return Response.json({ message: `hello ${userEmail}` })
})
```

### Edge Function Patterns

#### Authentication Middleware

```typescript
// supabase/functions/protected-route/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )
    
    // Verify user is authenticated
    const { data: { user }, error } = await supabaseClient.auth.getUser()
    
    if (error || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    // User is authenticated, proceed with function logic
    const { data, error: functionError } = await supabaseClient
      .from('user_data')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (functionError) throw functionError
    
    return new Response(
      JSON.stringify(data),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
```

#### File Upload Handler

```typescript
// supabase/functions/upload-file/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    const formData = await req.formData()
    const file = formData.get('file') as File
    const bucket = formData.get('bucket') as string
    const path = formData.get('path') as string
    
    if (!file || !bucket || !path) {
      return new Response(
        JSON.stringify({ error: 'file, bucket, and path are required' }),
        { status: 400 }
      )
    }
    
    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        contentType: file.type
      })
    
    if (uploadError) throw uploadError
    
    // Get public URL
    const { data: { publicUrl } } = supabaseClient.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return new Response(
      JSON.stringify({ 
        url: publicUrl,
        path: uploadData.path,
        size: file.size
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    )
  }
})
```

### Deploying Edge Functions

#### Local Development

```bash
# Start local development
supabase start

# Deploy functions locally
supabase functions serve --env-file ./supabase/.env.local

# Test function locally
curl -i -X POST http://localhost:54321/functions/v1/hello-world \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"Supabase"}'
```

#### Deploy to Production

```bash
# Deploy single function
supabase functions deploy hello-world

# Deploy all functions
supabase functions deploy

# Deploy with specific secrets
supabase functions deploy hello-world --env-file ./supabase/.env.production

# List deployed functions
supabase functions list

# View function logs
supabase functions logs hello-world
```

### Edge Function Configuration

#### Environment Variables

```typescript
// Access environment variables
const apiKey = Deno.env.get('API_KEY')
const dbUrl = Deno.env.get('DATABASE_URL')
const isProduction = Deno.env.get('DENO_DEPLOYMENT_ID') !== undefined
```

#### Import Maps

```json
// supabase/functions/import_map.json
{
  "imports": {
    "supabase": "https://esm.sh/@supabase/supabase-js@2",
    "std/": "https://deno.land/std@0.168.0/",
    "oak": "https://deno.land/x/oak@v12.4.0/mod.ts",
    "zod": "https://deno.land/x/zod@v3.21.4/mod.ts"
  }
}
```

#### Function Dependencies

```typescript
// Using external libraries
import { Router } from 'https://deno.land/x/oak@v12.4.0/mod.ts'
import { z } from 'https://deno.land/x/zod@v3.21.4/mod.ts'

// Schema validation
const postSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  published: z.boolean().default(false)
})

serve(async (req) => {
  try {
    const body = await req.json()
    const validatedData = postSchema.parse(body)
    
    // Process validated data
    return new Response(JSON.stringify(validatedData))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Invalid data', details: error.errors }),
        { status: 400 }
      )
    }
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    )
  }
})
```

## Core Concepts

### 1. Database Setup

#### Database Schema
```sql
-- Clients table
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planning',
  start_date DATE,
  end_date DATE,
  budget NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  properties JSONB,
  user_id UUID,
  client_id UUID REFERENCES clients(id),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
```

#### Row Level Security Policies
```sql
-- Clients table policies
CREATE POLICY "Public clients are viewable by everyone" ON clients
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert clients" ON clients
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own clients" ON clients
  FOR UPDATE USING (auth.uid() = (SELECT created_by FROM clients WHERE id = id));

-- Projects table policies
CREATE POLICY "Projects are viewable by authenticated users" ON projects
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

-- Analytics events policies
CREATE POLICY "Analytics events are insertable by authenticated users" ON analytics_events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Analytics events are viewable by authenticated users" ON analytics_events
  FOR SELECT USING (auth.role() = 'authenticated');
```

### 2. TypeScript Integration

#### Database Types
```typescript
// src/types/database.ts
export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          website: string | null;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          website?: string | null;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          website?: string | null;
          featured?: boolean;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          client_id: string;
          name: string;
          description: string | null;
          status: string;
          start_date: string | null;
          end_date: string | null;
          budget: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          name: string;
          description?: string | null;
          status?: string;
          start_date?: string | null;
          end_date?: string | null;
          budget?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          name?: string;
          description?: string | null;
          status?: string;
          start_date?: string | null;
          end_date?: string | null;
          budget?: number | null;
          updated_at?: string;
        };
      };
      analytics_events: {
        Row: {
          id: string;
          event_type: string;
          properties: Record<string, any> | null;
          user_id: string | null;
          client_id: string | null;
          timestamp: string;
        };
        Insert: {
          id?: string;
          event_type: string;
          properties?: Record<string, any> | null;
          user_id?: string | null;
          client_id?: string | null;
          timestamp?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};
```

#### Supabase Client
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations
import { createClient as createAdminClient } from '@supabase/supabase-js';

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createAdminClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
```

### 3. Data Operations

#### CRUD Operations
```typescript
// src/lib/clients.ts
import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Client = Database['public']['Tables']['clients']['Row'];
type ClientInsert = Database['public']['Tables']['clients']['Insert'];
type ClientUpdate = Database['public']['Tables']['clients']['Update'];

export async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getClientById(id: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createClient(client: ClientInsert): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .insert(client)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateClient(id: string, updates: ClientUpdate): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteClient(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getFeaturedClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
```

#### Advanced Queries
```typescript
// src/lib/projects.ts
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectWithClient = Project & {
  clients: Pick<Database['public']['Tables']['clients']['Row'], 'id' | 'name'>;
};

export async function getProjects(): Promise<ProjectWithClient[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      clients (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getProjectsByClient(clientId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getProjectStats(): Promise<{
  total: number;
  byStatus: Record<string, number>;
  byMonth: Record<string, number>;
}> {
  // Get total projects
  const { count: total, error: totalError } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });

  if (totalError) throw totalError;

  // Get projects by status
  const { data: statusData, error: statusError } = await supabase
    .from('projects')
    .select('status')
    .order('status');

  if (statusError) throw statusError;

  const byStatus = statusData?.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Get projects by month
  const { data: monthData, error: monthError } = await supabase
    .from('projects')
    .select('created_at')
    .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 11)).toISOString());

  if (monthError) throw monthError;

  const byMonth = monthData?.reduce((acc, project) => {
    const month = new Date(project.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return { total: total || 0, byStatus, byMonth };
}
```

### 4. Real-time Subscriptions

#### Real-time Client Updates
```typescript
// src/hooks/useRealtimeClients.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Client } from '@/types/database';

export function useRealtimeClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    fetchClients();

    // Set up real-time subscription
    const channel = supabase
      .channel('clients-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clients',
        },
        (payload) => {
          console.log('Client change received:', payload);
          fetchClients(); // Refetch on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  return { clients, loading, refetch: fetchClients };
}
```

#### Real-time Analytics
```typescript
// src/hooks/useRealtimeAnalytics.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Row'];

export function useRealtimeAnalytics() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel('analytics-events')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'analytics_events',
        },
        (payload) => {
          console.log('New analytics event:', payload);
          setEvents(prev => [payload.new as AnalyticsEvent, ...prev.slice(0, 99)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const trackEvent = async (eventType: string, properties: Record<string, any>) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase
      .from('analytics_events')
      .insert({
        event_type: eventType,
        properties,
        user_id: user?.id || null,
      });
  };

  return { events, trackEvent };
}
```

### 5. Authentication

#### Auth Configuration
```typescript
// src/lib/auth.ts
import { supabase } from '@/lib/supabase';

export async function signUp(email: string, password: string, metadata?: Record<string, any>) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });

  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signInWithOAuth(provider: 'google' | 'github') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw error;
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
}
```

#### Auth Context
```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### 6. File Storage

#### File Upload
```typescript
// src/lib/storage.ts
import { supabase } from '@/lib/supabase';

export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  options?: {
    cacheControl?: string;
    upsert?: boolean;
  }
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
      ...options,
    });

  if (error) throw error;
  return data;
}

export async function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}

export async function deleteFile(bucket: string, path: string) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
}

export async function listFiles(bucket: string, path?: string) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(path);

  if (error) throw error;
  return data;
}

// Client logo upload
export async function uploadClientLogo(clientId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${clientId}/logo.${fileExt}`;
  
  await uploadFile('client-logos', fileName, file);
  
  return getPublicUrl('client-logos', fileName);
}

// Project file upload
export async function uploadProjectFile(projectId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${projectId}/${Date.now()}.${fileExt}`;
  
  await uploadFile('project-files', fileName, file);
  
  return getPublicUrl('project-files', fileName);
}
```

### 7. Edge Functions

#### Analytics Edge Function
```typescript
// supabase/functions/analytics/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface AnalyticsEvent {
  event_type: string;
  properties: Record<string, any>;
  user_id?: string;
  client_id?: string;
}

serve(async (req) => {
  try {
    const { event_type, properties, user_id, client_id }: AnalyticsEvent = await req.json()
    
    // Validate event
    if (!event_type) {
      return new Response(
        JSON.stringify({ error: 'event_type is required' }),
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Insert event
    const { data, error } = await supabaseClient
      .from('analytics_events')
      .insert({
        event_type,
        properties,
        user_id,
        client_id,
        timestamp: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    )
  }
})
```

#### Client Edge Function
```typescript
// supabase/functions/client-notify/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { clientId, message, type = 'info' } = await req.json()
    
    if (!clientId || !message) {
      return new Response(
        JSON.stringify({ error: 'clientId and message are required' }),
        { status: 400 }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Get client details
    const { data: client, error: clientError } = await supabaseClient
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single()

    if (clientError) throw clientError

    // Send notification (integrate with email service, Slack, etc.)
    console.log(`Notification for ${client.name}: ${message}`)

    // Log notification
    await supabaseClient
      .from('notifications')
      .insert({
        client_id: clientId,
        message,
        type,
        created_at: new Date().toISOString()
      })

    return new Response(
      JSON.stringify({ success: true, client }),
      { status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    )
  }
})
```

## Integration with Frameworks

### 1. Next.js Integration

#### API Routes
```typescript
// pages/api/clients/index.ts
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { name, description, website, featured } = req.body;
    
    const { data, error } = await supabase
      .from('clients')
      .insert({ name, description, website, featured })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end('Method not allowed');
}
```

#### Server Components
```typescript
// app/clients/page.tsx
import { createClient } from '@supabase/supabase-js';
import ClientCard from '@/components/ClientCard';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getClients() {
  const { data } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  return data || [];
}

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Our Clients</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    </div>
  );
}
```

### 2. Astro Integration

#### Astro Component
```astro
---
// src/components/ClientList.astro
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

const { data: clients } = await supabase
  .from('clients')
  .select('*')
  .order('created_at', { ascending: false });
---

<section class="client-list">
  <h2>Our Clients</h2>
  <div class="grid">
    {clients.map((client) => (
      <article class="client-card">
        <h3>{client.name}</h3>
        <p>{client.description}</p>
        <a href={client.website} target="_blank" rel="noopener noreferrer">
          Visit Website
        </a>
      </article>
    ))}
  </div>
</section>

<style>
  .client-list {
    padding: 2rem;
  }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
  
  .client-card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
  }
</style>
```

## Best Practices

### 1. Database Design
- Use proper data types and constraints
- Implement Row Level Security (RLS)
- Create appropriate indexes
- Use database functions for complex operations

### 2. Performance
- Use database indexes effectively
- Implement proper caching strategies
- Optimize queries with proper joins
- Use pagination for large datasets

### 3. Security
- Enable RLS on all tables
- Use service role keys only on server
- Validate all inputs
- Implement proper authentication

### 4. Real-time
- Subscribe only to necessary changes
- Handle connection errors gracefully
- Implement proper cleanup
- Use efficient filtering

## Common Patterns in This Repository

### 1. Client Management
```typescript
// src/lib/clients.ts
export class ClientService {
  static async getAll() {
    return supabase.from('clients').select('*');
  }
  
  static async getById(id: string) {
    return supabase.from('clients').select('*').eq('id', id).single();
  }
  
  static async create(client: ClientInsert) {
    return supabase.from('clients').insert(client).select().single();
  }
  
  static async update(id: string, updates: ClientUpdate) {
    return supabase.from('clients').update(updates).eq('id', id).select().single();
  }
  
  static async delete(id: string) {
    return supabaseAdmin.from('clients').delete().eq('id', id);
  }
}
```

### 2. Analytics Tracking
```typescript
// src/lib/analytics.ts
export class AnalyticsService {
  static track(eventType: string, properties: Record<string, any>) {
    return supabase.from('analytics_events').insert({
      event_type: eventType,
      properties,
      timestamp: new Date().toISOString()
    });
  }
  
  static async getStats(timeRange: 'day' | 'week' | 'month') {
    const startDate = new Date();
    switch (timeRange) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
    }
    
    return supabase
      .from('analytics_events')
      .select('*')
      .gte('timestamp', startDate.toISOString());
  }
}
```

### 3. File Management
```typescript
// src/lib/files.ts
export class FileService {
  static async uploadClientLogo(clientId: string, file: File) {
    const fileName = `${clientId}/logo.${file.name.split('.').pop()}`;
    await supabase.storage.from('client-logos').upload(fileName, file);
    return supabase.storage.from('client-logos').getPublicUrl(fileName);
  }
  
  static async deleteClientLogo(clientId: string) {
    const { data: files } = await supabase.storage
      .from('client-logos')
      .list(clientId);
    
    if (files && files.length > 0) {
      await supabase.storage
        .from('client-logos')
        .remove(files.map(f => `${clientId}/${f.name}`));
    }
  }
}
```

## Troubleshooting

### Common Issues

#### Connection Problems
```typescript
// Check connection
const { data, error } = await supabase.from('clients').select('count');
if (error) {
  console.error('Supabase connection error:', error);
}
```

#### RLS Policy Issues
```typescript
// Test RLS policies
const { data, error } = await supabase.rpc('test_rls');
if (error) {
  console.error('RLS policy error:', error);
}
```

#### Real-time Subscription Issues
```typescript
// Handle subscription errors
const channel = supabase
  .channel('test')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, (payload) => {
    console.log('Change received:', payload);
  })
  .subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      console.log('Subscription successful');
    } else if (status === 'CHANNEL_ERROR') {
      console.error('Subscription error');
    }
  });
```

## Supabase CLI

The Supabase CLI provides tools for local development, database management, and deployment automation.

### CLI Commands

#### Project Management

```bash
# Initialize a new project
supabase init

# Start local development stack
supabase start

# Stop local services
supabase stop

# Reset local database
supabase db reset

# Get local status
supabase status

# Link to remote project
supabase link --project-ref your-project-ref
```

#### Database Management

```bash
# Generate database types
supabase gen types typescript --local > src/types/database.ts

# Generate types for remote project
supabase gen types typescript --linked > src/types/database.ts

# Create new migration
supabase migration new create_users_table

# Apply migrations
supabase db push

# View all migrations
supabase migrations list

# Reset database to a specific migration
supabase migration reset --version 20240101000000

# Diff local and remote schemas
supabase db diff --schema public

# Create seed data
supabase db seed --file seed.sql
```

#### Branching (Experimental)

```bash
# Create new branch
supabase branches create feature-branch

# List all branches
supabase branches list

# Switch branches
supabase branches checkout feature-branch

# Merge branch
supabase branches merge feature-branch

# Delete branch
supabase branches delete feature-branch
```

#### Testing and Linting

```bash
# Test database with pgTAP
supabase test db

# Lint database schema
supabase db lint

# Test specific schema
supabase test db --schema public

# Lint with error level
supabase db lint --level error
```

#### Edge Functions

```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy my-function

# List functions
supabase functions list

# View function logs
supabase functions logs my-function

# Serve functions locally
supabase functions serve

# Serve with environment file
supabase functions serve --env-file .env.local
```

#### Secrets Management

```bash
# Set secrets from file
supabase secrets set --env-file .env

# Set individual secret
supabase secrets set MY_SECRET=value

# List all secrets
supabase secrets list

# Delete secret
supabase secrets delete MY_SECRET
```

### CLI Configuration

#### config.toml

```toml
# supabase/config.toml
[project]
ref = "your-project-ref"
name = "your-project-name"

[api]
enabled = true
port = 54321
schemas = ["public", "storage", "graphql_public"]
max_rows = 1000

[db]
port = 54322
shadow_port = 54320
major_version = 15

[studio]
enabled = true
port = 54323
api_url = "http://localhost:54321"

[inbucket]
enabled = true
port = 54324

[storage]
enabled = true
port = 54325
image_transformation_enabled = true

[auth]
enabled = true
site_url = "http://localhost:3000"
additional_redirect_urls = ["https://localhost:3000"]

[edge_runtime]
enabled = true
port = 54326
policy = "per_request"

[analytics]
enabled = false
port = 54327
backend = "http://localhost:54327"

# Branch-specific configuration
[remotes.production]
project_id = "production-project-ref"

[remotes.staging]
project_id = "staging-project-ref"
```

## Best Practices

### Database Design

#### Schema Design

```sql
-- Use UUIDs for primary keys
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Use foreign key constraints
ALTER TABLE posts 
ADD CONSTRAINT posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Add proper indexes
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_published_created ON posts(published, created_at DESC);

-- Use check constraints
ALTER TABLE users ADD CONSTRAINT check_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
```

#### Row Level Security

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Published posts are public" ON posts
  FOR SELECT USING (published = true);
```

### Performance Optimization

#### Database Performance

```sql
-- Use appropriate indexes
CREATE INDEX CONCURRENTLY idx_posts_search ON posts 
USING gin(to_tsvector('english', title || ' ' || content));

-- Use partial indexes for better performance
CREATE INDEX idx_active_users ON users(id) 
WHERE last_active > NOW() - INTERVAL '30 days';

-- Use materialized views for complex queries
CREATE MATERIALIZED VIEW user_stats AS
SELECT 
  u.id,
  u.username,
  COUNT(DISTINCT p.id) as post_count,
  COUNT(DISTINCT f.follower_id) as follower_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
LEFT JOIN follows f ON u.id = f.following_id
GROUP BY u.id, u.username;

-- Refresh materialized views periodically
CREATE OR REPLACE FUNCTION refresh_user_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_stats;
END;
$$ LANGUAGE plpgsql;

-- Schedule refresh
SELECT cron.schedule(
  'refresh-user-stats',
  '0 */6 * * *', -- Every 6 hours
  'SELECT refresh_user_stats()'
);
```

#### Query Optimization

```javascript
// Use specific column selection
const { data } = await supabase
  .from('posts')
  .select('id, title, created_at')
  .eq('published', true)

// Use proper filtering
const { data } = await supabase
  .from('posts')
  .select('*')
  .eq('user_id', userId)
  .eq('published', true)
  .order('created_at', { ascending: false })
  .limit(20)

// Use RPC for complex queries
const { data } = await supabase
  .rpc('get_user_posts_with_stats', { 
    user_id: userId,
    limit_count: 10 
  })
```

### Security Best Practices

#### API Security

```javascript
// Use service role key only on server
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Validate inputs on server
const createUser = async (userData) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({
      email: userData.email.toLowerCase().trim(),
      username: userData.username.trim(),
      created_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}
```

#### RLS Security

```sql
-- Never bypass RLS unless absolutely necessary
CREATE OR REPLACE FUNCTION admin_function()
RETURNS TABLE(users RECORD) AS $$
BEGIN
  -- This function bypasses RLS, use carefully
  RETURN QUERY SELECT * FROM users;
END;
$$ LANGUAGE sql SECURITY DEFINER;

-- Use proper JWT claims in policies
CREATE POLICY "Premium users access" ON premium_content
  FOR SELECT USING (
    auth.uid() = user_id AND
    auth.jwt()->>'subscription_tier' = 'premium'
  );
```

### Development Workflow

#### Environment Management

```bash
# .env.local (development)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-local-service-key

# .env.production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-key
```

#### Migration Strategy

```sql
-- 001_initial_schema.sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 002_add_profiles.sql
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 003_add_posts.sql
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Monitoring and Observability

### Database Monitoring

#### Performance Metrics

```sql
-- Enable pg_stat_statements
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Monitor slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  stddev_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Monitor table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Monitor index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

#### Connection Monitoring

```sql
-- Monitor active connections
SELECT 
  state,
  count(*) as connections
FROM pg_stat_activity
GROUP BY state;

-- Monitor long-running queries
SELECT 
  pid,
  now() - pg_stat_activity.query_start AS duration,
  query,
  state
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes'
ORDER BY duration DESC;
```

### Application Monitoring

#### Error Tracking

```javascript
// Centralized error handling
const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    headers: {
      'X-Client-Info': 'your-app/1.0.0',
      'X-Request-ID': crypto.randomUUID()
    }
  }
})

// Error logging
const logError = async (error, context) => {
  await supabase
    .from('error_logs')
    .insert({
      error_message: error.message,
      error_stack: error.stack,
      context: context,
      user_id: (await supabase.auth.getUser())?.data?.user?.id,
      created_at: new Date().toISOString()
    })
}
```

#### Performance Monitoring

```javascript
// Query performance tracking
const trackQuery = async (queryName, queryFn) => {
  const start = performance.now()
  
  try {
    const result = await queryFn()
    const duration = performance.now() - start
    
    await supabase
      .from('query_performance')
      .insert({
        query_name: queryName,
        duration_ms: duration,
        success: true,
        created_at: new Date().toISOString()
      })
    
    return result
  } catch (error) {
    const duration = performance.now() - start
    
    await supabase
      .from('query_performance')
      .insert({
        query_name: queryName,
        duration_ms: duration,
        success: false,
        error_message: error.message,
        created_at: new Date().toISOString()
      })
    
    throw error
  }
}

// Usage
const posts = await trackQuery('get_user_posts', () =>
  supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
)
```

## Troubleshooting

### Common Issues

#### Connection Problems

```javascript
// Test database connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('pg_stat_activity')
      .select('count(*)')
      .single()
    
    if (error) {
      console.error('Database connection error:', error)
      return false
    }
    
    console.log('Database connected successfully')
    return true
  } catch (error) {
    console.error('Connection test failed:', error)
    return false
  }
}
```

#### RLS Policy Issues

```javascript
// Test RLS policies
const testRLSPolicies = async () => {
  try {
    // Test public access
    const { data: publicData, error: publicError } = await supabase
      .from('public_posts')
      .select('count(*)')
      .single()
    
    // Test authenticated access
    const { data: authData, error: authError } = await supabase
      .from('user_posts')
      .select('count(*)')
      .single()
    
    console.log('Public access:', publicError ? 'Failed' : 'OK')
    console.log('Auth access:', authError ? 'Failed' : 'OK')
  } catch (error) {
    console.error('RLS test failed:', error)
  }
}
```

#### Realtime Issues

```javascript
// Debug realtime subscriptions
const debugSubscription = () => {
  const channel = supabase
    .channel('debug-channel')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'posts' },
      (payload) => console.log('Received:', payload)
    )
    .subscribe((status, err) => {
      console.log('Subscription status:', status)
      if (err) console.error('Subscription error:', err)
    })
  
  return channel
}
```

### Performance Issues

#### Slow Query Diagnosis

```sql
-- Find slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  stddev_time
FROM pg_stat_statements
WHERE mean_time > 1000 -- queries taking more than 1 second
ORDER BY mean_time DESC;

-- Analyze query plan
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM posts 
WHERE published = true 
ORDER BY created_at DESC 
LIMIT 10;
```

#### Index Optimization

```sql
-- Find unused indexes
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan = 0;

-- Find missing indexes
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public'
  AND n_distinct > 100
  AND correlation < 0.1;
```

## Advanced Topics

### Multi-tenancy

#### Tenant Schema Design

```sql
-- Create tenant-specific schemas
CREATE SCHEMA tenant_123;
CREATE SCHEMA tenant_456;

-- Create tables in tenant schemas
CREATE TABLE tenant_123.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE tenant_456.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dynamic schema switching
CREATE OR REPLACE FUNCTION switch_tenant_schema(tenant_id TEXT)
RETURNS void AS $$
BEGIN
  EXECUTE format('SET search_path TO tenant_%s, public', tenant_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### Tenant Isolation

```javascript
// Tenant-aware database client
const createTenantClient = (tenantId) => {
  return createClient(supabaseUrl, supabaseKey, {
    db: {
      schema: `tenant_${tenantId}`
    }
  })
}

// Usage
const tenantClient = createTenantClient('123')
const { data } = await tenantClient
  .from('posts')
  .select('*')
```

### Internationalization

#### Multi-language Content

```sql
-- Create translation tables
CREATE TABLE translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL,
  language TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(key, language)
);

-- Create translatable content table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_key TEXT NOT NULL,
  content_key TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to get translated content
CREATE OR REPLACE FUNCTION get_translated_content(
  content_key TEXT,
  language TEXT DEFAULT 'en'
) RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT value 
    FROM translations 
    WHERE key = content_key AND language = get_translated_content.language
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Caching Strategies

#### Application-level Caching

```javascript
// Cache layer for frequently accessed data
class SupabaseCache {
  constructor(supabase, ttl = 300000) { // 5 minutes default TTL
    this.supabase = supabase
    this.cache = new Map()
    this.ttl = ttl
  }
  
  async get(key, queryFn) {
    const cached = this.cache.get(key)
    
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data
    }
    
    const data = await queryFn()
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
    
    return data
  }
  
  invalidate(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }
}

// Usage
const cache = new SupabaseCache(supabase)

const getPopularPosts = async () => {
  return cache.get('popular_posts', () =>
    supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('views', { ascending: false })
      .limit(10)
  )
}
```

#### Database-level Caching

```sql
-- Create materialized views for caching
CREATE MATERIALIZED VIEW cached_popular_posts AS
SELECT 
  p.*,
  COUNT(*) as view_count
FROM posts p
JOIN post_views pv ON p.id = pv.post_id
WHERE p.published = true
  AND pv.created_at > NOW() - INTERVAL '7 days'
GROUP BY p.id
ORDER BY view_count DESC;

-- Create function to refresh cache
CREATE OR REPLACE FUNCTION refresh_popular_posts_cache()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY cached_popular_posts;
END;
$$ LANGUAGE plpgsql;

-- Schedule cache refresh
SELECT cron.schedule(
  'refresh-popular-posts',
  '0 */2 * * *', -- Every 2 hours
  'SELECT refresh_popular_posts_cache()'
);
```

## Management

### Supabase Studio

Supabase Studio is the dashboard for managing your Supabase project.

#### Features

- **Table Editor**: Visual database table management
- **SQL Editor**: Write and execute SQL queries
- **Authentication**: Manage users and auth providers
- **Storage**: File management and bucket configuration
- **Edge Functions**: Function deployment and monitoring
- **Logs**: View application and database logs
- **Settings**: Project configuration and API keys

#### Accessing Studio

```bash
# Local development
supabase start
# Studio available at: http://localhost:54323

# Production
# Studio available at: https://your-project-ref.supabase.co
```

### CLI Tools

#### Common Commands

```bash
# Initialize project
supabase init

# Start local development
supabase start

# Stop local services
supabase stop

# Reset local database
supabase db reset

# Generate types
supabase gen types typescript --local > types/supabase.ts

# Deploy migrations
supabase db push

# Deploy functions
supabase functions deploy my-function

# Link to remote project
supabase link --project-ref your-project-ref
```

#### Database Management

```bash
# Create new migration
supabase migration new create_users_table

# Apply migrations
supabase db push

# Reset database
supabase db reset

# Generate types
supabase gen types typescript --local > src/types/database.ts

# Diff schemas
supabase db diff --schema public --use-migra
```

#### Branch Management

```bash
# Create branch
supabase branches create feature-branch

# Switch branches
supabase branches switch feature-branch

# List branches
supabase branches list

# Delete branch
supabase branches delete feature-branch
```

#### Function Management

```bash
# Deploy single function
supabase functions deploy my-function

# Deploy all functions
supabase functions deploy

# Serve functions locally
supabase functions serve

# View function logs
supabase functions logs my-function

# Delete function
supabase functions delete my-function
```

### API Generation

#### REST API

Supabase automatically generates REST APIs from your database schema:

```javascript
// Auto-generated endpoints
GET    /rest/v1/posts           // List posts
GET    /rest/v1/posts?id=eq.1  // Get specific post
POST   /rest/v1/posts           // Create post
PUT    /rest/v1/posts?id=eq.1  // Update post
DELETE /rest/v1/posts?id=eq.1  // Delete post
```

#### GraphQL API

```javascript
// GraphQL endpoint
POST /graphql/v1

// Query example
{
  query {
    profiles {
      id
      username
      full_name
      posts {
        id
        title
        created_at
      }
    }
  }
}
```

#### TypeScript Types

```bash
# Generate types
supabase gen types typescript --local > types/supabase.ts

# Generated types include
interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; username: string; full_name: string | null }
        Insert: { id?: string; username: string; full_name?: string | null }
        Update: { username?: string; full_name?: string | null }
      }
      posts: {
        Row: { id: string; user_id: string; title: string; content: string | null; published: boolean }
        Insert: { user_id: string; title: string; content?: string | null; published?: boolean }
        Update: { title?: string; content?: string | null; published?: boolean }
      }
    }
    Views: {
      user_profiles: {
        Row: { id: string; username: string; posts_count: number }
      }
    }
    Functions: {
      get_user_stats: (user_id: string) => { posts_count: number; followers_count: number }
    }
    Enums: {
      user_status: 'active' | 'inactive' | 'suspended'
    }
  }
}
```

## Configuration

### Environment Variables

#### Required Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Optional Variables

```bash
# Database connection
DATABASE_URL=postgresql://[user[:password]@][host][:port][/dbname][?param1=value1&...]
SUPABASE_DB_URL=postgresql://postgres:[password]@localhost:54322/postgres

# Authentication
SUPABASE_AUTH_URL=https://your-project-ref.supabase.co/auth/v1
SUPABASE_AUTH_REDIRECT_URL=http://localhost:3000/auth/callback

# Edge Functions
SUPABASE_FUNCTIONS_URL=https://your-project-ref.supabase.co/functions/v1
SUPABASE_FUNCTIONS_SECRET=your-functions-secret

# Storage
SUPABASE_STORAGE_URL=https://your-project-ref.supabase.co/storage/v1
```

### Client Configuration

#### Advanced Client Setup

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey, {
  // Database configuration
  db: {
    schema: 'public',
    headers: { 'x-custom-header': 'value' }
  },
  
  // Authentication configuration
  auth: {
    persistSession: true,
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: false
  },
  
  // Realtime configuration
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  
  // Global configuration
  global: {
    headers: { 'x-application-name': 'my-app' },
    fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' })
  }
})
```

#### Server-Side Client

```javascript
// For server-side operations
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
)
```

## Best Practices

### Database Design

#### Schema Organization

```sql
-- Use schemas for organization
CREATE SCHEMA app;
CREATE SCHEMA auth;
CREATE SCHEMA storage;

-- Create tables in appropriate schemas
CREATE TABLE app.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set default search path
SET search_path TO app, public, auth;
```

#### Naming Conventions

```sql
-- Use snake_case for table and column names
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Use descriptive constraint names
ALTER TABLE user_profiles 
  ADD CONSTRAINT user_profiles_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
```

#### Performance Optimization

```sql
-- Add appropriate indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_last_name ON user_profiles(last_name);

-- Use partial indexes for better performance
CREATE INDEX idx_active_users ON user_profiles(user_id) 
  WHERE is_active = true;

-- Use materialized views for complex queries
CREATE MATERIALIZED VIEW user_stats AS
SELECT 
  u.user_id,
  u.first_name,
  u.last_name,
  COUNT(p.id) as post_count,
  MAX(p.created_at) as last_post_date
FROM user_profiles u
LEFT JOIN posts p ON u.user_id = p.user_id
GROUP BY u.user_id, u.first_name, u.last_name;
```

### Security

#### Row Level Security

```sql
-- Enable RLS on all user tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

#### API Security

```javascript
// Use service role key only on server
const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey, // Never expose this key to clients
  { auth: { persistSession: false } }
)

// Validate inputs before database operations
const createPost = async (title, content, userId) => {
  if (!title || title.length > 200) {
    throw new Error('Invalid title')
  }
  
  if (!userId) {
    throw new Error('User ID required')
  }
  
  return await supabase
    .from('posts')
    .insert({ title, content, user_id: userId })
}
```

#### Environment Security

```bash
# Use environment-specific keys
# Development
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=dev-key

# Production
NEXT_PUBLIC_SUPABASE_URL=https://project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=prod-key
```

### Performance

#### Query Optimization

```javascript
// Use specific selects to reduce data transfer
const { data } = await supabase
  .from('posts')
  .select('id, title, created_at')
  .eq('published', true)
  .order('created_at', { ascending: false })
  .limit(10)

// Use filters at the database level
const { data } = await supabase
  .from('posts')
  .select('*')
  .eq('user_id', userId)
  .eq('published', true)
```

#### Caching Strategies

```javascript
// Implement client-side caching
const getCachedPosts = async () => {
  const cacheKey = 'posts:published'
  const cached = localStorage.getItem(cacheKey)
  
  if (cached) {
    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp < 5 * 60 * 1000) { // 5 minutes
      return data
    }
  }
  
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
  
  localStorage.setItem(cacheKey, JSON.stringify({
    data,
    timestamp: Date.now()
  }))
  
  return data
}
```

#### Realtime Optimization

```javascript
// Use specific filters to reduce bandwidth
const channel = supabase
  .channel('user-posts')
  .on('postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'posts',
      filter: `user_id=eq.${userId}`
    },
    (payload) => handlePostUpdate(payload)
  )
  .subscribe()

// Unsubscribe when no longer needed
const unsubscribe = () => {
  channel.unsubscribe()
}
```

## Troubleshooting

### Common Issues

#### Connection Problems

```bash
# Check local services
supabase status

# Reset local environment
supabase stop
supabase start

# Check logs
supabase logs db
supabase logs auth
```

#### Authentication Issues

```javascript
// Debug authentication
const { data: { session }, error } = await supabase.auth.getSession()
console.log('Session:', session)
console.log('Error:', error)

// Check JWT claims
const { data: { user }, error } = await supabase.auth.getUser()
console.log('User:', user)
console.log('Claims:', user?.app_metadata)
```

#### Database Issues

```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- Check table permissions
SELECT has_table_privilege('your_user', 'your_table', 'SELECT');

-- Check indexes
SELECT * FROM pg_indexes WHERE tablename = 'your_table';
```

#### Performance Issues

```sql
-- Analyze slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Debug Tools

#### Logging

```javascript
// Enable debug mode
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { debug: true }
})

// Custom logging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event, session)
})
```

#### Monitoring

```bash
# View function logs
supabase functions logs my-function

# Monitor database activity
supabase db diff

# Check realtime connections
supabase logs realtime
```

## Resources

### Official Documentation

- [Supabase Docs](https://supabase.com/docs) - Complete documentation
- [API Reference](https://supabase.com/docs/reference) - API documentation
- [GitHub Repository](https://github.com/supabase/supabase) - Source code

### Learning Resources

- [Supabase Quickstart](https://supabase.com/docs/guides/getting-started) - Quick start guide
- [Supabase Examples](https://github.com/supabase/supabase/tree/master/examples) - Example projects
- [Supabase Blog](https://supabase.com/blog) - Latest features and updates

### Community

- [Discord Community](https://discord.supabase.com) - Chat with other developers
- [GitHub Discussions](https://github.com/supabase/supabase/discussions) - Q&A and discussions
- [Stack Overflow](https://stackoverflow.com/questions/tagged/supabase) - Technical questions

### Tools and Extensions

- [Supabase CLI](https://supabase.com/docs/guides/cli) - Command-line tools
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=supabase.supabase) - IDE integration
- [Postman Collection](https://www.postman.com/supabase) - API testing

### Templates and Starters

- [Next.js Template](https://github.com/supabase/supabase/tree/master/examples/nextjs) - Next.js integration
- [React Template](https://github.com/supabase/supabase/tree/master/examples/react) - React integration
- [Flutter Template](https://github.com/supabase/supabase/tree/master/examples/flutter) - Flutter integration
- [SvelteKit Template](https://github.com/supabase/supabase/tree/master/examples/sveltekit) - SvelteKit integration

---

*This documentation covers Supabase ^2.49.0 as used in this repository. For the latest features and updates, visit the official Supabase documentation at <https://supabase.com/docs>.*
