

// // // app/layout.tsx
// // import React, { useEffect } from 'react';
// // import { Platform } from 'react-native';
// // import { Tabs } from 'expo-router';
// // import { Ionicons } from '@expo/vector-icons';
// // import { AuthProvider } from '../contexts/AuthContext';

// // export default function Layout() {
// //   useEffect(() => {
// //     if (Platform.OS === 'web') {
// //       const link = document.createElement('link');
// //       link.href = 'https://fonts.googleapis.com/css2?family=Space+Mono&display=swap';
// //       link.rel = 'stylesheet';
// //       document.head.appendChild(link);
// //     }
// //   }, []);

// //   return (
// //     <AuthProvider>
// //       <Tabs
// //         screenOptions={{
// //           headerShown: false,
// //           tabBarActiveTintColor: '#2196F3',
// //           tabBarInactiveTintColor: 'gray',
// //         }}
// //       >
// //         <Tabs.Screen
// //           name="Dashboard"
// //           options={{
// //             title: 'Accueil',
// //             tabBarIcon: ({ color, size }) => (
// //               <Ionicons name="home-outline" color={color} size={size} />
// //             ),
// //           }}
// //         />
// //         <Tabs.Screen
// //           name="MedicationList"
// //           options={{
// //             title: 'Médicaments',
// //             tabBarIcon: ({ color, size }) => (
// //               <Ionicons name="medkit-outline" color={color} size={size} />
// //             ),
// //           }}
// //         />
// //         <Tabs.Screen
// //           name="AddMedication"
// //           options={{
// //             title: 'Ajouter',
// //             tabBarIcon: ({ color, size }) => (
// //               <Ionicons name="add-circle-outline" color={color} size={size} />
// //             ),
// //           }}
// //         />
// //         <Tabs.Screen
// //           name="Reminders"
// //           options={{
// //             title: 'Rappels',
// //             tabBarIcon: ({ color, size }) => (
// //               <Ionicons name="alarm-outline" color={color} size={size} />
// //             ),
// //           }}
// //         />
// //         <Tabs.Screen
// //           name="auth/Login"
// //           options={{
// //             title: 'Profil',
// //             tabBarIcon: ({ color, size }) => (
// //               <Ionicons name="person-outline" color={color} size={size} />
// //             ),
// //           }}
// //         />
// //       </Tabs>
// //     </AuthProvider>
// //   );
// // }


// // app/(tabs)/_layout.tsx
// import React from 'react';
// import { Tabs } from 'expo-router';
// import { AntDesign, Ionicons } from '@expo/vector-icons';
// import theme from '../styles/theme';

// export default function TabsLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: theme.colors.primary,
//       }}
//     >
//       <Tabs.Screen
//         name="Dashboard"
//         options={{
//           title: 'Accueil',
//           tabBarIcon: ({ color, size }) => <AntDesign name="home" size={size} color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="MedicationList"
//         options={{
//           title: 'Médicaments',
//           tabBarIcon: ({ color, size }) => <Ionicons name="medkit-outline" size={size} color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="AddMedication"
//         options={{
//           title: '',
//           tabBarIcon: ({ color, size }) => <AntDesign name="pluscircleo" size={size} color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="Reminders"
//         options={{
//           title: 'Rappels',
//           tabBarIcon: ({ color, size }) => <Ionicons name="alarm-outline" size={size} color={color} />,
//         }}
//       />

//     </Tabs>
//   );
// }



import React from 'react';
import { Tabs } from 'expo-router';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import theme from '../styles/theme';

export default function TabsLayout() {
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
          title: 'Tableau de bord',
          tabBarIcon: ({ color, size }) => <Ionicons name="speedometer-outline" size={size} color={color} />,
        }}
      />

      {/* Médicaments */}
      <Tabs.Screen
        name="MedicationList"
        options={{
          title: 'Médicaments',
          tabBarIcon: ({ color, size }) => <Ionicons name="medkit-outline" size={size} color={color} />,
        }}
      />

      {/* Ajouter */}
      <Tabs.Screen
        name="AddMedication"
        options={{
          title: 'ajouter un medicament',
          tabBarIcon: ({ color, size }) => <AntDesign name="pluscircleo" size={size} color={color} />,
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

      {/* Se connecter */}
      <Tabs.Screen
        name="Login"
        options={{
          title: 'Se connecter',
          tabBarIcon: ({ color, size }) => <AntDesign name="login" size={size} color={color} />,
        }}
      />

      {/* S’inscrire */}
      <Tabs.Screen
        name="Register"
        options={{
          title: 'S’inscrire',
          tabBarIcon: ({ color, size }) => <AntDesign name="adduser" size={size} color={color} />,
        }}
      />
      {/* modifier un medicament */}
      <Tabs.Screen
        name="EditMedication"
        options={{
          title: 'Modifier',
          tabBarIcon: ({ color, size }) => <AntDesign name="edit" size={size} color={color} />,
        }}
      />
      {/* explore */}
      <Tabs.Screen
        name="Explore"
        options={{
          title: 'Explorer',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="explore" size={size} color={color} />),

        }}
      />
    </Tabs>
  );
}
