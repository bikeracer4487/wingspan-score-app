import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { GameStackParamList } from './types';
import { colors } from '../constants/colors';
import { fontFamilies } from '../constants/typography';

// Import screens
import { GameDetailScreen } from '../screens/history/GameDetailScreen';
import { EditGameScreen } from '../screens/history/EditGameScreen';

const Stack = createNativeStackNavigator<GameStackParamList>();

export function GameNavigator() {
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
      <Stack.Screen
        name="GameDetail"
        component={GameDetailScreen}
        options={{
          title: 'Game Details',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="EditGame"
        component={EditGameScreen}
        options={{
          title: 'Edit Game',
          headerBackTitle: 'Cancel',
        }}
      />
    </Stack.Navigator>
  );
}
