import { getDatabase } from '../database';
import type { Game, GameScore, GameWithScores, RoundGoalScore, GoalScoringMode, Expansion, NectarScores } from '../../types/models';
import { generateUUID } from '../../utils/uuid';

interface GameRow {
  id: string;
  played_at: number;
  goal_scoring_mode: string;
  player_count: number;
  is_complete: number;
  notes: string | null;
  expansions: string;
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
  nectar_forest: number;
  nectar_grassland: number;
  nectar_wetland: number;
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

function parseExpansions(expansionsJson: string | null | undefined): Expansion[] {
  if (!expansionsJson) return [];
  try {
    return JSON.parse(expansionsJson) as Expansion[];
  } catch {
    return [];
  }
}

function rowToGame(row: GameRow): Game {
  return {
    id: row.id,
    playedAt: row.played_at,
    goalScoringMode: row.goal_scoring_mode as GoalScoringMode,
    playerCount: row.player_count,
    isComplete: row.is_complete === 1,
    notes: row.notes ?? undefined,
    expansions: parseExpansions(row.expansions),
  };
}

function rowToGameScore(row: GameScoreRow, roundGoals: RoundGoalScore[]): GameScore {
  const nectarScores: NectarScores = {
    forest: row.nectar_forest ?? 0,
    grassland: row.nectar_grassland ?? 0,
    wetland: row.nectar_wetland ?? 0,
  };

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
    nectarScores,
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
    expansions: Expansion[] = [],
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
      expansions,
    };

    await db.runAsync(
      `INSERT INTO games (id, played_at, goal_scoring_mode, player_count, is_complete, notes, expansions)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [game.id, game.playedAt, game.goalScoringMode, game.playerCount, 0, game.notes ?? null, JSON.stringify(expansions)]
    );

    return game;
  },

  /**
   * Save a game score
   */
  async saveScore(score: GameScore): Promise<void> {
    const db = getDatabase();

    // Get nectar scores (default to 0 if not provided)
    const nectarForest = score.nectarScores?.forest ?? 0;
    const nectarGrassland = score.nectarScores?.grassland ?? 0;
    const nectarWetland = score.nectarScores?.wetland ?? 0;

    await db.runAsync(
      `INSERT OR REPLACE INTO game_scores
       (id, game_id, player_id, bird_card_points, bonus_card_points, eggs_count,
        cached_food_count, tucked_cards_count, unused_food_tokens,
        nectar_forest, nectar_grassland, nectar_wetland,
        total_score, finish_position, is_winner)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        nectarForest,
        nectarGrassland,
        nectarWetland,
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
   * Update a game score
   */
  async updateScore(
    scoreId: string,
    updates: Partial<{
      birdCardPoints: number;
      bonusCardPoints: number;
      eggsCount: number;
      cachedFoodCount: number;
      tuckedCardsCount: number;
      unusedFoodTokens: number;
      roundGoals: { round: 1 | 2 | 3 | 4; points: number }[];
    }>
  ): Promise<void> {
    const db = getDatabase();
    const setClauses: string[] = [];
    const values: (number | null)[] = [];

    if (updates.birdCardPoints !== undefined) {
      setClauses.push('bird_card_points = ?');
      values.push(updates.birdCardPoints);
    }
    if (updates.bonusCardPoints !== undefined) {
      setClauses.push('bonus_card_points = ?');
      values.push(updates.bonusCardPoints);
    }
    if (updates.eggsCount !== undefined) {
      setClauses.push('eggs_count = ?');
      values.push(updates.eggsCount);
    }
    if (updates.cachedFoodCount !== undefined) {
      setClauses.push('cached_food_count = ?');
      values.push(updates.cachedFoodCount);
    }
    if (updates.tuckedCardsCount !== undefined) {
      setClauses.push('tucked_cards_count = ?');
      values.push(updates.tuckedCardsCount);
    }
    if (updates.unusedFoodTokens !== undefined) {
      setClauses.push('unused_food_tokens = ?');
      values.push(updates.unusedFoodTokens);
    }

    // Calculate new total score
    const currentScore = await db.getFirstAsync<GameScoreRow>(
      'SELECT * FROM game_scores WHERE id = ?',
      [scoreId]
    );
    if (currentScore) {
      const birdCardPoints = updates.birdCardPoints ?? currentScore.bird_card_points;
      const bonusCardPoints = updates.bonusCardPoints ?? currentScore.bonus_card_points;
      const eggsCount = updates.eggsCount ?? currentScore.eggs_count;
      const cachedFoodCount = updates.cachedFoodCount ?? currentScore.cached_food_count;
      const tuckedCardsCount = updates.tuckedCardsCount ?? currentScore.tucked_cards_count;

      // Get round goal points
      let roundGoalPoints = 0;
      if (updates.roundGoals) {
        roundGoalPoints = updates.roundGoals.reduce((sum, rg) => sum + rg.points, 0);
      } else {
        const roundGoals = await db.getAllAsync<RoundGoalRow>(
          'SELECT * FROM round_goal_scores WHERE game_score_id = ?',
          [scoreId]
        );
        roundGoalPoints = roundGoals.reduce((sum, rg) => sum + rg.points, 0);
      }

      const totalScore = birdCardPoints + bonusCardPoints + roundGoalPoints + eggsCount + cachedFoodCount + tuckedCardsCount;
      setClauses.push('total_score = ?');
      values.push(totalScore);
    }

    if (setClauses.length > 0) {
      values.push(scoreId as unknown as number); // TypeScript workaround
      await db.runAsync(
        `UPDATE game_scores SET ${setClauses.join(', ')} WHERE id = ?`,
        values
      );
    }

    // Update round goals if provided
    if (updates.roundGoals) {
      // Delete existing round goals
      await db.runAsync('DELETE FROM round_goal_scores WHERE game_score_id = ?', [scoreId]);

      // Insert new round goals
      for (const rg of updates.roundGoals) {
        const rgId = generateUUID();
        await db.runAsync(
          'INSERT INTO round_goal_scores (id, game_score_id, round_number, points) VALUES (?, ?, ?, ?)',
          [rgId, scoreId, rg.round, rg.points]
        );
      }
    }

    // Recalculate finish positions for all players in the game
    if (currentScore) {
      await this.recalculatePositions(currentScore.game_id);
    }
  },

  /**
   * Recalculate finish positions for all players in a game
   */
  async recalculatePositions(gameId: string): Promise<void> {
    const db = getDatabase();

    // Get all scores for this game, sorted by total score (desc) and unused food (desc) for tiebreaker
    const scores = await db.getAllAsync<GameScoreRow>(
      'SELECT * FROM game_scores WHERE game_id = ? ORDER BY total_score DESC, unused_food_tokens DESC',
      [gameId]
    );

    const highScore = scores[0]?.total_score ?? 0;

    for (let i = 0; i < scores.length; i++) {
      const score = scores[i];
      const position = i + 1;
      const isWinner = score.total_score === highScore;

      await db.runAsync(
        'UPDATE game_scores SET finish_position = ?, is_winner = ? WHERE id = ?',
        [position, isWinner ? 1 : 0, score.id]
      );
    }
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
