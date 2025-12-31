import type { ScoreInput, RankedScore } from '../types/models';
import { calculateTotalScore, getScoreBreakdown } from './scoring';

interface ScoreForRanking {
  playerId: string;
  playerName: string;
  score: ScoreInput;
}

/**
 * Determine finish positions with tiebreaker rules
 *
 * Tiebreaker rules (per official Wingspan rules):
 * 1. Most unused food tokens wins
 * 2. If still tied, shared victory
 */
export function calculateFinishPositions(
  scores: ScoreForRanking[]
): RankedScore[] {
  // Calculate total scores
  const scoresWithTotals = scores.map((s) => ({
    ...s,
    totalScore: calculateTotalScore(s.score),
    unusedFoodTokens: s.score.unusedFoodTokens,
  }));

  // Sort by total score (desc), then by unused food tokens (desc)
  const sorted = [...scoresWithTotals].sort((a, b) => {
    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }
    return b.unusedFoodTokens - a.unusedFoodTokens;
  });

  const ranked: RankedScore[] = [];
  let currentPosition = 1;

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    const previous = sorted[i - 1];

    // Check if tied with previous (same score AND same unused food)
    const isTiedWithPrevious = previous &&
      current.totalScore === previous.totalScore &&
      current.unusedFoodTokens === previous.unusedFoodTokens;

    if (!isTiedWithPrevious && i > 0) {
      currentPosition = i + 1;
    }

    const breakdown = getScoreBreakdown(current.score);

    ranked.push({
      playerId: current.playerId,
      playerName: current.playerName,
      totalScore: current.totalScore,
      unusedFoodTokens: current.unusedFoodTokens,
      finishPosition: currentPosition,
      isWinner: currentPosition === 1,
      scoreBreakdown: {
        birdCardPoints: breakdown.birdCardPoints,
        bonusCardPoints: breakdown.bonusCardPoints,
        roundGoalPoints: breakdown.roundGoalPoints,
        eggsPoints: breakdown.eggsPoints,
        cachedFoodPoints: breakdown.cachedFoodPoints,
        tuckedCardsPoints: breakdown.tuckedCardsPoints,
      },
    });
  }

  return ranked;
}

/**
 * Check if there are any shared victories (ties for 1st place)
 */
export function hasSharedVictory(rankedScores: RankedScore[]): boolean {
  const winners = rankedScores.filter((s) => s.isWinner);
  return winners.length > 1;
}

/**
 * Get winners from ranked scores
 */
export function getWinners(rankedScores: RankedScore[]): RankedScore[] {
  return rankedScores.filter((s) => s.isWinner);
}

/**
 * Get the number of players at each position
 */
export function getPositionCounts(rankedScores: RankedScore[]): Record<number, number> {
  const counts: Record<number, number> = {};

  for (const score of rankedScores) {
    counts[score.finishPosition] = (counts[score.finishPosition] || 0) + 1;
  }

  return counts;
}

/**
 * Format position with suffix (1st, 2nd, 3rd, etc.)
 */
export function formatPosition(position: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = position % 100;
  return position + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}
