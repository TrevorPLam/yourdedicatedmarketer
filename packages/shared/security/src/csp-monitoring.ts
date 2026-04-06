/**
 * CSP Monitoring and Alerting System
 * 
 * Provides comprehensive CSP violation monitoring, alerting, and reporting
 * for the marketing agency monorepo. Integrates with security.config.ts
 * for centralized security management.
 * 
 * Features:
 * - CSP violation collection and analysis
 * - Real-time alerting for repeated violations
 * - Security event correlation
 * - Automated report generation
 * - Integration with monitoring services
 * 
 * Version: 2.0.0
 * Updated: April 2026
 */

import { getSecurityConfig } from '@/../../security.config';

// CSP violation interface
export interface CSPViolation {
  blockedURI: string;
  documentURI: string;
  effectiveDirective: string;
  originalPolicy: string;
  referrer: string;
  sample: string;
  sourceFile: string;
  lineNumber: number;
  columnNumber: number;
  statusCode: number;
  userAgent: string;
  timestamp: string;
  clientIP: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'inline-script' | 'inline-style' | 'eval' | 'external-resource' | 'data-uri' | 'other';
}

// Alert configuration
interface AlertConfig {
  enabled: boolean;
  threshold: number; // Number of violations before alerting
  timeWindow: number; // Time window in milliseconds
  severity: 'low' | 'medium' | 'high' | 'critical';
  destinations: ('console' | 'webhook' | 'email' | 'slack')[];
}

// Monitoring store (in-memory for development, use database in production)
const violationStore = new Map<string, CSPViolation[]>();
const alertThresholds = new Map<string, { count: number; lastAlert: number }>();

// Categorize CSP violations
export function categorizeViolation(violation: Partial<CSPViolation>): CSPViolation['category'] {
  const { blockedURI, effectiveDirective } = violation;
  
  if (effectiveDirective === 'script-src') {
    if (blockedURI === 'inline') return 'inline-script';
    if (blockedURI === 'eval') return 'eval';
  }
  
  if (effectiveDirective === 'style-src' && blockedURI === 'inline') {
    return 'inline-style';
  }
  
  if (blockedURI?.startsWith('data:')) return 'data-uri';
  if (blockedURI?.startsWith('http')) return 'external-resource';
  
  return 'other';
}

// Determine violation severity
export function determineSeverity(violation: Partial<CSPViolation>): CSPViolation['severity'] {
  const category = categorizeViolation(violation);
  const { effectiveDirective } = violation;
  
  // Critical violations
  if (category === 'eval' || effectiveDirective === 'script-src' && violation.blockedURI === 'inline') {
    return 'critical';
  }
  
  // High severity violations
  if (category === 'inline-script' || category === 'inline-style') {
    return 'high';
  }
  
  // Medium severity violations
  if (category === 'data-uri') {
    return 'medium';
  }
  
  // Low severity violations
  return 'low';
}

// Process CSP violation report
export function processCSPViolation(
  violationData: any,
  request?: { ip?: string; userAgent?: string }
): CSPViolation {
  const violation: CSPViolation = {
    blockedURI: violationData.blockedURI || 'unknown',
    documentURI: violationData.documentURI || 'unknown',
    effectiveDirective: violationData.effectiveDirective || 'unknown',
    originalPolicy: violationData.originalPolicy || 'unknown',
    referrer: violationData.referrer || 'unknown',
    sample: violationData.sample || '',
    sourceFile: violationData.sourceFile || '',
    lineNumber: violationData.lineNumber || 0,
    columnNumber: violationData.columnNumber || 0,
    statusCode: violationData.statusCode || 0,
    userAgent: request?.userAgent || violationData.userAgent || 'unknown',
    timestamp: new Date().toISOString(),
    clientIP: request?.ip || 'unknown',
    severity: determineSeverity(violationData),
    category: categorizeViolation(violationData),
  };
  
  // Store violation
  const key = `${violation.clientIP}:${violation.category}`;
  const violations = violationStore.get(key) || [];
  violations.push(violation);
  violationStore.set(key, violations);
  
  // Log violation
  console.warn('CSP Violation Detected:', JSON.stringify({
    timestamp: violation.timestamp,
    clientIP: violation.clientIP,
    severity: violation.severity,
    category: violation.category,
    effectiveDirective: violation.effectiveDirective,
    blockedURI: violation.blockedURI,
    documentURI: violation.documentURI,
  }));
  
  // Check alert thresholds
  checkAlertThresholds(violation);
  
  return violation;
}

