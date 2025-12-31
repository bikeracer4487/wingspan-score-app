import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { colors } from '../constants/colors';
import { fontFamilies } from '../constants/typography';

// Import navigators
import { MainTabNavigator } from './MainTabNavigator';
import { NewGameNavigator } from './NewGameNavigator';

// Import standalone screens
import { PlayerDetailScreen } from '../screens/players/PlayerDetailScreen';
import { EditPlayerScreen } from '../screens/players/EditPlayerScreen';
import { GameDetailScreen } from '../screens/history/GameDetailScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
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
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background.cream,
        },
      }}
    >
      {/* Main tabs */}
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />

      {/* New Game Flow (modal) */}
      <Stack.Screen
        name="NewGame"
        component={NewGameNavigator}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />

      {/* Player screens */}
      <Stack.Group
        screenOptions={{
          presentation: 'card',
        }}
      >
        <Stack.Screen
          name="Player"
          component={PlayerDetailScreen}
          options={{ title: 'Player' }}
        />
      </Stack.Group>

      {/* Game detail */}
      <Stack.Screen
        name="Game"
        component={GameDetailScreen}
        options={{ title: 'Game Details' }}
      />

      {/* Settings */}
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}
