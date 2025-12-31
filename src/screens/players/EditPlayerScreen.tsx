import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '../../constants/colors';

export function EditPlayerScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Edit Player Screen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.cream,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.text.primary,
  },
});
