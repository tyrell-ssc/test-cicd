import React from 'react';
import { View, Text, Button } from '@test-cicd/ui';
import { ScrollView, RefreshControl } from 'react-native';
import { useUser, useSignOut } from '../../hooks/useAuth';

export function DashboardScreen() {
  const { data: user, isLoading, refetch } = useUser();
  const signOut = useSignOut();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="p-4">
        <View className="mb-6">
          <Text className="mb-1 text-2xl font-bold">Dashboard</Text>
          <Text className="text-base text-gray-600">Welcome back, {user?.email}!</Text>
        </View>

        <View className="mb-4 rounded-lg bg-white p-4 shadow">
          <Text className="mb-2 text-lg font-semibold">Quick Stats</Text>
          <Text className="text-gray-600">Your account is active</Text>
        </View>

        <View className="mb-4 rounded-lg bg-white p-4 shadow">
          <Text className="mb-2 text-lg font-semibold">Activity</Text>
          <Text className="text-gray-600">No recent activity</Text>
        </View>

        <View className="mb-6 rounded-lg bg-white p-4 shadow">
          <Text className="mb-2 text-lg font-semibold">Settings</Text>
          <Text className="text-gray-600">Manage your account</Text>
        </View>

        <Button title="Sign Out" onPress={() => signOut.mutate()} className="bg-red-600" />
      </View>
    </ScrollView>
  );
}
