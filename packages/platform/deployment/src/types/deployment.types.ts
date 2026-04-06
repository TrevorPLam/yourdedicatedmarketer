/**
 * Deployment Package Type Definitions
 *
 * Comprehensive TypeScript types for the deployment system
 */

// Types moved inline to prevent circular dependency

/**
 * Base deployment configuration interface
 */
export interface BaseDeploymentConfig {
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

/**
 * Vercel-specific configuration
 */
export interface VercelConfig extends BaseDeploymentConfig {
  provider: 'vercel';
  framework?: 'nextjs' | 'astro' | 'remix' | 'nuxt' | 'sveltekit' | 'other';
  installCommand?: string;
  devCommand?: string;
  gitRepository?: {
    owner: string;
    repo: string;
    branch?: string;
  };
  functions?: Record<string, VercelFunctionConfig>;
  routes?: VercelRoute[];
  headers?: VercelHeader[];
  rewrites?: VercelRewrite[];
}

/**
 * Netlify-specific configuration
 */
export interface NetlifyConfig extends BaseDeploymentConfig {
  provider: 'netlify';
  siteId?: string;
  publishDir?: string;
  functionsDir?: string;
  netlifyToml?: NetlifyTomlConfig;
  redirects?: NetlifyRedirect[];
  headers?: NetlifyHeader[];
  edgeFunctions?: NetlifyEdgeFunction[];
}

/**
 * Cloudflare-specific configuration
 */
export interface CloudflareConfig extends BaseDeploymentConfig {
  provider: 'cloudflare';
  accountId: string;
  projectName: string;
  outputDir?: string;
  compatibilityDate?: string;
  compatibilityFlags?: string[];
  kvNamespaces?: CloudflareKVNamespace[];
  durableObjects?: CloudflareDurableObject[];
  workers?: CloudflareWorker[];
}

/**
 * Vercel-specific types
 */
export interface VercelFunctionConfig {
  runtime?: 'nodejs18.x' | 'nodejs20.x';
  memory?: number;
  maxDuration?: number;
  includeFiles?: string[];
  excludeFiles?: string[];
}

export interface VercelRoute {
  src: string;
  dest?: string;
  methods?: string[];
  headers?: Record<string, string>;
  continue?: boolean;
  override?: boolean;
}

export interface VercelHeader {
  source: string;
  headers: Record<string, string>;
}

export interface VercelRewrite {
  source: string;
  destination: string;
  permanent?: boolean;
}

/**
 * Netlify-specific types
 */
export interface NetlifyTomlConfig {
  build?: {
    command?: string;
    publish?: string;
    functions?: string;
    environment?: Record<string, string>;
  };
  redirect?: NetlifyRedirect[];
  headers?: NetlifyHeader[];
  edge_functions?: NetlifyEdgeFunction[];
}

export interface NetlifyRedirect {
  from: string;
  to: string;
  status?: number;
  force?: boolean;
  conditions?: {
    language?: string[];
    country?: string[];
    role?: string[];
  };
}

export interface NetlifyHeader {
  for: string;
  values: Record<string, string>;
}

export interface NetlifyEdgeFunction {
  path: string;
  function: string;
  pattern?: string;
}

/**
 * Cloudflare-specific types
 */
export interface CloudflareKVNamespace {
  binding: string;
  id: string;
  preview_id?: string;
}

export interface CloudflareDurableObject {
  binding: string;
  class_name: string;
  script_name?: string;
}

export interface CloudflareWorker {
  name: string;
  script: string;
  binding?: string;
  routes?: string[];
}

/**
 * Deployment state and status types
 */
export interface DeploymentState {
  id: string;
  status: DeploymentStatus;
  url?: string;
  alias?: string[];
  createdAt: string;
  updatedAt: string;
  readyAt?: string;
  error?: string;
  meta?: Record<string, any>;
}

export type DeploymentStatus =
  | 'queued'
  | 'building'
  | 'ready'
  | 'error'
  | 'canceled'
  | 'failed'
  | 'inactive';

/**
 * Environment management types
 */
export interface EnvironmentVariable {
  key: string;
  value: string;
  type: 'plain' | 'secret';
  environments?: string[];
  updatedAt: string;
}

export interface Environment {
  id: string;
  name: string;
  type: 'production' | 'preview' | 'development';
  createdAt: string;
  updatedAt: string;
  url?: string;
  branch?: string;
  variables: EnvironmentVariable[];
}

/**
 * Build and deployment metrics
 */
export interface BuildMetrics {
  buildTime: number;
  buildSize: number;
  functionsInvoked?: number;
  coldStarts?: number;
  errors?: number;
  warnings?: number;
}

export interface DeploymentMetrics {
  deploymentId: string;
  timestamp: string;
  duration: number;
  status: DeploymentStatus;
  buildMetrics?: BuildMetrics;
  performanceMetrics?: PerformanceMetrics;
  costMetrics?: CostMetrics;
}

export interface PerformanceMetrics {
  lighthouse?: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  coreWebVitals?: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
  };
  bundleAnalysis?: {
    totalSize: number;
    gzippedSize: number;
    chunks: BundleChunk[];
  };
}

