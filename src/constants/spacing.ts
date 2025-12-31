// Spacing system for Wingspan Score App
// Based on 8px grid

export const spacing = {
  xs: 4,    // Component internal padding
  sm: 8,    // Tight spacing
  md: 16,   // Standard padding
  lg: 24,   // Section gaps
  xl: 32,   // Screen padding
  xxl: 48,  // Major section breaks
} as const;

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999, // Pill shape
} as const;

export const componentSizes = {
  // Touch targets (accessibility)
  touchTarget: 48,
  touchTargetLarge: 56,

  // Buttons
  buttonHeight: 56,
  buttonHeightSmall: 44,

  // Inputs
  inputHeight: 56,
  scoreInputHeight: 64,

  // Avatars
  avatarSmall: 32,
  avatarMedium: 48,
  avatarLarge: 64,

  // Icons
  iconSmall: 20,
  iconMedium: 24,
  iconLarge: 32,

  // Tab bar
  tabBarHeight: 88, // Includes safe area
  tabBarIconSize: 24,

  // Cards
  cardPadding: 16,
} as const;

export const shadows = {
  small: {
    shadowColor: '#2D4739',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#2D4739',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  large: {
    shadowColor: '#2D4739',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
} as const;
