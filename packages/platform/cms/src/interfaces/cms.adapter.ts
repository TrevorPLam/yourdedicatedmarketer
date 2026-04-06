/**
 * Main CMS adapter interface
 * Provider-agnostic abstraction layer for headless CMS operations
 */

import type {
  CMSAdapter,
  CMSConfig,
  ContentResult,
  ContentCollection,
  ContentQuery,
  ContentQueryOptions,
  SetContentOptions,
  ContentSubscription,
  ContentChangeCallback,
  ContentType,
  TypeScriptTypes,
  CMSHealth,
  CMSError,
  ContentNotFoundError,
  ValidationError,
  RateLimitError,
  AuthenticationError,
} from '../types/cms.types';
import type { AnyCMSConfig } from '../types/config.types';

// ============================================================================
// Base CMS Adapter Implementation
// ============================================================================

export abstract class BaseCMSAdapter implements CMSAdapter {
  public abstract readonly provider: string;
  protected config: CMSConfig;
  protected initialized = false;
  protected connected = false;
  protected subscriptions = new Map<string, ContentSubscription>();

  constructor(config: CMSConfig) {
    this.config = this.validateConfig(config);
  }

  // ============================================================================
  // Lifecycle Methods
  // ============================================================================

  async initialize(config: CMSConfig): Promise<void> {
    if (this.initialized) {
      throw new CMSError('Adapter already initialized', 'ALREADY_INITIALIZED', this.provider);
    }

    this.config = this.validateConfig(config);
    await this.doInitialize();
    this.initialized = true;
  }

  async connect(): Promise<void> {
    if (!this.initialized) {
      throw new CMSError('Adapter not initialized', 'NOT_INITIALIZED', this.provider);
    }

    if (this.connected) {
      return;
    }

    await this.doConnect();
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    if (!this.connected) {
      return;
    }

    // Unsubscribe from all active subscriptions
    const unsubscribes = Array.from(this.subscriptions.values()).map((subscription) =>
      this.doUnsubscribe(subscription).catch(console.error)
    );
    await Promise.all(unsubscribes);
    this.subscriptions.clear();

    await this.doDisconnect();
    this.connected = false;
  }

  // ============================================================================
  // Content Operations
  // ============================================================================

  async getContent<T = any>(
    id: string,
    options: ContentQueryOptions = {}
  ): Promise<ContentResult<T>> {
    this.ensureInitializedAndConnected();
    return this.executeWithRetry(() => this.doGetContent<T>(id, options));
  }

  async queryContent<T = any>(
    query: ContentQuery,
    options: ContentQueryOptions = {}
  ): Promise<ContentCollection<T>> {
    this.ensureInitializedAndConnected();
    return this.executeWithRetry(() => this.doQueryContent<T>(query, options));
  }

  async setContent<T = any>(
    id: string,
    content: T,
    options: SetContentOptions = {}
  ): Promise<ContentResult<T>> {
    this.ensureInitializedAndConnected();
    return this.executeWithRetry(() => this.doSetContent<T>(id, content, options));
  }

  async deleteContent(id: string): Promise<boolean> {
    this.ensureInitializedAndConnected();
    return this.executeWithRetry(() => this.doDeleteContent(id));
  }

  // ============================================================================
  // Real-time Operations
  // ============================================================================

  async subscribe(
    query: ContentQuery,
    callback: ContentChangeCallback
  ): Promise<ContentSubscription> {
    this.ensureInitializedAndConnected();

    const subscription = await this.executeWithRetry(() => this.doSubscribe(query, callback));

    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  }

  async unsubscribe(subscription: ContentSubscription): Promise<void> {
    if (!this.subscriptions.has(subscription.id)) {
      return;
    }

    await this.executeWithRetry(() => this.doUnsubscribe(subscription));
    this.subscriptions.delete(subscription.id);
  }

  // ============================================================================
  // Schema and Type Operations
  // ============================================================================

  async getContentTypes(): Promise<ContentType[]> {
    this.ensureInitializedAndConnected();
    return this.executeWithRetry(() => this.doGetContentTypes());
  }

  async generateTypes(): Promise<TypeScriptTypes> {
    this.ensureInitializedAndConnected();
    return this.executeWithRetry(() => this.doGenerateTypes());
  }

  // ============================================================================
  // Health and Monitoring
  // ============================================================================

