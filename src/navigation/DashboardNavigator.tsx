// src/navigation/DashboardNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HierarchyDashboardScreen from '@screens/dashboard/HierarchyDashboardScreen';
import IndicatorDetailsScreen from '@screens/dashboard/IndicatorDetailsScreen';

const Stack = createStackNavigator();

export const DashboardNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardMain" component={HierarchyDashboardScreen} />
      <Stack.Screen name="IndicatorDetails" component={IndicatorDetailsScreen} />
    </Stack.Navigator>
  );
};

export default DashboardNavigator;