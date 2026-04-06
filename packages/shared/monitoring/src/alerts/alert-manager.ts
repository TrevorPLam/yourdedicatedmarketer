import type { AlertConfig, MonitoringDashboardData } from '../types/monitoring.types';
import { ErrorTracker } from '../error/error-tracker';

export interface AlertEvent {
  id: string;
  type: 'error' | 'performance' | 'user' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  data: Record<string, any>;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface AlertChannel {
  type: 'email' | 'slack' | 'webhook';
  config: Record<string, any>;
  enabled: boolean;
}

export class AlertManager {
  private static instance: AlertManager;
  private config: AlertConfig;
  private errorTracker: ErrorTracker;
  private alerts: Map<string, AlertEvent> = new Map();
  private alertHistory: AlertEvent[] = [];
  private cooldownPeriods: Map<string, number> = new Map();
  private metricsBuffer: {
    errors: number[];
    responseTime: number[];
    bounceRate: number[];
    conversionRate: number[];
  } = {
    errors: [],
    responseTime: [],
    bounceRate: [],
    conversionRate: [],
  };
  private metricsMonitoringInterval: ReturnType<typeof setInterval> | null = null;
  private emailChannelDisabledLogged = false;
  private isInitialized = false;

  private constructor(config: AlertConfig) {
    this.config = config;
    this.errorTracker = ErrorTracker.getInstance();
  }

  public static getInstance(config?: AlertConfig): AlertManager {
    if (!AlertManager.instance) {
      if (!config) {
        throw new Error('AlertManager requires config on first initialization');
      }
      AlertManager.instance = new AlertManager(config);
    }
    return AlertManager.instance;
  }

  public initialize(): void {
    if (this.isInitialized || !this.config.enabled) {
      return;
    }

    // Initialize alert channels
    this.initializeChannels();

    // Start monitoring metrics
    this.startMetricsMonitoring();

    this.isInitialized = true;

    this.errorTracker.addBreadcrumb({
      message: 'Alert manager initialized',
      category: 'alerts',
      level: 'info',
      data: {
        enabledChannels: Object.keys(this.config.channels).filter(
          (key) => this.config.channels[key as keyof typeof this.config.channels]
        ),
        thresholds: this.config.thresholds,
        cooldown: this.config.cooldown,
      },
    });
  }

  private initializeChannels(): void {
    if (this.config.channels.email) {
      // Email delivery requires SMTP configuration not yet present in AlertConfig.
      // The email channel will not dispatch until credentials (host, port, auth)
      // are added to the config. Logging a one-time warning here.
      console.warn(
        '[AlertManager] Email channel is enabled but no SMTP credentials are configured. ' +
          'Alerts will not be delivered via email.'
      );
    }

    if (this.config.channels.slack) {
      // Slack channel uses channels.webhook as the incoming webhook URL.
      if (!this.config.channels.webhook) {
        console.warn(
          '[AlertManager] Slack channel is enabled but no webhook URL is set in ' +
            'channels.webhook. Alerts will not be delivered to Slack.'
        );
      }
    }
  }

  private startMetricsMonitoring(): void {
    if (this.metricsMonitoringInterval) {
      return;
    }

    // Check metrics every minute
    this.metricsMonitoringInterval = setInterval(() => {
      this.checkMetrics();
    }, 60 * 1000);
  }

  public async triggerAlert(
    type: AlertEvent['type'],
    severity: AlertEvent['severity'],
    title: string,
    message: string,
    data: Record<string, any> = {}
  ): Promise<string> {
    const alertId = this.generateAlertId();
    const alert: AlertEvent = {
      id: alertId,
      type,
      severity,
      title,
      message,
      timestamp: new Date(),
      data,
      resolved: false,
    };

    // Check cooldown
    const cooldownKey = `${type}:${title}`;
    const lastAlert = this.cooldownPeriods.get(cooldownKey);
    const now = Date.now();

    if (lastAlert && now - lastAlert < this.config.cooldown * 60 * 1000) {
      // In cooldown period, don't send alert
      return alertId;
    }

    this.alerts.set(alertId, alert);
    this.alertHistory.push(alert);
    this.cooldownPeriods.set(cooldownKey, now);

    // Send to channels
    await this.sendToChannels(alert);

    // Log to error tracker
    this.errorTracker.trackMessage(`Alert triggered: ${title}`, {
      level: severity === 'critical' ? 'error' : severity === 'high' ? 'warning' : 'info',
      tags: {
        alert: 'true',
        alertType: type,
        alertSeverity: severity,
      },
      extra: {
        alertId,
        title,
        message,
        data,
      },
    });

    // Keep history manageable
    if (this.alertHistory.length > 1000) {
      this.alertHistory = this.alertHistory.slice(-1000);
    }

    return alertId;
  }

