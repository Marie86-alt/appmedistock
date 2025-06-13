// src/screens/auth/ResetPasswordScreen.tsx
import { useRouter } from 'expo-router';
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
import api from '../../services/api';
import theme from '../styles/theme';


const ResetPassword: React.FC = () => {
  const router = useRouter();
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token') || '';
  
  // États du formulaire
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

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

  // Validation de la confirmation du mot de passe
  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmPasswordError('La confirmation du mot de passe est requise');
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas');
      return false;
    } else {
      setConfirmPasswordError('');
      return true;
    }
  };

  // Gestion de la réinitialisation du mot de passe
  const handleResetPassword = async () => {
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    if (isPasswordValid && isConfirmPasswordValid) {
      setIsSubmitting(true);

      try {
        // Si votre API a une fonction resetPassword, utilisez-la ici
        if (api.resetPassword) {
          const response = await api.resetPassword(token, password);
          if (!response.success) {
            Alert.alert(
              'Erreur',
              response.message || 'Une erreur est survenue lors de la réinitialisation du mot de passe.'
            );
            return;
          }
        } else {
          // Simuler un délai si l'API n'existe pas encore
          await new Promise(resolve => setTimeout(resolve, 1500));
        }

        setResetComplete(true);
      } catch  (error){
        console.error( error);
        Alert.alert(
          'Erreur',
          'Une erreur est survenue lors de la réinitialisation du mot de passe. Veuillez réessayer.'
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Navigation vers l'écran de connexion
  const navigateToLogin = () => {
    router.push('/Login');
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
            <Text style={styles.appSubtitle}>Réinitialisation du mot de passe</Text>
          </View>

          <View style={styles.formContainer}>
            {resetComplete ? (
              <View style={styles.successContainer}>
                <Text style={styles.successTitle}>Mot de passe réinitialisé !</Text>
                <Text style={styles.successText}>
                  Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                </Text>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={navigateToLogin}
                >
                  <Text style={styles.loginButtonText}>Se connecter</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.instructionText}>
                  Veuillez créer un nouveau mot de passe sécurisé pour votre compte.
                </Text>

                <Text style={styles.label}>Nouveau mot de passe</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  onBlur={validatePassword}
                  placeholder="Entrez votre nouveau mot de passe"
                  secureTextEntry
                  editable={!isSubmitting}
                />
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                <Text style={styles.label}>Confirmer le mot de passe</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onBlur={validateConfirmPassword}
                  placeholder="Confirmez votre nouveau mot de passe"
                  secureTextEntry
                  editable={!isSubmitting}
                />
                {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

                <View style={styles.requirementsContainer}>
                  <Text style={styles.requirementsTitle}>Exigences de sécurité :</Text>
                  <Text style={styles.requirementItem}>• Au moins 6 caractères</Text>
                  <Text style={styles.requirementItem}>• Combinez lettres, chiffres et caractères spéciaux pour un mot de passe plus sécurisé</Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.resetButton,
                    isSubmitting && styles.disabledButton,
                  ]}
                  onPress={handleResetPassword}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.resetButtonText}>Réinitialiser le mot de passe</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.backToLoginLink}
                  onPress={navigateToLogin}
                  disabled={isSubmitting}
                >
                  <Text style={styles.backLinkText}>Retour à la connexion</Text>
                </TouchableOpacity>
              </>
            )}
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
    fontSize: theme.typography.fontSizes.large,
    color: theme.colors.textSecondary,
  },
  formContainer: {
    width: '100%',
  },
  instructionText: {
    fontSize: theme.typography.fontSizes.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.l,
    textAlign: 'center',
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
  requirementsContainer: {
    backgroundColor: '#F5F5F5',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.l,
  },
  requirementsTitle: {
    fontSize: theme.typography.fontSizes.medium,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  requirementItem: {
    fontSize: theme.typography.fontSizes.small,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  resetButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginBottom: theme.spacing.l,
  },
  disabledButton: {
    backgroundColor: theme.colors.disabled,
  },
  resetButtonText: {
    color: 'white',
    fontSize: theme.typography.fontSizes.large,
    fontWeight: '600',
  },
  backToLoginLink: {
    alignItems: 'center',
    padding: theme.spacing.m,
  },
  backLinkText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSizes.medium,
  },
  successContainer: {
    alignItems: 'center',
    padding: theme.spacing.l,
    backgroundColor: '#E8F5E9', // Vert très pâle
    borderRadius: theme.borderRadius.medium,
    marginVertical: theme.spacing.l,
  },
  successTitle: {
    fontSize: theme.typography.fontSizes.xlarge,
    fontWeight: 'bold',
    color: theme.colors.secondary,
    marginBottom: theme.spacing.m,
  },
  successText: {
    fontSize: theme.typography.fontSizes.medium,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.l,
    lineHeight: 20,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    alignItems: 'center',
    width: '100%',
  },
  loginButtonText: {
    color: 'white',
    fontSize: theme.typography.fontSizes.medium,
    fontWeight: '600',
  },
});

export default ResetPassword;
