#!/usr/bin/env node

/**
 * Marketing Agency Monorepo - Policy Checker
 * ==========================================
 *
 * This tool enforces architectural policies and governance rules
 * across the marketing agency monorepo. It validates:
 *
 * 1. Package boundary compliance
 * 2. Dependency rules enforcement
 * 3. Code ownership patterns
 * 4. Security policy compliance
 * 5. Architecture conformance
 * 6. Documentation requirements
 *
 * Usage:
 *   node tools/governance/policy-checker.js
 *   node tools/governance/policy-checker.js --check-dependencies
 *   node tools/governance/policy-checker.js --check-ownership
 *   node tools/governance/policy-checker.js --check-security
 *   node tools/governance/policy-checker.js --fix
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  // Package boundary rules
  packageBoundaries: {
    'packages/ui-components/': {
      canDependOn: ['@agency/design-system', '@agency/types', '@agency/shared'],
      forbidden: ['apps/*', 'packages/database', 'packages/platform/*'],
    },
    'packages/design-system/': {
      canDependOn: ['@agency/types'],
      forbidden: ['apps/*'],
    },
    'packages/platform/database/': {
      canDependOn: ['@agency/types'],
      forbidden: ['apps/*', 'packages/ui-components'],
    },
    'packages/platform/auth/': {
      canDependOn: ['@agency/types', '@agency/platform/database'],
      forbidden: ['apps/*', 'packages/ui-components'],
    },
    'packages/analytics/': {
      canDependOn: ['@agency/types', '@agency/platform/database'],
      forbidden: ['apps/*', 'packages/ui-components', 'packages/design-system'],
    },
    'packages/shared/seo/': {
      canDependOn: ['@agency/types'],
      forbidden: ['apps/*', 'packages/platform/database'],
    },
  },

  // Security policies
  securityPolicies: {
    forbiddenPatterns: [
      /password\s*=\s*['"]\w+['"]/i,
      /api[_-]?key\s*=\s*['"]\w+['"]/i,
      /secret[_-]?key\s*=\s*['"]\w+['"]/i,
      /token\s*=\s*['"]\w{20,}['"]/i,
      /private[_-]?key\s*=\s*['"]/i,
    ],
    requiredFiles: ['.gitignore', '.env.example', 'eslint.config.js', '.prettierrc'],
    sensitiveFilePatterns: ['**/*.pem', '**/*.key', '**/*.p12', '**/secrets/**', '**/.aws/**'],
  },

  // Architecture policies
  architecturePolicies: {
    requiredDirectories: ['apps/', 'packages/', 'tools/', 'docs/', 'e2e/'],
    forbiddenImports: {
      // Apps shouldn't import from other apps directly
      'apps/': ['apps/*'],
      // Platform packages shouldn't depend on UI packages
      'packages/platform/': ['packages/ui-components', 'packages/design-system'],
      // UI components shouldn't import database directly
      'packages/ui-components/': ['packages/platform/database'],
    },
  },

  // Documentation policies
  documentationPolicies: {
    requiredFiles: {
      'packages/': ['README.md', 'package.json'],
      'apps/': ['README.md', 'package.json'],
      'tools/': ['README.md'],
    },
    readmeSections: ['## Description', '## Usage', '## Development'],
  },
};

class PolicyChecker {
  constructor(options = {}) {
    this.options = {
      checkDependencies: options['check-dependencies'] || false,
      checkOwnership: options['check-ownership'] || false,
      checkSecurity: options['check-security'] || false,
      fix: options.fix || false,
      verbose: options.verbose || false,
      ...options,
    };

    this.violations = [];
    this.fixes = [];
  }

  // Main execution method
  async run() {
    console.log('🔍 Marketing Agency Monorepo - Policy Checker\n');

    try {
      // Run all checks or specific ones based on options
      if (
        this.options.checkDependencies ||
        (!this.options.checkOwnership && !this.options.checkSecurity)
      ) {
        await this.checkPackageBoundaries();
      }

      if (
        this.options.checkSecurity ||
        (!this.options.checkDependencies && !this.options.checkOwnership)
      ) {
        await this.checkSecurityPolicies();
      }

      if (
        this.options.checkOwnership ||
        (!this.options.checkDependencies && !this.options.checkSecurity)
      ) {
        await this.checkCodeOwnership();
      }

      await this.checkArchitecturePolicies();
      await this.checkDocumentationPolicies();

      // Apply fixes if requested
      if (this.options.fix && this.fixes.length > 0) {
        await this.applyFixes();
      }

      // Report results
      this.reportResults();

      // Exit with appropriate code
      process.exit(this.violations.length > 0 ? 1 : 0);
    } catch (error) {
      console.error('❌ Policy checker failed:', error.message);
      process.exit(1);
    }
  }

  // Check package boundary compliance
  async checkPackageBoundaries() {
    console.log('📦 Checking package boundaries...');

    const ignorePatterns = ['**/node_modules/**', '**/dist/**', '**/build/**'];
    const packageDirs = globSync('packages/**/package.json', { cwd: process.cwd(), ignore: ignorePatterns });
    const appDirs = globSync('apps/**/package.json', { cwd: process.cwd(), ignore: ignorePatterns });

    for (const packageFile of [...packageDirs, ...appDirs]) {
      const packageDir = path.dirname(packageFile);
      const packageJson = JSON.parse(fs.readFileSync(packageFile, 'utf8'));

      // Check dependencies
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
        ...packageJson.peerDependencies,
      };

      for (const dep of Object.keys(allDeps)) {
        const violation = this.checkDependencyRule(packageDir, dep);
        if (violation) {
          this.violations.push(violation);
        }
      }
    }
  }

  checkDependencyRule(packageDir, dependency) {
    // Normalize paths for matching
    const normalizedDir = packageDir.replace(/\\/g, '/');

    for (const [pattern, rules] of Object.entries(CONFIG.packageBoundaries)) {
      if (normalizedDir.startsWith(pattern.replace('*/', ''))) {
        // Check forbidden dependencies
        for (const forbidden of rules.forbidden) {
          if (this.matchesPattern(dependency, forbidden)) {
            return {
              type: 'package-boundary',
              severity: 'error',
              package: packageDir,
              dependency,
              rule: `Cannot depend on ${forbidden}`,
              description: `Package ${packageDir} violates boundary rule by depending on ${dependency}`,
            };
          }
        }

        // Check allowed dependencies (if specified)
        if (rules.canDependOn.length > 0) {
          const allowed = rules.canDependOn.some((allowed) =>
            this.matchesPattern(dependency, allowed)
          );

          if (
            !allowed &&
            !dependency.startsWith('@types/') &&
            !dependency.startsWith('@testing-library/')
          ) {
            return {
              type: 'package-boundary',
              severity: 'warning',
              package: packageDir,
              dependency,
              rule: `Can only depend on: ${rules.canDependOn.join(', ')}`,
              description: `Package ${packageDir} has non-whitelisted dependency: ${dependency}`,
            };
          }
        }
      }
    }

    return null;
  }

  // Check security policies
  async checkSecurityPolicies() {
    console.log('🔒 Checking security policies...');

    // Check for required files
    for (const requiredFile of CONFIG.securityPolicies.requiredFiles) {
      if (!fs.existsSync(requiredFile)) {
        this.violations.push({
          type: 'security',
          severity: 'error',
          file: requiredFile,
          rule: 'Required security file missing',
          description: `Security policy requires ${requiredFile}`,
        });
      }
    }

    // Check for sensitive files in git
    if (fs.existsSync('.gitignore')) {
      const gitignore = fs.readFileSync('.gitignore', 'utf8');

      for (const pattern of CONFIG.securityPolicies.sensitiveFilePatterns) {
        if (!gitignore.includes(pattern.replace('**/', ''))) {
          this.violations.push({
            type: 'security',
            severity: 'error',
            pattern,
            rule: 'Sensitive files not excluded from git',
            description: `Pattern ${pattern} should be in .gitignore`,
          });

          this.fixes.push({
            type: 'gitignore',
            action: 'add',
            content: `\n# Security - Exclude sensitive files\n${pattern}`,
            description: `Add ${pattern} to .gitignore`,
          });
        }
      }
    }

    // Check for hardcoded secrets in source files
    const sourceFiles = globSync('**/*.{js,ts,tsx,json,yaml,yml}', {
      cwd: process.cwd(),
      ignore: ['node_modules/**', '.git/**', 'dist/**', 'build/**', '.turbo/**'],
    });

    for (const file of sourceFiles) {
      const content = fs.readFileSync(file, 'utf8');

      for (const pattern of CONFIG.securityPolicies.forbiddenPatterns) {
        if (pattern.test(content)) {
          this.violations.push({
            type: 'security',
            severity: 'error',
            file,
            rule: 'Potential hardcoded secret detected',
            description: `Pattern ${pattern} found in ${file}`,
          });
        }
      }
    }
  }

  // Check code ownership patterns
  async checkCodeOwnership() {
    console.log('👥 Checking code ownership...');

    // Verify CODEOWNERS file exists
    const codeownersPath = 'governance/CODEOWNERS';
    if (!fs.existsSync(codeownersPath)) {
      this.violations.push({
        type: 'ownership',
        severity: 'error',
        file: codeownersPath,
        rule: 'CODEOWNERS file required',
        description: 'Governance policy requires CODEOWNERS file',
      });
      return;
    }

    // Check CODEOWNERS file structure
    const codeownersContent = fs.readFileSync(codeownersPath, 'utf8');
    const lines = codeownersContent
      .split('\n')
      .filter((line) => line.trim() && !line.startsWith('#'));

    if (lines.length === 0) {
      this.violations.push({
        type: 'ownership',
        severity: 'warning',
        file: codeownersPath,
        rule: 'CODEOWNERS has no rules',
        description: 'CODEOWNERS file should define ownership rules',
      });
    }

    // Verify important directories are covered
    const importantDirs = ['apps/', 'packages/', 'tools/', 'docs/'];
    const coveredPaths = lines
      .map((line) => line.split(/\s+/)[0])
      .filter((path) => path && !path.startsWith('@'));

    for (const dir of importantDirs) {
      const covered = coveredPaths.some((path) => path.startsWith(dir) || path === dir);
      if (!covered) {
        this.violations.push({
          type: 'ownership',
          severity: 'warning',
          path: dir,
          rule: 'Uncovered directory',
          description: `Directory ${dir} is not covered by CODEOWNERS rules`,
        });
      }
    }
  }

  // Check architecture policies
  async checkArchitecturePolicies() {
    console.log('🏗️ Checking architecture policies...');

    // Check required directories
    for (const dir of CONFIG.architecturePolicies.requiredDirectories) {
      if (!fs.existsSync(dir)) {
        this.violations.push({
          type: 'architecture',
          severity: 'error',
          path: dir,
          rule: 'Required directory missing',
          description: `Architecture requires ${dir} directory`,
        });
      }
    }

    // Check forbidden import patterns
    const sourceFiles = globSync('**/*.{js,ts,tsx}', {
      cwd: process.cwd(),
      ignore: ['node_modules/**', '.git/**', 'dist/**', 'build/**', '.turbo/**'],
    });

    for (const file of sourceFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const normalizedFile = file.replace(/\\/g, '/');

      for (const [sourcePattern, forbiddenImports] of Object.entries(
        CONFIG.architecturePolicies.forbiddenImports
      )) {
        if (normalizedFile.startsWith(sourcePattern.replace('*/', ''))) {
          for (const forbiddenImport of forbiddenImports) {
            const importPattern = new RegExp(
              `import.*from\\s+['"]${forbiddenImport.replace('*', '.*')}['"]`
            );
            if (importPattern.test(content)) {
              this.violations.push({
                type: 'architecture',
                severity: 'error',
                file,
                rule: 'Forbidden import pattern',
                description: `Cannot import ${forbiddenImport} in ${sourcePattern}`,
              });
            }
          }
        }
      }
    }
  }

  // Check documentation policies
  async checkDocumentationPolicies() {
    console.log('📚 Checking documentation policies...');

    for (const [dirPattern, requiredFiles] of Object.entries(
      CONFIG.documentationPolicies.requiredFiles
    )) {
      const dirs = globSync(dirPattern, { cwd: process.cwd() });

      for (const dir of dirs) {
        for (const requiredFile of requiredFiles) {
          const filePath = path.join(dir, requiredFile);
          if (!fs.existsSync(filePath)) {
            this.violations.push({
              type: 'documentation',
              severity: 'warning',
              file: filePath,
              rule: 'Required documentation missing',
              description: `${dir} requires ${requiredFile}`,
            });
          }
        }

        // Check README sections if it exists
        const readmePath = path.join(dir, 'README.md');
        if (fs.existsSync(readmePath)) {
          const readmeContent = fs.readFileSync(readmePath, 'utf8');

          for (const section of CONFIG.documentationPolicies.readmeSections) {
            if (!readmeContent.includes(section)) {
              this.violations.push({
                type: 'documentation',
                severity: 'info',
                file: readmePath,
                rule: 'Missing README section',
                description: `README should include ${section}`,
              });
            }
          }
        }
      }
    }
  }

  // Apply automatic fixes
  async applyFixes() {
    console.log('🔧 Applying automatic fixes...');

    for (const fix of this.fixes) {
      try {
        switch (fix.type) {
          case 'gitignore':
            if (fs.existsSync('.gitignore')) {
              fs.appendFileSync('.gitignore', fix.content);
              console.log(`✅ Added ${fix.description}`);
            }
            break;

          // Add more fix types as needed
        }
      } catch (error) {
        console.error(`❌ Failed to apply fix: ${fix.description}`, error.message);
      }
    }
  }

  // Report results
  reportResults() {
    console.log('\n📊 Policy Check Results\n');

    // Group violations by type and severity
    const grouped = this.violations.reduce((acc, violation) => {
      const key = `${violation.type}-${violation.severity}`;
      acc[key] = acc[key] || [];
      acc[key].push(violation);
      return acc;
    }, {});

    // Report violations
    if (this.violations.length === 0) {
      console.log('✅ No policy violations found!\n');
    } else {
      console.log(`❌ Found ${this.violations.length} policy violations:\n`);

      for (const [key, violations] of Object.entries(grouped)) {
        const [type, severity] = key.split('-');
        const icon = severity === 'error' ? '🚨' : severity === 'warning' ? '⚠️' : 'ℹ️';

        console.log(`${icon} ${type.toUpperCase()} (${severity}): ${violations.length} issues`);

        for (const violation of violations) {
          console.log(`   • ${violation.description}`);
          if (violation.file) console.log(`     File: ${violation.file}`);
          if (violation.package) console.log(`     Package: ${violation.package}`);
          if (violation.rule) console.log(`     Rule: ${violation.rule}`);
        }
        console.log('');
      }
    }

    // Report fixes
    if (this.fixes.length > 0 && !this.options.fix) {
      console.log(`🔧 ${this.fixes.length} automatic fixes available. Run with --fix to apply.\n`);
    }

    // Summary
    const errorCount = this.violations.filter((v) => v.severity === 'error').length;
    const warningCount = this.violations.filter((v) => v.severity === 'warning').length;
    const infoCount = this.violations.filter((v) => v.severity === 'info').length;

    console.log('📈 Summary:');
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Warnings: ${warningCount}`);
    console.log(`   Info: ${infoCount}`);
    console.log(`   Total: ${this.violations.length}`);

    if (errorCount > 0) {
      console.log('\n🚨 Policy check failed due to errors. Fix issues and try again.');
    }
  }

  // Helper method to match patterns
  matchesPattern(dependency, pattern) {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace('*', '.*'));
      return regex.test(dependency);
    }
    return dependency === pattern;
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const options = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      if (
        key === 'check-dependencies' ||
        key === 'check-ownership' ||
        key === 'check-security' ||
        key === 'fix' ||
        key === 'verbose'
      ) {
        options[key] = true;
      }
    }
  }

  const checker = new PolicyChecker(options);
  await checker.run();
}

// Export for testing
export { PolicyChecker, CONFIG };

// Run if called directly
if (__filename === path.resolve(process.argv[1])) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
