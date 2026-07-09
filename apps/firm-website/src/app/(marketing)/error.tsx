'use client';

import { useEffect } from 'react';
import { Button } from '@repo/ui';

function logError(error: Error & { digest?: string }) {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error boundary caught:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
  }
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl rounded-lg border p-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Something went wrong</h1>
          <p className="mb-6 text-lg text-muted-foreground">
            We apologize for the inconvenience. An error occurred while loading this page.
          </p>
          <div className="mb-6 flex justify-center gap-4">
            <Button onClick={reset}>Try again</Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Go to homepage
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details className="mx-auto max-w-lg text-left">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                Error details (development only)
              </summary>
              <pre className="mt-2 overflow-auto rounded bg-muted p-4 text-xs">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
