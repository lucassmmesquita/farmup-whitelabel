// src/navigation/ActionsNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ActionsScreen } from '@screens/actions/ActionsScreen';
import { ActionListScreen } from '@screens/actions/ActionListScreen';
import { ActionPlanDetailsScreen } from '@screens/actions/ActionPlanDetailsScreen';

const Stack = createStackNavigator();

export const ActionsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ActionsMain" component={ActionsScreen} />
      <Stack.Screen name="ActionList" component={ActionListScreen} />
      <Stack.Screen name="ActionPlanDetails" component={ActionPlanDetailsScreen} />
    </Stack.Navigator>
  );
};

export default ActionsNavigator;