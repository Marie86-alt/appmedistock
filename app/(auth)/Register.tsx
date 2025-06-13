

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,

  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/styles';

const Register: React.FC = () => {
  const router = useRouter();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword] = useState(false);
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateFirstName = () => {
    if (!firstName.trim()) {
      setFirstNameError('Le prénom est requis');
      return false;
    } else {
      setFirstNameError('');
      return true;
    }
  };

  const validateLastName = () => {
    if (!lastName.trim()) {
      setLastNameError('Le nom est requis');
      return false;
    } else {
      setLastNameError('');
      return true;
    }
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("L'email est requis");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Format d'email invalide");
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

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

  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmPasswordError('Veuillez confirmer votre mot de passe');
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas');
      return false;
    } else {
      setConfirmPasswordError('');
      return true;
    }
  };

  const validatePhone = () => {
    if (phone && !/^\d{10}$/.test(phone.replace(/\s/g, ''))) {
      setPhoneError('Format de numéro de téléphone invalide');
      return false;
    } else {
      setPhoneError('');
      return true;
    }
  };

  const handleRegister = async () => {
    console.log('Début de handleRegister');
    console.log('Données soumises:', { firstName, lastName, email, phone, password, confirmPassword });

    setGeneralError('');

    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    const isPhoneValid = validatePhone();

    console.log('Résultat de la validation:', {
      isFirstNameValid,
      isLastNameValid,
      isEmailValid,
      isPasswordValid,
      isConfirmPasswordValid,
      isPhoneValid,
    });

    if (isFirstNameValid && isLastNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isPhoneValid) {
      setIsLoading(true);
      try {
        console.log('Appel de la fonction register...');
        const response = await register({
          email,
          password,
          firstName,
          lastName,
          phone,
        });
        console.log('Réponse de register:', response);

        if (response.success) {
          Alert.alert(
            'Inscription réussie',
            'Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.',
            [
              {
                text: 'OK',
                onPress: () => router.push('/Login'),
              },
            ]
          );
        } else {
          console.log('Échec de l\'inscription:', response.message);
          setGeneralError(response.message || "Une erreur s'est produite lors de l'inscription");
        }
      } catch {
        console.error("Erreur lors de l'inscription");
        setGeneralError('Une erreur s\'est produite lors de l\'inscription. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Validation échouée');
    }
  };

  const navigateToLogin = () => {
    router.push('/Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <Text style={styles.appTitle}>MédiStock</Text>
            <Text style={styles.appSubtitle}>Créer un compte</Text>
          </View>

          <View style={styles.formContainer}>
            {generalError ? <Text style={styles.generalError}>{generalError}</Text> : null}

            <Text style={styles.label}>Prénom</Text>
            <TextInput
              style={[styles.input, styles.inputShadow]}
              value={firstName}
              onChangeText={setFirstName}
              onBlur={validateFirstName}
              placeholder="Entrez votre prénom"
              editable={!isLoading}
            />
            {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}

            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={[styles.input, styles.inputShadow]}
              value={lastName}
              onChangeText={setLastName}
              onBlur={validateLastName}
              placeholder="Entrez votre nom"
              editable={!isLoading}
            />
            {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.inputShadow]}
              value={email}
              onChangeText={setEmail}
              onBlur={validateEmail}
              placeholder="Entrez votre email"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            <Text style={styles.label}>Numéro de téléphone (optionnel)</Text>
            <TextInput
              style={[styles.input, styles.inputShadow]}
              value={phone}
              onChangeText={setPhone}
              onBlur={validatePhone}
              placeholder="Entrez votre numéro de téléphone"
              keyboardType="phone-pad"
              editable={!isLoading}
            />
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={[styles.input, styles.inputShadow]}
              value={password}
              onChangeText={setPassword}
              onBlur={validatePassword}
              placeholder="Entrez votre mot de passe"
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <Text style={styles.label}>Confirmez le mot de passe</Text>
            <TextInput
              style={[styles.input, styles.inputShadow]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onBlur={validateConfirmPassword}
              placeholder="Confirmez votre mot de passe"
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.disabledButton]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>S&apos;inscrire</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Vous avez déjà un compte ?</Text>
              <TouchableOpacity onPress={navigateToLogin} disabled={isLoading}>
                <Text style={styles.loginLink}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};



export default Register;

