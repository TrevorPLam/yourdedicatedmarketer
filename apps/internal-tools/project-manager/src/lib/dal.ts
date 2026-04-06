/**
 * Data Access Layer (DAL) - Defense-in-Depth Authentication
 * 
 * Implements server-side session verification at data access points
 * to prevent CVE-2025-29927 middleware bypass attacks.
 * 
 * Version: 2.0.0
 * Updated: April 2026
 */

import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { getToken } from 'next-auth/jwt';
import { securityConfig } from '@/../../security.config';

// User interface for DAL
interface User {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: Date;
}

// Auth session interface
interface AuthSession {
  user: User;
  session: {
    id: string;
    expires: Date;
    token: string;
  };
}

// Mock user database - replace with real database integration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@agency.com',
    role: 'admin',
    isActive: true,
  },
  {
    id: '2',
    email: 'user@agency.com',
    role: 'user',
    isActive: true,
  },
];

// Server-side session verification with React.cache() for performance
export const verifySession = cache(async (): Promise<AuthSession | null> => {
  try {
    // Get session token from httpOnly cookie
    const sessionCookie = cookies().get('session-token')?.value;
    
    if (!sessionCookie) {
      console.log('DAL: No session cookie found');
      return null;
    }

    // Verify JWT token using NextAuth's getToken helper
    const token = await getToken({
      cookies: () => cookies(),
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production',
    });

    if (!token?.id || !token.email) {
      console.log('DAL: Invalid token structure', { token: !!token });
      return null;
    }

    // Check token expiration
    const now = Math.floor(Date.now() / 1000);
    const tokenExp = token.exp as number;
    
    if (tokenExp && now >= tokenExp) {
      console.log('DAL: Token expired', { now, tokenExp });
      return null;
    }

    // Fetch fresh user data from database
    const user = mockUsers.find(u => u.id === token.id);
    
    if (!user) {
      console.log('DAL: User not found', { userId: token.id });
      return null;
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('DAL: User is inactive', { userId: user.id });
      return null;
    }

    // Validate session age
    const tokenAge = now - (token.iat as number);
    const maxAge = securityConfig.auth.sessionTimeout / 1000;
    
    if (tokenAge > maxAge) {
      console.log('DAL: Session too old', { tokenAge, maxAge });
      return null;
    }

    // Return authenticated session
    return {
      user,
      session: {
        id: token.jti as string || `${user.id}-${Date.now()}`,
        expires: new Date(tokenExp * 1000),
        token: sessionCookie,
      },
    };
  } catch (error) {
    console.error('DAL: Session verification error:', error);
    return null;
  }
});

// Role-based access control helper
export const requireRole = async (requiredRole: string): Promise<AuthSession> => {
  const auth = await verifySession();
  
  if (!auth) {
    throw new Error('Authentication required');
  }
  
  if (auth.user.role !== requiredRole && auth.user.role !== 'admin') {
    throw new Error(`Insufficient permissions. Required: ${requiredRole}, Current: ${auth.user.role}`);
  }
  
  return auth;
};

// Admin-only access helper
export const requireAdmin = async (): Promise<AuthSession> => {
  return requireRole('admin');
};

// User or admin access helper
export const requireUser = async (): Promise<AuthSession> => {
  const auth = await verifySession();
  
  if (!auth) {
    throw new Error('Authentication required');
  }
  
  return auth;
};

// Security event logging for data access
export const logDataAccess = async (
  action: string,
  resource: string,
  userId?: string
): Promise<void> => {
  const auth = userId ? { user: { id: userId } } : await verifySession();
  
  const logEntry = {
    event: 'data_access',
    action,
    resource,
    userId: auth?.user?.id || 'anonymous',
    timestamp: new Date().toISOString(),
    ip: 'server-side', // In production, get from request context
  };
  
  console.log('DAL Security:', JSON.stringify(logEntry));
  
  // In production, send to security monitoring service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to security monitoring system
  }
};

// Data access validation wrapper
export const withAuth = async <T>(
  operation: () => Promise<T>,
  options: {
    requiredRole?: string;
    resource?: string;
    action?: string;
  } = {}
): Promise<T> => {
  const auth = options.requiredRole 
    ? await requireRole(options.requiredRole)
    : await verifySession();
  
  if (!auth) {
    throw new Error('Authentication required');
  }
  
  // Log the data access attempt
  if (options.resource && options.action) {
    await logDataAccess(options.action, options.resource, auth.user.id);
  }
  
  try {
    return await operation();
  } catch (error) {
    // Log security-relevant errors
    console.error('DAL: Operation failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: auth.user.id,
      operation: options.action,
      resource: options.resource,
    });
    
    throw error;
  }
};

// Export types for use in components
export type { AuthSession, User };

// Server-side token verification helper for API routes
export const verifyAPIToken = async (req: Request): Promise<AuthSession | null> => {
  try {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production',
    });
    
    if (!token?.id) {
      return null;
    }
    
    const user = mockUsers.find(u => u.id === token.id);
    
    if (!user || !user.isActive) {
      return null;
    }
    
    return {
      user,
      session: {
        id: token.jti as string || `${user.id}-${Date.now()}`,
        expires: new Date((token.exp as number) * 1000),
        token: token.sub as string,
      },
    };
  } catch (error) {
    console.error('DAL: API token verification error:', error);
    return null;
  }
};
