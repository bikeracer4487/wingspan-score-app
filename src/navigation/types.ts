import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Main Tab Navigator
export type MainTabParamList = {
  Home: undefined;
  Players: undefined;
  History: undefined;
  Stats: undefined;
};

// New Game Stack
export type NewGameStackParamList = {
  SelectPlayers: undefined;
  SelectMode: {
    playerIds: string[];
    playerNames: Record<string, string>;
  };
  ScoreEntry: undefined;
  ReviewScores: undefined;
  GameResults: undefined;
};

// Player Stack
export type PlayerStackParamList = {
  PlayerDetail: { playerId: string };
  EditPlayer: { playerId: string };
  HeadToHead: { playerId: string; opponentId: string };
};

// Game Stack
export type GameStackParamList = {
  GameDetail: { gameId: string };
};

// Root Navigator
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  NewGame: NavigatorScreenParams<NewGameStackParamList>;
  Player: NavigatorScreenParams<PlayerStackParamList>;
  Game: NavigatorScreenParams<GameStackParamList>;
  Settings: undefined;
};

// Screen Props Types
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  BottomTabScreenProps<MainTabParamList, T>;

export type NewGameScreenProps<T extends keyof NewGameStackParamList> =
  NativeStackScreenProps<NewGameStackParamList, T>;

export type PlayerScreenProps<T extends keyof PlayerStackParamList> =
  NativeStackScreenProps<PlayerStackParamList, T>;

export type GameScreenProps<T extends keyof GameStackParamList> =
  NativeStackScreenProps<GameStackParamList, T>;

// Declare global types for useNavigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
