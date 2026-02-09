import { create } from 'zustand';
import type { AppState } from './types';

export const useAppStore = create<AppState>((set) => ({
  isOnline: true,
  lastSyncedAt: null,

  setOnline: (isOnline) => set({ isOnline }),

  setLastSyncedAt: (date) => set({ lastSyncedAt: date }),
}));
