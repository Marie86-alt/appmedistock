// src/services/api.ts
import axios from 'axios';
import { User, Medication, Reminder, ApiResponse } from '../types';

// Créer une instance axios
const axiosInstance = axios.create({
  baseURL: 'https://medistock-api.example.com/api', // Sera remplacé par votre vrai API plus tard
  headers: {
    'Content-Type': 'application/json',
  },
});

// Pour le développement, utilisez des données mockées
const USE_MOCK_DATA = true; // Mettre à false quand une vraie API est disponible

// Données simulées pour le développement
const mockData = {
  users: [
    {
      id: '1',
      email: 'test@example.com',
      firstName: 'Jean',
      lastName: 'Dupont',
      phone: '0612345678',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    } as User,
  ],
  medications: [
    {
      id: '1',
      name: 'Paracétamol',
      description: 'Contre la douleur et la fièvre',
      dosage: 1000,
      unit: 'mg',
      currentStock: 24,
      initialStock: 30,
      reorderThreshold: 5,
      frequency: 'asNeeded',
      isActive: true,
      color: '#2196F3',
      expiryDate: '2025-12-31',
      notes: 'Prendre avec un verre d\'eau',
      patientId: '1',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    } as Medication,
    {
      id: '2',
      name: 'Ibuprofène',
      description: 'Anti-inflammatoire',
      dosage: 400,
      unit: 'mg',
      currentStock: 3,
      initialStock: 20,
      reorderThreshold: 5,
      frequency: 'daily',
      isActive: true,
      color: '#F44336',
      expiryDate: '2025-10-15',
      notes: 'Prendre avec de la nourriture',
      patientId: '1',
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
    } as Medication,
  ],
  reminders: [
    {
      id: '1',
      medicationId: '1',
      medication: {
        id: '1',
        name: 'Paracétamol',
        dosage: 1000,
        unit: 'mg',
        color: '#2196F3',
      },
      scheduledFor: '2025-04-30T08:00:00.000Z',
      status: 'pending',
      dosage: 1,
      unit: 'tablet',
      patientId: '1',
      notes: '',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    } as Reminder,
    {
      id: '2',
      medicationId: '2',
      medication: {
        id: '2',
        name: 'Ibuprofène',
        dosage: 400,
        unit: 'mg',
        color: '#F44336',
      },
      scheduledFor: '2025-04-30T12:00:00.000Z',
      status: 'pending',
      dosage: 1,
      unit: 'tablet',
      patientId: '1',
      notes: 'Prendre avec de la nourriture',
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
    } as Reminder,
  ],
  // Liste des réinitialisations de mot de passe demandées (simulée)
  passwordResets: [] as { email: string, token: string, createdAt: Date }[],
};

