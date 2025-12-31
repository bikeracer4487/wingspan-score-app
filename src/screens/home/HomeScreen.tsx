import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { Button, Card, Avatar } from '../../components/common';
import { useRecentGames } from '../../hooks/useGames';
import { usePlayers } from '../../hooks/usePlayers';
import { colors } from '../../constants/colors';
import { fontFamilies, fontSizes } from '../../constants/typography';
import { spacing, borderRadius, shadows } from '../../constants/spacing';
import { formatDate, getRelativeTime } from '../../utils/date';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { games, isLoading: gamesLoading } = useRecentGames(3);
  const { players } = usePlayers();

  const handleNewGame = () => {
    navigation.navigate('NewGame', { screen: 'SelectPlayers' });
  };

  const handleViewGame = (gameId: string) => {
    navigation.navigate('Game', { screen: 'GameDetail', params: { gameId } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Wingspan</Text>
          <Text style={styles.subtitle}>Score Tracker</Text>
        </View>

        {/* Quick Stats Card */}
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{games.length}</Text>
              <Text style={styles.statLabel}>Recent Games</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{players.length}</Text>
              <Text style={styles.statLabel}>Players</Text>
            </View>
          </View>
        </Card>

        {/* Recent Games */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Games</Text>

          {games.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No games yet</Text>
              <Text style={styles.emptySubtext}>
                Start your first game to track scores!
              </Text>
            </Card>
          ) : (
            games.map((game) => {
              const winners = game.scores.filter((s) => s.isWinner);
              const winnerNames = winners
                .map((s) => game.playerNames[s.playerId])
                .join(' & ');

              return (
                <Card
                  key={game.id}
                  style={styles.gameCard}
                  onPress={() => handleViewGame(game.id)}
                >
                  <View style={styles.gameHeader}>
                    <Text style={styles.gameDate}>{getRelativeTime(game.playedAt)}</Text>
                    <Text style={styles.playerCount}>{game.playerCount} players</Text>
                  </View>

                  <View style={styles.gameContent}>
                    <View style={styles.winnerSection}>
                      <Text style={styles.winnerLabel}>Winner</Text>
                      <Text style={styles.winnerName}>{winnerNames}</Text>
                    </View>

                    <View style={styles.scoreSection}>
                      <Text style={styles.highScore}>
                        {winners[0]?.totalScore ?? 0}
                      </Text>
                      <Text style={styles.scoreLabel}>pts</Text>
                    </View>
                  </View>

                  <View style={styles.playersRow}>
                    {game.scores.slice(0, 5).map((score, index) => (
                      <Avatar
                        key={score.playerId}
                        name={game.playerNames[score.playerId] || '?'}
                        color={colors.avatars[index % colors.avatars.length]}
                        size="small"
                        style={index > 0 ? { marginLeft: -8 } : undefined}
                      />
                    ))}
                  </View>
                </Card>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* New Game Button (Fixed at bottom) */}
      <View style={styles.bottomAction}>
        <Button
          title="New Game"
          onPress={handleNewGame}
          size="large"
          style={styles.newGameButton}
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
    paddingBottom: 120, // Space for fixed button
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fontFamilies.display.bold,
    fontSize: 36,
    color: colors.primary.forest,
  },
  subtitle: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  statsCard: {
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fontFamilies.mono.medium,
    fontSize: fontSizes.scoreLarge,
    color: colors.primary.forest,
  },
  statLabel: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border.light,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fontFamilies.display.semiBold,
    fontSize: fontSizes.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
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
  gameCard: {
    marginBottom: spacing.md,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  gameDate: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.caption,
    color: colors.text.muted,
  },
  playerCount: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.small,
    color: colors.primary.wetland,
    backgroundColor: colors.background.moss,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  gameContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  winnerSection: {
    flex: 1,
  },
  winnerLabel: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.small,
    color: colors.text.muted,
  },
  winnerName: {
    fontFamily: fontFamilies.display.semiBold,
    fontSize: fontSizes.h3,
    color: colors.primary.forest,
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  highScore: {
    fontFamily: fontFamilies.mono.medium,
    fontSize: fontSizes.scoreMedium,
    color: colors.semantic.winner,
  },
  scoreLabel: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.caption,
    color: colors.text.muted,
    marginLeft: spacing.xs,
  },
  playersRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
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
  newGameButton: {
    width: '100%',
  },
});
