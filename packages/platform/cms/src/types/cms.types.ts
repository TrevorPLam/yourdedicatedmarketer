/**
 * CMS Types - Re-export from shared types
 * 
 * This file re-exports types from @agency/types/cms to prevent
 * circular dependencies while maintaining API compatibility.
 */

// Re-export all shared CMS types
export * from '@agency/types/cms';

// Add any platform-specific CMS types here
export interface PlatformCMSConfig {
  platform: 'web' | 'mobile' | 'server';
  features: {
    realtimeUpdates: boolean;
    previewMode: boolean;
    typeGeneration: boolean;
  };
}
