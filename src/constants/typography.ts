// Typography system for Wingspan Score App
// Using Google Fonts: Playfair Display, Source Sans 3, DM Mono

export const fontFamilies = {
  // Headers - elegant, field-guide feel
  display: {
    regular: 'PlayfairDisplay_400Regular',
    medium: 'PlayfairDisplay_500Medium',
    semiBold: 'PlayfairDisplay_600SemiBold',
    bold: 'PlayfairDisplay_700Bold',
  },

  // Body - clean, readable
  body: {
    regular: 'SourceSans3_400Regular',
    medium: 'SourceSans3_500Medium',
    semiBold: 'SourceSans3_600SemiBold',
    bold: 'SourceSans3_700Bold',
  },

  // Scores - clear numeric display
  mono: {
    regular: 'DMMono_400Regular',
    medium: 'DMMono_500Medium',
  },
} as const;

export const fontSizes = {
  // Display sizes (headers)
  h1: 28,
  h2: 22,
  h3: 18,

  // Body sizes
  body: 16,
  caption: 14,
  small: 12,

  // Score sizes
  scoreLarge: 32,
  scoreMedium: 24,
  scoreSmall: 18,

  // Special
  tabBar: 10,
  button: 16,
  input: 16,
} as const;

export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
} as const;

// Pre-composed text styles
export const textStyles = {
  h1: {
    fontFamily: fontFamilies.display.semiBold,
    fontSize: fontSizes.h1,
    lineHeight: fontSizes.h1 * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontFamily: fontFamilies.display.semiBold,
    fontSize: fontSizes.h2,
    lineHeight: fontSizes.h2 * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontFamily: fontFamilies.display.medium,
    fontSize: fontSizes.h3,
    lineHeight: fontSizes.h3 * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.body,
    lineHeight: fontSizes.body * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  bodyMedium: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.body,
    lineHeight: fontSizes.body * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  caption: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.caption,
    lineHeight: fontSizes.caption * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  small: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.small,
    lineHeight: fontSizes.small * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  },
  scoreLarge: {
    fontFamily: fontFamilies.mono.medium,
    fontSize: fontSizes.scoreLarge,
    lineHeight: fontSizes.scoreLarge * lineHeights.tight,
    letterSpacing: letterSpacing.normal,
  },
  scoreMedium: {
    fontFamily: fontFamilies.mono.medium,
    fontSize: fontSizes.scoreMedium,
    lineHeight: fontSizes.scoreMedium * lineHeights.tight,
    letterSpacing: letterSpacing.normal,
  },
  scoreSmall: {
    fontFamily: fontFamilies.mono.regular,
    fontSize: fontSizes.scoreSmall,
    lineHeight: fontSizes.scoreSmall * lineHeights.tight,
    letterSpacing: letterSpacing.normal,
  },
  button: {
    fontFamily: fontFamilies.body.semiBold,
    fontSize: fontSizes.button,
    lineHeight: fontSizes.button * lineHeights.tight,
    letterSpacing: letterSpacing.wide,
  },
  tabBar: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.tabBar,
    lineHeight: fontSizes.tabBar * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
} as const;
