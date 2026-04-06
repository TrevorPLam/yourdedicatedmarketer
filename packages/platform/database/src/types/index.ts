// Database types exports
export * from '@agency/types/database';

// Additional database-specific types that extend the base types
export interface DatabaseSchema {
  name: string;
  version: string;
  tables: TableDefinition[];
  indexes: IndexDefinition[];
  constraints: ConstraintDefinition[];
}

export interface TableDefinition {
  name: string;
  columns: ColumnDefinition[];
  primaryKey?: string[];
  foreignKeys?: ForeignKeyDefinition[];
}

export interface ColumnDefinition {
  name: string;
  type: string;
  nullable?: boolean;
  default?: any;
  unique?: boolean;
  autoIncrement?: boolean;
}

export interface IndexDefinition {
  name: string;
  table: string;
  columns: string[];
  unique?: boolean;
  type?: 'btree' | 'hash' | 'gist' | 'gin';
}

export interface ConstraintDefinition {
  name: string;
  type: 'check' | 'unique' | 'foreign_key' | 'primary_key';
  table: string;
  columns: string[];
  definition?: string;
}

export interface ForeignKeyDefinition {
  name: string;
  table: string;
  column: string;
  referencedTable: string;
  referencedColumn: string;
  onDelete?: 'cascade' | 'set null' | 'restrict' | 'no action';
  onUpdate?: 'cascade' | 'restrict' | 'no action';
}

// Database connection pool types
export interface ConnectionPoolConfig {
  min: number;
  max: number;
  idleTimeoutMillis: number;
  acquireTimeoutMillis: number;
  createTimeoutMillis?: number;
  destroyTimeoutMillis?: number;
  reapIntervalMillis?: number;
  createRetryIntervalMillis?: number;
}

export interface PoolStats {
  totalConnections: number;
  activeConnections: number;
  idleConnections: number;
  waitingRequests: number;
  maxConnections: number;
}

// Database query builder types
export interface QueryBuilder {
  select(columns?: string[]): QueryBuilder;
  from(table: string): QueryBuilder;
  where(condition: string | object, value?: any): QueryBuilder;
  whereIn(column: string, values: any[]): QueryBuilder;
  whereNotIn(column: string, values: any[]): QueryBuilder;
  whereNull(column: string): QueryBuilder;
  whereNotNull(column: string): QueryBuilder;
  whereBetween(column: string, min: any, max: any): QueryBuilder;
  join(table: string, condition: string): QueryBuilder;
  leftJoin(table: string, condition: string): QueryBuilder;
  rightJoin(table: string, condition: string): QueryBuilder;
  innerJoin(table: string, condition: string): QueryBuilder;
  groupBy(columns: string[]): QueryBuilder;
  having(condition: string, value?: any): QueryBuilder;
  orderBy(column: string, direction?: 'asc' | 'desc'): QueryBuilder;
  limit(count: number): QueryBuilder;
  offset(count: number): QueryBuilder;
  distinct(): QueryBuilder;

  build(): string;
  execute<T = any>(): Promise<T[]>;
  first<T = any>(): Promise<T | null>;
  count(): Promise<number>;
  exists(): Promise<boolean>;
}

// Database event types
export interface DatabaseEventEmitter {
  on(event: 'connect' | 'disconnect' | 'query' | 'error', listener: (data: any) => void): void;
  off(event: 'connect' | 'disconnect' | 'query' | 'error', listener: (data: any) => void): void;
  emit(event: 'connect' | 'disconnect' | 'query' | 'error', data: any): void;
}

export interface DatabaseEvent {
  type: 'connect' | 'disconnect' | 'query' | 'error';
  timestamp: Date;
  data: any;
  duration?: number;
}

// Database utility types
export interface QueryLogger {
  log(query: string, params: any[], duration: number): void;
  error(query: string, params: any[], error: Error): void;
}

export interface DatabaseMetrics {
  queriesExecuted: number;
  averageQueryTime: number;
  slowQueries: number;
  errors: number;
  connectionsCreated: number;
  connectionsDestroyed: number;
}

// Database configuration validation
export interface DatabaseConfigValidator {
  validate(config: any): boolean;
  getErrors(config: any): string[];
  getWarnings(config: any): string[];
}

// Database backup and restore types
export interface DatabaseBackup {
  id: string;
  name: string;
  createdAt: Date;
  size: number;
  type: 'full' | 'incremental' | 'differential';
  status: 'creating' | 'completed' | 'failed';
  location: string;
}

export interface BackupOptions {
  type: 'full' | 'incremental' | 'differential';
  compression?: boolean;
  encryption?: boolean;
  includeSchema?: boolean;
  includeData?: boolean;
  tables?: string[];
}

export interface RestoreOptions {
  backupId: string;
  dropExisting?: boolean;
  createDatabase?: boolean;
  schemaOnly?: boolean;
  dataOnly?: boolean;
}
