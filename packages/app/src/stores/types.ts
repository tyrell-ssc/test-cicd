import type { User, Session } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (isLoading: boolean) => void;
  signOut: () => void;
}

export interface UIState {
  theme: 'light' | 'dark';
  isDrawerOpen: boolean;
  toggleTheme: () => void;
  toggleDrawer: () => void;
  setDrawerOpen: (isOpen: boolean) => void;
}

export interface AppState {
  isOnline: boolean;
  lastSyncedAt: Date | null;
  setOnline: (isOnline: boolean) => void;
  setLastSyncedAt: (date: Date) => void;
}