  async healthCheck(): Promise<CMSHealth> {
    const startTime = Date.now();

    try {
      if (!this.initialized || !this.connected) {
        return {
          status: 'unhealthy' as const,
          latency: Date.now() - startTime,
          timestamp: new Date(),
          provider: this.provider,
          environment: this.config.environment || 'unknown',
          features: await this.getFeatures(),
          errors: ['Adapter not initialized or connected'],
        };
      }

      const health = await this.doHealthCheck();
      return {
        ...health,
        latency: Date.now() - startTime,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        status: 'unhealthy' as const,
        latency: Date.now() - startTime,
        timestamp: new Date(),
        provider: this.provider,
        environment: this.config.environment || 'unknown',
        features: await this.getFeatures(),
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  // ============================================================================
  // Abstract Methods (Provider-specific Implementation)
  // ============================================================================

  protected abstract doInitialize(): Promise<void>;
  protected abstract doConnect(): Promise<void>;
  protected abstract doDisconnect(): Promise<void>;
  protected abstract doGetContent<T>(
    id: string,
    options: ContentQueryOptions
  ): Promise<ContentResult<T>>;
  protected abstract doQueryContent<T>(
    query: ContentQuery,
    options: ContentQueryOptions
  ): Promise<ContentCollection<T>>;
  protected abstract doSetContent<T>(
    id: string,
    content: T,
    options: SetContentOptions
  ): Promise<ContentResult<T>>;
  protected abstract doDeleteContent(id: string): Promise<boolean>;
  protected abstract doSubscribe(
    query: ContentQuery,
    callback: ContentChangeCallback
  ): Promise<ContentSubscription>;
  protected abstract doUnsubscribe(subscription: ContentSubscription): Promise<void>;
  protected abstract doGetContentTypes(): Promise<ContentType[]>;
  protected abstract doGenerateTypes(): Promise<TypeScriptTypes>;
  protected abstract doHealthCheck(): Promise<Omit<CMSHealth, 'latency' | 'timestamp'>>;

  // ============================================================================
  // Helper Methods
  // ============================================================================

  protected ensureInitializedAndConnected(): void {
    if (!this.initialized) {
      throw new CMSError('Adapter not initialized', 'NOT_INITIALIZED', this.provider);
    }
    if (!this.connected) {
      throw new CMSError('Adapter not connected', 'NOT_CONNECTED', this.provider);
    }
  }

  protected validateConfig(config: CMSConfig): CMSConfig {
    if (!config.provider) {
      throw new CMSError('Provider is required', 'MISSING_PROVIDER', 'base');
    }

    if (!config.cache) {
      config.cache = { enabled: true, ttl: 300, strategy: 'memory' };
    }

    if (!config.retry) {
      config.retry = { attempts: 3, delay: 1000, backoff: 'exponential' };
    }

    if (!config.rateLimit) {
      config.rateLimit = { requestsPerSecond: 10 };
    }

    return config;
  }

  protected async executeWithRetry<T>(
    operation: () => Promise<T>,
    customRetryConfig?: CMSConfig['retry']
  ): Promise<T> {
    const retryConfig = customRetryConfig || this.config.retry;
    let lastError: Error;

    for (let attempt = 1; attempt <= retryConfig!.attempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on certain errors
        if (
          error instanceof AuthenticationError ||
          error instanceof ValidationError ||
          error instanceof ContentNotFoundError
        ) {
          throw error;
        }

        if (attempt === retryConfig!.attempts) {
          break;
        }

        // Calculate delay with backoff
        let delay = retryConfig!.delay;
        if (retryConfig!.backoff === 'exponential') {
          delay = delay * Math.pow(2, attempt - 1);
        }

        console.warn(
          `CMS operation failed (attempt ${attempt}/${retryConfig!.attempts}), retrying in ${delay}ms:`,
          lastError.message
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  protected abstract getFeatures(): Promise<CMSHealth['features']>;

  // ============================================================================
  // Utility Methods
  // ============================================================================

  protected normalizeQuery(query: ContentQuery): ContentQuery {
    return {
      locale: query.locale || this.config.locale || 'en-US',
      limit: query.limit || 100,
      offset: query.offset || 0,
      ...query,
    };
  }

  protected createSubscription(
    query: ContentQuery,
    callback: ContentChangeCallback
  ): ContentSubscription {
    return {
      id: this.generateSubscriptionId(),
      query: this.normalizeQuery(query),
      callback,
      active: true,
      createdAt: new Date(),
    };
  }

  private generateSubscriptionId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  protected handleError(error: any, context: string): never {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          throw new AuthenticationError(this.provider);
        case 404:
          throw new ContentNotFoundError(context, this.provider);
        case 429:
          throw new RateLimitError(this.provider, error.response.headers['retry-after']);
        case 400:
          throw new ValidationError(
            data.message || 'Bad request',
            this.provider,
            data.errors || []
          );
        default:
          throw new CMSError(
            data.message || `CMS operation failed: ${context}`,
            'API_ERROR',
            this.provider,
            status,
            data
          );
      }
    }

    throw new CMSError(
      error.message || `CMS operation failed: ${context}`,
      'UNKNOWN_ERROR',
      this.provider,
      undefined,
      error
    );
  }
}

// ============================================================================
// CMS Adapter Factory
// ============================================================================

export interface CMSAdapterFactory {
  create(config: AnyCMSConfig): CMSAdapter;
  register(provider: string, adapterClass: new (config: CMSConfig) => CMSAdapter): void;
  getSupportedProviders(): string[];
}

export class DefaultCMSAdapterFactory implements CMSAdapterFactory {
  private adapters = new Map<string, new (config: CMSConfig) => CMSAdapter>();

  create(config: AnyCMSConfig): CMSAdapter {
    const AdapterClass = this.adapters.get(config.provider);
    if (!AdapterClass) {
      throw new CMSError(
        `Unsupported provider: ${config.provider}`,
        'UNSUPPORTED_PROVIDER',
        'factory'
      );
    }

    return new AdapterClass(config);
  }

  register(provider: string, adapterClass: new (config: CMSConfig) => CMSAdapter): void {
    this.adapters.set(provider, adapterClass);
  }

  getSupportedProviders(): string[] {
    return Array.from(this.adapters.keys());
  }
}

// ============================================================================
// Global Adapter Factory Instance
// ============================================================================

export const cmsAdapterFactory = new DefaultCMSAdapterFactory();
