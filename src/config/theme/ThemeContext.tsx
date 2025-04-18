// src/config/theme/ThemeContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import { ThemeType, defaultTheme, mergeTheme, ClientConfig, clientConfigs, getClientConfig } from './index';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext<ThemeType>(defaultTheme);
export const ClientConfigContext = createContext<ClientConfig>(clientConfigs.default);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialClientId?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialClientId = 'default' 
}) => {
  const [theme, setTheme] = useState<ThemeType>(defaultTheme);
  const [clientConfig, setClientConfig] = useState<ClientConfig>(clientConfigs.default);
  
  const loadClientId = async () => {
    try {
      const storedClientId = await AsyncStorage.getItem('@FarmApp:clientId');
      const clientId = storedClientId || initialClientId;
      
      const config = getClientConfig(clientId);
      setClientConfig(config);
      setTheme(mergeTheme(clientId));
    } catch (error) {
      console.error('Error loading client configuration:', error);
    }
  };
  
  useEffect(() => {
    loadClientId();
  }, [initialClientId]);
  
  const updateClientId = async (clientId: string) => {
    try {
      await AsyncStorage.setItem('@FarmApp:clientId', clientId);
      const config = getClientConfig(clientId);
      setClientConfig(config);
      setTheme(mergeTheme(clientId));
    } catch (error) {
      console.error('Error updating client configuration:', error);
    }
  };
  
  const contextValue = {
    ...theme,
    updateClientId,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      <ClientConfigContext.Provider value={clientConfig}>
        {children}
      </ClientConfigContext.Provider>
    </ThemeContext.Provider>
  );
};