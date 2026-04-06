/**
 * Base Deployment Adapter
 *
 * Abstract base class providing common functionality for all deployment adapters.
 * Implements shared patterns for error handling, validation, and monitoring.
 */

import type {
  DeploymentAdapter,
  DeploymentConfig,
  DeploymentOptions,
  DeploymentResult,
  EnvironmentConfig,
  HealthCheck,
  RollbackStrategy,
  ValidationResult,
  CleanupOptions,
  CleanupResult,
  DeploymentMetrics,
  DeploymentEvent,
  DeploymentAlert,
  DeploymentMonitor,
} from '../interfaces/deployment.adapter';
import type { DeploymentStatus, DeploymentError, DeploymentState } from '../types/deployment.types';

/**
 * Abstract base adapter with shared implementation
 */
export abstract class BaseDeploymentAdapter implements DeploymentAdapter {
  protected config: DeploymentConfig;
  protected monitor?: DeploymentMonitor;
  protected eventListeners: Map<string, ((event: DeploymentEvent) => void)[]> = new Map();

  constructor(config: DeploymentConfig) {
    this.config = config;
  }

  /**
   * Initialize the adapter with provider-specific configuration
   */
  async initialize(config: DeploymentConfig): Promise<void> {
    this.config = config;
    await this.validateConfig(config);
    await this.setupProvider();
    this.emitEvent({
      type: 'deployment.started',
      deploymentId: 'init',
      projectId: config.projectId,
      environment: config.environment,
      timestamp: new Date(),
    });
  }

  /**
   * Abstract method for provider-specific setup
   */
  protected abstract setupProvider(): Promise<void>;

  /**
   * Deploy a new version of the application
   */
  async deploy(options: DeploymentOptions): Promise<DeploymentResult> {
    try {
      // Validate deployment options
      const validation = await this.validateDeploymentOptions(options);
      if (!validation.valid) {
        throw new Error(`Deployment validation failed: ${validation.errors.join(', ')}`);
      }

      // Emit deployment started event
      const deploymentId = this.generateDeploymentId();
      this.emitEvent({
        type: 'deployment.started',
        deploymentId,
        projectId: this.config.projectId,
        environment: options.targetEnvironment || this.config.environment,
        timestamp: new Date(),
        data: { options },
      });

      // Execute provider-specific deployment
      const result = await this.executeDeployment(deploymentId, options);

      // Emit deployment completed event
      this.emitEvent({
        type: result.status === 'ready' ? 'deployment.ready' : 'deployment.failed',
        deploymentId,
        projectId: this.config.projectId,
        environment: options.targetEnvironment || this.config.environment,
        timestamp: new Date(),
        data: { result },
      });

      return result;
    } catch (error) {
      const deploymentError = this.handleError(error);
      this.emitEvent({
        type: 'deployment.failed',
        deploymentId: 'unknown',
        projectId: this.config.projectId,
        environment: this.config.environment,
        timestamp: new Date(),
        data: { error: deploymentError },
      });
      throw deploymentError;
    }
  }

  /**
   * Abstract method for provider-specific deployment execution
   */
  protected abstract executeDeployment(
    deploymentId: string,
    options: DeploymentOptions
  ): Promise<DeploymentResult>;

