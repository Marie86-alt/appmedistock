import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import theme from '../../../src/styles/theme';

export default function ExploreIndex() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Explore</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/(tabs)/Explore/Articles')}
      >
        <Text style={styles.cardTitle}>📝 Articles Santé</Text>
        <Text style={styles.cardSubtitle}>Conseils & actualités</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/(tabs)/Explore/Pharmacies')}
      >
        <Text style={styles.cardTitle}>🏥 Pharmacies</Text>
        <Text style={styles.cardSubtitle}>Trouvez une pharmacie près de vous</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/(tabs)/Explore/Tools')}
      >
        <Text style={styles.cardTitle}>🛠️ Outils</Text>
        <Text style={styles.cardSubtitle}>Convertisseur & minuteur</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.m,
  },
  title: {
    fontSize: theme.typography.fontSizes.large,
    fontWeight: 'bold',
    marginBottom: theme.spacing.l,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.m,
    elevation: 2,
  },
  cardTitle: {
    fontSize: theme.typography.fontSizes.medium,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  cardSubtitle: {
    fontSize: theme.typography.fontSizes.small,
    color: theme.colors.textSecondary,
  },
});
