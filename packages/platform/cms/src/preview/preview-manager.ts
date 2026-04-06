/**
 * Content Preview System
 * Manages draft mode and content preview functionality
 */

import type { CMSAdapter } from '../interfaces/cms.adapter';
import type {
  ContentResult,
  ContentQuery,
  ContentQueryOptions,
  ContentSubscription,
  ContentChangeCallback,
  ContentChange,
  CMSError,
} from '../types/cms.types';

// ============================================================================
// Preview Configuration
// ============================================================================

export interface PreviewConfig {
  enabled: boolean;
  draftMode: boolean;
  webhookSecret?: string;
  previewToken?: string;
  refreshInterval?: number; // in seconds
  maxAge?: number; // in seconds
  revalidateOnSave?: boolean;
  clearCacheOnPublish?: boolean;
}

export interface PreviewContext {
  inPreview: boolean;
  draftMode: boolean;
  token?: string;
  locale?: string;
  expiresAt?: Date;
}

export interface PreviewManagerOptions {
  adapter: CMSAdapter;
  config: PreviewConfig;
  onPreviewChange?: (context: PreviewContext) => void;
}

// ============================================================================
// Preview Manager Implementation
// ============================================================================

export class PreviewManager {
  private adapter: CMSAdapter;
  private config: PreviewConfig;
  private context: PreviewContext;
  private subscriptions = new Map<string, ContentSubscription>();
  private refreshTimer: NodeJS.Timeout | null = null;
  private onPreviewChange?: (context: PreviewContext) => void;

  constructor(options: PreviewManagerOptions) {
    this.adapter = options.adapter;
    this.config = options.config;
    this.onPreviewChange = options.onPreviewChange;

    this.context = {
      inPreview: false,
      draftMode: false,
    };

    this.initializeFromURL();
  }

  // ============================================================================
  // Preview Mode Management
  // ============================================================================

  async enablePreview(token?: string): Promise<void> {
    if (!this.config.enabled) {
      throw new CMSError('Preview mode is not enabled', 'PREVIEW_DISABLED', 'preview');
    }

    this.context = {
      inPreview: true,
      draftMode: this.config.draftMode,
      token: token || this.config.previewToken,
      locale: this.getLocaleFromURL(),
      expiresAt: this.calculateExpiration(),
    };

    await this.startPreviewMode();
    this.notifyContextChange();
  }

  async disablePreview(): Promise<void> {
    this.context = {
      inPreview: false,
      draftMode: false,
    };

    await this.stopPreviewMode();
    this.notifyContextChange();
  }

  togglePreview(token?: string): Promise<void> {
    if (this.context.inPreview) {
      return this.disablePreview();
    } else {
      return this.enablePreview(token);
    }
  }

  // ============================================================================
  // Content Operations with Preview Support
  // ============================================================================

  async getContent<T = any>(
    id: string,
    options: ContentQueryOptions = {}
  ): Promise<ContentResult<T>> {
    const previewOptions = this.applyPreviewOptions(options);
    return this.adapter.getContent<T>(id, previewOptions);
  }

  async queryContent<T = any>(
    query: ContentQuery,
    options: ContentQueryOptions = {}
  ): Promise<ContentResult<T>[]> {
    const previewOptions = this.applyPreviewOptions(options);
    const result = await this.adapter.queryContent<T>(query, previewOptions);
    return result.items;
  }

  async subscribeToContent(
    query: ContentQuery,
    callback: ContentChangeCallback
  ): Promise<ContentSubscription> {
    if (!this.context.inPreview) {
      throw new CMSError(
        'Real-time subscriptions only available in preview mode',
        'PREVIEW_REQUIRED',
        'preview'
      );
    }

    const subscription = await this.adapter.subscribe(query, callback);
    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  }

  async unsubscribeFromContent(subscription: ContentSubscription): Promise<void> {
    await this.adapter.unsubscribe(subscription);
    this.subscriptions.delete(subscription.id);
  }

  // ============================================================================
  // Preview Context Management
  // ============================================================================

  getPreviewContext(): PreviewContext {
    return { ...this.context };
  }

  isInPreview(): boolean {
    return this.context.inPreview;
  }

  isDraftMode(): boolean {
    return this.context.draftMode;
  }

