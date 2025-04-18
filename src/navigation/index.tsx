// src/navigation/index.tsx
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoadingScreen } from '@screens/common/LoadingScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Loading: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigation: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Verificar se o usuário está autenticado
    const checkAuthentication = async () => {
      try {
        const token = await AsyncStorage.getItem('@FarmApp:token');
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        // Simular carregamento inicial
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    };
    
    checkAuthentication();
  }, []);
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};