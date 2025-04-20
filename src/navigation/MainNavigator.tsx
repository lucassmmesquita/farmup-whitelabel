// src/navigation/MainNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { View } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import styled from 'styled-components/native';

// Importar navegadores e telas
import { DashboardScreen } from '@screens/dashboard/DashboardScreen';
import { DashboardNavigator } from './DashboardNavigator';
import { ActionsScreen } from '@screens/actions/ActionsScreen';
import { ActionListScreen } from '@screens/actions/ActionListScreen';
import { ActionPlanDetailsScreen } from '@screens/actions/ActionPlanDetailsScreen';
import { ProfileScreen } from '@screens/profile/ProfileScreen';
import SellersListScreen from '@screens/sellers/SellersListScreen';
import SellerDetailsScreen from '@screens/sellers/SellerDetailsScreen';
import HierarchyDashboardScreen from '@screens/dashboard/HierarchyDashboardScreen';

import { CommonActions } from '@react-navigation/native';

// Stack Navigators
const OriginalDashboardStack = createStackNavigator();
const DiagnosticStack = createStackNavigator();
const TeamStack = createStackNavigator();
const ActionsStack = createStackNavigator();
const ProfileStack = createStackNavigator();

// Estilização para o ícone da tab
const IconBadge = styled(View)<{ focused: boolean }>`
  width: 5px;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${props => props.focused ? props.theme.colors.primary : 'transparent'};
  margin-top: 4px;
`;

const IconContainer = styled(View)`
  align-items: center;
  justify-content: center;
`;

// Stack Navigator para o Dashboard Original (com indicadores e análise de desempenho)
const OriginalDashboardTabNavigator = () => (
  <OriginalDashboardStack.Navigator screenOptions={{ headerShown: false }}>
    <OriginalDashboardStack.Screen name="DashboardMain" component={DashboardScreen} />
    <OriginalDashboardStack.Screen name="SellersList" component={SellersListScreen} />
    <OriginalDashboardStack.Screen name="SellerDetails" component={SellerDetailsScreen} />
    <OriginalDashboardStack.Screen name="ActionPlanDetails" component={ActionPlanDetailsScreen} />
  </OriginalDashboardStack.Navigator>
);

// Stack Navigator para o novo Diagnóstico (que é o atual Dashboard)
const DiagnosticTabNavigator = () => {
  const navigationRef = React.useRef(null);

  return (
    <DiagnosticStack.Navigator 
      screenOptions={{ headerShown: false }}
      // Adicione a referência aqui
      ref={navigationRef}
    >
      <DiagnosticStack.Screen name="DiagnosticMain" component={DashboardNavigator} />
    </DiagnosticStack.Navigator>
  );
};

// Stack Navigator para Equipe
const TeamTabNavigator = () => (
  <TeamStack.Navigator screenOptions={{ headerShown: false }}>
    <TeamStack.Screen name="SellersList" component={SellersListScreen} />
    <TeamStack.Screen name="SellerDetails" component={SellerDetailsScreen} />
    <TeamStack.Screen name="ActionPlanDetails" component={ActionPlanDetailsScreen} />
  </TeamStack.Navigator>
);

// Stack Navigator para Ações
const ActionsTabNavigator = () => (
  <ActionsStack.Navigator screenOptions={{ headerShown: false }}>
    <ActionsStack.Screen name="ActionsMain" component={ActionsScreen} />
    <ActionsStack.Screen name="ActionList" component={ActionListScreen} />
    <ActionsStack.Screen name="ActionPlanDetails" component={ActionPlanDetailsScreen} />
  </ActionsStack.Navigator>
);

// Stack Navigator para Perfil
const ProfileTabNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

// Definição do Bottom Tab Navigator
const Tab = createBottomTabNavigator();

export const MainNavigator: React.FC = () => {
  const theme = useTheme();
  
  // Em uma implementação real, isso viria do contexto de autenticação
  const userRole = 'manager'; // Mock - valores possíveis: 'admin', 'manager', 'operator', 'owner'
  
  // Verificação do perfil do usuário para mostrar ou não algumas tabs
  const showTeamTab = ['admin', 'manager', 'owner'].includes(userRole);
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Feather.glyphMap = 'home';
          
          if (route.name === 'Dashboard') {
            iconName = 'grid';
          } else if (route.name === 'Diagnostic') {
            iconName = 'activity';
          } else if (route.name === 'Team') {
            iconName = 'users';
          } else if (route.name === 'Actions') {
            iconName = 'check-square';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }
          
          return (
            <IconContainer>
              <Feather name={iconName} size={size} color={color} />
              <IconBadge focused={focused} theme={theme} />
            </IconContainer>
          );
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.inactive,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.fontFamily.medium,
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={OriginalDashboardTabNavigator} 
        options={{ tabBarLabel: 'Dashboard' }}
      />
      
      <Tab.Screen 
        name="Diagnostic" 
        component={DiagnosticTabNavigator} 
        options={{ tabBarLabel: 'Diagnóstico' }}
      />
      
      {showTeamTab && (
        <Tab.Screen 
          name="Team" 
          component={TeamTabNavigator} 
          options={{ tabBarLabel: 'Equipe' }}
        />
      )}
      
      <Tab.Screen 
        name="Actions" 
        component={ActionsTabNavigator}
        options={{ tabBarLabel: 'Ações' }}
      />
      
      <Tab.Screen 
        name="Profile" 
        component={ProfileTabNavigator}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;