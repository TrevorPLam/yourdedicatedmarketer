# ESLint Documentation

**Repository Version:** ^10.2.0  
**Official Documentation:** https://eslint.org/docs/latest/  
**TypeScript ESLint:** ^8.29.0  
**Latest Release:** April 2026

## Overview

ESLint is the premier static analysis tool for JavaScript and TypeScript code. It identifies and reports on patterns found in ECMAScript/JavaScript code, with the goal of making code more consistent and avoiding bugs.

In this monorepo, ESLint is configured as a comprehensive code quality enforcement tool with TypeScript support, React-specific rules, accessibility checking, and import organization.

## Key Features

### **Static Analysis**
- **Code Quality**: Identifies problematic patterns and potential bugs
- **Style Enforcement**: Maintains consistent coding standards across the monorepo
- **TypeScript Support**: Full TypeScript integration with type-aware linting
- **React Integration**: React-specific rules and hooks validation
- **Accessibility**: Automated accessibility checking with jsx-a11y
- **Import Management**: Import/export organization and dependency analysis

### **Monorepo Optimization**
- **Workspace Awareness**: Understands monorepo package structure
- **Performance**: Optimized for large codebases with turbo caching
- **Config Sharing**: Consistent rules across all packages and applications
- **Type-Aware Linting**: Leverages TypeScript compiler API for deeper analysis

## Installation

### Core Dependencies

```bash
# Core ESLint packages
pnpm add -D eslint@^9.23.0 @eslint/js@^9.23.0

# TypeScript support
pnpm add -D @typescript-eslint/eslint-plugin@^8.29.0 @typescript-eslint/parser@^8.29.0

# Framework support
pnpm add -D eslint-plugin-react@^7.37.0 eslint-plugin-react-hooks@^5.0.0
pnpm add -D eslint-plugin-astro@^1.2.0

# Code quality plugins
pnpm add -D eslint-plugin-import@^2.31.0 eslint-plugin-jsx-a11y@^6.10.0
```

### Configuration Files

The monorepo uses ESLint's new flat config format (`eslint.config.js`):

```javascript
// eslint.config.js
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import astro from 'eslint-plugin-astro';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';

export default [
  // Base JavaScript configuration
  js.configs.recommended,
  
  // TypeScript configuration
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: { '@typescript-eslint': typescript },
    rules: {
      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },
  
  // React configuration
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: react,
      'react-hooks': reactHooks
    },
    settings: {
      react: { version: 'detect' }
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'off', // TypeScript handles this
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    }
  },
  
  // Astro configuration
  {
    files: ['**/*.astro'],
    plugins: { astro },
    processor: astro.processors['.astro']
  },
  
  // Accessibility configuration
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: { 'jsx-a11y': jsxA11y },
    rules: {
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/alt-text': 'error'
    }
  },
  
  // Import organization
  {
    plugins: { import: importPlugin },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index'
          ],
          alphabetize: { order: 'asc' }
        }
      ]
    }
  }
]);
```

## Configuration

### **Flat Config Structure (ESLint v9+)**

ESLint 9+ uses the new flat config format (`eslint.config.js`) which provides:

- **Better Performance**: Faster configuration loading
- **Improved TypeScript Support**: Native TypeScript configuration
- **Plugin Simplification**: Easier plugin management
- **Enhanced Debugging**: Better error messages and debugging

### **Using defineConfig**

ESLint v9.39+ provides the `defineConfig` helper from `eslint/config` for better IDE support and type checking:

```javascript
// eslint.config.js
import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
  {
    files: ["**/*.js"],
    plugins: {
      js
    },
    extends: ["js/recommended"],
    rules: {
      "no-unused-vars": "warn"
    }
  }
]);
```

### **Configuration Object Properties**

Each configuration object contains all the information ESLint needs:

```javascript
{
  // Required: Name for error messages and config inspector
  name: "my-project-config",
  
  // Optional: Base path for this configuration (relative or absolute)
  basePath: "./src",
  
  // Optional: Glob patterns for files this config applies to
  files: ["**/*.js", "**/*.ts"],
  
  // Optional: Glob patterns to ignore (acts as global ignores when used alone)
  ignores: ["**/*.config.js", "**/dist/**"],
  
  // Optional: Language identifier (format: "plugin/language")
  language: "js/js",  // default for JavaScript
  
  // Optional: Language-specific settings
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",  // "script" | "module" | "commonjs"
    globals: {
      myGlobal: "readonly"
    },
    parser: customParser,  // Object with parse() or parseForESLint()
    parserOptions: {
      // Parser-specific options
    }
  },
  
  // Optional: Linter process settings
  linterOptions: {
    noInlineConfig: false,
    reportUnusedDisableDirectives: "warn",
    reportUnusedInlineConfigs: "off"
  },
  
  // Optional: Plugins to use
  plugins: {
    react: reactPlugin,
    "@typescript-eslint": typescriptPlugin
  },
  
  // Optional: Rules to enforce
  rules: {
    "no-console": "warn",
    "react/react-in-jsx-scope": "off"
  },
  
  // Optional: Settings shared across all rules
  settings: {
    react: {
      version: "detect"
    }
  },
  
  // Optional: Extend other configurations
  extends: ["js/recommended", "pluginExample.configs.recommended"],
  
  // Optional: Processor for non-JavaScript files
  processor: "markdown/javascript"
}
```

