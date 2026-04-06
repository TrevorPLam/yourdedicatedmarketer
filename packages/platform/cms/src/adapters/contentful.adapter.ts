/**
 * Contentful CMS adapter
 * Implements Contentful-specific operations using GraphQL and REST APIs
 */

import { createClient, ContentfulClientApi, Entry, EntryCollection, Asset, ContentType as ContentfulContentType,  } from 'contentful';
import { GraphQLClient, gql } from 'graphql-request';
import { CMSAdapter } from '../contracts/cms-adapter.contract';
import type { ContentfulConfig } from '../contracts/cms-config.contract';
import type {
  ContentResult,
  ContentCollection,
  ContentQuery,
  ContentQueryOptions,
  SetContentOptions,
  ContentSubscription,
  ContentChangeCallback,
  ContentChange,
  ContentChangeType,
  ContentType,
  TypeScriptTypes,
  CMSHealth,
  HealthStatus,
  CMSError,
} from '@agency/types/cms';

// ============================================================================
// Contentful Adapter Implementation
// ============================================================================

export class ContentfulAdapter implements CMSAdapter {
  public readonly provider = 'contentful' as const;
  private client: ContentfulClientApi | null = null;
  private previewClient: ContentfulClientApi | null = null;
  private graphqlClient: GraphQLClient | null = null;
  private contentTypes: Map<string, ContentfulContentType> = new Map();

  constructor(private config: ContentfulConfig) {}

  // ============================================================================
  // Lifecycle Implementation
  // ============================================================================

  async initialize(): Promise<void> {
    const cfConfig = this.config as ContentfulConfig;

    // Create main client
    this.client = createClient({
      space: cfConfig.spaceId,
      accessToken: cfConfig.accessToken,
      environment: cfConfig.environment || 'master',
      host: cfConfig.host,
      basePath: cfConfig.basePath,
      httpAgent: cfConfig.httpAgent,
      httpsAgent: cfConfig.httpsAgent,
      proxy: cfConfig.proxy,
      resolveLinks: cfConfig.resolveLinks,
      removeUnresolved: cfConfig.removeUnresolved,
      includeContentSource: cfConfig.includeContentSource,
    });

    // Create preview client if preview token is provided
    if (cfConfig.previewAccessToken) {
      this.previewClient = createClient({
        space: cfConfig.spaceId,
        accessToken: cfConfig.previewAccessToken,
        environment: cfConfig.environment || 'master',
        host: 'preview.contentful.com',
      });
    }

    // Create GraphQL client
    const graphqlUrl = `https://graphql.contentful.com/content/v1/spaces/${cfConfig.spaceId}`;
    this.graphqlClient = new GraphQLClient(graphqlUrl, {
      headers: {
        Authorization: `Bearer ${cfConfig.accessToken}`,
      },
    });

    // Cache content types
    await this.cacheContentTypes();
  }

