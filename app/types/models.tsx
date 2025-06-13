// // app/types/models.tsx
// // Types pour l'authentification
// export interface User {
//     id: string;
//     email: string;
//     password?: string; // Ajouté cette propriété pour la gestion du mot de passe
//     firstName: string;
//     lastName: string;
//     phone?: string;
//     createdAt?: string;
//     updatedAt?: string;
// }

//   // Types pour les médicaments
//   export interface Medication {
//     id: string;
//     name: string;
//     description?: string;
//     dosage: number;
//     unit: 'tablet' | 'capsule' | 'ml' | 'mg' | 'drop' | 'application' | 'unit';
//     currentStock: number;
//     initialStock: number;
//     reorderThreshold: number;
//     frequency: 'daily' | 'weekly' | 'monthly' | 'asNeeded' | 'custom';
//     isActive: boolean;
//     color: string;
//     expiryDate?: string;
//     notes?: string;
//     patientId: string; // Ajouté cette propriété
//     createdAt?: string;
//     updatedAt?: string;
//   }

//   // Types pour les rappels
//   export interface Reminder {
//     id: string;
//     medicationId: string;
//     medication: {
//       id: string;
//       name: string;
//       dosage: number;
//       unit: string;
//       color: string;
//     };
//     scheduledFor: string; // ISO date string
//     status: 'pending' | 'taken' | 'skipped' | 'missed';
//     dosage: number; // Ajouté cette propriété
//     unit: 'tablet' | 'capsule' | 'ml' | 'mg' | 'drop' | 'application' | 'unit'; // Ajouté cette propriété
//     patientId: string; // Ajouté cette propriété
//     notes?: string;
//     createdAt?: string;
//     updatedAt?: string;
//   }

//   // Types pour les réponses API
//   export interface ApiResponse<T> {
//     success: boolean;
//     message?: string;
//     data?: T;
//   }
//   // Composant React exporté par défaut (nécessaire pour Expo Router)
//   export default function Models() {
//     return null;
//   }


// app/types/models.tsx

// Types pour l'authentification
export interface User {
  id: string;
  email: string;
  password?: string; // Ne devrait être présent que lors de l'inscription/connexion
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Types pour les médicaments
export interface Medication {
  id: string;
  name: string;
  description?: string;
  dosage: number;
  unit: 'tablet' | 'capsule' | 'ml' | 'mg' | 'drop' | 'application' | 'unit' | 'g' | 'µg' | 'gel' | 'cp' | 'goutte';
  currentStock: number;
  initialStock: number;
  reorderThreshold: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'asNeeded' | 'custom' | 'twice_daily' | 'three_times_daily';
  isActive: boolean;
  color: string;
  expiryDate?: string;
  notes?: string;
  patientId: string;
  createdAt?: string;
  updatedAt?: string;
}

// Types pour les rappels
export interface Reminder {
  id: string;
  medicationId: string;
  medication: {
    id: string;
    name: string;
    dosage: number;
    unit: string;
    color: string;
  };
  scheduledFor: string; // ISO date string
  status: 'pending' | 'taken' | 'skipped' | 'missed';
  dosage: number;
  unit: string; // Plus flexible pour correspondre aux unités des médicaments
  patientId: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Types pour les ordonnances scannées
export interface ScannedMedication {
  name: string;
  dosage: string;
  unit: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}

// Types pour les ordonnances
export interface Prescription {
  id: string;
  doctorName?: string;
  doctorPhone?: string;
  issuedDate: string;
  pharmacyName?: string;
  medications: ScannedMedication[];
  imageUrl?: string;
  ocrText?: string; // Texte brut extrait par OCR
  notes?: string;
  patientId: string;
  createdAt?: string;
  updatedAt?: string;
}

// Types pour l'historique des prises
export interface MedicationIntake {
  id: string;
  medicationId: string;
  reminderId?: string;
  takenAt: string;
  dosage: number;
  unit: string;
  notes?: string;
  sideEffects?: string;
  patientId: string;
  createdAt?: string;
}

// Types pour les statistiques
export interface MedicationStats {
  medicationId: string;
  totalIntakes: number;
  missedDoses: number;
  adherenceRate: number; // Pourcentage (0-100)
  lastIntake?: string;
  averageStockDuration: number; // En jours
}

// Types pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string; // Pour une meilleure gestion des erreurs
}

// Types pour les requêtes API paginées
export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
}

// Types pour les formulaires
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  phone?: string;
  confirmPassword?: string; // Pour la validation côté client
}

export interface MedicationFormData {
  name: string;
  description?: string;
  dosage: string;
  unit: string;
  initialStock: string;
  currentStock?: string;
  reorderThreshold: string;
  frequency: string;
  expiryDate?: string;
  color: string;
  notes?: string;
}

export interface ReminderFormData {
  medicationId: string;
  scheduledTime: string; // Format HH:mm
  scheduledDays?: string[]; // Pour les rappels personnalisés
  dosage: string;
  notes?: string;
}

// Types pour les notifications
export interface NotificationData {
  id: string;
  type: 'reminder' | 'low_stock' | 'expiry' | 'general';
  title: string;
  body: string;
  data?: {
    medicationId?: string;
    reminderId?: string;
    action?: string;
  };
  scheduledFor?: string;
  read: boolean;
  createdAt: string;
}

// Énumérations utiles
export enum MedicationUnit {
  TABLET = 'tablet',
  CAPSULE = 'capsule',
  ML = 'ml',
  MG = 'mg',
  G = 'g',
  MCG = 'µg',
  DROP = 'drop',
  GOUTTE = 'goutte',
  APPLICATION = 'application',
  UNIT = 'unit',
  CP = 'cp',
  GEL = 'gel',
}

export enum ReminderStatus {
  PENDING = 'pending',
  TAKEN = 'taken',
  SKIPPED = 'skipped',
  MISSED = 'missed',
}

export enum ReminderFrequency {
  DAILY = 'daily',
  TWICE_DAILY = 'twice_daily',
  THREE_TIMES_DAILY = 'three_times_daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  AS_NEEDED = 'asNeeded',
  CUSTOM = 'custom',
}

// Types pour les erreurs
export interface ApiError {
  code: string;
  message: string;
  field?: string; // Pour les erreurs de validation spécifiques à un champ
  details?: any;
}

// Types pour le contexte de l'application
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  medications: Medication[];
  reminders: Reminder[];
  notifications: NotificationData[];
}

// Composant React exporté par défaut (nécessaire pour Expo Router)
export default function Models() {
  return null;
}