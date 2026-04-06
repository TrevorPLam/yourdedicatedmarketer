/**
 * Environment Manager
 *
 * Manages environment configuration, validation, and secrets management
 * for deployment operations across different providers.
 */

import type {
  DeploymentConfig,
  EnvironmentConfig,
  ValidationResult,
  DeploymentAdapter,
} from '../interfaces/deployment.adapter';
import { DeploymentAdapterFactory } from '../factory/deployment.factory';
import type { EnvironmentVariable, ProviderConfig } from '../types/deployment.types';

/**
 * Environment configuration interface
 */
export interface EnvironmentManagerConfig {
  defaultEnvironment?: string;
  environments: Record<string, EnvironmentDefinition>;
  globalVariables?: Record<string, string>;
  secretsProvider?: 'local' | 'vault' | 'aws' | 'azure' | 'gcp';
  encryptionKey?: string;
}

export interface EnvironmentDefinition {
  name: string;
  branch: string;
  url?: string;
  variables: Record<string, EnvironmentVariable>;
  secrets: Record<string, EnvironmentVariable>;
  protected?: boolean;
  deploymentConfig?: Partial<DeploymentConfig>;
  providers?: Record<string, ProviderConfig>;
}

/**
 * Environment manager implementation
 */
export class EnvironmentManager {
  private config: EnvironmentManagerConfig;
  private factory: DeploymentAdapterFactory;
  private adapters = new Map<string, DeploymentAdapter>();
  private secretsManager: SecretsManager;

  constructor(config: EnvironmentManagerConfig) {
    this.config = config;
    this.factory = DeploymentAdapterFactoryImpl.getInstance();
    this.secretsManager = new SecretsManager(config);
  }

  /**
   * Get environment configuration
   */
  async getEnvironment(environmentName: string): Promise<EnvironmentConfig> {
    const envDef = this.config.environments[environmentName];
    if (!envDef) {
      throw new Error(`Environment ${environmentName} not found`);
    }

    return {
      name: envDef.name,
      branch: envDef.branch,
      url: envDef.url,
      variables: this.convertVariables(envDef.variables),
      secrets: this.convertVariables(envDef.secrets),
      protected: envDef.protected || false,
    };
  }

  /**
   * Update environment configuration
   */
  async updateEnvironment(
    environmentName: string,
    updates: Partial<EnvironmentDefinition>
  ): Promise<EnvironmentConfig> {
    const currentEnv = this.config.environments[environmentName];
    if (!currentEnv) {
      throw new Error(`Environment ${environmentName} not found`);
    }

    // Merge updates with current configuration
    const updatedEnv: EnvironmentDefinition = {
      ...currentEnv,
      ...updates,
      variables: { ...currentEnv.variables, ...(updates.variables || {}) },
      secrets: { ...currentEnv.secrets, ...(updates.secrets || {}) },
    };

    this.config.environments[environmentName] = updatedEnv;

    // Update deployment adapters if they exist
    await this.updateAdapters(environmentName, updatedEnv);

    return this.getEnvironment(environmentName);
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
    const env = this.config.environments[environmentName];
    if (!env) {
      throw new Error(`Environment ${environmentName} not found`);
    }

    const variable: EnvironmentVariable = {
      key,
      value: isSecret ? await this.secretsManager.encrypt(value) : value,
      type: isSecret ? 'secret' : 'plain',
      environments: [environmentName],
      updatedAt: new Date().toISOString(),
    };

    if (isSecret) {
      env.secrets[key] = variable;
    } else {
      env.variables[key] = variable;
    }

    // Update adapters
    await this.updateAdapters(environmentName, env);
  }

  /**
   * Get environment variable
   */
  async getVariable(
    environmentName: string,
    key: string,
    isSecret = false
  ): Promise<string | undefined> {
    const env = this.config.environments[environmentName];
    if (!env) {
      throw new Error(`Environment ${environmentName} not found`);
    }

    const variables = isSecret ? env.secrets : env.variables;
    const variable = variables[key];

    if (!variable) {
      return undefined;
    }

    return isSecret ? await this.secretsManager.decrypt(variable.value) : variable.value;
  }

  /**
   * Delete environment variable
   */
  async deleteVariable(environmentName: string, key: string, isSecret = false): Promise<void> {
    const env = this.config.environments[environmentName];
    if (!env) {
      throw new Error(`Environment ${environmentName} not found`);
    }

    if (isSecret) {
      delete env.secrets[key];
    } else {
      delete env.variables[key];
    }

    // Update adapters
    await this.updateAdapters(environmentName, env);
  }

