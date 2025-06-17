// services/_mockData.ts

import { Medication, Reminder, User } from '../src/types/models';

export const users: User[] = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'password',
    firstName: 'Jean',
    lastName: 'Dupont',
    phone: '0612345678',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

export const medications: Medication[] = [
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
    notes: "Prendre avec un verre d'eau",
    patientId: '1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
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
  },
];

export const reminders: Reminder[] = [
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
  },
];
