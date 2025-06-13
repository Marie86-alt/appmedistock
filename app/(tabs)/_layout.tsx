


// import React from 'react';
// import { Tabs } from 'expo-router';
// import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
// import theme from '../styles/theme';

// export default function TabsLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: theme.colors.primary,
//         tabBarInactiveTintColor: theme.colors.textSecondary,
//         tabBarStyle: { backgroundColor: theme.colors.surface },
//       }}
//     >
//       {/* Accueil */}
//       <Tabs.Screen
//         name="Home"
//         options={{
//           title: 'Accueil',
//           tabBarIcon: ({ color, size }) => <AntDesign name="home" size={size} color={color} />,
//         }}
//       />

//       {/* Tableau de bord */}
//       <Tabs.Screen
//         name="Dashboard"
//         options={{
//           title: 'Tableau de bord',
//           tabBarIcon: ({ color, size }) => <Ionicons name="speedometer-outline" size={size} color={color} />,
//         }}
//       />

//       {/* Médicaments */}
//       <Tabs.Screen
//         name="MedicationList"
//         options={{
//           title: 'Médicaments',
//           tabBarIcon: ({ color, size }) => <Ionicons name="medkit-outline" size={size} color={color} />,
//         }}
//       />

//       {/* Ajouter */}
//       <Tabs.Screen
//         name="AddMedication"
//         options={{
//           title: 'ajouter un medicament',
//           tabBarIcon: ({ color, size }) => <AntDesign name="pluscircleo" size={size} color={color} />,
//         }}
//       />

//       {/* Rappels */}
//       <Tabs.Screen
//         name="Reminders"
//         options={{
//           title: 'Rappels',
//           tabBarIcon: ({ color, size }) => <Ionicons name="alarm-outline" size={size} color={color} />,
//         }}
//       />

//       {/* Se connecter */}
//       <Tabs.Screen
//         name="Login"
//         options={{
//           title: 'Se connecter',
//           tabBarIcon: ({ color, size }) => <AntDesign name="login" size={size} color={color} />,
//         }}
//       />

//       {/* S’inscrire */}
//       <Tabs.Screen
//         name="Register"
//         options={{
//           title: 'S’inscrire',
//           tabBarIcon: ({ color, size }) => <AntDesign name="adduser" size={size} color={color} />,
//         }}
//       />
//       {/* modifier un medicament */}
//       <Tabs.Screen
//         name="EditMedication"
//         options={{
//           title: 'Modifier',
//           tabBarIcon: ({ color, size }) => <AntDesign name="edit" size={size} color={color} />,
//         }}
//       />
//       {/* explore */}
//       <Tabs.Screen
//         name="Explore"
//         options={{
//           title: 'Explorer',
//           tabBarIcon: ({ color, size }) => (
//             <MaterialIcons name="explore" size={size} color={color} />),

//         }}
//       />
//     </Tabs>
//   );
// }


// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import theme from '../styles/theme';
import { useAuth } from '../contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // Pendant le chargement
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Si non authentifié, rediriger vers login
  if (!isAuthenticated) {
    return <Redirect href="/Login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: { backgroundColor: theme.colors.surface },
      }}
    >
      {/* Accueil */}
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => <AntDesign name="home" size={size} color={color} />,
        }}
      />

      {/* Tableau de bord */}
      <Tabs.Screen
        name="Dashboard"
        options={{
          title: 'Tableau',
          tabBarIcon: ({ color, size }) => <Ionicons name="speedometer-outline" size={size} color={color} />,
        }}
      />

      {/* Médicaments */}
      <Tabs.Screen
        name="MedicationList"
        options={{
          title: 'Médocs',
          tabBarIcon: ({ color, size }) => <Ionicons name="medkit-outline" size={size} color={color} />,
        }}
      />

      {/* Ajouter - Bouton central */}
      <Tabs.Screen
        name="AddMedication"
        options={{
          title: '',
          tabBarIcon: ({ color, size }) => <AntDesign name="pluscircle" size={size + 8} color={color} />,
        }}
      />

      {/* Rappels */}
      <Tabs.Screen
        name="Reminders"
        options={{
          title: 'Rappels',
          tabBarIcon: ({ color, size }) => <Ionicons name="alarm-outline" size={size} color={color} />,
        }}
      />

      {/* Explorer */}
      <Tabs.Screen
        name="Explore"
        options={{
          title: 'Explorer',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="explore" size={size} color={color} />,
        }}
      />

      {/* EditMedication - Caché de la barre */}
      <Tabs.Screen
        name="EditMedication"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}