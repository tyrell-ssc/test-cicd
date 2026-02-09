import { useQuery } from '@tanstack/react-query';
import { useSession } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface AdminUser {
  id: string;
  userId: string;
  role: 'admin' | 'super_admin';
  permissions: Record<string, boolean> | null;
  lastLoginAt: string | null;
}

/**
 * Hook to check if current user has admin access
 * Checks both authentication AND admin_users table
 */
export function useAdminSession() {
  const { data: session, isLoading: sessionLoading } = useSession();

  const adminQuery = useQuery({
    queryKey: ['admin-access', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error || !data) return null;

      // Update last login timestamp
      await supabase
        .from('admin_users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('user_id', session.user.id);

      return data as AdminUser;
    },
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    session,
    adminUser: adminQuery.data,
    isAdmin: !!adminQuery.data,
    isLoading: sessionLoading || adminQuery.isLoading,
    error: adminQuery.error,
  };
}

/**
 * Hook to check if user has specific permission
 */
export function useAdminPermission(permission: string): boolean {
  const { adminUser } = useAdminSession();

  if (!adminUser) return false;

  // Super admins have all permissions
  if (adminUser.role === 'super_admin') return true;

  // Check specific permission
  if (adminUser.permissions && typeof adminUser.permissions === 'object') {
    return adminUser.permissions[permission] === true;
  }

  return false;
}

/**
 * Hook to check if user is super admin
 */
export function useIsSuperAdmin(): boolean {
  const { adminUser } = useAdminSession();
  return adminUser?.role === 'super_admin' || false;
}
