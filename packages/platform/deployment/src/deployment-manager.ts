/**
 * Main deployment manager class that provides a high-level API
 */

import type {
  DeploymentOptions,
  DeploymentResult,
  EnvironmentConfig,
  RollbackStrategy,
  ValidationResult,
  CleanupOptions,
  HealthCheck,
  DeploymentEvent,
} from './interfaces/deployment.adapter';
import { type EnvironmentDefinition } from './environment/env-manager';
import {
  EnvironmentManager,
  type EnvironmentManagerConfig,
} from './environment/env-manager';
import {
  DeploymentMonitorImpl,
  type MonitoringConfig,
  type DashboardData,
} from './monitoring/deployment-monitor';
import {
  DeploymentAdapterFactoryImpl,
} from './factory/deployment.factory';

/**
 * Deployment manager configuration
 */
export interface DeploymentManagerConfig {
  environments: EnvironmentManagerConfig;
  monitoring: MonitoringConfig;
}

export class DeploymentManager {
  private environmentManager: EnvironmentManager;
  private monitor: DeploymentMonitorImpl;
  private factory: DeploymentAdapterFactoryImpl;

  constructor(config: DeploymentManagerConfig) {
    this.factory = DeploymentAdapterFactoryImpl.getInstance();
    this.environmentManager = new EnvironmentManager(config.environments);
    this.monitor = new DeploymentMonitorImpl(config.monitoring);

    // Register monitor with environment manager
    this.setupMonitoring();
  }

  /**
   * Deploy to specified environment
   */
  async deploy(
    environmentName: string,
    options: DeploymentOptions = {}
  ): Promise<DeploymentResult> {
    const adapter = await this.environmentManager.getAdapter(environmentName);
    return await adapter.deploy(options);
  }

  /**
   * Rollback deployment
   */
  async rollback(
    environmentName: string,
    deploymentId: string,
    strategy?: RollbackStrategy
  ): Promise<DeploymentResult> {
    const adapter = await this.environmentManager.getAdapter(environmentName);
    return await adapter.rollback(deploymentId, strategy);
  }

  /**
   * Get deployment status
   */
  async getDeploymentStatus(
    environmentName: string,
    deploymentId: string
  ): Promise<DeploymentResult> {
    const adapter = await this.environmentManager.getAdapter(environmentName);
    return await adapter.getDeploymentStatus(deploymentId);
  }

  /**
   * List deployments for environment
   */
  async listDeployments(environmentName: string, limit?: number): Promise<DeploymentResult[]> {
    const adapter = await this.environmentManager.getAdapter(environmentName);
    return await adapter.listDeployments(limit);
  }

  /**
   * Get environment configuration
   */
  async getEnvironment(environmentName: string): Promise<EnvironmentConfig> {
    return await this.environmentManager.getEnvironment(environmentName);
  }

  /**
   * Update environment configuration
   */
  async updateEnvironment(
    environmentName: string,
    config: Partial<EnvironmentDefinition>
  ): Promise<EnvironmentConfig> {
    return await this.environmentManager.updateEnvironment(environmentName, config);
  }

  /**
   * Set environment variable
   */
  async setVariable(
    environmentName: string,
    key: string,
    value: string,
    isSecret = false
  ): Promise<void> {
    await this.environmentManager.setVariable(environmentName, key, value, isSecret);
  }

  /**
   * Perform health check
   */
  async healthCheck(
    environmentName: string,
    url?: string,
    options?: HealthCheck
  ): Promise<boolean> {
    const adapter = await this.environmentManager.getAdapter(environmentName);
    const checkUrl = url || (await this.environmentManager.getEnvironment(environmentName)).url;

    if (!checkUrl) {
      throw new Error('No URL available for health check');
    }

    return await adapter.healthCheck(checkUrl, options);
  }

  /**
   * Get monitoring dashboard data
   */
  async getDashboardData(): Promise<DashboardData> {
    return await this.monitor.getDashboardData();
  }

