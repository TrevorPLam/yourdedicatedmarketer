# GitHub Actions CI/CD

## Overview

GitHub Actions is a continuous integration and continuous delivery (CI/CD) platform that allows you to automate your build, test, and deployment pipeline. You can create workflows that build and test every pull request to your repository, or deploy merged pull requests to production.

**Source**: Based on [GitHub Actions Documentation](https://docs.github.com/en/actions), [Workflow Syntax Reference](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions), and [GitHub Actions Examples](https://github.com/actions/starter-workflows).

---

## Core Concepts

### Workflow Structure

```yaml
name: CI Pipeline                    # Workflow name (optional)
run-name: Deploy to ${{ inputs.deploy_target }} by @${{ github.actor }}

on:                                  # Trigger events
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  workflow_dispatch:                 # Manual trigger
    inputs:
      deploy_target:
        description: 'Deployment target'
        required: true
        default: 'staging'

concurrency:                         # Prevent concurrent runs
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

env:                                 # Global environment variables
  NODE_VERSION: '22'
  PNPM_VERSION: '10'

jobs:                                # Job definitions
  build:                             # Job ID
    runs-on: ubuntu-latest           # Runner
    steps:                           # Steps to execute
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
```

### Workflow Triggers

```yaml
on:
  # Push to specific branches
  push:
    branches: [main, develop, 'release/*']
    paths: ['src/**', '!docs/**']     # Only when src changes
    
  # Pull request events
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
    branches: [main]
    
  # Scheduled runs (cron)
  schedule:
    - cron: '0 2 * * 1'               # Weekly on Monday 2am UTC
    
  # Manual triggers
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options: [staging, production]
        required: true
      debug_enabled:
        type: boolean
        default: false
        
  # External events
  repository_dispatch:
    types: [deploy-command]
    
  # Other triggers
  release:
    types: [published]
  deployment:
  merge_group:
```

---

## Job Configuration

### Basic Job Structure

```yaml
jobs:
  # Job ID (unique identifier)
  build-and-test:
    # Display name
    name: Build and Test
    
    # Runner selection
    runs-on: ubuntu-latest
    # options: ubuntu-latest, windows-latest, macos-latest
    #          ubuntu-24.04, ubuntu-22.04, etc.
    
    # Run conditions
    if: github.event_name == 'push' || !github.event.pull_request.draft
    
    # Timeout (default: 360 minutes)
    timeout-minutes: 30
    
    # Environment configuration
    environment:
      name: staging
      url: https://staging.example.com
    
    # Job outputs for other jobs
    outputs:
      build_id: ${{ steps.build.outputs.id }}
      version: ${{ steps.version.outputs.value }}
    
    # Concurrency control
    concurrency:
      group: build-${{ github.ref }}
      cancel-in-progress: true
    
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0          # Full history for versioning
          
      - name: Build application
        id: build
        run: |
          BUILD_ID=$(date +%s)
          echo "id=$BUILD_ID" >> $GITHUB_OUTPUT
```

### Job Dependencies

```yaml
jobs:
  # Independent jobs run in parallel
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test

  # Dependent jobs wait for others
  build:
    runs-on: ubuntu-latest
    needs: [lint, test]              # Wait for both
    if: always() && needs.lint.result == 'success' && needs.test.result == 'success'
    steps:
      - run: npm run build

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build
    environment: staging
    steps:
      - run: deploy --env=staging

  deploy-production:
    runs-on: ubuntu-latest
    needs: deploy-staging
    environment: production
    if: github.ref == 'refs/heads/main'
    steps:
      - run: deploy --env=production
```

### Matrix Strategy

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false                  # Continue on failure
      max-parallel: 4                   # Limit parallel jobs
      matrix:
        # Single dimension
        node-version: [18, 20, 22]
        
        # Multi-dimensional
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [20, 22]
        exclude:                        # Exclude combinations
          - os: macos-latest
            node: 18
        include:                        # Add specific combinations
          - os: ubuntu-latest
            node: 23
            experimental: true
    
    continue-on-error: ${{ matrix.experimental || false }}
    
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm test
```

### Conditional Jobs

```yaml
jobs:
  # Skip for draft PRs
  test:
    if: github.event.pull_request.draft == false
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  # Run only on main branch
  deploy:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: deploy

  # Run only for specific file changes
  docs:
    if: contains(github.event.head_commit.message, '[docs]')
    runs-on: ubuntu-latest
    steps:
      - run: build-docs

  # Complex conditions
  integration-test:
    if: |
      github.event_name == 'push' ||
      (github.event_name == 'pull_request' && 
       contains(github.event.pull_request.labels.*.name, 'run-integration'))
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:integration
```

---

## Steps and Actions

### Step Types

```yaml
steps:
  # Use pre-built action
  - uses: actions/checkout@v4
    with:
      fetch-depth: 0
      token: ${{ secrets.GITHUB_TOKEN }}

  # Run shell command
  - name: Install dependencies
    run: npm ci

  # Multi-line script
  - name: Build and test
    run: |
      echo "Starting build process..."
      npm run build
      npm test
      echo "Build complete!"
    shell: bash                        # Explicit shell
    working-directory: ./app           # Working directory
    id: build-step                     # Step ID for outputs
    continue-on-error: false           # Fail on error (default)
    timeout-minutes: 10                # Step timeout
    if: github.event_name == 'push'    # Conditional step

  # Set environment variable
  - name: Set env
    run: echo "MY_VAR=value" >> $GITHUB_ENV

  # Set output
  - name: Set output
    id: step1
    run: echo "result=success" >> $GITHUB_OUTPUT

  # Use output from previous step
  - name: Use output
    run: echo "Result was ${{ steps.step1.outputs.result }}"
```

### Common Built-in Actions

```yaml
steps:
  # Checkout code
  - uses: actions/checkout@v4
    with:
      fetch-depth: 0
      lfs: true
      submodules: recursive

  # Setup Node.js
  - uses: actions/setup-node@v4
    with:
      node-version: '22'
      cache: 'npm'                      # or 'yarn', 'pnpm'
      registry-url: 'https://npm.pkg.github.com'
      scope: '@owner'

  # Setup pnpm
  - uses: pnpm/action-setup@v2
    with:
      version: '10'
      run_install: false

  # Setup Python
  - uses: actions/setup-python@v5
    with:
      python-version: '3.12'
      cache: 'pip'

  # Setup Docker Buildx
  - uses: docker/setup-buildx-action@v3

  # Login to Docker Hub
  - uses: docker/login-action@v3
    with:
      username: ${{ secrets.DOCKER_USERNAME }}
      password: ${{ secrets.DOCKER_PASSWORD }}

  # Cache dependencies
  - uses: actions/cache@v4
    with:
      path: |
        ~/.npm
        ~/.pnpm-store
        node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-node-

  # Upload artifacts
  - uses: actions/upload-artifact@v4
    with:
      name: build-output
      path: |
        dist/
        build/
      retention-days: 7

  # Download artifacts
  - uses: actions/download-artifact@v4
    with:
      name: build-output
      path: dist/
```

---

## Monorepo CI/CD Pattern

### Turborepo Workflow

```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ vars.TURBO_TEAM }}

