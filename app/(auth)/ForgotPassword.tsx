// src/screens/auth/ForgotPasswordScreen.tsx

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
//import { AuthStackParamList } from '../navigation/AuthNavigator';
import api from '../../services/api';
import theme from '../../src/styles/theme';
//

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  // États du formulaire
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Validation de l'email
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('L\'email est requis');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Format d\'email invalide');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  // Gestion de la demande de réinitialisation
  const handleResetPassword = async () => {
    const isEmailValid = validateEmail();

    if (isEmailValid) {
      setIsSubmitting(true);

      try {
        // Si votre API a une fonction requestPasswordReset, utilisez-la ici
        if (api.requestPasswordReset) {
          const response = await api.requestPasswordReset(email);
          if (!response.success) {
            Alert.alert(
              'Erreur',
              response.message || 'Une erreur est survenue lors de l\'envoi de l\'email de réinitialisation.'
            );
            return;
          }
        } else {
          // Simuler un délai d'envoi si l'API n'existe pas encore
          await new Promise(resolve => setTimeout(resolve, 1500));
        }

        setResetSent(true);
        console.log('Demande de réinitialisation envoyée à:', email);
      } catch (error) {
        console.error(error);
        Alert.alert(
          'Erreur',
          'Une erreur est survenue lors de l\'envoi de l\'email de réinitialisation. Veuillez réessayer.'
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

  // Renvoyer l'email de réinitialisation
  const handleResendEmail = async () => {
    setIsSubmitting(true);

    try {
      if (api.requestPasswordReset) {
        const response = await api.requestPasswordReset(email);
        if (!response.success) {
          Alert.alert(
            'Erreur',
            response.message || 'Une erreur est survenue lors de l\'envoi de l\'email de réinitialisation.'
          );
          return;
        }
      } else {
        // Simuler un délai d'envoi si l'API n'existe pas encore
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      Alert.alert(
        'Email envoyé',
        `Un nouvel email de réinitialisation a été envoyé à ${email}.`
      );
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de l\'envoi de l\'email de réinitialisation. Veuillez réessayer.'
      );
    } finally {
      setIsSubmitting(false);
    }
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
            <Text style={styles.appSubtitle}>Récupération de mot de passe</Text>
          </View>

          <View style={styles.formContainer}>
            {resetSent ? (
              <View style={styles.successContainer}>
                <Text style={styles.successTitle}>E-mail envoyé !</Text>
                <Text style={styles.successText}>
                  Si un compte existe avec cet e-mail ({email}), vous recevrez prochainement
                  des instructions pour réinitialiser votre mot de passe.
                </Text>

                <TouchableOpacity
                  style={styles.backToLoginButton}
                  onPress={navigateToLogin}
                  disabled={isSubmitting}
                >
                  <Text style={styles.backToLoginText}>Retour à la connexion</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resendLink}
                  onPress={handleResendEmail}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                  ) : (
                    <Text style={styles.resendLinkText}>Renvoyer l&apos;email</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.instructionText}>
                  Entrez votre adresse e-mail ci-dessous et nous vous enverrons
                  un lien pour réinitialiser votre mot de passe.
                </Text>

                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  onBlur={validateEmail}
                  placeholder="Entrez votre email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isSubmitting}
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

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
                    <Text style={styles.resetButtonText}>Envoyer le lien</Text>
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
  backToLoginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing.m,
  },
  backToLoginText: {
    color: 'white',
    fontSize: theme.typography.fontSizes.medium,
    fontWeight: '600',
  },
  resendLink: {
    alignItems: 'center',
    marginTop: theme.spacing.m,
    padding: theme.spacing.s,
  },
  resendLinkText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSizes.medium,
    fontWeight: '500',
  },
});

export default ForgotPassword;
