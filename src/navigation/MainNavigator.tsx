// src/navigation/MainNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { View, Platform } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import styled from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

// Estilização para o ícone da tab - agora com melhor posicionamento
const TabIconContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const IconWrapper = styled(View)`
  align-items: center;
  justify-content: center;
`;

const IconBadge = styled(View)<{ focused: boolean }>`
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background-color: ${props => props.focused ? props.theme.colors.primary : 'transparent'};
  margin-top: 1px;
`;

// Custom Tab Bar Icon Component
const TabBarIcon = ({ focused, color, size, name }: { focused: boolean; color: string; size: number; name: keyof typeof Feather.glyphMap }) => {
  const theme = useTheme();
  
  return (
    <TabIconContainer>
      <IconWrapper>
        <Feather name={name} size={size} color={color} />
        <IconBadge focused={focused} theme={theme} />
      </IconWrapper>
    </TabIconContainer>
  );
};

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
  const insets = useSafeAreaInsets();
  
  // Em uma implementação real, isso viria do contexto de autenticação
  const userRole = 'manager'; // Mock - valores possíveis: 'admin', 'manager', 'operator', 'owner'
  
  // Verificação do perfil do usuário para mostrar ou não algumas tabs
  const showTeamTab = ['admin', 'manager', 'owner'].includes(userRole);
  
  // Calcular a altura ideal da TabBar considerando a área segura do dispositivo
  const tabBarHeight = Platform.OS === 'ios' ? 50 + insets.bottom : 58;

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
          
          return <TabBarIcon focused={focused} color={color} size={size} name={iconName} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.inactive,
        tabBarStyle: {
          height: tabBarHeight,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          paddingTop: 5,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
          backgroundColor: theme.colors.background,
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.fontFamily.medium,
          fontSize: 11,
          marginTop: 0,
          paddingTop: 0,
        },
        tabBarItemStyle: {
          paddingTop: 5,
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