import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../../constants/colors';
import { fontFamilies, fontSizes } from '../../constants/typography';
import { spacing, borderRadius, componentSizes, shadows } from '../../constants/spacing';

interface ScoreInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  color?: string;
  style?: ViewStyle;
  compact?: boolean;
}

export function ScoreInput({
  value,
  onChange,
  label,
  min = 0,
  max = 999,
  step = 1,
  color = colors.primary.wetland,
  style,
  compact = false,
}: ScoreInputProps) {
  const handleIncrement = () => {
    if (value + step <= max) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onChange(value + step);
    }
  };

  const handleDecrement = () => {
    if (value - step >= min) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onChange(value - step);
    }
  };

  const buttonSize = compact ? 36 : componentSizes.touchTarget;
  const valueWidth = compact ? 56 : 80;
  const valueHeight = compact ? 48 : componentSizes.scoreInputHeight;
  const buttonFontSize = compact ? 22 : 28;
  const valueFontSize = compact ? fontSizes.body : fontSizes.scoreMedium;
  const horizontalMargin = compact ? spacing.xs : spacing.md;

  return (
    <View style={[styles.container, compact && styles.containerCompact, style]}>
      <Text style={[styles.label, compact && styles.labelCompact]}>{label}</Text>

      <View style={styles.inputRow}>
        <TouchableOpacity
          style={[styles.button, { width: buttonSize, height: buttonSize }]}
          onPress={handleDecrement}
          disabled={value <= min}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, { fontSize: buttonFontSize }, value <= min && styles.buttonDisabled]}>−</Text>
        </TouchableOpacity>

        <View style={[styles.valueContainer, { borderColor: color, minWidth: valueWidth, height: valueHeight, marginHorizontal: horizontalMargin }]}>
          <Text style={[styles.value, { color, fontSize: valueFontSize }]}>{value}</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, { width: buttonSize, height: buttonSize }]}
          onPress={handleIncrement}
          disabled={value >= max}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, { fontSize: buttonFontSize }, value >= max && styles.buttonDisabled]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  containerCompact: {
    marginBottom: spacing.sm,
  },
  label: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  labelCompact: {
    fontSize: fontSizes.small,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: componentSizes.touchTarget,
    height: componentSizes.touchTarget,
    backgroundColor: colors.background.moss,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  decrementButton: {},
  incrementButton: {},
  buttonText: {
    fontFamily: fontFamilies.body.semiBold,
    fontSize: 28,
    color: colors.primary.forest,
    lineHeight: 32,
  },
  buttonDisabled: {
    color: colors.text.muted,
  },
  valueContainer: {
    minWidth: 80,
    height: componentSizes.scoreInputHeight,
    backgroundColor: colors.background.white,
    borderWidth: 2,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.md,
    ...shadows.small,
  },
  value: {
    fontFamily: fontFamilies.mono.medium,
    fontSize: fontSizes.scoreMedium,
  },
});
