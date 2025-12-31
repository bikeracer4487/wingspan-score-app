import { create } from 'zustand';

interface UIState {
  // App state
  isAppReady: boolean;
  isDatabaseReady: boolean;

  // Modal states
  isPlayerModalOpen: boolean;
  editingPlayerId: string | null;

  // Loading states
  isLoading: boolean;
  loadingMessage: string;

  // Error states
  error: string | null;

  // Haptic feedback preference
  hapticFeedbackEnabled: boolean;
}

interface UIActions {
  // App initialization
  setAppReady: (ready: boolean) => void;
  setDatabaseReady: (ready: boolean) => void;

  // Modal actions
  openPlayerModal: (playerId?: string) => void;
  closePlayerModal: () => void;

  // Loading actions
  setLoading: (loading: boolean, message?: string) => void;

  // Error actions
  setError: (error: string | null) => void;
  clearError: () => void;

  // Preferences
  setHapticFeedback: (enabled: boolean) => void;
}

const initialState: UIState = {
  isAppReady: false,
  isDatabaseReady: false,
  isPlayerModalOpen: false,
  editingPlayerId: null,
  isLoading: false,
  loadingMessage: '',
  error: null,
  hapticFeedbackEnabled: true,
};

export const useUIStore = create<UIState & UIActions>((set) => ({
  ...initialState,

  setAppReady: (ready) => set({ isAppReady: ready }),

  setDatabaseReady: (ready) => set({ isDatabaseReady: ready }),

  openPlayerModal: (playerId) => set({
    isPlayerModalOpen: true,
    editingPlayerId: playerId ?? null,
  }),

  closePlayerModal: () => set({
    isPlayerModalOpen: false,
    editingPlayerId: null,
  }),

  setLoading: (loading, message = '') => set({
    isLoading: loading,
    loadingMessage: message,
  }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  setHapticFeedback: (enabled) => set({ hapticFeedbackEnabled: enabled }),
}));

// Convenience selectors
export const useAppReady = () => useUIStore((state) => state.isAppReady && state.isDatabaseReady);
export const useIsLoading = () => useUIStore((state) => state.isLoading);
export const useError = () => useUIStore((state) => state.error);
