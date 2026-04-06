'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CLIENT_CONFIG } from '@/config/client.config';

// Temporary mock components until packages are fully built
const ConsentManager = ({ children }: { children: ReactNode }) => <>{children}</>;
const PerformanceMonitor = ({ children }: { children: ReactNode }) => <>{children}</>;

interface DashboardLayoutProps {
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      gcTime: 300000, // 5 minutes (renamed from cacheTime)
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardProviders>
        <div className="min-h-screen bg-gray-50">{children}</div>
      </DashboardProviders>
    </QueryClientProvider>
  );
}

function DashboardProviders({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Analytics Consent */}
      <ConsentManager>
        {/* Performance Monitoring */}
        <PerformanceMonitor>
          {/* Main Content */}
          {children}
        </PerformanceMonitor>
      </ConsentManager>
    </>
  );
}
