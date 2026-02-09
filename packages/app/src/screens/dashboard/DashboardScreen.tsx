import React from 'react';
import { View, Text, Button } from '@test-cicd/ui';
import { useUser, useSignOut } from '../../hooks/useAuth';

export function DashboardScreen() {
  const { data: user, isLoading } = useUser();
  const signOut = useSignOut();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-8">
      <View className="mb-8">
        <Text className="mb-2 text-3xl font-bold">Dashboard</Text>
        <Text className="text-lg text-gray-600">Welcome back, {user?.email}!</Text>
      </View>

      <View className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <View className="rounded-lg bg-white p-6 shadow">
          <Text className="mb-2 text-xl font-semibold">Quick Stats</Text>
          <Text className="text-gray-600">Your account is active</Text>
        </View>

        <View className="rounded-lg bg-white p-6 shadow">
          <Text className="mb-2 text-xl font-semibold">Activity</Text>
          <Text className="text-gray-600">No recent activity</Text>
        </View>

        <View className="rounded-lg bg-white p-6 shadow">
          <Text className="mb-2 text-xl font-semibold">Settings</Text>
          <Text className="text-gray-600">Manage your account</Text>
        </View>
      </View>

      <Button title="Sign Out" onPress={() => signOut.mutate()} className="max-w-xs bg-red-600" />
    </View>
  );
}
