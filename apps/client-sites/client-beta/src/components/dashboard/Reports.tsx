'use client';

import { Card } from '@agency/ui-components/react';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
        <p className="text-gray-600">Generate and manage reports</p>
      </div>

      <Card className="p-8 text-center">
        <div className="text-gray-400 mb-4">📋</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports Center</h3>
        <p className="text-gray-600">Report generation and management features coming soon</p>
      </Card>
    </div>
  );
}
