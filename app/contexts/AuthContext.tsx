// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, ApiResponse } from '../types';
import api from '../services/api';

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
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(user));
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

  // Fonction d'inscription
  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    try {
      // Si votre API a une fonction d'inscription, utilisez-la ici
      // Pour l'instant, nous simulons une inscription réussie
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockResponse: ApiResponse<{ token: string; user: User }> = {
        success: true,
        data: {
          token: 'fake-token-' + Math.random().toString(36).substring(2, 15),
          user: {
            id: Math.random().toString(36).substring(2, 10),
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      };

      return mockResponse;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      return {
        success: false,
        message: 'Une erreur s\'est produite lors de l\'inscription',
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
