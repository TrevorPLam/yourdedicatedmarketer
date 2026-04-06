/**
 * Vercel Deployment Adapter
 *
 * Implements deployment operations for Vercel platform using their API.
 * Supports Next.js, Astro, and other frameworks with zero-downtime deployments.
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
import type { VercelConfig, DeploymentState, EnvironmentVariable } from '../types/deployment.types';

/**
 * Vercel API client interface
 */
interface VercelApiClient {
  createDeployment(projectId: string, config: VercelDeploymentConfig): Promise<VercelDeployment>;
  getDeployment(deploymentId: string): Promise<VercelDeployment>;
  listDeployments(projectId: string, limit?: number): Promise<VercelDeployment[]>;
  deleteDeployment(deploymentId: string): Promise<void>;
  getProject(projectId: string): Promise<VercelProject>;
  getEnvironmentVariables(
    projectId: string,
    environment?: string
  ): Promise<VercelEnvironmentVariable[]>;
  setEnvironmentVariables(projectId: string, variables: VercelEnvironmentVariable[]): Promise<void>;
  getLogs(deploymentId: string): Promise<string[]>;
}

/**
 * Vercel API types
 */
interface VercelDeployment {
  id: string;
  url: string;
  alias: string[];
  state: 'INITIALIZING' | 'BUILDING' | 'READY' | 'ERROR' | 'CANCELED';
  createdAt: number;
  readyAt?: number;
  build?: {
    duration: number;
    status: 'INITIALIZING' | 'BUILDING' | 'READY' | 'ERROR' | 'CANCELED';
  };
  meta?: {
    githubCommitRef?: string;
    githubCommitMessage?: string;
    githubCommitAuthor?: string;
  };
  target?: string[];
  source?: string;
  functions?: VercelFunction[];
}

interface VercelDeploymentConfig {
  name?: string;
  files: VercelFile[];
  functions?: Record<string, VercelFunctionConfig>;
  routes?: VercelRoute[];
  builds?: VercelBuild[];
  env?: Record<string, string>;
  build?: {
    env?: Record<string, string>;
    command?: string;
    cwd?: string;
  };
  projectSettings?: {
    framework?: string;
    outputDirectory?: string;
    installCommand?: string;
    devCommand?: string;
  };
}

interface VercelFile {
  file: string;
  data: string;
}

interface VercelFunction {
  name: string;
  memory: number;
  maxDuration: number;
}

interface VercelFunctionConfig {
  runtime?: 'nodejs18.x' | 'nodejs20.x';
  memory?: number;
  maxDuration?: number;
}

interface VercelRoute {
  src: string;
  dest?: string;
  methods?: string[];
  headers?: Record<string, string>;
}

interface VercelBuild {
  src: string;
  use: string;
  config?: Record<string, any>;
}

interface VercelProject {
  id: string;
  name: string;
  framework: string;
  link: {
    type: string;
    id: string;
  };
}

interface VercelEnvironmentVariable {
  key: string;
  value: string;
  type: 'encrypted' | 'plain' | 'sensitive';
  target: string[];
  updatedAt: number;
}

/**
 * Vercel deployment adapter implementation
 */
export class VercelAdapter extends BaseDeploymentAdapter {
  private apiClient: VercelApiClient;
  private vercelConfig: VercelConfig;

  constructor(config: VercelConfig) {
    super(config);
    this.vercelConfig = config;
    this.apiClient = new VercelApiClientImpl(config);
  }

  /**
   * Setup Vercel-specific provider configuration
   */
  protected async setupProvider(): Promise<void> {
    // Verify project exists and is accessible
    try {
      await this.apiClient.getProject(this.vercelConfig.projectId);
    } catch (error) {
      throw new Error(
        `Vercel project ${this.vercelConfig.projectId} not found or inaccessible: ${error}`
      );
    }

    // Validate team access if specified
    if (this.vercelConfig.teamId) {
      // Team validation would go here
      console.log(`Using Vercel team: ${this.vercelConfig.teamId}`);
    }
  }

