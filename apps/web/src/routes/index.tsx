import { createFileRoute, Navigate } from '@tanstack/react-router';
import { useSession } from '@test-cicd/app';

export const Route = createFileRoute('/')({
  component: IndexComponent,
});

function IndexComponent() {
  const { data: session, isLoading } = useSession();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (session) {
    return <Navigate to="/dashboard" />;
  }

  return <Navigate to="/sign-in" />;
}
