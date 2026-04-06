/**
 * Shared CMS Types
 * 
 * Extracted from platform/cms to prevent circular dependencies
 */

// CMS adapter interface with proper typing
export interface CMSAdapter {
  provider: string;
  initialize(): Promise<void>;
  checkHealth(): Promise<{
    status: 'healthy' | 'unhealthy';
    latency?: number;
    error?: string;
  }>;
  getContent<T = unknown>(id: string): Promise<T | null>;
  saveContent<T = unknown>(content: T): Promise<T>;
  deleteContent(id: string): Promise<boolean>;
  searchContent<T = unknown>(query: string, options?: {
    limit?: number;
    offset?: number;
    filters?: Record<string, unknown>;
    sort?: Array<{ field: string; direction: 'asc' | 'desc' }>;
    locale?: string;
    includeDrafts?: boolean;
  }): Promise<T[]>;
}

// CMS configuration interface with proper typing
export interface CMSConfig {
  provider: string;
  baseUrl?: string;
  apiKey?: string;
  projectId?: string;
  dataset?: string;
  environment?: 'development' | 'staging' | 'production';
  cache?: {
    enabled: boolean;
    ttl?: number;
  };
  webhookSecret?: string;
  [key: string]: unknown;
}

// Content result interface with proper typing
export interface ContentResult<T = unknown> {
  id: string;
  content: T;
  version: number;
  status: 'draft' | 'published' | 'archived';
  metadata: {
    title?: string;
    description?: string;
    tags?: string[];
    category?: string;
    author?: string;
    language?: string;
    [key: string]: unknown;
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

// Content collection interface with proper typing
export interface ContentCollection<T = unknown> {
  items: ContentResult<T>[];
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
  hasPrev: boolean;
  facets?: {
    [key: string]: {
      [value: string]: number;
    };
  };
}

// Content query interface with proper typing
export interface ContentQuery {
  contentType?: string;
  filters?: Record<string, unknown>;
  search?: string;
  sort?: Array<{ field: string; direction: 'asc' | 'desc' }>;
  limit?: number;
  offset?: number;
  locale?: string;
  includeDrafts?: boolean;
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

// Content subscription interface with proper typing
export interface ContentSubscription {
  id: string;
  query: ContentQuery;
  callback: (change: ContentChange<unknown>) => void;
  active: boolean;
  createdAt: Date;
  lastTriggered?: Date;
}

// Content change callback interface with proper typing
export interface ContentChangeCallback {
  (change: ContentChange<unknown>): void;
}

// Content change interface with proper typing
export interface ContentChange<T = unknown> {
  type: ContentChangeType;
  id: string;
  contentType: string;
  version: number;
  timestamp: Date;
  userId?: string;
  data: T;
  previousData?: T;
  metadata?: {
    reason?: string;
    source?: 'api' | 'webhook' | 'ui';
    batchId?: string;
  };
}

export type ContentChangeType = 'created' | 'updated' | 'deleted';

// Content type definition with proper typing
export interface ContentType {
  id: string;
  name: string;
  fields: ContentSchemaField[];
  pattern?: {
    slug?: string;
    title?: string;
  };
  settings?: {
    localized: boolean;
    draftMode?: boolean;
    revisions?: boolean;
    [key: string]: unknown;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Content schema field interface with proper typing
export interface ContentSchemaField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object' | 'image' | 'rich-text';
  required?: boolean;
  localized?: boolean;
  validations?: Array<{
    type: string;
    parameters?: Record<string, unknown>;
    message?: string;
  }>;
  description?: string;
  defaultValue?: unknown;
  options?: Array<{
    label: string;
    value: string | number;
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
    [key: string]: unknown;
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
