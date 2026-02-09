// Centralized configuration for environment variables
// Works across web and mobile platforms
const safeGetEnv = (key: string): string => {
  // Check process.env first (Expo/Metro/Node)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key]!;
  }

  // Check import.meta.env (Vite)
  // We use a try-catch because just referencing 'import.meta'
  // can cause a SyntaxError in some React Native environments.
  try {
    const viteEnv = (import.meta as { env?: Record<string, string> }).env;
    if (viteEnv && viteEnv[key]) {
      return viteEnv[key];
    }
  } catch {
    // import.meta is not supported in this environment
  }

  return '';
};

export const config = {
  supabase: {
    url: safeGetEnv('EXPO_PUBLIC_SUPABASE_URL') || safeGetEnv('VITE_SUPABASE_URL'),
    publishableKey:
      safeGetEnv('EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY') ||
      safeGetEnv('VITE_SUPABASE_PUBLISHABLE_KEY'),
  },
  app: {
    env: safeGetEnv('EXPO_PUBLIC_APP_ENV') || safeGetEnv('VITE_APP_ENV') || 'development',
    scheme: safeGetEnv('EXPO_PUBLIC_APP_SCHEME') || 'test-cicd',
    siteUrl:
      safeGetEnv('EXPO_PUBLIC_SITE_URL') || safeGetEnv('VITE_SITE_URL') || 'http://127.0.0.1:3000',
    adminUrl:
      safeGetEnv('EXPO_PUBLIC_ADMIN_URL') ||
      safeGetEnv('VITE_ADMIN_URL') ||
      'http://127.0.0.1:3001',
  },
  analytics: {
    posthog: {
      key: safeGetEnv('EXPO_PUBLIC_POSTHOG_KEY') || safeGetEnv('VITE_POSTHOG_KEY'),
      host:
        safeGetEnv('EXPO_PUBLIC_POSTHOG_HOST') ||
        safeGetEnv('VITE_POSTHOG_HOST') ||
        'https://app.posthog.com',
    },
  },
  errorTracking: {
    sentry: {
      dsn: safeGetEnv('EXPO_PUBLIC_SENTRY_DSN') || safeGetEnv('VITE_SENTRY_DSN'),
      org: safeGetEnv('EXPO_PUBLIC_SENTRY_ORG') || safeGetEnv('VITE_SENTRY_ORG'),
      project: safeGetEnv('EXPO_PUBLIC_SENTRY_PROJECT') || safeGetEnv('VITE_SENTRY_PROJECT'),
      environment: safeGetEnv('EXPO_PUBLIC_APP_ENV') || safeGetEnv('VITE_APP_ENV') || 'development',
    },
  },
  monetization: {
    revenueCat: {
      apiKey: safeGetEnv('EXPO_PUBLIC_REVENUECAT_API_KEY') || safeGetEnv('VITE_REVENUECAT_API_KEY'),
      appleKey: safeGetEnv('EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY'),
      googleKey: safeGetEnv('EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY'),
    },
  },
} as const;

// Type-safe config access
export type Config = typeof config;

// Helper to check if we're in production
export const isProduction = config.app.env === 'production';

// Helper to check if we're in staging
export const isStaging = config.app.env === 'staging';

// Helper to check if we're in development
export const isDevelopment = config.app.env === 'development' || config.app.env === 'local';
