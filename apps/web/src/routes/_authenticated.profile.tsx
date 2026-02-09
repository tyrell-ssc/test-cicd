import { createFileRoute } from '@tanstack/react-router';
import { ProfileScreen } from '@test-cicd/app';

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfileScreen,
});
