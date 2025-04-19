// src/navigation/ProfileNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileScreen } from '@screens/profile/ProfileScreen';

const Stack = createStackNavigator();

export const ProfileNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      {/* Outras telas relacionadas ao perfil podem ser adicionadas aqui */}
    </Stack.Navigator>
  );
};

export default ProfileNavigator;