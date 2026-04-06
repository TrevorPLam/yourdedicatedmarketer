# Security Framework

## Overview

A comprehensive multi-layer security framework for enterprise applications. This framework covers application security, database security, supply chain security, and infrastructure security patterns.

**Source**: Based on OWASP guidelines, security best practices from major cloud providers, and enterprise security frameworks.

---

## Security Layers

### Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Layer 1: Application Security                          │ │
│  │  - Input validation, XSS prevention, CSRF tokens        │ │
│  └─────────────────────────────────────────────────────────┘ │
│                          ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Layer 2: API Security                                  │ │
│  │  - Authentication, authorization, rate limiting         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                          ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Layer 3: Database Security                             │ │
│  │  - RLS, encryption, access controls                   │ │
│  └─────────────────────────────────────────────────────────┘ │
│                          ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Layer 4: Infrastructure Security                       │ │
│  │  - Network isolation, secrets management                │ │
│  └─────────────────────────────────────────────────────────┘ │
│                          ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Layer 5: Supply Chain Security                         │ │
│  │  - Dependency scanning, SAST, SBOM                     │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Application Security

### Content Security Policy (CSP)

```typescript
// middleware.ts (Next.js) or server middleware
export const securityHeaders = {
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel.app; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https: blob:; " +
    "font-src 'self' https: data:; " +
    "connect-src 'self' https://api.example.com wss://realtime.example.com; " +
    "media-src 'self' https:; " +
    "object-src 'none'; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'; " +
    "upgrade-insecure-requests;",
  
  // Additional security headers
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 
    'camera=(), microphone=(), geolocation=(), ' +
    'payment=(), usb=(), magnetometer=(), gyroscope=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};

// Next.js middleware implementation
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}
```

### Input Validation

```typescript
// lib/validation.ts
import { z } from 'zod';

// User input schemas
export const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string()
    .min(2, 'Name too short')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Invalid characters in name'),
  age: z.number().int().min(13).max(120).optional(),
});

// Sanitization utilities
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function sanitizeInput(input: string): string {
  // Remove null bytes
  let sanitized = input.replace(/\x00/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Limit length
  sanitized = sanitized.slice(0, 10000);
  
  return sanitized;
}

// API route validation
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validated = userSchema.parse(body);
    
    // Sanitize
    const sanitized = {
      email: validated.email.toLowerCase().trim(),
      name: sanitizeInput(validated.name),
      age: validated.age,
    };
    
    // Process...
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    );
  }
}
```

### CSRF Protection

```typescript
// lib/csrf.ts
import { cookies } from 'next/headers';
import crypto from 'crypto';

const CSRF_TOKEN_COOKIE = 'csrf_token';
const CSRF_HEADER = 'X-CSRF-Token';

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function setCsrfCookie(): string {
  const token = generateCsrfToken();
  cookies().set(CSRF_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
  return token;
}

export function validateCsrfToken(request: Request): boolean {
  const cookieToken = cookies().get(CSRF_TOKEN_COOKIE)?.value;
  const headerToken = request.headers.get(CSRF_HEADER);
  
  if (!cookieToken || !headerToken) {
    return false;
  }
  
  // Constant-time comparison
  return crypto.timingSafeEqual(
    Buffer.from(cookieToken),
    Buffer.from(headerToken)
  );
}

// Middleware implementation
export function csrfMiddleware(handler: Function) {
  return async (request: Request) => {
    // Skip for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return handler(request);
    }
    
    // Validate CSRF for state-changing operations
    if (!validateCsrfToken(request)) {
      return new Response('CSRF validation failed', { status: 403 });
    }
    
    return handler(request);
  };
}
```

---

## API Security

### Authentication Middleware

```typescript
// lib/auth/middleware.ts
import { verifyToken } from './jwt';
import { NextRequest, NextResponse } from 'next/server';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export async function authMiddleware(
  request: AuthenticatedRequest
): Promise<NextResponse | null> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const token = authHeader.slice(7);
  
  try {
    const payload = await verifyToken(token);
    request.user = payload;
    return null; // Continue to handler
  } catch {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}

// Rate limiting
import { RateLimiter } from '@/lib/rate-limiter';

const limiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // per window
});

export async function rateLimitMiddleware(
  request: NextRequest
): Promise<NextResponse | null> {
  const ip = request.ip ?? 'unknown';
  const key = `${ip}:${request.url}`;
  
  const isLimited = await limiter.isLimited(key);
  
  if (isLimited) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: { 'Retry-After': '900' } }
    );
  }
  
  return null;
}
```

### Role-Based Access Control (RBAC)

