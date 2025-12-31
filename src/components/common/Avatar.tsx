import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { fontFamilies } from '../../constants/typography';
import { componentSizes } from '../../constants/spacing';

type AvatarSize = 'small' | 'medium' | 'large';

interface AvatarProps {
  name: string;
  color: string;
  size?: AvatarSize;
  style?: ViewStyle;
}

export function Avatar({ name, color, size = 'medium', style }: AvatarProps) {
  // Get initials (first letter of first and last name, or first two letters)
  const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const sizeValue = {
    small: componentSizes.avatarSmall,
    medium: componentSizes.avatarMedium,
    large: componentSizes.avatarLarge,
  }[size];

  const fontSize = {
    small: 12,
    medium: 18,
    large: 24,
  }[size];

  return (
    <View
      style={[
        styles.container,
        {
          width: sizeValue,
          height: sizeValue,
          borderRadius: sizeValue / 2,
          backgroundColor: color,
        },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize }]}>{getInitials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: fontFamilies.body.semiBold,
    color: '#FFFFFF',
  },
});
