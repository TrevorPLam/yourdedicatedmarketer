export const CLIENT_CONFIG = {
  name: 'Client Beta',
  domain: 'client-beta.com',
  industry: 'Financial Services',
  theme: 'beta-brand',
  type: 'dashboard',
  features: {
    analytics: true,
    reporting: true,
    userManagement: true,
    dataVisualization: true,
    realTimeUpdates: true,
    exportData: true,
    notifications: true,
  },
  branding: {
    logo: '/images/beta-logo.svg',
    favicon: '/favicon.ico',
    primaryColor: '#7c3aed',
    secondaryColor: '#64748b',
  },
  contact: {
    email: 'support@client-beta.com',
    phone: '+1 (555) 987-6543',
    address: '456 Finance St, Suite 200, New York, NY 10002',
  },
  api: {
    // NEXT_PUBLIC_API_URL must be set in all non-development environments.
    // Silently falling back to localhost would cause silent failures in production.
    baseUrl: (() => {
      const url = process.env.NEXT_PUBLIC_API_URL;
      if (!url && process.env.NODE_ENV === 'production') {
        throw new Error(
          'NEXT_PUBLIC_API_URL is required in production. Set it in your deployment environment.'
        );
      }
      return url ?? 'http://localhost:3001';
    })(),
    timeout: 10000,
    retries: 3,
  },
  dashboard: {
    refreshInterval: 30000, // 30 seconds
    defaultTimeRange: '7d',
    maxDataPoints: 1000,
    exportFormats: ['csv', 'xlsx', 'pdf'],
  },
};

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  ANALYST: 'analyst',
  VIEWER: 'viewer',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const PERMISSIONS = {
  [USER_ROLES.ADMIN]: ['*'],
  [USER_ROLES.MANAGER]: ['read', 'write', 'export', 'manage_users'],
  [USER_ROLES.ANALYST]: ['read', 'write', 'export'],
  [USER_ROLES.VIEWER]: ['read'],
} as const;

export const DASHBOARD_WIDGETS = {
  OVERVIEW: 'overview',
  ANALYTICS: 'analytics',
  REPORTS: 'reports',
  USERS: 'users',
  SETTINGS: 'settings',
  NOTIFICATIONS: 'notifications',
} as const;

export type DashboardWidget = typeof DASHBOARD_WIDGETS[keyof typeof DASHBOARD_WIDGETS];

export const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  AREA: 'area',
  PIE: 'pie',
  DONUT: 'donut',
  SCATTER: 'scatter',
  HEATMAP: 'heatmap',
} as const;

export type ChartType = typeof CHART_TYPES[keyof typeof CHART_TYPES];
