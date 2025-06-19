// app/(tabs)/AddReminder.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import theme from '../../src/styles/theme';
//import globalStyles from '../../src/styles/styles';
import api from '../../services/api';
import { Medication } from '../../src/types/models';

const AddReminder: React.FC = () => {
  const router = useRouter();
  
  // États du formulaire
  const [medications, setMedications] = useState<Medication[]>([]);
  const [selectedMedicationId, setSelectedMedicationId] = useState('');
  const [dosage, setDosage] = useState('');
  const [unit, setUnit] = useState('mg');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [frequency, setFrequency] = useState<'asNeeded' | 'daily' | 'weekly' | 'monthly' | 'custom' | 'twice_daily' | 'three_times_daily'>('daily');
  const [notes, setNotes] = useState('');
  
  // États de validation
  const [medicationError, setMedicationError] = useState('');
  const [dosageError, setDosageError] = useState('');
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  
  // État de chargement
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Options pour les unités et fréquences
  const unitOptions = ['mg', 'ml', 'tablet', 'capsule', 'drop', 'application', 'unit'];
  const frequencyOptions = [
    { value: 'asNeeded', label: 'Au besoin' },
    { value: 'daily', label: 'Quotidien' },
    { value: 'twice_daily', label: '2 fois par jour' },
    { value: 'three_times_daily', label: '3 fois par jour' },
    { value: 'weekly', label: 'Hebdomadaire' },
    { value: 'monthly', label: 'Mensuel' },
    { value: 'custom', label: 'Personnalisé' },
  ];
  
  // Charger les médicaments disponibles
  useEffect(() => {
    loadMedications();
  }, []);
  
  const loadMedications = async () => {
    try {
      const response = await api.getMedications();
      if (response.success && response.data) {
        setMedications(response.data);
        if (response.data.length > 0) {
          setSelectedMedicationId(response.data[0].id);
          setUnit(response.data[0].unit);
          setDosage(response.data[0].dosage.toString());
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des médicaments:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Validation des champs
  const validateMedication = () => {
    if (!selectedMedicationId) {
      setMedicationError('Veuillez sélectionner un médicament');
      return false;
    } else {
      setMedicationError('');
      return true;
    }
  };
  
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
  
  const validateDate = () => {
    if (!scheduledDate) {
      setDateError('La date est requise');
      return false;
    }
    
    // Format français : JJ/MM/AAAA ou JJ-MM-AAAA
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])[\/\-](0[1-9]|1[0-2])[\/\-](20\d{2})$/;
    if (!dateRegex.test(scheduledDate)) {
      setDateError('Format de date invalide (JJ/MM/AAAA)');
      return false;
    }
    
    // Convertir en format ISO pour validation
    const [day, month, year] = scheduledDate.split(/[\/\-]/);
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    // Vérifier que la date est valide
    if (dateObj.getDate() !== parseInt(day) || 
        dateObj.getMonth() !== parseInt(month) - 1 || 
        dateObj.getFullYear() !== parseInt(year)) {
      setDateError('Date invalide');
      return false;
    }
    
    setDateError('');
    return true;
  };
  
  const validateTime = () => {
    if (!scheduledTime) {
      setTimeError('L\'heure est requise');
      return false;
    }
    
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(scheduledTime)) {
      setTimeError('Format d\'heure invalide (HH:MM)');
      return false;
    }
    
    setTimeError('');
    return true;
  };
  
  // Mise à jour automatique du dosage et unité quand on change de médicament
  const handleMedicationChange = (medicationId: string) => {
    setSelectedMedicationId(medicationId);
    const selectedMed = medications.find(m => m.id === medicationId);
    if (selectedMed) {
      setUnit(selectedMed.unit);
      setDosage(selectedMed.dosage.toString());
    }
  };
  
  // Soumission du formulaire
  const handleSubmit = async () => {
    const isMedicationValid = validateMedication();
    const isDosageValid = validateDosage();
    const isDateValid = validateDate();
    const isTimeValid = validateTime();
    
    if (isMedicationValid && isDosageValid && isDateValid && isTimeValid) {
      setIsSubmitting(true);
      
      try {
        const selectedMedication = medications.find(m => m.id === selectedMedicationId);
        if (!selectedMedication) {
          Alert.alert('Erreur', 'Médicament sélectionné introuvable');
          return;
        }
        
        // Convertir la date française en format ISO
        const [day, month, year] = scheduledDate.split(/[\/\-]/);
        const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        const scheduledFor = new Date(`${isoDate}T${scheduledTime}:00`);
        
        const reminderData = {
          medicationId: selectedMedicationId,
          medication: selectedMedication,
          dosage: Number(dosage),
          unit: unit as 'tablet' | 'capsule' | 'ml' | 'mg' | 'drop' | 'application' | 'unit',
          scheduledFor: scheduledFor.toISOString(),
          frequency,
          status: 'pending' as const,
          notes,
          patientId: '1', // À remplacer par l'ID réel de l'utilisateur
        };
        
        console.log('Données du rappel à ajouter:', reminderData);
        
        const response = await api.addReminder(reminderData);
        
        if (response.success) {
          Alert.alert(
            'Rappel ajouté',
            `Rappel pour ${selectedMedication.name} programmé avec succès.`,
            [
              {
                text: 'OK',
                onPress: () => router.back(),
              },
            ]
          );
        } else {
          Alert.alert('Erreur', response.message || 'Impossible d\'ajouter le rappel');
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout du rappel:', error);
        Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout du rappel');
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  // Remplir automatiquement avec la date/heure actuelle
  const fillCurrentDateTime = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const time = now.toTimeString().slice(0, 5); // HH:MM
    
    setScheduledDate(`${day}/${month}/${year}`); // Format français
    setScheduledTime(time);
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }
  
  if (medications.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Ajouter un rappel</Text>
          <View style={styles.placeholderButton} />
        </View>
        
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Aucun médicament disponible. Ajoutez d&apos;abord un médicament pour créer des rappels.
          </Text>
          <TouchableOpacity 
            style={styles.addMedicationButton}
            onPress={() => router.push('/AddMedication')}
          >
            <Text style={styles.addMedicationButtonText}>Ajouter un médicament</Text>
          </TouchableOpacity>
        </View>
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
          <Text style={styles.title}>Ajouter un rappel</Text>
          <TouchableOpacity 
            style={styles.autoFillButton}
            onPress={fillCurrentDateTime}
          >
            <Text style={styles.autoFillButtonText}>Maintenant</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Sélection du médicament */}
          <Text style={styles.label}>Médicament*</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedMedicationId}
              onValueChange={handleMedicationChange}
              style={styles.picker}
              enabled={!isSubmitting}
            >
              {medications.map((med) => (
                <Picker.Item 
                  key={med.id} 
                  label={`${med.name} (${med.dosage} ${med.unit})`} 
                  value={med.id} 
                />
              ))}
            </Picker>
          </View>
          {medicationError ? <Text style={styles.errorText}>{medicationError}</Text> : null}
          
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
                <Picker
                  selectedValue={unit}
                  onValueChange={setUnit}
                  style={styles.picker}
                  enabled={!isSubmitting}
                >
                  {unitOptions.map((option) => (
                    <Picker.Item key={option} label={option} value={option} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
          
          {/* Date et heure */}
          <View style={styles.row}>
            <View style={styles.halfColumn}>
              <Text style={styles.label}>Date*</Text>
              <TextInput
                style={styles.input}
                value={scheduledDate}
                onChangeText={setScheduledDate}
                onBlur={validateDate}
                placeholder="JJ/MM/AAAA"
                editable={!isSubmitting}
              />
              {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
            </View>
            
            <View style={styles.halfColumn}>
              <Text style={styles.label}>Heure*</Text>
              <TextInput
                style={styles.input}
                value={scheduledTime}
                onChangeText={setScheduledTime}
                onBlur={validateTime}
                placeholder="HH:MM"
                editable={!isSubmitting}
              />
              {timeError ? <Text style={styles.errorText}>{timeError}</Text> : null}
            </View>
          </View>
          
          {/* Fréquence */}
          <Text style={styles.label}>Fréquence</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={frequency}
              onValueChange={setFrequency}
              style={styles.picker}
              enabled={!isSubmitting}
            >
              {frequencyOptions.map((option) => (
                <Picker.Item 
                  key={option.value} 
                  label={option.label} 
                  value={option.value} 
                />
              ))}
            </Picker>
          </View>
          
          {/* Notes */}
          <Text style={styles.label}>Notes (optionnel)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Ex: Prendre après le repas"
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
              <Text style={styles.submitButtonText}>Ajouter le rappel</Text>
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
  autoFillButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.s,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.small,
  },
  autoFillButtonText: {
    color: 'white',
    fontSize: theme.typography.fontSizes.small,
    fontWeight: '600',
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.xs,
  },
  picker: {
    height: 50,
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
    marginBottom: theme.spacing.l,
  },
  addMedicationButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderRadius: theme.borderRadius.medium,
  },
  addMedicationButtonText: {
    color: 'white',
    fontSize: theme.typography.fontSizes.medium,
    fontWeight: '600',
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

export default AddReminder;