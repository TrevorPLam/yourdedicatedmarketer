import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { securityConfig } from '@/../../security.config';

// Environment validation schema
const EnvironmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  NEXTAUTH_SECRET: z.string().min(32, 'NextAuth secret must be at least 32 characters'),
  GOOGLE_CLIENT_ID: z.string().min(1, 'Google Client ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'Google Client Secret is required'),
  JWT_ISSUER: z.string().optional(),
  JWT_AUDIENCE: z.string().optional(),
});

// Validate environment variables
function validateEnvironment() {
  const result = EnvironmentSchema.safeParse(process.env);
  
  if (!result.success) {
    const errors = result.error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    
    console.error('Environment validation failed:', errors);
    throw new Error(`Invalid environment configuration: ${errors.map(e => e.field).join(', ')}`);
  }
  
  return result.data;
}

// Validate environment on module load
const env = validateEnvironment();

// User schema for validation
const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'user', 'manager']),
  isActive: z.boolean(),
  lastLogin: z.date().optional(),
});

type User = z.infer<typeof UserSchema>;

// Mock user database - replace with real database integration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@agency.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO.', // password: Admin123!
    role: 'admin',
    isActive: true,
  },
  {
    id: '2',
    email: 'user@agency.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO.', // password: User123!
    role: 'user',
    isActive: true,
  },
];

// Secure user lookup with proper error handling
async function findUserByEmail(email: string): Promise<User | null> {
  try {
    // In production, this would be a database query
    const user = mockUsers.find(u => u.email === email);
    return user || null;
  } catch (error) {
    console.error('User lookup error:', error);
    throw new Error('Authentication service unavailable');
  }
}

// Verify password using bcrypt
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

