import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../../constants/colors';
import { fontFamilies, fontSizes } from '../../constants/typography';
import { spacing, borderRadius, componentSizes, shadows } from '../../constants/spacing';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  haptic?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  haptic = true,
}: ButtonProps) {
  const handlePress = () => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[`${size}Size`],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.text.inverse : colors.primary.forest}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    gap: spacing.sm,
  },

  // Variants
  primary: {
    backgroundColor: colors.primary.forest,
    ...shadows.medium,
  },
  secondary: {
    backgroundColor: colors.primary.wetland,
    ...shadows.small,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary.forest,
  },
  ghost: {
    backgroundColor: 'transparent',
  },

  // Sizes
  smallSize: {
    height: componentSizes.buttonHeightSmall,
    paddingHorizontal: spacing.md,
  },
  mediumSize: {
    height: componentSizes.buttonHeight,
    paddingHorizontal: spacing.lg,
  },
  largeSize: {
    height: 64,
    paddingHorizontal: spacing.xl,
  },

  // Disabled
  disabled: {
    opacity: 0.5,
  },

  // Text base
  text: {
    fontFamily: fontFamilies.body.semiBold,
  },

  // Text variants
  primaryText: {
    color: colors.text.inverse,
  },
  secondaryText: {
    color: colors.text.inverse,
  },
  outlineText: {
    color: colors.primary.forest,
  },
  ghostText: {
    color: colors.primary.forest,
  },

  // Text sizes
  smallText: {
    fontSize: fontSizes.caption,
  },
  mediumText: {
    fontSize: fontSizes.button,
  },
  largeText: {
    fontSize: fontSizes.h3,
  },

  disabledText: {
    opacity: 0.7,
  },
});
