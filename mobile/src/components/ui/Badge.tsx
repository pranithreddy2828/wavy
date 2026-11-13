import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'urgent' | 'warning' | 'success' | 'neutral';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  style,
}) => {
  const { colors, radius, spacing, typography } = useTheme();

  const getColors = (): { bg: string; text: string; border: string } => {
    switch (variant) {
      case 'urgent':
        return {
          bg: colors.urgentMuted,
          text: colors.urgent,
          border: colors.urgent,
        };
      case 'warning':
        return {
          bg: colors.warningMuted,
          text: colors.warning,
          border: colors.warning,
        };
      case 'success':
        return {
          bg: colors.successMuted,
          text: colors.success,
          border: colors.success,
        };
      case 'secondary':
        return {
          bg: colors.secondaryMuted,
          text: colors.secondary,
          border: colors.secondary,
        };
      case 'neutral':
        return {
          bg: colors.surfaceSubtle,
          text: colors.textSecondary,
          border: colors.border,
        };
      case 'primary':
      default:
        return {
          bg: colors.primaryMuted,
          text: colors.primary,
          border: colors.primary,
        };
    }
  };

  const scheme = getColors();
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: scheme.bg,
          borderColor: scheme.border,
          borderRadius: radius.full,
          paddingVertical: isSmall ? 2 : spacing.xs,
          paddingHorizontal: isSmall ? spacing.sm : spacing.md,
        },
        style,
      ]}
    >
      {icon && <View style={{ marginRight: spacing.xs }}>{icon}</View>}
      <Text
        style={[
          isSmall ? typography.tiny : typography.caption,
          { color: scheme.text, fontWeight: '700' },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
});
