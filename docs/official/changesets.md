# Changesets Documentation

**Repository Version:** ^3.27.0  
**Official Documentation:** https://github.com/changesets/changesets  
**Latest Release:** April 2026

## Overview

Changesets is a tool for managing versioning and publishing packages in monorepos. It helps teams collaborate on version changes, automatically generates changelogs, and publishes packages to npm with minimal friction.

In this monorepo, Changesets serves as the core of our release management workflow, enabling coordinated version bumps across packages, automated changelog generation, and seamless publishing to npm.

## Key Features

### **Version Management**
- **Coordinated Releases**: Version multiple packages together
- **Semantic Versioning**: Automatic semver compliance
- **Dependency Updates**: Update dependent packages automatically
- **Version Bumps**: Patch, minor, and major version control

### **Changelog Generation**
- **Automatic Changelogs**: Generate changelogs from changeset content
- **Commit Integration**: Link changelogs to specific commits
- **Customizable Templates**: Tailor changelog format to your needs
- **Release Notes**: Generate comprehensive release notes

### **Publishing Automation**
- **npm Publishing**: Automated package publishing to npm
- **Pre-release Tags**: Support for alpha, beta, and rc releases
- **Publish Validation**: Ensure packages are publish-ready
- **Rollback Support**: Handle publishing failures gracefully

## Installation

### Core Dependencies

```bash
# Install Changesets CLI
pnpm add -D @changesets/cli@^3.27.0

# Install changelog generator
pnpm add -D @changesets/changelog-github@^0.5.0

# Install CLI tools
pnpm add -D @changesets/get-dependents-graph@^2.1.3
pnpm add -D @changesets/get-version-range-type@^0.4.0
```

### Configuration Files

#### **Changeset Configuration**

```json
// .changeset/config.json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [
    ["@agency/ui-components", "@agency/design-system"],
    ["@agency/analytics", "@agency/monitoring"]
  ],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

#### **Package.json Scripts**

```json
{
  "scripts": {
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "turbo run build --filter=!@agency/docs && changeset publish",
    "release:beta": "changeset pre enter beta && pnpm release && changeset pre exit",
    "release:alpha": "changeset pre enter alpha && pnpm release && changeset pre exit"
  },
  "devDependencies": {
    "@changesets/cli": "^3.27.0",
    "@changesets/changelog-github": "^0.5.0"
  }
}
```

## Workflow Overview

### **Development Workflow**

1. **Make Changes**: Develop features and fix bugs
2. **Add Changeset**: Document changes with `pnpm changeset`
3. **Submit PR**: Create pull request with changeset files
4. **Review & Merge**: Team reviews and merges changes
5. **Version Bump**: Run `pnpm version-packages`
6. **Publish**: Run `pnpm release`

### **Changeset Creation**

```bash
# Interactive changeset creation
pnpm changeset

# Add changeset for specific packages
pnpm changeset add

# List all changesets
pnpm changeset list

# Status of changesets
pnpm changeset status
```

### **Version Management**

```bash
# Apply changesets and bump versions
pnpm version-packages

# Version specific packages
pnpm changeset version --packages @agency/ui-components

# Dry run versioning
pnpm changeset version --dry-run

# Version with specific commit message
pnpm changeset version --message "chore: release versions"
```

### **Publishing**

```bash
# Publish packages
pnpm release

# Publish with OTP (two-factor authentication)
pnpm release --otp 123456

# Publish to custom registry
pnpm release --registry https://registry.npmjs.org

# Dry run publishing
pnpm release --dry-run
```

## Changeset Format

### **Changeset File Structure**

```markdown
---
"@agency/ui-components": minor
"@agency/design-system": patch
---

Added new button component variants and updated design tokens.

### Breaking Changes

- Changed the default button size from `md` to `sm`
- Removed deprecated color prop

### New Features

- Added `loading` state to button component
- Added `variant="ghost"` button style
- Updated design tokens with new color palette

### Bug Fixes

- Fixed button focus outline in dark mode
- Resolved TypeScript type issues

### Dependencies

- Updated peer dependency on React to v19.2.0
- Added dependency on @agency/design-system v2.1.0
```

### **Changeset Types**

#### **Patch Changes**
```markdown
---
"@agency/ui-components": patch
---

Fixed button focus outline accessibility issue.
```

#### **Minor Changes**
```markdown
---
"@agency/ui-components": minor
---

