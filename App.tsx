import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_500Medium,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import {
  SourceSans3_400Regular,
  SourceSans3_500Medium,
  SourceSans3_600SemiBold,
  SourceSans3_700Bold,
} from '@expo-google-fonts/source-sans-3';
import {
  DMMono_400Regular,
  DMMono_500Medium,
} from '@expo-google-fonts/dm-mono';

import { ThemeProvider } from './src/theme/ThemeProvider';
import { RootNavigator } from './src/navigation/RootNavigator';
import { initDatabase } from './src/db/database';
import { colors } from './src/constants/colors';
import { fontFamilies, fontSizes } from './src/constants/typography';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Load fonts
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    SourceSans3_400Regular,
    SourceSans3_500Medium,
    SourceSans3_600SemiBold,
    SourceSans3_700Bold,
    DMMono_400Regular,
    DMMono_500Medium,
  });

  // Initialize database
  useEffect(() => {
    async function initDb() {
      try {
        await initDatabase();
        setDbReady(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setDbError(error instanceof Error ? error.message : 'Unknown error');
      }
    }
    initDb();
  }, []);

  // Hide splash screen when ready
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && dbReady) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, dbReady]);

  // Show loading screen while initializing
  if (!fontsLoaded || !dbReady) {
    if (dbError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Database Error</Text>
          <Text style={styles.errorMessage}>{dbError}</Text>
        </View>
      );
    }

    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.forest} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar style="dark" />
      <ThemeProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.cream,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: colors.background.cream,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.semantic.error,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: colors.text.muted,
    textAlign: 'center',
  },
});
