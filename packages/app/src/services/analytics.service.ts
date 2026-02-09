import { config } from '../config';

// Type-safe analytics events
export type AnalyticsEvent =
  | 'screen_view'
  | 'button_click'
  | 'form_submit'
  | 'sign_in'
  | 'sign_out'
  | 'purchase_started'
  | 'purchase_completed';

export interface AnalyticsProperties {
  [key: string]: string | number | boolean | undefined;
}

interface PostHogClient {
  capture: (event: string, properties?: Record<string, unknown>) => void;
  identify: (userId: string, traits?: Record<string, unknown>) => void;
  reset: () => void;
}

class AnalyticsService {
  private isInitialized = false;
  private posthog: PostHogClient | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    const { key, host } = config.analytics.posthog;

    if (!key) {
      console.warn('PostHog API key not configured');
      return;
    }

    try {
      // Dynamic import based on platform
      if (typeof window !== 'undefined') {
        // Web
        const posthog = await import('posthog-js');
        posthog.default.init(key, {
          api_host: host,
          autocapture: false,
          capture_pageview: false,
        });
        this.posthog = posthog.default as PostHogClient;
      }
      // Note: Mobile (React Native) analytics with posthog-react-native
      // is not supported in web builds to avoid import resolution issues

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  track(event: AnalyticsEvent, properties?: AnalyticsProperties): void {
    if (!this.isInitialized || !this.posthog) return;

    try {
      this.posthog.capture(event, properties);
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  identify(userId: string, traits?: AnalyticsProperties): void {
    if (!this.isInitialized || !this.posthog) return;

    try {
      this.posthog.identify(userId, traits);
    } catch (error) {
      console.error('Failed to identify user:', error);
    }
  }

  reset(): void {
    if (!this.isInitialized || !this.posthog) return;

    try {
      this.posthog.reset();
    } catch (error) {
      console.error('Failed to reset analytics:', error);
    }
  }

  screen(name: string, properties?: AnalyticsProperties): void {
    if (!this.isInitialized || !this.posthog) return;

    try {
      this.posthog.capture('screen_view', {
        screen_name: name,
        ...properties,
      });
    } catch (error) {
      console.error('Failed to track screen:', error);
    }
  }
}

export const analyticsService = new AnalyticsService();