jobs:
  # Detect changed packages
  changes:
    runs-on: ubuntu-latest
    outputs:
      packages: ${{ steps.filter.outputs.changes }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v2
        id: filter
        with:
          filters: |
            web:
              - 'apps/web/**'
              - 'packages/ui/**'
            api:
              - 'apps/api/**'
              - 'packages/database/**'
            docs:
              - 'apps/docs/**'

  # Run lint and type-check
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo run lint type-check

  # Build affected packages
  build:
    needs: [changes, quality]
    if: ${{ needs.changes.outputs.packages != '[]' }}
    runs-on: ubuntu-latest
    strategy:
      matrix:
        package: ${{ fromJson(needs.changes.outputs.packages) }}
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo run build --filter=${{ matrix.package }}
      - uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.package }}-build
          path: apps/${{ matrix.package }}/.next

  # Run tests for affected packages
  test:
    needs: build
    runs-on: ubuntu-latest
    strategy:
      matrix:
        package: ${{ fromJson(needs.changes.outputs.packages) }}
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - uses: actions/download-artifact@v4
        with:
          name: ${{ matrix.package }}-build
          path: apps/${{ matrix.package }}/.next
      - run: pnpm turbo run test --filter=${{ matrix.package }}

  # Deploy to staging
  deploy-staging:
    needs: [build, test]
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.example.com
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo run build
        env:
          NODE_ENV: production
          API_URL: https://staging-api.example.com
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  # Deploy to production
  deploy-production:
    needs: deploy-staging
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com
    steps:
      - name: Deploy to Vercel Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Playwright E2E Testing with Sharding

```yaml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      
      - name: Install Playwright
        run: |
          pnpm exec playwright install --with-deps
      
      - name: Build application
        run: pnpm run build
      
      - name: Run Playwright tests (shard ${{ matrix.shardIndex }})
        run: |
          pnpm exec playwright test \
            --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
        env:
          PLAYWRIGHT_SHARD: ${{ matrix.shardIndex }}
          PLAYWRIGHT_TOTAL_SHARDS: ${{ matrix.shardTotal }}
      
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-results-${{ matrix.shardIndex }}
          path: |
            test-results/
            playwright-report/

  merge-reports:
    needs: e2e-tests
    runs-on: ubuntu-latest
    if: always()
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      
      - name: Download all artifacts
        uses: actions/download-artifact@v4
        with:
          path: all-reports
          pattern: playwright-results-*
      
      - name: Merge reports
        run: pnpm exec playwright merge-reports all-reports
      
      - name: Upload merged report
        uses: actions/upload-artifact@v4
        with:
          name: full-playwright-report
          path: playwright-report
```

---

## Security and Permissions

### Permission Configuration

```yaml
name: Secure Workflow

# Minimal permissions for the entire workflow
permissions:
  contents: read          # For checkout
  issues: write           # For creating issues
  pull-requests: write    # For PR comments

jobs:
  # Job-specific permissions
  deploy:
    permissions:
      contents: read
      deployments: write
      id-token: write     # For OIDC
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

### OIDC Token Authentication

```yaml
name: AWS Deployment

permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/GithubActionsRole
          aws-region: us-east-1
      
      - name: Deploy to AWS
        run: aws s3 sync ./dist s3://my-bucket
```

### Secret Management

```yaml
name: Deploy with Secrets

on:
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options: [staging, production]
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy
        run: |
          echo "Deploying to ${{ inputs.environment }}"
          deploy --api-key="${{ secrets.API_KEY }}"
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
      
      # Mask secrets in logs
      - name: Safe operation
        run: |
          echo "::add-mask::${{ secrets.API_KEY }}"
          echo "Token is set"
```

---

## Reusable Workflows

### Creating Reusable Workflow

```yaml
# .github/workflows/reusable-build.yml
name: Reusable Build

on:
  workflow_call:
    inputs:
      node-version:
        type: string
        default: '22'
        required: false
      environment:
        type: string
        required: true
    secrets:
      api-key:
        required: true
    outputs:
      build-id:
        description: "The build ID"
        value: ${{ jobs.build.outputs.id }}

jobs:
  build:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    outputs:
      id: ${{ steps.build.outputs.id }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
      
      - name: Build
        id: build
        run: |
          BUILD_ID=$(date +%s)
          echo "id=$BUILD_ID" >> $GITHUB_OUTPUT
        env:
          API_KEY: ${{ secrets.api-key }}
```

### Calling Reusable Workflow

```yaml
# .github/workflows/main.yml
name: Main CI

on:
  push:
    branches: [main]

jobs:
  build-staging:
    uses: ./.github/workflows/reusable-build.yml
    with:
      node-version: '22'
      environment: staging
    secrets:
      api-key: ${{ secrets.STAGING_API_KEY }}

  build-production:
    needs: build-staging
    uses: ./.github/workflows/reusable-build.yml
    with:
      node-version: '22'
      environment: production
    secrets:
      api-key: ${{ secrets.PROD_API_KEY }}

  deploy:
    needs: [build-staging, build-production]
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "Staging build: ${{ needs.build-staging.outputs.build-id }}"
          echo "Production build: ${{ needs.build-production.outputs.build-id }}"
```

---

## Best Practices

### Workflow Optimization

```yaml
name: Optimized CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

# Concurrency to prevent queue buildup
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

# Environment variables used across jobs
env:
  NODE_VERSION: '22'
  PNPM_VERSION: '10'

jobs:
  # Cache dependencies once
  setup:
    runs-on: ubuntu-latest
    outputs:
      pnpm-cache-key: ${{ steps.cache.outputs.key }}
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - id: cache
        run: |
          KEY="${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}"
          echo "key=$KEY" >> $GITHUB_OUTPUT

  # Parallel quality checks
  lint:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm run lint

  test:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm test

  typecheck:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm run type-check
```

### Caching Strategy

```yaml
steps:
  # Dependency caching
  - uses: actions/cache@v4
    id: pnpm-cache
    with:
      path: |
        ~/.pnpm-store
        node_modules
      key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
      restore-keys: |
        ${{ runner.os }}-pnpm-

  - name: Install dependencies
    if: steps.pnpm-cache.outputs.cache-hit != 'true'
    run: pnpm install --frozen-lockfile

  # Turborepo caching
  - name: Setup Turborepo cache
    uses: actions/cache@v4
    with:
      path: .turbo
      key: turbo-${{ github.job }}-${{ github.ref_name }}-${{ github.sha }}
      restore-keys: |
        turbo-${{ github.job }}-${{ github.ref_name }}-
```

### Error Handling

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run tests
        id: test
        run: npm test
        continue-on-error: true
      
      - name: Upload failed test screenshots
        if: steps.test.outcome == 'failure'
        uses: actions/upload-artifact@v4
        with:
          name: test-failures
          path: test-results/
      
      - name: Fail job if tests failed
        if: steps.test.outcome == 'failure'
        run: exit 1
```

---

## Troubleshooting

### Common Issues

**Action not found**
```yaml
# Ensure correct version
- uses: actions/checkout@v4  # Not @master or @main
```

**Permission denied**
```yaml
# Add required permissions
permissions:
  contents: write
  pull-requests: write
```

**Cache not hitting**
```yaml
# Use correct cache key format
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

**Secrets not available**
```yaml
# Secrets are not available in PRs from forks
# Use environments for approval
environment:
  name: external
```

---

## Resources

### Official Documentation
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax Reference](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions)
- [Context and Expression Syntax](https://docs.github.com/actions/learn-github-actions/contexts)
- [Environment Variables](https://docs.github.com/actions/learn-github-actions/variables)

### Starter Workflows
- [GitHub Actions Starter Workflows](https://github.com/actions/starter-workflows)
- [Starter Workflows Catalog](https://github.com/actions/starter-workflows/tree/main/code-scanning)

### Marketplace
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Verified Actions](https://github.com/marketplace?type=actions&verification=verified_creator)

---

_Updated April 2026 based on GitHub Actions official documentation._
