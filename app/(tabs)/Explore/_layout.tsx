import React from 'react';
import { Stack } from 'expo-router';

export default function ExploreLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerTitleAlign: 'center' }}>
      <Stack.Screen name="index" options={{ title: 'Explorer' }} />
      <Stack.Screen name="Articles" options={{ title: 'Articles Santé' }} />
      <Stack.Screen name="Pharmacies" options={{ title: 'Pharmacies' }} />
      <Stack.Screen name="Tools" options={{ title: 'Outils' }} />
    </Stack>
  );
}
