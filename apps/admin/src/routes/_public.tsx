import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';
import { useAdminSession } from '@test-cicd/app';

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
});

function PublicLayout() {
  const { isAdmin, isLoading } = useAdminSession();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (isAdmin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
