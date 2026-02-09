import { createSupabaseClient } from '@test-cicd/supabase';
import type { Session, User, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';

// MMKV storage for React Native (faster, synchronous)
// V4 uses Nitro Modules architecture with createMMKV()
let mmkvStorage: unknown;
if (typeof document === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createMMKV } = require('react-native-mmkv');
    const storage = createMMKV();

    // Supabase storage adapter - implements AsyncStorage-like interface
    mmkvStorage = {
      getItem: (key: string) => {
        const value = storage.getString(key);
        return value ?? null;
      },
      setItem: (key: string, value: string) => {
        console.log(`[setItem:MMKV] writing item: ${key}`);
        storage.set(key, value);
      },
      removeItem: (key: string) => {
        storage.remove(key);
      },
    };
  } catch (e) {
    console.warn('MMKV not available:', e);
  }
}

export class AuthService {
  private _supabase?: SupabaseClient;

  private get supabase(): SupabaseClient {
    if (!this._supabase) {
      const options =
        typeof document === 'undefined' && mmkvStorage
          ? { auth: { storage: mmkvStorage } }
          : undefined;

      this._supabase = createSupabaseClient(
        config.supabase.url,
        config.supabase.publishableKey,
        options
      );
    }
    return this._supabase;
  }

  private getRedirectUrl(): string {
    // Check if we're running in React Native/Expo
    // navigator.product is 'ReactNative' in React Native
    const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

    if (isReactNative || typeof document === 'undefined') {
      // Mobile (Expo/React Native) - use deep link scheme
      return `${config.app.scheme}://auth/callback`;
    }

    // Web browser - use current origin
    return `${window.location.origin}/api/auth/callback`;
  }

  async signInWithMagicLink(email: string): Promise<void> {
    const { error } = await this.supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: this.getRedirectUrl(),
      },
    });

    if (error) throw error;

    console.log(`[signInWithMagicLink] - sent to:`, {
      email,
      redirectLink: this.getRedirectUrl(),
    });
  }

  async verifyOtp(email: string, token: string): Promise<{ session: Session }> {
    const { data, error } = await this.supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) throw error;
    return data;
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async getSession(): Promise<Session | null> {
    const { data } = await this.supabase.auth.getSession();
    console.log('[getSession]', data);
    return data.session;
  }

  async setSession(accessToken: string, refreshToken: string): Promise<Session | null> {
    const { data, error } = await this.supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    console.log('[setSession]', data);

    if (error) throw error;
    return data.session;
  }

  async getUser(): Promise<User | null> {
    const { data } = await this.supabase.auth.getUser();
    console.log('[getUser]', data);
    return data.user;
  }

  onAuthStateChange(callback: (session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange((_event, session) => {
      console.log('[onAuthStateChange]', { session });
      callback(session);
    });
  }
}

export const authService = new AuthService();
