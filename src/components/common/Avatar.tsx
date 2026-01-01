import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { fontFamilies } from '../../constants/typography';
import { componentSizes } from '../../constants/spacing';
import { getBirdAvatarById } from '../../constants/birdAvatars';

type AvatarSize = 'small' | 'medium' | 'large';

interface AvatarProps {
  name: string;
  color?: string;           // Optional for backward compatibility
  avatarId?: string;        // Bird avatar ID
  size?: AvatarSize;
  style?: ViewStyle;
}

const DEFAULT_COLOR = '#5B8C7B'; // Forest green fallback

export function Avatar({ name, color, avatarId, size = 'medium', style }: AvatarProps) {
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

  // Try to get bird avatar if avatarId is provided
  const birdAvatar = avatarId ? getBirdAvatarById(avatarId) : null;

  // If we have a bird avatar, render the image
  if (birdAvatar) {
    return (
      <View
        style={[
          styles.container,
          {
            width: sizeValue,
            height: sizeValue,
            borderRadius: sizeValue / 2,
            overflow: 'hidden',
          },
          style,
        ]}
      >
        <Image
          source={birdAvatar.image}
          style={{
            width: sizeValue,
            height: sizeValue,
          }}
          resizeMode="cover"
        />
      </View>
    );
  }

  // Fall back to color + initials
  const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: sizeValue,
          height: sizeValue,
          borderRadius: sizeValue / 2,
          backgroundColor: color || DEFAULT_COLOR,
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
