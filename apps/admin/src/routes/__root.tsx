import { createRootRoute, Outlet } from '@tanstack/react-router';
import { EnvironmentProvider } from '@test-cicd/app';
import { config } from '@test-cicd/app';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <EnvironmentProvider environment={config.app.env}>
      <Outlet />
    </EnvironmentProvider>
  );
}
