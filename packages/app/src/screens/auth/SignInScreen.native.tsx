import React, { useState } from 'react';
import { View, Text, Button, Input } from '@test-cicd/ui';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { authService } from '../../services/auth.service';

export function SignInScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleMagicLink = async () => {
    if (!email) return;
    setIsLoading(true);
    setMessage('');
    try {
      await authService.signInWithMagicLink(email);
      setMessage('Check your email for the magic link!');
    } catch (error: unknown) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        contentContainerClassName="flex-1 items-center justify-center p-4 bg-gray-50"
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <Text className="mb-6 text-center text-3xl font-bold">Sign In</Text>

          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="mb-4"
          />

          <Button
            title={isLoading ? 'Sending...' : 'Send Magic Link'}
            onPress={handleMagicLink}
            disabled={isLoading || !email}
            className="mb-4"
          />
          {message && <Text className="mt-4 text-center text-sm text-gray-600">{message}</Text>}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
