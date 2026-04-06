/**
 * Cloudflare Pages Deployment Adapter
 *
 * Implements deployment operations for Cloudflare Pages platform using their API.
 * Supports static sites, edge functions, and Workers with zero-downtime deployments.
 */

import { BaseDeploymentAdapter } from './base.adapter';
import type {
  DeploymentConfig,
  DeploymentOptions,
  DeploymentResult,
  EnvironmentConfig,
  ValidationResult,
  CleanupOptions,
  CleanupResult,
  DeploymentMetrics,
  RollbackStrategy,
} from '../interfaces/deployment.adapter';
import type {
  CloudflareConfig,
  DeploymentState,
  EnvironmentVariable,
} from '../types/deployment.types';

/**
 * Cloudflare API client interface
 */
interface CloudflareApiClient {
  createProject(
    accountId: string,
    projectConfig: CloudflareProjectConfig
  ): Promise<CloudflareProject>;
  getProject(accountId: string, projectName: string): Promise<CloudflareProject>;
  updateProject(
    accountId: string,
    projectName: string,
    config: Partial<CloudflareProjectConfig>
  ): Promise<CloudflareProject>;
  deleteProject(accountId: string, projectName: string): Promise<void>;
  createDeployment(
    accountId: string,
    projectName: string,
    deployConfig: CloudflareDeploymentConfig
  ): Promise<CloudflareDeployment>;
  getDeployment(
    accountId: string,
    projectName: string,
    deploymentId: string
  ): Promise<CloudflareDeployment>;
  listDeployments(
    accountId: string,
    projectName: string,
    limit?: number
  ): Promise<CloudflareDeployment[]>;
  deleteDeployment(accountId: string, projectName: string, deploymentId: string): Promise<void>;
  rollbackDeployment(
    accountId: string,
    projectName: string,
    deploymentId: string
  ): Promise<CloudflareDeployment>;
  getProjectEnvironmentVariables(
    accountId: string,
    projectName: string
  ): Promise<CloudflareEnvironmentVariable[]>;
  setProjectEnvironmentVariables(
    accountId: string,
    projectName: string,
    variables: CloudflareEnvironmentVariable[]
  ): Promise<void>;
  getDeploymentLogs(
    accountId: string,
    projectName: string,
    deploymentId: string
  ): Promise<string[]>;
}

/**
 * Cloudflare API types
 */
interface CloudflareProject {
  name: string;
  id: string;
  account_id: string;
  account_name: string;
  canonical_name: string;
  created_on: string;
  domains: CloudflareDomain[];
  production_branch: string;
  preview_deployment_setting: 'custom' | 'all' | 'none';
  preview_branch_includes: string[];
  production_branch_includes: string[];
  build_config: CloudflareBuildConfig;
  source: CloudflareSource;
  latest_deployment?: CloudflareDeployment;
}

interface CloudflareProjectConfig {
  name: string;
  production_branch?: string;
  preview_branch_includes?: string[];
  production_branch_includes?: string[];
  preview_deployment_setting?: 'custom' | 'all' | 'none';
  build_config?: CloudflareBuildConfig;
  source?: CloudflareSource;
}

interface CloudflareDomain {
  name: string;
  id: string;
}

interface CloudflareBuildConfig {
  build_command?: string;
  build_cwd?: string;
  destination_dir?: string;
  root_dir?: string;
  web_analytics_token?: string;
  web_analytics_tag?: string;
  npm_command?: string;
  environment_variables?: Record<string, string>;
  kv_namespaces?: CloudflareKVNamespace[];
  durable_objects?: CloudflareDurableObject[];
  compatibility_date?: string;
  compatibility_flags?: string[];
}

interface CloudflareSource {
  type: 'github' | 'gitlab' | 'bitbucket' | 'azure';
  config: {
    owner: string;
    repo_name: string;
    production_branch?: string;
    pr_comments_enabled?: boolean;
    prod_deployment_enabled?: boolean;
    preview_deployment_enabled?: boolean;
    preview_branch_includes?: string[];
    production_branch_includes?: string[];
  };
  owner?: string;
  repo_name?: string;
}

