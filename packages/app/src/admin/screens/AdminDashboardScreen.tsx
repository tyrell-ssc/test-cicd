import React from 'react';
import { View, Text, Button } from '@test-cicd/ui';
import { useAdminSession } from '../hooks/useAdminSession';
import { useSignOut } from '../../hooks/useAuth';

export function AdminDashboardScreen() {
  const { session, adminUser } = useAdminSession();
  const signOut = useSignOut();

  const handleSignOut = async () => {
    try {
      await signOut.mutateAsync();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <View className="min-h-screen bg-gray-50">
      {/* Header */}
      <View className="bg-white shadow">
        <View className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <View className="flex items-center justify-between py-6">
            <View>
              <Text className="text-2xl font-bold text-gray-900">Admin Dashboard</Text>
              <Text className="mt-1 text-sm text-gray-600">
                Welcome back, {session?.user?.email}
              </Text>
            </View>
            <Button
              title="Sign out"
              onPress={handleSignOut}
              className="bg-red-600 px-4 py-2 hover:bg-red-700"
              textClassName="text-white font-medium"
            />
          </View>
        </View>
      </View>

      {/* Content */}
      <View className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <View className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <View className="overflow-hidden rounded-lg bg-white shadow">
            <View className="p-5">
              <View className="flex items-center">
                <View className="flex-1">
                  <Text className="truncate text-sm font-medium text-gray-500">Total Users</Text>
                  <Text className="mt-1 text-3xl font-semibold text-gray-900">-</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="overflow-hidden rounded-lg bg-white shadow">
            <View className="p-5">
              <View className="flex items-center">
                <View className="flex-1">
                  <Text className="truncate text-sm font-medium text-gray-500">Your Role</Text>
                  <Text className="mt-1 text-3xl font-semibold text-gray-900">
                    {adminUser?.role || 'admin'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="overflow-hidden rounded-lg bg-white shadow">
            <View className="p-5">
              <View className="flex items-center">
                <View className="flex-1">
                  <Text className="truncate text-sm font-medium text-gray-500">Total Tenants</Text>
                  <Text className="mt-1 text-3xl font-semibold text-gray-900">-</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="rounded-lg bg-white p-6 shadow">
          <Text className="mb-4 text-lg font-medium text-gray-900">Quick Actions</Text>
          <View className="space-y-3">
            <View className="flex items-center justify-between rounded-md border border-gray-200 p-4 hover:bg-gray-50">
              <Text className="text-gray-700">Manage Users</Text>
              <Text className="text-blue-600">→</Text>
            </View>

            <View className="flex items-center justify-between rounded-md border border-gray-200 p-4 hover:bg-gray-50">
              <Text className="text-gray-700">Manage Tenants</Text>
              <Text className="text-blue-600">→</Text>
            </View>

            <View className="flex items-center justify-between rounded-md border border-gray-200 p-4 hover:bg-gray-50">
              <Text className="text-gray-700">View Analytics</Text>
              <Text className="text-blue-600">→</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
