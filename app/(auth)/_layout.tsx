// app/(auth)/_layout.tsx
import React from 'react';
import { Stack,  useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/Dashboard'); // Redirige vers le tableau de bord si l'utilisateur est authentifié
    }
  }, [isAuthenticated, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* fichiers Login.tsx, Register.tsx, etc. s’appelleront automatiquement */}
      <Stack.Screen name="Login" />
      <Stack.Screen name="Register" />
      <Stack.Screen name="ForgotPassword" />
      <Stack.Screen name="ResetPassword" />
    </Stack>
  );
}
