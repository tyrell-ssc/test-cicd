import React from 'react';
import type { TextInputProps } from 'react-native';
import { TextInput } from 'react-native';

interface InputProps extends TextInputProps {
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className = '', style, ...props }) => {
  return (
    <TextInput
      className={`rounded-lg border border-gray-300 px-4 py-2 ${className}`}
      style={style}
      placeholderTextColor="#9CA3AF"
      {...props}
    />
  );
};
