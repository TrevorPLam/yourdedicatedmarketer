/**
 * Tenant Isolation Unit Tests
 * 
 * Comprehensive test suite for multi-tenant data isolation
 * Tests tenant context provider, database adapter tenant scoping,
 * and SQL injection for tenant filtering
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DefaultTenantContextProvider } from '../src/tenant-context/provider';
import { SupabaseAdapter } from '../src/adapters/supabase';
import type { TenantContext, TenantValidationResult } from '@agency/types/database';

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn()
          })),
          single: vi.fn()
        })),
        single: vi.fn()
      })),
      insert: vi.fn(),
      rpc: vi.fn()
    })),
    removeAllChannels: vi.fn(),
    rpc: vi.fn()
  }))
}));

describe('Tenant Context Provider', () => {
  let provider: DefaultTenantContextProvider;

  beforeEach(() => {
    provider = new DefaultTenantContextProvider();
    provider.clearCache();
  });

  afterEach(() => {
    provider.clearCache();
  });

  describe('Tenant Validation', () => {
    it('should validate known tenants', async () => {
      const result = await provider.validateTenantAccess('tenant-alpha');
      
      expect(result.isValid).toBe(true);
      expect(result.tenantId).toBe('tenant-alpha');
      expect(result.error).toBeUndefined();
    });

    it('should reject unknown tenants', async () => {
      const result = await provider.validateTenantAccess('unknown-tenant');
      
      expect(result.isValid).toBe(false);
      expect(result.tenantId).toBeUndefined();
      expect(result.error).toBe('Unknown tenant');
    });

    it('should cache validation results', async () => {
      const spy = vi.spyOn(provider as any, 'getTenantDisplayName');
      
      // First call
      await provider.validateTenantAccess('tenant-alpha');
      expect(spy).toHaveBeenCalledTimes(1);
      
      // Second call should use cache
      await provider.validateTenantAccess('tenant-alpha');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tenant Context Management', () => {
    it('should set and get tenant context', () => {
      const tenant: TenantContext = {
        id: 'tenant-test',
        name: 'Test Tenant',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      provider.setTenantContext(tenant);
      const current = provider.getCurrentTenant();
      
      expect(current).toEqual(tenant);
    });

    it('should clear tenant context', () => {
      const tenant: TenantContext = {
        id: 'tenant-test',
        name: 'Test Tenant',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      provider.setTenantContext(tenant);
      expect(provider.getCurrentTenant()).toEqual(tenant);
      
      provider.clearTenantContext();
      expect(provider.getCurrentTenant()).toBeNull();
    });

    it('should run functions with tenant context', async () => {
      const tenant: TenantContext = {
        id: 'tenant-test',
        name: 'Test Tenant',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await provider.withTenantContext(tenant, async () => {
        return provider.getCurrentTenant()?.id;
      });

      expect(result).toBe('tenant-test');
      expect(provider.getCurrentTenant()).toBeNull(); // Context should be cleared after
    });
  });

  describe('Request-based Tenant Extraction', () => {
    it('should extract tenant from domain', async () => {
      const request = {
        hostname: 'alpha-client.com'
      };

      const tenant = await provider.extractTenantFromRequest(request);
      
      expect(tenant).not.toBeNull();
      expect(tenant?.id).toBe('tenant-alpha');
      expect(tenant?.domain).toBe('alpha-client.com');
    });

    it('should extract tenant from custom header', async () => {
      const request = {
        headers: {
          'x-tenant-id': 'tenant-beta'
        }
      };

      const tenant = await provider.extractTenantFromRequest(request);
      
      expect(tenant).not.toBeNull();
      expect(tenant?.id).toBe('tenant-beta');
    });

    it('should extract tenant from JWT token', async () => {
      // Mock JWT payload
      const mockPayload = {
        tenantId: 'tenant-gamma',
        tenantName: 'Client Gamma',
        iat: Math.floor(Date.now() / 1000)
      };
      
      const mockToken = `header.${Buffer.from(JSON.stringify(mockPayload)).toString('base64url')}.signature`;
      
      const request = {
        headers: {
          'authorization': `Bearer ${mockToken}`
        }
      };

      const tenant = await provider.extractTenantFromRequest(request);
      
      expect(tenant).not.toBeNull();
      expect(tenant?.id).toBe('tenant-gamma');
      expect(tenant?.name).toBe('Client Gamma');
    });

    it('should return development tenant in non-production', async () => {
      // Mock non-production environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const request = {
        hostname: 'unknown-domain.com'
      };

      const tenant = await provider.extractTenantFromRequest(request);
      
      expect(tenant).not.toBeNull();
      expect(tenant?.id).toBe('tenant-dev');
      expect(tenant?.name).toBe('Development Tenant');
      
      // Restore environment
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Environment Scoping', () => {
    it('should require tenant scoping in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      expect(provider.requiresTenantScoping()).toBe(true);
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should not require tenant scoping in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      expect(provider.requiresTenantScoping()).toBe(false);
      
      process.env.NODE_ENV = originalEnv;
    });
  });
});

describe('Supabase Adapter Tenant Scoping', () => {
  let adapter: SupabaseAdapter;
  let mockClient: any;

  beforeEach(() => {
    const config = {
      provider: 'supabase' as const,
      url: 'https://test.supabase.co',
      serviceRoleKey: 'test-key'
    };
    
    adapter = new SupabaseAdapter(config);
    
    // Mock client methods
    mockClient = {
      from: vi.fn(),
      rpc: vi.fn(),
      removeAllChannels: vi.fn()
    };
    
    // @ts-ignore - accessing private property for testing
    adapter.client = mockClient;
  });

  describe('Query Tenant Scoping', () => {
    it('should require tenant ID in production', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      await expect(adapter.query('SELECT * FROM users')).rejects.toThrow(
        'Tenant ID is required for database operations in production'
      );
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should inject tenant filtering for SELECT queries', async () => {
      const mockRpc = vi.fn().mockResolvedValue({
        data: [{ id: 1, name: 'Test' }],
        error: null,
        count: 1
      });
      
      mockClient.rpc = mockRpc;
      
      await adapter.query('SELECT * FROM users', [], 'tenant-alpha');
      
      expect(mockRpc).toHaveBeenCalledWith('execute_sql', {
        sql: 'SELECT * FROM users WHERE tenant_id = \'tenant-alpha\'',
        params: [],
        tenant_id: 'tenant-alpha'
      });
    });

    it('should inject tenant filtering for SELECT queries with existing WHERE', async () => {
      const mockRpc = vi.fn().mockResolvedValue({
        data: [{ id: 1, name: 'Test' }],
        error: null,
        count: 1
      });
      
      mockClient.rpc = mockRpc;
      
      await adapter.query('SELECT * FROM users WHERE active = true', [], 'tenant-alpha');
      
      expect(mockRpc).toHaveBeenCalledWith('execute_sql', {
        sql: 'SELECT * FROM users WHERE tenant_id = \'tenant-alpha\' AND active = true',
        params: [],
        tenant_id: 'tenant-alpha'
      });
    });

    it('should inject tenant filtering for INSERT queries', async () => {
      const mockRpc = vi.fn().mockResolvedValue({
        data: [{ id: 1 }],
        error: null,
        count: 1
      });
      
      mockClient.rpc = mockRpc;
      
      await adapter.query('INSERT INTO users (name) VALUES (\'test\')', [], 'tenant-alpha');
      
      expect(mockRpc).toHaveBeenCalledWith('execute_sql', {
        sql: "INSERT INTO users (name, tenant_id) VALUES ('test', 'tenant-alpha')",
        params: [],
        tenant_id: 'tenant-alpha'
      });
    });

    it('should inject tenant filtering for UPDATE queries', async () => {
      const mockRpc = vi.fn().mockResolvedValue({
        data: [],
        error: null,
        count: 1
      });
      
      mockClient.rpc = mockRpc;
      
      await adapter.query('UPDATE users SET name = \'test\'', [], 'tenant-alpha');
      
      expect(mockRpc).toHaveBeenCalledWith('execute_sql', {
        sql: "UPDATE users SET name = 'test' WHERE tenant_id = 'tenant-alpha'",
        params: [],
        tenant_id: 'tenant-alpha'
      });
    });

    it('should inject tenant filtering for DELETE queries', async () => {
      const mockRpc = vi.fn().mockResolvedValue({
        data: [],
        error: null,
        count: 1
      });
      
      mockClient.rpc = mockRpc;
      
      await adapter.query('DELETE FROM users WHERE active = false', [], 'tenant-alpha');
      
      expect(mockRpc).toHaveBeenCalledWith('execute_sql', {
        sql: "DELETE FROM users WHERE tenant_id = 'tenant-alpha' AND active = false",
        params: [],
        tenant_id: 'tenant-alpha'
      });
    });

    it('should not modify queries that already have tenant filtering', async () => {
      const mockRpc = vi.fn().mockResolvedValue({
        data: [{ id: 1, name: 'Test' }],
        error: null,
        count: 1
      });
      
      mockClient.rpc = mockRpc;
      
      await adapter.query('SELECT * FROM users WHERE tenant_id = \'tenant-beta\'', [], 'tenant-alpha');
      
      expect(mockRpc).toHaveBeenCalledWith('execute_sql', {
        sql: 'SELECT * FROM users WHERE tenant_id = \'tenant-beta\'',
        params: [],
        tenant_id: 'tenant-alpha'
      });
    });
  });

  describe('Transaction Tenant Scoping', () => {
    it('should require tenant ID for transactions in production', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      await expect(adapter.transaction(async () => {})).rejects.toThrow(
        'Tenant ID is required for transactions in production'
      );
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should pass tenant context to transaction queries', async () => {
      const mockRpc = vi.fn().mockResolvedValue({
        data: [{ id: 1, name: 'Test' }],
        error: null,
        count: 1
      });
      
      mockClient.rpc = mockRpc;
      
      await adapter.transaction(async (tx) => {
        return await tx.query('SELECT * FROM users');
      }, 'tenant-alpha');
      
      expect(mockRpc).toHaveBeenCalledWith('execute_sql', {
        sql: 'SELECT * FROM users WHERE tenant_id = \'tenant-alpha\'',
        params: [],
        tenant_id: 'tenant-alpha'
      });
    });
  });

  describe('Tenant Validation', () => {
    it('should validate tenant access', async () => {
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: { id: 'tenant-alpha', is_active: true },
                error: null
              })
            }))
          }))
        }))
      }));
      
      mockClient.from = mockFrom;
      
      const result = await adapter.validateTenantAccess('tenant-alpha');
      
      expect(result.isValid).toBe(true);
      expect(result.tenantId).toBe('tenant-alpha');
      expect(result.error).toBeUndefined();
    });

    it('should handle validation errors', async () => {
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Tenant not found' }
              })
            }))
          }))
        }))
      }));
      
      mockClient.from = mockFrom;
      
      const result = await adapter.validateTenantAccess('unknown-tenant');
      
      expect(result.isValid).toBe(false);
      expect(result.tenantId).toBeUndefined();
      expect(result.error).toBe('Tenant not found');
    });
  });

  describe('Migration and Seeding', () => {
    it('should validate tenant for tenant-specific migrations', async () => {
      const mockValidate = vi.spyOn(adapter, 'validateTenantAccess').mockResolvedValue({
        isValid: true,
        tenantId: 'tenant-alpha'
      });
      
      const migrations = [
        { id: 'migration-1', name: 'Test Migration', up: 'CREATE TABLE test (id SERIAL)', version: '1.0.0' }
      ];
      
      await adapter.migrate(migrations, 'tenant-alpha');
      
      expect(mockValidate).toHaveBeenCalledWith('tenant-alpha');
      
      mockValidate.mockRestore();
    });

    it('should add tenant_id to seed data', async () => {
      const mockRpc = vi.fn().mockResolvedValue({
        data: [],
        error: null
      });
      
      mockClient.rpc = mockRpc;
      
      const seedData = [
        {
          table: 'users',
          data: [{ name: 'Test User' }, { name: 'Another User' }]
        }
      ];
      
      await adapter.seed(seedData, 'tenant-alpha');
      
      expect(mockClient.from).toHaveBeenCalledWith('users');
      expect(mockClient.from('').insert).toHaveBeenCalledWith([
        { name: 'Test User', tenant_id: 'tenant-alpha' },
        { name: 'Another User', tenant_id: 'tenant-alpha' }
      ]);
    });
  });
});

describe('Integration Tests', () => {
  it('should provide end-to-end tenant isolation', async () => {
    const provider = new DefaultTenantContextProvider();
    const config = {
      provider: 'supabase' as const,
      url: 'https://test.supabase.co',
      serviceRoleKey: 'test-key'
    };
    
    const adapter = new SupabaseAdapter(config);
    
    // Mock client
    const mockClient = {
      from: vi.fn(),
      rpc: vi.fn().mockResolvedValue({
        data: [{ id: 1, name: 'Test', tenant_id: 'tenant-alpha' }],
        error: null,
        count: 1
      }),
      removeAllChannels: vi.fn()
    };
    
    // @ts-ignore
    adapter.client = mockClient;
    
    // Set tenant context
    const tenant: TenantContext = {
      id: 'tenant-alpha',
      name: 'Client Alpha',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    provider.setTenantContext(tenant);
    
    // Execute query with tenant context
    const result = await adapter.query('SELECT * FROM users', [], tenant.id);
    
    expect(result.rows).toEqual([{ id: 1, name: 'Test', tenant_id: 'tenant-alpha' }]);
    expect(mockClient.rpc).toHaveBeenCalledWith('execute_sql', {
      sql: 'SELECT * FROM users WHERE tenant_id = \'tenant-alpha\'',
      params: [],
      tenant_id: 'tenant-alpha'
    });
    
    // Clear context
    provider.clearTenantContext();
    expect(provider.getCurrentTenant()).toBeNull();
  });
});
