import React, { useState } from 'react';
import { View, Text, Button, Input } from '@test-cicd/ui';
import { authService } from '../../services/auth.service';

export function AdminLoginScreen() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;
    setIsLoading(true);
    setMessage('');

    try {
      await authService.signInWithMagicLink(email);
      setMessage('Check your email for the magic link!');
    } catch (err) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage('Failed to send magic link. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex min-h-screen items-center justify-center bg-gray-50">
      <View className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <View>
          <Text className="text-center text-3xl font-bold text-gray-900">Admin Panel</Text>
          <Text className="mt-2 text-center text-gray-600">
            Sign in to access the admin dashboard
          </Text>
        </View>

        <View className="mt-8 space-y-6">
          {message && (
            <View
              className={`rounded-md border p-4 ${
                message.includes('Check your email')
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <Text
                className={`text-sm ${
                  message.includes('Check your email') ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {message}
              </Text>
            </View>
          )}

          <View className="space-y-4">
            <View>
              <Text className="mb-1 block text-sm font-medium text-gray-700">Email</Text>
              <Input
                type="email"
                value={email}
                onChangeText={setEmail}
                placeholder="admin@example.com"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                autoComplete="email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <Button
            title={isLoading ? 'Sending...' : 'Send Magic Link'}
            onPress={handleSubmit}
            disabled={isLoading || !email}
            className={`w-full ${isLoading || !email ? 'bg-blue-400 opacity-60' : 'bg-blue-600'}`}
          />
        </View>

        <View className="text-center">
          <Text className="text-sm text-gray-600">
            Admin access only • Unauthorized access will be logged
          </Text>
        </View>
      </View>
    </View>
  );
}
