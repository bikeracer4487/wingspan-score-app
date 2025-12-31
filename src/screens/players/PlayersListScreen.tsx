import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { Button, Card, Avatar, Input } from '../../components/common';
import { usePlayers } from '../../hooks/usePlayers';
import type { Player } from '../../types/models';
import { colors } from '../../constants/colors';
import { fontFamilies, fontSizes } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';
import { DEFAULT_AVATAR_COLORS } from '../../constants/scoring';
import { validatePlayerName } from '../../utils/validation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function PlayersListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { players, isLoading, createPlayer, deletePlayer, refresh } = usePlayers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedColor, setSelectedColor] = useState(DEFAULT_AVATAR_COLORS[0]);
  const [nameError, setNameError] = useState<string | undefined>();

  const handleAddPlayer = async () => {
    const validation = validatePlayerName(newPlayerName);
    if (!validation.valid) {
      setNameError(validation.error);
      return;
    }

    try {
      await createPlayer(newPlayerName, selectedColor);
      setIsModalOpen(false);
      setNewPlayerName('');
      setSelectedColor(DEFAULT_AVATAR_COLORS[0]);
      setNameError(undefined);
    } catch (e) {
      console.error('Create player error:', e);
      const message = e instanceof Error ? e.message : 'Unknown error';
      Alert.alert('Error', `Failed to create player: ${message}`);
    }
  };

  const handleDeletePlayer = (player: Player) => {
    Alert.alert(
      'Delete Player',
      `Are you sure you want to delete ${player.name}? Their game history will be preserved.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePlayer(player.id);
            } catch (e) {
              Alert.alert('Error', 'Failed to delete player');
            }
          },
        },
      ]
    );
  };

  const handlePlayerPress = (player: Player) => {
    navigation.navigate('Player', {
      screen: 'PlayerDetail',
      params: { playerId: player.id },
    });
  };

  const renderPlayer = ({ item }: { item: Player }) => (
    <Card style={styles.playerCard} onPress={() => handlePlayerPress(item)}>
      <View style={styles.playerRow}>
        <Avatar name={item.name} color={item.avatarColor} size="medium" />
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{item.name}</Text>
          <Text style={styles.playerSubtext}>Tap to view stats</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeletePlayer(item)}
        >
          <Text style={styles.deleteIcon}>×</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Players</Text>
        <Text style={styles.count}>{players.length} total</Text>
      </View>

      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        renderItem={renderPlayer}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No players yet</Text>
            <Text style={styles.emptySubtext}>Add players to start tracking scores</Text>
          </View>
        }
      />

      <View style={styles.bottomAction}>
        <Button
          title="Add Player"
          onPress={() => setIsModalOpen(true)}
          size="large"
          style={styles.addButton}
        />
      </View>

      {/* Add Player Modal */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsModalOpen(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Player</Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={styles.modalContent}>
            <View style={styles.avatarPreview}>
              <Avatar
                name={newPlayerName || 'New'}
                color={selectedColor}
                size="large"
              />
            </View>

            <Input
              label="Player Name"
              value={newPlayerName}
              onChangeText={(text) => {
                setNewPlayerName(text);
                setNameError(undefined);
              }}
              placeholder="Enter name"
              error={nameError}
              autoFocus
              maxLength={30}
            />

            <Text style={styles.colorLabel}>Avatar Color</Text>
            <View style={styles.colorGrid}>
              {DEFAULT_AVATAR_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorSelected,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>

            <Button
              title="Create Player"
              onPress={handleAddPlayer}
              size="large"
              style={styles.createButton}
              disabled={!newPlayerName.trim()}
            />
          </View>
        </SafeAreaView>
      </Modal>
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
    paddingBottom: 120,
  },
  playerCard: {
    marginBottom: spacing.md,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  playerName: {
    fontFamily: fontFamilies.body.semiBold,
    fontSize: fontSizes.body,
    color: colors.text.primary,
  },
  playerSubtext: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.caption,
    color: colors.text.muted,
    marginTop: 2,
  },
  deleteButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    fontSize: 28,
    color: colors.text.muted,
    fontWeight: '300',
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
  addButton: {
    width: '100%',
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.cream,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  cancelButton: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.body,
    color: colors.primary.wetland,
  },
  modalTitle: {
    fontFamily: fontFamilies.display.semiBold,
    fontSize: fontSizes.h3,
    color: colors.text.primary,
  },
  modalContent: {
    padding: spacing.xl,
  },
  avatarPreview: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  colorLabel: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorSelected: {
    borderColor: colors.primary.forest,
  },
  createButton: {
    marginTop: spacing.md,
  },
});
