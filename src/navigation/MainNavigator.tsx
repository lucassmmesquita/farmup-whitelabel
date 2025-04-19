// src/navigation/MainNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { DashboardScreen } from '@screens/dashboard/DashboardScreen';
import { NotificationsScreen } from '@screens/notifications/NotificationsScreen';
import { ActionsScreen } from '@screens/actions/ActionsScreen';
import { ProfileScreen } from '@screens/profile/ProfileScreen';
import { DashboardNavigator } from './DashboardNavigator';
import { ActionListScreen } from '@screens/actions/ActionListScreen';
import { ActionPlanDetailsScreen } from '@screens/actions/ActionPlanDetailsScreen';
import { useTheme } from '@hooks/useTheme';

// Stack navigators para cada tab
const OriginalDashboardStack = createStackNavigator();
const NotificationsStack = createStackNavigator();
const ActionsStack = createStackNavigator();
const ProfileStack = createStackNavigator();

// Stack Navigator para o Dashboard Original
const OriginalDashboardNavigator = () => (
  <OriginalDashboardStack.Navigator screenOptions={{ headerShown: false }}>
    <OriginalDashboardStack.Screen name="DashboardMain" component={DashboardScreen} />
    {/* Adicione outras telas relacionadas ao Dashboard aqui */}
  </OriginalDashboardStack.Navigator>
);

// Stack Navigator para Notificações
const NotificationsNavigator = () => (
  <NotificationsStack.Navigator screenOptions={{ headerShown: false }}>
    <NotificationsStack.Screen name="NotificationsMain" component={NotificationsScreen} />
    {/* Adicione outras telas relacionadas às Notificações aqui */}
  </NotificationsStack.Navigator>
);

// Stack Navigator para Ações
const ActionsNavigator = () => (
  <ActionsStack.Navigator screenOptions={{ headerShown: false }}>
    <ActionsStack.Screen name="ActionsMain" component={ActionsScreen} />
    <ActionsStack.Screen name="ActionList" component={ActionListScreen} />
    <ActionsStack.Screen name="ActionPlanDetails" component={ActionPlanDetailsScreen} />
  </ActionsStack.Navigator>
);

// Stack Navigator para Perfil
const ProfileNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
    {/* Adicione outras telas relacionadas ao Perfil aqui */}
  </ProfileStack.Navigator>
);

// Definição do Tab Navigator principal
const Tab = createBottomTabNavigator();

export const MainNavigator: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Feather.glyphMap = 'home';
          
          if (route.name === 'Dashboard') {
            iconName = 'grid';
          } else if (route.name === 'Diagnostico') {
            iconName = 'activity';
          } else if (route.name === 'Notifications') {
            iconName = 'bell';
          } else if (route.name === 'Actions') {
            iconName = 'trending-up';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }
          
          return <Feather name={iconName} size={size} color={color} />;
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
        component={OriginalDashboardNavigator} 
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Diagnostico" 
        component={DashboardNavigator} 
        options={{ tabBarLabel: 'Diagnóstico' }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsNavigator}
        options={{ tabBarLabel: 'Notificações' }}
      />
      <Tab.Screen 
        name="Actions" 
        component={ActionsNavigator}
        options={{ tabBarLabel: 'Ações' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileNavigator}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};