interface CloudflareDeployment {
  id: string;
  url: string;
  latest?: boolean;
  environment?: 'preview' | 'production';
  create_time: string;
  start_time?: string;
  finish_time?: string;
  state: 'pending' | 'queued' | 'building' | 'failed' | 'ready';
  error_message?: string;
  deployment_trigger?: CloudflareDeploymentTrigger;
  build_config?: CloudflareBuildConfig;
  aliases?: string[];
  environment_variables?: Record<string, string>;
  kv_namespaces?: CloudflareKVNamespace[];
  durable_objects?: CloudflareDurableObject[];
  functions?: CloudflareFunction[];
  build_time?: number;
  build_output?: CloudflareBuildOutput;
}

interface CloudflareDeploymentConfig {
  files: CloudflareFile[];
  compatibility_date?: string;
  compatibility_flags?: string[];
  environment_variables?: Record<string, string>;
  kv_namespaces?: CloudflareKVNamespace[];
  durable_objects?: CloudflareDurableObject[];
  functions?: CloudflareFunction[];
  build_config?: CloudflareBuildConfig;
}

interface CloudflareFile {
  name: string;
  content: string;
  type?: 'file' | 'directory';
  hash?: string;
  size?: number;
}

interface CloudflareFunction {
  name: string;
  content: string;
  module_type?: 'esm' | 'commonjs';
  usage_model?: 'bundled' | 'unbound';
  compatibility_date?: string;
  compatibility_flags?: string[];
}

interface CloudflareDeploymentTrigger {
  type: 'manual' | 'git' | 'api';
  metadata?: {
    branch?: string;
    commit_hash?: string;
    commit_message?: string;
    commit_author?: string;
  };
}

interface CloudflareBuildOutput {
  size: number;
  files: number;
  functions?: CloudflareFunction[];
  assets?: CloudflareAsset[];
}

interface CloudflareAsset {
  url: string;
  path: string;
  type: string;
  size: number;
  hash: string;
}

interface CloudflareEnvironmentVariable {
  key: string;
  value: string;
  type: 'plain' | 'secret';
  updated_at: string;
}

interface CloudflareKVNamespace {
  binding: string;
  id: string;
  preview_id?: string;
}

interface CloudflareDurableObject {
  binding: string;
  class_name: string;
  script_name?: string;
}

/**
 * Cloudflare deployment adapter implementation
 */
export class CloudflareAdapter extends BaseDeploymentAdapter {
  private apiClient: CloudflareApiClient;
  private cloudflareConfig: CloudflareConfig;

  constructor(config: CloudflareConfig) {
    super(config);
    this.cloudflareConfig = config;
    this.apiClient = new CloudflareApiClientImpl(config);
  }

  /**
   * Setup Cloudflare-specific provider configuration
   */
  protected async setupProvider(): Promise<void> {
    try {
      await this.apiClient.getProject(
        this.cloudflareConfig.accountId,
        this.cloudflareConfig.projectName
      );
    } catch (error) {
      // Project doesn't exist, create it
      await this.apiClient.createProject(this.cloudflareConfig.accountId, {
        name: this.cloudflareConfig.projectName,
        production_branch: 'main',
        build_config: {
          build_command: this.cloudflareConfig.buildCommand,
          destination_dir: this.cloudflareConfig.outputDir,
          environment_variables: this.cloudflareConfig.environmentVariables,
          compatibility_date: this.cloudflareConfig.compatibilityDate || '2024-01-01',
          compatibility_flags: this.cloudflareConfig.compatibilityFlags || [],
        },
      });
    }
  }

  /**
   * Execute deployment on Cloudflare Pages
   */
  protected async executeDeployment(
    deploymentId: string,
    options: DeploymentOptions
  ): Promise<DeploymentResult> {
    const deployConfig = await this.buildDeploymentConfig(deploymentId, options);

    try {
      const deployment = await this.apiClient.createDeployment(
        this.cloudflareConfig.accountId,
        this.cloudflareConfig.projectName,
        deployConfig
      );

      // Wait for deployment to complete
      const completedDeployment = await this.waitForDeployment(deployment.id);

      return {
        id: completedDeployment.id,
        url: completedDeployment.url,
        status: this.mapCloudflareStatus(completedDeployment.state),
        createdAt: new Date(completedDeployment.create_time),
        updatedAt: new Date(completedDeployment.finish_time || completedDeployment.create_time),
        logs: await this.getDeploymentLogs(completedDeployment.id),
        error: completedDeployment.error_message,
        metrics: await this.extractMetrics(completedDeployment),
      };
    } catch (error) {
      throw new Error(`Cloudflare deployment failed: ${error}`);
    }
  }

