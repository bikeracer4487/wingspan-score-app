// Core data models for Wingspan Score App

// Scoring mode for end-of-round goals
export type GoalScoringMode = 'competitive' | 'casual';

// Round number type
export type RoundNumber = 1 | 2 | 3 | 4;

// Expansion types
export type Expansion = 'european' | 'oceania';

// Habitat types for Oceania nectar scoring
export type Habitat = 'forest' | 'grassland' | 'wetland';

// Nectar scores per habitat (Oceania expansion)
export interface NectarScores {
  forest: number;
  grassland: number;
  wetland: number;
}

// Player profile
export interface Player {
  id: string;
  name: string;
  avatarColor: string;   // Legacy: kept for backward compatibility
  avatarId?: string;     // New: bird avatar ID
  createdAt: number;     // Unix timestamp
  isActive: boolean;     // Soft delete support
}

// Individual round goal score
export interface RoundGoalScore {
  round: RoundNumber;
  points: number;
}

// Game session
export interface Game {
  id: string;
  playedAt: number; // Unix timestamp
  goalScoringMode: GoalScoringMode;
  playerCount: number; // 1-5
  isComplete: boolean;
  notes?: string;
  expansions: Expansion[]; // Active expansions for this game
}

// Player's complete score breakdown for a game
export interface GameScore {
  id: string;
  gameId: string;
  playerId: string;

  // Scoring categories
  birdCardPoints: number;
  bonusCardPoints: number;
  roundGoals: RoundGoalScore[];
  eggsCount: number; // 1pt each
  cachedFoodCount: number; // 1pt each
  tuckedCardsCount: number; // 1pt each

  // Oceania expansion: Nectar spent per habitat
  nectarScores?: NectarScores;

  // Tiebreaker
  unusedFoodTokens: number;

  // Computed values
  totalScore: number;
  finishPosition: number; // 1-5
  isWinner: boolean; // Supports shared victories
}

// Score input during game entry (before finalization)
export interface ScoreInput {
  playerId: string;
  birdCardPoints: number;
  bonusCardPoints: number;
  roundGoals: RoundGoalScore[];
  eggsCount: number;
  cachedFoodCount: number;
  tuckedCardsCount: number;
  unusedFoodTokens: number;
  // Oceania expansion: Nectar spent per habitat (for majority scoring)
  nectarScores: NectarScores;
}

// Head-to-head record between two players
export interface HeadToHead {
  playerId: string;
  opponentId: string;
  wins: number;
  losses: number;
  ties: number;
  gamesPlayed: number;
}

// Computed statistics for a player
export interface PlayerStats {
  playerId: string;
  totalGames: number;
  wins: number;
  losses: number;
  ties: number; // Shared victories
  winRate: number; // Percentage
  avgFinishPosition: number;
  avgScore: number;
  highScore: number;
  lowScore: number;

  // Category averages
  avgBirdCardPoints: number;
  avgBonusCardPoints: number;
  avgRoundGoalPoints: number;
  avgEggsPoints: number;
  avgCachedFoodPoints: number;
  avgTuckedCardsPoints: number;
  avgNectarPoints: number; // Oceania expansion

  // Streaks
  currentWinStreak: number;
  bestWinStreak: number;

  // Recent form
  last5Results: ('W' | 'L' | 'T')[];
}

// Game with scores for display
export interface GameWithScores extends Game {
  scores: GameScore[];
  playerNames: Record<string, string>; // playerId -> name
}

// Ranked score after tiebreaker calculation
export interface RankedScore {
  playerId: string;
  playerName: string;
  totalScore: number;
  unusedFoodTokens: number;
  finishPosition: number;
  isWinner: boolean;
  scoreBreakdown: {
    birdCardPoints: number;
    bonusCardPoints: number;
    roundGoalPoints: number;
    eggsPoints: number;
    cachedFoodPoints: number;
    tuckedCardsPoints: number;
    nectarPoints: number; // Oceania expansion: sum of nectar majority points
  };
}
