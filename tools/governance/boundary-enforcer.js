#!/usr/bin/env node

/**
 * Marketing Agency Monorepo - Boundary Enforcer
 * ==============================================
 *
 * Advanced architectural boundary enforcement tool that validates
 * package dependencies and architectural rules across the monorepo.
 *
 * Features:
 * - Dependency graph analysis
 * - Circular dependency detection
 * - Layer violation detection
 * - Package boundary validation
 * - Import pattern enforcement
 * - Architecture compliance scoring
 *
 * Usage:
 *   node tools/governance/boundary-enforcer.js
 *   node tools/governance/boundary-enforcer.js --graph
 *   node tools/governance/boundary-enforcer.js --check-circular
 *   node tools/governance/boundary-enforcer.js --score
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Architectural layer definitions
const LAYERS = {
  application: {
    description: 'Application layer (apps/)',
    paths: ['apps/'],
    canDependOn: ['domain', 'platform', 'shared'],
    level: 3,
  },
  domain: {
    description: 'Domain layer (packages/ui-components, packages/design-system)',
    paths: ['packages/ui-components/', 'packages/design-system/'],
    canDependOn: ['platform', 'shared'],
    level: 2,
  },
  platform: {
    description: 'Platform layer (packages/platform/, packages/types/, packages/analytics/)',
    paths: ['packages/platform/', 'packages/types/', 'packages/analytics/'],
    canDependOn: ['shared'],
    level: 1,
  },
  shared: {
    description: 'Shared utilities (packages/shared/, packages/testing/)',
    paths: ['packages/shared/', 'packages/testing/'],
    canDependOn: [],
    level: 0,
  },
};

// Package boundary rules
const BOUNDARY_RULES = {
  // App-to-app dependencies are forbidden
  'apps/': {
    forbidden: ['apps/*'],
    reason: 'Applications should not depend on other applications directly',
  },

  // UI components restrictions
  'packages/ui-components/': {
    forbidden: ['packages/platform/*', 'apps/*'],
    allowed: ['@agency/design-system', '@agency/types', '@agency/shared/*'],
    reason: 'UI components should only depend on design system and types',
  },

  // Design system should be dependency-free
  'packages/design-system/': {
    forbidden: ['packages/*', 'apps/*'],
    allowed: [],
    reason: 'Design system should not depend on other packages',
  },

  // Platform packages restrictions
  'packages/platform/': {
    forbidden: ['packages/ui-components', 'packages/design-system', 'apps/*'],
    allowed: ['@agency/types', '@agency/shared/*'],
    reason: 'Platform packages should not depend on UI packages',
  },

  // Shared utilities should not depend on UI or application code
  'packages/shared/': {
    forbidden: ['packages/ui-components', 'packages/design-system', 'apps/*'],
    allowed: ['@agency/types', '@agency/platform/*'],
    reason: 'Shared utilities should not depend on UI or application code',
  },

  // Analytics package should not depend on UI packages or applications
  'packages/analytics/': {
    forbidden: ['packages/ui-components', 'packages/design-system', 'apps/*'],
    allowed: ['@agency/types', '@agency/shared/*'],
    reason: 'Analytics package should not depend on UI packages or applications',
  },

  // Testing utilities should not import application code directly
  'packages/testing/': {
    forbidden: ['apps/*'],
    allowed: [
      '@agency/types',
      '@agency/shared/*',
      '@agency/platform/*',
      '@agency/ui-components',
      '@agency/design-system',
    ],
    reason: 'Testing utilities should not import application code directly',
  },
};

class BoundaryEnforcer {
  constructor(options = {}) {
    this.options = {
      graph: options.graph || false,
      checkCircular: options['check-circular'] || false,
      score: options.score || false,
      verbose: options.verbose || false,
      ...options,
    };

    this.violations = [];
    this.dependencyGraph = new Map();
    this.circularDependencies = [];
    this.complianceScore = 0;
  }

  async run() {
    console.log('🏗️  Marketing Agency Monorepo - Boundary Enforcer\n');

    try {
      await this.buildDependencyGraph();

      if (this.options.checkCircular) {
        await this.checkCircularDependencies();
      }

      await this.checkBoundaryRules();
      await this.checkLayerViolations();
      await this.calculateComplianceScore();

      if (this.options.graph) {
        await this.generateDependencyGraph();
      }

      this.reportResults();

      process.exit(this.violations.length > 0 ? 1 : 0);
    } catch (error) {
      console.error('❌ Boundary enforcer failed:', error.message);
      process.exit(1);
    }
  }

  // Build comprehensive dependency graph
  async buildDependencyGraph() {
    console.log('📊 Building dependency graph...');

    const packageFiles = glob.sync('**/package.json', {
      cwd: process.cwd(),
      ignore: ['node_modules/**', '.git/**', 'dist/**', 'build/**'],
    });

    for (const packageFile of packageFiles) {
      const packageDir = path.dirname(packageFile);
      const packageJson = JSON.parse(fs.readFileSync(packageFile, 'utf8'));

      const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
        ...packageJson.peerDependencies,
      };

      // Filter to workspace packages only
      const workspaceDeps = Object.keys(dependencies).filter(
        (dep) => dep.startsWith('@agency/') && dep !== '@agency/governance-tools'
      );

      this.dependencyGraph.set(packageDir, {
        name: packageJson.name || packageDir,
        dependencies: workspaceDeps,
        layer: this.determineLayer(packageDir),
        path: packageDir,
      });
    }

    if (this.options.verbose) {
      console.log(`   Found ${this.dependencyGraph.size} packages`);
    }
  }

  // Determine architectural layer for a package
  determineLayer(packagePath) {
    for (const [layerName, layerConfig] of Object.entries(LAYERS)) {
      for (const layerPath of layerConfig.paths) {
        if (packagePath.startsWith(layerPath)) {
          return layerName;
        }
      }
    }
    return 'unknown';
  }

  // Check for circular dependencies
  async checkCircularDependencies() {
    console.log('🔄 Checking circular dependencies...');

    const visited = new Set();
    const recursionStack = new Set();

    for (const [pkg, config] of this.dependencyGraph) {
      if (!visited.has(pkg)) {
        const cycle = this.detectCycle(pkg, visited, recursionStack, []);
        if (cycle) {
          this.circularDependencies.push(cycle);
          this.violations.push({
            type: 'circular-dependency',
            severity: 'error',
            cycle,
            description: `Circular dependency detected: ${cycle.join(' → ')}`,
          });
        }
      }
    }
  }

  detectCycle(pkg, visited, recursionStack, path) {
    visited.add(pkg);
    recursionStack.add(pkg);
    path.push(pkg);

    const config = this.dependencyGraph.get(pkg);
    if (config) {
      for (const dep of config.dependencies) {
        // Find the actual package path for this dependency
        const depPkg = this.findPackageForDependency(dep);
        if (depPkg) {
          if (recursionStack.has(depPkg)) {
            // Found a cycle
            const cycleStart = path.indexOf(depPkg);
            return path.slice(cycleStart).concat(depPkg);
          }

          if (!visited.has(depPkg)) {
            const cycle = this.detectCycle(depPkg, visited, recursionStack, [...path]);
            if (cycle) return cycle;
          }
        }
      }
    }

    recursionStack.delete(pkg);
    return null;
  }

  // Find package path for a dependency
  findPackageForDependency(dependency) {
    for (const [pkg, config] of this.dependencyGraph) {
      if (config.name === dependency) {
        return pkg;
      }
    }
    return null;
  }

  // Check boundary rules
  async checkBoundaryRules() {
    console.log('🚧 Checking boundary rules...');

    for (const [pkg, config] of this.dependencyGraph) {
      for (const rulePattern of Object.keys(BOUNDARY_RULES)) {
        if (pkg.startsWith(rulePattern.replace('*/', ''))) {
          const rule = BOUNDARY_RULES[rulePattern];

          for (const dep of config.dependencies) {
            const depPkg = this.findPackageForDependency(dep);
            if (depPkg) {
              // Check forbidden dependencies
              for (const forbidden of rule.forbidden) {
                if (this.matchesPattern(depPkg, forbidden)) {
                  this.violations.push({
                    type: 'boundary-violation',
                    severity: 'error',
                    package: pkg,
                    dependency: dep,
                    rule: rule.reason,
                    description: `${pkg} violates boundary rule: ${rule.reason}`,
                  });
                }
              }

              // Check allowed dependencies (if specified)
              if (rule.allowed.length > 0) {
                const allowed = rule.allowed.some(
                  (allowed) => dep === allowed || dep.startsWith(allowed.replace('*', ''))
                );

                if (!allowed) {
                  this.violations.push({
                    type: 'boundary-violation',
                    severity: 'warning',
                    package: pkg,
                    dependency: dep,
                    rule: rule.reason,
                    description: `${pkg} has non-allowed dependency: ${dep}`,
                  });
                }
              }
            }
          }
        }
      }
    }
  }

  // Check architectural layer violations
  async checkLayerViolations() {
    console.log('🏛️ Checking layer violations...');

    for (const [pkg, config] of this.dependencyGraph) {
      const pkgLayer = LAYERS[config.layer];
      if (!pkgLayer) continue;

      for (const dep of config.dependencies) {
        const depPkg = this.findPackageForDependency(dep);
        if (depPkg) {
          const depConfig = this.dependencyGraph.get(depPkg);
          if (depConfig) {
            const depLayer = LAYERS[depConfig.layer];
            if (!depLayer) continue;

            // Check if dependency violates layer rules
            if (!pkgLayer.canDependOn.includes(depConfig.layer)) {
              this.violations.push({
                type: 'layer-violation',
                severity: 'error',
                package: pkg,
                dependency: dep,
                packageLayer: config.layer,
                dependencyLayer: depConfig.layer,
                description: `Layer violation: ${config.layer} cannot depend on ${depConfig.layer}`,
              });
            }

            // Check if dependency goes upward (lower level)
            if (pkgLayer.level <= depLayer.level) {
              this.violations.push({
                type: 'layer-violation',
                severity: 'warning',
                package: pkg,
                dependency: dep,
                packageLayer: config.layer,
                dependencyLayer: depConfig.layer,
                description: `Suspicious dependency: ${config.layer} (level ${pkgLayer.level}) → ${depConfig.layer} (level ${depLayer.level})`,
              });
            }
          }
        }
      }
    }
  }

  // Calculate compliance score
  async calculateComplianceScore() {
    console.log('📈 Calculating compliance score...');

    const totalPackages = this.dependencyGraph.size;
    const violations = this.violations.length;
    const circularDeps = this.circularDependencies.length;

    // Base score starts at 100
    let score = 100;

    // Deduct points for violations
    score -= violations * 10;
    score -= circularDeps * 20;

    // Ensure score doesn't go below 0
    this.complianceScore = Math.max(0, score);

    if (this.options.score) {
      console.log(`   Compliance Score: ${this.complianceScore}/100`);
      console.log(`   Total Packages: ${totalPackages}`);
      console.log(`   Violations: ${violations}`);
      console.log(`   Circular Dependencies: ${circularDeps}`);
    }
  }

  // Generate dependency graph visualization
  async generateDependencyGraph() {
    console.log('🎨 Generating dependency graph...');

    const graphPath = 'dependency-graph.dot';
    let dotContent = 'digraph MonorepoDependencies {\n';
    dotContent += '  rankdir=TB;\n';
    dotContent += '  node [shape=box, style=rounded];\n\n';

    // Add nodes with layer colors
    const layerColors = {
      application: 'lightblue',
      domain: 'lightgreen',
      platform: 'lightyellow',
      shared: 'lightcoral',
      unknown: 'lightgray',
    };

    for (const [pkg, config] of this.dependencyGraph) {
      const color = layerColors[config.layer] || 'lightgray';
      const label = config.name || pkg.split('/').pop();
      dotContent += `  "${pkg}" [label="${label}", fillcolor="${color}", style="filled,rounded"];\n`;
    }

    dotContent += '\n';

    // Add edges
    for (const [pkg, config] of this.dependencyGraph) {
      for (const dep of config.dependencies) {
        const depPkg = this.findPackageForDependency(dep);
        if (depPkg) {
          dotContent += `  "${pkg}" -> "${depPkg}";\n`;
        }
      }
    }

    dotContent += '}\n';

    fs.writeFileSync(graphPath, dotContent);
    console.log(`   Dependency graph saved to: ${graphPath}`);
    console.log('   To generate PNG: dot -Tpng dependency-graph.dot -o dependency-graph.png');
  }

  // Report results
  reportResults() {
    console.log('\n📊 Boundary Enforcement Results\n');

    if (this.violations.length === 0) {
      console.log('✅ No boundary violations found!\n');
    } else {
      console.log(`❌ Found ${this.violations.length} boundary violations:\n`);

      // Group violations by type
      const grouped = this.violations.reduce((acc, violation) => {
        acc[violation.type] = acc[violation.type] || [];
        acc[violation.type].push(violation);
        return acc;
      }, {});

      for (const [type, violations] of Object.entries(grouped)) {
        const icon =
          type === 'circular-dependency'
            ? '🔄'
            : type === 'boundary-violation'
              ? '🚧'
              : type === 'layer-violation'
                ? '🏛️'
                : '❓';

        console.log(`${icon} ${type.toUpperCase()}: ${violations.length} issues`);

        for (const violation of violations) {
          console.log(`   • ${violation.description}`);
          if (violation.package) console.log(`     Package: ${violation.package}`);
          if (violation.dependency) console.log(`     Dependency: ${violation.dependency}`);
          if (violation.rule) console.log(`     Rule: ${violation.rule}`);
        }
        console.log('');
      }
    }

    // Report circular dependencies
    if (this.circularDependencies.length > 0) {
      console.log('🔄 Circular Dependencies:\n');
      for (const cycle of this.circularDependencies) {
        console.log(`   • ${cycle.join(' → ')}`);
      }
      console.log('');
    }

    // Report compliance score
    console.log('📈 Compliance Metrics:');
    console.log(`   Score: ${this.complianceScore}/100`);
    console.log(`   Packages: ${this.dependencyGraph.size}`);
    console.log(`   Violations: ${this.violations.length}`);
    console.log(`   Circular Dependencies: ${this.circularDependencies.length}`);

    // Grade the score
    let grade = 'A';
    if (this.complianceScore < 60) grade = 'F';
    else if (this.complianceScore < 70) grade = 'D';
    else if (this.complianceScore < 80) grade = 'C';
    else if (this.complianceScore < 90) grade = 'B';

    console.log(`   Grade: ${grade} (${this.complianceScore}%)`);

    if (this.complianceScore < 80) {
      console.log(
        '\n⚠️  Architecture compliance needs improvement. Address violations to increase score.'
      );
    }
  }

  // Helper method to match patterns
  matchesPattern(target, pattern) {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace('*', '.*'));
      return regex.test(target);
    }
    return target === pattern;
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
      if (key === 'graph' || key === 'check-circular' || key === 'score' || key === 'verbose') {
        options[key] = true;
      }
    }
  }

  const enforcer = new BoundaryEnforcer(options);
  await enforcer.run();
}

// Export for testing
export { BoundaryEnforcer, LAYERS, BOUNDARY_RULES };

// Run if called directly
if (__filename === path.resolve(process.argv[1])) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
