import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { NewGameStackParamList } from '../../navigation/types';
import type { Expansion } from '../../types/models';
import { Button, Card } from '../../components/common';
import { colors } from '../../constants/colors';
import { fontFamilies, fontSizes } from '../../constants/typography';
import { spacing, borderRadius, shadows } from '../../constants/spacing';

type NavigationProp = NativeStackNavigationProp<NewGameStackParamList, 'SelectExpansions'>;
type RouteProps = RouteProp<NewGameStackParamList, 'SelectExpansions'>;

interface ExpansionInfo {
  id: Expansion;
  name: string;
  description: string;
  features: string[];
  color: string;
}

const EXPANSIONS: ExpansionInfo[] = [
  {
    id: 'european',
    name: 'European Expansion',
    description: 'Adds 81 European bird cards and new end-of-round goal tiles.',
    features: [
      'New end-of-round goal tiles',
      'Round-end bird powers (teal cards)',
      'Recommended: Use green (competitive) goal scoring',
    ],
    color: colors.expansion.european,
  },
  {
    id: 'oceania',
    name: 'Oceania Expansion',
    description: 'Introduces nectar as a new food type with end-game scoring.',
    features: [
      'Nectar: wildcard food that scores points',
      'Majority scoring per habitat (5pts/2pts)',
      'New player mats with nectar tracking',
    ],
    color: colors.expansion.oceania,
  },
];

export function SelectExpansionsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const [selectedExpansions, setSelectedExpansions] = useState<Expansion[]>([]);

  const { playerIds, playerNames } = route.params;

  const toggleExpansion = (expansionId: Expansion) => {
    setSelectedExpansions((prev) => {
      if (prev.includes(expansionId)) {
        return prev.filter((id) => id !== expansionId);
      }
      return [...prev, expansionId];
    });
  };

  const handleContinue = () => {
    navigation.navigate('SelectMode', {
      playerIds,
      playerNames,
      expansions: selectedExpansions,
    });
  };

  const isExpansionSelected = (id: Expansion) => selectedExpansions.includes(id);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Expansions</Text>
        <Text style={styles.subtitle}>
          Select any expansions you're playing with
        </Text>

        <View style={styles.expansionsList}>
          {EXPANSIONS.map((expansion) => {
            const isSelected = isExpansionSelected(expansion.id);

            return (
              <TouchableOpacity
                key={expansion.id}
                style={[
                  styles.expansionCard,
                  isSelected && styles.expansionCardSelected,
                  isSelected && { borderColor: expansion.color },
                ]}
                onPress={() => toggleExpansion(expansion.id)}
                activeOpacity={0.8}
              >
                <View style={styles.expansionHeader}>
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && { backgroundColor: expansion.color, borderColor: expansion.color },
                    ]}
                  >
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <View style={styles.expansionTitleContainer}>
                    <Text style={[styles.expansionName, isSelected && { color: expansion.color }]}>
                      {expansion.name}
                    </Text>
                    <View style={[styles.expansionBadge, { backgroundColor: expansion.color + '20' }]}>
                      <Text style={[styles.expansionBadgeText, { color: expansion.color }]}>
                        {expansion.id === 'oceania' ? 'Adds Nectar' : 'New Goals'}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.expansionDescription}>
                  {expansion.description}
                </Text>

                <View style={styles.featuresList}>
                  {expansion.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <Text style={[styles.featureBullet, { color: expansion.color }]}>•</Text>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Base Game Option */}
        <TouchableOpacity
          style={[
            styles.baseGameCard,
            selectedExpansions.length === 0 && styles.baseGameCardSelected,
          ]}
          onPress={() => setSelectedExpansions([])}
          activeOpacity={0.8}
        >
          <View style={styles.expansionHeader}>
            <View
              style={[
                styles.checkbox,
                selectedExpansions.length === 0 && styles.checkboxSelected,
              ]}
            >
              {selectedExpansions.length === 0 && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[
              styles.baseGameText,
              selectedExpansions.length === 0 && styles.baseGameTextSelected,
            ]}>
              Base Game Only
            </Text>
          </View>
          <Text style={styles.baseGameSubtext}>
            Standard Wingspan without any expansions
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomAction}>
        <Button
          title="Continue"
          onPress={handleContinue}
          size="large"
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
  title: {
    fontFamily: fontFamilies.display.bold,
    fontSize: 28,
    color: colors.primary.forest,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  expansionsList: {
    gap: spacing.md,
  },
  expansionCard: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border.light,
    ...shadows.small,
  },
  expansionCardSelected: {
    backgroundColor: colors.background.moss,
  },
  expansionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  checkboxSelected: {
    backgroundColor: colors.primary.forest,
    borderColor: colors.primary.forest,
  },
  checkmark: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: 'bold',
  },
  expansionTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  expansionName: {
    fontFamily: fontFamilies.display.semiBold,
    fontSize: fontSizes.h3,
    color: colors.text.primary,
  },
  expansionBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  expansionBadgeText: {
    fontFamily: fontFamilies.body.semiBold,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  expansionDescription: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    marginLeft: 32,
  },
  featuresList: {
    marginLeft: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  featureBullet: {
    fontFamily: fontFamilies.body.bold,
    fontSize: fontSizes.caption,
    marginRight: spacing.xs,
  },
  featureText: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.small,
    color: colors.text.secondary,
    flex: 1,
  },
  baseGameCard: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border.light,
    marginTop: spacing.lg,
  },
  baseGameCardSelected: {
    borderColor: colors.primary.forest,
    backgroundColor: colors.background.moss,
  },
  baseGameText: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.body,
    color: colors.text.primary,
  },
  baseGameTextSelected: {
    color: colors.primary.forest,
    fontFamily: fontFamilies.body.semiBold,
  },
  baseGameSubtext: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.small,
    color: colors.text.muted,
    marginLeft: 32,
    marginTop: 2,
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
});
