import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';
import { EnvironmentIndicator } from '@test-cicd/ui';

interface EnvironmentContextValue {
  environment: string;
  isDismissed: boolean;
  dismissIndicator: () => void;
}

const EnvironmentContext = createContext<EnvironmentContextValue | null>(null);

interface EnvironmentProviderProps {
  children: ReactNode;
  environment: string;
}

export const EnvironmentProvider: React.FC<EnvironmentProviderProps> = ({
  children,
  environment,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const dismissIndicator = () => {
    setIsDismissed(true);
  };

  const value: EnvironmentContextValue = {
    environment,
    isDismissed,
    dismissIndicator,
  };

  return (
    <EnvironmentContext.Provider value={value}>
      {!isDismissed && (
        <EnvironmentIndicator environment={environment} onDismiss={dismissIndicator} />
      )}
      {children}
    </EnvironmentContext.Provider>
  );
};

export const useEnvironment = () => {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error('useEnvironment must be used within an EnvironmentProvider');
  }
  return context;
};
