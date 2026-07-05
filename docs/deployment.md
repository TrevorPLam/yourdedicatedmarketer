# Deployment Guide

This document describes the deployment process for the firm website using Vercel and GitHub Actions CI.

## Vercel Deployment

### Project Setup

The Vercel project is configured to deploy the `apps/firm-website` application from the monorepo.

### Configuration

- **Root Directory**: Repository root (monorepo structure)
- **Framework Preset**: Next.js (auto-detected)
- **Package Manager**: pnpm (auto-detected)
- **Build Command**: `pnpm turbo build --filter=@repo/firm-website`
- **Output Directory**: `apps/firm-website/.next`

### vercel.json

The `vercel.json` file at the repository root specifies:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "installCommand": "pnpm install",
  "buildCommand": "pnpm turbo build --filter=@repo/firm-website",
  "outputDirectory": "apps/firm-website/.next"
}
```

This ensures that:
- Dependencies are installed using pnpm at the monorepo root
- Only the firm-website app is built using Turborepo's filter
- The output directory is correctly specified for Next.js

### Environment Variables

Set the following environment variables in Vercel:

- `NEXT_PUBLIC_SITE_URL`: The production URL (e.g., `https://yourdedicatedmarketer.vercel.app`)

Set these for both Production and Preview environments.

### Deployment Workflow

1. **Production Deployments**: Automatically triggered when pushing to the `main` branch
2. **Preview Deployments**: Automatically triggered for every pull request

### Turborepo Remote Caching

Vercel automatically enables remote caching for Turborepo projects. This means:
- First build: Full compilation (~30-60s)
- Subsequent builds with no changes: Cached (~2-5s)
- Partial changes: Only rebuilds affected packages

No additional configuration is required for remote caching.

### turbo-ignore (Optional)

To skip unnecessary builds when the app hasn't changed, configure the "Ignored Build Step" in Vercel:

1. Go to Project Settings > Git > Ignored Build Step
2. Select "Custom" and enter: `npx turbo-ignore`

This checks if the package or its dependencies changed since the last deployment.

## GitHub Actions CI

### Workflow

The CI workflow (`.github/workflows/ci.yml`) runs on:
- Pull requests to `main`
- Pushes to `main`

### Steps

1. **Checkout**: Clone the repository
2. **Setup pnpm**: Install pnpm 9.15.0
3. **Setup Node.js**: Install Node.js 22 with pnpm caching
4. **Install dependencies**: Install with frozen lockfile for reproducibility
5. **Run lint**: Run `pnpm turbo lint`
6. **Run type check**: Run `pnpm turbo check-types`
7. **Run tests**: Run `pnpm turbo test`

### Caching

The workflow uses GitHub Actions caching for pnpm dependencies to speed up builds.

## Manual Deployment

To manually trigger a deployment:

1. Push to the `main` branch
2. Or use the Vercel dashboard to trigger a manual deployment

## Troubleshooting

### Build Failures

- Check that `pnpm-lock.yaml` is committed and up-to-date
- Verify Node.js version is 22 or higher
- Ensure all dependencies are installed correctly

### Environment Variables

- Ensure `NEXT_PUBLIC_SITE_URL` is set for both Production and Preview
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser

### Monorepo Issues

- If builds fail due to missing dependencies, ensure `vercel.json` install command runs from root
- Verify Turborepo filter matches the package name: `@repo/firm-website`
