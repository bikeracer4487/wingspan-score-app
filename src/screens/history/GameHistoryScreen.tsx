import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { Card, Avatar } from '../../components/common';
import { useAllGames } from '../../hooks/useGames';
import { colors } from '../../constants/colors';
import { fontFamilies, fontSizes } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';
import { formatDate } from '../../utils/date';
import type { GameWithScores } from '../../types/models';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function GameHistoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { games, isLoading, refresh } = useAllGames();

  const handleGamePress = (gameId: string) => {
    navigation.navigate('Game', { screen: 'GameDetail', params: { gameId } });
  };

  const renderGame = ({ item }: { item: GameWithScores }) => {
    const winners = item.scores.filter((s) => s.isWinner);
    const winnerNames = winners
      .map((s) => item.playerNames[s.playerId])
      .join(' & ');
    const highScore = Math.max(...item.scores.map((s) => s.totalScore));

    return (
      <Card
        style={styles.gameCard}
        onPress={() => handleGamePress(item.id)}
      >
        <View style={styles.gameHeader}>
          <View>
            <Text style={styles.gameDate}>{formatDate(item.playedAt)}</Text>
            <Text style={styles.modeTag}>
              {item.goalScoringMode === 'competitive' ? '🏆 Competitive' : '🌿 Casual'}
            </Text>
          </View>
          <View style={styles.scoreBadge}>
            <Text style={styles.highScore}>{highScore}</Text>
            <Text style={styles.scoreLabel}>pts</Text>
          </View>
        </View>

        <View style={styles.winnerRow}>
          <Text style={styles.winnerLabel}>Winner:</Text>
          <Text style={styles.winnerName}>{winnerNames}</Text>
        </View>

        <View style={styles.playersSection}>
          <Text style={styles.playersLabel}>{item.playerCount} players</Text>
          <View style={styles.avatarStack}>
            {item.scores.slice(0, 5).map((score, index) => (
              <Avatar
                key={score.playerId}
                name={item.playerNames[score.playerId] || '?'}
                color={colors.avatars[index % colors.avatars.length]}
                size="small"
                style={index > 0 ? { marginLeft: -8 } : undefined}
              />
            ))}
          </View>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Game History</Text>
        <Text style={styles.count}>{games.length} games</Text>
      </View>

      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={renderGame}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onRefresh={refresh}
        refreshing={isLoading}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No games played yet</Text>
            <Text style={styles.emptySubtext}>
              Start a new game to see your history here
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.cream,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    fontFamily: fontFamilies.display.bold,
    fontSize: 32,
    color: colors.primary.forest,
  },
  count: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.caption,
    color: colors.text.muted,
  },
  list: {
    padding: spacing.xl,
    paddingTop: 0,
  },
  gameCard: {
    marginBottom: spacing.md,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  gameDate: {
    fontFamily: fontFamilies.body.semiBold,
    fontSize: fontSizes.body,
    color: colors.text.primary,
  },
  modeTag: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.small,
    color: colors.text.muted,
    marginTop: 2,
  },
  scoreBadge: {
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
    fontSize: fontSizes.small,
    color: colors.text.muted,
    marginLeft: 2,
  },
  winnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  winnerLabel: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.caption,
    color: colors.text.muted,
  },
  winnerName: {
    fontFamily: fontFamilies.body.semiBold,
    fontSize: fontSizes.caption,
    color: colors.primary.forest,
  },
  playersSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playersLabel: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.small,
    color: colors.text.muted,
  },
  avatarStack: {
    flexDirection: 'row',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
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
});
