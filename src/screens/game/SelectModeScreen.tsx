import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { NewGameStackParamList } from '../../navigation/types';
import { Card } from '../../components/common';
import { useGameStore } from '../../stores/gameStore';
import { colors } from '../../constants/colors';
import { fontFamilies, fontSizes } from '../../constants/typography';
import { spacing, borderRadius, shadows } from '../../constants/spacing';
import type { GoalScoringMode } from '../../types/models';

type NavigationProp = NativeStackNavigationProp<NewGameStackParamList, 'SelectMode'>;
type RouteProps = RouteProp<NewGameStackParamList, 'SelectMode'>;

export function SelectModeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const startNewGame = useGameStore((state) => state.startNewGame);

  // Get selected players from navigation params
  const { playerIds, playerNames } = route.params;

  const handleSelectMode = (mode: GoalScoringMode) => {
    // Start the game with selected players
    startNewGame(playerIds, playerNames, mode);

    // Navigate to score entry
    navigation.navigate('ScoreEntry');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Scoring Mode</Text>
        <Text style={styles.subtitle}>
          Choose how end-of-round goals are scored
        </Text>

        <View style={styles.cards}>
          {/* Competitive Mode */}
          <TouchableOpacity
            style={styles.modeCard}
            onPress={() => handleSelectMode('competitive')}
            activeOpacity={0.8}
          >
            <View style={[styles.modeHeader, { backgroundColor: colors.primary.forest }]}>
              <Text style={styles.modeEmoji}>🏆</Text>
              <Text style={styles.modeTitle}>Competitive</Text>
              <Text style={styles.modeTag}>Green Side</Text>
            </View>
            <View style={styles.modeBody}>
              <Text style={styles.modeDescription}>
                Players are ranked for each round goal. Points awarded based on placement:
              </Text>
              <View style={styles.pointsList}>
                <Text style={styles.pointItem}>• 1st place: 4-5 points</Text>
                <Text style={styles.pointItem}>• 2nd place: 1-2 points</Text>
                <Text style={styles.pointItem}>• 3rd place: 0-1 points</Text>
                <Text style={styles.pointItem}>• Ties split points (rounded down)</Text>
              </View>
              <Text style={styles.modeNote}>
                Recommended for experienced players
              </Text>
            </View>
          </TouchableOpacity>

          {/* Casual Mode */}
          <TouchableOpacity
            style={styles.modeCard}
            onPress={() => handleSelectMode('casual')}
            activeOpacity={0.8}
          >
            <View style={[styles.modeHeader, { backgroundColor: colors.primary.wetland }]}>
              <Text style={styles.modeEmoji}>🌿</Text>
              <Text style={styles.modeTitle}>Casual</Text>
              <Text style={styles.modeTag}>Blue Side</Text>
            </View>
            <View style={styles.modeBody}>
              <Text style={styles.modeDescription}>
                Score based on quantity achieved, not ranking against others:
              </Text>
              <View style={styles.pointsList}>
                <Text style={styles.pointItem}>• 1 point per item achieved</Text>
                <Text style={styles.pointItem}>• Maximum 5 points per round</Text>
                <Text style={styles.pointItem}>• No comparison between players</Text>
              </View>
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>Great for beginners</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.cream,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  title: {
    fontFamily: fontFamilies.display.bold,
    fontSize: 28,
    color: colors.primary.forest,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  cards: {
    gap: spacing.lg,
  },
  modeCard: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.medium,
  },
  modeHeader: {
    padding: spacing.md,
    alignItems: 'center',
  },
  modeEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  modeTitle: {
    fontFamily: fontFamilies.display.bold,
    fontSize: fontSizes.h2,
    color: colors.text.inverse,
  },
  modeTag: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.small,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  modeBody: {
    padding: spacing.md,
  },
  modeDescription: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  pointsList: {
    marginBottom: spacing.sm,
  },
  pointItem: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.caption,
    color: colors.text.primary,
    paddingVertical: 2,
  },
  modeNote: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.small,
    color: colors.text.muted,
    fontStyle: 'italic',
  },
  recommendedBadge: {
    backgroundColor: colors.primary.grassland,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  recommendedText: {
    fontFamily: fontFamilies.body.semiBold,
    fontSize: fontSizes.small,
    color: colors.text.primary,
  },
});
