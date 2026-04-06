# Turborepo Documentation

**Repository Version:** ^2.9.0  
**Official Documentation:** https://turborepo.dev/docs  
**Latest Release:** March 30, 2026

## Table of Contents

1. [Overview](#overview)
2. [Core Concepts](#core-concepts)
3. [Getting Started](#getting-started)
4. [Configuration](#configuration)
5. [Task Definition](#task-definition)
6. [Remote Caching](#remote-caching)
7. [CLI Commands](#cli-commands)
8. [turbo query](#turbo-query)
9. [Filtering and Selective Execution](#filtering-and-selective-execution)
10. [Environment Variables](#environment-variables)
11. [Caching Strategy](#caching-strategy)
12. [Package Manager Integration](#package-manager-integration)
13. [Advanced Features](#advanced-features)
14. [Experimental Features](#experimental-features)
15. [Observability](#observability)
16. [Best Practices](#best-practices)
17. [Migration Guide](#migration-guide)
18. [Troubleshooting](#troubleshooting)
19. [Reference](#reference)

## Overview

### What is Turborepo?

Turborepo is a high-performance build system for JavaScript and TypeScript codebases. It is designed for scaling monorepos and also makes workflows in single-package workspaces faster, too.

From individual developers to the largest enterprise engineering organizations in the world, Turborepo is saving years of engineering time and millions of dollars in compute costs through a lightweight approach to optimizing the tasks you need to run in your repository.

### The Monorepo Problem

Monorepos have many advantages - but they struggle to scale. Each workspace has its own test suite, its own linting, and its own build process. A single monorepo might have thousands of tasks to execute.

These slowdowns can dramatically affect the way your teams build software, especially at scale. Feedback loops need to be fast so developers can deliver high-quality code quickly.

### The Monorepo Solution

Turborepo solves your monorepo's scaling problem. Remote Cache stores the result of all your tasks, meaning that your CI never needs to do the same work twice.

Additionally, task scheduling can be difficult in a monorepo. You may need to build, then test, then lint... Turborepo schedules your tasks for maximum speed, parallelizing work across all available cores.

Turborepo can be adopted incrementally and you can add it to any repository in just a few minutes. It uses the package.json scripts you've already written, the dependencies you've already declared, and a single turbo.json file. You can use it with any package manager, like npm, yarn or pnpm since Turborepo leans on the conventions of the npm ecosystem.

### Performance Improvements in v2.9

Turborepo 2.9 introduces dramatic performance improvements:

- **Time to First Task improved up to 96%**: The time between invoking `turbo run` and when the first script begins executing has been dramatically reduced
- **Vercel's backend monorepo (1037 packages)**: 91% faster (8.1s → 716ms)
- **Vercel's frontend monorepo (132 packages)**: 81% faster (1.9s → 361ms)
- **create-turbo (6 packages)**: 80% faster (676ms → 132ms)

These improvements make Turborepo significantly faster for repositories of all sizes.

### Key Features

- **Intelligent Task Scheduling**: Automatically determines the optimal execution order based on dependencies
- **Remote Caching**: Share cache artifacts across your team and CI
- **Selective Execution**: Only run tasks affected by your changes
- **Package Manager Agnostic**: Works with npm, yarn, pnpm, and bun
- **Incremental Adoption**: Add to existing repositories gradually
- **GraphQL API**: Query your monorepo's structure with `turbo query`
- **OpenTelemetry Support**: Export metrics to observability platforms
- **Structured Logging**: Machine-readable JSON output

### Use Cases

- **Frontend Monorepos**: Multiple React, Vue, or Svelte applications
- **Full-Stack Development**: Frontend and backend code in the same repository
- **Component Libraries**: Shared UI components across applications
- **Microfrontends**: Independent frontend applications that can be deployed separately
- **Design Systems**: Centralized design tokens and component documentation
- **Package Development**: Multiple related npm packages

## Getting Started

### Installation

#### Global Installation

```bash
# Using npm
npm install -g turbo

# Using yarn
yarn global add turbo

# Using pnpm
pnpm add -g turbo

# Using bun
bun add -g turbo
```

#### Local Installation

```bash
# Using npm
npm install -D turbo

# Using yarn
yarn add -D turbo

# Using pnpm
pnpm add -D turbo

# Using bun
bun add -D turbo
```

### Quick Start

#### 1. Initialize Turborepo

```bash
# Create a new monorepo
npx create-turbo@latest

# Or add to an existing repository
npx turbo@latest init
```

#### 2. Create turbo.json

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "globalDependencies": ["**/tsconfig.json"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "!.next/cache/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

#### 3. Update package.json Scripts

```json
{
  "scripts": {
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "dev": "turbo run dev"
  }
}
```

#### 4. Run Your First Task

```bash
# Build all packages
turbo run build

# Build specific package
turbo run build --filter=my-app

# Build affected packages
turbo run build --affected
```

### Workspace Setup

#### pnpm

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tools/*'
```

#### npm/yarn

```json
# package.json (root)
{
  "workspaces": [
    "apps/*",
    "packages/*",
    "tools/*"
  ]
}
```

### Repository Structure

```text
my-monorepo/
├── apps/
│   ├── web/                   # Your main application
│   └── docs/                   # Documentation site
├── packages/
│   ├── ui/                     # Shared UI components
│   ├── utils/                  # Utility functions
│   └── config/                 # Shared configuration
├── tools/
│   └── scripts/                # Build and deployment tools
├── turbo.json                  # Turborepo configuration
├── package.json                # Root package.json
└── pnpm-workspace.yaml         # Workspace configuration
```

## Core Concepts

### Package and Task Graph

Turborepo understands the relationships between your packages and the tasks within them. This forms a dependency graph that allows for intelligent task scheduling and caching.

#### Package Graph

The Package Graph represents dependencies between packages in your monorepo:

```text
@repo/ui
└── depends on: @repo/utils

@repo/app
└── depends on: @repo/ui
```

#### Task Graph

The Task Graph represents dependencies between tasks:

```text
app#build
└── depends on: ui#build

ui#build
└── depends on: utils#build
```

### Caching Fundamentals

Turborepo caches two types of outputs:
- **Task outputs**: Files specified in the `outputs` configuration
- **Logs**: Console output from task execution

### Hashing Strategy

Inputs are hashed by Turborepo, creating a "fingerprint" for the task run. When "fingerprints" match, running the task will hit the cache.

Under the hood, Turborepo creates two hashes:
- **Global hash**: Repository-wide inputs that affect all tasks
- **Task hash**: Package-specific inputs for individual tasks

If either of the hashes change, the task will miss cache.

#### Global Hash Inputs

- Root `turbo.json` configuration
- Root `package.json`
- `globalDependencies` files
- `globalEnv` environment variables
- CLI flags and arguments

#### Package Hash Inputs

- Package `turbo.json` (if using Package Configuration)
- Package `package.json`
- Task `inputs` globs
- Task-specific environment variables

### Task Dependencies

Turborepo supports three types of task dependencies:

#### Package Dependencies (^)

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

Wait for the `build` task in all package dependencies to complete.

#### Same Package Dependencies

```json
{
  "tasks": {
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

Wait for the `build` task in the same package to complete.

#### Cross-Package Dependencies

```json
{
  "tasks": {
    "app#test": {
      "dependsOn": ["utils#build"]
    }
  }
}
```

Wait for a specific task in a specific package to complete.

### Cache Invalidation

A task cache is invalidated when:

1. **Global Changes**: Any global hash input changes
2. **Task Changes**: Any task-specific input changes
3. **Dependency Changes**: Any task it depends on has a different output hash
4. **Manual Force**: Using `--force` flag
5. **Cache Clearing**: Local cache is cleared

### Performance Metrics

Turborepo tracks and reports:

- **Time to First Task**: Time from `turbo run` to first task execution
- **Total Execution Time**: Time from start to finish of all tasks
- **Cache Hit Rate**: Percentage of tasks restored from cache
- **Parallelization**: Number of tasks running simultaneously
## Configuration

### turbo.json Structure

The turbo.json file is the heart of Turborepo configuration. It uses the following schema:

```json
{
  "$schema": "https://turborepo.dev/schema.json"
}
```

### Global Options

#### extends

Extend from the root turbo.json to create specific configuration for a package using Package Configurations.

```json
{
  "extends": ["//"]
}
```

- The extends array must start with `["//"]` to inherit configuration from the root turbo.json
- You can also extend from other packages (e.g., `["//", "shared-config"]`)
- If extends is used in the root turbo.json, it will be ignored

#### globalDependencies

A list of globs that you want to include in all task hashes. If any file matching these globs changes, all tasks will miss cache.

```json
{
  "globalDependencies": ["tsconfig.json"]
}
```

- Globs are relative to the location of turbo.json
- By default, only the root package.json and lockfile are included in the global hash
- Globs must be in the repository's source control root

#### globalEnv

A list of environment variables that you want to impact the hash of all tasks. Any change to these environment variables will cause all tasks to miss cache.

```json
{
  "globalEnv": ["GITHUB_TOKEN", "PACKAGE_VERSION", "NODE_ENV"]
}
```

Supports wildcard patterns:

```json
{
  "globalEnv": ["MY_API_*", "!MY_API_URL"]
}
```

#### globalPassThroughEnv

A list of environment variables that you want to make available to tasks. Using this key opts all tasks into Strict Environment Variable Mode.

```json
{
  "globalPassThroughEnv": ["AWS_SECRET_KEY", "GITHUB_TOKEN"]
}
```

Turborepo has a built-in set of global passthrough variables for common cases, like operating system environment variables. This includes variables like HOME, PATH, APPDATA, SHELL, PWD, and more.

#### ui

Select a terminal UI for the repository.

```json
{
  "ui": "tui" | "stream"
}
```

- "tui": Allows for viewing each log at once and interacting with the task
- "stream": Outputs logs as they come in and is not interactive (default)

#### noUpdateNotifier

When set to true, disables the update notification that appears when a new version of turbo is available.

```json
{
  "noUpdateNotifier": true
}
```

#### concurrency

Set/limit the maximum concurrency for task execution. Must be an integer greater than or equal to 1 or a percentage value like 50%.

```json
{
  "concurrency": "10"
}
```

- Use 1 to force serial execution (one task at a time)
- Use 100% to use all available logical processors
- This option is ignored if the deprecated --parallel flag is also passed

#### cacheDir

Default: ".turbo/cache"

Specify the filesystem cache directory.

```json
{
  "cacheDir": "./my-cache"
}
```

#### cacheMaxAge

Set the maximum age for cache artifacts. Accepts duration strings like "1d", "24h", "7d".

```json
{
  "cacheMaxAge": "7d"
}
```

#### cacheMaxSize

Set the maximum size for the cache. Accepts strings like "1GB", "500MB".

```json
{
  "cacheMaxSize": "2GB"
}
```

#### daemon

Enable or disable the Turborepo daemon for improved performance.

```json
{
  "daemon": true
}
```

#### envMode

Control environment variable handling:

```json
{
  "envMode": "loose" | "strict"
}
```

- "loose": Framework inference enabled (default)
- "strict": Only explicitly allowed environment variables

#### dangerouslyDisablePackageManagerCheck

Disable the package manager validation check. Use with caution.

```json
{
  "dangerouslyDisablePackageManagerCheck": true
}
```

### futureFlags

Enable experimental features that will become the default behavior in future versions of Turborepo.

```json
{
  "futureFlags": {
    "errorsOnlyShowHash": true,
    "longerSignatureKey": true,
    "affectedUsingTaskInputs": true,
    "watchUsingTaskInputs": true,
    "pruneIncludesGlobalFiles": true,
    "experimentalObservability": true
  }
}
```

#### errorsOnlyShowHash

Default: false

When using `outputLogs: "errors-only"`, show task hashes when tasks start and complete successfully.

```json
{
  "futureFlags": {
    "errorsOnlyShowHash": true
  },
  "tasks": {
    "build": {
      "outputLogs": "errors-only"
    }
  }
}
```

#### longerSignatureKey

Default: false

Enforce a minimum length of 32 bytes for the TURBO_REMOTE_CACHE_SIGNATURE_KEY environment variable when remoteCache.signature is enabled.

```json
{
  "futureFlags": {
    "longerSignatureKey": true
  },
  "remoteCache": {
    "signature": true
  }
}
```

#### affectedUsingTaskInputs

Default: false

Use task-level inputs globs to determine which tasks are affected by changed files when running with `--affected`.

```json
{
  "futureFlags": {
    "affectedUsingTaskInputs": true
  },
  "tasks": {
    "build": {
      "inputs": ["$TURBO_DEFAULT$", "!README.md"]
    }
  }
}
```

#### watchUsingTaskInputs

Default: false

Use task-level inputs globs to determine which tasks to re-run when files change in `turbo watch`.

```json
{
  "futureFlags": {
    "watchUsingTaskInputs": true
  }
}
```

#### pruneIncludesGlobalFiles

Default: false

Include globalDependencies files when running `turbo prune`.

```json
{
  "futureFlags": {
    "pruneIncludesGlobalFiles": true
  }
}
```

### Workspace Configuration

#### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tools/*'
  - 'docs/*'

catalog:
  # Core frameworks
  react: '^19.2.0'
  typescript: '^5.9.0'
  astro: '^6.0.0'
  next: '^16.0.0'
  
  # Build tools
  turbo: '^2.9.0'
  vite: '^6.0.0'
  
  # Testing
  vitest: '^3.0.0'
  playwright: '^1.60.0'
```

#### Package Organization

```
marketing-agency-monorepo/
├── apps/
│   ├── agency-website/          # Main Astro website
│   ├── client-alpha/            # Client site Alpha
│   ├── client-beta/             # Client site Beta
│   └── internal-tools/         # Internal dashboard
├── packages/
│   ├── design-system/           # Shared UI components
│   ├── analytics/              # Analytics package
│   ├── platform/
│   │   ├── database/           # Database adapters
│   │   ├── auth/               # Authentication
│   │   └── cms/                # CMS integration
│   └── shared/
│       ├── seo/                # SEO utilities
│       └── monitoring/          # Monitoring tools
├── tools/
│   ├── generators/             # Code generators
│   └── governance/             # Policy enforcement
└── docs/                       # Documentation
```

## Task Definition

### Tasks Object

Each key in the tasks object is the name of a task that can be executed by turbo run. Turborepo will search the packages described in your Workspace's configuration for scripts in package.json with the name of the task.

Using the rest of the configuration described in the task, Turborepo will run the scripts in the described order, caching logs and file outputs in the outputs key when provided.

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "globalDependencies": ["~/.env", ".env.local"],
  "globalEnv": [
    "NODE_ENV",
    "DATABASE_URL",
    "NEXT_PUBLIC_SITE_URL",
    "VERCEL_ENV",
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY"
  ],
  "tasks": {
    "build": {
      "dependsOn": ["^build", "db:generate"],
      "outputs": ["dist/**", ".next/**", "public/build/**"],
      "inputs": [
        "src/**",
        "package.json",
        "tsconfig.json",
        "tailwind.config.*"
      ],
      "cache": true,
      "env": ["NODE_ENV", "NEXT_PUBLIC_SITE_URL"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "inputs": ["src/**", "test/**", "package.json", "vitest.config.*"],
      "cache": true
    },
    "dev": {
      "cache": false,
      "persistent": true,
      "env": [
        "NODE_ENV",
        "DATABASE_URL",
        "NEXT_PUBLIC_SITE_URL",
        "SUPABASE_URL"
      ]
    }
  }
}
```

### Task Options

#### extends (task-level)

Controls whether a task inherits configuration from the extends chain. This option is only available in Package Configurations, not in the root turbo.json.

```json
{
  "extends": ["//"],
  "tasks": {
    "lint": {
      "extends": false
    }
  }
}
```

#### description

A human- or agent-readable description of what a task does. This field is for documentation purposes only and does not affect task execution or caching behavior.

```json
{
  "tasks": {
    "build": {
      "description": "Compiles the application for production deployment"
    }
  }
}
```

#### dependsOn

A list of tasks that are required to complete before the task begins running. There are three types of dependsOn relationships:

**Dependency relationships**: Prefixing a string in dependsOn with a ^ tells turbo that the task must wait for tasks in the package's dependencies to complete first.

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

**Same package relationships**: Task names without the ^ prefix describe a task that depends on a different task within the same package.

```json
{
  "tasks": {
    "test": {
      "dependsOn": ["lint", "build"]
    }
  }
}
```

**Arbitrary task relationships**: Specify a task dependency between specific package tasks.

```json
{
  "tasks": {
    "web#lint": {
      "dependsOn": ["utils#build"]
    }
  }
}
```

#### env

The list of environment variables a task depends on. Turborepo automatically includes environment variables prefixed by common frameworks through Framework Inference.

```json
{
  "tasks": {
    "build": {
      "env": ["DATABASE_URL"]
    },
    "web#build": {
      "env": ["API_SERVICE_KEY"]
    }
  }
}
```

**Wildcards**: Turborepo supports wildcards for environment variables:

```json
{
  "tasks": {
    "build": {
      "env": ["MY_API_*"]
    }
  }
}
```

**Negation**: A leading ! means that the entire pattern will be negated:

```json
{
  "tasks": {
    "build": {
      "env": ["!MY_API_URL"]
    }
  }
}
```

#### passThroughEnv

An allowlist of environment variables that should be made available to this task's runtime, even when in Strict Environment Mode.

```json
{
  "tasks": {
    "build": {
      "passThroughEnv": ["AWS_SECRET_KEY", "GITHUB_TOKEN"]
    }
  }
}
```

Values provided in passThroughEnv do not contribute to the cache key for the task. If you'd like changes to these variables to cause cache misses, you will need to include them in env or globalEnv.

#### outputs

A list of file glob patterns relative to the package's package.json to cache when the task is successfully completed.

```json
{
  "tasks": {
    "build": {
      "outputs": ["dist/**"]
    }
  }
}
```

Omitting this key or passing an empty array tells turbo to cache nothing (except logs, which are always cached when caching is enabled).

#### cache

Default: true

Defines if task outputs should be cached. Setting cache to false is useful for long-running development tasks and ensuring that a task always runs when it is in the task's execution graph.

```json
{
  "tasks": {
    "build": {
      "outputs": [".svelte-kit/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

#### inputs

Default: [], all files in the package that are checked into source control

A list of file glob patterns relative to the package's package.json to consider when determining if a package has changed. The following files are always considered inputs, even if you try to explicitly ignore them:

- package.json
- turbo.json
- Package manager lockfiles

```json
{
  "tasks": {
    "test": {
      "inputs": ["src/**/*.ts", "src/**/*.tsx", "test/**/*.ts"]
    }
  }
}
```

Using the inputs key opts you out of turbo's default behavior of considering .gitignore. You must reconstruct the globs from .gitignore as desired or use $TURBO_DEFAULT$ to build off of the default behavior.

**$TURBO_DEFAULT$**: Because specifying an inputs key immediately opts out of the default behavior, you may use the special string $TURBO_DEFAULT$ within the inputs array to restore turbo's default behavior.

```json
{
  "tasks": {
    "check-types": {
      "inputs": ["$TURBO_DEFAULT$", "!README.md"]
    }
  }
}
```

**$TURBO_ROOT$**: Starting a file glob with $TURBO_ROOT$ will change the glob to be relative to the root of the repository instead of the package directory.

```json
{
  "tasks": {
    "check-types": {
      "inputs": ["$TURBO_ROOT$/tsconfig.json", "src/**/*.ts"]
    }
  }
}
```

**$TURBO_EXTENDS$**: When using Package Configurations, array fields completely replace the values from the root turbo.json by default. The $TURBO_EXTENDS$ microsyntax changes this behavior to append instead of replace.

This microsyntax can be used in the following array fields:
- dependsOn
- env
- inputs
- outputs
- passThroughEnv
- with

```json
{
  "extends": ["//"],
  "tasks": {
    "build": {
      "outputs": ["$TURBO_EXTENDS$", ".next/**", "!.next/cache/**"]
    }
  }
}
```

#### Additional Task Options

```json
{
  "tasks": {
    "dev": {
      "persistent": true,
      "interactive": true,
      "interruptible": true
    },
    "test": {
      "outputLogs": "errors-only",
      "with": {
        "NODE_OPTIONS": "--inspect"
      }
    }
  }
}
```

## Remote Caching

### A Single, Shared Cache

What if you could share a single Turborepo cache across your entire team (and even your CI)?

Turborepo can securely communicate with a remote cache - a cloud server that stores the results of your tasks. This can save enormous amounts of time by preventing duplicated work across your entire organization.

Remote Caching is free and can be used with both managed providers or as a self-hosted cache.

### Vercel Remote Cache

Vercel Remote Cache is free to use on all plans, even if you do not host your applications on Vercel.

#### For Local Development

To link your local Turborepo to your Remote Cache, authenticate the Turborepo CLI with your Vercel account:

```bash
turbo login
```

You can also use your package manager if you do not have global turbo installed:

```bash
pnpm dlx turbo login
yarn dlx turbo login
npx turbo login
bunx turbo login
```

If your Remote Cache is configured to use single-sign-on you will need to run:

```bash
npx turbo login --sso-team=team-name
```

Now, link your Turborepo to your Remote Cache:

```bash
turbo link
```

Once enabled, make some changes to a package you are currently caching and run tasks against it with turbo run. Your cache artifacts will now be stored locally and in your Remote Cache.

To verify, delete your local Turborepo cache:

```bash
rm -rf ./.turbo/cache
# or on Windows
rd /s /q "./.turbo/cache"
```

Then, run the same build again. If things are working properly, turbo should not execute tasks locally. Instead, it will download the logs and artifacts from your Remote Cache and replay them back to you.

#### Remote Caching on Vercel

If you are building and hosting your apps on Vercel, Remote Caching will be automatically set up on your behalf once you use turbo.

#### Artifact Integrity and Authenticity Verification

Turborepo can sign artifacts with a secret key before uploading them to the Remote Cache. Turborepo uses HMAC-SHA256 signatures on artifacts using a secret key you provide. Turborepo will verify the Remote Cache artifacts' integrity and authenticity when they're downloaded.

To enable this feature, set the remoteCache options on your turbo.json config to include signature: true. Then specify your secret key by declaring the TURBO_REMOTE_CACHE_SIGNATURE_KEY environment variable.

```json
{
  "remoteCache": {
    "signature": true
  }
}
```

### Remote Cache Configuration

#### enabled

Default: true

Enables remote caching. When false, Turborepo will disable all remote cache operations, even if the repo has a valid token.

```json
{
  "remoteCache": {
    "enabled": true
  }
}
```

#### signature

Default: false

Enables signature verification for requests to the remote cache. When true, Turborepo will sign every uploaded artifact using the value of the environment variable TURBO_REMOTE_CACHE_SIGNATURE_KEY.

#### preflight

Default: false

When enabled, any HTTP request will be preceded by an OPTIONS request to determine if the request is supported by the endpoint.

#### timeout

Default: 30

Sets a timeout for remote cache operations. Value is given in seconds and only whole values are accepted. If 0 is passed, then there is no timeout for any cache operations.

#### uploadTimeout

Default: 60

Sets a timeout for remote cache uploads. Value is given in seconds and only whole values are accepted. If 0 is passed, then there is no timeout for any remote cache uploads.

#### apiUrl

Default: "https://vercel.com"

Set endpoint for API calls to the remote cache.

#### loginUrl

Default: "https://vercel.com"

Set endpoint for requesting tokens during turbo login.

#### teamId

The ID of the Remote Cache team. Value will be passed as teamId in the querystring for all Remote Cache HTTP calls. Must start with team_ or it will not be used.

#### teamSlug

The slug of the Remote Cache team. Value will be passed as slug in the querystring for all Remote Cache HTTP calls.
## CLI Commands

### turbo run

Run tasks specified in turbo.json. We recommend using turbo run in CI pipelines and turbo with global turbo locally for ease of use.

To run a task through turbo, it must be specified in turbo.json.

#### Options

##### --affected

Filter to only packages that are affected by changes on the current branch.

```bash
turbo run build lint test --affected
```

When combined with --filter, only packages matching both constraints are selected.

```bash
# Only run build for "web" if it's affected by changes
turbo run build --affected --filter=web
# Run affected packages, excluding "docs"
turbo run build --affected --filter=!docs
```

By default, the flag is equivalent to --filter=...[main...HEAD]. This considers changes between main and HEAD from Git's perspective.

You can override the default base and head with their respective System Environment Variables:

```bash
# Override Git comparison base
TURBO_SCM_BASE=development turbo run build --affected
# Override Git comparison head
TURBO_SCM_HEAD=your-branch turbo run build --affected
```

##### --cache <options>

Default: local:rw,remote:rw

Specify caching sources for the run. Accepts a comma-separated list of options:
- local: Use the local filesystem cache
- remote: Use the Remote Cache

Cache sources use the following values:
- rw: Read and write
- r: Read only
- w: Write only
- None (local:) : Does not use cache

```bash
# Read from and write to local cache. Only read from Remote Cache.
turbo run build --cache=local:rw,remote:r
# Only read from local cache. Read from and write to Remote Cache.
turbo run build --cache=local:r,remote:rw
# Read from and write to local cache. No Remote Cache activity.
turbo run build --cache=local:rw
# Do not use local cache. Only read from Remote Cache.
turbo run build --cache=local:,remote:r
```

##### --cache-dir <path>

Default: .turbo/cache

Specify the filesystem cache directory.

```bash
turbo run build --cache-dir="./my-cache"
```

Ensure the directory is in your .gitignore when changing it.

##### --concurrency <number | percentage>

Set/limit the maximum concurrency for task execution.

```bash
turbo build --concurrency=4  # max 4 tasks
turbo build --concurrency=50%  # 50% of CPU cores
```

##### --filter <string>

Specify targets to execute from your repository's graph. Multiple filters can be combined to select distinct sets of packages, directories, and git commits.

```bash
turbo run build --filter=ui
turbo run build --filter=./apps/*
turbo run build --filter=[HEAD^1]
```

**Microsyntaxes for filtering**:
- !: Negate targets from the selection
- ... using packages: Select all packages in the Package Graph relative to the target
- ... using Git commits: Select a range using [<from commit>]...[<to commit>]
- ^: Omit the target from the selection when using ....

**Using a task identifier**: You can also run a specific task for a specific package in the format of package-name#task-name.

```bash
turbo run web#lint
```

**Advanced filtering examples**:

```bash
# Any packages in `apps` subdirectories that have changed since the last commit
turbo run build --filter={.apps/*}[HEAD^1]
# Any packages in `apps` subdirectories except ./apps/admin
turbo run build --filter=./apps/* --filter=!./apps/admin
# Run the build task for the docs and web packages
turbo run build --filter=docs --filter=web
# Build everything that depends on changes in branch 'my-feature'
turbo run build --filter=...[origin/my-feature]
# Build everything that depends on changes between two Git SHAs
turbo run build --filter=[a1b2c3d...e4f5g6h]
# Build '@acme/ui' if it or any of its dependencies have changed since the previous commit
turbo run build --filter=@acme/ui...[HEAD^1]
# Test each package that is in the '@acme' scope, in the 'packages' directory, or changed since the previous commit
turbo run test --filter=@acme/*{./packages/*}[HEAD^1]
```

##### --force

Ignore existing cached artifacts and re-execute all tasks.

```bash
turbo run build --force
```

##### --parallel

Run tasks in parallel, ignoring the dependency graph. This is deprecated; use --concurrency instead.

##### --dry-run / --dry

Show what would be executed without actually running any tasks.

```bash
turbo run build --dry-run=json
```

##### --graph <file name>

Output the task dependency graph to a file.

```bash
turbo run build --graph=graph.json
```

##### --profile

Enable profiling for performance analysis.

```bash
turbo run build --profile
```

## turbo query

**Stable in v2.9**: `turbo query` has graduated from Experimental status to Stable. This powerful feature lets you run GraphQL queries against your monorepo's Package and Task Graphs.

### Overview

`turbo query` provides a GraphQL API to inspect your monorepo's structure, dependencies, and task relationships. This is particularly useful for:

- Understanding repository structure
- Building custom CI pipelines
- Creating tooling and automation
- Debugging dependency issues
- Generating reports and analytics

### Getting Started

#### Open GraphiQL Playground

```bash
# Open the interactive GraphQL playground
turbo query
```

#### Run Queries Inline

```bash
# Run a simple query
turbo query "{ packages { items { name } } }"

# Run a query from a file
turbo query --file=my-query.gql

# Get the GraphQL schema
turbo query --schema
```

### Shorthand Commands

#### turbo query affected

The `turbo query affected` shorthand checks which packages and tasks are affected by code changes in your repository.

```bash
# Get all tasks affected by source code changes
turbo query affected

# Get `build` tasks affected by source code changes
turbo query affected --tasks build

# Get all packages affected by source code changes
turbo query affected --packages

# Get JSON output
turbo query affected --output=json
```

**Sample Output**:

```json
{
  "packages": ["@repo/ui", "@repo/app"],
  "tasks": [
    "@repo/ui#build",
    "@repo/ui#test",
    "@repo/app#build",
    "@repo/app#test"
  ]
}
```

#### turbo query ls

The `turbo query ls` shorthand lists packages and useful details about them.

```bash
# List all packages
turbo query ls

# Get details for a specific package
turbo query ls web

# List only affected packages
turbo query ls --affected

# Filter packages using selectors
turbo query ls --filter=./apps/*

# Get JSON output for machine processing
turbo query ls --output=json
```

**Sample Output**:

```text
@repo/ui
  Path: ./packages/ui
  Tasks: build, test, lint
  Dependencies: @repo/utils

@repo/app
  Path: ./apps/app
  Tasks: build, test, lint, dev
  Dependencies: @repo/ui, @repo/utils
```

### GraphQL Schema

#### Core Types

```graphql
type Package {
  name: String!
  path: String!
  version: String
  tasks: [Task!]!
  dependencies: [Package!]!
  dependents: [Package!]!
}

type Task {
  name: String!
  package: Package!
  dependencies: [Task!]!
  dependents: [Task!]!
  inputs: [String!]!
  outputs: [String!]!
}

type Query {
  packages(filter: PackageFilter): PackageConnection!
  tasks(filter: TaskFilter): TaskConnection!
  affected(
    changes: [String!]!
    type: AffectedType
  ): AffectedResult!
}
```

#### Common Queries

##### List All Packages

```graphql
{
  packages {
    items {
      name
      path
      version
    }
  }
}
```

##### Get Package Dependencies

```graphql
{
  package(name: "@repo/ui") {
    name
    dependencies {
      name
      version
    }
  }
}
```

##### Find Tasks That Depend on a Package

```graphql
{
  tasks(filter: { dependsOn: "@repo/utils" }) {
    items {
      name
      package {
        name
      }
    }
  }
}
```

##### Get Task Graph

```graphql
{
  tasks {
    items {
      name
      package {
        name
      }
      dependencies {
        name
        package {
          name
        }
      }
    }
  }
}
```

### Use Cases

#### CI/CD Integration

```bash
#!/bin/bash
# Get affected packages for CI
AFFECTED=$(turbo query affected --packages --output=json)

# Only run CI if there are changes
if [ "$AFFECTED" != "[]" ]; then
  echo "Running CI for affected packages: $AFFECTED"
  turbo run build --affected
  turbo run test --affected
else
  echo "No affected packages, skipping CI"
fi
```

#### Dependency Analysis

```graphql
# Find packages that depend on @repo/ui
{
  packages(filter: { dependents: "@repo/ui" }) {
    items {
      name
      path
      tasks {
        name
      }
    }
  }
}
```

#### Performance Monitoring

```bash
# Get task execution statistics
turbo query "{ tasks { items { name package { name } } } }" | \
  jq '.data.tasks.items | group_by(.package.name) | map({package: .[0].package.name, taskCount: length})'
```

### Migration from turbo-ignore

`turbo query affected` is the recommended replacement for the deprecated `turbo-ignore`:

```bash
# Old way (deprecated)
turbo-ignore

# New way (recommended)
turbo query affected --tasks build
```

### Advanced Features

#### Custom Filters

```graphql
{
  packages(filter: { 
    path: "./apps/*",
    hasTask: "build"
  }) {
    items {
      name
      tasks {
        name
      }
    }
  }
}
```

#### Batch Operations

```bash
# Save schema for tooling
turbo query --schema > schema.graphql

# Run multiple queries from files
for query in queries/*.gql; do
  echo "Running $query"
  turbo query --file="$query"
done
```

#### Integration with Tools

```javascript
// Node.js integration
const { execSync } = require('child_process');

function getAffectedPackages() {
  const output = execSync('turbo query affected --packages --output=json');
  return JSON.parse(output);
}

function getPackageGraph() {
  const query = `
    {
      packages {
        items {
          name
          dependencies { name }
        }
      }
    }
  `;
  const output = execSync(`turbo query "${query}"`);
  return JSON.parse(output).data.packages.items;
}
```

### Best Practices

1. **Use --output=json** for programmatic consumption
2. **Cache query results** for expensive operations
3. **Use specific filters** to reduce query complexity
4. **Combine with --affected** for efficient CI pipelines
5. **Store common queries** in `.gql` files for reusability

## Filtering and Selective Execution

### Package Filtering

#### Basic Filtering

```bash
# Build specific packages
turbo run build --filter=@agency/design-system
turbo run build --filter=@agency/analytics

# Build packages and their dependencies
turbo run build --filter=@agency/design-system^...

# Build packages that depend on a package
turbo run build --filter=...@agency/design-system

# Build affected packages (based on git changes)
turbo run build --filter=...^[]
```

#### Advanced Filtering Patterns

```bash
# Build packages with specific patterns
turbo run build --filter="*client*"

# Build packages that changed in the last commit
turbo run build --filter="[HEAD^1]"

# Build packages that changed between branches
turbo run build --filter="[main...feature-branch]"

# Complex filtering with multiple conditions
turbo run test --filter=@acme/*{./packages/*}[HEAD^1]
```

### Task-Specific Filtering

```bash
# Run specific task for specific package
turbo run web#lint

# Run task without dependencies
turbo run web#lint --only

# Filter by directory pattern
turbo run build --filter=./apps/*
```

## Environment Variables

### Environment Variable Modes

#### Strict Environment Variable Mode

Using globalPassThroughEnv opts all tasks into Strict Environment Variable Mode, where only explicitly allowed environment variables are available to tasks.

#### Framework Inference

Turborepo automatically includes environment variables prefixed by common frameworks:
- Next.js: NEXT_PUBLIC_*
- Create React App: REACT_APP_*
- SvelteKit: VITE_*
- And more...

### Environment Variable Configuration

```json
{
  "globalEnv": ["NODE_ENV", "DATABASE_URL"],
  "globalPassThroughEnv": ["PATH", "HOME"],
  "tasks": {
    "build": {
      "env": ["API_KEY", "MY_API_*"],
      "passThroughEnv": ["AWS_SECRET_KEY"]
    }
  }
}
```

### System Environment Variables

#### TURBO_CACHE_DIR

Override the default cache directory (.turbo/cache).

```bash
TURBO_CACHE_DIR=./my-cache turbo run build
```

#### TURBO_FORCE

Force re-execution of all tasks, equivalent to --force.

```bash
TURBO_FORCE=1 turbo run build
```

#### TURBO_SCM_BASE and TURBO_SCM_HEAD

Override Git comparison base and head for --affected flag.

```bash
TURBO_SCM_BASE=development TURBO_SCM_HEAD=feature-branch turbo run build --affected
```

## Package Manager Integration

### pnpm Integration

#### Workspace Configuration

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tools/*'

catalog:
  react: '^19.2.0'
  typescript: '^5.9.0'
  turbo: '^2.9.0'
```

#### Package Scripts

```json
{
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev --parallel",
    "test": "turbo run test",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "catalog:turbo"
  }
}
```

### Dependency Management

#### Catalog Usage

```json
// apps/agency-website/package.json
{
  "dependencies": {
    "react": "catalog:react",
    "typescript": "catalog:typescript",
    "@agency/design-system": "workspace:*"
  }
}
```

#### Version Consistency

```javascript
// tools/generators/check-versions.js
const catalog = require('../../pnpm-workspace.yaml').catalog;

function checkVersions() {
  const packages = getPackages();
  
  for (const pkg of packages) {
    for (const [name, version] of Object.entries(catalog)) {
      if (pkg.dependencies[name] && pkg.dependencies[name] !== `catalog:${name}`) {
        console.warn(`${pkg.name}: ${name} should use catalog:${name}`);
      }
    }
  }
}
```

## Caching Strategy

### Output Configuration

```json
{
  "tasks": {
    "build": {
      "outputs": ["dist/**", ".next/**", "public/build/**"],
      "outputMode": "full"
    },
    "test": {
      "outputs": ["coverage/**"],
      "outputMode": "errors-only"
    },
    "lint": {
      "outputs": [],
      "outputMode": "new-only"
    }
  }
}
```

### Cache Optimization

```json
{
  "tasks": {
    "build": {
      "cache": true,
      "inputs": ["src/**", "package.json", "tsconfig.json"],
      "outputs": ["dist/**"],
      "outputsOwn": ["node_modules/.cache/turbo"]
    }
  }
}
```

### Cache Strategies

#### Local Caching Only

```json
{
  "remoteCache": {
    "enabled": false
  }
}
```

```bash
turbo run build --cache=local:rw
```

#### Remote Caching Only

```bash
turbo run build --cache=local:,remote:rw
```

#### Hybrid Caching

```bash
turbo run build --cache=local:rw,remote:rw
```

## Experimental Features

### OpenTelemetry Integration

**Experimental in v2.9**: Send Turborepo build metrics to any OTLP-compatible observability backend like Grafana, Datadog, or Honeycomb.

#### Configuration

Enable it with the `experimentalObservability` Future Flag in your turbo.json:

```json
{
  "futureFlags": {
    "experimentalObservability": true
  },
  "experimentalObservability": {
    "otel": {
      "enabled": true,
      "endpoint": "http://otel-collector.example.com:4317",
      "protocol": "grpc"
    }
  }
}
```

#### Available Protocols

- **grpc**: gRPC protocol (recommended for performance)
- **http**: HTTP/JSON protocol
- **https**: Secure HTTP/JSON protocol

#### Metrics Emitted

Turborepo will emit metrics like:
- `turbo.run.duration_ms`: Total execution time
- `turbo.run.tasks.cached`: Number of cached tasks
- `turbo.run.tasks.failed`: Number of failed tasks
- `turbo.run.tasks.total`: Total number of tasks
- `turbo.cache.hit_rate`: Cache hit rate percentage

#### Example Setup

```bash
# Try it locally with the example
npx create-turbo@latest -e with-otel
```

The example includes:
- Docker Compose setup with OTel Collector
- Pre-configured Grafana dashboards
- Sample queries and visualizations

#### Advanced Configuration

```json
{
  "experimentalObservability": {
    "otel": {
      "enabled": true,
      "endpoint": "https://api.datadoghq.com/api/v2/otlp",
      "protocol": "grpc",
      "headers": {
        "Authorization": "Bearer ${DD_API_KEY}"
      },
      "resource_attributes": {
        "service.name": "turbo-builds",
        "service.version": "1.0.0",
        "environment": "production"
      }
    }
  }
}
```

### Structured Logging

**Experimental in v2.9**: Machine-readable JSON output for programmatic consumption.

#### JSON Output

```bash
# Enable JSON output
turbo run build --json

# Save to file
turbo run build --json --log-file=build.log
```

#### Log File Output

```bash
# Write logs to file
turbo run build --log-file=build.log

# Combine with JSON output
turbo run build --json --log-file=build.json
```

#### Sample JSON Output

```json
{
  "taskId": "@repo/ui#build",
  "package": "@repo/ui",
  "task": "build",
  "status": "success",
  "duration": 1250,
  "cacheHit": true,
  "hash": "abc123def456",
  "timestamp": "2026-03-30T10:30:00.000Z",
  "outputs": ["dist/**"],
  "dependencies": ["@repo/utils#build"]
}
```

#### Integration Examples

##### CI/CD Integration

```bash
#!/bin/bash
# Run build with JSON output
turbo run build --json --log-file=build-results.json

# Parse results for reporting
FAILED_TASKS=$(jq -r '.[] | select(.status == "failed") | .taskId' build-results.json)
if [ -n "$FAILED_TASKS" ]; then
  echo "Failed tasks: $FAILED_TASKS"
  exit 1
fi
```

##### Monitoring Integration

```javascript
// Node.js script to process logs
const fs = require('fs');
const logs = JSON.parse(fs.readFileSync('build-results.json', 'utf8'));

const metrics = {
  totalTasks: logs.length,
  failedTasks: logs.filter(t => t.status === 'failed').length,
  cachedTasks: logs.filter(t => t.cacheHit).length,
  totalDuration: logs.reduce((sum, t) => sum + t.duration, 0)
};

console.log(`Build metrics:`, metrics);
```

### Future Features

#### Git Worktree Cache Sharing

Turborepo supports cache sharing across Git worktrees, allowing you to share cache artifacts between different branches of the same repository.

```bash
# Create a new worktree
git worktree add ../feature-branch feature-branch

# Cache will be shared automatically
cd ../feature-branch
turbo run build  # Uses cache from main branch
```

#### Package Boundaries

Define package boundaries for better organization and filtering.

```json
{
  "tasks": {
    "build": {
      "tags": ["frontend", "backend"]
    }
  }
}
```

#### Sidecar Tasks

Run auxiliary tasks that support main tasks without blocking them.

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "sidecar": ["type-check"]
    },
    "type-check": {
      "cache": false
    }
  }
}
```

## Observability

### Performance Monitoring

#### Built-in Metrics

Turborepo automatically tracks and reports:

- **Time to First Task**: Time from `turbo run` to first task execution
- **Total Execution Time**: Time from start to finish of all tasks
- **Cache Hit Rate**: Percentage of tasks restored from cache
- **Parallelization Efficiency**: How well tasks are parallelized
- **Memory Usage**: Peak memory consumption during builds

#### Performance Profiling

```bash
# Enable performance profiling
turbo run build --profile

# Profile specific tasks
turbo run build --profile --filter=@repo/ui
```

Profile output includes:
- Task execution timeline
- Dependency resolution time
- Cache operations timing
- Memory allocation patterns

### Cache Analytics

#### Cache Statistics

```bash
# Get detailed cache statistics
turbo run build --dry-run=json

# View cache hit rates by task
turbo run build --dry-run | jq '.tasks[] | {task: .taskId, cacheStatus: .cacheState}'
```

#### Cache Optimization

```json
{
  "tasks": {
    "build": {
      "outputs": ["dist/**", "!.next/cache/**"],
      "outputsOwn": ["node_modules/.cache/turbo"],
      "cache": true
    }
  }
}
```

### Monitoring Integration

#### Prometheus Metrics

```javascript
// Export Turborepo metrics to Prometheus
const client = require('prom-client');

const turboBuildDuration = new client.Histogram({
  name: 'turbo_build_duration_seconds',
  help: 'Duration of Turborepo builds',
  labelNames: ['task', 'package', 'cache_hit']
});

const turboCacheHitRate = new client.Gauge({
  name: 'turbo_cache_hit_rate',
  help: 'Cache hit rate for Turborepo builds'
});
```

#### Grafana Dashboard

Sample Grafana panel queries:

```promql
# Build duration over time
rate(turbo_build_duration_seconds_sum[5m]) by (task)

# Cache hit rate
turbo_cache_hit_rate

# Failed builds
rate(turbo_build_failed_total[5m]) by (package)
```

### Debugging Tools

#### Task Graph Visualization

```bash
# Generate task graph
turbo run build --graph=graph.json

# Visualize with external tools
npx @turbo/graphviz graph.json -o graph.svg
```

#### Dependency Analysis

```bash
# Analyze package dependencies
turbo query "{ packages { items { name dependencies { name } } } }"

# Find circular dependencies
turbo query "{ tasks { items { name dependencies { name package { name } } } } }"
```

#### Cache Debugging

```bash
# Show cache keys
turbo run build --dry-run=json | jq '.tasks[] | {task: .taskId, hash: .hash}'

# Force cache miss for debugging
TURBO_FORCE=1 turbo run build
```

### Health Checks

#### System Health

```bash
# Check Turborepo installation
turbo --version

# Validate configuration
turbo validate

# Check cache integrity
turbo ls --cache
```

#### Performance Benchmarks

```bash
# Benchmark repository performance
time turbo run build

# Compare with and without cache
time turbo run build --force
time turbo run build
```

## Advanced Features

### Package Configurations

Package Configurations allow you to override or extend turbo.json configuration for specific packages.

#### Package-specific turbo.json

```json
// apps/web/turbo.json
{
  "extends": ["//"],
  "tasks": {
    "build": {
      "outputs": ["$TURBO_EXTENDS$", ".next/**", "!.next/cache/**"]
    },
    "lint": {
      "extends": false
    }
  }
}
```

### Git Worktree Cache Sharing

Turborepo supports cache sharing across Git worktrees, allowing you to share cache artifacts between different branches of the same repository.

### Boundaries

#### tags

Define package boundaries for better organization and filtering.

```json
{
  "tasks": {
    "build": {
      "tags": ["frontend", "backend"]
    }
  }
}
```

### Experimental Features

#### futureFlags

Enable experimental features for future functionality.

```json
{
  "futureFlags": {
    "affectedUsingTaskInputs": true,
    "longerSignatureKey": true,
    "pruneIncludesGlobalFiles": true
  }
}
```

#### experimentalObservability

Enable experimental observability features.

```json
{
  "experimentalObservability": {
    "enabled": true,
    "baseUrl": "https://api.turborepo.dev"
  }
}
```

## Best Practices

### Monorepo Organization

- Keep related packages together
- Use clear naming conventions
- Separate apps from packages
- Document package dependencies
- Use consistent directory structure

### Task Configuration

- Define clear input/output patterns
- Use appropriate caching strategies
- Set up proper task dependencies
- Configure environment variables correctly
- Use descriptive task names

### Performance Optimization

- Enable remote caching for teams
- Use selective builds when possible
- Optimize task parallelization
- Monitor cache hit rates
- Use appropriate concurrency settings

### Development Experience

- Use descriptive task names
- Set up proper filtering
- Configure development workflows
- Implement proper error handling
- Use dry-run for testing

### Security

- Use signature verification for remote cache
- Properly handle sensitive environment variables
- Use passThroughEnv for non-sensitive variables
- Regularly update Turborepo version

## Troubleshooting

### Common Issues

#### Cache Misses

1. **Check inputs configuration**: Ensure all relevant files are included in inputs
2. **Verify environment variables**: Make sure sensitive env vars are properly configured
3. **Check global dependencies**: Ensure globalDependencies are correctly specified
4. **Verify framework inference**: Make sure framework-specific env vars are handled

#### Performance Issues

1. **Check concurrency settings**: Adjust concurrency based on available resources
2. **Verify task dependencies**: Ensure dependency graph is optimal
3. **Monitor cache hit rates**: Use --summarize to check cache performance
4. **Check I/O performance**: Consider using SSD for cache storage

#### Remote Cache Issues

1. **Authentication**: Verify turbo login and turbo link are successful
2. **Network connectivity**: Check connection to remote cache endpoint
3. **Signature verification**: Ensure signature key is properly configured
4. **Timeout settings**: Adjust timeout values for large artifacts

### Debugging Tools

#### Dry Run

```bash
turbo run build --dry-run=json
```

#### Task Graph

```bash
turbo run build --graph=graph.json
```

#### Verbose Output

```bash
turbo run build --verbosity=3
```

#### Summarize

```bash
turbo run build --summarize
```

#### Force Re-execution

```bash
turbo run build --force
```

### Performance Monitoring

#### Cache Analysis

```bash
# Check cache hit rate
turbo run build --cache-dir=./.turbo

# Analyze cache usage
turbo run build --cache-stats
```

#### Build Timing

```bash
# Measure build times
time turbo run build

# Profile specific tasks
turbo run build --filter=@agency/design-system --profile
```

## Version-Specific Features (Turborepo 2.9)

### New Features

- 96% faster performance improvements
- AI-enabled documentation generation
- Git worktrees support
- Agent Skill integration
- Enhanced DevTools
- Composable Configuration
- Biome rule support
- Yarn 4 catalogs compatibility
- Microfrontends support
- Bun package manager stability
- Sidecar tasks
- JSONC configuration support
- Package Boundaries
- Enhanced Remote Caching
- Performance monitoring
- Docker integration

### Breaking Changes

- Updated configuration format
- Changes to task dependency resolution
- Modified caching behavior

### Migration Guide

1. Update turbo.json schema URL to https://turborepo.dev/schema.json
2. Review task dependencies for breaking changes
3. Update remote cache configuration if needed
4. Test all workflows after upgrade

---

*This documentation covers Turborepo ^2.9.0 as used in this repository. For the latest features, check the official Turborepo documentation at https://turborepo.dev/docs*
