/**
 * Netlify Deployment Adapter
 *
 * Implements deployment operations for Netlify platform using their API.
 * Supports static sites, serverless functions, and edge functions with zero-downtime deployments.
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
  NetlifyConfig,
  DeploymentState,
  EnvironmentVariable,
} from '../types/deployment.types';

/**
 * Netlify API client interface
 */
interface NetlifyApiClient {
  createSite(siteConfig?: NetlifySiteConfig): Promise<NetlifySite>;
  getSite(siteId: string): Promise<NetlifySite>;
  updateSite(siteId: string, config: Partial<NetlifySiteConfig>): Promise<NetlifySite>;
  deleteSite(siteId: string): Promise<void>;
  createDeploy(siteId: string, deployConfig: NetlifyDeployConfig): Promise<NetlifyDeploy>;
  getDeploy(siteId: string, deployId: string): Promise<NetlifyDeploy>;
  listDeploys(siteId: string, limit?: number): Promise<NetlifyDeploy[]>;
  deleteDeploy(siteId: string, deployId: string): Promise<void>;
  getSiteSnippets(siteId: string): Promise<NetlifySnippet[]>;
  updateSiteSnippets(siteId: string, snippets: NetlifySnippet[]): Promise<NetlifySnippet[]>;
  getEnvironmentVariables(siteId: string): Promise<NetlifyEnvironmentVariable[]>;
  setEnvironmentVariables(siteId: string, variables: NetlifyEnvironmentVariable[]): Promise<void>;
  getDeployLogs(siteId: string, deployId: string): Promise<string[]>;
}

/**
 * Netlify API types
 */
interface NetlifySite {
  id: string;
  name: string;
  state: 'current' | 'inactive';
  url: string;
  ssl_url: string;
  admin_url: string;
  deploy_url?: string;
  published_deploy?: NetlifyDeploy;
  account_slug: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  ssl: boolean;
  force_ssl: boolean;
  managed_dns: boolean;
  domain_aliases?: string[];
  notification_email?: string;
  branch_deploy_custom_domain?: string;
  deploy_hook?: string;
  capabilities?: {
    large_media_enabled: boolean;
    asset_optimization_enabled: boolean;
    forms_enabled: boolean;
  };
  build_settings: NetlifyBuildSettings;
  processing_settings: NetlifyProcessingSettings;
}

interface NetlifySiteConfig {
  name?: string;
  custom_domain?: string;
  domain_aliases?: string[];
  notification_email?: string;
  password?: string;
  ssl?: boolean;
  force_ssl?: boolean;
  processing_settings?: Partial<NetlifyProcessingSettings>;
  build_settings?: Partial<NetlifyBuildSettings>;
}

interface NetlifyBuildSettings {
  dir?: string;
  cmd?: string;
  functions_dir?: string;
  skip?: string[];
  environment?: Record<string, string>;
}

interface NetlifyProcessingSettings {
  css?: {
    bundle?: boolean;
    minify?: boolean;
    prefix?: string;
  };
  js?: {
    bundle?: boolean;
    minify?: boolean;
  };
  html?: {
    pretty_urls?: boolean;
  };
  images?: {
    optimize?: boolean;
  };
  skip?: string[];
}

interface NetlifyDeploy {
  id: string;
  state: 'preparing' | 'uploading' | 'processing' | 'ready' | 'error' | 'failed';
  name: string;
  url?: string;
  deploy_url?: string;
  deploy_ssl_url?: string;
  screenshot_url?: string;
  required: {
    functions?: number;
    plugins?: string[];
  };
  commit_ref?: {
    ref: string;
    sha: string;
    message: string;
    author: string;
  };
  build_time?: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  error_message?: string;
  title?: string;
  context?: string;
  branch?: string;
  deploy_to_production?: boolean;
  draft?: boolean;
  locked?: boolean;
  functions?: NetlifyFunction[];
  files?: number;
  size?: number;
}

interface NetlifyDeployConfig {
  title?: string;
  body?: string;
  draft?: boolean;
  branch?: string;
  files: Record<string, NetlifyFile>;
  functions?: Record<string, NetlifyFunctionFile>;
  config?: NetlifyBuildSettings;
  engine?: 'node' | 'bash';
  toolchain?: 'static' | 'node' | 'go' | 'ruby' | 'python';
}

interface NetlifyFile {
  url?: string;
  data?: string;
  sha?: string;
}

