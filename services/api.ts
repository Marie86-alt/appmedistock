import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse, Medication, Reminder, User } from '../app/types/models';
import { medications as mockMeds } from './_mockData';

const STORAGE_USERS_KEY = 'users';
const STORAGE_REMINDERS_KEY = 'reminders';
const STORAGE_PASSWORD_RESETS_KEY = 'passwordResets';

const api = {
  // ----------------------------------------
  // Authentification
  // ----------------------------------------
  login: async (
    email: string,
    password: string
  ): Promise<ApiResponse<{ token: string; user: User }>> => {
    console.log('[api.login] ENTER', { email });
    try {
      const usersJSON = await AsyncStorage.getItem(STORAGE_USERS_KEY);
      const users: User[] = usersJSON ? JSON.parse(usersJSON) : [];
      const found = users.find(u => u.email === email && u.password === password);
      if (!found) {
        console.log('[api.login] utilisateur non trouvé');
        return { success: false, message: 'Email ou mot de passe incorrect' };
      }
      console.log('[api.login] utilisateur trouvé:', found);
      return {
        success: true,
        data: {
          token: 'fake-jwt-token-' + Date.now(),
          user: found,
        },
        message: 'Connexion réussie',
      };
    } catch (err) {
      console.error('[api.login] erreur', err);
      return { success: false, message: 'Erreur lors de la connexion' };
    }
  },

  register: async (
    userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
    }
  ): Promise<ApiResponse<{ token: string; user: User }>> => {
    console.log('[api.register] ENTER', userData);
    try {
      const usersJSON = await AsyncStorage.getItem(STORAGE_USERS_KEY);
      const users: User[] = usersJSON ? JSON.parse(usersJSON) : [];

      if (users.some(u => u.email === userData.email)) {
        console.log('[api.register] email déjà utilisé');
        return { success: false, message: 'Cet email est déjà utilisé' };
      }

      const newUser: User = {
        id: (users.length + 1).toString(),
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      users.push(newUser);
      await AsyncStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
      console.log('[api.register] utilisateurs enregistrés:', users);

      return {
        success: true,
        data: {
          token: 'fake-jwt-token-' + Date.now(),
          user: newUser,
        },
        message: 'Inscription réussie',
      };
    } catch (err) {
      console.error('[api.register] erreur', err);
      return { success: false, message: 'Erreur lors de l’inscription' };
    }
  },

  // ----------------------------------------
  // Médicaments (cache in-memory)
  // ----------------------------------------
  _meds: [] as Medication[],

  getMedications: async (): Promise<ApiResponse<Medication[]>> => {
    console.log('[api.getMedications] ENTER');
    await new Promise(res => setTimeout(res, 300));
    return { success: true, data: api._meds };
  },

  getMedicationById: async (id: string): Promise<ApiResponse<Medication>> => {
    console.log('[api.getMedicationById] id =', id);
    await new Promise(res => setTimeout(res, 300));
    const med = api._meds.find(m => m.id === id);
    if (!med) {
      return { success: false, message: `Médicament ${id} non trouvé` };
    }
    return { success: true, data: med };
  },

  addMedication: async (
    data: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<Medication>> => {
    console.log('[api.addMedication] ENTER', data);
    await new Promise(res => setTimeout(res, 300));
    const newMed: Medication = {
      ...data,
      id: (api._meds.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    api._meds.push(newMed);
    return { success: true, data: newMed, message: 'Médicament ajouté' };
  },

  updateMedication: async (
    id: string,
    updates: Partial<Medication>
  ): Promise<ApiResponse<Medication>> => {
    console.log('[api.updateMedication] ENTER', { id, updates });
    await new Promise(res => setTimeout(res, 300));
    const idx = api._meds.findIndex(m => m.id === id);
    if (idx === -1) {
      return { success: false, message: `Médicament ${id} non trouvé` };
    }
    const updated = {
      ...api._meds[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    api._meds[idx] = updated;
    return { success: true, data: updated, message: 'Médicament mis à jour' };
  },

  // ----------------------------------------
  // Rappels
  // ----------------------------------------
  getReminders: async (): Promise<ApiResponse<Reminder[]>> => {
    console.log('[api.getReminders] ENTER');
    try {
      const json = await AsyncStorage.getItem(STORAGE_REMINDERS_KEY);
      const list: Reminder[] = json ? JSON.parse(json) : [];
      return { success: true, data: list };
    } catch (err) {
      console.error('[api.getReminders] erreur', err);
      return { success: false, message: 'Erreur récupération rappels' };
    }
  },

  addReminder: async (
    reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<Reminder>> => {
    console.log('[api.addReminder] ENTER', reminder);
    try {
      const json = await AsyncStorage.getItem(STORAGE_REMINDERS_KEY);
      const list: Reminder[] = json ? JSON.parse(json) : [];
      const newR: Reminder = {
        ...reminder,
        id: (list.length + 1).toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      list.push(newR);
      await AsyncStorage.setItem(STORAGE_REMINDERS_KEY, JSON.stringify(list));
      return { success: true, data: newR, message: 'Rappel ajouté' };
    } catch (err) {
      console.error('[api.addReminder] erreur', err);
      return { success: false, message: 'Erreur ajout rappel' };
    }
  },

  // ----------------------------------------
  // Réinitialisation mot de passe
  // ----------------------------------------
  requestPasswordReset: async (
    email: string
  ): Promise<ApiResponse<void>> => {
    console.log('[api.requestPasswordReset] ENTER', email);
    try {
      const json = await AsyncStorage.getItem(STORAGE_PASSWORD_RESETS_KEY);
      const resets: { email: string; token: string; createdAt: string }[] =
        json ? JSON.parse(json) : [];
      const token = Math.random().toString(36).slice(2);
      resets.push({ email, token, createdAt: new Date().toISOString() });
      await AsyncStorage.setItem(STORAGE_PASSWORD_RESETS_KEY, JSON.stringify(resets));
      console.log('[api.requestPasswordReset] token généré:', token);
      return { success: true, message: 'Lien de réinitialisation envoyé.' };
    } catch (err) {
      console.error('[api.requestPasswordReset] erreur', err);
      return { success: false, message: 'Erreur lors de la demande de réinitialisation' };
    }
  },

  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<ApiResponse<void>> => {
    console.log('[api.resetPassword] ENTER', token);
    try {
      const json = await AsyncStorage.getItem(STORAGE_PASSWORD_RESETS_KEY);
      const resets: { email: string; token: string; createdAt: string }[] =
        json ? JSON.parse(json) : [];
      const idx = resets.findIndex(r => r.token === token);
      if (idx === -1) {
        return { success: false, message: 'Token invalide ou expiré' };
      }

      // update user password
      const usersJSON = await AsyncStorage.getItem(STORAGE_USERS_KEY);
      const users: User[] = usersJSON ? JSON.parse(usersJSON) : [];
      const user = users.find(u => u.email === resets[idx].email);
      if (user) {
        user.password = newPassword;
        await AsyncStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
      }

      // remove reset request
      resets.splice(idx, 1);
      await AsyncStorage.setItem(STORAGE_PASSWORD_RESETS_KEY, JSON.stringify(resets));

      return { success: true, message: 'Mot de passe réinitialisé avec succès' };
    } catch (err) {
      console.error('[api.resetPassword] erreur', err);
      return { success: false, message: 'Erreur lors de la réinitialisation du mot de passe' };
    }
  },
};

// Initialisation cache des médicaments
api._meds = mockMeds;

export default api;