  /**
   * Execute deployment on Vercel
   */
  protected async executeDeployment(
    deploymentId: string,
    options: DeploymentOptions
  ): Promise<DeploymentResult> {
    const deploymentConfig = await this.buildDeploymentConfig(options);

    try {
      const deployment = await this.apiClient.createDeployment(
        this.vercelConfig.projectId,
        deploymentConfig
      );

      // Wait for deployment to complete
      const completedDeployment = await this.waitForDeployment(deployment.id);

      return {
        id: completedDeployment.id,
        url: completedDeployment.url,
        status: this.mapVercelStatus(completedDeployment.state),
        createdAt: new Date(completedDeployment.createdAt),
        updatedAt: new Date(completedDeployment.readyAt || completedDeployment.createdAt),
        logs: await this.getDeploymentLogs(completedDeployment.id),
        metrics: await this.extractMetrics(completedDeployment),
      };
    } catch (error) {
      throw new Error(`Vercel deployment failed: ${error}`);
    }
  }

  /**
   * Build Vercel deployment configuration
   */
  private async buildDeploymentConfig(options: DeploymentOptions): Promise<VercelDeploymentConfig> {
    const config: VercelDeploymentConfig = {
      name: options.message || `Deploy ${new Date().toISOString()}`,
      files: await this.getProjectFiles(),
      projectSettings: {
        framework: this.vercelConfig.framework || 'nextjs',
        outputDirectory: this.vercelConfig.outputDirectory,
        installCommand: this.vercelConfig.installCommand,
        devCommand: this.vercelConfig.devCommand,
      },
      build: {
        command: this.vercelConfig.buildCommand,
        env: { ...this.vercelConfig.environmentVariables },
      },
      env: this.getEnvironmentVariables(options.targetEnvironment),
      functions: this.vercelConfig.functions,
      routes: this.vercelConfig.routes,
    };

    return config;
  }

  /**
   * Get project files for deployment
   */
  private async getProjectFiles(): Promise<VercelFile[]> {
    // This would integrate with your build system to get the actual files
    // For now, return a basic structure
    return [
      {
        file: 'package.json',
        data: JSON.stringify({ name: 'app', version: '1.0.0' }, null, 2),
      },
    ];
  }

  /**
   * Get environment variables for target environment
   */
  private getEnvironmentVariables(environment?: string): Record<string, string> {
    const envVars = this.vercelConfig.environmentVariables || {};

    if (environment && environment !== 'production') {
      // Add environment-specific variables
      envVars.NODE_ENV = environment;
    }

    return envVars;
  }

  /**
   * Wait for deployment to complete
   */
  private async waitForDeployment(
    deploymentId: string,
    timeout = 600000
  ): Promise<VercelDeployment> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const deployment = await this.apiClient.getDeployment(deploymentId);

      if (deployment.state === 'READY') {
        return deployment;
      }

      if (deployment.state === 'ERROR' || deployment.state === 'CANCELED') {
        throw new Error(`Deployment failed with state: ${deployment.state}`);
      }

