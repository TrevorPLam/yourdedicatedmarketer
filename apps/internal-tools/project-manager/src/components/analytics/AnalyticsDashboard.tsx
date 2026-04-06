'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card } from '@agency/ui-components/react';
import { Button } from '@agency/ui-components/react';
import { useAnalytics } from '@agency/analytics';
import { useMonitoring } from '@agency/monitoring';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  Eye,
  MousePointer,
  Clock,
} from 'lucide-react';
import './AnalyticsDashboard.css';

// Types
interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversionRate: number;
  revenue: number;
  topPages: Array<{ page: string; views: number; unique: number }>;
  trafficSources: Array<{ source: string; visitors: number; percentage: number }>;
  deviceBreakdown: Array<{ device: string; users: number; percentage: number }>;
  hourlyTraffic: Array<{ hour: string; visitors: number; pageViews: number }>;
  performanceMetrics: Array<{ metric: string; value: number; benchmark: number }>;
}

// Color palette
const COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#8b5cf6',
  success: '#22c55e',
  gray: '#6b7280',
};

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#22c55e'];

// Mock data fetching
async function fetchAnalyticsData(timeRange: string): Promise<AnalyticsData> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    pageViews: 45230,
    uniqueVisitors: 12450,
    bounceRate: 42.3,
    avgSessionDuration: 245, // seconds
    conversionRate: 3.8,
    revenue: 84750,
    topPages: [
      { page: '/home', views: 12500, unique: 8900 },
      { page: '/services', views: 8900, unique: 6200 },
      { page: '/portfolio', views: 6700, unique: 5100 },
      { page: '/about', views: 4500, unique: 3900 },
      { page: '/contact', views: 3200, unique: 2800 },
    ],
    trafficSources: [
      { source: 'Organic Search', visitors: 5200, percentage: 41.8 },
      { source: 'Direct', visitors: 3100, percentage: 24.9 },
      { source: 'Social Media', visitors: 2100, percentage: 16.9 },
      { source: 'Referral', visitors: 1500, percentage: 12.1 },
      { source: 'Paid Ads', visitors: 550, percentage: 4.3 },
    ],
    deviceBreakdown: [
      { device: 'Desktop', users: 7200, percentage: 57.8 },
      { device: 'Mobile', users: 4800, percentage: 38.6 },
      { device: 'Tablet', users: 450, percentage: 3.6 },
    ],
    hourlyTraffic: Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      visitors: Math.floor(Math.random() * 800) + 200,
      pageViews: Math.floor(Math.random() * 2000) + 500,
    })),
    performanceMetrics: [
      { metric: 'Page Load Time', value: 1.2, benchmark: 2.0 },
      { metric: 'Time to Interactive', value: 2.1, benchmark: 3.8 },
      { metric: 'First Contentful Paint', value: 0.8, benchmark: 1.8 },
      { metric: 'Largest Contentful Paint', value: 1.5, benchmark: 2.5 },
      { metric: 'Cumulative Layout Shift', value: 0.05, benchmark: 0.1 },
      { metric: 'First Input Delay', value: 45, benchmark: 100 },
    ],
  };
}

