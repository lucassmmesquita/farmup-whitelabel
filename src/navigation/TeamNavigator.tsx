// src/navigation/TeamNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SellersListScreen from '@screens/sellers/SellersListScreen';
import SellerDetailsScreen from '@screens/sellers/SellerDetailsScreen';
import { ActionPlanDetailsScreen } from '@screens/actions/ActionPlanDetailsScreen';

const Stack = createStackNavigator();

export const TeamNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SellersList" component={SellersListScreen} />
      <Stack.Screen name="SellerDetails" component={SellerDetailsScreen} />
      <Stack.Screen name="ActionPlanDetails" component={ActionPlanDetailsScreen} />
    </Stack.Navigator>
  );
};

export default TeamNavigator;