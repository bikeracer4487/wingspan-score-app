import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp, CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { GameStackParamList, RootStackParamList } from '../../navigation/types';
import { Card, Avatar } from '../../components/common';
import { useGame } from '../../hooks/useGames';
import { colors } from '../../constants/colors';
import { fontFamilies, fontSizes } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { formatDateTime } from '../../utils/date';

type RouteProps = RouteProp<GameStackParamList, 'GameDetail'>;
type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<GameStackParamList, 'GameDetail'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export function GameDetailScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { gameId } = route.params;
  const { game, isLoading, deleteGame } = useGame(gameId);

  const handleDelete = () => {
    Alert.alert(
      'Delete Game',
      'Are you sure you want to delete this game? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGame();
              navigation.getParent()?.goBack();
            } catch (e) {
              Alert.alert('Error', 'Failed to delete game');
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate('EditGame', { gameId });
  };

  // Set up header buttons
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={handleEdit}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.deleteButton}>Delete</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, gameId]);

  if (isLoading || !game) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const sortedScores = [...game.scores].sort((a, b) => a.finishPosition - b.finishPosition);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.date}>{formatDateTime(game.playedAt)}</Text>
          <Text style={styles.mode}>
            {game.goalScoringMode === 'competitive' ? '🏆 Competitive' : '🌿 Casual'} Mode
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Final Standings</Text>

        {sortedScores.map((score, index) => (
          <Card key={score.playerId} style={styles.scoreCard}>
            <View style={styles.scoreHeader}>
              <View style={styles.playerInfo}>
                <View style={[
                  styles.positionBadge,
                  score.finishPosition === 1 && styles.firstPlace,
                ]}>
                  <Text style={styles.position}>{score.finishPosition}</Text>
                </View>
                <Avatar
                  name={game.playerNames[score.playerId] || '?'}
                  color={colors.avatars[index % colors.avatars.length]}
                  size="medium"
                />
                <View>
                  <Text style={styles.playerName}>
                    {game.playerNames[score.playerId]}
                    {score.isWinner && ' 🏆'}
                  </Text>
                  <Text style={styles.totalLabel}>Total Score</Text>
                </View>
              </View>
              <Text style={styles.totalScore}>{score.totalScore}</Text>
            </View>

            <View style={styles.breakdown}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Bird Cards</Text>
                <Text style={styles.breakdownValue}>{score.birdCardPoints}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Bonus Cards</Text>
                <Text style={styles.breakdownValue}>{score.bonusCardPoints}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Round Goals</Text>
                <Text style={styles.breakdownValue}>
                  {score.roundGoals.reduce((sum, rg) => sum + rg.points, 0)}
                </Text>
              </View>
              <View style={styles.roundGoalsDetail}>
                {score.roundGoals.map((rg) => (
                  <Text key={rg.round} style={styles.roundDetail}>
                    R{rg.round}: {rg.points}
                  </Text>
                ))}
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Eggs</Text>
                <Text style={styles.breakdownValue}>{score.eggsCount}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Cached Food</Text>
                <Text style={styles.breakdownValue}>{score.cachedFoodCount}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Tucked Cards</Text>
                <Text style={styles.breakdownValue}>{score.tuckedCardsCount}</Text>
              </View>
              <View style={[styles.breakdownRow, styles.tiebreakerRow]}>
                <Text style={styles.tiebreakerLabel}>Unused Food (Tiebreaker)</Text>
                <Text style={styles.tiebreakerValue}>{score.unusedFoodTokens}</Text>
              </View>
            </View>
          </Card>
        ))}
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
  loading: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.body,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  date: {
    fontFamily: fontFamilies.display.semiBold,
    fontSize: fontSizes.h2,
    color: colors.text.primary,
  },
  mode: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontFamily: fontFamilies.display.semiBold,
    fontSize: fontSizes.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  scoreCard: {
    marginBottom: spacing.md,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  playerInfo: {
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
  position: {
    fontFamily: fontFamilies.body.bold,
    fontSize: fontSizes.caption,
    color: colors.text.primary,
  },
  playerName: {
    fontFamily: fontFamilies.body.semiBold,
    fontSize: fontSizes.body,
    color: colors.text.primary,
  },
  totalLabel: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.small,
    color: colors.text.muted,
  },
  totalScore: {
    fontFamily: fontFamilies.mono.medium,
    fontSize: fontSizes.scoreLarge,
    color: colors.primary.forest,
  },
  breakdown: {},
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
  roundGoalsDetail: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingLeft: spacing.md,
    paddingBottom: spacing.xs,
  },
  roundDetail: {
    fontFamily: fontFamilies.mono.regular,
    fontSize: fontSizes.small,
    color: colors.text.muted,
  },
  tiebreakerRow: {
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  tiebreakerLabel: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.small,
    color: colors.text.muted,
  },
  tiebreakerValue: {
    fontFamily: fontFamilies.mono.regular,
    fontSize: fontSizes.small,
    color: colors.text.muted,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  editButton: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.body,
    color: colors.primary.wetland,
  },
  deleteButton: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.body,
    color: colors.semantic.error,
  },
});
