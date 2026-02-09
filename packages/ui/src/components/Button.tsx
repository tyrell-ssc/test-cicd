import React from 'react';
import type { PressableProps } from 'react-native';
import { Pressable, Text } from 'react-native';

interface ButtonProps extends PressableProps {
  title: string;
  className?: string;
  textClassName?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  className = '',
  textClassName = '',
  ...props
}) => {
  return (
    <Pressable
      className={`rounded-lg bg-blue-600 px-4 py-2 active:opacity-70 ${className}`}
      {...props}
    >
      <Text className={`text-center font-semibold text-white ${textClassName}`}>{title}</Text>
    </Pressable>
  );
};
