import { config } from '../config';

interface SentryClient {
  withScope: (callback: (scope: SentryScope) => void) => void;
  captureException: (error: Error) => void;
  captureMessage: (message: string, level?: string) => void;
  setUser: (user: { id: string; email?: string } | null) => void;
}

interface SentryScope {
  setExtra: (key: string, value: unknown) => void;
}

class ErrorTrackingService {
  private isInitialized = false;
  private Sentry: SentryClient | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    const { dsn, environment } = config.errorTracking.sentry;

    if (!dsn) {
      console.warn('Sentry DSN not configured');
      return;
    }

    try {
      // Dynamic import based on platform
      if (typeof window !== 'undefined') {
        // Web
        const Sentry = await import('@sentry/react');
        Sentry.init({
          dsn,
          environment,
          tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
        });
        this.Sentry = Sentry as SentryClient;
      }
      // Note: Mobile (React Native) error tracking with @sentry/react-native
      // is not supported in web builds to avoid import resolution issues

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize error tracking:', error);
    }
  }

  captureException(error: Error, context?: Record<string, unknown>): void {
    if (!this.isInitialized || !this.Sentry) {
      console.error('Error:', error, context);
      return;
    }

    try {
      if (context) {
        this.Sentry.withScope((scope: unknown) => {
          Object.keys(context).forEach((key) => {
            scope.setExtra(key, context[key]);
          });
          this.Sentry.captureException(error);
        });
      } else {
        this.Sentry.captureException(error);
      }
    } catch (err) {
      console.error('Failed to capture exception:', err);
    }
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    if (!this.isInitialized || !this.Sentry) {
      console.log(`[${level}] ${message}`);
      return;
    }

    try {
      this.Sentry.captureMessage(message, level);
    } catch (error) {
      console.error('Failed to capture message:', error);
    }
  }

  setUser(userId: string, email?: string, username?: string): void {
    if (!this.isInitialized || !this.Sentry) return;

    try {
      this.Sentry.setUser({
        id: userId,
        email,
        username,
      });
    } catch (error) {
      console.error('Failed to set user:', error);
    }
  }

  clearUser(): void {
    if (!this.isInitialized || !this.Sentry) return;

    try {
      this.Sentry.setUser(null);
    } catch (error) {
      console.error('Failed to clear user:', error);
    }
  }
}

export const errorTrackingService = new ErrorTrackingService();
