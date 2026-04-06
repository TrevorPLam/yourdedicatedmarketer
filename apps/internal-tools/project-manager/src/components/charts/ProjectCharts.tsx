'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
} from 'recharts';
import { Card } from '@agency/ui-components/react';
import { format, subDays, startOfDay } from 'date-fns';
import './ProjectCharts.css';

// Types
interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface ProjectChartData {
  month: string;
  completed: number;
  inProgress: number;
  planned: number;
  revenue: number;
}

interface TeamUtilizationData {
  name: string;
  utilization: number;
  capacity: number;
  available: number;
}

interface StatusDistributionData {
  name: string;
  value: number;
  color: string;
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

const STATUS_COLORS = {
  completed: COLORS.success,
  'in-progress': COLORS.primary,
  planning: COLORS.info,
  'on-hold': COLORS.warning,
  overdue: COLORS.danger,
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm tooltip-value" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Project Timeline Chart
export function ProjectTimelineChart({ data }: { data: ProjectChartData[] }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Project Timeline</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="completed"
            stackId="1"
            stroke={COLORS.success}
            fill={COLORS.success}
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="inProgress"
            stackId="1"
            stroke={COLORS.primary}
            fill={COLORS.primary}
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="planned"
            stackId="1"
            stroke={COLORS.info}
            fill={COLORS.info}
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Revenue Chart
export function RevenueChart({ data }: { data: ProjectChartData[] }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke={COLORS.success}
            strokeWidth={3}
            dot={{ fill: COLORS.success, r: 6 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Team Utilization Chart
export function TeamUtilizationChart({ data }: { data: TeamUtilizationData[] }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Team Utilization</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="utilization" stackId="a" fill={COLORS.primary} name="Utilized Hours" />
          <Bar
            dataKey="available"
            stackId="a"
            fill={COLORS.gray}
            fillOpacity={0.3}
            name="Available Hours"
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Project Status Distribution
export function ProjectStatusChart({ data }: { data: StatusDistributionData[] }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Project Status Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Budget vs Actual Chart
export function BudgetVarianceChart({ data }: { data: ChartData[] }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Budget vs Actual Costs</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="budget" fill={COLORS.primary} name="Budget" />
          <Bar dataKey="actual" fill={COLORS.warning} name="Actual" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Generate mock data for development
export function generateMockProjectData(): ProjectChartData[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month) => ({
    month,
    completed: Math.floor(Math.random() * 10) + 5,
    inProgress: Math.floor(Math.random() * 8) + 3,
    planned: Math.floor(Math.random() * 6) + 2,
    revenue: Math.floor(Math.random() * 50000) + 100000,
  }));
}

export function generateMockTeamData(): TeamUtilizationData[] {
  const teamMembers = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
  return teamMembers.map((name) => {
    const capacity = 40; // 40 hours per week
    const utilization = Math.floor(Math.random() * 30) + 20; // 20-50 hours utilized
    return {
      name,
      utilization,
      capacity,
      available: capacity - utilization,
    };
  });
}

export function generateMockStatusData(): StatusDistributionData[] {
  return [
    { name: 'Completed', value: 12, color: STATUS_COLORS.completed },
    { name: 'In Progress', value: 8, color: STATUS_COLORS['in-progress'] },
    { name: 'Planning', value: 3, color: STATUS_COLORS.planning },
    { name: 'On Hold', value: 2, color: STATUS_COLORS['on-hold'] },
    { name: 'Overdue', value: 1, color: STATUS_COLORS.overdue },
  ];
}

export function generateMockBudgetData(): ChartData[] {
  const projects = ['Website', 'Mobile App', 'Marketing', 'Consulting', 'Design'];
  return projects.map((project) => ({
    name: project,
    budget: Math.floor(Math.random() * 50000) + 20000,
    actual: Math.floor(Math.random() * 60000) + 15000,
  }));
}
