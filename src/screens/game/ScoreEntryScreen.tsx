import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NewGameStackParamList } from '../../navigation/types';
import type { Habitat } from '../../types/models';
import { Button, Card, Avatar, ScoreInput } from '../../components/common';
import { useGameStore, useCurrentPlayer } from '../../stores/gameStore';
import { usePlayers } from '../../hooks/usePlayers';
import { colors } from '../../constants/colors';
import { fontFamilies, fontSizes } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';
import { CATEGORY_INFO } from '../../constants/scoring';

type NavigationProp = NativeStackNavigationProp<NewGameStackParamList, 'ScoreEntry'>;

export function ScoreEntryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { players } = usePlayers();

  const {
    playerIds,
    playerNames,
    goalScoringMode,
    currentPlayerIndex,
    scores,
    setScore,
    setRoundGoal,
    setNectarScore,
    nextPlayer,
    previousPlayer,
    getTotalScore,
    startReview,
    hasExpansion,
  } = useGameStore();

  const hasOceaniaExpansion = hasExpansion('oceania');

  // Create player lookup for avatars
  const playerMap = Object.fromEntries(players.map(p => [p.id, p]));

  const currentPlayerId = playerIds[currentPlayerIndex];
  const currentScore = scores[currentPlayerId];
  const currentPlayerName = playerNames[currentPlayerId] || 'Player';
  const totalScore = getTotalScore(currentPlayerId);

  const isFirstPlayer = currentPlayerIndex === 0;
  const isLastPlayer = currentPlayerIndex === playerIds.length - 1;

  const handleNext = () => {
    if (isLastPlayer) {
      startReview();
      navigation.navigate('ReviewScores');
    } else {
      nextPlayer();
    }
  };

  const handlePrevious = () => {
    previousPlayer();
  };

  if (!currentScore) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No score data available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Player Header */}
      <View style={styles.playerHeader}>
        <View style={styles.playerInfo}>
          <Avatar
            name={currentPlayerName}
            avatarId={playerMap[currentPlayerId]?.avatarId}
            color={colors.avatars[currentPlayerIndex % colors.avatars.length]}
            size="medium"
          />
          <View style={styles.playerText}>
            <Text style={styles.playerName}>{currentPlayerName}</Text>
            <Text style={styles.playerProgress}>
              Player {currentPlayerIndex + 1} of {playerIds.length}
            </Text>
          </View>
        </View>
        <View style={styles.totalScore}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{totalScore}</Text>
        </View>
      </View>

      {/* Progress Dots */}
      <View style={styles.progressDots}>
        {playerIds.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentPlayerIndex && styles.dotActive,
              index < currentPlayerIndex && styles.dotComplete,
            ]}
          />
        ))}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Bird Cards */}
        <Card style={styles.categoryCard}>
          <ScoreInput
            label="Bird Cards"
            value={currentScore.birdCardPoints}
            onChange={(value) => setScore(currentPlayerId, 'birdCardPoints', value)}
            color={colors.scoring.birds}
          />
          <Text style={styles.categoryHint}>Sum of face value points on all birds</Text>
        </Card>

        {/* Bonus Cards */}
        <Card style={styles.categoryCard}>
          <ScoreInput
            label="Bonus Cards"
            value={currentScore.bonusCardPoints}
            onChange={(value) => setScore(currentPlayerId, 'bonusCardPoints', value)}
            color={colors.scoring.bonusCards}
          />
          <Text style={styles.categoryHint}>Points from completed objectives</Text>
        </Card>

        {/* Round Goals */}
        <Card style={styles.categoryCard}>
          <Text style={styles.sectionTitle}>End-of-Round Goals</Text>
          <Text style={styles.modeHint}>
            {goalScoringMode === 'competitive'
              ? 'Enter points based on your placement each round'
              : 'Enter 1 point per item achieved (max 5)'}
          </Text>
          <View style={styles.roundGoalsGrid}>
            {currentScore.roundGoals.map((rg) => (
              <ScoreInput
                key={rg.round}
                label={`Round ${rg.round}`}
                value={rg.points}
                onChange={(value) => setRoundGoal(currentPlayerId, rg.round, value)}
                max={goalScoringMode === 'casual' ? 5 : 5}
                color={colors.scoring.roundGoals}
                style={styles.roundGoalInput}
                compact
              />
            ))}
          </View>
        </Card>

        {/* Eggs */}
        <Card style={styles.categoryCard}>
          <ScoreInput
            label="Eggs"
            value={currentScore.eggsCount}
            onChange={(value) => setScore(currentPlayerId, 'eggsCount', value)}
            color={colors.scoring.eggs}
          />
          <Text style={styles.categoryHint}>1 point per egg on bird cards</Text>
        </Card>

        {/* Cached Food */}
        <Card style={styles.categoryCard}>
          <ScoreInput
            label="Cached Food"
            value={currentScore.cachedFoodCount}
            onChange={(value) => setScore(currentPlayerId, 'cachedFoodCount', value)}
            color={colors.scoring.cachedFood}
          />
          <Text style={styles.categoryHint}>1 point per food token stored on birds</Text>
        </Card>

        {/* Tucked Cards */}
        <Card style={styles.categoryCard}>
          <ScoreInput
            label="Tucked Cards"
            value={currentScore.tuckedCardsCount}
            onChange={(value) => setScore(currentPlayerId, 'tuckedCardsCount', value)}
            color={colors.scoring.tuckedCards}
          />
          <Text style={styles.categoryHint}>1 point per card tucked under birds</Text>
        </Card>

        {/* Nectar (Oceania Expansion) */}
        {hasOceaniaExpansion && (
          <Card style={[styles.categoryCard, styles.nectarCard]}>
            <View style={styles.nectarHeader}>
              <Text style={styles.sectionTitle}>Nectar Spent</Text>
              <View style={styles.expansionBadge}>
                <Text style={styles.expansionBadgeText}>OCEANIA</Text>
              </View>
            </View>
            <Text style={styles.modeHint}>
              Enter nectar tokens spent in each habitat for majority scoring
            </Text>
            <View style={styles.nectarGrid}>
              <ScoreInput
                label="Forest"
                value={currentScore.nectarScores.forest}
                onChange={(value) => setNectarScore(currentPlayerId, 'forest' as Habitat, value)}
                color={colors.scoring.birds}
                style={styles.nectarInput}
                compact
              />
              <ScoreInput
                label="Grassland"
                value={currentScore.nectarScores.grassland}
                onChange={(value) => setNectarScore(currentPlayerId, 'grassland' as Habitat, value)}
                color={colors.scoring.cachedFood}
                style={styles.nectarInput}
                compact
              />
              <ScoreInput
                label="Wetland"
                value={currentScore.nectarScores.wetland}
                onChange={(value) => setNectarScore(currentPlayerId, 'wetland' as Habitat, value)}
                color={colors.scoring.roundGoals}
                style={styles.nectarInput}
                compact
              />
            </View>
            <Text style={styles.nectarHint}>
              Most nectar per habitat: 5 pts | Second most: 2 pts
            </Text>
          </Card>
        )}

        {/* Unused Food (Tiebreaker) */}
        <Card style={styles.categoryCard}>
          <ScoreInput
            label="Unused Food Tokens"
            value={currentScore.unusedFoodTokens}
            onChange={(value) => setScore(currentPlayerId, 'unusedFoodTokens', value)}
            color={colors.text.muted}
          />
          <Text style={styles.categoryHint}>Used for tiebreaker only (not scored)</Text>
        </Card>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <Button
          title="Previous"
          onPress={handlePrevious}
          variant="outline"
          size="medium"
          disabled={isFirstPlayer}
          style={styles.navButton}
        />
        <Button
          title={isLastPlayer ? 'Review' : 'Next'}
          onPress={handleNext}
          size="medium"
          style={styles.navButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.cream,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerText: {
    marginLeft: spacing.sm,
  },
  playerName: {
    fontFamily: fontFamilies.display.semiBold,
    fontSize: fontSizes.h3,
    color: colors.text.primary,
  },
  playerProgress: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.caption,
    color: colors.text.muted,
  },
  totalScore: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.small,
    color: colors.text.muted,
  },
  totalValue: {
    fontFamily: fontFamilies.mono.medium,
    fontSize: fontSizes.scoreLarge,
    color: colors.primary.forest,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.cream,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border.medium,
  },
  dotActive: {
    backgroundColor: colors.primary.forest,
    width: 24,
  },
  dotComplete: {
    backgroundColor: colors.primary.wetland,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  categoryCard: {
    marginBottom: spacing.md,
  },
  categoryHint: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.small,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontFamily: fontFamilies.display.semiBold,
    fontSize: fontSizes.h3,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  modeHint: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.small,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  roundGoalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roundGoalInput: {
    width: '48%',
  },
  nectarCard: {
    borderWidth: 2,
    borderColor: colors.scoring.nectar + '40',
    backgroundColor: colors.scoring.nectar + '08',
  },
  nectarHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  expansionBadge: {
    backgroundColor: colors.scoring.nectar,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  expansionBadgeText: {
    fontFamily: fontFamilies.body.bold,
    fontSize: 9,
    color: colors.text.inverse,
    letterSpacing: 0.5,
  },
  nectarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nectarInput: {
    width: '48%',
    marginBottom: spacing.sm,
  },
  nectarHint: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.small,
    color: colors.scoring.nectar,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background.cream,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    gap: spacing.md,
  },
  navButton: {
    flex: 1,
  },
});
