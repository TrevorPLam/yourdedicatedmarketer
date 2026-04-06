# Husky Documentation

**Repository Version:** ^9.1.0  
**Official Documentation:** https://typicode.github.io/husky/  
**Latest Release:** April 2026

## Overview

Husky is the industry-standard tool for managing Git hooks in modern JavaScript/TypeScript projects. It enables you to set up Git hooks easily and run scripts before commits, pushes, and more.

In this monorepo, Husky serves as the foundation of our development workflow automation, ensuring code quality, running tests, and enforcing standards before changes are committed to the repository.

## Key Features

### **Git Hooks Management**
- **Pre-commit Hooks**: Run scripts before commits are created
- **Pre-push Hooks**: Validate code before pushing to remote
- **Commit-msg Hooks**: Enforce commit message standards
- **Custom Hooks**: Support for any Git hook event

### **Workflow Automation**
- **Code Quality**: Automatic linting and formatting
- **Testing**: Run tests before commits
- **Type Checking**: Ensure TypeScript compilation
- **Security**: Prevent secrets and sensitive data from being committed

### **Monorepo Optimization**
- **Performance**: Optimized for large monorepos
- **Turbo Integration**: Seamless integration with Turborepo
- **Package Filtering**: Run hooks only on affected packages
- **Parallel Execution**: Efficient hook execution across packages

## Installation

### Core Setup

```bash
# Install Husky
pnpm add -D husky@^9.1.0

# Enable Git hooks
npx husky install

# Add prepare script to package.json
pnpm pkg set scripts.prepare="husky install"
```

### Hook Configuration

```bash
# Add pre-commit hook
npx husky add .husky/pre-commit "pnpm lint"

# Add pre-push hook
npx husky add .husky/pre-push "pnpm test"

# Add commit-msg hook
npx husky add .husky/commit-msg "npx commitlint --edit $1"
```

## Configuration

### **Package.json Setup**

```json
{
  "scripts": {
    "prepare": "husky install",
    "precommit": "lint-staged",
    "commitmsg": "commitlint -E HUSKY_GIT_PARAMS"
  },
  "devDependencies": {
    "husky": "^9.1.0",
    "lint-staged": "^15.4.0",
    "@commitlint/cli": "^19.0.0",
    "@commitlint/config-conventional": "^19.0.0"
  }
}
```

### **Husky Configuration**

```javascript
// .husky/config.json (optional)
{
  "hooks": {
    "pre-commit": "lint-staged",
    "pre-push": "pnpm run test",
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
  }
}
```

### **Environment Variables**

```bash
# .env.local
HUSKY=0 # Disable Husky (useful for debugging)
SKIP_HUSKY=1 # Skip Husky for specific commits
```

## Hook Scripts

### **Pre-commit Hook**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit hooks..."

# Run lint-staged for formatting and linting
echo "📝 Running lint-staged..."
npx lint-staged

# Check for TypeScript compilation errors in changed files
echo "🔧 Running TypeScript type checking..."
npx turbo run type-check --filter="*"

# Run tests on affected packages
echo "🧪 Running tests on affected packages..."
npx turbo run test --filter="*"

# Check package.json for common issues
echo "📦 Validating package.json files..."
npx turbo run lint --filter="*" -- --no-fix

echo "✅ Pre-commit checks completed!"
```

### **Pre-push Hook**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🚀 Running pre-push hooks..."

# Run full test suite
echo "🧪 Running full test suite..."
npx turbo run test

# Check build process
echo "🏗️ Running build validation..."
npx turbo run build

# Security audit
echo "🔒 Running security audit..."
pnpm audit --audit-level moderate

echo "✅ Pre-push checks completed!"
```

### **Commit-msg Hook**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "📝 Validating commit message..."

npx commitlint --edit $1

echo "✅ Commit message validated!"
```

### **Post-merge Hook**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔄 Running post-merge hooks..."

# Update dependencies if needed
if [ -f "package.json" ] && [ -f "pnpm-lock.yaml" ]; then
  echo "📦 Checking for dependency updates..."
  pnpm outdated
fi

# Clean up build artifacts
echo "🧹 Cleaning up build artifacts..."
npx turbo run clean

echo "✅ Post-merge hooks completed!"
```

## Lint-staged Integration

### **Configuration**

```json
// lint-staged.config.js
export default {
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    'git add'
  ],
  '*.{json,md,yml,yaml}': [
    'prettier --write',
    'git add'
  ],
  '*.{astro,css,scss}': [
    'prettier --write',
    'git add'
  ],
  'package.json': [
    'npm-package-json-lint fix',
    'git add'
  ]
};
```

