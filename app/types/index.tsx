// src/types/index.ts
// Types pour l'authentification
export interface User {
    id: string;
    email: string;
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
    unit: 'tablet' | 'capsule' | 'ml' | 'mg' | 'drop' | 'application' | 'unit';
    currentStock: number;
    initialStock: number;
    reorderThreshold: number;
    frequency: 'daily' | 'weekly' | 'monthly' | 'asNeeded' | 'custom';
    isActive: boolean;
    color: string;
    expiryDate?: string;
    notes?: string;
    patientId: string; // Ajouté cette propriété
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
    dosage: number; // Ajouté cette propriété
    unit: 'tablet' | 'capsule' | 'ml' | 'mg' | 'drop' | 'application' | 'unit'; // Ajouté cette propriété
    patientId: string; // Ajouté cette propriété
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
  }

  // Types pour les réponses API
  export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
  }