// Fonctions API simulées (pour développement)
const mockApiImplementation = {
  // Authentification
  login: async (email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Délai simulé

    // Vérification simplifiée (acceptera toujours test@example.com / password)
    if (email === 'test@example.com' && password === 'password') {
      return {
        success: true,
        data: {
          token: 'fake-jwt-token',
          user: mockData.users[0],
        },
      };
    }

    return {
      success: false,
      message: 'Email ou mot de passe incorrect',
    };
  },

  // Inscription d'un nouvel utilisateur
  register: async (userData: { 
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    phone?: string 
  }): Promise<ApiResponse<{ token: string; user: User }>> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Délai simulé
    
    // Vérifier si l'email existe déjà
    const existingUser = mockData.users.find(user => user.email === userData.email);
    
    if (existingUser) {
      return {
        success: false,
        message: 'Cet email est déjà utilisé par un autre compte',
      };
    }
    
    // Créer un nouvel utilisateur
    const newUser: User = {
      id: (mockData.users.length + 1).toString(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Ajouter l'utilisateur à la liste des utilisateurs
    mockData.users.push(newUser);
    
    console.log('[DEV] Nouvel utilisateur enregistré:', newUser);
    
    // Retourner les informations d'authentification
    return {
      success: true,
      data: {
        token: 'fake-jwt-token-' + Date.now(),
        user: newUser,
      },
      message: 'Inscription réussie',
    };
  },

  // Récupérer les médicaments
  getMedications: async (): Promise<ApiResponse<Medication[]>> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Délai simulé

    return {
      success: true,
      data: mockData.medications,
    };
  },

  // Récupérer un médicament par son ID
  getMedicationById: async (id: string): Promise<ApiResponse<Medication>> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Délai simulé
    
    const medication = mockData.medications.find(med => med.id === id);
    
    if (medication) {
      return {
        success: true,
        data: medication,
      };
    } else {
      return {
        success: false,
        message: `Médicament avec l'ID ${id} non trouvé`,
      };
    }
  },

  // Mettre à jour un médicament
  updateMedication: async (id: string, data: Partial<Medication>): Promise<ApiResponse<Medication>> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Délai simulé
    
    const medicationIndex = mockData.medications.findIndex(med => med.id === id);
    
    if (medicationIndex === -1) {
      return {
        success: false,
        message: `Médicament avec l'ID ${id} non trouvé`,
      };
    }
    
    // Mettre à jour le médicament
    const updatedMedication = {
      ...mockData.medications[medicationIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    // Remplacer l'ancien médicament par le nouveau
    mockData.medications[medicationIndex] = updatedMedication as Medication;
    
    return {
      success: true,
      data: updatedMedication as Medication,
      message: 'Médicament mis à jour avec succès',
    };
  },

  // Ajouter un nouveau médicament
  addMedication: async (data: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Medication>> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Délai simulé
    
    const newMedication: Medication = {
      ...data,
      id: (mockData.medications.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Medication;
    
    // Ajouter le médicament à la liste
    mockData.medications.push(newMedication);
    
    console.log('[DEV] Nouveau médicament ajouté:', newMedication);
    
    return {
      success: true,
      data: newMedication,
      message: 'Médicament ajouté avec succès',
    };
  },

  // Récupérer les rappels
  getReminders: async (): Promise<ApiResponse<Reminder[]>> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Délai simulé

    return {
      success: true,
      data: mockData.reminders,
    };
  },

  // Demande de réinitialisation de mot de passe
  requestPasswordReset: async (email: string): Promise<ApiResponse<void>> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Délai simulé

    // Vérifier si l'email existe (en production, on ne devrait pas indiquer si l'email existe ou non)
    // On garde la vérification même si la variable n'est pas utilisée pour les futures implémentations
    mockData.users.some(user => user.email === email); // Placeholder for future use

    // Générer un token unique (simpliste pour le mock)
    const token = Math.random().toString(36).substring(2, 15);

    // Enregistrer la demande de réinitialisation
    mockData.passwordResets.push({
      email,
      token,
      createdAt: new Date(),
    });

    console.log(`[DEV] Password reset requested for ${email}. Token: ${token}`);

    return {
      success: true,
      message: 'Si un compte est associé à cet email, un lien de réinitialisation sera envoyé.',
    };
  },

  // Réinitialiser le mot de passe avec un token
  resetPassword: async (token: string, _newPassword: string): Promise<ApiResponse<void>> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Délai simulé

    // Vérifier si le token existe et est valide (moins de 24h)
    const resetRequest = mockData.passwordResets.find(reset => reset.token === token);

    if (!resetRequest) {
      return {
        success: false,
        message: 'Token de réinitialisation invalide ou expiré.',
      };
    }

    // Vérifier si le token n'est pas expiré (24h de validité)
    const now = new Date();
    const tokenAge = now.getTime() - resetRequest.createdAt.getTime();
    const tokenExpired = tokenAge > 24 * 60 * 60 * 1000; // 24 heures en millisecondes

    if (tokenExpired) {
      return {
        success: false,
        message: 'Le lien de réinitialisation a expiré. Veuillez faire une nouvelle demande.',
      };
    }

    // En production, on mettrait à jour le mot de passe de l'utilisateur ici
    // Pour l'instant, on ne fait rien avec le nouveau mot de passe, d'où le préfixe _
    console.log(`[DEV] Password reset successful for email: ${resetRequest.email}`);

    // Supprimer le token utilisé
    const index = mockData.passwordResets.findIndex(reset => reset.token === token);
    if (index !== -1) {
      mockData.passwordResets.splice(index, 1);
    }

    return {
      success: true,
      message: 'Mot de passe réinitialisé avec succès.',
    };
  },
};

// Exportez les fonctions API (mock ou réelles selon la configuration)
export default {
  // Authentification
  login: USE_MOCK_DATA
    ? mockApiImplementation.login
    : async (email: string, password: string) => {
        const response = await axiosInstance.post('/auth/login', { email, password });
        return response.data;
      },

  // Inscription
  register: USE_MOCK_DATA
    ? mockApiImplementation.register
    : async (userData: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => {
        const response = await axiosInstance.post('/auth/register', userData);
        return response.data;
      },

  // Médicaments
  getMedications: USE_MOCK_DATA
    ? mockApiImplementation.getMedications
    : async () => {
        const response = await axiosInstance.get('/medications');
        return response.data;
      },

  // Récupérer un médicament par ID
  getMedicationById: USE_MOCK_DATA
    ? mockApiImplementation.getMedicationById
    : async (id: string) => {
        const response = await axiosInstance.get(`/medications/${id}`);
        return response.data;
      },

  // Mettre à jour un médicament
  updateMedication: USE_MOCK_DATA
    ? mockApiImplementation.updateMedication
    : async (id: string, data: Partial<Medication>) => {
        const response = await axiosInstance.put(`/medications/${id}`, data);
        return response.data;
      },

  // Ajouter un médicament
  addMedication: USE_MOCK_DATA
    ? mockApiImplementation.addMedication
    : async (data: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => {
        const response = await axiosInstance.post('/medications', data);
        return response.data;
      },

  // Rappels
  getReminders: USE_MOCK_DATA
    ? mockApiImplementation.getReminders
    : async () => {
        const response = await axiosInstance.get('/reminders');
        return response.data;
      },

  // Réinitialisation du mot de passe
  requestPasswordReset: USE_MOCK_DATA
    ? mockApiImplementation.requestPasswordReset
    : async (email: string) => {
        const response = await axiosInstance.post('/auth/password-reset/request', { email });
        return response.data;
      },

  resetPassword: USE_MOCK_DATA
    ? mockApiImplementation.resetPassword
    : async (token: string, newPassword: string) => {
        const response = await axiosInstance.post('/auth/password-reset/reset', { token, newPassword });
        return response.data;
      },
};