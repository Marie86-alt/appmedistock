// app/main/RemindersScreen.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../../services/api';
import theme from '../styles/theme';
import { Reminder } from '../types/models';

const Reminders: React.FC = () => {
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Filtres disponibles
  const filters = [
    { id: 'all', label: 'Tous' },
    { id: 'today', label: "Aujourd'hui" },
    { id: 'pending', label: 'À prendre' },
    { id: 'taken', label: 'Pris' },
  ];
  
  useEffect(() => {
    loadReminders();
  }, []);
  
  const loadReminders = async () => {
    try {
      setError(null);
      const response = await api.getReminders();
      
      if (response.success && response.data) {
        setReminders(response.data);
      } else {
        setError('Impossible de charger la liste des rappels');
      }
    } catch  {
      setError('Une erreur est survenue lors du chargement des données');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    loadReminders();
  };
  
  // Fonction pour filtrer les rappels selon le filtre actif
  const getFilteredReminders = () => {
    if (activeFilter === 'all') {
      return reminders;
    }
    
    if (activeFilter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      return reminders.filter(reminder => {
        const reminderDate = new Date(reminder.scheduledFor);
        return reminderDate >= today && reminderDate < tomorrow;
      });
    }
    
    if (activeFilter === 'pending' || activeFilter === 'taken') {
      return reminders.filter(reminder => reminder.status === activeFilter);
    }
    
    return reminders;
  };
  
  const handleMarkAsTaken = (reminder: Reminder) => {
    Alert.alert(
      'Marquer comme pris',
      `Confirmer que vous avez pris ${reminder.medication.name} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          style: 'default',
          onPress: async () => {
            try {
              // Simuler temporairement un message
              Alert.alert(
                'Fonctionnalité à venir',
                'Cette action sera disponible dans une prochaine mise à jour.',
                [{ text: 'OK' }]
              );
              
              /* Code à utiliser lorsque l'API sera prête
              if (api.updateReminderStatus) {
                const updatedReminder = { ...reminder, status: 'taken' };
                await api.updateReminderStatus(reminder.id, 'taken');
                
                // Mettre à jour l'état local
                setReminders(reminders.map(r => 
                  r.id === reminder.id ? { ...r, status: 'skipped' } : r
                ));
              }
              */
            } catch  {
              Alert.alert('Erreur', 'Impossible de mettre à jour le statut du rappel');
            }
          },
        },
      ]
    );
  };
  
  const formatReminderTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const formatReminderDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const reminderDate = new Date(date);
    reminderDate.setHours(0, 0, 0, 0);
    
    if (reminderDate.getTime() === today.getTime()) {
      return "Aujourd'hui";
    } else if (reminderDate.getTime() === tomorrow.getTime()) {
      return 'Demain';
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
      });
    }
  };
  
  const renderReminderItem = ({ item }: { item: Reminder }) => (
    <View style={styles.reminderCard}>
      <View 
        style={[
          styles.colorIndicator, 
          { backgroundColor: item.medication.color }
        ]} 
      />
      <View style={styles.reminderContent}>
        <Text style={styles.medicationName}>{item.medication.name}</Text>
        <Text style={styles.reminderDetails}>
          {item.dosage} {item.unit} • {formatReminderTime(item.scheduledFor)}
        </Text>
        <Text style={styles.reminderDate}>
          {formatReminderDate(item.scheduledFor)}
        </Text>
      </View>
      
      {item.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => handleSkipReminder(item)}
          >
            <Text style={styles.skipButtonText}>×</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.takeButton}
            onPress={() => handleMarkAsTaken(item)}
          >
            <Text style={styles.takeButtonText}>✓</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {item.status === 'taken' && (
        <View style={styles.statusIndicator}>
          <Text style={styles.statusText}>Pris</Text>
        </View>
      )}
      
      {item.status === 'skipped' && (
        <View style={[styles.statusIndicator, styles.skippedIndicator]}>
          <Text style={styles.skippedText}>Sauté</Text>
        </View>
      )}
      
      {item.status === 'missed' && (
        <View style={[styles.statusIndicator, styles.missedIndicator]}>
          <Text style={styles.missedText}>Manqué</Text>
        </View>
      )}
    </View>
  );
  
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Rappels</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            Alert.alert(
              'Fonctionnalité à venir',
              'L\'ajout de rappels sera disponible dans une prochaine mise à jour.',
              [{ text: 'OK' }]
            );
          }}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.filterContainer}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              activeFilter === filter.id && styles.activeFilterButton,
            ]}
            onPress={() => setActiveFilter(filter.id)}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === filter.id && styles.activeFilterButtonText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadReminders}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {getFilteredReminders().length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Aucun rappel {activeFilter !== 'all' ? 'pour ce filtre' : ''}.
              </Text>
              <TouchableOpacity
                style={styles.addFirstButton}
                onPress={() => {
                  Alert.alert(
                    'Fonctionnalité à venir',
                    'L\'ajout de rappels sera disponible dans une prochaine mise à jour.',
                    [{ text: 'OK' }]
                  );
                }}
              >
                <Text style={styles.addFirstButtonText}>
                  Ajouter un rappel
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={getFilteredReminders()}
              renderItem={renderReminderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={[theme.colors.primary]}
                />
              }
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.s,
  },
  backButtonText: {
    fontSize: 22,
    color: theme.colors.primary,
  },
  title: {
    fontSize: theme.typography.fontSizes.xlarge,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  addButton: {
    padding: theme.spacing.s,
  },
  addButtonText: {
    fontSize: 22,
    color: theme.colors.primary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filterButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.m,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeFilterButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterButtonText: {
    fontSize: theme.typography.fontSizes.medium,
    color: theme.colors.text,
  },
  activeFilterButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    padding: theme.spacing.l,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: theme.typography.fontSizes.medium,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.m,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.l,
  },
  emptyText: {
    fontSize: theme.typography.fontSizes.medium,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.m,
  },
  addFirstButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderRadius: theme.borderRadius.medium,
  },
  addFirstButtonText: {
    color: 'white',
    fontSize: theme.typography.fontSizes.medium,
    fontWeight: '600',
  },
  listContent: {
    padding: theme.spacing.m,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'hidden',
  },
  colorIndicator: {
    width: 8,
    height: '100%',
  },
  reminderContent: {
    flex: 1,
    padding: theme.spacing.m,
  },
  medicationName: {
    fontSize: theme.typography.fontSizes.large,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 2,
  },
  reminderDetails: {
    fontSize: theme.typography.fontSizes.medium,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  reminderDate: {
    fontSize: theme.typography.fontSizes.small,
    color: theme.colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.s,
  },
  skipButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.s,
  },
  skipButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  takeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  takeButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  statusIndicator: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.borderRadius.medium,
    marginRight: theme.spacing.m,
  },
  statusText: {
    color: 'white',
    fontWeight: '600',
    fontSize: theme.typography.fontSizes.small,
  },
  skippedIndicator: {
    backgroundColor: theme.colors.error,
  },
  skippedText: {
    color: 'white',
    fontWeight: '600',
    fontSize: theme.typography.fontSizes.small,
  },
  missedIndicator: {
    backgroundColor: theme.colors.error,
  },
  missedText: {
    color: 'white',
    fontWeight: '600',
    fontSize: theme.typography.fontSizes.small,
  },
});

export default Reminders;

function handleSkipReminder(item: Reminder): void {
    throw new Error('Function not implemented.');
}
