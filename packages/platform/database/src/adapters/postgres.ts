/**
 * PostgreSQL database adapter
 * Provides database operations using native PostgreSQL client
 */

import type {
  DatabaseAdapter,
  DatabaseConfig,
  DatabaseHealth,
  QueryResult,
  Transaction,
} from '@agency/types/database';
import { createLogger } from '../../../src/utils/logger';

export class PostgresAdapter implements DatabaseAdapter {
  provider = 'postgres' as const;
  private client: any = null; // PostgreSQL client
  private config: DatabaseConfig;
  private logger = createLogger('postgres-adapter');

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async initialize(config: DatabaseConfig): Promise<void> {
    this.config = config;

    // Import PostgreSQL dynamically to avoid bundling issues
    const { Pool } = await import('pg');

    this.client = new Pool({
      connectionString: config.url,
      ssl: config.ssl,
      max: config.maxConnections || 20,
      idleTimeoutMillis: config.poolConfig?.idleTimeoutMillis || 30000,
      connectionTimeoutMillis: config.timeout || 10000,
    });
    this.logger.info('PostgreSQL adapter initialized');
  }

  async connect(): Promise<void> {
    if (!this.client) {
      throw new Error('Database not initialized. Call initialize() first.');
    }

    try {
      const client = await this.client.connect();
      await client.query('SELECT 1');
      client.release();
      this.logger.info('PostgreSQL connection established successfully');
    } catch (error) {
      this.logger.error('Failed to connect to PostgreSQL', { error: error.message });
      throw new Error(`Failed to connect to PostgreSQL: ${error.message}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.end();
      this.client = null;
      this.logger.info('PostgreSQL connection closed successfully');
    }
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
    if (!this.client) {
      throw new Error('Database not initialized. Call initialize() first.');
    }

    let client;
    try {
      client = await this.client.connect();
      const result = await client.query(sql, params);
      this.logger.debug('Query executed successfully', { sql, params });

      return {
        rows: result.rows || [],
        rowCount: result.rowCount || 0,
        fields: result.fields || [],
      };
    } catch (error) {
      this.logger.error('Query execution failed', { sql, error: error.message });
      throw new Error(`Query execution failed: ${error.message}`);
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async transaction<T>(callback: (tx: Transaction) => Promise<T>): Promise<T> {
    if (!this.client) {
      throw new Error('Database not initialized. Call initialize() first.');
    }

    let client;
    try {
      client = await this.client.connect();
      await client.query('BEGIN');

      const transactionWrapper: Transaction = {
        query: async <T = any>(sql: string, params: any[] = []) => {
          try {
            const result = await client.query(sql, params);
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
          await client.query('ROLLBACK');
        },
        commit: async () => {
          await client.query('COMMIT');
        },
      };

      const result = await callback(transactionWrapper);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      if (client) {
        await client.query('ROLLBACK');
      }
      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async migrate(migrations: any[]): Promise<void> {
    if (!this.client) {
      throw new Error('Database not initialized. Call initialize() first.');
    }

    // Create migrations table if it doesn't exist
    await this.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        version TEXT NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Run migrations
    for (const migration of migrations) {
      const existing = await this.query('SELECT id FROM migrations WHERE id = $1', [migration.id]);

      if (existing.rows.length === 0) {
        try {
          this.logger.info('Applying migration', { id: migration.id, name: migration.name });
          await this.query(migration.up);

          await this.query(
            `
            INSERT INTO migrations (id, name, version, applied_at)
            VALUES ($1, $2, $3, NOW())
          `,
            [migration.id, migration.name, migration.version]
          );
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

        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
        const query = `
          INSERT INTO ${seedData.table} (${columns.join(', ')})
          VALUES (${placeholders})
        `;

        // Insert each row individually to handle large datasets
        for (const row of seedData.data) {
          const rowValues = Object.values(row);
          const rowQuery = `
            INSERT INTO ${seedData.table} (${columns.join(', ')})
            VALUES (${rowValues.map((_, index) => `$${index + 1}`).join(', ')})
          `;
          await this.query(rowQuery, rowValues);
        }
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

      const result = await this.query('SELECT 1');
      const latency = Date.now() - startTime;
      this.logger.debug('Health check completed', { latency });

      // Get pool stats
      const totalCount = this.client.totalCount || 0;
      const idleCount = this.client.idleCount || 0;
      const waitingCount = this.client.waitingCount || 0;

      return {
        status: 'healthy',
        latency,
        connections: {
          active: totalCount - idleCount,
          idle: idleCount,
          total: totalCount,
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
