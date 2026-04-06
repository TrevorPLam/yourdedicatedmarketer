/**
 * Performance Optimization Note:
 * 
 * Consider using defer imports for heavy modules:
 * 
 * // Instead of:
 * import * as heavyModule from './heavy-analytics';
 * 
 * // Use:
 * import defer * as heavyModule from './heavy-analytics';
 * 
 * This delays module evaluation until first use.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { MonitoringDashboardData, AlertEvent } from '../types/monitoring.types';
import { ErrorTracker } from '../error/error-tracker';
import { PerformanceMonitor } from '../performance/web-vitals';
import { AlertManager } from '../alerts/alert-manager';

export interface MonitoringDashboardProps {
  refreshInterval?: number; // milliseconds
  showRealTime?: boolean;
  maxDataPoints?: number;
}

export const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({
  refreshInterval = 30000, // 30 seconds
  showRealTime = true,
  maxDataPoints = 100,
}) => {
  const [data, setData] = useState<MonitoringDashboardData>({
    errors: { total: 0, rate: 0, topErrors: [] },
    performance: { webVitals: [], pageLoadTimes: [] },
    users: { active: 0, totalSessions: 0, avgSessionDuration: 0, bounceRate: 0 },
    system: { uptime: 0, memoryUsage: 0, cpuUsage: 0 },
  });
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('6h');

  const errorTracker = ErrorTracker.getInstance();
  const performanceMonitor = PerformanceMonitor.getInstance();
  const alertManager = AlertManager.getInstance();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch error data
      const errorStats = errorTracker.getSessionStats();
      const topErrors = await getTopErrors();

      // Fetch performance data
      const webVitals = performanceMonitor.getMetrics();
      const performanceScore = performanceMonitor.getPerformanceScore();

      // Fetch user data (mock for now, would integrate with analytics)
      const userData = await getUserMetrics();

      // Fetch system metrics
      const systemData = await getSystemMetrics();

      // Fetch alerts
      const activeAlerts = alertManager.getActiveAlerts();

      const newData: MonitoringDashboardData = {
        errors: {
          total: errorStats.errorCount,
          rate: calculateErrorRate(errorStats.errorCount, errorStats.duration),
          topErrors,
        },
        performance: {
          webVitals: webVitals.slice(-maxDataPoints),
          pageLoadTimes: performanceMonitor.getMetricsByName('page-load').map((metric) => ({
            url: 'current-page', // Would be more specific in real implementation
            avgTime: metric.value,
            sampleSize: 1,
          })),
        },
        users: userData,
        system: systemData,
      };

      setData(newData);
      setAlerts(activeAlerts);
      setLastUpdate(new Date());
    } catch (error) {
      errorTracker.trackError(error as Error, {
        tags: { component: 'monitoring-dashboard' },
      });
    } finally {
      setIsLoading(false);
    }
  }, [errorTracker, performanceMonitor, alertManager, maxDataPoints]);

  useEffect(() => {
    if (!showRealTime) return;

    fetchData();
    const interval = setInterval(fetchData, refreshInterval);

    return () => clearInterval(interval);
  }, [fetchData, refreshInterval, showRealTime]);

  const getTopErrors = async () => {
    // Mock implementation - would integrate with Sentry API
    return [
      { message: 'Network request failed', count: 5, lastOccurrence: new Date() },
      { message: 'TypeError: Cannot read property', count: 3, lastOccurrence: new Date() },
    ];
  };

  const calculateErrorRate = (errorCount: number, duration: number): number => {
    const minutes = duration / (1000 * 60);
    return minutes > 0 ? Math.round((errorCount / minutes) * 100) / 100 : 0;
  };

  const getUserMetrics = async () => {
    // Mock implementation - would integrate with analytics service
    return {
      active: Math.floor(Math.random() * 100) + 50,
      totalSessions: Math.floor(Math.random() * 1000) + 500,
      avgSessionDuration: Math.floor(Math.random() * 300) + 120, // seconds
      bounceRate: Math.random() * 0.5, // percentage
    };
  };

  const getSystemMetrics = async () => {
    // Mock implementation - would integrate with monitoring service
    return {
      uptime: Date.now() - (Date.now() - Math.random() * 86400000), // Random uptime
      memoryUsage: Math.random() * 0.8, // percentage
      cpuUsage: Math.random() * 0.9, // percentage
    };
  };

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const formatPercentage = (value: number): string => {
    return `${Math.round(value * 100)}%`;
  };

  const getAlertColor = (severity: AlertEvent['severity']): string => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPerformanceColor = (rating: string): string => {
    switch (rating) {
      case 'good':
        return 'text-green-600';
      case 'needs-improvement':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading && !data.errors.total) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading monitoring data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monitoring Dashboard</h1>
          <p className="text-gray-600">Last updated: {lastUpdate.toLocaleTimeString()}</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
          <button
            onClick={fetchData}
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Active Alerts</h2>
          <div className="space-y-2">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-md border ${getAlertColor(alert.severity)}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{alert.title}</h3>
                    <p className="text-sm opacity-75">{alert.message}</p>
                    <p className="text-xs opacity-60 mt-1">{alert.timestamp.toLocaleString()}</p>
                  </div>
                  <span className="text-xs font-medium uppercase">{alert.severity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Error Metrics */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-600">Errors</h3>
          <div className="mt-2">
            <div className="text-2xl font-bold text-gray-900">{data.errors.total}</div>
            <div className="text-sm text-gray-500">{data.errors.rate}/min</div>
          </div>
        </div>

        {/* Performance Score */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-600">Performance Score</h3>
          <div className="mt-2">
            <div className="text-2xl font-bold text-gray-900">
              {performanceMonitor.getPerformanceScore().overall}
            </div>
            <div className="text-sm text-gray-500">out of 100</div>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-600">Active Users</h3>
          <div className="mt-2">
            <div className="text-2xl font-bold text-gray-900">{data.users.active}</div>
            <div className="text-sm text-gray-500">
              {formatPercentage(data.users.bounceRate)} bounce
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-600">System Health</h3>
          <div className="mt-2">
            <div className="text-2xl font-bold text-green-600">
              {formatPercentage(1 - data.system.memoryUsage)}
            </div>
            <div className="text-sm text-gray-500">available memory</div>
          </div>
        </div>
      </div>

      {/* Web Vitals */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Web Vitals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {['LCP', 'FID', 'CLS', 'FCP', 'TTFB', 'INP'].map((vital) => {
            const metrics = performanceMonitor.getMetricsByName(vital);
            const latest = metrics[metrics.length - 1];
            if (!latest) return null;

            return (
              <div key={vital} className="border rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{vital}</span>
                  <span className={`text-sm font-medium ${getPerformanceColor(latest.rating)}`}>
                    {latest.rating}
                  </span>
                </div>
                <div className="mt-1">
                  <div className="text-xl font-bold text-gray-900">{latest.value.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">{vital === 'CLS' ? 'score' : 'ms'}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Errors */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Top Errors</h2>
        <div className="space-y-2">
          {data.errors.topErrors.map((error, index) => (
            <div key={index} className="flex justify-between items-center p-2 border-b">
              <div className="flex-1">
                <div className="font-medium text-gray-900 truncate">{error.message}</div>
                <div className="text-sm text-gray-500">
                  Last: {error.lastOccurrence.toLocaleTimeString()}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">{error.count}</div>
                <div className="text-sm text-gray-500">occurrences</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Metrics */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">System Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-600">Uptime</div>
            <div className="text-lg font-bold text-gray-900">
              {formatDuration(data.system.uptime)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Memory Usage</div>
            <div className="text-lg font-bold text-gray-900">
              {formatPercentage(data.system.memoryUsage)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">CPU Usage</div>
            <div className="text-lg font-bold text-gray-900">
              {formatPercentage(data.system.cpuUsage)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
