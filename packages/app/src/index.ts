// Config
export { config } from './config';

// Lib
export { supabase, getSupabaseClient } from './lib/supabase';

// Services
export { authService } from './services/auth.service';
export { analyticsService } from './services/analytics.service';
export { errorTrackingService } from './services/error-tracking.service';
export { monetizationService } from './services/monetization.service';

// Hooks
export * from './hooks/useAuth';

// Screens
export { SignInScreen, AuthCallbackScreen } from './screens/auth';
export { DashboardScreen } from './screens/dashboard';
export { ProfileScreen } from './screens/profile';

// Stores
export { useAuthStore } from './stores/useAuthStore';
export { useAppStore } from './stores/useAppStore';
export { createUIStore } from './stores/useUIStore';
export type { AuthState, UIState, AppState } from './stores/types';

// Providers
export { EnvironmentProvider, useEnvironment } from './providers/EnvironmentProvider';

// Admin
export * from './admin';
