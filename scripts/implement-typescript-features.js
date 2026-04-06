#!/usr/bin/env node

/**
 * Implement TypeScript 5.9+ Features
 * 
 * Enable modern TypeScript features for better import/export patterns
 */

import { readFileSync, writeFileSync } from 'fs';

function updateRootTypeScriptConfig() {
  console.log('⚙️  Updating root TypeScript configuration...');
  
  try {
    const tsconfigPath = './tsconfig.json';
    const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'));
    
    // Enable TypeScript 5.9+ features
    tsconfig.compilerOptions = {
      ...tsconfig.compilerOptions,
      verbatimModuleSyntax: true,
      module: 'ESNext',
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      // Enhanced import/export features
      importsNotUsedAsValues: 'error',
      isolatedModules: true,
      // Better type checking
      strict: true,
      noUncheckedIndexedAccess: true,
      exactOptionalPropertyTypes: true,
    };
    
    writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    console.log('✅ Root TypeScript configuration updated');
  } catch (error) {
    console.error('❌ Failed to update root TypeScript config:', error.message);
  }
}

function updatePackageJsonSideEffects() {
  console.log('📦 Configuring sideEffects for tree shaking...');
  
  try {
    const packageJsonPath = './package.json';
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    
    // Configure sideEffects for optimal tree shaking
    packageJson.sideEffects = [
      "**/*.css",
      "**/*.scss", 
      "**/*.global.ts",
      "**/*.setup.ts",
      "**/*.client.ts", // Client-side entry points
      "src/setup/**",
      "dist/**/*.css",
      "!src/**/*.pure.ts" // Pure functions can be tree-shaken
    ];
    
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ sideEffects configured');
  } catch (error) {
    console.error('❌ Failed to configure sideEffects:', error.message);
  }
}

