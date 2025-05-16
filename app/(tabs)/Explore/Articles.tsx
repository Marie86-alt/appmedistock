import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../../styles/theme';

export default function Articles() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>📄 Ici, tu pourras lister des articles santé.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
  text: { fontSize: theme.typography.fontSizes.medium, color: theme.colors.text },
});
