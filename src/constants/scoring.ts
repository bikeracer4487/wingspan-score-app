// Wingspan scoring constants and rules

// Maximum players in base game
export const MAX_PLAYERS = 5;
export const MIN_PLAYERS = 1;

// Number of rounds in a game
export const ROUNDS_PER_GAME = 4;

// Scoring categories (base game)
export const SCORING_CATEGORIES = [
  'birdCards',
  'bonusCards',
  'roundGoals',
  'eggs',
  'cachedFood',
  'tuckedCards',
] as const;

// All scoring categories including expansions
export const ALL_SCORING_CATEGORIES = [
  'birdCards',
  'bonusCards',
  'roundGoals',
  'eggs',
  'cachedFood',
  'tuckedCards',
  'nectar', // Oceania expansion
] as const;

export type ScoringCategory = (typeof SCORING_CATEGORIES)[number];
export type AllScoringCategory = (typeof ALL_SCORING_CATEGORIES)[number];

// Oceania Expansion: Nectar scoring points
// At end of game, compare nectar spent in each habitat
export const NECTAR_POINTS = {
  first: 5,  // Most nectar in a habitat
  second: 2, // Second most nectar in a habitat
} as const;

// Habitats for nectar scoring
export const HABITATS = ['forest', 'grassland', 'wetland'] as const;
export type HabitatType = (typeof HABITATS)[number];

// Category display info
export const CATEGORY_INFO: Record<ScoringCategory, {
  label: string;
  description: string;
  pointsPerItem: number | null; // null = variable
}> = {
  birdCards: {
    label: 'Bird Cards',
    description: 'Sum of face value points on all played birds',
    pointsPerItem: null, // Variable per card
  },
  bonusCards: {
    label: 'Bonus Cards',
    description: 'Points from completed bonus card objectives',
    pointsPerItem: null, // Variable per card
  },
  roundGoals: {
    label: 'Round Goals',
    description: 'Points earned from end-of-round goals',
    pointsPerItem: null, // Variable by mode and placement
  },
  eggs: {
    label: 'Eggs',
    description: 'One point per egg on bird cards',
    pointsPerItem: 1,
  },
  cachedFood: {
    label: 'Cached Food',
    description: 'One point per food token stored on birds',
    pointsPerItem: 1,
  },
  tuckedCards: {
    label: 'Tucked Cards',
    description: 'One point per card tucked under birds',
    pointsPerItem: 1,
  },
};

// Competitive (green) scoring by player count and placement
// Key: playerCount, Value: [1st place pts, 2nd place pts, 3rd place pts, ...]
export const COMPETITIVE_GOAL_POINTS: Record<number, number[]> = {
  2: [4, 1],
  3: [4, 1, 0],
  4: [4, 2, 1, 0],
  5: [5, 2, 1, 0, 0],
};

// Casual (blue) scoring: 1 point per item, max 5
export const CASUAL_GOAL_MAX_POINTS = 5;

// Round goal descriptions (for reference, not used in scoring)
export const ROUND_GOAL_EXAMPLES = [
  'Birds in forest habitat',
  'Birds in grassland habitat',
  'Birds in wetland habitat',
  'Eggs in bowl nests',
  'Eggs in cavity nests',
  'Eggs in ground nests',
  'Eggs in platform nests',
  'Total eggs in one habitat',
  'Birds with tucking powers',
  'Birds with caching powers',
  'Sets of eggs in all habitats',
  'Food cost birds in a row',
];

// Tiebreaker rules
export const TIEBREAKER_INFO = {
  primary: 'Most unused food tokens',
  secondary: 'Shared victory',
};

// Avatar color options for players
export const DEFAULT_AVATAR_COLORS = [
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
];
