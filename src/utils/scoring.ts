import type { ScoreInput, RoundGoalScore, GoalScoringMode, NectarScores, Habitat } from '../types/models';
import { COMPETITIVE_GOAL_POINTS, CASUAL_GOAL_MAX_POINTS, ROUNDS_PER_GAME, NECTAR_POINTS, HABITATS } from '../constants/scoring';

/**
 * Calculate total score from all categories
 * Note: nectarPoints should be pre-calculated using calculateNectarPoints()
 * since it requires comparing all players' nectar scores
 */
export function calculateTotalScore(score: ScoreInput, includeNectar: boolean = false, nectarPoints: number = 0): number {
  const roundGoalTotal = score.roundGoals.reduce((sum, rg) => sum + rg.points, 0);

  let total = (
    score.birdCardPoints +
    score.bonusCardPoints +
    roundGoalTotal +
    score.eggsCount +           // 1pt each
    score.cachedFoodCount +     // 1pt each
    score.tuckedCardsCount      // 1pt each
  );

  // Add nectar points if Oceania expansion is active
  if (includeNectar) {
    total += nectarPoints;
  }

  return total;
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
 * Create empty nectar scores for a new score
 */
export function createEmptyNectarScores(): NectarScores {
  return {
    forest: 0,
    grassland: 0,
    wetland: 0,
  };
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
    nectarScores: createEmptyNectarScores(),
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
export function getScoreBreakdown(score: ScoreInput, nectarPoints: number = 0): {
  birdCardPoints: number;
  bonusCardPoints: number;
  roundGoalPoints: number;
  eggsPoints: number;
  cachedFoodPoints: number;
  tuckedCardsPoints: number;
  nectarPoints: number;
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
    nectarPoints,
    total: calculateTotalScore(score, nectarPoints > 0, nectarPoints),
  };
}

/**
 * Calculate nectar points for all players based on majority scoring
 * Returns a map of playerId -> total nectar points
 *
 * Oceania Expansion Rules:
 * - For each habitat (forest, grassland, wetland):
 *   - Player with most nectar: 5 points
 *   - Player with second most: 2 points
 *   - Ties split points evenly (rounded down)
 *   - Must have at least 1 nectar to qualify
 */
export function calculateAllNectarPoints(
  playerScores: { playerId: string; nectarScores: NectarScores }[]
): Record<string, number> {
  const playerNectarPoints: Record<string, number> = {};

  // Initialize all players with 0 points
  for (const { playerId } of playerScores) {
    playerNectarPoints[playerId] = 0;
  }

  // Calculate points for each habitat
  for (const habitat of HABITATS) {
    const habitatPoints = calculateNectarPointsForHabitat(playerScores, habitat);
    for (const [playerId, points] of Object.entries(habitatPoints)) {
      playerNectarPoints[playerId] += points;
    }
  }

  return playerNectarPoints;
}

/**
 * Calculate nectar points for a single habitat
 */
export function calculateNectarPointsForHabitat(
  playerScores: { playerId: string; nectarScores: NectarScores }[],
  habitat: Habitat
): Record<string, number> {
  const habitatPoints: Record<string, number> = {};

  // Get nectar counts for this habitat, filtering out zeros
  const playersWithNectar = playerScores
    .map(({ playerId, nectarScores }) => ({
      playerId,
      nectar: nectarScores[habitat],
    }))
    .filter(p => p.nectar > 0)
    .sort((a, b) => b.nectar - a.nectar);

  if (playersWithNectar.length === 0) {
    return habitatPoints;
  }

  // Group players by nectar amount
  const groups: { nectar: number; playerIds: string[] }[] = [];
  for (const player of playersWithNectar) {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.nectar === player.nectar) {
      lastGroup.playerIds.push(player.playerId);
    } else {
      groups.push({ nectar: player.nectar, playerIds: [player.playerId] });
    }
  }

  // Award first place points
  const firstPlaceGroup = groups[0];
  if (firstPlaceGroup) {
    const pointsToSplit = firstPlaceGroup.playerIds.length === 1
      ? NECTAR_POINTS.first
      : (firstPlaceGroup.playerIds.length > 1
        ? NECTAR_POINTS.first + NECTAR_POINTS.second
        : NECTAR_POINTS.first);

    // If only first place group exists and has multiple players, they split first and second
    if (firstPlaceGroup.playerIds.length === 1) {
      habitatPoints[firstPlaceGroup.playerIds[0]] = NECTAR_POINTS.first;

      // Award second place points
      const secondPlaceGroup = groups[1];
      if (secondPlaceGroup) {
        const secondPoints = Math.floor(NECTAR_POINTS.second / secondPlaceGroup.playerIds.length);
        for (const playerId of secondPlaceGroup.playerIds) {
          habitatPoints[playerId] = secondPoints;
        }
      }
    } else {
      // Multiple players tied for first - they split first + second place points
      const sharedPoints = Math.floor((NECTAR_POINTS.first + NECTAR_POINTS.second) / firstPlaceGroup.playerIds.length);
      for (const playerId of firstPlaceGroup.playerIds) {
        habitatPoints[playerId] = sharedPoints;
      }
    }
  }

  return habitatPoints;
}

/**
 * Get total nectar spent across all habitats
 */
export function getTotalNectarSpent(nectarScores: NectarScores): number {
  return nectarScores.forest + nectarScores.grassland + nectarScores.wetland;
}
