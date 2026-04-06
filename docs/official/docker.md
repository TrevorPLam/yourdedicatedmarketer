# Docker Development Environment

**Official Documentation:** https://docs.docker.com/compose/  
**Latest Release:** April 2026

## Overview

Docker Compose is a tool for defining and running multi-container applications. It is the key to unlocking a streamlined and efficient development and deployment experience. Compose simplifies the control of your entire application stack, making it easy to manage services, networks, and volumes in a single YAML configuration file. Then, with a single command, you create and start all services from your configuration file.

Compose works in all environments - production, staging, development, testing, as well as CI workflows. It also has commands for managing the whole lifecycle of your application:
- Start, stop, and rebuild services
- View the status of running services
- Stream the log output of running services
- Run a one-off command on a service

**Source**: Based on [Docker Compose Official Documentation](https://docs.docker.com/compose/), [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/), and [Compose Specification](https://docs.docker.com/compose/compose-file/).

---

## Why Use Docker Compose?

### Key Benefits

- **Simplified control**: Define your entire multi-container application in a single YAML file, making it easy to manage complex applications with multiple services
- **Consistent environments**: Ensure dev/prod parity - the same configuration works across development, staging, and production
- **Efficient collaboration**: Share the entire application configuration with your team, ensuring everyone runs the same environment
- **Rapid deployment**: Start your entire application stack with a single `docker compose up` command
- **Isolation**: Each service runs in its own container with its own dependencies, preventing conflicts
- **Scalability**: Scale individual services horizontally by running multiple container instances

### Common Use Cases

- **Development environments**: Spin up isolated development environments with all dependencies (databases, caches, queues) configured and ready
- **Automated testing**: Create ephemeral testing environments that can be easily created and destroyed for CI/CD pipelines
- **Single host deployments**: Deploy multi-container applications to a single server or VM
- **Local development**: Match production configuration locally for debugging and testing
- **Microservices development**: Run multiple interconnected services with proper networking and service discovery

---

## Key Concepts

### What is Docker Compose?

Docker Compose allows you to:
- Define services, networks, and volumes in a declarative YAML file
- Start, stop, and rebuild services with simple commands
- View status and stream logs of running services
- Run one-off commands against services
- Ensure dev/prod parity across environments

### How It Works

```
┌─────────────────────────────────────────────────────────┐
│                   docker-compose.yml                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Service A  │  │   Service B  │  │   Service C  │  │
│  │  (Next.js)   │  │  (Postgres)  │  │   (Redis)    │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼─────────────────┼─────────────────┼───────────┘
          │                 │                 │
          └─────────────────┴─────────────────┘
                            │
                    ┌───────▼────────┐
                    │ Docker Network  │
                    │  (isolated)     │
                    └─────────────────┘
```

---

## Installation

### Prerequisites

- Docker Engine (v24.0+ recommended)
- Docker Compose (v2.27+ / Compose Specification)

### Install Docker Desktop (Recommended)

```bash
# macOS
brew install --cask docker

# Windows
winget install Docker.DockerDesktop

# Linux (Ubuntu)
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

### Verify Installation

```bash
# Check Docker
docker --version
# Expected: Docker version 24.0.0 or higher

# Check Compose
docker compose version
# Expected: Docker Compose version v2.27.0 or higher
```

---

## Compose File Structure

### Basic docker-compose.yml

```yaml
version: "3.8"  # Optional in Compose Specification

# Service definitions
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev123
      POSTGRES_DB: app_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev -d app_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

# Named volumes
volumes:
  postgres_data:
  redis_data:

# Networks (optional - Compose creates default network)
networks:
  default:
    name: myapp_network
```

### Monorepo-Specific Configuration

```yaml
# docker-compose.dev.yml for marketing agency monorepo
name: agency-monorepo

services:
  # Development workspace
  workspace:
    build:
      context: .
      dockerfile: Dockerfile.dev
      target: development
    volumes:
      - .:/workspace:cached
      - node_modules:/workspace/node_modules
      - pnpm_store:/workspace/.pnpm-store
    command: sleep infinity
    environment:
      - NODE_ENV=development
      - PNPM_HOME=/workspace/.pnpm
      - TURBO_TOKEN=${TURBO_TOKEN}
      - DATABASE_URL=postgresql://dev:dev123@postgres:5432/agency_dev
      - REDIS_URL=redis://redis:6379
    ports:
      - "3000-3010:3000-3010"  # App ports
      - "6006:6006"            # Storybook
    networks:
      - agency-network
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  # PostgreSQL database
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev123
      POSTGRES_DB: agency_dev
      POSTGRES_INITDB_ARGS: "--encoding=UTF-8"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./tools/database/init:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev -d agency_dev"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - agency-network

  # Redis cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3
    networks:
      - agency-network

  # MinIO for S3-compatible storage
  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"
    networks:
      - agency-network

volumes:
  node_modules:
  pnpm_store:
  postgres_data:
  redis_data:
  minio_data:

networks:
  agency-network:
    driver: bridge
```

---

## Dockerfile Patterns

### Multi-Stage Build (Production)

```dockerfile
# Dockerfile
# Multi-stage build for optimized production image

# Stage 1: Dependencies
FROM node:22-alpine AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/web/node_modules ./apps/web/node_modules

# Copy source code
COPY . .

# Build application
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build --filter=web

# Stage 3: Production
FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./public

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
```

### Development Dockerfile

```dockerfile
# Dockerfile.dev
# Optimized for development with hot reload

FROM node:22-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    bash \
    curl \
    vim \
    openssh-client

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /workspace

# Install global tools
RUN pnpm add -g \
    turbo \
    @changesets/cli

# Create pnpm home directory
ENV PNPM_HOME=/workspace/.pnpm
ENV PATH=$PNPM_HOME:$PATH

# Default command keeps container running
CMD ["sleep", "infinity"]
```

---

## Service Configuration Reference

### Build Configuration

```yaml
services:
  web:
    # Build from Dockerfile
    build:
      context: ./apps/web          # Build context
      dockerfile: Dockerfile         # Dockerfile name
      target: production           # Multi-stage target
      args:                        # Build arguments
        - NODE_ENV=production
        - API_URL=https://api.example.com
      cache_from:                  # Build cache
        - myapp/web:latest
        - type=local,src=/tmp/.buildx-cache
```

### Environment Variables

```yaml
services:
  web:
    # Option 1: Direct values
    environment:
      NODE_ENV: development
      DEBUG: "true"
    
    # Option 2: Array syntax
    environment:
      - NODE_ENV=development
      - DEBUG=true
    
    # Option 3: From .env file
    env_file:
      - .env
      - .env.local
    
    # Option 4: Variable interpolation
    environment:
      DATABASE_URL: postgres://${DB_USER}:${DB_PASSWORD}@db:5432/myapp
```

### Volume Mounting

```yaml
services:
  web:
    volumes:
      # Bind mount (development)
      - .:/app
      
      # Named volume
      - node_modules:/app/node_modules
      
      # Read-only bind mount
      - ./config:/app/config:ro
      
      # Volume with options
      - type: bind
        source: .
        target: /app
        bind:
          create_host_path: true
      
      # Anonymous volume (dont't sync node_modules)
      - /app/node_modules
```

### Health Checks

```yaml
services:
  web:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
      start_interval: 5s
    
    # Or use custom script
    healthcheck:
      test: ["CMD-SHELL", "node /app/healthcheck.js"]
      interval: 10s
      timeout: 5s
      retries: 5
```

### Dependency Management

```yaml
services:
  web:
    # Wait for service to start
    depends_on:
      - db
      - redis
    
    # Wait for service to be healthy (Compose v2.20+)
    depends_on:
      db:
        condition: service_healthy
        restart: true
      redis:
        condition: service_healthy
    
    # Service startup order (legacy)
    depends_on:
      - db
```

---

## Common Commands

### Lifecycle Commands

```bash
# Start all services
docker compose up

# Start in background (detached mode)
docker compose up -d

# Start specific services
docker compose up web db

# Stop services
docker compose down

# Stop and remove volumes (destructive)
docker compose down -v

# Restart services
docker compose restart

# Rebuild and start
docker compose up --build

# Build only
docker compose build

# Build specific service
docker compose build web
```

### Monitoring Commands

```bash
# View logs
docker compose logs

# Follow logs (tail -f)
docker compose logs -f

# View specific service logs
docker compose logs web

# View last 100 lines
docker compose logs --tail=100

# Check service status
docker compose ps

# Show resource usage
docker compose top
```

### Development Commands

```bash
# Execute command in running container
docker compose exec web bash
docker compose exec web pnpm install

# Run one-off command
docker compose run --rm web pnpm test

# Copy files to/from container
docker compose cp web:/app/logs ./local-logs

# Watch mode (Compose v2.22+)
docker compose watch
```

---

## Development Workflows

### Hot Reload Setup

```yaml
services:
  web:
    build: .
    volumes:
      # Mount source code for hot reload
      - .:/app
      # Preserve node_modules
      - /app/node_modules
      # Preserve Next.js cache
      - /app/.next
    environment:
      - NODE_ENV=development
      - WATCHPACK_POLLING=true  # For file watching in Docker
    command: pnpm run dev
```

### Debugging Configuration

```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"    # Application
      - "9229:9229"    # Node.js debugger
    environment:
      - NODE_OPTIONS=--inspect=0.0.0.0:9229
    command: pnpm run dev:debug
```

### Database Initialization

```yaml
services:
  postgres:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
      # Initialization scripts (run on first start)
      - ./init-scripts:/docker-entrypoint-initdb.d
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev123
      POSTGRES_DB: app_db
```

**Initialization Script** (`init-scripts/01-init.sql`):

```sql
-- Create additional databases
CREATE DATABASE test_db;

-- Create users
CREATE USER app_user WITH PASSWORD 'app_pass';
GRANT ALL PRIVILEGES ON DATABASE app_db TO app_user;

-- Run migrations/seeds
\i /docker-entrypoint-initdb.d/seeds.sql
```

---

## Production Considerations

### Security Best Practices

```dockerfile
# Dockerfile security improvements

# Use specific version tags (not latest)
FROM node:22.12.0-alpine3.19

# Run as non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Copy as non-root
COPY --chown=nextjs:nodejs . .

# Don't run as root
USER nextjs

# Scan for vulnerabilities
docker scan myimage:latest
```

### Performance Optimization

```yaml
services:
  web:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G
    
    # Restart policy
    restart: unless-stopped
    
    # Read-only root filesystem
    read_only: true
    tmpfs:
      - /tmp
      - /var/tmp
```

### Multi-Environment Setup

```yaml
# docker-compose.yml (base configuration)
services:
  web:
    build: .
    environment:
      - NODE_ENV=${NODE_ENV:-production}
```

```yaml
# docker-compose.override.yml (development - auto-loaded)
services:
  web:
    volumes:
      - .:/app
    environment:
      - DEBUG=true
```

```yaml
# docker-compose.staging.yml
services:
  web:
    environment:
      - API_URL=https://staging-api.example.com
```

**Usage**:

```bash
# Development (uses override automatically)
docker compose up

# Staging
docker compose -f docker-compose.yml -f docker-compose.staging.yml up

# Production
docker compose -f docker-compose.yml up
```

---

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Find process using port
lsof -i :3000
# or
netstat -tulpn | grep 3000

# Change port in docker-compose.yml
ports:
  - "3001:3000"
```

**Permission denied on volumes**
```bash
# Fix ownership on Linux
sudo chown -R $USER:$USER .

# Or use named volumes instead of bind mounts
volumes:
  - node_modules:/app/node_modules
```

**Container won't start**
```bash
# Check logs
docker compose logs web

# Check for errors in build
docker compose build --no-cache web

# Verify environment variables
docker compose config
```

**Slow file syncing (macOS)**
```yaml
services:
  web:
    volumes:
      - .:/app:delegated  # Use delegated consistency
```

### Debug Commands

```bash
# Inspect container
docker compose exec web sh
docker compose exec web env

# Check network
docker network ls
docker network inspect agency-network

# Resource usage
docker stats

# System prune (cleanup)
docker system prune -a
```

---

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Docker CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build image
        run: docker compose build web
      
      - name: Run tests
        run: docker compose run --rm web pnpm test
      
      - name: Push to registry
        if: github.ref == 'refs/heads/main'
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker compose push web
```

---

## Resources

### Official Documentation
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
- [Compose Specification](https://compose-spec.io/)
- [Docker Desktop](https://docs.docker.com/desktop/)

### Best Practices
- [Docker Security Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Node.js Docker Guidelines](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)

### Tools
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Docker Scout](https://docs.docker.com/scout/) - Security scanning
- [Docker BuildKit](https://docs.docker.com/build/buildkit/)

---

_Updated April 2026 based on Docker Compose v2.27+ and Compose Specification._
