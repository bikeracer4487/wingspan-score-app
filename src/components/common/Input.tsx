import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { colors } from '../../constants/colors';
import { fontFamilies, fontSizes } from '../../constants/typography';
import { spacing, borderRadius, componentSizes } from '../../constants/spacing';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helper?: string;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  helper,
  containerStyle,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
        placeholderTextColor={colors.text.muted}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />

      {error && <Text style={styles.error}>{error}</Text>}
      {helper && !error && <Text style={styles.helper}>{helper}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  input: {
    height: componentSizes.inputHeight,
    backgroundColor: colors.background.cream,
    borderWidth: 2,
    borderColor: colors.border.medium,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.input,
    color: colors.text.primary,
  },
  inputFocused: {
    borderColor: colors.primary.wetland,
    backgroundColor: colors.background.white,
  },
  inputError: {
    borderColor: colors.semantic.error,
  },
  error: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.small,
    color: colors.semantic.error,
    marginTop: spacing.xs,
  },
  helper: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.small,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
});
