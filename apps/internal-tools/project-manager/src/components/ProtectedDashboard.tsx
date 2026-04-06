/**
 * Example Protected Dashboard Component
 * 
 * Demonstrates defense-in-depth authentication using the DAL
 * to prevent CVE-2025-29927 middleware bypass attacks.
 * 
 * Version: 2.0.0
 * Updated: April 2026
 */

import { requireAuth, withAuth, logDataAccess } from '@/lib/auth-helpers';
import { requireAdmin } from '@/lib/dal';
import { redirect } from 'next/navigation';

// Protected Server Component with defense-in-depth authentication
export default async function ProtectedDashboard() {
  // Server-side authentication verification (defense-in-depth)
  const auth = await requireAuth();
  
  // Log data access for security monitoring
  await logDataAccess('view', 'dashboard', auth.user.id);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Protected Dashboard
      </h1>
      
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">User Information</h2>
        <p><strong>Email:</strong> {auth.user.email}</p>
        <p><strong>Role:</strong> {auth.user.role}</p>
        <p><strong>User ID:</strong> {auth.user.id}</p>
        <p><strong>Session Expires:</strong> {auth.session.expires.toLocaleString()}</p>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <h3 className="font-semibold mb-2">Security Features Active:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>✅ Server-side session verification</li>
          <li>✅ Defense-in-depth authentication</li>
          <li>✅ OAuth 2.1 PKCE compliance</li>
          <li>✅ Secure httpOnly cookies</li>
          <li>✅ Rate limiting and account lockout</li>
          <li>✅ Security event logging</li>
        </ul>
      </div>

      <AdminOnlySection />
    </div>
  );
}

// Admin-only section with role-based access control
async function AdminOnlySection() {
  try {
    // Server-side role verification
    const auth = await requireAdmin();
    
    await logDataAccess('view', 'admin-section', auth.user.id);

    return (
      <div className="bg-red-50 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2 text-red-800">
          Admin Only Section
        </h2>
        <p className="text-red-700">
          This content is only visible to administrators with server-side role verification.
        </p>
        
        <div className="mt-4 space-y-2">
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Admin Action 1
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-2">
            Admin Action 2
          </button>
        </div>
      </div>
    );
  } catch (error) {
    // User is not admin - don't show admin section
    return null;
  }
}

// Example of using withAuth wrapper for data operations
export async function SensitiveDataComponent() {
  return await withAuth(async () => {
    // This code only runs if user is authenticated
    // and the authentication is verified server-side
    
    const sensitiveData = await fetchSensitiveData();
    
    return (
      <div className="bg-yellow-50 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Sensitive Data</h3>
        <pre className="text-sm bg-gray-100 p-2 rounded">
          {JSON.stringify(sensitiveData, null, 2)}
        </pre>
      </div>
    );
  }, {
    resource: 'sensitive-data',
    action: 'view',
  });
}

// Mock function to simulate fetching sensitive data
async function fetchSensitiveData() {
  // In a real application, this would fetch from a database
  return {
    userId: 'current-user',
    data: 'This is sensitive data protected by server-side authentication',
    timestamp: new Date().toISOString(),
  };
}
