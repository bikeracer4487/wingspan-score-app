import { useState, useEffect, useCallback } from 'react';
import type { PlayerStats, HeadToHead } from '../types/models';
import { statsRepository } from '../db/repositories/statsRepository';

/**
 * Hook to get stats for a player
 */
export function usePlayerStats(playerId: string | null) {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadStats = useCallback(async () => {
    if (!playerId) {
      setStats(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await statsRepository.getPlayerStats(playerId);
      setStats(data);
      setError(null);
    } catch (e) {
      console.error('Failed to load player stats:', e);
      setError(e instanceof Error ? e : new Error('Failed to load stats'));
    } finally {
      setIsLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return { stats, isLoading, error, refresh: loadStats };
}

/**
 * Hook to get head-to-head record
 */
export function useHeadToHead(playerId: string | null, opponentId: string | null) {
  const [record, setRecord] = useState<HeadToHead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!playerId || !opponentId) {
      setRecord(null);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const pId = playerId; // Capture for closure
    const oId = opponentId; // Capture for closure

    async function load() {
      try {
        setIsLoading(true);
        const data = await statsRepository.getHeadToHead(pId, oId);
        if (isMounted) {
          setRecord(data);
          setError(null);
        }
      } catch (e) {
        console.error('Failed to load head-to-head:', e);
        if (isMounted) {
          setError(e instanceof Error ? e : new Error('Failed to load head-to-head'));
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
  }, [playerId, opponentId]);

  return { record, isLoading, error };
}

/**
 * Hook to get all head-to-head records for a player
 */
export function useAllHeadToHead(playerId: string | null) {
  const [records, setRecords] = useState<HeadToHead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!playerId) {
      setRecords([]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const id = playerId; // Capture for closure

    async function load() {
      try {
        setIsLoading(true);
        const data = await statsRepository.getAllHeadToHead(id);
        if (isMounted) {
          setRecords(data);
          setError(null);
        }
      } catch (e) {
        console.error('Failed to load head-to-head records:', e);
        if (isMounted) {
          setError(e instanceof Error ? e : new Error('Failed to load head-to-head records'));
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
  }, [playerId]);

  return { records, isLoading, error };
}

/**
 * Hook to get leaderboard
 */
export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<Array<PlayerStats & { playerName: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadLeaderboard = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await statsRepository.getLeaderboard();
      setLeaderboard(data);
      setError(null);
    } catch (e) {
      console.error('Failed to load leaderboard:', e);
      setError(e instanceof Error ? e : new Error('Failed to load leaderboard'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  return { leaderboard, isLoading, error, refresh: loadLeaderboard };
}
