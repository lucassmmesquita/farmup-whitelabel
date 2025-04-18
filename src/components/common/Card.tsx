// src/components/common/Card.tsx
import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevation?: 'none' | 'light' | 'medium' | 'strong';
  padding?: boolean;
}

const CardContainer = styled(View)<{
  elevation: 'none' | 'light' | 'medium' | 'strong';
  padding: boolean;
  theme: any;
}>`
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.roundness.md}px;
  padding: ${props => (props.padding ? props.theme.spacing.md : 0)}px;
  overflow: hidden;
  
  /* Shadow styles based on elevation */
  ${props => {
    if (props.elevation === 'none') return '';
    return `
      shadow-color: ${props.theme.shadows[props.elevation].shadowColor};
      shadow-offset: ${props.theme.shadows[props.elevation].shadowOffset.width}px ${props.theme.shadows[props.elevation].shadowOffset.height}px;
      shadow-opacity: ${props.theme.shadows[props.elevation].shadowOpacity};
      shadow-radius: ${props.theme.shadows[props.elevation].shadowRadius}px;
      elevation: ${props.theme.shadows[props.elevation].elevation};
    `;
  }}
`;

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevation = 'medium',
  padding = true,
}) => {
  const theme = useTheme();
  
  return (
    <CardContainer
      elevation={elevation}
      padding={padding}
      style={style}
      theme={theme}
    >
      {children}
    </CardContainer>
  );
};