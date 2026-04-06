# Package Boundaries

## Overview

Package boundaries enforce architectural constraints in monorepos, preventing unauthorized dependencies and maintaining clean architecture. This documentation covers implementation patterns for boundary enforcement using Turborepo, Nx, and custom tooling.

---

## Architectural Layers

### Layer Definitions

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │   Web App   │ │ Mobile App  │ │   Admin Dashboard   │   │
│  └──────┬──────┘ └──────┬──────┘ └──────────┬──────────┘   │
└─────────┼───────────────┼──────────────────┼─────────────┘
          │               │                  │
          └───────────────┼──────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                         ▼                                   │
│                    Domain Layer                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │ UI Components│ │  API Client │ │   Business Logic  │   │
│  └──────┬──────┘ └──────┬──────┘ └──────────┬──────────┘   │
└─────────┼───────────────┼──────────────────┼─────────────┘
          │               │                  │
          └───────────────┼──────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                         ▼                                   │
│                    Platform Layer                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │    Types    │ │    Config   │ │  Design Tokens      │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Dependency Rules

| Layer | Can Depend On | Cannot Depend On |
|-------|---------------|------------------|
| Application | Domain, Platform | Other Applications |
| Domain | Platform | Application, Domain |
| Platform | None | Application, Domain |

---

## Turborepo Boundaries

### Configuration

```json
// turbo.json
{
  "$schema": "https://turborepo.com/schema.json",
  "globalDependencies": [".env"],
  
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "dependsOn": [],
      "outputs": []
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  },
  
  "remoteCache": {
    "enabled": true
  }
}
```

### Package Configuration

```json
// packages/ui/package.json
{
  "name": "@agency/ui",
  "version": "1.0.0",
  "dependencies": {
    "@agency/design-system": "workspace:*",
    "@agency/utils": "workspace:*"
  },
  "devDependencies": {
    "@agency/types": "workspace:*"
  }
}
```

```json
// packages/database/package.json
{
  "name": "@agency/database",
  "version": "1.0.0",
  "dependencies": {
    "@agency/types": "workspace:*"
  }
}
```

---

## Custom Boundary Enforcement

### Boundary Checker Script

```typescript
// tools/governance/check-boundaries.ts
import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, join, relative } from 'path';

interface PackageConfig {
  name: string;
  path: string;
  type: 'app' | 'ui' | 'utils' | 'platform';
  layer: 'application' | 'domain' | 'platform';
  allowedDependencies: string[];
  forbiddenDependencies: string[];
}

const packageConfigs: PackageConfig[] = [
  {
    name: '@agency/web',
    path: 'apps/web',
    type: 'app',
    layer: 'application',
    allowedDependencies: ['@agency/ui', '@agency/api', '@agency/utils'],
    forbiddenDependencies: ['apps/*']
  },
  {
    name: '@agency/ui',
    path: 'packages/ui',
    type: 'ui',
    layer: 'domain',
    allowedDependencies: ['@agency/design-system', '@agency/utils', '@agency/types'],
    forbiddenDependencies: ['@agency/api', 'apps/*']
  },
  {
    name: '@agency/api',
    path: 'packages/api',
    type: 'utils',
    layer: 'domain',
    allowedDependencies: ['@agency/database', '@agency/utils', '@agency/types'],
    forbiddenDependencies: ['@agency/ui', 'apps/*']
  },
  {
    name: '@agency/database',
    path: 'packages/database',
    type: 'platform',
    layer: 'platform',
    allowedDependencies: ['@agency/types'],
    forbiddenDependencies: ['@agency/ui', '@agency/api', 'apps/*']
  },
  {
    name: '@agency/types',
    path: 'packages/types',
    type: 'platform',
    layer: 'platform',
    allowedDependencies: [],
    forbiddenDependencies: ['*']
  }
];

interface Violation {
  package: string;
  dependency: string;
  type: 'forbidden' | 'not-allowed';
  rule: string;
}

function checkPackageBoundaries(
  packagePath: string,
  config: PackageConfig
): Violation[] {
  const violations: Violation[] = [];
  const packageJsonPath = join(packagePath, 'package.json');
  
  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };
    
    for (const [depName] of Object.entries(allDeps)) {
      // Skip non-workspace dependencies
      if (!depName.startsWith('@agency/')) continue;
      
      // Check forbidden dependencies
      const isForbidden = config.forbiddenDependencies.some(pattern => 
        matchPattern(depName, pattern)
      );
      
      if (isForbidden) {
        violations.push({
          package: config.name,
          dependency: depName,
          type: 'forbidden',
          rule: `${config.name} cannot depend on ${depName}`
        });
        continue;
      }
      
      // Check if not in allowed list
      const isAllowed = config.allowedDependencies.some(pattern =>
        matchPattern(depName, pattern)
      );
      
      if (!isAllowed) {
        violations.push({
          package: config.name,
          dependency: depName,
          type: 'not-allowed',
          rule: `${depName} is not in allowed dependencies for ${config.name}`
        });
      }
    }
  } catch (error) {
    console.error(`Error reading ${packageJsonPath}:`, error);
  }
  
  return violations;
}

function matchPattern(value: string, pattern: string): boolean {
  if (pattern === '*') return true;
  if (pattern.includes('*')) {
    const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
    return regex.test(value);
  }
  return value === pattern;
}

function main() {
  const allViolations: Violation[] = [];
  
  for (const config of packageConfigs) {
    const packagePath = resolve(process.cwd(), config.path);
    const violations = checkPackageBoundaries(packagePath, config);
    allViolations.push(...violations);
  }
  
  if (allViolations.length > 0) {
    console.error('\n❌ Boundary violations found:\n');
    allViolations.forEach(v => {
      console.error(`  ${v.package} → ${v.dependency}`);
      console.error(`    ${v.type}: ${v.rule}\n`);
    });
    process.exit(1);
  } else {
    console.log('✅ All package boundaries respected');
    process.exit(0);
  }
}

main();
```

