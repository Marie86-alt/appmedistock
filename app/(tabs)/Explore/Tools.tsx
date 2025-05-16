import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../../styles/theme';

export default function Tools() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🔧 Convertisseurs & minuteur ici.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
  text: { fontSize: theme.typography.fontSizes.medium, color: theme.colors.text },
});
