'use client';

import { Card } from '@agency/ui-components/react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Configure dashboard and application settings</p>
      </div>

      <Card className="p-8 text-center">
        <div className="text-gray-400 mb-4">⚙️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings Panel</h3>
        <p className="text-gray-600">Settings and configuration features coming soon</p>
      </Card>
    </div>
  );
}
