import { create } from 'zustand';
import type { GoalScoringMode, ScoreInput, RankedScore, GameScore, Expansion, Habitat } from '../types/models';
import { createEmptyScoreInput, calculateTotalScore, getRoundGoalTotal } from '../utils/scoring';
import { calculateFinishPositions } from '../utils/tiebreaker';
import { generateUUID } from '../utils/uuid';
import { gameRepository } from '../db/repositories/gameRepository';

interface GameState {
  // Current game session
  gameId: string | null;
  playerIds: string[];
  playerNames: Record<string, string>;
  goalScoringMode: GoalScoringMode;
  expansions: Expansion[];
  currentPlayerIndex: number;
  scores: Record<string, ScoreInput>; // playerId -> ScoreInput

  // Game flow state
  isScoring: boolean;
  isReviewing: boolean;
  isComplete: boolean;

  // Results
  rankedScores: RankedScore[];
}

interface GameActions {
  // Game lifecycle
  startNewGame: (
    playerIds: string[],
    playerNames: Record<string, string>,
    mode: GoalScoringMode,
    expansions: Expansion[]
  ) => void;
  cancelGame: () => void;

  // Score entry
  setScore: (playerId: string, field: keyof ScoreInput, value: number) => void;
  setRoundGoal: (playerId: string, round: 1 | 2 | 3 | 4, points: number) => void;
  setNectarScore: (playerId: string, habitat: Habitat, value: number) => void;
  getCurrentPlayerScore: () => ScoreInput | null;
  getPlayerScore: (playerId: string) => ScoreInput | null;
  getTotalScore: (playerId: string) => number;
  hasExpansion: (expansion: Expansion) => boolean;

  // Navigation
  nextPlayer: () => void;
  previousPlayer: () => void;
  goToPlayer: (index: number) => void;

  // Review and finalize
  startReview: () => void;
  backToScoring: () => void;
  calculateResults: () => RankedScore[];
  finalizeGame: () => Promise<void>;

  // Reset
  reset: () => void;
}

