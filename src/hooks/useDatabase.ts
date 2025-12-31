import { useEffect, useState } from 'react';
import { initializeDatabase } from '../db/database';
import { useUIStore } from '../stores/uiStore';

/**
 * Hook to initialize the database on app start
 */
export function useDatabase() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const setDatabaseReady = useUIStore((state) => state.setDatabaseReady);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        await initializeDatabase();
        if (isMounted) {
          setIsReady(true);
          setDatabaseReady(true);
        }
      } catch (e) {
        console.error('Failed to initialize database:', e);
        if (isMounted) {
          setError(e instanceof Error ? e : new Error('Database initialization failed'));
        }
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [setDatabaseReady]);

  return { isReady, error };
}
