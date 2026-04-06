/**
 * Deployment Adapter Interface
 *
 * Provider-agnostic interface for deployment operations across
 * Vercel, Netlify, Cloudflare Pages, and other platforms.
 */

export interface DeploymentConfig {
  provider: 'vercel' | 'netlify' | 'cloudflare' | 'custom';
  projectId: string;
  teamId?: string;
  environment: 'development' | 'staging' | 'production';
  domain?: string;
  buildCommand?: string;
  outputDirectory?: string;
  nodeVersion?: string;
  environmentVariables?: Record<string, string>;
  secrets?: Record<string, string>;
}

export interface DeploymentOptions {
  branch?: string;
  message?: string;
  force?: boolean;
  skipBuild?: boolean;
  targetEnvironment?: 'development' | 'staging' | 'production';
  metadata?: Record<string, any>;
}

export interface DeploymentResult {
  id: string;
  url: string;
  status: 'pending' | 'building' | 'ready' | 'error' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  logs?: string[];
  error?: string;
  metrics?: DeploymentMetrics;
}

export interface DeploymentMetrics {
  buildTime: number;
  deployTime: number;
  bundleSize: number;
  lighthouseScore?: number;
  performanceScore?: number;
}

export interface EnvironmentConfig {
  name: string;
  branch: string;
  url?: string;
  variables: Record<string, string>;
  secrets: Record<string, string>;
  protected?: boolean;
}

export interface HealthCheck {
  url: string;
  expectedStatus?: number;
  timeout?: number;
  retries?: number;
}

export interface DeploymentAlert {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  deploymentId: string;
  metadata?: Record<string, any>;
}

export interface RollbackStrategy {
  type: 'automatic' | 'manual';
  threshold?: number; // Error rate threshold for automatic rollback
  timeout?: number; // Time before automatic rollback
  previousDeploymentId?: string;
}

/**
 * Core deployment adapter interface that all providers must implement
 */
export interface DeploymentAdapter {
  /**
   * Initialize the adapter with provider-specific configuration
   */
  initialize(config: DeploymentConfig): Promise<void>;

  /**
   * Deploy a new version of the application
   */
  deploy(options: DeploymentOptions): Promise<DeploymentResult>;

  /**
   * Get the status of a specific deployment
   */
  getDeploymentStatus(deploymentId: string): Promise<DeploymentResult>;

  /**
   * List all deployments for the project
   */
  listDeployments(limit?: number): Promise<DeploymentResult[]>;

  /**
   * Rollback to a previous deployment
   */
  rollback(deploymentId: string, strategy?: RollbackStrategy): Promise<DeploymentResult>;

  /**
   * Get environment configuration
   */
  getEnvironment(environment: string): Promise<EnvironmentConfig>;

  /**
   * Update environment configuration
   */
  updateEnvironment(
    environment: string,
    config: Partial<EnvironmentConfig>
  ): Promise<EnvironmentConfig>;

  /**
   * Set environment variables or secrets
   */
  setEnvironmentVariables(
    environment: string,
    variables: Record<string, string>,
    isSecret?: boolean
  ): Promise<void>;

  /**
   * Delete a deployment
   */
  deleteDeployment(deploymentId: string): Promise<void>;

  /**
   * Get deployment logs
   */
  getLogs(deploymentId: string): Promise<string[]>;

  /**
   * Perform health check on deployed application
   */
  healthCheck(url: string, options?: HealthCheck): Promise<boolean>;

  /**
   * Get deployment metrics and analytics
   */
  getMetrics(deploymentId: string): Promise<DeploymentMetrics>;

  /**
   * Validate configuration before deployment
   */
  validateConfig(config: DeploymentConfig): Promise<ValidationResult>;

  /**
   * Clean up old deployments
   */
  cleanup(options: CleanupOptions): Promise<CleanupResult>;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

export interface CleanupOptions {
  keepCount?: number;
  olderThan?: Date;
  environments?: string[];
  dryRun?: boolean;
}

export interface CleanupResult {
  deletedDeployments: string[];
  freedSpace: number;
  errors: string[];
}

/**
 * Factory interface for creating deployment adapters
 */
export interface DeploymentAdapterFactory {
  createAdapter(provider: string, config: DeploymentConfig): Promise<DeploymentAdapter>;
  getSupportedProviders(): string[];
  validateProviderConfig(provider: string, config: DeploymentConfig): ValidationResult;
}

/**
 * Deployment event types for monitoring and webhooks
 */
export interface DeploymentEvent {
  type:
    | 'deployment.started'
    | 'deployment.building'
    | 'deployment.ready'
    | 'deployment.failed'
    | 'rollback.started'
    | 'rollback.completed';
  deploymentId: string;
  projectId: string;
  environment: string;
  timestamp: Date;
  data?: Record<string, any>;
}

/**
 * Interface for deployment monitoring and alerting
 */
export interface DeploymentMonitor {
  subscribe(events: string[], callback: (event: DeploymentEvent) => void): void;
  unsubscribe(events: string[], callback: (event: DeploymentEvent) => void): void;
  getActiveDeployments(): Promise<DeploymentResult[]>;
  getFailedDeployments(timeframe?: number): Promise<DeploymentResult[]>;
  generateAlert(event: DeploymentEvent): DeploymentAlert;
}
