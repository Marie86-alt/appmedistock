// // app/(tabs)/Home.tsx
// import React from 'react';
// import { 
//   StyleSheet, 
//   Text, 
//   View, 
//   ScrollView, 
//   TouchableOpacity,
//   SafeAreaView 
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
// import theme from '../../src/styles/theme';
// import globalStyles from '../../src/styles/styles';

// export default function Home() {
//   const router = useRouter();

//   const features = [
//     {
//       icon: 'medkit-outline',
//       iconFamily: 'Ionicons',
//       title: 'Gérer vos médicaments',
//       description: 'Organisez et suivez tous vos médicaments en un seul endroit',
//       color: '#4CAF50',
//       onPress: () => router.push('/MedicationList'),
//     },
//     {
//       icon: 'alarm-outline',
//       iconFamily: 'Ionicons',
//       title: 'Rappels intelligents',
//       description: 'Ne manquez plus jamais une prise de médicament',
//       color: '#FF9800',
//       onPress: () => router.push('/Reminders'),
//     },
//     {
//       icon: 'speedometer-outline',
//       iconFamily: 'Ionicons',
//       title: 'Suivi des stocks',
//       description: 'Restez informé de vos niveaux de stock en temps réel',
//       color: '#2196F3',
//       onPress: () => router.push('/Dashboard'),
//     },
//     {
//       icon: 'heart-outline',
//       iconFamily: 'Ionicons',
//       title: 'Santé optimisée',
//       description: 'Prenez soin de votre santé avec une gestion simplifiée',
//       color: '#E91E63',
//       onPress: () => router.push('/Dashboard'),
//     },
//   ];

//   const quickActions = [
//     {
//       icon: 'pluscircle',
//       iconFamily: 'AntDesign',
//       title: 'Ajouter',
//       subtitle: 'un médicament',
//       color: theme.colors.primary,
//       onPress: () => router.push('/AddMedication'),
//     },
//     {
//       icon: 'calendar-outline',
//       iconFamily: 'Ionicons',
//       title: 'Voir',
//       subtitle: 'mes rappels',
//       color: '#FF9800',
//       onPress: () => router.push('/Reminders'),
//     },
//   ];

//   const renderIcon = (iconFamily: string, iconName: string, size: number, color: string) => {
//     switch (iconFamily) {
//       case 'AntDesign':
//         return <AntDesign name={iconName as any} size={size} color={color} />;
//       case 'Ionicons':
//         return <Ionicons name={iconName as any} size={size} color={color} />;
//       case 'MaterialIcons':
//         return <MaterialIcons name={iconName as any} size={size} color={color} />;
//       default:
//         return <AntDesign name="question" size={size} color={color} />;
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView 
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header avec illustration */}
//         <View style={styles.header}>
//           <View style={styles.illustrationContainer}>
//             <View style={styles.pillsIllustration}>
//               <Ionicons name="medkit" size={40} color={theme.colors.primary} />
//               <View style={styles.pillDots}>
//                 <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
//                 <View style={[styles.dot, { backgroundColor: '#FF9800' }]} />
//                 <View style={[styles.dot, { backgroundColor: '#2196F3' }]} />
//                 <View style={[styles.dot, { backgroundColor: '#E91E63' }]} />
//               </View>
//             </View>
//             <Ionicons name="shield-checkmark" size={24} color="#4CAF50" style={styles.shieldIcon} />
//           </View>
          
//           <Text style={styles.title}>Bienvenue sur MédiStock !</Text>
//           <Text style={styles.subtitle}>
//             Votre assistant personnel pour une gestion intelligente de vos médicaments
//           </Text>
//         </View>