// Check alert thresholds and send alerts
function checkAlertThresholds(violation: CSPViolation): void {
  const config = getSecurityConfig();
  const env = config.infrastructure.environment;
  
  // Only send alerts in production and staging
  if (!['production', 'staging'].includes(env)) {
    return;
  }
  
  const key = `${violation.clientIP}:${violation.category}`;
  const threshold = alertThresholds.get(key);
  const now = Date.now();
  
  // Get alert configuration for severity
  const alertConfig: AlertConfig = {
    enabled: true,
    threshold: violation.severity === 'critical' ? 1 : violation.severity === 'high' ? 3 : 5,
    timeWindow: 15 * 60 * 1000, // 15 minutes
    severity: violation.severity,
    destinations: ['console', 'webhook'],
  };
  
  // Count violations in time window
  const violations = violationStore.get(key) || [];
  const recentViolations = violations.filter(
    v => Date.now() - new Date(v.timestamp).getTime() <= alertConfig.timeWindow
  );
  
  if (recentViolations.length >= alertConfig.threshold) {
    const lastAlertTime = threshold?.lastAlert || 0;
    
    // Only send alert if we haven't sent one recently
    if (now - lastAlertTime > alertConfig.timeWindow) {
      sendAlert(violation, recentViolations.length, alertConfig);
      alertThresholds.set(key, { count: recentViolations.length, lastAlert: now });
    }
  }
}

// Send alert for CSP violations
function sendAlert(violation: CSPViolation, count: number, config: AlertConfig): void {
  const alert = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    type: 'csp_violation_alert',
    severity: config.severity,
    summary: `${count} ${violation.category} violations detected from ${violation.clientIP}`,
    details: {
      clientIP: violation.clientIP,
      category: violation.category,
      severity: violation.severity,
      count,
      timeWindow: config.timeWindow,
      sampleViolation: {
        effectiveDirective: violation.effectiveDirective,
        blockedURI: violation.blockedURI,
        documentURI: violation.documentURI,
        userAgent: violation.userAgent,
      },
    },
  };
  
  // Send to configured destinations
  config.destinations.forEach(destination => {
    switch (destination) {
      case 'console':
        console.error('CSP Alert:', JSON.stringify(alert));
        break;
      case 'webhook':
        sendWebhookAlert(alert);
        break;
      case 'email':
        sendEmailAlert(alert);
        break;
      case 'slack':
        sendSlackAlert(alert);
        break;
    }
  });
}

// Send webhook alert
async function sendWebhookAlert(alert: any): Promise<void> {
  const webhookUrl = process.env.CSP_WEBHOOK_URL;
  if (!webhookUrl) return;
  
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CSP_WEBHOOK_TOKEN}`,
      },
      body: JSON.stringify(alert),
    });
  } catch (error) {
    console.error('Failed to send CSP webhook alert:', error);
  }
}

// Send email alert (placeholder implementation)
async function sendEmailAlert(alert: any): Promise<void> {
  const emailRecipient = process.env.CSP_ALERT_EMAIL;
  if (!emailRecipient) return;
  
  // TODO: Implement email sending service
  console.log('Email alert would be sent to:', emailRecipient, alert);
}

// Send Slack alert (placeholder implementation)
async function sendSlackAlert(alert: any): Promise<void> {
  const slackWebhook = process.env.SLACK_WEBHOOK_URL;
  if (!slackWebhook) return;
  
  try {
    await fetch(slackWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🚨 CSP Violation Alert (${alert.severity.toUpperCase()})`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*${alert.summary}*`,
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Client IP:* ${alert.details.clientIP}`,
              },
              {
                type: 'mrkdwn',
                text: `*Category:* ${alert.details.category}`,
              },
              {
                type: 'mrkdwn',
                text: `*Count:* ${alert.details.count}`,
              },
              {
                type: 'mrkdwn',
                text: `*Time Window:* ${alert.details.timeWindow / 1000 / 60} minutes`,
              },
            ],
          },
        ],
      }),
    });
  } catch (error) {
    console.error('Failed to send Slack alert:', error);
  }
}

