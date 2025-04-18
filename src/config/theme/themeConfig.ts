// src/config/theme/themeConfig.ts
import { defaultTheme, ThemeType } from './defaultTheme';

export interface ClientConfig {
  name: string;
  logoUrl: string;
  theme: Partial<ThemeType>;
}

// Exemplos de configurações para clientes diferentes
export const clientConfigs: Record<string, ClientConfig> = {
  default: {
    name: 'FarmApp',
    logoUrl: require('@assets/logos/default-logo.png'),
    theme: defaultTheme
  },
  clientA: {
    name: 'Saúde Farma',
    logoUrl: require('@assets/logos/client-a-logo.png'),
    theme: {
      colors: {
        ...defaultTheme.colors,
        primary: '#27AE60',
        secondary: '#2ECC71',
        accent: '#F39C12'
      }
    }
  },
  clientB: {
    name: 'Vida Farma',
    logoUrl: require('@assets/logos/client-b-logo.png'),
    theme: {
      colors: {
        ...defaultTheme.colors,
        primary: '#8E44AD',
        secondary: '#9B59B6',
        accent: '#E74C3C'
      }
    }
  }
};

export const getClientConfig = (clientId: string): ClientConfig => {
  return clientConfigs[clientId] || clientConfigs.default;
};

export const mergeTheme = (clientId: string): ThemeType => {
  const clientConfig = getClientConfig(clientId);
  return {
    ...defaultTheme,
    ...clientConfig.theme,
    colors: {
      ...defaultTheme.colors,
      ...(clientConfig.theme.colors || {})
    }
  };
};