/**
 * Deployment Monitoring System
 *
 * Provides real-time monitoring, health checks, and alerting
 * for deployment operations across all providers.
 */

import type {
  DeploymentMonitor,
  DeploymentAdapter,
  DeploymentEvent,
  DeploymentAlert,
  HealthCheck,
  DeploymentResult,
} from '../interfaces/deployment.adapter';
import { EventEmitter } from 'events';

/**
 * Monitoring configuration
 */
export interface MonitoringConfig {
  alertThresholds: AlertThresholds;
  healthCheckInterval: number;
  alertChannels: AlertChannel[];
  retentionPeriod: number; // in days
  enableRealTimeMonitoring: boolean;
}

export interface AlertThresholds {
  errorRate: number; // percentage
  responseTime: number; // in milliseconds
  buildTime: number; // in minutes
  deploymentTime: number; // in minutes
  costThreshold: number; // in dollars
}

export interface AlertChannel {
  type: 'webhook' | 'email' | 'slack' | 'teams' | 'discord';
  config: Record<string, any>;
  enabled: boolean;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
}

/**
 * Deployment metrics storage
 */
interface DeploymentMetrics {
  deploymentId: string;
  projectId: string;
  provider: string;
  environment: string;
  startTime: Date;
  endTime?: Date;
  status: string;
  buildTime?: number;
  deployTime?: number;
  errorCount: number;
  warningCount: number;
  cost?: number;
  performance?: PerformanceMetrics;
}

interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  availability: number;
  lighthouseScore?: number;
  coreWebVitals?: {
    lcp: number;
    fid: number;
    cls: number;
  };
}

/**
 * Health check result
 */
interface HealthCheckResult {
  url: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  statusCode: number;
  timestamp: Date;
  error?: string;
}

/**
 * Deployment monitor implementation
 */
export class DeploymentMonitorImpl extends EventEmitter implements DeploymentMonitor {
  private config: MonitoringConfig;
  private adapters = new Map<string, DeploymentAdapter>();
  private metrics = new Map<string, DeploymentMetrics>();
  private healthChecks = new Map<string, HealthCheck>();
  private alertHistory: DeploymentAlert[] = [];
  private healthCheckIntervals = new Map<string, NodeJS.Timeout>();
  private eventListeners = new Map<string, ((event: DeploymentEvent) => void)[]>();

