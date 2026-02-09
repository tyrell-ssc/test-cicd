import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface EnvironmentIndicatorProps {
  environment: string;
  onDismiss?: () => void;
}

export const EnvironmentIndicator: React.FC<EnvironmentIndicatorProps> = ({
  environment,
  onDismiss,
}) => {
  if (environment === 'production' || environment === 'prod') {
    return null;
  }

  const getEnvironmentColor = () => {
    switch (environment.toLowerCase()) {
      case 'local':
      case 'development':
      case 'dev':
        return 'bg-blue-600';
      case 'staging':
      case 'stage':
        return 'bg-yellow-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getEnvironmentLabel = () => {
    switch (environment.toLowerCase()) {
      case 'local':
      case 'development':
      case 'dev':
        return '🔧 LOCAL';
      case 'staging':
      case 'stage':
        return '⚠️ STAGING';
      default:
        return `📍 ${environment.toUpperCase()}`;
    }
  };

  return (
    <View className={`${getEnvironmentColor()} flex-row items-center justify-center px-4 py-2`}>
      <Text className="text-sm font-semibold text-white">{getEnvironmentLabel()}</Text>
      {onDismiss && (
        <Pressable onPress={onDismiss} className="ml-3 active:opacity-70">
          <Text className="text-sm text-white">✕</Text>
        </Pressable>
      )}
    </View>
  );
};
