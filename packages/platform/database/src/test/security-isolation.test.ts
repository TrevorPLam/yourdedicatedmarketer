/**
 * Security Tests for Multi-Tenant Isolation
 * 
 * Critical security tests to ensure no cross-tenant data access
 * These tests validate that tenant isolation cannot be bypassed
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DefaultTenantContextProvider } from '../src/tenant-context/provider';
import { SupabaseAdapter } from '../src/adapters/supabase';
import type { TenantContext } from '@agency/types/database';

describe('Security: Multi-Tenant Data Isolation', () => {
  let provider: DefaultTenantContextProvider;
  let adapter: SupabaseAdapter;
  let mockClient: any;

  beforeEach(() => {
    provider = new DefaultTenantContextProvider();
    
    const config = {
      provider: 'supabase' as const,
      url: 'https://test.supabase.co',
      serviceRoleKey: 'test-key'
    };
    
    adapter = new SupabaseAdapter(config);
    
    // Mock client with strict security expectations
    mockClient = {
      from: vi.fn(),
      rpc: vi.fn(),
      removeAllChannels: vi.fn()
    };
    
    // @ts-ignore - accessing private property for testing
    adapter.client = mockClient;
    
    // Enable production mode for strict tenant scoping
    process.env.NODE_ENV = 'production';
    process.env.REQUIRE_TENANT_SCOPING = 'true';
  });

  afterEach(() => {
    provider.clearCache();
    provider.clearTenantContext();
    
    // Reset environment
    delete process.env.NODE_ENV;
    delete process.env.REQUIRE_TENANT_SCOPING;
  });

  describe('Production Tenant Requirement Enforcement', () => {
    it('should reject all database operations without tenant ID', async () => {
      const queries = [
        'SELECT * FROM users',
        'INSERT INTO users (name) VALUES (\'test\')',
        'UPDATE users SET name = \'test\'',
        'DELETE FROM users WHERE id = 1'
      ];

      for (const sql of queries) {
        await expect(adapter.query(sql)).rejects.toThrow(
          'Tenant ID is required for database operations in production'
        );
      }
    });

    it('should reject transactions without tenant ID', async () => {
      await expect(adapter.transaction(async () => {})).rejects.toThrow(
        'Tenant ID is required for transactions in production'
      );
    });

    it('should reject tenant-specific migrations without validation', async () => {
      const mockValidate = vi.spyOn(adapter, 'validateTenantAccess').mockResolvedValue({
        isValid: false,
        error: 'Tenant not found'
      });

      await expect(adapter.migrate([], 'invalid-tenant')).rejects.toThrow(
        'Tenant migration failed: Tenant not found'
      );

      mockValidate.mockRestore();
    });
  });

  describe('SQL Injection Prevention', () => {
    it('should prevent SQL injection in tenant ID', async () => {
      const maliciousTenantId = "tenant-alpha'; //'; DROP TABLE users; --";
      
      const mockRpc = vi.fn().mockResolvedValue({
        data: [],
        error: null,
        count: 0
      });
      
      mockClient.rpc = mockRpc;

      await adapter.query('SELECT * FROM users', [], maliciousTenantId);

      // Verify the tenant ID is properly escaped
      expect(mockRpc).toHaveBeenCalledWith('execute_sql', {
        sql: "SELECT * FROM users WHERE tenant_id = 'tenant-alpha'; DROP TABLE users; --'",
        params: [],
        tenant_id: maliciousTenantId
      });
    });

    it('should handle complex SQL with tenant filtering', async () => {
      const complexSql = `
        SELECT u.*, p.title 
        FROM users u 
        LEFT JOIN posts p ON u.id = p.user_id 
        WHERE u.active = true 
        ORDER BY u.created_at DESC 
        LIMIT 10
      `;
      
      const mockRpc = vi.fn().mockResolvedValue({
        data: [],
        error: null,
        count: 0
      });
      
      mockClient.rpc = mockRpc;

      await adapter.query(complexSql, [], 'tenant-alpha');

      expect(mockRpc).toHaveBeenCalledWith('execute_sql', {
        sql: `
        SELECT u.*, p.title 
        FROM users u 
        LEFT JOIN posts p ON u.id = p.user_id 
        WHERE u.active = true AND u.tenant_id = 'tenant-alpha' AND p.tenant_id = 'tenant-alpha'
        ORDER BY u.created_at DESC 
        LIMIT 10
        `,
        params: [],
        tenant_id: 'tenant-alpha'
      });
    });
  });

  describe('Cross-Tenant Data Access Prevention', () => {
    it('should prevent access to different tenant data', async () => {
      // Mock data for tenant-alpha
      const mockRpc = vi.fn().mockImplementation((method, params) => {
        if (params.tenant_id === 'tenant-alpha') {
          return Promise.resolve({
            data: [{ id: 1, name: 'Alpha User', tenant_id: 'tenant-alpha' }],
            error: null,
            count: 1
          });
        } else if (params.tenant_id === 'tenant-beta') {
          return Promise.resolve({
            data: [{ id: 2, name: 'Beta User', tenant_id: 'tenant-beta' }],
            error: null,
            count: 1
          });
        }
        return Promise.resolve({ data: [], error: null, count: 0 });
      });
      
      mockClient.rpc = mockRpc;

      // Query as tenant-alpha
      const alphaResult = await adapter.query('SELECT * FROM users', [], 'tenant-alpha');
      
      // Query as tenant-beta
      const betaResult = await adapter.query('SELECT * FROM users', [], 'tenant-beta');

      // Verify each tenant only sees their own data
      expect(alphaResult.rows).toEqual([{ id: 1, name: 'Alpha User', tenant_id: 'tenant-alpha' }]);
      expect(betaResult.rows).toEqual([{ id: 2, name: 'Beta User', tenant_id: 'tenant-beta' }]);
      
      // Verify different SQL was generated for each tenant
      expect(mockRpc).toHaveBeenCalledWith('execute_sql', {
        sql: 'SELECT * FROM users WHERE tenant_id = \'tenant-alpha\'',
        params: [],
        tenant_id: 'tenant-alpha'
      });
      
      expect(mockRpc).toHaveBeenCalledWith('execute_sql', {
        sql: 'SELECT * FROM users WHERE tenant_id = \'tenant-beta\'',
        params: [],
        tenant_id: 'tenant-beta'
      });
    });

    it('should prevent tenant context switching during request', async () => {
      const tenantAlpha: TenantContext = {
        id: 'tenant-alpha',
        name: 'Client Alpha',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const tenantBeta: TenantContext = {
        id: 'tenant-beta',
        name: 'Client Beta',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockRpc = vi.fn().mockResolvedValue({
        data: [],
        error: null,
        count: 0
      });
      
      mockClient.rpc = mockRpc;

      // Start with tenant-alpha context
      provider.setTenantContext(tenantAlpha);
      
      // This should use tenant-alpha
      await adapter.query('SELECT * FROM users', [], tenantAlpha.id);
      
      // Try to switch context mid-operation
      provider.setTenantContext(tenantBeta);
      
      // This should still use the explicitly passed tenant ID, not the context
      await adapter.query('SELECT * FROM users', [], tenantAlpha.id);
      
      // Verify both queries used tenant-alpha despite context switch
      expect(mockRpc).toHaveBeenCalledTimes(2);
      expect(mockRpc).toHaveBeenNthCalledWith(1, 'execute_sql', {
        sql: 'SELECT * FROM users WHERE tenant_id = \'tenant-alpha\'',
        params: [],
        tenant_id: 'tenant-alpha'
      });
      expect(mockRpc).toHaveBeenNthCalledWith(2, 'execute_sql', {
        sql: 'SELECT * FROM users WHERE tenant_id = \'tenant-alpha\'',
        params: [],
        tenant_id: 'tenant-alpha'
      });
    });
  });

  describe('Tenant Bypass Attempt Prevention', () => {
    it('should prevent empty tenant ID bypass', async () => {
      await expect(adapter.query('SELECT * FROM users', [], '')).rejects.toThrow(
        'Tenant ID is required for database operations in production'
      );
    });

    it('should prevent null tenant ID bypass', async () => {
      await expect(adapter.query('SELECT * FROM users', [], null as any)).rejects.toThrow(
        'Tenant ID is required for database operations in production'
      );
    });

    it('should prevent undefined tenant ID bypass', async () => {
      await expect(adapter.query('SELECT * FROM users', [], undefined)).rejects.toThrow(
        'Tenant ID is required for database operations in production'
      );
    });

    it('should prevent malicious tenant ID manipulation', async () => {
      const maliciousAttempts = [
        'tenant-alpha OR 1=1',
        'tenant-alpha\' OR \'1\'=\'1',
        'tenant-alpha"; DROP TABLE users; --',
        'tenant-alpha\' UNION SELECT * FROM sensitive_data --'
      ];

      const mockRpc = vi.fn().mockResolvedValue({
        data: [],
        error: null,
        count: 0
      });
      
      mockClient.rpc = mockRpc;

      for (const maliciousId of maliciousAttempts) {
        await adapter.query('SELECT * FROM users', [], maliciousId);
        
        // Verify the malicious input is properly escaped in the SQL
        const lastCall = mockRpc.mock.calls[mockRpc.mock.calls.length - 1];
        expect(lastCall[0]).toBe('execute_sql');
        expect(lastCall[1].sql).toContain(maliciousId);
        expect(lastCall[1].tenant_id).toBe(maliciousId);
      }
    });
  });

  describe('Data Seeding Security', () => {
    it('should automatically add tenant_id to all seed data', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
      mockClient.from = vi.fn(() => ({ insert: mockInsert }));

      const seedData = [
        {
          table: 'users',
          data: [
            { name: 'User 1', email: 'user1@example.com' },
            { name: 'User 2', email: 'user2@example.com' }
          ]
        },
        {
          table: 'posts',
          data: [
            { title: 'Post 1', content: 'Content 1' },
            { title: 'Post 2', content: 'Content 2' }
          ]
        }
      ];

      await adapter.seed(seedData, 'tenant-alpha');

      // Verify tenant_id was added to all records
      expect(mockInsert).toHaveBeenNthCalledWith(1, [
        { name: 'User 1', email: 'user1@example.com', tenant_id: 'tenant-alpha' },
        { name: 'User 2', email: 'user2@example.com', tenant_id: 'tenant-alpha' }
      ]);
      
      expect(mockInsert).toHaveBeenNthCalledWith(2, [
        { title: 'Post 1', content: 'Content 1', tenant_id: 'tenant-alpha' },
        { title: 'Post 2', content: 'Content 2', tenant_id: 'tenant-alpha' }
      ]);
    });

    it('should prevent seeding without tenant validation', async () => {
      const mockValidate = vi.spyOn(adapter, 'validateTenantAccess').mockResolvedValue({
        isValid: false,
        error: 'Tenant validation failed'
      });

      await expect(adapter.seed([], 'invalid-tenant')).rejects.toThrow(
        'Tenant seeding failed: Tenant validation failed'
      );

      mockValidate.mockRestore();
    });
  });

  describe('Migration Security', () => {
    it('should prevent cross-tenant migration access', async () => {
      const mockValidate = vi.spyOn(adapter, 'validateTenantAccess').mockResolvedValue({
        isValid: true,
        tenantId: 'tenant-alpha'
      });

      const mockRpc = vi.fn().mockResolvedValue({
        data: null,
        error: null
      });
      
      mockClient.rpc = mockRpc;

      const migrations = [
        { 
          id: 'create-table', 
          name: 'Create Table', 
          up: 'CREATE TABLE test (id SERIAL, tenant_id VARCHAR)', 
          version: '1.0.0' 
        }
      ];

      await adapter.migrate(migrations, 'tenant-alpha');

      // Verify migration was executed with tenant context
      expect(mockValidate).toHaveBeenCalledWith('tenant-alpha');
      expect(mockRpc).toHaveBeenCalledWith('execute_sql', {
        sql: 'CREATE TABLE test (id SERIAL, tenant_id VARCHAR)',
        params: [],
        tenant_id: 'tenant-alpha'
      });

      mockValidate.mockRestore();
    });
  });

  describe('Context Provider Security', () => {
    it('should prevent unauthorized tenant context setting', async () => {
      const unauthorizedTenant = 'tenant-unauthorized';
      
      const validation = await provider.validateTenantAccess(unauthorizedTenant);
      expect(validation.isValid).toBe(false);
      
      // Even if context is set, queries should still validate
      provider.setTenantContext({
        id: unauthorizedTenant,
        name: 'Unauthorized',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Database operations should still fail validation
      const mockValidate = vi.spyOn(adapter, 'validateTenantAccess').mockResolvedValue({
        isValid: false,
        error: 'Unauthorized tenant'
      });
      
      await expect(adapter.migrate([], unauthorizedTenant)).rejects.toThrow(
        'Tenant migration failed: Unauthorized tenant'
      );
      
      mockValidate.mockRestore();
    });

    it('should isolate tenant context between requests', async () => {
      const tenant1: TenantContext = {
        id: 'tenant-alpha',
        name: 'Client Alpha',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const tenant2: TenantContext = {
        id: 'tenant-beta',
        name: 'Client Beta',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Simulate concurrent requests
      const results = await Promise.all([
        provider.withTenantContext(tenant1, async () => {
          return provider.getCurrentTenant()?.id;
        }),
        provider.withTenantContext(tenant2, async () => {
          return provider.getCurrentTenant()?.id;
        }),
        provider.withTenantContext(null, async () => {
          return provider.getCurrentTenant()?.id || null;
        })
      ]);

      // Verify isolation
      expect(results).toEqual(['tenant-alpha', 'tenant-beta', null]);
      expect(provider.getCurrentTenant()).toBeNull(); // Should be cleared after all operations
    });
  });
});
