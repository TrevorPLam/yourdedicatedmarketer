/**
 * Database Factory Interface
 *
 * Extracted to a leaf module so that both the factory implementation and its
 * consumers can import this contract without creating circular dependencies.
 */

import type { DatabaseAdapter, DatabaseConfig, DatabaseProvider } from '@agency/types/database';

/**
 * Contract for the static DatabaseAdapterFactory class.
 * Consumers that need to depend on the factory shape without importing the
 * concrete class (e.g. to avoid pulling in adapter dependencies) can use
 * this interface instead.
 */
export interface IDatabaseAdapterFactory {
  /** Create a database adapter for the given configuration. */
  create(config: DatabaseConfig): DatabaseAdapter;
  /** Return the list of currently supported provider identifiers. */
  getSupportedProviders(): DatabaseProvider[];
  /** Validate a configuration and throw on invalid input. */
  validateConfig(config: DatabaseConfig): boolean;
}