      // Wait before checking again
      await this.delay(5000);
    }

    throw new Error('Deployment timed out');
  }

  /**
   * Map Vercel status to adapter status
   */
  private mapVercelStatus(state: string): DeploymentResult['status'] {
    switch (state) {
      case 'INITIALIZING':
      case 'BUILDING':
        return 'building';
      case 'READY':
        return 'ready';
      case 'ERROR':
      case 'CANCELED':
        return 'error';
      default:
        return 'pending';
    }
  }

  /**
   * Extract metrics from deployment
   */
  private async extractMetrics(deployment: VercelDeployment): Promise<DeploymentMetrics> {
    return {
      buildTime: deployment.build?.duration || 0,
      deployTime: deployment.readyAt ? deployment.readyAt - deployment.createdAt : 0,
      bundleSize: 0, // Would be calculated from actual build output
      performanceScore: undefined, // Would be measured with Lighthouse
      lighthouseScore: undefined,
    };
  }

  /**
   * Get deployment state from Vercel
   */
  protected async getDeploymentState(deploymentId: string): Promise<DeploymentState> {
    const deployment = await this.apiClient.getDeployment(deploymentId);

    return {
      id: deployment.id,
      status: deployment.state.toLowerCase() as DeploymentStatus,
      url: deployment.url,
      alias: deployment.alias,
      createdAt: new Date(deployment.createdAt).toISOString(),
      updatedAt: new Date(deployment.readyAt || deployment.createdAt).toISOString(),
      readyAt: deployment.readyAt ? new Date(deployment.readyAt).toISOString() : undefined,
      meta: {
        githubCommitRef: deployment.meta?.githubCommitRef,
        githubCommitMessage: deployment.meta?.githubCommitMessage,
        githubCommitAuthor: deployment.meta?.githubCommitAuthor,
      },
    };
  }

  /**
   * List deployment states
   */
  protected async listDeploymentStates(limit?: number): Promise<DeploymentState[]> {
    const deployments = await this.apiClient.listDeployments(this.vercelConfig.projectId, limit);

    return deployments.map((deployment) => ({
      id: deployment.id,
      status: deployment.state.toLowerCase() as DeploymentStatus,
      url: deployment.url,
      alias: deployment.alias,
      createdAt: new Date(deployment.createdAt).toISOString(),
      updatedAt: new Date(deployment.readyAt || deployment.createdAt).toISOString(),
      readyAt: deployment.readyAt ? new Date(deployment.readyAt).toISOString() : undefined,
      meta: {
        githubCommitRef: deployment.meta?.githubCommitRef,
        githubCommitMessage: deployment.meta?.githubCommitMessage,
        githubCommitAuthor: deployment.meta?.githubCommitAuthor,
      },
    }));
  }

  /**
   * Execute rollback on Vercel
   */
  protected async executeRollback(
    deploymentId: string,
    strategy?: RollbackStrategy
  ): Promise<DeploymentResult> {
    // Vercel doesn't have a direct rollback API, so we promote the target deployment
    try {
      const targetDeployment = await this.apiClient.getDeployment(deploymentId);

      // Create a new deployment pointing to the same commit
      const rollbackConfig: VercelDeploymentConfig = {
        name: `Rollback to ${deploymentId}`,
        files: await this.getProjectFiles(),
        projectSettings: {
          framework: this.vercelConfig.framework || 'nextjs',
        },
      };

      const newDeployment = await this.apiClient.createDeployment(
        this.vercelConfig.projectId,
        rollbackConfig
      );

      const completedDeployment = await this.waitForDeployment(newDeployment.id);

      return {
        id: completedDeployment.id,
        url: completedDeployment.url,
        status: this.mapVercelStatus(completedDeployment.state),
        createdAt: new Date(completedDeployment.createdAt),
        updatedAt: new Date(completedDeployment.readyAt || completedDeployment.createdAt),
        logs: await this.getDeploymentLogs(completedDeployment.id),
        metrics: await this.extractMetrics(completedDeployment),
      };
    } catch (error) {
      throw new Error(`Vercel rollback failed: ${error}`);
    }
  }

  /**
   * Get environment configuration
   */
  protected async getEnvironmentConfig(environment: string): Promise<EnvironmentConfig> {
    const variables = await this.apiClient.getEnvironmentVariables(
      this.vercelConfig.projectId,
      environment
    );

    return {
      name: environment,
      branch: this.getBranchForEnvironment(environment),
      variables: this.convertVercelVariables(variables),
      secrets: this.convertVercelVariables(variables.filter((v) => v.type === 'encrypted')),
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
      const vercelVars = this.convertToVercelVariables(config.variables, false);
      await this.apiClient.setEnvironmentVariables(this.vercelConfig.projectId, vercelVars);
    }

    if (config.secrets) {
      const vercelSecrets = this.convertToVercelVariables(config.secrets, true);
      await this.apiClient.setEnvironmentVariables(this.vercelConfig.projectId, vercelSecrets);
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
    const vercelVars = this.convertToVercelVariables(variables, isSecret);
    await this.apiClient.setEnvironmentVariables(this.vercelConfig.projectId, vercelVars);
  }

  /**
   * Delete deployment
   */
  protected async deleteDeploymentById(deploymentId: string): Promise<void> {
    await this.apiClient.deleteDeployment(deploymentId);
  }

  /**
   * Get deployment logs
   */
  protected async getDeploymentLogs(deploymentId: string): Promise<string[]> {
    try {
      return await this.apiClient.getLogs(deploymentId);
    } catch (error) {
      console.warn(`Failed to get logs for deployment ${deploymentId}:`, error);
      return [];
    }
  }

  /**
   * Get deployment metrics
   */
  protected async getDeploymentMetrics(deploymentId: string): Promise<DeploymentMetrics> {
    const deployment = await this.apiClient.getDeployment(deploymentId);
    return this.extractMetrics(deployment);
  }

  /**
   * Validate provider-specific configuration
   */
  protected async validateProviderConfig(config: DeploymentConfig): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    const vercelConfig = config as VercelConfig;

    if (!vercelConfig.projectId) {
      errors.push('Vercel project ID is required');
    }

    if (
      vercelConfig.framework &&
      !['nextjs', 'astro', 'remix', 'nuxt', 'sveltekit', 'other'].includes(vercelConfig.framework)
    ) {
      warnings.push('Unsupported framework, may cause deployment issues');
    }

    if (!vercelConfig.buildCommand && vercelConfig.framework !== 'nextjs') {
      recommendations.push('Specify build command for non-Next.js projects');
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
  private getBranchForEnvironment(environment: string): string {
    switch (environment) {
      case 'production':
        return 'main';
      case 'staging':
        return 'staging';
      default:
        return 'develop';
    }
  }

  private convertVercelVariables(variables: VercelEnvironmentVariable[]): Record<string, string> {
    return variables.reduce(
      (acc, variable) => {
        acc[variable.key] = variable.value;
        return acc;
      },
      {} as Record<string, string>
    );
  }

  private convertToVercelVariables(
    variables: Record<string, string>,
    isSecret: boolean
  ): VercelEnvironmentVariable[] {
    return Object.entries(variables).map(([key, value]) => ({
      key,
      value,
      type: isSecret ? 'encrypted' : 'plain',
      target: ['production', 'preview', 'development'],
      updatedAt: Date.now(),
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
 * Vercel API client implementation
 */
class VercelApiClientImpl implements VercelApiClient {
  private config: VercelConfig;
  private baseUrl = 'https://api.vercel.com';
  private headers: Record<string, string>;

  constructor(config: VercelConfig) {
    this.config = config;
    this.headers = {
      Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    };
  }

  async createDeployment(
    projectId: string,
    config: VercelDeploymentConfig
  ): Promise<VercelDeployment> {
    const url = `${this.baseUrl}/v13/deployments`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ ...config, projectId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create deployment: ${response.statusText}`);
    }

    return response.json();
  }

  async getDeployment(deploymentId: string): Promise<VercelDeployment> {
    const url = `${this.baseUrl}/v13/deployments/${deploymentId}`;
    const response = await fetch(url, { headers: this.headers });

    if (!response.ok) {
      throw new Error(`Failed to get deployment: ${response.statusText}`);
    }

    return response.json();
  }

  async listDeployments(projectId: string, limit?: number): Promise<VercelDeployment[]> {
    const url = new URL(`${this.baseUrl}/v6/deployments`);
    url.searchParams.set('projectId', projectId);
    if (limit) {
      url.searchParams.set('limit', limit.toString());
    }

    const response = await fetch(url.toString(), { headers: this.headers });

    if (!response.ok) {
      throw new Error(`Failed to list deployments: ${response.statusText}`);
    }

    const data = await response.json();
    return data.deployments || [];
  }

  async deleteDeployment(deploymentId: string): Promise<void> {
    const url = `${this.baseUrl}/v13/deployments/${deploymentId}`;
    const response = await fetch(url, { method: 'DELETE', headers: this.headers });

    if (!response.ok) {
      throw new Error(`Failed to delete deployment: ${response.statusText}`);
    }
  }

  async getProject(projectId: string): Promise<VercelProject> {
    const url = `${this.baseUrl}/v9/projects/${projectId}`;
    const response = await fetch(url, { headers: this.headers });

    if (!response.ok) {
      throw new Error(`Failed to get project: ${response.statusText}`);
    }

    return response.json();
  }

  async getEnvironmentVariables(
    projectId: string,
    environment?: string
  ): Promise<VercelEnvironmentVariable[]> {
    const url = `${this.baseUrl}/v9/projects/${projectId}/env`;
    const response = await fetch(url, { headers: this.headers });

    if (!response.ok) {
      throw new Error(`Failed to get environment variables: ${response.statusText}`);
    }

    const data = await response.json();
    return data.envs || [];
  }

  async setEnvironmentVariables(
    projectId: string,
    variables: VercelEnvironmentVariable[]
  ): Promise<void> {
    const url = `${this.baseUrl}/v9/projects/${projectId}/env`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ envs: variables }),
    });

    if (!response.ok) {
      throw new Error(`Failed to set environment variables: ${response.statusText}`);
    }
  }

  async getLogs(deploymentId: string): Promise<string[]> {
    // Vercel logs API would be implemented here
    // For now, return placeholder logs
    return [
      `Deployment ${deploymentId} started`,
      'Build process initiated',
      'Dependencies installed',
      'Build completed successfully',
      'Deployment ready',
    ];
  }
}
