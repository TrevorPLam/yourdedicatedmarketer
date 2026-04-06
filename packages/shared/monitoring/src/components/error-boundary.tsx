import React, { Component, ErrorInfo, ReactNode, useCallback } from 'react';
import type { ErrorBoundaryState } from '../types/monitoring.types';
import { ErrorTracker } from '../error/error-tracker';

interface MonitoringErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
}

interface MonitoringErrorBoundaryState extends ErrorBoundaryState {
  error?: Error;
  errorInfo?: ErrorInfo;
}

function captureMonitoringError(error: Error, errorInfo?: ErrorInfo): void {
  try {
    const errorTracker = ErrorTracker.getInstance();
    errorTracker.trackError(error, {
      extra: {
        componentStack: errorInfo?.componentStack,
        errorBoundary: true,
      },
      tags: {
        component: 'error-boundary',
      },
    });
  } catch (trackingError) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to capture monitoring boundary error:', trackingError);
    }
  }
}

export class MonitoringErrorBoundary extends Component<
  MonitoringErrorBoundaryProps,
  MonitoringErrorBoundaryState
> {
  private resetTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(props: MonitoringErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Partial<MonitoringErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Generate a unique error ID
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Capture the error
    captureMonitoringError(error, errorInfo);

    this.setState({
      error,
      errorInfo,
      errorId,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Auto-reset after 30 seconds for non-critical errors
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = setTimeout(() => {
      this.resetErrorBoundary();
    }, 30000);
  }

  componentDidUpdate(prevProps: MonitoringErrorBoundaryProps) {
    const { resetOnPropsChange, resetKeys } = this.props;
    const { hasError } = this.state;

    if (hasError && resetOnPropsChange && resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key) =>
          prevProps[key as keyof MonitoringErrorBoundaryProps] !==
          this.props[key as keyof MonitoringErrorBoundaryProps]
      );

      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = null;
    }

    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: undefined,
    });
  };

  render(): ReactNode {
    const { hasError, error, errorId } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return <>{fallback}</>;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h1>
              <p className="text-gray-600 mb-6">
                We're sorry, but something unexpected happened. Our team has been notified and is
                working to fix this issue.
              </p>

              {errorId && <p className="text-sm text-gray-500 mb-4">Error ID: {errorId}</p>}

              <div className="space-y-3">
                <button
                  onClick={this.resetErrorBoundary}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Try again
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Reload page
                </button>
              </div>

              {process.env.NODE_ENV === 'development' && error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                    Error details (development only)
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 rounded-md text-xs font-mono text-gray-800 overflow-auto max-h-40">
                    <div className="mb-2">
                      <strong>Error:</strong> {error.name}
                    </div>
                    <div className="mb-2">
                      <strong>Message:</strong> {error.message}
                    </div>
                    {error.stack && (
                      <div>
                        <strong>Stack trace:</strong>
                        <pre className="whitespace-pre-wrap mt-1">{error.stack}</pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

// Hook version for functional components
export const useErrorBoundary = () => {
  const handleError = useCallback(
    (error: Error, errorInfo?: ErrorInfo) => {
      captureMonitoringError(error, errorInfo);
    },
    []
  );

  return {
    handleError,
  };
};
