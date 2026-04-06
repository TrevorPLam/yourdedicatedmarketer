// API type definitions
// API request interface with proper typing
export interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, unknown>;
  timeout?: number;
  retries?: number;
}

// API response interface with proper typing
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: {
    timestamp: string;
    requestId?: string;
    version?: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// API error interface with proper typing
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  stack?: string;
  timestamp?: string;
  requestId?: string;
}

export interface ResponseMeta {
  timestamp: string;
  requestId: string;
  version: string;
  duration?: number;
}

export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
  auth?: {
    type: 'bearer' | 'apikey' | 'basic';
    token: string;
  };
}

// REST API endpoints
export interface ApiEndpoints {
  // Auth endpoints
  auth: {
    login: '/auth/login';
    logout: '/auth/logout';
    register: '/auth/register';
    refresh: '/auth/refresh';
    verify: '/auth/verify';
  };

  // User endpoints
  users: {
    profile: '/users/profile';
    settings: '/users/settings';
    list: '/users';
    get: (id: string) => string;
    update: (id: string) => string;
    remove: (id: string) => string;
  };

  // Content endpoints
  content: {
    pages: '/content/pages';
    posts: '/content/posts';
    media: '/content/media';
    getPage: (id: string) => string;
    getPost: (id: string) => string;
    upload: '/content/upload';
  };

  // Analytics endpoints
  analytics: {
    pageviews: '/analytics/pageviews';
    events: '/analytics/events';
    performance: '/analytics/performance';
    reports: '/analytics/reports';
  };
}

// GraphQL query interface with proper typing
export interface GraphQLQuery {
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
  extensions?: Record<string, unknown>;
}

// GraphQL response interface with proper typing
export interface GraphQLResponse<T = unknown> {
  data?: T;
  errors?: GraphQLError[];
  extensions?: Record<string, unknown>;
  meta?: {
    requestId?: string;
    timestamp?: string;
  };
}

// GraphQL error interface with proper typing
export interface GraphQLError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: Array<string | number>;
  extensions?: Record<string, unknown>;
  code?: string;
  classification?: string;
}

// WebSocket message interface with proper typing
export interface WebSocketMessage<T = unknown> {
  type: string;
  payload: T;
  id?: string;
  timestamp: string;
  metadata?: {
    sender?: string;
    channel?: string;
    version?: string;
  };
}

export interface WebSocketClient {
  connect(): Promise<void>;
  disconnect(): void;
  send(message: WebSocketMessage): void;
  on(event: string, callback: (message: WebSocketMessage) => void): void;
  off(event: string, callback: (message: WebSocketMessage) => void): void;
}
