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
import type { RootStackParamList } from '../../navigation/types';
import { Button, Card, Avatar } from '../../components/common';
import { useGameStore } from '../../stores/gameStore';
import { colors } from '../../constants/colors';
import { fontFamilies, fontSizes } from '../../constants/typography';
import { spacing, borderRadius, shadows } from '../../constants/spacing';
import { hasSharedVictory, getWinners } from '../../utils/tiebreaker';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function GameResultsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { rankedScores, playerIds, reset } = useGameStore();

  const winners = getWinners(rankedScores);
  const isSharedVictory = hasSharedVictory(rankedScores);

  const handleDone = () => {
    reset();
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  const handlePlayAgain = () => {
    reset();
    navigation.reset({
      index: 0,
      routes: [
        { name: 'MainTabs' },
        { name: 'NewGame', params: { screen: 'SelectPlayers' } },
      ],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Winner Section */}
        <View style={styles.winnerSection}>
          <Text style={styles.congratsText}>
            {isSharedVictory ? 'Shared Victory!' : 'Congratulations!'}
          </Text>

          <View style={styles.winnersRow}>
            {winners.map((winner) => (
              <View key={winner.playerId} style={styles.winnerCard}>
                <Text style={styles.trophy}>🏆</Text>
                <Avatar
                  name={winner.playerName}
                  color={colors.avatars[playerIds.indexOf(winner.playerId) % colors.avatars.length]}
                  size="large"
                />
                <Text style={styles.winnerName}>{winner.playerName}</Text>
                <Text style={styles.winnerScore}>{winner.totalScore} pts</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Full Rankings */}
        <View style={styles.rankingsSection}>
          <Text style={styles.sectionTitle}>Final Standings</Text>

          {rankedScores.map((ranked, index) => (
            <Card
              key={ranked.playerId}
              style={styles.rankingCard}
              variant="flat"
            >
              <View style={styles.rankingRow}>
                <View style={styles.rankingLeft}>
                  <View style={[
                    styles.positionBadge,
                    ranked.finishPosition === 1 && styles.firstPlace,
                    ranked.finishPosition === 2 && styles.secondPlace,
                    ranked.finishPosition === 3 && styles.thirdPlace,
                  ]}>
                    <Text style={[
                      styles.positionText,
                      ranked.finishPosition <= 3 && styles.positionTextLight,
                    ]}>
                      {ranked.finishPosition}
                    </Text>
                  </View>
                  <Avatar
                    name={ranked.playerName}
                    color={colors.avatars[playerIds.indexOf(ranked.playerId) % colors.avatars.length]}
                    size="small"
                  />
                  <Text style={styles.rankingName}>{ranked.playerName}</Text>
                </View>
                <Text style={styles.rankingScore}>{ranked.totalScore}</Text>
              </View>

              {/* Score Breakdown */}
              <View style={styles.breakdownGrid}>
                <View style={styles.breakdownItem}>
                  <Text style={styles.breakdownValue}>{ranked.scoreBreakdown.birdCardPoints}</Text>
                  <Text style={styles.breakdownLabel}>Birds</Text>
                </View>
                <View style={styles.breakdownItem}>
                  <Text style={styles.breakdownValue}>{ranked.scoreBreakdown.bonusCardPoints}</Text>
                  <Text style={styles.breakdownLabel}>Bonus</Text>
                </View>
                <View style={styles.breakdownItem}>
                  <Text style={styles.breakdownValue}>{ranked.scoreBreakdown.roundGoalPoints}</Text>
                  <Text style={styles.breakdownLabel}>Goals</Text>
                </View>
                <View style={styles.breakdownItem}>
                  <Text style={styles.breakdownValue}>{ranked.scoreBreakdown.eggsPoints}</Text>
                  <Text style={styles.breakdownLabel}>Eggs</Text>
                </View>
                <View style={styles.breakdownItem}>
                  <Text style={styles.breakdownValue}>{ranked.scoreBreakdown.cachedFoodPoints}</Text>
                  <Text style={styles.breakdownLabel}>Food</Text>
                </View>
                <View style={styles.breakdownItem}>
                  <Text style={styles.breakdownValue}>{ranked.scoreBreakdown.tuckedCardsPoints}</Text>
                  <Text style={styles.breakdownLabel}>Tucked</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          title="Play Again"
          onPress={handlePlayAgain}
          variant="outline"
          size="large"
          style={styles.actionButton}
        />
        <Button
          title="Done"
          onPress={handleDone}
          size="large"
          style={styles.actionButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.forest,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 120,
  },
  winnerSection: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  congratsText: {
    fontFamily: fontFamilies.display.bold,
    fontSize: 32,
    color: colors.text.inverse,
    marginBottom: spacing.lg,
  },
  winnersRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  winnerCard: {
    alignItems: 'center',
  },
  trophy: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  winnerName: {
    fontFamily: fontFamilies.display.semiBold,
    fontSize: fontSizes.h3,
    color: colors.text.inverse,
    marginTop: spacing.sm,
  },
  winnerScore: {
    fontFamily: fontFamilies.mono.medium,
    fontSize: fontSizes.scoreMedium,
    color: colors.semantic.winner,
    marginTop: spacing.xs,
  },
  rankingsSection: {
    backgroundColor: colors.background.cream,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    minHeight: 400,
  },
  sectionTitle: {
    fontFamily: fontFamilies.display.semiBold,
    fontSize: fontSizes.h2,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  rankingCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  rankingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  rankingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  positionBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background.moss,
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstPlace: {
    backgroundColor: colors.semantic.winner,
  },
  secondPlace: {
    backgroundColor: '#A8A8A8',
  },
  thirdPlace: {
    backgroundColor: '#CD7F32',
  },
  positionText: {
    fontFamily: fontFamilies.body.bold,
    fontSize: fontSizes.caption,
    color: colors.text.secondary,
  },
  positionTextLight: {
    color: colors.text.inverse,
  },
  rankingName: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.body,
    color: colors.text.primary,
  },
  rankingScore: {
    fontFamily: fontFamilies.mono.medium,
    fontSize: fontSizes.scoreMedium,
    color: colors.primary.forest,
  },
  breakdownGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  breakdownItem: {
    alignItems: 'center',
  },
  breakdownValue: {
    fontFamily: fontFamilies.mono.regular,
    fontSize: fontSizes.caption,
    color: colors.text.primary,
  },
  breakdownLabel: {
    fontFamily: fontFamilies.body.regular,
    fontSize: 10,
    color: colors.text.muted,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.background.cream,
  },
  actionButton: {
    flex: 1,
  },
});
