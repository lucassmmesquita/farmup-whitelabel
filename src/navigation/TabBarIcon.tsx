// src/components/navigation/TabBarIcon.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { useTheme } from '@hooks/useTheme';

interface TabBarIconProps {
  name: keyof typeof Feather.glyphMap;
  color: string;
  size: number;
  focused: boolean;
}

const IconContainer = styled(View)<{ focused: boolean }>`
  align-items: center;
  justify-content: center;
  padding-top: ${props => props.theme.spacing.xs}px;
`;

const IconBadge = styled(View)<{ focused: boolean }>`
  width: 5px;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${props => props.focused ? props.theme.colors.primary : 'transparent'};
  margin-top: 4px;
`;

const TabBarIcon: React.FC<TabBarIconProps> = ({ name, color, size, focused }) => {
  const theme = useTheme();
  
  return (
    <IconContainer focused={focused} theme={theme}>
      <Feather name={name} size={size} color={color} />
      <IconBadge focused={focused} theme={theme} />
    </IconContainer>
  );
};

export default TabBarIcon;