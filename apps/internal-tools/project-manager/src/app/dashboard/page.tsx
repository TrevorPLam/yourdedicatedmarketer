import { Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EnhancedDashboardOverview } from '@/components/dashboard/EnhancedDashboardOverview';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your projects and team performance</p>
        </div>

        <Suspense fallback={<DashboardSkeleton />}>
          <EnhancedDashboardOverview />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