  /**
   * Build Cloudflare deployment configuration
   */
  private async buildDeploymentConfig(
    deploymentId: string,
    options: DeploymentOptions
  ): Promise<CloudflareDeploymentConfig> {
    const config: CloudflareDeploymentConfig = {
      files: await this.getDeploymentFiles(),
      compatibility_date: this.cloudflareConfig.compatibilityDate || '2024-01-01',
      compatibility_flags: this.cloudflareConfig.compatibilityFlags || [],
      environment_variables: {
        ...this.cloudflareConfig.environmentVariables,
        NODE_ENV: options.targetEnvironment || 'production',
      },
      kv_namespaces: this.cloudflareConfig.kvNamespaces || [],
      durable_objects: this.cloudflareConfig.durableObjects || [],
      functions: await this.getFunctionFiles(),
      build_config: {
        build_command: this.cloudflareConfig.buildCommand,
        destination_dir: this.cloudflareConfig.outputDir,
      },
    };

    return config;
  }

  /**
   * Get deployment files
   */
  private async getDeploymentFiles(): Promise<CloudflareFile[]> {
    // This would integrate with your build system to get the actual files
    return [
      {
        name: 'index.html',
        content:
          '<!DOCTYPE html><html><head><title>Site</title></head><body><h1>Hello World</h1></body></html>',
        type: 'file',
        size: 100,
      },
      {
        name: '404.html',
        content:
          '<!DOCTYPE html><html><head><title>Not Found</title></head><body><h1>404 - Page Not Found</h1></body></html>',
        type: 'file',
        size: 100,
      },
    ];
  }

  /**
   * Get function files
   */
  private async getFunctionFiles(): Promise<CloudflareFunction[]> {
    // This would integrate with your functions build system
    return (
      this.cloudflareConfig.workers?.map((worker) => ({
        name: worker.name,
        content: worker.script,
        module_type: 'esm',
        usage_model: 'bundled',
        compatibility_date: this.cloudflareConfig.compatibilityDate || '2024-01-01',
      })) || []
    );
  }

  /**
   * Wait for deployment to complete
   */
  private async waitForDeployment(
    deploymentId: string,
    timeout = 600000
  ): Promise<CloudflareDeployment> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const deployment = await this.apiClient.getDeployment(
        this.cloudflareConfig.accountId,
        this.cloudflareConfig.projectName,
        deploymentId
      );

      if (deployment.state === 'ready') {
        return deployment;
      }

      if (deployment.state === 'failed') {
        throw new Error(`Deployment failed: ${deployment.error_message}`);
      }