Added new loading state to button component.
```

#### **Major Changes**
```markdown
---
"@agency/ui-components": major
---

BREAKING CHANGE: Removed deprecated color prop in favor of variant prop.
```

#### **Multiple Packages**
```markdown
---
"@agency/ui-components": minor
"@agency/design-system": patch
"@agency/analytics": minor
---

Updated button component and design tokens for better consistency.
```

## Configuration Options

### **Basic Configuration**

```json
{
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

### **Advanced Configuration**

```json
{
  "changelog": [
    "@changesets/changelog-github",
    { "repo": "your-org/your-repo" }
  ],
  "commit": {
    "message": "chore: release versions"
  },
  "fixed": [
    ["@agency/ui-components", "@agency/design-system"]
  ],
  "linked": [
    ["@agency/analytics", "@agency/monitoring"]
  ],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": [
    "@agency/internal-tool"
  ],
  "___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH": {
    "onlyUpdatePeerDependentsWhenOutOfRange": true
  }
}
```

### **Configuration Options Explained**

- **changelog**: Changelog generator function or array
- **commit**: Whether to commit version changes automatically
- **fixed**: Packages that should always version together
- **linked**: Packages that should version together when one changes
- **access**: Package access level (public or restricted)
- **baseBranch**: Base branch for version calculations
- **updateInternalDependencies**: How to update internal dependencies
- **ignore**: Packages to ignore during versioning

## Monorepo Integration

### **Turbo Integration**

```json
// turbo.json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "public/build/**"],
      "cache": true
    },
    "release": {
      "dependsOn": ["build"],
      "outputs": [],
      "cache": false
    },
    "version-packages": {
      "outputs": ["package.json", "CHANGELOG.md"],
      "cache": false
    }
  }
}
```

### **Workspace Configuration**

```json
// pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'tools/*'

catalog:
  # Changesets catalog version
  '@changesets/cli': '^3.27.0'
  '@changesets/changelog-github': '^0.5.0'
```

### **Package Scripts**

```json
// packages/ui-components/package.json
{
  "name": "@agency/ui-components",
  "version": "1.0.0",
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/your-repo.git",
    "directory": "packages/ui-components"
  }
}
```

## Advanced Workflows

### **Pre-release Workflow**

```bash
# Enter pre-release mode
pnpm changeset pre enter beta

# Add pre-release changesets
pnpm changeset

# Version and publish pre-release
pnpm version-packages
pnpm release

# Exit pre-release mode
pnpm changeset pre exit
```

### **Custom Changelog Generation**

```javascript
// .changeset/changelog.js
const { getInfo } = require('@changesets/get-github-info');
const { defaultChangelog } = require('@changesets/cli/changelog');

async function changelog(changesets, release) {
  const githubInfo = await getInfo({
    repo: 'your-org/your-repo',
    commit: release.commit,
  });

  return defaultChangelog(changesets, release, {
    changelog: githubInfo
      ? `## ${release.name}\n\n${githubInfo.user} released this ${release.name.replace(/^v/, '')} in ${githubInfo.linkedCommit?.hash}\n\n`
      : `## ${release.name}\n\n`,
    // ... other options
  });
}

module.exports = changelog;
```

### **Custom Release Script**

```javascript
// scripts/release.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function release() {
  try {
    // Build all packages
    console.log('🏗️ Building packages...');
    execSync('pnpm run build', { stdio: 'inherit' });

    // Version packages
    console.log('📝 Versioning packages...');
    execSync('pnpm version-packages', { stdio: 'inherit' });

    // Publish packages
    console.log('📦 Publishing packages...');
    execSync('pnpm release', { stdio: 'inherit' });

    console.log('✅ Release completed successfully!');
  } catch (error) {
    console.error('❌ Release failed:', error.message);
    process.exit(1);
  }
}

release();
```

### **GitHub Actions Integration**

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build packages
        run: pnpm run build

      - name: Create Release Pull Request or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          publish: pnpm release
          commit: 'chore: release versions'
          title: 'chore: release versions'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Create GitHub Release
        if: steps.changesets.outputs.published === 'true'
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ steps.changesets.outputs.publishedPackages[0].version }}
          release_name: Release v${{ steps.changesets.outputs.publishedPackages[0].version }}
          body: ${{ steps.changesets.outputs.generatedChangelog }}
          draft: false
          prerelease: false
```

## Best Practices

### **Changeset Management**

