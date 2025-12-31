import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { colors } from '../../constants/colors';
import { spacing, borderRadius, shadows } from '../../constants/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'elevated' | 'flat' | 'outlined';
  onPress?: () => void;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export function Card({
  children,
  style,
  variant = 'elevated',
  onPress,
  padding = 'medium',
}: CardProps) {
  const cardStyles = [
    styles.base,
    styles[variant],
    styles[`${padding}Padding`],
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyles} onPress={onPress} activeOpacity={0.8}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },

  // Variants
  elevated: {
    backgroundColor: colors.background.white,
    ...shadows.medium,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  flat: {
    backgroundColor: colors.background.moss,
  },
  outlined: {
    backgroundColor: colors.background.white,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },

  // Padding
  nonePadding: {
    padding: 0,
  },
  smallPadding: {
    padding: spacing.sm,
  },
  mediumPadding: {
    padding: spacing.md,
  },
  largePadding: {
    padding: spacing.lg,
  },
});
