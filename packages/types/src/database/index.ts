// Database type definitions
export interface DatabaseConfig {
  provider: DatabaseProvider;
  url: string;
  ssl?: boolean;
  maxConnections?: number;
  timeout?: number;
  retries?: number;
  poolConfig?: PoolConfig;
}

export type DatabaseProvider = 'supabase' | 'neon' | 'postgres' | 'mysql' | 'sqlite';

export interface PoolConfig {
  min: number;
  max: number;
  idleTimeoutMillis?: number;
  acquireTimeoutMillis?: number;
}

// Database adapter interface with tenant scoping support
export interface DatabaseAdapter {
  provider: DatabaseProvider;
  initialize(config: DatabaseConfig): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  
  // Tenant-aware query methods
  query<T = unknown>(sql: string, params?: unknown[], tenantId?: string): Promise<QueryResult<T>>;
  transaction<T>(callback: (tx: Transaction) => Promise<T>, tenantId?: string): Promise<T>;
  
  // Tenant validation
  validateTenantAccess(tenantId: string): Promise<TenantValidationResult>;
  
  // Schema operations (tenant-aware)
  migrate(migrations: Migration[], tenantId?: string): Promise<void>;
  seed(data: SeedData[], tenantId?: string): Promise<void>;
  
  // Health check
  healthCheck(): Promise<DatabaseHealth>;
}

// Database query interface with proper typing and tenant scoping
export interface Database {
  // Connection methods
  connect(): Promise<void>;
  disconnect(): Promise<void>;

  // Query methods with proper typing and tenant scoping
  query<T = unknown>(sql: string, params?: unknown[], tenantId?: string): Promise<QueryResult<T>>;
  transaction<T>(callback: (tx: Transaction) => Promise<T>, tenantId?: string): Promise<T>;

  // Schema operations (tenant-aware)
  migrate(migrations: Migration[], tenantId?: string): Promise<void>;
  seed(data: SeedData[], tenantId?: string): Promise<void>;

  // Health check
  healthCheck(): Promise<DatabaseHealth>;
}

// Database query result with generic typing
export interface QueryResult<T = unknown> {
  rows: T[];
  rowCount: number;
  fields: FieldInfo[];
  command: string;
  rowCountTotal?: number;
}

export interface FieldInfo {
  name: string;
  dataTypeID: number;
  tableID: number;
  columnID: number;
}

// Transaction interface with proper typing and tenant scoping
export interface Transaction {
  query<T = unknown>(sql: string, params?: unknown[], tenantId?: string): Promise<QueryResult<T>>;
  rollback(): Promise<void>;
  commit(): Promise<void>;
}

export interface DatabaseHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  latency: number;
  connections: {
    active: number;
    idle: number;
    total: number;
  };
  error?: string;
}

// Migration types

export interface Migration {
  id: string;
  name: string;
  version: string;
  up: string | (() => Promise<void>); // SQL or function
  down: string | (() => Promise<void>); // SQL or function
  createdAt: Date;
  appliedAt?: Date;
}

export interface MigrationRunner {
  up(to?: string): Promise<MigrationResult[]>;
  down(to?: string): Promise<MigrationResult[]>;
  status(): Promise<MigrationStatus[]>;
  reset(): Promise<void>;
}

export interface MigrationResult {
  migration: Migration;
  success: boolean;
  error?: string;
  duration: number;
}

export interface MigrationStatus {
  migration: Migration;
  applied: boolean;
  appliedAt?: Date;
}

// Seed data with proper typing
export interface SeedData {
  table: string;
  data: Record<string, unknown>[];
  dependencies?: string[];
  constraints?: {
    uniqueKeys?: string[];
    foreignKeys?: string[];
  };
}

export interface SeedRunner {
  seed(tables?: string[]): Promise<void>;
  reset(tables?: string[]): Promise<void>;
  status(): Promise<SeedStatus[]>;
}

export interface SeedStatus {
  table: string;
  records: number;
  lastSeeded?: Date;
}

// ORM-style types
export interface Model<T = Record<string, unknown>> {
  tableName: string;
  fields: Record<keyof T, DatabaseFieldDefinition>;
  relations?: Record<string, Relation>;
}

