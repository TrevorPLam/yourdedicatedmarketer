/**
 * CMS Adapter Contract
 * Defines the interface that all CMS adapters must implement
 */

import type {
  CMSConfig,
  CMSHealth,
  ContentItem,
  ContentType,
  SearchOptions,
} from '@agency/types/cms';

export interface CMSAdapter {
  /**
   * Initialize the CMS adapter with configuration
   */
  initialize(config: CMSConfig): Promise<void>;

  /**
   * Check the health of the CMS connection
   */
  checkHealth(): Promise<CMSHealth>;

  /**
   * Get content by ID
   */
  getContent(id: string): Promise<ContentItem | null>;

  /**
   * Get content by type
   */
  getContentByType(type: ContentType, options?: SearchOptions): Promise<ContentItem[]>;

  /**
   * Create or update content
   */
  saveContent(content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentItem>;

  /**
   * Delete content
   */
  deleteContent(id: string): Promise<boolean>;

  /**
   * Search content
   */
  searchContent(query: string, options?: SearchOptions): Promise<ContentItem[]>;

  /**
   * Provider identifier
   */
  readonly provider: string;
}
