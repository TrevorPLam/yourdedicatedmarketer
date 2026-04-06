/**
 * Authentication provider interface and utilities
 * Provides abstraction for different authentication methods
 */

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: string;
  permissions: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthProvider {
  name: string;
  type: 'oauth' | 'email' | 'sso' | 'api-key' | 'session';

  // Authentication methods
  signIn(credentials: AuthCredentials): Promise<AuthResult>;
  signOut(): Promise<void>;
  signUp(credentials: SignUpCredentials): Promise<AuthResult>;

  // Session management
  getCurrentUser(): Promise<AuthUser | null>;
  refreshSession(): Promise<void>;
  updateProfile(data: Partial<AuthUser>): Promise<AuthUser>;

  // Token management
  getAccessToken(): Promise<string | null>;
  getRefreshToken(): Promise<string | null>;

  // Event listeners
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void;

  // Provider-specific methods
  resetPassword(email: string): Promise<void>;
  verifyEmail(token: string): Promise<void>;
  changePassword(oldPassword: string, newPassword: string): Promise<void>;
}

export interface AuthCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpCredentials extends AuthCredentials {
  name: string;
  acceptTerms: boolean;
}

export interface AuthResult {
  user: AuthUser;
  session: AuthSession;
  requiresVerification?: boolean;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  provider: string;
}

export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

// Auth provider factory
export class AuthProviderFactory {
  private providers: Map<string, AuthProvider> = new Map();

  register(provider: AuthProvider): void {
    this.providers.set(provider.name, provider);
  }

  get(name: string): AuthProvider | undefined {
    return this.providers.get(name);
  }

  getAll(): AuthProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Built-in provider creation is not yet implemented.
   * Register a concrete AuthProvider via `register()` and retrieve it via `get()`.
   */
  create(_config: AuthProviderConfig): never {
    throw new Error(
      `AuthProviderFactory.create() is not yet available. ` +
        `No auth provider implementations have been built. ` +
        `Register a custom AuthProvider via AuthProviderFactory.register() instead.`
    );
  }
}

export interface AuthProviderConfig {
  name: string;
  type: 'oauth' | 'email' | 'sso' | 'api-key';
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
  scopes?: string[];
  endpoints?: {
    auth?: string;
    token?: string;
    user?: string;
    revoke?: string;
  };
  options?: Record<string, any>;
}

// Base auth provider implementation
export abstract class BaseAuthProvider implements AuthProvider {
  abstract name: string;
  abstract type: 'oauth' | 'email' | 'sso' | 'api-key' | 'session';

  protected listeners: Set<(user: AuthUser | null) => void> = new Set();

  abstract signIn(credentials: AuthCredentials): Promise<AuthResult>;
  abstract signOut(): Promise<void>;
  abstract signUp(credentials: SignUpCredentials): Promise<AuthResult>;
  abstract getCurrentUser(): Promise<AuthUser | null>;
  abstract refreshSession(): Promise<void>;
  abstract updateProfile(data: Partial<AuthUser>): Promise<AuthUser>;
  abstract getAccessToken(): Promise<string | null>;
  abstract getRefreshToken(): Promise<string | null>;

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  protected notifyAuthStateChange(user: AuthUser | null): void {
    this.listeners.forEach((listener) => listener(user));
  }

  async resetPassword(email: string): Promise<void> {
    throw new Error('Password reset not implemented');
  }

  async verifyEmail(token: string): Promise<void> {
    throw new Error('Email verification not implemented');
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    throw new Error('Password change not implemented');
  }
}

// OAuth provider implementation
export class OAuthProvider extends BaseAuthProvider {
  name: string;
  type = 'oauth' as const;

  constructor(private config: AuthProviderConfig) {
    super();
    this.name = config.name;
  }

  async signIn(credentials: AuthCredentials): Promise<AuthResult> {
    // OAuth implementation
    throw new Error('OAuth sign in not implemented');
  }

  async signOut(): Promise<void> {
    // OAuth sign out implementation
    throw new Error('OAuth sign out not implemented');
  }

  async signUp(credentials: SignUpCredentials): Promise<AuthResult> {
    // OAuth sign up implementation
    throw new Error('OAuth sign up not implemented');
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    // OAuth get current user implementation
    throw new Error('OAuth get current user not implemented');
  }

  async refreshSession(): Promise<void> {
    // OAuth refresh session implementation
    throw new Error('OAuth refresh session not implemented');
  }

  async updateProfile(data: Partial<AuthUser>): Promise<AuthUser> {
    // OAuth update profile implementation
    throw new Error('OAuth update profile not implemented');
  }