// Database field definition with proper typing
export interface DatabaseFieldDefinition {
  type: DatabaseFieldType;
  nullable?: boolean;
  default?: unknown;
  unique?: boolean;
  primary?: boolean;
  foreignKey?: ForeignKeyDefinition;
  constraints?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export type DatabaseFieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'json'
  | 'uuid'
  | 'text'
  | 'binary';

export interface ForeignKeyDefinition {
  table: string;
  field: string;
  onDelete?: 'cascade' | 'set null' | 'restrict';
  onUpdate?: 'cascade' | 'restrict';
}

export interface Relation {
  type: 'hasOne' | 'hasMany' | 'belongsTo' | 'manyToMany';
  model: string;
  foreignKey?: string;
  through?: string;
}

// Query builder types
export interface QueryBuilder<T = Record<string, unknown>> {
  select<K extends keyof T>(columns?: K[]): QueryBuilder<Pick<T, K>>;
  where(condition: WhereCondition): QueryBuilder<T>;
  whereIn(column: keyof T, values: unknown[]): QueryBuilder<T>;
  orderBy(column: keyof T, direction?: 'asc' | 'desc'): QueryBuilder<T>;
  limit(count: number): QueryBuilder<T>;
  offset(count: number): QueryBuilder<T>;
  join(table: string, condition: JoinCondition): QueryBuilder<T>;
  leftJoin(table: string, condition: JoinCondition): QueryBuilder<T>;
  rightJoin(table: string, condition: JoinCondition): QueryBuilder<T>;
  groupBy(columns: (keyof T)[]): QueryBuilder<T>;
  having(condition: WhereCondition): QueryBuilder<T>;
  union(query: QueryBuilder<T>): QueryBuilder<T>;
  insert(data: Partial<T>): QueryBuilder<T>;
  update(data: Partial<T>): QueryBuilder<T>;
  delete(): QueryBuilder<T>;
  first(): Promise<T | null>;
  many(): Promise<T[]>;
  count(): Promise<number>;
  exists(): Promise<boolean>;
}

// Where condition with proper typing
export type WhereCondition = string | Record<string, unknown> | WhereCondition[];

// Join condition with proper typing
export type JoinCondition = string | Record<string, unknown>;

// Database-specific types
export interface SupabaseConfig extends DatabaseConfig {
  provider: 'supabase';
  anonKey?: string;
  serviceRoleKey?: string;
  schema?: string;
}

export interface NeonConfig extends DatabaseConfig {
  provider: 'neon';
  apiKey?: string;
  projectId?: string;
  branch?: string;
}

export interface PostgresConfig extends DatabaseConfig {
  provider: 'postgres';
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  schema?: string;
}

// Connection pool types
export interface ConnectionPool {
  get(): Promise<Connection>;
  release(connection: Connection): Promise<void>;
  destroy(): Promise<void>;
  stats(): PoolStats;
}

// Connection interface with proper typing
export interface Connection {
  query<T = unknown>(sql: string, params?: unknown[]): Promise<QueryResult<T>>;
  release(): Promise<void>;
  destroy(): Promise<void>;
}

export interface PoolStats {
  totalConnections: number;
  activeConnections: number;
  idleConnections: number;
  waitingRequests: number;
}

// Database events
// Database event with proper typing
export interface DatabaseEvent {
  type: 'query' | 'transaction' | 'connection' | 'error';
  timestamp: Date;
  data: unknown;
  metadata?: {
    duration?: number;
    affectedRows?: number;
    queryId?: string;
  };
}

export interface DatabaseEventHandler {
  (event: DatabaseEvent): void;
}

// Database events interface with proper typing
export interface DatabaseEvents {
  on(event: string, handler: DatabaseEventHandler): void;
  off(event: string, handler: DatabaseEventHandler): void;
  emit(event: string, data: unknown): void;
  removeAllListeners(event?: string): void;
  listenerCount(event: string): number;
}

// Tenant context types for multi-tenant isolation
export interface TenantContext {
  id: string;
  domain?: string;
  name?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantScopedQuery {
  sql: string;
  params?: unknown[];
  tenantId: string;
  ensureTenantIsolation: boolean;
}

export interface TenantValidationResult {
  isValid: boolean;
  tenantId?: string;
  error?: string;
}

// Tenant context provider interface
export interface TenantContextProvider {
  /**
   * Get current tenant context from request
   */
  getCurrentTenant(): TenantContext | null;
  
  /**
   * Validate tenant access permissions
   */
  validateTenantAccess(tenantId: string): Promise<TenantValidationResult>;
  
  /**
   * Set tenant context for current request
   */
  setTenantContext(tenant: TenantContext): void;
  
  /**
   * Clear tenant context
   */
  clearTenantContext(): void;
  
  /**
   * Check if tenant scoping is required for this environment
   */
  requiresTenantScoping(): boolean;
}
