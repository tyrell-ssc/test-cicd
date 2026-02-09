import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import reactNativeWeb from 'vite-plugin-react-native-web';
import path from 'path';

export default defineConfig({
  envDir: path.resolve(__dirname, '../..'),
  plugins: [
    TanStackRouterVite({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    react({
      jsxImportSource: 'nativewind',
    }),
    reactNativeWeb(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
  },
});
