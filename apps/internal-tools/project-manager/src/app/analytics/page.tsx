import { Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Suspense fallback={<DashboardSkeleton />}>
          <AnalyticsDashboard />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
