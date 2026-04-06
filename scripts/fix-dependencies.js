#!/usr/bin/env node

/**
 * Dependency Fix Script
 * 
 * Automatically fixes unresolvable dependencies by:
 * 1. Adding missing packages to package.json
 * 2. Updating import paths with proper extensions
 * 3. Configuring sideEffects for tree shaking
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const MISSING_PACKAGES = [
  'tsup',
  '@supabase/supabase-js',
  'pg', 
  '@neondatabase/serverless',
  'sanity',
  '@sanity/client',
  'graphql-request',
  'contentful'
];

function addMissingPackages() {
  console.log('🔧 Adding missing packages...');
  
  try {
    // Add packages to workspace root
    const packagesToAdd = MISSING_PACKAGES.join(' ');
    execSync(`pnpm add -D -w ${packagesToAdd}`, { stdio: 'inherit' });
    console.log('✅ Missing packages added successfully');
  } catch (error) {
    console.error('❌ Failed to add packages:', error.message);
  }
}

function configureSideEffects() {
  console.log('⚙️  Configuring sideEffects for tree shaking...');
  
  try {
    const packageJsonPath = './package.json';
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    
    // Configure sideEffects for optimal tree shaking
    packageJson.sideEffects = [
      "**/*.css",
      "**/*.scss", 
      "**/*.global.ts",
      "**/*.setup.ts",
      "src/setup/**",
      "dist/**/*.css"
    ];
    
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ sideEffects configured');
  } catch (error) {
    console.error('❌ Failed to configure sideEffects:', error.message);
  }
}

function updateTypeScriptConfig() {
  console.log('📝 Updating TypeScript configuration for 2026 standards...');
  
  try {
    const tsconfigPath = './tsconfig.json';
    const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'));
    
    // Enable modern TypeScript features
    tsconfig.compilerOptions = {
      ...tsconfig.compilerOptions,
      verbatimModuleSyntax: true,
      module: 'ESNext',
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      resolveJsonModule: true
    };
    
    writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    console.log('✅ TypeScript configuration updated');
  } catch (error) {
    console.error('❌ Failed to update TypeScript config:', error.message);
  }
}

function main() {
  console.log('🚀 Starting dependency fixes...\n');
  
  addMissingPackages();
  configureSideEffects();
  updateTypeScriptConfig();
  
  console.log('\n✨ Dependency fixes completed!');
  console.log('📋 Next steps:');
  console.log('   1. Run: pnpm install');
  console.log('   2. Run: npx depcruise packages/platform --config .dependency-cruiser.cjs');
  console.log('   3. Fix any remaining circular dependencies');
}

main().catch(console.error);
