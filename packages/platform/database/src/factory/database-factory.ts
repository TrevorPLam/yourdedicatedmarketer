/**
 * Database adapter factory
 * Creates database adapters based on provider configuration
 */

import type { DatabaseAdapter, DatabaseConfig, DatabaseProvider } from '@agency/types/database';
import { SupabaseAdapter } from '../adapters/supabase';
import { NeonAdapter } from '../adapters/neon';
import { PostgresAdapter } from '../adapters/postgres';

export class DatabaseAdapterFactory {
  /**
   * Create database adapter based on provider
   */
  static create(config: DatabaseConfig): DatabaseAdapter {
    switch (config.provider) {
      case 'supabase':
        return new SupabaseAdapter(config);
      case 'neon':
        return new NeonAdapter(config);
      case 'postgres':
        return new PostgresAdapter(config);
      default:
        throw new Error(`Unsupported database provider: ${config.provider}`);
    }
  }

  /**
   * Get supported providers
   */
  static getSupportedProviders(): DatabaseProvider[] {
    return ['supabase', 'neon', 'postgres'];
  }

  /**
   * Validate configuration
   */
  static validateConfig(config: DatabaseConfig): boolean {
    if (!config.url) {
      throw new Error('Database URL is required');
    }

    const supportedProviders = this.getSupportedProviders();
    if (!supportedProviders.includes(config.provider)) {
      throw new Error(
        `Unsupported provider: ${config.provider}. Supported providers: ${supportedProviders.join(', ')}`
      );
    }

    return true;
  }
}