### **Package.json Configuration**

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ],
    "*.{astro,css,scss}": [
      "prettier --write"
    ],
    "package.json": [
      "npm-package-json-lint fix"
    ]
  }
}
```

## Commitlint Integration

### **Configuration**

```javascript
// commitlint.config.js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation changes
        'style',    // Code style changes
        'refactor', // Code refactoring
        'perf',     // Performance improvements
        'test',     // Test changes
        'chore',    // Build process or auxiliary tool changes
        'ci',       // CI configuration changes
        'build',    // Build system changes
        'revert',   // Revert previous commit
      ]
    ],
    'scope-enum': [
      2,
      'always',
      [
        'ui',           // UI components
        'api',          // API changes
        'database',     // Database changes
        'auth',         // Authentication
        'config',       // Configuration
        'deps',         // Dependencies
        'docs',         // Documentation
        'testing',      // Testing
        'storybook',    // Storybook
        'eslint',       // ESLint
        'typescript',   // TypeScript
        'turbo',        // Turborepo
        'husky',        // Husky
        'changesets',   // Changesets
      ]
    ],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'body-max-line-length': [2, 'always', 72],
    'footer-max-line-length': [2, 'always', 72],
  }
};
```

### **Commit Message Examples**

```bash
# Valid commit messages
git commit -m "feat(ui): add new button component"
git commit -m "fix(api): resolve authentication timeout issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "test(components): add unit tests for card component"
git commit -m "refactor(database): optimize query performance"
git commit -m "chore(deps): update react to latest version"

# Multi-line commit message
git commit -m "feat(auth): implement OAuth2 integration

- Add Google OAuth provider
- Add GitHub OAuth provider
- Update authentication middleware
- Add OAuth configuration documentation

Closes #123"
```

## Monorepo Integration

### **Turbo Integration**

```json
// turbo.json
{
  "tasks": {
    "lint": {
      "outputs": [],
      "inputs": ["src/**", "package.json", "eslint.config.*"],
      "cache": true
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": [],
      "inputs": ["src/**", "types/**", "package.json", "tsconfig.json"],
      "cache": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "inputs": ["src/**", "test/**", "package.json", "vitest.config.*"],
      "cache": true
    }
  }
}
```

### **Package-specific Hooks**

```bash
# .husky/pre-commit (monorepo-optimized)
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit hooks..."

# Get changed files
CHANGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | tr '\n' ' ')

if [ -z "$CHANGED_FILES" ]; then
  echo "ℹ️ No files to check"
  exit 0
fi

# Run lint-staged on changed files
echo "📝 Running lint-staged..."
npx lint-staged

# Run type-check only on packages with TypeScript changes
if echo "$CHANGED_FILES" | grep -q "\.ts$\|\.tsx$"; then
  echo "🔧 Running TypeScript type checking..."
  npx turbo run type-check --filter="*"
fi

# Run tests only on packages with test file changes
if echo "$CHANGED_FILES" | grep -q "\.test\.\|\.spec\."; then
  echo "🧪 Running tests on affected packages..."
  npx turbo run test --filter="*"
fi

echo "✅ Pre-commit checks completed!"
```

### **Workspace Hooks**

```bash
# .husky/pre-push (workspace-aware)
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🚀 Running pre-push hooks..."

# Get current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Skip hooks for certain branches
if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "develop" ]; then
  echo "⚠️ Skipping pre-push hooks for $BRANCH branch"
  exit 0
fi

# Run full test suite for feature branches
echo "🧪 Running full test suite..."
npx turbo run test

# Check build process
echo "🏗️ Running build validation..."
npx turbo run build

echo "✅ Pre-push checks completed!"
```

## Advanced Configuration

### **Conditional Hooks**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Skip hooks for certain conditions
SKIP_HUSKY=${SKIP_HUSKY:-0}
if [ "$SKIP_HUSKY" = "1" ]; then
  echo "⚠️ Skipping Husky hooks (SKIP_HUSKY=1)"
  exit 0
fi

# Run hooks only for specific file types
CHANGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if ! echo "$CHANGED_FILES" | grep -q "\.ts$\|\.tsx$\|\.js$\|\.jsx$"; then
  echo "ℹ️ No TypeScript/JavaScript files changed"
  exit 0
fi

# Run hooks
echo "🔍 Running hooks for TypeScript/JavaScript changes..."
npx lint-staged
```

### **Parallel Execution**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit hooks in parallel..."

# Run multiple commands in parallel
(
  echo "📝 Running lint-staged..." &&
  npx lint-staged
) &
(
  echo "🔧 Running type checking..." &&
  npx turbo run type-check --filter="*"
) &
(
  echo "🧪 Running tests..." &&
  npx turbo run test --filter="*" -- --passWithNoTests
) &

# Wait for all background jobs to complete
wait

echo "✅ All pre-commit checks completed!"
```

### **Custom Hook Scripts**

```bash
#!/usr/bin/env sh
# .husky/check-secrets

echo "🔒 Checking for potential secrets..."

# Check for common secret patterns
if git diff --cached --name-only | xargs grep -l "password\|secret\|token\|key\|api" 2>/dev/null; then
  echo "❌ Potential secrets found in staged files!"
  echo "Please review and remove any sensitive information before committing."
  exit 1
fi

echo "✅ No secrets detected"
```

```bash
#!/usr/bin/env sh
# .husky/check-file-sizes

echo "📏 Checking file sizes..."

# Check for large files
LARGE_FILES=$(git diff --cached --name-only | xargs -I {} find {} -size +5M 2>/dev/null)

