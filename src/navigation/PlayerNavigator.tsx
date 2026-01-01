import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { PlayerStackParamList } from './types';
import { colors } from '../constants/colors';
import { fontFamilies } from '../constants/typography';

// Import screens
import { PlayerDetailScreen } from '../screens/players/PlayerDetailScreen';
import { EditPlayerScreen } from '../screens/players/EditPlayerScreen';

const Stack = createNativeStackNavigator<PlayerStackParamList>();

export function PlayerNavigator() {
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
        name="PlayerDetail"
        component={PlayerDetailScreen}
        options={{
          title: 'Player Stats',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="EditPlayer"
        component={EditPlayerScreen}
        options={{
          title: 'Edit Player',
          headerBackTitle: 'Cancel',
        }}
      />
    </Stack.Navigator>
  );
}