### **Extending Configurations**

The `extends` key inherits all traits from another configuration:

```javascript
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";

export default defineConfig([
  // Base configuration from plugin
  {
    files: ["**/*.js"],
    plugins: { js },
    extends: ["js/recommended"]
  },
  
  // Extend predefined configs directly
  {
    files: ["**/*.jsx"],
    plugins: { react: reactPlugin },
    extends: [
      // String reference to plugin config
      "react/recommended",
      // Direct config object reference
      reactPlugin.configs.strict
    ]
  }
]);
```

#### **Predefined ESLint Configurations**

ESLint provides two built-in configurations via `@eslint/js`:

- `js/recommended` - Rules recommended for everyone to avoid potential errors
- `js/all` - All rules (not recommended for production - changes with each version)

```javascript
import js from "@eslint/js";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.js"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      // Override specific rules
      "no-unused-vars": "warn"
    }
  }
]);
```

### **TypeScript Integration**

```javascript
// Type-aware linting configuration
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: true, // Enable type-aware linting
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      "@typescript-eslint": typescript
    },
    rules: {
      // TypeScript-specific rules
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-explicit-any": "warn"
    }
  }
]);
```

### **Monorepo Configuration**

The monorepo uses shared ESLint configuration with package-specific overrides:

```javascript
// Root eslint.config.js (shared)
import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
  js.configs.recommended,
  // ... other shared configs
]);

// Package-specific overrides (e.g., in apps/agency-website/eslint.config.js)
import { defineConfig } from "eslint/config";
import baseConfig from "../../eslint.config.js";

export default defineConfig([
  ...baseConfig,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      // Package-specific rule overrides
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
]);
```

## Rules and Best Practices

### **Core Rules**

#### **Code Quality**
```javascript
{
  'no-console': 'warn', // Warn about console statements
  'no-debugger': 'error', // Error on debugger statements
  'no-unused-vars': 'error', // Error on unused variables
  'prefer-const': 'error', // Prefer const over let when possible
  'no-var': 'error', // Disallow var declarations
}
```

#### **TypeScript Rules**
```javascript
{
  '@typescript-eslint/no-unused-vars': 'error',
  '@typescript-eslint/prefer-const': 'error',
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/explicit-function-return-type': 'warn',
  '@typescript-eslint/no-non-null-assertion': 'warn',
}
```

#### **React Rules**
```javascript
{
  'react/react-in-jsx-scope': 'off', // React 17+ doesn't need import
  'react/prop-types': 'off', // TypeScript handles prop validation
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',
  'react/jsx-uses-react': 'off',
}
```

#### **Accessibility Rules**
```javascript
{
  'jsx-a11y/anchor-is-valid': 'warn',
  'jsx-a11y/alt-text': 'error',
  'jsx-a11y/aria-props': 'warn',
  'jsx-a11y/role-has-required-aria-props': 'error',
}
```

### **Import Organization**

```javascript
{
  'import/order': [
    'error',
    {
      groups: [
        'builtin', // Node.js built-ins
        'external', // External packages
        'internal', // Internal packages (@agency/*)
        'parent', // Parent directories
        'sibling', // Sibling files
        'index' // Index files
      ],
      alphabetize: { order: 'asc', caseInsensitive: true },
      'newlines-between': 'always'
    }
  ]
}
```

## Integration with Development Workflow

### **Git Hooks Integration**

ESLint integrates with Husky for pre-commit checks:

```bash
# .husky/pre-commit
#!/usr/bin/env sh
echo "🔍 Running ESLint..."
npx turbo run lint --filter="*" -- --no-fix
```

### **Turbo Integration**

ESLint is optimized with Turbo for monorepo performance:

```json
// turbo.json
{
  "tasks": {
    "lint": {
      "outputs": [],
      "inputs": ["src/**", "package.json", "eslint.config.*"],
      "cache": true
    }
  }
}
```

### **IDE Integration**