```typescript
// lib/auth/rbac.ts
type Permission = 
  | 'user:read' | 'user:create' | 'user:update' | 'user:delete'
  | 'post:read' | 'post:create' | 'post:update' | 'post:delete'
  | 'admin:access';

type Role = 'user' | 'moderator' | 'admin';

const rolePermissions: Record<Role, Permission[]> = {
  user: ['user:read', 'user:update', 'post:read', 'post:create'],
  moderator: [
    'user:read', 'user:update',
    'post:read', 'post:create', 'post:update', 'post:delete'
  ],
  admin: [
    'user:read', 'user:create', 'user:update', 'user:delete',
    'post:read', 'post:create', 'post:update', 'post:delete',
    'admin:access'
  ],
};

export function hasPermission(
  userRole: Role,
  requiredPermission: Permission
): boolean {
  return rolePermissions[userRole].includes(requiredPermission);
}

export function requirePermission(permission: Permission) {
  return async (request: AuthenticatedRequest) => {
    if (!request.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (!hasPermission(request.user.role as Role, permission)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    return null;
  };
}

// Usage in API routes
export async function DELETE(request: AuthenticatedRequest) {
  // Check auth
  const authError = await authMiddleware(request);
  if (authError) return authError;
  
  // Check permission
  const permError = await requirePermission('user:delete')(request);
  if (permError) return permError;
  
  // Handle request...
}
```

---

## Database Security

### Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- User isolation policy
CREATE POLICY user_access_own_data ON users
  FOR ALL
  USING (auth.uid() = id);

-- Organization-based access
CREATE POLICY organization_isolation ON posts
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = posts.organization_id
      AND organization_members.user_id = auth.uid()
    )
  );

-- Public read access with ownership check
CREATE POLICY public_posts ON posts
  FOR SELECT
  USING (is_published = true OR auth.uid() = author_id);

-- Admin bypass (optional)
CREATE POLICY admin_full_access ON posts
  FOR ALL
  TO admin_role
  USING (true);

-- Create security definer functions
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS uuid AS $$
  SELECT nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::uuid;
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

### Connection Security

