import React, { useState } from 'react';
import { View, Text, Button, Input } from '@test-cicd/ui';
import { useUser } from '../../hooks/useAuth';

export function ProfileScreen() {
  const { data: user } = useUser();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');

  return (
    <View className="flex-1 bg-gray-50 p-8">
      <Text className="mb-6 text-3xl font-bold">Profile</Text>

      <View className="mb-6 rounded-lg bg-white p-6 shadow">
        <Text className="mb-2 text-sm text-gray-500">Email</Text>
        <Text className="mb-4 text-lg">{user?.email}</Text>

        <Text className="mb-2 text-sm text-gray-500">Display Name</Text>
        <Input
          placeholder="Your name"
          value={displayName}
          onChangeText={setDisplayName}
          className="mb-4"
        />

        <Text className="mb-2 text-sm text-gray-500">Bio</Text>
        <Input
          placeholder="Tell us about yourself"
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          className="mb-4"
        />

        <Button title="Save Changes" onPress={() => {}} className="mt-2" />
      </View>
    </View>
  );
}
