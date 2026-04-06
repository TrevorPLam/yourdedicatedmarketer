# Secret Management

## Overview

Centralized secret management is critical for production security. This guide covers implementing secure secret storage and retrieval using modern secret management platforms, ensuring credentials never leak into source code or logs.

**Source**: Based on Doppler, Infisical, and AWS Secrets Manager documentation, along with enterprise security best practices.

---

## Secret Management Providers

### Provider Comparison

| Provider | Setup Complexity | Security Features | Cost | Best For |
|----------|-----------------|-------------------|------|----------|
| **Doppler** | Low | RBAC, audit logs, 2FA | Free tier available | Teams prioritizing ease of use |
| **Infisical** | Medium | E2E encryption, versioning, self-hosted | Free tier available | Privacy-focused organizations |
| **AWS Secrets Manager** | High | IAM integration, full AWS ecosystem | Pay-per-use | AWS-native architectures |
| **HashiCorp Vault** | High | Enterprise features, multiple backends | Enterprise pricing | Large enterprises |

### Recommended Setup

For most marketing agencies, we recommend **Doppler** for its simplicity and generous free tier, or **Infisical** for privacy-focused requirements.

---

## Doppler Implementation

### Getting Started

```bash
# Install Doppler CLI
# macOS
brew install doppler

# Windows
scoop install doppler

# Linux (Debian/Ubuntu)
sudo apt-get update && sudo apt-get install doppler

# Verify installation
doppler --version
```

### Project Setup

```bash
# Login to Doppler
doppler login

# Setup project
doppler projects create marketing-agency-monorepo

# Create environments
doppler environments create development
doppler environments create staging
doppler environments create production

# Select project and environment
doppler setup
# ? Select a project: marketing-agency-monorepo
# ? Select a config: dev
```

### Secret Management

```bash
# Add secrets
doppler secrets set DATABASE_URL "postgresql://..."
doppler secrets set API_KEY "sk_live_..."
doppler secrets set JWT_SECRET "super-secret-key"

# Bulk upload from .env file
doppler secrets upload .env

# View secrets
doppler secrets

# View specific secret
doppler secrets get DATABASE_URL --plain

# Delete secret
doppler secrets delete API_KEY
```

### Configuration Files

```yaml
# doppler.yaml
setup:
  project: marketing-agency-monorepo
  config: dev

# .dopplerignore (similar to .gitignore)
.env.local
.env.*.local
node_modules/
```

### Development Integration

```json
// package.json
{
  "scripts": {
    "dev": "doppler run -- pnpm run dev:raw",
    "dev:raw": "next dev",
    "build": "doppler run -- pnpm run build:raw",
    "build:raw": "next build",
    "test": "doppler run -- pnpm run test:raw",
    "test:raw": "vitest"
  }
}
```

```typescript
// lib/env.ts - Type-safe environment variables
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string().url(),
  API_KEY: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  NEXT_PUBLIC_API_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

### CI/CD Integration

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Doppler CLI
        uses: dopplerhq/cli-action@v1
      
      - name: Configure Doppler
        run: doppler configure set token ${{ secrets.DOPPLER_TOKEN }}
        env:
          DOPPLER_TOKEN: ${{ secrets.DOPPLER_TOKEN }}
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build with secrets
        run: doppler run -- pnpm run build
        env:
          DOPPLER_ENVIRONMENT: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}
      
      - name: Deploy
        run: doppler run -- ./deploy.sh
```

---

## Infisical Implementation

### Getting Started

```bash
# Install Infisical CLI
# macOS
brew install infisical/get-cli/infisical

# Windows
scoop install infisical

# Linux
curl -1sLf 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' | sudo -E bash
sudo apt-get update && sudo apt-get install infisical

# Login
infisical login
```

### Project Configuration

```bash
# Initialize project
infisical init

# Link to existing project
infisical link

# Set environment
infisical secrets set DATABASE_URL=postgresql://... --env=dev

# View all secrets
infisical secrets --env=dev

# Generate .env file
infisical export --env=dev > .env.local
```

### Self-Hosted Option

```yaml
# docker-compose.infisical.yml
version: '3.8'

services:
  infisical:
    image: infisical/infisical:latest
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - DB_CONNECTION_URI=mongodb://mongo:27017/infisical
      - ENCRYPTION_KEY=${INFISICAL_ENCRYPTION_KEY}
      - JWT_AUTH_SECRET=${INFISICAL_JWT_SECRET}
    depends_on:
      - mongo
      - redis

  mongo:
    image: mongo:6
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  mongo_data:
  redis_data:
```

---

## AWS Secrets Manager

### Setup

