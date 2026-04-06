/**
 * Tenant Context Provider
 * 
 * Provides request-level tenant identification and context management
 * for multi-tenant data isolation in the marketing agency monorepo.
 * 
 * Features:
 * - AsyncLocalStorage for request-scoped tenant context
 * - Domain-based tenant identification
 * - JWT token tenant extraction
 * - Environment-aware tenant scoping
 * - Comprehensive validation and error handling
 */

import type { TenantContext, TenantContextProvider, TenantValidationResult } from '@agency/types/database';
import { AsyncLocalStorage } from 'node:async_hooks';

// Tenant context storage for request-scoped data
const tenantContextStorage = new AsyncLocalStorage<TenantContext | null>();

// Environment configuration
const TENANT_SCOPING_ENABLED = process.env.NODE_ENV === 'production' || 
                              process.env.REQUIRE_TENANT_SCOPING === 'true';

// Domain to tenant mapping (could be loaded from database or config)
const DOMAIN_TENANT_MAP: Record<string, string> = {
  'alpha-client.com': 'tenant-alpha',
  'beta-client.com': 'tenant-beta', 
  'gamma-client.com': 'tenant-gamma',
  'localhost:3000': 'tenant-dev', // Development
  'localhost:3001': 'tenant-alpha',
  'localhost:3002': 'tenant-beta',
  'localhost:3003': 'tenant-gamma',
};

/**
 * Implementation of TenantContextProvider for multi-tenant isolation
 */
export class DefaultTenantContextProvider implements TenantContextProvider {
  private tenantCache = new Map<string, TenantContext>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  /**
   * Get current tenant context from request
   */
  getCurrentTenant(): TenantContext | null {
    return tenantContextStorage.getStore() || null;
  }

