// Wingspan-inspired color palette
// Nature-themed colors evoking forests, grasslands, and wetlands

export const colors = {
  // Primary Colors
  primary: {
    forest: '#2D4739',      // Deep forest green - primary actions, headers
    wetland: '#4A7C6F',     // Wetland teal - secondary, accents
    grassland: '#C4A962',   // Grassland gold - highlights, awards
  },

  // Background Colors
  background: {
    cream: '#F7F4ED',       // Main background (cream paper)
    moss: '#E8EBE4',        // Cards, surfaces (soft moss)
    white: '#FFFEF9',       // Elevated cards (warm white)
  },

  // Scoring Category Colors
  scoring: {
    birds: '#5B8C7B',       // Forest green
    bonusCards: '#8B6B4A',  // Warm brown
    roundGoals: '#4A7C6F',  // Teal
    eggs: '#E8D5B7',        // Cream/beige
    cachedFood: '#C4A962',  // Golden
    tuckedCards: '#7A9B8E', // Sage
    nectar: '#E88B9C',      // Pink/coral (Oceania expansion)
  },

  // Expansion colors
  expansion: {
    european: '#3D6B8F',    // Blue (European birds)
    oceania: '#E88B9C',     // Pink/coral (Oceania/nectar)
  },

  // Semantic Colors
  semantic: {
    winner: '#D4A84B',      // Winner gold
    error: '#C75D4A',       // Error red
    success: '#5B8C7B',     // Success green
    warning: '#C4A962',     // Warning gold
  },

  // Text Colors
  text: {
    primary: '#2D3B35',     // Main text
    secondary: '#5F6B66',   // Secondary text
    muted: '#8A9590',       // Muted text
    inverse: '#FFFEF9',     // Text on dark backgrounds
  },

  // Border Colors
  border: {
    light: 'rgba(45, 71, 57, 0.06)',
    medium: 'rgba(45, 71, 57, 0.12)',
    dark: 'rgba(45, 71, 57, 0.24)',
  },

  // Shadow Colors
  shadow: {
    light: 'rgba(45, 71, 57, 0.08)',
    medium: 'rgba(45, 71, 57, 0.16)',
  },

  // Avatar Colors (for player selection)
  avatars: [
    '#5B8C7B', // Forest green
    '#4A7C6F', // Wetland teal
    '#C4A962', // Grassland gold
    '#8B6B4A', // Warm brown
    '#7A9B8E', // Sage
    '#C75D4A', // Rust
    '#6B8E9B', // Slate blue
    '#9B7A6B', // Terracotta
    '#7B8C5B', // Olive
    '#6B7A9B', // Dusty blue
  ],
} as const;

// Type exports for TypeScript
export type ColorPalette = typeof colors;
export type AvatarColor = (typeof colors.avatars)[number];