  async getAccessToken(): Promise<string | null> {
    // OAuth get access token implementation
    throw new Error('OAuth get access token not implemented');
  }

  async getRefreshToken(): Promise<string | null> {
    // OAuth get refresh token implementation
    throw new Error('OAuth get refresh token not implemented');
  }
}

// Email provider implementation
export class EmailProvider extends BaseAuthProvider {
  name: string;
  type = 'email' as const;

  constructor(private config: AuthProviderConfig) {
    super();
    this.name = config.name;
  }

  async signIn(credentials: AuthCredentials): Promise<AuthResult> {
    // Email sign in implementation
    throw new Error('Email sign in not implemented');
  }

  async signOut(): Promise<void> {
    // Email sign out implementation
    throw new Error('Email sign out not implemented');
  }

  async signUp(credentials: SignUpCredentials): Promise<AuthResult> {
    // Email sign up implementation
    throw new Error('Email sign up not implemented');
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    // Email get current user implementation
    throw new Error('Email get current user not implemented');
  }

  async refreshSession(): Promise<void> {
    // Email refresh session implementation
    throw new Error('Email refresh session not implemented');
  }

  async updateProfile(data: Partial<AuthUser>): Promise<AuthUser> {
    // Email update profile implementation
    throw new Error('Email update profile not implemented');
  }

  async getAccessToken(): Promise<string | null> {
    // Email get access token implementation
    throw new Error('Email get access token not implemented');
  }

  async getRefreshToken(): Promise<string | null> {
    // Email get refresh token implementation
    throw new Error('Email get refresh token not implemented');
  }

  async resetPassword(email: string): Promise<void> {
    // Email password reset implementation
    throw new Error('Email password reset not implemented');
  }

  async verifyEmail(token: string): Promise<void> {
    // Email verification implementation
    throw new Error('Email verification not implemented');
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    // Email password change implementation
    throw new Error('Email password change not implemented');
  }
}

// SSO provider implementation
export class SSOProvider extends BaseAuthProvider {
  name: string;
  type = 'sso' as const;

  constructor(private config: AuthProviderConfig) {
    super();
    this.name = config.name;
  }

  async signIn(credentials: AuthCredentials): Promise<AuthResult> {
    // SSO sign in implementation
    throw new Error('SSO sign in not implemented');
  }

  async signOut(): Promise<void> {
    // SSO sign out implementation
    throw new Error('SSO sign out not implemented');
  }

  async signUp(credentials: SignUpCredentials): Promise<AuthResult> {
    // SSO sign up implementation
    throw new Error('SSO sign up not implemented');
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    // SSO get current user implementation
    throw new Error('SSO get current user not implemented');
  }

  async refreshSession(): Promise<void> {
    // SSO refresh session implementation
    throw new Error('SSO refresh session not implemented');
  }

  async updateProfile(data: Partial<AuthUser>): Promise<AuthUser> {
    // SSO update profile implementation
    throw new Error('SSO update profile not implemented');
  }

  async getAccessToken(): Promise<string | null> {
    // SSO get access token implementation
    throw new Error('SSO get access token not implemented');
  }

  async getRefreshToken(): Promise<string | null> {
    // SSO get refresh token implementation
    throw new Error('SSO get refresh token not implemented');
  }
}

// API Key provider implementation
export class ApiKeyProvider extends BaseAuthProvider {
  name: string;
  type = 'api-key' as const;

  constructor(private config: AuthProviderConfig) {
    super();
    this.name = config.name;
  }

  async signIn(credentials: AuthCredentials): Promise<AuthResult> {
    // API key sign in implementation
    throw new Error('API key sign in not implemented');
  }

  async signOut(): Promise<void> {
    // API key sign out implementation
    throw new Error('API key sign out not implemented');
  }

  async signUp(credentials: SignUpCredentials): Promise<AuthResult> {
    // API key sign up implementation
    throw new Error('API key sign up not implemented');
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    // API key get current user implementation
    throw new Error('API key get current user not implemented');
  }

  async refreshSession(): Promise<void> {
    // API key refresh session implementation
    throw new Error('API key refresh session not implemented');
  }

  async updateProfile(data: Partial<AuthUser>): Promise<AuthUser> {
    // API key update profile implementation
    throw new Error('API key update profile not implemented');
  }

  async getAccessToken(): Promise<string | null> {
    // API key get access token implementation
    throw new Error('API key get access token not implemented');
  }

  async getRefreshToken(): Promise<string | null> {
    // API key get refresh token implementation
    throw new Error('API key get refresh token not implemented');
  }
}
