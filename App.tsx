// App.tsx
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigation } from '@navigation/index';
import { ThemeProvider } from '@config/theme/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { loadAsync } from 'expo-font';
import { 
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text } from 'react-native';
import { analyticsService } from '@services/analytics/analyticsService';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [initialClientId, setInitialClientId] = useState('default');
  
  useEffect(() => {
    // Carregar as fontes necessárias
    const loadFonts = async () => {
      try {
        await loadAsync({
          Poppins_400Regular,
          Poppins_500Medium,
          Poppins_600SemiBold,
          Poppins_700Bold,
        });
        
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        // Fallback: ainda permitir que o app carregue mesmo se as fontes falharem
        setFontsLoaded(true);
      }
    };
    
    // Carregar ID do cliente salvo
    const loadClientId = async () => {
      try {
        const clientId = await AsyncStorage.getItem('@FarmApp:clientId');
        if (clientId) {
          setInitialClientId(clientId);
        }
      } catch (error) {
        console.error('Error loading client ID:', error);
      }
    };
    
    // Inicializar analytics
    const initAnalytics = async () => {
      await analyticsService.initialize('amplitude', { key: 'your-amplitude-api-key' });
      analyticsService.trackEvent({ name: 'app_launched' });
    };
    
    loadFonts();
    loadClientId();
    initAnalytics();
  }, []);
  
  if (!fontsLoaded) {
    // Tela de carregamento muito simples enquanto as fontes não estão carregadas
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando...</Text>
      </View>
    );
  }
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider initialClientId={initialClientId}>
          <StatusBar style="dark" />
          <AppNavigation />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}