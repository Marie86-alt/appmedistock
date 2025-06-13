// components/ScanPrescription.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Camera as ExpoCamera } from 'expo-camera'; // Suppression de CameraType
import { useRouter } from 'expo-router';
import * as ImageManipulator from 'expo-image-manipulator';
import theme from '../app/styles/theme';

// Import des types depuis votre fichier models
import { ScannedMedication } from '../app/types/models';

// Interface pour les props du composant
interface ScanPrescriptionProps {
  onScanComplete?: (medications: ScannedMedication[]) => void;
  ocrApiKey?: string;
}

export default function ScanPrescription({ onScanComplete, ocrApiKey }: ScanPrescriptionProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannedUri, setScannedUri] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [flashMode, setFlashMode] = useState<'off' | 'on'>('off');
  const cameraRef = useRef<InstanceType<typeof ExpoCamera> | null>(null); // Typage corrigé
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await ExpoCamera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Optimisation de l'image avant l'OCR
  const optimizeImage = async (uri: string): Promise<string> => {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1920 } }], // Redimensionner pour optimiser l'OCR
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      return manipulatedImage.uri;
    } catch (error) {
      console.error("Erreur lors de l'optimisation de l'image:", error);
      return uri;
    }
  };

  const handleScan = async () => {
    if (!cameraRef.current) {
      Alert.alert('Erreur', 'Caméra non disponible');
      return;
    }

    setScanning(true);
    try {
      // Capture de la photo avec de meilleures options
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        base64: false,
        skipProcessing: false,
      });

      setScannedUri(photo.uri);
      setProcessing(true);

      // Optimiser l'image
      const optimizedUri = await optimizeImage(photo.uri);

      // Extraction du texte (avec gestion d'erreur améliorée)
      const text = await extractText(optimizedUri);

      if (!text || text.trim().length === 0) {
        Alert.alert(
          'Aucun texte détecté',
          "Assurez-vous que l'ordonnance est bien éclairée et lisible."
        );
        setScannedUri(null);
        return;
      }

      const medications = parseMedications(text);

      if (medications.length > 0) {
        // Callback optionnel
        if (onScanComplete) {
          onScanComplete(medications);
        } else {
          // Navigation par défaut
          router.push({
            pathname: './(tabs)/addMedication', // Correction de la typo
            params: {
              scannedData: JSON.stringify(medications),
              scanDate: new Date().toISOString(),
            },
          });
        }
      } else {
        Alert.alert(
          'Aucun médicament détecté',
          'Veuillez scanner une ordonnance valide ou saisir manuellement.',
          [
            { text: 'Réessayer', onPress: () => setScannedUri(null) },
            {
              text: 'Saisie manuelle',
              onPress: () => router.push('./(tabs)/addMedication'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Erreur lors du scan:', error);
      Alert.alert(
        'Erreur de scan',
        'Une erreur est survenue. Veuillez réessayer.',
        [{ text: 'OK', onPress: () => setScannedUri(null) }]
      );
    } finally {
      setScanning(false);
      setProcessing(false);
    }
  };

  const extractText = async (uri: string): Promise<string> => {
    // TODO: Remplacer par une vraie API OCR (Google Vision, AWS Textract, etc.)

    // Exemple avec Google Cloud Vision API
    if (ocrApiKey) {
      try {
        const base64 = await convertToBase64(uri);
        const response = await fetch(
          `https://vision.googleapis.com/v1/images:annotate?key=${ocrApiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              requests: [
                {
                  image: { content: base64 },
                  features: [{ type: 'TEXT_DETECTION', maxResults: 1 }],
                },
              ],
            }),
          }
        );

        const data = await response.json();
        return data.responses[0]?.fullTextAnnotation?.text || '';
      } catch (error) {
        console.error('Erreur OCR:', error);
      }
    }

    // Simulation pour le développement
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve(
            'ORDONNANCE MÉDICALE\n' +
              'Paracétamol 500mg - 2 comprimés 3 fois par jour pendant 5 jours\n' +
              'Ibuprofène 200mg - 1 comprimé matin et soir pendant 3 jours\n' +
              'Amoxicilline 1g - 1 comprimé 2 fois par jour pendant 7 jours'
          ),
        1500
      )
    );
  };

  const convertToBase64 = async (uri: string): Promise<string> => {
    // Implémentation de la conversion en base64
    // Utiliser expo-file-system ou react-native-fs
    return ''; // Placeholder
  };

  const parseMedications = (text: string): ScannedMedication[] => {
    const lines = text.split('\n').filter((line) => line.trim());
    const medications: ScannedMedication[] = [];

    // Patterns améliorés pour détecter les médicaments
    const medicationPattern = /([A-Za-zÀ-ÿ\s]+)\s*(\d+\s*(?:mg|g|ml|µg|ui))/i;
    const frequencyPattern = /(\d+)\s*(?:fois|x)\s*(?:par|\/)\s*jour/i;
    const durationPattern = /pendant\s*(\d+)\s*(?:jour|semaine|mois)/i;

    lines.forEach((line) => {
      const medMatch = line.match(medicationPattern);

      if (medMatch) {
        const name = medMatch[1].trim();
        const dosageWithUnit = medMatch[2];
        const dosageMatch = dosageWithUnit.match(/(\d+)\s*(mg|g|ml|µg|ui)/i);

        if (dosageMatch) {
          const medication: ScannedMedication = {
            name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
            dosage: dosageMatch[1],
            unit: dosageMatch[2].toLowerCase(),
          };

          // Recherche de la fréquence
          const freqMatch = line.match(frequencyPattern);
          if (freqMatch) {
            medication.frequency = `${freqMatch[1]} fois par jour`;
          }

          // Recherche de la durée
          const durMatch = line.match(durationPattern);
          if (durMatch) {
            medication.duration = durMatch[0];
          }

          medications.push(medication);
        }
      }
    });

    return medications;
  };

  const toggleFlash = () => {
    setFlashMode((current) => (current === 'off' ? 'on' : 'off'));
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Chargement de la caméra...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Accès à la caméra refusé</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => ExpoCamera.requestCameraPermissionsAsync()}
        >
          <Text style={styles.buttonText}>Autoriser l&apos;accès</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {scannedUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: scannedUri }} style={styles.preview} />
          {processing && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.processingText}>Analyse en cours...</Text>
            </View>
          )}
          {!processing && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => setScannedUri(null)}
              >
                <Text style={styles.buttonText}>Reprendre</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <>
          <ExpoCamera
            ref={cameraRef}
            style={styles.camera}
            type="back"
            flashMode={flashMode}
            ratio="4:3"
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.scanFrame} />
              <Text style={styles.instructionText}>
                Placez l&#39;ordonnance dans le cadre
              </Text>
            </View>
          </ExpoCamera>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
              <Text style={styles.flashIcon}>
                {flashMode === 'on' ? '⚡' : '⚡'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.captureButton, scanning && styles.disabledButton]}
              onPress={handleScan}
              disabled={scanning}
            >
              {scanning ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.captureInner} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.galleryButton}
              onPress={() => {
                /* TODO: Implémenter la sélection depuis la galerie */
              }}
            >
              <Text style={styles.galleryIcon}>🖼️</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: '85%',
    height: '60%',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  flashButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashIcon: {
    fontSize: 24,
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryIcon: {
    fontSize: 24,
  },
  previewContainer: {
    flex: 1,
  },
  preview: {
    flex: 1,
    resizeMode: 'contain',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#ff6b6b',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});