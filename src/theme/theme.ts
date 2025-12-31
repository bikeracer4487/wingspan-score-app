// Unified theme object for Wingspan Score App

import { colors } from '../constants/colors';
import { fontFamilies, fontSizes, textStyles } from '../constants/typography';
import { spacing, borderRadius, componentSizes, shadows } from '../constants/spacing';

export const theme = {
  colors,
  fonts: fontFamilies,
  fontSizes,
  textStyles,
  spacing,
  borderRadius,
  componentSizes,
  shadows,
} as const;

export type Theme = typeof theme;

// Shorthand accessors
export const {
  primary,
  background,
  scoring,
  semantic,
  text,
  border,
  shadow,
  avatars,
} = colors;
