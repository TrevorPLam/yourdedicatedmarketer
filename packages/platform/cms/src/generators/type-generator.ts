/**
 * Content Type Generator
 * Generates TypeScript types from CMS schemas
 */

import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';

import type { CMSAdapter } from '../interfaces/cms.adapter';
import type { TypeScriptTypes, ContentType, FieldType } from '../types/cms.types';

// ============================================================================
// Type Generator Configuration
// ============================================================================

export interface TypeGeneratorConfig {
  outputDir: string;
  fileName?: string;
  includeUtilities?: boolean;
  includeEnums?: boolean;
  exportInterfaces?: boolean;
  exportTypes?: boolean;
  prefix?: string;
  suffix?: string;
  strict?: boolean;
  optionalFields?: boolean;
}

// ============================================================================
// Main Type Generator Class
// ============================================================================

export class ContentTypeGenerator {
  private config: TypeGeneratorConfig;

  constructor(config: TypeGeneratorConfig) {
    this.config = {
      fileName: 'cms.types.ts',
      includeUtilities: true,
      includeEnums: true,
      exportInterfaces: true,
      exportTypes: true,
      strict: true,
      optionalFields: false,
      prefix: '',
      suffix: '',
      ...config,
    };
  }

  // ============================================================================
  // Public Methods
  // ============================================================================

  async generateTypes(adapter: CMSAdapter): Promise<void> {
    try {
      const types = await adapter.generateTypes();
      const contentTypes = await adapter.getContentTypes();

      const generatedCode = this.buildTypeFile(types, contentTypes);

      await this.writeTypeFile(generatedCode);

      console.log(
        `✅ TypeScript types generated: ${this.config.outputDir}/${this.config.fileName}`
      );
    } catch (error) {
      console.error('❌ Failed to generate TypeScript types:', error);
      throw error;
    }
  }

  async generateTypesFromSchema(schema: any, contentTypes: ContentType[]): Promise<string> {
    const types = this.processSchema(schema);
    return this.buildTypeFile(types, contentTypes);
  }

  // ============================================================================
  // Type File Building
  // ============================================================================

  private buildTypeFile(types: TypeScriptTypes, contentTypes: ContentType[]): string {
    const sections: string[] = [];

    // Add header
    sections.push(this.generateHeader());

    // Add imports
    sections.push(this.generateImports());

    // Add enums
    if (this.config.includeEnums && Object.keys(types.enums).length > 0) {
      sections.push(this.generateEnums(types.enums));
    }

    // Add base interfaces
    sections.push(this.generateBaseInterfaces());

    // Add content type interfaces
    sections.push(this.generateContentTypeInterfaces(types.contentTypes));

    // Add utility types
    if (this.config.includeUtilities) {
      sections.push(this.generateUtilityTypes());
    }

    // Add helper functions
    sections.push(this.generateHelperFunctions(contentTypes));

    return sections.join('\n\n');
  }

  private generateHeader(): string {
    const timestamp = new Date().toISOString();
    return `/**
 * Generated CMS TypeScript Types
 * Generated on: ${timestamp}
 * 
 * ⚠️ DO NOT EDIT MANUALLY - This file is auto-generated
 * Run the type generator to update this file
 */

${this.config.strict ? '"use strict";\n\n' : ''}`;
  }

  private generateImports(): string {
    const imports: string[] = [];

    if (this.config.includeUtilities) {
      imports.push(`import { z } from 'zod';`);
    }

    return imports.join('\n');
  }

  private generateEnums(enums: Record<string, any>): string {
    const enumDeclarations: string[] = [];

    for (const [name, enumDef] of Object.entries(enums)) {
      const enumName = this.config.prefix + name + this.config.suffix;
      const values = enumDef.values || {};

      const valuePairs = Object.entries(values)
        .map(([key, value]) => `  ${key} = ${typeof value === 'string' ? `"${value}"` : value},`)
        .join('\n');

      enumDeclarations.push(`export enum ${enumName} {\n${valuePairs}\n}`);
    }

    return enumDeclarations.join('\n\n');
  }

