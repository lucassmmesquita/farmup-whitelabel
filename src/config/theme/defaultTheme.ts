// src/config/theme/defaultTheme.ts
export const defaultTheme = {
    colors: {
      primary: '#4B9EFF',
      secondary: '#6C63FF',
      accent: '#FF5678',
      background: '#FFFFFF',
      card: '#F8F9FA',
      text: '#1A1A1A',
      subtext: '#6E6E6E',
      border: '#E1E1E1',
      notification: '#FF3B30',
      success: '#34C759',
      warning: '#FFC107',
      error: '#FF3B30',
      inactive: '#BDBDBD'
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48
    },
    typography: {
      fontFamily: {
        regular: 'Poppins_400Regular',
        medium: 'Poppins_500Medium',
        semiBold: 'Poppins_600SemiBold',
        bold: 'Poppins_700Bold'
      },
      fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32
      }
    },
    roundness: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      full: 9999
    },
    shadows: {
      light: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
      },
      medium: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
      },
      strong: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 7,
      }
    }
  };
  
  export type ThemeType = typeof defaultTheme;