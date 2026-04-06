/**
 * Neon database adapter
 * Provides database operations using Neon PostgreSQL client
 */

import type {
  DatabaseAdapter,
  DatabaseConfig,
  DatabaseHealth,
  QueryResult,
  Transaction,
} from '@agency/types/database';
import { createLogger } from '../../../src/utils/logger';

export class NeonAdapter implements DatabaseAdapter {
  provider = 'neon' as const;
  private client: any = null; // Neon client
  private config: DatabaseConfig;
  private logger = createLogger('neon-adapter');

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async initialize(config: DatabaseConfig): Promise<void> {
    this.config = config;

    // Import Neon dynamically to avoid bundling issues
    const { neon } = await import('@neondatabase/serverless');

    this.client = neon(config.url);
    this.logger.info('Neon adapter initialized');
  }

  async connect(): Promise<void> {
    // Test connection with a simple query
    try {
      await this.client`SELECT 1`;
      this.logger.info('Neon connection established successfully');
    } catch (error) {
      this.logger.error('Failed to connect to Neon', { error: error.message });
      throw new Error(`Failed to connect to Neon: ${error.message}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      this.client = null;
      this.logger.info('Neon connection closed successfully');
    }
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
    if (!this.client) {
      throw new Error('Database not initialized. Call initialize() first.');
    }

    try {
      const result = await this.client.query(sql, params);
      this.logger.debug('Query executed successfully', { sql, params });

      return {
        rows: result.rows || [],
        rowCount: result.rowCount || 0,
        fields: result.fields || [],
      };
    } catch (error) {
      this.logger.error('Query execution failed', { sql, error: error.message });
      throw new Error(`Query execution failed: ${error.message}`);
    }
  }

  async transaction<T>(callback: (tx: Transaction) => Promise<T>): Promise<T> {
    if (!this.client) {
      throw new Error('Database not initialized. Call initialize() first.');
    }

    // Neon supports transactions through the client
    const tx = this.client.transaction();

    const transactionWrapper: Transaction = {
      query: async <T = any>(sql: string, params: any[] = []) => {
        try {
          const result = await tx.query(sql, params);
          return {
            rows: result.rows || [],
            rowCount: result.rowCount || 0,
            fields: result.fields || [],
          };
        } catch (error) {
          throw new Error(`Transaction query failed: ${error.message}`);
        }
      },
      rollback: async () => {
        await tx.rollback();
      },
      commit: async () => {
        await tx.commit();
      },
    };

    try {
      const result = await callback(transactionWrapper);
      await tx.commit();
      return result;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  async migrate(migrations: any[]): Promise<void> {
    if (!this.client) {
      throw new Error('Database not initialized. Call initialize() first.');
    }

    // Create migrations table if it doesn't exist
    await this.client`
      CREATE TABLE IF NOT EXISTS migrations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        version TEXT NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Run migrations
    for (const migration of migrations) {
      const existing = await this.client`
        SELECT id FROM migrations WHERE id = ${migration.id}
      `;

      if (existing.rows.length === 0) {
        try {
          this.logger.info('Applying migration', { id: migration.id, name: migration.name });
          await this.client.query(migration.up);

          await this.client`
            INSERT INTO migrations (id, name, version, applied_at)
            VALUES (${migration.id}, ${migration.name}, ${migration.version}, NOW())
          `;
          this.logger.info('Migration applied', { id: migration.id });
        } catch (error) {
          this.logger.error('Migration failed', { id: migration.id, error: error.message });
          throw new Error(`Migration ${migration.id} failed: ${error.message}`);
        }
      }
    }
  }

  async seed(data: any[]): Promise<void> {
    if (!this.client) {
      throw new Error('Database not initialized. Call initialize() first.');
    }

    for (const seedData of data) {
      try {
        this.logger.info('Seeding table', { table: seedData.table });
        // Use parameterized queries for safety
        const columns = Object.keys(seedData.data[0] || {});
        const values = seedData.data.map((row) => Object.values(row));

        const query = `
          INSERT INTO ${seedData.table} (${columns.join(', ')})
          VALUES (${columns.map((_, index) => `$${index + 1}`).join(', ')})
        `;

        await this.client.query(query, values.flat());
        this.logger.info('Table seeded', { table: seedData.table });
      } catch (error) {
        this.logger.error('Seeding failed', { table: seedData.table, error: error.message });
        throw new Error(`Seeding ${seedData.table} failed: ${error.message}`);
      }
    }
  }

  async healthCheck(): Promise<DatabaseHealth> {
    const startTime = Date.now();

    try {
      if (!this.client) {
        return {
          status: 'unhealthy',
          latency: Date.now() - startTime,
          connections: {
            active: 0,
            idle: 0,
            total: 0,
          },
          error: 'Database not initialized',
        };
      }

      await this.client`SELECT 1`;
      const latency = Date.now() - startTime;
      this.logger.debug('Health check completed', { latency });

      return {
        status: 'healthy',
        latency,
        connections: {
          active: 1, // Approximate
          idle: 0,
          total: 1,
        },
      };
    } catch (error) {
      this.logger.error('Health check failed', { error: error.message });
      return {
        status: 'unhealthy',
        latency: Date.now() - startTime,
        connections: {
          active: 0,
          idle: 0,
          total: 0,
        },
        error: error.message,
      };
    }
  }
}
