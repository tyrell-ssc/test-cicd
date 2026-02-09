import React from 'react';
import { View, Text } from '@test-cicd/ui';
import { ActivityIndicator } from 'react-native';

interface AuthCallbackScreenProps {
  error?: string | null;
}

export function AuthCallbackScreen({ error }: AuthCallbackScreenProps) {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50 p-4">
      <View className="items-center">
        {!error && <ActivityIndicator size="large" />}
        <Text className="mt-4 text-lg text-gray-700">{error ? error : 'Signing you in...'}</Text>
        {error && <Text className="mt-2 text-sm text-gray-500">Please try signing in again</Text>}
      </View>
    </View>
  );
}
