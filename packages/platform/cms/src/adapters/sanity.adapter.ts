/**
 * Sanity CMS adapter
 * Implements Sanity-specific operations with real-time updates support
 */

import type { type ClientConfig } from '@sanity/client';
import { createClient, type SanityClient } from '@sanity/client';
import { CMSAdapter } from '../contracts/cms-adapter.contract';
import type { SanityConfig } from '../contracts/cms-config.contract';
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
  ContentItem,
  SearchOptions,
  features,
} from '@agency/types/cms';

// ============================================================================
// Sanity Adapter Implementation
// ============================================================================

export class SanityAdapter implements CMSAdapter {
  public readonly provider = 'sanity' as const;
  private client: SanityClient | null = null;
  private subscriptions = new Map<string, EventSource>();
  private contentTypes: Map<string, any> = new Map();

  constructor(private config: SanityConfig) {}

  // ============================================================================
  // Lifecycle Implementation
  // ============================================================================

  async initialize(): Promise<void> {
    const sanityConfig = this.config as SanityConfig;

    const clientConfig: ClientConfig = {
      projectId: sanityConfig.projectId,
      dataset: sanityConfig.dataset,
      apiVersion: sanityConfig.apiVersion || '2024-01-01',
      useCdn: sanityConfig.useCdn !== false,
      perspective: sanityConfig.perspective,
      token: sanityConfig.token,
      withCredentials: sanityConfig.withCredentials,
      requestTagPrefix: sanityConfig.requestTagPrefix,
      ignoreBrowserTokenWarning: sanityConfig.ignoreBrowserTokenWarning,
      filterResponse: sanityConfig.filterResponse,
    };

    this.client = createClient(clientConfig);

    // Cache content types
    await this.cacheContentTypes();
  }

