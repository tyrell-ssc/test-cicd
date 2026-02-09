import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UIState } from './types';

export const createUIStore = (storage: unknown) =>
  create<UIState>()(
    persist(
      (set) => ({
        theme: 'light',
        isDrawerOpen: false,

        toggleTheme: () =>
          set((state) => ({
            theme: state.theme === 'light' ? 'dark' : 'light',
          })),

        toggleDrawer: () =>
          set((state) => ({
            isDrawerOpen: !state.isDrawerOpen,
          })),

        setDrawerOpen: (isOpen) =>
          set({
            isDrawerOpen: isOpen,
          }),
      }),
      {
        name: 'ui-storage',
        storage: createJSONStorage(() => storage),
      }
    )
  );