  private generateBaseInterfaces(): string {
    return `// ============================================================================
// Base CMS Interfaces
// ============================================================================

export interface BaseCMSDocument {
  id: string;
  version: number;
  locale: string;
  status: ContentStatus;
  metadata: ContentMetadata;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface ContentMetadata {
  title?: string;
  description?: string;
  tags?: string[];
  author?: string;
  category?: string;
  seo?: SEOMetadata;
}

export interface SEOMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

export interface ContentQuery {
  contentType?: string;
  locale?: string;
  filters?: Record<string, any>;
  sort?: SortOption[];
  search?: string;
  fields?: string[];
  limit?: number;
  offset?: number;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}`;
  }

  private generateContentTypeInterfaces(contentTypes: Record<string, any>): string {
    const interfaces: string[] = [];

    for (const [typeName, typeDef] of Object.entries(contentTypes)) {
      const interfaceName = this.config.prefix + this.toPascalCase(typeName) + this.config.suffix;
      const properties = typeDef.properties || {};

      const propertyDeclarations = Object.entries(properties)
        .map(([propName, propDef]: [string, any]) => {
          const optional = this.config.optionalFields || !propDef.required;
          const type = propDef.type || 'any';
          const description = propDef.description ? `\n  /** ${propDef.description} */` : '';
          return `${description}\n  ${propName}${optional ? '?' : ''}: ${type};`;
        })
        .join('\n\n');

      const extendsClause =
        typeDef.extends && typeDef.extends.length > 0
          ? ` extends ${typeDef.extends.join(', ')}`
          : '';

      interfaces.push(
        `export interface ${interfaceName}${extendsClause} {\n${propertyDeclarations}\n}`
      );
    }

    return interfaces.join('\n\n');
  }

  private generateUtilityTypes(): string {
    return `// ============================================================================
// Utility Types
// ============================================================================

export type ContentResult<T = any> = T & BaseCMSDocument;

export interface ContentCollection<T = any> {
  items: ContentResult<T>[];
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export type ContentChangeCallback = (change: ContentChange) => void | Promise<void>;

export interface ContentChange {
  type: ContentChangeType;
  contentId: string;
  contentType: string;
  locale: string;
  version: number;
  timestamp: Date;
  userId?: string;
  data?: any;
  previousData?: any;
}

export enum ContentChangeType {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
  PUBLISHED = 'published',
  UNPUBLISHED = 'unpublished',
}

// ============================================================================
// Zod Schemas for Validation
// ============================================================================

export const baseDocumentSchema = z.object({
  id: z.string(),
  version: z.number(),
  locale: z.string(),
  status: z.enum(['draft', 'published', 'archived', 'deleted']),
  metadata: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    category: z.string().optional(),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      ogImage: z.string().optional(),
      canonicalUrl: z.string().optional(),
    }).optional(),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
  publishedAt: z.date().optional(),
});

export const contentQuerySchema = z.object({
  contentType: z.string().optional(),
  locale: z.string().optional(),
  filters: z.record(z.any()).optional(),
  sort: z.array(z.object({
    field: z.string(),
    direction: z.enum(['asc', 'desc']),
  })).optional(),
  search: z.string().optional(),
  fields: z.array(z.string()).optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});`;
  }

  private generateHelperFunctions(contentTypes: ContentType[]): string {
    return `// ============================================================================
// Helper Functions
// ============================================================================

export function isContentStatus(status: string): status is ContentStatus {
  return Object.values(ContentStatus).includes(status as ContentStatus);
}

export function createContentQuery<T = any>(query: Partial<ContentQuery>): ContentQuery {
  return {
    limit: 100,
    offset: 0,
    ...query,
  };
}

export function validateContent<T>(content: any, schema: z.ZodSchema<T>): T {
  return schema.parse(content);
}

export function createSortOption(field: string, direction: 'asc' | 'desc' = 'asc'): SortOption {
  return { field, direction };
}

export function createSortOptions(options: Record<string, 'asc' | 'desc'>): SortOption[] {
  return Object.entries(options).map(([field, direction]) => ({ field, direction }));
}

// ============================================================================
// Type Guards
// ============================================================================

${this.generateTypeGuards(contentTypes)}

// ============================================================================
// Content Type Factory Functions
// ============================================================================

${this.generateFactoryFunctions(contentTypes)}`;
  }