```typescript
// lib/db/security.ts
import { Pool } from '@neondatabase/serverless';

// Secure pool configuration
export const securePool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true, // Verify SSL certificates
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  // Statement timeout to prevent runaway queries
  statement_timeout: 30000,
  // Query timeout
  query_timeout: 30000,
});

// Query logging for security audit
export async function secureQuery(
  query: string,
  params?: unknown[]
) {
  const start = Date.now();
  
  try {
    // Log query (without sensitive params in production)
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Query: ${query}`);
    }
    
    const result = await securePool.query(query, params);
    
    // Log slow queries
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn(`Slow query (${duration}ms): ${query}`);
    }
    
    return result;
  } catch (error) {
    // Log errors without sensitive data
    console.error('Query error:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}

// Parameterized query helper (prevents SQL injection)
export function createSafeQuery(table: string, conditions: Record<string, unknown>) {
  const keys = Object.keys(conditions);
  const values = Object.values(conditions);
  
  // Validate table name (whitelist)
  const allowedTables = ['users', 'posts', 'organizations'];
  if (!allowedTables.includes(table)) {
    throw new Error('Invalid table name');
  }
  
  // Validate column names
  const allowedColumns: Record<string, string[]> = {
    users: ['id', 'email', 'name'],
    posts: ['id', 'title', 'author_id'],
    organizations: ['id', 'name'],
  };
  
  const invalidKeys = keys.filter(k => !allowedColumns[table]?.includes(k));
  if (invalidKeys.length > 0) {
    throw new Error(`Invalid columns: ${invalidKeys.join(', ')}`);
  }
  
  const whereClause = keys
    .map((key, i) => `"${key}" = $${i + 1}`)
    .join(' AND ');
  
  return {
    text: `SELECT * FROM "${table}" WHERE ${whereClause}`,
    values,
  };
}
```

### Encryption at Rest

```typescript
// lib/encryption.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

// Derive encryption key from master key
function deriveKey(masterKey: string, salt: string): Buffer {
  return crypto.pbkdf2Sync(masterKey, salt, 100000, KEY_LENGTH, 'sha256');
}

export function encrypt(
  plaintext: string,
  masterKey: string
): { encrypted: string; salt: string; iv: string; tag: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = deriveKey(masterKey, salt);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  return {
    encrypted,
    salt,
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
  };
}

export function decrypt(
  encrypted: string,
  masterKey: string,
  salt: string,
  iv: string,
  tag: string
): string {
  const key = deriveKey(masterKey, salt);
  const ivBuffer = Buffer.from(iv, 'hex');
  const tagBuffer = Buffer.from(tag, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, ivBuffer);
  decipher.setAuthTag(tagBuffer);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Field-level encryption for sensitive data
export async function storeSensitiveData(
  data: { ssn: string; dob: string },
  userId: string
) {
  const masterKey = process.env.ENCRYPTION_KEY!;
  
  const encryptedSSN = encrypt(data.ssn, masterKey);
  const encryptedDOB = encrypt(data.dob, masterKey);
  
  await sql`
    INSERT INTO sensitive_data (user_id, ssn_encrypted, ssn_salt, ssn_iv, ssn_tag, 
                                 dob_encrypted, dob_salt, dob_iv, dob_tag)
    VALUES (${userId}, ${encryptedSSN.encrypted}, ${encryptedSSN.salt}, 
            ${encryptedSSN.iv}, ${encryptedSSN.tag}, ${encryptedDOB.encrypted}, 
            ${encryptedDOB.salt}, ${encryptedDOB.iv}, ${encryptedDOB.tag})
  `;
}
```

---

## Infrastructure Security

### Network Security

```yaml
# Docker Compose network isolation
services:
  web:
    networks:
      - frontend
      - backend
    # No direct database access from external
    
  api:
    networks:
      - backend
      - database
    
  db:
    networks:
      - database
    # Only accessible via api service

networks:
  frontend:
    driver: bridge
    internal: false
  backend:
    driver: bridge
    internal: true  # No external access
  database:
    driver: bridge
    internal: true
```

### Environment Variable Security

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string().url(),
  ENCRYPTION_KEY: z.string().min(32),
  JWT_SECRET: z.string().min(32),
  API_KEY: z.string().min(16),
  
  // Optional with defaults
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  RATE_LIMIT_WINDOW: z.string().default('900'),
});

// Validate on startup
export const env = envSchema.parse(process.env);

// Prevent direct access to process.env
export function getEnv(key: keyof typeof env): string {
  return env[key];
}

// Never expose in client bundles
export const publicEnv = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
};
```

---

## Supply Chain Security

### Dependency Scanning

```yaml
# .github/workflows/security.yml
name: Security Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * 1'  # Weekly

jobs:
  dependency-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
      
      - name: Run npm audit
        run: npm audit --audit-level=moderate
        continue-on-error: true
      
      - name: Run Snyk scan
        uses: snyk/actions/node@master
        continue-on-error: true
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  
  code-scanning:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: javascript
      
      - name: Autobuild
        uses: github/codeql-action/autobuild@v3
      
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3
      
      - name: Secret scanning
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
```

### Package Verification

```json
// package.json security configuration
{
  "scripts": {
    "security:audit": "npm audit --audit-level=moderate",
    "security:fix": "npm audit fix",
    "security:outdated": "npm outdated",
    "preinstall": "npx only-allow pnpm"
  },
  "engines": {
    "node": ">=22.12.0",
    "pnpm": ">=10.0.0"
  },
  "packageManager": "pnpm@10.0.0"
}
```

```yaml
# pnpm-workspace.yaml security
packages:
  - 'apps/*'
  - 'packages/*'

# Catalog for version consistency
catalog:
  react: ^19.2.0
  next: ^16.0.0
  
# Security settings
onlyBuiltDependencies:
  - sharp
  - bcrypt
  - argon2
```

---

## Security Monitoring

### Audit Logging

```typescript
// lib/audit.ts
type AuditEvent = 
  | { type: 'user.login'; userId: string; ip: string; userAgent: string }
  | { type: 'user.logout'; userId: string }
  | { type: 'data.access'; userId: string; resource: string; action: string }
  | { type: 'permission.denied'; userId: string; resource: string; required: string }
  | { type: 'api.error'; endpoint: string; error: string };

export async function logAudit(event: AuditEvent) {
  const timestamp = new Date().toISOString();
  
  // Log to database
  await sql`
    INSERT INTO audit_logs (timestamp, event_type, event_data)
    VALUES (${timestamp}, ${event.type}, ${JSON.stringify(event)})
  `;
  
  // Log to external SIEM (if configured)
  if (process.env.SIEM_ENDPOINT) {
    await fetch(process.env.SIEM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp, ...event }),
    }).catch(console.error);
  }
}

// Middleware for automatic audit logging
export function auditMiddleware(eventType: AuditEvent['type']) {
  return async (request: Request, response: Response) => {
    await logAudit({
      type: eventType,
      userId: request.user?.id,
      ip: request.ip,
      userAgent: request.headers.get('user-agent'),
    } as AuditEvent);
  };
}
```

### Anomaly Detection

```typescript
// lib/security/anomaly-detection.ts
interface AccessPattern {
  userId: string;
  ip: string;
  userAgent: string;
  timestamp: Date;
  endpoint: string;
}

export class AnomalyDetector {
  private patterns: Map<string, AccessPattern[]> = new Map();
  
  async detectAnomaly(event: AccessPattern): Promise<boolean> {
    const userPatterns = this.patterns.get(event.userId) || [];
    
    // Check for suspicious patterns
    const isSuspicious = 
      this.isRapidAccess(userPatterns, event) ||
      this.isGeoImpossible(userPatterns, event) ||
      this.isUnusualTime(event) ||
      this.isUnknownDevice(userPatterns, event);
    
    // Update patterns
    userPatterns.push(event);
    if (userPatterns.length > 100) userPatterns.shift();
    this.patterns.set(event.userId, userPatterns);
    
    return isSuspicious;
  }
  
  private isRapidAccess(patterns: AccessPattern[], event: AccessPattern): boolean {
    const recent = patterns.filter(p => 
      event.timestamp.getTime() - p.timestamp.getTime() < 60000
    );
    return recent.length > 100; // > 100 requests per minute
  }
  
  private isGeoImpossible(patterns: AccessPattern[], event: AccessPattern): boolean {
    // Implement geo-checking logic
    return false;
  }
  
  private isUnusualTime(event: AccessPattern): boolean {
    const hour = event.timestamp.getHours();
    return hour < 6 || hour > 23; // Outside business hours
  }
  
  private isUnknownDevice(patterns: AccessPattern[], event: AccessPattern): boolean {
    const knownDevices = new Set(patterns.map(p => p.userAgent));
    return knownDevices.size > 0 && !knownDevices.has(event.userAgent);
  }
}
```

---

## Incident Response

### Security Incident Playbook

```typescript
// lib/security/incident-response.ts
type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

interface SecurityIncident {
  id: string;
  type: string;
  severity: IncidentSeverity;
  description: string;
  affectedUsers: string[];
  timestamp: Date;
  status: 'detected' | 'investigating' | 'contained' | 'resolved';
}

export class IncidentResponse {
  async handleIncident(incident: SecurityIncident) {
    // 1. Alert team
    await this.alertTeam(incident);
    
    // 2. Automated containment for critical incidents
    if (incident.severity === 'critical') {
      await this.autoContain(incident);
    }
    
    // 3. Log for forensics
    await this.preserveEvidence(incident);
    
    // 4. Create ticket
    await this.createTicket(incident);
  }
  
  private async autoContain(incident: SecurityIncident) {
    switch (incident.type) {
      case 'suspicious_login':
        // Force password reset
        await this.forcePasswordReset(incident.affectedUsers);
        // Invalidate sessions
        await this.invalidateSessions(incident.affectedUsers);
        break;
        
      case 'data_exfiltration':
        // Block IP
        await this.blockIp(incident.ip);
        // Lock affected accounts
        await this.lockAccounts(incident.affectedUsers);
        break;
        
      case 'dos_attack':
        // Enable rate limiting
        await this.enableEmergencyRateLimit();
        // Enable WAF rules
        await this.enableWafProtection();
        break;
    }
  }
  
  private async alertTeam(incident: SecurityIncident) {
    const message = `
      🚨 Security Incident ${incident.severity.toUpperCase()}
      
      ID: ${incident.id}
      Type: ${incident.type}
      Description: ${incident.description}
      Affected: ${incident.affectedUsers.length} users
      Time: ${incident.timestamp.toISOString()}
    `;
    
    // Send to Slack/PagerDuty
    await fetch(process.env.SECURITY_WEBHOOK!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    });
  }
}
```

---

## Security Checklist

### Pre-Deployment

- [ ] All dependencies audited (`npm audit`)
- [ ] Security headers configured
- [ ] CSP policy defined
- [ ] Input validation implemented
- [ ] RLS policies enabled on all tables
- [ ] Environment variables validated
- [ ] Secrets not committed to repository
- [ ] Rate limiting configured
- [ ] Error messages don't leak sensitive info

### Production

- [ ] HTTPS enforced (HSTS headers)
- [ ] Security monitoring enabled
- [ ] Audit logging active
- [ ] Automated security scanning (CI/CD)
- [ ] Incident response plan documented
- [ ] Database encryption at rest enabled
- [ ] Network isolation configured
- [ ] Access logs reviewed regularly
- [ ] Penetration testing completed

---

## Resources

### Security Standards
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [CIS Controls](https://www.cisecurity.org/controls)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

### Tools
- [Snyk](https://snyk.io/) - Dependency scanning
- [CodeQL](https://codeql.github.com/) - Code analysis
- [TruffleHog](https://github.com/trufflesecurity/trufflehog) - Secret scanning
- [OWASP ZAP](https://www.zaproxy.org/) - Penetration testing

---

_Updated April 2026 based on OWASP guidelines and enterprise security best practices._
