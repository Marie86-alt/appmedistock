// // app/index.tsx

// import { useRouter } from 'expo-router';
// import { useEffect, useContext } from 'react';
// import AuthContext from '../contexts/AuthContext';

// export default function App() {
//   const router = useRouter();
//   const { isAuthenticated } = useContext(AuthContext);

//   useEffect(() => {
//     if (!isAuthenticated) {
//       router.replace('/auth/LoginScreen');
//     } else {
//       router.replace('/auth/RegisterScreen'); // Replace with a valid path
//     }
//   }, [isAuthenticated, router]);

//   return null; // Rendu conditionnel géré par le contexte
// }

import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack 
        screenOptions={{ 
          headerShown: false 
        }}
      />
    </AuthProvider>
  );
}