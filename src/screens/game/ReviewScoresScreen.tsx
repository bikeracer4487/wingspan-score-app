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
import { Button, Card, Avatar } from '../../components/common';
import { useGameStore } from '../../stores/gameStore';
import { colors } from '../../constants/colors';
import { fontFamilies, fontSizes } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';
import { getRoundGoalTotal } from '../../utils/scoring';

type NavigationProp = NativeStackNavigationProp<NewGameStackParamList, 'ReviewScores'>;

export function ReviewScoresScreen() {
  const navigation = useNavigation<NavigationProp>();

  const {
    playerIds,
    playerNames,
    rankedScores,
    scores,
    finalizeGame,
    backToScoring,
    goToPlayer,
  } = useGameStore();

  const handleEditPlayer = (index: number) => {
    backToScoring();
    goToPlayer(index);
    navigation.navigate('ScoreEntry');
  };

  const handleSaveGame = async () => {
    try {
      await finalizeGame();
      navigation.navigate('GameResults');
    } catch (e) {
      console.error('Failed to save game:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Review Scores</Text>
        <Text style={styles.subtitle}>
          Check the scores before saving the game
        </Text>

        {rankedScores.map((ranked, index) => {
          const score = scores[ranked.playerId];
          const roundGoalTotal = score ? getRoundGoalTotal(score.roundGoals) : 0;

          return (
            <Card
              key={ranked.playerId}
              style={ranked.isWinner ? [styles.playerCard, styles.winnerCard] : styles.playerCard}
            >
              <View style={styles.playerHeader}>
                <View style={styles.playerInfo}>
                  <View style={styles.position}>
                    <Text style={styles.positionText}>
                      {ranked.finishPosition}
                    </Text>
                  </View>
                  <Avatar
                    name={ranked.playerName}
                    color={colors.avatars[playerIds.indexOf(ranked.playerId) % colors.avatars.length]}
                    size="small"
                  />
                  <Text style={styles.playerName}>{ranked.playerName}</Text>
                  {ranked.isWinner && (
                    <Text style={styles.winnerBadge}>🏆</Text>
                  )}
                </View>
                <Text style={styles.totalScore}>{ranked.totalScore}</Text>
              </View>

              <View style={styles.breakdown}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Bird Cards</Text>
                  <Text style={styles.breakdownValue}>
                    {ranked.scoreBreakdown.birdCardPoints}
                  </Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Bonus Cards</Text>
                  <Text style={styles.breakdownValue}>
                    {ranked.scoreBreakdown.bonusCardPoints}
                  </Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Round Goals</Text>
                  <Text style={styles.breakdownValue}>
                    {ranked.scoreBreakdown.roundGoalPoints}
                  </Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Eggs</Text>
                  <Text style={styles.breakdownValue}>
                    {ranked.scoreBreakdown.eggsPoints}
                  </Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Cached Food</Text>
                  <Text style={styles.breakdownValue}>
                    {ranked.scoreBreakdown.cachedFoodPoints}
                  </Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Tucked Cards</Text>
                  <Text style={styles.breakdownValue}>
                    {ranked.scoreBreakdown.tuckedCardsPoints}
                  </Text>
                </View>
              </View>

              <Button
                title="Edit"
                variant="ghost"
                size="small"
                onPress={() => handleEditPlayer(playerIds.indexOf(ranked.playerId))}
                style={styles.editButton}
              />
            </Card>
          );
        })}
      </ScrollView>

      <View style={styles.bottomAction}>
        <Button
          title="Save Game"
          onPress={handleSaveGame}
          size="large"
          style={styles.saveButton}
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: 120,
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
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  playerCard: {
    marginBottom: spacing.md,
  },
  winnerCard: {
    borderWidth: 2,
    borderColor: colors.semantic.winner,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  position: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background.moss,
    alignItems: 'center',
    justifyContent: 'center',
  },
  positionText: {
    fontFamily: fontFamilies.body.bold,
    fontSize: fontSizes.caption,
    color: colors.text.secondary,
  },
  playerName: {
    fontFamily: fontFamilies.body.semiBold,
    fontSize: fontSizes.body,
    color: colors.text.primary,
  },
  winnerBadge: {
    fontSize: 18,
  },
  totalScore: {
    fontFamily: fontFamilies.mono.medium,
    fontSize: fontSizes.scoreMedium,
    color: colors.primary.forest,
  },
  breakdown: {
    marginBottom: spacing.sm,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  breakdownLabel: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.caption,
    color: colors.text.secondary,
  },
  breakdownValue: {
    fontFamily: fontFamilies.mono.regular,
    fontSize: fontSizes.caption,
    color: colors.text.primary,
  },
  editButton: {
    alignSelf: 'flex-end',
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.background.cream,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  saveButton: {
    width: '100%',
  },
});
