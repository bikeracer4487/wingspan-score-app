import { useState, useEffect, useCallback, useRef } from 'react';
import type { Player } from '../types/models';
import { playerRepository } from '../db/repositories/playerRepository';

/**
 * Hook to manage players
 */
export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadPlayers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await playerRepository.getAll();
      setPlayers(data);
      setError(null);
    } catch (e) {
      console.error('Failed to load players:', e);
      setError(e instanceof Error ? e : new Error('Failed to load players'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

  const createPlayer = useCallback(async (name: string, avatarId?: string): Promise<Player> => {
    const player = await playerRepository.create(name, avatarId);
    await loadPlayers();
    return player;
  }, [loadPlayers]);

  const updatePlayer = useCallback(async (
    id: string,
    updates: Partial<Pick<Player, 'name' | 'avatarColor' | 'avatarId'>>
  ): Promise<void> => {
    await playerRepository.update(id, updates);
    await loadPlayers();
  }, [loadPlayers]);

  const deletePlayer = useCallback(async (id: string): Promise<void> => {
    await playerRepository.softDelete(id);
    await loadPlayers();
  }, [loadPlayers]);

  const checkNameExists = useCallback(async (name: string, excludeId?: string): Promise<boolean> => {
    return playerRepository.nameExists(name, excludeId);
  }, []);

  return {
    players,
    isLoading,
    error,
    refresh: loadPlayers,
    createPlayer,
    updatePlayer,
    deletePlayer,
    checkNameExists,
  };
}

/**
 * Hook to get a single player
 */
export function usePlayer(playerId: string | null) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);

  const loadPlayer = useCallback(async () => {
    if (!playerId) {
      setPlayer(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await playerRepository.getById(playerId);
      if (isMountedRef.current) {
        setPlayer(data);
        setError(null);
      }
    } catch (e) {
      console.error('Failed to load player:', e);
      if (isMountedRef.current) {
        setError(e instanceof Error ? e : new Error('Failed to load player'));
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [playerId]);

  useEffect(() => {
    isMountedRef.current = true;
    loadPlayer();

    return () => {
      isMountedRef.current = false;
    };
  }, [loadPlayer]);

  return { player, isLoading, error, refresh: loadPlayer };
}
