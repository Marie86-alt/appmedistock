// app/main/MedicationListScreen.tsx
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
import { Medication } from '../types/models';

const MedicationList: React.FC = () => {
  const router = useRouter();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      setError(null);
      const response = await api.getMedications();
      
      if (response.success && response.data) {
        setMedications(response.data);
      } else {
        setError('Impossible de charger la liste des médicaments');
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
    loadMedications();
  };

  const handleEditMedication = (medicationId: string) => {
    router.push({
      pathname: '/(tabs)/EditMedication',
      params: { id: medicationId }
    });
  };

  const handleDeleteMedication = (medication: Medication) => {
    Alert.alert(
      'Supprimer le médicament',
      `Êtes-vous sûr de vouloir supprimer ${medication.name} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              // Afficher temporairement un message
              Alert.alert(
                'Fonctionnalité à venir',
                'La suppression de médicaments sera disponible dans une prochaine mise à jour.',
                [{ text: 'OK' }]
              );
              // Lorsque l'API sera prête, décommentez ce code
              /*
              if (api.deleteMedication) {
                await api.deleteMedication(medication.id);
                loadMedications(); // Recharger la liste
              }
              */
            } catch  {
              Alert.alert(
                'Erreur',
                'Impossible de supprimer le médicament. Veuillez réessayer.'
              );
            }
          },
        },
      ]
    );
  };

  const renderMedicationItem = ({ item }: { item: Medication }) => (
    <TouchableOpacity
      style={styles.medicationCard}
      onPress={() => handleEditMedication(item.id)}
    >
      <View style={[styles.colorDot, { backgroundColor: item.color }]} />
      <View style={styles.medicationInfo}>
        <Text style={styles.medicationName}>{item.name}</Text>
        <Text style={styles.medicationDetails}>
          {item.dosage} {item.unit} • Stock: {item.currentStock}/{item.initialStock}
        </Text>
        {item.expiryDate && (
          <Text style={styles.expiryDate}>
            Expire le {new Date(item.expiryDate).toLocaleDateString('fr-FR')}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteMedication(item)}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </TouchableOpacity>
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
        <Text style={styles.title}>Mes médicaments</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/AddMedication')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadMedications}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {medications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Vous n&apos;avez pas encore ajouté de médicaments.
              </Text>
              <TouchableOpacity
                style={styles.addFirstButton}
                onPress={() => router.push('/AddMedication')}
              >
                <Text style={styles.addFirstButtonText}>
                  Ajouter un médicament
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={medications}
              renderItem={renderMedicationItem}
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
  medicationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: theme.spacing.m,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: theme.typography.fontSizes.large,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  medicationDetails: {
    fontSize: theme.typography.fontSizes.medium,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  expiryDate: {
    fontSize: theme.typography.fontSizes.small,
    color: theme.colors.error,
  },
  deleteButton: {
    padding: theme.spacing.s,
  },
  deleteButtonText: {
    fontSize: 24,
    color: theme.colors.error,
    fontWeight: 'bold',
  },
});

export default MedicationList;