### ESLint Integration

```javascript
// .eslintrc.boundaries.js
module.exports = {
  plugins: ['boundaries'],
  extends: ['plugin:boundaries/recommended'],
  settings: {
    'boundaries/elements': [
      {
        type: 'app',
        pattern: 'apps/*',
        capture: ['appName']
      },
      {
        type: 'feature',
        pattern: 'packages/features/*',
        capture: ['featureName']
      },
      {
        type: 'ui',
        pattern: 'packages/ui/*',
        capture: ['uiName']
      },
      {
        type: 'utils',
        pattern: 'packages/utils',
        capture: []
      },
      {
        type: 'types',
        pattern: 'packages/types',
        capture: []
      }
    ],
    'boundaries/ignore': ['**/*.test.*', '**/*.spec.*']
  },
  rules: {
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        rules: [
          // Apps can depend on features, UI, utils, and types
          {
            from: 'app',
            allow: ['feature', 'ui', 'utils', 'types']
          },
          // Features can depend on UI, utils, and types
          {
            from: 'feature',
            allow: ['ui', 'utils', 'types']
          },
          // UI can depend on utils and types
          {
            from: 'ui',
            allow: ['utils', 'types']
          },
          // Utils can only depend on types
          {
            from: 'utils',
            allow: ['types']
          },
          // Types cannot depend on anything
          {
            from: 'types',
            allow: []
          }
        ]
      }
    ],
    'boundaries/external': [
      'error',
      {
        default: 'allow',
        rules: [
          // Types package should not import heavy libraries
          {
            from: 'types',
            disallow: ['react', 'vue', 'angular'],
            message: 'Types package should not import UI frameworks'
          }
        ]
      }
    ]
  }
};
```

---

## Visual Dependency Management

### Dependency Graph

```bash
# Generate dependency graph with Turborepo
turbo run build --graph=graph.html

# Or use dependency-cruiser
npx depcruise --include-only '^packages' --output-type dot packages | dot -T svg > dependency-graph.svg
```

### Graph Visualization

```typescript
// tools/governance/visualize-deps.ts
import { ProjectGraph, DependencyType } from '@nx/devkit';
import * as fs from 'fs';

interface GraphNode {
  id: string;
  label: string;
  type: string;
  layer: string;
}

interface GraphEdge {
  source: string;
  target: string;
  type: DependencyType;
}

function generateMermaidGraph(nodes: GraphNode[], edges: GraphEdge[]): string {
  const validEdges = edges.filter(e => 
    nodes.some(n => n.id === e.source) && 
    nodes.some(n => n.id === e.target)
  );
  
  let mermaid = 'graph TD\n';
  
  // Add nodes with styling
  nodes.forEach(node => {
    const style = getNodeStyle(node.layer);
    mermaid += `  ${node.id}["${node.label}"]${style}\n`;
  });
  
  // Add edges
  validEdges.forEach(edge => {
    const style = getEdgeStyle(edge.type);
    mermaid += `  ${edge.source} ${style} ${edge.target}\n`;
  });
  
  // Add legend
  mermaid += '\n  subgraph Legend\n';
  mermaid += '    direction LR\n';
  mermaid += '    app([Application]):::app\n';
  mermaid += '    domain([Domain]):::domain\n';
  mermaid += '    platform([Platform]):::platform\n';
  mermaid += '  end\n';
  
  // Add styles
  mermaid += '\n  classDef app fill:#e1f5fe\n';
  mermaid += '  classDef domain fill:#fff3e0\n';
  mermaid += '  classDef platform fill:#f3e5f5\n';
  
  return mermaid;
}

function getNodeStyle(layer: string): string {
  switch (layer) {
    case 'application':
      return ':::app';
    case 'domain':
      return ':::domain';
    case 'platform':
      return ':::platform';
    default:
      return '';
  }
}

function getEdgeStyle(type: DependencyType): string {
  switch (type) {
    case 'static':
      return '-->';
    case 'dynamic':
      return '-.->';
    case 'implicit':
      return '==>';
    default:
      return '-->';
  }
}
```

---

## Enforcement in CI/CD

### GitHub Actions

```yaml
# .github/workflows/boundaries.yml
name: Package Boundaries

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  check-boundaries:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Check package boundaries
        run: pnpm run check:boundaries
      
      - name: Run ESLint boundary rules
        run: pnpm run lint:boundaries
      
      - name: Generate dependency graph
        run: |
          pnpm turbo run build --graph=dep-graph.html
          echo "Dependency graph generated"
      
      - name: Upload graph artifact
        uses: actions/upload-artifact@v4
        with:
          name: dependency-graph
          path: dep-graph.html
```

---

## Best Practices

### Do's

✅ **Define clear layer responsibilities**  
✅ **Use workspace protocol** for internal deps  
✅ **Enforce in CI/CD** - prevent violations  
✅ **Document architecture** - Make rules visible  
✅ **Use dependency graph** - Visualize structure  
✅ **Keep platform layer lean** - No external deps  

### Don'ts

❌ **Allow circular dependencies**  
❌ **Skip boundary checks** in CI  
❌ **Mix concerns** across layers  
❌ **Import heavy deps** in types package  
❌ **Allow apps to import other apps**  

---

## Resources

### Tools
- [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) - Dependency visualization
- [eslint-plugin-boundaries](https://github.com/javierbrea/eslint-plugin-boundaries) - ESLint rules
- [Nx Dep Graph](https://nx.dev/core-features/explore-graph) - Nx dependency graph

---

_Updated April 2026 based on monorepo architecture best practices._
