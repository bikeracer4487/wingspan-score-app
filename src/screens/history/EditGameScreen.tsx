import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { GameStackParamList } from '../../navigation/types';
import { Card, Button, Input, Avatar } from '../../components/common';
import { useGame } from '../../hooks/useGames';
import { usePlayers } from '../../hooks/usePlayers';
import type { GameScore, RoundNumber } from '../../types/models';
import { colors } from '../../constants/colors';
import { fontFamilies, fontSizes } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';
import { isValidNumberString, parseScoreInput } from '../../utils/validation';

type RouteProps = RouteProp<GameStackParamList, 'EditGame'>;
type NavigationProp = NativeStackNavigationProp<GameStackParamList, 'EditGame'>;

interface PlayerScoreEdit {
  scoreId: string;
  playerId: string;
  playerName: string;
  birdCardPoints: string;
  bonusCardPoints: string;
  eggsCount: string;
  cachedFoodCount: string;
  tuckedCardsCount: string;
  unusedFoodTokens: string;
  roundGoals: { round: RoundNumber; points: string }[];
}

export function EditGameScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { gameId } = route.params;

  const { game, isLoading, updateScore, refresh } = useGame(gameId);
  const { players } = usePlayers();
  const [playerScores, setPlayerScores] = useState<PlayerScoreEdit[]>([]);

  // Create player lookup for avatars
  const playerMap = Object.fromEntries(players.map(p => [p.id, p]));
  const [isSaving, setIsSaving] = useState(false);
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);

  // Initialize form with game data
  useEffect(() => {
    if (game) {
      const scores = game.scores.map((score): PlayerScoreEdit => ({
        scoreId: score.id,
        playerId: score.playerId,
        playerName: game.playerNames[score.playerId] || 'Unknown',
        birdCardPoints: score.birdCardPoints.toString(),
        bonusCardPoints: score.bonusCardPoints.toString(),
        eggsCount: score.eggsCount.toString(),
        cachedFoodCount: score.cachedFoodCount.toString(),
        tuckedCardsCount: score.tuckedCardsCount.toString(),
        unusedFoodTokens: score.unusedFoodTokens.toString(),
        roundGoals: score.roundGoals.map(rg => ({
          round: rg.round,
          points: rg.points.toString(),
        })),
      }));
      setPlayerScores(scores);
      // Auto-expand first player
      if (scores.length > 0 && !expandedPlayer) {
        setExpandedPlayer(scores[0].playerId);
      }
    }
  }, [game]);

  // Set up header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Edit Game',
      headerBackTitle: 'Cancel',
    });
  }, [navigation]);

  const updatePlayerScore = (playerId: string, field: keyof PlayerScoreEdit, value: string) => {
    setPlayerScores(prev => prev.map(ps => {
      if (ps.playerId === playerId) {
        return { ...ps, [field]: value };
      }
      return ps;
    }));
  };

  const updateRoundGoal = (playerId: string, round: RoundNumber, value: string) => {
    setPlayerScores(prev => prev.map(ps => {
      if (ps.playerId === playerId) {
        const newRoundGoals = ps.roundGoals.map(rg => {
          if (rg.round === round) {
            return { ...rg, points: value };
          }
          return rg;
        });
        return { ...ps, roundGoals: newRoundGoals };
      }
      return ps;
    }));
  };

  const calculateTotal = (ps: PlayerScoreEdit): number => {
    const birdCards = parseScoreInput(ps.birdCardPoints);
    const bonusCards = parseScoreInput(ps.bonusCardPoints);
    const eggs = parseScoreInput(ps.eggsCount);
    const cachedFood = parseScoreInput(ps.cachedFoodCount);
    const tuckedCards = parseScoreInput(ps.tuckedCardsCount);
    const roundGoals = ps.roundGoals.reduce((sum, rg) => sum + parseScoreInput(rg.points), 0);
    return birdCards + bonusCards + eggs + cachedFood + tuckedCards + roundGoals;
  };

  const handleSave = async () => {
    // Validate all inputs
    for (const ps of playerScores) {
      const fields = [
        { value: ps.birdCardPoints, name: 'Bird Cards' },
        { value: ps.bonusCardPoints, name: 'Bonus Cards' },
        { value: ps.eggsCount, name: 'Eggs' },
        { value: ps.cachedFoodCount, name: 'Cached Food' },
        { value: ps.tuckedCardsCount, name: 'Tucked Cards' },
        { value: ps.unusedFoodTokens, name: 'Unused Food' },
      ];

      for (const field of fields) {
        if (!isValidNumberString(field.value)) {
          Alert.alert('Invalid Input', `${field.name} for ${ps.playerName} must be a valid number`);
          return;
        }
      }

      for (const rg of ps.roundGoals) {
        if (!isValidNumberString(rg.points)) {
          Alert.alert('Invalid Input', `Round ${rg.round} for ${ps.playerName} must be a valid number`);
          return;
        }
      }
    }

    try {
      setIsSaving(true);

      // Update each player's score
      for (const ps of playerScores) {
        await updateScore(ps.scoreId, {
          birdCardPoints: parseScoreInput(ps.birdCardPoints),
          bonusCardPoints: parseScoreInput(ps.bonusCardPoints),
          eggsCount: parseScoreInput(ps.eggsCount),
          cachedFoodCount: parseScoreInput(ps.cachedFoodCount),
          tuckedCardsCount: parseScoreInput(ps.tuckedCardsCount),
          unusedFoodTokens: parseScoreInput(ps.unusedFoodTokens),
          roundGoals: ps.roundGoals.map(rg => ({
            round: rg.round,
            points: parseScoreInput(rg.points),
          })),
        });
      }

      navigation.goBack();
    } catch (e) {
      console.error('Update game error:', e);
      const message = e instanceof Error ? e.message : 'Unknown error';
      Alert.alert('Error', `Failed to update game: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.forest} />
        </View>
      </SafeAreaView>
    );
  }

  if (!game) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Game not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.instruction}>
          Tap a player to edit their scores. Totals and rankings will be recalculated automatically.
        </Text>

        {playerScores.map((ps, index) => {
          const isExpanded = expandedPlayer === ps.playerId;
          const total = calculateTotal(ps);

          return (
            <Card key={ps.playerId} style={styles.playerCard}>
              <TouchableOpacity
                style={styles.playerHeader}
                onPress={() => setExpandedPlayer(isExpanded ? null : ps.playerId)}
              >
                <View style={styles.playerInfo}>
                  <Avatar
                    name={ps.playerName}
                    avatarId={playerMap[ps.playerId]?.avatarId}
                    color={colors.avatars[index % colors.avatars.length]}
                    size="small"
                  />
                  <Text style={styles.playerName}>{ps.playerName}</Text>
                </View>
                <View style={styles.totalContainer}>
                  <Text style={styles.totalScore}>{total}</Text>
                  <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.scoreInputs}>
                  <View style={styles.inputRow}>
                    <Text style={styles.inputLabel}>Bird Cards</Text>
                    <Input
                      value={ps.birdCardPoints}
                      onChangeText={(v) => updatePlayerScore(ps.playerId, 'birdCardPoints', v)}
                      keyboardType="number-pad"
                      containerStyle={styles.inputContainer}
                    />
                  </View>

                  <View style={styles.inputRow}>
                    <Text style={styles.inputLabel}>Bonus Cards</Text>
                    <Input
                      value={ps.bonusCardPoints}
                      onChangeText={(v) => updatePlayerScore(ps.playerId, 'bonusCardPoints', v)}
                      keyboardType="number-pad"
                      containerStyle={styles.inputContainer}
                    />
                  </View>

                  <Text style={styles.sectionLabel}>Round Goals</Text>
                  <View style={styles.roundGoalsRow}>
                    {ps.roundGoals.map((rg) => (
                      <View key={rg.round} style={styles.roundGoalInput}>
                        <Text style={styles.roundLabel}>R{rg.round}</Text>
                        <Input
                          value={rg.points}
                          onChangeText={(v) => updateRoundGoal(ps.playerId, rg.round, v)}
                          keyboardType="number-pad"
                          containerStyle={styles.roundInputContainer}
                        />
                      </View>
                    ))}
                  </View>

                  <View style={styles.inputRow}>
                    <Text style={styles.inputLabel}>Eggs</Text>
                    <Input
                      value={ps.eggsCount}
                      onChangeText={(v) => updatePlayerScore(ps.playerId, 'eggsCount', v)}
                      keyboardType="number-pad"
                      containerStyle={styles.inputContainer}
                    />
                  </View>

                  <View style={styles.inputRow}>
                    <Text style={styles.inputLabel}>Cached Food</Text>
                    <Input
                      value={ps.cachedFoodCount}
                      onChangeText={(v) => updatePlayerScore(ps.playerId, 'cachedFoodCount', v)}
                      keyboardType="number-pad"
                      containerStyle={styles.inputContainer}
                    />
                  </View>

                  <View style={styles.inputRow}>
                    <Text style={styles.inputLabel}>Tucked Cards</Text>
                    <Input
                      value={ps.tuckedCardsCount}
                      onChangeText={(v) => updatePlayerScore(ps.playerId, 'tuckedCardsCount', v)}
                      keyboardType="number-pad"
                      containerStyle={styles.inputContainer}
                    />
                  </View>

                  <View style={styles.inputRow}>
                    <Text style={styles.inputLabel}>Unused Food (Tiebreaker)</Text>
                    <Input
                      value={ps.unusedFoodTokens}
                      onChangeText={(v) => updatePlayerScore(ps.playerId, 'unusedFoodTokens', v)}
                      keyboardType="number-pad"
                      containerStyle={styles.inputContainer}
                    />
                  </View>
                </View>
              )}
            </Card>
          );
        })}

        <Button
          title={isSaving ? 'Saving...' : 'Save Changes'}
          onPress={handleSave}
          size="large"
          style={styles.saveButton}
          disabled={isSaving}
        />
      </ScrollView>
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
    paddingBottom: spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.body,
    color: colors.text.secondary,
  },
  instruction: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.caption,
    color: colors.text.muted,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  playerCard: {
    marginBottom: spacing.md,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  playerName: {
    fontFamily: fontFamilies.body.semiBold,
    fontSize: fontSizes.body,
    color: colors.text.primary,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  totalScore: {
    fontFamily: fontFamilies.mono.medium,
    fontSize: fontSizes.scoreMedium,
    color: colors.primary.forest,
  },
  expandIcon: {
    fontSize: fontSizes.small,
    color: colors.text.muted,
  },
  scoreInputs: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  inputLabel: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.body,
    color: colors.text.secondary,
    flex: 1,
  },
  inputContainer: {
    width: 80,
    marginBottom: 0,
  },
  sectionLabel: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.caption,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  roundGoalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  roundGoalInput: {
    alignItems: 'center',
  },
  roundLabel: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.small,
    color: colors.text.muted,
    marginBottom: spacing.xs,
  },
  roundInputContainer: {
    width: 60,
    marginBottom: 0,
  },
  saveButton: {
    marginTop: spacing.lg,
  },
});