  /**
   * Get the status of a specific deployment
   */
  async getDeploymentStatus(deploymentId: string): Promise<DeploymentResult> {
    try {
      const state = await this.getDeploymentState(deploymentId);
      return this.mapStateToResult(state);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Abstract method for getting deployment state
   */
  protected abstract getDeploymentState(deploymentId: string): Promise<DeploymentState>;

  /**
   * List all deployments for the project
   */
  async listDeployments(limit?: number): Promise<DeploymentResult[]> {
    try {
      const states = await this.listDeploymentStates(limit);
      return states.map((state) => this.mapStateToResult(state));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Abstract method for listing deployment states
   */
  protected abstract listDeploymentStates(limit?: number): Promise<DeploymentState[]>;

  /**
   * Rollback to a previous deployment
   */
  async rollback(deploymentId: string, strategy?: RollbackStrategy): Promise<DeploymentResult> {
    try {
      this.emitEvent({
        type: 'rollback.started',
        deploymentId,
        projectId: this.config.projectId,
        environment: this.config.environment,
        timestamp: new Date(),
        data: { strategy },
      });

      const result = await this.executeRollback(deploymentId, strategy);

      this.emitEvent({
        type: 'rollback.completed',
        deploymentId,
        projectId: this.config.projectId,
        environment: this.config.environment,
        timestamp: new Date(),
        data: { result },
      });

      return result;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Abstract method for executing rollback
   */
  protected abstract executeRollback(
    deploymentId: string,
    strategy?: RollbackStrategy
  ): Promise<DeploymentResult>;

  /**
   * Get environment configuration
   */
  async getEnvironment(environment: string): Promise<EnvironmentConfig> {
    try {
      return await this.getEnvironmentConfig(environment);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Abstract method for getting environment config
   */
  protected abstract getEnvironmentConfig(environment: string): Promise<EnvironmentConfig>;

  /**
   * Update environment configuration
   */
  async updateEnvironment(
    environment: string,
    config: Partial<EnvironmentConfig>
  ): Promise<EnvironmentConfig> {
    try {
      return await this.updateEnvironmentConfig(environment, config);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Abstract method for updating environment config
   */
  protected abstract updateEnvironmentConfig(
    environment: string,
    config: Partial<EnvironmentConfig>
  ): Promise<EnvironmentConfig>;

  /**
   * Set environment variables or secrets
   */
  async setEnvironmentVariables(
    environment: string,
    variables: Record<string, string>,
    isSecret = false
  ): Promise<void> {
    try {
      await this.setVariables(environment, variables, isSecret);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Abstract method for setting variables
   */
  protected abstract setVariables(
    environment: string,
    variables: Record<string, string>,
    isSecret: boolean
  ): Promise<void>;

  /**
   * Delete a deployment
   */
  async deleteDeployment(deploymentId: string): Promise<void> {
    try {
      await this.deleteDeploymentById(deploymentId);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Abstract method for deleting deployment
   */
  protected abstract deleteDeploymentById(deploymentId: string): Promise<void>;

  /**
   * Get deployment logs
   */
  async getLogs(deploymentId: string): Promise<string[]> {
    try {
      return await this.getDeploymentLogs(deploymentId);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Abstract method for getting logs
   */
  protected abstract getDeploymentLogs(deploymentId: string): Promise<string[]>;

  /**
   * Perform health check on deployed application
   */
  async healthCheck(url: string, options?: HealthCheck): Promise<boolean> {
    try {
      const healthOptions = {
        expectedStatus: 200,
        timeout: 30000,
        retries: 3,
        ...options,
      };

      for (let attempt = 1; attempt <= healthOptions.retries!; attempt++) {
        try {
          const response = await fetch(url, {
            method: 'GET',
            signal: AbortSignal.timeout(healthOptions.timeout!),
          });

          if (response.status === healthOptions.expectedStatus) {
            return true;
          }

          // If not the last attempt, wait before retry
          if (attempt < healthOptions.retries!) {
            await this.delay(2000 * attempt); // Exponential backoff
          }
        } catch (error) {
          if (attempt === healthOptions.retries!) {
            throw error;
          }
          await this.delay(2000 * attempt);
        }
      }

      return false;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get deployment metrics and analytics
   */
  async getMetrics(deploymentId: string): Promise<DeploymentMetrics> {
    try {
      return await this.getDeploymentMetrics(deploymentId);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Abstract method for getting metrics
   */
  protected abstract getDeploymentMetrics(deploymentId: string): Promise<DeploymentMetrics>;

  /**
   * Validate configuration before deployment
   */
  async validateConfig(config: DeploymentConfig): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Basic validation
    if (!config.projectId) {
      errors.push('Project ID is required');
    }

    if (!config.environment) {
      errors.push('Environment is required');
    }

    if (!['development', 'staging', 'production'].includes(config.environment)) {
      errors.push('Environment must be one of: development, staging, production');
    }

    // Provider-specific validation
    const providerValidation = await this.validateProviderConfig(config);
    errors.push(...providerValidation.errors);
    warnings.push(...providerValidation.warnings);
    recommendations.push(...providerValidation.recommendations);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      recommendations,
    };
  }

  /**
   * Abstract method for provider-specific config validation
   */
  protected abstract validateProviderConfig(config: DeploymentConfig): Promise<ValidationResult>;

  /**
   * Clean up old deployments
   */
  async cleanup(options: CleanupOptions): Promise<CleanupResult> {
    try {
      return await this.cleanupDeployments(options);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Abstract method for cleanup
   */
  protected abstract cleanupDeployments(options: CleanupOptions): Promise<CleanupResult>;

  /**
   * Helper methods
   */
  protected generateDeploymentId(): string {
    return `deploy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  protected mapStateToResult(state: DeploymentState): DeploymentResult {
    return {
      id: state.id,
      url: state.url || '',
      status: this.mapStatus(state.status),
      createdAt: new Date(state.createdAt),
      updatedAt: new Date(state.updatedAt),
      logs: [],
      error: state.error,
      metrics: state.meta?.metrics,
    };
  }

  protected mapStatus(status: DeploymentStatus): DeploymentResult['status'] {
    switch (status) {
      case 'queued':
      case 'building':
        return 'building';
      case 'ready':
        return 'ready';
      case 'error':
      case 'failed':
      case 'canceled':
        return 'error';
      case 'inactive':
        return 'pending';
      default:
        return 'pending';
    }
  }

  protected handleError(error: unknown): DeploymentError {
    if (error instanceof Error) {
      return {
        code: 'DEPLOYMENT_ERROR',
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        context: { provider: this.config.provider },
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: String(error),
      timestamp: new Date().toISOString(),
      context: { provider: this.config.provider },
    };
  }

  protected async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  protected emitEvent(event: DeploymentEvent): void {
    const listeners = this.eventListeners.get(event.type) || [];
    listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });

    // Also send to monitor if available
    if (this.monitor) {
      // This would be implemented by the monitor
      this.monitor.generateAlert({
        type: event.type.includes('failed') ? 'error' : 'info',
        message: `Deployment ${event.type.replace('.', ' ')}`,
        timestamp: event.timestamp,
        deploymentId: event.deploymentId,
      });
    }
  }

  /**
   * Validate deployment options
   */
  protected async validateDeploymentOptions(options: DeploymentOptions): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    if (options.force && options.targetEnvironment === 'production') {
      warnings.push('Force deployment to production is risky');
    }

    if (!options.message) {
      recommendations.push('Add a deployment message for better tracking');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      recommendations,
    };
  }

  /**
   * Set deployment monitor for event handling
   */
  setMonitor(monitor: DeploymentMonitor): void {
    this.monitor = monitor;
  }

  /**
   * Subscribe to deployment events
   */
  subscribe(events: string[], callback: (event: DeploymentEvent) => void): void {
    events.forEach((eventType) => {
      const listeners = this.eventListeners.get(eventType) || [];
      listeners.push(callback);
      this.eventListeners.set(eventType, listeners);
    });
  }

  /**
   * Unsubscribe from deployment events
   */
  unsubscribe(events: string[], callback: (event: DeploymentEvent) => void): void {
    events.forEach((eventType) => {
      const listeners = this.eventListeners.get(eventType) || [];
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
        this.eventListeners.set(eventType, listeners);
      }
    });
  }
}
