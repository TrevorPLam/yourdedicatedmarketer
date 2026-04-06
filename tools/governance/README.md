# Marketing Agency Monorepo - Governance Tools

This directory contains governance and policy enforcement tools for the
marketing agency monorepo. These tools ensure architectural compliance, security
standards, and code ownership patterns across the entire repository.

## 🎯 Purpose

The governance framework provides:

- **Automated Policy Enforcement**: Ensure architectural rules are followed
- **Code Ownership Management**: Clear ownership patterns via CODEOWNERS
- **Security Compliance**: Automated security policy validation
- **Boundary Protection**: Package dependency and architectural layer
  enforcement
- **Quality Gates**: Automated compliance scoring and reporting

## 🛠️ Tools

### 1. Policy Checker (`policy-checker.js`)

Comprehensive policy validation tool that enforces monorepo-wide rules and
standards.

#### Policy Checker Features

- Package boundary compliance checking
- Security policy enforcement
- Code ownership validation
- Architecture conformance checking
- Documentation requirements validation
- Automatic fixes for common issues

#### Policy Checker Usage

```bash
# Run all checks
node tools/governance/policy-checker.js

# Run specific checks
node tools/governance/policy-checker.js --check-dependencies
node tools/governance/policy-checker.js --check-ownership
node tools/governance/policy-checker.js --check-security

# Apply automatic fixes
node tools/governance/policy-checker.js --fix

# Verbose output
node tools/governance/policy-checker.js --verbose
```

#### Policy Categories

##### Package Boundaries

- Validates dependencies between packages
- Enforces architectural layer rules
- Prevents forbidden import patterns

##### Security Policies

- Detects hardcoded secrets and API keys
- Validates required security files
- Ensures sensitive files are excluded from git

##### Code Ownership

- Validates CODEOWNERS file coverage
- Ensures all important directories have owners
- Checks ownership rule completeness

##### Architecture Policies

- Validates required directory structure
- Enforces layer-based architecture
- Checks forbidden import patterns

##### Documentation Policies

- Ensures required documentation exists
- Validates README file sections
- Checks documentation completeness

### 2. Boundary Enforcer (`boundary-enforcer.js`)

Advanced architectural boundary enforcement with dependency graph analysis.

#### Boundary Enforcer Features

- Dependency graph construction and analysis
- Circular dependency detection
- Architectural layer violation checking
- Package boundary rule enforcement
- Compliance scoring and grading
- Dependency graph visualization

#### Boundary Enforcer Usage

```bash
# Run boundary enforcement
node tools/governance/boundary-enforcer.js

# Generate dependency graph
node tools/governance/boundary-enforcer.js --graph

# Check for circular dependencies
node tools/governance/boundary-enforcer.js --check-circular

# Show compliance score
node tools/governance/boundary-enforcer.js --score

# Verbose output
node tools/governance/boundary-enforcer.js --verbose
```

#### Architectural Layers

The monorepo follows a layered architecture:

1. **Application Layer** (`apps/`)
   - Can depend on: Domain, Platform, Shared
   - Contains: Agency website, client sites, internal tools

2. **Domain Layer** (`packages/ui-components`, `packages/design-system`)
   - Can depend on: Platform, Shared
   - Contains: UI components, design system

3. **Platform Layer** (`packages/platform/`, `packages/types`)
   - Can depend on: Shared
   - Contains: Database adapters, auth, types

4. **Shared Layer** (`packages/shared/`)
   - Can depend on: None
   - Contains: Analytics, SEO, monitoring utilities

## 📋 Configuration

### CODEOWNERS File

The `governance/CODEOWNERS` file defines code ownership rules:

```bash
# Core platform team
/packages/platform/ @agency/core

# Frontend team
/packages/ui-components/ @agency/frontend
/packages/design-system/ @agency/frontend

# Backend team
/apps/internal-tools/ @agency/backend

# Default fallback
* @agency/core
```

### Policy Configuration

