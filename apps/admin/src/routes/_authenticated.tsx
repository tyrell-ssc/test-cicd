import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';
import { useAdminSession } from '@test-cicd/app';

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { session, isAdmin, isLoading } = useAdminSession();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    // User is authenticated but not an admin
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Unauthorized Access</h1>
          <p className="mb-4 text-gray-600">
            You do not have permission to access the admin panel.
          </p>
          <p className="text-sm text-gray-500">
            Contact your administrator if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
