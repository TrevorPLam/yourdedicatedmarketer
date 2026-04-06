/**
 * Deployment Adapter Factory
 *
 * Factory for creating deployment adapters with provider-agnostic interface.
 * Supports Vercel, Netlify, Cloudflare Pages, and custom providers.
 */

import type {
  DeploymentAdapter,
  DeploymentAdapterFactory,
  DeploymentConfig,
  ValidationResult,
} from '../interfaces/deployment.adapter';
import { VercelAdapter } from '../adapters/vercel.adapter';
import { NetlifyAdapter } from '../adapters/netlify.adapter';
import { CloudflareAdapter } from '../adapters/cloudflare.adapter';
import type { VercelConfig, NetlifyConfig, CloudflareConfig } from '../types/deployment.types';

/**
 * Deployment adapter factory implementation
 */
export class DeploymentAdapterFactoryImpl implements DeploymentAdapterFactory {
  private static instance: DeploymentAdapterFactoryImpl;
  private adapterCache = new Map<string, DeploymentAdapter>();

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): DeploymentAdapterFactoryImpl {
    if (!DeploymentAdapterFactoryImpl.instance) {
      DeploymentAdapterFactoryImpl.instance = new DeploymentAdapterFactoryImpl();
    }
    return DeploymentAdapterFactoryImpl.instance;
  }

  /**
   * Create deployment adapter for specified provider
   */
  async createAdapter(provider: string, config: DeploymentConfig): Promise<DeploymentAdapter> {
    const cacheKey = this.getCacheKey(provider, config);

    // Check cache first
    if (this.adapterCache.has(cacheKey)) {
      return this.adapterCache.get(cacheKey)!;
    }

    // Validate provider config before creating adapter
    const validation = this.validateProviderConfig(provider, config);
    if (!validation.valid) {
      throw new Error(`Invalid ${provider} configuration: ${validation.errors.join(', ')}`);
    }

    // Create adapter based on provider
    let adapter: DeploymentAdapter;

    switch (provider.toLowerCase()) {
      case 'vercel':
        adapter = new VercelAdapter(config as VercelConfig);
        break;

      case 'netlify':
        adapter = new NetlifyAdapter(config as NetlifyConfig);
        break;

      case 'cloudflare':
        adapter = new CloudflareAdapter(config as CloudflareConfig);
        break;

      case 'custom':
        adapter = await this.createCustomAdapter(config);
        break;

      default:
        throw new Error(`Unsupported deployment provider: ${provider}`);
    }

    // Initialize adapter
    await adapter.initialize(config);

    // Cache adapter
    this.adapterCache.set(cacheKey, adapter);

    return adapter;
  }

  /**
   * Get list of supported providers
   */
  getSupportedProviders(): string[] {
    return ['vercel', 'netlify', 'cloudflare', 'custom'];
  }

  /**
   * Validate provider configuration
   */
  validateProviderConfig(provider: string, config: DeploymentConfig): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Basic validation for all providers
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
    switch (provider.toLowerCase()) {
      case 'vercel':
        this.validateVercelConfig(config as VercelConfig, errors, warnings, recommendations);
        break;

      case 'netlify':
        this.validateNetlifyConfig(config as NetlifyConfig, errors, warnings, recommendations);
        break;

      case 'cloudflare':
        this.validateCloudflareConfig(
          config as CloudflareConfig,
          errors,
          warnings,
          recommendations
        );
        break;

      case 'custom':
        this.validateCustomConfig(config, errors, warnings, recommendations);
        break;

      default:
        errors.push(`Unknown provider: ${provider}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      recommendations,
    };
  }

  /**
   * Clear adapter cache
   */
  clearCache(): void {
    this.adapterCache.clear();
  }

  /**
   * Get cached adapter count
   */
  getCachedAdapterCount(): number {
    return this.adapterCache.size;
  }

  /**
   * Remove specific adapter from cache
   */
  removeAdapterFromCache(provider: string, config: DeploymentConfig): boolean {
    const cacheKey = this.getCacheKey(provider, config);
    return this.adapterCache.delete(cacheKey);
  }

  /**
   * Create custom adapter (for extensibility)
   */
  private async createCustomAdapter(config: DeploymentConfig): Promise<DeploymentAdapter> {
    // This would load a custom adapter implementation
    // For now, throw an error as custom adapters need to be implemented
    throw new Error(
      'Custom adapters are not yet implemented. Please use vercel, netlify, or cloudflare providers.'
    );
  }

  /**
   * Validate Vercel-specific configuration
   */
  private validateVercelConfig(
    config: VercelConfig,
    errors: string[],
    warnings: string[],
    recommendations: string[]
  ): void {
    if (!config.projectId) {
      errors.push('Vercel project ID is required');
    }

    if (
      config.framework &&
      !['nextjs', 'astro', 'remix', 'nuxt', 'sveltekit', 'other'].includes(config.framework)
    ) {
      warnings.push('Unsupported framework, may cause deployment issues');
    }

    if (!config.buildCommand && config.framework !== 'nextjs') {
      recommendations.push('Specify build command for non-Next.js projects');
    }

    if (config.teamId && !/^[a-zA-Z0-9_-]+$/.test(config.teamId)) {
      errors.push('Invalid team ID format');
    }
  }

  /**
   * Validate Netlify-specific configuration
   */
  private validateNetlifyConfig(
    config: NetlifyConfig,
    errors: string[],
    warnings: string[],
    recommendations: string[]
  ): void {
    if (!config.siteId && !config.projectId) {
      errors.push('Either Netlify site ID or project ID is required');
    }

    if (!config.buildCommand) {
      recommendations.push('Specify build command for optimal deployment');
    }

    if (!config.publishDir) {
      recommendations.push('Specify publish directory for static files');
    }

    if (config.netlifyToml?.build?.command && config.buildCommand) {
      warnings.push('Build command specified in both config and netlify.toml');
    }

    if (config.siteId && !/^[a-zA-Z0-9_-]+$/.test(config.siteId)) {
      errors.push('Invalid site ID format');
    }
  }

  /**
   * Validate Cloudflare-specific configuration
   */
  private validateCloudflareConfig(
    config: CloudflareConfig,
    errors: string[],
    warnings: string[],
    recommendations: string[]
  ): void {
    if (!config.accountId) {
      errors.push('Cloudflare account ID is required');
    }

    if (!config.projectName) {
      errors.push('Cloudflare project name is required');
    }

    if (!config.buildCommand) {
      recommendations.push('Specify build command for optimal deployment');
    }

    if (!config.outputDir) {
      recommendations.push('Specify output directory for static files');
    }

    if (config.compatibilityDate && !/^\d{4}-\d{2}-\d{2}$/.test(config.compatibilityDate)) {
      warnings.push('Invalid compatibility date format, should be YYYY-MM-DD');
    }

    if (config.accountId && !/^[a-zA-Z0-9_-]+$/.test(config.accountId)) {
      errors.push('Invalid account ID format');
    }

    if (config.projectName && !/^[a-zA-Z0-9_-]+$/.test(config.projectName)) {
      errors.push('Invalid project name format');
    }
  }

  /**
   * Validate custom provider configuration
   */
  private validateCustomConfig(
    config: DeploymentConfig,
    errors: string[],
    warnings: string[],
    recommendations: string[]
  ): void {
    if (!config.environmentVariables || Object.keys(config.environmentVariables).length === 0) {
      warnings.push('No environment variables provided for custom provider');
    }

    recommendations.push(
      'Ensure custom provider implements all required DeploymentAdapter methods'
    );
  }

  /**
   * Generate cache key for adapter
   */
  private getCacheKey(provider: string, config: DeploymentConfig): string {
    const keyData = {
      provider,
      projectId: config.projectId,
      environment: config.environment,
      teamId: (config as any).teamId,
      accountId: (config as any).accountId,
      siteId: (config as any).siteId,
      projectName: (config as any).projectName,
    };

    return Buffer.from(JSON.stringify(keyData)).toString('base64');
  }
}

/**
 * Factory singleton export
 */
export const deploymentFactory = DeploymentAdapterFactoryImpl.getInstance();

/**
 * Helper function to create adapter with automatic validation
 */
export async function createDeploymentAdapter(
  provider: string,
  config: DeploymentConfig
): Promise<DeploymentAdapter> {
  return await deploymentFactory.createAdapter(provider, config);
}

/**
 * Helper function to validate configuration before creating adapter
 */
export function validateDeploymentConfig(
  provider: string,
  config: DeploymentConfig
): ValidationResult {
  return deploymentFactory.validateProviderConfig(provider, config);
}

/**
 * Helper function to get available providers
 */
export function getAvailableProviders(): string[] {
  return deploymentFactory.getSupportedProviders();
}
