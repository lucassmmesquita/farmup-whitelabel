// src/components/common/KPIBox.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import styled from 'styled-components/native';
import { useTheme } from '@hooks/useTheme';
import { Feather } from '@expo/vector-icons';

interface KPIBoxProps {
  title: string;
  value: string | number;
  icon?: keyof typeof Feather.glyphMap;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onPress?: () => void;
}

const Container = styled(View)`
  padding: ${props => props.theme.spacing.md}px;
`;

const TitleText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.subtext};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const ValueText = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.bold};
  font-size: ${props => props.theme.typography.fontSize.xxl}px;
  color: ${props => props.theme.colors.text};
  margin-top: ${props => props.theme.spacing.xs}px;
`;

const HeaderRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const IconContainer = styled(View)`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${props => `${props.theme.colors.primary}15`};
  justify-content: center;
  align-items: center;
`;

const TrendContainer = styled(View)<{ trend: 'up' | 'down' | 'neutral' }>`
  flex-direction: row;
  align-items: center;
  margin-top: ${props => props.theme.spacing.sm}px;
  padding: ${props => `${props.theme.spacing.xs}px ${props.theme.spacing.sm}px`};
  border-radius: ${props => props.theme.roundness.sm}px;
  align-self: flex-start;
  background-color: ${props => {
    switch (props.trend) {
      case 'up': return `${props.theme.colors.success}15`;
      case 'down': return `${props.theme.colors.error}15`;
      default: return `${props.theme.colors.inactive}15`;
    }
  }};
`;

const TrendText = styled(Text)<{ trend: 'up' | 'down' | 'neutral' }>`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => {
    switch (props.trend) {
      case 'up': return props.theme.colors.success;
      case 'down': return props.theme.colors.error;
      default: return props.theme.colors.subtext;
    }
  }};
  margin-left: ${props => props.theme.spacing.xs}px;
`;

export const KPIBox: React.FC<KPIBoxProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  onPress,
}) => {
  const theme = useTheme();
  
  return (
    <Card elevation="light" padding={false} style={{ flex: 1 }}>
      <Container theme={theme}>
        <HeaderRow theme={theme}>
          <TitleText theme={theme}>{title}</TitleText>
          {icon && (
            <IconContainer theme={theme}>
              <Feather name={icon} size={20} color={theme.colors.primary} />
            </IconContainer>
          )}
        </HeaderRow>
        
        <ValueText theme={theme}>{value}</ValueText>
        
        {trend && trendValue && (
          <TrendContainer trend={trend} theme={theme}>
            <Feather 
              name={trend === 'up' ? 'arrow-up' : trend === 'down' ? 'arrow-down' : 'minus'} 
              size={12} 
              color={
                trend === 'up' 
                  ? theme.colors.success 
                  : trend === 'down' 
                    ? theme.colors.error 
                    : theme.colors.subtext
              } 
            />
            <TrendText trend={trend} theme={theme}>{trendValue}</TrendText>
          </TrendContainer>
        )}
      </Container>
    </Card>
  );
};