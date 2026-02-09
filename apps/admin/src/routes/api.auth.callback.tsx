import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuthListener } from '@test-cicd/app';
import { useEffect } from 'react';

export const Route = createFileRoute('/api/auth/callback')({
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  useAuthListener();

  useEffect(() => {
    // Give Supabase time to detect the session from URL hash
    const timer = setTimeout(() => {
      navigate({ to: '/', replace: true });
    }, 500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