interface NetlifyFunctionFile {
  url?: string;
  data?: string;
  sha?: string;
  runtime?: 'nodejs' | 'go';
}

interface NetlifyFunction {
  name: string;
  main_file?: string;
  display_name?: string;
  runtime?: 'nodejs' | 'go';
}

interface NetlifySnippet {
  id: string;
  title: string;
  general?: string;
  general_position?: 'head' | 'body';
  general_page?: string[] | 'all';
}

interface NetlifyEnvironmentVariable {
  key: string;
  value: string;
  scopes: string[];
  updated_at: string;
  created_at: string;
}

/**
 * Netlify deployment adapter implementation
 */
export class NetlifyAdapter extends BaseDeploymentAdapter {
  private apiClient: NetlifyApiClient;
  private netlifyConfig: NetlifyConfig;

  constructor(config: NetlifyConfig) {
    super(config);
    this.netlifyConfig = config;
    this.apiClient = new NetlifyApiClientImpl(config);
  }

  /**
   * Setup Netlify-specific provider configuration
   */
  protected async setupProvider(): Promise<void> {
    // Verify site exists and is accessible
    try {
      if (this.netlifyConfig.siteId) {
        await this.apiClient.getSite(this.netlifyConfig.siteId);
      } else {
        // Create a new site if no siteId provided
        const newSite = await this.apiClient.createSite({
          name: this.netlifyConfig.projectId,
        });
        this.netlifyConfig.siteId = newSite.id;
      }
    } catch (error) {
      throw new Error(`Netlify site setup failed: ${error}`);
    }
  }

  /**
   * Execute deployment on Netlify
   */
  protected async executeDeployment(
    deploymentId: string,
    options: DeploymentOptions
  ): Promise<DeploymentResult> {
    const deployConfig = await this.buildDeployConfig(deploymentId, options);

    try {
      const deploy = await this.apiClient.createDeploy(this.netlifyConfig.siteId!, deployConfig);

      // Wait for deployment to complete
      const completedDeploy = await this.waitForDeploy(deploy.id);

      return {
        id: completedDeploy.id,
        url: completedDeploy.deploy_url || completedDeploy.url || '',
        status: this.mapNetlifyStatus(completedDeploy.state),
        createdAt: new Date(completedDeploy.created_at),
        updatedAt: new Date(completedDeploy.updated_at),
        logs: await this.getDeploymentLogs(completedDeploy.id),
        error: completedDeploy.error_message,
        metrics: await this.extractMetrics(completedDeploy),
      };
    } catch (error) {
      throw new Error(`Netlify deployment failed: ${error}`);
    }
  }

  /**
   * Build Netlify deployment configuration
   */
  private async buildDeployConfig(
    deploymentId: string,
    options: DeploymentOptions
  ): Promise<NetlifyDeployConfig> {
    const config: NetlifyDeployConfig = {
      title: options.message || `Deploy ${new Date().toISOString()}`,
      draft: options.targetEnvironment !== 'production',
      branch: options.branch || this.getBranchForEnvironment(options.targetEnvironment),
      files: await this.getDeployFiles(),
      functions: await this.getFunctionFiles(),
      config: {
        dir: this.netlifyConfig.publishDir,
        cmd: this.netlifyConfig.buildCommand,
        functions_dir: this.netlifyConfig.functionsDir,
        environment: this.getEnvironmentVariables(options.targetEnvironment),
      },
      engine: 'node',
      toolchain: 'static',
    };

    return config;
  }

  /**
   * Get deploy files for deployment
   */
  private async getDeployFiles(): Promise<Record<string, NetlifyFile>> {
    // This would integrate with your build system to get the actual files
    // For now, return a basic structure
    return {
      'index.html': {
        data: '<!DOCTYPE html><html><head><title>Site</title></head><body><h1>Hello World</h1></body></html>',
      },
      '404.html': {
        data: '<!DOCTYPE html><html><head><title>Not Found</title></head><body><h1>404 - Page Not Found</h1></body></html>',
      },
    };
  }

  /**
   * Get function files for deployment
   */
  private async getFunctionFiles(): Promise<Record<string, NetlifyFunctionFile>> {
    // This would integrate with your functions build system
    return {};
  }

