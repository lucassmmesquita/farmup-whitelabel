// src/config/theme/themeConfig.ts
import { defaultTheme, ThemeType } from './defaultTheme';

// Tente importar os placeholders, mas tenha um fallback caso não exista
let logoPlaceholders: any = { default: null, clientA: null, clientB: null };
try {
  // Importação dinâmica para evitar erros caso o arquivo não exista
  logoPlaceholders = require('../../assets/placeholders').logoPlaceholders;
} catch (e) {
  console.warn('Arquivo de placeholders não encontrado. Usando null para logos.');
}

export interface ClientConfig {
  name: string;
  logoUrl: any; // Tipo any para aceitar tanto string quanto require()
  theme: Partial<ThemeType>;
}

// Exemplos de configurações para clientes diferentes
export const clientConfigs: Record<string, ClientConfig> = {
  default: {
    name: 'FarmApp',
    // Use o placeholder se disponível, ou null caso contrário
    logoUrl: logoPlaceholders.default,
    theme: defaultTheme
  },
  clientA: {
    name: 'Saúde Farma',
    logoUrl: logoPlaceholders.clientA,
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
    logoUrl: logoPlaceholders.clientB,
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