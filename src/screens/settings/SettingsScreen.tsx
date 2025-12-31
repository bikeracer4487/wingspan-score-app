import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Button, Card } from '../../components/common';
import { resetDatabase } from '../../db/database';
import { colors } from '../../constants/colors';
import { fontFamilies, fontSizes } from '../../constants/typography';
import { spacing } from '../../constants/spacing';

export function SettingsScreen() {
  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all players, games, and statistics. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetDatabase();
              Alert.alert('Success', 'All data has been reset.');
            } catch (e) {
              Alert.alert('Error', 'Failed to reset data.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.text}>Wingspan Score Tracker v1.0.0</Text>
          <Text style={styles.textMuted}>
            Track your Wingspan board game scores and statistics
          </Text>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Scoring Rules</Text>
          <Text style={styles.textMuted}>Based on Wingspan base game rules:</Text>
          <Text style={styles.rule}>• Bird Cards: Face value points</Text>
          <Text style={styles.rule}>• Bonus Cards: Objective points</Text>
          <Text style={styles.rule}>• Round Goals: Competitive or Casual</Text>
          <Text style={styles.rule}>• Eggs: 1 point each</Text>
          <Text style={styles.rule}>• Cached Food: 1 point each</Text>
          <Text style={styles.rule}>• Tucked Cards: 1 point each</Text>
          <Text style={styles.textMuted}>
            Tiebreaker: Most unused food tokens
          </Text>
        </Card>

        <Card style={[styles.section, styles.dangerSection]}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <Text style={styles.textMuted}>
            Reset all data including players, games, and statistics.
          </Text>
          <Button
            title="Reset All Data"
            onPress={handleResetData}
            variant="outline"
            size="small"
            style={styles.resetButton}
          />
        </Card>
      </View>
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
  title: {
    fontFamily: fontFamilies.display.bold,
    fontSize: 28,
    color: colors.primary.forest,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: fontFamilies.body.semiBold,
    fontSize: fontSizes.body,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  text: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.body,
    color: colors.text.primary,
  },
  textMuted: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.caption,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  rule: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.caption,
    color: colors.text.secondary,
    paddingVertical: 2,
  },
  dangerSection: {
    borderColor: colors.semantic.error,
    borderWidth: 1,
  },
  resetButton: {
    marginTop: spacing.md,
    borderColor: colors.semantic.error,
  },
});