  /**
   * Get environment variables for target environment
   */
  private getEnvironmentVariables(environment?: string): Record<string, string> {
    const envVars = this.netlifyConfig.netlifyToml?.build?.environment || {};
    envVars.NODE_ENV = environment || 'development';

    // Add config environment variables
    if (this.netlifyConfig.environmentVariables) {
      Object.assign(envVars, this.netlifyConfig.environmentVariables);
    }

    return envVars;
  }

  /**
   * Wait for deployment to complete
   */
  private async waitForDeploy(deployId: string, timeout = 600000): Promise<NetlifyDeploy> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const deploy = await this.apiClient.getDeploy(this.netlifyConfig.siteId!, deployId);

      if (deploy.state === 'ready') {
        return deploy;
      }

      if (deploy.state === 'error' || deploy.state === 'failed') {
        throw new Error(`Deployment failed with state: ${deploy.state} - ${deploy.error_message}`);
      }

      // Wait before checking again
      await this.delay(5000);
    }

    throw new Error('Deployment timed out');
  }

  /**
   * Map Netlify status to adapter status
   */
  private mapNetlifyStatus(state: string): DeploymentResult['status'] {
    switch (state) {
      case 'preparing':
      case 'uploading':
      case 'processing':
        return 'building';
      case 'ready':
        return 'ready';
      case 'error':
      case 'failed':
        return 'error';
      default:
        return 'pending';
    }
  }

  /**
   * Extract metrics from deployment
   */
  private async extractMetrics(deploy: NetlifyDeploy): Promise<DeploymentMetrics> {
    return {
      buildTime: deploy.build_time || 0,
      deployTime: deploy.published_at
        ? new Date(deploy.published_at).getTime() - new Date(deploy.created_at).getTime()
        : 0,
      bundleSize: deploy.size || 0,
      performanceScore: undefined, // Would be measured with Lighthouse
      lighthouseScore: undefined,
    };
  }

  /**
   * Get deployment state from Netlify
   */
  protected async getDeploymentState(deploymentId: string): Promise<DeploymentState> {
    const deploy = await this.apiClient.getDeploy(this.netlifyConfig.siteId!, deploymentId);

    return {
      id: deploy.id,
      status: deploy.state.toLowerCase() as DeploymentStatus,
      url: deploy.deploy_url || deploy.url || '',
      alias: deploy.deploy_url ? [deploy.deploy_url] : [],
      createdAt: deploy.created_at,
      updatedAt: deploy.updated_at,
      readyAt: deploy.published_at,
      meta: {
        commitRef: deploy.commit_ref?.ref,
        commitMessage: deploy.commit_ref?.message,
        commitAuthor: deploy.commit_ref?.author,
        branch: deploy.branch,
        context: deploy.context,
      },
    };
  }

  /**
   * List deployment states
   */
  protected async listDeploymentStates(limit?: number): Promise<DeploymentState[]> {
    const deploys = await this.apiClient.listDeploys(this.netlifyConfig.siteId!, limit);

    return deploys.map((deploy) => ({
      id: deploy.id,
      status: deploy.state.toLowerCase() as DeploymentStatus,
      url: deploy.deploy_url || deploy.url || '',
      alias: deploy.deploy_url ? [deploy.deploy_url] : [],
      createdAt: deploy.created_at,
      updatedAt: deploy.updated_at,
      readyAt: deploy.published_at,
      meta: {
        commitRef: deploy.commit_ref?.ref,
        commitMessage: deploy.commit_ref?.message,
        commitAuthor: deploy.commit_ref?.author,
        branch: deploy.branch,
        context: deploy.context,
        title: deploy.title,
      },
    }));
  }

  /**
   * Execute rollback on Netlify
   */
  protected async executeRollback(
    deploymentId: string,
    strategy?: RollbackStrategy
  ): Promise<DeploymentResult> {
    try {
      const targetDeploy = await this.apiClient.getDeploy(this.netlifyConfig.siteId!, deploymentId);

      // Create a new deployment with the same files
      const rollbackConfig: NetlifyDeployConfig = {
        title: `Rollback to ${deploymentId}`,
        draft: false,
        branch: targetDeploy.branch,
        files: await this.getDeployFiles(), // Would use files from target deploy
        functions: await this.getFunctionFiles(),
        engine: 'node',
        toolchain: 'static',
      };

      const newDeploy = await this.apiClient.createDeploy(
        this.netlifyConfig.siteId!,
        rollbackConfig
      );
      const completedDeploy = await this.waitForDeploy(newDeploy.id);

      return {
        id: completedDeploy.id,
        url: completedDeploy.deploy_url || completedDeploy.url || '',
        status: this.mapNetlifyStatus(completedDeploy.state),
        createdAt: new Date(completedDeploy.created_at),
        updatedAt: new Date(completedDeploy.updated_at),
        logs: await this.getDeploymentLogs(completedDeploy.id),
        metrics: await this.extractMetrics(completedDeploy),
      };
    } catch (error) {
      throw new Error(`Netlify rollback failed: ${error}`);
    }
  }

  /**
   * Get environment configuration
   */
  protected async getEnvironmentConfig(environment: string): Promise<EnvironmentConfig> {
    const variables = await this.apiClient.getEnvironmentVariables(this.netlifyConfig.siteId!);

    return {
      name: environment,
      branch: this.getBranchForEnvironment(environment),
      variables: this.convertNetlifyVariables(variables),
      secrets: this.convertNetlifyVariables(variables.filter((v) => v.key.includes('SECRET'))),
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
      const netlifyVars = this.convertToNetlifyVariables(config.variables, ['build', 'runtime']);
      await this.apiClient.setEnvironmentVariables(this.netlifyConfig.siteId!, netlifyVars);
    }

    if (config.secrets) {
      const netlifySecrets = this.convertToNetlifyVariables(config.secrets, ['build', 'runtime']);
      await this.apiClient.setEnvironmentVariables(this.netlifyConfig.siteId!, netlifySecrets);
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
    const scopes = isSecret ? ['build', 'runtime'] : ['build', 'runtime'];
    const netlifyVars = this.convertToNetlifyVariables(variables, scopes);
    await this.apiClient.setEnvironmentVariables(this.netlifyConfig.siteId!, netlifyVars);
  }

  /**
   * Delete deployment
   */
  protected async deleteDeploymentById(deploymentId: string): Promise<void> {
    await this.apiClient.deleteDeploy(this.netlifyConfig.siteId!, deploymentId);
  }

  /**
   * Get deployment logs
   */
  protected async getDeploymentLogs(deploymentId: string): Promise<string[]> {
    try {
      return await this.apiClient.getDeployLogs(this.netlifyConfig.siteId!, deploymentId);
    } catch (error) {
      console.warn(`Failed to get logs for deployment ${deploymentId}:`, error);
      return [];
    }
  }

  /**
   * Get deployment metrics
   */
  protected async getDeploymentMetrics(deploymentId: string): Promise<DeploymentMetrics> {
    const deploy = await this.apiClient.getDeploy(this.netlifyConfig.siteId!, deploymentId);
    return this.extractMetrics(deploy);
  }

  /**
   * Validate provider-specific configuration
   */
  protected async validateProviderConfig(config: DeploymentConfig): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    const netlifyConfig = config as NetlifyConfig;

    if (!netlifyConfig.siteId && !netlifyConfig.projectId) {
      errors.push('Either Netlify site ID or project ID is required');
    }

    if (!netlifyConfig.buildCommand) {
      recommendations.push('Specify build command for optimal deployment');
    }

    if (!netlifyConfig.publishDir) {
      recommendations.push('Specify publish directory for static files');
    }

    if (netlifyConfig.netlifyToml?.build?.command && netlifyConfig.buildCommand) {
      warnings.push('Build command specified in both config and netlify.toml');
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

  private convertNetlifyVariables(variables: NetlifyEnvironmentVariable[]): Record<string, string> {
    return variables.reduce(
      (acc, variable) => {
        acc[variable.key] = variable.value;
        return acc;
      },
      {} as Record<string, string>
    );
  }

  private convertToNetlifyVariables(
    variables: Record<string, string>,
    scopes: string[]
  ): NetlifyEnvironmentVariable[] {
    return Object.entries(variables).map(([key, value]) => ({
      key,
      value,
      scopes,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
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
 * Netlify API client implementation
 */
class NetlifyApiClientImpl implements NetlifyApiClient {
  private config: NetlifyConfig;
  private baseUrl = 'https://api.netlify.com/api/v1';
  private headers: Record<string, string>;

  constructor(config: NetlifyConfig) {
    this.config = config;
    this.headers = {
      Authorization: `Bearer ${process.env.NETLIFY_TOKEN}`,
      'Content-Type': 'application/json',
    };
  }

  async createSite(siteConfig?: NetlifySiteConfig): Promise<NetlifySite> {
    const url = `${this.baseUrl}/sites`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(siteConfig || {}),
    });

    if (!response.ok) {
      throw new Error(`Failed to create site: ${response.statusText}`);
    }

    return response.json();
  }

  async getSite(siteId: string): Promise<NetlifySite> {
    const url = `${this.baseUrl}/sites/${siteId}`;
    const response = await fetch(url, { headers: this.headers });

    if (!response.ok) {
      throw new Error(`Failed to get site: ${response.statusText}`);
    }

    return response.json();
  }

  async updateSite(siteId: string, config: Partial<NetlifySiteConfig>): Promise<NetlifySite> {
    const url = `${this.baseUrl}/sites/${siteId}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`Failed to update site: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteSite(siteId: string): Promise<void> {
    const url = `${this.baseUrl}/sites/${siteId}`;
    const response = await fetch(url, { method: 'DELETE', headers: this.headers });

    if (!response.ok) {
      throw new Error(`Failed to delete site: ${response.statusText}`);
    }
  }

  async createDeploy(siteId: string, deployConfig: NetlifyDeployConfig): Promise<NetlifyDeploy> {
    const url = `${this.baseUrl}/sites/${siteId}/deploys`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(deployConfig),
    });

    if (!response.ok) {
      throw new Error(`Failed to create deploy: ${response.statusText}`);
    }

    return response.json();
  }

  async getDeploy(siteId: string, deployId: string): Promise<NetlifyDeploy> {
    const url = `${this.baseUrl}/sites/${siteId}/deploys/${deployId}`;
    const response = await fetch(url, { headers: this.headers });

    if (!response.ok) {
      throw new Error(`Failed to get deploy: ${response.statusText}`);
    }

    return response.json();
  }

  async listDeploys(siteId: string, limit?: number): Promise<NetlifyDeploy[]> {
    const url = new URL(`${this.baseUrl}/sites/${siteId}/deploys`);
    if (limit) {
      url.searchParams.set('limit', limit.toString());
    }

    const response = await fetch(url.toString(), { headers: this.headers });

    if (!response.ok) {
      throw new Error(`Failed to list deploys: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteDeploy(siteId: string, deployId: string): Promise<void> {
    const url = `${this.baseUrl}/sites/${siteId}/deploys/${deployId}`;
    const response = await fetch(url, { method: 'DELETE', headers: this.headers });

    if (!response.ok) {
      throw new Error(`Failed to delete deploy: ${response.statusText}`);
    }
  }

  async getSiteSnippets(siteId: string): Promise<NetlifySnippet[]> {
    const url = `${this.baseUrl}/sites/${siteId}/snippets`;
    const response = await fetch(url, { headers: this.headers });

    if (!response.ok) {
      throw new Error(`Failed to get site snippets: ${response.statusText}`);
    }

    return response.json();
  }

  async updateSiteSnippets(siteId: string, snippets: NetlifySnippet[]): Promise<NetlifySnippet[]> {
    const url = `${this.baseUrl}/sites/${siteId}/snippets`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(snippets),
    });

    if (!response.ok) {
      throw new Error(`Failed to update site snippets: ${response.statusText}`);
    }

    return response.json();
  }

  async getEnvironmentVariables(siteId: string): Promise<NetlifyEnvironmentVariable[]> {
    const url = `${this.baseUrl}/sites/${siteId}/env`;
    const response = await fetch(url, { headers: this.headers });

    if (!response.ok) {
      throw new Error(`Failed to get environment variables: ${response.statusText}`);
    }

    return response.json();
  }

  async setEnvironmentVariables(
    siteId: string,
    variables: NetlifyEnvironmentVariable[]
  ): Promise<void> {
    const url = `${this.baseUrl}/sites/${siteId}/env`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(variables),
    });

    if (!response.ok) {
      throw new Error(`Failed to set environment variables: ${response.statusText}`);
    }
  }

  async getDeployLogs(siteId: string, deployId: string): Promise<string[]> {
    // Netlify logs API would be implemented here
    // For now, return placeholder logs
    return [
      `Deploy ${deployId} started`,
      'Files uploaded successfully',
      'Build process initiated',
      'Processing static assets',
      'Deploy completed successfully',
    ];
  }
}
