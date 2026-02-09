import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AdminLoginScreen } from '@test-cicd/app';

export const Route = createFileRoute('/_public/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate({ to: '/' });
  };

  return <AdminLoginScreen onSuccess={handleSuccess} />;
}
