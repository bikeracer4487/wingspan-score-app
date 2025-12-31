import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { PlayerStackParamList } from '../../navigation/types';
import { Card, Avatar } from '../../components/common';
import { usePlayer } from '../../hooks/usePlayers';
import { usePlayerStats } from '../../hooks/usePlayerStats';
import { usePlayerGames } from '../../hooks/useGames';
import { colors } from '../../constants/colors';
import { fontFamilies, fontSizes } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { formatDate } from '../../utils/date';

type RouteProps = RouteProp<PlayerStackParamList, 'PlayerDetail'>;

export function PlayerDetailScreen() {
  const route = useRoute<RouteProps>();
  const { playerId } = route.params;

  const { player } = usePlayer(playerId);
  const { stats } = usePlayerStats(playerId);
  const { games } = usePlayerGames(playerId, 5);

  if (!player) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Player not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Player Header */}
        <View style={styles.header}>
          <Avatar name={player.name} color={player.avatarColor} size="large" />
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.memberSince}>
            Member since {formatDate(player.createdAt)}
          </Text>
        </View>

        {/* Quick Stats */}
        {stats && (
          <Card style={styles.statsCard}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.totalGames}</Text>
                <Text style={styles.statLabel}>Games</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.semantic.winner }]}>
                  {stats.wins}
                </Text>
                <Text style={styles.statLabel}>Wins</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.winRate}%</Text>
                <Text style={styles.statLabel}>Win Rate</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.avgScore}</Text>
                <Text style={styles.statLabel}>Avg Score</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Detailed Stats */}
        {stats && stats.totalGames > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance</Text>
            <Card>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>High Score</Text>
                <Text style={styles.detailValue}>{stats.highScore}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Avg Finish Position</Text>
                <Text style={styles.detailValue}>{stats.avgFinishPosition}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Current Win Streak</Text>
                <Text style={styles.detailValue}>{stats.currentWinStreak}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Best Win Streak</Text>
                <Text style={styles.detailValue}>{stats.bestWinStreak}</Text>
              </View>
            </Card>
          </View>
        )}

        {/* Category Averages */}
        {stats && stats.totalGames > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scoring Breakdown (Avg)</Text>
            <Card>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bird Cards</Text>
                <Text style={styles.detailValue}>{stats.avgBirdCardPoints}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bonus Cards</Text>
                <Text style={styles.detailValue}>{stats.avgBonusCardPoints}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Round Goals</Text>
                <Text style={styles.detailValue}>{stats.avgRoundGoalPoints}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Eggs</Text>
                <Text style={styles.detailValue}>{stats.avgEggsPoints}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Cached Food</Text>
                <Text style={styles.detailValue}>{stats.avgCachedFoodPoints}</Text>
              </View>
              <View style={[styles.detailRow, styles.lastRow]}>
                <Text style={styles.detailLabel}>Tucked Cards</Text>
                <Text style={styles.detailValue}>{stats.avgTuckedCardsPoints}</Text>
              </View>
            </Card>
          </View>
        )}

        {/* Recent Games */}
        {games.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Games</Text>
            {games.map((game) => {
              const playerScore = game.scores.find((s) => s.playerId === playerId);
              return (
                <Card key={game.id} style={styles.gameCard}>
                  <View style={styles.gameRow}>
                    <View>
                      <Text style={styles.gameDate}>{formatDate(game.playedAt)}</Text>
                      <Text style={styles.gameResult}>
                        {playerScore?.isWinner ? '🏆 Winner' : `${playerScore?.finishPosition}${getSuffix(playerScore?.finishPosition ?? 0)} place`}
                      </Text>
                    </View>
                    <Text style={styles.gameScore}>{playerScore?.totalScore}</Text>
                  </View>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function getSuffix(n: number): string {
  if (n === 1) return 'st';
  if (n === 2) return 'nd';
  if (n === 3) return 'rd';
  return 'th';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.cream,
  },
  content: {
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  playerName: {
    fontFamily: fontFamilies.display.bold,
    fontSize: 28,
    color: colors.primary.forest,
    marginTop: spacing.md,
  },
  memberSince: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.caption,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  statsCard: {
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fontFamilies.mono.medium,
    fontSize: fontSizes.scoreMedium,
    color: colors.primary.forest,
  },
  statLabel: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.small,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fontFamilies.display.semiBold,
    fontSize: fontSizes.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.body,
    color: colors.text.secondary,
  },
  detailValue: {
    fontFamily: fontFamilies.mono.medium,
    fontSize: fontSizes.body,
    color: colors.text.primary,
  },
  gameCard: {
    marginBottom: spacing.sm,
  },
  gameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameDate: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.caption,
    color: colors.text.muted,
  },
  gameResult: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.body,
    color: colors.text.primary,
    marginTop: 2,
  },
  gameScore: {
    fontFamily: fontFamilies.mono.medium,
    fontSize: fontSizes.scoreMedium,
    color: colors.primary.forest,
  },
});
