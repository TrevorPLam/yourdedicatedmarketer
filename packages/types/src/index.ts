// Main exports for @agency/types
export * from './api';
export * from './cms';
export * from './database';

// Common types used across packages
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    timestamp: string;
    version: string;
    requestId?: string;
  };
}

export interface Environment {
  NODE_ENV: 'development' | 'staging' | 'production';
  DATABASE_URL: string;
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_ENV?: string;
  CF_PAGES?: string;
}

export type ClientFramework = 'astro' | 'nextjs' | 'hybrid';
export type DatabaseProvider = 'supabase' | 'neon' | 'postgres';
export type DeploymentPlatform = 'vercel' | 'cloudflare' | 'netlify';
