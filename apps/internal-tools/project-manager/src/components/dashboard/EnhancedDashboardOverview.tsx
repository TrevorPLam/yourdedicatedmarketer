'use client';

import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Card, Button } from '@agency/ui-components/react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useProjectStore } from '@/store/projectStore';
import { useAnalytics } from '@agency/analytics';
import { useMonitoring } from '@agency/monitoring';
import {
  ProjectTimelineChart,
  RevenueChart,
  TeamUtilizationChart,
  ProjectStatusChart,
  BudgetVarianceChart,
  generateMockProjectData,
  generateMockTeamData,
  generateMockStatusData,
  generateMockBudgetData,
} from '@/components/charts/ProjectCharts';
import {
  BarChart3,
  FolderKanban,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Bell,
} from 'lucide-react';
import './EnhancedDashboardOverview.css';

// Mock data fetching functions with real-time simulation
async function fetchDashboardStats() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    totalProjects: 24,
    activeProjects: 8,
    teamMembers: 12,
    upcomingDeadlines: 3,
    monthlyRevenue: 125000,
    projectCompletionRate: 87,
    budgetUtilization: 78,
    teamUtilization: 82,
    overdueTasks: 5,
    newMessages: 3,
  };
}

async function fetchRecentProjects() {
  await new Promise((resolve) => setTimeout(resolve, 800));

  return [
    {
      id: '1',
      name: 'Website Redesign',
      client: 'Tech Corp',
      status: 'in-progress',
      deadline: '2026-04-15',
      progress: 75,
      priority: 'high',
      budget: 50000,
      actualCost: 42000,
    },
    {
      id: '2',
      name: 'Mobile App Development',
      client: 'StartupXYZ',
      status: 'in-progress',
      deadline: '2026-05-01',
      progress: 45,
      priority: 'medium',
      budget: 75000,
      actualCost: 38000,
    },
    {
      id: '3',
      name: 'Marketing Campaign',
      client: 'Retail Co',
      status: 'completed',
      deadline: '2026-03-30',
      progress: 100,
      priority: 'low',
      budget: 25000,
      actualCost: 23000,
    },
  ];
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  trend = 'up',
  color = 'blue',
}: {
  title: string;
  value: string | number;
  change?: string;
  icon: any;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  const bgColors = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    red: 'bg-red-50',
    yellow: 'bg-yellow-50',
    purple: 'bg-purple-50',
  };

  const iconColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`p-6 ${bgColors[color as keyof typeof bgColors]} border-0`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {change && (
              <div className={`flex items-center mt-2 text-sm ${trendColors[trend]}`}>
                {trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {change}
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${bgColors[color as keyof typeof bgColors]}`}>
            <Icon className={`h-6 w-6 ${iconColors[color as keyof typeof iconColors]}`} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function EnhancedDashboardOverview() {
  const { trackEvent } = useAnalytics();
  const { trackError } = useMonitoring();
  const { refreshData } = useProjectStore();

  // WebSocket connection for real-time updates
  const { isConnected, lastMessage, sendMessage } = useWebSocket({
    url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
    onMessage: (message) => {
      if (message.type === 'project_update') {
        toast.success('Project updated in real-time!');
        refreshData();
      }
    },
    onError: (error) => {
      trackError(error, { context: 'websocket_connection' });
    },
  });

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['recent-projects'],
    queryFn: fetchRecentProjects,
    refetchInterval: 30000,
  });

  // Generate chart data
  const chartData = useMemo(
    () => ({
      projectTimeline: generateMockProjectData(),
      teamUtilization: generateMockTeamData(),
      statusDistribution: generateMockStatusData(),
      budgetVariance: generateMockBudgetData(),
    }),
    []
  );

  // Handle real-time updates
  useEffect(() => {
    if (lastMessage?.type === 'stats_update') {
      // Invalidate and refetch queries
      // queryClient.invalidateQueries(['dashboard-stats']);
    }
  }, [lastMessage]);

  const handleRefresh = () => {
    refreshData();
    trackEvent({
      action: 'dashboard_refreshed',
      category: 'engagement',
    });
    toast.success('Dashboard refreshed!');
  };

  if (statsLoading || projectsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <Card className="p-6 border-red-200 bg-red-50">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <div>
            <h3 className="font-medium text-red-800">Failed to load dashboard</h3>
            <p className="text-red-600 text-sm mt-1">Please try refreshing the page</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with real-time status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time overview of your projects and team performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm">
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}
            />
            <span className="text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Projects"
          value={stats?.totalProjects}
          change="+2 from last month"
          icon={FolderKanban}
          trend="up"
          color="blue"
        />
        <StatCard
          title="Active Projects"
          value={stats?.activeProjects}
          change="+1 this week"
          icon={BarChart3}
          trend="up"
          color="green"
        />
        <StatCard
          title="Team Members"
          value={stats?.teamMembers}
          change="No change"
          icon={Users}
          trend="neutral"
          color="purple"
        />
        <StatCard
          title="Upcoming Deadlines"
          value={stats?.upcomingDeadlines}
          change="2 due this week"
          icon={Calendar}
          trend="down"
          color="yellow"
        />
      </div>

      {/* Revenue and Performance Metrics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StatCard
          title="Monthly Revenue"
          value={`$${stats?.monthlyRevenue.toLocaleString()}`}
          change="+12% from last month"
          icon={TrendingUp}
          trend="up"
          color="green"
        />
        <StatCard
          title="Completion Rate"
          value={`${stats?.projectCompletionRate}%`}
          change="On track for quarterly goal"
          icon={CheckCircle}
          trend="up"
          color="blue"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProjectTimelineChart data={chartData.projectTimeline} />
        <RevenueChart data={chartData.projectTimeline} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TeamUtilizationChart data={chartData.teamUtilization} />
        <ProjectStatusChart data={chartData.statusDistribution} />
      </div>

      {/* Budget Variance Chart */}
      <BudgetVarianceChart data={chartData.budgetVariance} />

      {/* Recent Projects with Enhanced UI */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Projects</h3>
          <Button variant="outline" size="sm">
            View All Projects
          </Button>
        </div>

        <div className="space-y-4">
          {projects?.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h4 className="font-medium">{project.name}</h4>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      project.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : project.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {project.priority}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{project.client}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      project.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {project.status === 'completed' ? 'Completed' : 'In Progress'}
                  </span>
                  <span>Due: {project.deadline}</span>
                  <span>Budget: ${project.budget.toLocaleString()}</span>
                  <span>Spent: ${project.actualCost.toLocaleString()}</span>
                </div>
              </div>

              <div className="ml-4 text-right">
                <div className="text-sm font-medium mb-1">{project.progress}%</div>
                <div className="project-card-progress-bar">
                  <div
                    className="project-card-progress-fill"
                    style={{ '--progress-width': `${project.progress}%` } as React.CSSProperties}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round((project.actualCost / project.budget) * 100)}% of budget
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
