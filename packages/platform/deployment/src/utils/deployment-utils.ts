/**
 * Deployment Utilities
 *
 * Helper functions and utilities for deployment operations.
 */

import type {
  DeploymentConfig,
  DeploymentOptions,
  DeploymentResult,
  ValidationResult,
  EnvironmentConfig,
} from '../interfaces/deployment.adapter';
import type { VercelConfig, NetlifyConfig, CloudflareConfig } from '../types/deployment.types';

/**
 * Configuration validation utilities
 */
export class ConfigValidator {
  /**
   * Validate complete deployment configuration
   */
  static validateDeploymentConfig(config: DeploymentConfig): ValidationResult {
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
    switch (config.provider) {
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
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      recommendations,
    };
  }

  /**
   * Validate environment configuration
   */
  static validateEnvironmentConfig(config: EnvironmentConfig): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    if (!config.name) {
      errors.push('Environment name is required');
    }

    if (!config.branch) {
      errors.push('Branch is required');
    }

    if (!/^[a-z0-9_-]+$/.test(config.name)) {
      warnings.push(
        'Environment name should contain only lowercase letters, numbers, underscores, and hyphens'
      );
    }

    // Validate variables
    Object.entries(config.variables).forEach(([key, value]) => {
      if (!/^[A-Z_][A-Z0-9_]*$/.test(key)) {
        warnings.push(`Variable "${key}" should follow uppercase underscore convention`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      recommendations,
    };
  }

  private static validateVercelConfig(
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
  }

  private static validateNetlifyConfig(
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
  }

  private static validateCloudflareConfig(
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
  }
}

/**
 * Deployment result utilities
 */
export class DeploymentResultUtils {
  /**
   * Check if deployment was successful
   */
  static isSuccessful(result: DeploymentResult): boolean {
    return result.status === 'ready';
  }

  /**
   * Check if deployment failed
   */
  static isFailed(result: DeploymentResult): boolean {
    return result.status === 'error';
  }

  /**
   * Check if deployment is still building
   */
  static isBuilding(result: DeploymentResult): boolean {
    return result.status === 'building';
  }

  /**
   * Get deployment duration
   */
  static getDuration(result: DeploymentResult): number {
    return result.updatedAt.getTime() - result.createdAt.getTime();
  }

  /**
   * Format deployment status for display
   */
  static formatStatus(status: DeploymentResult['status']): string {
    switch (status) {
      case 'ready':
        return '✅ Ready';
      case 'building':
        return '🔄 Building';
      case 'error':
        return '❌ Failed';
      case 'pending':
        return '⏳ Pending';
      default:
        return '❓ Unknown';
    }
  }

  /**
   * Generate deployment summary
   */
  static generateSummary(result: DeploymentResult): string {
    const status = this.formatStatus(result.status);
    const duration = this.formatDuration(this.getDuration(result));
    const url = result.url ? ` (${result.url})` : '';

    return `${status} Deployment completed in ${duration}${url}`;
  }

  private static formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
}

/**
 * Environment utilities
 */
export class EnvironmentUtils {
  /**
   * Get environment from branch name
   */
  static getEnvironmentFromBranch(branch: string): 'development' | 'staging' | 'production' {
    if (branch === 'main' || branch === 'master') {
      return 'production';
    } else if (branch === 'staging' || branch.includes('staging')) {
      return 'staging';
    } else {
      return 'development';
    }
  }

  /**
   * Get branch name for environment
   */
  static getBranchForEnvironment(environment: 'development' | 'staging' | 'production'): string {
    switch (environment) {
      case 'production':
        return 'main';
      case 'staging':
        return 'staging';
      case 'development':
        return 'develop';
    }
  }

  /**
   * Merge environment variables
   */
  static mergeVariables(
    base: Record<string, string>,
    override: Record<string, string>
  ): Record<string, string> {
    return { ...base, ...override };
  }

  /**
   * Filter environment variables by prefix
   */
  static filterVariablesByPrefix(
    variables: Record<string, string>,
    prefix: string
  ): Record<string, string> {
    const filtered: Record<string, string> = {};

    Object.entries(variables).forEach(([key, value]) => {
      if (key.startsWith(prefix)) {
        filtered[key] = value;
      }
    });

    return filtered;
  }

  /**
   * Mask sensitive values in environment variables
   */
  static maskSensitiveVariables(variables: Record<string, string>): Record<string, string> {
    const masked: Record<string, string> = {};
    const sensitivePatterns = [/password/i, /secret/i, /token/i, /key/i, /credential/i];

    Object.entries(variables).forEach(([key, value]) => {
      const isSensitive = sensitivePatterns.some((pattern) => pattern.test(key));
      masked[key] = isSensitive ? this.maskValue(value) : value;
    });

    return masked;
  }

  private static maskValue(value: string): string {
    if (value.length <= 8) {
      return '*'.repeat(value.length);
    }
    return value.substring(0, 4) + '*'.repeat(value.length - 8) + value.substring(value.length - 4);
  }
}

/**
 * File utilities for deployment
 */
export class FileUtils {
  /**
   * Get file size in human readable format
   */
  static formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  /**
   * Get file extension
   */
  static getFileExtension(filename: string): string {
    return filename.split('.').pop() || '';
  }

  /**
   * Check if file is a build asset
   */
  static isBuildAsset(filename: string): boolean {
    const buildExtensions = ['js', 'css', 'html', 'json', 'xml', 'txt'];
    const extension = this.getFileExtension(filename).toLowerCase();
    return buildExtensions.includes(extension);
  }

  /**
   * Check if file is a large asset
   */
  static isLargeAsset(filename: string, size: number): boolean {
    const largeAssetExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'mp4', 'webm', 'pdf'];
    const extension = this.getFileExtension(filename).toLowerCase();
    return largeAssetExtensions.includes(extension) || size > 1024 * 1024; // > 1MB
  }
}

/**
 * URL utilities
 */
export class UrlUtils {
  /**
   * Validate URL format
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Normalize URL
   */
  static normalizeUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    return url;
  }

