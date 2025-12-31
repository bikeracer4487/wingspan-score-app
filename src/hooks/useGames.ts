import { useState, useEffect, useCallback } from 'react';
import type { Game, GameWithScores } from '../types/models';
import { gameRepository } from '../db/repositories/gameRepository';

/**
 * Hook to get recent games
 */
export function useRecentGames(limit: number = 5) {
  const [games, setGames] = useState<GameWithScores[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadGames = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await gameRepository.getRecent(limit);
      setGames(data);
      setError(null);
    } catch (e) {
      console.error('Failed to load games:', e);
      setError(e instanceof Error ? e : new Error('Failed to load games'));
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  return { games, isLoading, error, refresh: loadGames };
}

/**
 * Hook to get all games
 */
export function useAllGames() {
  const [games, setGames] = useState<GameWithScores[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadGames = useCallback(async () => {
    try {
      setIsLoading(true);
      const allGames = await gameRepository.getAll();
      const gamesWithScores: GameWithScores[] = [];

      for (const game of allGames) {
        const withScores = await gameRepository.getWithScores(game.id);
        if (withScores) {
          gamesWithScores.push(withScores);
        }
      }

      setGames(gamesWithScores);
      setError(null);
    } catch (e) {
      console.error('Failed to load games:', e);
      setError(e instanceof Error ? e : new Error('Failed to load games'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  const deleteGame = useCallback(async (id: string): Promise<void> => {
    await gameRepository.delete(id);
    await loadGames();
  }, [loadGames]);

  return { games, isLoading, error, refresh: loadGames, deleteGame };
}

/**
 * Hook to get a single game with scores
 */
export function useGame(gameId: string | null) {
  const [game, setGame] = useState<GameWithScores | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!gameId) {
      setGame(null);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const id = gameId; // Capture for closure

    async function load() {
      try {
        setIsLoading(true);
        const data = await gameRepository.getWithScores(id);
        if (isMounted) {
          setGame(data);
          setError(null);
        }
      } catch (e) {
        console.error('Failed to load game:', e);
        if (isMounted) {
          setError(e instanceof Error ? e : new Error('Failed to load game'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [gameId]);

  return { game, isLoading, error };
}

/**
 * Hook to get games for a specific player
 */
export function usePlayerGames(playerId: string | null, limit?: number) {
  const [games, setGames] = useState<GameWithScores[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!playerId) {
      setGames([]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const id = playerId; // Capture for closure

    async function load() {
      try {
        setIsLoading(true);
        const data = await gameRepository.getGamesForPlayer(id, limit);
        if (isMounted) {
          setGames(data);
          setError(null);
        }
      } catch (e) {
        console.error('Failed to load player games:', e);
        if (isMounted) {
          setError(e instanceof Error ? e : new Error('Failed to load player games'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [playerId, limit]);

  return { games, isLoading, error };
}
