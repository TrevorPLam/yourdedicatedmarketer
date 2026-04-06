import { Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ClientPortal } from '@/components/portal/ClientPortal';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';

export default function ClientsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Suspense fallback={<DashboardSkeleton />}>
          <ClientPortal />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
