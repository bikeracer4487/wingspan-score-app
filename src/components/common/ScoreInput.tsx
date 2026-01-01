import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ViewStyle,
  Keyboard,
} from 'react-native';
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
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(value));
  const inputRef = useRef<TextInput>(null);

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

  const handleValuePress = () => {
    setInputValue(String(value));
    setIsEditing(true);
    // Focus will happen automatically due to autoFocus on TextInput
  };

  const handleChangeText = (text: string) => {
    // Only allow numeric input
    const numericText = text.replace(/[^0-9]/g, '');
    setInputValue(numericText);
  };

  const handleSubmit = () => {
    commitValue();
  };

  const handleBlur = () => {
    commitValue();
  };

  const commitValue = () => {
    setIsEditing(false);

    // Parse the input value
    const parsed = parseInt(inputValue, 10);

    // If invalid or empty, revert to current value
    if (isNaN(parsed)) {
      setInputValue(String(value));
      return;
    }

    // Clamp to min/max bounds
    const clamped = Math.max(min, Math.min(max, parsed));

    // Only update if different
    if (clamped !== value) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onChange(clamped);
    }

    setInputValue(String(clamped));
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

        <TouchableOpacity
          style={[
            styles.valueContainer,
            {
              borderColor: isEditing ? colors.primary.forest : color,
              minWidth: valueWidth,
              height: valueHeight,
              marginHorizontal: horizontalMargin,
            },
            isEditing && styles.valueContainerEditing,
          ]}
          onPress={handleValuePress}
          activeOpacity={0.9}
        >
          {isEditing ? (
            <TextInput
              ref={inputRef}
              style={[styles.valueInput, { color, fontSize: valueFontSize }]}
              value={inputValue}
              onChangeText={handleChangeText}
              onSubmitEditing={handleSubmit}
              onBlur={handleBlur}
              keyboardType="number-pad"
              returnKeyType="done"
              selectTextOnFocus
              autoFocus
              maxLength={String(max).length}
            />
          ) : (
            <Text style={[styles.value, { color, fontSize: valueFontSize }]}>{value}</Text>
          )}
        </TouchableOpacity>

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
  valueContainerEditing: {
    borderWidth: 3,
  },
  value: {
    fontFamily: fontFamilies.mono.medium,
    fontSize: fontSizes.scoreMedium,
  },
  valueInput: {
    fontFamily: fontFamilies.mono.medium,
    fontSize: fontSizes.scoreMedium,
    textAlign: 'center',
    padding: 0,
    margin: 0,
    minWidth: 40,
  },
});