  async checkHealth(): Promise<CMSHealth> {
    if (!this.client) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        details: 'Sanity client not initialized',
      };
    }

    try {
      // Test connection by fetching project info
      await this.client.fetch(`*[_type == "sanity.projectConfig"][0]{title, projectId}`);
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        details: 'Sanity connection successful',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        details: `Sanity connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // ============================================================================
// Content Operations Implementation
// ============================================================================

async getContent(id: string): Promise<ContentItem | null> {
  if (!this.client) {
    throw new CMSError('Sanity client not initialized', 'CLIENT_NOT_INITIALIZED', this.provider);
  }

  try {
    const query = `*[_id == $id][0]`;
    const result = await this.client.fetch(query, { id });
    
    if (!result) {
      return null;
    }

    return this.transformSanityContent(result);
  } catch (error) {
    this.handleError(error, 'Get content');
    throw error;
  }
}

async getContentByType(type: ContentType, options?: SearchOptions): Promise<ContentItem[]> {
  if (!this.client) {
    throw new CMSError('Sanity client not initialized', 'CLIENT_NOT_INITIALIZED', this.provider);
  }

  try {
    let query = `*[_type == $type]`;
    const params = { type };

    if (options?.limit) {
      query += `[0..$limit]`;
      params.limit = options.limit - 1;
    }

    if (options?.orderBy) {
      query += `| order(${options.orderBy})`;
    }

    const results = await this.client.fetch(query, params);
    return results.map((item: any) => this.transformSanityContent(item));
  } catch (error) {
    this.handleError(error, 'Get content by type');
    throw error;
  }
}

async saveContent(content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentItem> {
  if (!this.client) {
    throw new CMSError('Sanity client not initialized', 'CLIENT_NOT_INITIALIZED', this.provider);
  }

  try {
    const sanityDoc = this.transformToSanityDocument(content);
    const result = await this.client.create(sanityDoc);
    return this.transformSanityContent(result);
  } catch (error) {
    this.handleError(error, 'Save content');
    throw error;
  }
}

async deleteContent(id: string): Promise<boolean> {
  if (!this.client) {
    throw new CMSError('Sanity client not initialized', 'CLIENT_NOT_INITIALIZED', this.provider);
  }

  try {
    await this.client.delete(id);
    return true;
  } catch (error) {
    this.handleError(error, 'Delete content');
    return false;
  }
}

async searchContent(query: string, options?: SearchOptions): Promise<ContentItem[]> {
  if (!this.client) {
    throw new CMSError('Sanity client not initialized', 'CLIENT_NOT_INITIALIZED', this.provider);
  }

  try {
    let searchQuery = `*[_type in ["post", "page", "article"] && (title match $query || content match $query)]`;
    const params = { query: `*${query}*` };

    if (options?.limit) {
      searchQuery += `[0..$limit]`;
      params.limit = options.limit - 1;
    }

    const results = await this.client.fetch(searchQuery, params);
    return results.map((item: any) => this.transformSanityContent(item));
  } catch (error) {
    this.handleError(error, 'Search content');
    throw error;
  }
}

protected async doGetContent<T>(
    id: string,
    options: ContentQueryOptions = {}
  ): Promise<ContentResult<T>> {
    if (!this.client) {
      throw new CMSError('Sanity client not available', 'CLIENT_NOT_AVAILABLE', this.provider);
    }

    try {
        const query = `*[_id == $id && !(_id in path("drafts.**"))][0]`;
      const params = { id };

      const document = await this.client.fetch<T>(query, params, {
        filterResponse: false,
        tag: 'get-content',
      });

      if (!document) {
        throw new CMSError(`Content not found: ${id}`, 'CONTENT_NOT_FOUND', this.provider, 404);
      }

      return this.transformDocument(document, id);
    } catch (error) {
      this.handleError(error, `Get content: ${id}`);
    }
  }

  protected async doQueryContent<T>(
    query: ContentQuery,
    options: ContentQueryOptions = {}
  ): Promise<ContentCollection<T>> {
    if (!this.client) {
      throw new CMSError('Sanity client not available', 'CLIENT_NOT_AVAILABLE', this.provider);
    }

    try {
      // Build GROQ query
      const groqQuery = this.buildGroqQuery(query);
      const params = this.buildQueryParams(query);

      const documents = await this.client.fetch<T[]>(groqQuery, params, {
        filterResponse: false,
        tag: 'query-content',
      });

      // Get total count for pagination
      const countQuery = this.buildCountQuery(query);
      const total = await this.client.fetch<number>(countQuery, params, {
        filterResponse: false,
        tag: 'count-content',
      });

      return {
        items: documents.map((doc) => this.transformDocument(doc, (doc as any)._id)),
        total,
        limit: query.limit || 100,
        offset: query.offset || 0,
        hasNext: (query.offset || 0) + (query.limit || 100) < total,
        hasPrev: (query.offset || 0) > 0,
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
      throw new CMSError('Sanity client not available', 'CLIENT_NOT_AVAILABLE', this.provider);
    }

    try {
      let document: any;

      if (id === 'new') {
        // Create new document
        document = {
          ...content,
          _type: options.contentType || 'document',
          _createdAt: new Date().toISOString(),
          _updatedAt: new Date().toISOString(),
        };

        if (!options.draft) {
          document._id = this.generateDocumentId();
        } else {
          document._id = `drafts.${this.generateDocumentId()}`;
        }

        const result = await this.client.create(document);
        return this.transformDocument(result, result._id);
      } else {
        // Update existing document
        const existingDoc = await this.client.getDocument(id);
        if (!existingDoc) {
          throw new CMSError(`Document not found: ${id}`, 'CONTENT_NOT_FOUND', this.provider, 404);
        }

        document = {
          ...existingDoc,
          ...content,
          _updatedAt: new Date().toISOString(),
        };

        const result = await this.client.createOrReplace(document);
        return this.transformDocument(result, result._id);
      }
    } catch (error) {
      this.handleError(error, `Set content: ${id}`);
    }
  }

  protected async doDeleteContent(id: string): Promise<boolean> {
    if (!this.client) {
      throw new CMSError('Sanity client not available', 'CLIENT_NOT_AVAILABLE', this.provider);
    }

    try {
      await this.client.delete(id);
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
    if (!this.client) {
      throw new CMSError('Sanity client not available', 'CLIENT_NOT_AVAILABLE', this.provider);
    }

    const subscription = this.createSubscription(query, callback);

    try {
      // Build GROQ query for subscription
      const groqQuery = this.buildGroqQuery(query);
      const params = this.buildQueryParams(query);

      // Create EventSource for real-time updates
      const eventSource = this.client.listen(groqQuery, params);

      eventSource.on('message', (event: any) => {
        const change = this.transformChangeEvent(event);
        callback(change);
      });

      eventSource.on('error', (error: any) => {
        console.error('Sanity subscription error:', error);
      });

      this.subscriptions.set(subscription.id, eventSource);

      return subscription;
    } catch (error) {
      this.handleError(error, 'Subscribe to content');
    }
  }

  protected async doUnsubscribe(subscription: ContentSubscription): Promise<void> {
    const eventSource = this.subscriptions.get(subscription.id);
    if (eventSource) {
      eventSource.close();
      this.subscriptions.delete(subscription.id);
    }
  }

  // ============================================================================
  // Schema and Type Operations Implementation
  // ============================================================================

  protected async doGetContentTypes(): Promise<ContentType[]> {
    if (!this.client) {
      throw new CMSError('Sanity client not available', 'CLIENT_NOT_AVAILABLE', this.provider);
    }

    try {
      const schema = await this.client.fetch(`*[_type == "sanity.schemaType"]`);
      return schema.map((type: any) => this.transformContentType(type));
    } catch (error) {
      this.handleError(error, 'Get content types');
    }
  }

  protected async doGenerateTypes(): Promise<TypeScriptTypes> {
    if (!this.client) {
      throw new CMSError('Sanity client not available', 'CLIENT_NOT_AVAILABLE', this.provider);
    }

    try {
      // Fetch schema types
      const schema = await this.client.fetch(`*[_type == "sanity.schemaType"]`);
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
      await this.client.fetch(`count(*)`);
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
        environment: this.config.environment || 'unknown',
        features: await this.getFeatures(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        provider: this.provider,
        environment: this.config.environment || 'unknown',
        features: await this.getFeatures(),
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  protected async getFeatures(): Promise<features> {
    return {
      realTimeUpdates: true,
      previewMode: true,
      typeGeneration: true,
      webhooks: true,
      localization: true,
      versioning: true,
    };
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private buildGroqQuery(query: ContentQuery): string {
    let groqQuery = '*';

    // Add content type filter
    if (query.contentType) {
      groqQuery += `[_type == "${query.contentType}"]`;
    }

    // Add filters
    if (query.filters) {
      for (const [key, value] of Object.entries(query.filters)) {
        if (key.endsWith('_in')) {
          const fieldName = key.slice(0, -3);
          groqQuery += `[${fieldName} in $${fieldName}]`;
        } else if (key.endsWith('_ne')) {
          const fieldName = key.slice(0, -3);
          groqQuery += `[${fieldName} != $${fieldName}]`;
        } else if (key.endsWith('_gt')) {
          const fieldName = key.slice(0, -3);
          groqQuery += `[${fieldName} > $${fieldName}]`;
        } else if (key.endsWith('_lt')) {
          const fieldName = key.slice(0, -3);
          groqQuery += `[${fieldName} < $${fieldName}]`;
        } else {
          groqQuery += `[${key} == $${key}]`;
        }
      }
    }

    // Add search
    if (query.search) {
      groqQuery += `[title match $search || description match $search]`;
    }

    // Add sorting
    if (query.sort && query.sort.length > 0) {
      const sortFields = query.sort.map((s) => `${s.field} ${s.direction}`).join(', ');
      groqQuery += `| order(${sortFields})`;
    }

    // Add pagination
    groqQuery += `[${query.offset || 0}...${(query.offset || 0) + (query.limit || 100)}]`;

    // Select specific fields if requested
    if (query.fields && query.fields.length > 0) {
      const fields = query.fields.join(', ');
      groqQuery += `{${fields}, _id, _type, _createdAt, _updatedAt, _rev}`;
    }

    return groqQuery;
  }

  private buildCountQuery(query: ContentQuery): string {
    let countQuery = 'count(*';

    // Apply same filters as main query
    if (query.contentType) {
      countQuery += `[_type == "${query.contentType}"]`;
    }

    if (query.filters) {
      for (const [key, value] of Object.entries(query.filters)) {
        if (key.endsWith('_in')) {
          const fieldName = key.slice(0, -3);
          countQuery += `[${fieldName} in $${fieldName}]`;
        } else if (key.endsWith('_ne')) {
          const fieldName = key.slice(0, -3);
          countQuery += `[${fieldName} != $${fieldName}]`;
        } else {
          countQuery += `[${key} == $${key}]`;
        }
      }
    }

    countQuery += ')';

    return countQuery;
  }

  private buildQueryParams(query: ContentQuery): Record<string, any> {
    const params: Record<string, any> = {};

    // Add filter parameters
    if (query.filters) {
      for (const [key, value] of Object.entries(query.filters)) {
        let paramName = key;
        if (
          key.endsWith('_in') ||
          key.endsWith('_ne') ||
          key.endsWith('_gt') ||
          key.endsWith('_lt')
        ) {
          paramName = key.slice(0, -3);
        }
        params[paramName] = value;
      }
    }

    // Add search parameter
    if (query.search) {
      params.search = `*${query.search}*`;
    }

    return params;
  }

  private transformDocument<T>(document: any, id: string): ContentResult<T> {
    return {
      id,
      content: document,
      version: document._rev || 1,
      locale: document._locale || 'en-US',
      status: this.getContentStatus(document),
      metadata: {
        title: document.title || document.name,
        description: document.description || document.summary,
        tags: document.tags || [],
        author: document.author,
        category: document.category,
      },
      createdAt: new Date(document._createdAt),
      updatedAt: new Date(document._updatedAt),
      publishedAt: document._publishedAt ? new Date(document._publishedAt) : undefined,
    };
  }

  private getContentStatus(document: any): import('../types/cms.types').ContentStatus {
    if (document._id.startsWith('drafts.')) {
      return import('../types/cms.types').ContentStatus.DRAFT;
    }
    if (document._deletedAt) {
      return import('../types/cms.types').ContentStatus.DELETED;
    }
    return import('../types/cms.types').ContentStatus.PUBLISHED;
  }

  private transformChangeEvent(event: any): ContentChange {
    return {
      type: this.mapChangeType(event.transition),
      contentId: event.documentId,
      contentType: event.result._type,
      locale: event.result._locale || 'en-US',
      version: event.result._rev || 1,
      timestamp: new Date(event.timestamp),
      userId: event.identity,
      data: event.result,
      previousData: event.previous,
    };
  }

  private mapChangeType(transition: string): ContentChangeType {
    const typeMap: Record<string, ContentChangeType> = {
      appear: ContentChangeType.CREATED,
      update: ContentChangeType.UPDATED,
      disappear: ContentChangeType.DELETED,
    };

    return typeMap[transition] || ContentChangeType.UPDATED;
  }

  private transformContentType(type: any): ContentType {
    return {
      id: type.name,
      name: type.title || type.name,
      description: type.description,
      fields:
        type.fields?.map((field: any) => ({
          id: field.name,
          name: field.title || field.name,
          type: this.mapFieldType(field.type),
          required: field.required || false,
          localized: field.locale !== false,
          validations: field.validation?.map((v: any) => ({
            type: v._type || 'unknown',
            parameters: v,
          })),
          description: field.description,
        })) || [],
    };
  }

  private mapFieldType(sanityType: any): import('../types/cms.types').FieldType {
    if (typeof sanityType === 'string') {
      const typeMap: Record<string, import('../types/cms.types').FieldType> = {
        string: import('../types/cms.types').FieldType.TEXT,
        text: import('../types/cms.types').FieldType.RICH_TEXT,
        number: import('../types/cms.types').FieldType.NUMBER,
        boolean: import('../types/cms.types').FieldType.BOOLEAN,
        date: import('../types/cms.types').FieldType.DATE,
        datetime: import('../types/cms.types').FieldType.DATETIME,
        image: import('../types/cms.types').FieldType.ASSET,
        file: import('../types/cms.types').FieldType.ASSET,
        reference: import('../types/cms.types').FieldType.REFERENCE,
        array: import('../types/cms.types').FieldType.ARRAY,
        object: import('../types/cms.types').FieldType.OBJECT,
        geopoint: import('../types/cms.types').FieldType.LOCATION,
        json: import('../types/cms.types').FieldType.JSON,
      };

      return typeMap[sanityType] || import('../types/cms.types').FieldType.JSON;
    }

    if (sanityType.name) {
      return this.mapFieldType(sanityType.name);
    }

    return import('../types/cms.types').FieldType.JSON;
  }

  private async cacheContentTypes(): Promise<void> {
    if (!this.client) return;

    try {
      const schema = await this.client.fetch(`*[_type == "sanity.schemaType"]`);
      schema.forEach((type: any) => {
        this.contentTypes.set(type.name, type);
      });
    } catch (error) {
      console.warn('Failed to cache content types:', error);
    }
  }

  private generateTypeScriptFromSchema(schema: any[]): TypeScriptTypes {
    const contentTypes: Record<string, import('../types/cms.types').TypeScriptInterface> = {};
    const enums: Record<string, import('../types/cms.types').TypeScriptEnum> = {};

    // Generate types for content types
    for (const type of schema) {
      if (type.name.startsWith('sanity.')) continue; // Skip internal types

      contentTypes[type.name] = {
        name: this.toPascalCase(type.name),
        description: type.description,
        properties: this.generateInterfaceProperties(type.fields || []),
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
      properties[field.name] = {
        type: this.mapTypeScriptType(field.type),
        optional: !field.required,
        description: field.description,
      };
    }

    return properties;
  }

  private mapTypeScriptType(sanityType: any): string {
    if (typeof sanityType === 'string') {
      const typeMap: Record<string, string> = {
        string: 'string',
        text: 'any', // Rich text would need special handling
        number: 'number',
        boolean: 'boolean',
        date: 'string',
        datetime: 'string',
        image: 'SanityImage',
        file: 'SanityFile',
        reference: 'any', // References would need proper typing
        array: 'any[]',
        object: 'Record<string, any>',
        geopoint: '{ lat: number; lng: number; }',
        json: 'any',
      };

      return typeMap[sanityType] || 'any';
    }

    if (sanityType.name) {
      return this.toPascalCase(sanityType.name);
    }

    return 'any';
  }

  private generateUtilityTypes(): string {
    return `
// Generated Sanity types
export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

export interface SanityFile {
  _type: 'file';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

export interface SanityReference<T = any> {
  _ref: string;
  _type: 'reference';
}

export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}
`;
  }

  private transformSanityContent(sanityDoc: any): ContentItem {
    return {
      id: sanityDoc._id,
      type: sanityDoc._type as ContentType,
      title: sanityDoc.title || sanityDoc.name || '',
      content: sanityDoc.content || sanityDoc.description || '',
      slug: sanityDoc.slug?.current || '',
      metadata: {
        publishedAt: sanityDoc.publishedAt,
        updatedAt: sanityDoc._updatedAt,
        author: sanityDoc.author,
        tags: sanityDoc.tags || [],
        language: sanityDoc.language || 'en',
      },
      status: sanityDoc.status || 'draft',
      createdAt: sanityDoc._createdAt,
      updatedAt: sanityDoc._updatedAt,
    };
  }

  private transformToSanityDocument(content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): any {
    return {
      _type: content.type,
      title: content.title,
      content: content.content,
      slug: {
        _type: 'slug',
        current: content.slug,
      },
      status: content.status,
      publishedAt: content.metadata?.publishedAt,
      author: content.metadata?.author,
      tags: content.metadata?.tags || [],
      language: content.metadata?.language || 'en',
    };
  }

  private toPascalCase(str: string): string {
    return str
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  private generateDocumentId(): string {
    return (
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  }
}