```bash
# Install AWS CLI
# macOS
brew install awscli

# Configure AWS credentials
aws configure

# Create secret
aws secretsmanager create-secret \
  --name production/database/url \
  --description "Production database connection string" \
  --secret-string "postgresql://user:pass@host:5432/db"

# Retrieve secret
aws secretsmanager get-secret-value \
  --secret-id production/database/url \
  --query SecretString \
  --output text
```

### Application Integration

```typescript
// lib/secrets/aws.ts
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

export async function getSecret(secretName: string): Promise<string> {
  const command = new GetSecretValueCommand({
    SecretId: secretName,
  });
  
  const response = await client.send(command);
  
  if (response.SecretString) {
    return response.SecretString;
  }
  
  if (response.SecretBinary) {
    return Buffer.from(response.SecretBinary).toString('utf-8');
  }
  
  throw new Error('Secret not found');
}

// Usage with caching
const secretCache = new Map<string, string>();

export async function getCachedSecret(secretName: string): Promise<string> {
  if (secretCache.has(secretName)) {
    return secretCache.get(secretName)!;
  }
  
  const secret = await getSecret(secretName);
  secretCache.set(secretName, secret);
  
  // Clear cache after 5 minutes
  setTimeout(() => secretCache.delete(secretName), 5 * 60 * 1000);
  
  return secret;
}
```

---

## Local Development

### Environment File Management

```bash
# .env.example (committed to repo)
# Copy this file to .env.local and fill in real values
DATABASE_URL=postgresql://localhost:5432/agency_dev
API_KEY=your_api_key_here
JWT_SECRET=your_jwt_secret_here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

```bash
# .env.local (gitignored - never commit this)
DATABASE_URL=postgresql://dev:dev123@localhost:5432/agency_dev
API_KEY=sk_test_abc123xyz789
JWT_SECRET=super-secret-jwt-key-min-32-chars
NEXT_PUBLIC_API_URL=http://localhost:3000
```

```gitignore
# .gitignore
# Environment files
.env
.env.local
.env.*.local
.env.development
.env.test
.env.production

# Secret management
.doppler
.infisical.json

# Never commit credentials
*.pem
*.key
credentials.json
service-account.json
```

### Secure Environment Loading

```typescript
// lib/env/load.ts
import { config } from 'dotenv';
import { z } from 'zod';
import { existsSync } from 'fs';
import { resolve } from 'path';

export function loadEnv() {
  const envFiles = [
    '.env.local',
    `.env.${process.env.NODE_ENV || 'development'}`,
    '.env',
  ];
  
  for (const file of envFiles) {
    const path = resolve(process.cwd(), file);
    if (existsSync(path)) {
      config({ path });
      console.log(`Loaded environment from ${file}`);
      break;
    }
  }
}

// Validation schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().url(),
  API_KEY: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  NEXT_PUBLIC_API_URL: z.string().url(),
});

export function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}
```

---

## Secret Rotation

### Automated Rotation Strategy

```typescript
// lib/secrets/rotation.ts
import { getSecret, updateSecret } from './aws';

interface RotationConfig {
  secretName: string;
  rotationIntervalDays: number;
  generateNewValue: () => string | Promise<string>;
}

export async function rotateSecret(config: RotationConfig) {
  const { secretName, generateNewValue } = config;
  
  try {
    // Get current secret
    const currentSecret = await getSecret(secretName);
    
    // Generate new value
    const newValue = await generateNewValue();
    
    // Store new value (AWS handles versioning)
    await updateSecret(secretName, newValue);
    
    console.log(`✅ Rotated secret: ${secretName}`);
    
    // Update applications to use new secret
    // This depends on your deployment strategy
    
  } catch (error) {
    console.error(`❌ Failed to rotate secret ${secretName}:`, error);
    throw error;
  }
}

// Example: Database password rotation
export async function rotateDatabasePassword() {
  await rotateSecret({
    secretName: 'production/database/password',
    rotationIntervalDays: 90,
    generateNewValue: async () => {
      // Generate cryptographically secure password
      const crypto = await import('crypto');
      return crypto.randomBytes(32).toString('base64url');
    },
  });
}
```

### Rotation Schedule

```yaml
# .github/workflows/secret-rotation.yml
name: Secret Rotation

on:
  schedule:
    - cron: '0 2 1 * *'  # Monthly at 2am
  workflow_dispatch:

jobs:
  rotate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Rotate secrets
        run: pnpm run secrets:rotate
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

---

## Best Practices

### Security Principles

**Never commit secrets to source control**

```bash
# Pre-commit hook to catch secrets
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Scan for secrets
npx detect-secrets scan || exit 1

# Check for .env files
if git diff --cached --name-only | grep -E '\.env'; then
  echo "❌ Error: Attempting to commit .env file!"
  exit 1
fi
```

