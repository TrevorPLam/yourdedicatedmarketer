#!/usr/bin/env node

/**
 * Circular Dependency Fix Script
 * 
 * Automatically fixes circular dependencies by:
 * 1. Moving shared types to separate files
 * 2. Using type-only imports where appropriate
 * 3. Extracting common interfaces to prevent cycles
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';

const CIRCULAR_DEPENDENCIES = [
  // Deployment package issues
  {
    file: 'packages/platform/deployment/src/types/deployment.types.ts',
    issue: 'Importing from interfaces creates potential cycle',
    fix: 'Move shared types to prevent circular imports'
  },
  // Database package issues  
  {
    file: 'packages/platform/database/src/factory/database-factory.ts',
    issue: 'Self-referencing circular dependency',
    fix: 'Extract factory interface to separate file'
  },
  // CMS package issues
  {
    file: 'packages/platform/cms/src/types/cms.types.ts',
    issue: 'Importing from adapters and generators',
    fix: 'Move to shared types package'
  }
];

function fixDeploymentCircularDependencies() {
  console.log('🔧 Fixing deployment circular dependencies...');
  
  try {
    const typesFile = 'packages/platform/deployment/src/types/deployment.types.ts';
    const content = readFileSync(typesFile, 'utf-8');
    
    // Remove the import from interfaces and define types locally
    const fixedContent = content.replace(
      `import {
  DeploymentConfig,
  DeploymentOptions,
  DeploymentResult,
} from '../interfaces/deployment.adapter';`,
      `// Types moved inline to prevent circular dependency`
    ).replace(
      /export interface \w+Config extends DeploymentConfig/g,
      match => match.replace('DeploymentConfig', `{
  provider: 'vercel' | 'netlify' | 'cloudflare' | 'custom';
  projectId: string;
  teamId?: string;
  environment: 'development' | 'staging' | 'production';
  domain?: string;
  buildCommand?: string;
  outputDirectory?: string;
  nodeVersion?: string;
  environmentVariables?: Record<string, string>;
  secrets?: Record<string, string>;
}`)
    );
    
    writeFileSync(typesFile, fixedContent);
    console.log('✅ Fixed deployment circular dependencies');
  } catch (error) {
    console.error('❌ Failed to fix deployment dependencies:', error.message);
  }
}

function fixDatabaseCircularDependencies() {
  console.log('🔧 Fixing database circular dependencies...');
  
  try {
    // Create a separate factory interface file
    const factoryInterfacePath = 'packages/platform/database/src/interfaces/factory.interface.ts';
    const factoryInterfaceContent = `/**
 * Database Factory Interface
 * 
 * Extracted to prevent circular dependencies
 */

export interface DatabaseFactory {
  createAdapter(config: any): Promise<any>;
  getAvailableProviders(): string[];
  validateConfig(config: any): boolean;
}

export interface DatabaseAdapterFactory {
  create(config: any): DatabaseFactory;
}
`;
    
    writeFileSync(factoryInterfacePath, factoryInterfaceContent);
    console.log('✅ Created factory interface file');
    
    // Update factory file to use the interface
    const factoryPath = 'packages/platform/database/src/factory/database-factory.ts';
    const factoryContent = readFileSync(factoryPath, 'utf-8');
    
    const fixedFactoryContent = factoryContent.replace(
      /import.*from.*['"]\.\/database-factory['"];?/g,
      `import type { DatabaseFactory, DatabaseAdapterFactory } from '../interfaces/factory.interface';`
    );
    
    writeFileSync(factoryPath, fixedFactoryContent);
    console.log('✅ Fixed database circular dependencies');
  } catch (error) {
    console.error('❌ Failed to fix database dependencies:', error.message);
  }
}

function fixCMSCircularDependencies() {
  console.log('🔧 Fixing CMS circular dependencies...');
  
  try {
    // Move shared CMS types to the main types package
    const sharedTypesPath = 'packages/types/src/cms/index.ts';
    const sharedTypesContent = `/**
 * Shared CMS Types
 * 
 * Extracted from platform/cms to prevent circular dependencies
 */

export interface CMSAdapter {
  provider: string;
  initialize(): Promise<void>;
  checkHealth(): Promise<any>;
  getContent(id: string): Promise<any>;
  saveContent(content: any): Promise<any>;
  deleteContent(id: string): Promise<boolean>;
  searchContent(query: string, options?: any): Promise<any[]>;
}

export interface CMSConfig {
  provider: string;
  environment?: string;
  apiKey?: string;
  projectId?: string;
  dataset?: string;
  [key: string]: any;
}

