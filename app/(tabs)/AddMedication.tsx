// app/main/AddMedicationScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import theme from '../styles/theme';
//import api from '../../services/api';

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

const AddMedication: React.FC = () => {
  const router = useRouter();
  
  // États du formulaire
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dosage, setDosage] = useState('');
  const [unit, setUnit] = useState('mg');
  const [initialStock, setInitialStock] = useState('');
  const [reorderThreshold, setReorderThreshold] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedColor, setSelectedColor] = useState(PREDEFINED_COLORS[0]);
  
  // État de validation
  const [nameError, setNameError] = useState('');
  const [dosageError, setDosageError] = useState('');
  const [initialStockError, setInitialStockError] = useState('');
  const [reorderThresholdError, setReorderThresholdError] = useState('');
  const [expiryDateError, setExpiryDateError] = useState('');
  
  // État de chargement
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Options pour les unités
  const unitOptions = ['mg', 'ml', 'tablet', 'capsule', 'drop', 'application', 'unit'];
  
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
  
  // Validation du stock initial
  const validateInitialStock = () => {
    if (!initialStock) {
      setInitialStockError('Le stock initial est requis');
      return false;
    } else if (isNaN(Number(initialStock)) || Number(initialStock) < 0) {
      setInitialStockError('Le stock doit être un nombre positif ou zéro');
      return false;
    } else {
      setInitialStockError('');
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
    
    const selectedDate = new Date(expiryDate);
    const today = new Date();
    if (selectedDate <= today) {
      setExpiryDateError('La date d&apos;expiration doit être future');
      return false;
    }
    
    setExpiryDateError('');
    return true;
  };
  
  // Gestion de la soumission du formulaire
  const handleSubmit = async () => {
    // Valider tous les champs
    const isNameValid = validateName();
    const isDosageValid = validateDosage();
    const isInitialStockValid = validateInitialStock();
    const isReorderThresholdValid = validateReorderThreshold();
    const isExpiryDateValid = validateExpiryDate();
    
    if (isNameValid && isDosageValid && isInitialStockValid && isReorderThresholdValid && isExpiryDateValid) {
      setIsSubmitting(true);
      
      try {
        // Construire l'objet médicament
        // Cette variable sera utilisée lorsque l'API sera implémentée
        // Pour le développement, on la log dans la console
        const medicationData = {
          name,
          description,
          dosage: Number(dosage),
          unit: unit as 'tablet' | 'capsule' | 'ml' | 'mg' | 'drop' | 'application' | 'unit',
          initialStock: Number(initialStock),
          currentStock: Number(initialStock), // Initialement égal au stock initial
          reorderThreshold: Number(reorderThreshold),
          expiryDate: expiryDate || undefined,
          color: selectedColor,
          notes,
          isActive: true,
          frequency: 'asNeeded', // Par défaut
          patientId: '1', // À remplacer par l'ID réel de l'utilisateur
        };
        
        // Log les données pour le développement
        console.log('Données du médicament à ajouter:', medicationData);
        
        // Simuler temporairement l'ajout d'un médicament
        // Dans une version future, cela serait remplacé par un appel à l'API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        Alert.alert(
          'Fonctionnalité en développement',
          'L\'ajout de médicaments sera disponible dans une prochaine mise à jour.',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
        
        /* Code à utiliser lorsque l'API sera prête
        if (api.addMedication) {
          const response = await api.addMedication(medicationData);
          
          if (response.success) {
            Alert.alert(
              'Médicament ajouté',
              `${name} a été ajouté avec succès à votre liste de médicaments.`,
              [
                {
                  text: 'OK',
                  onPress: () => router.back(), // Retour à l'écran précédent
                },
              ]
            );
          } else {
            Alert.alert('Erreur', response.message || 'Impossible d\'ajouter le médicament');
          }
        }
        */
      } catch (error) {
        console.error( error);
        Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout du médicament');
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
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
          <Text style={styles.title}>Ajouter un médicament</Text>
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
          
          {/* Stock et seuil */}
          <View style={styles.row}>
            <View style={styles.halfColumn}>
              <Text style={styles.label}>Stock initial*</Text>
              <TextInput
                style={styles.input}
                value={initialStock}
                onChangeText={setInitialStock}
                onBlur={validateInitialStock}
                placeholder="Ex: 30"
                keyboardType="numeric"
                editable={!isSubmitting}
              />
              {initialStockError ? <Text style={styles.errorText}>{initialStockError}</Text> : null}
            </View>
            
            <View style={styles.halfColumn}>
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
            </View>
          </View>
          
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
              <Text style={styles.submitButtonText}>Ajouter</Text>
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

export default AddMedication;