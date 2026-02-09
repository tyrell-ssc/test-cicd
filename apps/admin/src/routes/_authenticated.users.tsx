import { createFileRoute } from '@tanstack/react-router';
import { View, Text } from '@test-cicd/ui';

export const Route = createFileRoute('/_authenticated/users')({
  component: UsersPage,
});

function UsersPage() {
  return (
    <View className="min-h-screen bg-gray-50 p-8">
      <Text className="mb-6 text-3xl font-bold">User Management</Text>

      <View className="rounded-lg bg-white p-6 shadow">
        <Text className="mb-4 text-lg">All Users</Text>
        <Text className="text-gray-600">User list will appear here...</Text>
      </View>
    </View>
  );
}
