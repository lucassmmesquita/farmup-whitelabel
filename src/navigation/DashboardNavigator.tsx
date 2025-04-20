// src/navigation/DashboardNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HierarchyDashboardScreen from '@screens/dashboard/HierarchyDashboardScreen';
import IndicatorDetailsScreen from '@screens/dashboard/IndicatorDetailsScreen';
import { ActionListScreen } from '@screens/actions/ActionListScreen';
import { ActionPlanDetailsScreen } from '@screens/actions/ActionPlanDetailsScreen';

// Definição dos parâmetros de rota
export type DashboardStackParamList = {
  DashboardMain: undefined;
  IndicatorDetails: { indicator: any };
  ActionList: { indicatorId?: string };
  ActionPlanDetails: { actionId: string };
};

const Stack = createStackNavigator<DashboardStackParamList>();

export const DashboardNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardMain" component={HierarchyDashboardScreen} />
      <Stack.Screen 
        name="IndicatorDetails" 
        component={IndicatorDetailsScreen}
        // Garantir que a tela seja acessível corretamente
        options={{ headerShown: false }} 
      />
      <Stack.Screen name="ActionList" component={ActionListScreen} />
      <Stack.Screen name="ActionPlanDetails" component={ActionPlanDetailsScreen} />
    </Stack.Navigator>
  );
};

export default DashboardNavigator;