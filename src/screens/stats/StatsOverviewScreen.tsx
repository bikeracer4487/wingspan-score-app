import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Card, Avatar } from '../../components/common';
import { useLeaderboard } from '../../hooks/usePlayerStats';
import { usePlayers } from '../../hooks/usePlayers';
import { colors } from '../../constants/colors';
import { fontFamilies, fontSizes } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';

export function StatsOverviewScreen() {
  const { leaderboard, isLoading } = useLeaderboard();
  const { players } = usePlayers();

  // Create player lookup for avatars
  const playerMap = Object.fromEntries(players.map(p => [p.id, p]));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Leaderboard</Text>
          <Text style={styles.subtitle}>All-time rankings</Text>
        </View>

        {leaderboard.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No stats yet</Text>
            <Text style={styles.emptySubtext}>
              Play some games to see the leaderboard
            </Text>
          </Card>
        ) : (
          <>
            {/* Top 3 Podium */}
            {leaderboard.length >= 1 && (
              <View style={styles.podium}>
                {leaderboard.length >= 2 && (
                  <View style={[styles.podiumSpot, styles.second]}>
                    <Avatar
                      name={leaderboard[1].playerName}
                      avatarId={playerMap[leaderboard[1].playerId]?.avatarId}
                      color={colors.avatars[1]}
                      size="medium"
                    />
                    <Text style={styles.podiumName} numberOfLines={1}>
                      {leaderboard[1].playerName}
                    </Text>
                    <Text style={styles.podiumWins}>{leaderboard[1].wins} wins</Text>
                    <View style={[styles.podiumBar, styles.secondBar]}>
                      <Text style={styles.podiumPosition}>2</Text>
                    </View>
                  </View>
                )}

                <View style={[styles.podiumSpot, styles.first]}>
                  <Text style={styles.crown}>👑</Text>
                  <Avatar
                    name={leaderboard[0].playerName}
                    avatarId={playerMap[leaderboard[0].playerId]?.avatarId}
                    color={colors.avatars[0]}
                    size="large"
                  />
                  <Text style={styles.podiumName} numberOfLines={1}>
                    {leaderboard[0].playerName}
                  </Text>
                  <Text style={styles.podiumWins}>{leaderboard[0].wins} wins</Text>
                  <View style={[styles.podiumBar, styles.firstBar]}>
                    <Text style={styles.podiumPosition}>1</Text>
                  </View>
                </View>

                {leaderboard.length >= 3 && (
                  <View style={[styles.podiumSpot, styles.third]}>
                    <Avatar
                      name={leaderboard[2].playerName}
                      avatarId={playerMap[leaderboard[2].playerId]?.avatarId}
                      color={colors.avatars[2]}
                      size="medium"
                    />
                    <Text style={styles.podiumName} numberOfLines={1}>
                      {leaderboard[2].playerName}
                    </Text>
                    <Text style={styles.podiumWins}>{leaderboard[2].wins} wins</Text>
                    <View style={[styles.podiumBar, styles.thirdBar]}>
                      <Text style={styles.podiumPosition}>3</Text>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Full Leaderboard */}
            <View style={styles.fullList}>
              <Text style={styles.sectionTitle}>All Players</Text>
              {leaderboard.map((player, index) => (
                <Card key={player.playerId} style={styles.playerCard}>
                  <View style={styles.playerRow}>
                    <View style={styles.rankSection}>
                      <Text style={styles.rank}>#{index + 1}</Text>
                    </View>
                    <Avatar
                      name={player.playerName}
                      avatarId={playerMap[player.playerId]?.avatarId}
                      color={colors.avatars[index % colors.avatars.length]}
                      size="small"
                    />
                    <View style={styles.playerInfo}>
                      <Text style={styles.playerName}>{player.playerName}</Text>
                      <Text style={styles.playerStats}>
                        {player.totalGames} games · {player.winRate}% win rate
                      </Text>
                    </View>
                    <View style={styles.winsSection}>
                      <Text style={styles.winsValue}>{player.wins}</Text>
                      <Text style={styles.winsLabel}>wins</Text>
                    </View>
                  </View>

                  <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                      <Text style={styles.statValue}>{player.avgScore}</Text>
                      <Text style={styles.statLabel}>Avg Score</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={styles.statValue}>{player.highScore}</Text>
                      <Text style={styles.statLabel}>High Score</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={styles.statValue}>{player.avgFinishPosition}</Text>
                      <Text style={styles.statLabel}>Avg Finish</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={styles.statValue}>{player.bestWinStreak}</Text>
                      <Text style={styles.statLabel}>Best Streak</Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
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
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fontFamilies.display.bold,
    fontSize: 32,
    color: colors.primary.forest,
  },
  subtitle: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.body,
    color: colors.text.secondary,
  },
  emptySubtext: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.caption,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  podiumSpot: {
    alignItems: 'center',
    flex: 1,
  },
  first: {
    marginTop: -16,
  },
  second: {},
  third: {},
  crown: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  podiumName: {
    fontFamily: fontFamilies.body.semiBold,
    fontSize: fontSizes.caption,
    color: colors.text.primary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  podiumWins: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.small,
    color: colors.text.muted,
  },
  podiumBar: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: borderRadius.sm,
    borderTopRightRadius: borderRadius.sm,
    marginTop: spacing.sm,
  },
  firstBar: {
    height: 80,
    backgroundColor: colors.semantic.winner,
  },
  secondBar: {
    height: 60,
    backgroundColor: '#A8A8A8',
  },
  thirdBar: {
    height: 40,
    backgroundColor: '#CD7F32',
  },
  podiumPosition: {
    fontFamily: fontFamilies.display.bold,
    fontSize: fontSizes.h2,
    color: colors.text.inverse,
  },
  fullList: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontFamily: fontFamilies.display.semiBold,
    fontSize: fontSizes.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  playerCard: {
    marginBottom: spacing.md,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  rankSection: {
    width: 32,
  },
  rank: {
    fontFamily: fontFamilies.mono.medium,
    fontSize: fontSizes.caption,
    color: colors.text.muted,
  },
  playerInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  playerName: {
    fontFamily: fontFamilies.body.semiBold,
    fontSize: fontSizes.body,
    color: colors.text.primary,
  },
  playerStats: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.small,
    color: colors.text.muted,
  },
  winsSection: {
    alignItems: 'center',
  },
  winsValue: {
    fontFamily: fontFamilies.mono.medium,
    fontSize: fontSizes.scoreMedium,
    color: colors.semantic.winner,
  },
  winsLabel: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.small,
    color: colors.text.muted,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontFamily: fontFamilies.mono.medium,
    fontSize: fontSizes.body,
    color: colors.text.primary,
  },
  statLabel: {
    fontFamily: fontFamilies.body.regular,
    fontSize: 10,
    color: colors.text.muted,
    marginTop: 2,
  },
});
