import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'surface' | 'raised' | 'highlight';
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'surface',
  padded = true,
  onPress,
  style,
  ...props
}) => {
  const { colors, radius, spacing, shadows } = useTheme();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'raised':
        return colors.surfaceRaised;
      case 'highlight':
        return colors.surfaceSubtle;
      case 'surface':
      default:
        return colors.surface;
    }
  };

  const cardStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderRadius: radius.lg,
    borderColor: colors.border,
    borderWidth: 1,
    padding: padded ? spacing.lg : 0,
    ...shadows.card,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={[cardStyle, style]}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};