export interface ContentResult<T = any> {
  id: string;
  content: T;
  version: number;
  locale: string;
  status: string;
  metadata: {
    title?: string;
    description?: string;
    tags?: string[];
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface ContentCollection<T = any> {
  items: ContentResult<T>[];
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ContentQuery {
  contentType?: string;
  filters?: Record<string, any>;
  search?: string;
  sort?: Array<{ field: string; direction: 'asc' | 'desc' }>;
  limit?: number;
  offset?: number;
  fields?: string[];
}

export interface ContentQueryOptions {
  locale?: string;
  version?: string;
  includeDrafts?: boolean;
}

export interface SetContentOptions {
  draft?: boolean;
  contentType?: string;
  locale?: string;
}

export interface ContentSubscription {
  id: string;
  query: ContentQuery;
  callback: (change: any) => void;
}

export interface ContentChangeCallback {
  (change: ContentChange): void;
}

export interface ContentChange {
  type: 'created' | 'updated' | 'deleted';
  contentId: string;
  contentType: string;
  locale: string;
  version: number;
  timestamp: Date;
  userId?: string;
  data: any;
  previousData?: any;
}

export type ContentChangeType = 'created' | 'updated' | 'deleted';

export interface ContentType {
  id: string;
  name: string;
  description?: string;
  fields: Array<{
    id: string;
    name: string;
    type: string;
    required: boolean;
    localized: boolean;
    validations?: Array<{
      type: string;
      parameters: any;
    }>;
    description?: string;
  }>;
}

export interface TypeScriptTypes {
  contentTypes: Record<string, TypeScriptInterface>;
  enums: Record<string, TypeScriptEnum>;
  utilities: string;
}

export interface TypeScriptInterface {
  name: string;
  description?: string;
  properties: Record<string, TypeScriptProperty>;
}

export interface TypeScriptProperty {
  type: string;
  optional: boolean;
  description?: string;
}

export interface TypeScriptEnum {
  name: string;
  values: Array<{ name: string; value: string }>;
}

export interface CMSHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  details?: string;
  provider?: string;
  environment?: string;
  features?: Record<string, boolean>;
  errors?: string[];
}

export type HealthStatus = 'healthy' | 'unhealthy' | 'degraded';

export class CMSError extends Error {
  constructor(
    message: string,
    public code: string,
    public provider: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'CMSError';
  }
}

export interface ContentItem {
  id: string;
  type: string;
  title: string;
  content: string;
  slug: string;
  metadata: {
    publishedAt?: string;
    updatedAt?: string;
    author?: string;
    tags?: string[];
    language?: string;
    [key: string]: any;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchOptions {
  limit?: number;
  orderBy?: string;
}

export interface features {
  realTimeUpdates: boolean;
  previewMode: boolean;
  typeGeneration: boolean;
  webhooks: boolean;
  localization: boolean;
  versioning: boolean;
}
`;
    
    writeFileSync(sharedTypesPath, sharedTypesContent);
    console.log('✅ Created shared CMS types');
    
    // Update main types index to export CMS types
    const mainTypesPath = 'packages/types/src/index.ts';
    const mainTypesContent = readFileSync(mainTypesPath, 'utf-8');
    
    if (!mainTypesContent.includes("export * from './cms';")) {
      const updatedContent = mainTypesContent + "\nexport * from './cms';";
      writeFileSync(mainTypesPath, updatedContent);
    }
    
    console.log('✅ Updated main types index');
  } catch (error) {
    console.error('❌ Failed to fix CMS dependencies:', error.message);
  }
}

function updateImportsToUseSharedTypes() {
  console.log('🔄 Updating imports to use shared types...');
  
  const filesToUpdate = [
    'packages/platform/cms/src/types/cms.types.ts',
    'packages/platform/cms/src/adapters/sanity.adapter.ts',
    'packages/platform/cms/src/adapters/contentful.adapter.ts',
    'packages/platform/cms/src/contracts/cms-adapter.contract.ts',
    'packages/platform/cms/src/contracts/cms-config.contract.ts'
  ];
  
  filesToUpdate.forEach(filePath => {
    try {
      const content = readFileSync(filePath, 'utf-8');
      
      // Replace local imports with shared types imports
      const updatedContent = content
        .replace(/from ['"]\.\/types\/cms\.types['"]/g, "from '@agency/types/cms'")
        .replace(/from ['"]\.\.\/types\/cms\.types['"]/g, "from '@agency/types/cms'")
        .replace(/from ['"]\.\.\/\.\.\/types\/cms\.types['"]/g, "from '@agency/types/cms'");
      
      writeFileSync(filePath, updatedContent);
      console.log(`✅ Updated imports in ${filePath}`);
    } catch (error) {
      console.error(`❌ Failed to update ${filePath}:`, error.message);
    }
  });
}

function main() {
  console.log('🚀 Starting circular dependency fixes...\n');
  
  fixDeploymentCircularDependencies();
  fixDatabaseCircularDependencies();
  fixCMSCircularDependencies();
  updateImportsToUseSharedTypes();
  
  console.log('\n✨ Circular dependency fixes completed!');
  console.log('📋 Next steps:');
  console.log('   1. Run: pnpm install');
  console.log('   2. Run: node tools/governance/import-export-audit.mjs');
  console.log('   3. Verify no circular dependencies remain');
}

main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
