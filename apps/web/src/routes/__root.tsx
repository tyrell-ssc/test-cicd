import { createRootRoute, Outlet } from '@tanstack/react-router';
import { EnvironmentProvider, useAuthListener } from '@test-cicd/app';
import { config } from '@test-cicd/app';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  // CRITICAL: Activate auth state listener
  useAuthListener();

  return (
    <EnvironmentProvider environment={config.app.env}>
      <Outlet />
    </EnvironmentProvider>
  );
}
