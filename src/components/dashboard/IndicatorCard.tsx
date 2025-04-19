// src/components/dashboard/IndicatorCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { useTheme } from '@hooks/useTheme';
import { Indicator, IndicatorStatus } from '@/types/metrics';

interface IndicatorCardProps {
  indicator: Indicator;
  onPress: (indicator: Indicator) => void;
  size?: 'small' | 'medium' | 'large';
}

const getStatusColor = (status: IndicatorStatus, theme: any) => {
  switch (status) {
    case 'above': return theme.colors.success;
    case 'below': return theme.colors.error;
    default: return theme.colors.inactive;
  }
};

const getStatusIcon = (status: IndicatorStatus) => {
  switch (status) {
    case 'above': return 'trending-up';
    case 'below': return 'trending-down';
    default: return 'minus';
  }
};

const CardContainer = styled(TouchableOpacity)<{ status: IndicatorStatus; size: string; theme: any }>`
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.roundness.md}px;
  padding: ${props => {
    switch (props.size) {
      case 'small': return props.theme.spacing.sm;
      case 'large': return props.theme.spacing.lg;
      default: return props.theme.spacing.md;
    }
  }}px;
  border-left-width: 4px;
  border-left-color: ${props => getStatusColor(props.status, props.theme)};
  elevation: 2;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
`;

const CardHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const IndicatorName = styled(Text)<{ size: string }>`
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => {
    switch (props.size) {
      case 'small': return props.theme.typography.fontSize.sm;
      case 'large': return props.theme.typography.fontSize.lg;
      default: return props.theme.typography.fontSize.md;
    }
  }}px;
  color: ${props => props.theme.colors.text};
  max-width: 80%;
`;

const StatusBadge = styled(View)<{ status: IndicatorStatus }>`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${props => props.theme.spacing.sm}px;
  padding-vertical: ${props => props.theme.spacing.xs / 2}px;
  background-color: ${props => `${getStatusColor(props.status, props.theme)}15`};
  border-radius: ${props => props.theme.roundness.full}px;
`;

const StatusText = styled(Text)<{ status: IndicatorStatus }>`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => getStatusColor(props.status, props.theme)};
  margin-left: ${props => props.theme.spacing.xs}px;
`;

const CardContent = styled(View)`
  margin-top: ${props => props.theme.spacing.sm}px;
`;

const MetricRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${props => props.theme.spacing.xs}px;
`;

const MetricLabel = styled(Text)`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.subtext};
`;

const MetricValue = styled(Text)<{ size: string }>`
  font-family: ${props => props.theme.typography.fontFamily.bold};
  font-size: ${props => {
    switch (props.size) {
      case 'small': return props.theme.typography.fontSize.md;
      case 'large': return props.theme.typography.fontSize.xl;
      default: return props.theme.typography.fontSize.lg;
    }
  }}px;
  color: ${props => props.theme.colors.text};
`;

const VariationText = styled(Text)<{ status: IndicatorStatus }>`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => getStatusColor(props.status, props.theme)};
`;

const PrimaryIndicatorBadge = styled(View)`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${props => props.theme.colors.accent};
  padding-horizontal: ${props => props.theme.spacing.xs}px;
  padding-vertical: 2px;
  border-top-right-radius: ${props => props.theme.roundness.md}px;
  border-bottom-left-radius: ${props => props.theme.roundness.md}px;
`;

const PrimaryIndicatorText = styled(Text)`
  color: white;
  font-size: 8px;
  font-family: ${props => props.theme.typography.fontFamily.medium};
`;

export const IndicatorCard: React.FC<IndicatorCardProps> = ({
  indicator,
  onPress,
  size = 'medium'
}) => {
  const theme = useTheme();
  
  return (
    <CardContainer 
      onPress={() => onPress(indicator)}
      status={indicator.status}
      size={size}
      theme={theme}
    >
      {indicator.isPrimary && (
        <PrimaryIndicatorBadge theme={theme}>
          <PrimaryIndicatorText theme={theme}>PRIMÁRIO</PrimaryIndicatorText>
        </PrimaryIndicatorBadge>
      )}
      
      <CardHeader theme={theme}>
        <IndicatorName size={size} theme={theme} numberOfLines={1}>
          {indicator.name}
        </IndicatorName>
        
        <StatusBadge status={indicator.status} theme={theme}>
          <Feather 
            name={getStatusIcon(indicator.status)} 
            size={12} 
            color={getStatusColor(indicator.status, theme)} 
          />
          <StatusText status={indicator.status} theme={theme}>
            {indicator.status === 'above' ? 'Acima' : indicator.status === 'below' ? 'Abaixo' : 'Neutro'}
          </StatusText>
        </StatusBadge>
      </CardHeader>
      
      <CardContent theme={theme}>
        <MetricRow theme={theme}>
          <MetricLabel theme={theme}>Realizado</MetricLabel>
          <MetricValue size={size} theme={theme}>{indicator.formattedValue}</MetricValue>
        </MetricRow>
        
        <MetricRow theme={theme}>
          <MetricLabel theme={theme}>Meta</MetricLabel>
          <MetricValue size={size} theme={theme}>{indicator.formattedTarget}</MetricValue>
        </MetricRow>
        
        <MetricRow theme={theme}>
          <MetricLabel theme={theme}>Variação</MetricLabel>
          <VariationText status={indicator.status} theme={theme}>
            <Feather 
              name={getStatusIcon(indicator.status)} 
              size={12} 
              color={getStatusColor(indicator.status, theme)} 
            /> {indicator.variation}
          </VariationText>
        </MetricRow>
      </CardContent>
    </CardContainer>
  );
};

export default IndicatorCard;