const initialState: GameState = {
  gameId: null,
  playerIds: [],
  playerNames: {},
  goalScoringMode: 'competitive',
  expansions: [],
  currentPlayerIndex: 0,
  scores: {},
  isScoring: false,
  isReviewing: false,
  isComplete: false,
  rankedScores: [],
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,

  startNewGame: (playerIds, playerNames, mode, expansions) => {
    const scores: Record<string, ScoreInput> = {};
    for (const id of playerIds) {
      scores[id] = createEmptyScoreInput(id);
    }

    set({
      gameId: generateUUID(),
      playerIds,
      playerNames,
      goalScoringMode: mode,
      expansions,
      currentPlayerIndex: 0,
      scores,
      isScoring: true,
      isReviewing: false,
      isComplete: false,
      rankedScores: [],
    });
  },

  cancelGame: () => {
    set(initialState);
  },

  setScore: (playerId, field, value) => {
    const { scores } = get();
    const playerScore = scores[playerId];
    if (!playerScore) return;

    if (field === 'roundGoals') {
      // Use setRoundGoal for round goals
      return;
    }

    set({
      scores: {
        ...scores,
        [playerId]: {
          ...playerScore,
          [field]: Math.max(0, value),
        },
      },
    });
  },

  setRoundGoal: (playerId, round, points) => {
    const { scores } = get();
    const playerScore = scores[playerId];
    if (!playerScore) return;

    const newRoundGoals = playerScore.roundGoals.map((rg) =>
      rg.round === round ? { ...rg, points: Math.max(0, points) } : rg
    );

    set({
      scores: {
        ...scores,
        [playerId]: {
          ...playerScore,
          roundGoals: newRoundGoals,
        },
      },
    });
  },

  setNectarScore: (playerId, habitat, value) => {
    const { scores } = get();
    const playerScore = scores[playerId];
    if (!playerScore) return;

    set({
      scores: {
        ...scores,
        [playerId]: {
          ...playerScore,
          nectarScores: {
            ...playerScore.nectarScores,
            [habitat]: Math.max(0, value),
          },
        },
      },
    });
  },

  getCurrentPlayerScore: () => {
    const { playerIds, currentPlayerIndex, scores } = get();
    const playerId = playerIds[currentPlayerIndex];
    return playerId ? scores[playerId] ?? null : null;
  },

  getPlayerScore: (playerId) => {
    const { scores } = get();
    return scores[playerId] ?? null;
  },

  getTotalScore: (playerId) => {
    const { scores, expansions } = get();
    const score = scores[playerId];
    return score ? calculateTotalScore(score, expansions.includes('oceania')) : 0;
  },

  hasExpansion: (expansion) => {
    return get().expansions.includes(expansion);
  },

  nextPlayer: () => {
    const { currentPlayerIndex, playerIds } = get();
    if (currentPlayerIndex < playerIds.length - 1) {
      set({ currentPlayerIndex: currentPlayerIndex + 1 });
    }
  },

  previousPlayer: () => {
    const { currentPlayerIndex } = get();
    if (currentPlayerIndex > 0) {
      set({ currentPlayerIndex: currentPlayerIndex - 1 });
    }
  },

  goToPlayer: (index) => {
    const { playerIds } = get();
    if (index >= 0 && index < playerIds.length) {
      set({ currentPlayerIndex: index });
    }
  },

  startReview: () => {
    const rankedScores = get().calculateResults();
    set({
      isScoring: false,
      isReviewing: true,
      rankedScores,
    });
  },

  backToScoring: () => {
    set({
      isScoring: true,
      isReviewing: false,
    });
  },

  calculateResults: () => {
    const { playerIds, playerNames, scores, expansions } = get();
    const hasOceania = expansions.includes('oceania');

    const scoresForRanking = playerIds.map((playerId) => ({
      playerId,
      playerName: playerNames[playerId] ?? 'Unknown',
      score: scores[playerId] ?? createEmptyScoreInput(playerId),
    }));

    return calculateFinishPositions(scoresForRanking, hasOceania);
  },

  finalizeGame: async () => {
    const { gameId, goalScoringMode, playerIds, rankedScores, scores, expansions } = get();

    if (!gameId) return;

    // Create the game in database with expansions
    await gameRepository.create(goalScoringMode, playerIds.length, expansions);

    // Update game ID in DB (since we created it with a temp ID)
    const db = await import('../db/database').then((m) => m.getDatabase());
    await db.runAsync('UPDATE games SET id = ? WHERE id = (SELECT id FROM games ORDER BY played_at DESC LIMIT 1)', [gameId]);

    // Save all scores
    for (const ranked of rankedScores) {
      const scoreInput = scores[ranked.playerId];
      if (!scoreInput) continue;

      const gameScore: GameScore = {
        id: generateUUID(),
        gameId,
        playerId: ranked.playerId,
        birdCardPoints: scoreInput.birdCardPoints,
        bonusCardPoints: scoreInput.bonusCardPoints,
        roundGoals: scoreInput.roundGoals,
        eggsCount: scoreInput.eggsCount,
        cachedFoodCount: scoreInput.cachedFoodCount,
        tuckedCardsCount: scoreInput.tuckedCardsCount,
        nectarScores: scoreInput.nectarScores,
        unusedFoodTokens: scoreInput.unusedFoodTokens,
        totalScore: ranked.totalScore,
        finishPosition: ranked.finishPosition,
        isWinner: ranked.isWinner,
      };

      await gameRepository.saveScore(gameScore);
    }

    // Mark game as complete
    await gameRepository.markComplete(gameId);

    set({ isComplete: true });
  },

  reset: () => {
    set(initialState);
  },
}));

// Selector hooks for convenience
export const useCurrentPlayer = () => {
  return useGameStore((state) => {
    const playerId = state.playerIds[state.currentPlayerIndex];
    return {
      playerId,
      playerName: state.playerNames[playerId] ?? '',
      index: state.currentPlayerIndex,
      total: state.playerIds.length,
      isFirst: state.currentPlayerIndex === 0,
      isLast: state.currentPlayerIndex === state.playerIds.length - 1,
    };
  });
};

export const useGameProgress = () => {
  return useGameStore((state) => ({
    isScoring: state.isScoring,
    isReviewing: state.isReviewing,
    isComplete: state.isComplete,
    hasGame: state.gameId !== null,
  }));
};
