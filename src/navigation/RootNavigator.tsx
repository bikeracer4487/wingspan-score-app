import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { colors } from '../constants/colors';
import { fontFamilies } from '../constants/typography';

// Import navigators
import { MainTabNavigator } from './MainTabNavigator';
import { NewGameNavigator } from './NewGameNavigator';
import { PlayerNavigator } from './PlayerNavigator';
import { GameNavigator } from './GameNavigator';

// Import standalone screens
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
      <Stack.Screen
        name="Player"
        component={PlayerNavigator}
        options={{ headerShown: false }}
      />

      {/* Game detail */}
      <Stack.Screen
        name="Game"
        component={GameNavigator}
        options={{ headerShown: false }}
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
