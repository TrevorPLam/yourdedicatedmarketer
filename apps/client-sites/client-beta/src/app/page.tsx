'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import Overview from '@/components/dashboard/Overview';
import Analytics from '@/components/dashboard/Analytics';
import Reports from '@/components/dashboard/Reports';
import Users from '@/components/dashboard/Users';
import Settings from '@/components/dashboard/Settings';
import { DASHBOARD_WIDGETS, type DashboardWidget } from '@/config/client.config';

export default function DashboardPage() {
  const [activeWidget, setActiveWidget] = useState<DashboardWidget>(DASHBOARD_WIDGETS.OVERVIEW);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveWidget = () => {
    switch (activeWidget) {
      case DASHBOARD_WIDGETS.OVERVIEW:
        return <Overview />;
      case DASHBOARD_WIDGETS.ANALYTICS:
        return <Analytics />;
      case DASHBOARD_WIDGETS.REPORTS:
        return <Reports />;
      case DASHBOARD_WIDGETS.USERS:
        return <Users />;
      case DASHBOARD_WIDGETS.SETTINGS:
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeWidget={activeWidget}
          onWidgetChange={setActiveWidget}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} activeWidget={activeWidget} />

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">{renderActiveWidget()}</div>
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}
