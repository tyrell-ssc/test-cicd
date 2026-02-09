import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/useAuthStore';
import { authService } from '../services/auth.service';
import { useEffect } from 'react';

export const useSession = () => {
  const setSession = useAuthStore((state) => state.setSession);
  const setLoading = useAuthStore((state) => state.setLoading);

  const query = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const session = await authService.getSession();
      setSession(session);
      return session;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    setLoading(query.isLoading);
  }, [query.isLoading, setLoading]);

  return query;
};

export const useUser = () => {
  const { data: session } = useSession();
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const user = await authService.getUser();
      setUser(user);
      return user;
    },
    enabled: !!session,
  });
};

export const useSignOut = () => {
  const queryClient = useQueryClient();
  const signOut = useAuthStore((state) => state.signOut);

  return useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      signOut();
      queryClient.clear();
    },
  });
};

export const useAuthListener = () => {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    const { data: subscription } = authService.onAuthStateChange((session) => {
      setSession(session);
      // Invalidate React Query cache to trigger immediate re-render
      queryClient.invalidateQueries({ queryKey: ['session'] });
    });

    return () => {
      subscription?.subscription?.unsubscribe();
    };
  }, [setSession, queryClient]);
};
