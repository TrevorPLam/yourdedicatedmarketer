import { Skeleton } from '@repo/ui';

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </section>

      {/* Section Skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Skeleton className="mx-auto mb-8 h-8 w-48" />
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4 rounded-lg border p-6">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Card Grid Skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Skeleton className="mx-auto mb-8 h-8 w-40" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4 rounded-lg border p-6">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-24" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl space-y-4 rounded-lg border p-8 text-center">
            <Skeleton className="mx-auto h-8 w-64" />
            <Skeleton className="mx-auto h-6 w-full" />
            <Skeleton className="mx-auto h-10 w-32" />
          </div>
        </div>
      </section>
    </div>
  );
}