  /**
   * Subscribe to deployment events
   */
  subscribe(events: string[], callback: (event: DeploymentEvent) => void): void {
    this.monitor.subscribe(events, callback);
  }

  /**
   * Unsubscribe from deployment events
   */
  unsubscribe(events: string[], callback: (event: DeploymentEvent) => void): void {
    this.monitor.unsubscribe(events, callback);
  }

  /**
   * Validate environment configuration
   */
  async validateEnvironment(environmentName: string): Promise<ValidationResult> {
    return await this.environmentManager.validateEnvironment(environmentName);
  }

  /**
   * Sync environment with provider
   */
  async syncEnvironment(environmentName: string): Promise<void> {
    await this.environmentManager.syncEnvironment(environmentName);
  }

  /**
   * Clean up old deployments
   */
  async cleanup(environmentName: string, options: CleanupOptions): Promise<any> {
    const adapter = await this.environmentManager.getAdapter(environmentName);
    return await adapter.cleanup(options);
  }

  /**
   * Export environment configuration
   */
  exportEnvironment(environmentName: string, includeSecrets = false): string {
    return this.environmentManager.exportEnvironment(environmentName, includeSecrets);
  }

  /**
   * Import environment configuration
   */
  async importEnvironment(environmentData: string, overwrite = false): Promise<void> {
    await this.environmentManager.importEnvironment(environmentData, overwrite);
  }

  /**
   * Private methods
   */
  private setupMonitoring(): void {
    // Register all adapters with monitor as they are created
    const originalGetAdapter = this.environmentManager.getAdapter.bind(this.environmentManager);

    this.environmentManager.getAdapter = async (environmentName: string) => {
      const adapter = await originalGetAdapter(environmentName);
      this.monitor.registerAdapter(adapter);
      return adapter;
    };
  }
}

/**
 * Create deployment manager with default configuration
 */
export function createDeploymentManager(
  config: Partial<DeploymentManagerConfig> = {}
): DeploymentManager {
  const defaultConfig: DeploymentManagerConfig = {
    environments: {
      environments: {
        development: {
          name: 'development',
          branch: 'develop',
          variables: {},
          secrets: {},
        },
        staging: {
          name: 'staging',
          branch: 'staging',
          variables: {},
          secrets: {},
          protected: false,
        },
        production: {
          name: 'production',
          branch: 'main',
          variables: {},
          secrets: {},
          protected: true,
        },
      },
      secretsProvider: 'local',
    },
    monitoring: {
      alertThresholds: {
        errorRate: 5,
        responseTime: 5000,
        buildTime: 10,
        deploymentTime: 5,
        costThreshold: 100,
      },
      healthCheckInterval: 30000,
      alertChannels: [],
      retentionPeriod: 30,
      enableRealTimeMonitoring: true,
    },
  };

  const mergedConfig = {
    environments: { ...defaultConfig.environments, ...config.environments },
    monitoring: { ...defaultConfig.monitoring, ...config.monitoring },
  };

  return new DeploymentManager(mergedConfig);
}

/**
 * Quick deploy function for simple use cases
 */
export async function quickDeploy(
  provider: string,
  config: any,
  options: DeploymentOptions = {}
): Promise<DeploymentResult> {
  const { createDeploymentAdapter } = await import('./factory/deployment.factory');
  const adapter = await createDeploymentAdapter(provider, config);
  return await adapter.deploy(options);
}

/**
 * Quick rollback function for simple use cases
 */
export async function quickRollback(
  provider: string,
  config: any,
  deploymentId: string,
  strategy?: RollbackStrategy
): Promise<DeploymentResult> {
  const { createDeploymentAdapter } = await import('./factory/deployment.factory');
  const adapter = await createDeploymentAdapter(provider, config);
  return await adapter.rollback(deploymentId, strategy);
}
