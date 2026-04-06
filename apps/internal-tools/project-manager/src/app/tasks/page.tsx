import { Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';

export default function TasksPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Task Board</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track project tasks with drag-and-drop functionality
            </p>
          </div>
        </div>

        <Suspense fallback={<DashboardSkeleton />}>
          <TaskBoard />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
