'use client';

import { useState } from 'react';
import { Button } from '@agency/ui-components/react';
import { CLIENT_CONFIG, type DashboardWidget } from '@/config/client.config';

interface HeaderProps {
  onMenuClick: () => void;
  activeWidget: DashboardWidget;
}

export default function Header({ onMenuClick, activeWidget }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const getWidgetTitle = (widget: DashboardWidget): string => {
    switch (widget) {
      case 'overview':
        return 'Dashboard Overview';
      case 'analytics':
        return 'Analytics';
      case 'reports':
        return 'Reports';
      case 'users':
        return 'User Management';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" onClick={onMenuClick} className="lg:hidden">
            ☰
          </Button>

          {/* Page title */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{getWidgetTitle(activeWidget)}</h1>
            <p className="text-sm text-gray-500">{CLIENT_CONFIG.industry} Dashboard</p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2"
            >
              🔍
            </Button>
            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 relative"
            >
              🔔
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-4 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm text-gray-900">New report available</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                  <div className="p-4 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm text-gray-900">System update completed</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">JD</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
