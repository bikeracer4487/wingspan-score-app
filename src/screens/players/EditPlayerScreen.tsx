import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { PlayerStackParamList } from '../../navigation/types';
import { Button, Avatar, Input } from '../../components/common';
import { usePlayer } from '../../hooks/usePlayers';
import { usePlayers } from '../../hooks/usePlayers';
import { colors } from '../../constants/colors';
import { fontFamilies, fontSizes } from '../../constants/typography';
import { spacing, borderRadius } from '../../constants/spacing';
import { BIRD_AVATARS } from '../../constants/birdAvatars';
import { validatePlayerName } from '../../utils/validation';

type RouteProps = RouteProp<PlayerStackParamList, 'EditPlayer'>;
type NavigationProp = NativeStackNavigationProp<PlayerStackParamList, 'EditPlayer'>;

export function EditPlayerScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { playerId } = route.params;
  const { width: screenWidth } = useWindowDimensions();

  const { player, isLoading: isLoadingPlayer } = usePlayer(playerId);
  const { updatePlayer, checkNameExists } = usePlayers();

  // Calculate bird avatar size for 4 columns
  const contentPadding = spacing.xl * 2; // 64px total horizontal padding
  const gridGap = spacing.md; // 16px gap between items
  const numColumns = 4;
  const totalGapWidth = gridGap * (numColumns - 1); // 48px for 3 gaps
  const availableWidth = screenWidth - contentPadding;
  const birdSize = Math.floor((availableWidth - totalGapWidth) / numColumns);

  const [name, setName] = useState('');
  const [selectedBirdId, setSelectedBirdId] = useState<string>('');
  const [nameError, setNameError] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form with player data
  useEffect(() => {
    if (player) {
      setName(player.name);
      setSelectedBirdId(player.avatarId || 'cardinal');
    }
  }, [player]);

  // Set up header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Edit Player',
      headerBackTitle: 'Cancel',
    });
  }, [navigation]);

  const handleSave = async () => {
    // Validate name
    const validation = validatePlayerName(name);
    if (!validation.valid) {
      setNameError(validation.error);
      return;
    }

    // Check for duplicate name (excluding current player)
    const nameExists = await checkNameExists(name, playerId);
    if (nameExists) {
      setNameError('A player with this name already exists');
      return;
    }

    try {
      setIsSaving(true);
      await updatePlayer(playerId, {
        name: name.trim(),
        avatarId: selectedBirdId,
      });
      navigation.goBack();
    } catch (e) {
      console.error('Update player error:', e);
      const message = e instanceof Error ? e.message : 'Unknown error';
      Alert.alert('Error', `Failed to update player: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingPlayer) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.forest} />
        </View>
      </SafeAreaView>
    );
  }

  if (!player) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Player not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const hasChanges = name !== player.name || selectedBirdId !== (player.avatarId || 'cardinal');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Avatar Preview */}
        <View style={styles.avatarPreview}>
          <Avatar
            name={name || 'Player'}
            avatarId={selectedBirdId}
            size="large"
          />
        </View>

        {/* Name Input */}
        <Input
          label="Player Name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setNameError(undefined);
          }}
          placeholder="Enter name"
          error={nameError}
          maxLength={30}
        />

        {/* Bird Selection */}
        <Text style={styles.birdLabel}>Choose Your Bird</Text>
        <View style={[styles.birdGrid, { gap: gridGap }]}>
          {BIRD_AVATARS.map((bird) => (
            <TouchableOpacity
              key={bird.id}
              style={[
                styles.birdOption,
                { width: birdSize, height: birdSize, borderRadius: birdSize / 2 },
                selectedBirdId === bird.id && styles.birdSelected,
              ]}
              onPress={() => setSelectedBirdId(bird.id)}
            >
              <Image
                source={bird.image}
                style={styles.birdImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Save Button */}
      <View style={styles.floatingButtonContainer}>
        <Button
          title={isSaving ? 'Saving...' : 'Save Changes'}
          onPress={handleSave}
          size="large"
          disabled={!name.trim() || !hasChanges || isSaving}
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
    paddingBottom: 120, // Extra space for floating button
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
  avatarPreview: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  birdLabel: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  birdGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  birdOption: {
    borderWidth: 3,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  birdSelected: {
    borderColor: colors.primary.forest,
  },
  birdImage: {
    width: '100%',
    height: '100%',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xl,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background.cream,
  },
});