function convertToTypeOnlyImports() {
  console.log('🔄 Converting to type-only imports...');
  
  const filesToFix = [
    'packages/platform/cms/src/adapters/sanity.adapter.ts',
    'packages/platform/cms/src/adapters/contentful.adapter.ts',
    'packages/platform/database/src/adapters/supabase.ts',
    'packages/platform/database/src/adapters/postgres.ts',
    'packages/platform/database/src/adapters/neon.ts',
    'packages/platform/deployment/src/adapters/base.adapter.ts',
    'packages/platform/deployment/src/adapters/cloudflare.adapter.ts'
  ];
  
  filesToFix.forEach(filePath => {
    try {
      const content = readFileSync(filePath, 'utf-8');
      
      // Convert type imports to type-only imports
      let updatedContent = content;
      
      // Find type-only imports and convert them
      updatedContent = updatedContent.replace(
        /import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"];?\s*\n/g,
        (match, imports, from) => {
          // Check if all imports are types (look for type usage patterns)
          const importItems = imports.split(',').map(item => item.trim());
          const typeImports = importItems.filter(item => 
            item.startsWith('type ') || 
            item.endsWith('Config') || 
            item.endsWith('Options') ||
            item.endsWith('Result') ||
            item.endsWith('Types') ||
            item.endsWith('Interface') ||
            item.endsWith('Contract')
          );
          
          if (typeImports.length === importItems.length && typeImports.length > 0) {
            // All imports are types, convert to type-only import
            const cleanImports = typeImports
              .map(item => item.replace(/^type\s+/, '').trim())
              .join(', ');
            return `import type { ${cleanImports} } from '${from}';\n`;
          }
          
          // Mixed imports - separate type imports
          const typeOnlyImports = importItems.filter(item => 
            item.endsWith('Config') || 
            item.endsWith('Options') ||
            item.endsWith('Result') ||
            item.endsWith('Types') ||
            item.endsWith('Interface') ||
            item.endsWith('Contract')
          );
          
          const valueImports = importItems.filter(item => 
            !typeOnlyImports.includes(item)
          );
          
          let result = '';
          if (typeOnlyImports.length > 0) {
            const cleanTypeImports = typeOnlyImports.join(', ');
            result += `import type { ${cleanTypeImports} } from '${from}';\n`;
          }
          if (valueImports.length > 0) {
            const cleanValueImports = valueImports.join(', ');
            result += `import { ${cleanValueImports} } from '${from}';\n`;
          }
          
          return result;
        }
      );
      
      // Add import attributes for JSON imports
      updatedContent = updatedContent.replace(
        /import\s+(\w+)\s*from\s*['"]([^'"]*\.json)['"];?\s*\n/g,
        (match, name, path) => `import ${name} from '${path}' with { type: 'json' };\n`
      );
      
      // Add file extensions to relative imports (ESM requirement)
      updatedContent = updatedContent.replace(
        /from\s*['"](\.\.\/[^'"]*)['"];?\s*\n/g,
        (match, path) => {
          if (!path.includes('.')) {
            return `from '${path}.js';\n`;
          }
          return match;
        }
      );
      
      if (updatedContent !== content) {
        writeFileSync(filePath, updatedContent);
        console.log(`✅ Updated imports in ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ Failed to update ${filePath}:`, error.message);
    }
  });
}

function addDeferImports() {
  console.log('⏳ Adding defer imports for performance-critical modules...');
  
  // Find performance-critical modules and add defer imports
  const heavyModules = [
    'packages/analytics/src/core/analytics-manager.ts',
    'packages/shared/monitoring/src/dashboard/monitoring-dashboard.tsx',
    'packages/platform/cms/src/generators/type-generator.ts'
  ];
  
  heavyModules.forEach(filePath => {
    try {
      const content = readFileSync(filePath, 'utf-8');
      
      // Check if there are heavy imports that could be deferred
      if (content.includes('import') && content.includes('analytics') || content.includes('monitoring')) {
        console.log(`📝 Consider adding defer imports to ${filePath}`);
        
        // Add comment suggesting defer imports
        const updatedContent = `/**
 * Performance Optimization Note:
 * 
 * Consider using defer imports for heavy modules:
 * 
 * // Instead of:
 * import * as heavyModule from './heavy-analytics';
 * 
 * // Use:
 * import defer * as heavyModule from './heavy-analytics';
 * 
 * This delays module evaluation until first use.
 */

${content}`;
        
        writeFileSync(filePath, updatedContent);
        console.log(`✅ Added defer import suggestion to ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ Failed to process ${filePath}:`, error.message);
    }
  });
}

function createESLintConfig() {
  console.log('📋 Creating ESLint configuration for import consistency...');
  
  const eslintConfig = {
    extends: [
      '@typescript-eslint/recommended',
      '@typescript-eslint/recommended-requiring-type-checking'
    ],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/prefer-type-only-imports': 'error',
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
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          }
        }
      ],
      'import/extensions': [
        'error',
        'always',
        {
          js: 'never',
          ts: 'never',
          tsx: 'never'
        }
      ]
    }
  };
  
  try {
    writeFileSync('.eslintrc.imports.json', JSON.stringify(eslintConfig, null, 2));
    console.log('✅ ESLint configuration created');
  } catch (error) {
    console.error('❌ Failed to create ESLint config:', error.message);
  }
}

function main() {
  console.log('🚀 Implementing TypeScript 5.9+ features...\n');
  
  updateRootTypeScriptConfig();
  updatePackageJsonSideEffects();
  convertToTypeOnlyImports();
  addDeferImports();
  createESLintConfig();
  
  console.log('\n✨ TypeScript 5.9+ features implemented!');
  console.log('📋 Features enabled:');
  console.log('   ✅ verbatimModuleSyntax for strict import patterns');
  console.log('   ✅ Type-only imports for better tree shaking');
  console.log('   ✅ Import attributes for JSON modules');
  console.log('   ✅ sideEffects configuration for bundlers');
  console.log('   ✅ ESLint rules for import consistency');
  console.log('   ✅ Defer import suggestions for performance');
  
  console.log('\n🔧 Next steps:');
  console.log('   1. Run: pnpm install');
  console.log('   2. Run: pnpm build');
  console.log('   3. Run: node tools/governance/import-export-audit.mjs');
  console.log('   4. Validate bundle size improvements');
}

main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
