// app/index.tsx
import { Redirect } from 'expo-router';
import { useAuth } from './contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import theme from './styles/theme';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  // Afficher un écran de chargement pendant la vérification
  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: theme.colors.background 
      }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Rediriger selon l'état d'authentification
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/Dashboard" />;
  } else {
    return <Redirect href="/(auth)/Login" />;
  }
}