  isValidToken(token: string): boolean {
    return token === this.config.previewToken || token === this.context.token;
  }

  // ============================================================================
  // Webhook Handling
  // ============================================================================

  async handleWebhook(payload: any, signature?: string): Promise<void> {
    if (!this.config.webhookSecret) {
      throw new CMSError('Webhook secret not configured', 'WEBHOOK_NOT_CONFIGURED', 'preview');
    }

    // Verify webhook signature
    if (signature && !this.verifyWebhookSignature(payload, signature)) {
      throw new CMSError('Invalid webhook signature', 'INVALID_WEBHOOK_SIGNATURE', 'preview');
    }

    const change = this.transformWebhookPayload(payload);
    await this.handleContentChange(change);
  }

  // ============================================================================
  // Cache Management
  // ============================================================================

  async clearCache(contentId?: string): Promise<void> {
    if (contentId) {
      // Clear specific content cache
      await this.clearContentCache(contentId);
    } else {
      // Clear all preview cache
      await this.clearAllCache();
    }
  }

  async revalidateContent(contentId: string): Promise<void> {
    if (!this.context.inPreview) {
      return;
    }

    try {
      // Revalidate specific content
      await this.revalidateContentCache(contentId);
    } catch (error) {
      console.warn('Failed to revalidate content:', error);
    }
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  private async startPreviewMode(): Promise<void> {
    if (!this.context.inPreview) return;

    // Start auto-refresh if configured
    if (this.config.refreshInterval) {
      this.startAutoRefresh();
    }

    // Subscribe to content changes for real-time updates
    if (this.config.draftMode) {
      await this.setupRealtimeUpdates();
    }
  }

  private async stopPreviewMode(): Promise<void> {
    // Stop auto-refresh
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }

    // Unsubscribe from all content changes
    const unsubscribes = Array.from(this.subscriptions.values()).map((subscription) =>
      this.adapter.unsubscribe(subscription).catch(console.error)
    );
    await Promise.all(unsubscribes);
    this.subscriptions.clear();
  }

  private applyPreviewOptions(options: ContentQueryOptions): ContentQueryOptions {
    const previewOptions: ContentQueryOptions = { ...options };

    if (this.context.inPreview) {
      previewOptions.includeDrafts = this.context.draftMode;
      previewOptions.preview = true;
      previewOptions.locale = previewOptions.locale || this.context.locale;
    }

    return previewOptions;
  }

  private initializeFromURL(): void {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const previewToken = urlParams.get('preview');
    const draftMode = urlParams.get('draft') === 'true';

    if (previewToken && this.isValidToken(previewToken)) {
      this.context = {
        inPreview: true,
        draftMode: draftMode || this.config.draftMode,
        token: previewToken,
        locale: urlParams.get('locale') || undefined,
        expiresAt: this.calculateExpiration(),
      };

      // Auto-start preview mode if URL parameters are valid
      this.startPreviewMode().catch(console.error);
    }
  }

  private calculateExpiration(): Date {
    const maxAge = this.config.maxAge || 3600; // Default 1 hour
    return new Date(Date.now() + maxAge * 1000);
  }

  private getLocaleFromURL(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    return new URLSearchParams(window.location.search).get('locale') || undefined;
  }

  private async setupRealtimeUpdates(): Promise<void> {
    if (!this.config.draftMode) return;

    // Subscribe to all content changes
    try {
      const subscription = await this.adapter.subscribe({}, (change: ContentChange) =>
        this.handleContentChange(change)
      );
      this.subscriptions.set(subscription.id, subscription);
    } catch (error) {
      console.warn('Failed to setup real-time updates:', error);
    }
  }

  private startAutoRefresh(): void {
    if (!this.config.refreshInterval) return;

    this.refreshTimer = setInterval(async () => {
      try {
        await this.refreshPreviewContent();
      } catch (error) {
        console.warn('Failed to refresh preview content:', error);
      }
    }, this.config.refreshInterval * 1000);
  }

  private async refreshPreviewContent(): Promise<void> {
    // This would trigger a refresh of the current preview content
    // Implementation depends on the frontend framework being used
    if (this.onPreviewChange) {
      this.onPreviewChange(this.context);
    }
  }