  private generateTypeGuards(contentTypes: ContentType[]): string {
    const guards: string[] = [];

    for (const contentType of contentTypes) {
      const typeName = this.config.prefix + this.toPascalCase(contentType.id) + this.config.suffix;
      const guardName = `is${typeName}`;

      guards.push(`export function ${guardName}(obj: any): obj is ${typeName} {
  if (!obj || typeof obj !== 'object') return false;
  
  // Check for required fields
  const requiredFields = ${JSON.stringify(contentType.fields.filter((f) => f.required).map((f) => f.id))};
  return requiredFields.every(field => field in obj);
}`);
    }

    return guards.join('\n\n');
  }

  private generateFactoryFunctions(contentTypes: ContentType[]): string {
    const factories: string[] = [];

    for (const contentType of contentTypes) {
      const typeName = this.config.prefix + this.toPascalCase(contentType.id) + this.config.suffix;
      const factoryName = `create${typeName}`;

      const requiredFields = contentType.fields.filter((f) => f.required);
      const optionalFields = contentType.fields.filter((f) => !f.required);

      const requiredParams = requiredFields
        .map((f) => `${f.id}: ${this.mapFieldTypeToTS(f.type)}`)
        .join(', ');
      const optionalParams = optionalFields
        .map((f) => `${f.id}?: ${this.mapFieldTypeToTS(f.type)}`)
        .join(', ');

      const allParams = [requiredParams, optionalParams].filter(Boolean).join(', ');

      factories.push(`export function ${factoryName}(${allParams}): ${typeName} {
  return {
    id: crypto.randomUUID(),
    version: 1,
    locale: 'en-US',
    status: ContentStatus.DRAFT,
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    ${requiredFields.map((f) => `${f.id},`).join('\n    ')}
    ${optionalFields.map((f) => `${f.id},`).join('\n    ')}
  };
}`);
    }

    return factories.join('\n\n');
  }

  private mapFieldTypeToTS(fieldType: string): string {
    const typeMap: Record<string, string> = {
      text: 'string',
      rich_text: 'any',
      number: 'number',
      boolean: 'boolean',
      date: 'string',
      datetime: 'string',
      asset: 'any',
      reference: 'any',
      array: 'any[]',
      object: 'Record<string, any>',
      location: '{ lat: number; lng: number; }',
      json: 'any',
    };

    return typeMap[fieldType] || 'any';
  }

  // ============================================================================
  // Schema Processing
  // ============================================================================

  private processSchema(schema: any): TypeScriptTypes {
    // Process GraphQL schema or other schema format
    // This is a simplified implementation
    return {
      contentTypes: {},
      enums: {},
      utilities: '',
    };
  }

  // ============================================================================
  // File Operations
  // ============================================================================

  private async writeTypeFile(content: string): Promise<void> {
    const filePath = join(this.config.outputDir, this.config.fileName!);

    // Ensure directory exists
    await mkdir(dirname(filePath), { recursive: true });

    // Write file
    await writeFile(filePath, content, 'utf-8');
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  private toPascalCase(str: string): string {
    return str
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }
}

// ============================================================================
// Default Generator Instance
// ============================================================================

export const defaultTypeGenerator = new ContentTypeGenerator({
  outputDir: './src/types/generated',
  fileName: 'cms.types.ts',
  includeUtilities: true,
  includeEnums: true,
  strict: true,
});

// ============================================================================
// Convenience Functions
// ============================================================================

export async function generateCMSTypes(
  adapter: CMSAdapter,
  config?: Partial<TypeGeneratorConfig>
): Promise<void> {
  const generator = config ? new ContentTypeGenerator(config) : defaultTypeGenerator;

  await generator.generateTypes(adapter);
}

export async function generateCMSTypesFromSchema(
  schema: any,
  contentTypes: ContentType[],
  config?: Partial<TypeGeneratorConfig>
): Promise<string> {
  const generator = config ? new ContentTypeGenerator(config) : defaultTypeGenerator;

  return generator.generateTypesFromSchema(schema, contentTypes);
}