  constructor(config: MonitoringConfig) {
    super();
    this.config = config;
    this.startCleanupInterval();
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

  /**
   * Register deployment adapter for monitoring
   */
  registerAdapter(adapter: DeploymentAdapter): void {
    const adapterId = `${adapter.constructor.name}_${Date.now()}`;
    this.adapters.set(adapterId, adapter);

    // Subscribe to adapter events
    adapter.subscribe(
      [
        'deployment.started',
        'deployment.ready',
        'deployment.failed',
        'rollback.started',
        'rollback.completed',
      ],
      (event) => {
        this.handleDeploymentEvent(event);
      }
    );
  }

  /**
   * Get active deployments
   */
  async getActiveDeployments(): Promise<DeploymentResult[]> {
    const activeDeployments: DeploymentResult[] = [];

    for (const [adapterId, adapter] of this.adapters) {
      try {
        const deployments = await adapter.listDeployments(10); // Get recent deployments
        const active = deployments.filter((d) => d.status === 'building' || d.status === 'pending');
        activeDeployments.push(...active);
      } catch (error) {
        console.warn(`Failed to get deployments from adapter ${adapterId}:`, error);
      }
    }

    return activeDeployments;
  }

  /**
   * Get failed deployments within timeframe
   */
  async getFailedDeployments(timeframe = 3600000): Promise<DeploymentResult[]> {
    const failedDeployments: DeploymentResult[] = [];
    const cutoffTime = Date.now() - timeframe;

    for (const [adapterId, adapter] of this.adapters) {
      try {
        const deployments = await adapter.listDeployments(50); // Get more deployments for filtering
        const failed = deployments.filter(
          (d) => d.status === 'error' && d.createdAt.getTime() > cutoffTime
        );
        failedDeployments.push(...failed);
      } catch (error) {
        console.warn(`Failed to get deployments from adapter ${adapterId}:`, error);
      }
    }

    return failedDeployments;
  }

  /**
   * Generate alert for deployment event
   */
  generateAlert(event: DeploymentEvent): DeploymentAlert {
    const alert: DeploymentAlert = {
      type: this.determineAlertType(event),
      message: this.generateAlertMessage(event),
      timestamp: event.timestamp,
      deploymentId: event.deploymentId,
      metadata: {
        projectId: event.projectId,
        environment: event.environment,
        eventData: event.data,
      },
    };

    this.alertHistory.push(alert);
    this.emit('alert', alert);

    // Send to alert channels
    this.sendAlertToChannels(alert);

    return alert;
  }

  /**
   * Add health check for deployment
   */
  addHealthCheck(deploymentId: string, healthCheck: HealthCheck): void {
    this.healthChecks.set(deploymentId, healthCheck);

    // Start periodic health checks
    if (this.config.enableRealTimeMonitoring) {
      this.startHealthCheck(deploymentId, healthCheck);
    }
  }

  /**
   * Remove health check
   */
  removeHealthCheck(deploymentId: string): void {
    // Stop health check interval
    const interval = this.healthCheckIntervals.get(deploymentId);
    if (interval) {
      clearInterval(interval);
      this.healthCheckIntervals.delete(deploymentId);
    }

    this.healthChecks.delete(deploymentId);
  }

  /**
   * Get deployment metrics
   */
  getDeploymentMetrics(deploymentId: string): DeploymentMetrics | undefined {
    return this.metrics.get(deploymentId);
  }

  /**
   * Get alert history
   */
  getAlertHistory(limit?: number): DeploymentAlert[] {
    if (limit) {
      return this.alertHistory.slice(-limit);
    }
    return [...this.alertHistory];
  }

  /**
   * Get monitoring dashboard data
   */
  async getDashboardData(): Promise<DashboardData> {
    const activeDeployments = await this.getActiveDeployments();
    const failedDeployments = await this.getFailedDeployments();
    const recentAlerts = this.getAlertHistory(50);

    return {
      summary: {
        totalDeployments: this.metrics.size,
        activeDeployments: activeDeployments.length,
        failedDeployments: failedDeployments.length,
        recentAlerts: recentAlerts.length,
        averageBuildTime: this.calculateAverageBuildTime(),
        averageDeployTime: this.calculateAverageDeployTime(),
        overallHealth: this.calculateOverallHealth(),
      },
      activeDeployments,
      failedDeployments,
      recentAlerts,
      performanceMetrics: this.getAggregatedPerformanceMetrics(),
    };
  }

  /**
   * Private methods
   */
  private handleDeploymentEvent(event: DeploymentEvent): void {
    // Update metrics
    this.updateDeploymentMetrics(event);

    // Emit event for subscribers
    const listeners = this.eventListeners.get(event.type) || [];
    listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });

