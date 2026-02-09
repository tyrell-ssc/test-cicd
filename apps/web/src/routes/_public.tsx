import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';
import { useSession } from '@test-cicd/app';

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
});

function PublicLayout() {
  const { data: session, isLoading } = useSession();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (session) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
}
