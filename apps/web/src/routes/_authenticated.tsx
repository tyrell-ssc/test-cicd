import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';
import { useSession } from '@test-cicd/app';

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { data: session, isLoading } = useSession();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/sign-in" />;
  }

  return <Outlet />;
}