Policy rules are defined in the tool configuration sections:

```javascript
const CONFIG = {
  packageBoundaries: {
    'packages/ui-components': {
      canDependOn: ['@agency/design-system', '@agency/types'],
      forbidden: ['apps/*', 'packages/database'],
    },
  },
  securityPolicies: {
    forbiddenPatterns: [/password\s*=\s*['"]\w+['"]/i],
    requiredFiles: ['.gitignore', '.env.example'],
  },
};
```

## 🔧 Integration with CI/CD

### GitHub Actions Integration

Add to your CI workflow:

```yaml
name: Governance Checks
on: [pull_request, push]

jobs:
  governance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install dependencies
        run: pnpm install

      - name: Run policy checks
        run: node tools/governance/policy-checker.js

      - name: Run boundary enforcement
        run: node tools/governance/boundary-enforcer.js --score
```

### Pre-commit Hooks

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run governance checks
echo "🔍 Running governance checks..."
node tools/governance/policy-checker.js

# Run boundary enforcement
echo "🏗️ Running boundary enforcement..."
node tools/governance/boundary-enforcer.js
```

## 📊 Compliance Scoring

The boundary enforcer provides a compliance score (0-100) based on:

- **Base Score**: 100 points

- **Violations**: -10 points per violation

- **Circular Dependencies**: -20 points per cycle

- **Grade Assignment**:
  - A: 90-100%
  - B: 80-89%
  - C: 70-79%
  - D: 60-69%
  - F: 0-59%

## 🚨 Violation Types

### Error Level (Must Fix)

- Package boundary violations
- Circular dependencies
- Security policy violations
- Required file missing

### Warning Level (Should Fix)

- Non-whitelisted dependencies
- Missing documentation
- Suspicious layer dependencies

### Info Level (Nice to Have)

- Missing README sections
- Uncovered directories in CODEOWNERS

## 🔄 Workflow Integration

### Development Workflow

1. **Before Committing**: Run local checks

   ```bash
   node tools/governance/policy-checker.js
   node tools/governance/boundary-enforcer.js
   ```

2. **During PR**: Automated checks run in CI
3. **Before Merge**: All violations must be resolved

### Onboarding New Developers

1. Review the `governance/CODEOWNERS` file
2. Understand the architectural layers
3. Run governance tools locally
4. Review violation types and fixes

## 📈 Monitoring and Reporting

### Regular Reports

Generate compliance reports:

```bash
# Full compliance report
node tools/governance/boundary-enforcer.js --score --verbose

# Dependency graph visualization
node tools/governance/boundary-enforcer.js --graph

# Security audit
node tools/governance/policy-checker.js --check-security
```

### Metrics to Track

- Compliance score over time
- Number of violations per type
- Time to resolve violations
- Frequency of circular dependencies

## 🛠️ Maintenance

### Updating Policies

1. Modify configuration in tool files

2. Test with sample violations

3. Update documentation

4. Communicate changes to teams

### Adding New Rules

1. Define rule in configuration

2. Add validation logic

3. Write tests for the rule

4. Update documentation

## 🆘 Troubleshooting

### Common Issues

#### False Positives

- Review rule configuration
- Update patterns to be more specific
- Add exceptions where appropriate

#### Performance Issues

- Use specific check flags instead of full checks
- Exclude large directories from patterns
- Cache dependency graph results

#### CI Failures

- Check Node.js version compatibility
- Verify all dependencies are installed
- Review file permissions

### Getting Help

1. Check this README first
2. Review the CODEOWNERS file for ownership questions
3. Contact the @agency/core team for policy questions
4. Create an issue for tool bugs or improvements

## 📝 Development

### Running Tests

```bash
# Install dependencies
cd tools/governance
pnpm install

# Run tests
pnpm test

# Run with coverage
pnpm test:coverage
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all governance checks pass
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file in repository root.

---

**Maintained by**: @agency/core  
**Last Updated**: 2026-04-05  
**Version**: 1.0.0