//         {/* Actions rapides */}
//         <View style={styles.quickActionsContainer}>
//           <Text style={styles.sectionTitle}>Actions rapides</Text>
//           <View style={styles.quickActionsRow}>
//             {quickActions.map((action, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={[styles.quickActionCard, globalStyles.shadow2]}
//                 onPress={action.onPress}
//               >
//                 <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
//                   {renderIcon(action.iconFamily, action.icon, 24, 'white')}
//                 </View>
//                 <Text style={styles.quickActionTitle}>{action.title}</Text>
//                 <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Fonctionnalités principales */}
//         <View style={styles.featuresContainer}>
//           <Text style={styles.sectionTitle}>Fonctionnalités</Text>
//           {features.map((feature, index) => (
//             <TouchableOpacity
//               key={index}
//               style={[styles.featureCard, globalStyles.shadow1]}
//               onPress={feature.onPress}
//             >
//               <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
//                 {renderIcon(feature.iconFamily, feature.icon, 28, feature.color)}
//               </View>
//               <View style={styles.featureContent}>
//                 <Text style={styles.featureTitle}>{feature.title}</Text>
//                 <Text style={styles.featureDescription}>{feature.description}</Text>
//               </View>
//               <View style={styles.featureArrow}>
//                 <Text style={styles.arrowText}>→</Text>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Statistiques */}
//         <View style={[styles.statsContainer, globalStyles.shadow1]}>
//           <View style={styles.statsHeader}>
//             <Ionicons name="bar-chart-outline" size={20} color={theme.colors.primary} />
//             <Text style={styles.statsTitle}>Votre santé en un coup d&apos;œil</Text>
//           </View>
//           <Text style={styles.statsDescription}>
//             Commencez à ajouter vos médicaments pour voir vos statistiques de santé
//           </Text>
//           <TouchableOpacity 
//             style={styles.statsButton}
//             onPress={() => router.push('/AddMedication')}
//           >
//             <Text style={styles.statsButtonText}>Commencer</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Espacement en bas */}
//         <View style={styles.bottomSpacing} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: theme.spacing.m,
//   },
//   header: {
//     alignItems: 'center',
//     paddingTop: theme.spacing.xl,
//     paddingBottom: theme.spacing.l,
//   },
//   illustrationContainer: {
//     position: 'relative',
//     marginBottom: theme.spacing.l,
//   },
//   pillsIllustration: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: theme.colors.primary + '10',
//     borderWidth: 2,
//     borderColor: theme.colors.primary + '30',
//   },
//   pillDots: {
//     flexDirection: 'row',
//     marginTop: 8,
//     gap: 4,
//   },
//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//   },
//   shieldIcon: {
//     position: 'absolute',
//     top: -5,
//     right: -5,
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 4,
//   },
//   title: {
//     fontSize: theme.typography.fontSizes.title,
//     fontWeight: 'bold',
//     color: theme.colors.primary,
//     marginBottom: theme.spacing.s,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: theme.typography.fontSizes.medium,
//     color: theme.colors.textSecondary,
//     textAlign: 'center',
//     lineHeight: 22,
//     paddingHorizontal: theme.spacing.m,
//   },
//   sectionTitle: {
//     fontSize: theme.typography.fontSizes.large,
//     fontWeight: '600',
//     color: theme.colors.text,
//     marginBottom: theme.spacing.m,
//   },
//   quickActionsContainer: {
//     marginBottom: theme.spacing.xl,
//   },
//   quickActionsRow: {
//     flexDirection: 'row',
//     gap: theme.spacing.m,
//   },
//   quickActionCard: {
//     flex: 1,
//     backgroundColor: theme.colors.surface,
//     borderRadius: theme.borderRadius.medium,
//     padding: theme.spacing.l,
//     alignItems: 'center',
//   },
//   quickActionIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: theme.spacing.s,
//   },
//   quickActionTitle: {
//     fontSize: theme.typography.fontSizes.medium,
//     fontWeight: '600',
//     color: theme.colors.text,
//     marginBottom: 2,
//   },
//   quickActionSubtitle: {
//     fontSize: theme.typography.fontSizes.small,
//     color: theme.colors.textSecondary,
//     textAlign: 'center',
//   },
//   featuresContainer: {
//     marginBottom: theme.spacing.xl,
//   },
//   featureCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: theme.colors.surface,
//     borderRadius: theme.borderRadius.medium,
//     padding: theme.spacing.m,
//     marginBottom: theme.spacing.s,
//   },
//   featureIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: theme.spacing.m,
//   },
//   featureContent: {
//     flex: 1,
//   },
//   featureTitle: {
//     fontSize: theme.typography.fontSizes.medium,
//     fontWeight: '600',
//     color: theme.colors.text,
//     marginBottom: 4,
//   },
//   featureDescription: {
//     fontSize: theme.typography.fontSizes.small,
//     color: theme.colors.textSecondary,
//     lineHeight: 18,
//   },
//   featureArrow: {
//     marginLeft: theme.spacing.s,
//   },
//   arrowText: {
//     fontSize: 18,
//     color: theme.colors.textSecondary,
//   },
//   statsContainer: {
//     backgroundColor: theme.colors.surface,
//     borderRadius: theme.borderRadius.medium,
//     padding: theme.spacing.l,
//     marginBottom: theme.spacing.l,
//   },
//   statsHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: theme.spacing.s,
//     gap: 8,
//   },
//   statsTitle: {
//     fontSize: theme.typography.fontSizes.medium,
//     fontWeight: '600',
//     color: theme.colors.text,
//   },
//   statsDescription: {
//     fontSize: theme.typography.fontSizes.small,
//     color: theme.colors.textSecondary,
//     lineHeight: 18,
//     marginBottom: theme.spacing.m,
//   },
//   statsButton: {
//     backgroundColor: theme.colors.primary,
//     borderRadius: theme.borderRadius.medium,
//     paddingVertical: theme.spacing.s,
//     paddingHorizontal: theme.spacing.m,
//     alignSelf: 'flex-start',
//   },
//   statsButtonText: {
//     color: 'white',
//     fontSize: theme.typography.fontSizes.medium,
//     fontWeight: '600',
//   },
//   bottomSpacing: {
//     height: theme.spacing.xl,
//   },
// });



