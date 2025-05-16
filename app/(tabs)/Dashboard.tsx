// app/main/DashboardScreen.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../../services/api';
import { useAuth } from '../contexts/AuthContext';
import theme from '../styles/theme';
import { Medication, Reminder } from '../types/models';

// Interface pour les props du DashboardScreen
interface DashboardScreenProps {
  onLogout: () => Promise<void>;
}

const Dashboard: React.FC<DashboardScreenProps> = ({ onLogout }) => {
  const router = useRouter();
  // États locaux
  const [medications, setMedications] = useState<Medication[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  // Charger les données au montage du composant
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Fonction pour charger les données du tableau de bord
  const loadDashboardData = async () => {
    try {
      setError(null);
      
      // Charger les médicaments
      const medicationsResponse = await api.getMedications();
      if (medicationsResponse.success && medicationsResponse.data) {
        setMedications(medicationsResponse.data);
      } else {
        throw new Error('Impossible de récupérer les médicaments');
      }
      
      // Charger les rappels
      const remindersResponse = await api.getReminders();
      if (remindersResponse.success && remindersResponse.data) {
        setReminders(remindersResponse.data);
      } else {
        throw new Error('Impossible de récupérer les rappels');
      }
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Erreur dans loadDashboardData:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Gérer le rafraîchissement par le pull-to-refresh
  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  // Gérer la déconnexion
  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            try {
              await onLogout();
              // La navigation vers l'écran de connexion se fait automatiquement via le contexte
              router.replace('/Login');
            } catch (err) { // Renommé pour éviter le conflit avec l'état 'error'
              console.error('Erreur lors de la déconnexion:', err);
              Alert.alert('Erreur', 'Impossible de se déconnecter. Veuillez réessayer.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Filtrer les médicaments à stock faible
  const getLowStockMedications = () => {
    return medications.filter(
      (med) => med.currentStock <= med.reorderThreshold
    );
  };

  // Obtenir les rappels pour aujourd'hui
  const getTodayReminders = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return reminders.filter((reminder) => {
      const reminderDate = new Date(reminder.scheduledFor);
      return reminderDate >= today && reminderDate < tomorrow;
    });
  };

  // Navigation vers la liste des médicaments
  const navigateToMedicationList = () => {
    router.push('/MedicationList');
  };

  // Afficher un indicateur de chargement pendant le chargement initial
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Chargement en cours...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>
            Bonjour, {user?.firstName || 'Utilisateur'}
          </Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadDashboardData}
            >
              <Text style={styles.retryButtonText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Section des rappels du jour */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rappels du jour</Text>
            <TouchableOpacity onPress={() => router.push('/Reminders')}>
              <Text style={styles.viewAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          {getTodayReminders().length > 0 ? (
            getTodayReminders().map((reminder) => (
              <View key={reminder.id} style={styles.reminderCard}>
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: reminder.medication.color },
                  ]}
                />
                <View style={styles.reminderContent}>
                  <Text style={styles.reminderTitle}>
                    {reminder.medication.name}
                  </Text>
                  <Text style={styles.reminderDetails}>
                    {reminder.dosage} {reminder.unit} -{' '}
                    {new Date(reminder.scheduledFor).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                <TouchableOpacity style={styles.reminderActionButton}>
                  <Text style={styles.actionButtonText}>✓</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Aucun rappel pour aujourd&apos;hui</Text>
          )}
        </View>

        {/* Section des médicaments à stock faible */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Médicaments à stock faible</Text>
            <TouchableOpacity onPress={navigateToMedicationList}>
              <Text style={styles.viewAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          {getLowStockMedications().length > 0 ? (
            getLowStockMedications().map((medication) => (
              <View key={medication.id} style={styles.medicationCard}>
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: medication.color },
                  ]}
                />
                <View style={styles.medicationContent}>
                  <Text style={styles.medicationTitle}>{medication.name}</Text>
                  <Text style={styles.medicationDetails}>
                    Stock: {medication.currentStock} / {medication.initialStock}{' '}
                    {medication.unit}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.medicationActionButton}
                  onPress={() => router.push({
                    pathname: '/EditMedication',
                    params: { id: medication.id }
                  })}
                >
                  <Text style={styles.actionButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Tous vos stocks sont à des niveaux normaux</Text>
          )}
        </View>
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('/AddMedication')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.typography.fontSizes.large,
    color: theme.colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.l,
    paddingHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.m,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  welcomeText: {
    fontSize: theme.typography.fontSizes.xlarge,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  dateText: {
    fontSize: theme.typography.fontSizes.medium,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  logoutButton: {
    padding: theme.spacing.s,
  },
  logoutButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSizes.medium,
    fontWeight: '600',
  },
  content: {
    padding: theme.spacing.m,
    paddingBottom: theme.spacing.xl,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.m,
    alignItems: 'center',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSizes.medium,
    marginBottom: theme.spacing.s,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.borderRadius.medium,
  },
  retryButtonText: {
    color: 'white',
    fontSize: theme.typography.fontSizes.medium,
    fontWeight: '600',
  },
  section: {
    marginBottom: theme.spacing.l,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.large,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  viewAllText: {
    fontSize: theme.typography.fontSizes.medium,
    color: theme.colors.primary,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.s,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.s,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: theme.typography.fontSizes.medium,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  reminderDetails: {
    fontSize: theme.typography.fontSizes.small,
    color: theme.colors.textSecondary,
  },
  reminderActionButton: {
    padding: theme.spacing.xs,
  },
  medicationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.s,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  medicationContent: {
    flex: 1,
  },
  medicationTitle: {
    fontSize: theme.typography.fontSizes.medium,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  medicationDetails: {
    fontSize: theme.typography.fontSizes.small,
    color: theme.colors.textSecondary,
  },
  medicationActionButton: {
    padding: theme.spacing.xs,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  emptyText: {
    fontSize: theme.typography.fontSizes.medium,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: theme.spacing.m,
  },
  addButton: {
    position: 'absolute',
    right: theme.spacing.l,
    bottom: theme.spacing.l,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Dashboard;