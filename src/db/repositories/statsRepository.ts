import { getDatabase } from '../database';
import type { GameScore, PlayerStats, HeadToHead, RoundGoalScore } from '../../types/models';
import { calculatePlayerStats, calculateHeadToHead } from '../../utils/stats';
import { gameRepository } from './gameRepository';

interface ScoreRow {
  id: string;
  game_id: string;
  player_id: string;
  bird_card_points: number;
  bonus_card_points: number;
  eggs_count: number;
  cached_food_count: number;
  tucked_cards_count: number;
  unused_food_tokens: number;
  total_score: number;
  finish_position: number | null;
  is_winner: number;
  played_at: number;
}

interface RoundGoalRow {
  round_number: number;
  points: number;
}

export const statsRepository = {
  /**
   * Get all scores for a player
   */
  async getScoresForPlayer(playerId: string): Promise<GameScore[]> {
    const db = getDatabase();

    const scoreRows = await db.getAllAsync<ScoreRow>(
      `SELECT gs.*, g.played_at
       FROM game_scores gs
       INNER JOIN games g ON gs.game_id = g.id
       WHERE gs.player_id = ? AND g.is_complete = 1
       ORDER BY g.played_at DESC`,
      [playerId]
    );

    const scores: GameScore[] = [];

    for (const row of scoreRows) {
      const roundGoalRows = await db.getAllAsync<RoundGoalRow>(
        `SELECT round_number, points FROM round_goal_scores WHERE game_score_id = ?`,
        [row.id]
      );

      const roundGoals: RoundGoalScore[] = roundGoalRows.map((rg) => ({
        round: rg.round_number as 1 | 2 | 3 | 4,
        points: rg.points,
      }));

      scores.push({
        id: row.id,
        gameId: row.game_id,
        playerId: row.player_id,
        birdCardPoints: row.bird_card_points,
        bonusCardPoints: row.bonus_card_points,
        roundGoals,
        eggsCount: row.eggs_count,
        cachedFoodCount: row.cached_food_count,
        tuckedCardsCount: row.tucked_cards_count,
        unusedFoodTokens: row.unused_food_tokens,
        totalScore: row.total_score,
        finishPosition: row.finish_position ?? 0,
        isWinner: row.is_winner === 1,
      });
    }

    return scores;
  },

  /**
   * Get comprehensive stats for a player
   */
  async getPlayerStats(playerId: string): Promise<PlayerStats> {
    const db = getDatabase();
    const scores = await this.getScoresForPlayer(playerId);

    // Get game dates
    const gameIds = [...new Set(scores.map((s) => s.gameId))];
    const gameDates: Record<string, number> = {};

    if (gameIds.length > 0) {
      const placeholders = gameIds.map(() => '?').join(',');
      const gameRows = await db.getAllAsync<{ id: string; played_at: number }>(
        `SELECT id, played_at FROM games WHERE id IN (${placeholders})`,
        gameIds
      );
      for (const row of gameRows) {
        gameDates[row.id] = row.played_at;
      }
    }

    return calculatePlayerStats(playerId, scores, gameDates);
  },

  /**
   * Get head-to-head record between two players
   */
  async getHeadToHead(playerId: string, opponentId: string): Promise<HeadToHead> {
    // Get all games where both players participated
    const games = await gameRepository.getGamesForPlayer(playerId);
    const gamesWithOpponent = games.filter((g) =>
      g.scores.some((s) => s.playerId === opponentId)
    );

    return calculateHeadToHead(playerId, opponentId, gamesWithOpponent);
  },

  /**
   * Get all head-to-head records for a player
   */
  async getAllHeadToHead(playerId: string): Promise<HeadToHead[]> {
    const db = getDatabase();

    // Get all opponents this player has played against
    const opponentRows = await db.getAllAsync<{ player_id: string }>(
      `SELECT DISTINCT gs2.player_id
       FROM game_scores gs1
       INNER JOIN game_scores gs2 ON gs1.game_id = gs2.game_id
       INNER JOIN games g ON gs1.game_id = g.id
       WHERE gs1.player_id = ? AND gs2.player_id != ? AND g.is_complete = 1`,
      [playerId, playerId]
    );

    const records: HeadToHead[] = [];
    for (const row of opponentRows) {
      const h2h = await this.getHeadToHead(playerId, row.player_id);
      records.push(h2h);
    }

    return records;
  },

  /**
   * Get leaderboard data for all players
   */
  async getLeaderboard(): Promise<Array<PlayerStats & { playerName: string }>> {
    const db = getDatabase();

    // Get all active players
    const playerRows = await db.getAllAsync<{ id: string; name: string }>(
      'SELECT id, name FROM players WHERE is_active = 1'
    );

    const leaderboard: Array<PlayerStats & { playerName: string }> = [];

    for (const player of playerRows) {
      const stats = await this.getPlayerStats(player.id);
      if (stats.totalGames > 0) {
        leaderboard.push({ ...stats, playerName: player.name });
      }
    }

    // Sort by wins, then win rate, then average score
    leaderboard.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.winRate !== a.winRate) return b.winRate - a.winRate;
      return b.avgScore - a.avgScore;
    });

    return leaderboard;
  },

  /**
   * Get high score across all games
   */
  async getHighScore(): Promise<{ score: number; playerId: string; gameId: string } | null> {
    const db = getDatabase();

    const result = await db.getFirstAsync<{
      total_score: number;
      player_id: string;
      game_id: string;
    }>(
      `SELECT total_score, player_id, game_id
       FROM game_scores gs
       INNER JOIN games g ON gs.game_id = g.id
       WHERE g.is_complete = 1
       ORDER BY total_score DESC
       LIMIT 1`
    );

    if (!result) return null;

    return {
      score: result.total_score,
      playerId: result.player_id,
      gameId: result.game_id,
    };
  },

  /**
   * Get average score across all games
   */
  async getAverageScore(): Promise<number> {
    const db = getDatabase();

    const result = await db.getFirstAsync<{ avg_score: number }>(
      `SELECT AVG(total_score) as avg_score
       FROM game_scores gs
       INNER JOIN games g ON gs.game_id = g.id
       WHERE g.is_complete = 1`
    );

    return Math.round((result?.avg_score ?? 0) * 10) / 10;
  },
};