  /**
   * Validate environment configuration
   */
  async validateEnvironment(environmentName: string): Promise<ValidationResult> {
    const env = this.config.environments[environmentName];
    if (!env) {
      return {
        valid: false,
        errors: [`Environment ${environmentName} not found`],
        warnings: [],
        recommendations: [],
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Basic validation
    if (!env.name) {
      errors.push('Environment name is required');
    }

    if (!env.branch) {
      errors.push('Branch is required');
    }

    // Validate variables
    const variableValidation = this.validateVariables(env.variables, false);
    errors.push(...variableValidation.errors);
    warnings.push(...variableValidation.warnings);

    // Validate secrets
    const secretValidation = this.validateVariables(env.secrets, true);
    errors.push(...secretValidation.errors);
    warnings.push(...secretValidation.warnings);

    // Validate deployment config
    if (env.deploymentConfig) {
      const provider = env.deploymentConfig.provider;
      if (provider) {
        const providerValidation = this.factory.validateProviderConfig(
          provider,
          env.deploymentConfig
        );
        errors.push(...providerValidation.errors);
        warnings.push(...providerValidation.warnings);
        recommendations.push(...providerValidation.recommendations);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      recommendations,
    };
  }

  /**
   * Get deployment adapter for environment
   */
  async getAdapter(environmentName: string): Promise<DeploymentAdapter> {
    const cacheKey = `adapter_${environmentName}`;

    if (this.adapters.has(cacheKey)) {
      return this.adapters.get(cacheKey)!;
    }

    const env = this.config.environments[environmentName];
    if (!env) {
      throw new Error(`Environment ${environmentName} not found`);
    }

    const deploymentConfig = this.buildDeploymentConfig(env);
    const adapter = await this.factory.createAdapter(deploymentConfig.provider!, deploymentConfig);

    this.adapters.set(cacheKey, adapter);
    return adapter;
  }

  /**
   * List all environments
   */
  listEnvironments(): string[] {
    return Object.keys(this.config.environments);
  }

  /**
   * Create new environment
   */
  async createEnvironment(environmentDef: EnvironmentDefinition): Promise<void> {
    if (this.config.environments[environmentDef.name]) {
      throw new Error(`Environment ${environmentDef.name} already exists`);
    }

    // Validate environment definition
    const validation = await this.validateEnvironmentDefinition(environmentDef);
    if (!validation.valid) {
      throw new Error(`Invalid environment definition: ${validation.errors.join(', ')}`);
    }

    this.config.environments[environmentDef.name] = environmentDef;
  }

  /**
   * Delete environment
   */
  async deleteEnvironment(environmentName: string): Promise<void> {
    const env = this.config.environments[environmentName];
    if (!env) {
      throw new Error(`Environment ${environmentName} not found`);
    }

    if (env.protected) {
      throw new Error(`Cannot delete protected environment ${environmentName}`);
    }

    delete this.config.environments[environmentName];

    // Remove cached adapter
    const cacheKey = `adapter_${environmentName}`;
    this.adapters.delete(cacheKey);
  }

  /**
   * Export environment configuration
   */
  exportEnvironment(environmentName: string, includeSecrets = false): string {
    const env = this.config.environments[environmentName];
    if (!env) {
      throw new Error(`Environment ${environmentName} not found`);
    }

    const exportData = {
      name: env.name,
      branch: env.branch,
      url: env.url,
      protected: env.protected,
      variables: env.variables,
      deploymentConfig: env.deploymentConfig,
    };

    if (includeSecrets) {
      (exportData as any).secrets = env.secrets;
    }

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import environment configuration
   */
  async importEnvironment(environmentData: string, overwrite = false): Promise<void> {
    try {
      const envDef = JSON.parse(environmentData) as EnvironmentDefinition;

      if (this.config.environments[envDef.name] && !overwrite) {
        throw new Error(
          `Environment ${envDef.name} already exists. Use overwrite=true to replace.`
        );
      }

      await this.createEnvironment(envDef);
    } catch (error) {
      throw new Error(`Failed to import environment: ${error}`);
    }
  }

  /**
   * Sync environment with provider
   */
  async syncEnvironment(environmentName: string): Promise<void> {
    const adapter = await this.getAdapter(environmentName);
    const env = this.config.environments[environmentName];

    if (!env) {
      throw new Error(`Environment ${environmentName} not found`);
    }

    // Sync variables
    const variables = this.convertVariables(env.variables);
    if (Object.keys(variables).length > 0) {
      await adapter.setEnvironmentVariables(environmentName, variables, false);
    }

    // Sync secrets
    const secrets = this.convertVariables(env.secrets);
    if (Object.keys(secrets).length > 0) {
      await adapter.setEnvironmentVariables(environmentName, secrets, true);
    }
  }

  /**
   * Private helper methods
   */
  private convertVariables(variables: Record<string, EnvironmentVariable>): Record<string, string> {
    const result: Record<string, string> = {};

    Object.entries(variables).forEach(([key, variable]) => {
      result[key] = variable.value;
    });

    return result;
  }

  private validateVariables(
    variables: Record<string, EnvironmentVariable>,
    isSecret: boolean
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    Object.entries(variables).forEach(([key, variable]) => {
      // Validate key format
      if (!/^[A-Z_][A-Z0-9_]*$/.test(key)) {
        warnings.push(`Variable key "${key}" should follow uppercase underscore convention`);
      }

      // Validate value for non-secrets
      if (!isSecret && !variable.value) {
        errors.push(`Variable "${key}" cannot be empty`);
      }

      // Check for sensitive data in non-secret variables
      if (!isSecret && this.containsSensitiveData(variable.value)) {
        warnings.push(
          `Variable "${key}" appears to contain sensitive data, consider marking as secret`
        );
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      recommendations: [],
    };
  }

  private containsSensitiveData(value: string): boolean {
    const sensitivePatterns = [/password/i, /secret/i, /token/i, /key/i, /credential/i];

    return sensitivePatterns.some((pattern) => pattern.test(value));
  }

  private buildDeploymentConfig(env: EnvironmentDefinition): DeploymentConfig {
    const baseConfig: DeploymentConfig = {
      provider: 'vercel', // Default provider
      projectId: env.name,
      environment: env.name as any,
      environmentVariables: this.convertVariables(env.variables),
      secrets: this.convertVariables(env.secrets),
    };

    // Merge with environment-specific deployment config
    if (env.deploymentConfig) {
      return { ...baseConfig, ...env.deploymentConfig };
    }

    return baseConfig;
  }

  private async updateAdapters(environmentName: string, env: EnvironmentDefinition): Promise<void> {
    const cacheKey = `adapter_${environmentName}`;
    const adapter = this.adapters.get(cacheKey);

    if (adapter) {
      // Update existing adapter with new variables
      const variables = this.convertVariables(env.variables);
      const secrets = this.convertVariables(env.secrets);

      if (Object.keys(variables).length > 0) {
        await adapter.setEnvironmentVariables(environmentName, variables, false);
      }

      if (Object.keys(secrets).length > 0) {
        await adapter.setEnvironmentVariables(environmentName, secrets, true);
      }
    }
  }

  private async validateEnvironmentDefinition(
    envDef: EnvironmentDefinition
  ): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    if (!envDef.name) {
      errors.push('Environment name is required');
    }

    if (!envDef.branch) {
      errors.push('Branch is required');
    }

    if (!/^[a-z0-9_-]+$/.test(envDef.name)) {
      errors.push(
        'Environment name should contain only lowercase letters, numbers, underscores, and hyphens'
      );
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      recommendations,
    };
  }
}

/**
 * Secrets manager for handling encrypted secrets
 */
class SecretsManager {
  private config: EnvironmentManagerConfig;
  private encryptionKey: string;

  constructor(config: EnvironmentManagerConfig) {
    this.config = config;
    this.encryptionKey = config.encryptionKey || this.generateKey();
  }

  async encrypt(value: string): Promise<string> {
    // Simple encryption for demonstration
    // In production, use proper encryption libraries
    const encoded = Buffer.from(value).toString('base64');
    return `encrypted:${encoded}`;
  }

  async decrypt(encryptedValue: string): Promise<string> {
    if (encryptedValue.startsWith('encrypted:')) {
      const encoded = encryptedValue.substring(10);
      return Buffer.from(encoded, 'base64').toString();
    }
    return encryptedValue;
  }

  private generateKey(): string {
    return (
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  }
}

/**
 * Re-export factory for convenience
 */
import { DeploymentAdapterFactoryImpl } from '../factory/deployment.factory';
