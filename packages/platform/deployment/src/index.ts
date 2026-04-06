/**
 * Platform Barrel File
 * 
 * WARNING: This barrel file has 10 exports.
 * Consider splitting into smaller, focused barrel files:
 * - adapters/index.ts
 * - types/index.ts  
 * - utils/index.ts
 * - contracts/index.ts
 */

/**
 * Platform Deployment Package
 *
 * Comprehensive deployment automation platform supporting Vercel, Netlify,
 * Cloudflare Pages, and custom providers with zero-downtime deployments,
 * environment management, and real-time monitoring.
 */

// Core interfaces and types
export * from './interfaces/deployment.adapter';
export * from './types/deployment.types';

// Adapters
export { VercelAdapter } from './adapters/vercel.adapter';
export { NetlifyAdapter } from './adapters/netlify.adapter';
export { CloudflareAdapter } from './adapters/cloudflare.adapter';

// Factory
export {
  DeploymentAdapterFactoryImpl,
  deploymentFactory,
  createDeploymentAdapter,
  validateDeploymentConfig,
  getAvailableProviders,
} from './factory/deployment.factory';

// Environment management
export {
  EnvironmentManager,
  type EnvironmentManagerConfig,
} from './environment/env-manager';

// Monitoring
export {
  DeploymentMonitorImpl,
  type MonitoringConfig,
  type AlertThresholds,
} from './monitoring/deployment-monitor';

// Main deployment manager
export {
  DeploymentManager,
  createDeploymentManager,
  quickDeploy,
  quickRollback,
  type DeploymentManagerConfig,
} from './deployment-manager';

// Utilities
export * from './utils/deployment-utils';