    // Generate alert if needed
    if (this.shouldGenerateAlert(event)) {
      this.generateAlert(event);
    }
  }

  private updateDeploymentMetrics(event: DeploymentEvent): void {
    let metrics = this.metrics.get(event.deploymentId);

    if (!metrics) {
      metrics = {
        deploymentId: event.deploymentId,
        projectId: event.projectId,
        provider: 'unknown',
        environment: event.environment,
        startTime: event.timestamp,
        status: 'pending',
        errorCount: 0,
        warningCount: 0,
      };
      this.metrics.set(event.deploymentId, metrics);
    }

    // Update based on event type
    switch (event.type) {
      case 'deployment.started':
        metrics.status = 'building';
        metrics.startTime = event.timestamp;
        break;

      case 'deployment.ready':
        metrics.status = 'ready';
        metrics.endTime = event.timestamp;
        if (metrics.startTime) {
          metrics.deployTime = metrics.endTime.getTime() - metrics.startTime.getTime();
        }
        break;

      case 'deployment.failed':
        metrics.status = 'failed';
        metrics.endTime = event.timestamp;
        metrics.errorCount++;
        break;

      case 'rollback.started':
        metrics.status = 'rolling_back';
        break;

      case 'rollback.completed':
        metrics.status = 'rolled_back';
        break;
    }

    // Update additional metrics from event data
    if (event.data?.buildTime) {
      metrics.buildTime = event.data.buildTime;
    }

    if (event.data?.cost) {
      metrics.cost = event.data.cost;
    }
  }

  private determineAlertType(event: DeploymentEvent): DeploymentAlert['type'] {
    switch (event.type) {
      case 'deployment.started':
        return 'info';
      case 'deployment.ready':
        return 'success';
      case 'deployment.failed':
        return 'error';
      case 'rollback.started':
        return 'warning';
      case 'rollback.completed':
        return 'info';
      default:
        return 'info';
    }
  }

  private generateAlertMessage(event: DeploymentEvent): string {
    switch (event.type) {
      case 'deployment.started':
        return `Deployment started for ${event.projectId} in ${event.environment}`;
      case 'deployment.ready':
        return `Deployment completed successfully for ${event.projectId} in ${event.environment}`;
      case 'deployment.failed':
        return `Deployment failed for ${event.projectId} in ${event.environment}`;
      case 'rollback.started':
        return `Rollback started for ${event.projectId} in ${event.environment}`;
      case 'rollback.completed':
        return `Rollback completed for ${event.projectId} in ${event.environment}`;
      default:
        return `Deployment event: ${event.type} for ${event.projectId}`;
    }
  }

  private shouldGenerateAlert(event: DeploymentEvent): boolean {
    // Generate alerts for failures and rollbacks
    return (
      event.type === 'deployment.failed' ||
      event.type === 'rollback.started' ||
      event.type === 'rollback.completed'
    );
  }

  private async startHealthCheck(deploymentId: string, healthCheck: HealthCheck): Promise<void> {
    const interval = setInterval(async () => {
      try {
        const result = await this.performHealthCheck(healthCheck);
        this.handleHealthCheckResult(deploymentId, result);
      } catch (error) {
        console.error(`Health check failed for deployment ${deploymentId}:`, error);
      }
    }, this.config.healthCheckInterval);

    this.healthCheckIntervals.set(deploymentId, interval);
  }

  private async performHealthCheck(healthCheck: HealthCheck): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      const response = await fetch(healthCheck.url, {
        method: 'GET',
        signal: AbortSignal.timeout(healthCheck.timeout || 30000),
      });

      const responseTime = Date.now() - startTime;
      const expectedStatus = healthCheck.expectedStatus || 200;

      return {
        url: healthCheck.url,
        status: response.status === expectedStatus ? 'healthy' : 'unhealthy',
        responseTime,
        statusCode: response.status,
        timestamp: new Date(),
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;

      return {
        url: healthCheck.url,
        status: 'unhealthy',
        responseTime,
        statusCode: 0,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private handleHealthCheckResult(deploymentId: string, result: HealthCheckResult): void {
    const metrics = this.metrics.get(deploymentId);
    if (metrics && metrics.performance) {
      // Update performance metrics
      metrics.performance.responseTime = result.responseTime;
      metrics.performance.availability = result.status === 'healthy' ? 100 : 0;
    }

    // Generate alert if unhealthy
    if (result.status === 'unhealthy') {
      this.generateAlert({
        type: 'deployment.failed',
        deploymentId,
        projectId: metrics?.projectId || 'unknown',
        environment: metrics?.environment || 'unknown',
        timestamp: result.timestamp,
        data: { healthCheck: result },
      });
    }

    this.emit('healthCheck', { deploymentId, result });
  }

  private sendAlertToChannels(alert: DeploymentAlert): void {
    this.config.alertChannels
      .filter((channel) => channel.enabled && this.matchesChannelSeverity(channel, alert))
      .forEach((channel) => {
        this.sendToChannel(channel, alert);
      });
  }

  private matchesChannelSeverity(channel: AlertChannel, alert: DeploymentAlert): boolean {
    // Simple severity matching - could be enhanced
    return true;
  }

  private async sendToChannel(channel: AlertChannel, alert: DeploymentAlert): Promise<void> {
    try {
      switch (channel.type) {
        case 'webhook':
          await this.sendWebhookAlert(channel.config, alert);
          break;
        case 'email':
          await this.sendEmailAlert(channel.config, alert);
          break;
        case 'slack':
          await this.sendSlackAlert(channel.config, alert);
          break;
        default:
          console.warn(`Unsupported alert channel type: ${channel.type}`);
      }
    } catch (error) {
      console.error(`Failed to send alert to ${channel.type}:`, error);
    }
  }

  private async sendWebhookAlert(
    config: Record<string, any>,
    alert: DeploymentAlert
  ): Promise<void> {
    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      body: JSON.stringify(alert),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`);
    }
  }

  private async sendEmailAlert(config: Record<string, any>, alert: DeploymentAlert): Promise<void> {
    // Email implementation would go here
    console.log('Email alert:', alert);
  }

  private async sendSlackAlert(config: Record<string, any>, alert: DeploymentAlert): Promise<void> {
    // Slack implementation would go here
    console.log('Slack alert:', alert);
  }

  private calculateAverageBuildTime(): number {
    const buildTimes = Array.from(this.metrics.values())
      .filter((m) => m.buildTime !== undefined)
      .map((m) => m.buildTime!);

    if (buildTimes.length === 0) return 0;
    return buildTimes.reduce((sum, time) => sum + time, 0) / buildTimes.length;
  }

  private calculateAverageDeployTime(): number {
    const deployTimes = Array.from(this.metrics.values())
      .filter((m) => m.deployTime !== undefined)
      .map((m) => m.deployTime!);

    if (deployTimes.length === 0) return 0;
    return deployTimes.reduce((sum, time) => sum + time, 0) / deployTimes.length;
  }

  private calculateOverallHealth(): number {
    const totalDeployments = this.metrics.size;
    if (totalDeployments === 0) return 100;

    const healthyDeployments = Array.from(this.metrics.values()).filter(
      (m) => m.status === 'ready'
    ).length;

    return (healthyDeployments / totalDeployments) * 100;
  }

  private getAggregatedPerformanceMetrics(): PerformanceMetrics {
    const allMetrics = Array.from(this.metrics.values()).filter((m) => m.performance);

    if (allMetrics.length === 0) {
      return {
        responseTime: 0,
        throughput: 0,
        errorRate: 0,
        availability: 0,
      };
    }

    return {
      responseTime:
        allMetrics.reduce((sum, m) => sum + m.performance!.responseTime, 0) / allMetrics.length,
      throughput:
        allMetrics.reduce((sum, m) => sum + (m.performance!.throughput || 0), 0) /
        allMetrics.length,
      errorRate:
        allMetrics.reduce((sum, m) => sum + (m.performance!.errorRate || 0), 0) / allMetrics.length,
      availability:
        allMetrics.reduce((sum, m) => sum + (m.performance!.availability || 0), 0) /
        allMetrics.length,
    };
  }

  private startCleanupInterval(): void {
    // Clean up old metrics and alerts periodically
    setInterval(
      () => {
        this.cleanupOldData();
      },
      24 * 60 * 60 * 1000
    ); // Daily cleanup
  }

  private cleanupOldData(): void {
    const cutoffTime = Date.now() - this.config.retentionPeriod * 24 * 60 * 60 * 1000;

    // Clean up old metrics
    for (const [deploymentId, metrics] of this.metrics) {
      if (metrics.endTime && metrics.endTime.getTime() < cutoffTime) {
        this.metrics.delete(deploymentId);
        this.removeHealthCheck(deploymentId);
      }
    }

    // Clean up old alerts
    this.alertHistory = this.alertHistory.filter((alert) => alert.timestamp.getTime() > cutoffTime);
  }
}

/**
 * Dashboard data interface
 */
export interface DashboardData {
  summary: {
    totalDeployments: number;
    activeDeployments: number;
    failedDeployments: number;
    recentAlerts: number;
    averageBuildTime: number;
    averageDeployTime: number;
    overallHealth: number;
  };
  activeDeployments: DeploymentResult[];
  failedDeployments: DeploymentResult[];
  recentAlerts: DeploymentAlert[];
  performanceMetrics: PerformanceMetrics;
}
