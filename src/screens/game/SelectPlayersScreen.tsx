import React, { useState, useLayoutEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NewGameStackParamList, RootStackParamList } from '../../navigation/types';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { Button, Card, Avatar } from '../../components/common';
import { usePlayers } from '../../hooks/usePlayers';
import { colors } from '../../constants/colors';
import { fontFamilies, fontSizes } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';
import { MAX_PLAYERS, MIN_PLAYERS } from '../../constants/scoring';

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<NewGameStackParamList, 'SelectPlayers'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export function SelectPlayersScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { players, refresh } = usePlayers();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Refresh player list when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  // Add Cancel button in header for iOS
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.getParent()?.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const togglePlayer = (playerId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(playerId)) {
        return prev.filter((id) => id !== playerId);
      }
      if (prev.length >= MAX_PLAYERS) {
        Alert.alert('Maximum Players', `Wingspan supports up to ${MAX_PLAYERS} players`);
        return prev;
      }
      return [...prev, playerId];
    });
  };

  const handleContinue = () => {
    if (selectedIds.length < MIN_PLAYERS) {
      Alert.alert('Select Players', `Please select at least ${MIN_PLAYERS} player`);
      return;
    }

    // Build player names map
    const playerNames: Record<string, string> = {};
    for (const id of selectedIds) {
      const player = players.find((p) => p.id === id);
      if (player) {
        playerNames[id] = player.name;
      }
    }

    // Navigate to next screen with selected players
    navigation.navigate('SelectMode', {
      playerIds: selectedIds,
      playerNames,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.instruction}>
          Select {MIN_PLAYERS}-{MAX_PLAYERS} players for this game
        </Text>

        <View style={styles.selectedCount}>
          <Text style={styles.selectedText}>
            {selectedIds.length} selected
          </Text>
        </View>

        {players.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No players available</Text>
            <Text style={styles.emptySubtext}>
              Go to the Players tab to add players first
            </Text>
          </Card>
        ) : (
          <View style={styles.playerGrid}>
            {players.map((player) => {
              const isSelected = selectedIds.includes(player.id);
              const selectionIndex = selectedIds.indexOf(player.id);

              return (
                <TouchableOpacity
                  key={player.id}
                  style={[
                    styles.playerCard,
                    isSelected && styles.playerCardSelected,
                  ]}
                  onPress={() => togglePlayer(player.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.playerContent}>
                    <Avatar
                      name={player.name}
                      avatarId={player.avatarId}
                      color={player.avatarColor}
                      size="medium"
                    />
                    <Text
                      style={[
                        styles.playerName,
                        isSelected && styles.playerNameSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {player.name}
                    </Text>
                  </View>

                  {isSelected && (
                    <View style={styles.selectionBadge}>
                      <Text style={styles.selectionNumber}>
                        {selectionIndex + 1}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomAction}>
        <Button
          title={`Continue with ${selectedIds.length} Player${selectedIds.length !== 1 ? 's' : ''}`}
          onPress={handleContinue}
          size="large"
          disabled={selectedIds.length < MIN_PLAYERS}
          style={styles.continueButton}
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
  instruction: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  selectedCount: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  selectedText: {
    fontFamily: fontFamilies.body.semiBold,
    fontSize: fontSizes.caption,
    color: colors.primary.wetland,
    backgroundColor: colors.background.moss,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
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
    textAlign: 'center',
  },
  playerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  playerCard: {
    width: '47%',
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border.light,
    position: 'relative',
  },
  playerCardSelected: {
    borderColor: colors.primary.forest,
    backgroundColor: colors.background.moss,
  },
  playerContent: {
    alignItems: 'center',
  },
  playerName: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.caption,
    color: colors.text.primary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  playerNameSelected: {
    color: colors.primary.forest,
    fontFamily: fontFamilies.body.semiBold,
  },
  selectionBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionNumber: {
    fontFamily: fontFamilies.body.bold,
    fontSize: 12,
    color: colors.text.inverse,
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
  continueButton: {
    width: '100%',
  },
  cancelButton: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.body,
    color: colors.primary.wetland,
  },
});