**Use different secrets per environment**

```typescript
// lib/env/environment.ts
const environments = {
  development: {
    database: 'dev_database_url',
    apiKey: 'dev_api_key',
  },
  staging: {
    database: 'staging_database_url',
    apiKey: 'staging_api_key',
  },
  production: {
    database: 'prod_database_url',
    apiKey: 'prod_api_key',
  },
};

export function getEnvSecret(key: keyof typeof environments.development) {
  const env = process.env.NODE_ENV || 'development';
  const secretName = environments[env as keyof typeof environments][key];
  return getSecret(secretName);
}
```

**Mask secrets in logs**

```typescript
// lib/logger.ts
const SENSITIVE_PATTERNS = [
  /password[=:]\s*\S+/gi,
  /api[_-]?key[=:]\s*\S+/gi,
  /secret[=:]\s*\S+/gi,
  /token[=:]\s*\S+/gi,
  /authorization[=:]\s*\S+/gi,
];

export function sanitizeLogMessage(message: string): string {
  let sanitized = message;
  
  SENSITIVE_PATTERNS.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, (match) => {
      const key = match.split(/[=:]/)[0];
      return `${key}=[REDACTED]`;
    });
  });
  
  return sanitized;
}

// Usage
console.log(sanitizeLogMessage('Connecting with password: secret123'));
// Output: Connecting with password=[REDACTED]
```

### Access Control

**Role-based access to secrets**

```yaml
# doppler access control
doppler projects members add user@example.com --role=developer

# Roles available:
# - owner: Full access
# - admin: Manage secrets and members
# - developer: Read/write secrets
# - viewer: Read-only access
```

**Audit logging**

```typescript
// lib/secrets/audit.ts
export async function logSecretAccess(
  secretName: string,
  action: 'read' | 'write' | 'delete',
  userId: string
) {
  await sql`
    INSERT INTO secret_access_logs (timestamp, secret_name, action, user_id)
    VALUES (NOW(), ${secretName}, ${action}, ${userId})
  `;
}
```

---

## Troubleshooting

### Common Issues

**Secret not found**

```bash
# Verify secret exists
doppler secrets get DATABASE_URL
doppler secrets  # List all secrets

# Check environment
doppler configure get config
```

**Authentication failures**

```bash
# Re-authenticate
doppler login
doppler configure set token <new-token>

# Check token validity
doppler me
```

**Environment variables not loading**

```typescript
// Check load order
console.log('Environment:', process.env.NODE_ENV);
console.log('Available env vars:', Object.keys(process.env).filter(k => !k.includes('PATH')));

// Verify Doppler is injecting
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not set. Is Doppler running?');
  process.exit(1);
}
```

---

## Migration Guide

### From .env files to Doppler

```bash
# 1. Export existing .env
cat .env.local > backup.env

# 2. Setup Doppler project
doppler projects create my-project
doppler setup

# 3. Upload secrets
doppler secrets upload .env.local

# 4. Update package.json scripts
# Change: "dev": "next dev"
# To: "dev": "doppler run -- next dev"

# 5. Remove .env.local from repo
git rm .env.local
git commit -m "feat: migrate to Doppler for secret management"

# 6. Add .env.local to .gitignore
echo ".env.local" >> .gitignore
```

### Provider Migration

```typescript
// lib/secrets/index.ts - Provider-agnostic interface
interface SecretProvider {
  get(name: string): Promise<string>;
  set(name: string, value: string): Promise<void>;
  delete(name: string): Promise<void>;
}

// Implementation for each provider
class DopplerProvider implements SecretProvider {
  async get(name: string): Promise<string> {
    // Doppler-specific implementation
  }
  // ...
}

class InfisicalProvider implements SecretProvider {
  async get(name: string): Promise<string> {
    // Infisical-specific implementation
  }
  // ...
}

// Factory to switch providers
export function createSecretProvider(): SecretProvider {
  const provider = process.env.SECRET_PROVIDER || 'doppler';
  
  switch (provider) {
    case 'doppler':
      return new DopplerProvider();
    case 'infisical':
      return new InfisicalProvider();
    default:
      throw new Error(`Unknown secret provider: ${provider}`);
  }
}
```

---

## Resources

### Official Documentation
- [Doppler Documentation](https://docs.doppler.com/)
- [Infisical Documentation](https://infisical.com/docs)
- [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/)

### Tools
- [detect-secrets](https://github.com/Yelp/detect-secrets) - Secret scanning
- [git-secrets](https://github.com/awslabs/git-secrets) - Git hook for secrets
- [truffleHog](https://github.com/trufflesecurity/trufflehog) - Secret detection

---

_Updated April 2026 based on secret management best practices._