1. **Descriptive Changesets**: Write clear, detailed changeset descriptions
2. **Granular Changes**: Create separate changesets for unrelated changes
3. **Version Accuracy**: Choose appropriate version levels (patch/minor/major)
4. **Dependency Tracking**: Include dependency updates in changesets

### **Release Management**

1. **Regular Releases**: Release frequently to avoid large version jumps
2. **Testing**: Test packages thoroughly before publishing
3. **Changelog Review**: Review generated changelogs for accuracy
4. **Rollback Plan**: Have a plan for handling publishing failures

### **Team Collaboration**

1. **Changeset Reviews**: Review changesets in pull requests
2. **Release Coordination**: Coordinate releases with team members
3. **Documentation**: Document release process and conventions
4. **Communication**: Communicate upcoming releases to stakeholders

## Troubleshooting

### **Common Issues**

#### **Publishing Failures**
```bash
# Error: "Package not found"
# Solution: Check package name and registry configuration
npm view @agency/ui-components

# Error: "Authentication failed"
# Solution: Check npm token and permissions
npm whoami
```

#### **Version Conflicts**
```bash
# Error: "Version conflict"
# Solution: Check package dependencies and versions
pnpm ls @agency/ui-components

# Reset and retry
pnpm changeset pre exit
pnpm version-packages
```

#### **Changelog Issues**
```bash
# Error: "Changelog generation failed"
# Solution: Check changeset format and configuration
pnpm changeset list
```

### **Debugging Tools**

```bash
# Debug changeset processing
DEBUG=changesets:* pnpm version-packages

# Check changeset status
pnpm changeset status --verbose

# Validate configuration
pnpm changeset validate
```

### **Recovery Procedures**

```bash
# Reset to last known good state
git reset --hard HEAD~1

# Remove changeset files
rm .changeset/*.md

# Re-create changesets
pnpm changeset
```

## Migration Guide

### **From Manual Versioning**

```bash
# Old way (manual)
npm version patch
npm publish

# New way (Changesets)
pnpm changeset
pnpm version-packages
pnpm release
```

### **From Lerna**

```bash
# Old way (Lerna)
lerna version
lerna publish

# New way (Changesets)
pnpm changeset
pnpm version-packages
pnpm release
```

### **Configuration Migration**

```json
// Lerna.json (old)
{
  "version": "independent",
  "npmClient": "pnpm",
  "command": {
    "publish": {
      "conventionalCommits": true
    }
  }
}

// .changeset/config.json (new)
{
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch"
}
```

## Integration with Other Tools

### **Semantic Release**

```javascript
// semantic-release configuration
module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/github',
  ],
};
```

### **Conventional Commits**

```json
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'revert'],
    ],
  },
};
```

### **GitHub Integration**

```yaml
# .github/workflows/changesets.yml
name: Changesets
on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
      - run: pnpm install
      - uses: changesets/action@v1
        with:
          publish: pnpm release
          commit: 'chore: release versions'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Security Considerations

### **Token Management**

```bash
# Use environment variables for tokens
export NPM_TOKEN=your_npm_token
export GITHUB_TOKEN=your_github_token

# Use GitHub secrets in CI/CD
# NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
# GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### **Package Security**

```json
// package.json
{
  "publishConfig": {
    "access": "public"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "engines": {
    "node": ">=22.12.0"
  }
}
```

## Performance Optimization

### **Large Monorepo Optimization**

```json
// .changeset/config.json
{
  "___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH": {
    "onlyUpdatePeerDependentsWhenOutOfRange": true
  }
}
```

### **Build Optimization**

```bash
# Build only changed packages
pnpm build --filter="*"

# Use Turbo caching
pnpm turbo run build --filter="*"
```

## Resources

### **Official Documentation**
- [Changesets Official Docs](https://github.com/changesets/changesets)
- [Changesets CLI Reference](https://github.com/changesets/changesets/tree/main/packages/cli)
- [GitHub Action](https://github.com/changesets/action)

### **Community Resources**
- [Changesets Examples](https://github.com/changesets/changesets/tree/main/examples)
- [Monorepo Guide](https://github.com/changesets/changesets/blob/main/docs/monorepo.md)
- [Best Practices](https://github.com/changesets/changesets/blob/main/docs/best-practices.md)

### **Tools and Extensions**
- [Changesets Bot](https://github.com/changesets/changesets-bot)
- [Semantic Release](https://semantic-release.js.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
