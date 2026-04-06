import { verifySession, requireRole as requireRoleDAL, requireAdmin, requireUser } from './dal';
import { redirect } from 'next/navigation';

// Server-side authentication verification (defense-in-depth)
export async function auth() {
  return await verifySession();
}

// Require authentication with server-side verification
export async function requireAuth() {
  const session = await verifySession();

  if (!session) {
    redirect('/login');
  }

  return session;
}

// Require specific role with server-side verification
export async function requireRole(role: string) {
  try {
    return await requireRoleDAL(role);
  } catch (error) {
    redirect('/unauthorized');
  }
}

// Require admin role with server-side verification
export async function requireAdminRole() {
  try {
    return await requireAdmin();
  } catch (error) {
    redirect('/unauthorized');
  }
}

// Require any authenticated user
export async function requireUser() {
  try {
    return await requireUser();
  } catch (error) {
    redirect('/login');
  }
}

// Export DAL functions for direct use in components
export { withAuth, logDataAccess } from './dal';
