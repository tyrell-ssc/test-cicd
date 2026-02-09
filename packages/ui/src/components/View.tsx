import React from 'react';
import type { ViewProps as RNViewProps } from 'react-native';
import { View as RNView } from 'react-native';

interface ViewProps extends RNViewProps {
  className?: string;
}

export const View: React.FC<ViewProps> = ({ className, style, ...props }) => {
  return <RNView className={className} style={style} {...props} />;
};
