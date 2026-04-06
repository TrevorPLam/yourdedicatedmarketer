'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@agency/ui-components/react';
import { CLIENT_CONFIG, DASHBOARD_WIDGETS, type DashboardWidget } from '@/config/client.config';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeWidget: DashboardWidget;
  onWidgetChange: (widget: DashboardWidget) => void;
}

const navigation = [
  { id: DASHBOARD_WIDGETS.OVERVIEW, name: 'Overview', icon: '📊' },
  { id: DASHBOARD_WIDGETS.ANALYTICS, name: 'Analytics', icon: '📈' },
  { id: DASHBOARD_WIDGETS.REPORTS, name: 'Reports', icon: '📋' },
  { id: DASHBOARD_WIDGETS.USERS, name: 'Users', icon: '👥' },
  { id: DASHBOARD_WIDGETS.SETTINGS, name: 'Settings', icon: '⚙️' },
];

export default function Sidebar({ isOpen, onClose, activeWidget, onWidgetChange }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">β</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{CLIENT_CONFIG.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
              ✕
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onWidgetChange(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                  ${
                    activeWidget === item.id
                      ? 'bg-purple-100 text-purple-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium text-sm">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
                <p className="text-xs text-gray-500 truncate">Administrator</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
