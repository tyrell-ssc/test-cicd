import { useEffect, useState, useRef } from 'react';
import { Redirect } from 'expo-router';
import * as Linking from 'expo-linking';
import { AuthCallbackScreen, authService } from '@test-cicd/app';
import { useSession } from '@test-cicd/app';
import { useQueryClient } from '@tanstack/react-query';

export default function AuthCallback() {
  const queryClient = useQueryClient();
  const { data: session, isLoading } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);
  const processedRef = useRef(false);
  const url = Linking.useLinkingURL();

  useEffect(() => {
    const handleDeepLink = async (url: string | null) => {
      if (processedRef.current) return;
      processedRef.current = true;

      try {
        if (!url) {
          console.log('[AuthCallback] No URL received');
          setError('No authentication link found');
          setProcessing(false);
          return;
        }

        console.log('[AuthCallback] Processing URL:', url);
        // Parse tokens from URL hash (format:#access_token=xxx & refresh_token=yyy
        const hashMatch = url.match(/#(.+)$/);
        if (!hashMatch) {
          console.error('[AuthCallback] No hash fragment in URL');
          setError('Invalid authentication link');
          setProcessing(false);
          return;
        }

        const params = new URLSearchParams(hashMatch[1]);

        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (!accessToken || !refreshToken) {
          console.error('[AuthCallback] Missing token in URL');
          setError('Invalid authentication link');
          setProcessing(false);
          return;
        }

        console.log('[AuthCallback]Tokens extracted, setting session...');

        authService.setSession(accessToken, refreshToken);

        // // Invalidate session query to trigger fresh fetch
        await queryClient.invalidateQueries({ queryKey: ['session'] });

        console.log('[AuthCallback] Session set successfully');

        // // Wait for Supabase to detect session from URL
        // // Similar to web pattern - give Supabase time to parse tokens
        // await new Promise(resolve => setTimeout(resolve, 500));

        // // Invalidate session query to trigger fresh fetch
        // await queryClient.invalidateQueries({ queryKey: ['session'] });

        // // Wait for session to load
        // await new Promise(resolve => setTimeout(resolve, 1500));

        setProcessing(false);
      } catch (err) {
        console.error('[AuthCallback] Error:', err);
        setError('Authentication failed');
        setProcessing(false);
      }
    };

    // Handle both cold starts and warm starts
    Linking.getInitialURL().then(() => {
      handleDeepLink(url);
    });

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => {
      subscription.remove();
    };
  }, [queryClient, url]);

  if (processing || isLoading) {
    return <AuthCallbackScreen />;
  }

  if (error) {
    return <AuthCallbackScreen error={error} />;
  }

  if (session) {
    return <Redirect href="/(authenticated)/(tabs)" />;
  }

  return <Redirect href="/(public)" />;
}