  /**
   * Validate tenant access permissions
   */
  async validateTenantAccess(tenantId: string): Promise<TenantValidationResult> {
    try {
      // Check cache first
      const cached = this.tenantCache.get(tenantId);
      if (cached && (Date.now() - cached.updatedAt.getTime()) < this.cacheTimeout) {
        return {
          isValid: cached.isActive,
          tenantId: cached.id,
          error: cached.isActive ? undefined : 'Tenant is inactive'
        };
      }

      // In a real implementation, this would query the database
      // For now, we'll use a mock validation based on known tenants
      const knownTenants = ['tenant-alpha', 'tenant-beta', 'tenant-gamma', 'tenant-dev'];
      
      if (!knownTenants.includes(tenantId)) {
        return {
          isValid: false,
          error: 'Unknown tenant'
        };
      }

      // Mock tenant data - in production this would come from database
      const tenant: TenantContext = {
        id: tenantId,
        name: this.getTenantDisplayName(tenantId),
        domain: this.getTenantDomain(tenantId),
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      };

      // Cache the result
      this.tenantCache.set(tenantId, tenant);

      return {
        isValid: tenant.isActive,
        tenantId: tenant.id
      };
    } catch (error) {
      return {
        isValid: false,
        error: `Tenant validation failed: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Set tenant context for current request
   */
  setTenantContext(tenant: TenantContext): void {
    tenantContextStorage.enterWith(tenant);
  }

  /**
   * Clear tenant context
   */
  clearTenantContext(): void {
    tenantContextStorage.enterWith(null);
  }

  /**
   * Check if tenant scoping is required for this environment
   */
  requiresTenantScoping(): boolean {
    return TENANT_SCOPING_ENABLED;
  }

  /**
   * Extract tenant from HTTP request
   */
  async extractTenantFromRequest(request: {
    headers?: Record<string, string>;
    hostname?: string;
    url?: string;
  }): Promise<TenantContext | null> {
    try {
      // Method 1: Extract from JWT token (Authorization header)
      const tenantFromToken = await this.extractTenantFromToken(request.headers?.authorization);
      if (tenantFromToken) {
        return tenantFromToken;
      }

      // Method 2: Extract from domain/hostname
      const tenantFromDomain = await this.extractTenantFromDomain(request.hostname);
      if (tenantFromDomain) {
        return tenantFromDomain;
      }

      // Method 3: Extract from custom header
      const tenantFromHeader = await this.extractTenantFromHeader(request.headers?.['x-tenant-id']);
      if (tenantFromHeader) {
        return tenantFromHeader;
      }

      // Method 4: Development fallback
      if (!TENANT_SCOPING_ENABLED) {
        return this.createDevelopmentTenant();
      }

      return null;
    } catch (error) {
      console.error('Failed to extract tenant from request:', error);
      return null;
    }
  }

  /**
   * Run a function with tenant context
   */
  async withTenantContext<T>(
    tenant: TenantContext | null,
    fn: () => Promise<T>
  ): Promise<T> {
    return tenantContextStorage.run(tenant, fn);
  }

  /**
   * Middleware for Express/Next.js to automatically set tenant context
   */
  createMiddleware() {
    return async (req: any, res: any, next: any) => {
      try {
        const tenant = await this.extractTenantFromRequest(req);
        
        if (tenant) {
          this.setTenantContext(tenant);
          // Add tenant to request object for easy access
          req.tenant = tenant;
          req.tenantId = tenant.id;
        } else if (TENANT_SCOPING_ENABLED) {
          // In production, require tenant context
          return res.status(400).json({
            error: 'Tenant context required',
            message: 'Unable to determine tenant for this request'
          });
        }

        next();
      } catch (error) {
        console.error('Tenant middleware error:', error);
        if (TENANT_SCOPING_ENABLED) {
          return res.status(500).json({
            error: 'Tenant context error',
            message: 'Failed to establish tenant context'
          });
        }
        next();
      }
    };
  }

  /**
   * Extract tenant from JWT token
   */
  private async extractTenantFromToken(authHeader?: string): Promise<TenantContext | null> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    try {
      const token = authHeader.substring(7);
      // In a real implementation, decode and verify JWT
      // For now, we'll mock token parsing
      const payload = this.parseMockJWT(token);
      
      if (payload.tenantId) {
        const validation = await this.validateTenantAccess(payload.tenantId);
        if (validation.isValid && validation.tenantId) {
          return {
            id: validation.tenantId,
            name: payload.tenantName || this.getTenantDisplayName(validation.tenantId),
            isActive: true,
            createdAt: new Date(payload.iat * 1000),
            updatedAt: new Date()
          };
        }
      }
    } catch (error) {
      // Invalid token, continue to other methods
    }

    return null;
  }

  /**
   * Extract tenant from domain/hostname
   */
  private async extractTenantFromDomain(hostname?: string): Promise<TenantContext | null> {
    if (!hostname) {
      return null;
    }

    // Remove port if present
    const domain = hostname.split(':')[0];
    const tenantId = DOMAIN_TENANT_MAP[domain];

    if (!tenantId) {
      return null;
    }

    const validation = await this.validateTenantAccess(tenantId);
    if (validation.isValid && validation.tenantId) {
      return {
        id: validation.tenantId,
        domain: domain,
        name: this.getTenantDisplayName(validation.tenantId),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    return null;
  }

  /**
   * Extract tenant from custom header
   */
  private async extractTenantFromHeader(tenantHeader?: string): Promise<TenantContext | null> {
    if (!tenantHeader) {
      return null;
    }

    const validation = await this.validateTenantAccess(tenantHeader);
    if (validation.isValid && validation.tenantId) {
      return {
        id: validation.tenantId,
        name: this.getTenantDisplayName(validation.tenantId),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    return null;
  }

  /**
   * Create development tenant for non-production environments
   */
  private createDevelopmentTenant(): TenantContext {
    return {
      id: 'tenant-dev',
      name: 'Development Tenant',
      domain: 'localhost',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Get display name for tenant
   */
  private getTenantDisplayName(tenantId: string): string {
    const nameMap: Record<string, string> = {
      'tenant-alpha': 'Client Alpha',
      'tenant-beta': 'Client Beta', 
      'tenant-gamma': 'Client Gamma',
      'tenant-dev': 'Development'
    };
    return nameMap[tenantId] || tenantId;
  }

  /**
   * Get domain for tenant
   */
  private getTenantDomain(tenantId: string): string | undefined {
    for (const [domain, id] of Object.entries(DOMAIN_TENANT_MAP)) {
      if (id === tenantId) {
        return domain;
      }
    }
    return undefined;
  }

  /**
   * Mock JWT parsing for development
   * In production, use a proper JWT library
   */
  private parseMockJWT(token: string): any {
    try {
      // This is a mock implementation - use proper JWT verification in production
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
        return payload;
      }
    } catch (error) {
      // Invalid JWT format
    }
    return {};
  }

  /**
   * Clear tenant cache (useful for testing or cache invalidation)
   */
  clearCache(): void {
    this.tenantCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.tenantCache.size,
      keys: Array.from(this.tenantCache.keys())
    };
  }
}

// Export singleton instance
export const tenantContextProvider = new DefaultTenantContextProvider();

// Export convenience functions
export const getCurrentTenant = () => tenantContextProvider.getCurrentTenant();
export const setTenantContext = (tenant: TenantContext) => tenantContextProvider.setTenantContext(tenant);
export const clearTenantContext = () => tenantContextProvider.clearTenantContext();
export const withTenantContext = <T>(tenant: TenantContext | null, fn: () => Promise<T>) => 
  tenantContextProvider.withTenantContext(tenant, fn);
