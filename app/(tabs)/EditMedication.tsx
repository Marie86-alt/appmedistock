// app/main/EditMedicationScreen.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../../services/api';
import theme from '../styles/theme';
import { Medication } from '../types/models';

// Couleurs prédéfinies pour les médicaments
const PREDEFINED_COLORS = [
  '#2196F3', // Bleu
  '#4CAF50', // Vert
  '#F44336', // Rouge
  '#FF9800', // Orange
  '#9C27B0', // Violet
  '#00BCD4', // Cyan
  '#FFEB3B', // Jaune
  '#795548', // Marron
];

const EditMedication: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const medicationId = typeof params.id === 'string' ? params.id : '';
  
  // États du formulaire
  const [medication, setMedication] = useState<Medication | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dosage, setDosage] = useState('');
  const [unit, setUnit] = useState('mg');
  const [currentStock, setCurrentStock] = useState('');
  const [reorderThreshold, setReorderThreshold] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedColor, setSelectedColor] = useState(PREDEFINED_COLORS[0]);
  
  // État de validation
  const [nameError, setNameError] = useState('');
  const [dosageError, setDosageError] = useState('');
  const [currentStockError, setCurrentStockError] = useState('');
  const [reorderThresholdError, setReorderThresholdError] = useState('');
  const [expiryDateError, setExpiryDateError] = useState('');
  
  // États de chargement
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Options pour les unités
  const unitOptions = ['mg', 'ml', 'tablet', 'capsule', 'drop', 'application', 'unit'];
  
  // Charger les données du médicament (transformé en useCallback)
  const loadMedicationData = useCallback(async () => {
    try {
      setError(null);
      
      const response = await api.getMedicationById(medicationId);
      
      if (response.success && response.data) {
        const medicationData = response.data;
        setMedication(medicationData);
        
        // Initialiser les états du formulaire avec les données du médicament
        setName(medicationData.name || '');
        setDescription(medicationData.description || '');
        setDosage(medicationData.dosage ? medicationData.dosage.toString() : '');
        setUnit(medicationData.unit || 'mg');
        setCurrentStock(medicationData.currentStock ? medicationData.currentStock.toString() : '');
        setReorderThreshold(medicationData.reorderThreshold ? medicationData.reorderThreshold.toString() : '');
        setExpiryDate(medicationData.expiryDate || '');
        setNotes(medicationData.notes || '');
        setSelectedColor(medicationData.color || PREDEFINED_COLORS[0]);
      } else {
        setError('Impossible de récupérer les informations du médicament');
      }
    } catch {
      setError('Une erreur est survenue lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  }, [medicationId]);
  
  // UseEffect avec dépendances corrigées
  useEffect(() => {
    if (medicationId) {
      loadMedicationData();
    } else {
      setError('Identifiant de médicament manquant');
      setIsLoading(false);
    }
  }, [medicationId, loadMedicationData]);
  
  // Validation du nom
  const validateName = () => {
    if (!name.trim()) {
      setNameError('Le nom du médicament est requis');
      return false;
    } else {
      setNameError('');
      return true;
    }
  };
  
  // Validation du dosage
  const validateDosage = () => {
    if (!dosage) {
      setDosageError('Le dosage est requis');
      return false;
    } else if (isNaN(Number(dosage)) || Number(dosage) <= 0) {
      setDosageError('Le dosage doit être un nombre positif');
      return false;
    } else {
      setDosageError('');
      return true;
    }
  };
  
  // Validation du stock actuel
  const validateCurrentStock = () => {
    if (!currentStock) {
      setCurrentStockError('Le stock actuel est requis');
      return false;
    } else if (isNaN(Number(currentStock)) || Number(currentStock) < 0) {
      setCurrentStockError('Le stock doit être un nombre positif ou zéro');
      return false;
    } else {
      setCurrentStockError('');
      return true;
    }
  };
  
  // Validation du seuil de réapprovisionnement
  const validateReorderThreshold = () => {
    if (!reorderThreshold) {
      setReorderThresholdError('Le seuil de réapprovisionnement est requis');
      return false;
    } else if (isNaN(Number(reorderThreshold)) || Number(reorderThreshold) < 0) {
      setReorderThresholdError('Le seuil doit être un nombre positif ou zéro');
      return false;
    } else {
      setReorderThresholdError('');
      return true;
    }
  };
  
  // Validation de la date d'expiration
  const validateExpiryDate = () => {
    if (!expiryDate) {
      // Date d'expiration facultative
      return true;
    }
    
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!dateRegex.test(expiryDate)) {
      setExpiryDateError('Format de date invalide (AAAA-MM-JJ)');
      return false;
    }
    
    setExpiryDateError('');
    return true;
  };
  
  // Mettre à jour le stock actuel
  const handleUpdateStock = (increment: boolean) => {
    const currentValue = Number(currentStock) || 0;
    const newValue = increment ? currentValue + 1 : Math.max(0, currentValue - 1);
    setCurrentStock(newValue.toString());
  };
  
  // Gestion de la soumission du formulaire
  const handleSubmit = async () => {
    // Valider tous les champs
    const isNameValid = validateName();
    const isDosageValid = validateDosage();
    const isCurrentStockValid = validateCurrentStock();
    const isReorderThresholdValid = validateReorderThreshold();
    const isExpiryDateValid = validateExpiryDate();
    
    if (isNameValid && isDosageValid && isCurrentStockValid && isReorderThresholdValid && isExpiryDateValid) {
      setIsSubmitting(true);
      
      try {
        // Construire l'objet médicament mis à jour
        const updatedMedicationData = {
          id: medicationId,
          name,
          description,
          dosage: Number(dosage),
          unit: unit as 'tablet' | 'capsule' | 'ml' | 'mg' | 'drop' | 'application' | 'unit',
          currentStock: Number(currentStock),
          reorderThreshold: Number(reorderThreshold),
          expiryDate: expiryDate || undefined,
          color: selectedColor,
          notes,
          isActive: true,
          frequency: medication?.frequency || 'asNeeded',
          patientId: medication?.patientId || '1',
        };
        
        // Pour le développement, loguer les données qui seraient envoyées à l'API
        console.log('Données du médicament à mettre à jour:', updatedMedicationData);
        
        // Simuler temporairement la mise à jour d'un médicament
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        Alert.alert(
          'Fonctionnalité en développement',
          'La modification de médicaments sera disponible dans une prochaine mise à jour.',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
        
        /* Code à utiliser lorsque l'API sera prête
        if (api.updateMedication) {
          const response = await api.updateMedication(medicationId, updatedMedicationData);
          
          if (response.success) {
            Alert.alert(
              'Médicament mis à jour',
              `${name} a été mis à jour avec succès.`,
              [
                {
                  text: 'OK',
                  onPress: () => router.back(), // Retour à l'écran précédent
                },
              ]
            );
          } else {
            Alert.alert('Erreur', response.message || 'Impossible de mettre à jour le médicament');
          }
        }
        */
      } catch {
        Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour du médicament');
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  // Afficher un chargement pendant la récupération des données
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }
  
  // Afficher une erreur si le chargement a échoué
  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={styles.errorTitle}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadMedicationData}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButtonRetry}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonRetryText}>Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            disabled={isSubmitting}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Modifier le médicament</Text>
          <View style={styles.placeholderButton} />
        </View>
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Nom du médicament */}
          <Text style={styles.label}>Nom du médicament*</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            onBlur={validateName}
            placeholder="Ex: Paracétamol"
            editable={!isSubmitting}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          
          {/* Description */}
          <Text style={styles.label}>Description (optionnel)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Ex: Contre la douleur et la fièvre"
            multiline
            numberOfLines={3}
            editable={!isSubmitting}
          />
          
          {/* Dosage et unité */}
          <View style={styles.row}>
            <View style={styles.halfColumn}>
              <Text style={styles.label}>Dosage*</Text>
              <TextInput
                style={styles.input}
                value={dosage}
                onChangeText={setDosage}
                onBlur={validateDosage}
                placeholder="Ex: 500"
                keyboardType="numeric"
                editable={!isSubmitting}
              />
              {dosageError ? <Text style={styles.errorText}>{dosageError}</Text> : null}
            </View>
            
            <View style={styles.halfColumn}>
              <Text style={styles.label}>Unité*</Text>
              <View style={styles.pickerContainer}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.unitPicker}
                >
                  {unitOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.unitOption,
                        unit === option && styles.selectedUnitOption,
                      ]}
                      onPress={() => setUnit(option)}
                      disabled={isSubmitting}
                    >
                      <Text 
                        style={[
                          styles.unitOptionText,
                          unit === option && styles.selectedUnitOptionText,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
          
          {/* Stock actuel */}
          <Text style={styles.label}>Stock actuel*</Text>
          <View style={styles.stockContainer}>
            <TouchableOpacity
              style={styles.stockButton}
              onPress={() => handleUpdateStock(false)}
              disabled={isSubmitting || Number(currentStock) <= 0}
            >
              <Text style={styles.stockButtonText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.stockInput}
              value={currentStock}
              onChangeText={setCurrentStock}
              onBlur={validateCurrentStock}
              keyboardType="numeric"
              editable={!isSubmitting}
            />
            <TouchableOpacity
              style={styles.stockButton}
              onPress={() => handleUpdateStock(true)}
              disabled={isSubmitting}
            >
              <Text style={styles.stockButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          {currentStockError ? <Text style={styles.errorText}>{currentStockError}</Text> : null}
          
          {/* Seuil de réapprovisionnement */}
          <Text style={styles.label}>Seuil d&apos;alerte*</Text>
          <TextInput
            style={styles.input}
            value={reorderThreshold}
            onChangeText={setReorderThreshold}
            onBlur={validateReorderThreshold}
            placeholder="Ex: 5"
            keyboardType="numeric"
            editable={!isSubmitting}
          />
          {reorderThresholdError ? <Text style={styles.errorText}>{reorderThresholdError}</Text> : null}
          
          {/* Date d'expiration */}
          <Text style={styles.label}>Date d&apos;expiration (optionnel)</Text>
          <TextInput
            style={styles.input}
            value={expiryDate}
            onChangeText={setExpiryDate}
            onBlur={validateExpiryDate}
            placeholder="AAAA-MM-JJ (Ex: 2025-12-31)"
            editable={!isSubmitting}
          />
          {expiryDateError ? <Text style={styles.errorText}>{expiryDateError}</Text> : null}
          
          {/* Couleur */}
          <Text style={styles.label}>Couleur</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.colorPicker}
          >
            {PREDEFINED_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColorOption,
                ]}
                onPress={() => setSelectedColor(color)}
                disabled={isSubmitting}
              />
            ))}
          </ScrollView>
          
          {/* Notes */}
          <Text style={styles.label}>Notes (optionnel)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Ex: Prendre avec un verre d'eau"
            multiline
            numberOfLines={3}
            editable={!isSubmitting}
          />
          
          {/* Bouton de soumission */}
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Enregistrer</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    padding: theme.spacing.l,
  },
  keyboardAvoidingView: {
    flex: 1,
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
  placeholderButton: {
    width: 40,
  },
  scrollContent: {
    padding: theme.spacing.m,
    paddingBottom: theme.spacing.xl,
  },
  errorTitle: {
    fontSize: theme.typography.fontSizes.large,
    fontWeight: 'bold',
    color: theme.colors.error,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.m,
  },
  retryButtonText: {
    color: 'white',
    fontSize: theme.typography.fontSizes.medium,
    fontWeight: '600',
  },
  backButtonRetry: {
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
  },
  backButtonRetryText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSizes.medium,
  },
  label: {
    fontSize: theme.typography.fontSizes.medium,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.s,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    fontSize: theme.typography.fontSizes.medium,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.xs,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSizes.small,
    marginBottom: theme.spacing.s,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -theme.spacing.xs,
  },
  halfColumn: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  stockButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  stockInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    fontSize: theme.typography.fontSizes.medium,
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.m,
    textAlign: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
    marginBottom: theme.spacing.s,
  },
  unitPicker: {
    padding: theme.spacing.xs,
  },
  unitOption: {
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.borderRadius.small,
    marginHorizontal: theme.spacing.xs,
  },
  selectedUnitOption: {
    backgroundColor: theme.colors.primary,
  },
  unitOptionText: {
    fontSize: theme.typography.fontSizes.medium,
    color: theme.colors.text,
  },
  selectedUnitOptionText: {
    color: 'white',
    fontWeight: '600',
  },
  colorPicker: {
    flexDirection: 'row',
    marginVertical: theme.spacing.s,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: theme.spacing.m,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    alignItems: 'center',
    marginTop: theme.spacing.l,
    height: 50,
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: theme.colors.disabled,
  },
  submitButtonText: {
    color: 'white',
    fontSize: theme.typography.fontSizes.large,
    fontWeight: '600',
  },
});

export default EditMedication;