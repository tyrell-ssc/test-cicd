import { createFileRoute } from '@tanstack/react-router';
import { DashboardScreen } from '@test-cicd/app';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardScreen,
});
