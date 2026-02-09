import { createFileRoute, Navigate } from '@tanstack/react-router';
import { AuthCallbackScreen } from '@test-cicd/app';
import { useSession } from '@test-cicd/app';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/api/auth/callback')({
  component: AuthCallback,
});

function AuthCallback() {
  const queryClient = useQueryClient();
  const { data: session, isLoading } = useSession();
  const [waitForSession, setWaitForSession] = useState(true);

  // Give Supabase time to detect session from URL hash
  useEffect(() => {
    const detectSession = async () => {
      // NOTE: Supabase client has detectSessionInUrl: true (default), so it automatically
      // parses the #access_token from the URL and updates the session in the background.
      // We just need to wait a moment for that to happen, then invalidate the query
      // so useSession() refetches and updates the Zustand store.

      // Wait for Supabase to detect session from URL
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Force fresh fetch of session - triggers useSession() hook
      // The hook will call authService.getSession() and update the Zustand store
      await queryClient.invalidateQueries({ queryKey: ['session'] });

      // Allow UI to update
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setWaitForSession(false);
    };

    detectSession();
  }, [queryClient]);

  // Still loading or waiting for session detection
  if (isLoading || waitForSession) {
    return <AuthCallbackScreen />;
  }

  // Success! Redirect to dashboard
  if (session) {
    return <Navigate to="/dashboard" />;
  }

  // Failed - redirect to sign-in with error
  return <Navigate to="/sign-in" search={{ error: 'auth-failed' }} />;
}
