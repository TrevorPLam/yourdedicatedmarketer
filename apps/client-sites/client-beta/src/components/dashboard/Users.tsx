'use client';

import { Card } from '@agency/ui-components/react';

export default function Users() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <p className="text-gray-600">Manage users and permissions</p>
      </div>

      <Card className="p-8 text-center">
        <div className="text-gray-400 mb-4">👥</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
        <p className="text-gray-600">User management features coming soon</p>
      </Card>
    </div>
  );
}