  /**
   * Get domain from URL
   */
  static getDomain(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }

  /**
   * Check if URL is reachable
   */
  static async isReachable(url: string, timeout = 10000): Promise<boolean> {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: AbortSignal.timeout(timeout),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

/**
 * Time utilities
 */
export class TimeUtils {
  /**
   * Format timestamp for display
   */
  static formatTimestamp(date: Date): string {
    return date.toLocaleString();
  }

  /**
   * Get relative time string
   */
  static getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }

  /**
   * Add time to date
   */
  static addTime(date: Date, amount: number, unit: 'minutes' | 'hours' | 'days'): Date {
    const result = new Date(date);

    switch (unit) {
      case 'minutes':
        result.setMinutes(result.getMinutes() + amount);
        break;
      case 'hours':
        result.setHours(result.getHours() + amount);
        break;
      case 'days':
        result.setDate(result.getDate() + amount);
        break;
    }

    return result;
  }
}

/**
 * Error utilities
 */
export class ErrorUtils {
  /**
   * Format error message
   */
  static formatError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }

  /**
   * Get error stack trace
   */
  static getStackTrace(error: unknown): string | undefined {
    if (error instanceof Error) {
      return error.stack;
    }
    return undefined;
  }

  /**
   * Create deployment error
   */
  static createDeploymentError(
    message: string,
    context?: Record<string, any>
  ): Error & { context: Record<string, any> } {
    const error = new Error(message) as Error & { context: Record<string, any> };
    error.context = context || {};
    return error;
  }

  /**
   * Check if error is retryable
   */
  static isRetryable(error: unknown): boolean {
    const message = this.formatError(error).toLowerCase();
    const retryablePatterns = [/timeout/i, /network/i, /connection/i, /rate limit/i, /temporary/i];

    return retryablePatterns.some((pattern) => pattern.test(message));
  }
}

/**
 * Performance utilities
 */
export class PerformanceUtils {
  /**
   * Calculate deployment success rate
   */
  static calculateSuccessRate(deployments: DeploymentResult[]): number {
    if (deployments.length === 0) return 0;

    const successful = deployments.filter((d) => DeploymentResultUtils.isSuccessful(d)).length;
    return (successful / deployments.length) * 100;
  }

  /**
   * Calculate average deployment time
   */
  static calculateAverageDeploymentTime(deployments: DeploymentResult[]): number {
    if (deployments.length === 0) return 0;

    const times = deployments.map((d) => DeploymentResultUtils.getDuration(d));
    const total = times.reduce((sum, time) => sum + time, 0);
    return total / times.length;
  }

  /**
   * Get deployment statistics
   */
  static getDeploymentStatistics(deployments: DeploymentResult[]): DeploymentStatistics {
    const total = deployments.length;
    const successful = deployments.filter((d) => DeploymentResultUtils.isSuccessful(d)).length;
    const failed = deployments.filter((d) => DeploymentResultUtils.isFailed(d)).length;
    const building = deployments.filter((d) => DeploymentResultUtils.isBuilding(d)).length;

    return {
      total,
      successful,
      failed,
      building,
      successRate: this.calculateSuccessRate(deployments),
      averageTime: this.calculateAverageDeploymentTime(deployments),
    };
  }
}

/**
 * Deployment statistics interface
 */
export interface DeploymentStatistics {
  total: number;
  successful: number;
  failed: number;
  building: number;
  successRate: number;
  averageTime: number;
}

/**
 * Retry utilities
 */
export class RetryUtils {
  /**
   * Retry function with exponential backoff
   */
  static async retry<T>(fn: () => Promise<T>, maxAttempts = 3, baseDelay = 1000): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt === maxAttempts || !ErrorUtils.isRetryable(error)) {
          throw lastError;
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  /**
   * Create retry wrapper
   */
  static withRetry<T>(
    fn: () => Promise<T>,
    options: { maxAttempts?: number; baseDelay?: number } = {}
  ): () => Promise<T> {
    return () => this.retry(fn, options.maxAttempts, options.baseDelay);
  }
}