// Get violation statistics
export function getViolationStats(timeWindow?: number): {
  total: number;
  byCategory: Record<string, number>;
  bySeverity: Record<string, number>;
  byClientIP: Record<string, number>;
} {
  const now = Date.now();
  const windowMs = timeWindow || 24 * 60 * 60 * 1000; // 24 hours default
  
  const allViolations = Array.from(violationStore.values()).flat();
  const recentViolations = allViolations.filter(
    v => now - new Date(v.timestamp).getTime() <= windowMs
  );
  
  const stats = {
    total: recentViolations.length,
    byCategory: {} as Record<string, number>,
    bySeverity: {} as Record<string, number>,
    byClientIP: {} as Record<string, number>,
  };
  
  recentViolations.forEach(violation => {
    stats.byCategory[violation.category] = (stats.byCategory[violation.category] || 0) + 1;
    stats.bySeverity[violation.severity] = (stats.bySeverity[violation.severity] || 0) + 1;
    stats.byClientIP[violation.clientIP] = (stats.byClientIP[violation.clientIP] || 0) + 1;
  });
  
  return stats;
}

// Generate CSP violation report
export function generateCSPReport(timeWindow?: number): {
  generated: string;
  timeWindow: number;
  summary: any;
  violations: CSPViolation[];
  recommendations: string[];
} {
  const stats = getViolationStats(timeWindow);
  const windowMs = timeWindow || 24 * 60 * 60 * 1000;
  
  const allViolations = Array.from(violationStore.values()).flat();
  const recentViolations = allViolations.filter(
    v => Date.now() - new Date(v.timestamp).getTime() <= windowMs
  );
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (stats.byCategory['inline-script'] > 0) {
    recommendations.push('Consider using nonce-based CSP for inline scripts or move scripts to external files');
  }
  
  if (stats.byCategory['inline-style'] > 0) {
    recommendations.push('Consider using nonce-based CSP for inline styles or move styles to external files');
  }
  
  if (stats.byCategory['eval'] > 0) {
    recommendations.push('Remove eval() usage and consider safer alternatives');
  }
  
  if (stats.byCategory['data-uri'] > 10) {
    recommendations.push('Consider hosting data URIs externally or using CSP hashes');
  }
  
  const report = {
    generated: new Date().toISOString(),
    timeWindow: windowMs,
    summary: stats,
    violations: recentViolations,
    recommendations,
  };
  
  return report;
}

// Cleanup old violations
export function cleanupOldViolations(maxAge: number = 7 * 24 * 60 * 60 * 1000): void {
  const now = Date.now();
  const cutoff = now - maxAge;
  
  for (const [key, violations] of violationStore.entries()) {
    const recentViolations = violations.filter(
      v => new Date(v.timestamp).getTime() > cutoff
    );
    
    if (recentViolations.length === 0) {
      violationStore.delete(key);
    } else {
      violationStore.set(key, recentViolations);
    }
  }
  
  // Clean old alert thresholds
  for (const [key, threshold] of alertThresholds.entries()) {
    if (threshold.lastAlert < cutoff) {
      alertThresholds.delete(key);
    }
  }
}

// Auto-cleanup every hour
if (typeof setInterval !== 'undefined') {
  setInterval(() => cleanupOldViolations(), 60 * 60 * 1000);
}

export default {
  processCSPViolation,
  categorizeViolation,
  determineSeverity,
  getViolationStats,
  generateCSPReport,
  cleanupOldViolations,
};