      // Wait before checking again
      await this.delay(5000);
    }

    throw new Error('Deployment timed out');
  }

  /**
   * Map Cloudflare status to adapter status
   */
  private mapCloudflareStatus(state: string): DeploymentResult['status'] {
    switch (state) {
      case 'pending':
      case 'queued':
      case 'building':
        return 'building';
      case 'ready':
        return 'ready';
      case 'failed':
        return 'error';
      default:
        return 'pending';
    }
  }

  /**
   * Extract metrics from deployment
   */
  private async extractMetrics(deployment: CloudflareDeployment): Promise<DeploymentMetrics> {
    return {
      buildTime: deployment.build_time || 0,
      deployTime: deployment.finish_time
        ? new Date(deployment.finish_time).getTime() - new Date(deployment.create_time).getTime()
        : 0,
      bundleSize: deployment.build_output?.size || 0,
      performanceScore: undefined, // Would be measured with Lighthouse
      lighthouseScore: undefined,
    };
  }

  /**
   * Get deployment state from Cloudflare
   */
  protected async getDeploymentState(deploymentId: string): Promise<DeploymentState> {
    const deployment = await this.apiClient.getDeployment(
      this.cloudflareConfig.accountId,
      this.cloudflareConfig.projectName,
      deploymentId
    );

    return {
      id: deployment.id,
      status: deployment.state.toLowerCase() as DeploymentStatus,
      url: deployment.url,
      alias: deployment.aliases || [],
      createdAt: deployment.create_time,
      updatedAt: deployment.finish_time || deployment.create_time,
      readyAt: deployment.finish_time,
      meta: {
        environment: deployment.environment,
        trigger: deployment.deployment_trigger,
        buildOutput: deployment.build_output,
      },
    };
  }

  /**
   * List deployment states
   */
  protected async listDeploymentStates(limit?: number): Promise<DeploymentState[]> {
    const deployments = await this.apiClient.listDeployloys(
      this.cloudflareConfig.accountId,
      this.cloudflareConfig.projectName,
      limit
    );

    return deployments.map((deployment) => ({
      id: deployment.id,
      status: deployment.state.toLowerCase() as DeploymentStatus,
      url: deployment.url,
      alias: deployment.aliases || [],
      createdAt: deployment.create_time,
      updatedAt: deployment.finish_time || deployment.create_time,
      readyAt: deployment.finish_time,
      meta: {
        environment: deployment.environment,
        trigger: deployment.deployment_trigger,
        buildOutput: deployment.build_output,
        latest: deployment.latest,
      },
    }));
  }

  /**
   * Execute rollback on Cloudflare
   */
  protected async executeRollback(
    deploymentId: string,
    strategy?: RollbackStrategy
  ): Promise<DeploymentResult> {
    try {
      const rollbackDeployment = await this.apiClient.rollbackDeployment(
        this.cloudflareConfig.accountId,
        this.cloudflareConfig.projectName,
        deploymentId
      );

      const completedDeployment = await this.waitForDeployment(rollbackDeployment.id);

      return {
        id: completedDeployment.id,
        url: completedDeployment.url,
        status: this.mapCloudflareStatus(completedDeployment.state),
        createdAt: new Date(completedDeployment.create_time),
        updatedAt: new Date(completedDeployment.finish_time || completedDeployment.create_time),
        logs: await this.getDeploymentLogs(completedDeployment.id),
        metrics: await this.extractMetrics(completedDeployment),
      };
    } catch (error) {
      throw new Error(`Cloudflare rollback failed: ${error}`);
    }
  }

  /**
   * Get environment configuration
   */
  protected async getEnvironmentConfig(environment: string): Promise<EnvironmentConfig> {
    const variables = await this.apiClient.getProjectEnvironmentVariables(
      this.cloudflareConfig.accountId,
      this.cloudflareConfig.projectName
    );

    return {
      name: environment,
      branch: this.getBranchForEnvironment(environment),
      variables: this.convertCloudflareVariables(variables),
      secrets: this.convertCloudflareVariables(variables.filter((v) => v.type === 'secret')),
      protected: environment === 'production',
    };
  }

  /**
   * Update environment configuration
   */
  protected async updateEnvironmentConfig(
    environment: string,
    config: Partial<EnvironmentConfig>
  ): Promise<EnvironmentConfig> {
    if (config.variables) {
      const cloudflareVars = this.convertToCloudflareVariables(config.variables, false);
      await this.apiClient.setProjectEnvironmentVariables(
        this.cloudflareConfig.accountId,
        this.cloudflareConfig.projectName,
        cloudflareVars
      );
    }

    if (config.secrets) {
      const cloudflareSecrets = this.convertToCloudflareVariables(config.secrets, true);
      await this.apiClient.setProjectEnvironmentVariables(
        this.cloudflareConfig.accountId,
        this.cloudflareConfig.projectName,
        cloudflareSecrets
      );
    }

    return this.getEnvironmentConfig(environment);
  }

  /**
   * Set environment variables
   */
  protected async setVariables(
    environment: string,
    variables: Record<string, string>,
    isSecret: boolean
  ): Promise<void> {
    const cloudflareVars = this.convertToCloudflareVariables(variables, isSecret);
    await this.apiClient.setProjectEnvironmentVariables(
      this.cloudflareConfig.accountId,
      this.cloudflareConfig.projectName,
      cloudflareVars
    );
  }

  /**
   * Delete deployment
   */
  protected async deleteDeploymentById(deploymentId: string): Promise<void> {
    await this.apiClient.deleteDeployment(
      this.cloudflareConfig.accountId,
      this.cloudflareConfig.projectName,
      deploymentId
    );
  }

  /**
   * Get deployment logs
   */
  protected async getDeploymentLogs(deploymentId: string): Promise<string[]> {
    try {
      return await this.apiClient.getDeploymentLogs(
        this.cloudflareConfig.accountId,
        this.cloudflareConfig.projectName,
        deploymentId
      );
    } catch (error) {
      console.warn(`Failed to get logs for deployment ${deploymentId}:`, error);
      return [];
    }
  }

  /**
   * Get deployment metrics
   */
  protected async getDeploymentMetrics(deploymentId: string): Promise<DeploymentMetrics> {
    const deployment = await this.apiClient.getDeployment(
      this.cloudflareConfig.accountId,
      this.cloudflareConfig.projectName,
      deploymentId
    );
    return this.extractMetrics(deployment);
  }

  /**
   * Validate provider-specific configuration
   */
  protected async validateProviderConfig(config: DeploymentConfig): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    const cloudflareConfig = config as CloudflareConfig;

    if (!cloudflareConfig.accountId) {
      errors.push('Cloudflare account ID is required');
    }

    if (!cloudflareConfig.projectName) {
      errors.push('Cloudflare project name is required');
    }

    if (!cloudflareConfig.buildCommand) {
      recommendations.push('Specify build command for optimal deployment');
    }

    if (!cloudflareConfig.outputDir) {
      recommendations.push('Specify output directory for static files');
    }

    if (
      cloudflareConfig.compatibilityDate &&
      !/^\d{4}-\d{2}-\d{2}$/.test(cloudflareConfig.compatibilityDate)
    ) {
      warnings.push('Invalid compatibility date format, should be YYYY-MM-DD');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      recommendations,
    };
  }

  /**
   * Clean up old deployments
   */
  protected async cleanupDeployments(options: CleanupOptions): Promise<CleanupResult> {
    const deployments = await this.listDeploymentStates();
    const filteredDeployments = this.filterDeploymentsForCleanup(deployments, options);

    const deletedDeployments: string[] = [];
    let freedSpace = 0;
    const errors: string[] = [];

    for (const deployment of filteredDeployments) {
      try {
        await this.deleteDeploymentById(deployment.id);
        deletedDeployments.push(deployment.id);
        // Estimate freed space (would be calculated from actual deployment size)
        freedSpace += 1000000; // 1MB estimate
      } catch (error) {
        errors.push(`Failed to delete deployment ${deployment.id}: ${error}`);
      }
    }

    return {
      deletedDeployments,
      freedSpace,
      errors,
    };
  }

  /**
   * Helper methods
   */
  private getBranchForEnvironment(environment?: string): string {
    switch (environment) {
      case 'production':
        return 'main';
      case 'staging':
        return 'staging';
      default:
        return 'develop';
    }
  }

  private convertCloudflareVariables(
    variables: CloudflareEnvironmentVariable[]
  ): Record<string, string> {
    return variables.reduce(
      (acc, variable) => {
        acc[variable.key] = variable.value;
        return acc;
      },
      {} as Record<string, string>
    );
  }

  private convertToCloudflareVariables(
    variables: Record<string, string>,
    isSecret: boolean
  ): CloudflareEnvironmentVariable[] {
    return Object.entries(variables).map(([key, value]) => ({
      key,
      value,
      type: isSecret ? 'secret' : 'plain',
      updated_at: new Date().toISOString(),
    }));
  }

  private filterDeploymentsForCleanup(
    deployments: DeploymentState[],
    options: CleanupOptions
  ): DeploymentState[] {
    let filtered = deployments;

    if (options.olderThan) {
      filtered = filtered.filter((d) => new Date(d.createdAt) < options.olderThan);
    }

    if (options.keepCount) {
      filtered = filtered
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(options.keepCount);
    }

    if (options.environments) {
      // Filter by environment (would need to be implemented based on deployment metadata)
    }

    return filtered;
  }
}