// app/(tabs)/Home.tsx
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Pill, 
   
  Heart, 
  Shield, 
  Plus, 
  Calendar,
  Activity,
  Bell
} from 'lucide-react-native';
import theme from '../../src/styles/theme';
import globalStyles from '../../src/styles/styles';

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: Pill,
      title: 'Gérer vos médicaments',
      description: 'Organisez et suivez tous vos médicaments en un seul endroit',
      color: '#4CAF50',
      onPress: () => router.push('/MedicationList'),
    },
    {
      icon: Bell,
      title: 'Rappels intelligents',
      description: 'Ne manquez plus jamais une prise de médicament',
      color: '#FF9800',
      onPress: () => router.push('/Reminders'),
    },
    {
      icon: Activity,
      title: 'Suivi des stocks',
      description: 'Restez informé de vos niveaux de stock en temps réel',
      color: '#2196F3',
      onPress: () => router.push('/Dashboard'),
    },
    {
      icon: Heart,
      title: 'Santé optimisée',
      description: 'Prenez soin de votre santé avec une gestion simplifiée',
      color: '#E91E63',
      onPress: () => router.push('/Dashboard'),
    },
  ];

  const quickActions = [
    {
      icon: Plus,
      title: 'Ajouter',
      subtitle: 'un médicament',
      color: theme.colors.primary,
      onPress: () => router.push('/AddMedication'),
    },
    {
      icon: Calendar,
      title: 'Voir',
      subtitle: 'mes rappels',
      color: '#FF9800',
      onPress: () => router.push('/Reminders'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header avec illustration */}
        <View style={styles.header}>
          <View style={styles.illustrationContainer}>
            <View style={styles.pillsIllustration}>
              <Pill size={40} color={theme.colors.primary} />
              <View style={styles.pillDots}>
                <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
                <View style={[styles.dot, { backgroundColor: '#FF9800' }]} />
                <View style={[styles.dot, { backgroundColor: '#2196F3' }]} />
                <View style={[styles.dot, { backgroundColor: '#E91E63' }]} />
              </View>
            </View>
            <Shield size={24} color="#4CAF50" style={styles.shieldIcon} />
          </View>
          
          <Text style={styles.title}>Bienvenue sur MédiStock !</Text>
          <Text style={styles.subtitle}>
            Votre assistant personnel pour une gestion intelligente de vos médicaments
          </Text>
        </View>

        {/* Actions rapides */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.quickActionsRow}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickActionCard, globalStyles.shadow2]}
                onPress={action.onPress}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <action.icon size={24} color="white" />
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Fonctionnalités principales */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Fonctionnalités</Text>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.featureCard, globalStyles.shadow1]}
              onPress={feature.onPress}
            >
              <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                <feature.icon size={28} color={feature.color} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
              <View style={styles.featureArrow}>
                <Text style={styles.arrowText}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Statistiques */}
        <View style={[styles.statsContainer, globalStyles.shadow1]}>
          <View style={styles.statsHeader}>
            <Activity size={20} color={theme.colors.primary} />
            <Text style={styles.statsTitle}>Votre santé en un coup d&apos;œil</Text>
          </View>
          <Text style={styles.statsDescription}>
            Commencez à ajouter vos médicaments pour voir vos statistiques de santé
          </Text>
          <TouchableOpacity 
            style={styles.statsButton}
            onPress={() => router.push('/AddMedication')}
          >
            <Text style={styles.statsButtonText}>Commencer</Text>
          </TouchableOpacity>
        </View>

        {/* Espacement en bas */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.m,
  },
  header: {
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.l,
  },
  illustrationContainer: {
    position: 'relative',
    marginBottom: theme.spacing.l,
  },
  pillsIllustration: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primary + '10',
    borderWidth: 2,
    borderColor: theme.colors.primary + '30',
  },
  pillDots: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  shieldIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
  },
  title: {
    fontSize: theme.typography.fontSizes.title,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.s,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.medium,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: theme.spacing.m,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.large,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  quickActionsContainer: {
    marginBottom: theme.spacing.xl,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.m,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.l,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  quickActionTitle: {
    fontSize: theme.typography.fontSizes.medium,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: theme.typography.fontSizes.small,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: theme.spacing.xl,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.s,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: theme.typography.fontSizes.medium,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: theme.typography.fontSizes.small,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  featureArrow: {
    marginLeft: theme.spacing.s,
  },
  arrowText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
  statsContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.l,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
    gap: 8,
  },
  statsTitle: {
    fontSize: theme.typography.fontSizes.medium,
    fontWeight: '600',
    color: theme.colors.text,
  },
  statsDescription: {
    fontSize: theme.typography.fontSizes.small,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: theme.spacing.m,
  },
  statsButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    alignSelf: 'flex-start',
  },
  statsButtonText: {
    color: 'white',
    fontSize: theme.typography.fontSizes.medium,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
});