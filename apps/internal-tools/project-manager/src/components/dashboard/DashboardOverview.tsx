'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@agency/ui-components/react';
import { Button } from '@agency/ui-components/react';
import { BarChart3, FolderKanban, Users, Calendar, TrendingUp, Clock } from 'lucide-react';

// Mock data fetching functions
async function fetchDashboardStats() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    totalProjects: 24,
    activeProjects: 8,
    teamMembers: 12,
    upcomingDeadlines: 3,
    monthlyRevenue: 125000,
    projectCompletionRate: 87,
  };
}

async function fetchRecentProjects() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800));

  return [
    {
      id: '1',
      name: 'Website Redesign',
      client: 'Tech Corp',
      status: 'in-progress',
      deadline: '2026-04-15',
      progress: 75,
    },
    {
      id: '2',
      name: 'Mobile App Development',
      client: 'StartupXYZ',
      status: 'in-progress',
      deadline: '2026-05-01',
      progress: 45,
    },
    {
      id: '3',
      name: 'Marketing Campaign',
      client: 'Retail Co',
      status: 'completed',
      deadline: '2026-03-30',
      progress: 100,
    },
  ];
}

export function DashboardOverview() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['recent-projects'],
    queryFn: fetchRecentProjects,
  });

  if (statsLoading || projectsLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
              <p className="text-2xl font-bold">{stats?.totalProjects}</p>
            </div>
            <FolderKanban className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
              <p className="text-2xl font-bold">{stats?.activeProjects}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Team Members</p>
              <p className="text-2xl font-bold">{stats?.teamMembers}</p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Upcoming Deadlines</p>
              <p className="text-2xl font-bold">{stats?.upcomingDeadlines}</p>
            </div>
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
      </div>

      {/* Revenue and Performance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Monthly Revenue</h3>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold">${stats?.monthlyRevenue.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-2">+12% from last month</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Completion Rate</h3>
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold">{stats?.projectCompletionRate}%</p>
          <p className="text-sm text-muted-foreground mt-2">On track for quarterly goal</p>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Projects</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {projects?.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-medium">{project.name}</h4>
                <p className="text-sm text-muted-foreground">{project.client}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      project.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {project.status === 'completed' ? 'Completed' : 'In Progress'}
                  </span>
                  <span className="text-sm text-muted-foreground">Due: {project.deadline}</span>
                </div>
              </div>

              <div className="ml-4">
                <div className="text-sm font-medium mb-1">{project.progress}%</div>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
