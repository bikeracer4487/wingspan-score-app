// Core data models for Wingspan Score App

// Scoring mode for end-of-round goals
export type GoalScoringMode = 'competitive' | 'casual';

// Round number type
export type RoundNumber = 1 | 2 | 3 | 4;

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
  };
}
