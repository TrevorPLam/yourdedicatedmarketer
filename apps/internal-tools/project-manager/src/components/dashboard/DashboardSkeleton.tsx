import { Card } from '@agency/ui-components/react';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-8 bg-gray-200 rounded w-12" />
              </div>
              <div className="h-8 w-8 bg-gray-200 rounded" />
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue and Performance Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-6 bg-gray-200 rounded w-32" />
                <div className="h-5 w-5 bg-gray-200 rounded" />
              </div>
              <div className="h-10 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-40" />
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Projects Skeleton */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded w-32" />
          <div className="h-8 bg-gray-200 rounded w-20" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-48" />
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="flex items-center gap-4">
                  <div className="h-6 bg-gray-200 rounded w-20" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              </div>

              <div className="ml-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-8" />
                <div className="w-20 bg-gray-200 rounded-full h-2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
