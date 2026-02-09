import { createFileRoute } from '@tanstack/react-router';
import { AdminDashboardScreen } from '@test-cicd/app';

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardPage,
});

function DashboardPage() {
  return <AdminDashboardScreen />;
}
