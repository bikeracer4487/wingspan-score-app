import React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NewGameStackParamList } from './types';
import { colors } from '../constants/colors';
import { fontFamilies } from '../constants/typography';

// Import screens
import { SelectPlayersScreen } from '../screens/game/SelectPlayersScreen';
import { SelectModeScreen } from '../screens/game/SelectModeScreen';
import { ScoreEntryScreen } from '../screens/game/ScoreEntryScreen';
import { ReviewScoresScreen } from '../screens/game/ReviewScoresScreen';
import { GameResultsScreen } from '../screens/game/GameResultsScreen';

const Stack = createNativeStackNavigator<NewGameStackParamList>();

export function NewGameNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.cream,
        },
        headerTintColor: colors.primary.forest,
        headerTitleStyle: {
          fontFamily: fontFamilies.display.semiBold,
        },
        headerTitleAlign: Platform.OS === 'android' ? 'center' : undefined,
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background.cream,
        },
      }}
    >
      <Stack.Screen
        name="SelectPlayers"
        component={SelectPlayersScreen}
        options={{
          title: 'Select Players',
          headerBackTitle: 'Cancel',
        }}
      />
      <Stack.Screen
        name="SelectMode"
        component={SelectModeScreen}
        options={{
          title: 'Scoring Mode',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="ScoreEntry"
        component={ScoreEntryScreen}
        options={{
          title: 'Enter Scores',
          headerBackTitle: 'Back',
          gestureEnabled: false, // Prevent accidental swipe back
        }}
      />
      <Stack.Screen
        name="ReviewScores"
        component={ReviewScoresScreen}
        options={{
          title: 'Review Scores',
          headerBackTitle: 'Edit',
        }}
      />
      <Stack.Screen
        name="GameResults"
        component={GameResultsScreen}
        options={{
          title: 'Results',
          headerShown: false, // Full screen results
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}