  async checkHealth(): Promise<CMSHealth> {
    // Test connection by fetching space info
    if (!this.client) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        details: 'Contentful client not initialized',
      };
    }

    try {
      await this.client.getSpace();
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        details: 'Contentful connection successful',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        details: `Contentful connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // ============================================================================
// Content Operations Implementation
// ============================================================================

async getContent(id: string): Promise<ContentItem | null> {
  if (!this.client) {
    throw new CMSError('Contentful client not initialized', 'CLIENT_NOT_INITIALIZED', this.provider);
  }

  try {
    const entry = await this.client.getEntry(id);
    return this.transformContentfulEntry(entry);
  } catch (error) {
    this.handleError(error, 'Get content');
    return null;
  }
}

async getContentByType(type: ContentType, options?: SearchOptions): Promise<ContentItem[]> {
  if (!this.client) {
    throw new CMSError('Contentful client not initialized', 'CLIENT_NOT_INITIALIZED', this.provider);
  }

  try {
    const entries = await this.client.getEntries({
      content_type: type,
      limit: options?.limit,
      order: options?.orderBy,
    });

    return entries.items.map(entry => this.transformContentfulEntry(entry));
  } catch (error) {
    this.handleError(error, 'Get content by type');
    throw error;
  }
}

async saveContent(content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentItem> {
  if (!this.client) {
    throw new CMSError('Contentful client not initialized', 'CLIENT_NOT_INITIALIZED', this.provider);
  }

  try {
    const contentfulFields = this.transformToContentfulFields(content);
    const entry = await this.client.createEntry(content.type, {
      fields: contentfulFields,
    });

    return this.transformContentfulEntry(entry);
  } catch (error) {
    this.handleError(error, 'Save content');
    throw error;
  }
}

async deleteContent(id: string): Promise<boolean> {
  if (!this.client) {
    throw new CMSError('Contentful client not initialized', 'CLIENT_NOT_INITIALIZED', this.provider);
  }

  try {
    await this.client.deleteEntry(id);
    return true;
  } catch (error) {
    this.handleError(error, 'Delete content');
    return false;
  }
}

async searchContent(query: string, options?: SearchOptions): Promise<ContentItem[]> {
  if (!this.client) {
    throw new CMSError('Contentful client not initialized', 'CLIENT_NOT_INITIALIZED', this.provider);
  }

  try {
    const entries = await this.client.getEntries({
      query: query,
      limit: options?.limit,
    });

    return entries.items.map(entry => this.transformContentfulEntry(entry));
  } catch (error) {
    this.handleError(error, 'Search content');
    throw error;
  }
}

private transformContentfulEntry(entry: any): ContentItem {
  return {
    id: entry.sys.id,
    type: entry.sys.contentType.sys.id as ContentType,
    title: entry.fields.title || entry.fields.name || '',
    content: entry.fields.content || entry.fields.description || '',
    slug: entry.fields.slug || '',
    metadata: {
      publishedAt: entry.sys.publishedAt,
      updatedAt: entry.sys.updatedAt,
      author: entry.fields.author,
      tags: entry.fields.tags || [],
      language: entry.sys.locale || 'en',
    },
    status: entry.sys.publishedVersion ? 'published' : 'draft',
    createdAt: entry.sys.createdAt,
    updatedAt: entry.sys.updatedAt,
  };
}

private transformToContentfulFields(content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): any {
  return {
    title: {
      'en-US': content.title,
    },
    content: {
      'en-US': content.content,
    },
    slug: {
      'en-US': content.slug,
    },
    status: {
      'en-US': content.status,
    },
    author: content.metadata?.author ? {
      'en-US': content.metadata.author,
    } : undefined,
    tags: content.metadata?.tags ? {
      'en-US': content.metadata.tags,
    } : undefined,
  };
}

protected async doDisconnect(): Promise<void> {
    this.client = null;
    this.previewClient = null;
    this.graphqlClient = null;
    this.contentTypes.clear();
  }

  // ============================================================================
  // Content Operations Implementation
  // ============================================================================

  protected async doGetContent<T>(
    id: string,
    options: ContentQueryOptions = {}
  ): Promise<ContentResult<T>> {
    const client = this.getClient(options.preview);

    try {
      const entry = await client.getEntry<T>(id, {
        locale: options.locale || '*',
        include: options.depth || 2,
      });

      return this.transformEntry(entry);
    } catch (error) {
      this.handleError(error, `Get content: ${id}`);
    }
  }

  protected async doQueryContent<T>(
    query: ContentQuery,
    options: ContentQueryOptions = {}
  ): Promise<ContentCollection<T>> {
    const client = this.getClient(options.preview);

    try {
      const queryOptions: any = {
        locale: query.locale || '*',
        include: options.depth || 2,
        limit: query.limit || 100,
        skip: query.offset || 0,
      };

      // Add content type filter
      if (query.contentType) {
        queryOptions.content_type = query.contentType;
      }

      // Add filters
      if (query.filters) {
        Object.assign(queryOptions, this.transformFilters(query.filters));
      }

      // Add search
      if (query.search) {
        queryOptions.query = query.search;
      }

      // Add sorting
      if (query.sort && query.sort.length > 0) {
        queryOptions.order = query.sort
          .map((s) => `${s.field}${s.direction === 'desc' ? '.desc' : ''}`)
          .join(',');
      }

      const collection = await client.getEntries<T>(queryOptions);

      return {
        items: collection.items.map((item) => this.transformEntry(item)),
        total: collection.total,
        limit: collection.limit,
        offset: collection.skip,
        hasNext: collection.skip + collection.limit < collection.total,
        hasPrev: collection.skip > 0,
      };
    } catch (error) {
      this.handleError(error, 'Query content');
    }
  }

  protected async doSetContent<T>(
    id: string,
    content: T,
    options: SetContentOptions = {}
  ): Promise<ContentResult<T>> {
    if (!this.client) {
      throw new CMSError(
        'Contentful client not available for write operations',
        'CLIENT_NOT_AVAILABLE',
        this.provider
      );
    }

    try {
      let entry: Entry<T>;

      if (id === 'new') {
        // Create new entry
        const contentType = query.contentType;
        if (!contentType) {
          throw new CMSError(
            'Content type is required for creating new entries',
            'MISSING_CONTENT_TYPE',
            this.provider
          );
        }

        entry = await this.client.createEntry(contentType, content);
      } else {
        // Update existing entry
        const existingEntry = await this.client.getEntry<T>(id);
        Object.assign(existingEntry.fields, content);
        entry = await existingEntry.update();
      }

      // Publish if not draft
      if (!options.draft) {
        entry = await entry.publish();
      }

      return this.transformEntry(entry);
    } catch (error) {
      this.handleError(error, `Set content: ${id}`);
    }
  }

  protected async doDeleteContent(id: string): Promise<boolean> {
    if (!this.client) {
      throw new CMSError(
        'Contentful client not available for delete operations',
        'CLIENT_NOT_AVAILABLE',
        this.provider
      );
    }

    try {
      const entry = await this.client.getEntry(id);
      await entry.unpublish();
      await entry.delete();
      return true;
    } catch (error) {
      this.handleError(error, `Delete content: ${id}`);
    }
  }

  // ============================================================================
  // Real-time Operations Implementation
  // ============================================================================

  protected async doSubscribe(
    query: ContentQuery,
    callback: ContentChangeCallback
  ): Promise<ContentSubscription> {
    // Contentful doesn't support real-time subscriptions via API
    // This would typically be implemented via webhooks
    throw new CMSError(
      'Real-time subscriptions not supported by Contentful API. Use webhooks instead.',
      'NOT_SUPPORTED',
      this.provider
    );
  }

  protected async doUnsubscribe(subscription: ContentSubscription): Promise<void> {
    // No-op since subscriptions aren't supported
  }

  // ============================================================================
  // Schema and Type Operations Implementation
  // ============================================================================

  protected async doGetContentTypes(): Promise<ContentType[]> {
    if (!this.client) {
      throw new CMSError('Contentful client not available', 'CLIENT_NOT_AVAILABLE', this.provider);
    }

    try {
      const contentfulTypes = await this.client.getContentTypes();
      return contentfulTypes.map((type) => this.transformContentType(type));
    } catch (error) {
      this.handleError(error, 'Get content types');
    }
  }

  protected async doGenerateTypes(): Promise<TypeScriptTypes> {
    if (!this.graphqlClient) {
      throw new CMSError('GraphQL client not available', 'CLIENT_NOT_AVAILABLE', this.provider);
    }

    try {
      // Fetch GraphQL schema introspection
      const query = gql`
        {
          __schema {
            types {
              name
              kind
              description
              fields {
                name
                type {
                  name
                  kind
                  ofType {
                    name
                    kind
                    ofType {
                      name
                      kind
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const schema = await this.graphqlClient.request(query);
      return this.generateTypeScriptFromSchema(schema);
    } catch (error) {
      this.handleError(error, 'Generate types');
    }
  }

  // ============================================================================
  // Health Check Implementation
  // ============================================================================

  protected async doHealthCheck(): Promise<Omit<CMSHealth, 'latency' | 'timestamp'>> {
    try {
      if (!this.client) {
        throw new Error('Client not initialized');
      }

      const startTime = Date.now();
      await this.client.getSpace();
      const latency = Date.now() - startTime;

      let status: HealthStatus = 'healthy';
      if (latency > 1000) {
        status = 'degraded';
      } else if (latency > 5000) {
        status = 'unhealthy';
      }

      return {
        status,
        provider: this.provider,
        environment: this.config.environment || 'master',
        features: await this.getFeatures(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        provider: this.provider,
        environment: this.config.environment || 'master',
        features: await this.getFeatures(),
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  protected async getFeatures(): Promise<features> {
    return {
      realTimeUpdates: false, // Contentful uses webhooks instead
      previewMode: !!this.previewClient,
      typeGeneration: true,
      webhooks: true,
      localization: true,
      versioning: true,
    };
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private getClient(preview = false): ContentfulClientApi {
    if (preview && this.previewClient) {
      return this.previewClient;
    }
    if (!this.client) {
      throw new CMSError(
        'Contentful client not initialized',
        'CLIENT_NOT_INITIALIZED',
        this.provider
      );
    }
    return this.client;
  }

  private async cacheContentTypes(): Promise<void> {
    if (!this.client) return;

    try {
      const types = await this.client.getContentTypes();
      types.forEach((type) => {
        this.contentTypes.set(type.sys.id, type);
      });
    } catch (error) {
      console.warn('Failed to cache content types:', error);
    }
  }

  private transformEntry<T>(entry: Entry<T>): ContentResult<T> {
    return {
      id: entry.sys.id,
      content: entry.fields,
      version: entry.sys.version || 1,
      locale: entry.sys.locale || 'en-US',
      status: this.getContentStatus(entry),
      metadata: {
        title: this.extractTitle(entry),
        description: this.extractDescription(entry),
        tags: this.extractTags(entry),
      },
      createdAt: new Date(entry.sys.createdAt),
      updatedAt: new Date(entry.sys.updatedAt),
      publishedAt: entry.sys.publishedAt ? new Date(entry.sys.publishedAt) : undefined,
    };
  }

  private getContentStatus(entry: Entry<any>): import('../types/cms.types').ContentStatus {
    if (!entry.sys.publishedVersion) {
      return import('../types/cms.types').ContentStatus.DRAFT;
    }
    if (entry.sys.archivedVersion) {
      return import('../types/cms.types').ContentStatus.ARCHIVED;
    }
    return import('../types/cms.types').ContentStatus.PUBLISHED;
  }

  private extractTitle(entry: Entry<any>): string | undefined {
    // Try common title fields
    const titleFields = ['title', 'name', 'headline', 'subject'];
    for (const field of titleFields) {
      if (entry.fields[field]) {
        return String(entry.fields[field]);
      }
    }
    return undefined;
  }

  private extractDescription(entry: Entry<any>): string | undefined {
    // Try common description fields
    const descFields = ['description', 'summary', 'excerpt', 'body'];
    for (const field of descFields) {
      if (entry.fields[field]) {
        const value = entry.fields[field];
        if (typeof value === 'string') {
          return value.length > 200 ? value.substring(0, 200) + '...' : value;
        }
      }
    }
    return undefined;
  }

  private extractTags(entry: Entry<any>): string[] {
    // Try common tag fields
    const tagFields = ['tags', 'categories', 'keywords'];
    for (const field of tagFields) {
      if (entry.fields[field]) {
        const value = entry.fields[field];
        if (Array.isArray(value)) {
          return value.map((tag) => String(tag));
        }
      }
    }
    return [];
  }

  private transformFilters(filters: Record<string, any>): Record<string, any> {
    const transformed: Record<string, any> = {};

    for (const [key, value] of Object.entries(filters)) {
      // Handle different filter operators
      if (key.endsWith('_in')) {
        const fieldName = key.slice(0, -3);
        transformed[`fields.${fieldName}[in]`] = value;
      } else if (key.endsWith('_ne')) {
        const fieldName = key.slice(0, -3);
        transformed[`fields.${fieldName}[ne]`] = value;
      } else if (key.endsWith('_gt')) {
        const fieldName = key.slice(0, -3);
        transformed[`fields.${fieldName}[gt]`] = value;
      } else if (key.endsWith('_lt')) {
        const fieldName = key.slice(0, -3);
        transformed[`fields.${fieldName}[lt]`] = value;
      } else {
        transformed[`fields.${key}`] = value;
      }
    }

    return transformed;
  }

  private transformContentType(type: ContentfulContentType): ContentType {
    return {
      id: type.sys.id,
      name: type.name,
      description: type.description,
      fields: type.fields.map((field) => ({
        id: field.id,
        name: field.name,
        type: this.mapFieldType(field.type),
        required: field.required || false,
        localized: field.localized || false,
        validations: field.validations?.map((v) => ({
          type: v.name || 'unknown',
          parameters: v,
        })),
        default: field.defaultValue,
        description: field.description,
      })),
    };
  }

  private mapFieldType(contentfulType: string): import('../types/cms.types').FieldType {
    const typeMap: Record<string, import('../types/cms.types').FieldType> = {
      Text: import('../types/cms.types').FieldType.TEXT,
      RichText: import('../types/cms.types').FieldType.RICH_TEXT,
      Number: import('../types/cms.types').FieldType.NUMBER,
      Date: import('../types/cms.types').FieldType.DATE,
      Boolean: import('../types/cms.types').FieldType.BOOLEAN,
      Asset: import('../types/cms.types').FieldType.ASSET,
      Link: import('../types/cms.types').FieldType.REFERENCE,
      Array: import('../types/cms.types').FieldType.ARRAY,
      Object: import('../types/cms.types').FieldType.OBJECT,
      Location: import('../types/cms.types').FieldType.LOCATION,
    };

    return typeMap[contentfulType] || import('../types/cms.types').FieldType.JSON;
  }

  private generateTypeScriptFromSchema(schema: any): TypeScriptTypes {
    // This is a simplified implementation
    // In practice, you'd use the GraphQL schema to generate comprehensive types
    const contentTypes: Record<string, import('../types/cms.types').TypeScriptInterface> = {};
    const enums: Record<string, import('../types/cms.types').TypeScriptEnum> = {};

    // Generate types for content types
    for (const type of this.contentTypes.values()) {
      contentTypes[type.sys.id] = {
        name: this.toPascalCase(type.sys.id),
        description: type.description,
        properties: this.generateInterfaceProperties(type.fields),
      };
    }

    return {
      contentTypes,
      enums,
      utilities: this.generateUtilityTypes(),
    };
  }

  private generateInterfaceProperties(
    fields: any[]
  ): Record<string, import('../types/cms.types').TypeScriptProperty> {
    const properties: Record<string, import('../types/cms.types').TypeScriptProperty> = {};

    for (const field of fields) {
      properties[field.id] = {
        type: this.mapTypeScriptType(field.type),
        optional: !field.required,
        description: field.description,
      };
    }

    return properties;
  }

  private mapTypeScriptType(contentfulType: string): string {
    const typeMap: Record<string, string> = {
      Text: 'string',
      RichText: 'any', // Rich text would need special handling
      Number: 'number',
      Date: 'string',
      Boolean: 'boolean',
      Asset: 'Asset',
      Link: 'any', // References would need proper typing
      Array: 'any[]',
      Object: 'Record<string, any>',
      Location: '{ lat: number; lon: number; }',
    };

    return typeMap[contentfulType] || 'any';
  }

  private generateUtilityTypes(): string {
    return `
// Generated Contentful types
export interface Asset {
  sys: {
    id: string;
    type: string;
  };
  fields: {
    title?: string;
    description?: string;
    file: {
      url: string;
      details: {
        size: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}

export interface ContentfulCollection<T> {
  items: T[];
  total: number;
  limit: number;
  skip: number;
}
`;
  }

  private toPascalCase(str: string): string {
    return str
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }
}
