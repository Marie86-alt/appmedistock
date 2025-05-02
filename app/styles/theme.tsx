// src/styles/theme.ts
const theme = {
    colors: {
      primary: '#2196F3',      // Bleu principal
      secondary: '#4CAF50',    // Vert pour les actions secondaires
      background: '#F5F5F5',   // Fond gris clair
      surface: '#FFFFFF',      // Surfaces blanches (cartes, etc.)
      error: '#F44336',        // Rouge pour les erreurs
      text: '#212121',         // Texte primaire (presque noir)
      textSecondary: '#757575', // Texte secondaire (gris)
      border: '#E0E0E0',       // Bordures
      disabled: '#BDBDBD', // Add a disabled color
    },
    spacing: {
      xs: 4,
      s: 8,
      m: 16,
      l: 24,
      xl: 32,
    },
    typography: {
      fontSizes: {
        small: 12,
        medium: 14,
        large: 16,
        xlarge: 18,
        xxlarge: 22,
        title: 28,
      },
    },
    borderRadius: {
      small: 4,
      medium: 8,
      large: 16,
    },
  };

  export default theme;
