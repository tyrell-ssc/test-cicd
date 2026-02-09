import { createFileRoute } from '@tanstack/react-router';
import { SignInScreen } from '@test-cicd/app';

export const Route = createFileRoute('/_public/sign-in')({
  component: SignInScreen,
});