#### **VS Code Configuration**
```json
// .vscode/settings.json
{
  "eslint.enable": true,
  "eslint.workingDirectories": ["."],
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "astro"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

#### **WebStorm Configuration**
- Enable ESLint in Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
- Set "ESLint package" to `node_modules/eslint`
- Set "Configuration file" to `eslint.config.js`

## Performance Optimization

### **Caching Strategy**

ESLint results are cached by Turbo for faster subsequent runs:

```javascript
// turbo.json cache configuration
{
  "tasks": {
    "lint": {
      "cache": true,
      "outputs": [],
      "inputs": [
        "src/**",
        "package.json", 
        "eslint.config.*",
        "tsconfig.json"
      ]
    }
  }
}
```

### **Type-Aware Linting Performance**

For large codebases, optimize type-aware linting:

```javascript
{
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
      // Performance optimizations
      cacheLifetime: { glob: 5 },
      allowAutomaticSingleRunInference: true
    }
  }
}
```

## Custom Rules and Plugins

### **Agency-Specific Rules**

```javascript
// Custom rules for agency standards
{
  rules: {
    // Enforce agency naming conventions
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow'
      },
      {
        selector: 'function',
        format: ['camelCase']
      },
      {
        selector: 'typeAlias',
        format: ['PascalCase']
      }
    ],
    
    // Enforce file naming conventions
    'filenames/match-regex': ['error', '^[a-z0-9-\\.]+$', { matchFiles: ['**/*.ts', '**/*.tsx'] }]
  }
}
```

### **Custom Plugin Development**

```javascript
// plugins/agency-rules.js
module.exports = {
  rules: {
    'no-hardcoded-colors': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Disallow hardcoded color values'
        }
      },
      create(context) {
        return {
          Literal(node) {
            if (typeof node.value === 'string' && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(node.value)) {
              context.report({
                node,
                message: 'Use design system colors instead of hardcoded values'
              });
            }
          }
        };
      }
    }
  }
};
```

## Troubleshooting

### **Common Issues**

#### **TypeScript Project Resolution**
```bash
# Error: "Cannot find project for TSConfig"
# Solution: Ensure tsconfig.json paths are correct
{
  parserOptions: {
    project: true,
    tsconfigRootDir: import.meta.dirname
  }
}
```

#### **Import Resolution**
```bash
# Error: "Unable to resolve path to module"
# Solution: Configure module resolution in tsconfig.json
{
  compilerOptions: {
    baseUrl: '.',
    paths: {
      '@agency/*': ['packages/*/src', 'apps/*/src']
    }
  }
}
```

#### **Performance Issues**
```bash
# Slow linting on large codebases
# Solutions:
# 1. Enable caching in Turbo
# 2. Use file-based filtering
# 3. Optimize TypeScript project references
```

### **Debugging Configuration**

```bash
# Debug ESLint configuration
npx eslint --debug src/file.ts

# Check which rules are applied
npx eslint --print-config src/file.ts

# Test specific rules
npx eslint --rule 'no-console: error' src/
```

## Migration Guide

### **From ESLint 8 to 9**

Key changes in ESLint 9:

1. **Flat Config Default**: The new flat config format is now default
2. **TypeScript Parser**: Use `@typescript-eslint/parser` for TypeScript files
3. **Plugin Loading**: Plugins are loaded differently in flat config
4. **Rule Changes**: Some rules have been renamed or moved

```javascript
// Old format (.eslintrc.js)
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended'
  ]
};

// New format (eslint.config.js)
export default [
  js.configs.recommended,
  typescript.configs.recommended,
  react.configs.recommended
];
```

## Best Practices

### **Rule Selection**
- Start with recommended configurations
- Add rules gradually to avoid overwhelming developers
- Focus on rules that prevent bugs over stylistic preferences
- Use warning level for preferential rules, error for bug-prevention

### **Performance**
- Enable Turbo caching for monorepo performance
- Use type-aware linting selectively on large codebases
- Configure file-based filtering for large projects
- Regularly update dependencies for performance improvements

### **Team Adoption**
- Provide clear documentation for custom rules
- Use IDE integrations for real-time feedback
- Configure pre-commit hooks to enforce standards
- Regular code reviews focused on linting issues

## Integration with Other Tools

### **Prettier Integration**
```javascript
// eslint.config.js
import prettierConfig from 'eslint-config-prettier';

export default [
  // ... other configurations
  prettierConfig // Disable ESLint rules that conflict with Prettier
];
```

### **TypeScript Integration**
- Use type-aware linting for deeper analysis
- Configure TypeScript project references for large codebases
- Enable automatic type checking in CI/CD

### **Testing Integration**
```javascript
{
  files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
  rules: {
    // Allow more relaxed rules in test files
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off'
  }
}
```

## Resources

### **Official Documentation**
- [ESLint User Guide](https://eslint.org/docs/latest/user-guide/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [React ESLint Plugin](https://github.com/jsx-eslint/eslint-plugin-react)

### **Community Resources**
- [ESLint Rules Explorer](https://eslint.org/docs/latest/rules/)
- [TypeScript ESLint Rules](https://typescript-eslint.io/rules/)
- [React A11y Rules](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)

### **Tools and Extensions**
- [VS Code ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [ESLint Visualizer](https://microsoft.github.io/eslint-visualizer/)
- [ESLint Rule Generator](https://eslint.org/docs/latest/developer-guide/working-with-rules)
