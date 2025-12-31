import type { GameScore, PlayerStats, HeadToHead, GameWithScores } from '../types/models';

/**
 * Calculate win streak from game history
 */
export function calculateWinStreak(
  gameResults: Array<{ isWinner: boolean; playedAt: number }>
): { current: number; best: number } {
  if (gameResults.length === 0) {
    return { current: 0, best: 0 };
  }

  // Sort by date descending (most recent first)
  const sorted = [...gameResults].sort((a, b) => b.playedAt - a.playedAt);

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  let foundFirstLoss = false;

  for (const result of sorted) {
    if (result.isWinner) {
      tempStreak++;
      if (!foundFirstLoss) {
        currentStreak = tempStreak;
      }
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      foundFirstLoss = true;
      tempStreak = 0;
    }
  }

  return { current: currentStreak, best: bestStreak };
}

/**
 * Calculate average by category
 */
export function calculateCategoryAverages(
  scores: GameScore[]
): {
  avgBirdCardPoints: number;
  avgBonusCardPoints: number;
  avgRoundGoalPoints: number;
  avgEggsPoints: number;
  avgCachedFoodPoints: number;
  avgTuckedCardsPoints: number;
} {
  if (scores.length === 0) {
    return {
      avgBirdCardPoints: 0,
      avgBonusCardPoints: 0,
      avgRoundGoalPoints: 0,
      avgEggsPoints: 0,
      avgCachedFoodPoints: 0,
      avgTuckedCardsPoints: 0,
    };
  }

  const sum = scores.reduce(
    (acc, s) => ({
      birdCardPoints: acc.birdCardPoints + s.birdCardPoints,
      bonusCardPoints: acc.bonusCardPoints + s.bonusCardPoints,
      roundGoalPoints: acc.roundGoalPoints + s.roundGoals.reduce((total, rg) => total + rg.points, 0),
      eggsPoints: acc.eggsPoints + s.eggsCount,
      cachedFoodPoints: acc.cachedFoodPoints + s.cachedFoodCount,
      tuckedCardsPoints: acc.tuckedCardsPoints + s.tuckedCardsCount,
    }),
    {
      birdCardPoints: 0,
      bonusCardPoints: 0,
      roundGoalPoints: 0,
      eggsPoints: 0,
      cachedFoodPoints: 0,
      tuckedCardsPoints: 0,
    }
  );

  const count = scores.length;
  return {
    avgBirdCardPoints: Math.round((sum.birdCardPoints / count) * 10) / 10,
    avgBonusCardPoints: Math.round((sum.bonusCardPoints / count) * 10) / 10,
    avgRoundGoalPoints: Math.round((sum.roundGoalPoints / count) * 10) / 10,
    avgEggsPoints: Math.round((sum.eggsPoints / count) * 10) / 10,
    avgCachedFoodPoints: Math.round((sum.cachedFoodPoints / count) * 10) / 10,
    avgTuckedCardsPoints: Math.round((sum.tuckedCardsPoints / count) * 10) / 10,
  };
}

/**
 * Calculate head-to-head record between two players
 */
export function calculateHeadToHead(
  playerId: string,
  opponentId: string,
  games: GameWithScores[]
): HeadToHead {
  let wins = 0;
  let losses = 0;
  let ties = 0;
  let gamesPlayed = 0;

  for (const game of games) {
    const playerScore = game.scores.find((s) => s.playerId === playerId);
    const opponentScore = game.scores.find((s) => s.playerId === opponentId);

    // Both must have played in the game
    if (!playerScore || !opponentScore) continue;

    gamesPlayed++;

    if (playerScore.finishPosition < opponentScore.finishPosition) {
      wins++;
    } else if (playerScore.finishPosition > opponentScore.finishPosition) {
      losses++;
    } else {
      ties++; // Same finish position = tied
    }
  }

  return { playerId, opponentId, wins, losses, ties, gamesPlayed };
}

/**
 * Calculate comprehensive player stats from game scores
 */
export function calculatePlayerStats(
  playerId: string,
  scores: GameScore[],
  gameDates: Record<string, number> // gameId -> playedAt
): PlayerStats {
  if (scores.length === 0) {
    return {
      playerId,
      totalGames: 0,
      wins: 0,
      losses: 0,
      ties: 0,
      winRate: 0,
      avgFinishPosition: 0,
      avgScore: 0,
      highScore: 0,
      lowScore: 0,
      avgBirdCardPoints: 0,
      avgBonusCardPoints: 0,
      avgRoundGoalPoints: 0,
      avgEggsPoints: 0,
      avgCachedFoodPoints: 0,
      avgTuckedCardsPoints: 0,
      currentWinStreak: 0,
      bestWinStreak: 0,
      last5Results: [],
    };
  }

  // Sort by date descending
  const sortedScores = [...scores].sort((a, b) => {
    const dateA = gameDates[a.gameId] ?? 0;
    const dateB = gameDates[b.gameId] ?? 0;
    return dateB - dateA;
  });

  const totalGames = scores.length;
  const wins = scores.filter((s) => s.isWinner).length;

  // Count ties (shared victories where multiple winners)
  // This is simplified - in practice we'd need to look at the full game
  const ties = 0; // TODO: Calculate from full game data
  const losses = totalGames - wins - ties;

  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

  const avgFinishPosition = totalGames > 0
    ? Math.round((scores.reduce((sum, s) => sum + s.finishPosition, 0) / totalGames) * 10) / 10
    : 0;

  const totalScores = scores.map((s) => s.totalScore);
  const avgScore = totalGames > 0
    ? Math.round((totalScores.reduce((sum, s) => sum + s, 0) / totalGames) * 10) / 10
    : 0;

  const highScore = Math.max(...totalScores, 0);
  const lowScore = Math.min(...totalScores.filter((s) => s > 0), 0);

  const categoryAverages = calculateCategoryAverages(scores);

  const gameResultsForStreak = sortedScores.map((s) => ({
    isWinner: s.isWinner,
    playedAt: gameDates[s.gameId] ?? 0,
  }));
  const streaks = calculateWinStreak(gameResultsForStreak);

  // Get last 5 results
  const last5Results: ('W' | 'L' | 'T')[] = sortedScores
    .slice(0, 5)
    .map((s) => (s.isWinner ? 'W' : 'L')); // TODO: Handle ties

  return {
    playerId,
    totalGames,
    wins,
    losses,
    ties,
    winRate,
    avgFinishPosition,
    avgScore,
    highScore,
    lowScore,
    ...categoryAverages,
    currentWinStreak: streaks.current,
    bestWinStreak: streaks.best,
    last5Results,
  };
}

/**
 * Get leaderboard sorted by wins
 */
export function getLeaderboard(
  playerStats: PlayerStats[]
): PlayerStats[] {
  return [...playerStats].sort((a, b) => {
    // Sort by wins descending
    if (b.wins !== a.wins) return b.wins - a.wins;
    // Then by win rate
    if (b.winRate !== a.winRate) return b.winRate - a.winRate;
    // Then by average score
    return b.avgScore - a.avgScore;
  });
}