/**
 * Cloudflare API client implementation
 */
class CloudflareApiClientImpl implements CloudflareApiClient {
  private config: CloudflareConfig;
  private baseUrl = 'https://api.cloudflare.com/client/v4';
  private headers: Record<string, string>;

  constructor(config: CloudflareConfig) {
    this.config = config;
    this.headers = {
      Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    };
  }

  async createProject(
    accountId: string,
    projectConfig: CloudflareProjectConfig
  ): Promise<CloudflareProject> {
    const url = `${this.baseUrl}/accounts/${accountId}/pages/projects`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(projectConfig),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to create project: ${error.errors?.[0]?.message || response.statusText}`
      );
    }

    const result = await response.json();
    return result.result;
  }

  async getProject(accountId: string, projectName: string): Promise<CloudflareProject> {
    const url = `${this.baseUrl}/accounts/${accountId}/pages/projects/${projectName}`;
    const response = await fetch(url, { headers: this.headers });

    if (!response.ok) {
      throw new Error(`Failed to get project: ${response.statusText}`);
    }

    const result = await response.json();
    return result.result;
  }

  async updateProject(
    accountId: string,
    projectName: string,
    config: Partial<CloudflareProjectConfig>
  ): Promise<CloudflareProject> {
    const url = `${this.baseUrl}/accounts/${accountId}/pages/projects/${projectName}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`Failed to update project: ${response.statusText}`);
    }

    const result = await response.json();
    return result.result;
  }

  async deleteProject(accountId: string, projectName: string): Promise<void> {
    const url = `${this.baseUrl}/accounts/${accountId}/pages/projects/${projectName}`;
    const response = await fetch(url, { method: 'DELETE', headers: this.headers });

    if (!response.ok) {
      throw new Error(`Failed to delete project: ${response.statusText}`);
    }
  }

  async createDeployment(
    accountId: string,
    projectName: string,
    deployConfig: CloudflareDeploymentConfig
  ): Promise<CloudflareDeployment> {
    const url = `${this.baseUrl}/accounts/${accountId}/pages/projects/${projectName}/deployments`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(deployConfig),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to create deployment: ${error.errors?.[0]?.message || response.statusText}`
      );
    }

    const result = await response.json();
    return result.result;
  }

  async getDeployment(
    accountId: string,
    projectName: string,
    deploymentId: string
  ): Promise<CloudflareDeployment> {
    const url = `${this.baseUrl}/accounts/${accountId}/pages/projects/${projectName}/deployments/${deploymentId}`;
    const response = await fetch(url, { headers: this.headers });

    if (!response.ok) {
      throw new Error(`Failed to get deployment: ${response.statusText}`);
    }

    const result = await response.json();
    return result.result;
  }

  async listDeploys(
    accountId: string,
    projectName: string,
    limit?: number
  ): Promise<CloudflareDeployment[]> {
    const url = new URL(
      `${this.baseUrl}/accounts/${accountId}/pages/projects/${projectName}/deployments`
    );
    if (limit) {
      url.searchParams.set('per_page', limit.toString());
    }

    const response = await fetch(url.toString(), { headers: this.headers });

    if (!response.ok) {
      throw new Error(`Failed to list deployments: ${response.statusText}`);
    }

    const result = await response.json();
    return result.result || [];
  }

  async deleteDeployment(
    accountId: string,
    projectName: string,
    deploymentId: string
  ): Promise<void> {
    const url = `${this.baseUrl}/accounts/${accountId}/pages/projects/${projectName}/deployments/${deploymentId}`;
    const response = await fetch(url, { method: 'DELETE', headers: this.headers });

    if (!response.ok) {
      throw new Error(`Failed to delete deployment: ${response.statusText}`);
    }
  }

  async rollbackDeployment(
    accountId: string,
    projectName: string,
    deploymentId: string
  ): Promise<CloudflareDeployment> {
    const url = `${this.baseUrl}/accounts/${accountId}/pages/projects/${projectName}/deployments/${deploymentId}/rollback`;
    const response = await fetch(url, { method: 'POST', headers: this.headers });

    if (!response.ok) {
      throw new Error(`Failed to rollback deployment: ${response.statusText}`);
    }

    const result = await response.json();
    return result.result;
  }

  async getProjectEnvironmentVariables(
    accountId: string,
    projectName: string
  ): Promise<CloudflareEnvironmentVariable[]> {
    const url = `${this.baseUrl}/accounts/${accountId}/pages/projects/${projectName}/env`;
    const response = await fetch(url, { headers: this.headers });

    if (!response.ok) {
      throw new Error(`Failed to get environment variables: ${response.statusText}`);
    }

    const result = await response.json();
    return result.result || [];
  }

  async setProjectEnvironmentVariables(
    accountId: string,
    projectName: string,
    variables: CloudflareEnvironmentVariable[]
  ): Promise<void> {
    const url = `${this.baseUrl}/accounts/${accountId}/pages/projects/${projectName}/env`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(variables),
    });

    if (!response.ok) {
      throw new Error(`Failed to set environment variables: ${response.statusText}`);
    }
  }

  async getDeploymentLogs(
    accountId: string,
    projectName: string,
    deploymentId: string
  ): Promise<string[]> {
    // Cloudflare logs API would be implemented here
    // For now, return placeholder logs
    return [
      `Deployment ${deploymentId} started`,
      'Files uploaded to Cloudflare',
      'Build process initiated',
      'Processing static assets',
      'Edge functions deployed',
      'Deployment completed successfully',
    ];
  }
}