// Metric Card Component
function MetricCard({
  title,
  value,
  change,
  trend = 'up',
  icon: Icon,
  format = 'number',
  suffix = '',
}: {
  title: string;
  value: number;
  change?: number;
  trend?: 'up' | 'down';
  icon: any;
  format?: 'number' | 'currency' | 'percentage' | 'duration';
  suffix?: string;
}) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'duration':
        const minutes = Math.floor(val / 60);
        const seconds = val % 60;
        return `${minutes}m ${seconds}s`;
      default:
        return val.toLocaleString();
    }
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="metric-card">
        <div className="metric-content">
          <div className="metric-info">
            <p className="metric-title">{title}</p>
            <p className="metric-value">
              {formatValue(value)}
              {suffix}
            </p>
            {change !== undefined && (
              <div className={`metric-change ${trendColors[trend]}`}>
                {trend === 'up' ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>
                  {change > 0 ? '+' : ''}
                  {change}%
                </span>
              </div>
            )}
          </div>
          <div className="metric-icon">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm tooltip-value" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Performance Radar Chart
function PerformanceRadarChart({ data }: { data: AnalyticsData['performanceMetrics'] }) {
  const radarData = data.map((item) => ({
    metric: item.metric.replace(' ', '\n'),
    value: item.value,
    fullMark: item.benchmark,
  }));

  return (
    <Card className="chart-card">
      <h3 className="chart-title">Performance Metrics</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={radarData}>
          <PolarGrid strokeDasharray="3 3" />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
          <PolarRadiusAxis angle={90} domain={[0, 'dataMax']} />
          <Radar
            name="Current"
            dataKey="value"
            stroke={COLORS.primary}
            fill={COLORS.primary}
            fillOpacity={0.6}
          />
          <Radar
            name="Benchmark"
            dataKey="fullMark"
            stroke={COLORS.gray}
            fill={COLORS.gray}
            fillOpacity={0.3}
          />
          <Legend />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Main Analytics Dashboard
export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const { trackEvent } = useAnalytics();
  const { trackError } = useMonitoring();

  const {
    data: analytics,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: () => fetchAnalyticsData(timeRange),
    refetchInterval: 60000, // Refresh every minute
  });

  const handleExport = () => {
    if (!analytics) return;

    trackEvent({
      action: 'analytics_exported',
      category: 'analytics',
      label: timeRange,
    });

    const rows: string[][] = [
      ['Metric', 'Value'],
      ['Page Views', analytics.pageViews.toString()],
      ['Unique Visitors', analytics.uniqueVisitors.toString()],
      ['Bounce Rate (%)', analytics.bounceRate.toFixed(1)],
      ['Avg Session Duration (s)', analytics.avgSessionDuration.toString()],
      ['Conversion Rate (%)', analytics.conversionRate.toFixed(1)],
      ['Revenue ($)', analytics.revenue.toString()],
      [],
      ['Top Pages', 'Views', 'Unique Visitors'],
      ...analytics.topPages.map((p) => [p.page, p.views.toString(), p.unique.toString()]),
      [],
      ['Traffic Source', 'Visitors', 'Percentage (%)'],
      ...analytics.trafficSources.map((s) => [
        s.source,
        s.visitors.toString(),
        s.percentage.toFixed(1),
      ]),
    ];

    const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${timeRange}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    trackEvent({
      action: 'analytics_refreshed',
      category: 'analytics',
    });

    // Refetch data
    // queryClient.invalidateQueries(['analytics']);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <Card className="p-6 border-red-200 bg-red-50">
        <div className="flex items-center space-x-3">
          <Activity className="h-6 w-6 text-red-600" />
          <div>
            <h3 className="font-medium text-red-800">Failed to load analytics</h3>
            <p className="text-red-600 text-sm mt-1">Please try refreshing the page</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="analytics-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time insights into your website performance and user behavior
          </p>
        </div>
        <div className="header-actions">
          <div className="time-range-selector">
            <label htmlFor="time-range" className="sr-only">
              Select time range
            </label>
            <select
              id="time-range"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-range-select"
              aria-label="Select time range for analytics data"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <MetricCard
          title="Page Views"
          value={analytics.pageViews}
          change={12.5}
          trend="up"
          icon={Eye}
        />
        <MetricCard
          title="Unique Visitors"
          value={analytics.uniqueVisitors}
          change={8.3}
          trend="up"
          icon={Users}
        />
        <MetricCard
          title="Avg Session Duration"
          value={analytics.avgSessionDuration}
          change={-2.1}
          trend="down"
          icon={Clock}
          format="duration"
        />
        <MetricCard
          title="Conversion Rate"
          value={analytics.conversionRate}
          change={5.7}
          trend="up"
          icon={TrendingUp}
          format="percentage"
        />
        <MetricCard
          title="Revenue"
          value={analytics.revenue}
          change={18.2}
          trend="up"
          icon={DollarSign}
          format="currency"
        />
        <MetricCard
          title="Bounce Rate"
          value={analytics.bounceRate}
          change={-3.4}
          trend="up"
          icon={Activity}
          format="percentage"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="charts-grid">
        <Card className="chart-card">
          <h3 className="chart-title">Hourly Traffic Pattern</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.hourlyTraffic}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="hour" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="visitors"
                stackId="1"
                stroke={COLORS.primary}
                fill={COLORS.primary}
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="pageViews"
                stackId="1"
                stroke={COLORS.secondary}
                fill={COLORS.secondary}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="chart-card">
          <h3 className="chart-title">Traffic Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.trafficSources}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ source, percentage }) => `${source} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="visitors"
              >
                {analytics.trafficSources.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="charts-grid">
        <Card className="chart-card">
          <h3 className="chart-title">Top Pages</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.topPages} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="page" type="category" stroke="#6b7280" width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="views" fill={COLORS.primary} name="Page Views" />
              <Bar dataKey="unique" fill={COLORS.secondary} name="Unique Visitors" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="chart-card">
          <h3 className="chart-title">Device Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.deviceBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ device, percentage }) => `${device} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="users"
              >
                {analytics.deviceBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Performance Metrics */}
      <PerformanceRadarChart data={analytics.performanceMetrics} />
    </div>
  );
}
