import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import type { MainTabParamList } from './types';
import { colors } from '../constants/colors';
import { fontFamilies, fontSizes } from '../constants/typography';
import { componentSizes } from '../constants/spacing';

// Import screens (placeholders for now)
import { HomeScreen } from '../screens/home/HomeScreen';
import { PlayersListScreen } from '../screens/players/PlayersListScreen';
import { GameHistoryScreen } from '../screens/history/GameHistoryScreen';
import { StatsOverviewScreen } from '../screens/stats/StatsOverviewScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Simple icon components (we'll use SVG icons later)
function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const iconMap: Record<string, string> = {
    Home: focused ? '🏠' : '🏡',
    Players: focused ? '👥' : '👤',
    History: focused ? '📋' : '📄',
    Stats: focused ? '📊' : '📈',
  };

  return (
    <Text style={[styles.icon, focused && styles.iconFocused]}>
      {iconMap[name] || '•'}
    </Text>
  );
}

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: colors.primary.forest,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Players"
        component={PlayersListScreen}
        options={{ tabBarLabel: 'Players' }}
      />
      <Tab.Screen
        name="History"
        component={GameHistoryScreen}
        options={{ tabBarLabel: 'History' }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsOverviewScreen}
        options={{ tabBarLabel: 'Stats' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: componentSizes.tabBarHeight,
    paddingTop: 8,
    paddingBottom: 28, // Account for iPhone home indicator
    backgroundColor: colors.background.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  tabBarLabel: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.tabBar,
    marginTop: 4,
  },
  icon: {
    fontSize: 22,
  },
  iconFocused: {
    transform: [{ scale: 1.1 }],
  },
});
