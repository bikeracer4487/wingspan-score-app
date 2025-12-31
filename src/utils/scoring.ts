import type { ScoreInput, RoundGoalScore, GoalScoringMode } from '../types/models';
import { COMPETITIVE_GOAL_POINTS, CASUAL_GOAL_MAX_POINTS, ROUNDS_PER_GAME } from '../constants/scoring';

/**
 * Calculate total score from all categories
 */
export function calculateTotalScore(score: ScoreInput): number {
  const roundGoalTotal = score.roundGoals.reduce((sum, rg) => sum + rg.points, 0);

  return (
    score.birdCardPoints +
    score.bonusCardPoints +
    roundGoalTotal +
    score.eggsCount +           // 1pt each
    score.cachedFoodCount +     // 1pt each
    score.tuckedCardsCount      // 1pt each
  );
}

/**
 * Get competitive (green) round goal points based on placement
 */
export function getCompetitiveGoalPoints(
  placement: number,
  playerCount: number
): number {
  const scores = COMPETITIVE_GOAL_POINTS[playerCount];
  if (!scores) {
    // Fallback for unexpected player count
    return placement === 1 ? 4 : placement === 2 ? 1 : 0;
  }
  return scores[placement - 1] ?? 0;
}

/**
 * Get casual (blue) round goal points
 * 1 point per item achieved, max 5 points
 */
export function getCasualGoalPoints(itemCount: number): number {
  return Math.min(itemCount, CASUAL_GOAL_MAX_POINTS);
}

/**
 * Calculate tied goal points (average, rounded down)
 * Used when players tie for a placement in competitive mode
 */
export function getTiedGoalPoints(
  placements: number[],
  playerCount: number
): number {
  const scores = COMPETITIVE_GOAL_POINTS[playerCount];
  if (!scores) return 0;

  const totalPoints = placements.reduce((sum, p) => {
    return sum + (scores[p - 1] ?? 0);
  }, 0);

  return Math.floor(totalPoints / placements.length);
}

/**
 * Get round goal points based on mode
 */
export function getRoundGoalPoints(
  mode: GoalScoringMode,
  placement: number,
  playerCount: number,
  itemCount?: number
): number {
  if (mode === 'casual') {
    return getCasualGoalPoints(itemCount ?? 0);
  }
  return getCompetitiveGoalPoints(placement, playerCount);
}

/**
 * Create empty round goals for a new score
 */
export function createEmptyRoundGoals(): RoundGoalScore[] {
  return Array.from({ length: ROUNDS_PER_GAME }, (_, i) => ({
    round: (i + 1) as 1 | 2 | 3 | 4,
    points: 0,
  }));
}

/**
 * Create an empty score input for a player
 */
export function createEmptyScoreInput(playerId: string): ScoreInput {
  return {
    playerId,
    birdCardPoints: 0,
    bonusCardPoints: 0,
    roundGoals: createEmptyRoundGoals(),
    eggsCount: 0,
    cachedFoodCount: 0,
    tuckedCardsCount: 0,
    unusedFoodTokens: 0,
  };
}

/**
 * Get the sum of round goal points
 */
export function getRoundGoalTotal(roundGoals: RoundGoalScore[]): number {
  return roundGoals.reduce((sum, rg) => sum + rg.points, 0);
}

/**
 * Get score breakdown for display
 */
export function getScoreBreakdown(score: ScoreInput): {
  birdCardPoints: number;
  bonusCardPoints: number;
  roundGoalPoints: number;
  eggsPoints: number;
  cachedFoodPoints: number;
  tuckedCardsPoints: number;
  total: number;
} {
  const roundGoalPoints = getRoundGoalTotal(score.roundGoals);

  return {
    birdCardPoints: score.birdCardPoints,
    bonusCardPoints: score.bonusCardPoints,
    roundGoalPoints,
    eggsPoints: score.eggsCount,
    cachedFoodPoints: score.cachedFoodCount,
    tuckedCardsPoints: score.tuckedCardsCount,
    total: calculateTotalScore(score),
  };
}