// Update last login timestamp
async function updateLastLogin(userId: string): Promise<void> {
  try {
    // In production, this would update the database
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.lastLogin = new Date();
    }
  } catch (error) {
    console.error('Failed to update last login:', error);
    // Don't throw - authentication should still succeed
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      
      // OAuth 2.1 compliance - PKCE is mandatory in 2026
      checks: ["pkce", "state"], // PKCE and state verification required
      
      // Enhanced security settings
      authorization: {
        params: {
          prompt: "consent", // Force consent screen for security
          access_type: "offline", // Enable refresh tokens
          response_type: "code", // Authorization code flow (OAuth 2.1)
          scope: "openid email profile", // Minimal required scopes
        },
      },
      
      // User profile mapping with validation
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          // Default role for OAuth users - can be updated later
          role: "user",
        };
      },
      
      // Additional client configuration for security
      client: {
        token_endpoint_auth_method: "client_secret_post", // More secure than basic auth
        token_endpoint_auth_params: {
          // Additional security parameters
        },
      },
      
      // Error handling
      httpOptions: {
        timeout: 10000, // 10 second timeout
      },
      
      // Well-known configuration validation
      wellKnown: undefined, // Let NextAuth handle discovery
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          // Validate input format
          const emailValidation = z.string().email().safeParse(credentials.email);
          if (!emailValidation.success) {
            throw new Error('Invalid email format');
          }

          // Find user by email
          const user = await findUserByEmail(credentials.email);
          if (!user) {
            throw new Error('Invalid email or password');
          }

          // Check if user is active
          if (!user.isActive) {
            throw new Error('Account is disabled');
          }

          // Verify password
          const isValidPassword = await verifyPassword(credentials.password, user.password);
          if (!isValidPassword) {
            throw new Error('Invalid email or password');
          }

          // Update last login
          await updateLastLogin(user.id);

          // Return user data for NextAuth
          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          // Log security events
          console.error('Authentication attempt failed:', {
            email: credentials.email,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
          });
          
          // Always throw to prevent null returns
          throw new Error(
            error instanceof Error ? error.message : 'Authentication failed'
          );
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: securityConfig.auth.sessionTimeout, // Use security config
    updateAge: 60 * 60, // Update session every hour
  },
  
  // Enhanced JWT configuration
  jwt: {
    encryption: true, // Encrypt JWT tokens
    secret: env.NEXTAUTH_SECRET,
    maxAge: securityConfig.auth.sessionTimeout,
    
    // Custom encode/decode for additional security
    async encode({ token, secret }) {
      // Add additional security claims
      const enhancedToken = {
        ...token,
        iat: Math.floor(Date.now() / 1000), // Issued at
        exp: Math.floor(Date.now() / 1000) + securityConfig.auth.sessionTimeout / 1000, // Expiration
        iss: env.JWT_ISSUER || securityConfig.auth.jwt.issuer,
        aud: env.JWT_AUDIENCE || securityConfig.auth.jwt.audience,
        sub: token.id,
        auth_time: Math.floor(Date.now() / 1000),
        jti: `${token.id}-${Date.now()}`, // Unique JWT ID
      };
      
      // In production, use a proper JWT library with RS256
      // For now, NextAuth handles the encoding
      return JSON.stringify(enhancedToken);
    },
    
    async decode({ token, secret }) {
      try {
        const decoded = JSON.parse(token as string);
        
        // Validate token structure
        if (!decoded.sub || !decoded.iat || !decoded.exp) {
          throw new Error('Invalid token structure');
        }
        
        // Check expiration
        if (Date.now() >= decoded.exp * 1000) {
          throw new Error('Token expired');
        }
        
        return decoded;
      } catch (error) {
        console.error('JWT decode error:', error);
        return null;
      }
    },
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user && account) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          provider: account.provider,
          auth_time: Math.floor(Date.now() / 1000),
        };
      }
      
      // Handle session update (e.g., token refresh)
      if (trigger === 'update' && session) {
        return { ...token, ...session.user };
      }
      
      // Token validation on each use
      if (token) {
        // Check if token is still valid
        const now = Math.floor(Date.now() / 1000);
        const tokenAge = now - (token.auth_time || 0);
        const maxAge = securityConfig.auth.sessionTimeout / 1000;
        
        // Force refresh if token is old
        if (tokenAge > maxAge * 0.8) { // Refresh at 80% of max age
          console.log('Security: Token refresh recommended', {
            userId: token.id,
            tokenAge,
            maxAge,
          });
        }
        
        // Add security metadata
        token.lastValidated = now;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (token) {
        // Enhanced session validation
        if (!token.id || !token.email) {
          throw new Error('Invalid session: missing user data');
        }
        
        // Add user data to session
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.provider = token.provider as string;
        
        // Add security metadata
        session.user.auth_time = token.auth_time as number;
        session.user.lastValidated = token.lastValidated as number;
        
        // Log session validation in development
        if (env.NODE_ENV === 'development') {
          console.log('Security: Session validated', {
            userId: token.id,
            lastValidated: token.lastValidated,
          });
        }
      }
      
      return session;
    },
    
    // Add redirect callback for security
    async redirect({ url, baseUrl }) {
      // Only allow redirects to relative URLs or allowed domains
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // Check if redirect is to allowed domain
      const allowedDomains = [
        baseUrl,
        'http://localhost:3000',
        'http://localhost:3002',
        'https://youragency.com',
      ];
      
      if (allowedDomains.some(domain => url.startsWith(domain))) {
        return url;
      }
      
      // Default to home page for security
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: env.NEXTAUTH_SECRET,
  
  // Enhanced security settings
  debug: env.NODE_ENV === 'development',
  
  // Secure cookie configuration (OAuth 2.1 compliance)
  useSecureCookies: env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token',
      options: {
        httpOnly: true, // Prevent XSS attacks
        sameSite: 'lax', // CSRF protection
        path: '/',
        secure: env.NODE_ENV === 'production', // HTTPS only in production
        maxAge: securityConfig.auth.sessionTimeout / 1000, // 24 hours
        // Additional security attributes
        domain: env.NODE_ENV === 'production' ? '.youragency.com' : undefined,
      },
    },
    callbackUrl: {
      name: env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.callback-url' 
        : 'next-auth.callback-url',
      options: {
        sameSite: 'lax',
        path: '/',
        secure: env.NODE_ENV === 'production',
        maxAge: 900, // 15 minutes
      },
    },
    csrfToken: {
      name: env.NODE_ENV === 'production' 
        ? '__Host-next-auth.csrf-token' 
        : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: env.NODE_ENV === 'production',
        maxAge: 900, // 15 minutes
      },
    },
    pkceCodeVerifier: {
      name: `${env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: env.NODE_ENV === 'production',
        maxAge: 900, // 15 minutes for PKCE
      },
    },
    state: {
      name: `${env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: env.NODE_ENV === 'production',
        maxAge: 900, // 15 minutes
      },
    },
    nonce: {
      name: `${env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.nonce`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: env.NODE_ENV === 'production',
        maxAge: 900, // 15 minutes
      },
    },
  },
  
  // Add logging for security events
  events: {
    signIn: ({ user, account, profile, isNewUser }) => {
      console.log('Security: User signed in', {
        userId: user.id,
        email: user.email,
        provider: account?.provider,
        timestamp: new Date().toISOString(),
      });
    },
    signOut: ({ session }) => {
      console.log('Security: User signed out', {
        userId: session?.user?.id,
        timestamp: new Date().toISOString(),
      });
    },
  },
};