  private async handleContentChange(change: ContentChange): Promise<void> {
    // Clear cache for changed content
    if (this.config.clearCacheOnPublish && change.type === 'published') {
      await this.clearCache(change.contentId);
    }

    // Revalidate content if configured
    if (this.config.revalidateOnSave) {
      await this.revalidateContent(change.contentId);
    }

    // Notify of preview change
    if (this.onPreviewChange) {
      this.onPreviewChange(this.context);
    }
  }

  private verifyWebhookSignature(payload: any, signature: string): boolean {
    // Implement webhook signature verification
    // This would depend on the CMS provider's signature method
    return true; // Placeholder
  }

  private transformWebhookPayload(payload: any): ContentChange {
    // Transform webhook payload to ContentChange format
    // This would depend on the CMS provider's webhook format
    return {
      type: 'updated' as any,
      contentId: payload.id || payload.documentId,
      contentType: payload.type || payload.contentType,
      locale: payload.locale || 'en-US',
      version: payload.version || 1,
      timestamp: new Date(payload.timestamp || Date.now()),
      userId: payload.userId,
      data: payload.data || payload.result,
      previousData: payload.previousData,
    };
  }

  private notifyContextChange(): void {
    if (this.onPreviewChange) {
      this.onPreviewChange(this.context);
    }
  }

  private async clearContentCache(contentId: string): Promise<void> {
    // Implementation depends on caching strategy
    // This would clear cache for specific content
  }

  private async clearAllCache(): Promise<void> {
    // Implementation depends on caching strategy
    // This would clear all preview cache
  }

  private async revalidateContentCache(contentId: string): Promise<void> {
    // Implementation depends on caching strategy
    // This would revalidate content cache
  }
}

// ============================================================================
// Preview Hook for React
// ============================================================================

export interface UsePreviewOptions {
  adapter: CMSAdapter;
  config: PreviewConfig;
  autoRefresh?: boolean;
}

export interface UsePreviewReturn {
  inPreview: boolean;
  draftMode: boolean;
  context: PreviewContext;
  enablePreview: (token?: string) => Promise<void>;
  disablePreview: () => Promise<void>;
  togglePreview: (token?: string) => Promise<void>;
  getContent: <T>(id: string, options?: ContentQueryOptions) => Promise<ContentResult<T>>;
  queryContent: <T>(
    query: ContentQuery,
    options?: ContentQueryOptions
  ) => Promise<ContentResult<T>[]>;
  subscribe: (query: ContentQuery, callback: ContentChangeCallback) => Promise<ContentSubscription>;
  unsubscribe: (subscription: ContentSubscription) => Promise<void>;
}

export function createPreviewManager(options: PreviewManagerOptions): PreviewManager {
  return new PreviewManager(options);
}

// ============================================================================
// Preview Utilities
// ============================================================================

export function createPreviewURL(
  baseURL: string,
  token: string,
  options: {
    draft?: boolean;
    locale?: string;
  } = {}
): string {
  const url = new URL(baseURL);
  url.searchParams.set('preview', token);

  if (options.draft) {
    url.searchParams.set('draft', 'true');
  }

  if (options.locale) {
    url.searchParams.set('locale', options.locale);
  }

  return url.toString();
}

export function isPreviewRequest(request: Request): boolean {
  const url = new URL(request.url);
  return url.searchParams.has('preview');
}

export function getPreviewToken(request: Request): string | null {
  const url = new URL(request.url);
  return url.searchParams.get('preview');
}

export function validatePreviewRequest(request: Request, config: PreviewConfig): boolean {
  if (!config.enabled) return false;

  const token = getPreviewToken(request);
  if (!token) return false;

  return token === config.previewToken;
}

// ============================================================================
// Preview Middleware
// ============================================================================

export interface PreviewMiddlewareOptions {
  adapter: CMSAdapter;
  config: PreviewConfig;
  onPreviewChange?: (context: PreviewContext) => void;
}

export function createPreviewMiddleware(options: PreviewMiddlewareOptions) {
  const manager = new PreviewManager(options);

  return async (request: Request, response: Response) => {
    if (isPreviewRequest(request)) {
      const token = getPreviewToken(request);

      if (token && manager.isValidToken(token)) {
        await manager.enablePreview(token);
      }
    }

    return response;
  };
}
