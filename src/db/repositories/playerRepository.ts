import { getDatabase } from '../database';
import type { Player } from '../../types/models';
import { generateUUID } from '../../utils/uuid';
import { DEFAULT_AVATAR_COLORS } from '../../constants/scoring';

interface PlayerRow {
  id: string;
  name: string;
  avatar_color: string;
  created_at: number;
  is_active: number;
}

function rowToPlayer(row: PlayerRow): Player {
  return {
    id: row.id,
    name: row.name,
    avatarColor: row.avatar_color,
    createdAt: row.created_at,
    isActive: row.is_active === 1,
  };
}

export const playerRepository = {
  /**
   * Get all active players
   */
  async getAll(): Promise<Player[]> {
    const db = getDatabase();
    const rows = await db.getAllAsync<PlayerRow>(
      'SELECT * FROM players WHERE is_active = 1 ORDER BY name COLLATE NOCASE'
    );
    return rows.map(rowToPlayer);
  },

  /**
   * Get all players including inactive
   */
  async getAllIncludingInactive(): Promise<Player[]> {
    const db = getDatabase();
    const rows = await db.getAllAsync<PlayerRow>(
      'SELECT * FROM players ORDER BY is_active DESC, name COLLATE NOCASE'
    );
    return rows.map(rowToPlayer);
  },

  /**
   * Get a player by ID
   */
  async getById(id: string): Promise<Player | null> {
    const db = getDatabase();
    const row = await db.getFirstAsync<PlayerRow>(
      'SELECT * FROM players WHERE id = ?',
      [id]
    );
    return row ? rowToPlayer(row) : null;
  },

  /**
   * Get multiple players by IDs
   */
  async getByIds(ids: string[]): Promise<Player[]> {
    if (ids.length === 0) return [];

    const db = getDatabase();
    const placeholders = ids.map(() => '?').join(',');
    const rows = await db.getAllAsync<PlayerRow>(
      `SELECT * FROM players WHERE id IN (${placeholders})`,
      ids
    );
    return rows.map(rowToPlayer);
  },

  /**
   * Create a new player
   */
  async create(name: string, avatarColor?: string): Promise<Player> {
    const db = getDatabase();

    // Get a random avatar color if not provided
    const color = avatarColor ?? DEFAULT_AVATAR_COLORS[
      Math.floor(Math.random() * DEFAULT_AVATAR_COLORS.length)
    ];

    const player: Player = {
      id: generateUUID(),
      name: name.trim(),
      avatarColor: color,
      createdAt: Date.now(),
      isActive: true,
    };

    await db.runAsync(
      `INSERT INTO players (id, name, avatar_color, created_at, is_active)
       VALUES (?, ?, ?, ?, ?)`,
      [player.id, player.name, player.avatarColor, player.createdAt, 1]
    );

    return player;
  },

  /**
   * Update a player
   */
  async update(
    id: string,
    updates: Partial<Pick<Player, 'name' | 'avatarColor'>>
  ): Promise<void> {
    const db = getDatabase();
    const setClauses: string[] = [];
    const values: (string | number)[] = [];

    if (updates.name !== undefined) {
      setClauses.push('name = ?');
      values.push(updates.name.trim());
    }
    if (updates.avatarColor !== undefined) {
      setClauses.push('avatar_color = ?');
      values.push(updates.avatarColor);
    }

    if (setClauses.length === 0) return;

    values.push(id);
    await db.runAsync(
      `UPDATE players SET ${setClauses.join(', ')} WHERE id = ?`,
      values
    );
  },

  /**
   * Soft delete a player (keeps data for historical games)
   */
  async softDelete(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('UPDATE players SET is_active = 0 WHERE id = ?', [id]);
  },

  /**
   * Restore a soft-deleted player
   */
  async restore(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('UPDATE players SET is_active = 1 WHERE id = ?', [id]);
  },

  /**
   * Check if a player name already exists
   */
  async nameExists(name: string, excludeId?: string): Promise<boolean> {
    const db = getDatabase();
    const trimmed = name.trim().toLowerCase();

    let query = 'SELECT COUNT(*) as count FROM players WHERE LOWER(name) = ? AND is_active = 1';
    const params: string[] = [trimmed];

    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }

    const result = await db.getFirstAsync<{ count: number }>(query, params);
    return (result?.count ?? 0) > 0;
  },

  /**
   * Get player count
   */
  async getCount(): Promise<number> {
    const db = getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM players WHERE is_active = 1'
    );
    return result?.count ?? 0;
  },
};
