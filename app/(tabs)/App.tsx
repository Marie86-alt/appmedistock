// App.tsx
import 'react-native-gesture-handler';
// Doit être la première importation
import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// Écrans et navigateurs
import AuthNavigator from '../navigation/AuthNavigator';
import DashboardScreen from '../screens/main/DashboardScreen';
// Styles et thème
import theme from '../styles/theme';
// Contexte d'authentification
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Définition des types pour la navigation principale
type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Composant principal de navigation qui utilise le contexte d'authentification
const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();

  // Afficher un écran de chargement si nécessaire
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"
      />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          // Écran principal si l'utilisateur est connecté
          <Stack.Screen name="Main">
            {() => <DashboardScreen onLogout={logout} />}
          </Stack.Screen>
        ) : (
          // Navigateur d'authentification si l'utilisateur n'est pas connecté
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Composant racine de l'application qui fournit le contexte d'authentification
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
