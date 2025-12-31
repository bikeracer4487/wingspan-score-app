import { getDatabase } from '../database';
import type { Game, GameScore, GameWithScores, RoundGoalScore, GoalScoringMode } from '../../types/models';
import { generateUUID } from '../../utils/uuid';

interface GameRow {
  id: string;
  played_at: number;
  goal_scoring_mode: string;
  player_count: number;
  is_complete: number;
  notes: string | null;
}

interface GameScoreRow {
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
}

interface RoundGoalRow {
  id: string;
  game_score_id: string;
  round_number: number;
  points: number;
}

function rowToGame(row: GameRow): Game {
  return {
    id: row.id,
    playedAt: row.played_at,
    goalScoringMode: row.goal_scoring_mode as GoalScoringMode,
    playerCount: row.player_count,
    isComplete: row.is_complete === 1,
    notes: row.notes ?? undefined,
  };
}

function rowToGameScore(row: GameScoreRow, roundGoals: RoundGoalScore[]): GameScore {
  return {
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
  };
}

export const gameRepository = {
  /**
   * Get all completed games, most recent first
   */
  async getAll(limit?: number): Promise<Game[]> {
    const db = getDatabase();
    let query = 'SELECT * FROM games WHERE is_complete = 1 ORDER BY played_at DESC';
    if (limit) {
      query += ` LIMIT ${limit}`;
    }
    const rows = await db.getAllAsync<GameRow>(query);
    return rows.map(rowToGame);
  },

  /**
   * Get a game by ID
   */
  async getById(id: string): Promise<Game | null> {
    const db = getDatabase();
    const row = await db.getFirstAsync<GameRow>(
      'SELECT * FROM games WHERE id = ?',
      [id]
    );
    return row ? rowToGame(row) : null;
  },

  /**
   * Get a game with all its scores
   */
  async getWithScores(id: string): Promise<GameWithScores | null> {
    const db = getDatabase();

    const gameRow = await db.getFirstAsync<GameRow>(
      'SELECT * FROM games WHERE id = ?',
      [id]
    );
    if (!gameRow) return null;

    const game = rowToGame(gameRow);
    const scores = await this.getScoresForGame(id);

    // Get player names
    const playerIds = scores.map((s) => s.playerId);
    const playerNames: Record<string, string> = {};

    if (playerIds.length > 0) {
      const placeholders = playerIds.map(() => '?').join(',');
      const playerRows = await db.getAllAsync<{ id: string; name: string }>(
        `SELECT id, name FROM players WHERE id IN (${placeholders})`,
        playerIds
      );
      for (const p of playerRows) {
        playerNames[p.id] = p.name;
      }
    }

    return { ...game, scores, playerNames };
  },

  /**
   * Get scores for a game
   */
  async getScoresForGame(gameId: string): Promise<GameScore[]> {
    const db = getDatabase();

    const scoreRows = await db.getAllAsync<GameScoreRow>(
      'SELECT * FROM game_scores WHERE game_id = ? ORDER BY finish_position',
      [gameId]
    );

    const scores: GameScore[] = [];

    for (const row of scoreRows) {
      const roundGoalRows = await db.getAllAsync<RoundGoalRow>(
        'SELECT * FROM round_goal_scores WHERE game_score_id = ? ORDER BY round_number',
        [row.id]
      );

      const roundGoals: RoundGoalScore[] = roundGoalRows.map((rg) => ({
        round: rg.round_number as 1 | 2 | 3 | 4,
        points: rg.points,
      }));

      scores.push(rowToGameScore(row, roundGoals));
    }

    return scores;
  },

  /**
   * Create a new game
   */
  async create(
    goalScoringMode: GoalScoringMode,
    playerCount: number,
    notes?: string
  ): Promise<Game> {
    const db = getDatabase();

    const game: Game = {
      id: generateUUID(),
      playedAt: Date.now(),
      goalScoringMode,
      playerCount,
      isComplete: false,
      notes,
    };

    await db.runAsync(
      `INSERT INTO games (id, played_at, goal_scoring_mode, player_count, is_complete, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [game.id, game.playedAt, game.goalScoringMode, game.playerCount, 0, game.notes ?? null]
    );

    return game;
  },

  /**
   * Save a game score
   */
  async saveScore(score: GameScore): Promise<void> {
    const db = getDatabase();

    await db.runAsync(
      `INSERT OR REPLACE INTO game_scores
       (id, game_id, player_id, bird_card_points, bonus_card_points, eggs_count,
        cached_food_count, tucked_cards_count, unused_food_tokens, total_score,
        finish_position, is_winner)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        score.id,
        score.gameId,
        score.playerId,
        score.birdCardPoints,
        score.bonusCardPoints,
        score.eggsCount,
        score.cachedFoodCount,
        score.tuckedCardsCount,
        score.unusedFoodTokens,
        score.totalScore,
        score.finishPosition,
        score.isWinner ? 1 : 0,
      ]
    );

    // Save round goals
    for (const rg of score.roundGoals) {
      const rgId = generateUUID();
      await db.runAsync(
        `INSERT OR REPLACE INTO round_goal_scores (id, game_score_id, round_number, points)
         VALUES (?, ?, ?, ?)`,
        [rgId, score.id, rg.round, rg.points]
      );
    }
  },

  /**
   * Mark a game as complete
   */
  async markComplete(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('UPDATE games SET is_complete = 1 WHERE id = ?', [id]);
  },

  /**
   * Delete a game and its scores
   */
  async delete(id: string): Promise<void> {
    const db = getDatabase();
    // Cascading delete will handle game_scores and round_goal_scores
    await db.runAsync('DELETE FROM games WHERE id = ?', [id]);
  },

  /**
   * Get games for a specific player
   */
  async getGamesForPlayer(playerId: string, limit?: number): Promise<GameWithScores[]> {
    const db = getDatabase();

    let query = `
      SELECT DISTINCT g.*
      FROM games g
      INNER JOIN game_scores gs ON g.id = gs.game_id
      WHERE gs.player_id = ? AND g.is_complete = 1
      ORDER BY g.played_at DESC
    `;
    if (limit) {
      query += ` LIMIT ${limit}`;
    }

    const gameRows = await db.getAllAsync<GameRow>(query, [playerId]);
    const games: GameWithScores[] = [];

    for (const row of gameRows) {
      const game = await this.getWithScores(row.id);
      if (game) {
        games.push(game);
      }
    }

    return games;
  },

  /**
   * Get total game count
   */
  async getCount(): Promise<number> {
    const db = getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM games WHERE is_complete = 1'
    );
    return result?.count ?? 0;
  },

  /**
   * Get recent games (last N)
   */
  async getRecent(limit: number = 5): Promise<GameWithScores[]> {
    const games = await this.getAll(limit);
    const gamesWithScores: GameWithScores[] = [];

    for (const game of games) {
      const withScores = await this.getWithScores(game.id);
      if (withScores) {
        gamesWithScores.push(withScores);
      }
    }

    return gamesWithScores;
  },
};
