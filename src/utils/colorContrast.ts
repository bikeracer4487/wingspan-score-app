/**
 * Color contrast checking utilities for WCAG compliance
 */

export interface ContrastCheck {
  pair: string;
  ratio: number;
  meetsAA: boolean;
  meetsAAA: boolean;
  recommendation?: string;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove # if present
  hex = hex.replace('#', '');

  // Handle rgba() format
  if (hex.startsWith('rgba')) {
    const match = hex.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
      };
    }
    return null;
  }

  // Parse hex
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

/**
 * Calculate relative luminance
 */
function getLuminance(rgb: { r: number; g: number; b: number }): number {
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;

  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    return 1;
  }

  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG standards
 */
export function meetsWCAGAA(ratio: number): boolean {
  return ratio >= 4.5;
}

export function meetsWCAGAAA(ratio: number): boolean {
  return ratio >= 7;
}

/**
 * Validate color contrast for a theme
 */
export function validateThemeContrast(theme: any): ContrastCheck[] {
  const checks: ContrastCheck[] = [];

  // Check text on backgrounds
  const textBackgroundPairs: Array<{ text: string; bg: string; name: string }> = [
    { text: theme.colors.text.primary, bg: theme.colors.background.cream, name: 'Primary text on cream' },
    { text: theme.colors.text.primary, bg: theme.colors.background.moss, name: 'Primary text on moss' },
    { text: theme.colors.text.primary, bg: theme.colors.background.white, name: 'Primary text on white' },
    { text: theme.colors.text.secondary, bg: theme.colors.background.cream, name: 'Secondary text on cream' },
    { text: theme.colors.text.muted, bg: theme.colors.background.cream, name: 'Muted text on cream' },
    { text: theme.colors.text.inverse, bg: theme.colors.primary.forest, name: 'Inverse text on forest' },
    { text: theme.colors.text.inverse, bg: theme.colors.primary.wetland, name: 'Inverse text on wetland' },
  ];

  for (const pair of textBackgroundPairs) {
    const ratio = getContrastRatio(pair.text, pair.bg);
    const meetsAA = meetsWCAGAA(ratio);
    const meetsAAA = meetsWCAGAAA(ratio);

    checks.push({
      pair: pair.name,
      ratio: Math.round(ratio * 100) / 100,
      meetsAA,
      meetsAAA,
      recommendation: !meetsAA ? 'Consider using a darker text color or lighter background' : undefined,
    });
  }

  return checks;
}