export interface BundleChunk {
  name: string;
  size: number;
  gzippedSize: number;
  modules: string[];
}

export interface CostMetrics {
  bandwidth: number;
  functionInvocations: number;
  buildMinutes: number;
  storage: number;
  estimatedCost: number;
  currency: string;
}

/**
 * Error and alert types
 */
export interface DeploymentError {
  code: string;
  message: string;
  stack?: string;
  timestamp: string;
  context?: Record<string, any>;
}

export interface DeploymentAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  deploymentId: string;
  timestamp: string;
  resolved?: boolean;
  metadata?: Record<string, any>;
}

export type AlertType =
  | 'deployment_failed'
  | 'build_error'
  | 'performance_regression'
  | 'cost_spike'
  | 'security_issue'
  | 'downtime_detected'
  | 'rollback_triggered';

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

/**
 * Rollback and recovery types
 */
export interface RollbackPlan {
  deploymentId: string;
  targetDeploymentId: string;
  strategy: RollbackStrategy;
  triggers: RollbackTrigger[];
  estimatedDowntime: number;
  riskLevel: RiskLevel;
}

export type RollbackStrategy = 'immediate' | 'gradual' | 'manual_approval' | 'automatic';

export interface RollbackTrigger {
  type: 'error_rate' | 'response_time' | 'manual' | 'health_check';
  threshold?: number;
  timeframe?: number;
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

/**
 * Integration and webhook types
 */
export interface WebhookConfig {
  url: string;
  events: WebhookEvent[];
  secret?: string;
  active: boolean;
  headers?: Record<string, string>;
}

export type WebhookEvent =
  | 'deployment.created'
  | 'deployment.ready'
  | 'deployment.failed'
  | 'rollback.started'
  | 'rollback.completed'
  | 'environment.updated';

export interface WebhookPayload {
  action: WebhookEvent;
  deployment: DeploymentState;
  project: ProjectInfo;
  timestamp: string;
}

export interface ProjectInfo {
  id: string;
  name: string;
  url?: string;
  teamId?: string;
  framework?: string;
}

/**
 * Configuration validation types
 */
export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  pattern?: RegExp;
  min?: number;
  max?: number;
  enum?: string[];
  custom?: (value: any) => boolean | string;
}

export interface ValidationSchema {
  version: string;
  rules: ValidationRule[];
  dependencies?: Record<string, string[]>;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  recommendations: ValidationRecommendation[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  severity: 'error';
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  severity: 'warning';
}

export interface ValidationRecommendation {
  field: string;
  message: string;
  action: string;
  severity: 'info';
}

/**
 * Utility types for common operations
 */
export type ProviderConfig = VercelConfig | NetlifyConfig | CloudflareConfig;

export type DeploymentProvider = 'vercel' | 'netlify' | 'cloudflare' | 'custom';

export type EnvironmentType = 'development' | 'staging' | 'production';

export type DeploymentPhase =
  | 'validation'
  | 'building'
  | 'testing'
  | 'deployment'
  | 'verification'
  | 'completed'
  | 'failed';

/**
 * Deployment options interface
 */
export interface DeploymentOptions {
  config: ProviderConfig;
  environment?: 'development' | 'staging' | 'production';
  skipBuild?: boolean;
  force?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Deployment result interface
 */
export interface DeploymentResult {
  id: string;
  url?: string;
  status: DeploymentStatus;
  createdAt: string;
  completedAt?: string;
  error?: string;
  metadata?: Record<string, any>;
}

/**
 * Helper types for type-safe operations
 */
export interface CreateDeploymentOptions extends DeploymentOptions {
  files?: DeploymentFile[];
  skipAutoCommit?: boolean;
}

export interface DeploymentFile {
  path: string;
  content: string | Buffer;
  encoding?: 'utf8' | 'base64';
}

export interface DeploymentPreview {
  url: string;
  branch: string;
  commit: string;
  status: DeploymentStatus;
  expiresAt?: string;
}

/**
 * Batch operations types
 */
export interface BatchDeploymentOptions {
  deployments: CreateDeploymentOptions[];
  concurrency?: number;
  continueOnError?: boolean;
  timeout?: number;
}

export interface BatchDeploymentResult {
  results: DeploymentResult[];
  summary: BatchSummary;
}

export interface BatchSummary {
  total: number;
  successful: number;
  failed: number;
  duration: number;
}