  private async sendToChannels(alert: AlertEvent): Promise<void> {
    const channelDispatches: Array<{
      channel: AlertChannel['type'];
      task: Promise<void>;
    }> = [];

    if (this.config.channels.email) {
      channelDispatches.push({ channel: 'email', task: this.sendEmailAlert(alert) });
    }

    if (this.config.channels.slack) {
      channelDispatches.push({ channel: 'slack', task: this.sendSlackAlert(alert) });
    }

    if (this.config.channels.webhook) {
      channelDispatches.push({ channel: 'webhook', task: this.sendWebhookAlert(alert) });
    }

    try {
      const results = await Promise.allSettled(channelDispatches.map(({ task }) => task));

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          return;
        }

        const dispatch = channelDispatches[index];
        const normalizedError = this.normalizeError(result.reason);

        this.errorTracker.trackError(normalizedError, {
          tags: {
            component: 'alert-manager',
            channel: dispatch?.channel ?? 'unknown',
          },
          extra: {
            alertId: alert.id,
            alertTitle: alert.title,
            severity: alert.severity,
          },
        });
      });
    } catch (error) {
      this.errorTracker.trackError(this.normalizeError(error), {
        tags: { component: 'alert-manager' },
        extra: { alertId: alert.id },
      });
    }
  }

  private async sendEmailAlert(alert: AlertEvent): Promise<void> {
    // Email delivery is explicitly disabled until SMTP credentials are added to AlertConfig.
    if (!this.emailChannelDisabledLogged) {
      this.errorTracker.trackMessage('Email alert delivery is configured but disabled until SMTP support is implemented.', {
        level: 'warning',
        tags: {
          component: 'alert-manager',
          channel: 'email',
        },
        extra: {
          alertId: alert.id,
          alertTitle: alert.title,
        },
      });
      this.emailChannelDisabledLogged = true;
    }
  }

  private async sendSlackAlert(alert: AlertEvent): Promise<void> {
    const webhookUrl = this.config.channels.webhook;
    if (!webhookUrl) {
      // No webhook URL — warning already emitted at init.
      return;
    }

    const color = this.getSlackColor(alert.severity);
    const payload = {
      attachments: [
        {
          color,
          title: alert.title,
          text: alert.message,
          fields: [
            { title: 'Severity', value: alert.severity.toUpperCase(), short: true },
            { title: 'Type', value: alert.type, short: true },
            { title: 'Time', value: alert.timestamp.toISOString(), short: true },
          ],
          footer: 'Monitoring System',
          ts: Math.floor(alert.timestamp.getTime() / 1000),
        },
      ],
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Slack webhook returned ${response.status}: ${response.statusText}`);
    }
  }

  private async sendWebhookAlert(alert: AlertEvent): Promise<void> {
    const webhookUrl = this.config.channels.webhook;
    if (!webhookUrl) {
      return;
    }

    const payload = {
      alert,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook returned ${response.status}: ${response.statusText}`);
    }
  }

  private getSlackColor(severity: AlertEvent['severity']): string {
    switch (severity) {
      case 'critical':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
        return 'good';
      case 'low':
        return '#36a64f'; // neutral green
      default:
        return 'good';
    }
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private normalizeError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }

    return new Error(typeof error === 'string' ? error : 'Unknown alert delivery error');
  }

  private checkMetrics(): void {
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;

    // Check error rate
    const recentErrors = this.metricsBuffer.errors.filter((time) => time > oneMinuteAgo);
    if (recentErrors.length >= this.config.thresholds.errorRate) {
      this.triggerAlert(
        'error',
        'high',
        'High Error Rate',
        `Error rate threshold exceeded: ${recentErrors.length} errors in the last minute`,
        {
          errorCount: recentErrors.length,
          threshold: this.config.thresholds.errorRate,
          timeWindow: '1 minute',
        }
      );
    }

    // Check response time
    const recentResponseTimes = this.metricsBuffer.responseTime.filter(
      (time) => time > oneMinuteAgo
    );
    if (recentResponseTimes.length > 0) {
      const avgResponseTime =
        recentResponseTimes.reduce((a, b) => a + b, 0) / recentResponseTimes.length;
      if (avgResponseTime >= this.config.thresholds.responseTime) {
        this.triggerAlert(
          'performance',
          'medium',
          'High Response Time',
          `Average response time: ${avgResponseTime.toFixed(2)}ms`,
          {
            averageResponseTime: avgResponseTime,
            threshold: this.config.thresholds.responseTime,
            sampleSize: recentResponseTimes.length,
          }
        );
      }
    }

    // Clean old metrics
    this.cleanupMetrics(oneMinuteAgo);
  }

  private cleanupMetrics(cutoffTime: number): void {
    this.metricsBuffer.errors = this.metricsBuffer.errors.filter((time) => time > cutoffTime);
    this.metricsBuffer.responseTime = this.metricsBuffer.responseTime.filter(
      (time) => time > cutoffTime
    );
    this.metricsBuffer.bounceRate = this.metricsBuffer.bounceRate.filter(
      (time) => time > cutoffTime
    );
    this.metricsBuffer.conversionRate = this.metricsBuffer.conversionRate.filter(
      (time) => time > cutoffTime
    );
  }

  public recordError(timestamp: number = Date.now()): void {
    this.metricsBuffer.errors.push(timestamp);
  }

  public recordResponseTime(responseTime: number, timestamp: number = Date.now()): void {
    this.metricsBuffer.responseTime.push(responseTime);
  }

  public recordBounceRate(bounceRate: number, timestamp: number = Date.now()): void {
    this.metricsBuffer.bounceRate.push(bounceRate);
  }

  public recordConversionRate(conversionRate: number, timestamp: number = Date.now()): void {
    this.metricsBuffer.conversionRate.push(conversionRate);
  }

  public resolveAlert(alertId: string, resolvedBy: string): boolean {
    const alert = this.alerts.get(alertId);
    if (!alert || alert.resolved) {
      return false;
    }

    alert.resolved = true;
    alert.resolvedAt = new Date();
    alert.resolvedBy = resolvedBy;

    this.errorTracker.addBreadcrumb({
      message: 'Alert resolved',
      category: 'alerts',
      level: 'info',
      data: {
        alertId,
        resolvedBy,
        resolvedAt: alert.resolvedAt.toISOString(),
      },
    });

    return true;
  }

  public getActiveAlerts(): AlertEvent[] {
    return Array.from(this.alerts.values()).filter((alert) => !alert.resolved);
  }

  public getAlertsByType(type: AlertEvent['type']): AlertEvent[] {
    return Array.from(this.alerts.values()).filter((alert) => alert.type === type);
  }

  public getAlertsBySeverity(severity: AlertEvent['severity']): AlertEvent[] {
    return Array.from(this.alerts.values()).filter((alert) => alert.severity === severity);
  }

  public getAlertHistory(limit: number = 100): AlertEvent[] {
    return this.alertHistory.slice(-limit);
  }

  public cleanup(): void {
    if (this.metricsMonitoringInterval) {
      clearInterval(this.metricsMonitoringInterval);
      this.metricsMonitoringInterval = null;
    }

    this.isInitialized = false;
  }

  public getAlertStats(): {
    total: number;
    active: number;
    byType: Record<AlertEvent['type'], number>;
    bySeverity: Record<AlertEvent['severity'], number>;
    resolvedToday: number;
  } {
    const total = this.alertHistory.length;
    const active = this.getActiveAlerts().length;
    const today = new Date().toDateString();

    const byType = this.alertHistory.reduce(
      (acc, alert) => {
        acc[alert.type] = (acc[alert.type] || 0) + 1;
        return acc;
      },
      {} as Record<AlertEvent['type'], number>
    );

    const bySeverity = this.alertHistory.reduce(
      (acc, alert) => {
        acc[alert.severity] = (acc[alert.severity] || 0) + 1;
        return acc;
      },
      {} as Record<AlertEvent['severity'], number>
    );

    const resolvedToday = this.alertHistory.filter(
      (alert) => alert.resolved && alert.resolvedAt?.toDateString() === today
    ).length;

    return {
      total,
      active,
      byType,
      bySeverity,
      resolvedToday,
    };
  }

  public updateConfig(newConfig: Partial<AlertConfig>): void {
    this.config = { ...this.config, ...newConfig };

    this.errorTracker.addBreadcrumb({
      message: 'Alert configuration updated',
      category: 'alerts',
      level: 'info',
      data: {
        updatedKeys: Object.keys(newConfig),
        newConfig: this.config,
      },
    });
  }

  public cleanup(): void {
    this.alerts.clear();
    this.alertHistory = [];
    this.cooldownPeriods.clear();
    this.metricsBuffer = {
      errors: [],
      responseTime: [],
      bounceRate: [],
      conversionRate: [],
    };
    this.isInitialized = false;
  }
}
