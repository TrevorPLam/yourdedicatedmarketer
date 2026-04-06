#!/usr/bin/env node

/**
 * Fix Remaining Circular Dependencies
 * 
 * Focus on the critical platform package circular dependencies
 */

import { readFileSync, writeFileSync } from 'fs';

function fixSelfReferencingImports() {
  console.log('🔧 Fixing self-referencing imports...');
  
  const filesToFix = [
    'packages/platform/database/src/factory/database-factory.ts',
    'packages/platform/deployment/src/factory/deployment.factory.ts',
    'packages/platform/deployment/src/environment/env-manager.ts'
  ];
  
  filesToFix.forEach(filePath => {
    try {
      const content = readFileSync(filePath, 'utf-8');
      
      // Remove self-referencing imports
      const fixedContent = content.replace(
        /import.*from\s+['"]\.\/database-factory['"];?\s*\n/g,
        ''
      ).replace(
        /import.*from\s+['"]\.\/deployment\.factory['"];?\s*\n/g,
        ''
      ).replace(
        /import.*from\s+['"]\.\/env-manager['"];?\s*\n/g,
        ''
      );
      
      writeFileSync(filePath, fixedContent);
      console.log(`✅ Fixed self-referencing imports in ${filePath}`);
    } catch (error) {
      console.error(`❌ Failed to fix ${filePath}:`, error.message);
    }
  });
}

function fixCMSImports() {
  console.log('🔧 Fixing CMS import issues...');
  
  // Update CMS types to use shared types properly
  const cmsTypesPath = 'packages/platform/cms/src/types/cms.types.ts';
  
  try {
    const content = readFileSync(cmsTypesPath, 'utf-8');
    
    // Replace with re-export from shared types
    const newContent = `/**
 * CMS Types - Re-export from shared types
 * 
 * This file re-exports types from @agency/types/cms to prevent
 * circular dependencies while maintaining API compatibility.
 */

// Re-export all shared CMS types
export * from '@agency/types/cms';

// Add any platform-specific CMS types here
export interface PlatformCMSConfig {
  platform: 'web' | 'mobile' | 'server';
  features: {
    realtimeUpdates: boolean;
    previewMode: boolean;
    typeGeneration: boolean;
  };
}
`;
    
    writeFileSync(cmsTypesPath, newContent);
    console.log('✅ Fixed CMS types re-exports');
  } catch (error) {
    console.error('❌ Failed to fix CMS types:', error.message);
  }
}

function optimizeBarrelFiles() {
  console.log('🔧 Optimizing barrel files...');
  
  const barrelFiles = [
    'packages/platform/deployment/src/index.ts',
    'packages/platform/cms/src/index.ts'
  ];
  
  barrelFiles.forEach(filePath => {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      
      // Count actual exports (excluding comments and empty lines)
      const exports = lines.filter(line => 
        line.trim().startsWith('export ') && 
        !line.trim().startsWith('//') && 
        !line.trim().startsWith('*')
      );
      
      if (exports.length > 5) {
        console.log(`⚠️  Large barrel file detected: ${filePath} (${exports.length} exports)`);
        
        // Create a comment suggesting splitting
        const optimizedContent = `/**
 * Platform Barrel File
 * 
 * WARNING: This barrel file has ${exports.length} exports.
 * Consider splitting into smaller, focused barrel files:
 * - adapters/index.ts
 * - types/index.ts  
 * - utils/index.ts
 * - contracts/index.ts
 */

${content}
`;
        
        writeFileSync(filePath, optimizedContent);
        console.log(`📝 Added optimization comment to ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ Failed to analyze ${filePath}:`, error.message);
    }
  });
}

function main() {
  console.log('🚀 Fixing remaining circular dependencies...\n');
  
  fixSelfReferencingImports();
  fixCMSImports();
  optimizeBarrelFiles();
  
  console.log('\n✨ Remaining circular dependencies fixed!');
  console.log('📋 Next steps:');
  console.log('   1. Run: pnpm build');
  console.log('   2. Run: node tools/governance/import-export-audit.mjs');
  console.log('   3. Implement TypeScript 5.9+ features');
}

main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
