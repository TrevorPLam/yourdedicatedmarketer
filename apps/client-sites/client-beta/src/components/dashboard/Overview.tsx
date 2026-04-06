'use client';

import { useState } from 'react';
import { Card } from '@agency/ui-components/react';
import { Button } from '@agency/ui-components/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 45000, users: 1200 },
  { month: 'Feb', revenue: 52000, users: 1350 },
  { month: 'Mar', revenue: 48000, users: 1280 },
  { month: 'Apr', revenue: 61000, users: 1420 },
  { month: 'May', revenue: 55000, users: 1380 },
  { month: 'Jun', revenue: 67000, users: 1520 },
];

const userActivityData = [
  { day: 'Mon', active: 320, new: 45 },
  { day: 'Tue', active: 380, new: 52 },
  { day: 'Wed', active: 410, new: 38 },
  { day: 'Thu', active: 390, new: 61 },
  { day: 'Fri', active: 450, new: 48 },
  { day: 'Sat', active: 280, new: 32 },
  { day: 'Sun', active: 240, new: 28 },
];

const trafficSources = [
  { name: 'Direct', value: 35, color: '#7c3aed' },
  { name: 'Organic Search', value: 30, color: '#a78bfa' },
  { name: 'Social Media', value: 20, color: '#c4b5fd' },
  { name: 'Referral', value: 15, color: '#ede9fe' },
];

const metrics = [
  { title: 'Total Revenue', value: '$328,000', change: '+12.5%', trend: 'up' },
  { title: 'Active Users', value: '8,470', change: '+8.2%', trend: 'up' },
  { title: 'Conversion Rate', value: '3.24%', change: '-2.1%', trend: 'down' },
  { title: 'Avg. Session', value: '4m 32s', change: '+18.3%', trend: 'up' },
];

export default function Overview() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-600">Monitor your key metrics and performance</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
              <div
                className={`flex items-center space-x-1 text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                <span>{metric.trend === 'up' ? '↑' : '↓'}</span>
                <span>{metric.change}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* User Activity Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="active" fill="#7c3aed" />
              <Bar dataKey="new" fill="#a78bfa" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={trafficSources}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {trafficSources.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { user: 'John Doe', action: 'Generated monthly report', time: '2 minutes ago' },
              { user: 'Sarah Smith', action: 'Updated user settings', time: '15 minutes ago' },
              { user: 'Mike Johnson', action: 'Exported analytics data', time: '1 hour ago' },
              { user: 'Emily Davis', action: 'Created new dashboard', time: '2 hours ago' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                </div>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