if [ -n "$LARGE_FILES" ]; then
  echo "❌ Large files detected:"
  echo "$LARGE_FILES"
  echo "Please compress or remove large files before committing."
  exit 1
fi

echo "✅ File size check passed"
```

## Best Practices

### **Hook Organization**

1. **Modular Hooks**: Keep individual hooks focused and simple
2. **Error Handling**: Proper error handling and exit codes
3. **Performance**: Optimize hooks for fast execution
4. **Feedback**: Provide clear feedback to developers

### **Hook Performance**

```bash
# Use caching for expensive operations
if [ ! -f ".husky/cache/node_modules" ] || [ "package.json" -nt ".husky/cache/node_modules" ]; then
  echo "📦 Installing dependencies..."
  pnpm install
  touch ".husky/cache/node_modules"
fi

# Use file modification times for optimization
if [ "src/" -nt ".husky/cache/last-lint" ]; then
  echo "📝 Running linter..."
  npx eslint src/
  touch ".husky/cache/last-lint"
fi
```

### **Developer Experience**

```bash
# Provide helpful error messages
if ! npx turbo run type-check; then
  echo ""
  echo "❌ TypeScript type checking failed!"
  echo "💡 Run 'pnpm run type-check' to see detailed errors"
  echo "💡 Run 'pnpm run type-check --fix' to attempt auto-fix"
  exit 1
fi

# Show progress indicators
echo "🔍 Running pre-commit checks..."
echo "  📝 Linting files..."
npx lint-staged
echo "  🔧 Type checking..."
npx turbo run type-check --filter="*"
echo "  🧪 Running tests..."
npx turbo run test --filter="*"
```

## Troubleshooting

### **Common Issues**

#### **Hook Not Executing**
```bash
# Check if hooks are installed
ls -la .git/hooks/

# Reinstall hooks
npx husky install

# Check hook permissions
chmod +x .husky/pre-commit
```

#### **Hook Failing Silently**
```bash
# Debug hook execution
cd .husky
./pre-commit

# Check for shell errors
bash -x .husky/pre-commit
```

#### **Performance Issues**
```bash
# Profile hook execution
time .husky/pre-commit

# Check for infinite loops
ps aux | grep husky
```

### **Debugging Tools**

```bash
# Enable verbose output
HUSKY_DEBUG=1 git commit -m "test commit"

# Skip hooks temporarily
SKIP_HUSKY=1 git commit -m "test commit"

# Test individual hooks
.husky/pre-commit
```

### **Hook Recovery**

```bash
# Reset hooks to default
rm -rf .git/hooks
npx husky install

# Manual hook installation
cp .husky/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

## Migration Guide

### **From Husky 4 to 9**

Key changes in Husky 9:

1. **Install Command**: Use `husky install` instead of automatic installation
2. **Prepare Script**: Add prepare script to package.json
3. **Hook Location**: Hooks are now in `.husky/` directory
4. **Configuration**: New configuration options and environment variables

```bash
# Old way (Husky 4)
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  }
}

# New way (Husky 9)
npx husky add .husky/pre-commit "lint-staged"
```

### **From Lint-staged 10 to 15**

```javascript
// Old way
{
  "lint-staged": {
    "*.js": "eslint --fix"
  }
}

// New way (lint-staged 15+)
export default {
  "*.js": ["eslint --fix"]
};
```

## Integration with Other Tools

### **GitHub Actions**

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run linting
        run: pnpm lint
      
      - name: Run type checking
        run: pnpm type-check
      
      - name: Run tests
        run: pnpm test
```

### **VS Code Integration**

```json
// .vscode/settings.json
{
  "git.enableSmartCommit": true,
  "git.postCommitCommand": "none",
  "git.autofetch": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  }
}
```

### **Pre-commit Integration**

```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: husky-pre-commit
        name: Husky pre-commit
        entry: .husky/pre-commit
        language: script
        pass_filenames: false
        always_run: true
```

## Security Considerations

### **Hook Security**

```bash
# Validate hook integrity
if [ -f ".husky/pre-commit" ]; then
  # Check for suspicious content
  if grep -q "curl\|wget\|nc\|bash -c" .husky/pre-commit; then
    echo "❌ Suspicious content detected in pre-commit hook"
    exit 1
  fi
fi

# Use absolute paths
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
```

### **Environment Variables**

```bash
# Secure environment variable handling
if [ -n "$SECRET_KEY" ]; then
  echo "⚠️ SECRET_KEY detected in environment"
  echo "Please unset sensitive environment variables before committing"
  exit 1
fi
```

## Resources

### **Official Documentation**
- [Husky Official Docs](https://typicode.github.io/husky/)
- [Lint-staged Docs](https://github.com/okonet/lint-staged)
- [Commitlint Docs](https://commitlint.js.org/)

### **Community Resources**
- [Husky Examples](https://github.com/typicode/husky/tree/main/examples)
- [Git Hooks Guide](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [Conventional Commits](https://www.conventionalcommits.org/)

### **Tools and Extensions**
- [Pre-commit Framework](https://pre-commit.com/)
- [Commitizen](https://github.com/commitizen/cz-cli)
- [Git Hooks Manager](https://github.com/evilmartians/lefthook)
