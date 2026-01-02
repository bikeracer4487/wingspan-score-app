import * as SQLite from 'expo-sqlite';

const DB_NAME = 'wingspan.db';
let db: SQLite.SQLiteDatabase | null = null;

/**
 * Initialize the database and run migrations
 */
export async function initializeDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync(DB_NAME);

  // Enable foreign keys
  await db.execAsync('PRAGMA foreign_keys = ON;');

  // Run migrations
  await runMigrations(db);

  return db;
}

/**
 * Get the database instance (throws if not initialized)
 */
export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

/**
 * Run all database migrations
 */
async function runMigrations(database: SQLite.SQLiteDatabase): Promise<void> {
  // Create migrations table if not exists
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version INTEGER NOT NULL UNIQUE,
      applied_at INTEGER NOT NULL
    );
  `);

  // Get current version
  const result = await database.getFirstAsync<{ version: number }>(
    'SELECT MAX(version) as version FROM migrations'
  );
  const currentVersion = result?.version ?? 0;

  // Run pending migrations
  for (const migration of migrations) {
    if (migration.version > currentVersion) {
      console.log(`Running migration ${migration.version}: ${migration.name}`);
      await database.execAsync(migration.sql);
      await database.runAsync(
        'INSERT INTO migrations (version, applied_at) VALUES (?, ?)',
        [migration.version, Date.now()]
      );
    }
  }
}

/**
 * Database migrations
 */
const migrations: { version: number; name: string; sql: string }[] = [
  {
    version: 1,
    name: 'Initial schema',
    sql: `
      -- Players table
      CREATE TABLE IF NOT EXISTS players (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        avatar_color TEXT NOT NULL DEFAULT '#5B8C7B',
        created_at INTEGER NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1
      );

      CREATE INDEX IF NOT EXISTS idx_players_active ON players(is_active);
      CREATE INDEX IF NOT EXISTS idx_players_name ON players(name);

      -- Games table
      CREATE TABLE IF NOT EXISTS games (
        id TEXT PRIMARY KEY,
        played_at INTEGER NOT NULL,
        goal_scoring_mode TEXT NOT NULL CHECK(goal_scoring_mode IN ('competitive', 'casual')),
        player_count INTEGER NOT NULL CHECK(player_count BETWEEN 1 AND 5),
        is_complete INTEGER NOT NULL DEFAULT 0,
        notes TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_games_played_at ON games(played_at DESC);
      CREATE INDEX IF NOT EXISTS idx_games_complete ON games(is_complete);

      -- Game scores table
      CREATE TABLE IF NOT EXISTS game_scores (
        id TEXT PRIMARY KEY,
        game_id TEXT NOT NULL,
        player_id TEXT NOT NULL,

        bird_card_points INTEGER NOT NULL DEFAULT 0,
        bonus_card_points INTEGER NOT NULL DEFAULT 0,
        eggs_count INTEGER NOT NULL DEFAULT 0,
        cached_food_count INTEGER NOT NULL DEFAULT 0,
        tucked_cards_count INTEGER NOT NULL DEFAULT 0,
        unused_food_tokens INTEGER NOT NULL DEFAULT 0,

        total_score INTEGER NOT NULL DEFAULT 0,
        finish_position INTEGER,
        is_winner INTEGER NOT NULL DEFAULT 0,

        FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
        FOREIGN KEY (player_id) REFERENCES players(id),
        UNIQUE(game_id, player_id)
      );

      CREATE INDEX IF NOT EXISTS idx_game_scores_game ON game_scores(game_id);
      CREATE INDEX IF NOT EXISTS idx_game_scores_player ON game_scores(player_id);
      CREATE INDEX IF NOT EXISTS idx_game_scores_winner ON game_scores(is_winner);

      -- Round goal scores (separate table for normalization)
      CREATE TABLE IF NOT EXISTS round_goal_scores (
        id TEXT PRIMARY KEY,
        game_score_id TEXT NOT NULL,
        round_number INTEGER NOT NULL CHECK(round_number BETWEEN 1 AND 4),
        points INTEGER NOT NULL DEFAULT 0,

        FOREIGN KEY (game_score_id) REFERENCES game_scores(id) ON DELETE CASCADE,
        UNIQUE(game_score_id, round_number)
      );

      CREATE INDEX IF NOT EXISTS idx_round_goals_game_score ON round_goal_scores(game_score_id);
    `,
  },
  {
    version: 2,
    name: 'Add avatar_id to players',
    sql: `
      -- Add avatar_id column for bird profile images
      ALTER TABLE players ADD COLUMN avatar_id TEXT;

      -- Assign random bird avatars to existing players
      -- Using a deterministic mapping based on rowid to get varied birds
      UPDATE players SET avatar_id = (
        CASE (rowid % 10)
          WHEN 0 THEN 'cardinal'
          WHEN 1 THEN 'bluejay'
          WHEN 2 THEN 'robin'
          WHEN 3 THEN 'oriole'
          WHEN 4 THEN 'goldfinch'
          WHEN 5 THEN 'hummingbird'
          WHEN 6 THEN 'owl'
          WHEN 7 THEN 'hawk'
          WHEN 8 THEN 'eagle'
          WHEN 9 THEN 'falcon'
        END
      ) WHERE avatar_id IS NULL;
    `,
  },
  {
    version: 3,
    name: 'Add expansion support and nectar scoring',
    sql: `
      -- Add expansions column to games table (JSON array of expansion names)
      ALTER TABLE games ADD COLUMN expansions TEXT NOT NULL DEFAULT '[]';

      -- Add nectar scoring columns for Oceania expansion
      -- These track nectar spent in each habitat for majority scoring
      ALTER TABLE game_scores ADD COLUMN nectar_forest INTEGER NOT NULL DEFAULT 0;
      ALTER TABLE game_scores ADD COLUMN nectar_grassland INTEGER NOT NULL DEFAULT 0;
      ALTER TABLE game_scores ADD COLUMN nectar_wetland INTEGER NOT NULL DEFAULT 0;
    `,
  },
];

/**
 * Close the database connection
 */
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}

/**
 * Reset the database (for development/testing)
 */
export async function resetDatabase(): Promise<void> {
  if (db) {
    await db.execAsync(`
      DROP TABLE IF EXISTS round_goal_scores;
      DROP TABLE IF EXISTS game_scores;
      DROP TABLE IF EXISTS games;
      DROP TABLE IF EXISTS players;
      DROP TABLE IF EXISTS migrations;
    `);
    await runMigrations(db);
  }
}

// Alias for App.tsx
export const initDatabase = initializeDatabase;
