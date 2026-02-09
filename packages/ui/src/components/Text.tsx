import React from 'react';
import type { TextProps as RNTextProps } from 'react-native';
import { Text as RNText } from 'react-native';

interface TextProps extends RNTextProps {
  className?: string;
}

export const Text: React.FC<TextProps> = ({ className, style, ...props }) => {
  return <RNText className={className} style={style} {...props} />;
};
