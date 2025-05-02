// app/auth/LoginScreen.tsx
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import theme from '../styles/theme';

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validation de l'email
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("L&apos;email est requis");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Format d&apos;email invalide");
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  // Validation du mot de passe
  const validatePassword = () => {
    if (!password) {
      setPasswordError('Le mot de passe est requis');
      return false;
    } else if (password.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  // Gestion de la connexion
  const handleLogin = async () => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid) {
      setIsLoading(true);
      try {
        // Utiliser le contexte d'authentification pour la connexion
        const response = await login(email, password);

        if (!response.success) {
          // Afficher un message d'erreur
          Alert.alert(
            'Erreur de connexion',
            response.message || 'Identifiants incorrects',
            [{ text: 'OK' }]
          );
        }
        // Si la connexion réussit, l'application sera automatiquement redirigée
        // vers le tableau de bord grâce au contexte d'authentification
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        Alert.alert(
          'Erreur',
          "Une erreur s&apos;est produite lors de la connexion",
          [{ text: 'OK' }]
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Navigation vers l'écran d'inscription
  const navigateToRegister = () => {
    router.push('/auth/RegisterScreen');
  };

  // Navigation vers l'écran de récupération de mot de passe
  const navigateToForgotPassword = () => {
    router.push('/auth/ForgotPasswordScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <Text style={styles.appTitle}>MédiStock</Text>
            <Text style={styles.appSubtitle}>Votre assistant de gestion médicale</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              onBlur={validateEmail}
              placeholder="Entrez votre email"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              onBlur={validatePassword}
              placeholder="Entrez votre mot de passe"
              secureTextEntry
              editable={!isLoading}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={navigateToForgotPassword}
              disabled={isLoading}
            >
              <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Se connecter</Text>
              )}
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Vous n&apos;avez pas de compte ?</Text>
              <TouchableOpacity onPress={navigateToRegister} disabled={isLoading}>
                <Text style={styles.registerLink}>S&apos;inscrire</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.m,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  appTitle: {
    fontSize: theme.typography.fontSizes.title,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  appSubtitle: {
    fontSize: theme.typography.fontSizes.medium,
    color: theme.colors.textSecondary,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: theme.typography.fontSizes.medium,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    fontSize: theme.typography.fontSizes.medium,
    marginBottom: theme.spacing.m,
    backgroundColor: theme.colors.surface,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSizes.small,
    marginTop: -theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.m,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSizes.medium,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginBottom: theme.spacing.l,
  },
  loginButtonDisabled: {
    backgroundColor: theme.colors.disabled,
  },
  loginButtonText: {
    color: 'white',
    fontSize: theme.typography.fontSizes.large,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  registerText: {
    fontSize: theme.typography.fontSizes.medium,
    color: theme.colors.textSecondary,
  },
  registerLink: {
    fontSize: theme.typography.fontSizes.medium,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default LoginScreen;