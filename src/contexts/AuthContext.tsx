//contexts/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../../services/api';
import { ApiResponse, User } from '../types/models';

// Définition des types pour le contexte d'authentification
type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<ApiResponse<{ token: string; user: User }>>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<ApiResponse<{ token: string; user: User }>>;
  logout: () => Promise<void>;
  refreshAuthState: () => Promise<void>;
};

// Création du contexte avec des valeurs par défaut
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  refreshAuthState: async () => {},
});

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

// Provider pour le contexte d'authentification
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Vérification de l'état d'authentification au chargement
  useEffect(() => {
    refreshAuthState();
  }, []);

  // Fonction pour rafraîchir l'état d'authentification
  const refreshAuthState = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');

      if (token && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de connexion
  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);

      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        // Correction ici - utilisation de userData au lieu de user
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
      }

      return response;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return {
        success: false,
        message: 'Une erreur s\'est produite lors de la connexion',
      };
    }
  };

  // Fonction d'inscription corrigée
  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    try {
      console.log('AuthContext - Tentative d\'inscription avec:', userData.email);

      // Utiliser l'API pour l'inscription
      const response = await api.register(userData);

      console.log('AuthContext - Réponse brute de l\'API:', response);

      if (response.success && response.data) {
        const { token, user: registeredUser } = response.data;
        // Stocker le token et les données utilisateur
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(registeredUser));
        // Mettre à jour l'état
        setUser(registeredUser);
        setIsAuthenticated(true);
        return response;
      } else {
        // Assurer qu'il y a toujours un message d'erreur
        console.log('AuthContext - Échec de l\'inscription:', response.message || 'Erreur inconnue');
        return {
          success: false,
          message: response.message || 'Une erreur s\'est produite lors de l\'inscription'
        };
      }
    } catch (error) {
      console.error('AuthContext - Erreur complète lors de l\'inscription:', error);
      return {
        success: false,
        message: 'Une erreur s\'est produite lors de l\'inscription'
      };
    }
  };
  // Fonction de déconnexion
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        register,
        logout,
        refreshAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;





